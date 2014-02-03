/** @jsx React.DOM */

'use strict';
require('react.backbone');

var UserModel = require('../models/user');
var InfoTeaserView = require('./infoTeaserView');
var AskAdoptionView = require('./stop/askAdoption');
var ReportsCollectionView = require('./stop/reportsView');
var ReportLinkView = require('./stop/reportLinkView');
var StopNameView = require('./stop/stopNameView');

var StopView = React.createBackboneClass({
  
  render: function() {
    var users = [];
    if (typeof this.getModel() !== 'undefined') {
      users = _.uniq(this.getModel().get('users').models, false, function(user) {
        return user.get('email');
      });
    }

    return (
      <div>
        <div class="row" id="name">
          <StopNameView model={this.getModel()} />
        </div>

        <div class="row" id="stop-users-container" style="display: none">
          <div class="col-xs-12 col-sm-12">
            <h3>Pysäkin kummit</h3>
            <div id="stop-users">
              {users.map(function(user) {
                return <p>'+user.get('email')+'</p>;
              })}
            </div>
          </div>
        </div>
        <div class="row" id="stop-report-status">
          <ReportLinkView model={this.getModel()} />
        </div>
        <div class="row" id="stop-reports-container">
          <ReportsCollectionView collection={this.getModel().get('reports')} />
        </div>
        <div class="row" id="stop-ask-adoption">
          <AskAdoptionView model={this.getModel()} />
        </div>
        <div class="row" id="stop-info-teaser">
          <InfoTeaserView />
        </div>
      </div>
    );
  },

  adoptSend: function() {
    var email = this.$('#email').val();
    var user = new UserModel({email: email, code: this.model.get('code')});
    user.save();
    this.$('#adopt-form').html('<p class="text-success">Olet nyt pysäkin kummi!</p>');
    return false;
  },
  userCreated: function() {
    console.log('user created');
  }
});

module.exports = StopView;