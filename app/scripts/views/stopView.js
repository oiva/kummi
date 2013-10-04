define([
  'backbone',
  'hbs!tmpl/stop'
],

function(Backbone, Template) {
  return Backbone.Marionette.ItemView.extend({
    template: Template,
    
    initialize: function() {
      console.log('stop view init: '+this.options.code);
      this.code = this.options.code;
      this.model = this.getModel();
      
      if (this.model === null) {
        this.options.appModel.get('stops').on('reset', this.render);
      } else {
        this.model = stops[0];
      }
    },
    getModel: function(code) {
      console.log
      var stops = this.options.appModel.get('stops').where({code: this.code});

      // stops not loaded
      if (typeof stops === undefined || stops === null || stops.length === 0) {
        return null;
      }
      return stops[0];
    },
    serializeData: function() {
      console.log('stop view: serializeData');
      var context = {};
      this.model = this.getModel();
      if (this.model !== null) {
        context = this.model.toJSON();
        context.name = context.name_fi;
        context.address = context.address_fi;
        context.city = context.city_fi;
      }
      console.log('context', context);
      return context;
    }
  });
});