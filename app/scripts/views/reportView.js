/** @jsx React.DOM */

'use strict';

require('react.backbone');
var Report = require('../models/report');
var StopNameView = require('./stop/stopNameView');

var ReportView = React.createBackboneClass({
  changeOptions: 'change:code',
  render: function() {
    var context = {};
    context = this.getModel().toJSON();
    if (context.name === null && context.name_fi !== null) {
      context.name = context.name_fi;
      context.address = context.address_fi;
      context.city = context.city_fi;
    }
    context.services = this.getServices();  
  
    return (
      React.DOM.div(null, 
        React.DOM.div( {id:"report-stop-name", className:"row"}, 
          StopNameView( {model:this.getModel()} )
        ),
        React.DOM.form( {role:"form", id:"report-form", onSubmit:this.sendReport}, 
          React.DOM.fieldset(null, 
            React.DOM.p(null, "Valitse vaihtoehdoista sopivin ja kuvaile ongelmaa muutamalla sanalla."),
            React.DOM.div( {className:"form-group"}, 
              React.DOM.label( {htmlFor:"service_code_201"}, "Ongelma"),
              context.services.map(function(service) {
                return (
                  React.DOM.div( {className:"radio"}, 
                    React.DOM.label(null, 
                      React.DOM.input( {type:"radio", name:"service-code", id:'service-'+service.id, value:service.id} ),
                      service.name
                    )
                  )
                );
              })
            ),

            React.DOM.div( {className:"form-group"}, 
              React.DOM.label( {htmlFor:"description"}, "Mikä on pielessä?"),
              React.DOM.textarea( {name:"description", id:"description", className:"form-control", rows:"3", onKeyUp:this.updateCharCount}),
              
              React.DOM.span( {className:this.state.characters<10?'help-block':'hidden', id:"char-count"}, 
                this.state.characters < 9 ? 'Kirjoita vielä '+(10-this.state.characters)+' merkkiä': '',
                this.state.characters === 9 ? 'Kirjoita vielä 1 merkki' : ''
              )
            ),

            React.DOM.div( {className:"form-group hidden"}, 
              React.DOM.label( {htmlFor:"image-picker"}, "Ota kuva"),
              React.DOM.input( {id:"image-picker", type:"file", accept:"image/*"} )
            ),

            React.DOM.p(null, "Tarvitsemme myös nimesi. Anna lisäksi sähköpostiosoitteesi, jos haluat kuittauksen kun olemme käsitelleet ilmoituksesi."),

            React.DOM.div( {className:"form-inline form-group"}, 
              React.DOM.div( {className:"form-group"}, 
                React.DOM.label( {htmlFor:"firstname"}, "Etunimi"),
                React.DOM.input( {type:"text", id:"firstname", name:"firstname", className:"form-control", required:true} )
              ),
              React.DOM.div( {className:"form-group"}, 
                React.DOM.label( {htmlFor:"lastname"}, "Sukunimi"),
                React.DOM.input( {type:"text", id:"lastname", name:"lastname", className:"form-control", required:true} )
              )
            ),

            React.DOM.div( {className:"form-group"}, 
              React.DOM.label( {htmlFor:"email"}, "Sähköposti (jos haluat kuittauksen)"),
              React.DOM.input( {type:"email", id:"email", className:"form-control"} )
            ),

            React.DOM.div( {className:"form-group"}, 
              React.DOM.button( {id:"send-report", type:"submit", className:"btn btn-default", disabled:this.state.characters < 10?'disabled':''}, 
                " Lähetä "
              )
            )
          )
        ),

        React.DOM.div( {id:"report-sent", className:"hidden"}, 
          React.DOM.p( {className:"text-success"}, "Kiitos! Viestisi on lähetetty."),
          React.DOM.button( {type:"button", className:"btn btn-default", onClick:this.goBack}, 
            " Takaisin "
          )
        ),

        React.DOM.div( {id:"report-error", className:"hidden"}, 
          React.DOM.p( {className:"text-warning"}, "Viestin lähettäminen epäonnistui."),
          React.DOM.button( {type:"button", className:"btn btn-default", onClick:this.goBack}, 
            " Takaisin "
          )
        )
      )
    );
  },
  getServices: function() {
    var services;
    if (true) {
      services = [
        {id: '201', name: 'Ilkivalta'},
        {id: '172', name: 'Roskaaminen'},
        {id: '177', name: 'Töhryjen poisto'},
        {id: '203', name: 'Kyltit ja opasteet'},
        {id: '207', name: 'Muu korjattava asia'}
      ];
    } else {
      services = [
        {id: '172', name: 'Ilkivalta'},
        {id: '246', name: 'Roskaaminen'},
        {id: '176', name: 'Töhryjen poisto'},
        {id: '199', name: 'Kyltit ja opasteet'},
        {id: '180', name: 'Muu korjattava asia'}
      ];
    }
    return services;
  },
  getInitialState: function() {
    return {description: '', characters: 0};
  },
  updateCharCount: function(event) {
    var description = event.target.value;
    var characters = description.trim().length;
    
    this.setState({description: description, characters: characters});
  },
  sendReport: function(event) {
    console.log('sendReport');
    var report = new Report();
    
    var description = this.state.description;
    var service_code = $('input[name=service-code]:checked').val();
    var code = this.getModel().get('code');
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var email = $('#email').val();

    report.set({
      description: description,
      service_code: ''+service_code,
      code: ''+code,
      first_name: firstname,
      last_name: lastname,
      email: email
    });
    
    if (this.getModel().get('wgs_coords') !== undefined &&
      this.getModel().get('wgs_coords') !== null) {
      console.log('setWgsCoords '+this.getModel().get('wgs_coords'));
      report.setWgsCoords(this.getModel().get('wgs_coords'));
    } else if (this.getModel().get('coords') !== undefined &&
      this.getModel().get('coords') !== null) {
      console.log('setXYCoords '+this.getModel().get('coords'));
      report.setCoords(this.getModel().get('coords'));
    } else {
      console.warn('coords not found', this.getModel());
    }
    report.save({}, {error: _.bind(this.onSaveError, this)});
    this.onSaveSuccess();
    event.preventDefault();
    return false;
  },
  onSaveError: function() {
    $('#report-sent').addClass('hidden');
    $('#report-error').removeClass('hidden');
  },
  onSaveSuccess: function() {
    $('#report-form').addClass('hidden');
    $('#report-sent').removeClass('hidden');
  },
  goBack: function() {
    appRouter.navigate('stop/'+this.getModel().get('code'), {trigger: true});
    return false;
  }
});

module.exports = ReportView;