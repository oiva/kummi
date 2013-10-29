define([
  'backbone',
  'hbs!tmpl/stop',
  'models/user',
  'views/reportsView',
  'views/stopNameView'
],

function(Backbone, Template, UserModel, ReportsCollectionView, StopNameView) {
  'use strict';

  return Backbone.Marionette.Layout.extend({
    template: Template,
    regions: {
      name: '#name',
      reports: '#stop-reports'
    },

    events: {
      'click #report-ok': 'reportOK',
      'click #report-problem': 'reportProblem',
      'click #adopt-stop': 'adoptStop',
      'click #adopt-send': 'adoptSend'
    },
    
    initialize: function() {
      console.log('stop view init');
      this.code = this.options.code;
      this.model = this.options.appModel.get('stop');
      
      this.listenTo(this.model.get('reports'), 'reset', this.onReports);
      this.listenTo(this.model.get('users'), 'reset', this.onUsers);
      this.listenTo(this.model, 'change:code', this.onChangeStop);
    },
    onChangeStop: function(stop) {
      console.log('stopView: stop '+stop.get('code')+' loaded', stop);
      if (stop.get('code') !== this.code && stop.get('code_short') !== this.code) {
        return;
      }
      this.model = stop;
      this.render();
      
      this.model.getReports();
      this.model.getUsers();
    },
    onRender: function() {
      var stopName = new StopNameView({model: this.model});
      this.name.show(stopName);
    },
    reportOK: function() {
      if (this.model === null) {
        return false;
      }
      this.model.reportOK();
      return false;
    },
    reportProblem: function() {
      if (this.model === null) {
        return false;
      }
      window.appRouter.navigate('report/'+this.model.get('code'), {trigger: true});
      return false;
    },
    onReports: function(collection) {
      var reportsCollectionView = new ReportsCollectionView({collection: collection});
      this.reports.show(reportsCollectionView);
    },
    onUsers: function(collection) {
      var _this = this;
      console.log('users', collection);
      var users = _.uniq(collection.models, false, function(user) {
        return user.get('email');
      });
      _.each(users, function(user) {
        _this.$('#stop-users').append('<p>'+user.get('email')+'</p>');
      });
    },
    adoptStop: function() {
      this.$('#adopt-form').removeClass('hidden');
      this.$('#adopt-stop').remove();
      return false;
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
});