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
    if (typeof this.getModel() !== 'undefined' && this.getModel().get('users').models.length > 0) {
      users = _.uniq(this.getModel().get('users').models, false, function(user) {
        return user.get('email');
      });
    }

    return (
      React.DOM.div(null, 
        React.DOM.div( {className:"row", id:"name"}, 
          StopNameView( {model:this.getModel()} )
        ),

        React.DOM.div( {className:"row", id:"stop-users-container"}, 
          React.DOM.div( {className:"col-xs-12 col-sm-12"}, 
            React.DOM.h3(null, "Pysäkin kummit"),
            React.DOM.div( {id:"stop-users"}, 
              users.map(function(user) {
                return React.DOM.p(null, user.get('email'));
              })
            )
          )
        ),

        React.DOM.div( {className:"row", id:"stop-report-status"}, 
          ReportLinkView( {model:this.getModel()} )
        ),
        React.DOM.div( {className:"row", id:"stop-reports-container"}, 
          ReportsCollectionView( {collection:this.getModel().get('reports')} )
        ),
        React.DOM.div( {className:"row", id:"stop-ask-adoption"}, 
          AskAdoptionView( {model:this.getModel()} )
        ),
        React.DOM.div( {className:"row", id:"stop-info-teaser"}, 
          InfoTeaserView(null )
        )
      )
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