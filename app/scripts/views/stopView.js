define([
  'backbone',
  'hbs!tmpl/stop',
  'collections/reports',
  'collections/users',
  'models/user',
  'views/reportsView'
],

function(Backbone, Template, ReportsCollection, UsersCollection, UserModel, ReportsCollectionView) {
  'use strict';

  return Backbone.Marionette.ItemView.extend({
    template: Template,
    model: null,
    events: {
      'click #report-ok': 'reportOK',
      'click #report-problem': 'reportProblem',
      'click #adopt-stop': 'adoptStop',
      'click #adopt-send': 'adoptSend'
    },
    
    initialize: function() {
      console.log('stop view init: '+this.options.code);
      this.code = this.options.code;
      this.model = this.getModel(this.code);
      
      if (this.model === null) {
        this.listenTo(this.options.appModel.get('stops'), 'reset', this.render);
      }
      this.listenTo(this.options.appModel, 'change:stop', this.onChangeStop);
    },
    onChangeStop: function(stop) {
      console.log('stop loaded', stop);
      this.model = stop;
      this.render();
    },
    onRender: function() {
      this.getReports();
      this.getUsers();
    },
    getModel: function(code) {
      console.log('getModel '+code);

      var stop = this.options.appModel.get('stop');
      if (stop !== null && (stop.get('code') == code || stop.get('code_short') == code)) {
        console.log('found with code');
        return stop;
      }
      console.log(stop);
      
      var stops = this.options.appModel.get('stops').where({code: this.code});
      var stopsWithShortCode = this.options.appModel.get('stops').where({code_short: this.code});

      // stops not loaded
      if (stops.length === 0 && stopsWithShortCode.length === 0) {
        return null;
      } else if (stops.length > 0) {
        return stops[0];
      } else {
        return stopsWithShortCode[0];
      }
    },
    serializeData: function() {
      var context = {};
      this.model = this.getModel(this.code);
      if (this.model !== null) {
        context = this.model.toJSON();
        if (context.name === null && context.name_fi !== null) {
          context.name = context.name_fi;
          context.address = context.address_fi;
          context.city = context.city_fi;
        }
      }
      console.log('context', context);
      return context;
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
    getReports: function() {
      if (this.model === null) {
        return false;
      }
      console.log('get reports');
      var reportsCollection = new ReportsCollection({code: this.model.get('code')});
      reportsCollection.fetch({success: _.bind(this.onReports, this)});
    },
    onReports: function(collection) {
      console.log('got reports', collection);
      if (collection.length == 0) {
        this.$('#stop-reports-container').hide();
        return;
      }
      var reportsCollectionView = new ReportsCollectionView({collection: collection});
      reportsCollectionView.render();
      this.$('#stop-reports').html(reportsCollectionView.el);
      this.$('#stop-reports-container').show();
    },
    getUsers: function() {
      if (this.model === null) {
        return false;
      }
      var usersCollection = new UsersCollection({code: this.model.get('code')});
      usersCollection.fetch({success: _.bind(this.onUsers, this)});
    },
    onUsers: function(collection) {
      this.$('#stop-users').html('');
      this.$('#stop-users-container').toggle(collection.length > 0);
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