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
      //'click #send-report': 'sendReport'
      'submit #report-form': 'sendReport'
    },
    ui: {
      'description': '#description'
    },
    
    initialize: function() {
      console.log('report view init: '+this.options.code);
      this.code = this.options.code;
      this.model = this.options.model;
      
      if (typeof this.model === undefined || this.model === null) {
        appRouter.navigate('', {trigger: true});
      }
    },
    serializeData: function() {
      var context = {};
      if (this.model === null) {
        return context;
      }

      context = this.model.toJSON();
      if (context.name === null && context.name_fi !== null) {
        context.name = context.name_fi;
        context.address = context.address_fi;
        context.city = context.city_fi;
      }
      context.services = this.getServices();
      console.log('context', context);
      return context;
    },
    getServices: function() {
      var services = [
        {id: '201', name: 'Vandalism'},
        {id: '172', name: 'Sanitation violation'},
        {id: '177', name: 'Graffiti removal'},
        {id: '203', name: 'Info signs'},
        {id: '207', name: 'Other issue to be fixed'}
      ];
      return services;
    },
    getPicture: function(event) {
      console.log('getPicture');
    },
    sendReport: function(event) {
      console.log('sendReport');
      var report = new Report();
      
      var description = this.ui.description.val();
      var service_code = this.$('input[name=service-code]:checked').val();
      var code = this.model.get('code');

      report.set({
        description: description,
        service_code: service_code,
        code: ""+code
      });
      console.log('report', report);
      
      if (this.model.get('wgs_coords') !== null) {
        report.setCoords(this.model.get('wgs_coords'));
      } else if (this.model.get('coords') !== null) {
        report.setKkjCoords(this.model.get('coords'));
      }
      report.save();
      event.preventDefault();
      return false;
    }
  });
});