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
    context.display_services = this.getDisplayServices();
  
    return (
      <div>
        <div id="report-stop-name" className="row">
          <StopNameView model={this.getModel()} />
        </div>
        <form role="form" id="report-form" onSubmit={this.sendReport}>
          <fieldset>
            <p>Valitse vaihtoehdoista sopivin ja kuvaile ongelmaa muutamalla sanalla.</p>
            <div className="form-group">
              <label htmlFor="service_code_201">Ongelma</label>
              {context.services.map(function(service) {
                return (
                  <div className="radio">
                    <label>
                      <input type="radio" name="service-code" id={'service-'+service.id} value={service.id} />
                      {service.name}
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="form-group">
              <h3>Onko pysäkillä aikataulunäyttö?</h3>
              <div className="checkbox">
                <label>
                  <input type="checkbox" name="has-display" id="has-display" checked={this.state.hasDisplay} onChange={this.hasDisplayChecked} />
                  Kyllä. Pysäkillä on aikataulunäyttö.
                </label>
              </div>
              <div className={this.state.hasDisplay?'':'hidden'} id="display-problems">
              {context.display_services.map(function(service) {
                return (
                  <div className="radio">
                    <label>
                      <input type="radio" name="service-code" id={'service-'+service.id} value={service.name} />
                      {service.name}
                    </label>
                  </div>
                );
              })}
              </div>
            </div>            

            <div className="form-group">
              <label htmlFor="description">Mikä on pielessä?</label>
              <textarea name="description" id="description" className="form-control" rows="3" onKeyUp={this.updateCharCount}></textarea>
              
              <span className={this.state.characters<10?'help-block':'hidden'} id="char-count">
                {this.state.characters < 9 ? 'Kirjoita vielä '+(10-this.state.characters)+' merkkiä': ''}
                {this.state.characters === 9 ? 'Kirjoita vielä 1 merkki' : ''}
              </span>
            </div>

            <div className="form-group hidden">
              <label htmlFor="image-picker">Ota kuva</label>
              <input id="image-picker" type="file" accept="image/*" />
            </div>

            <p>Tarvitsemme myös nimesi. Anna lisäksi sähköpostiosoitteesi, jos haluat kuittauksen kun olemme käsitelleet ilmoituksesi.</p>

            <div className="form-inline form-group">
              <div className="form-group">
                <label htmlFor="firstname">Etunimi</label>
                <input type="text" id="firstname" name="firstname" className="form-control" required />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Sukunimi</label>
                <input type="text" id="lastname" name="lastname" className="form-control" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Sähköposti (jos haluat kuittauksen)</label>
              <input type="email" id="email" className="form-control" />
            </div>

            <div className="form-group">
              <button id="send-report" type="submit" className="btn btn-default" disabled={this.state.characters < 10?'disabled':''}>
                Lähetä
              </button>
            </div>
          </fieldset>
        </form>

        <div id="report-sent" className="hidden">
          <p className="text-success">Kiitos! Viestisi on lähetetty.</p>
          <button type="button" className="btn btn-default" onClick={this.goBack}>
            Takaisin
          </button>
        </div>

        <div id="report-error" className="hidden">
          <p className="text-warning">Viestin lähettäminen epäonnistui.</p>
          <button type="button" className="btn btn-default" onClick={this.goBack}>
            Takaisin
          </button>
        </div>
      </div>
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
  getDisplayServices: function() {
    var services = [
      {id: '1', name: 'Näyttö ei ole päällä'},
      {id: '2', name: 'Näytössä on virheviesti'},
      {id: '3', name: 'Näyttö näyttää vääriä aikatauluja'}
    ];
    return services;
  },
  getInitialState: function() {
    return {description: '', characters: 0, hasDisplay: false};
  },
  updateCharCount: function(event) {
    var description = event.target.value;
    var characters = description.trim().length;
    
    this.setState({description: description, characters: characters});
  },
  hasDisplayChecked: function(event) {
    console.log('hasDisplayChecked');
    this.setState({hasDisplay: event.target.checked});
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
    var has_display = $('input#has-display').is(':checked');
    var display_problem = $('input[name=service-code]:checked').val();

    report.set({
      description: description,
      service_code: ''+service_code,
      code: ''+code,
      first_name: firstname,
      last_name: lastname,
      email: email,
      has_display: has_display,
      display_problem: display_problem
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