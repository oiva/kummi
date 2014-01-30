require('backbone.marionette');

var Template = require('../../templates/stop.hbs');
var User = require('../models/user');
var InfoTeaserView = require('./infoTeaserView');
var AskAdoptionView = require('./stop/askAdoption');
var ReportsCollectionView = require('./stop/reportsView');
var ReportLinkView = require('./stop/reportLinkView');
var StopNameView = require('./stop/stopNameView');


var StopView = Backbone.Marionette.Layout.extend({
  template: Template,
  regions: {
    name: '#name',
    reports: '#stop-reports-container',
    report: '#stop-report-status',
    askAdoption: '#stop-ask-adoption',
    infoTeaser: '#stop-info-teaser'
  },

  initialize: function(options) {
    this.options = options;
    console.log('stop view init');
    this.code = this.options.code;
    this.code_short = this.options.code_short;
    this.model = this.options.appModel.get('stop');
    
    this.listenTo(this.model.get('users'), 'reset', this._onUsers);
    this.listenTo(this.model, 'change:code', this._onChangeStop);
    this.listenTo(this.model, 'change:code_short', this._onChangeStop);
  },
  onRender: function() {
    this.name.show(new StopNameView({model: this.model}));
    this.report.show(new ReportLinkView({model: this.model}));
    this.reports.show(new ReportsCollectionView({collection: this.model.get('reports')}));
    this.askAdoption.show(new AskAdoptionView({model: this.model}));
    this.infoTeaser.show(new InfoTeaserView());
  },
  _onChangeStop: function(stop) {
    console.log('stopView: stop '+stop.get('code')+' loaded', stop);
    if ((stop.get('code') !== this.code || this.code === null) &&
      (stop.get('code_short') !== this.code_short || this.code_short === null)) {
      return;
    }
    this.model = stop;
    this.render();
    
    this.model.getReports();
    this.model.getUsers();
  },
  _onUsers: function(collection) {
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

module.exports = StopView;