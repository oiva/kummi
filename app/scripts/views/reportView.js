define([
  'backbone',
  'hbs!tmpl/report',
  'models/report',
  'views/stop/stopNameView'
],

function(Backbone, Template, Report, StopNameView) {
  'use strict';

  return Backbone.Marionette.Layout.extend({
    template: Template,
    model: null,
    regions: {
      stopName: '#report-stop-name'
    },
    events: {
      'click #get-picture': 'getPicture',
      //'click #send-report': 'sendReport'
      'submit #report-form': 'sendReport',
      'click #report-back': 'goBack'
    },
    ui: {
      'description': '#description'
    },
    
    initialize: function() {
      console.log('report view init: '+this.options.code);
      this.code = this.options.code;
      this.model = this.options.model;
      this.listenTo(this.model, 'change:code', this.renderStopName);
    },
    onRender: function() {
      this.renderStopName();
    },
    renderStopName: function() {
      console.log('render stop name');
      this.stopName.show(new StopNameView({model: this.model}));
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
        service_code: ""+service_code,
        code: ""+code
      });
      console.log('report', report);
      
      if (typeof this.model.get('wgs_coords') !== undefined 
        && this.model.get('wgs_coords') !== null) {
        report.setCoords(this.model.get('wgs_coords'));
      } else {
        console.warn('coords not found', this.model);
      }
      report.save();

      this.fakeResult();
      event.preventDefault();
      return false;
    },
    fakeResult: function() {
      this.$('#report-form').hide();
      this.$('#report-sent').show();
    },
    goBack: function() {
      appRouter.navigate('', {trigger: true});
      return false;
    }
  });
});