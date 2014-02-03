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
      <div>
        <div className="row header">
          <div className="col-xs-12 col-sm-12">
            <h2>Ryhdy pysäkin <span>{context.name}</span> kummiksi!</h2>
          </div>
        </div>

        <form role="form" id="adopt-form" onSubmit={this.submitAdopt}>
          <fieldset>
            <div className="form-inline form-group">
              <div className="form-group">
                <label htmlFor="firstname">Etunimi</label>
                <input type="text" id="firstname" name="firstname" className="form-control" 
                  required autofocus="autofocus" value={this.state.firstname}
                  onChange={this.onChange} />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Sukunimi</label>
                <input type="text" id="lastname" name="lastname" className="form-control" 
                required value={this.state.lastname} onChange={this.onChange} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Sähköposti</label>
              <input type="email" id="email" className="form-control"
               required value={this.state.email} onChange={this.onChange} />
            </div>

            <button id="send-adopt" type="submit" className="btn btn-default">
              Ryhdy kummiksi
            </button>
          </fieldset>
        </form>
      </div>
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