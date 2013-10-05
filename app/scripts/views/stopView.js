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
      this.model = this.getModel();
      
      if (this.model === null) {
        this.options.appModel.get('stops').on('reset', this.render);
      }
    },
    getModel: function(code) {
      var stops = this.options.appModel.get('stops').where({code: this.code});

      // stops not loaded
      if (typeof stops === undefined || stops === null || stops.length === 0) {
        return null;
      }
      return stops[0];
    },
    serializeData: function() {
      var context = {};
      this.model = this.getModel();
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
      window.appRouter.navigate('report/'+this.model.get('code'));
      return false;
    }
  });
});