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
      'keyup #description': 'updateCharCount',
      'click #report-back': 'goBack'
    },
    ui: {
      'description': '#description',
      'charCount': '#char-count',
      'sendReport': '#send-report'
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
      var services;
      if (true) {
        services = [
          {id: '201', name: 'Ilkivalta'},
          {id: '172', name: 'Roskaaminen'},
          {id: '177', name: 'Töhryjen poisto'},
          {id: '203', name: 'Kyltit ja opasteet'},
          {id: '207', name: 'Muu korjattava asia'}
        ];
      } else {
        services = [
          {id: '172', name: 'Ilkivalta'},
          {id: '246', name: 'Roskaaminen'},
          {id: '176', name: 'Töhryjen poisto'},
          {id: '199', name: 'Kyltit ja opasteet'},
          {id: '180', name: 'Muu korjattava asia'}
        ];
      }
      return services;
    },
    getPicture: function(event) {
      console.log('getPicture');
    },
    updateCharCount: function() {
      var chars = this.ui.description.val().length;
      if (chars < 9) {
        this.ui.charCount.text('Syötä vielä '+(10-chars)+' merkkiä');
      } else if (chars == 9) {
        this.ui.charCount.text('Syötä vielä 1 merkki');
      }

      if (chars < 10) {
        this.ui.charCount.removeClass('hidden');
        this.ui.sendReport.attr('disabled', true);
      } else {
        this.ui.charCount.addClass('hidden');
        this.ui.sendReport.removeAttr('disabled');
      }
    },
    sendReport: function(event) {
      console.log('sendReport');
      var report = new Report();
      
      var description = this.ui.description.val();
      var service_code = this.$('input[name=service-code]:checked').val();
      var code = this.model.get('code');
      var firstname = this.$('#firstname').val()
      var lastname = this.$('#lastname').val()
      var email = this.$('#email').val()

      report.set({
        description: description,
        service_code: ""+service_code,
        code: ""+code,
        first_name: firstname,
        last_name: lastname,
        email: email
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
      //todo: go to thank you page
      //this.$('#report-form').hide();
      //this.$('#report-sent').show();
    },
    goBack: function() {
      appRouter.navigate('', {trigger: true});
      return false;
    }
  });
});