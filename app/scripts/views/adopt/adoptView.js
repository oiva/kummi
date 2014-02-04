/** @jsx React.DOM */

'use strict';

require('react.backbone');

var AdoptView = React.createBackboneClass({
  render: function() {
    var context = this.getModel().toJSON();
    if ((context.name === null || typeof context.name === 'undefined') && context.name_fi !== null) {
      context.name = context.name_fi;
    }

    return (
      React.DOM.div(null, 
        React.DOM.div( {className:"row header"}, 
          React.DOM.div( {className:"col-xs-12 col-sm-12"}, 
            React.DOM.h2(null, "Ryhdy pysäkin ", React.DOM.span(null, context.name), " kummiksi!")
          )
        ),

        React.DOM.form( {role:"form", id:"adopt-form", onSubmit:this.submitAdopt}, 
          React.DOM.fieldset(null, 
            React.DOM.div( {className:"form-inline form-group"}, 
              React.DOM.div( {className:"form-group"}, 
                React.DOM.label( {htmlFor:"firstname"}, "Etunimi"),
                React.DOM.input( {type:"text", id:"firstname", name:"firstname", className:"form-control", 
                  required:true, autofocus:"autofocus", value:this.state.firstname,
                  onChange:this.onChange} )
              ),
              React.DOM.div( {className:"form-group"}, 
                React.DOM.label( {htmlFor:"lastname"}, "Sukunimi"),
                React.DOM.input( {type:"text", id:"lastname", name:"lastname", className:"form-control", 
                required:true, value:this.state.lastname, onChange:this.onChange} )
              )
            ),
            React.DOM.div( {className:"form-group"}, 
              React.DOM.label( {htmlFor:"email"}, "Sähköposti"),
              React.DOM.input( {type:"email", id:"email", className:"form-control",
               required:true, value:this.state.email, onChange:this.onChange} )
            ),

            React.DOM.button( {id:"send-adopt", type:"submit", className:"btn btn-default"}, 
              " Ryhdy kummiksi "
            )
          )
        )
      )
    );
  },
  getInitialState: function() {
    return {
      firstname: '',
      lastname: '',
      email: ''
    };
  },
  submitAdopt: function() {
    var data = {
      fistName: this.state.fistname,
      lastName: this.state.lastname,
      email: this.state.email,
      stop: this.getModel().get('code')
    };
    console.log(data);
    return false;
  },
  onChange: function(event) {
    var input = $(event.currentTarget);
    var newState = {};
    newState[input.attr('id')] = input.val();
    this.setState(newState);
  }
});

module.exports = AdoptView;