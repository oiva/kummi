define([
  'backbone',
  'hbs!tmpl/stop'
],

function(Backbone, Template) {
  'use strict';

  return Backbone.Marionette.ItemView.extend({
    template: Template,
    model: null,
    events: {
      'click #report-ok': 'reportOK',
      'click #report-problem': 'reportProblem'
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
    }
  });
});