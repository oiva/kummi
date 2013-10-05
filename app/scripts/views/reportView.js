define([
  'backbone',
  'hbs!tmpl/report',
  'models/report'
],

function(Backbone, Template, Report) {
  'use strict';

  return Backbone.Marionette.ItemView.extend({
    template: Template,
    model: null,
    events: {
      'click #get-picture': 'getPicture',
      'click #send-report': 'sendReport'
    },
    ui: {
      'description': '#description'
    },
    
    initialize: function() {
      console.log('stop view init: '+this.options.code);
      this.code = this.options.code;
      this.model = this.options.model;
      
      if (typeof this.model === undefined || this.model === null) {
        //window.location.href = '/';
      }
    },
    serializeData: function() {
      var context = {};
      if (this.model === null) {
        return context;
      }

      context = this.model.toJSON();
      context.name = context.name_fi;
      context.address = context.address_fi;
      context.city = context.city_fi;
      context.getUserMedia = Modernizr.getUserMedia;
      context.fileInput = !context.getUserMedia && Modernizr.fileInput;
      console.log('context', context);
      return context;
    },
    getPicture: function(event) {
      console.log('getPicture');
    },
    sendReport: function() {
      console.log('sendReport');
      var report = new Report();

      var description = this.ui.description.val();
      var service_code = this.$('input[name=service-code]:checked').val();

      report.set({
        description: description,
        service_code: service_code
      });

      report.setCoords(this.model.get('wgs_coords'));
      report.save();
    }
  });
});