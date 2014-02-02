require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("backbone.marionette");var communicator=require("./communicator"),AppController=require("./controller"),AppRouter=require("./router"),App=new Backbone.Marionette.Application;App.addRegions({header:"#header",main:"#main"}),App.addInitializer(function(){window.Communicator=new communicator,Communicator.mediator.trigger("APP:START");var e=new AppController({app:this}),o=new AppRouter({controller:e});window.appRouter=o}),App.on("initialize:after",function(){console.log("app initialized"),Backbone.history.start()}),module.exports=App;
},{"./communicator":5,"./controller":6,"./router":13,"backbone.marionette":"IlFL/y"}],2:[function(require,module,exports){
require("backbone");var Report=require("../models/report"),ReportsCollection=Backbone.Collection.extend({model:Report,initialize:function(e){this.code=e.code},url:function(){return"api/report/"+this.code}});module.exports=ReportsCollection;
},{"../models/report":9,"backbone":"4NNQbm"}],3:[function(require,module,exports){
require("backbone");var Stop=require("../models/stop"),StopsCollection=Backbone.Collection.extend({model:Stop,initialize:function(){},url:function(){return void 0!==typeof this.lat&&void 0!==typeof this.lon&&null!==this.lat&&null!==this.lon?"api/stop/"+this.lat+"/"+this.lon:null},parse:function(t){return _.first(t,5)}});module.exports=StopsCollection;
},{"../models/stop":10,"backbone":"4NNQbm"}],4:[function(require,module,exports){
require("backbone");var User=require("../models/user"),UsersCollection=Backbone.Collection.extend({model:User,initialize:function(e){this.code=e.code},url:function(){return"api/user/"+this.code}});module.exports=UsersCollection;
},{"../models/user":11,"backbone":"4NNQbm"}],5:[function(require,module,exports){
require("backbone.marionette");var Communicator=Backbone.Marionette.Controller.extend({initialize:function(){this.mediator=new Backbone.Wreqr.EventAggregator,this.reqres=new Backbone.Wreqr.RequestResponse,this.command=new Backbone.Wreqr.Commands}});module.exports=Communicator;
},{"backbone.marionette":"IlFL/y"}],6:[function(require,module,exports){
require("backbone.marionette");var AppModel=require("./models/appModel"),AdoptView=require("./views/adopt/adoptView"),WelcomeView=require("./views/welcomeView"),StopView=require("./views/stopView"),ReportView=require("./views/reportView"),Controller=Backbone.Marionette.Controller.extend({initialize:function(){console.log("controller init"),this.app=this.options.app,this.appModel=new AppModel},welcome:function(){var o=new WelcomeView({appModel:this.appModel});this.app.main.show(o);var e=this;setTimeout(function(){e._updatePosition()},100)},stop:function(o){var e={appModel:this.appModel};o.length<=6?(e.code_short=o,this._stopWithShortCode(o)):(e.code=o,this._stopWithLongCode(o));var t=new StopView(e);this.app.main.show(t)},report:function(o){var e=new ReportView({code:o,model:this.appModel.get("stop")});this.app.main.show(e),this.appModel.get("stop").get("code")!==o&&this.appModel.get("stop").get("code_short")!==o&&this.appModel.loadStop({code:o})},adopt:function(o){var e=new AdoptView({code:o,model:this.appModel.get("stop")});this.app.main.show(e),this.appModel.get("stop").get("code")!==o&&this.appModel.get("stop").get("code_short")!==o&&this.appModel.loadStop({code:o})},_stopWithLongCode:function(o){this.appModel.get("stop").get("code")!==o&&this.appModel.loadStop({code:o});var e=this.appModel.get("stops").where({code:o});return e.length>0?void this.appModel.set({stop:e[0]}):void 0},_stopWithShortCode:function(o){this.appModel.get("stop").get("code_short")!==o&&this.appModel.loadStop({code_short:o});var e=this.appModel.get("stops").where({code_short:o});return e.length>0?void this.appModel.set({stop:e[0]}):void 0},_updatePosition:function(){console.log("update position"),Modernizr.geolocation&&navigator.geolocation.getCurrentPosition(_.bind(this._onPosition,this),_.bind(this._onPositionError,this))},_onPosition:function(o){console.log("onPosition",o);var e=o.coords.latitude,t=o.coords.longitude;this.appModel.updateLocation(e,t)},_onPositionError:function(o,e){Communicator.mediator.trigger("position:error",o.code),console.log("position error: "+o.code),console.log(e)}});module.exports=Controller;
},{"./models/appModel":8,"./views/adopt/adoptView":14,"./views/reportView":16,"./views/stopView":23,"./views/welcomeView":28,"backbone.marionette":"IlFL/y"}],7:[function(require,module,exports){
var App=require("./application"),hbsfy=require("hbsfy");App.start();
},{"./application":1,"hbsfy":84}],8:[function(require,module,exports){
require("backbone");var Stops=require("../collections/stops"),Stop=require("./stop"),AppModel=Backbone.Model.extend({defaults:{stops:null,stop:null,coords:{}},initialize:function(){this.set({stops:new Stops,stop:new Stop})},updateLocation:function(o,t){(o!==this.get("coords").lat||t!==this.get("coords").lon)&&(this.set({coords:{lat:o,lon:t}}),this.get("stops").lat=o,this.get("stops").lon=t,this._fetchStops())},loadStop:function(o){console.log("appModel: load stop ",o),this.get("stop").set(o),this.get("stop").fetch()},_fetchStops:function(){console.log("appModel: fetch stops"),this.get("stops").fetch({success:_.bind(this._onStops,this),error:_.bind(this._onStopsError,this),reset:!0})},_onStops:function(o){console.log("appModel: stops fetched",o),null!==o.code&&1===o.length&&(console.log("appModel loaded specific stop"),this.set({stop:o.models[0]}))},_onStopsError:function(){console.error("appModel: stops fetch failed")}});module.exports=AppModel;
},{"../collections/stops":3,"./stop":10,"backbone":"4NNQbm"}],9:[function(require,module,exports){
require("backbone");var Report=Backbone.Model.extend({url:"/api/report",defaults:{description:null,service_code:null,lat:null,lon:null,code:null},setWgsCoords:function(o){var e=o.split(",");return 2!==e.length?void console.warn("coords fail",o,e):void this.set({lon:e[0],lat:e[1]})},setCoords:function(o){var e=o.split(",");if(2!==e.length)return void console.warn("coords fail",o,e);for(var l=0;2>l;l++){var r=(e[l]+"").substring(0,7);r=parseInt(r,10),e[l]=1e-5*r}console.log("coords now "+e),this.set({lon:e[0],lat:e[1]})}});module.exports=Report;
},{"backbone":"4NNQbm"}],10:[function(require,module,exports){
require("backbone");var ReportsCollection=require("../collections/reports"),UsersCollection=require("../collections/users"),StopModel=Backbone.Model.extend({defaults:{x:0,y:0,dist:null,code:null,name_fi:null,name_sv:null,city_fi:null,city_sv:null,coords:null,code_short:null,address_fi:null,address_sv:null,reports:null,users:null},url:function(){return void 0!==typeof this.get("code")&&null!==this.get("code")?"api/stop/"+this.get("code"):void 0!==typeof this.get("code_short")&&null!==this.get("code_short")?"api/stop/"+this.get("code_short"):null},initialize:function(){var e=new ReportsCollection({code:this.get("code")}),o=new UsersCollection({code:this.get("code")});this.set({reports:e,users:o}),this.listenTo(this,"change:code",_.bind(this.onCodeChange,this))},onCodeChange:function(e,o){console.log("stop code changed to "+o);var t=new ReportsCollection({code:o}),s=new UsersCollection({code:o});this.set({reports:t,users:s})},reportOK:function(){console.log("stop "+this.get("code")+" is OK")},getReports:function(){console.log("stop: get reports"),null!==this.get("code")&&this.get("reports").fetch()},getUsers:function(){console.log("stop: get users"),null!==this.get("code")&&this.get("users").fetch()}});module.exports=StopModel;
},{"../collections/reports":2,"../collections/users":4,"backbone":"4NNQbm"}],11:[function(require,module,exports){
require("backbone");var UserModel=Backbone.Model.extend({url:"/api/user",defaults:{email:null,code:null}});module.exports=UserModel;
},{"backbone":"4NNQbm"}],12:[function(require,module,exports){
var Backbone=require("backbone"),Communicator=require("./communicator"),RegionManager=Backbone.Marionette.Controller.extend({initialize:function(){console.log("Initialize a Region Manager"),this._regionManager=new Backbone.Marionette.RegionManager,Communicator.reqres.setHandler("RM:addRegion",this.addRegion,this),Communicator.reqres.setHandler("RM:removeRegion",this.removeRegion,this),Communicator.reqres.setHandler("RM:getRegion",this.getRegion,this)},addRegion:function(e,n){var o=this.getRegion(e);return o?(console.log("REGION ALREADY CREATED TO JUST RETURN REF"),o):this._regionManager.addRegion(e,n)},removeRegion:function(e){this._regionManager.removeRegion(e)},getRegion:function(e){return this._regionManager.get(e)}});module.exports=RegionManager;
},{"./communicator":5,"backbone":"4NNQbm"}],13:[function(require,module,exports){
require("backbone.marionette");var router=Backbone.Marionette.AppRouter.extend({initialize:function(){console.log("router init")},appRoutes:{"":"welcome","stop/:code":"stop","report/:code":"report","adopt/:code":"adopt"}});module.exports=router;
},{"backbone.marionette":"IlFL/y"}],14:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../../templates/adopt/adopt.hbs"),AdoptView=Backbone.Marionette.ItemView.extend({template:Template,id:"adopt",ui:{firstName:"#firstname",lastName:"#lastname",email:"#email"},events:{"submit #adopt-form":"submitAdopt","keyup .form-control":"onInputKeyup"},tempValues:{firstname:"",lastname:"",email:""},initialize:function(e){console.log("init adopt view",e),this.options=e,this.listenTo(this.model,"change:name_fi",this.render)},serializeData:function(){var e={};return null===this.model?e:(e=this.model.toJSON(),null!==e.name&&"undefined"!=typeof e.name||null===e.name_fi||(e.name=e.name_fi,e.address=e.address_fi,e.city=e.city_fi),e=_.extend(e,this.tempValues))},submitAdopt:function(){var e={fistName:this.ui.fistName.val(),lastName:this.ui.lastName.val(),email:this.ui.email.val(),stop:this.options.code};return console.log(e),!1},onInputKeyup:function(e){var t=$(e.currentTarget);this.tempValues[t.attr("id")]=t.val()}});module.exports=AdoptView;
},{"../../../templates/adopt/adopt.hbs":29,"backbone.marionette":"IlFL/y"}],15:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../templates/infoTeaser.hbs");module.exports=Backbone.Marionette.ItemView.extend({template:Template});
},{"../../templates/infoTeaser.hbs":30,"backbone.marionette":"IlFL/y"}],16:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../templates/report.hbs"),Report=require("../models/report"),StopNameView=require("./stop/stopNameView"),ReportView=Backbone.Marionette.Layout.extend({template:Template,model:null,regions:{stopName:"#report-stop-name"},events:{"click #get-picture":"getPicture","submit #report-form":"sendReport","keyup #description":"updateCharCount","click #report-back":"goBack"},ui:{description:"#description",charCount:"#char-count",sendReport:"#send-report"},initialize:function(e){this.options=e,console.log("report view init: "+this.options.code),this.code=this.options.code,this.model=this.options.model,this.listenTo(this.model,"change:code",this.renderStopName)},onRender:function(){this.renderStopName()},renderStopName:function(){console.log("render stop name"),this.stopName.show(new StopNameView({model:this.model}))},serializeData:function(){var e={};return null===this.model?e:(e=this.model.toJSON(),null===e.name&&null!==e.name_fi&&(e.name=e.name_fi,e.address=e.address_fi,e.city=e.city_fi),e.services=this.getServices(),console.log("context",e),e)},getServices:function(){var e;return e=[{id:"201",name:"Ilkivalta"},{id:"172",name:"Roskaaminen"},{id:"177",name:"Töhryjen poisto"},{id:"203",name:"Kyltit ja opasteet"},{id:"207",name:"Muu korjattava asia"}]},getPicture:function(){console.log("getPicture")},updateCharCount:function(){var e=this.ui.description.val().length;9>e?this.ui.charCount.text("Syötä vielä "+(10-e)+" merkkiä"):9===e&&this.ui.charCount.text("Syötä vielä 1 merkki"),10>e?(this.ui.charCount.removeClass("hidden"),this.ui.sendReport.attr("disabled",!0)):(this.ui.charCount.addClass("hidden"),this.ui.sendReport.removeAttr("disabled"))},sendReport:function(e){console.log("sendReport");var t=new Report,o=this.ui.description.val(),i=this.$("input[name=service-code]:checked").val(),s=this.model.get("code"),r=this.$("#firstname").val(),n=this.$("#lastname").val(),a=this.$("#email").val();return t.set({description:o,service_code:""+i,code:""+s,first_name:r,last_name:n,email:a}),void 0!==this.model.get("wgs_coords")&&null!==this.model.get("wgs_coords")?(console.log("setWgsCoords "+this.model.get("wgs_coords")),t.setWgsCoords(this.model.get("wgs_coords"))):void 0!==this.model.get("coords")&&null!==this.model.get("coords")?(console.log("setXYCoords "+this.model.get("coords")),t.setCoords(this.model.get("coords"))):console.warn("coords not found",this.model),t.save({},{error:_.bind(this.onSaveError,this)}),this.onSaveSuccess(),e.preventDefault(),!1},onSaveError:function(){this.$("#report-sent").addClass("hidden"),this.$("#report-error").removeClass("hidden")},onSaveSuccess:function(){this.$("#report-form").addClass("hidden"),this.$("#report-sent").removeClass("hidden")},goBack:function(){return appRouter.navigate("stop/"+this.model.get("code"),{trigger:!0}),!1}});module.exports=ReportView;
},{"../../templates/report.hbs":31,"../models/report":9,"./stop/stopNameView":22,"backbone.marionette":"IlFL/y"}],17:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../../templates/stop/askAdoption.hbs"),AskAdoptionView=Backbone.Marionette.ItemView.extend({template:Template,events:{"click #adopt-stop":"adoptStop"},initialize:function(){this.listenTo(this.model,"change:code",this.render)},adoptStop:function(){return appRouter.navigate("adopt/"+this.model.get("code"),{trigger:!0}),!1},serializeData:function(){var e=this.model.toJSON();return e.showButton=null!==e.code,console.log(e),e}});module.exports=AskAdoptionView;
},{"../../../templates/stop/askAdoption.hbs":33,"backbone.marionette":"IlFL/y"}],18:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../../templates/stop/reportItem.hbs");module.exports=Backbone.Marionette.ItemView.extend({template:Template,tagName:"li"});
},{"../../../templates/stop/reportItem.hbs":34,"backbone.marionette":"IlFL/y"}],19:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../../templates/stop/reportLink.hbs"),ReportLinkView=Backbone.Marionette.ItemView.extend({template:Template,events:{"click #report-ok":"reportOK","click #report-problem":"reportProblem"},initialize:function(){this.listenTo(this.model,"change:code",this._onChangeStop)},reportOK:function(){return null===this.model?!1:(this.model.reportOK(),!1)},reportProblem:function(){return null===this.model||null===this.model.get("code")?!1:(window.appRouter.navigate("report/"+this.model.get("code"),{trigger:!0}),!1)},_onChangeStop:function(e,t){this.$("#report-problem").attr("disabled",null===t),this.$("#report-ok").attr("disabled",null===t)}});module.exports=ReportLinkView;
},{"../../../templates/stop/reportLink.hbs":35,"backbone.marionette":"IlFL/y"}],20:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../../templates/stop/reportsEmpty.hbs");module.exports=Backbone.Marionette.ItemView.extend({template:Template,tagName:"li"});
},{"../../../templates/stop/reportsEmpty.hbs":37,"backbone.marionette":"IlFL/y"}],21:[function(require,module,exports){
require("backbone.marionette");var Reports=require("../../collections/reports"),ReportItemView=require("./reportItemView"),ReportsEmptyView=require("./reportsEmptyView"),Template=require("../../../templates/stop/reports.hbs");module.exports=Backbone.Marionette.CompositeView.extend({template:Template,itemView:ReportItemView,itemViewContainer:"ul",emptyView:ReportsEmptyView});
},{"../../../templates/stop/reports.hbs":36,"../../collections/reports":2,"./reportItemView":18,"./reportsEmptyView":20,"backbone.marionette":"IlFL/y"}],22:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../../templates/stop/stopName.hbs"),StopNameView=Backbone.Marionette.ItemView.extend({template:Template,className:"col-xs-12 col-sm-12",initialize:function(){console.log("stop name view: init",this.options),this.listenTo(this.model,"change:name_fi",this.render)},serializeData:function(e){this.options=e;var t=this.model.toJSON();return void 0===t.name&&null!==t.name_fi&&(t.name=t.name_fi,t.address=t.address_fi,t.city=t.city_fi),console.log("stop name view: render",t),t}});module.exports=StopNameView;
},{"../../../templates/stop/stopName.hbs":38,"backbone.marionette":"IlFL/y"}],23:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../templates/stop.hbs"),User=require("../models/user"),InfoTeaserView=require("./infoTeaserView"),AskAdoptionView=require("./stop/askAdoption"),ReportsCollectionView=require("./stop/reportsView"),ReportLinkView=require("./stop/reportLinkView"),StopNameView=require("./stop/stopNameView"),StopView=Backbone.Marionette.Layout.extend({template:Template,regions:{name:"#name",reports:"#stop-reports-container",report:"#stop-report-status",askAdoption:"#stop-ask-adoption",infoTeaser:"#stop-info-teaser"},initialize:function(e){this.options=e,console.log("stop view init"),this.code=this.options.code,this.code_short=this.options.code_short,this.model=this.options.appModel.get("stop"),this.listenTo(this.model.get("users"),"reset",this._onUsers),this.listenTo(this.model,"change:code",this._onChangeStop),this.listenTo(this.model,"change:code_short",this._onChangeStop)},onRender:function(){this.name.show(new StopNameView({model:this.model})),this.report.show(new ReportLinkView({model:this.model})),this.reports.show(new ReportsCollectionView({collection:this.model.get("reports")})),this.askAdoption.show(new AskAdoptionView({model:this.model})),this.infoTeaser.show(new InfoTeaserView)},_onChangeStop:function(e){console.log("stopView: stop "+e.get("code")+" loaded",e),(e.get("code")===this.code&&null!==this.code||e.get("code_short")===this.code_short&&null!==this.code_short)&&(this.model=e,this.render(),this.model.getReports(),this.model.getUsers())},_onUsers:function(e){var o=this;console.log("users",e);var t=_.uniq(e.models,!1,function(e){return e.get("email")});_.each(t,function(e){o.$("#stop-users").append("<p>"+e.get("email")+"</p>")})},adoptStop:function(){return this.$("#adopt-form").removeClass("hidden"),this.$("#adopt-stop").remove(),!1},adoptSend:function(){var e=this.$("#email").val(),o=new UserModel({email:e,code:this.model.get("code")});return o.save(),this.$("#adopt-form").html('<p class="text-success">Olet nyt pysäkin kummi!</p>'),!1},userCreated:function(){console.log("user created")}});module.exports=StopView;
},{"../../templates/stop.hbs":32,"../models/user":11,"./infoTeaserView":15,"./stop/askAdoption":17,"./stop/reportLinkView":19,"./stop/reportsView":21,"./stop/stopNameView":22,"backbone.marionette":"IlFL/y"}],24:[function(require,module,exports){
require("backbone.marionette");var StopItemView=require("./stopItemView"),Template=require("../../../templates/welcome/nearby.hbs"),NearbyView=Backbone.Marionette.CompositeView.extend({itemView:StopItemView,template:Template,itemViewContainer:"ul",initialize:function(){console.log("nearby init",this.collection)},onCompositeCollectionRendered:function(){console.log("on composite rendered",this.$("#loading-stops")),this.$("#loading-stops").toggle(0===this.collection.length)}});module.exports=NearbyView;
},{"../../../templates/welcome/nearby.hbs":40,"./stopItemView":27,"backbone.marionette":"IlFL/y"}],25:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../../templates/welcome/search.hbs"),SearchView=Backbone.Marionette.ItemView.extend({template:Template,events:{"click #find-stop":"findStop"},findStop:function(){var e=this.$("#stop-id").val();return""===e?!1:(appRouter.navigate("stop/"+e,{trigger:!0}),!1)}});module.exports=SearchView;
},{"../../../templates/welcome/search.hbs":41,"backbone.marionette":"IlFL/y"}],26:[function(require,module,exports){
require("backbone.marionette");var StopItemView=require("./stopItemView");module.exports=Backbone.Marionette.CollectionView.extend({itemView:StopItemView});
},{"./stopItemView":27,"backbone.marionette":"IlFL/y"}],27:[function(require,module,exports){
require("backbone.marionette");var Template=require("../../../templates/welcome/stopItem.hbs");module.exports=Backbone.Marionette.ItemView.extend({template:Template,tagName:"li"});
},{"../../../templates/welcome/stopItem.hbs":42,"backbone.marionette":"IlFL/y"}],28:[function(require,module,exports){
require("backbone.marionette");var NearbyView=require("./welcome/nearbyView"),SearchView=require("./welcome/searchView"),InfoTeaserView=require("./infoTeaserView"),Template=require("../../templates/welcome.hbs"),WelcomeView=Backbone.Marionette.Layout.extend({template:Template,regions:{infoTeaser:"#welcome-info-teaser",nearby:"#welcome-nearby",search:"#welcome-search"},initialize:function(e){this.options=e,console.log("init welcome view"),Communicator.mediator.on("position:error",this.onPositionError,this),this.collection=this.options.appModel.get("stops")},onRender:function(){this.infoTeaser.show(new InfoTeaserView),this.search.show(new SearchView),this.nearby.show(new NearbyView({collection:this.collection}))},serializeData:function(){var e={geoLocation:Modernizr.geolocation};return e},onPositionError:function(){console.log("welcome view: position error"),this.$("#welcome-nearby").hide()}});module.exports=WelcomeView;
},{"../../templates/welcome.hbs":39,"./infoTeaserView":15,"./welcome/nearbyView":24,"./welcome/searchView":25,"backbone.marionette":"IlFL/y"}],29:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(a,e,n,l,s){function t(a,e){var l,s,t="";return t+='\n<div class="row header">\n  <div class="col-xs-12 col-sm-12">\n    <h2>Ryhdy pysäkin <span>',(s=n.name)?l=s.call(a,{hash:{},data:e}):(s=a&&a.name,l=typeof s===m?s.call(a,{hash:{},data:e}):s),t+=d(l)+"</span> kummiksi!</h2>\n  </div>\n</div>\n"}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,a.helpers),s=s||{};var i,r,o="",m="function",d=this.escapeExpression,f=this;return i=n["if"].call(e,e&&e.name,{hash:{},inverse:f.noop,fn:f.program(1,t,s),data:s}),(i||0===i)&&(o+=i),o+='\n\n<form role="form" id="adopt-form">\n  <fieldset>\n    <div class="form-inline form-group">\n      <div class="form-group">\n        <label for="firstname">Etunimi</label>\n        <input type="text" id="firstname" name="firstname" class="form-control" required autofocus="autofocus" value="',(r=n.firstname)?i=r.call(e,{hash:{},data:s}):(r=e&&e.firstname,i=typeof r===m?r.call(e,{hash:{},data:s}):r),o+=d(i)+'"/>\n      </div>\n      <div class="form-group">\n        <label for="lastname">Sukunimi</label>\n        <input type="text" id="lastname" name="lastname" class="form-control" required value="',(r=n.lastname)?i=r.call(e,{hash:{},data:s}):(r=e&&e.lastname,i=typeof r===m?r.call(e,{hash:{},data:s}):r),o+=d(i)+'"/>\n      </div>\n    </div>\n    <div class="form-group">\n      <label for="email">Sähköposti</label>\n      <input type="email" id="email" class="form-control" required value="',(r=n.email)?i=r.call(e,{hash:{},data:s}):(r=e&&e.email,i=typeof r===m?r.call(e,{hash:{},data:s}):r),o+=d(i)+'"/>\n    </div>\n\n    <button id="send-adopt" type="submit" class="btn btn-default">Ryhdy kummiksi</button>\n  </fieldset>\n</form>'});
},{"hbsfy/runtime":86}],30:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(e,s,i,l,a){return this.compilerInfo=[4,">= 1.0.0"],i=this.merge(i,e.helpers),a=a||{},'<div class="col-xs-12 col-sm-6 col-md-8">\n  <h3>Mikä on pysäkkikummi?</h3>\n  <p>Pysäkkikummi on palvelu, jonka avulla ihmiset voivat kertoa jos HSL:n pysäkeillä on jotain pielessä.</p>\n  <a href="#" class="btn btn-default">Lue lisää &raquo;</a>\n</div>'});
},{"hbsfy/runtime":86}],31:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(e,n,a,i,t){function s(e,n){var i,t,s="";return s+='\n      <div class="radio">\n        <label>\n          <input type="radio" name="service-code" id="service_code_',(t=a.id)?i=t.call(e,{hash:{},data:n}):(t=e&&e.id,i=typeof t===r?t.call(e,{hash:{},data:n}):t),s+=d(i)+'" value="',(t=a.id)?i=t.call(e,{hash:{},data:n}):(t=e&&e.id,i=typeof t===r?t.call(e,{hash:{},data:n}):t),s+=d(i)+'" />\n          ',(t=a.name)?i=t.call(e,{hash:{},data:n}):(t=e&&e.name,i=typeof t===r?t.call(e,{hash:{},data:n}):t),s+=d(i)+"\n        </label>\n      </div>\n      "}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,e.helpers),t=t||{};var l,o="",r="function",d=this.escapeExpression,p=this;return o+='<div id="report-stop-name" class="row"></div>\n\n<form role="form" id="report-form">\n  <fieldset>\n    <p>Valitse vaihtoehdoista sopivin ja kuvaile ongelmaa muutamalla sanalla.</p>\n    <div class="form-group">\n      <label for="service_code_201">Ongelma</label>\n      ',l=a.each.call(n,n&&n.services,{hash:{},inverse:p.noop,fn:p.program(1,s,t),data:t}),(l||0===l)&&(o+=l),o+='\n    </div>\n\n    <div class="form-group">\n      <label for="description">Mikä on pielessä?</label>\n      <textarea name="description" id="description" class="form-control" rows="3"></textarea>\n      <span class="help-block" id="char-count"></span>\n    </div>\n\n    <div class="form-group hidden">\n      <label for="image-picker">Ota kuva</label>\n      <input id="image-picker" type="file" accept="image/*" />\n    </div>\n\n    <p>Tarvitsemme myös nimesi. Anna lisäksi sähköpostiosoitteesi, jos haluat kuittauksen kun olemme käsitelleet ilmoituksesi.</p>\n\n    <div class="form-inline form-group">\n      <div class="form-group">\n        <label for="firstname">Etunimi</label>\n        <input type="text" id="firstname" name="firstname" class="form-control" required />\n      </div>\n      <div class="form-group">\n        <label for="lastname">Sukunimi</label>\n        <input type="text" id="lastname" name="lastname" class="form-control" required />\n      </div>\n    </div>\n\n    <div class="form-group">\n      <label for="email">Sähköposti (jos haluat kuittauksen)</label>\n      <input type="email" id="email" class="form-control" />\n    </div>\n\n    <button id="send-report" type="submit" class="btn btn-default" disabled="disabled">Lähetä</button>\n  </fieldset>\n</form>\n\n<div id="report-sent" class="hidden">\n  <p class="text-success">Viestisi on lähetetty!</p>\n  <button type="button" class="btn btn-default" id="report-back">Takaisin</button>\n</div>\n\n<div id="report-error" class="hidden">\n  <p class="text-warning">Viestin lähettäminen epäonnistui.</p>\n  <button type="button" class="btn btn-default" id="report-back">Takaisin</button>\n</div>'});
},{"hbsfy/runtime":86}],32:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(s,i,d,n,o){return this.compilerInfo=[4,">= 1.0.0"],d=this.merge(d,s.helpers),o=o||{},'<div class="row" id="name"></div>\n\n<div class="row" id="stop-users-container" style="display: none">\n  <div class="col-xs-12 col-sm-12">\n    <h3>Pysäkin kummit</h3>\n    <div id="stop-users"></div>\n  </div>\n</div>\n<div class="row" id="stop-report-status"></div>\n<div class="row" id="stop-reports-container"></div>\n<div class="row" id="stop-ask-adoption"></div>\n<div class="row" id="stop-info-teaser"></div>'});
},{"hbsfy/runtime":86}],33:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(n,i,t,s,a){function e(){return'\n<div class="col-xs-12 col-sm-12">\n  <h3>Käytkö usein tällä pysäkillä?</h3>\n  <p>Jos käyt pysäkillä lähes päivittäin, voit ryhtyä sen kummiksi.</p>\n  <p>Pysäkkikummin velvollisuutena on...</p>\n  <ul>\n    <li>Tarkkailla pysäkin kuntoa</li>\n    <li>Raportoida jos jotain on pielessä</li>\n  </ul>\n  <p>Kummina autat pitämään kaupunkimme paremmassa kunnossa.</p>\n  \n  <button id="adopt-stop" type="button" class="btn btn-primary">Ryhdy pysäkin kummiksi</button>\n  <div id="adopt-form" class="hidden">\n    <div class="form-group">\n      <label for="email">Sähköpostiosoitteesi</label>\n      <input type="email" name="email" id="email" placeholder="" />\n      <button id="adopt-send" type="submit" class="btn btn-default">Lähetä</button>\n    </div>\n  </div>\n</div>\n'}this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,n.helpers),a=a||{};var l,o=this;return l=t["if"].call(i,i&&i.showButton,{hash:{},inverse:o.noop,fn:o.program(1,e,a),data:a}),l||0===l?l:""});
},{"hbsfy/runtime":86}],34:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(a,e,t,s,r){this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,a.helpers),r=r||{};var l,h,i="",n="function",d=this.escapeExpression;return(h=t.date)?l=h.call(e,{hash:{},data:r}):(h=e&&e.date,l=typeof h===n?h.call(e,{hash:{},data:r}):h),i+=d(l)+": ",(h=t.description)?l=h.call(e,{hash:{},data:r}):(h=e&&e.description,l=typeof h===n?h.call(e,{hash:{},data:r}):h),i+=d(l)});
},{"hbsfy/runtime":86}],35:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(t,n,e,s,l){return this.compilerInfo=[4,">= 1.0.0"],e=this.merge(e,t.helpers),l=l||{},'<div class="col-xs-12 col-sm-12">\n  <h2>Mitä pysäkille kuuluu?</h2>\n  <button type="button" class="btn btn-success" id="report-ok">Pysäkillä on kaikki OK</button>\n  <button type="button" class="btn btn-danger" id="report-problem">Pysäkillä on ongelma!</button>\n</div>'});
},{"hbsfy/runtime":86}],36:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(e,r,n,s,t){return this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),t=t||{},'<div class="col-xs-12 col-sm-12">\n  <h3>Raportoidut ongelmat</h3>\n  <div id="stop-reports">\n    <ul></ul>\n  </div>\n</div>'});
},{"hbsfy/runtime":86}],37:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(e,r,l,i,t){return this.compilerInfo=[4,">= 1.0.0"],l=this.merge(l,e.helpers),t=t||{},"<p>Tällä pysäkillä ei ole raportoituja ongelmia.</p>"});
},{"hbsfy/runtime":86}],38:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(a,e,t,n,s){function r(a,e){var n,s,r="";return r+="\n  <h1>",(s=t.name)?n=s.call(a,{hash:{},data:e}):(s=a&&a.name,n=typeof s===i?s.call(a,{hash:{},data:e}):s),r+=c(n)+'</h1>\n  <p class="info">',(s=t.address)?n=s.call(a,{hash:{},data:e}):(s=a&&a.address,n=typeof s===i?s.call(a,{hash:{},data:e}):s),r+=c(n)+", ",(s=t.city)?n=s.call(a,{hash:{},data:e}):(s=a&&a.city,n=typeof s===i?s.call(a,{hash:{},data:e}):s),r+=c(n)+"</p>\n"}function h(){return"\n  <p>Ladataan pysäkin tietoja...</p>\n"}this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,a.helpers),s=s||{};var l,i="function",c=this.escapeExpression,o=this;return l=t["if"].call(e,e&&e.name,{hash:{},inverse:o.program(3,h,s),fn:o.program(1,r,s),data:s}),l||0===l?l:""});
},{"hbsfy/runtime":86}],39:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(e,r,i,s,a){return this.compilerInfo=[4,">= 1.0.0"],i=this.merge(i,e.helpers),a=a||{},'<div class="row" id="welcome-info-teaser"></div>\n<div class="row" id="welcome-nearby"></div>\n<div class="row" id="welcome-search"></div>'});
},{"hbsfy/runtime":86}],40:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(s,e,n,i,l){return this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.helpers),l=l||{},'<div class="col-xs-12 col-sm-6 col-md-8">\n  <h3>Lähistön pysäkit</h3>\n  <p id="loading-stops">Ladataan...</p>\n  <ul id="stops"></ul>\n</div>'});
},{"hbsfy/runtime":86}],41:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(e,t,n,i,s){return this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,e.helpers),s=s||{},'<div class="col-xs-12 col-sm-6 col-md-8">\n  <h3>Etsi pysäkki</h3>\n  <label for="stop-id">Anna pysäkin koodi</label>\n  <input type="text" name="stop-id" id="stop-id" placeholder="1251" />\n  <button class="btn btn-primary" id="find-stop">Hae</button>\n</div>'});
},{"hbsfy/runtime":86}],42:[function(require,module,exports){
var Handlebars=require("hbsfy/runtime");module.exports=Handlebars.template(function(a,e,t,h,r){function o(a,e){var h,r,o="";return o+="(",(r=t.codeShort)?h=r.call(a,{hash:{},data:e}):(r=a&&a.codeShort,h=typeof r===c?r.call(a,{hash:{},data:e}):r),o+=d(h)+")"}this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,a.helpers),r=r||{};var s,l,n="",c="function",d=this.escapeExpression,i=this;return n+='<a href="#stop/',(l=t.code)?s=l.call(e,{hash:{},data:r}):(l=e&&e.code,s=typeof l===c?l.call(e,{hash:{},data:r}):l),n+=d(s)+'">',(l=t.name)?s=l.call(e,{hash:{},data:r}):(l=e&&e.name,s=typeof l===c?l.call(e,{hash:{},data:r}):l),n+=d(s)+" ",s=t["if"].call(e,e&&e.codeShort,{hash:{},inverse:i.noop,fn:i.program(1,o,r),data:r}),(s||0===s)&&(n+=s),n+="</a>"});
},{"hbsfy/runtime":86}],"backbone.babysitter":[function(require,module,exports){
module.exports=require('cljjeY');
},{}],"cljjeY":[function(require,module,exports){
(function (global){(function(i,t,e,n){global.Backbone=require("backbone"),Backbone.ChildViewContainer=function(i,t){var e=function(i){this._views={},this._indexByModel={},this._indexByCustom={},this._updateLength(),t.each(i,this.add,this)};t.extend(e.prototype,{add:function(i,t){var e=i.cid;this._views[e]=i,i.model&&(this._indexByModel[i.model.cid]=e),t&&(this._indexByCustom[t]=e),this._updateLength()},findByModel:function(i){return this.findByModelCid(i.cid)},findByModelCid:function(i){var t=this._indexByModel[i];return this.findByCid(t)},findByCustom:function(i){var t=this._indexByCustom[i];return this.findByCid(t)},findByIndex:function(i){return t.values(this._views)[i]},findByCid:function(i){return this._views[i]},remove:function(i){var e=i.cid;i.model&&delete this._indexByModel[i.model.cid],t.any(this._indexByCustom,function(i,t){return i===e?(delete this._indexByCustom[t],!0):void 0},this),delete this._views[e],this._updateLength()},call:function(i){this.apply(i,t.tail(arguments))},apply:function(i,e){t.each(this._views,function(n){t.isFunction(n[i])&&n[i].apply(n,e||[])})},_updateLength:function(){this.length=t.size(this._views)}});var n=["forEach","each","map","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","toArray","first","initial","rest","last","without","isEmpty","pluck"];return t.each(n,function(i){e.prototype[i]=function(){var e=t.values(this._views),n=[e].concat(t.toArray(arguments));return t[i].apply(t,n)}}),e}(Backbone,_),n("undefined"!=typeof Backbone.Babysitter?Backbone.Babysitter:window.Backbone.Babysitter)}).call(global,void 0,void 0,void 0,function(i){module.exports=i});}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"backbone":"4NNQbm"}],"IlFL/y":[function(require,module,exports){
(function (global){(function(e,t,i,n){global.$=require("jquery"),global.Backbone=require("backbone"),global._=require("underscore"),Backbone.ChildViewContainer=function(e,t){var i=function(e){this._views={},this._indexByModel={},this._indexByCustom={},this._updateLength(),t.each(e,this.add,this)};t.extend(i.prototype,{add:function(e,t){var i=e.cid;this._views[i]=e,e.model&&(this._indexByModel[e.model.cid]=i),t&&(this._indexByCustom[t]=i),this._updateLength()},findByModel:function(e){return this.findByModelCid(e.cid)},findByModelCid:function(e){var t=this._indexByModel[e];return this.findByCid(t)},findByCustom:function(e){var t=this._indexByCustom[e];return this.findByCid(t)},findByIndex:function(e){return t.values(this._views)[e]},findByCid:function(e){return this._views[e]},remove:function(e){var i=e.cid;e.model&&delete this._indexByModel[e.model.cid],t.any(this._indexByCustom,function(e,t){return e===i?(delete this._indexByCustom[t],!0):void 0},this),delete this._views[i],this._updateLength()},call:function(e){this.apply(e,t.tail(arguments))},apply:function(e,i){t.each(this._views,function(n){t.isFunction(n[e])&&n[e].apply(n,i||[])})},_updateLength:function(){this.length=t.size(this._views)}});var n=["forEach","each","map","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","toArray","first","initial","rest","last","without","isEmpty","pluck"];return t.each(n,function(e){i.prototype[e]=function(){var i=t.values(this._views),n=[i].concat(t.toArray(arguments));return t[e].apply(t,n)}}),i}(Backbone,_),Backbone.Wreqr=function(e,t,i){"use strict";var n={};return n.Handlers=function(e,t){var i=function(e){this.options=e,this._wreqrHandlers={},t.isFunction(this.initialize)&&this.initialize(e)};return i.extend=e.Model.extend,t.extend(i.prototype,e.Events,{setHandlers:function(e){t.each(e,function(e,i){var n=null;t.isObject(e)&&!t.isFunction(e)&&(n=e.context,e=e.callback),this.setHandler(i,e,n)},this)},setHandler:function(e,t,i){var n={callback:t,context:i};this._wreqrHandlers[e]=n,this.trigger("handler:add",e,t,i)},hasHandler:function(e){return!!this._wreqrHandlers[e]},getHandler:function(e){var t=this._wreqrHandlers[e];if(!t)throw new Error("Handler not found for '"+e+"'");return function(){var e=Array.prototype.slice.apply(arguments);return t.callback.apply(t.context,e)}},removeHandler:function(e){delete this._wreqrHandlers[e]},removeAllHandlers:function(){this._wreqrHandlers={}}}),i}(e,i),n.CommandStorage=function(){var t=function(e){this.options=e,this._commands={},i.isFunction(this.initialize)&&this.initialize(e)};return i.extend(t.prototype,e.Events,{getCommands:function(e){var t=this._commands[e];return t||(t={command:e,instances:[]},this._commands[e]=t),t},addCommand:function(e,t){var i=this.getCommands(e);i.instances.push(t)},clearCommands:function(e){var t=this.getCommands(e);t.instances=[]}}),t}(),n.Commands=function(e){return e.Handlers.extend({storageType:e.CommandStorage,constructor:function(t){this.options=t||{},this._initializeStorage(this.options),this.on("handler:add",this._executeCommands,this);var i=Array.prototype.slice.call(arguments);e.Handlers.prototype.constructor.apply(this,i)},execute:function(e,t){e=arguments[0],t=Array.prototype.slice.call(arguments,1),this.hasHandler(e)?this.getHandler(e).apply(this,t):this.storage.addCommand(e,t)},_executeCommands:function(e,t,n){var r=this.storage.getCommands(e);i.each(r.instances,function(e){t.apply(n,e)}),this.storage.clearCommands(e)},_initializeStorage:function(e){var t,n=e.storageType||this.storageType;t=i.isFunction(n)?new n:n,this.storage=t}})}(n),n.RequestResponse=function(e){return e.Handlers.extend({request:function(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return this.getHandler(e).apply(this,t)}})}(n),n.EventAggregator=function(e,t){var i=function(){};return i.extend=e.Model.extend,t.extend(i.prototype,e.Events),i}(e,i),n}(Backbone,Backbone.Marionette,_);var r=function(e,t,i){"use strict";function n(e){return s.call(e)}function r(e,t){var i=new Error(e);throw i.name=t||"Error",i}var o={};t.Marionette=o,o.$=t.$;var s=Array.prototype.slice;return o.extend=t.Model.extend,o.getOption=function(e,t){if(e&&t){var i;return i=e.options&&t in e.options&&void 0!==e.options[t]?e.options[t]:e[t]}},o.triggerMethod=function(){function e(e,t,i){return i.toUpperCase()}var t=/(^|:)(\w)/gi,n=function(n){var r="on"+n.replace(t,e),o=this[r];return i.isFunction(this.trigger)&&this.trigger.apply(this,arguments),i.isFunction(o)?o.apply(this,i.tail(arguments)):void 0};return n}(),o.MonitorDOMRefresh=function(){function e(e){e._isShown=!0,n(e)}function t(e){e._isRendered=!0,n(e)}function n(e){e._isShown&&e._isRendered&&i.isFunction(e.triggerMethod)&&e.triggerMethod("dom:refresh")}return function(i){i.listenTo(i,"show",function(){e(i)}),i.listenTo(i,"render",function(){t(i)})}}(),function(e){function t(e,t,n,o){var s=o.split(/\s+/);i.each(s,function(i){var o=e[i];o||r("Method '"+i+"' was configured as an event handler, but does not exist."),e.listenTo(t,n,o,e)})}function n(e,t,i,n){e.listenTo(t,i,n,e)}function o(e,t,n,r){var o=r.split(/\s+/);i.each(o,function(i){var r=e[i];e.stopListening(t,n,r,e)})}function s(e,t,i,n){e.stopListening(t,i,n,e)}function a(e,t,n,r,o){t&&n&&(i.isFunction(n)&&(n=n.call(e)),i.each(n,function(n,s){i.isFunction(n)?r(e,t,s,n):o(e,t,s,n)}))}e.bindEntityEvents=function(e,i,r){a(e,i,r,n,t)},e.unbindEntityEvents=function(e,t,i){a(e,t,i,s,o)}}(o),o.Callbacks=function(){this._deferred=o.$.Deferred(),this._callbacks=[]},i.extend(o.Callbacks.prototype,{add:function(e,t){this._callbacks.push({cb:e,ctx:t}),this._deferred.done(function(i,n){t&&(i=t),e.call(i,n)})},run:function(e,t){this._deferred.resolve(t,e)},reset:function(){var e=this._callbacks;this._deferred=o.$.Deferred(),this._callbacks=[],i.each(e,function(e){this.add(e.cb,e.ctx)},this)}}),o.Controller=function(e){this.triggerMethod=o.triggerMethod,this.options=e||{},i.isFunction(this.initialize)&&this.initialize(this.options)},o.Controller.extend=o.extend,i.extend(o.Controller.prototype,t.Events,{close:function(){this.stopListening(),this.triggerMethod("close"),this.unbind()}}),o.Region=function(e){if(this.options=e||{},this.el=o.getOption(this,"el"),!this.el){var t=new Error("An 'el' must be specified for a region.");throw t.name="NoElError",t}if(this.initialize){var i=Array.prototype.slice.apply(arguments);this.initialize.apply(this,i)}},i.extend(o.Region,{buildRegion:function(e,t){var n="string"==typeof e,r="string"==typeof e.selector,o="undefined"==typeof e.regionType,s="function"==typeof e;if(!s&&!n&&!r)throw new Error("Region must be specified as a Region type, a selector string or an object with selector property");var a,h;n&&(a=e),e.selector&&(a=e.selector),s&&(h=e),!s&&o&&(h=t),e.regionType&&(h=e.regionType);var l=new h({el:a});return e.parentEl&&(l.getEl=function(t){var n=e.parentEl;return i.isFunction(n)&&(n=n()),n.find(t)}),l}}),i.extend(o.Region.prototype,t.Events,{show:function(e){this.ensureEl();var t=e.isClosed||i.isUndefined(e.$el),n=e!==this.currentView;n&&this.close(),e.render(),(n||t)&&this.open(e),this.currentView=e,o.triggerMethod.call(this,"show",e),o.triggerMethod.call(e,"show")},ensureEl:function(){this.$el&&0!==this.$el.length||(this.$el=this.getEl(this.el))},getEl:function(e){return o.$(e)},open:function(e){this.$el.empty().append(e.el)},close:function(){var e=this.currentView;e&&!e.isClosed&&(e.close?e.close():e.remove&&e.remove(),o.triggerMethod.call(this,"close"),delete this.currentView)},attachView:function(e){this.currentView=e},reset:function(){this.close(),delete this.$el}}),o.Region.extend=o.extend,o.RegionManager=function(e){var t=e.Controller.extend({constructor:function(t){this._regions={},e.Controller.prototype.constructor.call(this,t)},addRegions:function(e,t){var n={};return i.each(e,function(e,r){"string"==typeof e&&(e={selector:e}),e.selector&&(e=i.defaults({},e,t));var o=this.addRegion(r,e);n[r]=o},this),n},addRegion:function(t,n){var r,o=i.isObject(n),s=i.isString(n),a=!!n.selector;return r=s||o&&a?e.Region.buildRegion(n,e.Region):i.isFunction(n)?e.Region.buildRegion(n,e.Region):n,this._store(t,r),this.triggerMethod("region:add",t,r),r},get:function(e){return this._regions[e]},removeRegion:function(e){var t=this._regions[e];this._remove(e,t)},removeRegions:function(){i.each(this._regions,function(e,t){this._remove(t,e)},this)},closeRegions:function(){i.each(this._regions,function(e){e.close()},this)},close:function(){this.removeRegions();var t=Array.prototype.slice.call(arguments);e.Controller.prototype.close.apply(this,t)},_store:function(e,t){this._regions[e]=t,this._setLength()},_remove:function(e,t){t.close(),delete this._regions[e],this._setLength(),this.triggerMethod("region:remove",e,t)},_setLength:function(){this.length=i.size(this._regions)}}),n=["forEach","each","map","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","toArray","first","initial","rest","last","without","isEmpty","pluck"];return i.each(n,function(e){t.prototype[e]=function(){var t=i.values(this._regions),n=[t].concat(i.toArray(arguments));return i[e].apply(i,n)}}),t}(o),o.TemplateCache=function(e){this.templateId=e},i.extend(o.TemplateCache,{templateCaches:{},get:function(e){var t=this.templateCaches[e];return t||(t=new o.TemplateCache(e),this.templateCaches[e]=t),t.load()},clear:function(){var e,t=n(arguments),i=t.length;if(i>0)for(e=0;i>e;e++)delete this.templateCaches[t[e]];else this.templateCaches={}}}),i.extend(o.TemplateCache.prototype,{load:function(){if(this.compiledTemplate)return this.compiledTemplate;var e=this.loadTemplate(this.templateId);return this.compiledTemplate=this.compileTemplate(e),this.compiledTemplate},loadTemplate:function(e){var t=o.$(e).html();return t&&0!==t.length||r("Could not find template: '"+e+"'","NoTemplateError"),t},compileTemplate:function(e){return i.template(e)}}),o.Renderer={render:function(e,t){if(!e){var i=new Error("Cannot render the template since it's false, null or undefined.");throw i.name="TemplateNotFoundError",i}var n;return(n="function"==typeof e?e:o.TemplateCache.get(e))(t)}},o.View=t.View.extend({constructor:function(e){i.bindAll(this,"render");var n=Array.prototype.slice.apply(arguments);this.options=e||{},t.View.prototype.constructor.apply(this,n),o.MonitorDOMRefresh(this),this.listenTo(this,"show",this.onShowCalled,this)},triggerMethod:o.triggerMethod,getTemplate:function(){return o.getOption(this,"template")},mixinTemplateHelpers:function(e){e=e||{};var t=o.getOption(this,"templateHelpers");return i.isFunction(t)&&(t=t.call(this)),i.extend(e,t)},configureTriggers:function(){if(this.triggers){var e={},t=i.result(this,"triggers");return i.each(t,function(t,n){var r=i.isObject(t),o=r?t.event:t;e[n]=function(e){if(e){var i=e.preventDefault,n=e.stopPropagation,s=r?t.preventDefault:i,a=r?t.stopPropagation:n;s&&i&&i.apply(e),a&&n&&n.apply(e)}var h={view:this,model:this.model,collection:this.collection};this.triggerMethod(o,h)}},this),e}},delegateEvents:function(e){this._delegateDOMEvents(e),o.bindEntityEvents(this,this.model,o.getOption(this,"modelEvents")),o.bindEntityEvents(this,this.collection,o.getOption(this,"collectionEvents"))},_delegateDOMEvents:function(e){e=e||this.events,i.isFunction(e)&&(e=e.call(this));var n={},r=this.configureTriggers();i.extend(n,e,r),t.View.prototype.delegateEvents.call(this,n)},undelegateEvents:function(){var e=Array.prototype.slice.call(arguments);t.View.prototype.undelegateEvents.apply(this,e),o.unbindEntityEvents(this,this.model,o.getOption(this,"modelEvents")),o.unbindEntityEvents(this,this.collection,o.getOption(this,"collectionEvents"))},onShowCalled:function(){},close:function(){if(!this.isClosed){var e=this.triggerMethod("before:close");e!==!1&&(this.isClosed=!0,this.triggerMethod("close"),this.unbindUIElements(),this.remove())}},bindUIElements:function(){if(this.ui){this._uiBindings||(this._uiBindings=this.ui);var e=i.result(this,"_uiBindings");this.ui={},i.each(i.keys(e),function(t){var i=e[t];this.ui[t]=this.$(i)},this)}},unbindUIElements:function(){this.ui&&this._uiBindings&&(i.each(this.ui,function(e,t){delete this.ui[t]},this),this.ui=this._uiBindings,delete this._uiBindings)}}),o.ItemView=o.View.extend({constructor:function(){o.View.prototype.constructor.apply(this,n(arguments))},serializeData:function(){var e={};return this.model?e=this.model.toJSON():this.collection&&(e={items:this.collection.toJSON()}),e},render:function(){this.isClosed=!1,this.triggerMethod("before:render",this),this.triggerMethod("item:before:render",this);var e=this.serializeData();e=this.mixinTemplateHelpers(e);var t=this.getTemplate(),i=o.Renderer.render(t,e);return this.$el.html(i),this.bindUIElements(),this.triggerMethod("render",this),this.triggerMethod("item:rendered",this),this},close:function(){this.isClosed||(this.triggerMethod("item:before:close"),o.View.prototype.close.apply(this,n(arguments)),this.triggerMethod("item:closed"))}}),o.CollectionView=o.View.extend({itemViewEventPrefix:"itemview",constructor:function(){this._initChildViewStorage(),o.View.prototype.constructor.apply(this,n(arguments)),this._initialEvents(),this.initRenderBuffer()},initRenderBuffer:function(){this.elBuffer=document.createDocumentFragment()},startBuffering:function(){this.initRenderBuffer(),this.isBuffering=!0},endBuffering:function(){this.appendBuffer(this,this.elBuffer),this.initRenderBuffer(),this.isBuffering=!1},_initialEvents:function(){this.collection&&(this.listenTo(this.collection,"add",this.addChildView,this),this.listenTo(this.collection,"remove",this.removeItemView,this),this.listenTo(this.collection,"reset",this.render,this))},addChildView:function(e){this.closeEmptyView();var t=this.getItemView(e),i=this.collection.indexOf(e);this.addItemView(e,t,i)},onShowCalled:function(){this.children.each(function(e){o.triggerMethod.call(e,"show")})},triggerBeforeRender:function(){this.triggerMethod("before:render",this),this.triggerMethod("collection:before:render",this)},triggerRendered:function(){this.triggerMethod("render",this),this.triggerMethod("collection:rendered",this)},render:function(){return this.isClosed=!1,this.triggerBeforeRender(),this._renderChildren(),this.triggerRendered(),this},_renderChildren:function(){this.startBuffering(),this.closeEmptyView(),this.closeChildren(),this.collection&&this.collection.length>0?this.showCollection():this.showEmptyView(),this.endBuffering()},showCollection:function(){var e;this.collection.each(function(t,i){e=this.getItemView(t),this.addItemView(t,e,i)},this)},showEmptyView:function(){var e=this.getEmptyView();if(e&&!this._showingEmptyView){this._showingEmptyView=!0;var i=new t.Model;this.addItemView(i,e,0)}},closeEmptyView:function(){this._showingEmptyView&&(this.closeChildren(),delete this._showingEmptyView)},getEmptyView:function(){return o.getOption(this,"emptyView")},getItemView:function(){var e=o.getOption(this,"itemView");return e||r("An `itemView` must be specified","NoItemViewError"),e},addItemView:function(e,t,n){var r=o.getOption(this,"itemViewOptions");i.isFunction(r)&&(r=r.call(this,e,n));var s=this.buildItemView(e,t,r);this.addChildViewEventForwarding(s),this.triggerMethod("before:item:added",s),this.children.add(s),this.renderItemView(s,n),this._isShown&&o.triggerMethod.call(s,"show"),this.triggerMethod("after:item:added",s)},addChildViewEventForwarding:function(e){var t=o.getOption(this,"itemViewEventPrefix");this.listenTo(e,"all",function(){var i=n(arguments);i[0]=t+":"+i[0],i.splice(1,0,e),o.triggerMethod.apply(this,i)},this)},renderItemView:function(e,t){e.render(),this.appendHtml(this,e,t)},buildItemView:function(e,t,n){var r=i.extend({model:e},n);return new t(r)},removeItemView:function(e){var t=this.children.findByModel(e);this.removeChildView(t),this.checkEmpty()},removeChildView:function(e){e&&(this.stopListening(e),e.close?e.close():e.remove&&e.remove(),this.children.remove(e)),this.triggerMethod("item:removed",e)},checkEmpty:function(){this.collection&&0!==this.collection.length||this.showEmptyView()},appendBuffer:function(e,t){e.$el.append(t)},appendHtml:function(e,t){e.isBuffering?e.elBuffer.appendChild(t.el):e.$el.append(t.el)},_initChildViewStorage:function(){this.children=new t.ChildViewContainer},close:function(){this.isClosed||(this.triggerMethod("collection:before:close"),this.closeChildren(),this.triggerMethod("collection:closed"),o.View.prototype.close.apply(this,n(arguments)))},closeChildren:function(){this.children.each(function(e){this.removeChildView(e)},this),this.checkEmpty()}}),o.CompositeView=o.CollectionView.extend({constructor:function(){o.CollectionView.prototype.constructor.apply(this,n(arguments))},_initialEvents:function(){this.once("render",function(){this.collection&&(this.listenTo(this.collection,"add",this.addChildView,this),this.listenTo(this.collection,"remove",this.removeItemView,this),this.listenTo(this.collection,"reset",this._renderChildren,this))})},getItemView:function(){var e=o.getOption(this,"itemView")||this.constructor;return e||r("An `itemView` must be specified","NoItemViewError"),e},serializeData:function(){var e={};return this.model&&(e=this.model.toJSON()),e},render:function(){this.isRendered=!0,this.isClosed=!1,this.resetItemViewContainer(),this.triggerBeforeRender();var e=this.renderModel();return this.$el.html(e),this.bindUIElements(),this.triggerMethod("composite:model:rendered"),this._renderChildren(),this.triggerMethod("composite:rendered"),this.triggerRendered(),this},_renderChildren:function(){this.isRendered&&(o.CollectionView.prototype._renderChildren.call(this),this.triggerMethod("composite:collection:rendered"))},renderModel:function(){var e={};e=this.serializeData(),e=this.mixinTemplateHelpers(e);var t=this.getTemplate();return o.Renderer.render(t,e)},appendBuffer:function(e,t){var i=this.getItemViewContainer(e);i.append(t)},appendHtml:function(e,t){if(e.isBuffering)e.elBuffer.appendChild(t.el);else{var i=this.getItemViewContainer(e);i.append(t.el)}},getItemViewContainer:function(e){if("$itemViewContainer"in e)return e.$itemViewContainer;var t,n=o.getOption(e,"itemViewContainer");if(n){var s=i.isFunction(n)?n():n;t=e.$(s),t.length<=0&&r("The specified `itemViewContainer` was not found: "+e.itemViewContainer,"ItemViewContainerMissingError")}else t=e.$el;return e.$itemViewContainer=t,t},resetItemViewContainer:function(){this.$itemViewContainer&&delete this.$itemViewContainer}}),o.Layout=o.ItemView.extend({regionType:o.Region,constructor:function(e){e=e||{},this._firstRender=!0,this._initializeRegions(e),o.ItemView.prototype.constructor.call(this,e)},render:function(){this.isClosed&&this._initializeRegions(),this._firstRender?this._firstRender=!1:this.isClosed||this._reInitializeRegions();var e=Array.prototype.slice.apply(arguments),t=o.ItemView.prototype.render.apply(this,e);return t},close:function(){if(!this.isClosed){this.regionManager.close();var e=Array.prototype.slice.apply(arguments);o.ItemView.prototype.close.apply(this,e)}},addRegion:function(e,t){var i={};return i[e]=t,this._buildRegions(i)[e]},addRegions:function(e){return this.regions=i.extend({},this.regions,e),this._buildRegions(e)},removeRegion:function(e){return delete this.regions[e],this.regionManager.removeRegion(e)},_buildRegions:function(e){var t=this,i={regionType:o.getOption(this,"regionType"),parentEl:function(){return t.$el}};return this.regionManager.addRegions(e,i)},_initializeRegions:function(e){var t;this._initRegionManager(),t=i.isFunction(this.regions)?this.regions(e):this.regions||{},this.addRegions(t)},_reInitializeRegions:function(){this.regionManager.closeRegions(),this.regionManager.each(function(e){e.reset()})},_initRegionManager:function(){this.regionManager=new o.RegionManager,this.listenTo(this.regionManager,"region:add",function(e,t){this[e]=t,this.trigger("region:add",e,t)}),this.listenTo(this.regionManager,"region:remove",function(e,t){delete this[e],this.trigger("region:remove",e,t)})}}),o.AppRouter=t.Router.extend({constructor:function(e){t.Router.prototype.constructor.apply(this,n(arguments)),this.options=e||{};var i=o.getOption(this,"appRoutes"),r=this._getController();this.processAppRoutes(r,i)},appRoute:function(e,t){var i=this._getController();this._addAppRoute(i,e,t)},processAppRoutes:function(e,t){if(t){var n=i.keys(t).reverse();i.each(n,function(i){this._addAppRoute(e,i,t[i])},this)}},_getController:function(){return o.getOption(this,"controller")},_addAppRoute:function(e,t,n){var r=e[n];if(!r)throw new Error("Method '"+n+"' was not found on the controller");this.route(t,n,i.bind(r,e))}}),o.Application=function(e){this._initRegionManager(),this._initCallbacks=new o.Callbacks,this.vent=new t.Wreqr.EventAggregator,this.commands=new t.Wreqr.Commands,this.reqres=new t.Wreqr.RequestResponse,this.submodules={},i.extend(this,e),this.triggerMethod=o.triggerMethod},i.extend(o.Application.prototype,t.Events,{execute:function(){var e=Array.prototype.slice.apply(arguments);this.commands.execute.apply(this.commands,e)},request:function(){var e=Array.prototype.slice.apply(arguments);return this.reqres.request.apply(this.reqres,e)},addInitializer:function(e){this._initCallbacks.add(e)},start:function(e){this.triggerMethod("initialize:before",e),this._initCallbacks.run(e,this),this.triggerMethod("initialize:after",e),this.triggerMethod("start",e)},addRegions:function(e){return this._regionManager.addRegions(e)},closeRegions:function(){this._regionManager.closeRegions()},removeRegion:function(e){this._regionManager.removeRegion(e)},getRegion:function(e){return this._regionManager.get(e)},module:function(){var e=n(arguments);return e.unshift(this),o.Module.create.apply(o.Module,e)},_initRegionManager:function(){this._regionManager=new o.RegionManager,this.listenTo(this._regionManager,"region:add",function(e,t){this[e]=t}),this.listenTo(this._regionManager,"region:remove",function(e){delete this[e]})}}),o.Application.extend=o.extend,o.Module=function(e,t){this.moduleName=e,this.submodules={},this._setupInitializersAndFinalizers(),this.app=t,this.startWithParent=!0,this.triggerMethod=o.triggerMethod},i.extend(o.Module.prototype,t.Events,{addInitializer:function(e){this._initializerCallbacks.add(e)},addFinalizer:function(e){this._finalizerCallbacks.add(e)},start:function(e){this._isInitialized||(i.each(this.submodules,function(t){t.startWithParent&&t.start(e)}),this.triggerMethod("before:start",e),this._initializerCallbacks.run(e,this),this._isInitialized=!0,this.triggerMethod("start",e))},stop:function(){this._isInitialized&&(this._isInitialized=!1,o.triggerMethod.call(this,"before:stop"),i.each(this.submodules,function(e){e.stop()}),this._finalizerCallbacks.run(void 0,this),this._initializerCallbacks.reset(),this._finalizerCallbacks.reset(),o.triggerMethod.call(this,"stop"))},addDefinition:function(e,t){this._runModuleDefinition(e,t)},_runModuleDefinition:function(e,n){if(e){var r=i.flatten([this,this.app,t,o,o.$,i,n]);e.apply(this,r)}},_setupInitializersAndFinalizers:function(){this._initializerCallbacks=new o.Callbacks,this._finalizerCallbacks=new o.Callbacks}}),i.extend(o.Module,{create:function(e,t,r){var o=e,s=n(arguments);s.splice(0,3),t=t.split(".");var a=t.length,h=[];return h[a-1]=r,i.each(t,function(t,i){var n=o;o=this._getModule(n,t,e),this._addModuleDefinition(n,o,h[i],s)},this),o},_getModule:function(e,t,i){var n=e[t];return n||(n=new o.Module(t,i),e[t]=n,e.submodules[t]=n),n},_addModuleDefinition:function(e,t,n,r){var o,s;i.isFunction(n)?(o=n,s=!0):i.isObject(n)?(o=n.define,s=n.startWithParent):s=!0,o&&t.addDefinition(o,r),t.startWithParent=t.startWithParent&&s,t.startWithParent&&!t.startWithParentIsConfigured&&(t.startWithParentIsConfigured=!0,e.addInitializer(function(e){t.startWithParent&&t.start(e)}))}}),o}(this,Backbone,_);n("undefined"!=typeof r?r:window.Marionette)}).call(global,void 0,void 0,void 0,function(e){module.exports=e});}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"backbone":"4NNQbm","jquery":"Cz4Dm0","underscore":"s+Ot9H"}],"backbone.marionette":[function(require,module,exports){
module.exports=require('IlFL/y');
},{}],"4NNQbm":[function(require,module,exports){
(function (global){(function(t,e,i,n){global.underscore=require("underscore"),function(){{var t,i=this,n=i.Backbone,s=[],r=(s.push,s.slice);s.splice}t="undefined"!=typeof e?e:i.Backbone={},t.VERSION="1.1.0";var a=i._;a||"undefined"==typeof require||(a=require("underscore")),t.$=i.jQuery||i.Zepto||i.ender||i.$,t.noConflict=function(){return i.Backbone=n,this},t.emulateHTTP=!1,t.emulateJSON=!1;var o=t.Events={on:function(t,e,i){if(!u(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var n=this._events[t]||(this._events[t]=[]);return n.push({callback:e,context:i,ctx:i||this}),this},once:function(t,e,i){if(!u(this,"once",t,[e,i])||!e)return this;var n=this,s=a.once(function(){n.off(t,s),e.apply(this,arguments)});return s._callback=e,this.on(t,s,i)},off:function(t,e,i){var n,s,r,o,h,c,l,d;if(!this._events||!u(this,"off",t,[e,i]))return this;if(!t&&!e&&!i)return this._events={},this;for(o=t?[t]:a.keys(this._events),h=0,c=o.length;c>h;h++)if(t=o[h],r=this._events[t]){if(this._events[t]=n=[],e||i)for(l=0,d=r.length;d>l;l++)s=r[l],(e&&e!==s.callback&&e!==s.callback._callback||i&&i!==s.context)&&n.push(s);n.length||delete this._events[t]}return this},trigger:function(t){if(!this._events)return this;var e=r.call(arguments,1);if(!u(this,"trigger",t,e))return this;var i=this._events[t],n=this._events.all;return i&&c(i,e),n&&c(n,arguments),this},stopListening:function(t,e,i){var n=this._listeningTo;if(!n)return this;var s=!e&&!i;i||"object"!=typeof e||(i=this),t&&((n={})[t._listenId]=t);for(var r in n)t=n[r],t.off(e,i,this),(s||a.isEmpty(t._events))&&delete this._listeningTo[r];return this}},h=/\s+/,u=function(t,e,i,n){if(!i)return!0;if("object"==typeof i){for(var s in i)t[e].apply(t,[s,i[s]].concat(n));return!1}if(h.test(i)){for(var r=i.split(h),a=0,o=r.length;o>a;a++)t[e].apply(t,[r[a]].concat(n));return!1}return!0},c=function(t,e){var i,n=-1,s=t.length,r=e[0],a=e[1],o=e[2];switch(e.length){case 0:for(;++n<s;)(i=t[n]).callback.call(i.ctx);return;case 1:for(;++n<s;)(i=t[n]).callback.call(i.ctx,r);return;case 2:for(;++n<s;)(i=t[n]).callback.call(i.ctx,r,a);return;case 3:for(;++n<s;)(i=t[n]).callback.call(i.ctx,r,a,o);return;default:for(;++n<s;)(i=t[n]).callback.apply(i.ctx,e)}},l={listenTo:"on",listenToOnce:"once"};a.each(l,function(t,e){o[e]=function(e,i,n){var s=this._listeningTo||(this._listeningTo={}),r=e._listenId||(e._listenId=a.uniqueId("l"));return s[r]=e,n||"object"!=typeof i||(n=this),e[t](i,n,this),this}}),o.bind=o.on,o.unbind=o.off,a.extend(t,o);var d=t.Model=function(t,e){var i=t||{};e||(e={}),this.cid=a.uniqueId("c"),this.attributes={},e.collection&&(this.collection=e.collection),e.parse&&(i=this.parse(i,e)||{}),i=a.defaults({},i,a.result(this,"defaults")),this.set(i,e),this.changed={},this.initialize.apply(this,arguments)};a.extend(d.prototype,o,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(){return a.clone(this.attributes)},sync:function(){return t.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return a.escape(this.get(t))},has:function(t){return null!=this.get(t)},set:function(t,e,i){var n,s,r,o,h,u,c,l;if(null==t)return this;if("object"==typeof t?(s=t,i=e):(s={})[t]=e,i||(i={}),!this._validate(s,i))return!1;r=i.unset,h=i.silent,o=[],u=this._changing,this._changing=!0,u||(this._previousAttributes=a.clone(this.attributes),this.changed={}),l=this.attributes,c=this._previousAttributes,this.idAttribute in s&&(this.id=s[this.idAttribute]);for(n in s)e=s[n],a.isEqual(l[n],e)||o.push(n),a.isEqual(c[n],e)?delete this.changed[n]:this.changed[n]=e,r?delete l[n]:l[n]=e;if(!h){o.length&&(this._pending=!0);for(var d=0,f=o.length;f>d;d++)this.trigger("change:"+o[d],this,l[o[d]],i)}if(u)return this;if(!h)for(;this._pending;)this._pending=!1,this.trigger("change",this,i);return this._pending=!1,this._changing=!1,this},unset:function(t,e){return this.set(t,void 0,a.extend({},e,{unset:!0}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,a.extend({},t,{unset:!0}))},hasChanged:function(t){return null==t?!a.isEmpty(this.changed):a.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?a.clone(this.changed):!1;var e,i=!1,n=this._changing?this._previousAttributes:this.attributes;for(var s in t)a.isEqual(n[s],e=t[s])||((i||(i={}))[s]=e);return i},previous:function(t){return null!=t&&this._previousAttributes?this._previousAttributes[t]:null},previousAttributes:function(){return a.clone(this._previousAttributes)},fetch:function(t){t=t?a.clone(t):{},void 0===t.parse&&(t.parse=!0);var e=this,i=t.success;return t.success=function(n){return e.set(e.parse(n,t),t)?(i&&i(e,n,t),void e.trigger("sync",e,n,t)):!1},U(this,t),this.sync("read",this,t)},save:function(t,e,i){var n,s,r,o=this.attributes;if(null==t||"object"==typeof t?(n=t,i=e):(n={})[t]=e,i=a.extend({validate:!0},i),n&&!i.wait){if(!this.set(n,i))return!1}else if(!this._validate(n,i))return!1;n&&i.wait&&(this.attributes=a.extend({},o,n)),void 0===i.parse&&(i.parse=!0);var h=this,u=i.success;return i.success=function(t){h.attributes=o;var e=h.parse(t,i);return i.wait&&(e=a.extend(n||{},e)),a.isObject(e)&&!h.set(e,i)?!1:(u&&u(h,t,i),void h.trigger("sync",h,t,i))},U(this,i),s=this.isNew()?"create":i.patch?"patch":"update","patch"===s&&(i.attrs=n),r=this.sync(s,this,i),n&&i.wait&&(this.attributes=o),r},destroy:function(t){t=t?a.clone(t):{};var e=this,i=t.success,n=function(){e.trigger("destroy",e,e.collection,t)};if(t.success=function(s){(t.wait||e.isNew())&&n(),i&&i(e,s,t),e.isNew()||e.trigger("sync",e,s,t)},this.isNew())return t.success(),!1;U(this,t);var s=this.sync("delete",this,t);return t.wait||n(),s},url:function(){var t=a.result(this,"urlRoot")||a.result(this.collection,"url")||R();return this.isNew()?t:t+("/"===t.charAt(t.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(t){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},isValid:function(t){return this._validate({},a.extend(t||{},{validate:!0}))},_validate:function(t,e){if(!e.validate||!this.validate)return!0;t=a.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;return i?(this.trigger("invalid",this,i,a.extend(e,{validationError:i})),!1):!0}});var f=["keys","values","pairs","invert","pick","omit"];a.each(f,function(t){d.prototype[t]=function(){var e=r.call(arguments);return e.unshift(this.attributes),a[t].apply(a,e)}});var p=t.Collection=function(t,e){e||(e={}),e.model&&(this.model=e.model),void 0!==e.comparator&&(this.comparator=e.comparator),this._reset(),this.initialize.apply(this,arguments),t&&this.reset(t,a.extend({silent:!0},e))},g={add:!0,remove:!0,merge:!0},v={add:!0,remove:!1};a.extend(p.prototype,o,{model:d,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return t.sync.apply(this,arguments)},add:function(t,e){return this.set(t,a.extend({merge:!1},e,v))},remove:function(t,e){var i=!a.isArray(t);t=i?[t]:a.clone(t),e||(e={});var n,s,r,o;for(n=0,s=t.length;s>n;n++)o=t[n]=this.get(t[n]),o&&(delete this._byId[o.id],delete this._byId[o.cid],r=this.indexOf(o),this.models.splice(r,1),this.length--,e.silent||(e.index=r,o.trigger("remove",o,this,e)),this._removeReference(o));return i?t[0]:t},set:function(t,e){e=a.defaults({},e,g),e.parse&&(t=this.parse(t,e));var i=!a.isArray(t);t=i?t?[t]:[]:a.clone(t);var n,s,r,o,h,u,c,l=e.at,f=this.model,p=this.comparator&&null==l&&e.sort!==!1,v=a.isString(this.comparator)?this.comparator:null,m=[],y=[],_={},b=e.add,w=e.merge,x=e.remove,E=!p&&b&&x?[]:!1;for(n=0,s=t.length;s>n;n++){if(h=t[n],r=h instanceof d?o=h:h[f.prototype.idAttribute],u=this.get(r))x&&(_[u.cid]=!0),w&&(h=h===o?o.attributes:h,e.parse&&(h=u.parse(h,e)),u.set(h,e),p&&!c&&u.hasChanged(v)&&(c=!0)),t[n]=u;else if(b){if(o=t[n]=this._prepareModel(h,e),!o)continue;m.push(o),o.on("all",this._onModelEvent,this),this._byId[o.cid]=o,null!=o.id&&(this._byId[o.id]=o)}E&&E.push(u||o)}if(x){for(n=0,s=this.length;s>n;++n)_[(o=this.models[n]).cid]||y.push(o);y.length&&this.remove(y,e)}if(m.length||E&&E.length)if(p&&(c=!0),this.length+=m.length,null!=l)for(n=0,s=m.length;s>n;n++)this.models.splice(l+n,0,m[n]);else{E&&(this.models.length=0);var k=E||m;for(n=0,s=k.length;s>n;n++)this.models.push(k[n])}if(c&&this.sort({silent:!0}),!e.silent){for(n=0,s=m.length;s>n;n++)(o=m[n]).trigger("add",o,this,e);(c||E&&E.length)&&this.trigger("sort",this,e)}return i?t[0]:t},reset:function(t,e){e||(e={});for(var i=0,n=this.models.length;n>i;i++)this._removeReference(this.models[i]);return e.previousModels=this.models,this._reset(),t=this.add(t,a.extend({silent:!0},e)),e.silent||this.trigger("reset",this,e),t},push:function(t,e){return this.add(t,a.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t),e},unshift:function(t,e){return this.add(t,a.extend({at:0},e))},shift:function(t){var e=this.at(0);return this.remove(e,t),e},slice:function(){return r.apply(this.models,arguments)},get:function(t){return null==t?void 0:this._byId[t.id]||this._byId[t.cid]||this._byId[t]},at:function(t){return this.models[t]},where:function(t,e){return a.isEmpty(t)?e?void 0:[]:this[e?"find":"filter"](function(e){for(var i in t)if(t[i]!==e.get(i))return!1;return!0})},findWhere:function(t){return this.where(t,!0)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");return t||(t={}),a.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(a.bind(this.comparator,this)),t.silent||this.trigger("sort",this,t),this},pluck:function(t){return a.invoke(this.models,"get",t)},fetch:function(t){t=t?a.clone(t):{},void 0===t.parse&&(t.parse=!0);var e=t.success,i=this;return t.success=function(n){var s=t.reset?"reset":"set";i[s](n,t),e&&e(i,n,t),i.trigger("sync",i,n,t)},U(this,t),this.sync("read",this,t)},create:function(t,e){if(e=e?a.clone(e):{},!(t=this._prepareModel(t,e)))return!1;e.wait||this.add(t,e);var i=this,n=e.success;return e.success=function(t,e,s){s.wait&&i.add(t,s),n&&n(t,e,s)},t.save(null,e),t},parse:function(t){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0,this.models=[],this._byId={}},_prepareModel:function(t,e){if(t instanceof d)return t.collection||(t.collection=this),t;e=e?a.clone(e):{},e.collection=this;var i=new this.model(t,e);return i.validationError?(this.trigger("invalid",this,i.validationError,e),!1):i},_removeReference:function(t){this===t.collection&&delete t.collection,t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,n){("add"!==t&&"remove"!==t||i===this)&&("destroy"===t&&this.remove(e,n),e&&t==="change:"+e.idAttribute&&(delete this._byId[e.previous(e.idAttribute)],null!=e.id&&(this._byId[e.id]=e)),this.trigger.apply(this,arguments))}});var m=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain"];a.each(m,function(t){p.prototype[t]=function(){var e=r.call(arguments);return e.unshift(this.models),a[t].apply(a,e)}});var y=["groupBy","countBy","sortBy"];a.each(y,function(t){p.prototype[t]=function(e,i){var n=a.isFunction(e)?e:function(t){return t.get(e)};return a[t](this.models,n,i)}});var _=t.View=function(t){this.cid=a.uniqueId("view"),t||(t={}),a.extend(this,a.pick(t,w)),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},b=/^(\S+)\s*(.*)$/,w=["model","collection","el","id","attributes","className","tagName","events"];a.extend(_.prototype,o,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this.stopListening(),this},setElement:function(e,i){return this.$el&&this.undelegateEvents(),this.$el=e instanceof t.$?e:t.$(e),this.el=this.$el[0],i!==!1&&this.delegateEvents(),this},delegateEvents:function(t){if(!t&&!(t=a.result(this,"events")))return this;this.undelegateEvents();for(var e in t){var i=t[e];if(a.isFunction(i)||(i=this[t[e]]),i){var n=e.match(b),s=n[1],r=n[2];i=a.bind(i,this),s+=".delegateEvents"+this.cid,""===r?this.$el.on(s,i):this.$el.on(s,r,i)}}return this},undelegateEvents:function(){return this.$el.off(".delegateEvents"+this.cid),this},_ensureElement:function(){if(this.el)this.setElement(a.result(this,"el"),!1);else{var e=a.extend({},a.result(this,"attributes"));this.id&&(e.id=a.result(this,"id")),this.className&&(e["class"]=a.result(this,"className"));var i=t.$("<"+a.result(this,"tagName")+">").attr(e);this.setElement(i,!1)}}}),t.sync=function(e,i,n){var s=E[e];a.defaults(n||(n={}),{emulateHTTP:t.emulateHTTP,emulateJSON:t.emulateJSON});var r={type:s,dataType:"json"};if(n.url||(r.url=a.result(i,"url")||R()),null!=n.data||!i||"create"!==e&&"update"!==e&&"patch"!==e||(r.contentType="application/json",r.data=JSON.stringify(n.attrs||i.toJSON(n))),n.emulateJSON&&(r.contentType="application/x-www-form-urlencoded",r.data=r.data?{model:r.data}:{}),n.emulateHTTP&&("PUT"===s||"DELETE"===s||"PATCH"===s)){r.type="POST",n.emulateJSON&&(r.data._method=s);var o=n.beforeSend;n.beforeSend=function(t){return t.setRequestHeader("X-HTTP-Method-Override",s),o?o.apply(this,arguments):void 0}}"GET"===r.type||n.emulateJSON||(r.processData=!1),"PATCH"===r.type&&x&&(r.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")});var h=n.xhr=t.ajax(a.extend(r,n));return i.trigger("request",i,h,n),h};var x=!("undefined"==typeof window||!window.ActiveXObject||window.XMLHttpRequest&&(new XMLHttpRequest).dispatchEvent),E={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};t.ajax=function(){return t.$.ajax.apply(t.$,arguments)};var k=t.Router=function(t){t||(t={}),t.routes&&(this.routes=t.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},T=/\((.*?)\)/g,S=/(\(\?)?:\w+/g,$=/\*\w+/g,H=/[\-{}\[\]+?.,\\\^$|#\s]/g;a.extend(k.prototype,o,{initialize:function(){},route:function(e,i,n){a.isRegExp(e)||(e=this._routeToRegExp(e)),a.isFunction(i)&&(n=i,i=""),n||(n=this[i]);var s=this;return t.history.route(e,function(r){var a=s._extractParameters(e,r);n&&n.apply(s,a),s.trigger.apply(s,["route:"+i].concat(a)),s.trigger("route",i,a),t.history.trigger("route",s,i,a)}),this},navigate:function(e,i){return t.history.navigate(e,i),this},_bindRoutes:function(){if(this.routes){this.routes=a.result(this,"routes");for(var t,e=a.keys(this.routes);null!=(t=e.pop());)this.route(t,this.routes[t])}},_routeToRegExp:function(t){return t=t.replace(H,"\\$&").replace(T,"(?:$1)?").replace(S,function(t,e){return e?t:"([^/]+)"}).replace($,"(.*?)"),new RegExp("^"+t+"$")},_extractParameters:function(t,e){var i=t.exec(e).slice(1);return a.map(i,function(t){return t?decodeURIComponent(t):null})}});var A=t.History=function(){this.handlers=[],a.bindAll(this,"checkUrl"),"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)},I=/^[#\/]|\s+$/g,N=/^\/+|\/+$/g,O=/msie [\w.]+/,P=/\/$/,C=/[?#].*$/;A.started=!1,a.extend(A.prototype,o,{interval:50,getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(null==t)if(this._hasPushState||!this._wantsHashChange||e){t=this.location.pathname;var i=this.root.replace(P,"");t.indexOf(i)||(t=t.slice(i.length))}else t=this.getHash();return t.replace(I,"")},start:function(e){if(A.started)throw new Error("Backbone.history has already been started");A.started=!0,this.options=a.extend({root:"/"},this.options,e),this.root=this.options.root,this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var i=this.getFragment(),n=document.documentMode,s=O.exec(navigator.userAgent.toLowerCase())&&(!n||7>=n);this.root=("/"+this.root+"/").replace(N,"/"),s&&this._wantsHashChange&&(this.iframe=t.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(i)),this._hasPushState?t.$(window).on("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!s?t.$(window).on("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=i;var r=this.location,o=r.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!o)return this.fragment=this.getFragment(null,!0),this.location.replace(this.root+this.location.search+"#"+this.fragment),!0;this._hasPushState&&o&&r.hash&&(this.fragment=this.getHash().replace(I,""),this.history.replaceState({},document.title,this.root+this.fragment+r.search))}return this.options.silent?void 0:this.loadUrl()},stop:function(){t.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl),clearInterval(this._checkUrlInterval),A.started=!1},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(){var t=this.getFragment();return t===this.fragment&&this.iframe&&(t=this.getFragment(this.getHash(this.iframe))),t===this.fragment?!1:(this.iframe&&this.navigate(t),void this.loadUrl())},loadUrl:function(t){return t=this.fragment=this.getFragment(t),a.any(this.handlers,function(e){return e.route.test(t)?(e.callback(t),!0):void 0})},navigate:function(t,e){if(!A.started)return!1;e&&e!==!0||(e={trigger:!!e});var i=this.root+(t=this.getFragment(t||""));if(t=t.replace(C,""),this.fragment!==t){if(this.fragment=t,""===t&&"/"!==i&&(i=i.slice(0,-1)),this._hasPushState)this.history[e.replace?"replaceState":"pushState"]({},document.title,i);else{if(!this._wantsHashChange)return this.location.assign(i);this._updateHash(this.location,t,e.replace),this.iframe&&t!==this.getFragment(this.getHash(this.iframe))&&(e.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,t,e.replace))}return e.trigger?this.loadUrl(t):void 0}},_updateHash:function(t,e,i){if(i){var n=t.href.replace(/(javascript:|#).*$/,"");t.replace(n+"#"+e)}else t.hash="#"+e}}),t.history=new A;var j=function(t,e){var i,n=this;i=t&&a.has(t,"constructor")?t.constructor:function(){return n.apply(this,arguments)},a.extend(i,n,e);var s=function(){this.constructor=i};return s.prototype=n.prototype,i.prototype=new s,t&&a.extend(i.prototype,t),i.__super__=n.prototype,i};d.extend=p.extend=k.extend=_.extend=A.extend=j;var R=function(){throw new Error('A "url" property or function must be specified')},U=function(t,e){var i=e.error;e.error=function(n){i&&i(t,n,e),t.trigger("error",t,n,e)}}}.call(this),n("undefined"!=typeof Backbone?Backbone:window.Backbone)}).call(global,void 0,void 0,void 0,function(t){module.exports=t});}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"underscore":"s+Ot9H"}],"backbone":[function(require,module,exports){
module.exports=require('4NNQbm');
},{}],"Cz4Dm0":[function(require,module,exports){
(function (global){(function(e,t,n,r){!function(t,r){function i(e){var t=e.length,n=pt.type(e);return pt.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}function o(e){var t=St[e]={};return pt.each(e.match(ht)||[],function(e,n){t[n]=!0}),t}function a(e,t,n,i){if(pt.acceptData(e)){var o,a,s=pt.expando,u=e.nodeType,l=u?pt.cache:e,c=u?e[s]:e[s]&&s;if(c&&l[c]&&(i||l[c].data)||n!==r||"string"!=typeof t)return c||(c=u?e[s]=rt.pop()||pt.guid++:s),l[c]||(l[c]=u?{}:{toJSON:pt.noop}),("object"==typeof t||"function"==typeof t)&&(i?l[c]=pt.extend(l[c],t):l[c].data=pt.extend(l[c].data,t)),a=l[c],i||(a.data||(a.data={}),a=a.data),n!==r&&(a[pt.camelCase(t)]=n),"string"==typeof t?(o=a[t],null==o&&(o=a[pt.camelCase(t)])):o=a,o}}function s(e,t,n){if(pt.acceptData(e)){var r,i,o=e.nodeType,a=o?pt.cache:e,s=o?e[pt.expando]:pt.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){pt.isArray(t)?t=t.concat(pt.map(t,pt.camelCase)):t in r?t=[t]:(t=pt.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;for(;i--;)delete r[t[i]];if(n?!l(r):!pt.isEmptyObject(r))return}(n||(delete a[s].data,l(a[s])))&&(o?pt.cleanData([e],!0):pt.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}function u(e,t,n){if(n===r&&1===e.nodeType){var i="data-"+t.replace(jt,"-$1").toLowerCase();if(n=e.getAttribute(i),"string"==typeof n){try{n="true"===n?!0:"false"===n?!1:"null"===n?null:+n+""===n?+n:At.test(n)?pt.parseJSON(n):n}catch(o){}pt.data(e,t,n)}else n=r}return n}function l(e){var t;for(t in e)if(("data"!==t||!pt.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}function c(){return!0}function f(){return!1}function p(){try{return K.activeElement}catch(e){}}function d(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}function h(e,t,n){if(pt.isFunction(t))return pt.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return pt.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(zt.test(t))return pt.filter(t,e,n);t=pt.filter(t,e)}return pt.grep(e,function(e){return pt.inArray(e,t)>=0!==n})}function g(e){var t=Yt.split("|"),n=e.createDocumentFragment();if(n.createElement)for(;t.length;)n.createElement(t.pop());return n}function m(e,t){return pt.nodeName(e,"table")&&pt.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function y(e){return e.type=(null!==pt.find.attr(e,"type"))+"/"+e.type,e}function v(e){var t=sn.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function b(e,t){for(var n,r=0;null!=(n=e[r]);r++)pt._data(n,"globalEval",!t||pt._data(t[r],"globalEval"))}function x(e,t){if(1===t.nodeType&&pt.hasData(e)){var n,r,i,o=pt._data(e),a=pt._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)pt.event.add(t,n,s[n][r])}a.data&&(a.data=pt.extend({},a.data))}}function T(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!pt.support.noCloneEvent&&t[pt.expando]){i=pt._data(t);for(r in i.events)pt.removeEvent(t,r,i.handle);t.removeAttribute(pt.expando)}"script"===n&&t.text!==e.text?(y(t).text=e.text,v(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),pt.support.html5Clone&&e.innerHTML&&!pt.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&rn.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}function w(e,t){var n,i,o=0,a=typeof e.getElementsByTagName!==G?e.getElementsByTagName(t||"*"):typeof e.querySelectorAll!==G?e.querySelectorAll(t||"*"):r;if(!a)for(a=[],n=e.childNodes||e;null!=(i=n[o]);o++)!t||pt.nodeName(i,t)?a.push(i):pt.merge(a,w(i,t));return t===r||t&&pt.nodeName(e,t)?pt.merge([e],a):a}function C(e){rn.test(e.type)&&(e.defaultChecked=e.checked)}function N(e,t){if(t in e)return t;for(var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Sn.length;i--;)if(t=Sn[i]+n,t in e)return t;return r}function k(e,t){return e=t||e,"none"===pt.css(e,"display")||!pt.contains(e.ownerDocument,e)}function E(e,t){for(var n,r,i,o=[],a=0,s=e.length;s>a;a++)r=e[a],r.style&&(o[a]=pt._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&k(r)&&(o[a]=pt._data(r,"olddisplay",D(r.nodeName)))):o[a]||(i=k(r),(n&&"none"!==n||!i)&&pt._data(r,"olddisplay",i?n:pt.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}function S(e,t,n){var r=xn.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function A(e,t,n,r,i){for(var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;4>o;o+=2)"margin"===n&&(a+=pt.css(e,n+En[o],!0,i)),r?("content"===n&&(a-=pt.css(e,"padding"+En[o],!0,i)),"margin"!==n&&(a-=pt.css(e,"border"+En[o]+"Width",!0,i))):(a+=pt.css(e,"padding"+En[o],!0,i),"padding"!==n&&(a+=pt.css(e,"border"+En[o]+"Width",!0,i)));return a}function j(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=dn(e),a=pt.support.boxSizing&&"border-box"===pt.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=hn(e,t,o),(0>i||null==i)&&(i=e.style[t]),Tn.test(i))return i;r=a&&(pt.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+A(e,t,n||(a?"border":"content"),r,o)+"px"}function D(e){var t=K,n=Cn[e];return n||(n=L(e,t),"none"!==n&&n||(pn=(pn||pt("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(pn[0].contentWindow||pn[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=L(e,t),pn.detach()),Cn[e]=n),n}function L(e,t){var n=pt(t.createElement(e)).appendTo(t.body),r=pt.css(n[0],"display");return n.remove(),r}function H(e,t,n,r){var i;if(pt.isArray(t))pt.each(t,function(t,i){n||jn.test(e)?r(e,i):H(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==pt.type(t))r(e,t);else for(i in t)H(e+"["+i+"]",t[i],n,r)}function q(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(ht)||[];if(pt.isFunction(n))for(;r=o[i++];)"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function _(e,t,n,i){function o(u){var l;return a[u]=!0,pt.each(e[u]||[],function(e,u){var c=u(t,n,i);return"string"!=typeof c||s||a[c]?s?!(l=c):r:(t.dataTypes.unshift(c),o(c),!1)}),l}var a={},s=e===Un;return o(t.dataTypes[0])||!a["*"]&&o("*")}function M(e,t){var n,i,o=pt.ajaxSettings.flatOptions||{};for(i in t)t[i]!==r&&((o[i]?e:n||(n={}))[i]=t[i]);return n&&pt.extend(!0,e,n),e}function O(e,t,n){for(var i,o,a,s,u=e.contents,l=e.dataTypes;"*"===l[0];)l.shift(),o===r&&(o=e.mimeType||t.getResponseHeader("Content-Type"));if(o)for(s in u)if(u[s]&&u[s].test(o)){l.unshift(s);break}if(l[0]in n)a=l[0];else{for(s in n){if(!l[0]||e.converters[s+" "+l[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==l[0]&&l.unshift(a),n[a]):r}function F(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];for(o=c.shift();o;)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(a=l[u+" "+o]||l["* "+o],!a)for(i in l)if(s=i.split(" "),s[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){a===!0?a=l[i]:l[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(f){return{state:"parsererror",error:a?f:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}function B(){try{return new t.XMLHttpRequest}catch(e){}}function P(){try{return new t.ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}function R(){return setTimeout(function(){tr=r}),tr=pt.now()}function W(e,t,n){for(var r,i=(sr[t]||[]).concat(sr["*"]),o=0,a=i.length;a>o;o++)if(r=i[o].call(n,t,e))return r}function $(e,t,n){var r,i,o=0,a=ar.length,s=pt.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=tr||R(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,a=0,u=l.tweens.length;u>a;a++)l.tweens[a].run(o);return s.notifyWith(e,[l,o,n]),1>o&&u?n:(s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:pt.extend({},t),opts:pt.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:tr||R(),duration:n.duration,tweens:[],createTween:function(t,n){var r=pt.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?s.resolveWith(e,[l,t]):s.rejectWith(e,[l,t]),this}}),c=l.props;for(I(c,l.opts.specialEasing);a>o;o++)if(r=ar[o].call(l,e,c,l.opts))return r;return pt.map(c,W,l),pt.isFunction(l.opts.start)&&l.opts.start.call(e,l),pt.fx.timer(pt.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function I(e,t){var n,r,i,o,a;for(n in e)if(r=pt.camelCase(n),i=t[r],o=e[n],pt.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=pt.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function z(e,t,n){var r,i,o,a,s,u,l=this,c={},f=e.style,p=e.nodeType&&k(e),d=pt._data(e,"fxshow");n.queue||(s=pt._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,u=s.empty.fire,s.empty.fire=function(){s.unqueued||u()}),s.unqueued++,l.always(function(){l.always(function(){s.unqueued--,pt.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[f.overflow,f.overflowX,f.overflowY],"inline"===pt.css(e,"display")&&"none"===pt.css(e,"float")&&(pt.support.inlineBlockNeedsLayout&&"inline"!==D(e.nodeName)?f.zoom=1:f.display="inline-block")),n.overflow&&(f.overflow="hidden",pt.support.shrinkWrapBlocks||l.always(function(){f.overflow=n.overflow[0],f.overflowX=n.overflow[1],f.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],rr.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(p?"hide":"show"))continue;c[r]=d&&d[r]||pt.style(e,r)}if(!pt.isEmptyObject(c)){d?"hidden"in d&&(p=d.hidden):d=pt._data(e,"fxshow",{}),o&&(d.hidden=!p),p?pt(e).show():l.done(function(){pt(e).hide()}),l.done(function(){var t;pt._removeData(e,"fxshow");for(t in c)pt.style(e,t,c[t])});for(r in c)a=W(p?d[r]:0,r,l),r in d||(d[r]=a.start,p&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function X(e,t,n,r,i){return new X.prototype.init(e,t,n,r,i)}function U(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=En[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function V(e){return pt.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}var Y,J,G=typeof r,Q=t.location,K=t.document,Z=K.documentElement,et=t.jQuery,tt=t.$,nt={},rt=[],it="1.10.2",ot=rt.concat,at=rt.push,st=rt.slice,ut=rt.indexOf,lt=nt.toString,ct=nt.hasOwnProperty,ft=it.trim,pt=function(e,t){return new pt.fn.init(e,t,J)},dt=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ht=/\S+/g,gt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,mt=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,yt=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,vt=/^[\],:{}\s]*$/,bt=/(?:^|:|,)(?:\s*\[)+/g,xt=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,Tt=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,wt=/^-ms-/,Ct=/-([\da-z])/gi,Nt=function(e,t){return t.toUpperCase()},kt=function(e){(K.addEventListener||"load"===e.type||"complete"===K.readyState)&&(Et(),pt.ready())},Et=function(){K.addEventListener?(K.removeEventListener("DOMContentLoaded",kt,!1),t.removeEventListener("load",kt,!1)):(K.detachEvent("onreadystatechange",kt),t.detachEvent("onload",kt))};pt.fn=pt.prototype={jquery:it,constructor:pt,init:function(e,t,n){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:mt.exec(e),!i||!i[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(i[1]){if(t=t instanceof pt?t[0]:t,pt.merge(this,pt.parseHTML(i[1],t&&t.nodeType?t.ownerDocument||t:K,!0)),yt.test(i[1])&&pt.isPlainObject(t))for(i in t)pt.isFunction(this[i])?this[i](t[i]):this.attr(i,t[i]);return this}if(o=K.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return n.find(e);this.length=1,this[0]=o}return this.context=K,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):pt.isFunction(e)?n.ready(e):(e.selector!==r&&(this.selector=e.selector,this.context=e.context),pt.makeArray(e,this))},selector:"",length:0,toArray:function(){return st.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=pt.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return pt.each(this,e,t)},ready:function(e){return pt.ready.promise().done(e),this},slice:function(){return this.pushStack(st.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(pt.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:at,sort:[].sort,splice:[].splice},pt.fn.init.prototype=pt.fn,pt.extend=pt.fn.extend=function(){var e,t,n,i,o,a,s=arguments[0]||{},u=1,l=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},u=2),"object"==typeof s||pt.isFunction(s)||(s={}),l===u&&(s=this,--u);l>u;u++)if(null!=(o=arguments[u]))for(i in o)e=s[i],n=o[i],s!==n&&(c&&n&&(pt.isPlainObject(n)||(t=pt.isArray(n)))?(t?(t=!1,a=e&&pt.isArray(e)?e:[]):a=e&&pt.isPlainObject(e)?e:{},s[i]=pt.extend(c,a,n)):n!==r&&(s[i]=n));return s},pt.extend({expando:"jQuery"+(it+Math.random()).replace(/\D/g,""),noConflict:function(e){return t.$===pt&&(t.$=tt),e&&t.jQuery===pt&&(t.jQuery=et),pt},isReady:!1,readyWait:1,holdReady:function(e){e?pt.readyWait++:pt.ready(!0)},ready:function(e){if(e===!0?!--pt.readyWait:!pt.isReady){if(!K.body)return setTimeout(pt.ready);pt.isReady=!0,e!==!0&&--pt.readyWait>0||(Y.resolveWith(K,[pt]),pt.fn.trigger&&pt(K).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===pt.type(e)},isArray:Array.isArray||function(e){return"array"===pt.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?nt[lt.call(e)]||"object":typeof e},isPlainObject:function(e){var t;if(!e||"object"!==pt.type(e)||e.nodeType||pt.isWindow(e))return!1;try{if(e.constructor&&!ct.call(e,"constructor")&&!ct.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}if(pt.support.ownLast)for(t in e)return ct.call(e,t);for(t in e);return t===r||ct.call(e,t)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||K;var r=yt.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=pt.buildFragment([e],t,i),i&&pt(i).remove(),pt.merge([],r.childNodes))},parseJSON:function(e){return t.JSON&&t.JSON.parse?t.JSON.parse(e):null===e?e:"string"==typeof e&&(e=pt.trim(e),e&&vt.test(e.replace(xt,"@").replace(Tt,"]").replace(bt,"")))?Function("return "+e)():(pt.error("Invalid JSON: "+e),r)},parseXML:function(e){var n,i;if(!e||"string"!=typeof e)return null;try{t.DOMParser?(i=new DOMParser,n=i.parseFromString(e,"text/xml")):(n=new ActiveXObject("Microsoft.XMLDOM"),n.async="false",n.loadXML(e))}catch(o){n=r}return n&&n.documentElement&&!n.getElementsByTagName("parsererror").length||pt.error("Invalid XML: "+e),n},noop:function(){},globalEval:function(e){e&&pt.trim(e)&&(t.execScript||function(e){t.eval.call(t,e)})(e)},camelCase:function(e){return e.replace(wt,"ms-").replace(Ct,Nt)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,o=0,a=e.length,s=i(e);if(n){if(s)for(;a>o&&(r=t.apply(e[o],n),r!==!1);o++);else for(o in e)if(r=t.apply(e[o],n),r===!1)break}else if(s)for(;a>o&&(r=t.call(e[o],o,e[o]),r!==!1);o++);else for(o in e)if(r=t.call(e[o],o,e[o]),r===!1)break;return e},trim:ft&&!ft.call("﻿ ")?function(e){return null==e?"":ft.call(e)}:function(e){return null==e?"":(e+"").replace(gt,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(i(Object(e))?pt.merge(n,"string"==typeof e?[e]:e):at.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(ut)return ut.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,t){var n=t.length,i=e.length,o=0;if("number"==typeof n)for(;n>o;o++)e[i++]=t[o];else for(;t[o]!==r;)e[i++]=t[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,o=0,a=e.length,s=i(e),u=[];if(s)for(;a>o;o++)r=t(e[o],o,n),null!=r&&(u[u.length]=r);else for(o in e)r=t(e[o],o,n),null!=r&&(u[u.length]=r);return ot.apply([],u)},guid:1,proxy:function(e,t){var n,i,o;return"string"==typeof t&&(o=e[t],t=e,e=o),pt.isFunction(e)?(n=st.call(arguments,2),i=function(){return e.apply(t||this,n.concat(st.call(arguments)))},i.guid=e.guid=e.guid||pt.guid++,i):r},access:function(e,t,n,i,o,a,s){var u=0,l=e.length,c=null==n;if("object"===pt.type(n)){o=!0;for(u in n)pt.access(e,t,u,n[u],!0,a,s)}else if(i!==r&&(o=!0,pt.isFunction(i)||(s=!0),c&&(s?(t.call(e,i),t=null):(c=t,t=function(e,t,n){return c.call(pt(e),n)})),t))for(;l>u;u++)t(e[u],n,s?i:i.call(e[u],u,t(e[u],n)));return o?e:c?t.call(e):l?t(e[0],n):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),pt.ready.promise=function(e){if(!Y)if(Y=pt.Deferred(),"complete"===K.readyState)setTimeout(pt.ready);else if(K.addEventListener)K.addEventListener("DOMContentLoaded",kt,!1),t.addEventListener("load",kt,!1);else{K.attachEvent("onreadystatechange",kt),t.attachEvent("onload",kt);var n=!1;try{n=null==t.frameElement&&K.documentElement}catch(r){}n&&n.doScroll&&function i(){if(!pt.isReady){try{n.doScroll("left")}catch(e){return setTimeout(i,50)}Et(),pt.ready()}}()}return Y.promise(e)},pt.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){nt["[object "+t+"]"]=t.toLowerCase()}),J=pt(K),function(e,t){function n(e,t,n,r){var i,o,a,s,u,l,c,f,h,g;if((t?t.ownerDocument||t:R)!==H&&L(t),t=t||H,n=n||[],!e||"string"!=typeof e)return n;if(1!==(s=t.nodeType)&&9!==s)return[];if(_&&!r){if(i=bt.exec(e))if(a=i[1]){if(9===s){if(o=t.getElementById(a),!o||!o.parentNode)return n;if(o.id===a)return n.push(o),n}else if(t.ownerDocument&&(o=t.ownerDocument.getElementById(a))&&B(t,o)&&o.id===a)return n.push(o),n}else{if(i[2])return et.apply(n,t.getElementsByTagName(e)),n;if((a=i[3])&&C.getElementsByClassName&&t.getElementsByClassName)return et.apply(n,t.getElementsByClassName(a)),n}if(C.qsa&&(!M||!M.test(e))){if(f=c=P,h=t,g=9===s&&e,1===s&&"object"!==t.nodeName.toLowerCase()){for(l=p(e),(c=t.getAttribute("id"))?f=c.replace(wt,"\\$&"):t.setAttribute("id",f),f="[id='"+f+"'] ",u=l.length;u--;)l[u]=f+d(l[u]);h=dt.test(e)&&t.parentNode||t,g=l.join(",")}if(g)try{return et.apply(n,h.querySelectorAll(g)),n}catch(m){}finally{c||t.removeAttribute("id")}}}return T(e.replace(lt,"$1"),t,n,r)}function r(){function e(n,r){return t.push(n+=" ")>k.cacheLength&&delete e[t.shift()],e[n]=r}var t=[];return e}function i(e){return e[P]=!0,e}function o(e){var t=H.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function a(e,t){for(var n=e.split("|"),r=e.length;r--;)k.attrHandle[n[r]]=t}function s(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||J)-(~e.sourceIndex||J);if(r)return r;if(n)for(;n=n.nextSibling;)if(n===t)return-1;return e?1:-1}function u(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function l(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function c(e){return i(function(t){return t=+t,i(function(n,r){for(var i,o=e([],n.length,t),a=o.length;a--;)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function f(){}function p(e,t){var r,i,o,a,s,u,l,c=z[e+" "];if(c)return t?0:c.slice(0);for(s=e,u=[],l=k.preFilter;s;){(!r||(i=ct.exec(s)))&&(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),r=!1,(i=ft.exec(s))&&(r=i.shift(),o.push({value:r,type:i[0].replace(lt," ")}),s=s.slice(r.length));for(a in k.filter)!(i=yt[a].exec(s))||l[a]&&!(i=l[a](i))||(r=i.shift(),o.push({value:r,type:a,matches:i}),s=s.slice(r.length));if(!r)break}return t?s.length:s?n.error(e):z(e,u).slice(0)}function d(e){for(var t=0,n=e.length,r="";n>t;t++)r+=e[t].value;return r}function h(e,t,n){var r=t.dir,i=n&&"parentNode"===r,o=$++;return t.first?function(t,n,o){for(;t=t[r];)if(1===t.nodeType||i)return e(t,n,o)}:function(t,n,a){var s,u,l,c=W+" "+o;if(a){for(;t=t[r];)if((1===t.nodeType||i)&&e(t,n,a))return!0}else for(;t=t[r];)if(1===t.nodeType||i)if(l=t[P]||(t[P]={}),(u=l[r])&&u[0]===c){if((s=u[1])===!0||s===N)return s===!0}else if(u=l[r]=[c],u[1]=e(t,n,a)||N,u[1]===!0)return!0}}function g(e){return e.length>1?function(t,n,r){for(var i=e.length;i--;)if(!e[i](t,n,r))return!1;return!0}:e[0]}function m(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;u>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),l&&t.push(s));return a}function y(e,t,n,r,o,a){return r&&!r[P]&&(r=y(r)),o&&!o[P]&&(o=y(o,a)),i(function(i,a,s,u){var l,c,f,p=[],d=[],h=a.length,g=i||x(t||"*",s.nodeType?[s]:s,[]),y=!e||!i&&t?g:m(g,p,e,s,u),v=n?o||(i?e:h||r)?[]:a:y;if(n&&n(y,v,s,u),r)for(l=m(v,d),r(l,[],s,u),c=l.length;c--;)(f=l[c])&&(v[d[c]]=!(y[d[c]]=f));if(i){if(o||e){if(o){for(l=[],c=v.length;c--;)(f=v[c])&&l.push(y[c]=f);o(null,v=[],l,u)}for(c=v.length;c--;)(f=v[c])&&(l=o?nt.call(i,f):p[c])>-1&&(i[l]=!(a[l]=f))}}else v=m(v===a?v.splice(h,v.length):v),o?o(null,a,v,u):et.apply(a,v)})}function v(e){for(var t,n,r,i=e.length,o=k.relative[e[0].type],a=o||k.relative[" "],s=o?1:0,u=h(function(e){return e===t},a,!0),l=h(function(e){return nt.call(t,e)>-1},a,!0),c=[function(e,n,r){return!o&&(r||n!==j)||((t=n).nodeType?u(e,n,r):l(e,n,r))}];i>s;s++)if(n=k.relative[e[s].type])c=[h(g(c),n)];else{if(n=k.filter[e[s].type].apply(null,e[s].matches),n[P]){for(r=++s;i>r&&!k.relative[e[r].type];r++);return y(s>1&&g(c),s>1&&d(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace(lt,"$1"),n,r>s&&v(e.slice(s,r)),i>r&&v(e=e.slice(r)),i>r&&d(e))}c.push(n)}return g(c)}function b(e,t){var r=0,o=t.length>0,a=e.length>0,s=function(i,s,u,l,c){var f,p,d,h=[],g=0,y="0",v=i&&[],b=null!=c,x=j,T=i||a&&k.find.TAG("*",c&&s.parentNode||s),w=W+=null==x?1:Math.random()||.1;for(b&&(j=s!==H&&s,N=r);null!=(f=T[y]);y++){if(a&&f){for(p=0;d=e[p++];)if(d(f,s,u)){l.push(f);break}b&&(W=w,N=++r)}o&&((f=!d&&f)&&g--,i&&v.push(f))}if(g+=y,o&&y!==g){for(p=0;d=t[p++];)d(v,h,s,u);if(i){if(g>0)for(;y--;)v[y]||h[y]||(h[y]=K.call(l));h=m(h)}et.apply(l,h),b&&!i&&h.length>0&&g+t.length>1&&n.uniqueSort(l)}return b&&(W=w,j=x),v};return o?i(s):s}function x(e,t,r){for(var i=0,o=t.length;o>i;i++)n(e,t[i],r);return r}function T(e,t,n,r){var i,o,a,s,u,l=p(e);if(!r&&1===l.length){if(o=l[0]=l[0].slice(0),o.length>2&&"ID"===(a=o[0]).type&&C.getById&&9===t.nodeType&&_&&k.relative[o[1].type]){if(t=(k.find.ID(a.matches[0].replace(Ct,Nt),t)||[])[0],!t)return n;e=e.slice(o.shift().value.length)}for(i=yt.needsContext.test(e)?0:o.length;i--&&(a=o[i],!k.relative[s=a.type]);)if((u=k.find[s])&&(r=u(a.matches[0].replace(Ct,Nt),dt.test(o[0].type)&&t.parentNode||t))){if(o.splice(i,1),e=r.length&&d(o),!e)return et.apply(n,r),n;break}}return A(e,l)(r,t,!_,n,dt.test(e)),n}var w,C,N,k,E,S,A,j,D,L,H,q,_,M,O,F,B,P="sizzle"+-new Date,R=e.document,W=0,$=0,I=r(),z=r(),X=r(),U=!1,V=function(e,t){return e===t?(U=!0,0):0},Y=typeof t,J=1<<31,G={}.hasOwnProperty,Q=[],K=Q.pop,Z=Q.push,et=Q.push,tt=Q.slice,nt=Q.indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(this[t]===e)return t;return-1},rt="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",it="[\\x20\\t\\r\\n\\f]",ot="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",at=ot.replace("w","w#"),st="\\["+it+"*("+ot+")"+it+"*(?:([*^$|!~]?=)"+it+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+at+")|)|)"+it+"*\\]",ut=":("+ot+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+st.replace(3,8)+")*)|.*)\\)|)",lt=RegExp("^"+it+"+|((?:^|[^\\\\])(?:\\\\.)*)"+it+"+$","g"),ct=RegExp("^"+it+"*,"+it+"*"),ft=RegExp("^"+it+"*([>+~]|"+it+")"+it+"*"),dt=RegExp(it+"*[+~]"),ht=RegExp("="+it+"*([^\\]'\"]*)"+it+"*\\]","g"),gt=RegExp(ut),mt=RegExp("^"+at+"$"),yt={ID:RegExp("^#("+ot+")"),CLASS:RegExp("^\\.("+ot+")"),TAG:RegExp("^("+ot.replace("w","w*")+")"),ATTR:RegExp("^"+st),PSEUDO:RegExp("^"+ut),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+it+"*(even|odd|(([+-]|)(\\d*)n|)"+it+"*(?:([+-]|)"+it+"*(\\d+)|))"+it+"*\\)|)","i"),bool:RegExp("^(?:"+rt+")$","i"),needsContext:RegExp("^"+it+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+it+"*((?:-\\d)?\\d*)"+it+"*\\)|)(?=[^-]|$)","i")},vt=/^[^{]+\{\s*\[native \w/,bt=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,xt=/^(?:input|select|textarea|button)$/i,Tt=/^h\d$/i,wt=/'|\\/g,Ct=RegExp("\\\\([\\da-f]{1,6}"+it+"?|("+it+")|.)","ig"),Nt=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{et.apply(Q=tt.call(R.childNodes),R.childNodes),Q[R.childNodes.length].nodeType}catch(kt){et={apply:Q.length?function(e,t){Z.apply(e,tt.call(t))}:function(e,t){for(var n=e.length,r=0;e[n++]=t[r++];);e.length=n-1}}}S=n.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},C=n.support={},L=n.setDocument=function(e){var n=e?e.ownerDocument||e:R,r=n.defaultView;return n!==H&&9===n.nodeType&&n.documentElement?(H=n,q=n.documentElement,_=!S(n),r&&r.attachEvent&&r!==r.top&&r.attachEvent("onbeforeunload",function(){L()}),C.attributes=o(function(e){return e.className="i",!e.getAttribute("className")}),C.getElementsByTagName=o(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),C.getElementsByClassName=o(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),C.getById=o(function(e){return q.appendChild(e).id=P,!n.getElementsByName||!n.getElementsByName(P).length}),C.getById?(k.find.ID=function(e,t){if(typeof t.getElementById!==Y&&_){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},k.filter.ID=function(e){var t=e.replace(Ct,Nt);return function(e){return e.getAttribute("id")===t}}):(delete k.find.ID,k.filter.ID=function(e){var t=e.replace(Ct,Nt);return function(e){var n=typeof e.getAttributeNode!==Y&&e.getAttributeNode("id");return n&&n.value===t}}),k.find.TAG=C.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==Y?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){for(;n=o[i++];)1===n.nodeType&&r.push(n);return r}return o},k.find.CLASS=C.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==Y&&_?n.getElementsByClassName(e):t},O=[],M=[],(C.qsa=vt.test(n.querySelectorAll))&&(o(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||M.push("\\["+it+"*(?:value|"+rt+")"),e.querySelectorAll(":checked").length||M.push(":checked")}),o(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&M.push("[*^$]="+it+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||M.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),M.push(",.*:")})),(C.matchesSelector=vt.test(F=q.webkitMatchesSelector||q.mozMatchesSelector||q.oMatchesSelector||q.msMatchesSelector))&&o(function(e){C.disconnectedMatch=F.call(e,"div"),F.call(e,"[s!='']:x"),O.push("!=",ut)}),M=M.length&&RegExp(M.join("|")),O=O.length&&RegExp(O.join("|")),B=vt.test(q.contains)||q.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)for(;t=t.parentNode;)if(t===e)return!0;return!1},V=q.compareDocumentPosition?function(e,t){if(e===t)return U=!0,0;var r=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return r?1&r||!C.sortDetached&&t.compareDocumentPosition(e)===r?e===n||B(R,e)?-1:t===n||B(R,t)?1:D?nt.call(D,e)-nt.call(D,t):0:4&r?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,u=[e],l=[t];if(e===t)return U=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:D?nt.call(D,e)-nt.call(D,t):0;if(o===a)return s(e,t);for(r=e;r=r.parentNode;)u.unshift(r);for(r=t;r=r.parentNode;)l.unshift(r);for(;u[i]===l[i];)i++;return i?s(u[i],l[i]):u[i]===R?-1:l[i]===R?1:0},n):H},n.matches=function(e,t){return n(e,null,null,t)},n.matchesSelector=function(e,t){if((e.ownerDocument||e)!==H&&L(e),t=t.replace(ht,"='$1']"),!(!C.matchesSelector||!_||O&&O.test(t)||M&&M.test(t)))try{var r=F.call(e,t);if(r||C.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(i){}return n(t,H,null,[e]).length>0},n.contains=function(e,t){return(e.ownerDocument||e)!==H&&L(e),B(e,t)},n.attr=function(e,n){(e.ownerDocument||e)!==H&&L(e);var r=k.attrHandle[n.toLowerCase()],i=r&&G.call(k.attrHandle,n.toLowerCase())?r(e,n,!_):t;return i===t?C.attributes||!_?e.getAttribute(n):(i=e.getAttributeNode(n))&&i.specified?i.value:null:i},n.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},n.uniqueSort=function(e){var t,n=[],r=0,i=0;if(U=!C.detectDuplicates,D=!C.sortStable&&e.slice(0),e.sort(V),U){for(;t=e[i++];)t===e[i]&&(r=n.push(i));for(;r--;)e.splice(n[r],1)}return e},E=n.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=E(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=E(t);return n},k=n.selectors={cacheLength:50,createPseudo:i,match:yt,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Ct,Nt),e[3]=(e[4]||e[5]||"").replace(Ct,Nt),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||n.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&n.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return yt.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&gt.test(r)&&(n=p(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Ct,Nt).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=I[e+" "];return t||(t=RegExp("(^|"+it+")"+e+"("+it+"|$)"))&&I(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==Y&&e.getAttribute("class")||"")})},ATTR:function(e,t,r){return function(i){var o=n.attr(i,e);return null==o?"!="===t:t?(o+="","="===t?o===r:"!="===t?o!==r:"^="===t?r&&0===o.indexOf(r):"*="===t?r&&o.indexOf(r)>-1:"$="===t?r&&o.slice(-r.length)===r:"~="===t?(" "+o+" ").indexOf(r)>-1:"|="===t?o===r||o.slice(0,r.length+1)===r+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!u&&!s;
if(m){if(o){for(;g;){for(f=t;f=f[g];)if(s?f.nodeName.toLowerCase()===y:1===f.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){for(c=m[P]||(m[P]={}),l=c[e]||[],d=l[0]===W&&l[1],p=l[0]===W&&l[2],f=d&&m.childNodes[d];f=++d&&f&&f[g]||(p=d=0)||h.pop();)if(1===f.nodeType&&++p&&f===t){c[e]=[W,d,p];break}}else if(v&&(l=(t[P]||(t[P]={}))[e])&&l[0]===W)p=l[1];else for(;(f=++d&&f&&f[g]||(p=d=0)||h.pop())&&((s?f.nodeName.toLowerCase()!==y:1!==f.nodeType)||!++p||(v&&((f[P]||(f[P]={}))[e]=[W,p]),f!==t)););return p-=i,p===r||0===p%r&&p/r>=0}}},PSEUDO:function(e,t){var r,o=k.pseudos[e]||k.setFilters[e.toLowerCase()]||n.error("unsupported pseudo: "+e);return o[P]?o(t):o.length>1?(r=[e,e,"",t],k.setFilters.hasOwnProperty(e.toLowerCase())?i(function(e,n){for(var r,i=o(e,t),a=i.length;a--;)r=nt.call(e,i[a]),e[r]=!(n[r]=i[a])}):function(e){return o(e,0,r)}):o}},pseudos:{not:i(function(e){var t=[],n=[],r=A(e.replace(lt,"$1"));return r[P]?i(function(e,t,n,i){for(var o,a=r(e,null,i,[]),s=e.length;s--;)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:i(function(e){return function(t){return n(e,t).length>0}}),contains:i(function(e){return function(t){return(t.textContent||t.innerText||E(t)).indexOf(e)>-1}}),lang:i(function(e){return mt.test(e||"")||n.error("unsupported lang: "+e),e=e.replace(Ct,Nt).toLowerCase(),function(t){var n;do if(n=_?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===q},focus:function(e){return e===H.activeElement&&(!H.hasFocus||H.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!k.pseudos.empty(e)},header:function(e){return Tt.test(e.nodeName)},input:function(e){return xt.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:c(function(){return[0]}),last:c(function(e,t){return[t-1]}),eq:c(function(e,t,n){return[0>n?n+t:n]}),even:c(function(e,t){for(var n=0;t>n;n+=2)e.push(n);return e}),odd:c(function(e,t){for(var n=1;t>n;n+=2)e.push(n);return e}),lt:c(function(e,t,n){for(var r=0>n?n+t:n;--r>=0;)e.push(r);return e}),gt:c(function(e,t,n){for(var r=0>n?n+t:n;t>++r;)e.push(r);return e})}},k.pseudos.nth=k.pseudos.eq;for(w in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})k.pseudos[w]=u(w);for(w in{submit:!0,reset:!0})k.pseudos[w]=l(w);f.prototype=k.filters=k.pseudos,k.setFilters=new f,A=n.compile=function(e,t){var n,r=[],i=[],o=X[e+" "];if(!o){for(t||(t=p(e)),n=t.length;n--;)o=v(t[n]),o[P]?r.push(o):i.push(o);o=X(e,b(i,r))}return o},C.sortStable=P.split("").sort(V).join("")===P,C.detectDuplicates=U,L(),C.sortDetached=o(function(e){return 1&e.compareDocumentPosition(H.createElement("div"))}),o(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||a("type|href|height|width",function(e,n,r){return r?t:e.getAttribute(n,"type"===n.toLowerCase()?1:2)}),C.attributes&&o(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||a("value",function(e,n,r){return r||"input"!==e.nodeName.toLowerCase()?t:e.defaultValue}),o(function(e){return null==e.getAttribute("disabled")})||a(rt,function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&i.specified?i.value:e[n]===!0?n.toLowerCase():null}),pt.find=n,pt.expr=n.selectors,pt.expr[":"]=pt.expr.pseudos,pt.unique=n.uniqueSort,pt.text=n.getText,pt.isXMLDoc=n.isXML,pt.contains=n.contains}(t);var St={};pt.Callbacks=function(e){e="string"==typeof e?St[e]||o(e):pt.extend({},e);var t,n,i,a,s,u,l=[],c=!e.once&&[],f=function(r){for(n=e.memory&&r,i=!0,s=u||0,u=0,a=l.length,t=!0;l&&a>s;s++)if(l[s].apply(r[0],r[1])===!1&&e.stopOnFalse){n=!1;break}t=!1,l&&(c?c.length&&f(c.shift()):n?l=[]:p.disable())},p={add:function(){if(l){var r=l.length;!function i(t){pt.each(t,function(t,n){var r=pt.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})}(arguments),t?a=l.length:n&&(u=r,f(n))}return this},remove:function(){return l&&pt.each(arguments,function(e,n){for(var r;(r=pt.inArray(n,l,r))>-1;)l.splice(r,1),t&&(a>=r&&a--,s>=r&&s--)}),this},has:function(e){return e?pt.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],a=0,this},disable:function(){return l=c=n=r,this},disabled:function(){return!l},lock:function(){return c=r,n||p.disable(),this},locked:function(){return!c},fireWith:function(e,n){return!l||i&&!c||(n=n||[],n=[e,n.slice?n.slice():n],t?c.push(n):f(n)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},pt.extend({Deferred:function(e){var t=[["resolve","done",pt.Callbacks("once memory"),"resolved"],["reject","fail",pt.Callbacks("once memory"),"rejected"],["notify","progress",pt.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return pt.Deferred(function(n){pt.each(t,function(t,o){var a=o[0],s=pt.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&pt.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?pt.extend(e,r):r}},i={};return r.pipe=r.then,pt.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t,n,r,i=0,o=st.call(arguments),a=o.length,s=1!==a||e&&pt.isFunction(e.promise)?a:0,u=1===s?e:pt.Deferred(),l=function(e,n,r){return function(i){n[e]=this,r[e]=arguments.length>1?st.call(arguments):i,r===t?u.notifyWith(n,r):--s||u.resolveWith(n,r)}};if(a>1)for(t=Array(a),n=Array(a),r=Array(a);a>i;i++)o[i]&&pt.isFunction(o[i].promise)?o[i].promise().done(l(i,r,o)).fail(u.reject).progress(l(i,n,t)):--s;return s||u.resolveWith(r,o),u.promise()}}),pt.support=function(e){var n,r,i,o,a,s,u,l,c,f=K.createElement("div");if(f.setAttribute("className","t"),f.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=f.getElementsByTagName("*")||[],r=f.getElementsByTagName("a")[0],!r||!r.style||!n.length)return e;o=K.createElement("select"),s=o.appendChild(K.createElement("option")),i=f.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",e.getSetAttribute="t"!==f.className,e.leadingWhitespace=3===f.firstChild.nodeType,e.tbody=!f.getElementsByTagName("tbody").length,e.htmlSerialize=!!f.getElementsByTagName("link").length,e.style=/top/.test(r.getAttribute("style")),e.hrefNormalized="/a"===r.getAttribute("href"),e.opacity=/^0.5/.test(r.style.opacity),e.cssFloat=!!r.style.cssFloat,e.checkOn=!!i.value,e.optSelected=s.selected,e.enctype=!!K.createElement("form").enctype,e.html5Clone="<:nav></:nav>"!==K.createElement("nav").cloneNode(!0).outerHTML,e.inlineBlockNeedsLayout=!1,e.shrinkWrapBlocks=!1,e.pixelPosition=!1,e.deleteExpando=!0,e.noCloneEvent=!0,e.reliableMarginRight=!0,e.boxSizingReliable=!0,i.checked=!0,e.noCloneChecked=i.cloneNode(!0).checked,o.disabled=!0,e.optDisabled=!s.disabled;try{delete f.test}catch(p){e.deleteExpando=!1}i=K.createElement("input"),i.setAttribute("value",""),e.input=""===i.getAttribute("value"),i.value="t",i.setAttribute("type","radio"),e.radioValue="t"===i.value,i.setAttribute("checked","t"),i.setAttribute("name","t"),a=K.createDocumentFragment(),a.appendChild(i),e.appendChecked=i.checked,e.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,f.attachEvent&&(f.attachEvent("onclick",function(){e.noCloneEvent=!1}),f.cloneNode(!0).click());for(c in{submit:!0,change:!0,focusin:!0})f.setAttribute(u="on"+c,"t"),e[c+"Bubbles"]=u in t||f.attributes[u].expando===!1;f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",e.clearCloneStyle="content-box"===f.style.backgroundClip;for(c in pt(e))break;return e.ownLast="0"!==c,pt(function(){var n,r,i,o="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",a=K.getElementsByTagName("body")[0];a&&(n=K.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",a.appendChild(n).appendChild(f),f.innerHTML="<table><tr><td></td><td>t</td></tr></table>",i=f.getElementsByTagName("td"),i[0].style.cssText="padding:0;margin:0;border:0;display:none",l=0===i[0].offsetHeight,i[0].style.display="",i[1].style.display="none",e.reliableHiddenOffsets=l&&0===i[0].offsetHeight,f.innerHTML="",f.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",pt.swap(a,null!=a.style.zoom?{zoom:1}:{},function(){e.boxSizing=4===f.offsetWidth}),t.getComputedStyle&&(e.pixelPosition="1%"!==(t.getComputedStyle(f,null)||{}).top,e.boxSizingReliable="4px"===(t.getComputedStyle(f,null)||{width:"4px"}).width,r=f.appendChild(K.createElement("div")),r.style.cssText=f.style.cssText=o,r.style.marginRight=r.style.width="0",f.style.width="1px",e.reliableMarginRight=!parseFloat((t.getComputedStyle(r,null)||{}).marginRight)),typeof f.style.zoom!==G&&(f.innerHTML="",f.style.cssText=o+"width:1px;padding:1px;display:inline;zoom:1",e.inlineBlockNeedsLayout=3===f.offsetWidth,f.style.display="block",f.innerHTML="<div></div>",f.firstChild.style.width="5px",e.shrinkWrapBlocks=3!==f.offsetWidth,e.inlineBlockNeedsLayout&&(a.style.zoom=1)),a.removeChild(n),n=f=i=r=null)}),n=o=a=s=r=i=null,e}({});var At=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,jt=/([A-Z])/g;pt.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?pt.cache[e[pt.expando]]:e[pt.expando],!!e&&!l(e)},data:function(e,t,n){return a(e,t,n)},removeData:function(e,t){return s(e,t)},_data:function(e,t,n){return a(e,t,n,!0)},_removeData:function(e,t){return s(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&pt.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),pt.fn.extend({data:function(e,t){var n,i,o=null,a=0,s=this[0];if(e===r){if(this.length&&(o=pt.data(s),1===s.nodeType&&!pt._data(s,"parsedAttrs"))){for(n=s.attributes;n.length>a;a++)i=n[a].name,0===i.indexOf("data-")&&(i=pt.camelCase(i.slice(5)),u(s,i,o[i]));pt._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){pt.data(this,e)}):arguments.length>1?this.each(function(){pt.data(this,e,t)}):s?u(s,e,pt.data(s,e)):null},removeData:function(e){return this.each(function(){pt.removeData(this,e)})}}),pt.extend({queue:function(e,t,n){var i;return e?(t=(t||"fx")+"queue",i=pt._data(e,t),n&&(!i||pt.isArray(n)?i=pt._data(e,t,pt.makeArray(n)):i.push(n)),i||[]):r},dequeue:function(e,t){t=t||"fx";var n=pt.queue(e,t),r=n.length,i=n.shift(),o=pt._queueHooks(e,t),a=function(){pt.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return pt._data(e,n)||pt._data(e,n,{empty:pt.Callbacks("once memory").add(function(){pt._removeData(e,t+"queue"),pt._removeData(e,n)})})}}),pt.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),n>arguments.length?pt.queue(this[0],e):t===r?this:this.each(function(){var n=pt.queue(this,e,t);pt._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&pt.dequeue(this,e)})},dequeue:function(e){return this.each(function(){pt.dequeue(this,e)})},delay:function(e,t){return e=pt.fx?pt.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,i=1,o=pt.Deferred(),a=this,s=this.length,u=function(){--i||o.resolveWith(a,[a])};for("string"!=typeof e&&(t=e,e=r),e=e||"fx";s--;)n=pt._data(a[s],e+"queueHooks"),n&&n.empty&&(i++,n.empty.add(u));return u(),o.promise(t)}});var Dt,Lt,Ht=/[\t\r\n\f]/g,qt=/\r/g,_t=/^(?:input|select|textarea|button|object)$/i,Mt=/^(?:a|area)$/i,Ot=/^(?:checked|selected)$/i,Ft=pt.support.getSetAttribute,Bt=pt.support.input;pt.fn.extend({attr:function(e,t){return pt.access(this,pt.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){pt.removeAttr(this,e)})},prop:function(e,t){return pt.access(this,pt.prop,e,t,arguments.length>1)},removeProp:function(e){return e=pt.propFix[e]||e,this.each(function(){try{this[e]=r,delete this[e]}catch(t){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,u="string"==typeof e&&e;if(pt.isFunction(e))return this.each(function(t){pt(this).addClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(ht)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(Ht," "):" ")){for(o=0;i=t[o++];)0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=pt.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,u=0===arguments.length||"string"==typeof e&&e;if(pt.isFunction(e))return this.each(function(t){pt(this).removeClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(ht)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(Ht," "):"")){for(o=0;i=t[o++];)for(;r.indexOf(" "+i+" ")>=0;)r=r.replace(" "+i+" "," ");n.className=e?pt.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):this.each(pt.isFunction(e)?function(n){pt(this).toggleClass(e.call(this,n,this.className,t),t)}:function(){if("string"===n)for(var t,r=0,i=pt(this),o=e.match(ht)||[];t=o[r++];)i.hasClass(t)?i.removeClass(t):i.addClass(t);else(n===G||"boolean"===n)&&(this.className&&pt._data(this,"__className__",this.className),this.className=this.className||e===!1?"":pt._data(this,"__className__")||"")})},hasClass:function(e){for(var t=" "+e+" ",n=0,r=this.length;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(Ht," ").indexOf(t)>=0)return!0;return!1},val:function(e){var t,n,i,o=this[0];return arguments.length?(i=pt.isFunction(e),this.each(function(t){var o;1===this.nodeType&&(o=i?e.call(this,t,pt(this).val()):e,null==o?o="":"number"==typeof o?o+="":pt.isArray(o)&&(o=pt.map(o,function(e){return null==e?"":e+""})),n=pt.valHooks[this.type]||pt.valHooks[this.nodeName.toLowerCase()],n&&"set"in n&&n.set(this,o,"value")!==r||(this.value=o))})):o?(n=pt.valHooks[o.type]||pt.valHooks[o.nodeName.toLowerCase()],n&&"get"in n&&(t=n.get(o,"value"))!==r?t:(t=o.value,"string"==typeof t?t.replace(qt,""):null==t?"":t)):void 0}}),pt.extend({valHooks:{option:{get:function(e){var t=pt.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){for(var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,u=0>i?s:o?i:0;s>u;u++)if(n=r[u],!(!n.selected&&u!==i||(pt.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&pt.nodeName(n.parentNode,"optgroup"))){if(t=pt(n).val(),o)return t;a.push(t)}return a},set:function(e,t){for(var n,r,i=e.options,o=pt.makeArray(t),a=i.length;a--;)r=i[a],(r.selected=pt.inArray(pt(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,t,n){var i,o,a=e.nodeType;return e&&3!==a&&8!==a&&2!==a?typeof e.getAttribute===G?pt.prop(e,t,n):(1===a&&pt.isXMLDoc(e)||(t=t.toLowerCase(),i=pt.attrHooks[t]||(pt.expr.match.bool.test(t)?Lt:Dt)),n===r?i&&"get"in i&&null!==(o=i.get(e,t))?o:(o=pt.find.attr(e,t),null==o?r:o):null!==n?i&&"set"in i&&(o=i.set(e,n,t))!==r?o:(e.setAttribute(t,n+""),n):(pt.removeAttr(e,t),r)):void 0},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(ht);if(o&&1===e.nodeType)for(;n=o[i++];)r=pt.propFix[n]||n,pt.expr.match.bool.test(n)?Bt&&Ft||!Ot.test(n)?e[r]=!1:e[pt.camelCase("default-"+n)]=e[r]=!1:pt.attr(e,n,""),e.removeAttribute(Ft?n:r)},attrHooks:{type:{set:function(e,t){if(!pt.support.radioValue&&"radio"===t&&pt.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,t,n){var i,o,a,s=e.nodeType;return e&&3!==s&&8!==s&&2!==s?(a=1!==s||!pt.isXMLDoc(e),a&&(t=pt.propFix[t]||t,o=pt.propHooks[t]),n!==r?o&&"set"in o&&(i=o.set(e,n,t))!==r?i:e[t]=n:o&&"get"in o&&null!==(i=o.get(e,t))?i:e[t]):void 0},propHooks:{tabIndex:{get:function(e){var t=pt.find.attr(e,"tabindex");return t?parseInt(t,10):_t.test(e.nodeName)||Mt.test(e.nodeName)&&e.href?0:-1}}}}),Lt={set:function(e,t,n){return t===!1?pt.removeAttr(e,n):Bt&&Ft||!Ot.test(n)?e.setAttribute(!Ft&&pt.propFix[n]||n,n):e[pt.camelCase("default-"+n)]=e[n]=!0,n}},pt.each(pt.expr.match.bool.source.match(/\w+/g),function(e,t){var n=pt.expr.attrHandle[t]||pt.find.attr;pt.expr.attrHandle[t]=Bt&&Ft||!Ot.test(t)?function(e,t,i){var o=pt.expr.attrHandle[t],a=i?r:(pt.expr.attrHandle[t]=r)!=n(e,t,i)?t.toLowerCase():null;return pt.expr.attrHandle[t]=o,a}:function(e,t,n){return n?r:e[pt.camelCase("default-"+t)]?t.toLowerCase():null}}),Bt&&Ft||(pt.attrHooks.value={set:function(e,t,n){return pt.nodeName(e,"input")?(e.defaultValue=t,r):Dt&&Dt.set(e,t,n)}}),Ft||(Dt={set:function(e,t,n){var i=e.getAttributeNode(n);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(n)),i.value=t+="","value"===n||t===e.getAttribute(n)?t:r}},pt.expr.attrHandle.id=pt.expr.attrHandle.name=pt.expr.attrHandle.coords=function(e,t,n){var i;return n?r:(i=e.getAttributeNode(t))&&""!==i.value?i.value:null},pt.valHooks.button={get:function(e,t){var n=e.getAttributeNode(t);return n&&n.specified?n.value:r},set:Dt.set},pt.attrHooks.contenteditable={set:function(e,t,n){Dt.set(e,""===t?!1:t,n)}},pt.each(["width","height"],function(e,t){pt.attrHooks[t]={set:function(e,n){return""===n?(e.setAttribute(t,"auto"),n):r}}})),pt.support.hrefNormalized||pt.each(["href","src"],function(e,t){pt.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),pt.support.style||(pt.attrHooks.style={get:function(e){return e.style.cssText||r},set:function(e,t){return e.style.cssText=t+""}}),pt.support.optSelected||(pt.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),pt.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){pt.propFix[this.toLowerCase()]=this}),pt.support.enctype||(pt.propFix.enctype="encoding"),pt.each(["radio","checkbox"],function(){pt.valHooks[this]={set:function(e,t){return pt.isArray(t)?e.checked=pt.inArray(pt(e).val(),t)>=0:r}},pt.support.checkOn||(pt.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Pt=/^(?:input|select|textarea)$/i,Rt=/^key/,Wt=/^(?:mouse|contextmenu)|click/,$t=/^(?:focusinfocus|focusoutblur)$/,It=/^([^.]*)(?:\.(.+)|)$/;pt.event={global:{},add:function(e,t,n,i,o){var a,s,u,l,c,f,p,d,h,g,m,y=pt._data(e);if(y){for(n.handler&&(l=n,n=l.handler,o=l.selector),n.guid||(n.guid=pt.guid++),(s=y.events)||(s=y.events={}),(f=y.handle)||(f=y.handle=function(e){return typeof pt===G||e&&pt.event.triggered===e.type?r:pt.event.dispatch.apply(f.elem,arguments)},f.elem=e),t=(t||"").match(ht)||[""],u=t.length;u--;)a=It.exec(t[u])||[],h=m=a[1],g=(a[2]||"").split(".").sort(),h&&(c=pt.event.special[h]||{},h=(o?c.delegateType:c.bindType)||h,c=pt.event.special[h]||{},p=pt.extend({type:h,origType:m,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&pt.expr.match.needsContext.test(o),namespace:g.join(".")},l),(d=s[h])||(d=s[h]=[],d.delegateCount=0,c.setup&&c.setup.call(e,i,g,f)!==!1||(e.addEventListener?e.addEventListener(h,f,!1):e.attachEvent&&e.attachEvent("on"+h,f))),c.add&&(c.add.call(e,p),p.handler.guid||(p.handler.guid=n.guid)),o?d.splice(d.delegateCount++,0,p):d.push(p),pt.event.global[h]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,m=pt.hasData(e)&&pt._data(e);if(m&&(c=m.events)){for(t=(t||"").match(ht)||[""],l=t.length;l--;)if(s=It.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){for(f=pt.event.special[d]||{},d=(r?f.delegateType:f.bindType)||d,p=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),u=o=p.length;o--;)a=p[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(p.splice(o,1),a.selector&&p.delegateCount--,f.remove&&f.remove.call(e,a));u&&!p.length&&(f.teardown&&f.teardown.call(e,h,m.handle)!==!1||pt.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)pt.event.remove(e,d+t[l],n,r,!0);pt.isEmptyObject(c)&&(delete m.handle,pt._removeData(e,"events"))}},trigger:function(e,n,i,o){var a,s,u,l,c,f,p,d=[i||K],h=ct.call(e,"type")?e.type:e,g=ct.call(e,"namespace")?e.namespace.split("."):[];if(u=f=i=i||K,3!==i.nodeType&&8!==i.nodeType&&!$t.test(h+pt.event.triggered)&&(h.indexOf(".")>=0&&(g=h.split("."),h=g.shift(),g.sort()),s=0>h.indexOf(":")&&"on"+h,e=e[pt.expando]?e:new pt.Event(h,"object"==typeof e&&e),e.isTrigger=o?2:3,e.namespace=g.join("."),e.namespace_re=e.namespace?RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=r,e.target||(e.target=i),n=null==n?[e]:pt.makeArray(n,[e]),c=pt.event.special[h]||{},o||!c.trigger||c.trigger.apply(i,n)!==!1)){if(!o&&!c.noBubble&&!pt.isWindow(i)){for(l=c.delegateType||h,$t.test(l+h)||(u=u.parentNode);u;u=u.parentNode)d.push(u),f=u;f===(i.ownerDocument||K)&&d.push(f.defaultView||f.parentWindow||t)}for(p=0;(u=d[p++])&&!e.isPropagationStopped();)e.type=p>1?l:c.bindType||h,a=(pt._data(u,"events")||{})[e.type]&&pt._data(u,"handle"),a&&a.apply(u,n),a=s&&u[s],a&&pt.acceptData(u)&&a.apply&&a.apply(u,n)===!1&&e.preventDefault();if(e.type=h,!o&&!e.isDefaultPrevented()&&(!c._default||c._default.apply(d.pop(),n)===!1)&&pt.acceptData(i)&&s&&i[h]&&!pt.isWindow(i)){f=i[s],f&&(i[s]=null),pt.event.triggered=h;try{i[h]()}catch(m){}pt.event.triggered=r,f&&(i[s]=f)}return e.result}},dispatch:function(e){e=pt.event.fix(e);var t,n,i,o,a,s=[],u=st.call(arguments),l=(pt._data(this,"events")||{})[e.type]||[],c=pt.event.special[e.type]||{};if(u[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){for(s=pt.event.handlers.call(this,e,l),t=0;(o=s[t++])&&!e.isPropagationStopped();)for(e.currentTarget=o.elem,a=0;(i=o.handlers[a++])&&!e.isImmediatePropagationStopped();)(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,n=((pt.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,u),n!==r&&(e.result=n)===!1&&(e.preventDefault(),e.stopPropagation()));return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&(!e.button||"click"!==e.type))for(;l!=this;l=l.parentNode||this)if(1===l.nodeType&&(l.disabled!==!0||"click"!==e.type)){for(o=[],a=0;u>a;a++)i=t[a],n=i.selector+" ",o[n]===r&&(o[n]=i.needsContext?pt(n,this).index(l)>=0:pt.find(n,this,null,[l]).length),o[n]&&o.push(i);o.length&&s.push({elem:l,handlers:o})}return t.length>u&&s.push({elem:this,handlers:t.slice(u)}),s},fix:function(e){if(e[pt.expando])return e;var t,n,r,i=e.type,o=e,a=this.fixHooks[i];for(a||(this.fixHooks[i]=a=Wt.test(i)?this.mouseHooks:Rt.test(i)?this.keyHooks:{}),r=a.props?this.props.concat(a.props):this.props,e=new pt.Event(o),t=r.length;t--;)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||K),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,a.filter?a.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,i,o,a=t.button,s=t.fromElement;return null==e.pageX&&null!=t.clientX&&(i=e.target.ownerDocument||K,o=i.documentElement,n=i.body,e.pageX=t.clientX+(o&&o.scrollLeft||n&&n.scrollLeft||0)-(o&&o.clientLeft||n&&n.clientLeft||0),e.pageY=t.clientY+(o&&o.scrollTop||n&&n.scrollTop||0)-(o&&o.clientTop||n&&n.clientTop||0)),!e.relatedTarget&&s&&(e.relatedTarget=s===e.target?t.toElement:s),e.which||a===r||(e.which=1&a?1:2&a?3:4&a?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==p()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===p()&&this.blur?(this.blur(),!1):r},delegateType:"focusout"},click:{trigger:function(){return pt.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):r},_default:function(e){return pt.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==r&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=pt.extend(new pt.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?pt.event.trigger(i,null,t):pt.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},pt.removeEvent=K.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===G&&(e[r]=null),e.detachEvent(r,n))},pt.Event=function(e,t){return this instanceof pt.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?c:f):this.type=e,t&&pt.extend(this,t),this.timeStamp=e&&e.timeStamp||pt.now(),this[pt.expando]=!0,r):new pt.Event(e,t)},pt.Event.prototype={isDefaultPrevented:f,isPropagationStopped:f,isImmediatePropagationStopped:f,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=c,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=c,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=c,this.stopPropagation()}},pt.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){pt.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!pt.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),pt.support.submitBubbles||(pt.event.special.submit={setup:function(){return pt.nodeName(this,"form")?!1:(pt.event.add(this,"click._submit keypress._submit",function(e){var t=e.target,n=pt.nodeName(t,"input")||pt.nodeName(t,"button")?t.form:r;n&&!pt._data(n,"submitBubbles")&&(pt.event.add(n,"submit._submit",function(e){e._submit_bubble=!0}),pt._data(n,"submitBubbles",!0))}),r)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&pt.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return pt.nodeName(this,"form")?!1:(pt.event.remove(this,"._submit"),r)}}),pt.support.changeBubbles||(pt.event.special.change={setup:function(){return Pt.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(pt.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),pt.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),pt.event.simulate("change",this,e,!0)})),!1):(pt.event.add(this,"beforeactivate._change",function(e){var t=e.target;Pt.test(t.nodeName)&&!pt._data(t,"changeBubbles")&&(pt.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||pt.event.simulate("change",this.parentNode,e,!0)}),pt._data(t,"changeBubbles",!0))}),r)},handle:function(e){var t=e.target;return this!==t||e.isSimulated||e.isTrigger||"radio"!==t.type&&"checkbox"!==t.type?e.handleObj.handler.apply(this,arguments):r},teardown:function(){return pt.event.remove(this,"._change"),!Pt.test(this.nodeName)}}),pt.support.focusinBubbles||pt.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){pt.event.simulate(t,e.target,pt.event.fix(e),!0)};pt.event.special[t]={setup:function(){0===n++&&K.addEventListener(e,r,!0)},teardown:function(){0===--n&&K.removeEventListener(e,r,!0)}}}),pt.fn.extend({on:function(e,t,n,i,o){var a,s;if("object"==typeof e){"string"!=typeof t&&(n=n||t,t=r);for(a in e)this.on(a,t,n,e[a],o);return this}if(null==n&&null==i?(i=t,n=t=r):null==i&&("string"==typeof t?(i=n,n=r):(i=n,n=t,t=r)),i===!1)i=f;else if(!i)return this;return 1===o&&(s=i,i=function(e){return pt().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=pt.guid++)),this.each(function(){pt.event.add(this,e,i,n,t)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,t,n){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,pt(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,t,e[o]);return this}return(t===!1||"function"==typeof t)&&(n=t,t=r),n===!1&&(n=f),this.each(function(){pt.event.remove(this,e,n,t)})},trigger:function(e,t){return this.each(function(){pt.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];return n?pt.event.trigger(e,t,n,!0):r}});var zt=/^.[^:#\[\.,]*$/,Xt=/^(?:parents|prev(?:Until|All))/,Ut=pt.expr.match.needsContext,Vt={children:!0,contents:!0,next:!0,prev:!0};pt.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(pt(e).filter(function(){for(t=0;i>t;t++)if(pt.contains(r[t],this))return!0}));for(t=0;i>t;t++)pt.find(e,r[t],n);return n=this.pushStack(i>1?pt.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=pt(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(pt.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(h(this,e||[],!0))},filter:function(e){return this.pushStack(h(this,e||[],!1))},is:function(e){return!!h(this,"string"==typeof e&&Ut.test(e)?pt(e):e||[],!1).length},closest:function(e,t){for(var n,r=0,i=this.length,o=[],a=Ut.test(e)||"string"!=typeof e?pt(e,t||this.context):0;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&pt.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?pt.unique(o):o)},index:function(e){return e?"string"==typeof e?pt.inArray(this[0],pt(e)):pt.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?pt(e,t):pt.makeArray(e&&e.nodeType?[e]:e),r=pt.merge(this.get(),n);return this.pushStack(pt.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),pt.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return pt.dir(e,"parentNode")},parentsUntil:function(e,t,n){return pt.dir(e,"parentNode",n)},next:function(e){return d(e,"nextSibling")},prev:function(e){return d(e,"previousSibling")},nextAll:function(e){return pt.dir(e,"nextSibling")
},prevAll:function(e){return pt.dir(e,"previousSibling")},nextUntil:function(e,t,n){return pt.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return pt.dir(e,"previousSibling",n)},siblings:function(e){return pt.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return pt.sibling(e.firstChild)},contents:function(e){return pt.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:pt.merge([],e.childNodes)}},function(e,t){pt.fn[e]=function(n,r){var i=pt.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=pt.filter(r,i)),this.length>1&&(Vt[e]||(i=pt.unique(i)),Xt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),pt.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?pt.find.matchesSelector(r,e)?[r]:[]:pt.find.matches(e,pt.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,t,n){for(var i=[],o=e[t];o&&9!==o.nodeType&&(n===r||1!==o.nodeType||!pt(o).is(n));)1===o.nodeType&&i.push(o),o=o[t];return i},sibling:function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});var Yt="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",Jt=/ jQuery\d+="(?:null|\d+)"/g,Gt=RegExp("<(?:"+Yt+")[\\s/>]","i"),Qt=/^\s+/,Kt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,Zt=/<([\w:]+)/,en=/<tbody/i,tn=/<|&#?\w+;/,nn=/<(?:script|style|link)/i,rn=/^(?:checkbox|radio)$/i,on=/checked\s*(?:[^=]|=\s*.checked.)/i,an=/^$|\/(?:java|ecma)script/i,sn=/^true\/(.*)/,un=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ln={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:pt.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},cn=g(K),fn=cn.appendChild(K.createElement("div"));ln.optgroup=ln.option,ln.tbody=ln.tfoot=ln.colgroup=ln.caption=ln.thead,ln.th=ln.td,pt.fn.extend({text:function(e){return pt.access(this,function(e){return e===r?pt.text(this):this.empty().append((this[0]&&this[0].ownerDocument||K).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=m(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=m(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){for(var n,r=e?pt.filter(e,this):this,i=0;null!=(n=r[i]);i++)t||1!==n.nodeType||pt.cleanData(w(n)),n.parentNode&&(t&&pt.contains(n.ownerDocument,n)&&b(w(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){for(var e,t=0;null!=(e=this[t]);t++){for(1===e.nodeType&&pt.cleanData(w(e,!1));e.firstChild;)e.removeChild(e.firstChild);e.options&&pt.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return pt.clone(this,e,t)})},html:function(e){return pt.access(this,function(e){var t=this[0]||{},n=0,i=this.length;if(e===r)return 1===t.nodeType?t.innerHTML.replace(Jt,""):r;if(!("string"!=typeof e||nn.test(e)||!pt.support.htmlSerialize&&Gt.test(e)||!pt.support.leadingWhitespace&&Qt.test(e)||ln[(Zt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(Kt,"<$1></$2>");try{for(;i>n;n++)t=this[n]||{},1===t.nodeType&&(pt.cleanData(w(t,!1)),t.innerHTML=e);t=0}catch(o){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=pt.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),pt(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=ot.apply([],e);var r,i,o,a,s,u,l=0,c=this.length,f=this,p=c-1,d=e[0],h=pt.isFunction(d);if(h||!(1>=c||"string"!=typeof d||pt.support.checkClone)&&on.test(d))return this.each(function(r){var i=f.eq(r);h&&(e[0]=d.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(u=pt.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=u.firstChild,1===u.childNodes.length&&(u=r),r)){for(a=pt.map(w(u,"script"),y),o=a.length;c>l;l++)i=u,l!==p&&(i=pt.clone(i,!0,!0),o&&pt.merge(a,w(i,"script"))),t.call(this[l],i,l);if(o)for(s=a[a.length-1].ownerDocument,pt.map(a,v),l=0;o>l;l++)i=a[l],an.test(i.type||"")&&!pt._data(i,"globalEval")&&pt.contains(s,i)&&(i.src?pt._evalUrl(i.src):pt.globalEval((i.text||i.textContent||i.innerHTML||"").replace(un,"")));u=r=null}return this}}),pt.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){pt.fn[e]=function(e){for(var n,r=0,i=[],o=pt(e),a=o.length-1;a>=r;r++)n=r===a?this:this.clone(!0),pt(o[r])[t](n),at.apply(i,n.get());return this.pushStack(i)}}),pt.extend({clone:function(e,t,n){var r,i,o,a,s,u=pt.contains(e.ownerDocument,e);if(pt.support.html5Clone||pt.isXMLDoc(e)||!Gt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(fn.innerHTML=e.outerHTML,fn.removeChild(o=fn.firstChild)),!(pt.support.noCloneEvent&&pt.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||pt.isXMLDoc(e)))for(r=w(o),s=w(e),a=0;null!=(i=s[a]);++a)r[a]&&T(i,r[a]);if(t)if(n)for(s=s||w(e),r=r||w(o),a=0;null!=(i=s[a]);a++)x(i,r[a]);else x(e,o);return r=w(o,"script"),r.length>0&&b(r,!u&&w(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){for(var i,o,a,s,u,l,c,f=e.length,p=g(t),d=[],h=0;f>h;h++)if(o=e[h],o||0===o)if("object"===pt.type(o))pt.merge(d,o.nodeType?[o]:o);else if(tn.test(o)){for(s=s||p.appendChild(t.createElement("div")),u=(Zt.exec(o)||["",""])[1].toLowerCase(),c=ln[u]||ln._default,s.innerHTML=c[1]+o.replace(Kt,"<$1></$2>")+c[2],i=c[0];i--;)s=s.lastChild;if(!pt.support.leadingWhitespace&&Qt.test(o)&&d.push(t.createTextNode(Qt.exec(o)[0])),!pt.support.tbody)for(o="table"!==u||en.test(o)?"<table>"!==c[1]||en.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;i--;)pt.nodeName(l=o.childNodes[i],"tbody")&&!l.childNodes.length&&o.removeChild(l);for(pt.merge(d,s.childNodes),s.textContent="";s.firstChild;)s.removeChild(s.firstChild);s=p.lastChild}else d.push(t.createTextNode(o));for(s&&p.removeChild(s),pt.support.appendChecked||pt.grep(w(d,"input"),C),h=0;o=d[h++];)if((!r||-1===pt.inArray(o,r))&&(a=pt.contains(o.ownerDocument,o),s=w(p.appendChild(o),"script"),a&&b(s),n))for(i=0;o=s[i++];)an.test(o.type||"")&&n.push(o);return s=null,p},cleanData:function(e,t){for(var n,r,i,o,a=0,s=pt.expando,u=pt.cache,l=pt.support.deleteExpando,c=pt.event.special;null!=(n=e[a]);a++)if((t||pt.acceptData(n))&&(i=n[s],o=i&&u[i])){if(o.events)for(r in o.events)c[r]?pt.event.remove(n,r):pt.removeEvent(n,r,o.handle);u[i]&&(delete u[i],l?delete n[s]:typeof n.removeAttribute!==G?n.removeAttribute(s):n[s]=null,rt.push(i))}},_evalUrl:function(e){return pt.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),pt.fn.extend({wrapAll:function(e){if(pt.isFunction(e))return this.each(function(t){pt(this).wrapAll(e.call(this,t))});if(this[0]){var t=pt(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstChild&&1===e.firstChild.nodeType;)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return this.each(pt.isFunction(e)?function(t){pt(this).wrapInner(e.call(this,t))}:function(){var t=pt(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=pt.isFunction(e);return this.each(function(n){pt(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){pt.nodeName(this,"body")||pt(this).replaceWith(this.childNodes)}).end()}});var pn,dn,hn,gn=/alpha\([^)]*\)/i,mn=/opacity\s*=\s*([^)]*)/,yn=/^(top|right|bottom|left)$/,vn=/^(none|table(?!-c[ea]).+)/,bn=/^margin/,xn=RegExp("^("+dt+")(.*)$","i"),Tn=RegExp("^("+dt+")(?!px)[a-z%]+$","i"),wn=RegExp("^([+-])=("+dt+")","i"),Cn={BODY:"block"},Nn={position:"absolute",visibility:"hidden",display:"block"},kn={letterSpacing:0,fontWeight:400},En=["Top","Right","Bottom","Left"],Sn=["Webkit","O","Moz","ms"];pt.fn.extend({css:function(e,t){return pt.access(this,function(e,t,n){var i,o,a={},s=0;if(pt.isArray(t)){for(o=dn(e),i=t.length;i>s;s++)a[t[s]]=pt.css(e,t[s],!1,o);return a}return n!==r?pt.style(e,t,n):pt.css(e,t)},e,t,arguments.length>1)},show:function(){return E(this,!0)},hide:function(){return E(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){k(this)?pt(this).show():pt(this).hide()})}}),pt.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=hn(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":pt.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,t,n,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,u=pt.camelCase(t),l=e.style;if(t=pt.cssProps[u]||(pt.cssProps[u]=N(l,u)),s=pt.cssHooks[t]||pt.cssHooks[u],n===r)return s&&"get"in s&&(o=s.get(e,!1,i))!==r?o:l[t];if(a=typeof n,"string"===a&&(o=wn.exec(n))&&(n=(o[1]+1)*o[2]+parseFloat(pt.css(e,t)),a="number"),!(null==n||"number"===a&&isNaN(n)||("number"!==a||pt.cssNumber[u]||(n+="px"),pt.support.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),s&&"set"in s&&(n=s.set(e,n,i))===r)))try{l[t]=n}catch(c){}}},css:function(e,t,n,i){var o,a,s,u=pt.camelCase(t);return t=pt.cssProps[u]||(pt.cssProps[u]=N(e.style,u)),s=pt.cssHooks[t]||pt.cssHooks[u],s&&"get"in s&&(a=s.get(e,!0,n)),a===r&&(a=hn(e,t,i)),"normal"===a&&t in kn&&(a=kn[t]),""===n||n?(o=parseFloat(a),n===!0||pt.isNumeric(o)?o||0:a):a}}),t.getComputedStyle?(dn=function(e){return t.getComputedStyle(e,null)},hn=function(e,t,n){var i,o,a,s=n||dn(e),u=s?s.getPropertyValue(t)||s[t]:r,l=e.style;return s&&(""!==u||pt.contains(e.ownerDocument,e)||(u=pt.style(e,t)),Tn.test(u)&&bn.test(t)&&(i=l.width,o=l.minWidth,a=l.maxWidth,l.minWidth=l.maxWidth=l.width=u,u=s.width,l.width=i,l.minWidth=o,l.maxWidth=a)),u}):K.documentElement.currentStyle&&(dn=function(e){return e.currentStyle},hn=function(e,t,n){var i,o,a,s=n||dn(e),u=s?s[t]:r,l=e.style;return null==u&&l&&l[t]&&(u=l[t]),Tn.test(u)&&!yn.test(t)&&(i=l.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),l.left="fontSize"===t?"1em":u,u=l.pixelLeft+"px",l.left=i,a&&(o.left=a)),""===u?"auto":u}),pt.each(["height","width"],function(e,t){pt.cssHooks[t]={get:function(e,n,i){return n?0===e.offsetWidth&&vn.test(pt.css(e,"display"))?pt.swap(e,Nn,function(){return j(e,t,i)}):j(e,t,i):r},set:function(e,n,r){var i=r&&dn(e);return S(e,n,r?A(e,t,r,pt.support.boxSizing&&"border-box"===pt.css(e,"boxSizing",!1,i),i):0)}}}),pt.support.opacity||(pt.cssHooks.opacity={get:function(e,t){return mn.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=pt.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===pt.trim(o.replace(gn,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=gn.test(o)?o.replace(gn,i):o+" "+i)}}),pt(function(){pt.support.reliableMarginRight||(pt.cssHooks.marginRight={get:function(e,t){return t?pt.swap(e,{display:"inline-block"},hn,[e,"marginRight"]):r}}),!pt.support.pixelPosition&&pt.fn.position&&pt.each(["top","left"],function(e,t){pt.cssHooks[t]={get:function(e,n){return n?(n=hn(e,t),Tn.test(n)?pt(e).position()[t]+"px":n):r}}})}),pt.expr&&pt.expr.filters&&(pt.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!pt.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||pt.css(e,"display"))},pt.expr.filters.visible=function(e){return!pt.expr.filters.hidden(e)}),pt.each({margin:"",padding:"",border:"Width"},function(e,t){pt.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];4>r;r++)i[e+En[r]+t]=o[r]||o[r-2]||o[0];return i}},bn.test(e)||(pt.cssHooks[e+t].set=S)});var An=/%20/g,jn=/\[\]$/,Dn=/\r?\n/g,Ln=/^(?:submit|button|image|reset|file)$/i,Hn=/^(?:input|select|textarea|keygen)/i;pt.fn.extend({serialize:function(){return pt.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=pt.prop(this,"elements");return e?pt.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!pt(this).is(":disabled")&&Hn.test(this.nodeName)&&!Ln.test(e)&&(this.checked||!rn.test(e))}).map(function(e,t){var n=pt(this).val();return null==n?null:pt.isArray(n)?pt.map(n,function(e){return{name:t.name,value:e.replace(Dn,"\r\n")}}):{name:t.name,value:n.replace(Dn,"\r\n")}}).get()}}),pt.param=function(e,t){var n,i=[],o=function(e,t){t=pt.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(t===r&&(t=pt.ajaxSettings&&pt.ajaxSettings.traditional),pt.isArray(e)||e.jquery&&!pt.isPlainObject(e))pt.each(e,function(){o(this.name,this.value)});else for(n in e)H(n,e[n],t,o);return i.join("&").replace(An,"+")},pt.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){pt.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),pt.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var qn,_n,Mn=pt.now(),On=/\?/,Fn=/#.*$/,Bn=/([?&])_=[^&]*/,Pn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Rn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Wn=/^(?:GET|HEAD)$/,$n=/^\/\//,In=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,zn=pt.fn.load,Xn={},Un={},Vn="*/".concat("*");try{_n=Q.href}catch(Yn){_n=K.createElement("a"),_n.href="",_n=_n.href}qn=In.exec(_n.toLowerCase())||[],pt.fn.load=function(e,t,n){if("string"!=typeof e&&zn)return zn.apply(this,arguments);var i,o,a,s=this,u=e.indexOf(" ");return u>=0&&(i=e.slice(u,e.length),e=e.slice(0,u)),pt.isFunction(t)?(n=t,t=r):t&&"object"==typeof t&&(a="POST"),s.length>0&&pt.ajax({url:e,type:a,dataType:"html",data:t}).done(function(e){o=arguments,s.html(i?pt("<div>").append(pt.parseHTML(e)).find(i):e)}).complete(n&&function(e,t){s.each(n,o||[e.responseText,t,e])}),this},pt.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){pt.fn[t]=function(e){return this.on(t,e)}}),pt.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:_n,type:"GET",isLocal:Rn.test(qn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Vn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":pt.parseJSON,"text xml":pt.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?M(M(e,pt.ajaxSettings),t):M(pt.ajaxSettings,e)},ajaxPrefilter:q(Xn),ajaxTransport:q(Un),ajax:function(e,t){function n(e,t,n,i){var o,f,v,b,T,C=t;2!==x&&(x=2,u&&clearTimeout(u),c=r,s=i||"",w.readyState=e>0?4:0,o=e>=200&&300>e||304===e,n&&(b=O(p,w,n)),b=F(p,b,w,o),o?(p.ifModified&&(T=w.getResponseHeader("Last-Modified"),T&&(pt.lastModified[a]=T),T=w.getResponseHeader("etag"),T&&(pt.etag[a]=T)),204===e||"HEAD"===p.type?C="nocontent":304===e?C="notmodified":(C=b.state,f=b.data,v=b.error,o=!v)):(v=C,(e||!C)&&(C="error",0>e&&(e=0))),w.status=e,w.statusText=(t||C)+"",o?g.resolveWith(d,[f,C,w]):g.rejectWith(d,[w,C,v]),w.statusCode(y),y=r,l&&h.trigger(o?"ajaxSuccess":"ajaxError",[w,p,o?f:v]),m.fireWith(d,[w,C]),l&&(h.trigger("ajaxComplete",[w,p]),--pt.active||pt.event.trigger("ajaxStop")))}"object"==typeof e&&(t=e,e=r),t=t||{};var i,o,a,s,u,l,c,f,p=pt.ajaxSetup({},t),d=p.context||p,h=p.context&&(d.nodeType||d.jquery)?pt(d):pt.event,g=pt.Deferred(),m=pt.Callbacks("once memory"),y=p.statusCode||{},v={},b={},x=0,T="canceled",w={readyState:0,getResponseHeader:function(e){var t;if(2===x){if(!f)for(f={};t=Pn.exec(s);)f[t[1].toLowerCase()]=t[2];t=f[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===x?s:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return x||(e=b[n]=b[n]||e,v[e]=t),this},overrideMimeType:function(e){return x||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>x)for(t in e)y[t]=[y[t],e[t]];else w.always(e[w.status]);return this},abort:function(e){var t=e||T;return c&&c.abort(t),n(0,t),this}};if(g.promise(w).complete=m.add,w.success=w.done,w.error=w.fail,p.url=((e||p.url||_n)+"").replace(Fn,"").replace($n,qn[1]+"//"),p.type=t.method||t.type||p.method||p.type,p.dataTypes=pt.trim(p.dataType||"*").toLowerCase().match(ht)||[""],null==p.crossDomain&&(i=In.exec(p.url.toLowerCase()),p.crossDomain=!(!i||i[1]===qn[1]&&i[2]===qn[2]&&(i[3]||("http:"===i[1]?"80":"443"))===(qn[3]||("http:"===qn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=pt.param(p.data,p.traditional)),_(Xn,p,t,w),2===x)return w;l=p.global,l&&0===pt.active++&&pt.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Wn.test(p.type),a=p.url,p.hasContent||(p.data&&(a=p.url+=(On.test(a)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=Bn.test(a)?a.replace(Bn,"$1_="+Mn++):a+(On.test(a)?"&":"?")+"_="+Mn++)),p.ifModified&&(pt.lastModified[a]&&w.setRequestHeader("If-Modified-Since",pt.lastModified[a]),pt.etag[a]&&w.setRequestHeader("If-None-Match",pt.etag[a])),(p.data&&p.hasContent&&p.contentType!==!1||t.contentType)&&w.setRequestHeader("Content-Type",p.contentType),w.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Vn+"; q=0.01":""):p.accepts["*"]);for(o in p.headers)w.setRequestHeader(o,p.headers[o]);if(p.beforeSend&&(p.beforeSend.call(d,w,p)===!1||2===x))return w.abort();T="abort";for(o in{success:1,error:1,complete:1})w[o](p[o]);if(c=_(Un,p,t,w)){w.readyState=1,l&&h.trigger("ajaxSend",[w,p]),p.async&&p.timeout>0&&(u=setTimeout(function(){w.abort("timeout")},p.timeout));try{x=1,c.send(v,n)}catch(C){if(!(2>x))throw C;n(-1,C)}}else n(-1,"No Transport");return w},getJSON:function(e,t,n){return pt.get(e,t,n,"json")},getScript:function(e,t){return pt.get(e,r,t,"script")}}),pt.each(["get","post"],function(e,t){pt[t]=function(e,n,i,o){return pt.isFunction(n)&&(o=o||i,i=n,n=r),pt.ajax({url:e,type:t,dataType:o,data:n,success:i})}}),pt.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return pt.globalEval(e),e}}}),pt.ajaxPrefilter("script",function(e){e.cache===r&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),pt.ajaxTransport("script",function(e){if(e.crossDomain){var t,n=K.head||pt("head")[0]||K.documentElement;return{send:function(r,i){t=K.createElement("script"),t.async=!0,e.scriptCharset&&(t.charset=e.scriptCharset),t.src=e.url,t.onload=t.onreadystatechange=function(e,n){(n||!t.readyState||/loaded|complete/.test(t.readyState))&&(t.onload=t.onreadystatechange=null,t.parentNode&&t.parentNode.removeChild(t),t=null,n||i(200,"success"))},n.insertBefore(t,n.firstChild)},abort:function(){t&&t.onload(r,!0)}}}});var Jn=[],Gn=/(=)\?(?=&|$)|\?\?/;pt.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Jn.pop()||pt.expando+"_"+Mn++;return this[e]=!0,e}}),pt.ajaxPrefilter("json jsonp",function(e,n,i){var o,a,s,u=e.jsonp!==!1&&(Gn.test(e.url)?"url":"string"==typeof e.data&&!(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Gn.test(e.data)&&"data");return u||"jsonp"===e.dataTypes[0]?(o=e.jsonpCallback=pt.isFunction(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,u?e[u]=e[u].replace(Gn,"$1"+o):e.jsonp!==!1&&(e.url+=(On.test(e.url)?"&":"?")+e.jsonp+"="+o),e.converters["script json"]=function(){return s||pt.error(o+" was not called"),s[0]},e.dataTypes[0]="json",a=t[o],t[o]=function(){s=arguments},i.always(function(){t[o]=a,e[o]&&(e.jsonpCallback=n.jsonpCallback,Jn.push(o)),s&&pt.isFunction(a)&&a(s[0]),s=a=r}),"script"):r});var Qn,Kn,Zn=0,er=t.ActiveXObject&&function(){var e;for(e in Qn)Qn[e](r,!0)};pt.ajaxSettings.xhr=t.ActiveXObject?function(){return!this.isLocal&&B()||P()}:B,Kn=pt.ajaxSettings.xhr(),pt.support.cors=!!Kn&&"withCredentials"in Kn,Kn=pt.support.ajax=!!Kn,Kn&&pt.ajaxTransport(function(e){if(!e.crossDomain||pt.support.cors){var n;return{send:function(i,o){var a,s,u=e.xhr();if(e.username?u.open(e.type,e.url,e.async,e.username,e.password):u.open(e.type,e.url,e.async),e.xhrFields)for(s in e.xhrFields)u[s]=e.xhrFields[s];e.mimeType&&u.overrideMimeType&&u.overrideMimeType(e.mimeType),e.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)u.setRequestHeader(s,i[s])}catch(l){}u.send(e.hasContent&&e.data||null),n=function(t,i){var s,l,c,f;try{if(n&&(i||4===u.readyState))if(n=r,a&&(u.onreadystatechange=pt.noop,er&&delete Qn[a]),i)4!==u.readyState&&u.abort();else{f={},s=u.status,l=u.getAllResponseHeaders(),"string"==typeof u.responseText&&(f.text=u.responseText);try{c=u.statusText}catch(p){c=""}s||!e.isLocal||e.crossDomain?1223===s&&(s=204):s=f.text?200:404}}catch(d){i||o(-1,d)}f&&o(s,c,f,l)},e.async?4===u.readyState?setTimeout(n):(a=++Zn,er&&(Qn||(Qn={},pt(t).unload(er)),Qn[a]=n),u.onreadystatechange=n):n()},abort:function(){n&&n(r,!0)}}}});var tr,nr,rr=/^(?:toggle|show|hide)$/,ir=RegExp("^(?:([+-])=|)("+dt+")([a-z%]*)$","i"),or=/queueHooks$/,ar=[z],sr={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=ir.exec(t),o=i&&i[3]||(pt.cssNumber[e]?"":"px"),a=(pt.cssNumber[e]||"px"!==o&&+r)&&ir.exec(pt.css(n.elem,e)),s=1,u=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,pt.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--u)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};pt.Animation=pt.extend($,{tweener:function(e,t){pt.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");for(var n,r=0,i=e.length;i>r;r++)n=e[r],sr[n]=sr[n]||[],sr[n].unshift(t)},prefilter:function(e,t){t?ar.unshift(e):ar.push(e)}}),pt.Tween=X,X.prototype={constructor:X,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(pt.cssNumber[n]?"":"px")},cur:function(){var e=X.propHooks[this.prop];return e&&e.get?e.get(this):X.propHooks._default.get(this)},run:function(e){var t,n=X.propHooks[this.prop];return this.pos=t=this.options.duration?pt.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):X.propHooks._default.set(this),this}},X.prototype.init.prototype=X.prototype,X.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=pt.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){pt.fx.step[e.prop]?pt.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[pt.cssProps[e.prop]]||pt.cssHooks[e.prop])?pt.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},X.propHooks.scrollTop=X.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},pt.each(["toggle","show","hide"],function(e,t){var n=pt.fn[t];pt.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(U(t,!0),e,r,i)}}),pt.fn.extend({fadeTo:function(e,t,n,r){return this.filter(k).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=pt.isEmptyObject(e),o=pt.speed(t,n,r),a=function(){var t=$(this,pt.extend({},e),o);(i||pt._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var i=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=r),t&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,r=null!=e&&e+"queueHooks",o=pt.timers,a=pt._data(this);if(r)a[r]&&a[r].stop&&i(a[r]);else for(r in a)a[r]&&a[r].stop&&or.test(r)&&i(a[r]);for(r=o.length;r--;)o[r].elem!==this||null!=e&&o[r].queue!==e||(o[r].anim.stop(n),t=!1,o.splice(r,1));(t||!n)&&pt.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=pt._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=pt.timers,a=r?r.length:0;for(n.finish=!0,pt.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),pt.each({slideDown:U("show"),slideUp:U("hide"),slideToggle:U("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){pt.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),pt.speed=function(e,t,n){var r=e&&"object"==typeof e?pt.extend({},e):{complete:n||!n&&t||pt.isFunction(e)&&e,duration:e,easing:n&&t||t&&!pt.isFunction(t)&&t};return r.duration=pt.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in pt.fx.speeds?pt.fx.speeds[r.duration]:pt.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){pt.isFunction(r.old)&&r.old.call(this),r.queue&&pt.dequeue(this,r.queue)},r},pt.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},pt.timers=[],pt.fx=X.prototype.init,pt.fx.tick=function(){var e,t=pt.timers,n=0;for(tr=pt.now();t.length>n;n++)e=t[n],e()||t[n]!==e||t.splice(n--,1);t.length||pt.fx.stop(),tr=r},pt.fx.timer=function(e){e()&&pt.timers.push(e)&&pt.fx.start()},pt.fx.interval=13,pt.fx.start=function(){nr||(nr=setInterval(pt.fx.tick,pt.fx.interval))},pt.fx.stop=function(){clearInterval(nr),nr=null},pt.fx.speeds={slow:600,fast:200,_default:400},pt.fx.step={},pt.expr&&pt.expr.filters&&(pt.expr.filters.animated=function(e){return pt.grep(pt.timers,function(t){return e===t.elem}).length}),pt.fn.offset=function(e){if(arguments.length)return e===r?this:this.each(function(t){pt.offset.setOffset(this,e,t)});var t,n,i={top:0,left:0},o=this[0],a=o&&o.ownerDocument;return a?(t=a.documentElement,pt.contains(t,o)?(typeof o.getBoundingClientRect!==G&&(i=o.getBoundingClientRect()),n=V(a),{top:i.top+(n.pageYOffset||t.scrollTop)-(t.clientTop||0),left:i.left+(n.pageXOffset||t.scrollLeft)-(t.clientLeft||0)}):i):void 0},pt.offset={setOffset:function(e,t,n){var r=pt.css(e,"position");"static"===r&&(e.style.position="relative");var i,o,a=pt(e),s=a.offset(),u=pt.css(e,"top"),l=pt.css(e,"left"),c=("absolute"===r||"fixed"===r)&&pt.inArray("auto",[u,l])>-1,f={},p={};c?(p=a.position(),i=p.top,o=p.left):(i=parseFloat(u)||0,o=parseFloat(l)||0),pt.isFunction(t)&&(t=t.call(e,n,s)),null!=t.top&&(f.top=t.top-s.top+i),null!=t.left&&(f.left=t.left-s.left+o),"using"in t?t.using.call(e,f):a.css(f)}},pt.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===pt.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),pt.nodeName(e[0],"html")||(n=e.offset()),n.top+=pt.css(e[0],"borderTopWidth",!0),n.left+=pt.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-pt.css(r,"marginTop",!0),left:t.left-n.left-pt.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent||Z;e&&!pt.nodeName(e,"html")&&"static"===pt.css(e,"position");)e=e.offsetParent;return e||Z})}}),pt.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n=/Y/.test(t);pt.fn[e]=function(i){return pt.access(this,function(e,i,o){var a=V(e);return o===r?a?t in a?a[t]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(n?pt(a).scrollLeft():o,n?o:pt(a).scrollTop()):e[i]=o,r)},e,i,arguments.length,null)}}),pt.each({Height:"height",Width:"width"},function(e,t){pt.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,i){pt.fn[i]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(i===!0||o===!0?"margin":"border");return pt.access(this,function(t,n,i){var o;return pt.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):i===r?pt.css(t,n,s):pt.style(t,n,i,s)},t,a?i:r,a,null)}})}),pt.fn.size=function(){return this.length},pt.fn.andSelf=pt.fn.addBack,"object"==typeof e&&e&&"object"==typeof e.exports?e.exports=pt:(t.jQuery=t.$=pt,"function"==typeof n&&n.amd&&n("jquery",[],function(){return pt}))}(window),r("undefined"!=typeof $?$:window.$)}).call(global,void 0,void 0,void 0,function(e){module.exports=e});}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"jquery":[function(require,module,exports){
module.exports=require('Cz4Dm0');
},{}],"underscore":[function(require,module,exports){
module.exports=require('s+Ot9H');
},{}],"s+Ot9H":[function(require,module,exports){
(function (global){(function(n,t,r,e){(function(){var e=this,u=e._,i={},a=Array.prototype,o=Object.prototype,c=Function.prototype,l=a.push,f=a.slice,s=a.concat,p=o.toString,v=o.hasOwnProperty,h=a.forEach,d=a.map,g=a.reduce,y=a.reduceRight,m=a.filter,b=a.every,_=a.some,x=a.indexOf,w=a.lastIndexOf,j=Array.isArray,A=Object.keys,E=c.bind,O=function(n){return n instanceof O?n:this instanceof O?void(this._wrapped=n):new O(n)};"undefined"!=typeof t?("undefined"!=typeof n&&n.exports&&(t=n.exports=O),t._=O):e._=O,O.VERSION="1.5.2";var k=O.each=O.forEach=function(n,t,r){if(null!=n)if(h&&n.forEach===h)n.forEach(t,r);else if(n.length===+n.length){for(var e=0,u=n.length;u>e;e++)if(t.call(r,n[e],e,n)===i)return}else for(var a=O.keys(n),e=0,u=a.length;u>e;e++)if(t.call(r,n[a[e]],a[e],n)===i)return};O.map=O.collect=function(n,t,r){var e=[];return null==n?e:d&&n.map===d?n.map(t,r):(k(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var F="Reduce of empty array with no initial value";O.reduce=O.foldl=O.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),g&&n.reduce===g)return e&&(t=O.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(k(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(F);return r},O.reduceRight=O.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),y&&n.reduceRight===y)return e&&(t=O.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=O.keys(n);i=a.length}if(k(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(F);return r},O.find=O.detect=function(n,t,r){var e;return M(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},O.filter=O.select=function(n,t,r){var e=[];return null==n?e:m&&n.filter===m?n.filter(t,r):(k(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},O.reject=function(n,t,r){return O.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},O.every=O.all=function(n,t,r){t||(t=O.identity);var e=!0;return null==n?e:b&&n.every===b?n.every(t,r):(k(n,function(n,u,a){return(e=e&&t.call(r,n,u,a))?void 0:i}),!!e)};var M=O.some=O.any=function(n,t,r){t||(t=O.identity);var e=!1;return null==n?e:_&&n.some===_?n.some(t,r):(k(n,function(n,u,a){return e||(e=t.call(r,n,u,a))?i:void 0}),!!e)};O.contains=O.include=function(n,t){return null==n?!1:x&&n.indexOf===x?-1!=n.indexOf(t):M(n,function(n){return n===t})},O.invoke=function(n,t){var r=f.call(arguments,2),e=O.isFunction(t);return O.map(n,function(n){return(e?t:n[t]).apply(n,r)})},O.pluck=function(n,t){return O.map(n,function(n){return n[t]})},O.where=function(n,t,r){return O.isEmpty(t)?r?void 0:[]:O[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},O.findWhere=function(n,t){return O.where(n,t,!0)},O.max=function(n,t,r){if(!t&&O.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&O.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return k(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>e.computed&&(e={value:n,computed:a})}),e.value},O.min=function(n,t,r){if(!t&&O.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&O.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return k(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},O.shuffle=function(n){var t,r=0,e=[];return k(n,function(n){t=O.random(r++),e[r-1]=e[t],e[t]=n}),e},O.sample=function(n,t,r){return 2>arguments.length||r?n[O.random(n.length-1)]:O.shuffle(n).slice(0,Math.max(0,t))};var R=function(n){return O.isFunction(n)?n:function(t){return t[n]}};O.sortBy=function(n,t,r){var e=R(t);return O.pluck(O.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||void 0===r)return 1;if(e>r||void 0===e)return-1}return n.index-t.index}),"value")};var I=function(n){return function(t,r,e){var u={},i=null==r?O.identity:R(r);return k(t,function(r,a){var o=i.call(e,r,a,t);n(u,o,r)}),u}};O.groupBy=I(function(n,t,r){(O.has(n,t)?n[t]:n[t]=[]).push(r)}),O.indexBy=I(function(n,t,r){n[t]=r}),O.countBy=I(function(n,t){O.has(n,t)?n[t]++:n[t]=1}),O.sortedIndex=function(n,t,r,e){r=null==r?O.identity:R(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},O.toArray=function(n){return n?O.isArray(n)?f.call(n):n.length===+n.length?O.map(n,O.identity):O.values(n):[]},O.size=function(n){return null==n?0:n.length===+n.length?n.length:O.keys(n).length},O.first=O.head=O.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:f.call(n,0,t)},O.initial=function(n,t,r){return f.call(n,0,n.length-(null==t||r?1:t))},O.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:f.call(n,Math.max(n.length-t,0))},O.rest=O.tail=O.drop=function(n,t,r){return f.call(n,null==t||r?1:t)},O.compact=function(n){return O.filter(n,O.identity)};var S=function(n,t,r){return t&&O.every(n,O.isArray)?s.apply(r,n):(k(n,function(n){O.isArray(n)||O.isArguments(n)?t?l.apply(r,n):S(n,t,r):r.push(n)}),r)};O.flatten=function(n,t){return S(n,t,[])},O.without=function(n){return O.difference(n,f.call(arguments,1))},O.uniq=O.unique=function(n,t,r,e){O.isFunction(t)&&(e=r,r=t,t=!1);var u=r?O.map(n,r,e):n,i=[],a=[];return k(u,function(r,e){(t?e&&a[a.length-1]===r:O.contains(a,r))||(a.push(r),i.push(n[e]))}),i},O.union=function(){return O.uniq(O.flatten(arguments,!0))},O.intersection=function(n){var t=f.call(arguments,1);return O.filter(O.uniq(n),function(n){return O.every(t,function(t){return O.indexOf(t,n)>=0})})},O.difference=function(n){var t=s.apply(a,f.call(arguments,1));return O.filter(n,function(n){return!O.contains(t,n)})},O.zip=function(){for(var n=O.max(O.pluck(arguments,"length").concat(0)),t=Array(n),r=0;n>r;r++)t[r]=O.pluck(arguments,""+r);return t},O.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},O.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=O.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(x&&n.indexOf===x)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},O.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(w&&n.lastIndexOf===w)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},O.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i};var T=function(){};O.bind=function(n,t){var r,e;if(E&&n.bind===E)return E.apply(n,f.call(arguments,1));if(!O.isFunction(n))throw new TypeError;return r=f.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(f.call(arguments)));T.prototype=n.prototype;var u=new T;T.prototype=null;var i=n.apply(u,r.concat(f.call(arguments)));return Object(i)===i?i:u}},O.partial=function(n){var t=f.call(arguments,1);return function(){return n.apply(this,t.concat(f.call(arguments)))}},O.bindAll=function(n){var t=f.call(arguments,1);if(0===t.length)throw Error("bindAll must be passed function names");return k(t,function(t){n[t]=O.bind(n[t],n)}),n},O.memoize=function(n,t){var r={};return t||(t=O.identity),function(){var e=t.apply(this,arguments);return O.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},O.delay=function(n,t){var r=f.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},O.defer=function(n){return O.delay.apply(O,[n,1].concat(f.call(arguments,1)))},O.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:new Date,a=null,i=n.apply(e,u)};return function(){var l=new Date;o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u)):a||r.trailing===!1||(a=setTimeout(c,f)),i}},O.debounce=function(n,t,r){var e,u,i,a,o;return function(){i=this,u=arguments,a=new Date;var c=function(){var l=new Date-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u)))},l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u)),o}},O.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},O.wrap=function(n,t){return function(){var r=[n];return l.apply(r,arguments),t.apply(this,r)}},O.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},O.after=function(n,t){return function(){return 1>--n?t.apply(this,arguments):void 0}},O.keys=A||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)O.has(n,r)&&t.push(r);return t},O.values=function(n){for(var t=O.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},O.pairs=function(n){for(var t=O.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},O.invert=function(n){for(var t={},r=O.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},O.functions=O.methods=function(n){var t=[];for(var r in n)O.isFunction(n[r])&&t.push(r);return t.sort()},O.extend=function(n){return k(f.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},O.pick=function(n){var t={},r=s.apply(a,f.call(arguments,1));return k(r,function(r){r in n&&(t[r]=n[r])}),t},O.omit=function(n){var t={},r=s.apply(a,f.call(arguments,1));for(var e in n)O.contains(r,e)||(t[e]=n[e]);return t},O.defaults=function(n){return k(f.call(arguments,1),function(t){if(t)for(var r in t)void 0===n[r]&&(n[r]=t[r])}),n},O.clone=function(n){return O.isObject(n)?O.isArray(n)?n.slice():O.extend({},n):n},O.tap=function(n,t){return t(n),n};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof O&&(n=n._wrapped),t instanceof O&&(t=t._wrapped);var u=p.call(n);if(u!=p.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(O.isFunction(a)&&a instanceof a&&O.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c=0,l=!0;if("[object Array]"==u){if(c=n.length,l=c==t.length)for(;c--&&(l=N(n[c],t[c],r,e)););}else{for(var f in n)if(O.has(n,f)&&(c++,!(l=O.has(t,f)&&N(n[f],t[f],r,e))))break;if(l){for(f in t)if(O.has(t,f)&&!c--)break;l=!c}}return r.pop(),e.pop(),l};O.isEqual=function(n,t){return N(n,t,[],[])},O.isEmpty=function(n){if(null==n)return!0;if(O.isArray(n)||O.isString(n))return 0===n.length;for(var t in n)if(O.has(n,t))return!1;return!0},O.isElement=function(n){return!(!n||1!==n.nodeType)},O.isArray=j||function(n){return"[object Array]"==p.call(n)},O.isObject=function(n){return n===Object(n)},k(["Arguments","Function","String","Number","Date","RegExp"],function(n){O["is"+n]=function(t){return p.call(t)=="[object "+n+"]"}}),O.isArguments(arguments)||(O.isArguments=function(n){return!(!n||!O.has(n,"callee"))}),"function"!=typeof/./&&(O.isFunction=function(n){return"function"==typeof n}),O.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},O.isNaN=function(n){return O.isNumber(n)&&n!=+n},O.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==p.call(n)},O.isNull=function(n){return null===n},O.isUndefined=function(n){return void 0===n},O.has=function(n,t){return v.call(n,t)},O.noConflict=function(){return e._=u,this},O.identity=function(n){return n},O.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},O.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var q={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};q.unescape=O.invert(q.escape);var B={escape:RegExp("["+O.keys(q.escape).join("")+"]","g"),unescape:RegExp("("+O.keys(q.unescape).join("|")+")","g")};O.each(["escape","unescape"],function(n){O[n]=function(t){return null==t?"":(""+t).replace(B[n],function(t){return q[n][t]})}}),O.result=function(n,t){if(null==n)return void 0;var r=n[t];return O.isFunction(r)?r.call(n):r},O.mixin=function(n){k(O.functions(n),function(t){var r=O[t]=n[t];O.prototype[t]=function(){var n=[this._wrapped];return l.apply(n,arguments),U.call(this,r.apply(O,n))}})};var D=0;O.uniqueId=function(n){var t=++D+"";return n?n+t:t},O.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var z=/(.)^/,C={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},P=/\\|'|\r|\n|\t|\u2028|\u2029/g;O.template=function(n,t,r){var e;r=O.defaults({},r,O.templateSettings);var u=RegExp([(r.escape||z).source,(r.interpolate||z).source,(r.evaluate||z).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(P,function(n){return"\\"+C[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,O);var c=function(n){return e.call(this,n,O)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},O.chain=function(n){return O(n).chain()};var U=function(n){return this._chain?O(n).chain():n};O.mixin(O),k(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=a[n];O.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],U.call(this,r)}}),k(["concat","join","slice"],function(n){var t=a[n];O.prototype[n]=function(){return U.call(this,t.apply(this._wrapped,arguments))}}),O.extend(O.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}}),"function"==typeof r&&r.amd&&r("underscore",function(){return O})}).call(this),e("undefined"!=typeof _?_:window._)}).call(global,void 0,void 0,void 0,function(n){module.exports=n});}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],53:[function(require,module,exports){

},{}],54:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      console.trace();
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],55:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],56:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],57:[function(require,module,exports){
var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
   // Detect if browser supports Typed Arrays. Supported browsers are IE 10+,
   // Firefox 4+, Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+.
   if (typeof Uint8Array === 'undefined' || typeof ArrayBuffer === 'undefined')
      return false

  // Does the browser support adding properties to `Uint8Array` instances? If
  // not, then that's the same as no `Uint8Array` support. We need to be able to
  // add all the node Buffer API methods.
  // Relevant Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var arr = new Uint8Array(0)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // Assume object is an array
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof Uint8Array === 'function' &&
      subject instanceof Uint8Array) {
    // Speed optimization -- use set if we're copying from a Uint8Array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  switch (encoding || 'utf8') {
    case 'hex':
      return str.length / 2
    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length
    case 'ascii':
    case 'binary':
      return str.length
    case 'base64':
      return base64ToBytes(str).length
    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  switch (encoding) {
    case 'hex':
      return _hexWrite(this, string, offset, length)
    case 'utf8':
    case 'utf-8':
      return _utf8Write(this, string, offset, length)
    case 'ascii':
      return _asciiWrite(this, string, offset, length)
    case 'binary':
      return _binaryWrite(this, string, offset, length)
    case 'base64':
      return _base64Write(this, string, offset, length)
    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  switch (encoding) {
    case 'hex':
      return _hexSlice(self, start, end)
    case 'utf8':
    case 'utf-8':
      return _utf8Slice(self, start, end)
    case 'ascii':
      return _asciiSlice(self, start, end)
    case 'binary':
      return _binarySlice(self, start, end)
    case 'base64':
      return _base64Slice(self, start, end)
    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  // copy!
  for (var i = 0; i < end - start; i++)
    target[i + target_start] = this[i + start]
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

// http://nodejs.org/api/buffer.html#buffer_buf_slice_start_end
Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array === 'function') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment the Uint8Array *instance* (not the class!) with Buffer methods
 */
function augment (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value >= 0,
      'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint(value, max, min) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754(value, max, min) {
  assert(typeof value == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":58,"ieee754":59}],58:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var ZERO   = '0'.charCodeAt(0)
	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	module.exports.toByteArray = b64ToByteArray
	module.exports.fromByteArray = uint8ToBase64
}())

},{}],59:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],60:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;
var inherits = require('inherits');
var setImmediate = require('process/browser.js').nextTick;
var Readable = require('./readable.js');
var Writable = require('./writable.js');

inherits(Duplex, Readable);

Duplex.prototype.write = Writable.prototype.write;
Duplex.prototype.end = Writable.prototype.end;
Duplex.prototype._write = Writable.prototype._write;

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  var self = this;
  setImmediate(function () {
    self.end();
  });
}

},{"./readable.js":64,"./writable.js":66,"inherits":55,"process/browser.js":62}],61:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('./readable.js');
Stream.Writable = require('./writable.js');
Stream.Duplex = require('./duplex.js');
Stream.Transform = require('./transform.js');
Stream.PassThrough = require('./passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"./duplex.js":60,"./passthrough.js":63,"./readable.js":64,"./transform.js":65,"./writable.js":66,"events":54,"inherits":55}],62:[function(require,module,exports){
module.exports=require(56)
},{}],63:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./transform.js');
var inherits = require('inherits');
inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./transform.js":65,"inherits":55}],64:[function(require,module,exports){
(function (process){// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;
Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;
var Stream = require('./index.js');
var Buffer = require('buffer').Buffer;
var setImmediate = require('process/browser.js').nextTick;
var StringDecoder;

var inherits = require('inherits');
inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || n === null) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode &&
      !er) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    setImmediate(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    setImmediate(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    setImmediate(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  // check for listeners before emit removes one-time listeners.
  var errListeners = EE.listenerCount(dest, 'error');
  function onerror(er) {
    unpipe();
    if (errListeners === 0 && EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  dest.once('error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    setImmediate(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      setImmediate(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, function (x) {
      return self.emit.apply(self, ev, x);
    });
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    setImmediate(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require("/Users/oiva/Dropbox/projektit/kummi/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"./index.js":61,"/Users/oiva/Dropbox/projektit/kummi/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":56,"buffer":57,"events":54,"inherits":55,"process/browser.js":62,"string_decoder":67}],65:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./duplex.js');
var inherits = require('inherits');
inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./duplex.js":60,"inherits":55}],66:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;
Writable.WritableState = WritableState;

var isUint8Array = typeof Uint8Array !== 'undefined'
  ? function (x) { return x instanceof Uint8Array }
  : function (x) {
    return x && x.constructor && x.constructor.name === 'Uint8Array'
  }
;
var isArrayBuffer = typeof ArrayBuffer !== 'undefined'
  ? function (x) { return x instanceof ArrayBuffer }
  : function (x) {
    return x && x.constructor && x.constructor.name === 'ArrayBuffer'
  }
;

var inherits = require('inherits');
var Stream = require('./index.js');
var setImmediate = require('process/browser.js').nextTick;
var Buffer = require('buffer').Buffer;

inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];
}

function Writable(options) {
  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Stream.Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  setImmediate(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    setImmediate(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (!Buffer.isBuffer(chunk) && isUint8Array(chunk))
    chunk = new Buffer(chunk);
  if (isArrayBuffer(chunk) && typeof Uint8Array !== 'undefined')
    chunk = new Buffer(new Uint8Array(chunk));
  
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  state.needDrain = !ret;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    setImmediate(function() {
      cb(er);
    });
  else
    cb(er);

  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      setImmediate(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      setImmediate(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

},{"./index.js":61,"buffer":57,"inherits":55,"process/browser.js":62}],67:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

function assertEncoding(encoding) {
  if (encoding && !Buffer.isEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  this.charBuffer = new Buffer(6);
  this.charReceived = 0;
  this.charLength = 0;
};


StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  var offset = 0;

  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var i = (buffer.length >= this.charLength - this.charReceived) ?
                this.charLength - this.charReceived :
                buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, offset, i);
    this.charReceived += (i - offset);
    offset = i;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (i == buffer.length) return charStr;

    // otherwise cut off the characters end from the beginning of this buffer
    buffer = buffer.slice(i, buffer.length);
    break;
  }

  var lenIncomplete = this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - lenIncomplete, end);
    this.charReceived = lenIncomplete;
    end -= lenIncomplete;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    this.charBuffer.write(charStr.charAt(charStr.length - 1), this.encoding);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }

  return i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 2;
  this.charLength = incomplete ? 2 : 0;
  return incomplete;
}

function base64DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 3;
  this.charLength = incomplete ? 3 : 0;
  return incomplete;
}

},{"buffer":57}],68:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var Handlebars = require("./handlebars.runtime")["default"];

// Compiler imports
var AST = require("./handlebars/compiler/ast")["default"];
var Parser = require("./handlebars/compiler/base").parser;
var parse = require("./handlebars/compiler/base").parse;
var Compiler = require("./handlebars/compiler/compiler").Compiler;
var compile = require("./handlebars/compiler/compiler").compile;
var precompile = require("./handlebars/compiler/compiler").precompile;
var JavaScriptCompiler = require("./handlebars/compiler/javascript-compiler")["default"];

var _create = Handlebars.create;
var create = function() {
  var hb = _create();

  hb.compile = function(input, options) {
    return compile(input, options, hb);
  };
  hb.precompile = function (input, options) {
    return precompile(input, options, hb);
  };

  hb.AST = AST;
  hb.Compiler = Compiler;
  hb.JavaScriptCompiler = JavaScriptCompiler;
  hb.Parser = Parser;
  hb.parse = parse;

  return hb;
};

Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars.runtime":69,"./handlebars/compiler/ast":71,"./handlebars/compiler/base":72,"./handlebars/compiler/compiler":73,"./handlebars/compiler/javascript-compiler":74}],69:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":70,"./handlebars/exception":78,"./handlebars/runtime":79,"./handlebars/safe-string":80,"./handlebars/utils":81}],70:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":78,"./utils":81}],71:[function(require,module,exports){
"use strict";
var Exception = require("../exception")["default"];

function LocationInfo(locInfo){
  locInfo = locInfo || {};
  this.firstLine   = locInfo.first_line;
  this.firstColumn = locInfo.first_column;
  this.lastColumn  = locInfo.last_column;
  this.lastLine    = locInfo.last_line;
}

var AST = {
  ProgramNode: function(statements, inverseStrip, inverse, locInfo) {
    var inverseLocationInfo, firstInverseNode;
    if (arguments.length === 3) {
      locInfo = inverse;
      inverse = null;
    } else if (arguments.length === 2) {
      locInfo = inverseStrip;
      inverseStrip = null;
    }

    LocationInfo.call(this, locInfo);
    this.type = "program";
    this.statements = statements;
    this.strip = {};

    if(inverse) {
      firstInverseNode = inverse[0];
      if (firstInverseNode) {
        inverseLocationInfo = {
          first_line: firstInverseNode.firstLine,
          last_line: firstInverseNode.lastLine,
          last_column: firstInverseNode.lastColumn,
          first_column: firstInverseNode.firstColumn
        };
        this.inverse = new AST.ProgramNode(inverse, inverseStrip, inverseLocationInfo);
      } else {
        this.inverse = new AST.ProgramNode(inverse, inverseStrip);
      }
      this.strip.right = inverseStrip.left;
    } else if (inverseStrip) {
      this.strip.left = inverseStrip.right;
    }
  },

  MustacheNode: function(rawParams, hash, open, strip, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "mustache";
    this.strip = strip;

    // Open may be a string parsed from the parser or a passed boolean flag
    if (open != null && open.charAt) {
      // Must use charAt to support IE pre-10
      var escapeFlag = open.charAt(3) || open.charAt(2);
      this.escaped = escapeFlag !== '{' && escapeFlag !== '&';
    } else {
      this.escaped = !!open;
    }

    if (rawParams instanceof AST.SexprNode) {
      this.sexpr = rawParams;
    } else {
      // Support old AST API
      this.sexpr = new AST.SexprNode(rawParams, hash);
    }

    this.sexpr.isRoot = true;

    // Support old AST API that stored this info in MustacheNode
    this.id = this.sexpr.id;
    this.params = this.sexpr.params;
    this.hash = this.sexpr.hash;
    this.eligibleHelper = this.sexpr.eligibleHelper;
    this.isHelper = this.sexpr.isHelper;
  },

  SexprNode: function(rawParams, hash, locInfo) {
    LocationInfo.call(this, locInfo);

    this.type = "sexpr";
    this.hash = hash;

    var id = this.id = rawParams[0];
    var params = this.params = rawParams.slice(1);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    var eligibleHelper = this.eligibleHelper = id.isSimple;

    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    this.isHelper = eligibleHelper && (params.length || hash);

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
  },

  PartialNode: function(partialName, context, strip, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type         = "partial";
    this.partialName  = partialName;
    this.context      = context;
    this.strip = strip;
  },

  BlockNode: function(mustache, program, inverse, close, locInfo) {
    LocationInfo.call(this, locInfo);

    if(mustache.sexpr.id.original !== close.path.original) {
      throw new Exception(mustache.sexpr.id.original + " doesn't match " + close.path.original, this);
    }

    this.type = 'block';
    this.mustache = mustache;
    this.program  = program;
    this.inverse  = inverse;

    this.strip = {
      left: mustache.strip.left,
      right: close.strip.right
    };

    (program || inverse).strip.left = mustache.strip.right;
    (inverse || program).strip.right = close.strip.left;

    if (inverse && !program) {
      this.isInverse = true;
    }
  },

  ContentNode: function(string, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "content";
    this.string = string;
  },

  HashNode: function(pairs, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "hash";
    this.pairs = pairs;
  },

  IdNode: function(parts, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "ID";

    var original = "",
        dig = [],
        depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i].part;
      original += (parts[i].separator || '') + part;

      if (part === ".." || part === "." || part === "this") {
        if (dig.length > 0) {
          throw new Exception("Invalid path: " + original, this);
        } else if (part === "..") {
          depth++;
        } else {
          this.isScoped = true;
        }
      } else {
        dig.push(part);
      }
    }

    this.original = original;
    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;

    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

    this.stringModeValue = this.string;
  },

  PartialNameNode: function(name, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "PARTIAL_NAME";
    this.name = name.original;
  },

  DataNode: function(id, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "DATA";
    this.id = id;
  },

  StringNode: function(string, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "STRING";
    this.original =
      this.string =
      this.stringModeValue = string;
  },

  IntegerNode: function(integer, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "INTEGER";
    this.original =
      this.integer = integer;
    this.stringModeValue = Number(integer);
  },

  BooleanNode: function(bool, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "BOOLEAN";
    this.bool = bool;
    this.stringModeValue = bool === "true";
  },

  CommentNode: function(comment, locInfo) {
    LocationInfo.call(this, locInfo);
    this.type = "comment";
    this.comment = comment;
  }
};

// Must be exported as an object rather than the root of the module as the jison lexer
// most modify the object to operate properly.
exports["default"] = AST;
},{"../exception":78}],72:[function(require,module,exports){
"use strict";
var parser = require("./parser")["default"];
var AST = require("./ast")["default"];

exports.parser = parser;

function parse(input) {
  // Just return if an already-compile AST was passed in.
  if(input.constructor === AST.ProgramNode) { return input; }

  parser.yy = AST;
  return parser.parse(input);
}

exports.parse = parse;
},{"./ast":71,"./parser":75}],73:[function(require,module,exports){
"use strict";
var Exception = require("../exception")["default"];

function Compiler() {}

exports.Compiler = Compiler;// the foundHelper register will disambiguate helper lookup from finding a
// function in a context. This is necessary for mustache compatibility, which
// requires that context functions in blocks are evaluated by blockHelperMissing,
// and then proceed as if the resulting value was provided to blockHelperMissing.

Compiler.prototype = {
  compiler: Compiler,

  disassemble: function() {
    var opcodes = this.opcodes, opcode, out = [], params, param;

    for (var i=0, l=opcodes.length; i<l; i++) {
      opcode = opcodes[i];

      if (opcode.opcode === 'DECLARE') {
        out.push("DECLARE " + opcode.name + "=" + opcode.value);
      } else {
        params = [];
        for (var j=0; j<opcode.args.length; j++) {
          param = opcode.args[j];
          if (typeof param === "string") {
            param = "\"" + param.replace("\n", "\\n") + "\"";
          }
          params.push(param);
        }
        out.push(opcode.opcode + " " + params.join(" "));
      }
    }

    return out.join("\n");
  },

  equals: function(other) {
    var len = this.opcodes.length;
    if (other.opcodes.length !== len) {
      return false;
    }

    for (var i = 0; i < len; i++) {
      var opcode = this.opcodes[i],
          otherOpcode = other.opcodes[i];
      if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
        return false;
      }
      for (var j = 0; j < opcode.args.length; j++) {
        if (opcode.args[j] !== otherOpcode.args[j]) {
          return false;
        }
      }
    }

    len = this.children.length;
    if (other.children.length !== len) {
      return false;
    }
    for (i = 0; i < len; i++) {
      if (!this.children[i].equals(other.children[i])) {
        return false;
      }
    }

    return true;
  },

  guid: 0,

  compile: function(program, options) {
    this.opcodes = [];
    this.children = [];
    this.depths = {list: []};
    this.options = options;

    // These changes will propagate to the other compiler components
    var knownHelpers = this.options.knownHelpers;
    this.options.knownHelpers = {
      'helperMissing': true,
      'blockHelperMissing': true,
      'each': true,
      'if': true,
      'unless': true,
      'with': true,
      'log': true
    };
    if (knownHelpers) {
      for (var name in knownHelpers) {
        this.options.knownHelpers[name] = knownHelpers[name];
      }
    }

    return this.accept(program);
  },

  accept: function(node) {
    var strip = node.strip || {},
        ret;
    if (strip.left) {
      this.opcode('strip');
    }

    ret = this[node.type](node);

    if (strip.right) {
      this.opcode('strip');
    }

    return ret;
  },

  program: function(program) {
    var statements = program.statements;

    for(var i=0, l=statements.length; i<l; i++) {
      this.accept(statements[i]);
    }
    this.isSimple = l === 1;

    this.depths.list = this.depths.list.sort(function(a, b) {
      return a - b;
    });

    return this;
  },

  compileProgram: function(program) {
    var result = new this.compiler().compile(program, this.options);
    var guid = this.guid++, depth;

    this.usePartial = this.usePartial || result.usePartial;

    this.children[guid] = result;

    for(var i=0, l=result.depths.list.length; i<l; i++) {
      depth = result.depths.list[i];

      if(depth < 2) { continue; }
      else { this.addDepth(depth - 1); }
    }

    return guid;
  },

  block: function(block) {
    var mustache = block.mustache,
        program = block.program,
        inverse = block.inverse;

    if (program) {
      program = this.compileProgram(program);
    }

    if (inverse) {
      inverse = this.compileProgram(inverse);
    }

    var sexpr = mustache.sexpr;
    var type = this.classifySexpr(sexpr);

    if (type === "helper") {
      this.helperSexpr(sexpr, program, inverse);
    } else if (type === "simple") {
      this.simpleSexpr(sexpr);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('blockValue');
    } else {
      this.ambiguousSexpr(sexpr, program, inverse);

      // now that the simple mustache is resolved, we need to
      // evaluate it by executing `blockHelperMissing`
      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);
      this.opcode('emptyHash');
      this.opcode('ambiguousBlockValue');
    }

    this.opcode('append');
  },

  hash: function(hash) {
    var pairs = hash.pairs, pair, val;

    this.opcode('pushHash');

    for(var i=0, l=pairs.length; i<l; i++) {
      pair = pairs[i];
      val  = pair[1];

      if (this.options.stringParams) {
        if(val.depth) {
          this.addDepth(val.depth);
        }
        this.opcode('getContext', val.depth || 0);
        this.opcode('pushStringParam', val.stringModeValue, val.type);

        if (val.type === 'sexpr') {
          // Subexpressions get evaluated and passed in
          // in string params mode.
          this.sexpr(val);
        }
      } else {
        this.accept(val);
      }

      this.opcode('assignToHash', pair[0]);
    }
    this.opcode('popHash');
  },

  partial: function(partial) {
    var partialName = partial.partialName;
    this.usePartial = true;

    if(partial.context) {
      this.ID(partial.context);
    } else {
      this.opcode('push', 'depth0');
    }

    this.opcode('invokePartial', partialName.name);
    this.opcode('append');
  },

  content: function(content) {
    this.opcode('appendContent', content.string);
  },

  mustache: function(mustache) {
    this.sexpr(mustache.sexpr);

    if(mustache.escaped && !this.options.noEscape) {
      this.opcode('appendEscaped');
    } else {
      this.opcode('append');
    }
  },

  ambiguousSexpr: function(sexpr, program, inverse) {
    var id = sexpr.id,
        name = id.parts[0],
        isBlock = program != null || inverse != null;

    this.opcode('getContext', id.depth);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    this.opcode('invokeAmbiguous', name, isBlock);
  },

  simpleSexpr: function(sexpr) {
    var id = sexpr.id;

    if (id.type === 'DATA') {
      this.DATA(id);
    } else if (id.parts.length) {
      this.ID(id);
    } else {
      // Simplified ID for `this`
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);
      this.opcode('pushContext');
    }

    this.opcode('resolvePossibleLambda');
  },

  helperSexpr: function(sexpr, program, inverse) {
    var params = this.setupFullMustacheParams(sexpr, program, inverse),
        name = sexpr.id.parts[0];

    if (this.options.knownHelpers[name]) {
      this.opcode('invokeKnownHelper', params.length, name);
    } else if (this.options.knownHelpersOnly) {
      throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
    } else {
      this.opcode('invokeHelper', params.length, name, sexpr.isRoot);
    }
  },

  sexpr: function(sexpr) {
    var type = this.classifySexpr(sexpr);

    if (type === "simple") {
      this.simpleSexpr(sexpr);
    } else if (type === "helper") {
      this.helperSexpr(sexpr);
    } else {
      this.ambiguousSexpr(sexpr);
    }
  },

  ID: function(id) {
    this.addDepth(id.depth);
    this.opcode('getContext', id.depth);

    var name = id.parts[0];
    if (!name) {
      this.opcode('pushContext');
    } else {
      this.opcode('lookupOnContext', id.parts[0]);
    }

    for(var i=1, l=id.parts.length; i<l; i++) {
      this.opcode('lookup', id.parts[i]);
    }
  },

  DATA: function(data) {
    this.options.data = true;
    if (data.id.isScoped || data.id.depth) {
      throw new Exception('Scoped data references are not supported: ' + data.original, data);
    }

    this.opcode('lookupData');
    var parts = data.id.parts;
    for(var i=0, l=parts.length; i<l; i++) {
      this.opcode('lookup', parts[i]);
    }
  },

  STRING: function(string) {
    this.opcode('pushString', string.string);
  },

  INTEGER: function(integer) {
    this.opcode('pushLiteral', integer.integer);
  },

  BOOLEAN: function(bool) {
    this.opcode('pushLiteral', bool.bool);
  },

  comment: function() {},

  // HELPERS
  opcode: function(name) {
    this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
  },

  declare: function(name, value) {
    this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
  },

  addDepth: function(depth) {
    if(depth === 0) { return; }

    if(!this.depths[depth]) {
      this.depths[depth] = true;
      this.depths.list.push(depth);
    }
  },

  classifySexpr: function(sexpr) {
    var isHelper   = sexpr.isHelper;
    var isEligible = sexpr.eligibleHelper;
    var options    = this.options;

    // if ambiguous, we can possibly resolve the ambiguity now
    if (isEligible && !isHelper) {
      var name = sexpr.id.parts[0];

      if (options.knownHelpers[name]) {
        isHelper = true;
      } else if (options.knownHelpersOnly) {
        isEligible = false;
      }
    }

    if (isHelper) { return "helper"; }
    else if (isEligible) { return "ambiguous"; }
    else { return "simple"; }
  },

  pushParams: function(params) {
    var i = params.length, param;

    while(i--) {
      param = params[i];

      if(this.options.stringParams) {
        if(param.depth) {
          this.addDepth(param.depth);
        }

        this.opcode('getContext', param.depth || 0);
        this.opcode('pushStringParam', param.stringModeValue, param.type);

        if (param.type === 'sexpr') {
          // Subexpressions get evaluated and passed in
          // in string params mode.
          this.sexpr(param);
        }
      } else {
        this[param.type](param);
      }
    }
  },

  setupFullMustacheParams: function(sexpr, program, inverse) {
    var params = sexpr.params;
    this.pushParams(params);

    this.opcode('pushProgram', program);
    this.opcode('pushProgram', inverse);

    if (sexpr.hash) {
      this.hash(sexpr.hash);
    } else {
      this.opcode('emptyHash');
    }

    return params;
  }
};

function precompile(input, options, env) {
  if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
    throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }

  var ast = env.parse(input);
  var environment = new env.Compiler().compile(ast, options);
  return new env.JavaScriptCompiler().compile(environment, options);
}

exports.precompile = precompile;function compile(input, options, env) {
  if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
    throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
  }

  options = options || {};

  if (!('data' in options)) {
    options.data = true;
  }

  var compiled;

  function compileInput() {
    var ast = env.parse(input);
    var environment = new env.Compiler().compile(ast, options);
    var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
    return env.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compileInput();
    }
    return compiled.call(this, context, options);
  };
}

exports.compile = compile;
},{"../exception":78}],74:[function(require,module,exports){
"use strict";
var COMPILER_REVISION = require("../base").COMPILER_REVISION;
var REVISION_CHANGES = require("../base").REVISION_CHANGES;
var log = require("../base").log;
var Exception = require("../exception")["default"];

function Literal(value) {
  this.value = value;
}

function JavaScriptCompiler() {}

JavaScriptCompiler.prototype = {
  // PUBLIC API: You can override these methods in a subclass to provide
  // alternative compiled forms for name lookup and buffering semantics
  nameLookup: function(parent, name /* , type*/) {
    var wrap,
        ret;
    if (parent.indexOf('depth') === 0) {
      wrap = true;
    }

    if (/^[0-9]+$/.test(name)) {
      ret = parent + "[" + name + "]";
    } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
      ret = parent + "." + name;
    }
    else {
      ret = parent + "['" + name + "']";
    }

    if (wrap) {
      return '(' + parent + ' && ' + ret + ')';
    } else {
      return ret;
    }
  },

  compilerInfo: function() {
    var revision = COMPILER_REVISION,
        versions = REVISION_CHANGES[revision];
    return "this.compilerInfo = ["+revision+",'"+versions+"'];\n";
  },

  appendToBuffer: function(string) {
    if (this.environment.isSimple) {
      return "return " + string + ";";
    } else {
      return {
        appendToBuffer: true,
        content: string,
        toString: function() { return "buffer += " + string + ";"; }
      };
    }
  },

  initializeBuffer: function() {
    return this.quotedString("");
  },

  namespace: "Handlebars",
  // END PUBLIC API

  compile: function(environment, options, context, asObject) {
    this.environment = environment;
    this.options = options || {};

    log('debug', this.environment.disassemble() + "\n\n");

    this.name = this.environment.name;
    this.isChild = !!context;
    this.context = context || {
      programs: [],
      environments: [],
      aliases: { }
    };

    this.preamble();

    this.stackSlot = 0;
    this.stackVars = [];
    this.registers = { list: [] };
    this.hashes = [];
    this.compileStack = [];
    this.inlineStack = [];

    this.compileChildren(environment, options);

    var opcodes = environment.opcodes, opcode;

    this.i = 0;

    for(var l=opcodes.length; this.i<l; this.i++) {
      opcode = opcodes[this.i];

      if(opcode.opcode === 'DECLARE') {
        this[opcode.name] = opcode.value;
      } else {
        this[opcode.opcode].apply(this, opcode.args);
      }

      // Reset the stripNext flag if it was not set by this operation.
      if (opcode.opcode !== this.stripNext) {
        this.stripNext = false;
      }
    }

    // Flush any trailing content that might be pending.
    this.pushSource('');

    if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
      throw new Exception('Compile completed with content left on stack');
    }

    return this.createFunctionContext(asObject);
  },

  preamble: function() {
    var out = [];

    if (!this.isChild) {
      var namespace = this.namespace;

      var copies = "helpers = this.merge(helpers, " + namespace + ".helpers);";
      if (this.environment.usePartial) { copies = copies + " partials = this.merge(partials, " + namespace + ".partials);"; }
      if (this.options.data) { copies = copies + " data = data || {};"; }
      out.push(copies);
    } else {
      out.push('');
    }

    if (!this.environment.isSimple) {
      out.push(", buffer = " + this.initializeBuffer());
    } else {
      out.push("");
    }

    // track the last context pushed into place to allow skipping the
    // getContext opcode when it would be a noop
    this.lastContext = 0;
    this.source = out;
  },

  createFunctionContext: function(asObject) {
    var locals = this.stackVars.concat(this.registers.list);

    if(locals.length > 0) {
      this.source[1] = this.source[1] + ", " + locals.join(", ");
    }

    // Generate minimizer alias mappings
    if (!this.isChild) {
      for (var alias in this.context.aliases) {
        if (this.context.aliases.hasOwnProperty(alias)) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }
    }

    if (this.source[1]) {
      this.source[1] = "var " + this.source[1].substring(2) + ";";
    }

    // Merge children
    if (!this.isChild) {
      this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
    }

    if (!this.environment.isSimple) {
      this.pushSource("return buffer;");
    }

    var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

    for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
      params.push("depth" + this.environment.depths.list[i]);
    }

    // Perform a second pass over the output to merge content when possible
    var source = this.mergeSource();

    if (!this.isChild) {
      source = this.compilerInfo()+source;
    }

    if (asObject) {
      params.push(source);

      return Function.apply(this, params);
    } else {
      var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + source + '}';
      log('debug', functionSource + "\n\n");
      return functionSource;
    }
  },
  mergeSource: function() {
    // WARN: We are not handling the case where buffer is still populated as the source should
    // not have buffer append operations as their final action.
    var source = '',
        buffer;
    for (var i = 0, len = this.source.length; i < len; i++) {
      var line = this.source[i];
      if (line.appendToBuffer) {
        if (buffer) {
          buffer = buffer + '\n    + ' + line.content;
        } else {
          buffer = line.content;
        }
      } else {
        if (buffer) {
          source += 'buffer += ' + buffer + ';\n  ';
          buffer = undefined;
        }
        source += line + '\n  ';
      }
    }
    return source;
  },

  // [blockValue]
  //
  // On stack, before: hash, inverse, program, value
  // On stack, after: return value of blockHelperMissing
  //
  // The purpose of this opcode is to take a block of the form
  // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
  // replace it on the stack with the result of properly
  // invoking blockHelperMissing.
  blockValue: function() {
    this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

    var params = ["depth0"];
    this.setupParams(0, params);

    this.replaceStack(function(current) {
      params.splice(1, 0, current);
      return "blockHelperMissing.call(" + params.join(", ") + ")";
    });
  },

  // [ambiguousBlockValue]
  //
  // On stack, before: hash, inverse, program, value
  // Compiler value, before: lastHelper=value of last found helper, if any
  // On stack, after, if no lastHelper: same as [blockValue]
  // On stack, after, if lastHelper: value
  ambiguousBlockValue: function() {
    this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

    var params = ["depth0"];
    this.setupParams(0, params);

    var current = this.topStack();
    params.splice(1, 0, current);

    this.pushSource("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
  },

  // [appendContent]
  //
  // On stack, before: ...
  // On stack, after: ...
  //
  // Appends the string value of `content` to the current buffer
  appendContent: function(content) {
    if (this.pendingContent) {
      content = this.pendingContent + content;
    }
    if (this.stripNext) {
      content = content.replace(/^\s+/, '');
    }

    this.pendingContent = content;
  },

  // [strip]
  //
  // On stack, before: ...
  // On stack, after: ...
  //
  // Removes any trailing whitespace from the prior content node and flags
  // the next operation for stripping if it is a content node.
  strip: function() {
    if (this.pendingContent) {
      this.pendingContent = this.pendingContent.replace(/\s+$/, '');
    }
    this.stripNext = 'strip';
  },

  // [append]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Coerces `value` to a String and appends it to the current buffer.
  //
  // If `value` is truthy, or 0, it is coerced into a string and appended
  // Otherwise, the empty string is appended
  append: function() {
    // Force anything that is inlined onto the stack so we don't have duplication
    // when we examine local
    this.flushInline();
    var local = this.popStack();
    this.pushSource("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
    if (this.environment.isSimple) {
      this.pushSource("else { " + this.appendToBuffer("''") + " }");
    }
  },

  // [appendEscaped]
  //
  // On stack, before: value, ...
  // On stack, after: ...
  //
  // Escape `value` and append it to the buffer
  appendEscaped: function() {
    this.context.aliases.escapeExpression = 'this.escapeExpression';

    this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
  },

  // [getContext]
  //
  // On stack, before: ...
  // On stack, after: ...
  // Compiler value, after: lastContext=depth
  //
  // Set the value of the `lastContext` compiler value to the depth
  getContext: function(depth) {
    if(this.lastContext !== depth) {
      this.lastContext = depth;
    }
  },

  // [lookupOnContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext[name], ...
  //
  // Looks up the value of `name` on the current context and pushes
  // it onto the stack.
  lookupOnContext: function(name) {
    this.push(this.nameLookup('depth' + this.lastContext, name, 'context'));
  },

  // [pushContext]
  //
  // On stack, before: ...
  // On stack, after: currentContext, ...
  //
  // Pushes the value of the current context onto the stack.
  pushContext: function() {
    this.pushStackLiteral('depth' + this.lastContext);
  },

  // [resolvePossibleLambda]
  //
  // On stack, before: value, ...
  // On stack, after: resolved value, ...
  //
  // If the `value` is a lambda, replace it on the stack by
  // the return value of the lambda
  resolvePossibleLambda: function() {
    this.context.aliases.functionType = '"function"';

    this.replaceStack(function(current) {
      return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
    });
  },

  // [lookup]
  //
  // On stack, before: value, ...
  // On stack, after: value[name], ...
  //
  // Replace the value on the stack with the result of looking
  // up `name` on `value`
  lookup: function(name) {
    this.replaceStack(function(current) {
      return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
    });
  },

  // [lookupData]
  //
  // On stack, before: ...
  // On stack, after: data, ...
  //
  // Push the data lookup operator
  lookupData: function() {
    this.pushStackLiteral('data');
  },

  // [pushStringParam]
  //
  // On stack, before: ...
  // On stack, after: string, currentContext, ...
  //
  // This opcode is designed for use in string mode, which
  // provides the string value of a parameter along with its
  // depth rather than resolving it immediately.
  pushStringParam: function(string, type) {
    this.pushStackLiteral('depth' + this.lastContext);

    this.pushString(type);

    // If it's a subexpression, the string result
    // will be pushed after this opcode.
    if (type !== 'sexpr') {
      if (typeof string === 'string') {
        this.pushString(string);
      } else {
        this.pushStackLiteral(string);
      }
    }
  },

  emptyHash: function() {
    this.pushStackLiteral('{}');

    if (this.options.stringParams) {
      this.push('{}'); // hashContexts
      this.push('{}'); // hashTypes
    }
  },
  pushHash: function() {
    if (this.hash) {
      this.hashes.push(this.hash);
    }
    this.hash = {values: [], types: [], contexts: []};
  },
  popHash: function() {
    var hash = this.hash;
    this.hash = this.hashes.pop();

    if (this.options.stringParams) {
      this.push('{' + hash.contexts.join(',') + '}');
      this.push('{' + hash.types.join(',') + '}');
    }

    this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
  },

  // [pushString]
  //
  // On stack, before: ...
  // On stack, after: quotedString(string), ...
  //
  // Push a quoted version of `string` onto the stack
  pushString: function(string) {
    this.pushStackLiteral(this.quotedString(string));
  },

  // [push]
  //
  // On stack, before: ...
  // On stack, after: expr, ...
  //
  // Push an expression onto the stack
  push: function(expr) {
    this.inlineStack.push(expr);
    return expr;
  },

  // [pushLiteral]
  //
  // On stack, before: ...
  // On stack, after: value, ...
  //
  // Pushes a value onto the stack. This operation prevents
  // the compiler from creating a temporary variable to hold
  // it.
  pushLiteral: function(value) {
    this.pushStackLiteral(value);
  },

  // [pushProgram]
  //
  // On stack, before: ...
  // On stack, after: program(guid), ...
  //
  // Push a program expression onto the stack. This takes
  // a compile-time guid and converts it into a runtime-accessible
  // expression.
  pushProgram: function(guid) {
    if (guid != null) {
      this.pushStackLiteral(this.programExpression(guid));
    } else {
      this.pushStackLiteral(null);
    }
  },

  // [invokeHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // Pops off the helper's parameters, invokes the helper,
  // and pushes the helper's return value onto the stack.
  //
  // If the helper is not found, `helperMissing` is called.
  invokeHelper: function(paramSize, name, isRoot) {
    this.context.aliases.helperMissing = 'helpers.helperMissing';
    this.useRegister('helper');

    var helper = this.lastHelper = this.setupHelper(paramSize, name, true);
    var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');

    var lookup = 'helper = ' + helper.name + ' || ' + nonHelper;
    if (helper.paramsInit) {
      lookup += ',' + helper.paramsInit;
    }

    this.push(
      '('
        + lookup
        + ',helper '
          + '? helper.call(' + helper.callParams + ') '
          + ': helperMissing.call(' + helper.helperMissingParams + '))');

    // Always flush subexpressions. This is both to prevent the compounding size issue that
    // occurs when the code has to be duplicated for inlining and also to prevent errors
    // due to the incorrect options object being passed due to the shared register.
    if (!isRoot) {
      this.flushInline();
    }
  },

  // [invokeKnownHelper]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of helper invocation
  //
  // This operation is used when the helper is known to exist,
  // so a `helperMissing` fallback is not required.
  invokeKnownHelper: function(paramSize, name) {
    var helper = this.setupHelper(paramSize, name);
    this.push(helper.name + ".call(" + helper.callParams + ")");
  },

  // [invokeAmbiguous]
  //
  // On stack, before: hash, inverse, program, params..., ...
  // On stack, after: result of disambiguation
  //
  // This operation is used when an expression like `{{foo}}`
  // is provided, but we don't know at compile-time whether it
  // is a helper or a path.
  //
  // This operation emits more code than the other options,
  // and can be avoided by passing the `knownHelpers` and
  // `knownHelpersOnly` flags at compile-time.
  invokeAmbiguous: function(name, helperCall) {
    this.context.aliases.functionType = '"function"';
    this.useRegister('helper');

    this.emptyHash();
    var helper = this.setupHelper(0, name, helperCall);

    var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

    var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
    var nextStack = this.nextStack();

    if (helper.paramsInit) {
      this.pushSource(helper.paramsInit);
    }
    this.pushSource('if (helper = ' + helperName + ') { ' + nextStack + ' = helper.call(' + helper.callParams + '); }');
    this.pushSource('else { helper = ' + nonHelper + '; ' + nextStack + ' = typeof helper === functionType ? helper.call(' + helper.callParams + ') : helper; }');
  },

  // [invokePartial]
  //
  // On stack, before: context, ...
  // On stack after: result of partial invocation
  //
  // This operation pops off a context, invokes a partial with that context,
  // and pushes the result of the invocation back.
  invokePartial: function(name) {
    var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

    if (this.options.data) {
      params.push("data");
    }

    this.context.aliases.self = "this";
    this.push("self.invokePartial(" + params.join(", ") + ")");
  },

  // [assignToHash]
  //
  // On stack, before: value, hash, ...
  // On stack, after: hash, ...
  //
  // Pops a value and hash off the stack, assigns `hash[key] = value`
  // and pushes the hash back onto the stack.
  assignToHash: function(key) {
    var value = this.popStack(),
        context,
        type;

    if (this.options.stringParams) {
      type = this.popStack();
      context = this.popStack();
    }

    var hash = this.hash;
    if (context) {
      hash.contexts.push("'" + key + "': " + context);
    }
    if (type) {
      hash.types.push("'" + key + "': " + type);
    }
    hash.values.push("'" + key + "': (" + value + ")");
  },

  // HELPERS

  compiler: JavaScriptCompiler,

  compileChildren: function(environment, options) {
    var children = environment.children, child, compiler;

    for(var i=0, l=children.length; i<l; i++) {
      child = children[i];
      compiler = new this.compiler();

      var index = this.matchExistingProgram(child);

      if (index == null) {
        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
        this.context.environments[index] = child;
      } else {
        child.index = index;
        child.name = 'program' + index;
      }
    }
  },
  matchExistingProgram: function(child) {
    for (var i = 0, len = this.context.environments.length; i < len; i++) {
      var environment = this.context.environments[i];
      if (environment && environment.equals(child)) {
        return i;
      }
    }
  },

  programExpression: function(guid) {
    this.context.aliases.self = "this";

    if(guid == null) {
      return "self.noop";
    }

    var child = this.environment.children[guid],
        depths = child.depths.list, depth;

    var programParams = [child.index, child.name, "data"];

    for(var i=0, l = depths.length; i<l; i++) {
      depth = depths[i];

      if(depth === 1) { programParams.push("depth0"); }
      else { programParams.push("depth" + (depth - 1)); }
    }

    return (depths.length === 0 ? "self.program(" : "self.programWithDepth(") + programParams.join(", ") + ")";
  },

  register: function(name, val) {
    this.useRegister(name);
    this.pushSource(name + " = " + val + ";");
  },

  useRegister: function(name) {
    if(!this.registers[name]) {
      this.registers[name] = true;
      this.registers.list.push(name);
    }
  },

  pushStackLiteral: function(item) {
    return this.push(new Literal(item));
  },

  pushSource: function(source) {
    if (this.pendingContent) {
      this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent)));
      this.pendingContent = undefined;
    }

    if (source) {
      this.source.push(source);
    }
  },

  pushStack: function(item) {
    this.flushInline();

    var stack = this.incrStack();
    if (item) {
      this.pushSource(stack + " = " + item + ";");
    }
    this.compileStack.push(stack);
    return stack;
  },

  replaceStack: function(callback) {
    var prefix = '',
        inline = this.isInline(),
        stack,
        createdStack,
        usedLiteral;

    // If we are currently inline then we want to merge the inline statement into the
    // replacement statement via ','
    if (inline) {
      var top = this.popStack(true);

      if (top instanceof Literal) {
        // Literals do not need to be inlined
        stack = top.value;
        usedLiteral = true;
      } else {
        // Get or create the current stack name for use by the inline
        createdStack = !this.stackSlot;
        var name = !createdStack ? this.topStackName() : this.incrStack();

        prefix = '(' + this.push(name) + ' = ' + top + '),';
        stack = this.topStack();
      }
    } else {
      stack = this.topStack();
    }

    var item = callback.call(this, stack);

    if (inline) {
      if (!usedLiteral) {
        this.popStack();
      }
      if (createdStack) {
        this.stackSlot--;
      }
      this.push('(' + prefix + item + ')');
    } else {
      // Prevent modification of the context depth variable. Through replaceStack
      if (!/^stack/.test(stack)) {
        stack = this.nextStack();
      }

      this.pushSource(stack + " = (" + prefix + item + ");");
    }
    return stack;
  },

  nextStack: function() {
    return this.pushStack();
  },

  incrStack: function() {
    this.stackSlot++;
    if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
    return this.topStackName();
  },
  topStackName: function() {
    return "stack" + this.stackSlot;
  },
  flushInline: function() {
    var inlineStack = this.inlineStack;
    if (inlineStack.length) {
      this.inlineStack = [];
      for (var i = 0, len = inlineStack.length; i < len; i++) {
        var entry = inlineStack[i];
        if (entry instanceof Literal) {
          this.compileStack.push(entry);
        } else {
          this.pushStack(entry);
        }
      }
    }
  },
  isInline: function() {
    return this.inlineStack.length;
  },

  popStack: function(wrapped) {
    var inline = this.isInline(),
        item = (inline ? this.inlineStack : this.compileStack).pop();

    if (!wrapped && (item instanceof Literal)) {
      return item.value;
    } else {
      if (!inline) {
        if (!this.stackSlot) {
          throw new Exception('Invalid stack pop');
        }
        this.stackSlot--;
      }
      return item;
    }
  },

  topStack: function(wrapped) {
    var stack = (this.isInline() ? this.inlineStack : this.compileStack),
        item = stack[stack.length - 1];

    if (!wrapped && (item instanceof Literal)) {
      return item.value;
    } else {
      return item;
    }
  },

  quotedString: function(str) {
    return '"' + str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
      .replace(/\u2029/g, '\\u2029') + '"';
  },

  setupHelper: function(paramSize, name, missingParams) {
    var params = [],
        paramsInit = this.setupParams(paramSize, params, missingParams);
    var foundHelper = this.nameLookup('helpers', name, 'helper');

    return {
      params: params,
      paramsInit: paramsInit,
      name: foundHelper,
      callParams: ["depth0"].concat(params).join(", "),
      helperMissingParams: missingParams && ["depth0", this.quotedString(name)].concat(params).join(", ")
    };
  },

  setupOptions: function(paramSize, params) {
    var options = [], contexts = [], types = [], param, inverse, program;

    options.push("hash:" + this.popStack());

    if (this.options.stringParams) {
      options.push("hashTypes:" + this.popStack());
      options.push("hashContexts:" + this.popStack());
    }

    inverse = this.popStack();
    program = this.popStack();

    // Avoid setting fn and inverse if neither are set. This allows
    // helpers to do a check for `if (options.fn)`
    if (program || inverse) {
      if (!program) {
        this.context.aliases.self = "this";
        program = "self.noop";
      }

      if (!inverse) {
        this.context.aliases.self = "this";
        inverse = "self.noop";
      }

      options.push("inverse:" + inverse);
      options.push("fn:" + program);
    }

    for(var i=0; i<paramSize; i++) {
      param = this.popStack();
      params.push(param);

      if(this.options.stringParams) {
        types.push(this.popStack());
        contexts.push(this.popStack());
      }
    }

    if (this.options.stringParams) {
      options.push("contexts:[" + contexts.join(",") + "]");
      options.push("types:[" + types.join(",") + "]");
    }

    if(this.options.data) {
      options.push("data:data");
    }

    return options;
  },

  // the params and contexts arguments are passed in arrays
  // to fill in
  setupParams: function(paramSize, params, useRegister) {
    var options = '{' + this.setupOptions(paramSize, params).join(',') + '}';

    if (useRegister) {
      this.useRegister('options');
      params.push('options');
      return 'options=' + options;
    } else {
      params.push(options);
      return '';
    }
  }
};

var reservedWords = (
  "break else new var" +
  " case finally return void" +
  " catch for switch while" +
  " continue function this with" +
  " default if throw" +
  " delete in try" +
  " do instanceof typeof" +
  " abstract enum int short" +
  " boolean export interface static" +
  " byte extends long super" +
  " char final native synchronized" +
  " class float package throws" +
  " const goto private transient" +
  " debugger implements protected volatile" +
  " double import public let yield"
).split(" ");

var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

for(var i=0, l=reservedWords.length; i<l; i++) {
  compilerWords[reservedWords[i]] = true;
}

JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
  if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name)) {
    return true;
  }
  return false;
};

exports["default"] = JavaScriptCompiler;
},{"../base":70,"../exception":78}],75:[function(require,module,exports){
"use strict";
/* jshint ignore:start */
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"statements":4,"EOF":5,"program":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"sexpr":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"CLOSE_UNESCAPED":24,"OPEN_PARTIAL":25,"partialName":26,"partial_option0":27,"sexpr_repetition0":28,"sexpr_option0":29,"dataName":30,"param":31,"STRING":32,"INTEGER":33,"BOOLEAN":34,"OPEN_SEXPR":35,"CLOSE_SEXPR":36,"hash":37,"hash_repetition_plus0":38,"hashSegment":39,"ID":40,"EQUALS":41,"DATA":42,"pathSegments":43,"SEP":44,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"CLOSE_UNESCAPED",25:"OPEN_PARTIAL",32:"STRING",33:"INTEGER",34:"BOOLEAN",35:"OPEN_SEXPR",36:"CLOSE_SEXPR",40:"ID",41:"EQUALS",42:"DATA",44:"SEP"},
productions_: [0,[3,2],[3,1],[6,2],[6,3],[6,2],[6,1],[6,1],[6,0],[4,1],[4,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,4],[7,2],[17,3],[17,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,3],[37,1],[39,3],[26,1],[26,1],[26,1],[30,2],[21,1],[43,3],[43,1],[27,0],[27,1],[28,0],[28,2],[29,0],[29,1],[38,1],[38,2]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return new yy.ProgramNode($$[$0-1], this._$); 
break;
case 2: return new yy.ProgramNode([], this._$); 
break;
case 3:this.$ = new yy.ProgramNode([], $$[$0-1], $$[$0], this._$);
break;
case 4:this.$ = new yy.ProgramNode($$[$0-2], $$[$0-1], $$[$0], this._$);
break;
case 5:this.$ = new yy.ProgramNode($$[$0-1], $$[$0], [], this._$);
break;
case 6:this.$ = new yy.ProgramNode($$[$0], this._$);
break;
case 7:this.$ = new yy.ProgramNode([], this._$);
break;
case 8:this.$ = new yy.ProgramNode([], this._$);
break;
case 9:this.$ = [$$[$0]];
break;
case 10: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 11:this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0], this._$);
break;
case 12:this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0], this._$);
break;
case 13:this.$ = $$[$0];
break;
case 14:this.$ = $$[$0];
break;
case 15:this.$ = new yy.ContentNode($$[$0], this._$);
break;
case 16:this.$ = new yy.CommentNode($$[$0], this._$);
break;
case 17:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
break;
case 18:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
break;
case 19:this.$ = {path: $$[$0-1], strip: stripFlags($$[$0-2], $$[$0])};
break;
case 20:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
break;
case 21:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], stripFlags($$[$0-2], $$[$0]), this._$);
break;
case 22:this.$ = new yy.PartialNode($$[$0-2], $$[$0-1], stripFlags($$[$0-3], $$[$0]), this._$);
break;
case 23:this.$ = stripFlags($$[$0-1], $$[$0]);
break;
case 24:this.$ = new yy.SexprNode([$$[$0-2]].concat($$[$0-1]), $$[$0], this._$);
break;
case 25:this.$ = new yy.SexprNode([$$[$0]], null, this._$);
break;
case 26:this.$ = $$[$0];
break;
case 27:this.$ = new yy.StringNode($$[$0], this._$);
break;
case 28:this.$ = new yy.IntegerNode($$[$0], this._$);
break;
case 29:this.$ = new yy.BooleanNode($$[$0], this._$);
break;
case 30:this.$ = $$[$0];
break;
case 31:$$[$0-1].isHelper = true; this.$ = $$[$0-1];
break;
case 32:this.$ = new yy.HashNode($$[$0], this._$);
break;
case 33:this.$ = [$$[$0-2], $$[$0]];
break;
case 34:this.$ = new yy.PartialNameNode($$[$0], this._$);
break;
case 35:this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0], this._$), this._$);
break;
case 36:this.$ = new yy.PartialNameNode(new yy.IntegerNode($$[$0], this._$));
break;
case 37:this.$ = new yy.DataNode($$[$0], this._$);
break;
case 38:this.$ = new yy.IdNode($$[$0], this._$);
break;
case 39: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2]; 
break;
case 40:this.$ = [{part: $$[$0]}];
break;
case 43:this.$ = [];
break;
case 44:$$[$0-1].push($$[$0]);
break;
case 47:this.$ = [$$[$0]];
break;
case 48:$$[$0-1].push($$[$0]);
break;
}
},
table: [{3:1,4:2,5:[1,3],8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[3]},{5:[1,16],8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],25:[1,15]},{1:[2,2]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],25:[2,9]},{4:20,6:18,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{4:20,6:22,7:19,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,8],22:[1,13],23:[1,14],25:[1,15]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],25:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],25:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],25:[2,15]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],25:[2,16]},{17:23,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:29,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:30,21:24,30:25,40:[1,28],42:[1,27],43:26},{17:31,21:24,30:25,40:[1,28],42:[1,27],43:26},{21:33,26:32,32:[1,34],33:[1,35],40:[1,28],43:26},{1:[2,1]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],25:[2,10]},{10:36,20:[1,37]},{4:38,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,7],22:[1,13],23:[1,14],25:[1,15]},{7:39,8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,21],20:[2,6],22:[1,13],23:[1,14],25:[1,15]},{17:23,18:[1,40],21:24,30:25,40:[1,28],42:[1,27],43:26},{10:41,20:[1,37]},{18:[1,42]},{18:[2,43],24:[2,43],28:43,32:[2,43],33:[2,43],34:[2,43],35:[2,43],36:[2,43],40:[2,43],42:[2,43]},{18:[2,25],24:[2,25],36:[2,25]},{18:[2,38],24:[2,38],32:[2,38],33:[2,38],34:[2,38],35:[2,38],36:[2,38],40:[2,38],42:[2,38],44:[1,44]},{21:45,40:[1,28],43:26},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],42:[2,40],44:[2,40]},{18:[1,46]},{18:[1,47]},{24:[1,48]},{18:[2,41],21:50,27:49,40:[1,28],43:26},{18:[2,34],40:[2,34]},{18:[2,35],40:[2,35]},{18:[2,36],40:[2,36]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],25:[2,11]},{21:51,40:[1,28],43:26},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,3],22:[1,13],23:[1,14],25:[1,15]},{4:52,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,5],22:[1,13],23:[1,14],25:[1,15]},{14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],25:[2,23]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],25:[2,12]},{14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],25:[2,18]},{18:[2,45],21:56,24:[2,45],29:53,30:60,31:54,32:[1,57],33:[1,58],34:[1,59],35:[1,61],36:[2,45],37:55,38:62,39:63,40:[1,64],42:[1,27],43:26},{40:[1,65]},{18:[2,37],24:[2,37],32:[2,37],33:[2,37],34:[2,37],35:[2,37],36:[2,37],40:[2,37],42:[2,37]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],25:[2,17]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],25:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],25:[2,21]},{18:[1,66]},{18:[2,42]},{18:[1,67]},{8:17,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],25:[1,15]},{18:[2,24],24:[2,24],36:[2,24]},{18:[2,44],24:[2,44],32:[2,44],33:[2,44],34:[2,44],35:[2,44],36:[2,44],40:[2,44],42:[2,44]},{18:[2,46],24:[2,46],36:[2,46]},{18:[2,26],24:[2,26],32:[2,26],33:[2,26],34:[2,26],35:[2,26],36:[2,26],40:[2,26],42:[2,26]},{18:[2,27],24:[2,27],32:[2,27],33:[2,27],34:[2,27],35:[2,27],36:[2,27],40:[2,27],42:[2,27]},{18:[2,28],24:[2,28],32:[2,28],33:[2,28],34:[2,28],35:[2,28],36:[2,28],40:[2,28],42:[2,28]},{18:[2,29],24:[2,29],32:[2,29],33:[2,29],34:[2,29],35:[2,29],36:[2,29],40:[2,29],42:[2,29]},{18:[2,30],24:[2,30],32:[2,30],33:[2,30],34:[2,30],35:[2,30],36:[2,30],40:[2,30],42:[2,30]},{17:68,21:24,30:25,40:[1,28],42:[1,27],43:26},{18:[2,32],24:[2,32],36:[2,32],39:69,40:[1,70]},{18:[2,47],24:[2,47],36:[2,47],40:[2,47]},{18:[2,40],24:[2,40],32:[2,40],33:[2,40],34:[2,40],35:[2,40],36:[2,40],40:[2,40],41:[1,71],42:[2,40],44:[2,40]},{18:[2,39],24:[2,39],32:[2,39],33:[2,39],34:[2,39],35:[2,39],36:[2,39],40:[2,39],42:[2,39],44:[2,39]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],25:[2,22]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],25:[2,19]},{36:[1,72]},{18:[2,48],24:[2,48],36:[2,48],40:[2,48]},{41:[1,71]},{21:56,30:60,31:73,32:[1,57],33:[1,58],34:[1,59],35:[1,61],40:[1,28],42:[1,27],43:26},{18:[2,31],24:[2,31],32:[2,31],33:[2,31],34:[2,31],35:[2,31],36:[2,31],40:[2,31],42:[2,31]},{18:[2,33],24:[2,33],36:[2,33],40:[2,33]}],
defaultActions: {3:[2,2],16:[2,1],50:[2,42]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};


function stripFlags(open, close) {
  return {
    left: open.charAt(2) === '~',
    right: close.charAt(0) === '~' || close.charAt(1) === '~'
  };
}

/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {


function strip(start, end) {
  return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
}


var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-2) === "\\\\") {
                                     strip(0,1);
                                     this.begin("mu");
                                   } else if(yy_.yytext.slice(-1) === "\\") {
                                     strip(0,1);
                                     this.begin("emu");
                                   } else {
                                     this.begin("mu");
                                   }
                                   if(yy_.yytext) return 14;
                                 
break;
case 1:return 14;
break;
case 2:
                                   this.popState();
                                   return 14;
                                 
break;
case 3:strip(0,4); this.popState(); return 15;
break;
case 4:return 35;
break;
case 5:return 36;
break;
case 6:return 25;
break;
case 7:return 16;
break;
case 8:return 20;
break;
case 9:return 19;
break;
case 10:return 19;
break;
case 11:return 23;
break;
case 12:return 22;
break;
case 13:this.popState(); this.begin('com');
break;
case 14:strip(3,5); this.popState(); return 15;
break;
case 15:return 22;
break;
case 16:return 41;
break;
case 17:return 40;
break;
case 18:return 40;
break;
case 19:return 44;
break;
case 20:// ignore whitespace
break;
case 21:this.popState(); return 24;
break;
case 22:this.popState(); return 18;
break;
case 23:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 32;
break;
case 24:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 32;
break;
case 25:return 42;
break;
case 26:return 34;
break;
case 27:return 34;
break;
case 28:return 33;
break;
case 29:return 40;
break;
case 30:yy_.yytext = strip(1,2); return 40;
break;
case 31:return 'INVALID';
break;
case 32:return 5;
break;
}
};
lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?=([~}\s)])))/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
lexer.conditions = {"mu":{"rules":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[3],"inclusive":false},"INITIAL":{"rules":[0,1,32],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();exports["default"] = handlebars;
/* jshint ignore:end */
},{}],76:[function(require,module,exports){
"use strict";
var Visitor = require("./visitor")["default"];

function print(ast) {
  return new PrintVisitor().accept(ast);
}

exports.print = print;function PrintVisitor() {
  this.padding = 0;
}

exports.PrintVisitor = PrintVisitor;PrintVisitor.prototype = new Visitor();

PrintVisitor.prototype.pad = function(string, newline) {
  var out = "";

  for(var i=0,l=this.padding; i<l; i++) {
    out = out + "  ";
  }

  out = out + string;

  if(newline !== false) { out = out + "\n"; }
  return out;
};

PrintVisitor.prototype.program = function(program) {
  var out = "",
      statements = program.statements,
      i, l;

  for(i=0, l=statements.length; i<l; i++) {
    out = out + this.accept(statements[i]);
  }

  this.padding--;

  return out;
};

PrintVisitor.prototype.block = function(block) {
  var out = "";

  out = out + this.pad("BLOCK:");
  this.padding++;
  out = out + this.accept(block.mustache);
  if (block.program) {
    out = out + this.pad("PROGRAM:");
    this.padding++;
    out = out + this.accept(block.program);
    this.padding--;
  }
  if (block.inverse) {
    if (block.program) { this.padding++; }
    out = out + this.pad("{{^}}");
    this.padding++;
    out = out + this.accept(block.inverse);
    this.padding--;
    if (block.program) { this.padding--; }
  }
  this.padding--;

  return out;
};

PrintVisitor.prototype.sexpr = function(sexpr) {
  var params = sexpr.params, paramStrings = [], hash;

  for(var i=0, l=params.length; i<l; i++) {
    paramStrings.push(this.accept(params[i]));
  }

  params = "[" + paramStrings.join(", ") + "]";

  hash = sexpr.hash ? " " + this.accept(sexpr.hash) : "";

  return this.accept(sexpr.id) + " " + params + hash;
};

PrintVisitor.prototype.mustache = function(mustache) {
  return this.pad("{{ " + this.accept(mustache.sexpr) + " }}");
};

PrintVisitor.prototype.partial = function(partial) {
  var content = this.accept(partial.partialName);
  if(partial.context) { content = content + " " + this.accept(partial.context); }
  return this.pad("{{> " + content + " }}");
};

PrintVisitor.prototype.hash = function(hash) {
  var pairs = hash.pairs;
  var joinedPairs = [], left, right;

  for(var i=0, l=pairs.length; i<l; i++) {
    left = pairs[i][0];
    right = this.accept(pairs[i][1]);
    joinedPairs.push( left + "=" + right );
  }

  return "HASH{" + joinedPairs.join(", ") + "}";
};

PrintVisitor.prototype.STRING = function(string) {
  return '"' + string.string + '"';
};

PrintVisitor.prototype.INTEGER = function(integer) {
  return "INTEGER{" + integer.integer + "}";
};

PrintVisitor.prototype.BOOLEAN = function(bool) {
  return "BOOLEAN{" + bool.bool + "}";
};

PrintVisitor.prototype.ID = function(id) {
  var path = id.parts.join("/");
  if(id.parts.length > 1) {
    return "PATH:" + path;
  } else {
    return "ID:" + path;
  }
};

PrintVisitor.prototype.PARTIAL_NAME = function(partialName) {
    return "PARTIAL:" + partialName.name;
};

PrintVisitor.prototype.DATA = function(data) {
  return "@" + this.accept(data.id);
};

PrintVisitor.prototype.content = function(content) {
  return this.pad("CONTENT[ '" + content.string + "' ]");
};

PrintVisitor.prototype.comment = function(comment) {
  return this.pad("{{! '" + comment.comment + "' }}");
};
},{"./visitor":77}],77:[function(require,module,exports){
"use strict";
function Visitor() {}

Visitor.prototype = {
  constructor: Visitor,

  accept: function(object) {
    return this[object.type](object);
  }
};

exports["default"] = Visitor;
},{}],78:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],79:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":70,"./exception":78,"./utils":81}],80:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],81:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":80}],82:[function(require,module,exports){
// USAGE:
// var handlebars = require('handlebars');

// var local = handlebars.create();

var handlebars = require('../dist/cjs/handlebars')["default"];

handlebars.Visitor = require('../dist/cjs/handlebars/compiler/visitor')["default"];

var printer = require('../dist/cjs/handlebars/compiler/printer');
handlebars.PrintVisitor = printer.PrintVisitor;
handlebars.print = printer.print;

module.exports = handlebars;

// Publish a Node.js require() handler for .handlebars and .hbs files
if (typeof require !== 'undefined' && require.extensions) {
  var extension = function(module, filename) {
    var fs = require("fs");
    var templateString = fs.readFileSync(filename, "utf8");
    module.exports = handlebars.compile(templateString);
  };
  require.extensions[".handlebars"] = extension;
  require.extensions[".hbs"] = extension;
}

},{"../dist/cjs/handlebars":68,"../dist/cjs/handlebars/compiler/printer":76,"../dist/cjs/handlebars/compiler/visitor":77,"fs":53}],83:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":69}],84:[function(require,module,exports){
/*jshint node: true*/

var through = require('through');
var Handlebars = require("handlebars");

var extensions = {
  hbs: 1,
  handlebar: 1
};

function hbsfy(file) {
  if (!extensions[file.split(".").pop()]) return through();

  var buffer = "";

  return through(function(chunk) {
    buffer += chunk.toString();
  },
  function() {
    var js = Handlebars.precompile(buffer);
    // Compile only with the runtime dependency.
    var compiled = "// hbsfy compiled Handlebars template\n";
    compiled += "var Handlebars = require('hbsfy/runtime');\n";
    compiled += "module.exports = Handlebars.template(" + js.toString() + ");\n";
    this.queue(compiled);
    this.queue(null);
  });

};

hbsfy.configure = function(opts) {
  if (!opts || !opts.extensions) return hbsfy;
  extensions = {};
  opts.extensions.forEach(function(ext) {
    extensions[ext] = 1;
  });
  return hbsfy;
};

module.exports = hbsfy;


},{"handlebars":82,"through":85}],85:[function(require,module,exports){
(function (process){var Stream = require('stream')

// through
//
// a stream that does nothing but re-emit the input.
// useful for aggregating a series of changing but not ending streams into one stream)

exports = module.exports = through
through.through = through

//create a readable writable stream.

function through (write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false
  var stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

//  stream.autoPause   = !(opts && opts.autoPause   === false)
  stream.autoDestroy = !(opts && opts.autoDestroy === false)

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while(buffer.length && !stream.paused) {
      var data = buffer.shift()
      if(null === data)
        return stream.emit('end')
      else
        stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
//    console.error(ended)
    if(_ended) return stream
    if(data == null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  //this will be registered as the first 'end' listener
  //must call destroy next tick, to make sure we're after any
  //stream piped from here.
  //this is only a problem if end is not emitted synchronously.
  //a nicer way to do this is to make sure this is the last listener for 'end'

  stream.on('end', function () {
    stream.readable = false
    if(!stream.writable && stream.autoDestroy)
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end () {
    stream.writable = false
    end.call(stream)
    if(!stream.readable && stream.autoDestroy)
      stream.destroy()
  }

  stream.end = function (data) {
    if(ended) return
    ended = true
    if(arguments.length) stream.write(data)
    _end() // will emit or queue
    return stream
  }

  stream.destroy = function () {
    if(destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if(stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if(stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    //may have become paused again,
    //as drain emits 'data'.
    if(!stream.paused)
      stream.emit('drain')
    return stream
  }
  return stream
}

}).call(this,require("/Users/oiva/Dropbox/projektit/kummi/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/Users/oiva/Dropbox/projektit/kummi/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":56,"stream":61}],86:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":83}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvYXBwbGljYXRpb24uanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvc2NyaXB0cy9jb2xsZWN0aW9ucy9yZXBvcnRzLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvY29sbGVjdGlvbnMvc3RvcHMuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvc2NyaXB0cy9jb2xsZWN0aW9ucy91c2Vycy5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC9zY3JpcHRzL2NvbW11bmljYXRvci5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC9zY3JpcHRzL2NvbnRyb2xsZXIuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvc2NyaXB0cy9tYWluLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvbW9kZWxzL2FwcE1vZGVsLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvbW9kZWxzL3JlcG9ydC5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC9zY3JpcHRzL21vZGVscy9zdG9wLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvbW9kZWxzL3VzZXIuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvc2NyaXB0cy9yZWdpb25NYW5hZ2VyLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvcm91dGVyLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvdmlld3MvYWRvcHQvYWRvcHRWaWV3LmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvdmlld3MvaW5mb1RlYXNlclZpZXcuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvc2NyaXB0cy92aWV3cy9yZXBvcnRWaWV3LmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvdmlld3Mvc3RvcC9hc2tBZG9wdGlvbi5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC9zY3JpcHRzL3ZpZXdzL3N0b3AvcmVwb3J0SXRlbVZpZXcuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvc2NyaXB0cy92aWV3cy9zdG9wL3JlcG9ydExpbmtWaWV3LmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvdmlld3Mvc3RvcC9yZXBvcnRzRW1wdHlWaWV3LmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvdmlld3Mvc3RvcC9yZXBvcnRzVmlldy5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC9zY3JpcHRzL3ZpZXdzL3N0b3Avc3RvcE5hbWVWaWV3LmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvdmlld3Mvc3RvcFZpZXcuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvc2NyaXB0cy92aWV3cy93ZWxjb21lL25lYXJieVZpZXcuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvc2NyaXB0cy92aWV3cy93ZWxjb21lL3NlYXJjaFZpZXcuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvc2NyaXB0cy92aWV3cy93ZWxjb21lL3N0b3BDb2xsZWN0aW9uVmlldy5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC9zY3JpcHRzL3ZpZXdzL3dlbGNvbWUvc3RvcEl0ZW1WaWV3LmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3NjcmlwdHMvdmlld3Mvd2VsY29tZVZpZXcuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvdGVtcGxhdGVzL2Fkb3B0L2Fkb3B0LmhicyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC90ZW1wbGF0ZXMvaW5mb1RlYXNlci5oYnMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvdGVtcGxhdGVzL3JlcG9ydC5oYnMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvdGVtcGxhdGVzL3N0b3AuaGJzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3RlbXBsYXRlcy9zdG9wL2Fza0Fkb3B0aW9uLmhicyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC90ZW1wbGF0ZXMvc3RvcC9yZXBvcnRJdGVtLmhicyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC90ZW1wbGF0ZXMvc3RvcC9yZXBvcnRMaW5rLmhicyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC90ZW1wbGF0ZXMvc3RvcC9yZXBvcnRzLmhicyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC90ZW1wbGF0ZXMvc3RvcC9yZXBvcnRzRW1wdHkuaGJzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3RlbXBsYXRlcy9zdG9wL3N0b3BOYW1lLmhicyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC90ZW1wbGF0ZXMvd2VsY29tZS5oYnMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAvdGVtcGxhdGVzL3dlbGNvbWUvbmVhcmJ5LmhicyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC90ZW1wbGF0ZXMvd2VsY29tZS9zZWFyY2guaGJzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3RlbXBsYXRlcy93ZWxjb21lL3N0b3BJdGVtLmhicyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC95L2JhY2tib25lLmJhYnlzaXR0ZXIvbGliL2JhY2tib25lLmJhYnlzaXR0ZXIubWluLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvYXBwL3kvYmFja2JvbmUubWFyaW9uZXR0ZS9saWIvYmFja2JvbmUubWFyaW9uZXR0ZS5taW4uanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAveS9iYWNrYm9uZS9iYWNrYm9uZS1taW4uanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9hcHAveS9qcXVlcnkvanF1ZXJ5Lm1pbi5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL2FwcC95L3VuZGVyc2NvcmUtYW1kL3VuZGVyc2NvcmUtbWluLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvbmF0aXZlLWJ1ZmZlci1icm93c2VyaWZ5L2luZGV4LmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL25hdGl2ZS1idWZmZXItYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvbmF0aXZlLWJ1ZmZlci1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3N0cmVhbS1icm93c2VyaWZ5L2R1cGxleC5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9zdHJlYW0tYnJvd3NlcmlmeS9pbmRleC5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9zdHJlYW0tYnJvd3NlcmlmeS9wYXNzdGhyb3VnaC5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9zdHJlYW0tYnJvd3NlcmlmeS9yZWFkYWJsZS5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9zdHJlYW0tYnJvd3NlcmlmeS90cmFuc2Zvcm0uanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvc3RyZWFtLWJyb3dzZXJpZnkvd3JpdGFibGUuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvc3RyaW5nX2RlY29kZXIvaW5kZXguanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9iYXNlLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9jb21waWxlci9hc3QuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2NvbXBpbGVyL2Jhc2UuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2NvbXBpbGVyL2NvbXBpbGVyLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9jb21waWxlci9qYXZhc2NyaXB0LWNvbXBpbGVyLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9jb21waWxlci9wYXJzZXIuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2NvbXBpbGVyL3ByaW50ZXIuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2NvbXBpbGVyL3Zpc2l0b3IuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCIvVXNlcnMvb2l2YS9Ecm9wYm94L3Byb2pla3RpdC9rdW1taS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvbGliL2luZGV4LmpzIiwiL1VzZXJzL29pdmEvRHJvcGJveC9wcm9qZWt0aXQva3VtbWkvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvcnVudGltZS5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9oYnNmeS9pbmRleC5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9oYnNmeS9ub2RlX21vZHVsZXMvdGhyb3VnaC9pbmRleC5qcyIsIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9oYnNmeS9ydW50aW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7Ozs7QUNBQTs7QUNBQTs7OztBQ0FBOzs7O0FDQUE7QUFDQTtBQUNBOzs7Ozs7QUNGQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyNkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNzZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoXCJiYWNrYm9uZS5tYXJpb25ldHRlXCIpO3ZhciBjb21tdW5pY2F0b3I9cmVxdWlyZShcIi4vY29tbXVuaWNhdG9yXCIpLEFwcENvbnRyb2xsZXI9cmVxdWlyZShcIi4vY29udHJvbGxlclwiKSxBcHBSb3V0ZXI9cmVxdWlyZShcIi4vcm91dGVyXCIpLEFwcD1uZXcgQmFja2JvbmUuTWFyaW9uZXR0ZS5BcHBsaWNhdGlvbjtBcHAuYWRkUmVnaW9ucyh7aGVhZGVyOlwiI2hlYWRlclwiLG1haW46XCIjbWFpblwifSksQXBwLmFkZEluaXRpYWxpemVyKGZ1bmN0aW9uKCl7d2luZG93LkNvbW11bmljYXRvcj1uZXcgY29tbXVuaWNhdG9yLENvbW11bmljYXRvci5tZWRpYXRvci50cmlnZ2VyKFwiQVBQOlNUQVJUXCIpO3ZhciBlPW5ldyBBcHBDb250cm9sbGVyKHthcHA6dGhpc30pLG89bmV3IEFwcFJvdXRlcih7Y29udHJvbGxlcjplfSk7d2luZG93LmFwcFJvdXRlcj1vfSksQXBwLm9uKFwiaW5pdGlhbGl6ZTphZnRlclwiLGZ1bmN0aW9uKCl7Y29uc29sZS5sb2coXCJhcHAgaW5pdGlhbGl6ZWRcIiksQmFja2JvbmUuaGlzdG9yeS5zdGFydCgpfSksbW9kdWxlLmV4cG9ydHM9QXBwOyIsInJlcXVpcmUoXCJiYWNrYm9uZVwiKTt2YXIgUmVwb3J0PXJlcXVpcmUoXCIuLi9tb2RlbHMvcmVwb3J0XCIpLFJlcG9ydHNDb2xsZWN0aW9uPUJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHttb2RlbDpSZXBvcnQsaW5pdGlhbGl6ZTpmdW5jdGlvbihlKXt0aGlzLmNvZGU9ZS5jb2RlfSx1cmw6ZnVuY3Rpb24oKXtyZXR1cm5cImFwaS9yZXBvcnQvXCIrdGhpcy5jb2RlfX0pO21vZHVsZS5leHBvcnRzPVJlcG9ydHNDb2xsZWN0aW9uOyIsInJlcXVpcmUoXCJiYWNrYm9uZVwiKTt2YXIgU3RvcD1yZXF1aXJlKFwiLi4vbW9kZWxzL3N0b3BcIiksU3RvcHNDb2xsZWN0aW9uPUJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHttb2RlbDpTdG9wLGluaXRpYWxpemU6ZnVuY3Rpb24oKXt9LHVybDpmdW5jdGlvbigpe3JldHVybiB2b2lkIDAhPT10eXBlb2YgdGhpcy5sYXQmJnZvaWQgMCE9PXR5cGVvZiB0aGlzLmxvbiYmbnVsbCE9PXRoaXMubGF0JiZudWxsIT09dGhpcy5sb24/XCJhcGkvc3RvcC9cIit0aGlzLmxhdCtcIi9cIit0aGlzLmxvbjpudWxsfSxwYXJzZTpmdW5jdGlvbih0KXtyZXR1cm4gXy5maXJzdCh0LDUpfX0pO21vZHVsZS5leHBvcnRzPVN0b3BzQ29sbGVjdGlvbjsiLCJyZXF1aXJlKFwiYmFja2JvbmVcIik7dmFyIFVzZXI9cmVxdWlyZShcIi4uL21vZGVscy91c2VyXCIpLFVzZXJzQ29sbGVjdGlvbj1CYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7bW9kZWw6VXNlcixpbml0aWFsaXplOmZ1bmN0aW9uKGUpe3RoaXMuY29kZT1lLmNvZGV9LHVybDpmdW5jdGlvbigpe3JldHVyblwiYXBpL3VzZXIvXCIrdGhpcy5jb2RlfX0pO21vZHVsZS5leHBvcnRzPVVzZXJzQ29sbGVjdGlvbjsiLCJyZXF1aXJlKFwiYmFja2JvbmUubWFyaW9uZXR0ZVwiKTt2YXIgQ29tbXVuaWNhdG9yPUJhY2tib25lLk1hcmlvbmV0dGUuQ29udHJvbGxlci5leHRlbmQoe2luaXRpYWxpemU6ZnVuY3Rpb24oKXt0aGlzLm1lZGlhdG9yPW5ldyBCYWNrYm9uZS5XcmVxci5FdmVudEFnZ3JlZ2F0b3IsdGhpcy5yZXFyZXM9bmV3IEJhY2tib25lLldyZXFyLlJlcXVlc3RSZXNwb25zZSx0aGlzLmNvbW1hbmQ9bmV3IEJhY2tib25lLldyZXFyLkNvbW1hbmRzfX0pO21vZHVsZS5leHBvcnRzPUNvbW11bmljYXRvcjsiLCJyZXF1aXJlKFwiYmFja2JvbmUubWFyaW9uZXR0ZVwiKTt2YXIgQXBwTW9kZWw9cmVxdWlyZShcIi4vbW9kZWxzL2FwcE1vZGVsXCIpLEFkb3B0Vmlldz1yZXF1aXJlKFwiLi92aWV3cy9hZG9wdC9hZG9wdFZpZXdcIiksV2VsY29tZVZpZXc9cmVxdWlyZShcIi4vdmlld3Mvd2VsY29tZVZpZXdcIiksU3RvcFZpZXc9cmVxdWlyZShcIi4vdmlld3Mvc3RvcFZpZXdcIiksUmVwb3J0Vmlldz1yZXF1aXJlKFwiLi92aWV3cy9yZXBvcnRWaWV3XCIpLENvbnRyb2xsZXI9QmFja2JvbmUuTWFyaW9uZXR0ZS5Db250cm9sbGVyLmV4dGVuZCh7aW5pdGlhbGl6ZTpmdW5jdGlvbigpe2NvbnNvbGUubG9nKFwiY29udHJvbGxlciBpbml0XCIpLHRoaXMuYXBwPXRoaXMub3B0aW9ucy5hcHAsdGhpcy5hcHBNb2RlbD1uZXcgQXBwTW9kZWx9LHdlbGNvbWU6ZnVuY3Rpb24oKXt2YXIgbz1uZXcgV2VsY29tZVZpZXcoe2FwcE1vZGVsOnRoaXMuYXBwTW9kZWx9KTt0aGlzLmFwcC5tYWluLnNob3cobyk7dmFyIGU9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS5fdXBkYXRlUG9zaXRpb24oKX0sMTAwKX0sc3RvcDpmdW5jdGlvbihvKXt2YXIgZT17YXBwTW9kZWw6dGhpcy5hcHBNb2RlbH07by5sZW5ndGg8PTY/KGUuY29kZV9zaG9ydD1vLHRoaXMuX3N0b3BXaXRoU2hvcnRDb2RlKG8pKTooZS5jb2RlPW8sdGhpcy5fc3RvcFdpdGhMb25nQ29kZShvKSk7dmFyIHQ9bmV3IFN0b3BWaWV3KGUpO3RoaXMuYXBwLm1haW4uc2hvdyh0KX0scmVwb3J0OmZ1bmN0aW9uKG8pe3ZhciBlPW5ldyBSZXBvcnRWaWV3KHtjb2RlOm8sbW9kZWw6dGhpcy5hcHBNb2RlbC5nZXQoXCJzdG9wXCIpfSk7dGhpcy5hcHAubWFpbi5zaG93KGUpLHRoaXMuYXBwTW9kZWwuZ2V0KFwic3RvcFwiKS5nZXQoXCJjb2RlXCIpIT09byYmdGhpcy5hcHBNb2RlbC5nZXQoXCJzdG9wXCIpLmdldChcImNvZGVfc2hvcnRcIikhPT1vJiZ0aGlzLmFwcE1vZGVsLmxvYWRTdG9wKHtjb2RlOm99KX0sYWRvcHQ6ZnVuY3Rpb24obyl7dmFyIGU9bmV3IEFkb3B0Vmlldyh7Y29kZTpvLG1vZGVsOnRoaXMuYXBwTW9kZWwuZ2V0KFwic3RvcFwiKX0pO3RoaXMuYXBwLm1haW4uc2hvdyhlKSx0aGlzLmFwcE1vZGVsLmdldChcInN0b3BcIikuZ2V0KFwiY29kZVwiKSE9PW8mJnRoaXMuYXBwTW9kZWwuZ2V0KFwic3RvcFwiKS5nZXQoXCJjb2RlX3Nob3J0XCIpIT09byYmdGhpcy5hcHBNb2RlbC5sb2FkU3RvcCh7Y29kZTpvfSl9LF9zdG9wV2l0aExvbmdDb2RlOmZ1bmN0aW9uKG8pe3RoaXMuYXBwTW9kZWwuZ2V0KFwic3RvcFwiKS5nZXQoXCJjb2RlXCIpIT09byYmdGhpcy5hcHBNb2RlbC5sb2FkU3RvcCh7Y29kZTpvfSk7dmFyIGU9dGhpcy5hcHBNb2RlbC5nZXQoXCJzdG9wc1wiKS53aGVyZSh7Y29kZTpvfSk7cmV0dXJuIGUubGVuZ3RoPjA/dm9pZCB0aGlzLmFwcE1vZGVsLnNldCh7c3RvcDplWzBdfSk6dm9pZCAwfSxfc3RvcFdpdGhTaG9ydENvZGU6ZnVuY3Rpb24obyl7dGhpcy5hcHBNb2RlbC5nZXQoXCJzdG9wXCIpLmdldChcImNvZGVfc2hvcnRcIikhPT1vJiZ0aGlzLmFwcE1vZGVsLmxvYWRTdG9wKHtjb2RlX3Nob3J0Om99KTt2YXIgZT10aGlzLmFwcE1vZGVsLmdldChcInN0b3BzXCIpLndoZXJlKHtjb2RlX3Nob3J0Om99KTtyZXR1cm4gZS5sZW5ndGg+MD92b2lkIHRoaXMuYXBwTW9kZWwuc2V0KHtzdG9wOmVbMF19KTp2b2lkIDB9LF91cGRhdGVQb3NpdGlvbjpmdW5jdGlvbigpe2NvbnNvbGUubG9nKFwidXBkYXRlIHBvc2l0aW9uXCIpLE1vZGVybml6ci5nZW9sb2NhdGlvbiYmbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihfLmJpbmQodGhpcy5fb25Qb3NpdGlvbix0aGlzKSxfLmJpbmQodGhpcy5fb25Qb3NpdGlvbkVycm9yLHRoaXMpKX0sX29uUG9zaXRpb246ZnVuY3Rpb24obyl7Y29uc29sZS5sb2coXCJvblBvc2l0aW9uXCIsbyk7dmFyIGU9by5jb29yZHMubGF0aXR1ZGUsdD1vLmNvb3Jkcy5sb25naXR1ZGU7dGhpcy5hcHBNb2RlbC51cGRhdGVMb2NhdGlvbihlLHQpfSxfb25Qb3NpdGlvbkVycm9yOmZ1bmN0aW9uKG8sZSl7Q29tbXVuaWNhdG9yLm1lZGlhdG9yLnRyaWdnZXIoXCJwb3NpdGlvbjplcnJvclwiLG8uY29kZSksY29uc29sZS5sb2coXCJwb3NpdGlvbiBlcnJvcjogXCIrby5jb2RlKSxjb25zb2xlLmxvZyhlKX19KTttb2R1bGUuZXhwb3J0cz1Db250cm9sbGVyOyIsInZhciBBcHA9cmVxdWlyZShcIi4vYXBwbGljYXRpb25cIiksaGJzZnk9cmVxdWlyZShcImhic2Z5XCIpO0FwcC5zdGFydCgpOyIsInJlcXVpcmUoXCJiYWNrYm9uZVwiKTt2YXIgU3RvcHM9cmVxdWlyZShcIi4uL2NvbGxlY3Rpb25zL3N0b3BzXCIpLFN0b3A9cmVxdWlyZShcIi4vc3RvcFwiKSxBcHBNb2RlbD1CYWNrYm9uZS5Nb2RlbC5leHRlbmQoe2RlZmF1bHRzOntzdG9wczpudWxsLHN0b3A6bnVsbCxjb29yZHM6e319LGluaXRpYWxpemU6ZnVuY3Rpb24oKXt0aGlzLnNldCh7c3RvcHM6bmV3IFN0b3BzLHN0b3A6bmV3IFN0b3B9KX0sdXBkYXRlTG9jYXRpb246ZnVuY3Rpb24obyx0KXsobyE9PXRoaXMuZ2V0KFwiY29vcmRzXCIpLmxhdHx8dCE9PXRoaXMuZ2V0KFwiY29vcmRzXCIpLmxvbikmJih0aGlzLnNldCh7Y29vcmRzOntsYXQ6byxsb246dH19KSx0aGlzLmdldChcInN0b3BzXCIpLmxhdD1vLHRoaXMuZ2V0KFwic3RvcHNcIikubG9uPXQsdGhpcy5fZmV0Y2hTdG9wcygpKX0sbG9hZFN0b3A6ZnVuY3Rpb24obyl7Y29uc29sZS5sb2coXCJhcHBNb2RlbDogbG9hZCBzdG9wIFwiLG8pLHRoaXMuZ2V0KFwic3RvcFwiKS5zZXQobyksdGhpcy5nZXQoXCJzdG9wXCIpLmZldGNoKCl9LF9mZXRjaFN0b3BzOmZ1bmN0aW9uKCl7Y29uc29sZS5sb2coXCJhcHBNb2RlbDogZmV0Y2ggc3RvcHNcIiksdGhpcy5nZXQoXCJzdG9wc1wiKS5mZXRjaCh7c3VjY2VzczpfLmJpbmQodGhpcy5fb25TdG9wcyx0aGlzKSxlcnJvcjpfLmJpbmQodGhpcy5fb25TdG9wc0Vycm9yLHRoaXMpLHJlc2V0OiEwfSl9LF9vblN0b3BzOmZ1bmN0aW9uKG8pe2NvbnNvbGUubG9nKFwiYXBwTW9kZWw6IHN0b3BzIGZldGNoZWRcIixvKSxudWxsIT09by5jb2RlJiYxPT09by5sZW5ndGgmJihjb25zb2xlLmxvZyhcImFwcE1vZGVsIGxvYWRlZCBzcGVjaWZpYyBzdG9wXCIpLHRoaXMuc2V0KHtzdG9wOm8ubW9kZWxzWzBdfSkpfSxfb25TdG9wc0Vycm9yOmZ1bmN0aW9uKCl7Y29uc29sZS5lcnJvcihcImFwcE1vZGVsOiBzdG9wcyBmZXRjaCBmYWlsZWRcIil9fSk7bW9kdWxlLmV4cG9ydHM9QXBwTW9kZWw7IiwicmVxdWlyZShcImJhY2tib25lXCIpO3ZhciBSZXBvcnQ9QmFja2JvbmUuTW9kZWwuZXh0ZW5kKHt1cmw6XCIvYXBpL3JlcG9ydFwiLGRlZmF1bHRzOntkZXNjcmlwdGlvbjpudWxsLHNlcnZpY2VfY29kZTpudWxsLGxhdDpudWxsLGxvbjpudWxsLGNvZGU6bnVsbH0sc2V0V2dzQ29vcmRzOmZ1bmN0aW9uKG8pe3ZhciBlPW8uc3BsaXQoXCIsXCIpO3JldHVybiAyIT09ZS5sZW5ndGg/dm9pZCBjb25zb2xlLndhcm4oXCJjb29yZHMgZmFpbFwiLG8sZSk6dm9pZCB0aGlzLnNldCh7bG9uOmVbMF0sbGF0OmVbMV19KX0sc2V0Q29vcmRzOmZ1bmN0aW9uKG8pe3ZhciBlPW8uc3BsaXQoXCIsXCIpO2lmKDIhPT1lLmxlbmd0aClyZXR1cm4gdm9pZCBjb25zb2xlLndhcm4oXCJjb29yZHMgZmFpbFwiLG8sZSk7Zm9yKHZhciBsPTA7Mj5sO2wrKyl7dmFyIHI9KGVbbF0rXCJcIikuc3Vic3RyaW5nKDAsNyk7cj1wYXJzZUludChyLDEwKSxlW2xdPTFlLTUqcn1jb25zb2xlLmxvZyhcImNvb3JkcyBub3cgXCIrZSksdGhpcy5zZXQoe2xvbjplWzBdLGxhdDplWzFdfSl9fSk7bW9kdWxlLmV4cG9ydHM9UmVwb3J0OyIsInJlcXVpcmUoXCJiYWNrYm9uZVwiKTt2YXIgUmVwb3J0c0NvbGxlY3Rpb249cmVxdWlyZShcIi4uL2NvbGxlY3Rpb25zL3JlcG9ydHNcIiksVXNlcnNDb2xsZWN0aW9uPXJlcXVpcmUoXCIuLi9jb2xsZWN0aW9ucy91c2Vyc1wiKSxTdG9wTW9kZWw9QmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtkZWZhdWx0czp7eDowLHk6MCxkaXN0Om51bGwsY29kZTpudWxsLG5hbWVfZmk6bnVsbCxuYW1lX3N2Om51bGwsY2l0eV9maTpudWxsLGNpdHlfc3Y6bnVsbCxjb29yZHM6bnVsbCxjb2RlX3Nob3J0Om51bGwsYWRkcmVzc19maTpudWxsLGFkZHJlc3Nfc3Y6bnVsbCxyZXBvcnRzOm51bGwsdXNlcnM6bnVsbH0sdXJsOmZ1bmN0aW9uKCl7cmV0dXJuIHZvaWQgMCE9PXR5cGVvZiB0aGlzLmdldChcImNvZGVcIikmJm51bGwhPT10aGlzLmdldChcImNvZGVcIik/XCJhcGkvc3RvcC9cIit0aGlzLmdldChcImNvZGVcIik6dm9pZCAwIT09dHlwZW9mIHRoaXMuZ2V0KFwiY29kZV9zaG9ydFwiKSYmbnVsbCE9PXRoaXMuZ2V0KFwiY29kZV9zaG9ydFwiKT9cImFwaS9zdG9wL1wiK3RoaXMuZ2V0KFwiY29kZV9zaG9ydFwiKTpudWxsfSxpbml0aWFsaXplOmZ1bmN0aW9uKCl7dmFyIGU9bmV3IFJlcG9ydHNDb2xsZWN0aW9uKHtjb2RlOnRoaXMuZ2V0KFwiY29kZVwiKX0pLG89bmV3IFVzZXJzQ29sbGVjdGlvbih7Y29kZTp0aGlzLmdldChcImNvZGVcIil9KTt0aGlzLnNldCh7cmVwb3J0czplLHVzZXJzOm99KSx0aGlzLmxpc3RlblRvKHRoaXMsXCJjaGFuZ2U6Y29kZVwiLF8uYmluZCh0aGlzLm9uQ29kZUNoYW5nZSx0aGlzKSl9LG9uQ29kZUNoYW5nZTpmdW5jdGlvbihlLG8pe2NvbnNvbGUubG9nKFwic3RvcCBjb2RlIGNoYW5nZWQgdG8gXCIrbyk7dmFyIHQ9bmV3IFJlcG9ydHNDb2xsZWN0aW9uKHtjb2RlOm99KSxzPW5ldyBVc2Vyc0NvbGxlY3Rpb24oe2NvZGU6b30pO3RoaXMuc2V0KHtyZXBvcnRzOnQsdXNlcnM6c30pfSxyZXBvcnRPSzpmdW5jdGlvbigpe2NvbnNvbGUubG9nKFwic3RvcCBcIit0aGlzLmdldChcImNvZGVcIikrXCIgaXMgT0tcIil9LGdldFJlcG9ydHM6ZnVuY3Rpb24oKXtjb25zb2xlLmxvZyhcInN0b3A6IGdldCByZXBvcnRzXCIpLG51bGwhPT10aGlzLmdldChcImNvZGVcIikmJnRoaXMuZ2V0KFwicmVwb3J0c1wiKS5mZXRjaCgpfSxnZXRVc2VyczpmdW5jdGlvbigpe2NvbnNvbGUubG9nKFwic3RvcDogZ2V0IHVzZXJzXCIpLG51bGwhPT10aGlzLmdldChcImNvZGVcIikmJnRoaXMuZ2V0KFwidXNlcnNcIikuZmV0Y2goKX19KTttb2R1bGUuZXhwb3J0cz1TdG9wTW9kZWw7IiwicmVxdWlyZShcImJhY2tib25lXCIpO3ZhciBVc2VyTW9kZWw9QmFja2JvbmUuTW9kZWwuZXh0ZW5kKHt1cmw6XCIvYXBpL3VzZXJcIixkZWZhdWx0czp7ZW1haWw6bnVsbCxjb2RlOm51bGx9fSk7bW9kdWxlLmV4cG9ydHM9VXNlck1vZGVsOyIsInZhciBCYWNrYm9uZT1yZXF1aXJlKFwiYmFja2JvbmVcIiksQ29tbXVuaWNhdG9yPXJlcXVpcmUoXCIuL2NvbW11bmljYXRvclwiKSxSZWdpb25NYW5hZ2VyPUJhY2tib25lLk1hcmlvbmV0dGUuQ29udHJvbGxlci5leHRlbmQoe2luaXRpYWxpemU6ZnVuY3Rpb24oKXtjb25zb2xlLmxvZyhcIkluaXRpYWxpemUgYSBSZWdpb24gTWFuYWdlclwiKSx0aGlzLl9yZWdpb25NYW5hZ2VyPW5ldyBCYWNrYm9uZS5NYXJpb25ldHRlLlJlZ2lvbk1hbmFnZXIsQ29tbXVuaWNhdG9yLnJlcXJlcy5zZXRIYW5kbGVyKFwiUk06YWRkUmVnaW9uXCIsdGhpcy5hZGRSZWdpb24sdGhpcyksQ29tbXVuaWNhdG9yLnJlcXJlcy5zZXRIYW5kbGVyKFwiUk06cmVtb3ZlUmVnaW9uXCIsdGhpcy5yZW1vdmVSZWdpb24sdGhpcyksQ29tbXVuaWNhdG9yLnJlcXJlcy5zZXRIYW5kbGVyKFwiUk06Z2V0UmVnaW9uXCIsdGhpcy5nZXRSZWdpb24sdGhpcyl9LGFkZFJlZ2lvbjpmdW5jdGlvbihlLG4pe3ZhciBvPXRoaXMuZ2V0UmVnaW9uKGUpO3JldHVybiBvPyhjb25zb2xlLmxvZyhcIlJFR0lPTiBBTFJFQURZIENSRUFURUQgVE8gSlVTVCBSRVRVUk4gUkVGXCIpLG8pOnRoaXMuX3JlZ2lvbk1hbmFnZXIuYWRkUmVnaW9uKGUsbil9LHJlbW92ZVJlZ2lvbjpmdW5jdGlvbihlKXt0aGlzLl9yZWdpb25NYW5hZ2VyLnJlbW92ZVJlZ2lvbihlKX0sZ2V0UmVnaW9uOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLl9yZWdpb25NYW5hZ2VyLmdldChlKX19KTttb2R1bGUuZXhwb3J0cz1SZWdpb25NYW5hZ2VyOyIsInJlcXVpcmUoXCJiYWNrYm9uZS5tYXJpb25ldHRlXCIpO3ZhciByb3V0ZXI9QmFja2JvbmUuTWFyaW9uZXR0ZS5BcHBSb3V0ZXIuZXh0ZW5kKHtpbml0aWFsaXplOmZ1bmN0aW9uKCl7Y29uc29sZS5sb2coXCJyb3V0ZXIgaW5pdFwiKX0sYXBwUm91dGVzOntcIlwiOlwid2VsY29tZVwiLFwic3RvcC86Y29kZVwiOlwic3RvcFwiLFwicmVwb3J0Lzpjb2RlXCI6XCJyZXBvcnRcIixcImFkb3B0Lzpjb2RlXCI6XCJhZG9wdFwifX0pO21vZHVsZS5leHBvcnRzPXJvdXRlcjsiLCJyZXF1aXJlKFwiYmFja2JvbmUubWFyaW9uZXR0ZVwiKTt2YXIgVGVtcGxhdGU9cmVxdWlyZShcIi4uLy4uLy4uL3RlbXBsYXRlcy9hZG9wdC9hZG9wdC5oYnNcIiksQWRvcHRWaWV3PUJhY2tib25lLk1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHt0ZW1wbGF0ZTpUZW1wbGF0ZSxpZDpcImFkb3B0XCIsdWk6e2ZpcnN0TmFtZTpcIiNmaXJzdG5hbWVcIixsYXN0TmFtZTpcIiNsYXN0bmFtZVwiLGVtYWlsOlwiI2VtYWlsXCJ9LGV2ZW50czp7XCJzdWJtaXQgI2Fkb3B0LWZvcm1cIjpcInN1Ym1pdEFkb3B0XCIsXCJrZXl1cCAuZm9ybS1jb250cm9sXCI6XCJvbklucHV0S2V5dXBcIn0sdGVtcFZhbHVlczp7Zmlyc3RuYW1lOlwiXCIsbGFzdG5hbWU6XCJcIixlbWFpbDpcIlwifSxpbml0aWFsaXplOmZ1bmN0aW9uKGUpe2NvbnNvbGUubG9nKFwiaW5pdCBhZG9wdCB2aWV3XCIsZSksdGhpcy5vcHRpb25zPWUsdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLFwiY2hhbmdlOm5hbWVfZmlcIix0aGlzLnJlbmRlcil9LHNlcmlhbGl6ZURhdGE6ZnVuY3Rpb24oKXt2YXIgZT17fTtyZXR1cm4gbnVsbD09PXRoaXMubW9kZWw/ZTooZT10aGlzLm1vZGVsLnRvSlNPTigpLG51bGwhPT1lLm5hbWUmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBlLm5hbWV8fG51bGw9PT1lLm5hbWVfZml8fChlLm5hbWU9ZS5uYW1lX2ZpLGUuYWRkcmVzcz1lLmFkZHJlc3NfZmksZS5jaXR5PWUuY2l0eV9maSksZT1fLmV4dGVuZChlLHRoaXMudGVtcFZhbHVlcykpfSxzdWJtaXRBZG9wdDpmdW5jdGlvbigpe3ZhciBlPXtmaXN0TmFtZTp0aGlzLnVpLmZpc3ROYW1lLnZhbCgpLGxhc3ROYW1lOnRoaXMudWkubGFzdE5hbWUudmFsKCksZW1haWw6dGhpcy51aS5lbWFpbC52YWwoKSxzdG9wOnRoaXMub3B0aW9ucy5jb2RlfTtyZXR1cm4gY29uc29sZS5sb2coZSksITF9LG9uSW5wdXRLZXl1cDpmdW5jdGlvbihlKXt2YXIgdD0kKGUuY3VycmVudFRhcmdldCk7dGhpcy50ZW1wVmFsdWVzW3QuYXR0cihcImlkXCIpXT10LnZhbCgpfX0pO21vZHVsZS5leHBvcnRzPUFkb3B0VmlldzsiLCJyZXF1aXJlKFwiYmFja2JvbmUubWFyaW9uZXR0ZVwiKTt2YXIgVGVtcGxhdGU9cmVxdWlyZShcIi4uLy4uL3RlbXBsYXRlcy9pbmZvVGVhc2VyLmhic1wiKTttb2R1bGUuZXhwb3J0cz1CYWNrYm9uZS5NYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7dGVtcGxhdGU6VGVtcGxhdGV9KTsiLCJyZXF1aXJlKFwiYmFja2JvbmUubWFyaW9uZXR0ZVwiKTt2YXIgVGVtcGxhdGU9cmVxdWlyZShcIi4uLy4uL3RlbXBsYXRlcy9yZXBvcnQuaGJzXCIpLFJlcG9ydD1yZXF1aXJlKFwiLi4vbW9kZWxzL3JlcG9ydFwiKSxTdG9wTmFtZVZpZXc9cmVxdWlyZShcIi4vc3RvcC9zdG9wTmFtZVZpZXdcIiksUmVwb3J0Vmlldz1CYWNrYm9uZS5NYXJpb25ldHRlLkxheW91dC5leHRlbmQoe3RlbXBsYXRlOlRlbXBsYXRlLG1vZGVsOm51bGwscmVnaW9uczp7c3RvcE5hbWU6XCIjcmVwb3J0LXN0b3AtbmFtZVwifSxldmVudHM6e1wiY2xpY2sgI2dldC1waWN0dXJlXCI6XCJnZXRQaWN0dXJlXCIsXCJzdWJtaXQgI3JlcG9ydC1mb3JtXCI6XCJzZW5kUmVwb3J0XCIsXCJrZXl1cCAjZGVzY3JpcHRpb25cIjpcInVwZGF0ZUNoYXJDb3VudFwiLFwiY2xpY2sgI3JlcG9ydC1iYWNrXCI6XCJnb0JhY2tcIn0sdWk6e2Rlc2NyaXB0aW9uOlwiI2Rlc2NyaXB0aW9uXCIsY2hhckNvdW50OlwiI2NoYXItY291bnRcIixzZW5kUmVwb3J0OlwiI3NlbmQtcmVwb3J0XCJ9LGluaXRpYWxpemU6ZnVuY3Rpb24oZSl7dGhpcy5vcHRpb25zPWUsY29uc29sZS5sb2coXCJyZXBvcnQgdmlldyBpbml0OiBcIit0aGlzLm9wdGlvbnMuY29kZSksdGhpcy5jb2RlPXRoaXMub3B0aW9ucy5jb2RlLHRoaXMubW9kZWw9dGhpcy5vcHRpb25zLm1vZGVsLHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCxcImNoYW5nZTpjb2RlXCIsdGhpcy5yZW5kZXJTdG9wTmFtZSl9LG9uUmVuZGVyOmZ1bmN0aW9uKCl7dGhpcy5yZW5kZXJTdG9wTmFtZSgpfSxyZW5kZXJTdG9wTmFtZTpmdW5jdGlvbigpe2NvbnNvbGUubG9nKFwicmVuZGVyIHN0b3AgbmFtZVwiKSx0aGlzLnN0b3BOYW1lLnNob3cobmV3IFN0b3BOYW1lVmlldyh7bW9kZWw6dGhpcy5tb2RlbH0pKX0sc2VyaWFsaXplRGF0YTpmdW5jdGlvbigpe3ZhciBlPXt9O3JldHVybiBudWxsPT09dGhpcy5tb2RlbD9lOihlPXRoaXMubW9kZWwudG9KU09OKCksbnVsbD09PWUubmFtZSYmbnVsbCE9PWUubmFtZV9maSYmKGUubmFtZT1lLm5hbWVfZmksZS5hZGRyZXNzPWUuYWRkcmVzc19maSxlLmNpdHk9ZS5jaXR5X2ZpKSxlLnNlcnZpY2VzPXRoaXMuZ2V0U2VydmljZXMoKSxjb25zb2xlLmxvZyhcImNvbnRleHRcIixlKSxlKX0sZ2V0U2VydmljZXM6ZnVuY3Rpb24oKXt2YXIgZTtyZXR1cm4gZT1be2lkOlwiMjAxXCIsbmFtZTpcIklsa2l2YWx0YVwifSx7aWQ6XCIxNzJcIixuYW1lOlwiUm9za2FhbWluZW5cIn0se2lkOlwiMTc3XCIsbmFtZTpcIlTDtmhyeWplbiBwb2lzdG9cIn0se2lkOlwiMjAzXCIsbmFtZTpcIkt5bHRpdCBqYSBvcGFzdGVldFwifSx7aWQ6XCIyMDdcIixuYW1lOlwiTXV1IGtvcmphdHRhdmEgYXNpYVwifV19LGdldFBpY3R1cmU6ZnVuY3Rpb24oKXtjb25zb2xlLmxvZyhcImdldFBpY3R1cmVcIil9LHVwZGF0ZUNoYXJDb3VudDpmdW5jdGlvbigpe3ZhciBlPXRoaXMudWkuZGVzY3JpcHRpb24udmFsKCkubGVuZ3RoOzk+ZT90aGlzLnVpLmNoYXJDb3VudC50ZXh0KFwiU3nDtnTDpCB2aWVsw6QgXCIrKDEwLWUpK1wiIG1lcmtracOkXCIpOjk9PT1lJiZ0aGlzLnVpLmNoYXJDb3VudC50ZXh0KFwiU3nDtnTDpCB2aWVsw6QgMSBtZXJra2lcIiksMTA+ZT8odGhpcy51aS5jaGFyQ291bnQucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIiksdGhpcy51aS5zZW5kUmVwb3J0LmF0dHIoXCJkaXNhYmxlZFwiLCEwKSk6KHRoaXMudWkuY2hhckNvdW50LmFkZENsYXNzKFwiaGlkZGVuXCIpLHRoaXMudWkuc2VuZFJlcG9ydC5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIikpfSxzZW5kUmVwb3J0OmZ1bmN0aW9uKGUpe2NvbnNvbGUubG9nKFwic2VuZFJlcG9ydFwiKTt2YXIgdD1uZXcgUmVwb3J0LG89dGhpcy51aS5kZXNjcmlwdGlvbi52YWwoKSxpPXRoaXMuJChcImlucHV0W25hbWU9c2VydmljZS1jb2RlXTpjaGVja2VkXCIpLnZhbCgpLHM9dGhpcy5tb2RlbC5nZXQoXCJjb2RlXCIpLHI9dGhpcy4kKFwiI2ZpcnN0bmFtZVwiKS52YWwoKSxuPXRoaXMuJChcIiNsYXN0bmFtZVwiKS52YWwoKSxhPXRoaXMuJChcIiNlbWFpbFwiKS52YWwoKTtyZXR1cm4gdC5zZXQoe2Rlc2NyaXB0aW9uOm8sc2VydmljZV9jb2RlOlwiXCIraSxjb2RlOlwiXCIrcyxmaXJzdF9uYW1lOnIsbGFzdF9uYW1lOm4sZW1haWw6YX0pLHZvaWQgMCE9PXRoaXMubW9kZWwuZ2V0KFwid2dzX2Nvb3Jkc1wiKSYmbnVsbCE9PXRoaXMubW9kZWwuZ2V0KFwid2dzX2Nvb3Jkc1wiKT8oY29uc29sZS5sb2coXCJzZXRXZ3NDb29yZHMgXCIrdGhpcy5tb2RlbC5nZXQoXCJ3Z3NfY29vcmRzXCIpKSx0LnNldFdnc0Nvb3Jkcyh0aGlzLm1vZGVsLmdldChcIndnc19jb29yZHNcIikpKTp2b2lkIDAhPT10aGlzLm1vZGVsLmdldChcImNvb3Jkc1wiKSYmbnVsbCE9PXRoaXMubW9kZWwuZ2V0KFwiY29vcmRzXCIpPyhjb25zb2xlLmxvZyhcInNldFhZQ29vcmRzIFwiK3RoaXMubW9kZWwuZ2V0KFwiY29vcmRzXCIpKSx0LnNldENvb3Jkcyh0aGlzLm1vZGVsLmdldChcImNvb3Jkc1wiKSkpOmNvbnNvbGUud2FybihcImNvb3JkcyBub3QgZm91bmRcIix0aGlzLm1vZGVsKSx0LnNhdmUoe30se2Vycm9yOl8uYmluZCh0aGlzLm9uU2F2ZUVycm9yLHRoaXMpfSksdGhpcy5vblNhdmVTdWNjZXNzKCksZS5wcmV2ZW50RGVmYXVsdCgpLCExfSxvblNhdmVFcnJvcjpmdW5jdGlvbigpe3RoaXMuJChcIiNyZXBvcnQtc2VudFwiKS5hZGRDbGFzcyhcImhpZGRlblwiKSx0aGlzLiQoXCIjcmVwb3J0LWVycm9yXCIpLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpfSxvblNhdmVTdWNjZXNzOmZ1bmN0aW9uKCl7dGhpcy4kKFwiI3JlcG9ydC1mb3JtXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpLHRoaXMuJChcIiNyZXBvcnQtc2VudFwiKS5yZW1vdmVDbGFzcyhcImhpZGRlblwiKX0sZ29CYWNrOmZ1bmN0aW9uKCl7cmV0dXJuIGFwcFJvdXRlci5uYXZpZ2F0ZShcInN0b3AvXCIrdGhpcy5tb2RlbC5nZXQoXCJjb2RlXCIpLHt0cmlnZ2VyOiEwfSksITF9fSk7bW9kdWxlLmV4cG9ydHM9UmVwb3J0VmlldzsiLCJyZXF1aXJlKFwiYmFja2JvbmUubWFyaW9uZXR0ZVwiKTt2YXIgVGVtcGxhdGU9cmVxdWlyZShcIi4uLy4uLy4uL3RlbXBsYXRlcy9zdG9wL2Fza0Fkb3B0aW9uLmhic1wiKSxBc2tBZG9wdGlvblZpZXc9QmFja2JvbmUuTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe3RlbXBsYXRlOlRlbXBsYXRlLGV2ZW50czp7XCJjbGljayAjYWRvcHQtc3RvcFwiOlwiYWRvcHRTdG9wXCJ9LGluaXRpYWxpemU6ZnVuY3Rpb24oKXt0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsXCJjaGFuZ2U6Y29kZVwiLHRoaXMucmVuZGVyKX0sYWRvcHRTdG9wOmZ1bmN0aW9uKCl7cmV0dXJuIGFwcFJvdXRlci5uYXZpZ2F0ZShcImFkb3B0L1wiK3RoaXMubW9kZWwuZ2V0KFwiY29kZVwiKSx7dHJpZ2dlcjohMH0pLCExfSxzZXJpYWxpemVEYXRhOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5tb2RlbC50b0pTT04oKTtyZXR1cm4gZS5zaG93QnV0dG9uPW51bGwhPT1lLmNvZGUsY29uc29sZS5sb2coZSksZX19KTttb2R1bGUuZXhwb3J0cz1Bc2tBZG9wdGlvblZpZXc7IiwicmVxdWlyZShcImJhY2tib25lLm1hcmlvbmV0dGVcIik7dmFyIFRlbXBsYXRlPXJlcXVpcmUoXCIuLi8uLi8uLi90ZW1wbGF0ZXMvc3RvcC9yZXBvcnRJdGVtLmhic1wiKTttb2R1bGUuZXhwb3J0cz1CYWNrYm9uZS5NYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7dGVtcGxhdGU6VGVtcGxhdGUsdGFnTmFtZTpcImxpXCJ9KTsiLCJyZXF1aXJlKFwiYmFja2JvbmUubWFyaW9uZXR0ZVwiKTt2YXIgVGVtcGxhdGU9cmVxdWlyZShcIi4uLy4uLy4uL3RlbXBsYXRlcy9zdG9wL3JlcG9ydExpbmsuaGJzXCIpLFJlcG9ydExpbmtWaWV3PUJhY2tib25lLk1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHt0ZW1wbGF0ZTpUZW1wbGF0ZSxldmVudHM6e1wiY2xpY2sgI3JlcG9ydC1va1wiOlwicmVwb3J0T0tcIixcImNsaWNrICNyZXBvcnQtcHJvYmxlbVwiOlwicmVwb3J0UHJvYmxlbVwifSxpbml0aWFsaXplOmZ1bmN0aW9uKCl7dGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLFwiY2hhbmdlOmNvZGVcIix0aGlzLl9vbkNoYW5nZVN0b3ApfSxyZXBvcnRPSzpmdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy5tb2RlbD8hMToodGhpcy5tb2RlbC5yZXBvcnRPSygpLCExKX0scmVwb3J0UHJvYmxlbTpmdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy5tb2RlbHx8bnVsbD09PXRoaXMubW9kZWwuZ2V0KFwiY29kZVwiKT8hMTood2luZG93LmFwcFJvdXRlci5uYXZpZ2F0ZShcInJlcG9ydC9cIit0aGlzLm1vZGVsLmdldChcImNvZGVcIikse3RyaWdnZXI6ITB9KSwhMSl9LF9vbkNoYW5nZVN0b3A6ZnVuY3Rpb24oZSx0KXt0aGlzLiQoXCIjcmVwb3J0LXByb2JsZW1cIikuYXR0cihcImRpc2FibGVkXCIsbnVsbD09PXQpLHRoaXMuJChcIiNyZXBvcnQtb2tcIikuYXR0cihcImRpc2FibGVkXCIsbnVsbD09PXQpfX0pO21vZHVsZS5leHBvcnRzPVJlcG9ydExpbmtWaWV3OyIsInJlcXVpcmUoXCJiYWNrYm9uZS5tYXJpb25ldHRlXCIpO3ZhciBUZW1wbGF0ZT1yZXF1aXJlKFwiLi4vLi4vLi4vdGVtcGxhdGVzL3N0b3AvcmVwb3J0c0VtcHR5Lmhic1wiKTttb2R1bGUuZXhwb3J0cz1CYWNrYm9uZS5NYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7dGVtcGxhdGU6VGVtcGxhdGUsdGFnTmFtZTpcImxpXCJ9KTsiLCJyZXF1aXJlKFwiYmFja2JvbmUubWFyaW9uZXR0ZVwiKTt2YXIgUmVwb3J0cz1yZXF1aXJlKFwiLi4vLi4vY29sbGVjdGlvbnMvcmVwb3J0c1wiKSxSZXBvcnRJdGVtVmlldz1yZXF1aXJlKFwiLi9yZXBvcnRJdGVtVmlld1wiKSxSZXBvcnRzRW1wdHlWaWV3PXJlcXVpcmUoXCIuL3JlcG9ydHNFbXB0eVZpZXdcIiksVGVtcGxhdGU9cmVxdWlyZShcIi4uLy4uLy4uL3RlbXBsYXRlcy9zdG9wL3JlcG9ydHMuaGJzXCIpO21vZHVsZS5leHBvcnRzPUJhY2tib25lLk1hcmlvbmV0dGUuQ29tcG9zaXRlVmlldy5leHRlbmQoe3RlbXBsYXRlOlRlbXBsYXRlLGl0ZW1WaWV3OlJlcG9ydEl0ZW1WaWV3LGl0ZW1WaWV3Q29udGFpbmVyOlwidWxcIixlbXB0eVZpZXc6UmVwb3J0c0VtcHR5Vmlld30pOyIsInJlcXVpcmUoXCJiYWNrYm9uZS5tYXJpb25ldHRlXCIpO3ZhciBUZW1wbGF0ZT1yZXF1aXJlKFwiLi4vLi4vLi4vdGVtcGxhdGVzL3N0b3Avc3RvcE5hbWUuaGJzXCIpLFN0b3BOYW1lVmlldz1CYWNrYm9uZS5NYXJpb25ldHRlLkl0ZW1WaWV3LmV4dGVuZCh7dGVtcGxhdGU6VGVtcGxhdGUsY2xhc3NOYW1lOlwiY29sLXhzLTEyIGNvbC1zbS0xMlwiLGluaXRpYWxpemU6ZnVuY3Rpb24oKXtjb25zb2xlLmxvZyhcInN0b3AgbmFtZSB2aWV3OiBpbml0XCIsdGhpcy5vcHRpb25zKSx0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsXCJjaGFuZ2U6bmFtZV9maVwiLHRoaXMucmVuZGVyKX0sc2VyaWFsaXplRGF0YTpmdW5jdGlvbihlKXt0aGlzLm9wdGlvbnM9ZTt2YXIgdD10aGlzLm1vZGVsLnRvSlNPTigpO3JldHVybiB2b2lkIDA9PT10Lm5hbWUmJm51bGwhPT10Lm5hbWVfZmkmJih0Lm5hbWU9dC5uYW1lX2ZpLHQuYWRkcmVzcz10LmFkZHJlc3NfZmksdC5jaXR5PXQuY2l0eV9maSksY29uc29sZS5sb2coXCJzdG9wIG5hbWUgdmlldzogcmVuZGVyXCIsdCksdH19KTttb2R1bGUuZXhwb3J0cz1TdG9wTmFtZVZpZXc7IiwicmVxdWlyZShcImJhY2tib25lLm1hcmlvbmV0dGVcIik7dmFyIFRlbXBsYXRlPXJlcXVpcmUoXCIuLi8uLi90ZW1wbGF0ZXMvc3RvcC5oYnNcIiksVXNlcj1yZXF1aXJlKFwiLi4vbW9kZWxzL3VzZXJcIiksSW5mb1RlYXNlclZpZXc9cmVxdWlyZShcIi4vaW5mb1RlYXNlclZpZXdcIiksQXNrQWRvcHRpb25WaWV3PXJlcXVpcmUoXCIuL3N0b3AvYXNrQWRvcHRpb25cIiksUmVwb3J0c0NvbGxlY3Rpb25WaWV3PXJlcXVpcmUoXCIuL3N0b3AvcmVwb3J0c1ZpZXdcIiksUmVwb3J0TGlua1ZpZXc9cmVxdWlyZShcIi4vc3RvcC9yZXBvcnRMaW5rVmlld1wiKSxTdG9wTmFtZVZpZXc9cmVxdWlyZShcIi4vc3RvcC9zdG9wTmFtZVZpZXdcIiksU3RvcFZpZXc9QmFja2JvbmUuTWFyaW9uZXR0ZS5MYXlvdXQuZXh0ZW5kKHt0ZW1wbGF0ZTpUZW1wbGF0ZSxyZWdpb25zOntuYW1lOlwiI25hbWVcIixyZXBvcnRzOlwiI3N0b3AtcmVwb3J0cy1jb250YWluZXJcIixyZXBvcnQ6XCIjc3RvcC1yZXBvcnQtc3RhdHVzXCIsYXNrQWRvcHRpb246XCIjc3RvcC1hc2stYWRvcHRpb25cIixpbmZvVGVhc2VyOlwiI3N0b3AtaW5mby10ZWFzZXJcIn0saW5pdGlhbGl6ZTpmdW5jdGlvbihlKXt0aGlzLm9wdGlvbnM9ZSxjb25zb2xlLmxvZyhcInN0b3AgdmlldyBpbml0XCIpLHRoaXMuY29kZT10aGlzLm9wdGlvbnMuY29kZSx0aGlzLmNvZGVfc2hvcnQ9dGhpcy5vcHRpb25zLmNvZGVfc2hvcnQsdGhpcy5tb2RlbD10aGlzLm9wdGlvbnMuYXBwTW9kZWwuZ2V0KFwic3RvcFwiKSx0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwuZ2V0KFwidXNlcnNcIiksXCJyZXNldFwiLHRoaXMuX29uVXNlcnMpLHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCxcImNoYW5nZTpjb2RlXCIsdGhpcy5fb25DaGFuZ2VTdG9wKSx0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsXCJjaGFuZ2U6Y29kZV9zaG9ydFwiLHRoaXMuX29uQ2hhbmdlU3RvcCl9LG9uUmVuZGVyOmZ1bmN0aW9uKCl7dGhpcy5uYW1lLnNob3cobmV3IFN0b3BOYW1lVmlldyh7bW9kZWw6dGhpcy5tb2RlbH0pKSx0aGlzLnJlcG9ydC5zaG93KG5ldyBSZXBvcnRMaW5rVmlldyh7bW9kZWw6dGhpcy5tb2RlbH0pKSx0aGlzLnJlcG9ydHMuc2hvdyhuZXcgUmVwb3J0c0NvbGxlY3Rpb25WaWV3KHtjb2xsZWN0aW9uOnRoaXMubW9kZWwuZ2V0KFwicmVwb3J0c1wiKX0pKSx0aGlzLmFza0Fkb3B0aW9uLnNob3cobmV3IEFza0Fkb3B0aW9uVmlldyh7bW9kZWw6dGhpcy5tb2RlbH0pKSx0aGlzLmluZm9UZWFzZXIuc2hvdyhuZXcgSW5mb1RlYXNlclZpZXcpfSxfb25DaGFuZ2VTdG9wOmZ1bmN0aW9uKGUpe2NvbnNvbGUubG9nKFwic3RvcFZpZXc6IHN0b3AgXCIrZS5nZXQoXCJjb2RlXCIpK1wiIGxvYWRlZFwiLGUpLChlLmdldChcImNvZGVcIik9PT10aGlzLmNvZGUmJm51bGwhPT10aGlzLmNvZGV8fGUuZ2V0KFwiY29kZV9zaG9ydFwiKT09PXRoaXMuY29kZV9zaG9ydCYmbnVsbCE9PXRoaXMuY29kZV9zaG9ydCkmJih0aGlzLm1vZGVsPWUsdGhpcy5yZW5kZXIoKSx0aGlzLm1vZGVsLmdldFJlcG9ydHMoKSx0aGlzLm1vZGVsLmdldFVzZXJzKCkpfSxfb25Vc2VyczpmdW5jdGlvbihlKXt2YXIgbz10aGlzO2NvbnNvbGUubG9nKFwidXNlcnNcIixlKTt2YXIgdD1fLnVuaXEoZS5tb2RlbHMsITEsZnVuY3Rpb24oZSl7cmV0dXJuIGUuZ2V0KFwiZW1haWxcIil9KTtfLmVhY2godCxmdW5jdGlvbihlKXtvLiQoXCIjc3RvcC11c2Vyc1wiKS5hcHBlbmQoXCI8cD5cIitlLmdldChcImVtYWlsXCIpK1wiPC9wPlwiKX0pfSxhZG9wdFN0b3A6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kKFwiI2Fkb3B0LWZvcm1cIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIiksdGhpcy4kKFwiI2Fkb3B0LXN0b3BcIikucmVtb3ZlKCksITF9LGFkb3B0U2VuZDpmdW5jdGlvbigpe3ZhciBlPXRoaXMuJChcIiNlbWFpbFwiKS52YWwoKSxvPW5ldyBVc2VyTW9kZWwoe2VtYWlsOmUsY29kZTp0aGlzLm1vZGVsLmdldChcImNvZGVcIil9KTtyZXR1cm4gby5zYXZlKCksdGhpcy4kKFwiI2Fkb3B0LWZvcm1cIikuaHRtbCgnPHAgY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj5PbGV0IG55dCBweXPDpGtpbiBrdW1taSE8L3A+JyksITF9LHVzZXJDcmVhdGVkOmZ1bmN0aW9uKCl7Y29uc29sZS5sb2coXCJ1c2VyIGNyZWF0ZWRcIil9fSk7bW9kdWxlLmV4cG9ydHM9U3RvcFZpZXc7IiwicmVxdWlyZShcImJhY2tib25lLm1hcmlvbmV0dGVcIik7dmFyIFN0b3BJdGVtVmlldz1yZXF1aXJlKFwiLi9zdG9wSXRlbVZpZXdcIiksVGVtcGxhdGU9cmVxdWlyZShcIi4uLy4uLy4uL3RlbXBsYXRlcy93ZWxjb21lL25lYXJieS5oYnNcIiksTmVhcmJ5Vmlldz1CYWNrYm9uZS5NYXJpb25ldHRlLkNvbXBvc2l0ZVZpZXcuZXh0ZW5kKHtpdGVtVmlldzpTdG9wSXRlbVZpZXcsdGVtcGxhdGU6VGVtcGxhdGUsaXRlbVZpZXdDb250YWluZXI6XCJ1bFwiLGluaXRpYWxpemU6ZnVuY3Rpb24oKXtjb25zb2xlLmxvZyhcIm5lYXJieSBpbml0XCIsdGhpcy5jb2xsZWN0aW9uKX0sb25Db21wb3NpdGVDb2xsZWN0aW9uUmVuZGVyZWQ6ZnVuY3Rpb24oKXtjb25zb2xlLmxvZyhcIm9uIGNvbXBvc2l0ZSByZW5kZXJlZFwiLHRoaXMuJChcIiNsb2FkaW5nLXN0b3BzXCIpKSx0aGlzLiQoXCIjbG9hZGluZy1zdG9wc1wiKS50b2dnbGUoMD09PXRoaXMuY29sbGVjdGlvbi5sZW5ndGgpfX0pO21vZHVsZS5leHBvcnRzPU5lYXJieVZpZXc7IiwicmVxdWlyZShcImJhY2tib25lLm1hcmlvbmV0dGVcIik7dmFyIFRlbXBsYXRlPXJlcXVpcmUoXCIuLi8uLi8uLi90ZW1wbGF0ZXMvd2VsY29tZS9zZWFyY2guaGJzXCIpLFNlYXJjaFZpZXc9QmFja2JvbmUuTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe3RlbXBsYXRlOlRlbXBsYXRlLGV2ZW50czp7XCJjbGljayAjZmluZC1zdG9wXCI6XCJmaW5kU3RvcFwifSxmaW5kU3RvcDpmdW5jdGlvbigpe3ZhciBlPXRoaXMuJChcIiNzdG9wLWlkXCIpLnZhbCgpO3JldHVyblwiXCI9PT1lPyExOihhcHBSb3V0ZXIubmF2aWdhdGUoXCJzdG9wL1wiK2Use3RyaWdnZXI6ITB9KSwhMSl9fSk7bW9kdWxlLmV4cG9ydHM9U2VhcmNoVmlldzsiLCJyZXF1aXJlKFwiYmFja2JvbmUubWFyaW9uZXR0ZVwiKTt2YXIgU3RvcEl0ZW1WaWV3PXJlcXVpcmUoXCIuL3N0b3BJdGVtVmlld1wiKTttb2R1bGUuZXhwb3J0cz1CYWNrYm9uZS5NYXJpb25ldHRlLkNvbGxlY3Rpb25WaWV3LmV4dGVuZCh7aXRlbVZpZXc6U3RvcEl0ZW1WaWV3fSk7IiwicmVxdWlyZShcImJhY2tib25lLm1hcmlvbmV0dGVcIik7dmFyIFRlbXBsYXRlPXJlcXVpcmUoXCIuLi8uLi8uLi90ZW1wbGF0ZXMvd2VsY29tZS9zdG9wSXRlbS5oYnNcIik7bW9kdWxlLmV4cG9ydHM9QmFja2JvbmUuTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe3RlbXBsYXRlOlRlbXBsYXRlLHRhZ05hbWU6XCJsaVwifSk7IiwicmVxdWlyZShcImJhY2tib25lLm1hcmlvbmV0dGVcIik7dmFyIE5lYXJieVZpZXc9cmVxdWlyZShcIi4vd2VsY29tZS9uZWFyYnlWaWV3XCIpLFNlYXJjaFZpZXc9cmVxdWlyZShcIi4vd2VsY29tZS9zZWFyY2hWaWV3XCIpLEluZm9UZWFzZXJWaWV3PXJlcXVpcmUoXCIuL2luZm9UZWFzZXJWaWV3XCIpLFRlbXBsYXRlPXJlcXVpcmUoXCIuLi8uLi90ZW1wbGF0ZXMvd2VsY29tZS5oYnNcIiksV2VsY29tZVZpZXc9QmFja2JvbmUuTWFyaW9uZXR0ZS5MYXlvdXQuZXh0ZW5kKHt0ZW1wbGF0ZTpUZW1wbGF0ZSxyZWdpb25zOntpbmZvVGVhc2VyOlwiI3dlbGNvbWUtaW5mby10ZWFzZXJcIixuZWFyYnk6XCIjd2VsY29tZS1uZWFyYnlcIixzZWFyY2g6XCIjd2VsY29tZS1zZWFyY2hcIn0saW5pdGlhbGl6ZTpmdW5jdGlvbihlKXt0aGlzLm9wdGlvbnM9ZSxjb25zb2xlLmxvZyhcImluaXQgd2VsY29tZSB2aWV3XCIpLENvbW11bmljYXRvci5tZWRpYXRvci5vbihcInBvc2l0aW9uOmVycm9yXCIsdGhpcy5vblBvc2l0aW9uRXJyb3IsdGhpcyksdGhpcy5jb2xsZWN0aW9uPXRoaXMub3B0aW9ucy5hcHBNb2RlbC5nZXQoXCJzdG9wc1wiKX0sb25SZW5kZXI6ZnVuY3Rpb24oKXt0aGlzLmluZm9UZWFzZXIuc2hvdyhuZXcgSW5mb1RlYXNlclZpZXcpLHRoaXMuc2VhcmNoLnNob3cobmV3IFNlYXJjaFZpZXcpLHRoaXMubmVhcmJ5LnNob3cobmV3IE5lYXJieVZpZXcoe2NvbGxlY3Rpb246dGhpcy5jb2xsZWN0aW9ufSkpfSxzZXJpYWxpemVEYXRhOmZ1bmN0aW9uKCl7dmFyIGU9e2dlb0xvY2F0aW9uOk1vZGVybml6ci5nZW9sb2NhdGlvbn07cmV0dXJuIGV9LG9uUG9zaXRpb25FcnJvcjpmdW5jdGlvbigpe2NvbnNvbGUubG9nKFwid2VsY29tZSB2aWV3OiBwb3NpdGlvbiBlcnJvclwiKSx0aGlzLiQoXCIjd2VsY29tZS1uZWFyYnlcIikuaGlkZSgpfX0pO21vZHVsZS5leHBvcnRzPVdlbGNvbWVWaWV3OyIsInZhciBIYW5kbGViYXJzPXJlcXVpcmUoXCJoYnNmeS9ydW50aW1lXCIpO21vZHVsZS5leHBvcnRzPUhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24oYSxlLG4sbCxzKXtmdW5jdGlvbiB0KGEsZSl7dmFyIGwscyx0PVwiXCI7cmV0dXJuIHQrPSdcXG48ZGl2IGNsYXNzPVwicm93IGhlYWRlclwiPlxcbiAgPGRpdiBjbGFzcz1cImNvbC14cy0xMiBjb2wtc20tMTJcIj5cXG4gICAgPGgyPlJ5aGR5IHB5c8Oka2luIDxzcGFuPicsKHM9bi5uYW1lKT9sPXMuY2FsbChhLHtoYXNoOnt9LGRhdGE6ZX0pOihzPWEmJmEubmFtZSxsPXR5cGVvZiBzPT09bT9zLmNhbGwoYSx7aGFzaDp7fSxkYXRhOmV9KTpzKSx0Kz1kKGwpK1wiPC9zcGFuPiBrdW1taWtzaSE8L2gyPlxcbiAgPC9kaXY+XFxuPC9kaXY+XFxuXCJ9dGhpcy5jb21waWxlckluZm89WzQsXCI+PSAxLjAuMFwiXSxuPXRoaXMubWVyZ2UobixhLmhlbHBlcnMpLHM9c3x8e307dmFyIGkscixvPVwiXCIsbT1cImZ1bmN0aW9uXCIsZD10aGlzLmVzY2FwZUV4cHJlc3Npb24sZj10aGlzO3JldHVybiBpPW5bXCJpZlwiXS5jYWxsKGUsZSYmZS5uYW1lLHtoYXNoOnt9LGludmVyc2U6Zi5ub29wLGZuOmYucHJvZ3JhbSgxLHQscyksZGF0YTpzfSksKGl8fDA9PT1pKSYmKG8rPWkpLG8rPSdcXG5cXG48Zm9ybSByb2xlPVwiZm9ybVwiIGlkPVwiYWRvcHQtZm9ybVwiPlxcbiAgPGZpZWxkc2V0PlxcbiAgICA8ZGl2IGNsYXNzPVwiZm9ybS1pbmxpbmUgZm9ybS1ncm91cFwiPlxcbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XFxuICAgICAgICA8bGFiZWwgZm9yPVwiZmlyc3RuYW1lXCI+RXR1bmltaTwvbGFiZWw+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImZpcnN0bmFtZVwiIG5hbWU9XCJmaXJzdG5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHJlcXVpcmVkIGF1dG9mb2N1cz1cImF1dG9mb2N1c1wiIHZhbHVlPVwiJywocj1uLmZpcnN0bmFtZSk/aT1yLmNhbGwoZSx7aGFzaDp7fSxkYXRhOnN9KToocj1lJiZlLmZpcnN0bmFtZSxpPXR5cGVvZiByPT09bT9yLmNhbGwoZSx7aGFzaDp7fSxkYXRhOnN9KTpyKSxvKz1kKGkpKydcIi8+XFxuICAgICAgPC9kaXY+XFxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG4gICAgICAgIDxsYWJlbCBmb3I9XCJsYXN0bmFtZVwiPlN1a3VuaW1pPC9sYWJlbD5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwibGFzdG5hbWVcIiBuYW1lPVwibGFzdG5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHJlcXVpcmVkIHZhbHVlPVwiJywocj1uLmxhc3RuYW1lKT9pPXIuY2FsbChlLHtoYXNoOnt9LGRhdGE6c30pOihyPWUmJmUubGFzdG5hbWUsaT10eXBlb2Ygcj09PW0/ci5jYWxsKGUse2hhc2g6e30sZGF0YTpzfSk6ciksbys9ZChpKSsnXCIvPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG4gICAgICA8bGFiZWwgZm9yPVwiZW1haWxcIj5Tw6Roa8O2cG9zdGk8L2xhYmVsPlxcbiAgICAgIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBpZD1cImVtYWlsXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiByZXF1aXJlZCB2YWx1ZT1cIicsKHI9bi5lbWFpbCk/aT1yLmNhbGwoZSx7aGFzaDp7fSxkYXRhOnN9KToocj1lJiZlLmVtYWlsLGk9dHlwZW9mIHI9PT1tP3IuY2FsbChlLHtoYXNoOnt9LGRhdGE6c30pOnIpLG8rPWQoaSkrJ1wiLz5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxidXR0b24gaWQ9XCJzZW5kLWFkb3B0XCIgdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+UnloZHkga3VtbWlrc2k8L2J1dHRvbj5cXG4gIDwvZmllbGRzZXQ+XFxuPC9mb3JtPid9KTsiLCJ2YXIgSGFuZGxlYmFycz1yZXF1aXJlKFwiaGJzZnkvcnVudGltZVwiKTttb2R1bGUuZXhwb3J0cz1IYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uKGUscyxpLGwsYSl7cmV0dXJuIHRoaXMuY29tcGlsZXJJbmZvPVs0LFwiPj0gMS4wLjBcIl0saT10aGlzLm1lcmdlKGksZS5oZWxwZXJzKSxhPWF8fHt9LCc8ZGl2IGNsYXNzPVwiY29sLXhzLTEyIGNvbC1zbS02IGNvbC1tZC04XCI+XFxuICA8aDM+TWlrw6Qgb24gcHlzw6Rra2lrdW1taT88L2gzPlxcbiAgPHA+UHlzw6Rra2lrdW1taSBvbiBwYWx2ZWx1LCBqb25rYSBhdnVsbGEgaWhtaXNldCB2b2l2YXQga2VydG9hIGpvcyBIU0w6biBweXPDpGtlaWxsw6Qgb24gam90YWluIHBpZWxlc3PDpC48L3A+XFxuICA8YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+THVlIGxpc8Okw6QgJnJhcXVvOzwvYT5cXG48L2Rpdj4nfSk7IiwidmFyIEhhbmRsZWJhcnM9cmVxdWlyZShcImhic2Z5L3J1bnRpbWVcIik7bW9kdWxlLmV4cG9ydHM9SGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbihlLG4sYSxpLHQpe2Z1bmN0aW9uIHMoZSxuKXt2YXIgaSx0LHM9XCJcIjtyZXR1cm4gcys9J1xcbiAgICAgIDxkaXYgY2xhc3M9XCJyYWRpb1wiPlxcbiAgICAgICAgPGxhYmVsPlxcbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNlcnZpY2UtY29kZVwiIGlkPVwic2VydmljZV9jb2RlXycsKHQ9YS5pZCk/aT10LmNhbGwoZSx7aGFzaDp7fSxkYXRhOm59KToodD1lJiZlLmlkLGk9dHlwZW9mIHQ9PT1yP3QuY2FsbChlLHtoYXNoOnt9LGRhdGE6bn0pOnQpLHMrPWQoaSkrJ1wiIHZhbHVlPVwiJywodD1hLmlkKT9pPXQuY2FsbChlLHtoYXNoOnt9LGRhdGE6bn0pOih0PWUmJmUuaWQsaT10eXBlb2YgdD09PXI/dC5jYWxsKGUse2hhc2g6e30sZGF0YTpufSk6dCkscys9ZChpKSsnXCIgLz5cXG4gICAgICAgICAgJywodD1hLm5hbWUpP2k9dC5jYWxsKGUse2hhc2g6e30sZGF0YTpufSk6KHQ9ZSYmZS5uYW1lLGk9dHlwZW9mIHQ9PT1yP3QuY2FsbChlLHtoYXNoOnt9LGRhdGE6bn0pOnQpLHMrPWQoaSkrXCJcXG4gICAgICAgIDwvbGFiZWw+XFxuICAgICAgPC9kaXY+XFxuICAgICAgXCJ9dGhpcy5jb21waWxlckluZm89WzQsXCI+PSAxLjAuMFwiXSxhPXRoaXMubWVyZ2UoYSxlLmhlbHBlcnMpLHQ9dHx8e307dmFyIGwsbz1cIlwiLHI9XCJmdW5jdGlvblwiLGQ9dGhpcy5lc2NhcGVFeHByZXNzaW9uLHA9dGhpcztyZXR1cm4gbys9JzxkaXYgaWQ9XCJyZXBvcnQtc3RvcC1uYW1lXCIgY2xhc3M9XCJyb3dcIj48L2Rpdj5cXG5cXG48Zm9ybSByb2xlPVwiZm9ybVwiIGlkPVwicmVwb3J0LWZvcm1cIj5cXG4gIDxmaWVsZHNldD5cXG4gICAgPHA+VmFsaXRzZSB2YWlodG9laGRvaXN0YSBzb3BpdmluIGphIGt1dmFpbGUgb25nZWxtYWEgbXV1dGFtYWxsYSBzYW5hbGxhLjwvcD5cXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG4gICAgICA8bGFiZWwgZm9yPVwic2VydmljZV9jb2RlXzIwMVwiPk9uZ2VsbWE8L2xhYmVsPlxcbiAgICAgICcsbD1hLmVhY2guY2FsbChuLG4mJm4uc2VydmljZXMse2hhc2g6e30saW52ZXJzZTpwLm5vb3AsZm46cC5wcm9ncmFtKDEscyx0KSxkYXRhOnR9KSwobHx8MD09PWwpJiYobys9bCksbys9J1xcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG4gICAgICA8bGFiZWwgZm9yPVwiZGVzY3JpcHRpb25cIj5NaWvDpCBvbiBwaWVsZXNzw6Q/PC9sYWJlbD5cXG4gICAgICA8dGV4dGFyZWEgbmFtZT1cImRlc2NyaXB0aW9uXCIgaWQ9XCJkZXNjcmlwdGlvblwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcm93cz1cIjNcIj48L3RleHRhcmVhPlxcbiAgICAgIDxzcGFuIGNsYXNzPVwiaGVscC1ibG9ja1wiIGlkPVwiY2hhci1jb3VudFwiPjwvc3Bhbj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIGhpZGRlblwiPlxcbiAgICAgIDxsYWJlbCBmb3I9XCJpbWFnZS1waWNrZXJcIj5PdGEga3V2YTwvbGFiZWw+XFxuICAgICAgPGlucHV0IGlkPVwiaW1hZ2UtcGlja2VyXCIgdHlwZT1cImZpbGVcIiBhY2NlcHQ9XCJpbWFnZS8qXCIgLz5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxwPlRhcnZpdHNlbW1lIG15w7ZzIG5pbWVzaS4gQW5uYSBsaXPDpGtzaSBzw6Roa8O2cG9zdGlvc29pdHRlZXNpLCBqb3MgaGFsdWF0IGt1aXR0YXVrc2VuIGt1biBvbGVtbWUga8Okc2l0ZWxsZWV0IGlsbW9pdHVrc2VzaS48L3A+XFxuXFxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWlubGluZSBmb3JtLWdyb3VwXCI+XFxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG4gICAgICAgIDxsYWJlbCBmb3I9XCJmaXJzdG5hbWVcIj5FdHVuaW1pPC9sYWJlbD5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiZmlyc3RuYW1lXCIgbmFtZT1cImZpcnN0bmFtZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcmVxdWlyZWQgLz5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcbiAgICAgICAgPGxhYmVsIGZvcj1cImxhc3RuYW1lXCI+U3VrdW5pbWk8L2xhYmVsPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJsYXN0bmFtZVwiIG5hbWU9XCJsYXN0bmFtZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcmVxdWlyZWQgLz5cXG4gICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XFxuICAgICAgPGxhYmVsIGZvcj1cImVtYWlsXCI+U8OkaGvDtnBvc3RpIChqb3MgaGFsdWF0IGt1aXR0YXVrc2VuKTwvbGFiZWw+XFxuICAgICAgPGlucHV0IHR5cGU9XCJlbWFpbFwiIGlkPVwiZW1haWxcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIC8+XFxuICAgIDwvZGl2PlxcblxcbiAgICA8YnV0dG9uIGlkPVwic2VuZC1yZXBvcnRcIiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkaXNhYmxlZD1cImRpc2FibGVkXCI+TMOkaGV0w6Q8L2J1dHRvbj5cXG4gIDwvZmllbGRzZXQ+XFxuPC9mb3JtPlxcblxcbjxkaXYgaWQ9XCJyZXBvcnQtc2VudFwiIGNsYXNzPVwiaGlkZGVuXCI+XFxuICA8cCBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPlZpZXN0aXNpIG9uIGzDpGhldGV0dHkhPC9wPlxcbiAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBpZD1cInJlcG9ydC1iYWNrXCI+VGFrYWlzaW48L2J1dHRvbj5cXG48L2Rpdj5cXG5cXG48ZGl2IGlkPVwicmVwb3J0LWVycm9yXCIgY2xhc3M9XCJoaWRkZW5cIj5cXG4gIDxwIGNsYXNzPVwidGV4dC13YXJuaW5nXCI+Vmllc3RpbiBsw6RoZXR0w6RtaW5lbiBlcMOkb25uaXN0dWkuPC9wPlxcbiAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBpZD1cInJlcG9ydC1iYWNrXCI+VGFrYWlzaW48L2J1dHRvbj5cXG48L2Rpdj4nfSk7IiwidmFyIEhhbmRsZWJhcnM9cmVxdWlyZShcImhic2Z5L3J1bnRpbWVcIik7bW9kdWxlLmV4cG9ydHM9SGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbihzLGksZCxuLG8pe3JldHVybiB0aGlzLmNvbXBpbGVySW5mbz1bNCxcIj49IDEuMC4wXCJdLGQ9dGhpcy5tZXJnZShkLHMuaGVscGVycyksbz1vfHx7fSwnPGRpdiBjbGFzcz1cInJvd1wiIGlkPVwibmFtZVwiPjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XCJyb3dcIiBpZD1cInN0b3AtdXNlcnMtY29udGFpbmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+XFxuICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyIGNvbC1zbS0xMlwiPlxcbiAgICA8aDM+UHlzw6RraW4ga3VtbWl0PC9oMz5cXG4gICAgPGRpdiBpZD1cInN0b3AtdXNlcnNcIj48L2Rpdj5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XCJyb3dcIiBpZD1cInN0b3AtcmVwb3J0LXN0YXR1c1wiPjwvZGl2PlxcbjxkaXYgY2xhc3M9XCJyb3dcIiBpZD1cInN0b3AtcmVwb3J0cy1jb250YWluZXJcIj48L2Rpdj5cXG48ZGl2IGNsYXNzPVwicm93XCIgaWQ9XCJzdG9wLWFzay1hZG9wdGlvblwiPjwvZGl2PlxcbjxkaXYgY2xhc3M9XCJyb3dcIiBpZD1cInN0b3AtaW5mby10ZWFzZXJcIj48L2Rpdj4nfSk7IiwidmFyIEhhbmRsZWJhcnM9cmVxdWlyZShcImhic2Z5L3J1bnRpbWVcIik7bW9kdWxlLmV4cG9ydHM9SGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbihuLGksdCxzLGEpe2Z1bmN0aW9uIGUoKXtyZXR1cm4nXFxuPGRpdiBjbGFzcz1cImNvbC14cy0xMiBjb2wtc20tMTJcIj5cXG4gIDxoMz5Lw6R5dGvDtiB1c2VpbiB0w6RsbMOkIHB5c8Oka2lsbMOkPzwvaDM+XFxuICA8cD5Kb3Mga8OkeXQgcHlzw6RraWxsw6QgbMOkaGVzIHDDpGl2aXR0w6Rpbiwgdm9pdCByeWh0ecOkIHNlbiBrdW1taWtzaS48L3A+XFxuICA8cD5QeXPDpGtraWt1bW1pbiB2ZWx2b2xsaXN1dXRlbmEgb24uLi48L3A+XFxuICA8dWw+XFxuICAgIDxsaT5UYXJra2FpbGxhIHB5c8Oka2luIGt1bnRvYTwvbGk+XFxuICAgIDxsaT5SYXBvcnRvaWRhIGpvcyBqb3RhaW4gb24gcGllbGVzc8OkPC9saT5cXG4gIDwvdWw+XFxuICA8cD5LdW1taW5hIGF1dGF0IHBpdMOkbcOkw6RuIGthdXB1bmtpbW1lIHBhcmVtbWFzc2Ega3Vubm9zc2EuPC9wPlxcbiAgXFxuICA8YnV0dG9uIGlkPVwiYWRvcHQtc3RvcFwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPlJ5aGR5IHB5c8Oka2luIGt1bW1pa3NpPC9idXR0b24+XFxuICA8ZGl2IGlkPVwiYWRvcHQtZm9ybVwiIGNsYXNzPVwiaGlkZGVuXCI+XFxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XFxuICAgICAgPGxhYmVsIGZvcj1cImVtYWlsXCI+U8OkaGvDtnBvc3Rpb3NvaXR0ZWVzaTwvbGFiZWw+XFxuICAgICAgPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIGlkPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cIlwiIC8+XFxuICAgICAgPGJ1dHRvbiBpZD1cImFkb3B0LXNlbmRcIiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj5Mw6RoZXTDpDwvYnV0dG9uPlxcbiAgICA8L2Rpdj5cXG4gIDwvZGl2PlxcbjwvZGl2Plxcbid9dGhpcy5jb21waWxlckluZm89WzQsXCI+PSAxLjAuMFwiXSx0PXRoaXMubWVyZ2UodCxuLmhlbHBlcnMpLGE9YXx8e307dmFyIGwsbz10aGlzO3JldHVybiBsPXRbXCJpZlwiXS5jYWxsKGksaSYmaS5zaG93QnV0dG9uLHtoYXNoOnt9LGludmVyc2U6by5ub29wLGZuOm8ucHJvZ3JhbSgxLGUsYSksZGF0YTphfSksbHx8MD09PWw/bDpcIlwifSk7IiwidmFyIEhhbmRsZWJhcnM9cmVxdWlyZShcImhic2Z5L3J1bnRpbWVcIik7bW9kdWxlLmV4cG9ydHM9SGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbihhLGUsdCxzLHIpe3RoaXMuY29tcGlsZXJJbmZvPVs0LFwiPj0gMS4wLjBcIl0sdD10aGlzLm1lcmdlKHQsYS5oZWxwZXJzKSxyPXJ8fHt9O3ZhciBsLGgsaT1cIlwiLG49XCJmdW5jdGlvblwiLGQ9dGhpcy5lc2NhcGVFeHByZXNzaW9uO3JldHVybihoPXQuZGF0ZSk/bD1oLmNhbGwoZSx7aGFzaDp7fSxkYXRhOnJ9KTooaD1lJiZlLmRhdGUsbD10eXBlb2YgaD09PW4/aC5jYWxsKGUse2hhc2g6e30sZGF0YTpyfSk6aCksaSs9ZChsKStcIjogXCIsKGg9dC5kZXNjcmlwdGlvbik/bD1oLmNhbGwoZSx7aGFzaDp7fSxkYXRhOnJ9KTooaD1lJiZlLmRlc2NyaXB0aW9uLGw9dHlwZW9mIGg9PT1uP2guY2FsbChlLHtoYXNoOnt9LGRhdGE6cn0pOmgpLGkrPWQobCl9KTsiLCJ2YXIgSGFuZGxlYmFycz1yZXF1aXJlKFwiaGJzZnkvcnVudGltZVwiKTttb2R1bGUuZXhwb3J0cz1IYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uKHQsbixlLHMsbCl7cmV0dXJuIHRoaXMuY29tcGlsZXJJbmZvPVs0LFwiPj0gMS4wLjBcIl0sZT10aGlzLm1lcmdlKGUsdC5oZWxwZXJzKSxsPWx8fHt9LCc8ZGl2IGNsYXNzPVwiY29sLXhzLTEyIGNvbC1zbS0xMlwiPlxcbiAgPGgyPk1pdMOkIHB5c8Oka2lsbGUga3V1bHV1PzwvaDI+XFxuICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIGlkPVwicmVwb3J0LW9rXCI+UHlzw6RraWxsw6Qgb24ga2Fpa2tpIE9LPC9idXR0b24+XFxuICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgaWQ9XCJyZXBvcnQtcHJvYmxlbVwiPlB5c8Oka2lsbMOkIG9uIG9uZ2VsbWEhPC9idXR0b24+XFxuPC9kaXY+J30pOyIsInZhciBIYW5kbGViYXJzPXJlcXVpcmUoXCJoYnNmeS9ydW50aW1lXCIpO21vZHVsZS5leHBvcnRzPUhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24oZSxyLG4scyx0KXtyZXR1cm4gdGhpcy5jb21waWxlckluZm89WzQsXCI+PSAxLjAuMFwiXSxuPXRoaXMubWVyZ2UobixlLmhlbHBlcnMpLHQ9dHx8e30sJzxkaXYgY2xhc3M9XCJjb2wteHMtMTIgY29sLXNtLTEyXCI+XFxuICA8aDM+UmFwb3J0b2lkdXQgb25nZWxtYXQ8L2gzPlxcbiAgPGRpdiBpZD1cInN0b3AtcmVwb3J0c1wiPlxcbiAgICA8dWw+PC91bD5cXG4gIDwvZGl2PlxcbjwvZGl2Pid9KTsiLCJ2YXIgSGFuZGxlYmFycz1yZXF1aXJlKFwiaGJzZnkvcnVudGltZVwiKTttb2R1bGUuZXhwb3J0cz1IYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uKGUscixsLGksdCl7cmV0dXJuIHRoaXMuY29tcGlsZXJJbmZvPVs0LFwiPj0gMS4wLjBcIl0sbD10aGlzLm1lcmdlKGwsZS5oZWxwZXJzKSx0PXR8fHt9LFwiPHA+VMOkbGzDpCBweXPDpGtpbGzDpCBlaSBvbGUgcmFwb3J0b2l0dWphIG9uZ2VsbWlhLjwvcD5cIn0pOyIsInZhciBIYW5kbGViYXJzPXJlcXVpcmUoXCJoYnNmeS9ydW50aW1lXCIpO21vZHVsZS5leHBvcnRzPUhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24oYSxlLHQsbixzKXtmdW5jdGlvbiByKGEsZSl7dmFyIG4scyxyPVwiXCI7cmV0dXJuIHIrPVwiXFxuICA8aDE+XCIsKHM9dC5uYW1lKT9uPXMuY2FsbChhLHtoYXNoOnt9LGRhdGE6ZX0pOihzPWEmJmEubmFtZSxuPXR5cGVvZiBzPT09aT9zLmNhbGwoYSx7aGFzaDp7fSxkYXRhOmV9KTpzKSxyKz1jKG4pKyc8L2gxPlxcbiAgPHAgY2xhc3M9XCJpbmZvXCI+Jywocz10LmFkZHJlc3MpP249cy5jYWxsKGEse2hhc2g6e30sZGF0YTplfSk6KHM9YSYmYS5hZGRyZXNzLG49dHlwZW9mIHM9PT1pP3MuY2FsbChhLHtoYXNoOnt9LGRhdGE6ZX0pOnMpLHIrPWMobikrXCIsIFwiLChzPXQuY2l0eSk/bj1zLmNhbGwoYSx7aGFzaDp7fSxkYXRhOmV9KToocz1hJiZhLmNpdHksbj10eXBlb2Ygcz09PWk/cy5jYWxsKGEse2hhc2g6e30sZGF0YTplfSk6cykscis9YyhuKStcIjwvcD5cXG5cIn1mdW5jdGlvbiBoKCl7cmV0dXJuXCJcXG4gIDxwPkxhZGF0YWFuIHB5c8Oka2luIHRpZXRvamEuLi48L3A+XFxuXCJ9dGhpcy5jb21waWxlckluZm89WzQsXCI+PSAxLjAuMFwiXSx0PXRoaXMubWVyZ2UodCxhLmhlbHBlcnMpLHM9c3x8e307dmFyIGwsaT1cImZ1bmN0aW9uXCIsYz10aGlzLmVzY2FwZUV4cHJlc3Npb24sbz10aGlzO3JldHVybiBsPXRbXCJpZlwiXS5jYWxsKGUsZSYmZS5uYW1lLHtoYXNoOnt9LGludmVyc2U6by5wcm9ncmFtKDMsaCxzKSxmbjpvLnByb2dyYW0oMSxyLHMpLGRhdGE6c30pLGx8fDA9PT1sP2w6XCJcIn0pOyIsInZhciBIYW5kbGViYXJzPXJlcXVpcmUoXCJoYnNmeS9ydW50aW1lXCIpO21vZHVsZS5leHBvcnRzPUhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24oZSxyLGkscyxhKXtyZXR1cm4gdGhpcy5jb21waWxlckluZm89WzQsXCI+PSAxLjAuMFwiXSxpPXRoaXMubWVyZ2UoaSxlLmhlbHBlcnMpLGE9YXx8e30sJzxkaXYgY2xhc3M9XCJyb3dcIiBpZD1cIndlbGNvbWUtaW5mby10ZWFzZXJcIj48L2Rpdj5cXG48ZGl2IGNsYXNzPVwicm93XCIgaWQ9XCJ3ZWxjb21lLW5lYXJieVwiPjwvZGl2PlxcbjxkaXYgY2xhc3M9XCJyb3dcIiBpZD1cIndlbGNvbWUtc2VhcmNoXCI+PC9kaXY+J30pOyIsInZhciBIYW5kbGViYXJzPXJlcXVpcmUoXCJoYnNmeS9ydW50aW1lXCIpO21vZHVsZS5leHBvcnRzPUhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24ocyxlLG4saSxsKXtyZXR1cm4gdGhpcy5jb21waWxlckluZm89WzQsXCI+PSAxLjAuMFwiXSxuPXRoaXMubWVyZ2UobixzLmhlbHBlcnMpLGw9bHx8e30sJzxkaXYgY2xhc3M9XCJjb2wteHMtMTIgY29sLXNtLTYgY29sLW1kLThcIj5cXG4gIDxoMz5Mw6RoaXN0w7ZuIHB5c8Oka2l0PC9oMz5cXG4gIDxwIGlkPVwibG9hZGluZy1zdG9wc1wiPkxhZGF0YWFuLi4uPC9wPlxcbiAgPHVsIGlkPVwic3RvcHNcIj48L3VsPlxcbjwvZGl2Pid9KTsiLCJ2YXIgSGFuZGxlYmFycz1yZXF1aXJlKFwiaGJzZnkvcnVudGltZVwiKTttb2R1bGUuZXhwb3J0cz1IYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uKGUsdCxuLGkscyl7cmV0dXJuIHRoaXMuY29tcGlsZXJJbmZvPVs0LFwiPj0gMS4wLjBcIl0sbj10aGlzLm1lcmdlKG4sZS5oZWxwZXJzKSxzPXN8fHt9LCc8ZGl2IGNsYXNzPVwiY29sLXhzLTEyIGNvbC1zbS02IGNvbC1tZC04XCI+XFxuICA8aDM+RXRzaSBweXPDpGtraTwvaDM+XFxuICA8bGFiZWwgZm9yPVwic3RvcC1pZFwiPkFubmEgcHlzw6RraW4ga29vZGk8L2xhYmVsPlxcbiAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInN0b3AtaWRcIiBpZD1cInN0b3AtaWRcIiBwbGFjZWhvbGRlcj1cIjEyNTFcIiAvPlxcbiAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGlkPVwiZmluZC1zdG9wXCI+SGFlPC9idXR0b24+XFxuPC9kaXY+J30pOyIsInZhciBIYW5kbGViYXJzPXJlcXVpcmUoXCJoYnNmeS9ydW50aW1lXCIpO21vZHVsZS5leHBvcnRzPUhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24oYSxlLHQsaCxyKXtmdW5jdGlvbiBvKGEsZSl7dmFyIGgscixvPVwiXCI7cmV0dXJuIG8rPVwiKFwiLChyPXQuY29kZVNob3J0KT9oPXIuY2FsbChhLHtoYXNoOnt9LGRhdGE6ZX0pOihyPWEmJmEuY29kZVNob3J0LGg9dHlwZW9mIHI9PT1jP3IuY2FsbChhLHtoYXNoOnt9LGRhdGE6ZX0pOnIpLG8rPWQoaCkrXCIpXCJ9dGhpcy5jb21waWxlckluZm89WzQsXCI+PSAxLjAuMFwiXSx0PXRoaXMubWVyZ2UodCxhLmhlbHBlcnMpLHI9cnx8e307dmFyIHMsbCxuPVwiXCIsYz1cImZ1bmN0aW9uXCIsZD10aGlzLmVzY2FwZUV4cHJlc3Npb24saT10aGlzO3JldHVybiBuKz0nPGEgaHJlZj1cIiNzdG9wLycsKGw9dC5jb2RlKT9zPWwuY2FsbChlLHtoYXNoOnt9LGRhdGE6cn0pOihsPWUmJmUuY29kZSxzPXR5cGVvZiBsPT09Yz9sLmNhbGwoZSx7aGFzaDp7fSxkYXRhOnJ9KTpsKSxuKz1kKHMpKydcIj4nLChsPXQubmFtZSk/cz1sLmNhbGwoZSx7aGFzaDp7fSxkYXRhOnJ9KToobD1lJiZlLm5hbWUscz10eXBlb2YgbD09PWM/bC5jYWxsKGUse2hhc2g6e30sZGF0YTpyfSk6bCksbis9ZChzKStcIiBcIixzPXRbXCJpZlwiXS5jYWxsKGUsZSYmZS5jb2RlU2hvcnQse2hhc2g6e30saW52ZXJzZTppLm5vb3AsZm46aS5wcm9ncmFtKDEsbyxyKSxkYXRhOnJ9KSwoc3x8MD09PXMpJiYobis9cyksbis9XCI8L2E+XCJ9KTsiLCIoZnVuY3Rpb24gKGdsb2JhbCl7KGZ1bmN0aW9uKGksdCxlLG4pe2dsb2JhbC5CYWNrYm9uZT1yZXF1aXJlKFwiYmFja2JvbmVcIiksQmFja2JvbmUuQ2hpbGRWaWV3Q29udGFpbmVyPWZ1bmN0aW9uKGksdCl7dmFyIGU9ZnVuY3Rpb24oaSl7dGhpcy5fdmlld3M9e30sdGhpcy5faW5kZXhCeU1vZGVsPXt9LHRoaXMuX2luZGV4QnlDdXN0b209e30sdGhpcy5fdXBkYXRlTGVuZ3RoKCksdC5lYWNoKGksdGhpcy5hZGQsdGhpcyl9O3QuZXh0ZW5kKGUucHJvdG90eXBlLHthZGQ6ZnVuY3Rpb24oaSx0KXt2YXIgZT1pLmNpZDt0aGlzLl92aWV3c1tlXT1pLGkubW9kZWwmJih0aGlzLl9pbmRleEJ5TW9kZWxbaS5tb2RlbC5jaWRdPWUpLHQmJih0aGlzLl9pbmRleEJ5Q3VzdG9tW3RdPWUpLHRoaXMuX3VwZGF0ZUxlbmd0aCgpfSxmaW5kQnlNb2RlbDpmdW5jdGlvbihpKXtyZXR1cm4gdGhpcy5maW5kQnlNb2RlbENpZChpLmNpZCl9LGZpbmRCeU1vZGVsQ2lkOmZ1bmN0aW9uKGkpe3ZhciB0PXRoaXMuX2luZGV4QnlNb2RlbFtpXTtyZXR1cm4gdGhpcy5maW5kQnlDaWQodCl9LGZpbmRCeUN1c3RvbTpmdW5jdGlvbihpKXt2YXIgdD10aGlzLl9pbmRleEJ5Q3VzdG9tW2ldO3JldHVybiB0aGlzLmZpbmRCeUNpZCh0KX0sZmluZEJ5SW5kZXg6ZnVuY3Rpb24oaSl7cmV0dXJuIHQudmFsdWVzKHRoaXMuX3ZpZXdzKVtpXX0sZmluZEJ5Q2lkOmZ1bmN0aW9uKGkpe3JldHVybiB0aGlzLl92aWV3c1tpXX0scmVtb3ZlOmZ1bmN0aW9uKGkpe3ZhciBlPWkuY2lkO2kubW9kZWwmJmRlbGV0ZSB0aGlzLl9pbmRleEJ5TW9kZWxbaS5tb2RlbC5jaWRdLHQuYW55KHRoaXMuX2luZGV4QnlDdXN0b20sZnVuY3Rpb24oaSx0KXtyZXR1cm4gaT09PWU/KGRlbGV0ZSB0aGlzLl9pbmRleEJ5Q3VzdG9tW3RdLCEwKTp2b2lkIDB9LHRoaXMpLGRlbGV0ZSB0aGlzLl92aWV3c1tlXSx0aGlzLl91cGRhdGVMZW5ndGgoKX0sY2FsbDpmdW5jdGlvbihpKXt0aGlzLmFwcGx5KGksdC50YWlsKGFyZ3VtZW50cykpfSxhcHBseTpmdW5jdGlvbihpLGUpe3QuZWFjaCh0aGlzLl92aWV3cyxmdW5jdGlvbihuKXt0LmlzRnVuY3Rpb24obltpXSkmJm5baV0uYXBwbHkobixlfHxbXSl9KX0sX3VwZGF0ZUxlbmd0aDpmdW5jdGlvbigpe3RoaXMubGVuZ3RoPXQuc2l6ZSh0aGlzLl92aWV3cyl9fSk7dmFyIG49W1wiZm9yRWFjaFwiLFwiZWFjaFwiLFwibWFwXCIsXCJmaW5kXCIsXCJkZXRlY3RcIixcImZpbHRlclwiLFwic2VsZWN0XCIsXCJyZWplY3RcIixcImV2ZXJ5XCIsXCJhbGxcIixcInNvbWVcIixcImFueVwiLFwiaW5jbHVkZVwiLFwiY29udGFpbnNcIixcImludm9rZVwiLFwidG9BcnJheVwiLFwiZmlyc3RcIixcImluaXRpYWxcIixcInJlc3RcIixcImxhc3RcIixcIndpdGhvdXRcIixcImlzRW1wdHlcIixcInBsdWNrXCJdO3JldHVybiB0LmVhY2gobixmdW5jdGlvbihpKXtlLnByb3RvdHlwZVtpXT1mdW5jdGlvbigpe3ZhciBlPXQudmFsdWVzKHRoaXMuX3ZpZXdzKSxuPVtlXS5jb25jYXQodC50b0FycmF5KGFyZ3VtZW50cykpO3JldHVybiB0W2ldLmFwcGx5KHQsbil9fSksZX0oQmFja2JvbmUsXyksbihcInVuZGVmaW5lZFwiIT10eXBlb2YgQmFja2JvbmUuQmFieXNpdHRlcj9CYWNrYm9uZS5CYWJ5c2l0dGVyOndpbmRvdy5CYWNrYm9uZS5CYWJ5c2l0dGVyKX0pLmNhbGwoZ2xvYmFsLHZvaWQgMCx2b2lkIDAsdm9pZCAwLGZ1bmN0aW9uKGkpe21vZHVsZS5leHBvcnRzPWl9KTt9KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXsoZnVuY3Rpb24oZSx0LGksbil7Z2xvYmFsLiQ9cmVxdWlyZShcImpxdWVyeVwiKSxnbG9iYWwuQmFja2JvbmU9cmVxdWlyZShcImJhY2tib25lXCIpLGdsb2JhbC5fPXJlcXVpcmUoXCJ1bmRlcnNjb3JlXCIpLEJhY2tib25lLkNoaWxkVmlld0NvbnRhaW5lcj1mdW5jdGlvbihlLHQpe3ZhciBpPWZ1bmN0aW9uKGUpe3RoaXMuX3ZpZXdzPXt9LHRoaXMuX2luZGV4QnlNb2RlbD17fSx0aGlzLl9pbmRleEJ5Q3VzdG9tPXt9LHRoaXMuX3VwZGF0ZUxlbmd0aCgpLHQuZWFjaChlLHRoaXMuYWRkLHRoaXMpfTt0LmV4dGVuZChpLnByb3RvdHlwZSx7YWRkOmZ1bmN0aW9uKGUsdCl7dmFyIGk9ZS5jaWQ7dGhpcy5fdmlld3NbaV09ZSxlLm1vZGVsJiYodGhpcy5faW5kZXhCeU1vZGVsW2UubW9kZWwuY2lkXT1pKSx0JiYodGhpcy5faW5kZXhCeUN1c3RvbVt0XT1pKSx0aGlzLl91cGRhdGVMZW5ndGgoKX0sZmluZEJ5TW9kZWw6ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZmluZEJ5TW9kZWxDaWQoZS5jaWQpfSxmaW5kQnlNb2RlbENpZDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLl9pbmRleEJ5TW9kZWxbZV07cmV0dXJuIHRoaXMuZmluZEJ5Q2lkKHQpfSxmaW5kQnlDdXN0b206ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5faW5kZXhCeUN1c3RvbVtlXTtyZXR1cm4gdGhpcy5maW5kQnlDaWQodCl9LGZpbmRCeUluZGV4OmZ1bmN0aW9uKGUpe3JldHVybiB0LnZhbHVlcyh0aGlzLl92aWV3cylbZV19LGZpbmRCeUNpZDpmdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5fdmlld3NbZV19LHJlbW92ZTpmdW5jdGlvbihlKXt2YXIgaT1lLmNpZDtlLm1vZGVsJiZkZWxldGUgdGhpcy5faW5kZXhCeU1vZGVsW2UubW9kZWwuY2lkXSx0LmFueSh0aGlzLl9pbmRleEJ5Q3VzdG9tLGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGU9PT1pPyhkZWxldGUgdGhpcy5faW5kZXhCeUN1c3RvbVt0XSwhMCk6dm9pZCAwfSx0aGlzKSxkZWxldGUgdGhpcy5fdmlld3NbaV0sdGhpcy5fdXBkYXRlTGVuZ3RoKCl9LGNhbGw6ZnVuY3Rpb24oZSl7dGhpcy5hcHBseShlLHQudGFpbChhcmd1bWVudHMpKX0sYXBwbHk6ZnVuY3Rpb24oZSxpKXt0LmVhY2godGhpcy5fdmlld3MsZnVuY3Rpb24obil7dC5pc0Z1bmN0aW9uKG5bZV0pJiZuW2VdLmFwcGx5KG4saXx8W10pfSl9LF91cGRhdGVMZW5ndGg6ZnVuY3Rpb24oKXt0aGlzLmxlbmd0aD10LnNpemUodGhpcy5fdmlld3MpfX0pO3ZhciBuPVtcImZvckVhY2hcIixcImVhY2hcIixcIm1hcFwiLFwiZmluZFwiLFwiZGV0ZWN0XCIsXCJmaWx0ZXJcIixcInNlbGVjdFwiLFwicmVqZWN0XCIsXCJldmVyeVwiLFwiYWxsXCIsXCJzb21lXCIsXCJhbnlcIixcImluY2x1ZGVcIixcImNvbnRhaW5zXCIsXCJpbnZva2VcIixcInRvQXJyYXlcIixcImZpcnN0XCIsXCJpbml0aWFsXCIsXCJyZXN0XCIsXCJsYXN0XCIsXCJ3aXRob3V0XCIsXCJpc0VtcHR5XCIsXCJwbHVja1wiXTtyZXR1cm4gdC5lYWNoKG4sZnVuY3Rpb24oZSl7aS5wcm90b3R5cGVbZV09ZnVuY3Rpb24oKXt2YXIgaT10LnZhbHVlcyh0aGlzLl92aWV3cyksbj1baV0uY29uY2F0KHQudG9BcnJheShhcmd1bWVudHMpKTtyZXR1cm4gdFtlXS5hcHBseSh0LG4pfX0pLGl9KEJhY2tib25lLF8pLEJhY2tib25lLldyZXFyPWZ1bmN0aW9uKGUsdCxpKXtcInVzZSBzdHJpY3RcIjt2YXIgbj17fTtyZXR1cm4gbi5IYW5kbGVycz1mdW5jdGlvbihlLHQpe3ZhciBpPWZ1bmN0aW9uKGUpe3RoaXMub3B0aW9ucz1lLHRoaXMuX3dyZXFySGFuZGxlcnM9e30sdC5pc0Z1bmN0aW9uKHRoaXMuaW5pdGlhbGl6ZSkmJnRoaXMuaW5pdGlhbGl6ZShlKX07cmV0dXJuIGkuZXh0ZW5kPWUuTW9kZWwuZXh0ZW5kLHQuZXh0ZW5kKGkucHJvdG90eXBlLGUuRXZlbnRzLHtzZXRIYW5kbGVyczpmdW5jdGlvbihlKXt0LmVhY2goZSxmdW5jdGlvbihlLGkpe3ZhciBuPW51bGw7dC5pc09iamVjdChlKSYmIXQuaXNGdW5jdGlvbihlKSYmKG49ZS5jb250ZXh0LGU9ZS5jYWxsYmFjayksdGhpcy5zZXRIYW5kbGVyKGksZSxuKX0sdGhpcyl9LHNldEhhbmRsZXI6ZnVuY3Rpb24oZSx0LGkpe3ZhciBuPXtjYWxsYmFjazp0LGNvbnRleHQ6aX07dGhpcy5fd3JlcXJIYW5kbGVyc1tlXT1uLHRoaXMudHJpZ2dlcihcImhhbmRsZXI6YWRkXCIsZSx0LGkpfSxoYXNIYW5kbGVyOmZ1bmN0aW9uKGUpe3JldHVybiEhdGhpcy5fd3JlcXJIYW5kbGVyc1tlXX0sZ2V0SGFuZGxlcjpmdW5jdGlvbihlKXt2YXIgdD10aGlzLl93cmVxckhhbmRsZXJzW2VdO2lmKCF0KXRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgbm90IGZvdW5kIGZvciAnXCIrZStcIidcIik7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGU9QXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7cmV0dXJuIHQuY2FsbGJhY2suYXBwbHkodC5jb250ZXh0LGUpfX0scmVtb3ZlSGFuZGxlcjpmdW5jdGlvbihlKXtkZWxldGUgdGhpcy5fd3JlcXJIYW5kbGVyc1tlXX0scmVtb3ZlQWxsSGFuZGxlcnM6ZnVuY3Rpb24oKXt0aGlzLl93cmVxckhhbmRsZXJzPXt9fX0pLGl9KGUsaSksbi5Db21tYW5kU3RvcmFnZT1mdW5jdGlvbigpe3ZhciB0PWZ1bmN0aW9uKGUpe3RoaXMub3B0aW9ucz1lLHRoaXMuX2NvbW1hbmRzPXt9LGkuaXNGdW5jdGlvbih0aGlzLmluaXRpYWxpemUpJiZ0aGlzLmluaXRpYWxpemUoZSl9O3JldHVybiBpLmV4dGVuZCh0LnByb3RvdHlwZSxlLkV2ZW50cyx7Z2V0Q29tbWFuZHM6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5fY29tbWFuZHNbZV07cmV0dXJuIHR8fCh0PXtjb21tYW5kOmUsaW5zdGFuY2VzOltdfSx0aGlzLl9jb21tYW5kc1tlXT10KSx0fSxhZGRDb21tYW5kOmZ1bmN0aW9uKGUsdCl7dmFyIGk9dGhpcy5nZXRDb21tYW5kcyhlKTtpLmluc3RhbmNlcy5wdXNoKHQpfSxjbGVhckNvbW1hbmRzOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuZ2V0Q29tbWFuZHMoZSk7dC5pbnN0YW5jZXM9W119fSksdH0oKSxuLkNvbW1hbmRzPWZ1bmN0aW9uKGUpe3JldHVybiBlLkhhbmRsZXJzLmV4dGVuZCh7c3RvcmFnZVR5cGU6ZS5Db21tYW5kU3RvcmFnZSxjb25zdHJ1Y3RvcjpmdW5jdGlvbih0KXt0aGlzLm9wdGlvbnM9dHx8e30sdGhpcy5faW5pdGlhbGl6ZVN0b3JhZ2UodGhpcy5vcHRpb25zKSx0aGlzLm9uKFwiaGFuZGxlcjphZGRcIix0aGlzLl9leGVjdXRlQ29tbWFuZHMsdGhpcyk7dmFyIGk9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtlLkhhbmRsZXJzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLGkpfSxleGVjdXRlOmZ1bmN0aW9uKGUsdCl7ZT1hcmd1bWVudHNbMF0sdD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSksdGhpcy5oYXNIYW5kbGVyKGUpP3RoaXMuZ2V0SGFuZGxlcihlKS5hcHBseSh0aGlzLHQpOnRoaXMuc3RvcmFnZS5hZGRDb21tYW5kKGUsdCl9LF9leGVjdXRlQ29tbWFuZHM6ZnVuY3Rpb24oZSx0LG4pe3ZhciByPXRoaXMuc3RvcmFnZS5nZXRDb21tYW5kcyhlKTtpLmVhY2goci5pbnN0YW5jZXMsZnVuY3Rpb24oZSl7dC5hcHBseShuLGUpfSksdGhpcy5zdG9yYWdlLmNsZWFyQ29tbWFuZHMoZSl9LF9pbml0aWFsaXplU3RvcmFnZTpmdW5jdGlvbihlKXt2YXIgdCxuPWUuc3RvcmFnZVR5cGV8fHRoaXMuc3RvcmFnZVR5cGU7dD1pLmlzRnVuY3Rpb24obik/bmV3IG46bix0aGlzLnN0b3JhZ2U9dH19KX0obiksbi5SZXF1ZXN0UmVzcG9uc2U9ZnVuY3Rpb24oZSl7cmV0dXJuIGUuSGFuZGxlcnMuZXh0ZW5kKHtyZXF1ZXN0OmZ1bmN0aW9uKCl7dmFyIGU9YXJndW1lbnRzWzBdLHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpO3JldHVybiB0aGlzLmdldEhhbmRsZXIoZSkuYXBwbHkodGhpcyx0KX19KX0obiksbi5FdmVudEFnZ3JlZ2F0b3I9ZnVuY3Rpb24oZSx0KXt2YXIgaT1mdW5jdGlvbigpe307cmV0dXJuIGkuZXh0ZW5kPWUuTW9kZWwuZXh0ZW5kLHQuZXh0ZW5kKGkucHJvdG90eXBlLGUuRXZlbnRzKSxpfShlLGkpLG59KEJhY2tib25lLEJhY2tib25lLk1hcmlvbmV0dGUsXyk7dmFyIHI9ZnVuY3Rpb24oZSx0LGkpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSl7cmV0dXJuIHMuY2FsbChlKX1mdW5jdGlvbiByKGUsdCl7dmFyIGk9bmV3IEVycm9yKGUpO3Rocm93IGkubmFtZT10fHxcIkVycm9yXCIsaX12YXIgbz17fTt0Lk1hcmlvbmV0dGU9byxvLiQ9dC4kO3ZhciBzPUFycmF5LnByb3RvdHlwZS5zbGljZTtyZXR1cm4gby5leHRlbmQ9dC5Nb2RlbC5leHRlbmQsby5nZXRPcHRpb249ZnVuY3Rpb24oZSx0KXtpZihlJiZ0KXt2YXIgaTtyZXR1cm4gaT1lLm9wdGlvbnMmJnQgaW4gZS5vcHRpb25zJiZ2b2lkIDAhPT1lLm9wdGlvbnNbdF0/ZS5vcHRpb25zW3RdOmVbdF19fSxvLnRyaWdnZXJNZXRob2Q9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKGUsdCxpKXtyZXR1cm4gaS50b1VwcGVyQ2FzZSgpfXZhciB0PS8oXnw6KShcXHcpL2dpLG49ZnVuY3Rpb24obil7dmFyIHI9XCJvblwiK24ucmVwbGFjZSh0LGUpLG89dGhpc1tyXTtyZXR1cm4gaS5pc0Z1bmN0aW9uKHRoaXMudHJpZ2dlcikmJnRoaXMudHJpZ2dlci5hcHBseSh0aGlzLGFyZ3VtZW50cyksaS5pc0Z1bmN0aW9uKG8pP28uYXBwbHkodGhpcyxpLnRhaWwoYXJndW1lbnRzKSk6dm9pZCAwfTtyZXR1cm4gbn0oKSxvLk1vbml0b3JET01SZWZyZXNoPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlKXtlLl9pc1Nob3duPSEwLG4oZSl9ZnVuY3Rpb24gdChlKXtlLl9pc1JlbmRlcmVkPSEwLG4oZSl9ZnVuY3Rpb24gbihlKXtlLl9pc1Nob3duJiZlLl9pc1JlbmRlcmVkJiZpLmlzRnVuY3Rpb24oZS50cmlnZ2VyTWV0aG9kKSYmZS50cmlnZ2VyTWV0aG9kKFwiZG9tOnJlZnJlc2hcIil9cmV0dXJuIGZ1bmN0aW9uKGkpe2kubGlzdGVuVG8oaSxcInNob3dcIixmdW5jdGlvbigpe2UoaSl9KSxpLmxpc3RlblRvKGksXCJyZW5kZXJcIixmdW5jdGlvbigpe3QoaSl9KX19KCksZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChlLHQsbixvKXt2YXIgcz1vLnNwbGl0KC9cXHMrLyk7aS5lYWNoKHMsZnVuY3Rpb24oaSl7dmFyIG89ZVtpXTtvfHxyKFwiTWV0aG9kICdcIitpK1wiJyB3YXMgY29uZmlndXJlZCBhcyBhbiBldmVudCBoYW5kbGVyLCBidXQgZG9lcyBub3QgZXhpc3QuXCIpLGUubGlzdGVuVG8odCxuLG8sZSl9KX1mdW5jdGlvbiBuKGUsdCxpLG4pe2UubGlzdGVuVG8odCxpLG4sZSl9ZnVuY3Rpb24gbyhlLHQsbixyKXt2YXIgbz1yLnNwbGl0KC9cXHMrLyk7aS5lYWNoKG8sZnVuY3Rpb24oaSl7dmFyIHI9ZVtpXTtlLnN0b3BMaXN0ZW5pbmcodCxuLHIsZSl9KX1mdW5jdGlvbiBzKGUsdCxpLG4pe2Uuc3RvcExpc3RlbmluZyh0LGksbixlKX1mdW5jdGlvbiBhKGUsdCxuLHIsbyl7dCYmbiYmKGkuaXNGdW5jdGlvbihuKSYmKG49bi5jYWxsKGUpKSxpLmVhY2gobixmdW5jdGlvbihuLHMpe2kuaXNGdW5jdGlvbihuKT9yKGUsdCxzLG4pOm8oZSx0LHMsbil9KSl9ZS5iaW5kRW50aXR5RXZlbnRzPWZ1bmN0aW9uKGUsaSxyKXthKGUsaSxyLG4sdCl9LGUudW5iaW5kRW50aXR5RXZlbnRzPWZ1bmN0aW9uKGUsdCxpKXthKGUsdCxpLHMsbyl9fShvKSxvLkNhbGxiYWNrcz1mdW5jdGlvbigpe3RoaXMuX2RlZmVycmVkPW8uJC5EZWZlcnJlZCgpLHRoaXMuX2NhbGxiYWNrcz1bXX0saS5leHRlbmQoby5DYWxsYmFja3MucHJvdG90eXBlLHthZGQ6ZnVuY3Rpb24oZSx0KXt0aGlzLl9jYWxsYmFja3MucHVzaCh7Y2I6ZSxjdHg6dH0pLHRoaXMuX2RlZmVycmVkLmRvbmUoZnVuY3Rpb24oaSxuKXt0JiYoaT10KSxlLmNhbGwoaSxuKX0pfSxydW46ZnVuY3Rpb24oZSx0KXt0aGlzLl9kZWZlcnJlZC5yZXNvbHZlKHQsZSl9LHJlc2V0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fY2FsbGJhY2tzO3RoaXMuX2RlZmVycmVkPW8uJC5EZWZlcnJlZCgpLHRoaXMuX2NhbGxiYWNrcz1bXSxpLmVhY2goZSxmdW5jdGlvbihlKXt0aGlzLmFkZChlLmNiLGUuY3R4KX0sdGhpcyl9fSksby5Db250cm9sbGVyPWZ1bmN0aW9uKGUpe3RoaXMudHJpZ2dlck1ldGhvZD1vLnRyaWdnZXJNZXRob2QsdGhpcy5vcHRpb25zPWV8fHt9LGkuaXNGdW5jdGlvbih0aGlzLmluaXRpYWxpemUpJiZ0aGlzLmluaXRpYWxpemUodGhpcy5vcHRpb25zKX0sby5Db250cm9sbGVyLmV4dGVuZD1vLmV4dGVuZCxpLmV4dGVuZChvLkNvbnRyb2xsZXIucHJvdG90eXBlLHQuRXZlbnRzLHtjbG9zZTpmdW5jdGlvbigpe3RoaXMuc3RvcExpc3RlbmluZygpLHRoaXMudHJpZ2dlck1ldGhvZChcImNsb3NlXCIpLHRoaXMudW5iaW5kKCl9fSksby5SZWdpb249ZnVuY3Rpb24oZSl7aWYodGhpcy5vcHRpb25zPWV8fHt9LHRoaXMuZWw9by5nZXRPcHRpb24odGhpcyxcImVsXCIpLCF0aGlzLmVsKXt2YXIgdD1uZXcgRXJyb3IoXCJBbiAnZWwnIG11c3QgYmUgc3BlY2lmaWVkIGZvciBhIHJlZ2lvbi5cIik7dGhyb3cgdC5uYW1lPVwiTm9FbEVycm9yXCIsdH1pZih0aGlzLmluaXRpYWxpemUpe3ZhciBpPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO3RoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLGkpfX0saS5leHRlbmQoby5SZWdpb24se2J1aWxkUmVnaW9uOmZ1bmN0aW9uKGUsdCl7dmFyIG49XCJzdHJpbmdcIj09dHlwZW9mIGUscj1cInN0cmluZ1wiPT10eXBlb2YgZS5zZWxlY3RvcixvPVwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLnJlZ2lvblR5cGUscz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBlO2lmKCFzJiYhbiYmIXIpdGhyb3cgbmV3IEVycm9yKFwiUmVnaW9uIG11c3QgYmUgc3BlY2lmaWVkIGFzIGEgUmVnaW9uIHR5cGUsIGEgc2VsZWN0b3Igc3RyaW5nIG9yIGFuIG9iamVjdCB3aXRoIHNlbGVjdG9yIHByb3BlcnR5XCIpO3ZhciBhLGg7biYmKGE9ZSksZS5zZWxlY3RvciYmKGE9ZS5zZWxlY3RvcikscyYmKGg9ZSksIXMmJm8mJihoPXQpLGUucmVnaW9uVHlwZSYmKGg9ZS5yZWdpb25UeXBlKTt2YXIgbD1uZXcgaCh7ZWw6YX0pO3JldHVybiBlLnBhcmVudEVsJiYobC5nZXRFbD1mdW5jdGlvbih0KXt2YXIgbj1lLnBhcmVudEVsO3JldHVybiBpLmlzRnVuY3Rpb24obikmJihuPW4oKSksbi5maW5kKHQpfSksbH19KSxpLmV4dGVuZChvLlJlZ2lvbi5wcm90b3R5cGUsdC5FdmVudHMse3Nob3c6ZnVuY3Rpb24oZSl7dGhpcy5lbnN1cmVFbCgpO3ZhciB0PWUuaXNDbG9zZWR8fGkuaXNVbmRlZmluZWQoZS4kZWwpLG49ZSE9PXRoaXMuY3VycmVudFZpZXc7biYmdGhpcy5jbG9zZSgpLGUucmVuZGVyKCksKG58fHQpJiZ0aGlzLm9wZW4oZSksdGhpcy5jdXJyZW50Vmlldz1lLG8udHJpZ2dlck1ldGhvZC5jYWxsKHRoaXMsXCJzaG93XCIsZSksby50cmlnZ2VyTWV0aG9kLmNhbGwoZSxcInNob3dcIil9LGVuc3VyZUVsOmZ1bmN0aW9uKCl7dGhpcy4kZWwmJjAhPT10aGlzLiRlbC5sZW5ndGh8fCh0aGlzLiRlbD10aGlzLmdldEVsKHRoaXMuZWwpKX0sZ2V0RWw6ZnVuY3Rpb24oZSl7cmV0dXJuIG8uJChlKX0sb3BlbjpmdW5jdGlvbihlKXt0aGlzLiRlbC5lbXB0eSgpLmFwcGVuZChlLmVsKX0sY2xvc2U6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmN1cnJlbnRWaWV3O2UmJiFlLmlzQ2xvc2VkJiYoZS5jbG9zZT9lLmNsb3NlKCk6ZS5yZW1vdmUmJmUucmVtb3ZlKCksby50cmlnZ2VyTWV0aG9kLmNhbGwodGhpcyxcImNsb3NlXCIpLGRlbGV0ZSB0aGlzLmN1cnJlbnRWaWV3KX0sYXR0YWNoVmlldzpmdW5jdGlvbihlKXt0aGlzLmN1cnJlbnRWaWV3PWV9LHJlc2V0OmZ1bmN0aW9uKCl7dGhpcy5jbG9zZSgpLGRlbGV0ZSB0aGlzLiRlbH19KSxvLlJlZ2lvbi5leHRlbmQ9by5leHRlbmQsby5SZWdpb25NYW5hZ2VyPWZ1bmN0aW9uKGUpe3ZhciB0PWUuQ29udHJvbGxlci5leHRlbmQoe2NvbnN0cnVjdG9yOmZ1bmN0aW9uKHQpe3RoaXMuX3JlZ2lvbnM9e30sZS5Db250cm9sbGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsdCl9LGFkZFJlZ2lvbnM6ZnVuY3Rpb24oZSx0KXt2YXIgbj17fTtyZXR1cm4gaS5lYWNoKGUsZnVuY3Rpb24oZSxyKXtcInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9e3NlbGVjdG9yOmV9KSxlLnNlbGVjdG9yJiYoZT1pLmRlZmF1bHRzKHt9LGUsdCkpO3ZhciBvPXRoaXMuYWRkUmVnaW9uKHIsZSk7bltyXT1vfSx0aGlzKSxufSxhZGRSZWdpb246ZnVuY3Rpb24odCxuKXt2YXIgcixvPWkuaXNPYmplY3Qobikscz1pLmlzU3RyaW5nKG4pLGE9ISFuLnNlbGVjdG9yO3JldHVybiByPXN8fG8mJmE/ZS5SZWdpb24uYnVpbGRSZWdpb24obixlLlJlZ2lvbik6aS5pc0Z1bmN0aW9uKG4pP2UuUmVnaW9uLmJ1aWxkUmVnaW9uKG4sZS5SZWdpb24pOm4sdGhpcy5fc3RvcmUodCxyKSx0aGlzLnRyaWdnZXJNZXRob2QoXCJyZWdpb246YWRkXCIsdCxyKSxyfSxnZXQ6ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuX3JlZ2lvbnNbZV19LHJlbW92ZVJlZ2lvbjpmdW5jdGlvbihlKXt2YXIgdD10aGlzLl9yZWdpb25zW2VdO3RoaXMuX3JlbW92ZShlLHQpfSxyZW1vdmVSZWdpb25zOmZ1bmN0aW9uKCl7aS5lYWNoKHRoaXMuX3JlZ2lvbnMsZnVuY3Rpb24oZSx0KXt0aGlzLl9yZW1vdmUodCxlKX0sdGhpcyl9LGNsb3NlUmVnaW9uczpmdW5jdGlvbigpe2kuZWFjaCh0aGlzLl9yZWdpb25zLGZ1bmN0aW9uKGUpe2UuY2xvc2UoKX0sdGhpcyl9LGNsb3NlOmZ1bmN0aW9uKCl7dGhpcy5yZW1vdmVSZWdpb25zKCk7dmFyIHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtlLkNvbnRyb2xsZXIucHJvdG90eXBlLmNsb3NlLmFwcGx5KHRoaXMsdCl9LF9zdG9yZTpmdW5jdGlvbihlLHQpe3RoaXMuX3JlZ2lvbnNbZV09dCx0aGlzLl9zZXRMZW5ndGgoKX0sX3JlbW92ZTpmdW5jdGlvbihlLHQpe3QuY2xvc2UoKSxkZWxldGUgdGhpcy5fcmVnaW9uc1tlXSx0aGlzLl9zZXRMZW5ndGgoKSx0aGlzLnRyaWdnZXJNZXRob2QoXCJyZWdpb246cmVtb3ZlXCIsZSx0KX0sX3NldExlbmd0aDpmdW5jdGlvbigpe3RoaXMubGVuZ3RoPWkuc2l6ZSh0aGlzLl9yZWdpb25zKX19KSxuPVtcImZvckVhY2hcIixcImVhY2hcIixcIm1hcFwiLFwiZmluZFwiLFwiZGV0ZWN0XCIsXCJmaWx0ZXJcIixcInNlbGVjdFwiLFwicmVqZWN0XCIsXCJldmVyeVwiLFwiYWxsXCIsXCJzb21lXCIsXCJhbnlcIixcImluY2x1ZGVcIixcImNvbnRhaW5zXCIsXCJpbnZva2VcIixcInRvQXJyYXlcIixcImZpcnN0XCIsXCJpbml0aWFsXCIsXCJyZXN0XCIsXCJsYXN0XCIsXCJ3aXRob3V0XCIsXCJpc0VtcHR5XCIsXCJwbHVja1wiXTtyZXR1cm4gaS5lYWNoKG4sZnVuY3Rpb24oZSl7dC5wcm90b3R5cGVbZV09ZnVuY3Rpb24oKXt2YXIgdD1pLnZhbHVlcyh0aGlzLl9yZWdpb25zKSxuPVt0XS5jb25jYXQoaS50b0FycmF5KGFyZ3VtZW50cykpO3JldHVybiBpW2VdLmFwcGx5KGksbil9fSksdH0obyksby5UZW1wbGF0ZUNhY2hlPWZ1bmN0aW9uKGUpe3RoaXMudGVtcGxhdGVJZD1lfSxpLmV4dGVuZChvLlRlbXBsYXRlQ2FjaGUse3RlbXBsYXRlQ2FjaGVzOnt9LGdldDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLnRlbXBsYXRlQ2FjaGVzW2VdO3JldHVybiB0fHwodD1uZXcgby5UZW1wbGF0ZUNhY2hlKGUpLHRoaXMudGVtcGxhdGVDYWNoZXNbZV09dCksdC5sb2FkKCl9LGNsZWFyOmZ1bmN0aW9uKCl7dmFyIGUsdD1uKGFyZ3VtZW50cyksaT10Lmxlbmd0aDtpZihpPjApZm9yKGU9MDtpPmU7ZSsrKWRlbGV0ZSB0aGlzLnRlbXBsYXRlQ2FjaGVzW3RbZV1dO2Vsc2UgdGhpcy50ZW1wbGF0ZUNhY2hlcz17fX19KSxpLmV4dGVuZChvLlRlbXBsYXRlQ2FjaGUucHJvdG90eXBlLHtsb2FkOmZ1bmN0aW9uKCl7aWYodGhpcy5jb21waWxlZFRlbXBsYXRlKXJldHVybiB0aGlzLmNvbXBpbGVkVGVtcGxhdGU7dmFyIGU9dGhpcy5sb2FkVGVtcGxhdGUodGhpcy50ZW1wbGF0ZUlkKTtyZXR1cm4gdGhpcy5jb21waWxlZFRlbXBsYXRlPXRoaXMuY29tcGlsZVRlbXBsYXRlKGUpLHRoaXMuY29tcGlsZWRUZW1wbGF0ZX0sbG9hZFRlbXBsYXRlOmZ1bmN0aW9uKGUpe3ZhciB0PW8uJChlKS5odG1sKCk7cmV0dXJuIHQmJjAhPT10Lmxlbmd0aHx8cihcIkNvdWxkIG5vdCBmaW5kIHRlbXBsYXRlOiAnXCIrZStcIidcIixcIk5vVGVtcGxhdGVFcnJvclwiKSx0fSxjb21waWxlVGVtcGxhdGU6ZnVuY3Rpb24oZSl7cmV0dXJuIGkudGVtcGxhdGUoZSl9fSksby5SZW5kZXJlcj17cmVuZGVyOmZ1bmN0aW9uKGUsdCl7aWYoIWUpe3ZhciBpPW5ldyBFcnJvcihcIkNhbm5vdCByZW5kZXIgdGhlIHRlbXBsYXRlIHNpbmNlIGl0J3MgZmFsc2UsIG51bGwgb3IgdW5kZWZpbmVkLlwiKTt0aHJvdyBpLm5hbWU9XCJUZW1wbGF0ZU5vdEZvdW5kRXJyb3JcIixpfXZhciBuO3JldHVybihuPVwiZnVuY3Rpb25cIj09dHlwZW9mIGU/ZTpvLlRlbXBsYXRlQ2FjaGUuZ2V0KGUpKSh0KX19LG8uVmlldz10LlZpZXcuZXh0ZW5kKHtjb25zdHJ1Y3RvcjpmdW5jdGlvbihlKXtpLmJpbmRBbGwodGhpcyxcInJlbmRlclwiKTt2YXIgbj1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTt0aGlzLm9wdGlvbnM9ZXx8e30sdC5WaWV3LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLG4pLG8uTW9uaXRvckRPTVJlZnJlc2godGhpcyksdGhpcy5saXN0ZW5Ubyh0aGlzLFwic2hvd1wiLHRoaXMub25TaG93Q2FsbGVkLHRoaXMpfSx0cmlnZ2VyTWV0aG9kOm8udHJpZ2dlck1ldGhvZCxnZXRUZW1wbGF0ZTpmdW5jdGlvbigpe3JldHVybiBvLmdldE9wdGlvbih0aGlzLFwidGVtcGxhdGVcIil9LG1peGluVGVtcGxhdGVIZWxwZXJzOmZ1bmN0aW9uKGUpe2U9ZXx8e307dmFyIHQ9by5nZXRPcHRpb24odGhpcyxcInRlbXBsYXRlSGVscGVyc1wiKTtyZXR1cm4gaS5pc0Z1bmN0aW9uKHQpJiYodD10LmNhbGwodGhpcykpLGkuZXh0ZW5kKGUsdCl9LGNvbmZpZ3VyZVRyaWdnZXJzOmZ1bmN0aW9uKCl7aWYodGhpcy50cmlnZ2Vycyl7dmFyIGU9e30sdD1pLnJlc3VsdCh0aGlzLFwidHJpZ2dlcnNcIik7cmV0dXJuIGkuZWFjaCh0LGZ1bmN0aW9uKHQsbil7dmFyIHI9aS5pc09iamVjdCh0KSxvPXI/dC5ldmVudDp0O2Vbbl09ZnVuY3Rpb24oZSl7aWYoZSl7dmFyIGk9ZS5wcmV2ZW50RGVmYXVsdCxuPWUuc3RvcFByb3BhZ2F0aW9uLHM9cj90LnByZXZlbnREZWZhdWx0OmksYT1yP3Quc3RvcFByb3BhZ2F0aW9uOm47cyYmaSYmaS5hcHBseShlKSxhJiZuJiZuLmFwcGx5KGUpfXZhciBoPXt2aWV3OnRoaXMsbW9kZWw6dGhpcy5tb2RlbCxjb2xsZWN0aW9uOnRoaXMuY29sbGVjdGlvbn07dGhpcy50cmlnZ2VyTWV0aG9kKG8saCl9fSx0aGlzKSxlfX0sZGVsZWdhdGVFdmVudHM6ZnVuY3Rpb24oZSl7dGhpcy5fZGVsZWdhdGVET01FdmVudHMoZSksby5iaW5kRW50aXR5RXZlbnRzKHRoaXMsdGhpcy5tb2RlbCxvLmdldE9wdGlvbih0aGlzLFwibW9kZWxFdmVudHNcIikpLG8uYmluZEVudGl0eUV2ZW50cyh0aGlzLHRoaXMuY29sbGVjdGlvbixvLmdldE9wdGlvbih0aGlzLFwiY29sbGVjdGlvbkV2ZW50c1wiKSl9LF9kZWxlZ2F0ZURPTUV2ZW50czpmdW5jdGlvbihlKXtlPWV8fHRoaXMuZXZlbnRzLGkuaXNGdW5jdGlvbihlKSYmKGU9ZS5jYWxsKHRoaXMpKTt2YXIgbj17fSxyPXRoaXMuY29uZmlndXJlVHJpZ2dlcnMoKTtpLmV4dGVuZChuLGUsciksdC5WaWV3LnByb3RvdHlwZS5kZWxlZ2F0ZUV2ZW50cy5jYWxsKHRoaXMsbil9LHVuZGVsZWdhdGVFdmVudHM6ZnVuY3Rpb24oKXt2YXIgZT1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO3QuVmlldy5wcm90b3R5cGUudW5kZWxlZ2F0ZUV2ZW50cy5hcHBseSh0aGlzLGUpLG8udW5iaW5kRW50aXR5RXZlbnRzKHRoaXMsdGhpcy5tb2RlbCxvLmdldE9wdGlvbih0aGlzLFwibW9kZWxFdmVudHNcIikpLG8udW5iaW5kRW50aXR5RXZlbnRzKHRoaXMsdGhpcy5jb2xsZWN0aW9uLG8uZ2V0T3B0aW9uKHRoaXMsXCJjb2xsZWN0aW9uRXZlbnRzXCIpKX0sb25TaG93Q2FsbGVkOmZ1bmN0aW9uKCl7fSxjbG9zZTpmdW5jdGlvbigpe2lmKCF0aGlzLmlzQ2xvc2VkKXt2YXIgZT10aGlzLnRyaWdnZXJNZXRob2QoXCJiZWZvcmU6Y2xvc2VcIik7ZSE9PSExJiYodGhpcy5pc0Nsb3NlZD0hMCx0aGlzLnRyaWdnZXJNZXRob2QoXCJjbG9zZVwiKSx0aGlzLnVuYmluZFVJRWxlbWVudHMoKSx0aGlzLnJlbW92ZSgpKX19LGJpbmRVSUVsZW1lbnRzOmZ1bmN0aW9uKCl7aWYodGhpcy51aSl7dGhpcy5fdWlCaW5kaW5nc3x8KHRoaXMuX3VpQmluZGluZ3M9dGhpcy51aSk7dmFyIGU9aS5yZXN1bHQodGhpcyxcIl91aUJpbmRpbmdzXCIpO3RoaXMudWk9e30saS5lYWNoKGkua2V5cyhlKSxmdW5jdGlvbih0KXt2YXIgaT1lW3RdO3RoaXMudWlbdF09dGhpcy4kKGkpfSx0aGlzKX19LHVuYmluZFVJRWxlbWVudHM6ZnVuY3Rpb24oKXt0aGlzLnVpJiZ0aGlzLl91aUJpbmRpbmdzJiYoaS5lYWNoKHRoaXMudWksZnVuY3Rpb24oZSx0KXtkZWxldGUgdGhpcy51aVt0XX0sdGhpcyksdGhpcy51aT10aGlzLl91aUJpbmRpbmdzLGRlbGV0ZSB0aGlzLl91aUJpbmRpbmdzKX19KSxvLkl0ZW1WaWV3PW8uVmlldy5leHRlbmQoe2NvbnN0cnVjdG9yOmZ1bmN0aW9uKCl7by5WaWV3LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLG4oYXJndW1lbnRzKSl9LHNlcmlhbGl6ZURhdGE6ZnVuY3Rpb24oKXt2YXIgZT17fTtyZXR1cm4gdGhpcy5tb2RlbD9lPXRoaXMubW9kZWwudG9KU09OKCk6dGhpcy5jb2xsZWN0aW9uJiYoZT17aXRlbXM6dGhpcy5jb2xsZWN0aW9uLnRvSlNPTigpfSksZX0scmVuZGVyOmZ1bmN0aW9uKCl7dGhpcy5pc0Nsb3NlZD0hMSx0aGlzLnRyaWdnZXJNZXRob2QoXCJiZWZvcmU6cmVuZGVyXCIsdGhpcyksdGhpcy50cmlnZ2VyTWV0aG9kKFwiaXRlbTpiZWZvcmU6cmVuZGVyXCIsdGhpcyk7dmFyIGU9dGhpcy5zZXJpYWxpemVEYXRhKCk7ZT10aGlzLm1peGluVGVtcGxhdGVIZWxwZXJzKGUpO3ZhciB0PXRoaXMuZ2V0VGVtcGxhdGUoKSxpPW8uUmVuZGVyZXIucmVuZGVyKHQsZSk7cmV0dXJuIHRoaXMuJGVsLmh0bWwoaSksdGhpcy5iaW5kVUlFbGVtZW50cygpLHRoaXMudHJpZ2dlck1ldGhvZChcInJlbmRlclwiLHRoaXMpLHRoaXMudHJpZ2dlck1ldGhvZChcIml0ZW06cmVuZGVyZWRcIix0aGlzKSx0aGlzfSxjbG9zZTpmdW5jdGlvbigpe3RoaXMuaXNDbG9zZWR8fCh0aGlzLnRyaWdnZXJNZXRob2QoXCJpdGVtOmJlZm9yZTpjbG9zZVwiKSxvLlZpZXcucHJvdG90eXBlLmNsb3NlLmFwcGx5KHRoaXMsbihhcmd1bWVudHMpKSx0aGlzLnRyaWdnZXJNZXRob2QoXCJpdGVtOmNsb3NlZFwiKSl9fSksby5Db2xsZWN0aW9uVmlldz1vLlZpZXcuZXh0ZW5kKHtpdGVtVmlld0V2ZW50UHJlZml4OlwiaXRlbXZpZXdcIixjb25zdHJ1Y3RvcjpmdW5jdGlvbigpe3RoaXMuX2luaXRDaGlsZFZpZXdTdG9yYWdlKCksby5WaWV3LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLG4oYXJndW1lbnRzKSksdGhpcy5faW5pdGlhbEV2ZW50cygpLHRoaXMuaW5pdFJlbmRlckJ1ZmZlcigpfSxpbml0UmVuZGVyQnVmZmVyOmZ1bmN0aW9uKCl7dGhpcy5lbEJ1ZmZlcj1kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCl9LHN0YXJ0QnVmZmVyaW5nOmZ1bmN0aW9uKCl7dGhpcy5pbml0UmVuZGVyQnVmZmVyKCksdGhpcy5pc0J1ZmZlcmluZz0hMH0sZW5kQnVmZmVyaW5nOmZ1bmN0aW9uKCl7dGhpcy5hcHBlbmRCdWZmZXIodGhpcyx0aGlzLmVsQnVmZmVyKSx0aGlzLmluaXRSZW5kZXJCdWZmZXIoKSx0aGlzLmlzQnVmZmVyaW5nPSExfSxfaW5pdGlhbEV2ZW50czpmdW5jdGlvbigpe3RoaXMuY29sbGVjdGlvbiYmKHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLFwiYWRkXCIsdGhpcy5hZGRDaGlsZFZpZXcsdGhpcyksdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sXCJyZW1vdmVcIix0aGlzLnJlbW92ZUl0ZW1WaWV3LHRoaXMpLHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLFwicmVzZXRcIix0aGlzLnJlbmRlcix0aGlzKSl9LGFkZENoaWxkVmlldzpmdW5jdGlvbihlKXt0aGlzLmNsb3NlRW1wdHlWaWV3KCk7dmFyIHQ9dGhpcy5nZXRJdGVtVmlldyhlKSxpPXRoaXMuY29sbGVjdGlvbi5pbmRleE9mKGUpO3RoaXMuYWRkSXRlbVZpZXcoZSx0LGkpfSxvblNob3dDYWxsZWQ6ZnVuY3Rpb24oKXt0aGlzLmNoaWxkcmVuLmVhY2goZnVuY3Rpb24oZSl7by50cmlnZ2VyTWV0aG9kLmNhbGwoZSxcInNob3dcIil9KX0sdHJpZ2dlckJlZm9yZVJlbmRlcjpmdW5jdGlvbigpe3RoaXMudHJpZ2dlck1ldGhvZChcImJlZm9yZTpyZW5kZXJcIix0aGlzKSx0aGlzLnRyaWdnZXJNZXRob2QoXCJjb2xsZWN0aW9uOmJlZm9yZTpyZW5kZXJcIix0aGlzKX0sdHJpZ2dlclJlbmRlcmVkOmZ1bmN0aW9uKCl7dGhpcy50cmlnZ2VyTWV0aG9kKFwicmVuZGVyXCIsdGhpcyksdGhpcy50cmlnZ2VyTWV0aG9kKFwiY29sbGVjdGlvbjpyZW5kZXJlZFwiLHRoaXMpfSxyZW5kZXI6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc0Nsb3NlZD0hMSx0aGlzLnRyaWdnZXJCZWZvcmVSZW5kZXIoKSx0aGlzLl9yZW5kZXJDaGlsZHJlbigpLHRoaXMudHJpZ2dlclJlbmRlcmVkKCksdGhpc30sX3JlbmRlckNoaWxkcmVuOmZ1bmN0aW9uKCl7dGhpcy5zdGFydEJ1ZmZlcmluZygpLHRoaXMuY2xvc2VFbXB0eVZpZXcoKSx0aGlzLmNsb3NlQ2hpbGRyZW4oKSx0aGlzLmNvbGxlY3Rpb24mJnRoaXMuY29sbGVjdGlvbi5sZW5ndGg+MD90aGlzLnNob3dDb2xsZWN0aW9uKCk6dGhpcy5zaG93RW1wdHlWaWV3KCksdGhpcy5lbmRCdWZmZXJpbmcoKX0sc2hvd0NvbGxlY3Rpb246ZnVuY3Rpb24oKXt2YXIgZTt0aGlzLmNvbGxlY3Rpb24uZWFjaChmdW5jdGlvbih0LGkpe2U9dGhpcy5nZXRJdGVtVmlldyh0KSx0aGlzLmFkZEl0ZW1WaWV3KHQsZSxpKX0sdGhpcyl9LHNob3dFbXB0eVZpZXc6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmdldEVtcHR5VmlldygpO2lmKGUmJiF0aGlzLl9zaG93aW5nRW1wdHlWaWV3KXt0aGlzLl9zaG93aW5nRW1wdHlWaWV3PSEwO3ZhciBpPW5ldyB0Lk1vZGVsO3RoaXMuYWRkSXRlbVZpZXcoaSxlLDApfX0sY2xvc2VFbXB0eVZpZXc6ZnVuY3Rpb24oKXt0aGlzLl9zaG93aW5nRW1wdHlWaWV3JiYodGhpcy5jbG9zZUNoaWxkcmVuKCksZGVsZXRlIHRoaXMuX3Nob3dpbmdFbXB0eVZpZXcpfSxnZXRFbXB0eVZpZXc6ZnVuY3Rpb24oKXtyZXR1cm4gby5nZXRPcHRpb24odGhpcyxcImVtcHR5Vmlld1wiKX0sZ2V0SXRlbVZpZXc6ZnVuY3Rpb24oKXt2YXIgZT1vLmdldE9wdGlvbih0aGlzLFwiaXRlbVZpZXdcIik7cmV0dXJuIGV8fHIoXCJBbiBgaXRlbVZpZXdgIG11c3QgYmUgc3BlY2lmaWVkXCIsXCJOb0l0ZW1WaWV3RXJyb3JcIiksZX0sYWRkSXRlbVZpZXc6ZnVuY3Rpb24oZSx0LG4pe3ZhciByPW8uZ2V0T3B0aW9uKHRoaXMsXCJpdGVtVmlld09wdGlvbnNcIik7aS5pc0Z1bmN0aW9uKHIpJiYocj1yLmNhbGwodGhpcyxlLG4pKTt2YXIgcz10aGlzLmJ1aWxkSXRlbVZpZXcoZSx0LHIpO3RoaXMuYWRkQ2hpbGRWaWV3RXZlbnRGb3J3YXJkaW5nKHMpLHRoaXMudHJpZ2dlck1ldGhvZChcImJlZm9yZTppdGVtOmFkZGVkXCIscyksdGhpcy5jaGlsZHJlbi5hZGQocyksdGhpcy5yZW5kZXJJdGVtVmlldyhzLG4pLHRoaXMuX2lzU2hvd24mJm8udHJpZ2dlck1ldGhvZC5jYWxsKHMsXCJzaG93XCIpLHRoaXMudHJpZ2dlck1ldGhvZChcImFmdGVyOml0ZW06YWRkZWRcIixzKX0sYWRkQ2hpbGRWaWV3RXZlbnRGb3J3YXJkaW5nOmZ1bmN0aW9uKGUpe3ZhciB0PW8uZ2V0T3B0aW9uKHRoaXMsXCJpdGVtVmlld0V2ZW50UHJlZml4XCIpO3RoaXMubGlzdGVuVG8oZSxcImFsbFwiLGZ1bmN0aW9uKCl7dmFyIGk9bihhcmd1bWVudHMpO2lbMF09dCtcIjpcIitpWzBdLGkuc3BsaWNlKDEsMCxlKSxvLnRyaWdnZXJNZXRob2QuYXBwbHkodGhpcyxpKX0sdGhpcyl9LHJlbmRlckl0ZW1WaWV3OmZ1bmN0aW9uKGUsdCl7ZS5yZW5kZXIoKSx0aGlzLmFwcGVuZEh0bWwodGhpcyxlLHQpfSxidWlsZEl0ZW1WaWV3OmZ1bmN0aW9uKGUsdCxuKXt2YXIgcj1pLmV4dGVuZCh7bW9kZWw6ZX0sbik7cmV0dXJuIG5ldyB0KHIpfSxyZW1vdmVJdGVtVmlldzpmdW5jdGlvbihlKXt2YXIgdD10aGlzLmNoaWxkcmVuLmZpbmRCeU1vZGVsKGUpO3RoaXMucmVtb3ZlQ2hpbGRWaWV3KHQpLHRoaXMuY2hlY2tFbXB0eSgpfSxyZW1vdmVDaGlsZFZpZXc6ZnVuY3Rpb24oZSl7ZSYmKHRoaXMuc3RvcExpc3RlbmluZyhlKSxlLmNsb3NlP2UuY2xvc2UoKTplLnJlbW92ZSYmZS5yZW1vdmUoKSx0aGlzLmNoaWxkcmVuLnJlbW92ZShlKSksdGhpcy50cmlnZ2VyTWV0aG9kKFwiaXRlbTpyZW1vdmVkXCIsZSl9LGNoZWNrRW1wdHk6ZnVuY3Rpb24oKXt0aGlzLmNvbGxlY3Rpb24mJjAhPT10aGlzLmNvbGxlY3Rpb24ubGVuZ3RofHx0aGlzLnNob3dFbXB0eVZpZXcoKX0sYXBwZW5kQnVmZmVyOmZ1bmN0aW9uKGUsdCl7ZS4kZWwuYXBwZW5kKHQpfSxhcHBlbmRIdG1sOmZ1bmN0aW9uKGUsdCl7ZS5pc0J1ZmZlcmluZz9lLmVsQnVmZmVyLmFwcGVuZENoaWxkKHQuZWwpOmUuJGVsLmFwcGVuZCh0LmVsKX0sX2luaXRDaGlsZFZpZXdTdG9yYWdlOmZ1bmN0aW9uKCl7dGhpcy5jaGlsZHJlbj1uZXcgdC5DaGlsZFZpZXdDb250YWluZXJ9LGNsb3NlOmZ1bmN0aW9uKCl7dGhpcy5pc0Nsb3NlZHx8KHRoaXMudHJpZ2dlck1ldGhvZChcImNvbGxlY3Rpb246YmVmb3JlOmNsb3NlXCIpLHRoaXMuY2xvc2VDaGlsZHJlbigpLHRoaXMudHJpZ2dlck1ldGhvZChcImNvbGxlY3Rpb246Y2xvc2VkXCIpLG8uVmlldy5wcm90b3R5cGUuY2xvc2UuYXBwbHkodGhpcyxuKGFyZ3VtZW50cykpKX0sY2xvc2VDaGlsZHJlbjpmdW5jdGlvbigpe3RoaXMuY2hpbGRyZW4uZWFjaChmdW5jdGlvbihlKXt0aGlzLnJlbW92ZUNoaWxkVmlldyhlKX0sdGhpcyksdGhpcy5jaGVja0VtcHR5KCl9fSksby5Db21wb3NpdGVWaWV3PW8uQ29sbGVjdGlvblZpZXcuZXh0ZW5kKHtjb25zdHJ1Y3RvcjpmdW5jdGlvbigpe28uQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsbihhcmd1bWVudHMpKX0sX2luaXRpYWxFdmVudHM6ZnVuY3Rpb24oKXt0aGlzLm9uY2UoXCJyZW5kZXJcIixmdW5jdGlvbigpe3RoaXMuY29sbGVjdGlvbiYmKHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLFwiYWRkXCIsdGhpcy5hZGRDaGlsZFZpZXcsdGhpcyksdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sXCJyZW1vdmVcIix0aGlzLnJlbW92ZUl0ZW1WaWV3LHRoaXMpLHRoaXMubGlzdGVuVG8odGhpcy5jb2xsZWN0aW9uLFwicmVzZXRcIix0aGlzLl9yZW5kZXJDaGlsZHJlbix0aGlzKSl9KX0sZ2V0SXRlbVZpZXc6ZnVuY3Rpb24oKXt2YXIgZT1vLmdldE9wdGlvbih0aGlzLFwiaXRlbVZpZXdcIil8fHRoaXMuY29uc3RydWN0b3I7cmV0dXJuIGV8fHIoXCJBbiBgaXRlbVZpZXdgIG11c3QgYmUgc3BlY2lmaWVkXCIsXCJOb0l0ZW1WaWV3RXJyb3JcIiksZX0sc2VyaWFsaXplRGF0YTpmdW5jdGlvbigpe3ZhciBlPXt9O3JldHVybiB0aGlzLm1vZGVsJiYoZT10aGlzLm1vZGVsLnRvSlNPTigpKSxlfSxyZW5kZXI6ZnVuY3Rpb24oKXt0aGlzLmlzUmVuZGVyZWQ9ITAsdGhpcy5pc0Nsb3NlZD0hMSx0aGlzLnJlc2V0SXRlbVZpZXdDb250YWluZXIoKSx0aGlzLnRyaWdnZXJCZWZvcmVSZW5kZXIoKTt2YXIgZT10aGlzLnJlbmRlck1vZGVsKCk7cmV0dXJuIHRoaXMuJGVsLmh0bWwoZSksdGhpcy5iaW5kVUlFbGVtZW50cygpLHRoaXMudHJpZ2dlck1ldGhvZChcImNvbXBvc2l0ZTptb2RlbDpyZW5kZXJlZFwiKSx0aGlzLl9yZW5kZXJDaGlsZHJlbigpLHRoaXMudHJpZ2dlck1ldGhvZChcImNvbXBvc2l0ZTpyZW5kZXJlZFwiKSx0aGlzLnRyaWdnZXJSZW5kZXJlZCgpLHRoaXN9LF9yZW5kZXJDaGlsZHJlbjpmdW5jdGlvbigpe3RoaXMuaXNSZW5kZXJlZCYmKG8uQ29sbGVjdGlvblZpZXcucHJvdG90eXBlLl9yZW5kZXJDaGlsZHJlbi5jYWxsKHRoaXMpLHRoaXMudHJpZ2dlck1ldGhvZChcImNvbXBvc2l0ZTpjb2xsZWN0aW9uOnJlbmRlcmVkXCIpKX0scmVuZGVyTW9kZWw6ZnVuY3Rpb24oKXt2YXIgZT17fTtlPXRoaXMuc2VyaWFsaXplRGF0YSgpLGU9dGhpcy5taXhpblRlbXBsYXRlSGVscGVycyhlKTt2YXIgdD10aGlzLmdldFRlbXBsYXRlKCk7cmV0dXJuIG8uUmVuZGVyZXIucmVuZGVyKHQsZSl9LGFwcGVuZEJ1ZmZlcjpmdW5jdGlvbihlLHQpe3ZhciBpPXRoaXMuZ2V0SXRlbVZpZXdDb250YWluZXIoZSk7aS5hcHBlbmQodCl9LGFwcGVuZEh0bWw6ZnVuY3Rpb24oZSx0KXtpZihlLmlzQnVmZmVyaW5nKWUuZWxCdWZmZXIuYXBwZW5kQ2hpbGQodC5lbCk7ZWxzZXt2YXIgaT10aGlzLmdldEl0ZW1WaWV3Q29udGFpbmVyKGUpO2kuYXBwZW5kKHQuZWwpfX0sZ2V0SXRlbVZpZXdDb250YWluZXI6ZnVuY3Rpb24oZSl7aWYoXCIkaXRlbVZpZXdDb250YWluZXJcImluIGUpcmV0dXJuIGUuJGl0ZW1WaWV3Q29udGFpbmVyO3ZhciB0LG49by5nZXRPcHRpb24oZSxcIml0ZW1WaWV3Q29udGFpbmVyXCIpO2lmKG4pe3ZhciBzPWkuaXNGdW5jdGlvbihuKT9uKCk6bjt0PWUuJChzKSx0Lmxlbmd0aDw9MCYmcihcIlRoZSBzcGVjaWZpZWQgYGl0ZW1WaWV3Q29udGFpbmVyYCB3YXMgbm90IGZvdW5kOiBcIitlLml0ZW1WaWV3Q29udGFpbmVyLFwiSXRlbVZpZXdDb250YWluZXJNaXNzaW5nRXJyb3JcIil9ZWxzZSB0PWUuJGVsO3JldHVybiBlLiRpdGVtVmlld0NvbnRhaW5lcj10LHR9LHJlc2V0SXRlbVZpZXdDb250YWluZXI6ZnVuY3Rpb24oKXt0aGlzLiRpdGVtVmlld0NvbnRhaW5lciYmZGVsZXRlIHRoaXMuJGl0ZW1WaWV3Q29udGFpbmVyfX0pLG8uTGF5b3V0PW8uSXRlbVZpZXcuZXh0ZW5kKHtyZWdpb25UeXBlOm8uUmVnaW9uLGNvbnN0cnVjdG9yOmZ1bmN0aW9uKGUpe2U9ZXx8e30sdGhpcy5fZmlyc3RSZW5kZXI9ITAsdGhpcy5faW5pdGlhbGl6ZVJlZ2lvbnMoZSksby5JdGVtVmlldy5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLGUpfSxyZW5kZXI6ZnVuY3Rpb24oKXt0aGlzLmlzQ2xvc2VkJiZ0aGlzLl9pbml0aWFsaXplUmVnaW9ucygpLHRoaXMuX2ZpcnN0UmVuZGVyP3RoaXMuX2ZpcnN0UmVuZGVyPSExOnRoaXMuaXNDbG9zZWR8fHRoaXMuX3JlSW5pdGlhbGl6ZVJlZ2lvbnMoKTt2YXIgZT1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKSx0PW8uSXRlbVZpZXcucHJvdG90eXBlLnJlbmRlci5hcHBseSh0aGlzLGUpO3JldHVybiB0fSxjbG9zZTpmdW5jdGlvbigpe2lmKCF0aGlzLmlzQ2xvc2VkKXt0aGlzLnJlZ2lvbk1hbmFnZXIuY2xvc2UoKTt2YXIgZT1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtvLkl0ZW1WaWV3LnByb3RvdHlwZS5jbG9zZS5hcHBseSh0aGlzLGUpfX0sYWRkUmVnaW9uOmZ1bmN0aW9uKGUsdCl7dmFyIGk9e307cmV0dXJuIGlbZV09dCx0aGlzLl9idWlsZFJlZ2lvbnMoaSlbZV19LGFkZFJlZ2lvbnM6ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMucmVnaW9ucz1pLmV4dGVuZCh7fSx0aGlzLnJlZ2lvbnMsZSksdGhpcy5fYnVpbGRSZWdpb25zKGUpfSxyZW1vdmVSZWdpb246ZnVuY3Rpb24oZSl7cmV0dXJuIGRlbGV0ZSB0aGlzLnJlZ2lvbnNbZV0sdGhpcy5yZWdpb25NYW5hZ2VyLnJlbW92ZVJlZ2lvbihlKX0sX2J1aWxkUmVnaW9uczpmdW5jdGlvbihlKXt2YXIgdD10aGlzLGk9e3JlZ2lvblR5cGU6by5nZXRPcHRpb24odGhpcyxcInJlZ2lvblR5cGVcIikscGFyZW50RWw6ZnVuY3Rpb24oKXtyZXR1cm4gdC4kZWx9fTtyZXR1cm4gdGhpcy5yZWdpb25NYW5hZ2VyLmFkZFJlZ2lvbnMoZSxpKX0sX2luaXRpYWxpemVSZWdpb25zOmZ1bmN0aW9uKGUpe3ZhciB0O3RoaXMuX2luaXRSZWdpb25NYW5hZ2VyKCksdD1pLmlzRnVuY3Rpb24odGhpcy5yZWdpb25zKT90aGlzLnJlZ2lvbnMoZSk6dGhpcy5yZWdpb25zfHx7fSx0aGlzLmFkZFJlZ2lvbnModCl9LF9yZUluaXRpYWxpemVSZWdpb25zOmZ1bmN0aW9uKCl7dGhpcy5yZWdpb25NYW5hZ2VyLmNsb3NlUmVnaW9ucygpLHRoaXMucmVnaW9uTWFuYWdlci5lYWNoKGZ1bmN0aW9uKGUpe2UucmVzZXQoKX0pfSxfaW5pdFJlZ2lvbk1hbmFnZXI6ZnVuY3Rpb24oKXt0aGlzLnJlZ2lvbk1hbmFnZXI9bmV3IG8uUmVnaW9uTWFuYWdlcix0aGlzLmxpc3RlblRvKHRoaXMucmVnaW9uTWFuYWdlcixcInJlZ2lvbjphZGRcIixmdW5jdGlvbihlLHQpe3RoaXNbZV09dCx0aGlzLnRyaWdnZXIoXCJyZWdpb246YWRkXCIsZSx0KX0pLHRoaXMubGlzdGVuVG8odGhpcy5yZWdpb25NYW5hZ2VyLFwicmVnaW9uOnJlbW92ZVwiLGZ1bmN0aW9uKGUsdCl7ZGVsZXRlIHRoaXNbZV0sdGhpcy50cmlnZ2VyKFwicmVnaW9uOnJlbW92ZVwiLGUsdCl9KX19KSxvLkFwcFJvdXRlcj10LlJvdXRlci5leHRlbmQoe2NvbnN0cnVjdG9yOmZ1bmN0aW9uKGUpe3QuUm91dGVyLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLG4oYXJndW1lbnRzKSksdGhpcy5vcHRpb25zPWV8fHt9O3ZhciBpPW8uZ2V0T3B0aW9uKHRoaXMsXCJhcHBSb3V0ZXNcIikscj10aGlzLl9nZXRDb250cm9sbGVyKCk7dGhpcy5wcm9jZXNzQXBwUm91dGVzKHIsaSl9LGFwcFJvdXRlOmZ1bmN0aW9uKGUsdCl7dmFyIGk9dGhpcy5fZ2V0Q29udHJvbGxlcigpO3RoaXMuX2FkZEFwcFJvdXRlKGksZSx0KX0scHJvY2Vzc0FwcFJvdXRlczpmdW5jdGlvbihlLHQpe2lmKHQpe3ZhciBuPWkua2V5cyh0KS5yZXZlcnNlKCk7aS5lYWNoKG4sZnVuY3Rpb24oaSl7dGhpcy5fYWRkQXBwUm91dGUoZSxpLHRbaV0pfSx0aGlzKX19LF9nZXRDb250cm9sbGVyOmZ1bmN0aW9uKCl7cmV0dXJuIG8uZ2V0T3B0aW9uKHRoaXMsXCJjb250cm9sbGVyXCIpfSxfYWRkQXBwUm91dGU6ZnVuY3Rpb24oZSx0LG4pe3ZhciByPWVbbl07aWYoIXIpdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kICdcIituK1wiJyB3YXMgbm90IGZvdW5kIG9uIHRoZSBjb250cm9sbGVyXCIpO3RoaXMucm91dGUodCxuLGkuYmluZChyLGUpKX19KSxvLkFwcGxpY2F0aW9uPWZ1bmN0aW9uKGUpe3RoaXMuX2luaXRSZWdpb25NYW5hZ2VyKCksdGhpcy5faW5pdENhbGxiYWNrcz1uZXcgby5DYWxsYmFja3MsdGhpcy52ZW50PW5ldyB0LldyZXFyLkV2ZW50QWdncmVnYXRvcix0aGlzLmNvbW1hbmRzPW5ldyB0LldyZXFyLkNvbW1hbmRzLHRoaXMucmVxcmVzPW5ldyB0LldyZXFyLlJlcXVlc3RSZXNwb25zZSx0aGlzLnN1Ym1vZHVsZXM9e30saS5leHRlbmQodGhpcyxlKSx0aGlzLnRyaWdnZXJNZXRob2Q9by50cmlnZ2VyTWV0aG9kfSxpLmV4dGVuZChvLkFwcGxpY2F0aW9uLnByb3RvdHlwZSx0LkV2ZW50cyx7ZXhlY3V0ZTpmdW5jdGlvbigpe3ZhciBlPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO3RoaXMuY29tbWFuZHMuZXhlY3V0ZS5hcHBseSh0aGlzLmNvbW1hbmRzLGUpfSxyZXF1ZXN0OmZ1bmN0aW9uKCl7dmFyIGU9QXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KGFyZ3VtZW50cyk7cmV0dXJuIHRoaXMucmVxcmVzLnJlcXVlc3QuYXBwbHkodGhpcy5yZXFyZXMsZSl9LGFkZEluaXRpYWxpemVyOmZ1bmN0aW9uKGUpe3RoaXMuX2luaXRDYWxsYmFja3MuYWRkKGUpfSxzdGFydDpmdW5jdGlvbihlKXt0aGlzLnRyaWdnZXJNZXRob2QoXCJpbml0aWFsaXplOmJlZm9yZVwiLGUpLHRoaXMuX2luaXRDYWxsYmFja3MucnVuKGUsdGhpcyksdGhpcy50cmlnZ2VyTWV0aG9kKFwiaW5pdGlhbGl6ZTphZnRlclwiLGUpLHRoaXMudHJpZ2dlck1ldGhvZChcInN0YXJ0XCIsZSl9LGFkZFJlZ2lvbnM6ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuX3JlZ2lvbk1hbmFnZXIuYWRkUmVnaW9ucyhlKX0sY2xvc2VSZWdpb25zOmZ1bmN0aW9uKCl7dGhpcy5fcmVnaW9uTWFuYWdlci5jbG9zZVJlZ2lvbnMoKX0scmVtb3ZlUmVnaW9uOmZ1bmN0aW9uKGUpe3RoaXMuX3JlZ2lvbk1hbmFnZXIucmVtb3ZlUmVnaW9uKGUpfSxnZXRSZWdpb246ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuX3JlZ2lvbk1hbmFnZXIuZ2V0KGUpfSxtb2R1bGU6ZnVuY3Rpb24oKXt2YXIgZT1uKGFyZ3VtZW50cyk7cmV0dXJuIGUudW5zaGlmdCh0aGlzKSxvLk1vZHVsZS5jcmVhdGUuYXBwbHkoby5Nb2R1bGUsZSl9LF9pbml0UmVnaW9uTWFuYWdlcjpmdW5jdGlvbigpe3RoaXMuX3JlZ2lvbk1hbmFnZXI9bmV3IG8uUmVnaW9uTWFuYWdlcix0aGlzLmxpc3RlblRvKHRoaXMuX3JlZ2lvbk1hbmFnZXIsXCJyZWdpb246YWRkXCIsZnVuY3Rpb24oZSx0KXt0aGlzW2VdPXR9KSx0aGlzLmxpc3RlblRvKHRoaXMuX3JlZ2lvbk1hbmFnZXIsXCJyZWdpb246cmVtb3ZlXCIsZnVuY3Rpb24oZSl7ZGVsZXRlIHRoaXNbZV19KX19KSxvLkFwcGxpY2F0aW9uLmV4dGVuZD1vLmV4dGVuZCxvLk1vZHVsZT1mdW5jdGlvbihlLHQpe3RoaXMubW9kdWxlTmFtZT1lLHRoaXMuc3VibW9kdWxlcz17fSx0aGlzLl9zZXR1cEluaXRpYWxpemVyc0FuZEZpbmFsaXplcnMoKSx0aGlzLmFwcD10LHRoaXMuc3RhcnRXaXRoUGFyZW50PSEwLHRoaXMudHJpZ2dlck1ldGhvZD1vLnRyaWdnZXJNZXRob2R9LGkuZXh0ZW5kKG8uTW9kdWxlLnByb3RvdHlwZSx0LkV2ZW50cyx7YWRkSW5pdGlhbGl6ZXI6ZnVuY3Rpb24oZSl7dGhpcy5faW5pdGlhbGl6ZXJDYWxsYmFja3MuYWRkKGUpfSxhZGRGaW5hbGl6ZXI6ZnVuY3Rpb24oZSl7dGhpcy5fZmluYWxpemVyQ2FsbGJhY2tzLmFkZChlKX0sc3RhcnQ6ZnVuY3Rpb24oZSl7dGhpcy5faXNJbml0aWFsaXplZHx8KGkuZWFjaCh0aGlzLnN1Ym1vZHVsZXMsZnVuY3Rpb24odCl7dC5zdGFydFdpdGhQYXJlbnQmJnQuc3RhcnQoZSl9KSx0aGlzLnRyaWdnZXJNZXRob2QoXCJiZWZvcmU6c3RhcnRcIixlKSx0aGlzLl9pbml0aWFsaXplckNhbGxiYWNrcy5ydW4oZSx0aGlzKSx0aGlzLl9pc0luaXRpYWxpemVkPSEwLHRoaXMudHJpZ2dlck1ldGhvZChcInN0YXJ0XCIsZSkpfSxzdG9wOmZ1bmN0aW9uKCl7dGhpcy5faXNJbml0aWFsaXplZCYmKHRoaXMuX2lzSW5pdGlhbGl6ZWQ9ITEsby50cmlnZ2VyTWV0aG9kLmNhbGwodGhpcyxcImJlZm9yZTpzdG9wXCIpLGkuZWFjaCh0aGlzLnN1Ym1vZHVsZXMsZnVuY3Rpb24oZSl7ZS5zdG9wKCl9KSx0aGlzLl9maW5hbGl6ZXJDYWxsYmFja3MucnVuKHZvaWQgMCx0aGlzKSx0aGlzLl9pbml0aWFsaXplckNhbGxiYWNrcy5yZXNldCgpLHRoaXMuX2ZpbmFsaXplckNhbGxiYWNrcy5yZXNldCgpLG8udHJpZ2dlck1ldGhvZC5jYWxsKHRoaXMsXCJzdG9wXCIpKX0sYWRkRGVmaW5pdGlvbjpmdW5jdGlvbihlLHQpe3RoaXMuX3J1bk1vZHVsZURlZmluaXRpb24oZSx0KX0sX3J1bk1vZHVsZURlZmluaXRpb246ZnVuY3Rpb24oZSxuKXtpZihlKXt2YXIgcj1pLmZsYXR0ZW4oW3RoaXMsdGhpcy5hcHAsdCxvLG8uJCxpLG5dKTtlLmFwcGx5KHRoaXMscil9fSxfc2V0dXBJbml0aWFsaXplcnNBbmRGaW5hbGl6ZXJzOmZ1bmN0aW9uKCl7dGhpcy5faW5pdGlhbGl6ZXJDYWxsYmFja3M9bmV3IG8uQ2FsbGJhY2tzLHRoaXMuX2ZpbmFsaXplckNhbGxiYWNrcz1uZXcgby5DYWxsYmFja3N9fSksaS5leHRlbmQoby5Nb2R1bGUse2NyZWF0ZTpmdW5jdGlvbihlLHQscil7dmFyIG89ZSxzPW4oYXJndW1lbnRzKTtzLnNwbGljZSgwLDMpLHQ9dC5zcGxpdChcIi5cIik7dmFyIGE9dC5sZW5ndGgsaD1bXTtyZXR1cm4gaFthLTFdPXIsaS5lYWNoKHQsZnVuY3Rpb24odCxpKXt2YXIgbj1vO289dGhpcy5fZ2V0TW9kdWxlKG4sdCxlKSx0aGlzLl9hZGRNb2R1bGVEZWZpbml0aW9uKG4sbyxoW2ldLHMpfSx0aGlzKSxvfSxfZ2V0TW9kdWxlOmZ1bmN0aW9uKGUsdCxpKXt2YXIgbj1lW3RdO3JldHVybiBufHwobj1uZXcgby5Nb2R1bGUodCxpKSxlW3RdPW4sZS5zdWJtb2R1bGVzW3RdPW4pLG59LF9hZGRNb2R1bGVEZWZpbml0aW9uOmZ1bmN0aW9uKGUsdCxuLHIpe3ZhciBvLHM7aS5pc0Z1bmN0aW9uKG4pPyhvPW4scz0hMCk6aS5pc09iamVjdChuKT8obz1uLmRlZmluZSxzPW4uc3RhcnRXaXRoUGFyZW50KTpzPSEwLG8mJnQuYWRkRGVmaW5pdGlvbihvLHIpLHQuc3RhcnRXaXRoUGFyZW50PXQuc3RhcnRXaXRoUGFyZW50JiZzLHQuc3RhcnRXaXRoUGFyZW50JiYhdC5zdGFydFdpdGhQYXJlbnRJc0NvbmZpZ3VyZWQmJih0LnN0YXJ0V2l0aFBhcmVudElzQ29uZmlndXJlZD0hMCxlLmFkZEluaXRpYWxpemVyKGZ1bmN0aW9uKGUpe3Quc3RhcnRXaXRoUGFyZW50JiZ0LnN0YXJ0KGUpfSkpfX0pLG99KHRoaXMsQmFja2JvbmUsXyk7bihcInVuZGVmaW5lZFwiIT10eXBlb2Ygcj9yOndpbmRvdy5NYXJpb25ldHRlKX0pLmNhbGwoZ2xvYmFsLHZvaWQgMCx2b2lkIDAsdm9pZCAwLGZ1bmN0aW9uKGUpe21vZHVsZS5leHBvcnRzPWV9KTt9KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXsoZnVuY3Rpb24odCxlLGksbil7Z2xvYmFsLnVuZGVyc2NvcmU9cmVxdWlyZShcInVuZGVyc2NvcmVcIiksZnVuY3Rpb24oKXt7dmFyIHQsaT10aGlzLG49aS5CYWNrYm9uZSxzPVtdLHI9KHMucHVzaCxzLnNsaWNlKTtzLnNwbGljZX10PVwidW5kZWZpbmVkXCIhPXR5cGVvZiBlP2U6aS5CYWNrYm9uZT17fSx0LlZFUlNJT049XCIxLjEuMFwiO3ZhciBhPWkuXzthfHxcInVuZGVmaW5lZFwiPT10eXBlb2YgcmVxdWlyZXx8KGE9cmVxdWlyZShcInVuZGVyc2NvcmVcIikpLHQuJD1pLmpRdWVyeXx8aS5aZXB0b3x8aS5lbmRlcnx8aS4kLHQubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBpLkJhY2tib25lPW4sdGhpc30sdC5lbXVsYXRlSFRUUD0hMSx0LmVtdWxhdGVKU09OPSExO3ZhciBvPXQuRXZlbnRzPXtvbjpmdW5jdGlvbih0LGUsaSl7aWYoIXUodGhpcyxcIm9uXCIsdCxbZSxpXSl8fCFlKXJldHVybiB0aGlzO3RoaXMuX2V2ZW50c3x8KHRoaXMuX2V2ZW50cz17fSk7dmFyIG49dGhpcy5fZXZlbnRzW3RdfHwodGhpcy5fZXZlbnRzW3RdPVtdKTtyZXR1cm4gbi5wdXNoKHtjYWxsYmFjazplLGNvbnRleHQ6aSxjdHg6aXx8dGhpc30pLHRoaXN9LG9uY2U6ZnVuY3Rpb24odCxlLGkpe2lmKCF1KHRoaXMsXCJvbmNlXCIsdCxbZSxpXSl8fCFlKXJldHVybiB0aGlzO3ZhciBuPXRoaXMscz1hLm9uY2UoZnVuY3Rpb24oKXtuLm9mZih0LHMpLGUuYXBwbHkodGhpcyxhcmd1bWVudHMpfSk7cmV0dXJuIHMuX2NhbGxiYWNrPWUsdGhpcy5vbih0LHMsaSl9LG9mZjpmdW5jdGlvbih0LGUsaSl7dmFyIG4scyxyLG8saCxjLGwsZDtpZighdGhpcy5fZXZlbnRzfHwhdSh0aGlzLFwib2ZmXCIsdCxbZSxpXSkpcmV0dXJuIHRoaXM7aWYoIXQmJiFlJiYhaSlyZXR1cm4gdGhpcy5fZXZlbnRzPXt9LHRoaXM7Zm9yKG89dD9bdF06YS5rZXlzKHRoaXMuX2V2ZW50cyksaD0wLGM9by5sZW5ndGg7Yz5oO2grKylpZih0PW9baF0scj10aGlzLl9ldmVudHNbdF0pe2lmKHRoaXMuX2V2ZW50c1t0XT1uPVtdLGV8fGkpZm9yKGw9MCxkPXIubGVuZ3RoO2Q+bDtsKyspcz1yW2xdLChlJiZlIT09cy5jYWxsYmFjayYmZSE9PXMuY2FsbGJhY2suX2NhbGxiYWNrfHxpJiZpIT09cy5jb250ZXh0KSYmbi5wdXNoKHMpO24ubGVuZ3RofHxkZWxldGUgdGhpcy5fZXZlbnRzW3RdfXJldHVybiB0aGlzfSx0cmlnZ2VyOmZ1bmN0aW9uKHQpe2lmKCF0aGlzLl9ldmVudHMpcmV0dXJuIHRoaXM7dmFyIGU9ci5jYWxsKGFyZ3VtZW50cywxKTtpZighdSh0aGlzLFwidHJpZ2dlclwiLHQsZSkpcmV0dXJuIHRoaXM7dmFyIGk9dGhpcy5fZXZlbnRzW3RdLG49dGhpcy5fZXZlbnRzLmFsbDtyZXR1cm4gaSYmYyhpLGUpLG4mJmMobixhcmd1bWVudHMpLHRoaXN9LHN0b3BMaXN0ZW5pbmc6ZnVuY3Rpb24odCxlLGkpe3ZhciBuPXRoaXMuX2xpc3RlbmluZ1RvO2lmKCFuKXJldHVybiB0aGlzO3ZhciBzPSFlJiYhaTtpfHxcIm9iamVjdFwiIT10eXBlb2YgZXx8KGk9dGhpcyksdCYmKChuPXt9KVt0Ll9saXN0ZW5JZF09dCk7Zm9yKHZhciByIGluIG4pdD1uW3JdLHQub2ZmKGUsaSx0aGlzKSwoc3x8YS5pc0VtcHR5KHQuX2V2ZW50cykpJiZkZWxldGUgdGhpcy5fbGlzdGVuaW5nVG9bcl07cmV0dXJuIHRoaXN9fSxoPS9cXHMrLyx1PWZ1bmN0aW9uKHQsZSxpLG4pe2lmKCFpKXJldHVybiEwO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBpKXtmb3IodmFyIHMgaW4gaSl0W2VdLmFwcGx5KHQsW3MsaVtzXV0uY29uY2F0KG4pKTtyZXR1cm4hMX1pZihoLnRlc3QoaSkpe2Zvcih2YXIgcj1pLnNwbGl0KGgpLGE9MCxvPXIubGVuZ3RoO28+YTthKyspdFtlXS5hcHBseSh0LFtyW2FdXS5jb25jYXQobikpO3JldHVybiExfXJldHVybiEwfSxjPWZ1bmN0aW9uKHQsZSl7dmFyIGksbj0tMSxzPXQubGVuZ3RoLHI9ZVswXSxhPWVbMV0sbz1lWzJdO3N3aXRjaChlLmxlbmd0aCl7Y2FzZSAwOmZvcig7KytuPHM7KShpPXRbbl0pLmNhbGxiYWNrLmNhbGwoaS5jdHgpO3JldHVybjtjYXNlIDE6Zm9yKDsrK248czspKGk9dFtuXSkuY2FsbGJhY2suY2FsbChpLmN0eCxyKTtyZXR1cm47Y2FzZSAyOmZvcig7KytuPHM7KShpPXRbbl0pLmNhbGxiYWNrLmNhbGwoaS5jdHgscixhKTtyZXR1cm47Y2FzZSAzOmZvcig7KytuPHM7KShpPXRbbl0pLmNhbGxiYWNrLmNhbGwoaS5jdHgscixhLG8pO3JldHVybjtkZWZhdWx0OmZvcig7KytuPHM7KShpPXRbbl0pLmNhbGxiYWNrLmFwcGx5KGkuY3R4LGUpfX0sbD17bGlzdGVuVG86XCJvblwiLGxpc3RlblRvT25jZTpcIm9uY2VcIn07YS5lYWNoKGwsZnVuY3Rpb24odCxlKXtvW2VdPWZ1bmN0aW9uKGUsaSxuKXt2YXIgcz10aGlzLl9saXN0ZW5pbmdUb3x8KHRoaXMuX2xpc3RlbmluZ1RvPXt9KSxyPWUuX2xpc3RlbklkfHwoZS5fbGlzdGVuSWQ9YS51bmlxdWVJZChcImxcIikpO3JldHVybiBzW3JdPWUsbnx8XCJvYmplY3RcIiE9dHlwZW9mIGl8fChuPXRoaXMpLGVbdF0oaSxuLHRoaXMpLHRoaXN9fSksby5iaW5kPW8ub24sby51bmJpbmQ9by5vZmYsYS5leHRlbmQodCxvKTt2YXIgZD10Lk1vZGVsPWZ1bmN0aW9uKHQsZSl7dmFyIGk9dHx8e307ZXx8KGU9e30pLHRoaXMuY2lkPWEudW5pcXVlSWQoXCJjXCIpLHRoaXMuYXR0cmlidXRlcz17fSxlLmNvbGxlY3Rpb24mJih0aGlzLmNvbGxlY3Rpb249ZS5jb2xsZWN0aW9uKSxlLnBhcnNlJiYoaT10aGlzLnBhcnNlKGksZSl8fHt9KSxpPWEuZGVmYXVsdHMoe30saSxhLnJlc3VsdCh0aGlzLFwiZGVmYXVsdHNcIikpLHRoaXMuc2V0KGksZSksdGhpcy5jaGFuZ2VkPXt9LHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2EuZXh0ZW5kKGQucHJvdG90eXBlLG8se2NoYW5nZWQ6bnVsbCx2YWxpZGF0aW9uRXJyb3I6bnVsbCxpZEF0dHJpYnV0ZTpcImlkXCIsaW5pdGlhbGl6ZTpmdW5jdGlvbigpe30sdG9KU09OOmZ1bmN0aW9uKCl7cmV0dXJuIGEuY2xvbmUodGhpcy5hdHRyaWJ1dGVzKX0sc3luYzpmdW5jdGlvbigpe3JldHVybiB0LnN5bmMuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxnZXQ6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuYXR0cmlidXRlc1t0XX0sZXNjYXBlOmZ1bmN0aW9uKHQpe3JldHVybiBhLmVzY2FwZSh0aGlzLmdldCh0KSl9LGhhczpmdW5jdGlvbih0KXtyZXR1cm4gbnVsbCE9dGhpcy5nZXQodCl9LHNldDpmdW5jdGlvbih0LGUsaSl7dmFyIG4scyxyLG8saCx1LGMsbDtpZihudWxsPT10KXJldHVybiB0aGlzO2lmKFwib2JqZWN0XCI9PXR5cGVvZiB0PyhzPXQsaT1lKToocz17fSlbdF09ZSxpfHwoaT17fSksIXRoaXMuX3ZhbGlkYXRlKHMsaSkpcmV0dXJuITE7cj1pLnVuc2V0LGg9aS5zaWxlbnQsbz1bXSx1PXRoaXMuX2NoYW5naW5nLHRoaXMuX2NoYW5naW5nPSEwLHV8fCh0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXM9YS5jbG9uZSh0aGlzLmF0dHJpYnV0ZXMpLHRoaXMuY2hhbmdlZD17fSksbD10aGlzLmF0dHJpYnV0ZXMsYz10aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMsdGhpcy5pZEF0dHJpYnV0ZSBpbiBzJiYodGhpcy5pZD1zW3RoaXMuaWRBdHRyaWJ1dGVdKTtmb3IobiBpbiBzKWU9c1tuXSxhLmlzRXF1YWwobFtuXSxlKXx8by5wdXNoKG4pLGEuaXNFcXVhbChjW25dLGUpP2RlbGV0ZSB0aGlzLmNoYW5nZWRbbl06dGhpcy5jaGFuZ2VkW25dPWUscj9kZWxldGUgbFtuXTpsW25dPWU7aWYoIWgpe28ubGVuZ3RoJiYodGhpcy5fcGVuZGluZz0hMCk7Zm9yKHZhciBkPTAsZj1vLmxlbmd0aDtmPmQ7ZCsrKXRoaXMudHJpZ2dlcihcImNoYW5nZTpcIitvW2RdLHRoaXMsbFtvW2RdXSxpKX1pZih1KXJldHVybiB0aGlzO2lmKCFoKWZvcig7dGhpcy5fcGVuZGluZzspdGhpcy5fcGVuZGluZz0hMSx0aGlzLnRyaWdnZXIoXCJjaGFuZ2VcIix0aGlzLGkpO3JldHVybiB0aGlzLl9wZW5kaW5nPSExLHRoaXMuX2NoYW5naW5nPSExLHRoaXN9LHVuc2V0OmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuc2V0KHQsdm9pZCAwLGEuZXh0ZW5kKHt9LGUse3Vuc2V0OiEwfSkpfSxjbGVhcjpmdW5jdGlvbih0KXt2YXIgZT17fTtmb3IodmFyIGkgaW4gdGhpcy5hdHRyaWJ1dGVzKWVbaV09dm9pZCAwO3JldHVybiB0aGlzLnNldChlLGEuZXh0ZW5kKHt9LHQse3Vuc2V0OiEwfSkpfSxoYXNDaGFuZ2VkOmZ1bmN0aW9uKHQpe3JldHVybiBudWxsPT10PyFhLmlzRW1wdHkodGhpcy5jaGFuZ2VkKTphLmhhcyh0aGlzLmNoYW5nZWQsdCl9LGNoYW5nZWRBdHRyaWJ1dGVzOmZ1bmN0aW9uKHQpe2lmKCF0KXJldHVybiB0aGlzLmhhc0NoYW5nZWQoKT9hLmNsb25lKHRoaXMuY2hhbmdlZCk6ITE7dmFyIGUsaT0hMSxuPXRoaXMuX2NoYW5naW5nP3RoaXMuX3ByZXZpb3VzQXR0cmlidXRlczp0aGlzLmF0dHJpYnV0ZXM7Zm9yKHZhciBzIGluIHQpYS5pc0VxdWFsKG5bc10sZT10W3NdKXx8KChpfHwoaT17fSkpW3NdPWUpO3JldHVybiBpfSxwcmV2aW91czpmdW5jdGlvbih0KXtyZXR1cm4gbnVsbCE9dCYmdGhpcy5fcHJldmlvdXNBdHRyaWJ1dGVzP3RoaXMuX3ByZXZpb3VzQXR0cmlidXRlc1t0XTpudWxsfSxwcmV2aW91c0F0dHJpYnV0ZXM6ZnVuY3Rpb24oKXtyZXR1cm4gYS5jbG9uZSh0aGlzLl9wcmV2aW91c0F0dHJpYnV0ZXMpfSxmZXRjaDpmdW5jdGlvbih0KXt0PXQ/YS5jbG9uZSh0KTp7fSx2b2lkIDA9PT10LnBhcnNlJiYodC5wYXJzZT0hMCk7dmFyIGU9dGhpcyxpPXQuc3VjY2VzcztyZXR1cm4gdC5zdWNjZXNzPWZ1bmN0aW9uKG4pe3JldHVybiBlLnNldChlLnBhcnNlKG4sdCksdCk/KGkmJmkoZSxuLHQpLHZvaWQgZS50cmlnZ2VyKFwic3luY1wiLGUsbix0KSk6ITF9LFUodGhpcyx0KSx0aGlzLnN5bmMoXCJyZWFkXCIsdGhpcyx0KX0sc2F2ZTpmdW5jdGlvbih0LGUsaSl7dmFyIG4scyxyLG89dGhpcy5hdHRyaWJ1dGVzO2lmKG51bGw9PXR8fFwib2JqZWN0XCI9PXR5cGVvZiB0PyhuPXQsaT1lKToobj17fSlbdF09ZSxpPWEuZXh0ZW5kKHt2YWxpZGF0ZTohMH0saSksbiYmIWkud2FpdCl7aWYoIXRoaXMuc2V0KG4saSkpcmV0dXJuITF9ZWxzZSBpZighdGhpcy5fdmFsaWRhdGUobixpKSlyZXR1cm4hMTtuJiZpLndhaXQmJih0aGlzLmF0dHJpYnV0ZXM9YS5leHRlbmQoe30sbyxuKSksdm9pZCAwPT09aS5wYXJzZSYmKGkucGFyc2U9ITApO3ZhciBoPXRoaXMsdT1pLnN1Y2Nlc3M7cmV0dXJuIGkuc3VjY2Vzcz1mdW5jdGlvbih0KXtoLmF0dHJpYnV0ZXM9bzt2YXIgZT1oLnBhcnNlKHQsaSk7cmV0dXJuIGkud2FpdCYmKGU9YS5leHRlbmQobnx8e30sZSkpLGEuaXNPYmplY3QoZSkmJiFoLnNldChlLGkpPyExOih1JiZ1KGgsdCxpKSx2b2lkIGgudHJpZ2dlcihcInN5bmNcIixoLHQsaSkpfSxVKHRoaXMsaSkscz10aGlzLmlzTmV3KCk/XCJjcmVhdGVcIjppLnBhdGNoP1wicGF0Y2hcIjpcInVwZGF0ZVwiLFwicGF0Y2hcIj09PXMmJihpLmF0dHJzPW4pLHI9dGhpcy5zeW5jKHMsdGhpcyxpKSxuJiZpLndhaXQmJih0aGlzLmF0dHJpYnV0ZXM9bykscn0sZGVzdHJveTpmdW5jdGlvbih0KXt0PXQ/YS5jbG9uZSh0KTp7fTt2YXIgZT10aGlzLGk9dC5zdWNjZXNzLG49ZnVuY3Rpb24oKXtlLnRyaWdnZXIoXCJkZXN0cm95XCIsZSxlLmNvbGxlY3Rpb24sdCl9O2lmKHQuc3VjY2Vzcz1mdW5jdGlvbihzKXsodC53YWl0fHxlLmlzTmV3KCkpJiZuKCksaSYmaShlLHMsdCksZS5pc05ldygpfHxlLnRyaWdnZXIoXCJzeW5jXCIsZSxzLHQpfSx0aGlzLmlzTmV3KCkpcmV0dXJuIHQuc3VjY2VzcygpLCExO1UodGhpcyx0KTt2YXIgcz10aGlzLnN5bmMoXCJkZWxldGVcIix0aGlzLHQpO3JldHVybiB0LndhaXR8fG4oKSxzfSx1cmw6ZnVuY3Rpb24oKXt2YXIgdD1hLnJlc3VsdCh0aGlzLFwidXJsUm9vdFwiKXx8YS5yZXN1bHQodGhpcy5jb2xsZWN0aW9uLFwidXJsXCIpfHxSKCk7cmV0dXJuIHRoaXMuaXNOZXcoKT90OnQrKFwiL1wiPT09dC5jaGFyQXQodC5sZW5ndGgtMSk/XCJcIjpcIi9cIikrZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuaWQpfSxwYXJzZTpmdW5jdGlvbih0KXtyZXR1cm4gdH0sY2xvbmU6ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5hdHRyaWJ1dGVzKX0saXNOZXc6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbD09dGhpcy5pZH0saXNWYWxpZDpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fdmFsaWRhdGUoe30sYS5leHRlbmQodHx8e30se3ZhbGlkYXRlOiEwfSkpfSxfdmFsaWRhdGU6ZnVuY3Rpb24odCxlKXtpZighZS52YWxpZGF0ZXx8IXRoaXMudmFsaWRhdGUpcmV0dXJuITA7dD1hLmV4dGVuZCh7fSx0aGlzLmF0dHJpYnV0ZXMsdCk7dmFyIGk9dGhpcy52YWxpZGF0aW9uRXJyb3I9dGhpcy52YWxpZGF0ZSh0LGUpfHxudWxsO3JldHVybiBpPyh0aGlzLnRyaWdnZXIoXCJpbnZhbGlkXCIsdGhpcyxpLGEuZXh0ZW5kKGUse3ZhbGlkYXRpb25FcnJvcjppfSkpLCExKTohMH19KTt2YXIgZj1bXCJrZXlzXCIsXCJ2YWx1ZXNcIixcInBhaXJzXCIsXCJpbnZlcnRcIixcInBpY2tcIixcIm9taXRcIl07YS5lYWNoKGYsZnVuY3Rpb24odCl7ZC5wcm90b3R5cGVbdF09ZnVuY3Rpb24oKXt2YXIgZT1yLmNhbGwoYXJndW1lbnRzKTtyZXR1cm4gZS51bnNoaWZ0KHRoaXMuYXR0cmlidXRlcyksYVt0XS5hcHBseShhLGUpfX0pO3ZhciBwPXQuQ29sbGVjdGlvbj1mdW5jdGlvbih0LGUpe2V8fChlPXt9KSxlLm1vZGVsJiYodGhpcy5tb2RlbD1lLm1vZGVsKSx2b2lkIDAhPT1lLmNvbXBhcmF0b3ImJih0aGlzLmNvbXBhcmF0b3I9ZS5jb21wYXJhdG9yKSx0aGlzLl9yZXNldCgpLHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyksdCYmdGhpcy5yZXNldCh0LGEuZXh0ZW5kKHtzaWxlbnQ6ITB9LGUpKX0sZz17YWRkOiEwLHJlbW92ZTohMCxtZXJnZTohMH0sdj17YWRkOiEwLHJlbW92ZTohMX07YS5leHRlbmQocC5wcm90b3R5cGUsbyx7bW9kZWw6ZCxpbml0aWFsaXplOmZ1bmN0aW9uKCl7fSx0b0pTT046ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKGUpe3JldHVybiBlLnRvSlNPTih0KX0pfSxzeW5jOmZ1bmN0aW9uKCl7cmV0dXJuIHQuc3luYy5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LGFkZDpmdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLnNldCh0LGEuZXh0ZW5kKHttZXJnZTohMX0sZSx2KSl9LHJlbW92ZTpmdW5jdGlvbih0LGUpe3ZhciBpPSFhLmlzQXJyYXkodCk7dD1pP1t0XTphLmNsb25lKHQpLGV8fChlPXt9KTt2YXIgbixzLHIsbztmb3Iobj0wLHM9dC5sZW5ndGg7cz5uO24rKylvPXRbbl09dGhpcy5nZXQodFtuXSksbyYmKGRlbGV0ZSB0aGlzLl9ieUlkW28uaWRdLGRlbGV0ZSB0aGlzLl9ieUlkW28uY2lkXSxyPXRoaXMuaW5kZXhPZihvKSx0aGlzLm1vZGVscy5zcGxpY2UociwxKSx0aGlzLmxlbmd0aC0tLGUuc2lsZW50fHwoZS5pbmRleD1yLG8udHJpZ2dlcihcInJlbW92ZVwiLG8sdGhpcyxlKSksdGhpcy5fcmVtb3ZlUmVmZXJlbmNlKG8pKTtyZXR1cm4gaT90WzBdOnR9LHNldDpmdW5jdGlvbih0LGUpe2U9YS5kZWZhdWx0cyh7fSxlLGcpLGUucGFyc2UmJih0PXRoaXMucGFyc2UodCxlKSk7dmFyIGk9IWEuaXNBcnJheSh0KTt0PWk/dD9bdF06W106YS5jbG9uZSh0KTt2YXIgbixzLHIsbyxoLHUsYyxsPWUuYXQsZj10aGlzLm1vZGVsLHA9dGhpcy5jb21wYXJhdG9yJiZudWxsPT1sJiZlLnNvcnQhPT0hMSx2PWEuaXNTdHJpbmcodGhpcy5jb21wYXJhdG9yKT90aGlzLmNvbXBhcmF0b3I6bnVsbCxtPVtdLHk9W10sXz17fSxiPWUuYWRkLHc9ZS5tZXJnZSx4PWUucmVtb3ZlLEU9IXAmJmImJng/W106ITE7Zm9yKG49MCxzPXQubGVuZ3RoO3M+bjtuKyspe2lmKGg9dFtuXSxyPWggaW5zdGFuY2VvZiBkP289aDpoW2YucHJvdG90eXBlLmlkQXR0cmlidXRlXSx1PXRoaXMuZ2V0KHIpKXgmJihfW3UuY2lkXT0hMCksdyYmKGg9aD09PW8/by5hdHRyaWJ1dGVzOmgsZS5wYXJzZSYmKGg9dS5wYXJzZShoLGUpKSx1LnNldChoLGUpLHAmJiFjJiZ1Lmhhc0NoYW5nZWQodikmJihjPSEwKSksdFtuXT11O2Vsc2UgaWYoYil7aWYobz10W25dPXRoaXMuX3ByZXBhcmVNb2RlbChoLGUpLCFvKWNvbnRpbnVlO20ucHVzaChvKSxvLm9uKFwiYWxsXCIsdGhpcy5fb25Nb2RlbEV2ZW50LHRoaXMpLHRoaXMuX2J5SWRbby5jaWRdPW8sbnVsbCE9by5pZCYmKHRoaXMuX2J5SWRbby5pZF09byl9RSYmRS5wdXNoKHV8fG8pfWlmKHgpe2ZvcihuPTAscz10aGlzLmxlbmd0aDtzPm47KytuKV9bKG89dGhpcy5tb2RlbHNbbl0pLmNpZF18fHkucHVzaChvKTt5Lmxlbmd0aCYmdGhpcy5yZW1vdmUoeSxlKX1pZihtLmxlbmd0aHx8RSYmRS5sZW5ndGgpaWYocCYmKGM9ITApLHRoaXMubGVuZ3RoKz1tLmxlbmd0aCxudWxsIT1sKWZvcihuPTAscz1tLmxlbmd0aDtzPm47bisrKXRoaXMubW9kZWxzLnNwbGljZShsK24sMCxtW25dKTtlbHNle0UmJih0aGlzLm1vZGVscy5sZW5ndGg9MCk7dmFyIGs9RXx8bTtmb3Iobj0wLHM9ay5sZW5ndGg7cz5uO24rKyl0aGlzLm1vZGVscy5wdXNoKGtbbl0pfWlmKGMmJnRoaXMuc29ydCh7c2lsZW50OiEwfSksIWUuc2lsZW50KXtmb3Iobj0wLHM9bS5sZW5ndGg7cz5uO24rKykobz1tW25dKS50cmlnZ2VyKFwiYWRkXCIsbyx0aGlzLGUpOyhjfHxFJiZFLmxlbmd0aCkmJnRoaXMudHJpZ2dlcihcInNvcnRcIix0aGlzLGUpfXJldHVybiBpP3RbMF06dH0scmVzZXQ6ZnVuY3Rpb24odCxlKXtlfHwoZT17fSk7Zm9yKHZhciBpPTAsbj10aGlzLm1vZGVscy5sZW5ndGg7bj5pO2krKyl0aGlzLl9yZW1vdmVSZWZlcmVuY2UodGhpcy5tb2RlbHNbaV0pO3JldHVybiBlLnByZXZpb3VzTW9kZWxzPXRoaXMubW9kZWxzLHRoaXMuX3Jlc2V0KCksdD10aGlzLmFkZCh0LGEuZXh0ZW5kKHtzaWxlbnQ6ITB9LGUpKSxlLnNpbGVudHx8dGhpcy50cmlnZ2VyKFwicmVzZXRcIix0aGlzLGUpLHR9LHB1c2g6ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5hZGQodCxhLmV4dGVuZCh7YXQ6dGhpcy5sZW5ndGh9LGUpKX0scG9wOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuYXQodGhpcy5sZW5ndGgtMSk7cmV0dXJuIHRoaXMucmVtb3ZlKGUsdCksZX0sdW5zaGlmdDpmdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLmFkZCh0LGEuZXh0ZW5kKHthdDowfSxlKSl9LHNoaWZ0OmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuYXQoMCk7cmV0dXJuIHRoaXMucmVtb3ZlKGUsdCksZX0sc2xpY2U6ZnVuY3Rpb24oKXtyZXR1cm4gci5hcHBseSh0aGlzLm1vZGVscyxhcmd1bWVudHMpfSxnZXQ6ZnVuY3Rpb24odCl7cmV0dXJuIG51bGw9PXQ/dm9pZCAwOnRoaXMuX2J5SWRbdC5pZF18fHRoaXMuX2J5SWRbdC5jaWRdfHx0aGlzLl9ieUlkW3RdfSxhdDpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5tb2RlbHNbdF19LHdoZXJlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGEuaXNFbXB0eSh0KT9lP3ZvaWQgMDpbXTp0aGlzW2U/XCJmaW5kXCI6XCJmaWx0ZXJcIl0oZnVuY3Rpb24oZSl7Zm9yKHZhciBpIGluIHQpaWYodFtpXSE9PWUuZ2V0KGkpKXJldHVybiExO3JldHVybiEwfSl9LGZpbmRXaGVyZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy53aGVyZSh0LCEwKX0sc29ydDpmdW5jdGlvbih0KXtpZighdGhpcy5jb21wYXJhdG9yKXRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBzb3J0IGEgc2V0IHdpdGhvdXQgYSBjb21wYXJhdG9yXCIpO3JldHVybiB0fHwodD17fSksYS5pc1N0cmluZyh0aGlzLmNvbXBhcmF0b3IpfHwxPT09dGhpcy5jb21wYXJhdG9yLmxlbmd0aD90aGlzLm1vZGVscz10aGlzLnNvcnRCeSh0aGlzLmNvbXBhcmF0b3IsdGhpcyk6dGhpcy5tb2RlbHMuc29ydChhLmJpbmQodGhpcy5jb21wYXJhdG9yLHRoaXMpKSx0LnNpbGVudHx8dGhpcy50cmlnZ2VyKFwic29ydFwiLHRoaXMsdCksdGhpc30scGx1Y2s6ZnVuY3Rpb24odCl7cmV0dXJuIGEuaW52b2tlKHRoaXMubW9kZWxzLFwiZ2V0XCIsdCl9LGZldGNoOmZ1bmN0aW9uKHQpe3Q9dD9hLmNsb25lKHQpOnt9LHZvaWQgMD09PXQucGFyc2UmJih0LnBhcnNlPSEwKTt2YXIgZT10LnN1Y2Nlc3MsaT10aGlzO3JldHVybiB0LnN1Y2Nlc3M9ZnVuY3Rpb24obil7dmFyIHM9dC5yZXNldD9cInJlc2V0XCI6XCJzZXRcIjtpW3NdKG4sdCksZSYmZShpLG4sdCksaS50cmlnZ2VyKFwic3luY1wiLGksbix0KX0sVSh0aGlzLHQpLHRoaXMuc3luYyhcInJlYWRcIix0aGlzLHQpfSxjcmVhdGU6ZnVuY3Rpb24odCxlKXtpZihlPWU/YS5jbG9uZShlKTp7fSwhKHQ9dGhpcy5fcHJlcGFyZU1vZGVsKHQsZSkpKXJldHVybiExO2Uud2FpdHx8dGhpcy5hZGQodCxlKTt2YXIgaT10aGlzLG49ZS5zdWNjZXNzO3JldHVybiBlLnN1Y2Nlc3M9ZnVuY3Rpb24odCxlLHMpe3Mud2FpdCYmaS5hZGQodCxzKSxuJiZuKHQsZSxzKX0sdC5zYXZlKG51bGwsZSksdH0scGFyc2U6ZnVuY3Rpb24odCl7cmV0dXJuIHR9LGNsb25lOmZ1bmN0aW9uKCl7cmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMubW9kZWxzKX0sX3Jlc2V0OmZ1bmN0aW9uKCl7dGhpcy5sZW5ndGg9MCx0aGlzLm1vZGVscz1bXSx0aGlzLl9ieUlkPXt9fSxfcHJlcGFyZU1vZGVsOmZ1bmN0aW9uKHQsZSl7aWYodCBpbnN0YW5jZW9mIGQpcmV0dXJuIHQuY29sbGVjdGlvbnx8KHQuY29sbGVjdGlvbj10aGlzKSx0O2U9ZT9hLmNsb25lKGUpOnt9LGUuY29sbGVjdGlvbj10aGlzO3ZhciBpPW5ldyB0aGlzLm1vZGVsKHQsZSk7cmV0dXJuIGkudmFsaWRhdGlvbkVycm9yPyh0aGlzLnRyaWdnZXIoXCJpbnZhbGlkXCIsdGhpcyxpLnZhbGlkYXRpb25FcnJvcixlKSwhMSk6aX0sX3JlbW92ZVJlZmVyZW5jZTpmdW5jdGlvbih0KXt0aGlzPT09dC5jb2xsZWN0aW9uJiZkZWxldGUgdC5jb2xsZWN0aW9uLHQub2ZmKFwiYWxsXCIsdGhpcy5fb25Nb2RlbEV2ZW50LHRoaXMpfSxfb25Nb2RlbEV2ZW50OmZ1bmN0aW9uKHQsZSxpLG4peyhcImFkZFwiIT09dCYmXCJyZW1vdmVcIiE9PXR8fGk9PT10aGlzKSYmKFwiZGVzdHJveVwiPT09dCYmdGhpcy5yZW1vdmUoZSxuKSxlJiZ0PT09XCJjaGFuZ2U6XCIrZS5pZEF0dHJpYnV0ZSYmKGRlbGV0ZSB0aGlzLl9ieUlkW2UucHJldmlvdXMoZS5pZEF0dHJpYnV0ZSldLG51bGwhPWUuaWQmJih0aGlzLl9ieUlkW2UuaWRdPWUpKSx0aGlzLnRyaWdnZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpKX19KTt2YXIgbT1bXCJmb3JFYWNoXCIsXCJlYWNoXCIsXCJtYXBcIixcImNvbGxlY3RcIixcInJlZHVjZVwiLFwiZm9sZGxcIixcImluamVjdFwiLFwicmVkdWNlUmlnaHRcIixcImZvbGRyXCIsXCJmaW5kXCIsXCJkZXRlY3RcIixcImZpbHRlclwiLFwic2VsZWN0XCIsXCJyZWplY3RcIixcImV2ZXJ5XCIsXCJhbGxcIixcInNvbWVcIixcImFueVwiLFwiaW5jbHVkZVwiLFwiY29udGFpbnNcIixcImludm9rZVwiLFwibWF4XCIsXCJtaW5cIixcInRvQXJyYXlcIixcInNpemVcIixcImZpcnN0XCIsXCJoZWFkXCIsXCJ0YWtlXCIsXCJpbml0aWFsXCIsXCJyZXN0XCIsXCJ0YWlsXCIsXCJkcm9wXCIsXCJsYXN0XCIsXCJ3aXRob3V0XCIsXCJkaWZmZXJlbmNlXCIsXCJpbmRleE9mXCIsXCJzaHVmZmxlXCIsXCJsYXN0SW5kZXhPZlwiLFwiaXNFbXB0eVwiLFwiY2hhaW5cIl07YS5lYWNoKG0sZnVuY3Rpb24odCl7cC5wcm90b3R5cGVbdF09ZnVuY3Rpb24oKXt2YXIgZT1yLmNhbGwoYXJndW1lbnRzKTtyZXR1cm4gZS51bnNoaWZ0KHRoaXMubW9kZWxzKSxhW3RdLmFwcGx5KGEsZSl9fSk7dmFyIHk9W1wiZ3JvdXBCeVwiLFwiY291bnRCeVwiLFwic29ydEJ5XCJdO2EuZWFjaCh5LGZ1bmN0aW9uKHQpe3AucHJvdG90eXBlW3RdPWZ1bmN0aW9uKGUsaSl7dmFyIG49YS5pc0Z1bmN0aW9uKGUpP2U6ZnVuY3Rpb24odCl7cmV0dXJuIHQuZ2V0KGUpfTtyZXR1cm4gYVt0XSh0aGlzLm1vZGVscyxuLGkpfX0pO3ZhciBfPXQuVmlldz1mdW5jdGlvbih0KXt0aGlzLmNpZD1hLnVuaXF1ZUlkKFwidmlld1wiKSx0fHwodD17fSksYS5leHRlbmQodGhpcyxhLnBpY2sodCx3KSksdGhpcy5fZW5zdXJlRWxlbWVudCgpLHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcy5kZWxlZ2F0ZUV2ZW50cygpfSxiPS9eKFxcUyspXFxzKiguKikkLyx3PVtcIm1vZGVsXCIsXCJjb2xsZWN0aW9uXCIsXCJlbFwiLFwiaWRcIixcImF0dHJpYnV0ZXNcIixcImNsYXNzTmFtZVwiLFwidGFnTmFtZVwiLFwiZXZlbnRzXCJdO2EuZXh0ZW5kKF8ucHJvdG90eXBlLG8se3RhZ05hbWU6XCJkaXZcIiwkOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLiRlbC5maW5kKHQpfSxpbml0aWFsaXplOmZ1bmN0aW9uKCl7fSxyZW5kZXI6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30scmVtb3ZlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJGVsLnJlbW92ZSgpLHRoaXMuc3RvcExpc3RlbmluZygpLHRoaXN9LHNldEVsZW1lbnQ6ZnVuY3Rpb24oZSxpKXtyZXR1cm4gdGhpcy4kZWwmJnRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpLHRoaXMuJGVsPWUgaW5zdGFuY2VvZiB0LiQ/ZTp0LiQoZSksdGhpcy5lbD10aGlzLiRlbFswXSxpIT09ITEmJnRoaXMuZGVsZWdhdGVFdmVudHMoKSx0aGlzfSxkZWxlZ2F0ZUV2ZW50czpmdW5jdGlvbih0KXtpZighdCYmISh0PWEucmVzdWx0KHRoaXMsXCJldmVudHNcIikpKXJldHVybiB0aGlzO3RoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO2Zvcih2YXIgZSBpbiB0KXt2YXIgaT10W2VdO2lmKGEuaXNGdW5jdGlvbihpKXx8KGk9dGhpc1t0W2VdXSksaSl7dmFyIG49ZS5tYXRjaChiKSxzPW5bMV0scj1uWzJdO2k9YS5iaW5kKGksdGhpcykscys9XCIuZGVsZWdhdGVFdmVudHNcIit0aGlzLmNpZCxcIlwiPT09cj90aGlzLiRlbC5vbihzLGkpOnRoaXMuJGVsLm9uKHMscixpKX19cmV0dXJuIHRoaXN9LHVuZGVsZWdhdGVFdmVudHM6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kZWwub2ZmKFwiLmRlbGVnYXRlRXZlbnRzXCIrdGhpcy5jaWQpLHRoaXN9LF9lbnN1cmVFbGVtZW50OmZ1bmN0aW9uKCl7aWYodGhpcy5lbCl0aGlzLnNldEVsZW1lbnQoYS5yZXN1bHQodGhpcyxcImVsXCIpLCExKTtlbHNle3ZhciBlPWEuZXh0ZW5kKHt9LGEucmVzdWx0KHRoaXMsXCJhdHRyaWJ1dGVzXCIpKTt0aGlzLmlkJiYoZS5pZD1hLnJlc3VsdCh0aGlzLFwiaWRcIikpLHRoaXMuY2xhc3NOYW1lJiYoZVtcImNsYXNzXCJdPWEucmVzdWx0KHRoaXMsXCJjbGFzc05hbWVcIikpO3ZhciBpPXQuJChcIjxcIithLnJlc3VsdCh0aGlzLFwidGFnTmFtZVwiKStcIj5cIikuYXR0cihlKTt0aGlzLnNldEVsZW1lbnQoaSwhMSl9fX0pLHQuc3luYz1mdW5jdGlvbihlLGksbil7dmFyIHM9RVtlXTthLmRlZmF1bHRzKG58fChuPXt9KSx7ZW11bGF0ZUhUVFA6dC5lbXVsYXRlSFRUUCxlbXVsYXRlSlNPTjp0LmVtdWxhdGVKU09OfSk7dmFyIHI9e3R5cGU6cyxkYXRhVHlwZTpcImpzb25cIn07aWYobi51cmx8fChyLnVybD1hLnJlc3VsdChpLFwidXJsXCIpfHxSKCkpLG51bGwhPW4uZGF0YXx8IWl8fFwiY3JlYXRlXCIhPT1lJiZcInVwZGF0ZVwiIT09ZSYmXCJwYXRjaFwiIT09ZXx8KHIuY29udGVudFR5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCIsci5kYXRhPUpTT04uc3RyaW5naWZ5KG4uYXR0cnN8fGkudG9KU09OKG4pKSksbi5lbXVsYXRlSlNPTiYmKHIuY29udGVudFR5cGU9XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixyLmRhdGE9ci5kYXRhP3ttb2RlbDpyLmRhdGF9Ont9KSxuLmVtdWxhdGVIVFRQJiYoXCJQVVRcIj09PXN8fFwiREVMRVRFXCI9PT1zfHxcIlBBVENIXCI9PT1zKSl7ci50eXBlPVwiUE9TVFwiLG4uZW11bGF0ZUpTT04mJihyLmRhdGEuX21ldGhvZD1zKTt2YXIgbz1uLmJlZm9yZVNlbmQ7bi5iZWZvcmVTZW5kPWZ1bmN0aW9uKHQpe3JldHVybiB0LnNldFJlcXVlc3RIZWFkZXIoXCJYLUhUVFAtTWV0aG9kLU92ZXJyaWRlXCIscyksbz9vLmFwcGx5KHRoaXMsYXJndW1lbnRzKTp2b2lkIDB9fVwiR0VUXCI9PT1yLnR5cGV8fG4uZW11bGF0ZUpTT058fChyLnByb2Nlc3NEYXRhPSExKSxcIlBBVENIXCI9PT1yLnR5cGUmJngmJihyLnhocj1mdW5jdGlvbigpe3JldHVybiBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpfSk7dmFyIGg9bi54aHI9dC5hamF4KGEuZXh0ZW5kKHIsbikpO3JldHVybiBpLnRyaWdnZXIoXCJyZXF1ZXN0XCIsaSxoLG4pLGh9O3ZhciB4PSEoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvd3x8IXdpbmRvdy5BY3RpdmVYT2JqZWN0fHx3aW5kb3cuWE1MSHR0cFJlcXVlc3QmJihuZXcgWE1MSHR0cFJlcXVlc3QpLmRpc3BhdGNoRXZlbnQpLEU9e2NyZWF0ZTpcIlBPU1RcIix1cGRhdGU6XCJQVVRcIixwYXRjaDpcIlBBVENIXCIsXCJkZWxldGVcIjpcIkRFTEVURVwiLHJlYWQ6XCJHRVRcIn07dC5hamF4PWZ1bmN0aW9uKCl7cmV0dXJuIHQuJC5hamF4LmFwcGx5KHQuJCxhcmd1bWVudHMpfTt2YXIgaz10LlJvdXRlcj1mdW5jdGlvbih0KXt0fHwodD17fSksdC5yb3V0ZXMmJih0aGlzLnJvdXRlcz10LnJvdXRlcyksdGhpcy5fYmluZFJvdXRlcygpLHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LFQ9L1xcKCguKj8pXFwpL2csUz0vKFxcKFxcPyk/OlxcdysvZywkPS9cXCpcXHcrL2csSD0vW1xcLXt9XFxbXFxdKz8uLFxcXFxcXF4kfCNcXHNdL2c7YS5leHRlbmQoay5wcm90b3R5cGUsbyx7aW5pdGlhbGl6ZTpmdW5jdGlvbigpe30scm91dGU6ZnVuY3Rpb24oZSxpLG4pe2EuaXNSZWdFeHAoZSl8fChlPXRoaXMuX3JvdXRlVG9SZWdFeHAoZSkpLGEuaXNGdW5jdGlvbihpKSYmKG49aSxpPVwiXCIpLG58fChuPXRoaXNbaV0pO3ZhciBzPXRoaXM7cmV0dXJuIHQuaGlzdG9yeS5yb3V0ZShlLGZ1bmN0aW9uKHIpe3ZhciBhPXMuX2V4dHJhY3RQYXJhbWV0ZXJzKGUscik7biYmbi5hcHBseShzLGEpLHMudHJpZ2dlci5hcHBseShzLFtcInJvdXRlOlwiK2ldLmNvbmNhdChhKSkscy50cmlnZ2VyKFwicm91dGVcIixpLGEpLHQuaGlzdG9yeS50cmlnZ2VyKFwicm91dGVcIixzLGksYSl9KSx0aGlzfSxuYXZpZ2F0ZTpmdW5jdGlvbihlLGkpe3JldHVybiB0Lmhpc3RvcnkubmF2aWdhdGUoZSxpKSx0aGlzfSxfYmluZFJvdXRlczpmdW5jdGlvbigpe2lmKHRoaXMucm91dGVzKXt0aGlzLnJvdXRlcz1hLnJlc3VsdCh0aGlzLFwicm91dGVzXCIpO2Zvcih2YXIgdCxlPWEua2V5cyh0aGlzLnJvdXRlcyk7bnVsbCE9KHQ9ZS5wb3AoKSk7KXRoaXMucm91dGUodCx0aGlzLnJvdXRlc1t0XSl9fSxfcm91dGVUb1JlZ0V4cDpmdW5jdGlvbih0KXtyZXR1cm4gdD10LnJlcGxhY2UoSCxcIlxcXFwkJlwiKS5yZXBsYWNlKFQsXCIoPzokMSk/XCIpLnJlcGxhY2UoUyxmdW5jdGlvbih0LGUpe3JldHVybiBlP3Q6XCIoW14vXSspXCJ9KS5yZXBsYWNlKCQsXCIoLio/KVwiKSxuZXcgUmVnRXhwKFwiXlwiK3QrXCIkXCIpfSxfZXh0cmFjdFBhcmFtZXRlcnM6ZnVuY3Rpb24odCxlKXt2YXIgaT10LmV4ZWMoZSkuc2xpY2UoMSk7cmV0dXJuIGEubWFwKGksZnVuY3Rpb24odCl7cmV0dXJuIHQ/ZGVjb2RlVVJJQ29tcG9uZW50KHQpOm51bGx9KX19KTt2YXIgQT10Lkhpc3Rvcnk9ZnVuY3Rpb24oKXt0aGlzLmhhbmRsZXJzPVtdLGEuYmluZEFsbCh0aGlzLFwiY2hlY2tVcmxcIiksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmKHRoaXMubG9jYXRpb249d2luZG93LmxvY2F0aW9uLHRoaXMuaGlzdG9yeT13aW5kb3cuaGlzdG9yeSl9LEk9L15bI1xcL118XFxzKyQvZyxOPS9eXFwvK3xcXC8rJC9nLE89L21zaWUgW1xcdy5dKy8sUD0vXFwvJC8sQz0vWz8jXS4qJC87QS5zdGFydGVkPSExLGEuZXh0ZW5kKEEucHJvdG90eXBlLG8se2ludGVydmFsOjUwLGdldEhhc2g6ZnVuY3Rpb24odCl7dmFyIGU9KHR8fHRoaXMpLmxvY2F0aW9uLmhyZWYubWF0Y2goLyMoLiopJC8pO3JldHVybiBlP2VbMV06XCJcIn0sZ2V0RnJhZ21lbnQ6ZnVuY3Rpb24odCxlKXtpZihudWxsPT10KWlmKHRoaXMuX2hhc1B1c2hTdGF0ZXx8IXRoaXMuX3dhbnRzSGFzaENoYW5nZXx8ZSl7dD10aGlzLmxvY2F0aW9uLnBhdGhuYW1lO3ZhciBpPXRoaXMucm9vdC5yZXBsYWNlKFAsXCJcIik7dC5pbmRleE9mKGkpfHwodD10LnNsaWNlKGkubGVuZ3RoKSl9ZWxzZSB0PXRoaXMuZ2V0SGFzaCgpO3JldHVybiB0LnJlcGxhY2UoSSxcIlwiKX0sc3RhcnQ6ZnVuY3Rpb24oZSl7aWYoQS5zdGFydGVkKXRocm93IG5ldyBFcnJvcihcIkJhY2tib25lLmhpc3RvcnkgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkXCIpO0Euc3RhcnRlZD0hMCx0aGlzLm9wdGlvbnM9YS5leHRlbmQoe3Jvb3Q6XCIvXCJ9LHRoaXMub3B0aW9ucyxlKSx0aGlzLnJvb3Q9dGhpcy5vcHRpb25zLnJvb3QsdGhpcy5fd2FudHNIYXNoQ2hhbmdlPXRoaXMub3B0aW9ucy5oYXNoQ2hhbmdlIT09ITEsdGhpcy5fd2FudHNQdXNoU3RhdGU9ISF0aGlzLm9wdGlvbnMucHVzaFN0YXRlLHRoaXMuX2hhc1B1c2hTdGF0ZT0hISh0aGlzLm9wdGlvbnMucHVzaFN0YXRlJiZ0aGlzLmhpc3RvcnkmJnRoaXMuaGlzdG9yeS5wdXNoU3RhdGUpO3ZhciBpPXRoaXMuZ2V0RnJhZ21lbnQoKSxuPWRvY3VtZW50LmRvY3VtZW50TW9kZSxzPU8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpJiYoIW58fDc+PW4pO3RoaXMucm9vdD0oXCIvXCIrdGhpcy5yb290K1wiL1wiKS5yZXBsYWNlKE4sXCIvXCIpLHMmJnRoaXMuX3dhbnRzSGFzaENoYW5nZSYmKHRoaXMuaWZyYW1lPXQuJCgnPGlmcmFtZSBzcmM9XCJqYXZhc2NyaXB0OjBcIiB0YWJpbmRleD1cIi0xXCIgLz4nKS5oaWRlKCkuYXBwZW5kVG8oXCJib2R5XCIpWzBdLmNvbnRlbnRXaW5kb3csdGhpcy5uYXZpZ2F0ZShpKSksdGhpcy5faGFzUHVzaFN0YXRlP3QuJCh3aW5kb3cpLm9uKFwicG9wc3RhdGVcIix0aGlzLmNoZWNrVXJsKTp0aGlzLl93YW50c0hhc2hDaGFuZ2UmJlwib25oYXNoY2hhbmdlXCJpbiB3aW5kb3cmJiFzP3QuJCh3aW5kb3cpLm9uKFwiaGFzaGNoYW5nZVwiLHRoaXMuY2hlY2tVcmwpOnRoaXMuX3dhbnRzSGFzaENoYW5nZSYmKHRoaXMuX2NoZWNrVXJsSW50ZXJ2YWw9c2V0SW50ZXJ2YWwodGhpcy5jaGVja1VybCx0aGlzLmludGVydmFsKSksdGhpcy5mcmFnbWVudD1pO3ZhciByPXRoaXMubG9jYXRpb24sbz1yLnBhdGhuYW1lLnJlcGxhY2UoL1teXFwvXSQvLFwiJCYvXCIpPT09dGhpcy5yb290O2lmKHRoaXMuX3dhbnRzSGFzaENoYW5nZSYmdGhpcy5fd2FudHNQdXNoU3RhdGUpe2lmKCF0aGlzLl9oYXNQdXNoU3RhdGUmJiFvKXJldHVybiB0aGlzLmZyYWdtZW50PXRoaXMuZ2V0RnJhZ21lbnQobnVsbCwhMCksdGhpcy5sb2NhdGlvbi5yZXBsYWNlKHRoaXMucm9vdCt0aGlzLmxvY2F0aW9uLnNlYXJjaCtcIiNcIit0aGlzLmZyYWdtZW50KSwhMDt0aGlzLl9oYXNQdXNoU3RhdGUmJm8mJnIuaGFzaCYmKHRoaXMuZnJhZ21lbnQ9dGhpcy5nZXRIYXNoKCkucmVwbGFjZShJLFwiXCIpLHRoaXMuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe30sZG9jdW1lbnQudGl0bGUsdGhpcy5yb290K3RoaXMuZnJhZ21lbnQrci5zZWFyY2gpKX1yZXR1cm4gdGhpcy5vcHRpb25zLnNpbGVudD92b2lkIDA6dGhpcy5sb2FkVXJsKCl9LHN0b3A6ZnVuY3Rpb24oKXt0LiQod2luZG93KS5vZmYoXCJwb3BzdGF0ZVwiLHRoaXMuY2hlY2tVcmwpLm9mZihcImhhc2hjaGFuZ2VcIix0aGlzLmNoZWNrVXJsKSxjbGVhckludGVydmFsKHRoaXMuX2NoZWNrVXJsSW50ZXJ2YWwpLEEuc3RhcnRlZD0hMX0scm91dGU6ZnVuY3Rpb24odCxlKXt0aGlzLmhhbmRsZXJzLnVuc2hpZnQoe3JvdXRlOnQsY2FsbGJhY2s6ZX0pfSxjaGVja1VybDpmdW5jdGlvbigpe3ZhciB0PXRoaXMuZ2V0RnJhZ21lbnQoKTtyZXR1cm4gdD09PXRoaXMuZnJhZ21lbnQmJnRoaXMuaWZyYW1lJiYodD10aGlzLmdldEZyYWdtZW50KHRoaXMuZ2V0SGFzaCh0aGlzLmlmcmFtZSkpKSx0PT09dGhpcy5mcmFnbWVudD8hMToodGhpcy5pZnJhbWUmJnRoaXMubmF2aWdhdGUodCksdm9pZCB0aGlzLmxvYWRVcmwoKSl9LGxvYWRVcmw6ZnVuY3Rpb24odCl7cmV0dXJuIHQ9dGhpcy5mcmFnbWVudD10aGlzLmdldEZyYWdtZW50KHQpLGEuYW55KHRoaXMuaGFuZGxlcnMsZnVuY3Rpb24oZSl7cmV0dXJuIGUucm91dGUudGVzdCh0KT8oZS5jYWxsYmFjayh0KSwhMCk6dm9pZCAwfSl9LG5hdmlnYXRlOmZ1bmN0aW9uKHQsZSl7aWYoIUEuc3RhcnRlZClyZXR1cm4hMTtlJiZlIT09ITB8fChlPXt0cmlnZ2VyOiEhZX0pO3ZhciBpPXRoaXMucm9vdCsodD10aGlzLmdldEZyYWdtZW50KHR8fFwiXCIpKTtpZih0PXQucmVwbGFjZShDLFwiXCIpLHRoaXMuZnJhZ21lbnQhPT10KXtpZih0aGlzLmZyYWdtZW50PXQsXCJcIj09PXQmJlwiL1wiIT09aSYmKGk9aS5zbGljZSgwLC0xKSksdGhpcy5faGFzUHVzaFN0YXRlKXRoaXMuaGlzdG9yeVtlLnJlcGxhY2U/XCJyZXBsYWNlU3RhdGVcIjpcInB1c2hTdGF0ZVwiXSh7fSxkb2N1bWVudC50aXRsZSxpKTtlbHNle2lmKCF0aGlzLl93YW50c0hhc2hDaGFuZ2UpcmV0dXJuIHRoaXMubG9jYXRpb24uYXNzaWduKGkpO3RoaXMuX3VwZGF0ZUhhc2godGhpcy5sb2NhdGlvbix0LGUucmVwbGFjZSksdGhpcy5pZnJhbWUmJnQhPT10aGlzLmdldEZyYWdtZW50KHRoaXMuZ2V0SGFzaCh0aGlzLmlmcmFtZSkpJiYoZS5yZXBsYWNlfHx0aGlzLmlmcmFtZS5kb2N1bWVudC5vcGVuKCkuY2xvc2UoKSx0aGlzLl91cGRhdGVIYXNoKHRoaXMuaWZyYW1lLmxvY2F0aW9uLHQsZS5yZXBsYWNlKSl9cmV0dXJuIGUudHJpZ2dlcj90aGlzLmxvYWRVcmwodCk6dm9pZCAwfX0sX3VwZGF0ZUhhc2g6ZnVuY3Rpb24odCxlLGkpe2lmKGkpe3ZhciBuPXQuaHJlZi5yZXBsYWNlKC8oamF2YXNjcmlwdDp8IykuKiQvLFwiXCIpO3QucmVwbGFjZShuK1wiI1wiK2UpfWVsc2UgdC5oYXNoPVwiI1wiK2V9fSksdC5oaXN0b3J5PW5ldyBBO3ZhciBqPWZ1bmN0aW9uKHQsZSl7dmFyIGksbj10aGlzO2k9dCYmYS5oYXModCxcImNvbnN0cnVjdG9yXCIpP3QuY29uc3RydWN0b3I6ZnVuY3Rpb24oKXtyZXR1cm4gbi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LGEuZXh0ZW5kKGksbixlKTt2YXIgcz1mdW5jdGlvbigpe3RoaXMuY29uc3RydWN0b3I9aX07cmV0dXJuIHMucHJvdG90eXBlPW4ucHJvdG90eXBlLGkucHJvdG90eXBlPW5ldyBzLHQmJmEuZXh0ZW5kKGkucHJvdG90eXBlLHQpLGkuX19zdXBlcl9fPW4ucHJvdG90eXBlLGl9O2QuZXh0ZW5kPXAuZXh0ZW5kPWsuZXh0ZW5kPV8uZXh0ZW5kPUEuZXh0ZW5kPWo7dmFyIFI9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoJ0EgXCJ1cmxcIiBwcm9wZXJ0eSBvciBmdW5jdGlvbiBtdXN0IGJlIHNwZWNpZmllZCcpfSxVPWZ1bmN0aW9uKHQsZSl7dmFyIGk9ZS5lcnJvcjtlLmVycm9yPWZ1bmN0aW9uKG4pe2kmJmkodCxuLGUpLHQudHJpZ2dlcihcImVycm9yXCIsdCxuLGUpfX19LmNhbGwodGhpcyksbihcInVuZGVmaW5lZFwiIT10eXBlb2YgQmFja2JvbmU/QmFja2JvbmU6d2luZG93LkJhY2tib25lKX0pLmNhbGwoZ2xvYmFsLHZvaWQgMCx2b2lkIDAsdm9pZCAwLGZ1bmN0aW9uKHQpe21vZHVsZS5leHBvcnRzPXR9KTt9KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXsoZnVuY3Rpb24oZSx0LG4scil7IWZ1bmN0aW9uKHQscil7ZnVuY3Rpb24gaShlKXt2YXIgdD1lLmxlbmd0aCxuPXB0LnR5cGUoZSk7cmV0dXJuIHB0LmlzV2luZG93KGUpPyExOjE9PT1lLm5vZGVUeXBlJiZ0PyEwOlwiYXJyYXlcIj09PW58fFwiZnVuY3Rpb25cIiE9PW4mJigwPT09dHx8XCJudW1iZXJcIj09dHlwZW9mIHQmJnQ+MCYmdC0xIGluIGUpfWZ1bmN0aW9uIG8oZSl7dmFyIHQ9U3RbZV09e307cmV0dXJuIHB0LmVhY2goZS5tYXRjaChodCl8fFtdLGZ1bmN0aW9uKGUsbil7dFtuXT0hMH0pLHR9ZnVuY3Rpb24gYShlLHQsbixpKXtpZihwdC5hY2NlcHREYXRhKGUpKXt2YXIgbyxhLHM9cHQuZXhwYW5kbyx1PWUubm9kZVR5cGUsbD11P3B0LmNhY2hlOmUsYz11P2Vbc106ZVtzXSYmcztpZihjJiZsW2NdJiYoaXx8bFtjXS5kYXRhKXx8biE9PXJ8fFwic3RyaW5nXCIhPXR5cGVvZiB0KXJldHVybiBjfHwoYz11P2Vbc109cnQucG9wKCl8fHB0Lmd1aWQrKzpzKSxsW2NdfHwobFtjXT11P3t9Ont0b0pTT046cHQubm9vcH0pLChcIm9iamVjdFwiPT10eXBlb2YgdHx8XCJmdW5jdGlvblwiPT10eXBlb2YgdCkmJihpP2xbY109cHQuZXh0ZW5kKGxbY10sdCk6bFtjXS5kYXRhPXB0LmV4dGVuZChsW2NdLmRhdGEsdCkpLGE9bFtjXSxpfHwoYS5kYXRhfHwoYS5kYXRhPXt9KSxhPWEuZGF0YSksbiE9PXImJihhW3B0LmNhbWVsQ2FzZSh0KV09biksXCJzdHJpbmdcIj09dHlwZW9mIHQ/KG89YVt0XSxudWxsPT1vJiYobz1hW3B0LmNhbWVsQ2FzZSh0KV0pKTpvPWEsb319ZnVuY3Rpb24gcyhlLHQsbil7aWYocHQuYWNjZXB0RGF0YShlKSl7dmFyIHIsaSxvPWUubm9kZVR5cGUsYT1vP3B0LmNhY2hlOmUscz1vP2VbcHQuZXhwYW5kb106cHQuZXhwYW5kbztpZihhW3NdKXtpZih0JiYocj1uP2Fbc106YVtzXS5kYXRhKSl7cHQuaXNBcnJheSh0KT90PXQuY29uY2F0KHB0Lm1hcCh0LHB0LmNhbWVsQ2FzZSkpOnQgaW4gcj90PVt0XToodD1wdC5jYW1lbENhc2UodCksdD10IGluIHI/W3RdOnQuc3BsaXQoXCIgXCIpKSxpPXQubGVuZ3RoO2Zvcig7aS0tOylkZWxldGUgclt0W2ldXTtpZihuPyFsKHIpOiFwdC5pc0VtcHR5T2JqZWN0KHIpKXJldHVybn0obnx8KGRlbGV0ZSBhW3NdLmRhdGEsbChhW3NdKSkpJiYobz9wdC5jbGVhbkRhdGEoW2VdLCEwKTpwdC5zdXBwb3J0LmRlbGV0ZUV4cGFuZG98fGEhPWEud2luZG93P2RlbGV0ZSBhW3NdOmFbc109bnVsbCl9fX1mdW5jdGlvbiB1KGUsdCxuKXtpZihuPT09ciYmMT09PWUubm9kZVR5cGUpe3ZhciBpPVwiZGF0YS1cIit0LnJlcGxhY2UoanQsXCItJDFcIikudG9Mb3dlckNhc2UoKTtpZihuPWUuZ2V0QXR0cmlidXRlKGkpLFwic3RyaW5nXCI9PXR5cGVvZiBuKXt0cnl7bj1cInRydWVcIj09PW4/ITA6XCJmYWxzZVwiPT09bj8hMTpcIm51bGxcIj09PW4/bnVsbDorbitcIlwiPT09bj8rbjpBdC50ZXN0KG4pP3B0LnBhcnNlSlNPTihuKTpufWNhdGNoKG8pe31wdC5kYXRhKGUsdCxuKX1lbHNlIG49cn1yZXR1cm4gbn1mdW5jdGlvbiBsKGUpe3ZhciB0O2Zvcih0IGluIGUpaWYoKFwiZGF0YVwiIT09dHx8IXB0LmlzRW1wdHlPYmplY3QoZVt0XSkpJiZcInRvSlNPTlwiIT09dClyZXR1cm4hMTtyZXR1cm4hMH1mdW5jdGlvbiBjKCl7cmV0dXJuITB9ZnVuY3Rpb24gZigpe3JldHVybiExfWZ1bmN0aW9uIHAoKXt0cnl7cmV0dXJuIEsuYWN0aXZlRWxlbWVudH1jYXRjaChlKXt9fWZ1bmN0aW9uIGQoZSx0KXtkbyBlPWVbdF07d2hpbGUoZSYmMSE9PWUubm9kZVR5cGUpO3JldHVybiBlfWZ1bmN0aW9uIGgoZSx0LG4pe2lmKHB0LmlzRnVuY3Rpb24odCkpcmV0dXJuIHB0LmdyZXAoZSxmdW5jdGlvbihlLHIpe3JldHVybiEhdC5jYWxsKGUscixlKSE9PW59KTtpZih0Lm5vZGVUeXBlKXJldHVybiBwdC5ncmVwKGUsZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT10IT09bn0pO2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0KXtpZih6dC50ZXN0KHQpKXJldHVybiBwdC5maWx0ZXIodCxlLG4pO3Q9cHQuZmlsdGVyKHQsZSl9cmV0dXJuIHB0LmdyZXAoZSxmdW5jdGlvbihlKXtyZXR1cm4gcHQuaW5BcnJheShlLHQpPj0wIT09bn0pfWZ1bmN0aW9uIGcoZSl7dmFyIHQ9WXQuc3BsaXQoXCJ8XCIpLG49ZS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7aWYobi5jcmVhdGVFbGVtZW50KWZvcig7dC5sZW5ndGg7KW4uY3JlYXRlRWxlbWVudCh0LnBvcCgpKTtyZXR1cm4gbn1mdW5jdGlvbiBtKGUsdCl7cmV0dXJuIHB0Lm5vZGVOYW1lKGUsXCJ0YWJsZVwiKSYmcHQubm9kZU5hbWUoMT09PXQubm9kZVR5cGU/dDp0LmZpcnN0Q2hpbGQsXCJ0clwiKT9lLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIilbMF18fGUuYXBwZW5kQ2hpbGQoZS5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiKSk6ZX1mdW5jdGlvbiB5KGUpe3JldHVybiBlLnR5cGU9KG51bGwhPT1wdC5maW5kLmF0dHIoZSxcInR5cGVcIikpK1wiL1wiK2UudHlwZSxlfWZ1bmN0aW9uIHYoZSl7dmFyIHQ9c24uZXhlYyhlLnR5cGUpO3JldHVybiB0P2UudHlwZT10WzFdOmUucmVtb3ZlQXR0cmlidXRlKFwidHlwZVwiKSxlfWZ1bmN0aW9uIGIoZSx0KXtmb3IodmFyIG4scj0wO251bGwhPShuPWVbcl0pO3IrKylwdC5fZGF0YShuLFwiZ2xvYmFsRXZhbFwiLCF0fHxwdC5fZGF0YSh0W3JdLFwiZ2xvYmFsRXZhbFwiKSl9ZnVuY3Rpb24geChlLHQpe2lmKDE9PT10Lm5vZGVUeXBlJiZwdC5oYXNEYXRhKGUpKXt2YXIgbixyLGksbz1wdC5fZGF0YShlKSxhPXB0Ll9kYXRhKHQsbykscz1vLmV2ZW50cztpZihzKXtkZWxldGUgYS5oYW5kbGUsYS5ldmVudHM9e307Zm9yKG4gaW4gcylmb3Iocj0wLGk9c1tuXS5sZW5ndGg7aT5yO3IrKylwdC5ldmVudC5hZGQodCxuLHNbbl1bcl0pfWEuZGF0YSYmKGEuZGF0YT1wdC5leHRlbmQoe30sYS5kYXRhKSl9fWZ1bmN0aW9uIFQoZSx0KXt2YXIgbixyLGk7aWYoMT09PXQubm9kZVR5cGUpe2lmKG49dC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLCFwdC5zdXBwb3J0Lm5vQ2xvbmVFdmVudCYmdFtwdC5leHBhbmRvXSl7aT1wdC5fZGF0YSh0KTtmb3IociBpbiBpLmV2ZW50cylwdC5yZW1vdmVFdmVudCh0LHIsaS5oYW5kbGUpO3QucmVtb3ZlQXR0cmlidXRlKHB0LmV4cGFuZG8pfVwic2NyaXB0XCI9PT1uJiZ0LnRleHQhPT1lLnRleHQ/KHkodCkudGV4dD1lLnRleHQsdih0KSk6XCJvYmplY3RcIj09PW4/KHQucGFyZW50Tm9kZSYmKHQub3V0ZXJIVE1MPWUub3V0ZXJIVE1MKSxwdC5zdXBwb3J0Lmh0bWw1Q2xvbmUmJmUuaW5uZXJIVE1MJiYhcHQudHJpbSh0LmlubmVySFRNTCkmJih0LmlubmVySFRNTD1lLmlubmVySFRNTCkpOlwiaW5wdXRcIj09PW4mJnJuLnRlc3QoZS50eXBlKT8odC5kZWZhdWx0Q2hlY2tlZD10LmNoZWNrZWQ9ZS5jaGVja2VkLHQudmFsdWUhPT1lLnZhbHVlJiYodC52YWx1ZT1lLnZhbHVlKSk6XCJvcHRpb25cIj09PW4/dC5kZWZhdWx0U2VsZWN0ZWQ9dC5zZWxlY3RlZD1lLmRlZmF1bHRTZWxlY3RlZDooXCJpbnB1dFwiPT09bnx8XCJ0ZXh0YXJlYVwiPT09bikmJih0LmRlZmF1bHRWYWx1ZT1lLmRlZmF1bHRWYWx1ZSl9fWZ1bmN0aW9uIHcoZSx0KXt2YXIgbixpLG89MCxhPXR5cGVvZiBlLmdldEVsZW1lbnRzQnlUYWdOYW1lIT09Rz9lLmdldEVsZW1lbnRzQnlUYWdOYW1lKHR8fFwiKlwiKTp0eXBlb2YgZS5xdWVyeVNlbGVjdG9yQWxsIT09Rz9lLnF1ZXJ5U2VsZWN0b3JBbGwodHx8XCIqXCIpOnI7aWYoIWEpZm9yKGE9W10sbj1lLmNoaWxkTm9kZXN8fGU7bnVsbCE9KGk9bltvXSk7bysrKSF0fHxwdC5ub2RlTmFtZShpLHQpP2EucHVzaChpKTpwdC5tZXJnZShhLHcoaSx0KSk7cmV0dXJuIHQ9PT1yfHx0JiZwdC5ub2RlTmFtZShlLHQpP3B0Lm1lcmdlKFtlXSxhKTphfWZ1bmN0aW9uIEMoZSl7cm4udGVzdChlLnR5cGUpJiYoZS5kZWZhdWx0Q2hlY2tlZD1lLmNoZWNrZWQpfWZ1bmN0aW9uIE4oZSx0KXtpZih0IGluIGUpcmV0dXJuIHQ7Zm9yKHZhciBuPXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrdC5zbGljZSgxKSxyPXQsaT1Tbi5sZW5ndGg7aS0tOylpZih0PVNuW2ldK24sdCBpbiBlKXJldHVybiB0O3JldHVybiByfWZ1bmN0aW9uIGsoZSx0KXtyZXR1cm4gZT10fHxlLFwibm9uZVwiPT09cHQuY3NzKGUsXCJkaXNwbGF5XCIpfHwhcHQuY29udGFpbnMoZS5vd25lckRvY3VtZW50LGUpfWZ1bmN0aW9uIEUoZSx0KXtmb3IodmFyIG4scixpLG89W10sYT0wLHM9ZS5sZW5ndGg7cz5hO2ErKylyPWVbYV0sci5zdHlsZSYmKG9bYV09cHQuX2RhdGEocixcIm9sZGRpc3BsYXlcIiksbj1yLnN0eWxlLmRpc3BsYXksdD8ob1thXXx8XCJub25lXCIhPT1ufHwoci5zdHlsZS5kaXNwbGF5PVwiXCIpLFwiXCI9PT1yLnN0eWxlLmRpc3BsYXkmJmsocikmJihvW2FdPXB0Ll9kYXRhKHIsXCJvbGRkaXNwbGF5XCIsRChyLm5vZGVOYW1lKSkpKTpvW2FdfHwoaT1rKHIpLChuJiZcIm5vbmVcIiE9PW58fCFpKSYmcHQuX2RhdGEocixcIm9sZGRpc3BsYXlcIixpP246cHQuY3NzKHIsXCJkaXNwbGF5XCIpKSkpO2ZvcihhPTA7cz5hO2ErKylyPWVbYV0sci5zdHlsZSYmKHQmJlwibm9uZVwiIT09ci5zdHlsZS5kaXNwbGF5JiZcIlwiIT09ci5zdHlsZS5kaXNwbGF5fHwoci5zdHlsZS5kaXNwbGF5PXQ/b1thXXx8XCJcIjpcIm5vbmVcIikpO3JldHVybiBlfWZ1bmN0aW9uIFMoZSx0LG4pe3ZhciByPXhuLmV4ZWModCk7cmV0dXJuIHI/TWF0aC5tYXgoMCxyWzFdLShufHwwKSkrKHJbMl18fFwicHhcIik6dH1mdW5jdGlvbiBBKGUsdCxuLHIsaSl7Zm9yKHZhciBvPW49PT0ocj9cImJvcmRlclwiOlwiY29udGVudFwiKT80Olwid2lkdGhcIj09PXQ/MTowLGE9MDs0Pm87bys9MilcIm1hcmdpblwiPT09biYmKGErPXB0LmNzcyhlLG4rRW5bb10sITAsaSkpLHI/KFwiY29udGVudFwiPT09biYmKGEtPXB0LmNzcyhlLFwicGFkZGluZ1wiK0VuW29dLCEwLGkpKSxcIm1hcmdpblwiIT09biYmKGEtPXB0LmNzcyhlLFwiYm9yZGVyXCIrRW5bb10rXCJXaWR0aFwiLCEwLGkpKSk6KGErPXB0LmNzcyhlLFwicGFkZGluZ1wiK0VuW29dLCEwLGkpLFwicGFkZGluZ1wiIT09biYmKGErPXB0LmNzcyhlLFwiYm9yZGVyXCIrRW5bb10rXCJXaWR0aFwiLCEwLGkpKSk7cmV0dXJuIGF9ZnVuY3Rpb24gaihlLHQsbil7dmFyIHI9ITAsaT1cIndpZHRoXCI9PT10P2Uub2Zmc2V0V2lkdGg6ZS5vZmZzZXRIZWlnaHQsbz1kbihlKSxhPXB0LnN1cHBvcnQuYm94U2l6aW5nJiZcImJvcmRlci1ib3hcIj09PXB0LmNzcyhlLFwiYm94U2l6aW5nXCIsITEsbyk7aWYoMD49aXx8bnVsbD09aSl7aWYoaT1obihlLHQsbyksKDA+aXx8bnVsbD09aSkmJihpPWUuc3R5bGVbdF0pLFRuLnRlc3QoaSkpcmV0dXJuIGk7cj1hJiYocHQuc3VwcG9ydC5ib3hTaXppbmdSZWxpYWJsZXx8aT09PWUuc3R5bGVbdF0pLGk9cGFyc2VGbG9hdChpKXx8MH1yZXR1cm4gaStBKGUsdCxufHwoYT9cImJvcmRlclwiOlwiY29udGVudFwiKSxyLG8pK1wicHhcIn1mdW5jdGlvbiBEKGUpe3ZhciB0PUssbj1DbltlXTtyZXR1cm4gbnx8KG49TChlLHQpLFwibm9uZVwiIT09biYmbnx8KHBuPShwbnx8cHQoXCI8aWZyYW1lIGZyYW1lYm9yZGVyPScwJyB3aWR0aD0nMCcgaGVpZ2h0PScwJy8+XCIpLmNzcyhcImNzc1RleHRcIixcImRpc3BsYXk6YmxvY2sgIWltcG9ydGFudFwiKSkuYXBwZW5kVG8odC5kb2N1bWVudEVsZW1lbnQpLHQ9KHBuWzBdLmNvbnRlbnRXaW5kb3d8fHBuWzBdLmNvbnRlbnREb2N1bWVudCkuZG9jdW1lbnQsdC53cml0ZShcIjwhZG9jdHlwZSBodG1sPjxodG1sPjxib2R5PlwiKSx0LmNsb3NlKCksbj1MKGUsdCkscG4uZGV0YWNoKCkpLENuW2VdPW4pLG59ZnVuY3Rpb24gTChlLHQpe3ZhciBuPXB0KHQuY3JlYXRlRWxlbWVudChlKSkuYXBwZW5kVG8odC5ib2R5KSxyPXB0LmNzcyhuWzBdLFwiZGlzcGxheVwiKTtyZXR1cm4gbi5yZW1vdmUoKSxyfWZ1bmN0aW9uIEgoZSx0LG4scil7dmFyIGk7aWYocHQuaXNBcnJheSh0KSlwdC5lYWNoKHQsZnVuY3Rpb24odCxpKXtufHxqbi50ZXN0KGUpP3IoZSxpKTpIKGUrXCJbXCIrKFwib2JqZWN0XCI9PXR5cGVvZiBpP3Q6XCJcIikrXCJdXCIsaSxuLHIpfSk7ZWxzZSBpZihufHxcIm9iamVjdFwiIT09cHQudHlwZSh0KSlyKGUsdCk7ZWxzZSBmb3IoaSBpbiB0KUgoZStcIltcIitpK1wiXVwiLHRbaV0sbixyKX1mdW5jdGlvbiBxKGUpe3JldHVybiBmdW5jdGlvbih0LG4pe1wic3RyaW5nXCIhPXR5cGVvZiB0JiYobj10LHQ9XCIqXCIpO3ZhciByLGk9MCxvPXQudG9Mb3dlckNhc2UoKS5tYXRjaChodCl8fFtdO2lmKHB0LmlzRnVuY3Rpb24obikpZm9yKDtyPW9baSsrXTspXCIrXCI9PT1yWzBdPyhyPXIuc2xpY2UoMSl8fFwiKlwiLChlW3JdPWVbcl18fFtdKS51bnNoaWZ0KG4pKTooZVtyXT1lW3JdfHxbXSkucHVzaChuKX19ZnVuY3Rpb24gXyhlLHQsbixpKXtmdW5jdGlvbiBvKHUpe3ZhciBsO3JldHVybiBhW3VdPSEwLHB0LmVhY2goZVt1XXx8W10sZnVuY3Rpb24oZSx1KXt2YXIgYz11KHQsbixpKTtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgY3x8c3x8YVtjXT9zPyEobD1jKTpyOih0LmRhdGFUeXBlcy51bnNoaWZ0KGMpLG8oYyksITEpfSksbH12YXIgYT17fSxzPWU9PT1VbjtyZXR1cm4gbyh0LmRhdGFUeXBlc1swXSl8fCFhW1wiKlwiXSYmbyhcIipcIil9ZnVuY3Rpb24gTShlLHQpe3ZhciBuLGksbz1wdC5hamF4U2V0dGluZ3MuZmxhdE9wdGlvbnN8fHt9O2ZvcihpIGluIHQpdFtpXSE9PXImJigob1tpXT9lOm58fChuPXt9KSlbaV09dFtpXSk7cmV0dXJuIG4mJnB0LmV4dGVuZCghMCxlLG4pLGV9ZnVuY3Rpb24gTyhlLHQsbil7Zm9yKHZhciBpLG8sYSxzLHU9ZS5jb250ZW50cyxsPWUuZGF0YVR5cGVzO1wiKlwiPT09bFswXTspbC5zaGlmdCgpLG89PT1yJiYobz1lLm1pbWVUeXBlfHx0LmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtpZihvKWZvcihzIGluIHUpaWYodVtzXSYmdVtzXS50ZXN0KG8pKXtsLnVuc2hpZnQocyk7YnJlYWt9aWYobFswXWluIG4pYT1sWzBdO2Vsc2V7Zm9yKHMgaW4gbil7aWYoIWxbMF18fGUuY29udmVydGVyc1tzK1wiIFwiK2xbMF1dKXthPXM7YnJlYWt9aXx8KGk9cyl9YT1hfHxpfXJldHVybiBhPyhhIT09bFswXSYmbC51bnNoaWZ0KGEpLG5bYV0pOnJ9ZnVuY3Rpb24gRihlLHQsbixyKXt2YXIgaSxvLGEscyx1LGw9e30sYz1lLmRhdGFUeXBlcy5zbGljZSgpO2lmKGNbMV0pZm9yKGEgaW4gZS5jb252ZXJ0ZXJzKWxbYS50b0xvd2VyQ2FzZSgpXT1lLmNvbnZlcnRlcnNbYV07Zm9yKG89Yy5zaGlmdCgpO287KWlmKGUucmVzcG9uc2VGaWVsZHNbb10mJihuW2UucmVzcG9uc2VGaWVsZHNbb11dPXQpLCF1JiZyJiZlLmRhdGFGaWx0ZXImJih0PWUuZGF0YUZpbHRlcih0LGUuZGF0YVR5cGUpKSx1PW8sbz1jLnNoaWZ0KCkpaWYoXCIqXCI9PT1vKW89dTtlbHNlIGlmKFwiKlwiIT09dSYmdSE9PW8pe2lmKGE9bFt1K1wiIFwiK29dfHxsW1wiKiBcIitvXSwhYSlmb3IoaSBpbiBsKWlmKHM9aS5zcGxpdChcIiBcIiksc1sxXT09PW8mJihhPWxbdStcIiBcIitzWzBdXXx8bFtcIiogXCIrc1swXV0pKXthPT09ITA/YT1sW2ldOmxbaV0hPT0hMCYmKG89c1swXSxjLnVuc2hpZnQoc1sxXSkpO2JyZWFrfWlmKGEhPT0hMClpZihhJiZlW1widGhyb3dzXCJdKXQ9YSh0KTtlbHNlIHRyeXt0PWEodCl9Y2F0Y2goZil7cmV0dXJue3N0YXRlOlwicGFyc2VyZXJyb3JcIixlcnJvcjphP2Y6XCJObyBjb252ZXJzaW9uIGZyb20gXCIrdStcIiB0byBcIitvfX19cmV0dXJue3N0YXRlOlwic3VjY2Vzc1wiLGRhdGE6dH19ZnVuY3Rpb24gQigpe3RyeXtyZXR1cm4gbmV3IHQuWE1MSHR0cFJlcXVlc3R9Y2F0Y2goZSl7fX1mdW5jdGlvbiBQKCl7dHJ5e3JldHVybiBuZXcgdC5BY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIil9Y2F0Y2goZSl7fX1mdW5jdGlvbiBSKCl7cmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0cj1yfSksdHI9cHQubm93KCl9ZnVuY3Rpb24gVyhlLHQsbil7Zm9yKHZhciByLGk9KHNyW3RdfHxbXSkuY29uY2F0KHNyW1wiKlwiXSksbz0wLGE9aS5sZW5ndGg7YT5vO28rKylpZihyPWlbb10uY2FsbChuLHQsZSkpcmV0dXJuIHJ9ZnVuY3Rpb24gJChlLHQsbil7dmFyIHIsaSxvPTAsYT1hci5sZW5ndGgscz1wdC5EZWZlcnJlZCgpLmFsd2F5cyhmdW5jdGlvbigpe2RlbGV0ZSB1LmVsZW19KSx1PWZ1bmN0aW9uKCl7aWYoaSlyZXR1cm4hMTtmb3IodmFyIHQ9dHJ8fFIoKSxuPU1hdGgubWF4KDAsbC5zdGFydFRpbWUrbC5kdXJhdGlvbi10KSxyPW4vbC5kdXJhdGlvbnx8MCxvPTEtcixhPTAsdT1sLnR3ZWVucy5sZW5ndGg7dT5hO2ErKylsLnR3ZWVuc1thXS5ydW4obyk7cmV0dXJuIHMubm90aWZ5V2l0aChlLFtsLG8sbl0pLDE+byYmdT9uOihzLnJlc29sdmVXaXRoKGUsW2xdKSwhMSl9LGw9cy5wcm9taXNlKHtlbGVtOmUscHJvcHM6cHQuZXh0ZW5kKHt9LHQpLG9wdHM6cHQuZXh0ZW5kKCEwLHtzcGVjaWFsRWFzaW5nOnt9fSxuKSxvcmlnaW5hbFByb3BlcnRpZXM6dCxvcmlnaW5hbE9wdGlvbnM6bixzdGFydFRpbWU6dHJ8fFIoKSxkdXJhdGlvbjpuLmR1cmF0aW9uLHR3ZWVuczpbXSxjcmVhdGVUd2VlbjpmdW5jdGlvbih0LG4pe3ZhciByPXB0LlR3ZWVuKGUsbC5vcHRzLHQsbixsLm9wdHMuc3BlY2lhbEVhc2luZ1t0XXx8bC5vcHRzLmVhc2luZyk7cmV0dXJuIGwudHdlZW5zLnB1c2gocikscn0sc3RvcDpmdW5jdGlvbih0KXt2YXIgbj0wLHI9dD9sLnR3ZWVucy5sZW5ndGg6MDtpZihpKXJldHVybiB0aGlzO2ZvcihpPSEwO3I+bjtuKyspbC50d2VlbnNbbl0ucnVuKDEpO3JldHVybiB0P3MucmVzb2x2ZVdpdGgoZSxbbCx0XSk6cy5yZWplY3RXaXRoKGUsW2wsdF0pLHRoaXN9fSksYz1sLnByb3BzO2ZvcihJKGMsbC5vcHRzLnNwZWNpYWxFYXNpbmcpO2E+bztvKyspaWYocj1hcltvXS5jYWxsKGwsZSxjLGwub3B0cykpcmV0dXJuIHI7cmV0dXJuIHB0Lm1hcChjLFcsbCkscHQuaXNGdW5jdGlvbihsLm9wdHMuc3RhcnQpJiZsLm9wdHMuc3RhcnQuY2FsbChlLGwpLHB0LmZ4LnRpbWVyKHB0LmV4dGVuZCh1LHtlbGVtOmUsYW5pbTpsLHF1ZXVlOmwub3B0cy5xdWV1ZX0pKSxsLnByb2dyZXNzKGwub3B0cy5wcm9ncmVzcykuZG9uZShsLm9wdHMuZG9uZSxsLm9wdHMuY29tcGxldGUpLmZhaWwobC5vcHRzLmZhaWwpLmFsd2F5cyhsLm9wdHMuYWx3YXlzKX1mdW5jdGlvbiBJKGUsdCl7dmFyIG4scixpLG8sYTtmb3IobiBpbiBlKWlmKHI9cHQuY2FtZWxDYXNlKG4pLGk9dFtyXSxvPWVbbl0scHQuaXNBcnJheShvKSYmKGk9b1sxXSxvPWVbbl09b1swXSksbiE9PXImJihlW3JdPW8sZGVsZXRlIGVbbl0pLGE9cHQuY3NzSG9va3Nbcl0sYSYmXCJleHBhbmRcImluIGEpe289YS5leHBhbmQobyksZGVsZXRlIGVbcl07Zm9yKG4gaW4gbyluIGluIGV8fChlW25dPW9bbl0sdFtuXT1pKX1lbHNlIHRbcl09aX1mdW5jdGlvbiB6KGUsdCxuKXt2YXIgcixpLG8sYSxzLHUsbD10aGlzLGM9e30sZj1lLnN0eWxlLHA9ZS5ub2RlVHlwZSYmayhlKSxkPXB0Ll9kYXRhKGUsXCJmeHNob3dcIik7bi5xdWV1ZXx8KHM9cHQuX3F1ZXVlSG9va3MoZSxcImZ4XCIpLG51bGw9PXMudW5xdWV1ZWQmJihzLnVucXVldWVkPTAsdT1zLmVtcHR5LmZpcmUscy5lbXB0eS5maXJlPWZ1bmN0aW9uKCl7cy51bnF1ZXVlZHx8dSgpfSkscy51bnF1ZXVlZCsrLGwuYWx3YXlzKGZ1bmN0aW9uKCl7bC5hbHdheXMoZnVuY3Rpb24oKXtzLnVucXVldWVkLS0scHQucXVldWUoZSxcImZ4XCIpLmxlbmd0aHx8cy5lbXB0eS5maXJlKCl9KX0pKSwxPT09ZS5ub2RlVHlwZSYmKFwiaGVpZ2h0XCJpbiB0fHxcIndpZHRoXCJpbiB0KSYmKG4ub3ZlcmZsb3c9W2Yub3ZlcmZsb3csZi5vdmVyZmxvd1gsZi5vdmVyZmxvd1ldLFwiaW5saW5lXCI9PT1wdC5jc3MoZSxcImRpc3BsYXlcIikmJlwibm9uZVwiPT09cHQuY3NzKGUsXCJmbG9hdFwiKSYmKHB0LnN1cHBvcnQuaW5saW5lQmxvY2tOZWVkc0xheW91dCYmXCJpbmxpbmVcIiE9PUQoZS5ub2RlTmFtZSk/Zi56b29tPTE6Zi5kaXNwbGF5PVwiaW5saW5lLWJsb2NrXCIpKSxuLm92ZXJmbG93JiYoZi5vdmVyZmxvdz1cImhpZGRlblwiLHB0LnN1cHBvcnQuc2hyaW5rV3JhcEJsb2Nrc3x8bC5hbHdheXMoZnVuY3Rpb24oKXtmLm92ZXJmbG93PW4ub3ZlcmZsb3dbMF0sZi5vdmVyZmxvd1g9bi5vdmVyZmxvd1sxXSxmLm92ZXJmbG93WT1uLm92ZXJmbG93WzJdfSkpO2ZvcihyIGluIHQpaWYoaT10W3JdLHJyLmV4ZWMoaSkpe2lmKGRlbGV0ZSB0W3JdLG89b3x8XCJ0b2dnbGVcIj09PWksaT09PShwP1wiaGlkZVwiOlwic2hvd1wiKSljb250aW51ZTtjW3JdPWQmJmRbcl18fHB0LnN0eWxlKGUscil9aWYoIXB0LmlzRW1wdHlPYmplY3QoYykpe2Q/XCJoaWRkZW5cImluIGQmJihwPWQuaGlkZGVuKTpkPXB0Ll9kYXRhKGUsXCJmeHNob3dcIix7fSksbyYmKGQuaGlkZGVuPSFwKSxwP3B0KGUpLnNob3coKTpsLmRvbmUoZnVuY3Rpb24oKXtwdChlKS5oaWRlKCl9KSxsLmRvbmUoZnVuY3Rpb24oKXt2YXIgdDtwdC5fcmVtb3ZlRGF0YShlLFwiZnhzaG93XCIpO2Zvcih0IGluIGMpcHQuc3R5bGUoZSx0LGNbdF0pfSk7Zm9yKHIgaW4gYylhPVcocD9kW3JdOjAscixsKSxyIGluIGR8fChkW3JdPWEuc3RhcnQscCYmKGEuZW5kPWEuc3RhcnQsYS5zdGFydD1cIndpZHRoXCI9PT1yfHxcImhlaWdodFwiPT09cj8xOjApKX19ZnVuY3Rpb24gWChlLHQsbixyLGkpe3JldHVybiBuZXcgWC5wcm90b3R5cGUuaW5pdChlLHQsbixyLGkpfWZ1bmN0aW9uIFUoZSx0KXt2YXIgbixyPXtoZWlnaHQ6ZX0saT0wO2Zvcih0PXQ/MTowOzQ+aTtpKz0yLXQpbj1FbltpXSxyW1wibWFyZ2luXCIrbl09cltcInBhZGRpbmdcIituXT1lO3JldHVybiB0JiYoci5vcGFjaXR5PXIud2lkdGg9ZSkscn1mdW5jdGlvbiBWKGUpe3JldHVybiBwdC5pc1dpbmRvdyhlKT9lOjk9PT1lLm5vZGVUeXBlP2UuZGVmYXVsdFZpZXd8fGUucGFyZW50V2luZG93OiExfXZhciBZLEosRz10eXBlb2YgcixRPXQubG9jYXRpb24sSz10LmRvY3VtZW50LFo9Sy5kb2N1bWVudEVsZW1lbnQsZXQ9dC5qUXVlcnksdHQ9dC4kLG50PXt9LHJ0PVtdLGl0PVwiMS4xMC4yXCIsb3Q9cnQuY29uY2F0LGF0PXJ0LnB1c2gsc3Q9cnQuc2xpY2UsdXQ9cnQuaW5kZXhPZixsdD1udC50b1N0cmluZyxjdD1udC5oYXNPd25Qcm9wZXJ0eSxmdD1pdC50cmltLHB0PWZ1bmN0aW9uKGUsdCl7cmV0dXJuIG5ldyBwdC5mbi5pbml0KGUsdCxKKX0sZHQ9L1srLV0/KD86XFxkKlxcLnwpXFxkKyg/OltlRV1bKy1dP1xcZCt8KS8uc291cmNlLGh0PS9cXFMrL2csZ3Q9L15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLG10PS9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKnwjKFtcXHctXSopKSQvLHl0PS9ePChcXHcrKVxccypcXC8/Pig/OjxcXC9cXDE+fCkkLyx2dD0vXltcXF0sOnt9XFxzXSokLyxidD0vKD86Xnw6fCwpKD86XFxzKlxcWykrL2cseHQ9L1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbXFxkYS1mQS1GXXs0fSkvZyxUdD0vXCJbXlwiXFxcXFxcclxcbl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/KD86XFxkK1xcLnwpXFxkKyg/OltlRV1bKy1dP1xcZCt8KS9nLHd0PS9eLW1zLS8sQ3Q9Ly0oW1xcZGEtel0pL2dpLE50PWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHQudG9VcHBlckNhc2UoKX0sa3Q9ZnVuY3Rpb24oZSl7KEsuYWRkRXZlbnRMaXN0ZW5lcnx8XCJsb2FkXCI9PT1lLnR5cGV8fFwiY29tcGxldGVcIj09PUsucmVhZHlTdGF0ZSkmJihFdCgpLHB0LnJlYWR5KCkpfSxFdD1mdW5jdGlvbigpe0suYWRkRXZlbnRMaXN0ZW5lcj8oSy5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGt0LCExKSx0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsa3QsITEpKTooSy5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGt0KSx0LmRldGFjaEV2ZW50KFwib25sb2FkXCIsa3QpKX07cHQuZm49cHQucHJvdG90eXBlPXtqcXVlcnk6aXQsY29uc3RydWN0b3I6cHQsaW5pdDpmdW5jdGlvbihlLHQsbil7dmFyIGksbztpZighZSlyZXR1cm4gdGhpcztpZihcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYoaT1cIjxcIj09PWUuY2hhckF0KDApJiZcIj5cIj09PWUuY2hhckF0KGUubGVuZ3RoLTEpJiZlLmxlbmd0aD49Mz9bbnVsbCxlLG51bGxdOm10LmV4ZWMoZSksIWl8fCFpWzFdJiZ0KXJldHVybiF0fHx0LmpxdWVyeT8odHx8bikuZmluZChlKTp0aGlzLmNvbnN0cnVjdG9yKHQpLmZpbmQoZSk7aWYoaVsxXSl7aWYodD10IGluc3RhbmNlb2YgcHQ/dFswXTp0LHB0Lm1lcmdlKHRoaXMscHQucGFyc2VIVE1MKGlbMV0sdCYmdC5ub2RlVHlwZT90Lm93bmVyRG9jdW1lbnR8fHQ6SywhMCkpLHl0LnRlc3QoaVsxXSkmJnB0LmlzUGxhaW5PYmplY3QodCkpZm9yKGkgaW4gdClwdC5pc0Z1bmN0aW9uKHRoaXNbaV0pP3RoaXNbaV0odFtpXSk6dGhpcy5hdHRyKGksdFtpXSk7cmV0dXJuIHRoaXN9aWYobz1LLmdldEVsZW1lbnRCeUlkKGlbMl0pLG8mJm8ucGFyZW50Tm9kZSl7aWYoby5pZCE9PWlbMl0pcmV0dXJuIG4uZmluZChlKTt0aGlzLmxlbmd0aD0xLHRoaXNbMF09b31yZXR1cm4gdGhpcy5jb250ZXh0PUssdGhpcy5zZWxlY3Rvcj1lLHRoaXN9cmV0dXJuIGUubm9kZVR5cGU/KHRoaXMuY29udGV4dD10aGlzWzBdPWUsdGhpcy5sZW5ndGg9MSx0aGlzKTpwdC5pc0Z1bmN0aW9uKGUpP24ucmVhZHkoZSk6KGUuc2VsZWN0b3IhPT1yJiYodGhpcy5zZWxlY3Rvcj1lLnNlbGVjdG9yLHRoaXMuY29udGV4dD1lLmNvbnRleHQpLHB0Lm1ha2VBcnJheShlLHRoaXMpKX0sc2VsZWN0b3I6XCJcIixsZW5ndGg6MCx0b0FycmF5OmZ1bmN0aW9uKCl7cmV0dXJuIHN0LmNhbGwodGhpcyl9LGdldDpmdW5jdGlvbihlKXtyZXR1cm4gbnVsbD09ZT90aGlzLnRvQXJyYXkoKTowPmU/dGhpc1t0aGlzLmxlbmd0aCtlXTp0aGlzW2VdfSxwdXNoU3RhY2s6ZnVuY3Rpb24oZSl7dmFyIHQ9cHQubWVyZ2UodGhpcy5jb25zdHJ1Y3RvcigpLGUpO3JldHVybiB0LnByZXZPYmplY3Q9dGhpcyx0LmNvbnRleHQ9dGhpcy5jb250ZXh0LHR9LGVhY2g6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gcHQuZWFjaCh0aGlzLGUsdCl9LHJlYWR5OmZ1bmN0aW9uKGUpe3JldHVybiBwdC5yZWFkeS5wcm9taXNlKCkuZG9uZShlKSx0aGlzfSxzbGljZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnB1c2hTdGFjayhzdC5hcHBseSh0aGlzLGFyZ3VtZW50cykpfSxmaXJzdDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmVxKDApfSxsYXN0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXEoLTEpfSxlcTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLmxlbmd0aCxuPStlKygwPmU/dDowKTtyZXR1cm4gdGhpcy5wdXNoU3RhY2sobj49MCYmdD5uP1t0aGlzW25dXTpbXSl9LG1hcDpmdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5wdXNoU3RhY2socHQubWFwKHRoaXMsZnVuY3Rpb24odCxuKXtyZXR1cm4gZS5jYWxsKHQsbix0KX0pKX0sZW5kOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJldk9iamVjdHx8dGhpcy5jb25zdHJ1Y3RvcihudWxsKX0scHVzaDphdCxzb3J0OltdLnNvcnQsc3BsaWNlOltdLnNwbGljZX0scHQuZm4uaW5pdC5wcm90b3R5cGU9cHQuZm4scHQuZXh0ZW5kPXB0LmZuLmV4dGVuZD1mdW5jdGlvbigpe3ZhciBlLHQsbixpLG8sYSxzPWFyZ3VtZW50c1swXXx8e30sdT0xLGw9YXJndW1lbnRzLmxlbmd0aCxjPSExO2ZvcihcImJvb2xlYW5cIj09dHlwZW9mIHMmJihjPXMscz1hcmd1bWVudHNbMV18fHt9LHU9MiksXCJvYmplY3RcIj09dHlwZW9mIHN8fHB0LmlzRnVuY3Rpb24ocyl8fChzPXt9KSxsPT09dSYmKHM9dGhpcywtLXUpO2w+dTt1KyspaWYobnVsbCE9KG89YXJndW1lbnRzW3VdKSlmb3IoaSBpbiBvKWU9c1tpXSxuPW9baV0scyE9PW4mJihjJiZuJiYocHQuaXNQbGFpbk9iamVjdChuKXx8KHQ9cHQuaXNBcnJheShuKSkpPyh0Pyh0PSExLGE9ZSYmcHQuaXNBcnJheShlKT9lOltdKTphPWUmJnB0LmlzUGxhaW5PYmplY3QoZSk/ZTp7fSxzW2ldPXB0LmV4dGVuZChjLGEsbikpOm4hPT1yJiYoc1tpXT1uKSk7cmV0dXJuIHN9LHB0LmV4dGVuZCh7ZXhwYW5kbzpcImpRdWVyeVwiKyhpdCtNYXRoLnJhbmRvbSgpKS5yZXBsYWNlKC9cXEQvZyxcIlwiKSxub0NvbmZsaWN0OmZ1bmN0aW9uKGUpe3JldHVybiB0LiQ9PT1wdCYmKHQuJD10dCksZSYmdC5qUXVlcnk9PT1wdCYmKHQualF1ZXJ5PWV0KSxwdH0saXNSZWFkeTohMSxyZWFkeVdhaXQ6MSxob2xkUmVhZHk6ZnVuY3Rpb24oZSl7ZT9wdC5yZWFkeVdhaXQrKzpwdC5yZWFkeSghMCl9LHJlYWR5OmZ1bmN0aW9uKGUpe2lmKGU9PT0hMD8hLS1wdC5yZWFkeVdhaXQ6IXB0LmlzUmVhZHkpe2lmKCFLLmJvZHkpcmV0dXJuIHNldFRpbWVvdXQocHQucmVhZHkpO3B0LmlzUmVhZHk9ITAsZSE9PSEwJiYtLXB0LnJlYWR5V2FpdD4wfHwoWS5yZXNvbHZlV2l0aChLLFtwdF0pLHB0LmZuLnRyaWdnZXImJnB0KEspLnRyaWdnZXIoXCJyZWFkeVwiKS5vZmYoXCJyZWFkeVwiKSl9fSxpc0Z1bmN0aW9uOmZ1bmN0aW9uKGUpe3JldHVyblwiZnVuY3Rpb25cIj09PXB0LnR5cGUoZSl9LGlzQXJyYXk6QXJyYXkuaXNBcnJheXx8ZnVuY3Rpb24oZSl7cmV0dXJuXCJhcnJheVwiPT09cHQudHlwZShlKX0saXNXaW5kb3c6ZnVuY3Rpb24oZSl7cmV0dXJuIG51bGwhPWUmJmU9PWUud2luZG93fSxpc051bWVyaWM6ZnVuY3Rpb24oZSl7cmV0dXJuIWlzTmFOKHBhcnNlRmxvYXQoZSkpJiZpc0Zpbml0ZShlKX0sdHlwZTpmdW5jdGlvbihlKXtyZXR1cm4gbnVsbD09ZT9lK1wiXCI6XCJvYmplY3RcIj09dHlwZW9mIGV8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGU/bnRbbHQuY2FsbChlKV18fFwib2JqZWN0XCI6dHlwZW9mIGV9LGlzUGxhaW5PYmplY3Q6ZnVuY3Rpb24oZSl7dmFyIHQ7aWYoIWV8fFwib2JqZWN0XCIhPT1wdC50eXBlKGUpfHxlLm5vZGVUeXBlfHxwdC5pc1dpbmRvdyhlKSlyZXR1cm4hMTt0cnl7aWYoZS5jb25zdHJ1Y3RvciYmIWN0LmNhbGwoZSxcImNvbnN0cnVjdG9yXCIpJiYhY3QuY2FsbChlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSxcImlzUHJvdG90eXBlT2ZcIikpcmV0dXJuITF9Y2F0Y2gobil7cmV0dXJuITF9aWYocHQuc3VwcG9ydC5vd25MYXN0KWZvcih0IGluIGUpcmV0dXJuIGN0LmNhbGwoZSx0KTtmb3IodCBpbiBlKTtyZXR1cm4gdD09PXJ8fGN0LmNhbGwoZSx0KX0saXNFbXB0eU9iamVjdDpmdW5jdGlvbihlKXt2YXIgdDtmb3IodCBpbiBlKXJldHVybiExO3JldHVybiEwfSxlcnJvcjpmdW5jdGlvbihlKXt0aHJvdyBFcnJvcihlKX0scGFyc2VIVE1MOmZ1bmN0aW9uKGUsdCxuKXtpZighZXx8XCJzdHJpbmdcIiE9dHlwZW9mIGUpcmV0dXJuIG51bGw7XCJib29sZWFuXCI9PXR5cGVvZiB0JiYobj10LHQ9ITEpLHQ9dHx8Szt2YXIgcj15dC5leGVjKGUpLGk9IW4mJltdO3JldHVybiByP1t0LmNyZWF0ZUVsZW1lbnQoclsxXSldOihyPXB0LmJ1aWxkRnJhZ21lbnQoW2VdLHQsaSksaSYmcHQoaSkucmVtb3ZlKCkscHQubWVyZ2UoW10sci5jaGlsZE5vZGVzKSl9LHBhcnNlSlNPTjpmdW5jdGlvbihlKXtyZXR1cm4gdC5KU09OJiZ0LkpTT04ucGFyc2U/dC5KU09OLnBhcnNlKGUpOm51bGw9PT1lP2U6XCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPXB0LnRyaW0oZSksZSYmdnQudGVzdChlLnJlcGxhY2UoeHQsXCJAXCIpLnJlcGxhY2UoVHQsXCJdXCIpLnJlcGxhY2UoYnQsXCJcIikpKT9GdW5jdGlvbihcInJldHVybiBcIitlKSgpOihwdC5lcnJvcihcIkludmFsaWQgSlNPTjogXCIrZSkscil9LHBhcnNlWE1MOmZ1bmN0aW9uKGUpe3ZhciBuLGk7aWYoIWV8fFwic3RyaW5nXCIhPXR5cGVvZiBlKXJldHVybiBudWxsO3RyeXt0LkRPTVBhcnNlcj8oaT1uZXcgRE9NUGFyc2VyLG49aS5wYXJzZUZyb21TdHJpbmcoZSxcInRleHQveG1sXCIpKToobj1uZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxET01cIiksbi5hc3luYz1cImZhbHNlXCIsbi5sb2FkWE1MKGUpKX1jYXRjaChvKXtuPXJ9cmV0dXJuIG4mJm4uZG9jdW1lbnRFbGVtZW50JiYhbi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBhcnNlcmVycm9yXCIpLmxlbmd0aHx8cHQuZXJyb3IoXCJJbnZhbGlkIFhNTDogXCIrZSksbn0sbm9vcDpmdW5jdGlvbigpe30sZ2xvYmFsRXZhbDpmdW5jdGlvbihlKXtlJiZwdC50cmltKGUpJiYodC5leGVjU2NyaXB0fHxmdW5jdGlvbihlKXt0LmV2YWwuY2FsbCh0LGUpfSkoZSl9LGNhbWVsQ2FzZTpmdW5jdGlvbihlKXtyZXR1cm4gZS5yZXBsYWNlKHd0LFwibXMtXCIpLnJlcGxhY2UoQ3QsTnQpfSxub2RlTmFtZTpmdW5jdGlvbihlLHQpe3JldHVybiBlLm5vZGVOYW1lJiZlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT10LnRvTG93ZXJDYXNlKCl9LGVhY2g6ZnVuY3Rpb24oZSx0LG4pe3ZhciByLG89MCxhPWUubGVuZ3RoLHM9aShlKTtpZihuKXtpZihzKWZvcig7YT5vJiYocj10LmFwcGx5KGVbb10sbiksciE9PSExKTtvKyspO2Vsc2UgZm9yKG8gaW4gZSlpZihyPXQuYXBwbHkoZVtvXSxuKSxyPT09ITEpYnJlYWt9ZWxzZSBpZihzKWZvcig7YT5vJiYocj10LmNhbGwoZVtvXSxvLGVbb10pLHIhPT0hMSk7bysrKTtlbHNlIGZvcihvIGluIGUpaWYocj10LmNhbGwoZVtvXSxvLGVbb10pLHI9PT0hMSlicmVhaztyZXR1cm4gZX0sdHJpbTpmdCYmIWZ0LmNhbGwoXCLvu7/CoFwiKT9mdW5jdGlvbihlKXtyZXR1cm4gbnVsbD09ZT9cIlwiOmZ0LmNhbGwoZSl9OmZ1bmN0aW9uKGUpe3JldHVybiBudWxsPT1lP1wiXCI6KGUrXCJcIikucmVwbGFjZShndCxcIlwiKX0sbWFrZUFycmF5OmZ1bmN0aW9uKGUsdCl7dmFyIG49dHx8W107cmV0dXJuIG51bGwhPWUmJihpKE9iamVjdChlKSk/cHQubWVyZ2UobixcInN0cmluZ1wiPT10eXBlb2YgZT9bZV06ZSk6YXQuY2FsbChuLGUpKSxufSxpbkFycmF5OmZ1bmN0aW9uKGUsdCxuKXt2YXIgcjtpZih0KXtpZih1dClyZXR1cm4gdXQuY2FsbCh0LGUsbik7Zm9yKHI9dC5sZW5ndGgsbj1uPzA+bj9NYXRoLm1heCgwLHIrbik6bjowO3I+bjtuKyspaWYobiBpbiB0JiZ0W25dPT09ZSlyZXR1cm4gbn1yZXR1cm4tMX0sbWVyZ2U6ZnVuY3Rpb24oZSx0KXt2YXIgbj10Lmxlbmd0aCxpPWUubGVuZ3RoLG89MDtpZihcIm51bWJlclwiPT10eXBlb2Ygbilmb3IoO24+bztvKyspZVtpKytdPXRbb107ZWxzZSBmb3IoO3Rbb10hPT1yOyllW2krK109dFtvKytdO3JldHVybiBlLmxlbmd0aD1pLGV9LGdyZXA6ZnVuY3Rpb24oZSx0LG4pe3ZhciByLGk9W10sbz0wLGE9ZS5sZW5ndGg7Zm9yKG49ISFuO2E+bztvKyspcj0hIXQoZVtvXSxvKSxuIT09ciYmaS5wdXNoKGVbb10pO3JldHVybiBpfSxtYXA6ZnVuY3Rpb24oZSx0LG4pe3ZhciByLG89MCxhPWUubGVuZ3RoLHM9aShlKSx1PVtdO2lmKHMpZm9yKDthPm87bysrKXI9dChlW29dLG8sbiksbnVsbCE9ciYmKHVbdS5sZW5ndGhdPXIpO2Vsc2UgZm9yKG8gaW4gZSlyPXQoZVtvXSxvLG4pLG51bGwhPXImJih1W3UubGVuZ3RoXT1yKTtyZXR1cm4gb3QuYXBwbHkoW10sdSl9LGd1aWQ6MSxwcm94eTpmdW5jdGlvbihlLHQpe3ZhciBuLGksbztyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdCYmKG89ZVt0XSx0PWUsZT1vKSxwdC5pc0Z1bmN0aW9uKGUpPyhuPXN0LmNhbGwoYXJndW1lbnRzLDIpLGk9ZnVuY3Rpb24oKXtyZXR1cm4gZS5hcHBseSh0fHx0aGlzLG4uY29uY2F0KHN0LmNhbGwoYXJndW1lbnRzKSkpfSxpLmd1aWQ9ZS5ndWlkPWUuZ3VpZHx8cHQuZ3VpZCsrLGkpOnJ9LGFjY2VzczpmdW5jdGlvbihlLHQsbixpLG8sYSxzKXt2YXIgdT0wLGw9ZS5sZW5ndGgsYz1udWxsPT1uO2lmKFwib2JqZWN0XCI9PT1wdC50eXBlKG4pKXtvPSEwO2Zvcih1IGluIG4pcHQuYWNjZXNzKGUsdCx1LG5bdV0sITAsYSxzKX1lbHNlIGlmKGkhPT1yJiYobz0hMCxwdC5pc0Z1bmN0aW9uKGkpfHwocz0hMCksYyYmKHM/KHQuY2FsbChlLGkpLHQ9bnVsbCk6KGM9dCx0PWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gYy5jYWxsKHB0KGUpLG4pfSkpLHQpKWZvcig7bD51O3UrKyl0KGVbdV0sbixzP2k6aS5jYWxsKGVbdV0sdSx0KGVbdV0sbikpKTtyZXR1cm4gbz9lOmM/dC5jYWxsKGUpOmw/dChlWzBdLG4pOmF9LG5vdzpmdW5jdGlvbigpe3JldHVybihuZXcgRGF0ZSkuZ2V0VGltZSgpfSxzd2FwOmZ1bmN0aW9uKGUsdCxuLHIpe3ZhciBpLG8sYT17fTtmb3IobyBpbiB0KWFbb109ZS5zdHlsZVtvXSxlLnN0eWxlW29dPXRbb107aT1uLmFwcGx5KGUscnx8W10pO2ZvcihvIGluIHQpZS5zdHlsZVtvXT1hW29dO3JldHVybiBpfX0pLHB0LnJlYWR5LnByb21pc2U9ZnVuY3Rpb24oZSl7aWYoIVkpaWYoWT1wdC5EZWZlcnJlZCgpLFwiY29tcGxldGVcIj09PUsucmVhZHlTdGF0ZSlzZXRUaW1lb3V0KHB0LnJlYWR5KTtlbHNlIGlmKEsuYWRkRXZlbnRMaXN0ZW5lcilLLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsa3QsITEpLHQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixrdCwhMSk7ZWxzZXtLLmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsa3QpLHQuYXR0YWNoRXZlbnQoXCJvbmxvYWRcIixrdCk7dmFyIG49ITE7dHJ5e249bnVsbD09dC5mcmFtZUVsZW1lbnQmJksuZG9jdW1lbnRFbGVtZW50fWNhdGNoKHIpe31uJiZuLmRvU2Nyb2xsJiZmdW5jdGlvbiBpKCl7aWYoIXB0LmlzUmVhZHkpe3RyeXtuLmRvU2Nyb2xsKFwibGVmdFwiKX1jYXRjaChlKXtyZXR1cm4gc2V0VGltZW91dChpLDUwKX1FdCgpLHB0LnJlYWR5KCl9fSgpfXJldHVybiBZLnByb21pc2UoZSl9LHB0LmVhY2goXCJCb29sZWFuIE51bWJlciBTdHJpbmcgRnVuY3Rpb24gQXJyYXkgRGF0ZSBSZWdFeHAgT2JqZWN0IEVycm9yXCIuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGUsdCl7bnRbXCJbb2JqZWN0IFwiK3QrXCJdXCJdPXQudG9Mb3dlckNhc2UoKX0pLEo9cHQoSyksZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKGUsdCxuLHIpe3ZhciBpLG8sYSxzLHUsbCxjLGYsaCxnO2lmKCh0P3Qub3duZXJEb2N1bWVudHx8dDpSKSE9PUgmJkwodCksdD10fHxILG49bnx8W10sIWV8fFwic3RyaW5nXCIhPXR5cGVvZiBlKXJldHVybiBuO2lmKDEhPT0ocz10Lm5vZGVUeXBlKSYmOSE9PXMpcmV0dXJuW107aWYoXyYmIXIpe2lmKGk9YnQuZXhlYyhlKSlpZihhPWlbMV0pe2lmKDk9PT1zKXtpZihvPXQuZ2V0RWxlbWVudEJ5SWQoYSksIW98fCFvLnBhcmVudE5vZGUpcmV0dXJuIG47aWYoby5pZD09PWEpcmV0dXJuIG4ucHVzaChvKSxufWVsc2UgaWYodC5vd25lckRvY3VtZW50JiYobz10Lm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYSkpJiZCKHQsbykmJm8uaWQ9PT1hKXJldHVybiBuLnB1c2gobyksbn1lbHNle2lmKGlbMl0pcmV0dXJuIGV0LmFwcGx5KG4sdC5nZXRFbGVtZW50c0J5VGFnTmFtZShlKSksbjtpZigoYT1pWzNdKSYmQy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lJiZ0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUpcmV0dXJuIGV0LmFwcGx5KG4sdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGEpKSxufWlmKEMucXNhJiYoIU18fCFNLnRlc3QoZSkpKXtpZihmPWM9UCxoPXQsZz05PT09cyYmZSwxPT09cyYmXCJvYmplY3RcIiE9PXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSl7Zm9yKGw9cChlKSwoYz10LmdldEF0dHJpYnV0ZShcImlkXCIpKT9mPWMucmVwbGFjZSh3dCxcIlxcXFwkJlwiKTp0LnNldEF0dHJpYnV0ZShcImlkXCIsZiksZj1cIltpZD0nXCIrZitcIiddIFwiLHU9bC5sZW5ndGg7dS0tOylsW3VdPWYrZChsW3VdKTtoPWR0LnRlc3QoZSkmJnQucGFyZW50Tm9kZXx8dCxnPWwuam9pbihcIixcIil9aWYoZyl0cnl7cmV0dXJuIGV0LmFwcGx5KG4saC5xdWVyeVNlbGVjdG9yQWxsKGcpKSxufWNhdGNoKG0pe31maW5hbGx5e2N8fHQucmVtb3ZlQXR0cmlidXRlKFwiaWRcIil9fX1yZXR1cm4gVChlLnJlcGxhY2UobHQsXCIkMVwiKSx0LG4scil9ZnVuY3Rpb24gcigpe2Z1bmN0aW9uIGUobixyKXtyZXR1cm4gdC5wdXNoKG4rPVwiIFwiKT5rLmNhY2hlTGVuZ3RoJiZkZWxldGUgZVt0LnNoaWZ0KCldLGVbbl09cn12YXIgdD1bXTtyZXR1cm4gZX1mdW5jdGlvbiBpKGUpe3JldHVybiBlW1BdPSEwLGV9ZnVuY3Rpb24gbyhlKXt2YXIgdD1ILmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e3JldHVybiEhZSh0KX1jYXRjaChuKXtyZXR1cm4hMX1maW5hbGx5e3QucGFyZW50Tm9kZSYmdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHQpLHQ9bnVsbH19ZnVuY3Rpb24gYShlLHQpe2Zvcih2YXIgbj1lLnNwbGl0KFwifFwiKSxyPWUubGVuZ3RoO3ItLTspay5hdHRySGFuZGxlW25bcl1dPXR9ZnVuY3Rpb24gcyhlLHQpe3ZhciBuPXQmJmUscj1uJiYxPT09ZS5ub2RlVHlwZSYmMT09PXQubm9kZVR5cGUmJih+dC5zb3VyY2VJbmRleHx8SiktKH5lLnNvdXJjZUluZGV4fHxKKTtpZihyKXJldHVybiByO2lmKG4pZm9yKDtuPW4ubmV4dFNpYmxpbmc7KWlmKG49PT10KXJldHVybi0xO3JldHVybiBlPzE6LTF9ZnVuY3Rpb24gdShlKXtyZXR1cm4gZnVuY3Rpb24odCl7dmFyIG49dC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVyblwiaW5wdXRcIj09PW4mJnQudHlwZT09PWV9fWZ1bmN0aW9uIGwoZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe3ZhciBuPXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm4oXCJpbnB1dFwiPT09bnx8XCJidXR0b25cIj09PW4pJiZ0LnR5cGU9PT1lfX1mdW5jdGlvbiBjKGUpe3JldHVybiBpKGZ1bmN0aW9uKHQpe3JldHVybiB0PSt0LGkoZnVuY3Rpb24obixyKXtmb3IodmFyIGksbz1lKFtdLG4ubGVuZ3RoLHQpLGE9by5sZW5ndGg7YS0tOyluW2k9b1thXV0mJihuW2ldPSEocltpXT1uW2ldKSl9KX0pfWZ1bmN0aW9uIGYoKXt9ZnVuY3Rpb24gcChlLHQpe3ZhciByLGksbyxhLHMsdSxsLGM9eltlK1wiIFwiXTtpZihjKXJldHVybiB0PzA6Yy5zbGljZSgwKTtmb3Iocz1lLHU9W10sbD1rLnByZUZpbHRlcjtzOyl7KCFyfHwoaT1jdC5leGVjKHMpKSkmJihpJiYocz1zLnNsaWNlKGlbMF0ubGVuZ3RoKXx8cyksdS5wdXNoKG89W10pKSxyPSExLChpPWZ0LmV4ZWMocykpJiYocj1pLnNoaWZ0KCksby5wdXNoKHt2YWx1ZTpyLHR5cGU6aVswXS5yZXBsYWNlKGx0LFwiIFwiKX0pLHM9cy5zbGljZShyLmxlbmd0aCkpO2ZvcihhIGluIGsuZmlsdGVyKSEoaT15dFthXS5leGVjKHMpKXx8bFthXSYmIShpPWxbYV0oaSkpfHwocj1pLnNoaWZ0KCksby5wdXNoKHt2YWx1ZTpyLHR5cGU6YSxtYXRjaGVzOml9KSxzPXMuc2xpY2Uoci5sZW5ndGgpKTtpZighcilicmVha31yZXR1cm4gdD9zLmxlbmd0aDpzP24uZXJyb3IoZSk6eihlLHUpLnNsaWNlKDApfWZ1bmN0aW9uIGQoZSl7Zm9yKHZhciB0PTAsbj1lLmxlbmd0aCxyPVwiXCI7bj50O3QrKylyKz1lW3RdLnZhbHVlO3JldHVybiByfWZ1bmN0aW9uIGgoZSx0LG4pe3ZhciByPXQuZGlyLGk9biYmXCJwYXJlbnROb2RlXCI9PT1yLG89JCsrO3JldHVybiB0LmZpcnN0P2Z1bmN0aW9uKHQsbixvKXtmb3IoO3Q9dFtyXTspaWYoMT09PXQubm9kZVR5cGV8fGkpcmV0dXJuIGUodCxuLG8pfTpmdW5jdGlvbih0LG4sYSl7dmFyIHMsdSxsLGM9VytcIiBcIitvO2lmKGEpe2Zvcig7dD10W3JdOylpZigoMT09PXQubm9kZVR5cGV8fGkpJiZlKHQsbixhKSlyZXR1cm4hMH1lbHNlIGZvcig7dD10W3JdOylpZigxPT09dC5ub2RlVHlwZXx8aSlpZihsPXRbUF18fCh0W1BdPXt9KSwodT1sW3JdKSYmdVswXT09PWMpe2lmKChzPXVbMV0pPT09ITB8fHM9PT1OKXJldHVybiBzPT09ITB9ZWxzZSBpZih1PWxbcl09W2NdLHVbMV09ZSh0LG4sYSl8fE4sdVsxXT09PSEwKXJldHVybiEwfX1mdW5jdGlvbiBnKGUpe3JldHVybiBlLmxlbmd0aD4xP2Z1bmN0aW9uKHQsbixyKXtmb3IodmFyIGk9ZS5sZW5ndGg7aS0tOylpZighZVtpXSh0LG4scikpcmV0dXJuITE7cmV0dXJuITB9OmVbMF19ZnVuY3Rpb24gbShlLHQsbixyLGkpe2Zvcih2YXIgbyxhPVtdLHM9MCx1PWUubGVuZ3RoLGw9bnVsbCE9dDt1PnM7cysrKShvPWVbc10pJiYoIW58fG4obyxyLGkpKSYmKGEucHVzaChvKSxsJiZ0LnB1c2gocykpO3JldHVybiBhfWZ1bmN0aW9uIHkoZSx0LG4scixvLGEpe3JldHVybiByJiYhcltQXSYmKHI9eShyKSksbyYmIW9bUF0mJihvPXkobyxhKSksaShmdW5jdGlvbihpLGEscyx1KXt2YXIgbCxjLGYscD1bXSxkPVtdLGg9YS5sZW5ndGgsZz1pfHx4KHR8fFwiKlwiLHMubm9kZVR5cGU/W3NdOnMsW10pLHk9IWV8fCFpJiZ0P2c6bShnLHAsZSxzLHUpLHY9bj9vfHwoaT9lOmh8fHIpP1tdOmE6eTtpZihuJiZuKHksdixzLHUpLHIpZm9yKGw9bSh2LGQpLHIobCxbXSxzLHUpLGM9bC5sZW5ndGg7Yy0tOykoZj1sW2NdKSYmKHZbZFtjXV09ISh5W2RbY11dPWYpKTtpZihpKXtpZihvfHxlKXtpZihvKXtmb3IobD1bXSxjPXYubGVuZ3RoO2MtLTspKGY9dltjXSkmJmwucHVzaCh5W2NdPWYpO28obnVsbCx2PVtdLGwsdSl9Zm9yKGM9di5sZW5ndGg7Yy0tOykoZj12W2NdKSYmKGw9bz9udC5jYWxsKGksZik6cFtjXSk+LTEmJihpW2xdPSEoYVtsXT1mKSl9fWVsc2Ugdj1tKHY9PT1hP3Yuc3BsaWNlKGgsdi5sZW5ndGgpOnYpLG8/byhudWxsLGEsdix1KTpldC5hcHBseShhLHYpfSl9ZnVuY3Rpb24gdihlKXtmb3IodmFyIHQsbixyLGk9ZS5sZW5ndGgsbz1rLnJlbGF0aXZlW2VbMF0udHlwZV0sYT1vfHxrLnJlbGF0aXZlW1wiIFwiXSxzPW8/MTowLHU9aChmdW5jdGlvbihlKXtyZXR1cm4gZT09PXR9LGEsITApLGw9aChmdW5jdGlvbihlKXtyZXR1cm4gbnQuY2FsbCh0LGUpPi0xfSxhLCEwKSxjPVtmdW5jdGlvbihlLG4scil7cmV0dXJuIW8mJihyfHxuIT09ail8fCgodD1uKS5ub2RlVHlwZT91KGUsbixyKTpsKGUsbixyKSl9XTtpPnM7cysrKWlmKG49ay5yZWxhdGl2ZVtlW3NdLnR5cGVdKWM9W2goZyhjKSxuKV07ZWxzZXtpZihuPWsuZmlsdGVyW2Vbc10udHlwZV0uYXBwbHkobnVsbCxlW3NdLm1hdGNoZXMpLG5bUF0pe2ZvcihyPSsrcztpPnImJiFrLnJlbGF0aXZlW2Vbcl0udHlwZV07cisrKTtyZXR1cm4geShzPjEmJmcoYykscz4xJiZkKGUuc2xpY2UoMCxzLTEpLmNvbmNhdCh7dmFsdWU6XCIgXCI9PT1lW3MtMl0udHlwZT9cIipcIjpcIlwifSkpLnJlcGxhY2UobHQsXCIkMVwiKSxuLHI+cyYmdihlLnNsaWNlKHMscikpLGk+ciYmdihlPWUuc2xpY2UocikpLGk+ciYmZChlKSl9Yy5wdXNoKG4pfXJldHVybiBnKGMpfWZ1bmN0aW9uIGIoZSx0KXt2YXIgcj0wLG89dC5sZW5ndGg+MCxhPWUubGVuZ3RoPjAscz1mdW5jdGlvbihpLHMsdSxsLGMpe3ZhciBmLHAsZCxoPVtdLGc9MCx5PVwiMFwiLHY9aSYmW10sYj1udWxsIT1jLHg9aixUPWl8fGEmJmsuZmluZC5UQUcoXCIqXCIsYyYmcy5wYXJlbnROb2RlfHxzKSx3PVcrPW51bGw9PXg/MTpNYXRoLnJhbmRvbSgpfHwuMTtmb3IoYiYmKGo9cyE9PUgmJnMsTj1yKTtudWxsIT0oZj1UW3ldKTt5Kyspe2lmKGEmJmYpe2ZvcihwPTA7ZD1lW3ArK107KWlmKGQoZixzLHUpKXtsLnB1c2goZik7YnJlYWt9YiYmKFc9dyxOPSsrcil9byYmKChmPSFkJiZmKSYmZy0tLGkmJnYucHVzaChmKSl9aWYoZys9eSxvJiZ5IT09Zyl7Zm9yKHA9MDtkPXRbcCsrXTspZCh2LGgscyx1KTtpZihpKXtpZihnPjApZm9yKDt5LS07KXZbeV18fGhbeV18fChoW3ldPUsuY2FsbChsKSk7aD1tKGgpfWV0LmFwcGx5KGwsaCksYiYmIWkmJmgubGVuZ3RoPjAmJmcrdC5sZW5ndGg+MSYmbi51bmlxdWVTb3J0KGwpfXJldHVybiBiJiYoVz13LGo9eCksdn07cmV0dXJuIG8/aShzKTpzfWZ1bmN0aW9uIHgoZSx0LHIpe2Zvcih2YXIgaT0wLG89dC5sZW5ndGg7bz5pO2krKyluKGUsdFtpXSxyKTtyZXR1cm4gcn1mdW5jdGlvbiBUKGUsdCxuLHIpe3ZhciBpLG8sYSxzLHUsbD1wKGUpO2lmKCFyJiYxPT09bC5sZW5ndGgpe2lmKG89bFswXT1sWzBdLnNsaWNlKDApLG8ubGVuZ3RoPjImJlwiSURcIj09PShhPW9bMF0pLnR5cGUmJkMuZ2V0QnlJZCYmOT09PXQubm9kZVR5cGUmJl8mJmsucmVsYXRpdmVbb1sxXS50eXBlXSl7aWYodD0oay5maW5kLklEKGEubWF0Y2hlc1swXS5yZXBsYWNlKEN0LE50KSx0KXx8W10pWzBdLCF0KXJldHVybiBuO2U9ZS5zbGljZShvLnNoaWZ0KCkudmFsdWUubGVuZ3RoKX1mb3IoaT15dC5uZWVkc0NvbnRleHQudGVzdChlKT8wOm8ubGVuZ3RoO2ktLSYmKGE9b1tpXSwhay5yZWxhdGl2ZVtzPWEudHlwZV0pOylpZigodT1rLmZpbmRbc10pJiYocj11KGEubWF0Y2hlc1swXS5yZXBsYWNlKEN0LE50KSxkdC50ZXN0KG9bMF0udHlwZSkmJnQucGFyZW50Tm9kZXx8dCkpKXtpZihvLnNwbGljZShpLDEpLGU9ci5sZW5ndGgmJmQobyksIWUpcmV0dXJuIGV0LmFwcGx5KG4sciksbjticmVha319cmV0dXJuIEEoZSxsKShyLHQsIV8sbixkdC50ZXN0KGUpKSxufXZhciB3LEMsTixrLEUsUyxBLGosRCxMLEgscSxfLE0sTyxGLEIsUD1cInNpenpsZVwiKy1uZXcgRGF0ZSxSPWUuZG9jdW1lbnQsVz0wLCQ9MCxJPXIoKSx6PXIoKSxYPXIoKSxVPSExLFY9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZT09PXQ/KFU9ITAsMCk6MH0sWT10eXBlb2YgdCxKPTE8PDMxLEc9e30uaGFzT3duUHJvcGVydHksUT1bXSxLPVEucG9wLFo9US5wdXNoLGV0PVEucHVzaCx0dD1RLnNsaWNlLG50PVEuaW5kZXhPZnx8ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PTAsbj10aGlzLmxlbmd0aDtuPnQ7dCsrKWlmKHRoaXNbdF09PT1lKXJldHVybiB0O3JldHVybi0xfSxydD1cImNoZWNrZWR8c2VsZWN0ZWR8YXN5bmN8YXV0b2ZvY3VzfGF1dG9wbGF5fGNvbnRyb2xzfGRlZmVyfGRpc2FibGVkfGhpZGRlbnxpc21hcHxsb29wfG11bHRpcGxlfG9wZW58cmVhZG9ubHl8cmVxdWlyZWR8c2NvcGVkXCIsaXQ9XCJbXFxcXHgyMFxcXFx0XFxcXHJcXFxcblxcXFxmXVwiLG90PVwiKD86XFxcXFxcXFwufFtcXFxcdy1dfFteXFxcXHgwMC1cXFxceGEwXSkrXCIsYXQ9b3QucmVwbGFjZShcIndcIixcIncjXCIpLHN0PVwiXFxcXFtcIitpdCtcIiooXCIrb3QrXCIpXCIraXQrXCIqKD86KFsqXiR8IX5dPz0pXCIraXQrXCIqKD86KFsnXFxcIl0pKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXSkqPylcXFxcM3woXCIrYXQrXCIpfCl8KVwiK2l0K1wiKlxcXFxdXCIsdXQ9XCI6KFwiK290K1wiKSg/OlxcXFwoKChbJ1xcXCJdKSgoPzpcXFxcXFxcXC58W15cXFxcXFxcXF0pKj8pXFxcXDN8KCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcKClbXFxcXF1dfFwiK3N0LnJlcGxhY2UoMyw4KStcIikqKXwuKilcXFxcKXwpXCIsbHQ9UmVnRXhwKFwiXlwiK2l0K1wiK3woKD86XnxbXlxcXFxcXFxcXSkoPzpcXFxcXFxcXC4pKilcIitpdCtcIiskXCIsXCJnXCIpLGN0PVJlZ0V4cChcIl5cIitpdCtcIiosXCIraXQrXCIqXCIpLGZ0PVJlZ0V4cChcIl5cIitpdCtcIiooWz4rfl18XCIraXQrXCIpXCIraXQrXCIqXCIpLGR0PVJlZ0V4cChpdCtcIipbK35dXCIpLGh0PVJlZ0V4cChcIj1cIitpdCtcIiooW15cXFxcXSdcXFwiXSopXCIraXQrXCIqXFxcXF1cIixcImdcIiksZ3Q9UmVnRXhwKHV0KSxtdD1SZWdFeHAoXCJeXCIrYXQrXCIkXCIpLHl0PXtJRDpSZWdFeHAoXCJeIyhcIitvdCtcIilcIiksQ0xBU1M6UmVnRXhwKFwiXlxcXFwuKFwiK290K1wiKVwiKSxUQUc6UmVnRXhwKFwiXihcIitvdC5yZXBsYWNlKFwid1wiLFwidypcIikrXCIpXCIpLEFUVFI6UmVnRXhwKFwiXlwiK3N0KSxQU0VVRE86UmVnRXhwKFwiXlwiK3V0KSxDSElMRDpSZWdFeHAoXCJeOihvbmx5fGZpcnN0fGxhc3R8bnRofG50aC1sYXN0KS0oY2hpbGR8b2YtdHlwZSkoPzpcXFxcKFwiK2l0K1wiKihldmVufG9kZHwoKFsrLV18KShcXFxcZCopbnwpXCIraXQrXCIqKD86KFsrLV18KVwiK2l0K1wiKihcXFxcZCspfCkpXCIraXQrXCIqXFxcXCl8KVwiLFwiaVwiKSxib29sOlJlZ0V4cChcIl4oPzpcIitydCtcIikkXCIsXCJpXCIpLG5lZWRzQ29udGV4dDpSZWdFeHAoXCJeXCIraXQrXCIqWz4rfl18OihldmVufG9kZHxlcXxndHxsdHxudGh8Zmlyc3R8bGFzdCkoPzpcXFxcKFwiK2l0K1wiKigoPzotXFxcXGQpP1xcXFxkKilcIitpdCtcIipcXFxcKXwpKD89W14tXXwkKVwiLFwiaVwiKX0sdnQ9L15bXntdK1xce1xccypcXFtuYXRpdmUgXFx3LyxidD0vXig/OiMoW1xcdy1dKyl8KFxcdyspfFxcLihbXFx3LV0rKSkkLyx4dD0vXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pLFR0PS9eaFxcZCQvaSx3dD0vJ3xcXFxcL2csQ3Q9UmVnRXhwKFwiXFxcXFxcXFwoW1xcXFxkYS1mXXsxLDZ9XCIraXQrXCI/fChcIitpdCtcIil8LilcIixcImlnXCIpLE50PWZ1bmN0aW9uKGUsdCxuKXt2YXIgcj1cIjB4XCIrdC02NTUzNjtyZXR1cm4gciE9PXJ8fG4/dDowPnI/U3RyaW5nLmZyb21DaGFyQ29kZShyKzY1NTM2KTpTdHJpbmcuZnJvbUNoYXJDb2RlKDU1Mjk2fHI+PjEwLDU2MzIwfDEwMjMmcil9O3RyeXtldC5hcHBseShRPXR0LmNhbGwoUi5jaGlsZE5vZGVzKSxSLmNoaWxkTm9kZXMpLFFbUi5jaGlsZE5vZGVzLmxlbmd0aF0ubm9kZVR5cGV9Y2F0Y2goa3Qpe2V0PXthcHBseTpRLmxlbmd0aD9mdW5jdGlvbihlLHQpe1ouYXBwbHkoZSx0dC5jYWxsKHQpKX06ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG49ZS5sZW5ndGgscj0wO2VbbisrXT10W3IrK107KTtlLmxlbmd0aD1uLTF9fX1TPW4uaXNYTUw9ZnVuY3Rpb24oZSl7dmFyIHQ9ZSYmKGUub3duZXJEb2N1bWVudHx8ZSkuZG9jdW1lbnRFbGVtZW50O3JldHVybiB0P1wiSFRNTFwiIT09dC5ub2RlTmFtZTohMX0sQz1uLnN1cHBvcnQ9e30sTD1uLnNldERvY3VtZW50PWZ1bmN0aW9uKGUpe3ZhciBuPWU/ZS5vd25lckRvY3VtZW50fHxlOlIscj1uLmRlZmF1bHRWaWV3O3JldHVybiBuIT09SCYmOT09PW4ubm9kZVR5cGUmJm4uZG9jdW1lbnRFbGVtZW50PyhIPW4scT1uLmRvY3VtZW50RWxlbWVudCxfPSFTKG4pLHImJnIuYXR0YWNoRXZlbnQmJnIhPT1yLnRvcCYmci5hdHRhY2hFdmVudChcIm9uYmVmb3JldW5sb2FkXCIsZnVuY3Rpb24oKXtMKCl9KSxDLmF0dHJpYnV0ZXM9byhmdW5jdGlvbihlKXtyZXR1cm4gZS5jbGFzc05hbWU9XCJpXCIsIWUuZ2V0QXR0cmlidXRlKFwiY2xhc3NOYW1lXCIpfSksQy5nZXRFbGVtZW50c0J5VGFnTmFtZT1vKGZ1bmN0aW9uKGUpe3JldHVybiBlLmFwcGVuZENoaWxkKG4uY3JlYXRlQ29tbWVudChcIlwiKSksIWUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLmxlbmd0aH0pLEMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZT1vKGZ1bmN0aW9uKGUpe3JldHVybiBlLmlubmVySFRNTD1cIjxkaXYgY2xhc3M9J2EnPjwvZGl2PjxkaXYgY2xhc3M9J2EgaSc+PC9kaXY+XCIsZS5maXJzdENoaWxkLmNsYXNzTmFtZT1cImlcIiwyPT09ZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiaVwiKS5sZW5ndGh9KSxDLmdldEJ5SWQ9byhmdW5jdGlvbihlKXtyZXR1cm4gcS5hcHBlbmRDaGlsZChlKS5pZD1QLCFuLmdldEVsZW1lbnRzQnlOYW1lfHwhbi5nZXRFbGVtZW50c0J5TmFtZShQKS5sZW5ndGh9KSxDLmdldEJ5SWQ/KGsuZmluZC5JRD1mdW5jdGlvbihlLHQpe2lmKHR5cGVvZiB0LmdldEVsZW1lbnRCeUlkIT09WSYmXyl7dmFyIG49dC5nZXRFbGVtZW50QnlJZChlKTtyZXR1cm4gbiYmbi5wYXJlbnROb2RlP1tuXTpbXX19LGsuZmlsdGVyLklEPWZ1bmN0aW9uKGUpe3ZhciB0PWUucmVwbGFjZShDdCxOdCk7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBlLmdldEF0dHJpYnV0ZShcImlkXCIpPT09dH19KTooZGVsZXRlIGsuZmluZC5JRCxrLmZpbHRlci5JRD1mdW5jdGlvbihlKXt2YXIgdD1lLnJlcGxhY2UoQ3QsTnQpO3JldHVybiBmdW5jdGlvbihlKXt2YXIgbj10eXBlb2YgZS5nZXRBdHRyaWJ1dGVOb2RlIT09WSYmZS5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIik7cmV0dXJuIG4mJm4udmFsdWU9PT10fX0pLGsuZmluZC5UQUc9Qy5nZXRFbGVtZW50c0J5VGFnTmFtZT9mdW5jdGlvbihlLG4pe3JldHVybiB0eXBlb2Ygbi5nZXRFbGVtZW50c0J5VGFnTmFtZSE9PVk/bi5nZXRFbGVtZW50c0J5VGFnTmFtZShlKTp0fTpmdW5jdGlvbihlLHQpe3ZhciBuLHI9W10saT0wLG89dC5nZXRFbGVtZW50c0J5VGFnTmFtZShlKTtpZihcIipcIj09PWUpe2Zvcig7bj1vW2krK107KTE9PT1uLm5vZGVUeXBlJiZyLnB1c2gobik7cmV0dXJuIHJ9cmV0dXJuIG99LGsuZmluZC5DTEFTUz1DLmdldEVsZW1lbnRzQnlDbGFzc05hbWUmJmZ1bmN0aW9uKGUsbil7cmV0dXJuIHR5cGVvZiBuLmdldEVsZW1lbnRzQnlDbGFzc05hbWUhPT1ZJiZfP24uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShlKTp0fSxPPVtdLE09W10sKEMucXNhPXZ0LnRlc3Qobi5xdWVyeVNlbGVjdG9yQWxsKSkmJihvKGZ1bmN0aW9uKGUpe2UuaW5uZXJIVE1MPVwiPHNlbGVjdD48b3B0aW9uIHNlbGVjdGVkPScnPjwvb3B0aW9uPjwvc2VsZWN0PlwiLGUucXVlcnlTZWxlY3RvckFsbChcIltzZWxlY3RlZF1cIikubGVuZ3RofHxNLnB1c2goXCJcXFxcW1wiK2l0K1wiKig/OnZhbHVlfFwiK3J0K1wiKVwiKSxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCI6Y2hlY2tlZFwiKS5sZW5ndGh8fE0ucHVzaChcIjpjaGVja2VkXCIpfSksbyhmdW5jdGlvbihlKXt2YXIgdD1uLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTt0LnNldEF0dHJpYnV0ZShcInR5cGVcIixcImhpZGRlblwiKSxlLmFwcGVuZENoaWxkKHQpLnNldEF0dHJpYnV0ZShcInRcIixcIlwiKSxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbdF49JyddXCIpLmxlbmd0aCYmTS5wdXNoKFwiWypeJF09XCIraXQrXCIqKD86Jyd8XFxcIlxcXCIpXCIpLGUucXVlcnlTZWxlY3RvckFsbChcIjplbmFibGVkXCIpLmxlbmd0aHx8TS5wdXNoKFwiOmVuYWJsZWRcIixcIjpkaXNhYmxlZFwiKSxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCIqLDp4XCIpLE0ucHVzaChcIiwuKjpcIil9KSksKEMubWF0Y2hlc1NlbGVjdG9yPXZ0LnRlc3QoRj1xLndlYmtpdE1hdGNoZXNTZWxlY3Rvcnx8cS5tb3pNYXRjaGVzU2VsZWN0b3J8fHEub01hdGNoZXNTZWxlY3Rvcnx8cS5tc01hdGNoZXNTZWxlY3RvcikpJiZvKGZ1bmN0aW9uKGUpe0MuZGlzY29ubmVjdGVkTWF0Y2g9Ri5jYWxsKGUsXCJkaXZcIiksRi5jYWxsKGUsXCJbcyE9JyddOnhcIiksTy5wdXNoKFwiIT1cIix1dCl9KSxNPU0ubGVuZ3RoJiZSZWdFeHAoTS5qb2luKFwifFwiKSksTz1PLmxlbmd0aCYmUmVnRXhwKE8uam9pbihcInxcIikpLEI9dnQudGVzdChxLmNvbnRhaW5zKXx8cS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbj9mdW5jdGlvbihlLHQpe3ZhciBuPTk9PT1lLm5vZGVUeXBlP2UuZG9jdW1lbnRFbGVtZW50OmUscj10JiZ0LnBhcmVudE5vZGU7cmV0dXJuIGU9PT1yfHwhKCFyfHwxIT09ci5ub2RlVHlwZXx8IShuLmNvbnRhaW5zP24uY29udGFpbnMocik6ZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiYmMTYmZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihyKSkpfTpmdW5jdGlvbihlLHQpe2lmKHQpZm9yKDt0PXQucGFyZW50Tm9kZTspaWYodD09PWUpcmV0dXJuITA7cmV0dXJuITF9LFY9cS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbj9mdW5jdGlvbihlLHQpe2lmKGU9PT10KXJldHVybiBVPSEwLDA7dmFyIHI9dC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiYmZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiYmZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0KTtyZXR1cm4gcj8xJnJ8fCFDLnNvcnREZXRhY2hlZCYmdC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlKT09PXI/ZT09PW58fEIoUixlKT8tMTp0PT09bnx8QihSLHQpPzE6RD9udC5jYWxsKEQsZSktbnQuY2FsbChELHQpOjA6NCZyPy0xOjE6ZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbj8tMToxfTpmdW5jdGlvbihlLHQpe3ZhciByLGk9MCxvPWUucGFyZW50Tm9kZSxhPXQucGFyZW50Tm9kZSx1PVtlXSxsPVt0XTtpZihlPT09dClyZXR1cm4gVT0hMCwwO2lmKCFvfHwhYSlyZXR1cm4gZT09PW4/LTE6dD09PW4/MTpvPy0xOmE/MTpEP250LmNhbGwoRCxlKS1udC5jYWxsKEQsdCk6MDtpZihvPT09YSlyZXR1cm4gcyhlLHQpO2ZvcihyPWU7cj1yLnBhcmVudE5vZGU7KXUudW5zaGlmdChyKTtmb3Iocj10O3I9ci5wYXJlbnROb2RlOylsLnVuc2hpZnQocik7Zm9yKDt1W2ldPT09bFtpXTspaSsrO3JldHVybiBpP3ModVtpXSxsW2ldKTp1W2ldPT09Uj8tMTpsW2ldPT09Uj8xOjB9LG4pOkh9LG4ubWF0Y2hlcz1mdW5jdGlvbihlLHQpe3JldHVybiBuKGUsbnVsbCxudWxsLHQpfSxuLm1hdGNoZXNTZWxlY3Rvcj1mdW5jdGlvbihlLHQpe2lmKChlLm93bmVyRG9jdW1lbnR8fGUpIT09SCYmTChlKSx0PXQucmVwbGFjZShodCxcIj0nJDEnXVwiKSwhKCFDLm1hdGNoZXNTZWxlY3Rvcnx8IV98fE8mJk8udGVzdCh0KXx8TSYmTS50ZXN0KHQpKSl0cnl7dmFyIHI9Ri5jYWxsKGUsdCk7aWYocnx8Qy5kaXNjb25uZWN0ZWRNYXRjaHx8ZS5kb2N1bWVudCYmMTEhPT1lLmRvY3VtZW50Lm5vZGVUeXBlKXJldHVybiByfWNhdGNoKGkpe31yZXR1cm4gbih0LEgsbnVsbCxbZV0pLmxlbmd0aD4wfSxuLmNvbnRhaW5zPWZ1bmN0aW9uKGUsdCl7cmV0dXJuKGUub3duZXJEb2N1bWVudHx8ZSkhPT1IJiZMKGUpLEIoZSx0KX0sbi5hdHRyPWZ1bmN0aW9uKGUsbil7KGUub3duZXJEb2N1bWVudHx8ZSkhPT1IJiZMKGUpO3ZhciByPWsuYXR0ckhhbmRsZVtuLnRvTG93ZXJDYXNlKCldLGk9ciYmRy5jYWxsKGsuYXR0ckhhbmRsZSxuLnRvTG93ZXJDYXNlKCkpP3IoZSxuLCFfKTp0O3JldHVybiBpPT09dD9DLmF0dHJpYnV0ZXN8fCFfP2UuZ2V0QXR0cmlidXRlKG4pOihpPWUuZ2V0QXR0cmlidXRlTm9kZShuKSkmJmkuc3BlY2lmaWVkP2kudmFsdWU6bnVsbDppfSxuLmVycm9yPWZ1bmN0aW9uKGUpe3Rocm93IEVycm9yKFwiU3ludGF4IGVycm9yLCB1bnJlY29nbml6ZWQgZXhwcmVzc2lvbjogXCIrZSl9LG4udW5pcXVlU29ydD1mdW5jdGlvbihlKXt2YXIgdCxuPVtdLHI9MCxpPTA7aWYoVT0hQy5kZXRlY3REdXBsaWNhdGVzLEQ9IUMuc29ydFN0YWJsZSYmZS5zbGljZSgwKSxlLnNvcnQoViksVSl7Zm9yKDt0PWVbaSsrXTspdD09PWVbaV0mJihyPW4ucHVzaChpKSk7Zm9yKDtyLS07KWUuc3BsaWNlKG5bcl0sMSl9cmV0dXJuIGV9LEU9bi5nZXRUZXh0PWZ1bmN0aW9uKGUpe3ZhciB0LG49XCJcIixyPTAsaT1lLm5vZGVUeXBlO2lmKGkpe2lmKDE9PT1pfHw5PT09aXx8MTE9PT1pKXtpZihcInN0cmluZ1wiPT10eXBlb2YgZS50ZXh0Q29udGVudClyZXR1cm4gZS50ZXh0Q29udGVudDtmb3IoZT1lLmZpcnN0Q2hpbGQ7ZTtlPWUubmV4dFNpYmxpbmcpbis9RShlKX1lbHNlIGlmKDM9PT1pfHw0PT09aSlyZXR1cm4gZS5ub2RlVmFsdWV9ZWxzZSBmb3IoO3Q9ZVtyXTtyKyspbis9RSh0KTtyZXR1cm4gbn0saz1uLnNlbGVjdG9ycz17Y2FjaGVMZW5ndGg6NTAsY3JlYXRlUHNldWRvOmksbWF0Y2g6eXQsYXR0ckhhbmRsZTp7fSxmaW5kOnt9LHJlbGF0aXZlOntcIj5cIjp7ZGlyOlwicGFyZW50Tm9kZVwiLGZpcnN0OiEwfSxcIiBcIjp7ZGlyOlwicGFyZW50Tm9kZVwifSxcIitcIjp7ZGlyOlwicHJldmlvdXNTaWJsaW5nXCIsZmlyc3Q6ITB9LFwiflwiOntkaXI6XCJwcmV2aW91c1NpYmxpbmdcIn19LHByZUZpbHRlcjp7QVRUUjpmdW5jdGlvbihlKXtyZXR1cm4gZVsxXT1lWzFdLnJlcGxhY2UoQ3QsTnQpLGVbM109KGVbNF18fGVbNV18fFwiXCIpLnJlcGxhY2UoQ3QsTnQpLFwifj1cIj09PWVbMl0mJihlWzNdPVwiIFwiK2VbM10rXCIgXCIpLGUuc2xpY2UoMCw0KX0sQ0hJTEQ6ZnVuY3Rpb24oZSl7cmV0dXJuIGVbMV09ZVsxXS50b0xvd2VyQ2FzZSgpLFwibnRoXCI9PT1lWzFdLnNsaWNlKDAsMyk/KGVbM118fG4uZXJyb3IoZVswXSksZVs0XT0rKGVbNF0/ZVs1XSsoZVs2XXx8MSk6MiooXCJldmVuXCI9PT1lWzNdfHxcIm9kZFwiPT09ZVszXSkpLGVbNV09KyhlWzddK2VbOF18fFwib2RkXCI9PT1lWzNdKSk6ZVszXSYmbi5lcnJvcihlWzBdKSxlfSxQU0VVRE86ZnVuY3Rpb24oZSl7dmFyIG4scj0hZVs1XSYmZVsyXTtyZXR1cm4geXQuQ0hJTEQudGVzdChlWzBdKT9udWxsOihlWzNdJiZlWzRdIT09dD9lWzJdPWVbNF06ciYmZ3QudGVzdChyKSYmKG49cChyLCEwKSkmJihuPXIuaW5kZXhPZihcIilcIixyLmxlbmd0aC1uKS1yLmxlbmd0aCkmJihlWzBdPWVbMF0uc2xpY2UoMCxuKSxlWzJdPXIuc2xpY2UoMCxuKSksZS5zbGljZSgwLDMpKX19LGZpbHRlcjp7VEFHOmZ1bmN0aW9uKGUpe3ZhciB0PWUucmVwbGFjZShDdCxOdCkudG9Mb3dlckNhc2UoKTtyZXR1cm5cIipcIj09PWU/ZnVuY3Rpb24oKXtyZXR1cm4hMH06ZnVuY3Rpb24oZSl7cmV0dXJuIGUubm9kZU5hbWUmJmUubm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PXR9fSxDTEFTUzpmdW5jdGlvbihlKXt2YXIgdD1JW2UrXCIgXCJdO3JldHVybiB0fHwodD1SZWdFeHAoXCIoXnxcIitpdCtcIilcIitlK1wiKFwiK2l0K1wifCQpXCIpKSYmSShlLGZ1bmN0aW9uKGUpe3JldHVybiB0LnRlc3QoXCJzdHJpbmdcIj09dHlwZW9mIGUuY2xhc3NOYW1lJiZlLmNsYXNzTmFtZXx8dHlwZW9mIGUuZ2V0QXR0cmlidXRlIT09WSYmZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKXx8XCJcIil9KX0sQVRUUjpmdW5jdGlvbihlLHQscil7cmV0dXJuIGZ1bmN0aW9uKGkpe3ZhciBvPW4uYXR0cihpLGUpO3JldHVybiBudWxsPT1vP1wiIT1cIj09PXQ6dD8obys9XCJcIixcIj1cIj09PXQ/bz09PXI6XCIhPVwiPT09dD9vIT09cjpcIl49XCI9PT10P3ImJjA9PT1vLmluZGV4T2Yocik6XCIqPVwiPT09dD9yJiZvLmluZGV4T2Yocik+LTE6XCIkPVwiPT09dD9yJiZvLnNsaWNlKC1yLmxlbmd0aCk9PT1yOlwifj1cIj09PXQ/KFwiIFwiK28rXCIgXCIpLmluZGV4T2Yocik+LTE6XCJ8PVwiPT09dD9vPT09cnx8by5zbGljZSgwLHIubGVuZ3RoKzEpPT09citcIi1cIjohMSk6ITB9fSxDSElMRDpmdW5jdGlvbihlLHQsbixyLGkpe3ZhciBvPVwibnRoXCIhPT1lLnNsaWNlKDAsMyksYT1cImxhc3RcIiE9PWUuc2xpY2UoLTQpLHM9XCJvZi10eXBlXCI9PT10O3JldHVybiAxPT09ciYmMD09PWk/ZnVuY3Rpb24oZSl7cmV0dXJuISFlLnBhcmVudE5vZGV9OmZ1bmN0aW9uKHQsbix1KXt2YXIgbCxjLGYscCxkLGgsZz1vIT09YT9cIm5leHRTaWJsaW5nXCI6XCJwcmV2aW91c1NpYmxpbmdcIixtPXQucGFyZW50Tm9kZSx5PXMmJnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSx2PSF1JiYhcztcbmlmKG0pe2lmKG8pe2Zvcig7Zzspe2ZvcihmPXQ7Zj1mW2ddOylpZihzP2Yubm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PXk6MT09PWYubm9kZVR5cGUpcmV0dXJuITE7aD1nPVwib25seVwiPT09ZSYmIWgmJlwibmV4dFNpYmxpbmdcIn1yZXR1cm4hMH1pZihoPVthP20uZmlyc3RDaGlsZDptLmxhc3RDaGlsZF0sYSYmdil7Zm9yKGM9bVtQXXx8KG1bUF09e30pLGw9Y1tlXXx8W10sZD1sWzBdPT09VyYmbFsxXSxwPWxbMF09PT1XJiZsWzJdLGY9ZCYmbS5jaGlsZE5vZGVzW2RdO2Y9KytkJiZmJiZmW2ddfHwocD1kPTApfHxoLnBvcCgpOylpZigxPT09Zi5ub2RlVHlwZSYmKytwJiZmPT09dCl7Y1tlXT1bVyxkLHBdO2JyZWFrfX1lbHNlIGlmKHYmJihsPSh0W1BdfHwodFtQXT17fSkpW2VdKSYmbFswXT09PVcpcD1sWzFdO2Vsc2UgZm9yKDsoZj0rK2QmJmYmJmZbZ118fChwPWQ9MCl8fGgucG9wKCkpJiYoKHM/Zi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpIT09eToxIT09Zi5ub2RlVHlwZSl8fCErK3B8fCh2JiYoKGZbUF18fChmW1BdPXt9KSlbZV09W1cscF0pLGYhPT10KSk7KTtyZXR1cm4gcC09aSxwPT09cnx8MD09PXAlciYmcC9yPj0wfX19LFBTRVVETzpmdW5jdGlvbihlLHQpe3ZhciByLG89ay5wc2V1ZG9zW2VdfHxrLnNldEZpbHRlcnNbZS50b0xvd2VyQ2FzZSgpXXx8bi5lcnJvcihcInVuc3VwcG9ydGVkIHBzZXVkbzogXCIrZSk7cmV0dXJuIG9bUF0/byh0KTpvLmxlbmd0aD4xPyhyPVtlLGUsXCJcIix0XSxrLnNldEZpbHRlcnMuaGFzT3duUHJvcGVydHkoZS50b0xvd2VyQ2FzZSgpKT9pKGZ1bmN0aW9uKGUsbil7Zm9yKHZhciByLGk9byhlLHQpLGE9aS5sZW5ndGg7YS0tOylyPW50LmNhbGwoZSxpW2FdKSxlW3JdPSEobltyXT1pW2FdKX0pOmZ1bmN0aW9uKGUpe3JldHVybiBvKGUsMCxyKX0pOm99fSxwc2V1ZG9zOntub3Q6aShmdW5jdGlvbihlKXt2YXIgdD1bXSxuPVtdLHI9QShlLnJlcGxhY2UobHQsXCIkMVwiKSk7cmV0dXJuIHJbUF0/aShmdW5jdGlvbihlLHQsbixpKXtmb3IodmFyIG8sYT1yKGUsbnVsbCxpLFtdKSxzPWUubGVuZ3RoO3MtLTspKG89YVtzXSkmJihlW3NdPSEodFtzXT1vKSl9KTpmdW5jdGlvbihlLGksbyl7cmV0dXJuIHRbMF09ZSxyKHQsbnVsbCxvLG4pLCFuLnBvcCgpfX0pLGhhczppKGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gbihlLHQpLmxlbmd0aD4wfX0pLGNvbnRhaW5zOmkoZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybih0LnRleHRDb250ZW50fHx0LmlubmVyVGV4dHx8RSh0KSkuaW5kZXhPZihlKT4tMX19KSxsYW5nOmkoZnVuY3Rpb24oZSl7cmV0dXJuIG10LnRlc3QoZXx8XCJcIil8fG4uZXJyb3IoXCJ1bnN1cHBvcnRlZCBsYW5nOiBcIitlKSxlPWUucmVwbGFjZShDdCxOdCkudG9Mb3dlckNhc2UoKSxmdW5jdGlvbih0KXt2YXIgbjtkbyBpZihuPV8/dC5sYW5nOnQuZ2V0QXR0cmlidXRlKFwieG1sOmxhbmdcIil8fHQuZ2V0QXR0cmlidXRlKFwibGFuZ1wiKSlyZXR1cm4gbj1uLnRvTG93ZXJDYXNlKCksbj09PWV8fDA9PT1uLmluZGV4T2YoZStcIi1cIik7d2hpbGUoKHQ9dC5wYXJlbnROb2RlKSYmMT09PXQubm9kZVR5cGUpO3JldHVybiExfX0pLHRhcmdldDpmdW5jdGlvbih0KXt2YXIgbj1lLmxvY2F0aW9uJiZlLmxvY2F0aW9uLmhhc2g7cmV0dXJuIG4mJm4uc2xpY2UoMSk9PT10LmlkfSxyb290OmZ1bmN0aW9uKGUpe3JldHVybiBlPT09cX0sZm9jdXM6ZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT1ILmFjdGl2ZUVsZW1lbnQmJighSC5oYXNGb2N1c3x8SC5oYXNGb2N1cygpKSYmISEoZS50eXBlfHxlLmhyZWZ8fH5lLnRhYkluZGV4KX0sZW5hYmxlZDpmdW5jdGlvbihlKXtyZXR1cm4gZS5kaXNhYmxlZD09PSExfSxkaXNhYmxlZDpmdW5jdGlvbihlKXtyZXR1cm4gZS5kaXNhYmxlZD09PSEwfSxjaGVja2VkOmZ1bmN0aW9uKGUpe3ZhciB0PWUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm5cImlucHV0XCI9PT10JiYhIWUuY2hlY2tlZHx8XCJvcHRpb25cIj09PXQmJiEhZS5zZWxlY3RlZH0sc2VsZWN0ZWQ6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucGFyZW50Tm9kZSYmZS5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXgsZS5zZWxlY3RlZD09PSEwfSxlbXB0eTpmdW5jdGlvbihlKXtmb3IoZT1lLmZpcnN0Q2hpbGQ7ZTtlPWUubmV4dFNpYmxpbmcpaWYoZS5ub2RlTmFtZT5cIkBcInx8Mz09PWUubm9kZVR5cGV8fDQ9PT1lLm5vZGVUeXBlKXJldHVybiExO3JldHVybiEwfSxwYXJlbnQ6ZnVuY3Rpb24oZSl7cmV0dXJuIWsucHNldWRvcy5lbXB0eShlKX0saGVhZGVyOmZ1bmN0aW9uKGUpe3JldHVybiBUdC50ZXN0KGUubm9kZU5hbWUpfSxpbnB1dDpmdW5jdGlvbihlKXtyZXR1cm4geHQudGVzdChlLm5vZGVOYW1lKX0sYnV0dG9uOmZ1bmN0aW9uKGUpe3ZhciB0PWUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm5cImlucHV0XCI9PT10JiZcImJ1dHRvblwiPT09ZS50eXBlfHxcImJ1dHRvblwiPT09dH0sdGV4dDpmdW5jdGlvbihlKXt2YXIgdDtyZXR1cm5cImlucHV0XCI9PT1lLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJlwidGV4dFwiPT09ZS50eXBlJiYobnVsbD09KHQ9ZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKXx8dC50b0xvd2VyQ2FzZSgpPT09ZS50eXBlKX0sZmlyc3Q6YyhmdW5jdGlvbigpe3JldHVyblswXX0pLGxhc3Q6YyhmdW5jdGlvbihlLHQpe3JldHVyblt0LTFdfSksZXE6YyhmdW5jdGlvbihlLHQsbil7cmV0dXJuWzA+bj9uK3Q6bl19KSxldmVuOmMoZnVuY3Rpb24oZSx0KXtmb3IodmFyIG49MDt0Pm47bis9MillLnB1c2gobik7cmV0dXJuIGV9KSxvZGQ6YyhmdW5jdGlvbihlLHQpe2Zvcih2YXIgbj0xO3Q+bjtuKz0yKWUucHVzaChuKTtyZXR1cm4gZX0pLGx0OmMoZnVuY3Rpb24oZSx0LG4pe2Zvcih2YXIgcj0wPm4/bit0Om47LS1yPj0wOyllLnB1c2gocik7cmV0dXJuIGV9KSxndDpjKGZ1bmN0aW9uKGUsdCxuKXtmb3IodmFyIHI9MD5uP24rdDpuO3Q+KytyOyllLnB1c2gocik7cmV0dXJuIGV9KX19LGsucHNldWRvcy5udGg9ay5wc2V1ZG9zLmVxO2Zvcih3IGlue3JhZGlvOiEwLGNoZWNrYm94OiEwLGZpbGU6ITAscGFzc3dvcmQ6ITAsaW1hZ2U6ITB9KWsucHNldWRvc1t3XT11KHcpO2Zvcih3IGlue3N1Ym1pdDohMCxyZXNldDohMH0pay5wc2V1ZG9zW3ddPWwodyk7Zi5wcm90b3R5cGU9ay5maWx0ZXJzPWsucHNldWRvcyxrLnNldEZpbHRlcnM9bmV3IGYsQT1uLmNvbXBpbGU9ZnVuY3Rpb24oZSx0KXt2YXIgbixyPVtdLGk9W10sbz1YW2UrXCIgXCJdO2lmKCFvKXtmb3IodHx8KHQ9cChlKSksbj10Lmxlbmd0aDtuLS07KW89dih0W25dKSxvW1BdP3IucHVzaChvKTppLnB1c2gobyk7bz1YKGUsYihpLHIpKX1yZXR1cm4gb30sQy5zb3J0U3RhYmxlPVAuc3BsaXQoXCJcIikuc29ydChWKS5qb2luKFwiXCIpPT09UCxDLmRldGVjdER1cGxpY2F0ZXM9VSxMKCksQy5zb3J0RGV0YWNoZWQ9byhmdW5jdGlvbihlKXtyZXR1cm4gMSZlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKEguY3JlYXRlRWxlbWVudChcImRpdlwiKSl9KSxvKGZ1bmN0aW9uKGUpe3JldHVybiBlLmlubmVySFRNTD1cIjxhIGhyZWY9JyMnPjwvYT5cIixcIiNcIj09PWUuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpfSl8fGEoXCJ0eXBlfGhyZWZ8aGVpZ2h0fHdpZHRoXCIsZnVuY3Rpb24oZSxuLHIpe3JldHVybiByP3Q6ZS5nZXRBdHRyaWJ1dGUobixcInR5cGVcIj09PW4udG9Mb3dlckNhc2UoKT8xOjIpfSksQy5hdHRyaWJ1dGVzJiZvKGZ1bmN0aW9uKGUpe3JldHVybiBlLmlubmVySFRNTD1cIjxpbnB1dC8+XCIsZS5maXJzdENoaWxkLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsXCJcIiksXCJcIj09PWUuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKX0pfHxhKFwidmFsdWVcIixmdW5jdGlvbihlLG4scil7cmV0dXJuIHJ8fFwiaW5wdXRcIiE9PWUubm9kZU5hbWUudG9Mb3dlckNhc2UoKT90OmUuZGVmYXVsdFZhbHVlfSksbyhmdW5jdGlvbihlKXtyZXR1cm4gbnVsbD09ZS5nZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKX0pfHxhKHJ0LGZ1bmN0aW9uKGUsbixyKXt2YXIgaTtyZXR1cm4gcj90OihpPWUuZ2V0QXR0cmlidXRlTm9kZShuKSkmJmkuc3BlY2lmaWVkP2kudmFsdWU6ZVtuXT09PSEwP24udG9Mb3dlckNhc2UoKTpudWxsfSkscHQuZmluZD1uLHB0LmV4cHI9bi5zZWxlY3RvcnMscHQuZXhwcltcIjpcIl09cHQuZXhwci5wc2V1ZG9zLHB0LnVuaXF1ZT1uLnVuaXF1ZVNvcnQscHQudGV4dD1uLmdldFRleHQscHQuaXNYTUxEb2M9bi5pc1hNTCxwdC5jb250YWlucz1uLmNvbnRhaW5zfSh0KTt2YXIgU3Q9e307cHQuQ2FsbGJhY2tzPWZ1bmN0aW9uKGUpe2U9XCJzdHJpbmdcIj09dHlwZW9mIGU/U3RbZV18fG8oZSk6cHQuZXh0ZW5kKHt9LGUpO3ZhciB0LG4saSxhLHMsdSxsPVtdLGM9IWUub25jZSYmW10sZj1mdW5jdGlvbihyKXtmb3Iobj1lLm1lbW9yeSYmcixpPSEwLHM9dXx8MCx1PTAsYT1sLmxlbmd0aCx0PSEwO2wmJmE+cztzKyspaWYobFtzXS5hcHBseShyWzBdLHJbMV0pPT09ITEmJmUuc3RvcE9uRmFsc2Upe249ITE7YnJlYWt9dD0hMSxsJiYoYz9jLmxlbmd0aCYmZihjLnNoaWZ0KCkpOm4/bD1bXTpwLmRpc2FibGUoKSl9LHA9e2FkZDpmdW5jdGlvbigpe2lmKGwpe3ZhciByPWwubGVuZ3RoOyFmdW5jdGlvbiBpKHQpe3B0LmVhY2godCxmdW5jdGlvbih0LG4pe3ZhciByPXB0LnR5cGUobik7XCJmdW5jdGlvblwiPT09cj9lLnVuaXF1ZSYmcC5oYXMobil8fGwucHVzaChuKTpuJiZuLmxlbmd0aCYmXCJzdHJpbmdcIiE9PXImJmkobil9KX0oYXJndW1lbnRzKSx0P2E9bC5sZW5ndGg6biYmKHU9cixmKG4pKX1yZXR1cm4gdGhpc30scmVtb3ZlOmZ1bmN0aW9uKCl7cmV0dXJuIGwmJnB0LmVhY2goYXJndW1lbnRzLGZ1bmN0aW9uKGUsbil7Zm9yKHZhciByOyhyPXB0LmluQXJyYXkobixsLHIpKT4tMTspbC5zcGxpY2UociwxKSx0JiYoYT49ciYmYS0tLHM+PXImJnMtLSl9KSx0aGlzfSxoYXM6ZnVuY3Rpb24oZSl7cmV0dXJuIGU/cHQuaW5BcnJheShlLGwpPi0xOiEoIWx8fCFsLmxlbmd0aCl9LGVtcHR5OmZ1bmN0aW9uKCl7cmV0dXJuIGw9W10sYT0wLHRoaXN9LGRpc2FibGU6ZnVuY3Rpb24oKXtyZXR1cm4gbD1jPW49cix0aGlzfSxkaXNhYmxlZDpmdW5jdGlvbigpe3JldHVybiFsfSxsb2NrOmZ1bmN0aW9uKCl7cmV0dXJuIGM9cixufHxwLmRpc2FibGUoKSx0aGlzfSxsb2NrZWQ6ZnVuY3Rpb24oKXtyZXR1cm4hY30sZmlyZVdpdGg6ZnVuY3Rpb24oZSxuKXtyZXR1cm4hbHx8aSYmIWN8fChuPW58fFtdLG49W2Usbi5zbGljZT9uLnNsaWNlKCk6bl0sdD9jLnB1c2gobik6ZihuKSksdGhpc30sZmlyZTpmdW5jdGlvbigpe3JldHVybiBwLmZpcmVXaXRoKHRoaXMsYXJndW1lbnRzKSx0aGlzfSxmaXJlZDpmdW5jdGlvbigpe3JldHVybiEhaX19O3JldHVybiBwfSxwdC5leHRlbmQoe0RlZmVycmVkOmZ1bmN0aW9uKGUpe3ZhciB0PVtbXCJyZXNvbHZlXCIsXCJkb25lXCIscHQuQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksXCJyZXNvbHZlZFwiXSxbXCJyZWplY3RcIixcImZhaWxcIixwdC5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSxcInJlamVjdGVkXCJdLFtcIm5vdGlmeVwiLFwicHJvZ3Jlc3NcIixwdC5DYWxsYmFja3MoXCJtZW1vcnlcIildXSxuPVwicGVuZGluZ1wiLHI9e3N0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuIG59LGFsd2F5czpmdW5jdGlvbigpe3JldHVybiBpLmRvbmUoYXJndW1lbnRzKS5mYWlsKGFyZ3VtZW50cyksdGhpc30sdGhlbjpmdW5jdGlvbigpe3ZhciBlPWFyZ3VtZW50cztyZXR1cm4gcHQuRGVmZXJyZWQoZnVuY3Rpb24obil7cHQuZWFjaCh0LGZ1bmN0aW9uKHQsbyl7dmFyIGE9b1swXSxzPXB0LmlzRnVuY3Rpb24oZVt0XSkmJmVbdF07aVtvWzFdXShmdW5jdGlvbigpe3ZhciBlPXMmJnMuYXBwbHkodGhpcyxhcmd1bWVudHMpO2UmJnB0LmlzRnVuY3Rpb24oZS5wcm9taXNlKT9lLnByb21pc2UoKS5kb25lKG4ucmVzb2x2ZSkuZmFpbChuLnJlamVjdCkucHJvZ3Jlc3Mobi5ub3RpZnkpOm5bYStcIldpdGhcIl0odGhpcz09PXI/bi5wcm9taXNlKCk6dGhpcyxzP1tlXTphcmd1bWVudHMpfSl9KSxlPW51bGx9KS5wcm9taXNlKCl9LHByb21pc2U6ZnVuY3Rpb24oZSl7cmV0dXJuIG51bGwhPWU/cHQuZXh0ZW5kKGUscik6cn19LGk9e307cmV0dXJuIHIucGlwZT1yLnRoZW4scHQuZWFjaCh0LGZ1bmN0aW9uKGUsbyl7dmFyIGE9b1syXSxzPW9bM107cltvWzFdXT1hLmFkZCxzJiZhLmFkZChmdW5jdGlvbigpe249c30sdFsxXmVdWzJdLmRpc2FibGUsdFsyXVsyXS5sb2NrKSxpW29bMF1dPWZ1bmN0aW9uKCl7cmV0dXJuIGlbb1swXStcIldpdGhcIl0odGhpcz09PWk/cjp0aGlzLGFyZ3VtZW50cyksdGhpc30saVtvWzBdK1wiV2l0aFwiXT1hLmZpcmVXaXRofSksci5wcm9taXNlKGkpLGUmJmUuY2FsbChpLGkpLGl9LHdoZW46ZnVuY3Rpb24oZSl7dmFyIHQsbixyLGk9MCxvPXN0LmNhbGwoYXJndW1lbnRzKSxhPW8ubGVuZ3RoLHM9MSE9PWF8fGUmJnB0LmlzRnVuY3Rpb24oZS5wcm9taXNlKT9hOjAsdT0xPT09cz9lOnB0LkRlZmVycmVkKCksbD1mdW5jdGlvbihlLG4scil7cmV0dXJuIGZ1bmN0aW9uKGkpe25bZV09dGhpcyxyW2VdPWFyZ3VtZW50cy5sZW5ndGg+MT9zdC5jYWxsKGFyZ3VtZW50cyk6aSxyPT09dD91Lm5vdGlmeVdpdGgobixyKTotLXN8fHUucmVzb2x2ZVdpdGgobixyKX19O2lmKGE+MSlmb3IodD1BcnJheShhKSxuPUFycmF5KGEpLHI9QXJyYXkoYSk7YT5pO2krKylvW2ldJiZwdC5pc0Z1bmN0aW9uKG9baV0ucHJvbWlzZSk/b1tpXS5wcm9taXNlKCkuZG9uZShsKGkscixvKSkuZmFpbCh1LnJlamVjdCkucHJvZ3Jlc3MobChpLG4sdCkpOi0tcztyZXR1cm4gc3x8dS5yZXNvbHZlV2l0aChyLG8pLHUucHJvbWlzZSgpfX0pLHB0LnN1cHBvcnQ9ZnVuY3Rpb24oZSl7dmFyIG4scixpLG8sYSxzLHUsbCxjLGY9Sy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2lmKGYuc2V0QXR0cmlidXRlKFwiY2xhc3NOYW1lXCIsXCJ0XCIpLGYuaW5uZXJIVE1MPVwiICA8bGluay8+PHRhYmxlPjwvdGFibGU+PGEgaHJlZj0nL2EnPmE8L2E+PGlucHV0IHR5cGU9J2NoZWNrYm94Jy8+XCIsbj1mLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKXx8W10scj1mLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXSwhcnx8IXIuc3R5bGV8fCFuLmxlbmd0aClyZXR1cm4gZTtvPUsuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKSxzPW8uYXBwZW5kQ2hpbGQoSy5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpKSxpPWYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXSxyLnN0eWxlLmNzc1RleHQ9XCJ0b3A6MXB4O2Zsb2F0OmxlZnQ7b3BhY2l0eTouNVwiLGUuZ2V0U2V0QXR0cmlidXRlPVwidFwiIT09Zi5jbGFzc05hbWUsZS5sZWFkaW5nV2hpdGVzcGFjZT0zPT09Zi5maXJzdENoaWxkLm5vZGVUeXBlLGUudGJvZHk9IWYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKS5sZW5ndGgsZS5odG1sU2VyaWFsaXplPSEhZi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpbmtcIikubGVuZ3RoLGUuc3R5bGU9L3RvcC8udGVzdChyLmdldEF0dHJpYnV0ZShcInN0eWxlXCIpKSxlLmhyZWZOb3JtYWxpemVkPVwiL2FcIj09PXIuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSxlLm9wYWNpdHk9L14wLjUvLnRlc3Qoci5zdHlsZS5vcGFjaXR5KSxlLmNzc0Zsb2F0PSEhci5zdHlsZS5jc3NGbG9hdCxlLmNoZWNrT249ISFpLnZhbHVlLGUub3B0U2VsZWN0ZWQ9cy5zZWxlY3RlZCxlLmVuY3R5cGU9ISFLLmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpLmVuY3R5cGUsZS5odG1sNUNsb25lPVwiPDpuYXY+PC86bmF2PlwiIT09Sy5jcmVhdGVFbGVtZW50KFwibmF2XCIpLmNsb25lTm9kZSghMCkub3V0ZXJIVE1MLGUuaW5saW5lQmxvY2tOZWVkc0xheW91dD0hMSxlLnNocmlua1dyYXBCbG9ja3M9ITEsZS5waXhlbFBvc2l0aW9uPSExLGUuZGVsZXRlRXhwYW5kbz0hMCxlLm5vQ2xvbmVFdmVudD0hMCxlLnJlbGlhYmxlTWFyZ2luUmlnaHQ9ITAsZS5ib3hTaXppbmdSZWxpYWJsZT0hMCxpLmNoZWNrZWQ9ITAsZS5ub0Nsb25lQ2hlY2tlZD1pLmNsb25lTm9kZSghMCkuY2hlY2tlZCxvLmRpc2FibGVkPSEwLGUub3B0RGlzYWJsZWQ9IXMuZGlzYWJsZWQ7dHJ5e2RlbGV0ZSBmLnRlc3R9Y2F0Y2gocCl7ZS5kZWxldGVFeHBhbmRvPSExfWk9Sy5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksaS5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLFwiXCIpLGUuaW5wdXQ9XCJcIj09PWkuZ2V0QXR0cmlidXRlKFwidmFsdWVcIiksaS52YWx1ZT1cInRcIixpLnNldEF0dHJpYnV0ZShcInR5cGVcIixcInJhZGlvXCIpLGUucmFkaW9WYWx1ZT1cInRcIj09PWkudmFsdWUsaS5zZXRBdHRyaWJ1dGUoXCJjaGVja2VkXCIsXCJ0XCIpLGkuc2V0QXR0cmlidXRlKFwibmFtZVwiLFwidFwiKSxhPUsuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLGEuYXBwZW5kQ2hpbGQoaSksZS5hcHBlbmRDaGVja2VkPWkuY2hlY2tlZCxlLmNoZWNrQ2xvbmU9YS5jbG9uZU5vZGUoITApLmNsb25lTm9kZSghMCkubGFzdENoaWxkLmNoZWNrZWQsZi5hdHRhY2hFdmVudCYmKGYuYXR0YWNoRXZlbnQoXCJvbmNsaWNrXCIsZnVuY3Rpb24oKXtlLm5vQ2xvbmVFdmVudD0hMX0pLGYuY2xvbmVOb2RlKCEwKS5jbGljaygpKTtmb3IoYyBpbntzdWJtaXQ6ITAsY2hhbmdlOiEwLGZvY3VzaW46ITB9KWYuc2V0QXR0cmlidXRlKHU9XCJvblwiK2MsXCJ0XCIpLGVbYytcIkJ1YmJsZXNcIl09dSBpbiB0fHxmLmF0dHJpYnV0ZXNbdV0uZXhwYW5kbz09PSExO2Yuc3R5bGUuYmFja2dyb3VuZENsaXA9XCJjb250ZW50LWJveFwiLGYuY2xvbmVOb2RlKCEwKS5zdHlsZS5iYWNrZ3JvdW5kQ2xpcD1cIlwiLGUuY2xlYXJDbG9uZVN0eWxlPVwiY29udGVudC1ib3hcIj09PWYuc3R5bGUuYmFja2dyb3VuZENsaXA7Zm9yKGMgaW4gcHQoZSkpYnJlYWs7cmV0dXJuIGUub3duTGFzdD1cIjBcIiE9PWMscHQoZnVuY3Rpb24oKXt2YXIgbixyLGksbz1cInBhZGRpbmc6MDttYXJnaW46MDtib3JkZXI6MDtkaXNwbGF5OmJsb2NrO2JveC1zaXppbmc6Y29udGVudC1ib3g7LW1vei1ib3gtc2l6aW5nOmNvbnRlbnQtYm94Oy13ZWJraXQtYm94LXNpemluZzpjb250ZW50LWJveDtcIixhPUsuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO2EmJihuPUsuY3JlYXRlRWxlbWVudChcImRpdlwiKSxuLnN0eWxlLmNzc1RleHQ9XCJib3JkZXI6MDt3aWR0aDowO2hlaWdodDowO3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6LTk5OTlweDttYXJnaW4tdG9wOjFweFwiLGEuYXBwZW5kQ2hpbGQobikuYXBwZW5kQ2hpbGQoZiksZi5pbm5lckhUTUw9XCI8dGFibGU+PHRyPjx0ZD48L3RkPjx0ZD50PC90ZD48L3RyPjwvdGFibGU+XCIsaT1mLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGRcIiksaVswXS5zdHlsZS5jc3NUZXh0PVwicGFkZGluZzowO21hcmdpbjowO2JvcmRlcjowO2Rpc3BsYXk6bm9uZVwiLGw9MD09PWlbMF0ub2Zmc2V0SGVpZ2h0LGlbMF0uc3R5bGUuZGlzcGxheT1cIlwiLGlbMV0uc3R5bGUuZGlzcGxheT1cIm5vbmVcIixlLnJlbGlhYmxlSGlkZGVuT2Zmc2V0cz1sJiYwPT09aVswXS5vZmZzZXRIZWlnaHQsZi5pbm5lckhUTUw9XCJcIixmLnN0eWxlLmNzc1RleHQ9XCJib3gtc2l6aW5nOmJvcmRlci1ib3g7LW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzoxcHg7Ym9yZGVyOjFweDtkaXNwbGF5OmJsb2NrO3dpZHRoOjRweDttYXJnaW4tdG9wOjElO3Bvc2l0aW9uOmFic29sdXRlO3RvcDoxJTtcIixwdC5zd2FwKGEsbnVsbCE9YS5zdHlsZS56b29tP3t6b29tOjF9Ont9LGZ1bmN0aW9uKCl7ZS5ib3hTaXppbmc9ND09PWYub2Zmc2V0V2lkdGh9KSx0LmdldENvbXB1dGVkU3R5bGUmJihlLnBpeGVsUG9zaXRpb249XCIxJVwiIT09KHQuZ2V0Q29tcHV0ZWRTdHlsZShmLG51bGwpfHx7fSkudG9wLGUuYm94U2l6aW5nUmVsaWFibGU9XCI0cHhcIj09PSh0LmdldENvbXB1dGVkU3R5bGUoZixudWxsKXx8e3dpZHRoOlwiNHB4XCJ9KS53aWR0aCxyPWYuYXBwZW5kQ2hpbGQoSy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxyLnN0eWxlLmNzc1RleHQ9Zi5zdHlsZS5jc3NUZXh0PW8sci5zdHlsZS5tYXJnaW5SaWdodD1yLnN0eWxlLndpZHRoPVwiMFwiLGYuc3R5bGUud2lkdGg9XCIxcHhcIixlLnJlbGlhYmxlTWFyZ2luUmlnaHQ9IXBhcnNlRmxvYXQoKHQuZ2V0Q29tcHV0ZWRTdHlsZShyLG51bGwpfHx7fSkubWFyZ2luUmlnaHQpKSx0eXBlb2YgZi5zdHlsZS56b29tIT09RyYmKGYuaW5uZXJIVE1MPVwiXCIsZi5zdHlsZS5jc3NUZXh0PW8rXCJ3aWR0aDoxcHg7cGFkZGluZzoxcHg7ZGlzcGxheTppbmxpbmU7em9vbToxXCIsZS5pbmxpbmVCbG9ja05lZWRzTGF5b3V0PTM9PT1mLm9mZnNldFdpZHRoLGYuc3R5bGUuZGlzcGxheT1cImJsb2NrXCIsZi5pbm5lckhUTUw9XCI8ZGl2PjwvZGl2PlwiLGYuZmlyc3RDaGlsZC5zdHlsZS53aWR0aD1cIjVweFwiLGUuc2hyaW5rV3JhcEJsb2Nrcz0zIT09Zi5vZmZzZXRXaWR0aCxlLmlubGluZUJsb2NrTmVlZHNMYXlvdXQmJihhLnN0eWxlLnpvb209MSkpLGEucmVtb3ZlQ2hpbGQobiksbj1mPWk9cj1udWxsKX0pLG49bz1hPXM9cj1pPW51bGwsZX0oe30pO3ZhciBBdD0vKD86XFx7W1xcc1xcU10qXFx9fFxcW1tcXHNcXFNdKlxcXSkkLyxqdD0vKFtBLVpdKS9nO3B0LmV4dGVuZCh7Y2FjaGU6e30sbm9EYXRhOnthcHBsZXQ6ITAsZW1iZWQ6ITAsb2JqZWN0OlwiY2xzaWQ6RDI3Q0RCNkUtQUU2RC0xMWNmLTk2QjgtNDQ0NTUzNTQwMDAwXCJ9LGhhc0RhdGE6ZnVuY3Rpb24oZSl7cmV0dXJuIGU9ZS5ub2RlVHlwZT9wdC5jYWNoZVtlW3B0LmV4cGFuZG9dXTplW3B0LmV4cGFuZG9dLCEhZSYmIWwoZSl9LGRhdGE6ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBhKGUsdCxuKX0scmVtb3ZlRGF0YTpmdW5jdGlvbihlLHQpe3JldHVybiBzKGUsdCl9LF9kYXRhOmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gYShlLHQsbiwhMCl9LF9yZW1vdmVEYXRhOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHMoZSx0LCEwKX0sYWNjZXB0RGF0YTpmdW5jdGlvbihlKXtpZihlLm5vZGVUeXBlJiYxIT09ZS5ub2RlVHlwZSYmOSE9PWUubm9kZVR5cGUpcmV0dXJuITE7dmFyIHQ9ZS5ub2RlTmFtZSYmcHQubm9EYXRhW2Uubm9kZU5hbWUudG9Mb3dlckNhc2UoKV07cmV0dXJuIXR8fHQhPT0hMCYmZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc2lkXCIpPT09dH19KSxwdC5mbi5leHRlbmQoe2RhdGE6ZnVuY3Rpb24oZSx0KXt2YXIgbixpLG89bnVsbCxhPTAscz10aGlzWzBdO2lmKGU9PT1yKXtpZih0aGlzLmxlbmd0aCYmKG89cHQuZGF0YShzKSwxPT09cy5ub2RlVHlwZSYmIXB0Ll9kYXRhKHMsXCJwYXJzZWRBdHRyc1wiKSkpe2ZvcihuPXMuYXR0cmlidXRlcztuLmxlbmd0aD5hO2ErKylpPW5bYV0ubmFtZSwwPT09aS5pbmRleE9mKFwiZGF0YS1cIikmJihpPXB0LmNhbWVsQ2FzZShpLnNsaWNlKDUpKSx1KHMsaSxvW2ldKSk7cHQuX2RhdGEocyxcInBhcnNlZEF0dHJzXCIsITApfXJldHVybiBvfXJldHVyblwib2JqZWN0XCI9PXR5cGVvZiBlP3RoaXMuZWFjaChmdW5jdGlvbigpe3B0LmRhdGEodGhpcyxlKX0pOmFyZ3VtZW50cy5sZW5ndGg+MT90aGlzLmVhY2goZnVuY3Rpb24oKXtwdC5kYXRhKHRoaXMsZSx0KX0pOnM/dShzLGUscHQuZGF0YShzLGUpKTpudWxsfSxyZW1vdmVEYXRhOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtwdC5yZW1vdmVEYXRhKHRoaXMsZSl9KX19KSxwdC5leHRlbmQoe3F1ZXVlOmZ1bmN0aW9uKGUsdCxuKXt2YXIgaTtyZXR1cm4gZT8odD0odHx8XCJmeFwiKStcInF1ZXVlXCIsaT1wdC5fZGF0YShlLHQpLG4mJighaXx8cHQuaXNBcnJheShuKT9pPXB0Ll9kYXRhKGUsdCxwdC5tYWtlQXJyYXkobikpOmkucHVzaChuKSksaXx8W10pOnJ9LGRlcXVldWU6ZnVuY3Rpb24oZSx0KXt0PXR8fFwiZnhcIjt2YXIgbj1wdC5xdWV1ZShlLHQpLHI9bi5sZW5ndGgsaT1uLnNoaWZ0KCksbz1wdC5fcXVldWVIb29rcyhlLHQpLGE9ZnVuY3Rpb24oKXtwdC5kZXF1ZXVlKGUsdCl9O1wiaW5wcm9ncmVzc1wiPT09aSYmKGk9bi5zaGlmdCgpLHItLSksaSYmKFwiZnhcIj09PXQmJm4udW5zaGlmdChcImlucHJvZ3Jlc3NcIiksZGVsZXRlIG8uc3RvcCxpLmNhbGwoZSxhLG8pKSwhciYmbyYmby5lbXB0eS5maXJlKCl9LF9xdWV1ZUhvb2tzOmZ1bmN0aW9uKGUsdCl7dmFyIG49dCtcInF1ZXVlSG9va3NcIjtyZXR1cm4gcHQuX2RhdGEoZSxuKXx8cHQuX2RhdGEoZSxuLHtlbXB0eTpwdC5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKS5hZGQoZnVuY3Rpb24oKXtwdC5fcmVtb3ZlRGF0YShlLHQrXCJxdWV1ZVwiKSxwdC5fcmVtb3ZlRGF0YShlLG4pfSl9KX19KSxwdC5mbi5leHRlbmQoe3F1ZXVlOmZ1bmN0aW9uKGUsdCl7dmFyIG49MjtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgZSYmKHQ9ZSxlPVwiZnhcIixuLS0pLG4+YXJndW1lbnRzLmxlbmd0aD9wdC5xdWV1ZSh0aGlzWzBdLGUpOnQ9PT1yP3RoaXM6dGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIG49cHQucXVldWUodGhpcyxlLHQpO3B0Ll9xdWV1ZUhvb2tzKHRoaXMsZSksXCJmeFwiPT09ZSYmXCJpbnByb2dyZXNzXCIhPT1uWzBdJiZwdC5kZXF1ZXVlKHRoaXMsZSl9KX0sZGVxdWV1ZTpmdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7cHQuZGVxdWV1ZSh0aGlzLGUpfSl9LGRlbGF5OmZ1bmN0aW9uKGUsdCl7cmV0dXJuIGU9cHQuZng/cHQuZnguc3BlZWRzW2VdfHxlOmUsdD10fHxcImZ4XCIsdGhpcy5xdWV1ZSh0LGZ1bmN0aW9uKHQsbil7dmFyIHI9c2V0VGltZW91dCh0LGUpO24uc3RvcD1mdW5jdGlvbigpe2NsZWFyVGltZW91dChyKX19KX0sY2xlYXJRdWV1ZTpmdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5xdWV1ZShlfHxcImZ4XCIsW10pfSxwcm9taXNlOmZ1bmN0aW9uKGUsdCl7dmFyIG4saT0xLG89cHQuRGVmZXJyZWQoKSxhPXRoaXMscz10aGlzLmxlbmd0aCx1PWZ1bmN0aW9uKCl7LS1pfHxvLnJlc29sdmVXaXRoKGEsW2FdKX07Zm9yKFwic3RyaW5nXCIhPXR5cGVvZiBlJiYodD1lLGU9ciksZT1lfHxcImZ4XCI7cy0tOyluPXB0Ll9kYXRhKGFbc10sZStcInF1ZXVlSG9va3NcIiksbiYmbi5lbXB0eSYmKGkrKyxuLmVtcHR5LmFkZCh1KSk7cmV0dXJuIHUoKSxvLnByb21pc2UodCl9fSk7dmFyIER0LEx0LEh0PS9bXFx0XFxyXFxuXFxmXS9nLHF0PS9cXHIvZyxfdD0vXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b258b2JqZWN0KSQvaSxNdD0vXig/OmF8YXJlYSkkL2ksT3Q9L14oPzpjaGVja2VkfHNlbGVjdGVkKSQvaSxGdD1wdC5zdXBwb3J0LmdldFNldEF0dHJpYnV0ZSxCdD1wdC5zdXBwb3J0LmlucHV0O3B0LmZuLmV4dGVuZCh7YXR0cjpmdW5jdGlvbihlLHQpe3JldHVybiBwdC5hY2Nlc3ModGhpcyxwdC5hdHRyLGUsdCxhcmd1bWVudHMubGVuZ3RoPjEpfSxyZW1vdmVBdHRyOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtwdC5yZW1vdmVBdHRyKHRoaXMsZSl9KX0scHJvcDpmdW5jdGlvbihlLHQpe3JldHVybiBwdC5hY2Nlc3ModGhpcyxwdC5wcm9wLGUsdCxhcmd1bWVudHMubGVuZ3RoPjEpfSxyZW1vdmVQcm9wOmZ1bmN0aW9uKGUpe3JldHVybiBlPXB0LnByb3BGaXhbZV18fGUsdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dHJ5e3RoaXNbZV09cixkZWxldGUgdGhpc1tlXX1jYXRjaCh0KXt9fSl9LGFkZENsYXNzOmZ1bmN0aW9uKGUpe3ZhciB0LG4scixpLG8sYT0wLHM9dGhpcy5sZW5ndGgsdT1cInN0cmluZ1wiPT10eXBlb2YgZSYmZTtpZihwdC5pc0Z1bmN0aW9uKGUpKXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24odCl7cHQodGhpcykuYWRkQ2xhc3MoZS5jYWxsKHRoaXMsdCx0aGlzLmNsYXNzTmFtZSkpfSk7aWYodSlmb3IodD0oZXx8XCJcIikubWF0Y2goaHQpfHxbXTtzPmE7YSsrKWlmKG49dGhpc1thXSxyPTE9PT1uLm5vZGVUeXBlJiYobi5jbGFzc05hbWU/KFwiIFwiK24uY2xhc3NOYW1lK1wiIFwiKS5yZXBsYWNlKEh0LFwiIFwiKTpcIiBcIikpe2ZvcihvPTA7aT10W28rK107KTA+ci5pbmRleE9mKFwiIFwiK2krXCIgXCIpJiYocis9aStcIiBcIik7bi5jbGFzc05hbWU9cHQudHJpbShyKX1yZXR1cm4gdGhpc30scmVtb3ZlQ2xhc3M6ZnVuY3Rpb24oZSl7dmFyIHQsbixyLGksbyxhPTAscz10aGlzLmxlbmd0aCx1PTA9PT1hcmd1bWVudHMubGVuZ3RofHxcInN0cmluZ1wiPT10eXBlb2YgZSYmZTtpZihwdC5pc0Z1bmN0aW9uKGUpKXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24odCl7cHQodGhpcykucmVtb3ZlQ2xhc3MoZS5jYWxsKHRoaXMsdCx0aGlzLmNsYXNzTmFtZSkpfSk7aWYodSlmb3IodD0oZXx8XCJcIikubWF0Y2goaHQpfHxbXTtzPmE7YSsrKWlmKG49dGhpc1thXSxyPTE9PT1uLm5vZGVUeXBlJiYobi5jbGFzc05hbWU/KFwiIFwiK24uY2xhc3NOYW1lK1wiIFwiKS5yZXBsYWNlKEh0LFwiIFwiKTpcIlwiKSl7Zm9yKG89MDtpPXRbbysrXTspZm9yKDtyLmluZGV4T2YoXCIgXCIraStcIiBcIik+PTA7KXI9ci5yZXBsYWNlKFwiIFwiK2krXCIgXCIsXCIgXCIpO24uY2xhc3NOYW1lPWU/cHQudHJpbShyKTpcIlwifXJldHVybiB0aGlzfSx0b2dnbGVDbGFzczpmdW5jdGlvbihlLHQpe3ZhciBuPXR5cGVvZiBlO3JldHVyblwiYm9vbGVhblwiPT10eXBlb2YgdCYmXCJzdHJpbmdcIj09PW4/dD90aGlzLmFkZENsYXNzKGUpOnRoaXMucmVtb3ZlQ2xhc3MoZSk6dGhpcy5lYWNoKHB0LmlzRnVuY3Rpb24oZSk/ZnVuY3Rpb24obil7cHQodGhpcykudG9nZ2xlQ2xhc3MoZS5jYWxsKHRoaXMsbix0aGlzLmNsYXNzTmFtZSx0KSx0KX06ZnVuY3Rpb24oKXtpZihcInN0cmluZ1wiPT09bilmb3IodmFyIHQscj0wLGk9cHQodGhpcyksbz1lLm1hdGNoKGh0KXx8W107dD1vW3IrK107KWkuaGFzQ2xhc3ModCk/aS5yZW1vdmVDbGFzcyh0KTppLmFkZENsYXNzKHQpO2Vsc2Uobj09PUd8fFwiYm9vbGVhblwiPT09bikmJih0aGlzLmNsYXNzTmFtZSYmcHQuX2RhdGEodGhpcyxcIl9fY2xhc3NOYW1lX19cIix0aGlzLmNsYXNzTmFtZSksdGhpcy5jbGFzc05hbWU9dGhpcy5jbGFzc05hbWV8fGU9PT0hMT9cIlwiOnB0Ll9kYXRhKHRoaXMsXCJfX2NsYXNzTmFtZV9fXCIpfHxcIlwiKX0pfSxoYXNDbGFzczpmdW5jdGlvbihlKXtmb3IodmFyIHQ9XCIgXCIrZStcIiBcIixuPTAscj10aGlzLmxlbmd0aDtyPm47bisrKWlmKDE9PT10aGlzW25dLm5vZGVUeXBlJiYoXCIgXCIrdGhpc1tuXS5jbGFzc05hbWUrXCIgXCIpLnJlcGxhY2UoSHQsXCIgXCIpLmluZGV4T2YodCk+PTApcmV0dXJuITA7cmV0dXJuITF9LHZhbDpmdW5jdGlvbihlKXt2YXIgdCxuLGksbz10aGlzWzBdO3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyhpPXB0LmlzRnVuY3Rpb24oZSksdGhpcy5lYWNoKGZ1bmN0aW9uKHQpe3ZhciBvOzE9PT10aGlzLm5vZGVUeXBlJiYobz1pP2UuY2FsbCh0aGlzLHQscHQodGhpcykudmFsKCkpOmUsbnVsbD09bz9vPVwiXCI6XCJudW1iZXJcIj09dHlwZW9mIG8/bys9XCJcIjpwdC5pc0FycmF5KG8pJiYobz1wdC5tYXAobyxmdW5jdGlvbihlKXtyZXR1cm4gbnVsbD09ZT9cIlwiOmUrXCJcIn0pKSxuPXB0LnZhbEhvb2tzW3RoaXMudHlwZV18fHB0LnZhbEhvb2tzW3RoaXMubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0sbiYmXCJzZXRcImluIG4mJm4uc2V0KHRoaXMsbyxcInZhbHVlXCIpIT09cnx8KHRoaXMudmFsdWU9bykpfSkpOm8/KG49cHQudmFsSG9va3Nbby50eXBlXXx8cHQudmFsSG9va3Nbby5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXSxuJiZcImdldFwiaW4gbiYmKHQ9bi5nZXQobyxcInZhbHVlXCIpKSE9PXI/dDoodD1vLnZhbHVlLFwic3RyaW5nXCI9PXR5cGVvZiB0P3QucmVwbGFjZShxdCxcIlwiKTpudWxsPT10P1wiXCI6dCkpOnZvaWQgMH19KSxwdC5leHRlbmQoe3ZhbEhvb2tzOntvcHRpb246e2dldDpmdW5jdGlvbihlKXt2YXIgdD1wdC5maW5kLmF0dHIoZSxcInZhbHVlXCIpO3JldHVybiBudWxsIT10P3Q6ZS50ZXh0fX0sc2VsZWN0OntnZXQ6ZnVuY3Rpb24oZSl7Zm9yKHZhciB0LG4scj1lLm9wdGlvbnMsaT1lLnNlbGVjdGVkSW5kZXgsbz1cInNlbGVjdC1vbmVcIj09PWUudHlwZXx8MD5pLGE9bz9udWxsOltdLHM9bz9pKzE6ci5sZW5ndGgsdT0wPmk/czpvP2k6MDtzPnU7dSsrKWlmKG49clt1XSwhKCFuLnNlbGVjdGVkJiZ1IT09aXx8KHB0LnN1cHBvcnQub3B0RGlzYWJsZWQ/bi5kaXNhYmxlZDpudWxsIT09bi5nZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSl8fG4ucGFyZW50Tm9kZS5kaXNhYmxlZCYmcHQubm9kZU5hbWUobi5wYXJlbnROb2RlLFwib3B0Z3JvdXBcIikpKXtpZih0PXB0KG4pLnZhbCgpLG8pcmV0dXJuIHQ7YS5wdXNoKHQpfXJldHVybiBhfSxzZXQ6ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG4scixpPWUub3B0aW9ucyxvPXB0Lm1ha2VBcnJheSh0KSxhPWkubGVuZ3RoO2EtLTspcj1pW2FdLChyLnNlbGVjdGVkPXB0LmluQXJyYXkocHQocikudmFsKCksbyk+PTApJiYobj0hMCk7cmV0dXJuIG58fChlLnNlbGVjdGVkSW5kZXg9LTEpLG99fX0sYXR0cjpmdW5jdGlvbihlLHQsbil7dmFyIGksbyxhPWUubm9kZVR5cGU7cmV0dXJuIGUmJjMhPT1hJiY4IT09YSYmMiE9PWE/dHlwZW9mIGUuZ2V0QXR0cmlidXRlPT09Rz9wdC5wcm9wKGUsdCxuKTooMT09PWEmJnB0LmlzWE1MRG9jKGUpfHwodD10LnRvTG93ZXJDYXNlKCksaT1wdC5hdHRySG9va3NbdF18fChwdC5leHByLm1hdGNoLmJvb2wudGVzdCh0KT9MdDpEdCkpLG49PT1yP2kmJlwiZ2V0XCJpbiBpJiZudWxsIT09KG89aS5nZXQoZSx0KSk/bzoobz1wdC5maW5kLmF0dHIoZSx0KSxudWxsPT1vP3I6byk6bnVsbCE9PW4/aSYmXCJzZXRcImluIGkmJihvPWkuc2V0KGUsbix0KSkhPT1yP286KGUuc2V0QXR0cmlidXRlKHQsbitcIlwiKSxuKToocHQucmVtb3ZlQXR0cihlLHQpLHIpKTp2b2lkIDB9LHJlbW92ZUF0dHI6ZnVuY3Rpb24oZSx0KXt2YXIgbixyLGk9MCxvPXQmJnQubWF0Y2goaHQpO2lmKG8mJjE9PT1lLm5vZGVUeXBlKWZvcig7bj1vW2krK107KXI9cHQucHJvcEZpeFtuXXx8bixwdC5leHByLm1hdGNoLmJvb2wudGVzdChuKT9CdCYmRnR8fCFPdC50ZXN0KG4pP2Vbcl09ITE6ZVtwdC5jYW1lbENhc2UoXCJkZWZhdWx0LVwiK24pXT1lW3JdPSExOnB0LmF0dHIoZSxuLFwiXCIpLGUucmVtb3ZlQXR0cmlidXRlKEZ0P246cil9LGF0dHJIb29rczp7dHlwZTp7c2V0OmZ1bmN0aW9uKGUsdCl7aWYoIXB0LnN1cHBvcnQucmFkaW9WYWx1ZSYmXCJyYWRpb1wiPT09dCYmcHQubm9kZU5hbWUoZSxcImlucHV0XCIpKXt2YXIgbj1lLnZhbHVlO3JldHVybiBlLnNldEF0dHJpYnV0ZShcInR5cGVcIix0KSxuJiYoZS52YWx1ZT1uKSx0fX19fSxwcm9wRml4OntcImZvclwiOlwiaHRtbEZvclwiLFwiY2xhc3NcIjpcImNsYXNzTmFtZVwifSxwcm9wOmZ1bmN0aW9uKGUsdCxuKXt2YXIgaSxvLGEscz1lLm5vZGVUeXBlO3JldHVybiBlJiYzIT09cyYmOCE9PXMmJjIhPT1zPyhhPTEhPT1zfHwhcHQuaXNYTUxEb2MoZSksYSYmKHQ9cHQucHJvcEZpeFt0XXx8dCxvPXB0LnByb3BIb29rc1t0XSksbiE9PXI/byYmXCJzZXRcImluIG8mJihpPW8uc2V0KGUsbix0KSkhPT1yP2k6ZVt0XT1uOm8mJlwiZ2V0XCJpbiBvJiZudWxsIT09KGk9by5nZXQoZSx0KSk/aTplW3RdKTp2b2lkIDB9LHByb3BIb29rczp7dGFiSW5kZXg6e2dldDpmdW5jdGlvbihlKXt2YXIgdD1wdC5maW5kLmF0dHIoZSxcInRhYmluZGV4XCIpO3JldHVybiB0P3BhcnNlSW50KHQsMTApOl90LnRlc3QoZS5ub2RlTmFtZSl8fE10LnRlc3QoZS5ub2RlTmFtZSkmJmUuaHJlZj8wOi0xfX19fSksTHQ9e3NldDpmdW5jdGlvbihlLHQsbil7cmV0dXJuIHQ9PT0hMT9wdC5yZW1vdmVBdHRyKGUsbik6QnQmJkZ0fHwhT3QudGVzdChuKT9lLnNldEF0dHJpYnV0ZSghRnQmJnB0LnByb3BGaXhbbl18fG4sbik6ZVtwdC5jYW1lbENhc2UoXCJkZWZhdWx0LVwiK24pXT1lW25dPSEwLG59fSxwdC5lYWNoKHB0LmV4cHIubWF0Y2guYm9vbC5zb3VyY2UubWF0Y2goL1xcdysvZyksZnVuY3Rpb24oZSx0KXt2YXIgbj1wdC5leHByLmF0dHJIYW5kbGVbdF18fHB0LmZpbmQuYXR0cjtwdC5leHByLmF0dHJIYW5kbGVbdF09QnQmJkZ0fHwhT3QudGVzdCh0KT9mdW5jdGlvbihlLHQsaSl7dmFyIG89cHQuZXhwci5hdHRySGFuZGxlW3RdLGE9aT9yOihwdC5leHByLmF0dHJIYW5kbGVbdF09cikhPW4oZSx0LGkpP3QudG9Mb3dlckNhc2UoKTpudWxsO3JldHVybiBwdC5leHByLmF0dHJIYW5kbGVbdF09byxhfTpmdW5jdGlvbihlLHQsbil7cmV0dXJuIG4/cjplW3B0LmNhbWVsQ2FzZShcImRlZmF1bHQtXCIrdCldP3QudG9Mb3dlckNhc2UoKTpudWxsfX0pLEJ0JiZGdHx8KHB0LmF0dHJIb29rcy52YWx1ZT17c2V0OmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gcHQubm9kZU5hbWUoZSxcImlucHV0XCIpPyhlLmRlZmF1bHRWYWx1ZT10LHIpOkR0JiZEdC5zZXQoZSx0LG4pfX0pLEZ0fHwoRHQ9e3NldDpmdW5jdGlvbihlLHQsbil7dmFyIGk9ZS5nZXRBdHRyaWJ1dGVOb2RlKG4pO3JldHVybiBpfHxlLnNldEF0dHJpYnV0ZU5vZGUoaT1lLm93bmVyRG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKG4pKSxpLnZhbHVlPXQrPVwiXCIsXCJ2YWx1ZVwiPT09bnx8dD09PWUuZ2V0QXR0cmlidXRlKG4pP3Q6cn19LHB0LmV4cHIuYXR0ckhhbmRsZS5pZD1wdC5leHByLmF0dHJIYW5kbGUubmFtZT1wdC5leHByLmF0dHJIYW5kbGUuY29vcmRzPWZ1bmN0aW9uKGUsdCxuKXt2YXIgaTtyZXR1cm4gbj9yOihpPWUuZ2V0QXR0cmlidXRlTm9kZSh0KSkmJlwiXCIhPT1pLnZhbHVlP2kudmFsdWU6bnVsbH0scHQudmFsSG9va3MuYnV0dG9uPXtnZXQ6ZnVuY3Rpb24oZSx0KXt2YXIgbj1lLmdldEF0dHJpYnV0ZU5vZGUodCk7cmV0dXJuIG4mJm4uc3BlY2lmaWVkP24udmFsdWU6cn0sc2V0OkR0LnNldH0scHQuYXR0ckhvb2tzLmNvbnRlbnRlZGl0YWJsZT17c2V0OmZ1bmN0aW9uKGUsdCxuKXtEdC5zZXQoZSxcIlwiPT09dD8hMTp0LG4pfX0scHQuZWFjaChbXCJ3aWR0aFwiLFwiaGVpZ2h0XCJdLGZ1bmN0aW9uKGUsdCl7cHQuYXR0ckhvb2tzW3RdPXtzZXQ6ZnVuY3Rpb24oZSxuKXtyZXR1cm5cIlwiPT09bj8oZS5zZXRBdHRyaWJ1dGUodCxcImF1dG9cIiksbik6cn19fSkpLHB0LnN1cHBvcnQuaHJlZk5vcm1hbGl6ZWR8fHB0LmVhY2goW1wiaHJlZlwiLFwic3JjXCJdLGZ1bmN0aW9uKGUsdCl7cHQucHJvcEhvb2tzW3RdPXtnZXQ6ZnVuY3Rpb24oZSl7cmV0dXJuIGUuZ2V0QXR0cmlidXRlKHQsNCl9fX0pLHB0LnN1cHBvcnQuc3R5bGV8fChwdC5hdHRySG9va3Muc3R5bGU9e2dldDpmdW5jdGlvbihlKXtyZXR1cm4gZS5zdHlsZS5jc3NUZXh0fHxyfSxzZXQ6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5zdHlsZS5jc3NUZXh0PXQrXCJcIn19KSxwdC5zdXBwb3J0Lm9wdFNlbGVjdGVkfHwocHQucHJvcEhvb2tzLnNlbGVjdGVkPXtnZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5wYXJlbnROb2RlO3JldHVybiB0JiYodC5zZWxlY3RlZEluZGV4LHQucGFyZW50Tm9kZSYmdC5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXgpLG51bGx9fSkscHQuZWFjaChbXCJ0YWJJbmRleFwiLFwicmVhZE9ubHlcIixcIm1heExlbmd0aFwiLFwiY2VsbFNwYWNpbmdcIixcImNlbGxQYWRkaW5nXCIsXCJyb3dTcGFuXCIsXCJjb2xTcGFuXCIsXCJ1c2VNYXBcIixcImZyYW1lQm9yZGVyXCIsXCJjb250ZW50RWRpdGFibGVcIl0sZnVuY3Rpb24oKXtwdC5wcm9wRml4W3RoaXMudG9Mb3dlckNhc2UoKV09dGhpc30pLHB0LnN1cHBvcnQuZW5jdHlwZXx8KHB0LnByb3BGaXguZW5jdHlwZT1cImVuY29kaW5nXCIpLHB0LmVhY2goW1wicmFkaW9cIixcImNoZWNrYm94XCJdLGZ1bmN0aW9uKCl7cHQudmFsSG9va3NbdGhpc109e3NldDpmdW5jdGlvbihlLHQpe3JldHVybiBwdC5pc0FycmF5KHQpP2UuY2hlY2tlZD1wdC5pbkFycmF5KHB0KGUpLnZhbCgpLHQpPj0wOnJ9fSxwdC5zdXBwb3J0LmNoZWNrT258fChwdC52YWxIb29rc1t0aGlzXS5nZXQ9ZnVuY3Rpb24oZSl7cmV0dXJuIG51bGw9PT1lLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpP1wib25cIjplLnZhbHVlfSl9KTt2YXIgUHQ9L14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWEpJC9pLFJ0PS9ea2V5LyxXdD0vXig/Om1vdXNlfGNvbnRleHRtZW51KXxjbGljay8sJHQ9L14oPzpmb2N1c2luZm9jdXN8Zm9jdXNvdXRibHVyKSQvLEl0PS9eKFteLl0qKSg/OlxcLiguKyl8KSQvO3B0LmV2ZW50PXtnbG9iYWw6e30sYWRkOmZ1bmN0aW9uKGUsdCxuLGksbyl7dmFyIGEscyx1LGwsYyxmLHAsZCxoLGcsbSx5PXB0Ll9kYXRhKGUpO2lmKHkpe2ZvcihuLmhhbmRsZXImJihsPW4sbj1sLmhhbmRsZXIsbz1sLnNlbGVjdG9yKSxuLmd1aWR8fChuLmd1aWQ9cHQuZ3VpZCsrKSwocz15LmV2ZW50cyl8fChzPXkuZXZlbnRzPXt9KSwoZj15LmhhbmRsZSl8fChmPXkuaGFuZGxlPWZ1bmN0aW9uKGUpe3JldHVybiB0eXBlb2YgcHQ9PT1HfHxlJiZwdC5ldmVudC50cmlnZ2VyZWQ9PT1lLnR5cGU/cjpwdC5ldmVudC5kaXNwYXRjaC5hcHBseShmLmVsZW0sYXJndW1lbnRzKX0sZi5lbGVtPWUpLHQ9KHR8fFwiXCIpLm1hdGNoKGh0KXx8W1wiXCJdLHU9dC5sZW5ndGg7dS0tOylhPUl0LmV4ZWModFt1XSl8fFtdLGg9bT1hWzFdLGc9KGFbMl18fFwiXCIpLnNwbGl0KFwiLlwiKS5zb3J0KCksaCYmKGM9cHQuZXZlbnQuc3BlY2lhbFtoXXx8e30saD0obz9jLmRlbGVnYXRlVHlwZTpjLmJpbmRUeXBlKXx8aCxjPXB0LmV2ZW50LnNwZWNpYWxbaF18fHt9LHA9cHQuZXh0ZW5kKHt0eXBlOmgsb3JpZ1R5cGU6bSxkYXRhOmksaGFuZGxlcjpuLGd1aWQ6bi5ndWlkLHNlbGVjdG9yOm8sbmVlZHNDb250ZXh0Om8mJnB0LmV4cHIubWF0Y2gubmVlZHNDb250ZXh0LnRlc3QobyksbmFtZXNwYWNlOmcuam9pbihcIi5cIil9LGwpLChkPXNbaF0pfHwoZD1zW2hdPVtdLGQuZGVsZWdhdGVDb3VudD0wLGMuc2V0dXAmJmMuc2V0dXAuY2FsbChlLGksZyxmKSE9PSExfHwoZS5hZGRFdmVudExpc3RlbmVyP2UuYWRkRXZlbnRMaXN0ZW5lcihoLGYsITEpOmUuYXR0YWNoRXZlbnQmJmUuYXR0YWNoRXZlbnQoXCJvblwiK2gsZikpKSxjLmFkZCYmKGMuYWRkLmNhbGwoZSxwKSxwLmhhbmRsZXIuZ3VpZHx8KHAuaGFuZGxlci5ndWlkPW4uZ3VpZCkpLG8/ZC5zcGxpY2UoZC5kZWxlZ2F0ZUNvdW50KyssMCxwKTpkLnB1c2gocCkscHQuZXZlbnQuZ2xvYmFsW2hdPSEwKTtlPW51bGx9fSxyZW1vdmU6ZnVuY3Rpb24oZSx0LG4scixpKXt2YXIgbyxhLHMsdSxsLGMsZixwLGQsaCxnLG09cHQuaGFzRGF0YShlKSYmcHQuX2RhdGEoZSk7aWYobSYmKGM9bS5ldmVudHMpKXtmb3IodD0odHx8XCJcIikubWF0Y2goaHQpfHxbXCJcIl0sbD10Lmxlbmd0aDtsLS07KWlmKHM9SXQuZXhlYyh0W2xdKXx8W10sZD1nPXNbMV0saD0oc1syXXx8XCJcIikuc3BsaXQoXCIuXCIpLnNvcnQoKSxkKXtmb3IoZj1wdC5ldmVudC5zcGVjaWFsW2RdfHx7fSxkPShyP2YuZGVsZWdhdGVUeXBlOmYuYmluZFR5cGUpfHxkLHA9Y1tkXXx8W10scz1zWzJdJiZSZWdFeHAoXCIoXnxcXFxcLilcIitoLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC58KVwiKStcIihcXFxcLnwkKVwiKSx1PW89cC5sZW5ndGg7by0tOylhPXBbb10sIWkmJmchPT1hLm9yaWdUeXBlfHxuJiZuLmd1aWQhPT1hLmd1aWR8fHMmJiFzLnRlc3QoYS5uYW1lc3BhY2UpfHxyJiZyIT09YS5zZWxlY3RvciYmKFwiKipcIiE9PXJ8fCFhLnNlbGVjdG9yKXx8KHAuc3BsaWNlKG8sMSksYS5zZWxlY3RvciYmcC5kZWxlZ2F0ZUNvdW50LS0sZi5yZW1vdmUmJmYucmVtb3ZlLmNhbGwoZSxhKSk7dSYmIXAubGVuZ3RoJiYoZi50ZWFyZG93biYmZi50ZWFyZG93bi5jYWxsKGUsaCxtLmhhbmRsZSkhPT0hMXx8cHQucmVtb3ZlRXZlbnQoZSxkLG0uaGFuZGxlKSxkZWxldGUgY1tkXSl9ZWxzZSBmb3IoZCBpbiBjKXB0LmV2ZW50LnJlbW92ZShlLGQrdFtsXSxuLHIsITApO3B0LmlzRW1wdHlPYmplY3QoYykmJihkZWxldGUgbS5oYW5kbGUscHQuX3JlbW92ZURhdGEoZSxcImV2ZW50c1wiKSl9fSx0cmlnZ2VyOmZ1bmN0aW9uKGUsbixpLG8pe3ZhciBhLHMsdSxsLGMsZixwLGQ9W2l8fEtdLGg9Y3QuY2FsbChlLFwidHlwZVwiKT9lLnR5cGU6ZSxnPWN0LmNhbGwoZSxcIm5hbWVzcGFjZVwiKT9lLm5hbWVzcGFjZS5zcGxpdChcIi5cIik6W107aWYodT1mPWk9aXx8SywzIT09aS5ub2RlVHlwZSYmOCE9PWkubm9kZVR5cGUmJiEkdC50ZXN0KGgrcHQuZXZlbnQudHJpZ2dlcmVkKSYmKGguaW5kZXhPZihcIi5cIik+PTAmJihnPWguc3BsaXQoXCIuXCIpLGg9Zy5zaGlmdCgpLGcuc29ydCgpKSxzPTA+aC5pbmRleE9mKFwiOlwiKSYmXCJvblwiK2gsZT1lW3B0LmV4cGFuZG9dP2U6bmV3IHB0LkV2ZW50KGgsXCJvYmplY3RcIj09dHlwZW9mIGUmJmUpLGUuaXNUcmlnZ2VyPW8/MjozLGUubmFtZXNwYWNlPWcuam9pbihcIi5cIiksZS5uYW1lc3BhY2VfcmU9ZS5uYW1lc3BhY2U/UmVnRXhwKFwiKF58XFxcXC4pXCIrZy5qb2luKFwiXFxcXC4oPzouKlxcXFwufClcIikrXCIoXFxcXC58JClcIik6bnVsbCxlLnJlc3VsdD1yLGUudGFyZ2V0fHwoZS50YXJnZXQ9aSksbj1udWxsPT1uP1tlXTpwdC5tYWtlQXJyYXkobixbZV0pLGM9cHQuZXZlbnQuc3BlY2lhbFtoXXx8e30sb3x8IWMudHJpZ2dlcnx8Yy50cmlnZ2VyLmFwcGx5KGksbikhPT0hMSkpe2lmKCFvJiYhYy5ub0J1YmJsZSYmIXB0LmlzV2luZG93KGkpKXtmb3IobD1jLmRlbGVnYXRlVHlwZXx8aCwkdC50ZXN0KGwraCl8fCh1PXUucGFyZW50Tm9kZSk7dTt1PXUucGFyZW50Tm9kZSlkLnB1c2godSksZj11O2Y9PT0oaS5vd25lckRvY3VtZW50fHxLKSYmZC5wdXNoKGYuZGVmYXVsdFZpZXd8fGYucGFyZW50V2luZG93fHx0KX1mb3IocD0wOyh1PWRbcCsrXSkmJiFlLmlzUHJvcGFnYXRpb25TdG9wcGVkKCk7KWUudHlwZT1wPjE/bDpjLmJpbmRUeXBlfHxoLGE9KHB0Ll9kYXRhKHUsXCJldmVudHNcIil8fHt9KVtlLnR5cGVdJiZwdC5fZGF0YSh1LFwiaGFuZGxlXCIpLGEmJmEuYXBwbHkodSxuKSxhPXMmJnVbc10sYSYmcHQuYWNjZXB0RGF0YSh1KSYmYS5hcHBseSYmYS5hcHBseSh1LG4pPT09ITEmJmUucHJldmVudERlZmF1bHQoKTtpZihlLnR5cGU9aCwhbyYmIWUuaXNEZWZhdWx0UHJldmVudGVkKCkmJighYy5fZGVmYXVsdHx8Yy5fZGVmYXVsdC5hcHBseShkLnBvcCgpLG4pPT09ITEpJiZwdC5hY2NlcHREYXRhKGkpJiZzJiZpW2hdJiYhcHQuaXNXaW5kb3coaSkpe2Y9aVtzXSxmJiYoaVtzXT1udWxsKSxwdC5ldmVudC50cmlnZ2VyZWQ9aDt0cnl7aVtoXSgpfWNhdGNoKG0pe31wdC5ldmVudC50cmlnZ2VyZWQ9cixmJiYoaVtzXT1mKX1yZXR1cm4gZS5yZXN1bHR9fSxkaXNwYXRjaDpmdW5jdGlvbihlKXtlPXB0LmV2ZW50LmZpeChlKTt2YXIgdCxuLGksbyxhLHM9W10sdT1zdC5jYWxsKGFyZ3VtZW50cyksbD0ocHQuX2RhdGEodGhpcyxcImV2ZW50c1wiKXx8e30pW2UudHlwZV18fFtdLGM9cHQuZXZlbnQuc3BlY2lhbFtlLnR5cGVdfHx7fTtpZih1WzBdPWUsZS5kZWxlZ2F0ZVRhcmdldD10aGlzLCFjLnByZURpc3BhdGNofHxjLnByZURpc3BhdGNoLmNhbGwodGhpcyxlKSE9PSExKXtmb3Iocz1wdC5ldmVudC5oYW5kbGVycy5jYWxsKHRoaXMsZSxsKSx0PTA7KG89c1t0KytdKSYmIWUuaXNQcm9wYWdhdGlvblN0b3BwZWQoKTspZm9yKGUuY3VycmVudFRhcmdldD1vLmVsZW0sYT0wOyhpPW8uaGFuZGxlcnNbYSsrXSkmJiFlLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCk7KSghZS5uYW1lc3BhY2VfcmV8fGUubmFtZXNwYWNlX3JlLnRlc3QoaS5uYW1lc3BhY2UpKSYmKGUuaGFuZGxlT2JqPWksZS5kYXRhPWkuZGF0YSxuPSgocHQuZXZlbnQuc3BlY2lhbFtpLm9yaWdUeXBlXXx8e30pLmhhbmRsZXx8aS5oYW5kbGVyKS5hcHBseShvLmVsZW0sdSksbiE9PXImJihlLnJlc3VsdD1uKT09PSExJiYoZS5wcmV2ZW50RGVmYXVsdCgpLGUuc3RvcFByb3BhZ2F0aW9uKCkpKTtyZXR1cm4gYy5wb3N0RGlzcGF0Y2gmJmMucG9zdERpc3BhdGNoLmNhbGwodGhpcyxlKSxlLnJlc3VsdH19LGhhbmRsZXJzOmZ1bmN0aW9uKGUsdCl7dmFyIG4saSxvLGEscz1bXSx1PXQuZGVsZWdhdGVDb3VudCxsPWUudGFyZ2V0O2lmKHUmJmwubm9kZVR5cGUmJighZS5idXR0b258fFwiY2xpY2tcIiE9PWUudHlwZSkpZm9yKDtsIT10aGlzO2w9bC5wYXJlbnROb2RlfHx0aGlzKWlmKDE9PT1sLm5vZGVUeXBlJiYobC5kaXNhYmxlZCE9PSEwfHxcImNsaWNrXCIhPT1lLnR5cGUpKXtmb3Iobz1bXSxhPTA7dT5hO2ErKylpPXRbYV0sbj1pLnNlbGVjdG9yK1wiIFwiLG9bbl09PT1yJiYob1tuXT1pLm5lZWRzQ29udGV4dD9wdChuLHRoaXMpLmluZGV4KGwpPj0wOnB0LmZpbmQobix0aGlzLG51bGwsW2xdKS5sZW5ndGgpLG9bbl0mJm8ucHVzaChpKTtvLmxlbmd0aCYmcy5wdXNoKHtlbGVtOmwsaGFuZGxlcnM6b30pfXJldHVybiB0Lmxlbmd0aD51JiZzLnB1c2goe2VsZW06dGhpcyxoYW5kbGVyczp0LnNsaWNlKHUpfSksc30sZml4OmZ1bmN0aW9uKGUpe2lmKGVbcHQuZXhwYW5kb10pcmV0dXJuIGU7dmFyIHQsbixyLGk9ZS50eXBlLG89ZSxhPXRoaXMuZml4SG9va3NbaV07Zm9yKGF8fCh0aGlzLmZpeEhvb2tzW2ldPWE9V3QudGVzdChpKT90aGlzLm1vdXNlSG9va3M6UnQudGVzdChpKT90aGlzLmtleUhvb2tzOnt9KSxyPWEucHJvcHM/dGhpcy5wcm9wcy5jb25jYXQoYS5wcm9wcyk6dGhpcy5wcm9wcyxlPW5ldyBwdC5FdmVudChvKSx0PXIubGVuZ3RoO3QtLTspbj1yW3RdLGVbbl09b1tuXTtyZXR1cm4gZS50YXJnZXR8fChlLnRhcmdldD1vLnNyY0VsZW1lbnR8fEspLDM9PT1lLnRhcmdldC5ub2RlVHlwZSYmKGUudGFyZ2V0PWUudGFyZ2V0LnBhcmVudE5vZGUpLGUubWV0YUtleT0hIWUubWV0YUtleSxhLmZpbHRlcj9hLmZpbHRlcihlLG8pOmV9LHByb3BzOlwiYWx0S2V5IGJ1YmJsZXMgY2FuY2VsYWJsZSBjdHJsS2V5IGN1cnJlbnRUYXJnZXQgZXZlbnRQaGFzZSBtZXRhS2V5IHJlbGF0ZWRUYXJnZXQgc2hpZnRLZXkgdGFyZ2V0IHRpbWVTdGFtcCB2aWV3IHdoaWNoXCIuc3BsaXQoXCIgXCIpLGZpeEhvb2tzOnt9LGtleUhvb2tzOntwcm9wczpcImNoYXIgY2hhckNvZGUga2V5IGtleUNvZGVcIi5zcGxpdChcIiBcIiksZmlsdGVyOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIG51bGw9PWUud2hpY2gmJihlLndoaWNoPW51bGwhPXQuY2hhckNvZGU/dC5jaGFyQ29kZTp0LmtleUNvZGUpLGV9fSxtb3VzZUhvb2tzOntwcm9wczpcImJ1dHRvbiBidXR0b25zIGNsaWVudFggY2xpZW50WSBmcm9tRWxlbWVudCBvZmZzZXRYIG9mZnNldFkgcGFnZVggcGFnZVkgc2NyZWVuWCBzY3JlZW5ZIHRvRWxlbWVudFwiLnNwbGl0KFwiIFwiKSxmaWx0ZXI6ZnVuY3Rpb24oZSx0KXt2YXIgbixpLG8sYT10LmJ1dHRvbixzPXQuZnJvbUVsZW1lbnQ7cmV0dXJuIG51bGw9PWUucGFnZVgmJm51bGwhPXQuY2xpZW50WCYmKGk9ZS50YXJnZXQub3duZXJEb2N1bWVudHx8SyxvPWkuZG9jdW1lbnRFbGVtZW50LG49aS5ib2R5LGUucGFnZVg9dC5jbGllbnRYKyhvJiZvLnNjcm9sbExlZnR8fG4mJm4uc2Nyb2xsTGVmdHx8MCktKG8mJm8uY2xpZW50TGVmdHx8biYmbi5jbGllbnRMZWZ0fHwwKSxlLnBhZ2VZPXQuY2xpZW50WSsobyYmby5zY3JvbGxUb3B8fG4mJm4uc2Nyb2xsVG9wfHwwKS0obyYmby5jbGllbnRUb3B8fG4mJm4uY2xpZW50VG9wfHwwKSksIWUucmVsYXRlZFRhcmdldCYmcyYmKGUucmVsYXRlZFRhcmdldD1zPT09ZS50YXJnZXQ/dC50b0VsZW1lbnQ6cyksZS53aGljaHx8YT09PXJ8fChlLndoaWNoPTEmYT8xOjImYT8zOjQmYT8yOjApLGV9fSxzcGVjaWFsOntsb2FkOntub0J1YmJsZTohMH0sZm9jdXM6e3RyaWdnZXI6ZnVuY3Rpb24oKXtpZih0aGlzIT09cCgpJiZ0aGlzLmZvY3VzKXRyeXtyZXR1cm4gdGhpcy5mb2N1cygpLCExfWNhdGNoKGUpe319LGRlbGVnYXRlVHlwZTpcImZvY3VzaW5cIn0sYmx1cjp7dHJpZ2dlcjpmdW5jdGlvbigpe3JldHVybiB0aGlzPT09cCgpJiZ0aGlzLmJsdXI/KHRoaXMuYmx1cigpLCExKTpyfSxkZWxlZ2F0ZVR5cGU6XCJmb2N1c291dFwifSxjbGljazp7dHJpZ2dlcjpmdW5jdGlvbigpe3JldHVybiBwdC5ub2RlTmFtZSh0aGlzLFwiaW5wdXRcIikmJlwiY2hlY2tib3hcIj09PXRoaXMudHlwZSYmdGhpcy5jbGljaz8odGhpcy5jbGljaygpLCExKTpyfSxfZGVmYXVsdDpmdW5jdGlvbihlKXtyZXR1cm4gcHQubm9kZU5hbWUoZS50YXJnZXQsXCJhXCIpfX0sYmVmb3JldW5sb2FkOntwb3N0RGlzcGF0Y2g6ZnVuY3Rpb24oZSl7ZS5yZXN1bHQhPT1yJiYoZS5vcmlnaW5hbEV2ZW50LnJldHVyblZhbHVlPWUucmVzdWx0KX19fSxzaW11bGF0ZTpmdW5jdGlvbihlLHQsbixyKXt2YXIgaT1wdC5leHRlbmQobmV3IHB0LkV2ZW50LG4se3R5cGU6ZSxpc1NpbXVsYXRlZDohMCxvcmlnaW5hbEV2ZW50Ont9fSk7cj9wdC5ldmVudC50cmlnZ2VyKGksbnVsbCx0KTpwdC5ldmVudC5kaXNwYXRjaC5jYWxsKHQsaSksaS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmbi5wcmV2ZW50RGVmYXVsdCgpfX0scHQucmVtb3ZlRXZlbnQ9Sy5yZW1vdmVFdmVudExpc3RlbmVyP2Z1bmN0aW9uKGUsdCxuKXtlLnJlbW92ZUV2ZW50TGlzdGVuZXImJmUucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LG4sITEpfTpmdW5jdGlvbihlLHQsbil7dmFyIHI9XCJvblwiK3Q7ZS5kZXRhY2hFdmVudCYmKHR5cGVvZiBlW3JdPT09RyYmKGVbcl09bnVsbCksZS5kZXRhY2hFdmVudChyLG4pKX0scHQuRXZlbnQ9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcyBpbnN0YW5jZW9mIHB0LkV2ZW50PyhlJiZlLnR5cGU/KHRoaXMub3JpZ2luYWxFdmVudD1lLHRoaXMudHlwZT1lLnR5cGUsdGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQ9ZS5kZWZhdWx0UHJldmVudGVkfHxlLnJldHVyblZhbHVlPT09ITF8fGUuZ2V0UHJldmVudERlZmF1bHQmJmUuZ2V0UHJldmVudERlZmF1bHQoKT9jOmYpOnRoaXMudHlwZT1lLHQmJnB0LmV4dGVuZCh0aGlzLHQpLHRoaXMudGltZVN0YW1wPWUmJmUudGltZVN0YW1wfHxwdC5ub3coKSx0aGlzW3B0LmV4cGFuZG9dPSEwLHIpOm5ldyBwdC5FdmVudChlLHQpfSxwdC5FdmVudC5wcm90b3R5cGU9e2lzRGVmYXVsdFByZXZlbnRlZDpmLGlzUHJvcGFnYXRpb25TdG9wcGVkOmYsaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ6ZixwcmV2ZW50RGVmYXVsdDpmdW5jdGlvbigpe3ZhciBlPXRoaXMub3JpZ2luYWxFdmVudDt0aGlzLmlzRGVmYXVsdFByZXZlbnRlZD1jLGUmJihlLnByZXZlbnREZWZhdWx0P2UucHJldmVudERlZmF1bHQoKTplLnJldHVyblZhbHVlPSExKX0sc3RvcFByb3BhZ2F0aW9uOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5vcmlnaW5hbEV2ZW50O3RoaXMuaXNQcm9wYWdhdGlvblN0b3BwZWQ9YyxlJiYoZS5zdG9wUHJvcGFnYXRpb24mJmUuc3RvcFByb3BhZ2F0aW9uKCksZS5jYW5jZWxCdWJibGU9ITApfSxzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb246ZnVuY3Rpb24oKXt0aGlzLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkPWMsdGhpcy5zdG9wUHJvcGFnYXRpb24oKX19LHB0LmVhY2goe21vdXNlZW50ZXI6XCJtb3VzZW92ZXJcIixtb3VzZWxlYXZlOlwibW91c2VvdXRcIn0sZnVuY3Rpb24oZSx0KXtwdC5ldmVudC5zcGVjaWFsW2VdPXtkZWxlZ2F0ZVR5cGU6dCxiaW5kVHlwZTp0LGhhbmRsZTpmdW5jdGlvbihlKXt2YXIgbixyPXRoaXMsaT1lLnJlbGF0ZWRUYXJnZXQsbz1lLmhhbmRsZU9iajtyZXR1cm4oIWl8fGkhPT1yJiYhcHQuY29udGFpbnMocixpKSkmJihlLnR5cGU9by5vcmlnVHlwZSxuPW8uaGFuZGxlci5hcHBseSh0aGlzLGFyZ3VtZW50cyksZS50eXBlPXQpLG59fX0pLHB0LnN1cHBvcnQuc3VibWl0QnViYmxlc3x8KHB0LmV2ZW50LnNwZWNpYWwuc3VibWl0PXtzZXR1cDpmdW5jdGlvbigpe3JldHVybiBwdC5ub2RlTmFtZSh0aGlzLFwiZm9ybVwiKT8hMToocHQuZXZlbnQuYWRkKHRoaXMsXCJjbGljay5fc3VibWl0IGtleXByZXNzLl9zdWJtaXRcIixmdW5jdGlvbihlKXt2YXIgdD1lLnRhcmdldCxuPXB0Lm5vZGVOYW1lKHQsXCJpbnB1dFwiKXx8cHQubm9kZU5hbWUodCxcImJ1dHRvblwiKT90LmZvcm06cjtuJiYhcHQuX2RhdGEobixcInN1Ym1pdEJ1YmJsZXNcIikmJihwdC5ldmVudC5hZGQobixcInN1Ym1pdC5fc3VibWl0XCIsZnVuY3Rpb24oZSl7ZS5fc3VibWl0X2J1YmJsZT0hMH0pLHB0Ll9kYXRhKG4sXCJzdWJtaXRCdWJibGVzXCIsITApKX0pLHIpfSxwb3N0RGlzcGF0Y2g6ZnVuY3Rpb24oZSl7ZS5fc3VibWl0X2J1YmJsZSYmKGRlbGV0ZSBlLl9zdWJtaXRfYnViYmxlLHRoaXMucGFyZW50Tm9kZSYmIWUuaXNUcmlnZ2VyJiZwdC5ldmVudC5zaW11bGF0ZShcInN1Ym1pdFwiLHRoaXMucGFyZW50Tm9kZSxlLCEwKSl9LHRlYXJkb3duOmZ1bmN0aW9uKCl7cmV0dXJuIHB0Lm5vZGVOYW1lKHRoaXMsXCJmb3JtXCIpPyExOihwdC5ldmVudC5yZW1vdmUodGhpcyxcIi5fc3VibWl0XCIpLHIpfX0pLHB0LnN1cHBvcnQuY2hhbmdlQnViYmxlc3x8KHB0LmV2ZW50LnNwZWNpYWwuY2hhbmdlPXtzZXR1cDpmdW5jdGlvbigpe3JldHVybiBQdC50ZXN0KHRoaXMubm9kZU5hbWUpPygoXCJjaGVja2JveFwiPT09dGhpcy50eXBlfHxcInJhZGlvXCI9PT10aGlzLnR5cGUpJiYocHQuZXZlbnQuYWRkKHRoaXMsXCJwcm9wZXJ0eWNoYW5nZS5fY2hhbmdlXCIsZnVuY3Rpb24oZSl7XCJjaGVja2VkXCI9PT1lLm9yaWdpbmFsRXZlbnQucHJvcGVydHlOYW1lJiYodGhpcy5fanVzdF9jaGFuZ2VkPSEwKX0pLHB0LmV2ZW50LmFkZCh0aGlzLFwiY2xpY2suX2NoYW5nZVwiLGZ1bmN0aW9uKGUpe3RoaXMuX2p1c3RfY2hhbmdlZCYmIWUuaXNUcmlnZ2VyJiYodGhpcy5fanVzdF9jaGFuZ2VkPSExKSxwdC5ldmVudC5zaW11bGF0ZShcImNoYW5nZVwiLHRoaXMsZSwhMCl9KSksITEpOihwdC5ldmVudC5hZGQodGhpcyxcImJlZm9yZWFjdGl2YXRlLl9jaGFuZ2VcIixmdW5jdGlvbihlKXt2YXIgdD1lLnRhcmdldDtQdC50ZXN0KHQubm9kZU5hbWUpJiYhcHQuX2RhdGEodCxcImNoYW5nZUJ1YmJsZXNcIikmJihwdC5ldmVudC5hZGQodCxcImNoYW5nZS5fY2hhbmdlXCIsZnVuY3Rpb24oZSl7IXRoaXMucGFyZW50Tm9kZXx8ZS5pc1NpbXVsYXRlZHx8ZS5pc1RyaWdnZXJ8fHB0LmV2ZW50LnNpbXVsYXRlKFwiY2hhbmdlXCIsdGhpcy5wYXJlbnROb2RlLGUsITApfSkscHQuX2RhdGEodCxcImNoYW5nZUJ1YmJsZXNcIiwhMCkpfSkscil9LGhhbmRsZTpmdW5jdGlvbihlKXt2YXIgdD1lLnRhcmdldDtyZXR1cm4gdGhpcyE9PXR8fGUuaXNTaW11bGF0ZWR8fGUuaXNUcmlnZ2VyfHxcInJhZGlvXCIhPT10LnR5cGUmJlwiY2hlY2tib3hcIiE9PXQudHlwZT9lLmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKTpyfSx0ZWFyZG93bjpmdW5jdGlvbigpe3JldHVybiBwdC5ldmVudC5yZW1vdmUodGhpcyxcIi5fY2hhbmdlXCIpLCFQdC50ZXN0KHRoaXMubm9kZU5hbWUpfX0pLHB0LnN1cHBvcnQuZm9jdXNpbkJ1YmJsZXN8fHB0LmVhY2goe2ZvY3VzOlwiZm9jdXNpblwiLGJsdXI6XCJmb2N1c291dFwifSxmdW5jdGlvbihlLHQpe3ZhciBuPTAscj1mdW5jdGlvbihlKXtwdC5ldmVudC5zaW11bGF0ZSh0LGUudGFyZ2V0LHB0LmV2ZW50LmZpeChlKSwhMCl9O3B0LmV2ZW50LnNwZWNpYWxbdF09e3NldHVwOmZ1bmN0aW9uKCl7MD09PW4rKyYmSy5hZGRFdmVudExpc3RlbmVyKGUsciwhMCl9LHRlYXJkb3duOmZ1bmN0aW9uKCl7MD09PS0tbiYmSy5yZW1vdmVFdmVudExpc3RlbmVyKGUsciwhMCl9fX0pLHB0LmZuLmV4dGVuZCh7b246ZnVuY3Rpb24oZSx0LG4saSxvKXt2YXIgYSxzO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXtcInN0cmluZ1wiIT10eXBlb2YgdCYmKG49bnx8dCx0PXIpO2ZvcihhIGluIGUpdGhpcy5vbihhLHQsbixlW2FdLG8pO3JldHVybiB0aGlzfWlmKG51bGw9PW4mJm51bGw9PWk/KGk9dCxuPXQ9cik6bnVsbD09aSYmKFwic3RyaW5nXCI9PXR5cGVvZiB0PyhpPW4sbj1yKTooaT1uLG49dCx0PXIpKSxpPT09ITEpaT1mO2Vsc2UgaWYoIWkpcmV0dXJuIHRoaXM7cmV0dXJuIDE9PT1vJiYocz1pLGk9ZnVuY3Rpb24oZSl7cmV0dXJuIHB0KCkub2ZmKGUpLHMuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxpLmd1aWQ9cy5ndWlkfHwocy5ndWlkPXB0Lmd1aWQrKykpLHRoaXMuZWFjaChmdW5jdGlvbigpe3B0LmV2ZW50LmFkZCh0aGlzLGUsaSxuLHQpfSl9LG9uZTpmdW5jdGlvbihlLHQsbixyKXtyZXR1cm4gdGhpcy5vbihlLHQsbixyLDEpfSxvZmY6ZnVuY3Rpb24oZSx0LG4pe3ZhciBpLG87aWYoZSYmZS5wcmV2ZW50RGVmYXVsdCYmZS5oYW5kbGVPYmopcmV0dXJuIGk9ZS5oYW5kbGVPYmoscHQoZS5kZWxlZ2F0ZVRhcmdldCkub2ZmKGkubmFtZXNwYWNlP2kub3JpZ1R5cGUrXCIuXCIraS5uYW1lc3BhY2U6aS5vcmlnVHlwZSxpLnNlbGVjdG9yLGkuaGFuZGxlciksdGhpcztpZihcIm9iamVjdFwiPT10eXBlb2YgZSl7Zm9yKG8gaW4gZSl0aGlzLm9mZihvLHQsZVtvXSk7cmV0dXJuIHRoaXN9cmV0dXJuKHQ9PT0hMXx8XCJmdW5jdGlvblwiPT10eXBlb2YgdCkmJihuPXQsdD1yKSxuPT09ITEmJihuPWYpLHRoaXMuZWFjaChmdW5jdGlvbigpe3B0LmV2ZW50LnJlbW92ZSh0aGlzLGUsbix0KX0pfSx0cmlnZ2VyOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3B0LmV2ZW50LnRyaWdnZXIoZSx0LHRoaXMpfSl9LHRyaWdnZXJIYW5kbGVyOmZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpc1swXTtyZXR1cm4gbj9wdC5ldmVudC50cmlnZ2VyKGUsdCxuLCEwKTpyfX0pO3ZhciB6dD0vXi5bXjojXFxbXFwuLF0qJC8sWHQ9L14oPzpwYXJlbnRzfHByZXYoPzpVbnRpbHxBbGwpKS8sVXQ9cHQuZXhwci5tYXRjaC5uZWVkc0NvbnRleHQsVnQ9e2NoaWxkcmVuOiEwLGNvbnRlbnRzOiEwLG5leHQ6ITAscHJldjohMH07cHQuZm4uZXh0ZW5kKHtmaW5kOmZ1bmN0aW9uKGUpe3ZhciB0LG49W10scj10aGlzLGk9ci5sZW5ndGg7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIGUpcmV0dXJuIHRoaXMucHVzaFN0YWNrKHB0KGUpLmZpbHRlcihmdW5jdGlvbigpe2Zvcih0PTA7aT50O3QrKylpZihwdC5jb250YWlucyhyW3RdLHRoaXMpKXJldHVybiEwfSkpO2Zvcih0PTA7aT50O3QrKylwdC5maW5kKGUsclt0XSxuKTtyZXR1cm4gbj10aGlzLnB1c2hTdGFjayhpPjE/cHQudW5pcXVlKG4pOm4pLG4uc2VsZWN0b3I9dGhpcy5zZWxlY3Rvcj90aGlzLnNlbGVjdG9yK1wiIFwiK2U6ZSxufSxoYXM6ZnVuY3Rpb24oZSl7dmFyIHQsbj1wdChlLHRoaXMpLHI9bi5sZW5ndGg7cmV0dXJuIHRoaXMuZmlsdGVyKGZ1bmN0aW9uKCl7Zm9yKHQ9MDtyPnQ7dCsrKWlmKHB0LmNvbnRhaW5zKHRoaXMsblt0XSkpcmV0dXJuITB9KX0sbm90OmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnB1c2hTdGFjayhoKHRoaXMsZXx8W10sITApKX0sZmlsdGVyOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnB1c2hTdGFjayhoKHRoaXMsZXx8W10sITEpKX0saXM6ZnVuY3Rpb24oZSl7cmV0dXJuISFoKHRoaXMsXCJzdHJpbmdcIj09dHlwZW9mIGUmJlV0LnRlc3QoZSk/cHQoZSk6ZXx8W10sITEpLmxlbmd0aH0sY2xvc2VzdDpmdW5jdGlvbihlLHQpe2Zvcih2YXIgbixyPTAsaT10aGlzLmxlbmd0aCxvPVtdLGE9VXQudGVzdChlKXx8XCJzdHJpbmdcIiE9dHlwZW9mIGU/cHQoZSx0fHx0aGlzLmNvbnRleHQpOjA7aT5yO3IrKylmb3Iobj10aGlzW3JdO24mJm4hPT10O249bi5wYXJlbnROb2RlKWlmKDExPm4ubm9kZVR5cGUmJihhP2EuaW5kZXgobik+LTE6MT09PW4ubm9kZVR5cGUmJnB0LmZpbmQubWF0Y2hlc1NlbGVjdG9yKG4sZSkpKXtuPW8ucHVzaChuKTticmVha31yZXR1cm4gdGhpcy5wdXNoU3RhY2soby5sZW5ndGg+MT9wdC51bmlxdWUobyk6byl9LGluZGV4OmZ1bmN0aW9uKGUpe3JldHVybiBlP1wic3RyaW5nXCI9PXR5cGVvZiBlP3B0LmluQXJyYXkodGhpc1swXSxwdChlKSk6cHQuaW5BcnJheShlLmpxdWVyeT9lWzBdOmUsdGhpcyk6dGhpc1swXSYmdGhpc1swXS5wYXJlbnROb2RlP3RoaXMuZmlyc3QoKS5wcmV2QWxsKCkubGVuZ3RoOi0xfSxhZGQ6ZnVuY3Rpb24oZSx0KXt2YXIgbj1cInN0cmluZ1wiPT10eXBlb2YgZT9wdChlLHQpOnB0Lm1ha2VBcnJheShlJiZlLm5vZGVUeXBlP1tlXTplKSxyPXB0Lm1lcmdlKHRoaXMuZ2V0KCksbik7cmV0dXJuIHRoaXMucHVzaFN0YWNrKHB0LnVuaXF1ZShyKSl9LGFkZEJhY2s6ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuYWRkKG51bGw9PWU/dGhpcy5wcmV2T2JqZWN0OnRoaXMucHJldk9iamVjdC5maWx0ZXIoZSkpfX0pLHB0LmVhY2goe3BhcmVudDpmdW5jdGlvbihlKXt2YXIgdD1lLnBhcmVudE5vZGU7cmV0dXJuIHQmJjExIT09dC5ub2RlVHlwZT90Om51bGx9LHBhcmVudHM6ZnVuY3Rpb24oZSl7cmV0dXJuIHB0LmRpcihlLFwicGFyZW50Tm9kZVwiKX0scGFyZW50c1VudGlsOmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gcHQuZGlyKGUsXCJwYXJlbnROb2RlXCIsbil9LG5leHQ6ZnVuY3Rpb24oZSl7cmV0dXJuIGQoZSxcIm5leHRTaWJsaW5nXCIpfSxwcmV2OmZ1bmN0aW9uKGUpe3JldHVybiBkKGUsXCJwcmV2aW91c1NpYmxpbmdcIil9LG5leHRBbGw6ZnVuY3Rpb24oZSl7cmV0dXJuIHB0LmRpcihlLFwibmV4dFNpYmxpbmdcIilcbn0scHJldkFsbDpmdW5jdGlvbihlKXtyZXR1cm4gcHQuZGlyKGUsXCJwcmV2aW91c1NpYmxpbmdcIil9LG5leHRVbnRpbDpmdW5jdGlvbihlLHQsbil7cmV0dXJuIHB0LmRpcihlLFwibmV4dFNpYmxpbmdcIixuKX0scHJldlVudGlsOmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gcHQuZGlyKGUsXCJwcmV2aW91c1NpYmxpbmdcIixuKX0sc2libGluZ3M6ZnVuY3Rpb24oZSl7cmV0dXJuIHB0LnNpYmxpbmcoKGUucGFyZW50Tm9kZXx8e30pLmZpcnN0Q2hpbGQsZSl9LGNoaWxkcmVuOmZ1bmN0aW9uKGUpe3JldHVybiBwdC5zaWJsaW5nKGUuZmlyc3RDaGlsZCl9LGNvbnRlbnRzOmZ1bmN0aW9uKGUpe3JldHVybiBwdC5ub2RlTmFtZShlLFwiaWZyYW1lXCIpP2UuY29udGVudERvY3VtZW50fHxlLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ6cHQubWVyZ2UoW10sZS5jaGlsZE5vZGVzKX19LGZ1bmN0aW9uKGUsdCl7cHQuZm5bZV09ZnVuY3Rpb24obixyKXt2YXIgaT1wdC5tYXAodGhpcyx0LG4pO3JldHVyblwiVW50aWxcIiE9PWUuc2xpY2UoLTUpJiYocj1uKSxyJiZcInN0cmluZ1wiPT10eXBlb2YgciYmKGk9cHQuZmlsdGVyKHIsaSkpLHRoaXMubGVuZ3RoPjEmJihWdFtlXXx8KGk9cHQudW5pcXVlKGkpKSxYdC50ZXN0KGUpJiYoaT1pLnJldmVyc2UoKSkpLHRoaXMucHVzaFN0YWNrKGkpfX0pLHB0LmV4dGVuZCh7ZmlsdGVyOmZ1bmN0aW9uKGUsdCxuKXt2YXIgcj10WzBdO3JldHVybiBuJiYoZT1cIjpub3QoXCIrZStcIilcIiksMT09PXQubGVuZ3RoJiYxPT09ci5ub2RlVHlwZT9wdC5maW5kLm1hdGNoZXNTZWxlY3RvcihyLGUpP1tyXTpbXTpwdC5maW5kLm1hdGNoZXMoZSxwdC5ncmVwKHQsZnVuY3Rpb24oZSl7cmV0dXJuIDE9PT1lLm5vZGVUeXBlfSkpfSxkaXI6ZnVuY3Rpb24oZSx0LG4pe2Zvcih2YXIgaT1bXSxvPWVbdF07byYmOSE9PW8ubm9kZVR5cGUmJihuPT09cnx8MSE9PW8ubm9kZVR5cGV8fCFwdChvKS5pcyhuKSk7KTE9PT1vLm5vZGVUeXBlJiZpLnB1c2gobyksbz1vW3RdO3JldHVybiBpfSxzaWJsaW5nOmZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBuPVtdO2U7ZT1lLm5leHRTaWJsaW5nKTE9PT1lLm5vZGVUeXBlJiZlIT09dCYmbi5wdXNoKGUpO3JldHVybiBufX0pO3ZhciBZdD1cImFiYnJ8YXJ0aWNsZXxhc2lkZXxhdWRpb3xiZGl8Y2FudmFzfGRhdGF8ZGF0YWxpc3R8ZGV0YWlsc3xmaWdjYXB0aW9ufGZpZ3VyZXxmb290ZXJ8aGVhZGVyfGhncm91cHxtYXJrfG1ldGVyfG5hdnxvdXRwdXR8cHJvZ3Jlc3N8c2VjdGlvbnxzdW1tYXJ5fHRpbWV8dmlkZW9cIixKdD0vIGpRdWVyeVxcZCs9XCIoPzpudWxsfFxcZCspXCIvZyxHdD1SZWdFeHAoXCI8KD86XCIrWXQrXCIpW1xcXFxzLz5dXCIsXCJpXCIpLFF0PS9eXFxzKy8sS3Q9LzwoPyFhcmVhfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtKSgoW1xcdzpdKylbXj5dKilcXC8+L2dpLFp0PS88KFtcXHc6XSspLyxlbj0vPHRib2R5L2ksdG49Lzx8JiM/XFx3KzsvLG5uPS88KD86c2NyaXB0fHN0eWxlfGxpbmspL2kscm49L14oPzpjaGVja2JveHxyYWRpbykkL2ksb249L2NoZWNrZWRcXHMqKD86W149XXw9XFxzKi5jaGVja2VkLikvaSxhbj0vXiR8XFwvKD86amF2YXxlY21hKXNjcmlwdC9pLHNuPS9edHJ1ZVxcLyguKikvLHVuPS9eXFxzKjwhKD86XFxbQ0RBVEFcXFt8LS0pfCg/OlxcXVxcXXwtLSk+XFxzKiQvZyxsbj17b3B0aW9uOlsxLFwiPHNlbGVjdCBtdWx0aXBsZT0nbXVsdGlwbGUnPlwiLFwiPC9zZWxlY3Q+XCJdLGxlZ2VuZDpbMSxcIjxmaWVsZHNldD5cIixcIjwvZmllbGRzZXQ+XCJdLGFyZWE6WzEsXCI8bWFwPlwiLFwiPC9tYXA+XCJdLHBhcmFtOlsxLFwiPG9iamVjdD5cIixcIjwvb2JqZWN0PlwiXSx0aGVhZDpbMSxcIjx0YWJsZT5cIixcIjwvdGFibGU+XCJdLHRyOlsyLFwiPHRhYmxlPjx0Ym9keT5cIixcIjwvdGJvZHk+PC90YWJsZT5cIl0sY29sOlsyLFwiPHRhYmxlPjx0Ym9keT48L3Rib2R5Pjxjb2xncm91cD5cIixcIjwvY29sZ3JvdXA+PC90YWJsZT5cIl0sdGQ6WzMsXCI8dGFibGU+PHRib2R5Pjx0cj5cIixcIjwvdHI+PC90Ym9keT48L3RhYmxlPlwiXSxfZGVmYXVsdDpwdC5zdXBwb3J0Lmh0bWxTZXJpYWxpemU/WzAsXCJcIixcIlwiXTpbMSxcIlg8ZGl2PlwiLFwiPC9kaXY+XCJdfSxjbj1nKEspLGZuPWNuLmFwcGVuZENoaWxkKEsuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7bG4ub3B0Z3JvdXA9bG4ub3B0aW9uLGxuLnRib2R5PWxuLnRmb290PWxuLmNvbGdyb3VwPWxuLmNhcHRpb249bG4udGhlYWQsbG4udGg9bG4udGQscHQuZm4uZXh0ZW5kKHt0ZXh0OmZ1bmN0aW9uKGUpe3JldHVybiBwdC5hY2Nlc3ModGhpcyxmdW5jdGlvbihlKXtyZXR1cm4gZT09PXI/cHQudGV4dCh0aGlzKTp0aGlzLmVtcHR5KCkuYXBwZW5kKCh0aGlzWzBdJiZ0aGlzWzBdLm93bmVyRG9jdW1lbnR8fEspLmNyZWF0ZVRleHROb2RlKGUpKX0sbnVsbCxlLGFyZ3VtZW50cy5sZW5ndGgpfSxhcHBlbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsZnVuY3Rpb24oZSl7aWYoMT09PXRoaXMubm9kZVR5cGV8fDExPT09dGhpcy5ub2RlVHlwZXx8OT09PXRoaXMubm9kZVR5cGUpe3ZhciB0PW0odGhpcyxlKTt0LmFwcGVuZENoaWxkKGUpfX0pfSxwcmVwZW5kOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLGZ1bmN0aW9uKGUpe2lmKDE9PT10aGlzLm5vZGVUeXBlfHwxMT09PXRoaXMubm9kZVR5cGV8fDk9PT10aGlzLm5vZGVUeXBlKXt2YXIgdD1tKHRoaXMsZSk7dC5pbnNlcnRCZWZvcmUoZSx0LmZpcnN0Q2hpbGQpfX0pfSxiZWZvcmU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsZnVuY3Rpb24oZSl7dGhpcy5wYXJlbnROb2RlJiZ0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUsdGhpcyl9KX0sYWZ0ZXI6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsZnVuY3Rpb24oZSl7dGhpcy5wYXJlbnROb2RlJiZ0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUsdGhpcy5uZXh0U2libGluZyl9KX0scmVtb3ZlOmZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBuLHI9ZT9wdC5maWx0ZXIoZSx0aGlzKTp0aGlzLGk9MDtudWxsIT0obj1yW2ldKTtpKyspdHx8MSE9PW4ubm9kZVR5cGV8fHB0LmNsZWFuRGF0YSh3KG4pKSxuLnBhcmVudE5vZGUmJih0JiZwdC5jb250YWlucyhuLm93bmVyRG9jdW1lbnQsbikmJmIodyhuLFwic2NyaXB0XCIpKSxuLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobikpO3JldHVybiB0aGlzfSxlbXB0eTpmdW5jdGlvbigpe2Zvcih2YXIgZSx0PTA7bnVsbCE9KGU9dGhpc1t0XSk7dCsrKXtmb3IoMT09PWUubm9kZVR5cGUmJnB0LmNsZWFuRGF0YSh3KGUsITEpKTtlLmZpcnN0Q2hpbGQ7KWUucmVtb3ZlQ2hpbGQoZS5maXJzdENoaWxkKTtlLm9wdGlvbnMmJnB0Lm5vZGVOYW1lKGUsXCJzZWxlY3RcIikmJihlLm9wdGlvbnMubGVuZ3RoPTApfXJldHVybiB0aGlzfSxjbG9uZTpmdW5jdGlvbihlLHQpe3JldHVybiBlPW51bGw9PWU/ITE6ZSx0PW51bGw9PXQ/ZTp0LHRoaXMubWFwKGZ1bmN0aW9uKCl7cmV0dXJuIHB0LmNsb25lKHRoaXMsZSx0KX0pfSxodG1sOmZ1bmN0aW9uKGUpe3JldHVybiBwdC5hY2Nlc3ModGhpcyxmdW5jdGlvbihlKXt2YXIgdD10aGlzWzBdfHx7fSxuPTAsaT10aGlzLmxlbmd0aDtpZihlPT09cilyZXR1cm4gMT09PXQubm9kZVR5cGU/dC5pbm5lckhUTUwucmVwbGFjZShKdCxcIlwiKTpyO2lmKCEoXCJzdHJpbmdcIiE9dHlwZW9mIGV8fG5uLnRlc3QoZSl8fCFwdC5zdXBwb3J0Lmh0bWxTZXJpYWxpemUmJkd0LnRlc3QoZSl8fCFwdC5zdXBwb3J0LmxlYWRpbmdXaGl0ZXNwYWNlJiZRdC50ZXN0KGUpfHxsblsoWnQuZXhlYyhlKXx8W1wiXCIsXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCldKSl7ZT1lLnJlcGxhY2UoS3QsXCI8JDE+PC8kMj5cIik7dHJ5e2Zvcig7aT5uO24rKyl0PXRoaXNbbl18fHt9LDE9PT10Lm5vZGVUeXBlJiYocHQuY2xlYW5EYXRhKHcodCwhMSkpLHQuaW5uZXJIVE1MPWUpO3Q9MH1jYXRjaChvKXt9fXQmJnRoaXMuZW1wdHkoKS5hcHBlbmQoZSl9LG51bGwsZSxhcmd1bWVudHMubGVuZ3RoKX0scmVwbGFjZVdpdGg6ZnVuY3Rpb24oKXt2YXIgZT1wdC5tYXAodGhpcyxmdW5jdGlvbihlKXtyZXR1cm5bZS5uZXh0U2libGluZyxlLnBhcmVudE5vZGVdfSksdD0wO3JldHVybiB0aGlzLmRvbU1hbmlwKGFyZ3VtZW50cyxmdW5jdGlvbihuKXt2YXIgcj1lW3QrK10saT1lW3QrK107aSYmKHImJnIucGFyZW50Tm9kZSE9PWkmJihyPXRoaXMubmV4dFNpYmxpbmcpLHB0KHRoaXMpLnJlbW92ZSgpLGkuaW5zZXJ0QmVmb3JlKG4scikpfSwhMCksdD90aGlzOnRoaXMucmVtb3ZlKCl9LGRldGFjaDpmdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5yZW1vdmUoZSwhMCl9LGRvbU1hbmlwOmZ1bmN0aW9uKGUsdCxuKXtlPW90LmFwcGx5KFtdLGUpO3ZhciByLGksbyxhLHMsdSxsPTAsYz10aGlzLmxlbmd0aCxmPXRoaXMscD1jLTEsZD1lWzBdLGg9cHQuaXNGdW5jdGlvbihkKTtpZihofHwhKDE+PWN8fFwic3RyaW5nXCIhPXR5cGVvZiBkfHxwdC5zdXBwb3J0LmNoZWNrQ2xvbmUpJiZvbi50ZXN0KGQpKXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24ocil7dmFyIGk9Zi5lcShyKTtoJiYoZVswXT1kLmNhbGwodGhpcyxyLGkuaHRtbCgpKSksaS5kb21NYW5pcChlLHQsbil9KTtpZihjJiYodT1wdC5idWlsZEZyYWdtZW50KGUsdGhpc1swXS5vd25lckRvY3VtZW50LCExLCFuJiZ0aGlzKSxyPXUuZmlyc3RDaGlsZCwxPT09dS5jaGlsZE5vZGVzLmxlbmd0aCYmKHU9cikscikpe2ZvcihhPXB0Lm1hcCh3KHUsXCJzY3JpcHRcIikseSksbz1hLmxlbmd0aDtjPmw7bCsrKWk9dSxsIT09cCYmKGk9cHQuY2xvbmUoaSwhMCwhMCksbyYmcHQubWVyZ2UoYSx3KGksXCJzY3JpcHRcIikpKSx0LmNhbGwodGhpc1tsXSxpLGwpO2lmKG8pZm9yKHM9YVthLmxlbmd0aC0xXS5vd25lckRvY3VtZW50LHB0Lm1hcChhLHYpLGw9MDtvPmw7bCsrKWk9YVtsXSxhbi50ZXN0KGkudHlwZXx8XCJcIikmJiFwdC5fZGF0YShpLFwiZ2xvYmFsRXZhbFwiKSYmcHQuY29udGFpbnMocyxpKSYmKGkuc3JjP3B0Ll9ldmFsVXJsKGkuc3JjKTpwdC5nbG9iYWxFdmFsKChpLnRleHR8fGkudGV4dENvbnRlbnR8fGkuaW5uZXJIVE1MfHxcIlwiKS5yZXBsYWNlKHVuLFwiXCIpKSk7dT1yPW51bGx9cmV0dXJuIHRoaXN9fSkscHQuZWFjaCh7YXBwZW5kVG86XCJhcHBlbmRcIixwcmVwZW5kVG86XCJwcmVwZW5kXCIsaW5zZXJ0QmVmb3JlOlwiYmVmb3JlXCIsaW5zZXJ0QWZ0ZXI6XCJhZnRlclwiLHJlcGxhY2VBbGw6XCJyZXBsYWNlV2l0aFwifSxmdW5jdGlvbihlLHQpe3B0LmZuW2VdPWZ1bmN0aW9uKGUpe2Zvcih2YXIgbixyPTAsaT1bXSxvPXB0KGUpLGE9by5sZW5ndGgtMTthPj1yO3IrKyluPXI9PT1hP3RoaXM6dGhpcy5jbG9uZSghMCkscHQob1tyXSlbdF0obiksYXQuYXBwbHkoaSxuLmdldCgpKTtyZXR1cm4gdGhpcy5wdXNoU3RhY2soaSl9fSkscHQuZXh0ZW5kKHtjbG9uZTpmdW5jdGlvbihlLHQsbil7dmFyIHIsaSxvLGEscyx1PXB0LmNvbnRhaW5zKGUub3duZXJEb2N1bWVudCxlKTtpZihwdC5zdXBwb3J0Lmh0bWw1Q2xvbmV8fHB0LmlzWE1MRG9jKGUpfHwhR3QudGVzdChcIjxcIitlLm5vZGVOYW1lK1wiPlwiKT9vPWUuY2xvbmVOb2RlKCEwKTooZm4uaW5uZXJIVE1MPWUub3V0ZXJIVE1MLGZuLnJlbW92ZUNoaWxkKG89Zm4uZmlyc3RDaGlsZCkpLCEocHQuc3VwcG9ydC5ub0Nsb25lRXZlbnQmJnB0LnN1cHBvcnQubm9DbG9uZUNoZWNrZWR8fDEhPT1lLm5vZGVUeXBlJiYxMSE9PWUubm9kZVR5cGV8fHB0LmlzWE1MRG9jKGUpKSlmb3Iocj13KG8pLHM9dyhlKSxhPTA7bnVsbCE9KGk9c1thXSk7KythKXJbYV0mJlQoaSxyW2FdKTtpZih0KWlmKG4pZm9yKHM9c3x8dyhlKSxyPXJ8fHcobyksYT0wO251bGwhPShpPXNbYV0pO2ErKyl4KGksclthXSk7ZWxzZSB4KGUsbyk7cmV0dXJuIHI9dyhvLFwic2NyaXB0XCIpLHIubGVuZ3RoPjAmJmIociwhdSYmdyhlLFwic2NyaXB0XCIpKSxyPXM9aT1udWxsLG99LGJ1aWxkRnJhZ21lbnQ6ZnVuY3Rpb24oZSx0LG4scil7Zm9yKHZhciBpLG8sYSxzLHUsbCxjLGY9ZS5sZW5ndGgscD1nKHQpLGQ9W10saD0wO2Y+aDtoKyspaWYobz1lW2hdLG98fDA9PT1vKWlmKFwib2JqZWN0XCI9PT1wdC50eXBlKG8pKXB0Lm1lcmdlKGQsby5ub2RlVHlwZT9bb106byk7ZWxzZSBpZih0bi50ZXN0KG8pKXtmb3Iocz1zfHxwLmFwcGVuZENoaWxkKHQuY3JlYXRlRWxlbWVudChcImRpdlwiKSksdT0oWnQuZXhlYyhvKXx8W1wiXCIsXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCksYz1sblt1XXx8bG4uX2RlZmF1bHQscy5pbm5lckhUTUw9Y1sxXStvLnJlcGxhY2UoS3QsXCI8JDE+PC8kMj5cIikrY1syXSxpPWNbMF07aS0tOylzPXMubGFzdENoaWxkO2lmKCFwdC5zdXBwb3J0LmxlYWRpbmdXaGl0ZXNwYWNlJiZRdC50ZXN0KG8pJiZkLnB1c2godC5jcmVhdGVUZXh0Tm9kZShRdC5leGVjKG8pWzBdKSksIXB0LnN1cHBvcnQudGJvZHkpZm9yKG89XCJ0YWJsZVwiIT09dXx8ZW4udGVzdChvKT9cIjx0YWJsZT5cIiE9PWNbMV18fGVuLnRlc3Qobyk/MDpzOnMuZmlyc3RDaGlsZCxpPW8mJm8uY2hpbGROb2Rlcy5sZW5ndGg7aS0tOylwdC5ub2RlTmFtZShsPW8uY2hpbGROb2Rlc1tpXSxcInRib2R5XCIpJiYhbC5jaGlsZE5vZGVzLmxlbmd0aCYmby5yZW1vdmVDaGlsZChsKTtmb3IocHQubWVyZ2UoZCxzLmNoaWxkTm9kZXMpLHMudGV4dENvbnRlbnQ9XCJcIjtzLmZpcnN0Q2hpbGQ7KXMucmVtb3ZlQ2hpbGQocy5maXJzdENoaWxkKTtzPXAubGFzdENoaWxkfWVsc2UgZC5wdXNoKHQuY3JlYXRlVGV4dE5vZGUobykpO2ZvcihzJiZwLnJlbW92ZUNoaWxkKHMpLHB0LnN1cHBvcnQuYXBwZW5kQ2hlY2tlZHx8cHQuZ3JlcCh3KGQsXCJpbnB1dFwiKSxDKSxoPTA7bz1kW2grK107KWlmKCghcnx8LTE9PT1wdC5pbkFycmF5KG8scikpJiYoYT1wdC5jb250YWlucyhvLm93bmVyRG9jdW1lbnQsbykscz13KHAuYXBwZW5kQ2hpbGQobyksXCJzY3JpcHRcIiksYSYmYihzKSxuKSlmb3IoaT0wO289c1tpKytdOylhbi50ZXN0KG8udHlwZXx8XCJcIikmJm4ucHVzaChvKTtyZXR1cm4gcz1udWxsLHB9LGNsZWFuRGF0YTpmdW5jdGlvbihlLHQpe2Zvcih2YXIgbixyLGksbyxhPTAscz1wdC5leHBhbmRvLHU9cHQuY2FjaGUsbD1wdC5zdXBwb3J0LmRlbGV0ZUV4cGFuZG8sYz1wdC5ldmVudC5zcGVjaWFsO251bGwhPShuPWVbYV0pO2ErKylpZigodHx8cHQuYWNjZXB0RGF0YShuKSkmJihpPW5bc10sbz1pJiZ1W2ldKSl7aWYoby5ldmVudHMpZm9yKHIgaW4gby5ldmVudHMpY1tyXT9wdC5ldmVudC5yZW1vdmUobixyKTpwdC5yZW1vdmVFdmVudChuLHIsby5oYW5kbGUpO3VbaV0mJihkZWxldGUgdVtpXSxsP2RlbGV0ZSBuW3NdOnR5cGVvZiBuLnJlbW92ZUF0dHJpYnV0ZSE9PUc/bi5yZW1vdmVBdHRyaWJ1dGUocyk6bltzXT1udWxsLHJ0LnB1c2goaSkpfX0sX2V2YWxVcmw6ZnVuY3Rpb24oZSl7cmV0dXJuIHB0LmFqYXgoe3VybDplLHR5cGU6XCJHRVRcIixkYXRhVHlwZTpcInNjcmlwdFwiLGFzeW5jOiExLGdsb2JhbDohMSxcInRocm93c1wiOiEwfSl9fSkscHQuZm4uZXh0ZW5kKHt3cmFwQWxsOmZ1bmN0aW9uKGUpe2lmKHB0LmlzRnVuY3Rpb24oZSkpcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbih0KXtwdCh0aGlzKS53cmFwQWxsKGUuY2FsbCh0aGlzLHQpKX0pO2lmKHRoaXNbMF0pe3ZhciB0PXB0KGUsdGhpc1swXS5vd25lckRvY3VtZW50KS5lcSgwKS5jbG9uZSghMCk7dGhpc1swXS5wYXJlbnROb2RlJiZ0Lmluc2VydEJlZm9yZSh0aGlzWzBdKSx0Lm1hcChmdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzO2UuZmlyc3RDaGlsZCYmMT09PWUuZmlyc3RDaGlsZC5ub2RlVHlwZTspZT1lLmZpcnN0Q2hpbGQ7cmV0dXJuIGV9KS5hcHBlbmQodGhpcyl9cmV0dXJuIHRoaXN9LHdyYXBJbm5lcjpmdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKHB0LmlzRnVuY3Rpb24oZSk/ZnVuY3Rpb24odCl7cHQodGhpcykud3JhcElubmVyKGUuY2FsbCh0aGlzLHQpKX06ZnVuY3Rpb24oKXt2YXIgdD1wdCh0aGlzKSxuPXQuY29udGVudHMoKTtuLmxlbmd0aD9uLndyYXBBbGwoZSk6dC5hcHBlbmQoZSl9KX0sd3JhcDpmdW5jdGlvbihlKXt2YXIgdD1wdC5pc0Z1bmN0aW9uKGUpO3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24obil7cHQodGhpcykud3JhcEFsbCh0P2UuY2FsbCh0aGlzLG4pOmUpfSl9LHVud3JhcDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhcmVudCgpLmVhY2goZnVuY3Rpb24oKXtwdC5ub2RlTmFtZSh0aGlzLFwiYm9keVwiKXx8cHQodGhpcykucmVwbGFjZVdpdGgodGhpcy5jaGlsZE5vZGVzKX0pLmVuZCgpfX0pO3ZhciBwbixkbixobixnbj0vYWxwaGFcXChbXildKlxcKS9pLG1uPS9vcGFjaXR5XFxzKj1cXHMqKFteKV0qKS8seW49L14odG9wfHJpZ2h0fGJvdHRvbXxsZWZ0KSQvLHZuPS9eKG5vbmV8dGFibGUoPyEtY1tlYV0pLispLyxibj0vXm1hcmdpbi8seG49UmVnRXhwKFwiXihcIitkdCtcIikoLiopJFwiLFwiaVwiKSxUbj1SZWdFeHAoXCJeKFwiK2R0K1wiKSg/IXB4KVthLXolXSskXCIsXCJpXCIpLHduPVJlZ0V4cChcIl4oWystXSk9KFwiK2R0K1wiKVwiLFwiaVwiKSxDbj17Qk9EWTpcImJsb2NrXCJ9LE5uPXtwb3NpdGlvbjpcImFic29sdXRlXCIsdmlzaWJpbGl0eTpcImhpZGRlblwiLGRpc3BsYXk6XCJibG9ja1wifSxrbj17bGV0dGVyU3BhY2luZzowLGZvbnRXZWlnaHQ6NDAwfSxFbj1bXCJUb3BcIixcIlJpZ2h0XCIsXCJCb3R0b21cIixcIkxlZnRcIl0sU249W1wiV2Via2l0XCIsXCJPXCIsXCJNb3pcIixcIm1zXCJdO3B0LmZuLmV4dGVuZCh7Y3NzOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHB0LmFjY2Vzcyh0aGlzLGZ1bmN0aW9uKGUsdCxuKXt2YXIgaSxvLGE9e30scz0wO2lmKHB0LmlzQXJyYXkodCkpe2ZvcihvPWRuKGUpLGk9dC5sZW5ndGg7aT5zO3MrKylhW3Rbc11dPXB0LmNzcyhlLHRbc10sITEsbyk7cmV0dXJuIGF9cmV0dXJuIG4hPT1yP3B0LnN0eWxlKGUsdCxuKTpwdC5jc3MoZSx0KX0sZSx0LGFyZ3VtZW50cy5sZW5ndGg+MSl9LHNob3c6ZnVuY3Rpb24oKXtyZXR1cm4gRSh0aGlzLCEwKX0saGlkZTpmdW5jdGlvbigpe3JldHVybiBFKHRoaXMpfSx0b2dnbGU6ZnVuY3Rpb24oZSl7cmV0dXJuXCJib29sZWFuXCI9PXR5cGVvZiBlP2U/dGhpcy5zaG93KCk6dGhpcy5oaWRlKCk6dGhpcy5lYWNoKGZ1bmN0aW9uKCl7ayh0aGlzKT9wdCh0aGlzKS5zaG93KCk6cHQodGhpcykuaGlkZSgpfSl9fSkscHQuZXh0ZW5kKHtjc3NIb29rczp7b3BhY2l0eTp7Z2V0OmZ1bmN0aW9uKGUsdCl7aWYodCl7dmFyIG49aG4oZSxcIm9wYWNpdHlcIik7cmV0dXJuXCJcIj09PW4/XCIxXCI6bn19fX0sY3NzTnVtYmVyOntjb2x1bW5Db3VudDohMCxmaWxsT3BhY2l0eTohMCxmb250V2VpZ2h0OiEwLGxpbmVIZWlnaHQ6ITAsb3BhY2l0eTohMCxvcmRlcjohMCxvcnBoYW5zOiEwLHdpZG93czohMCx6SW5kZXg6ITAsem9vbTohMH0sY3NzUHJvcHM6e1wiZmxvYXRcIjpwdC5zdXBwb3J0LmNzc0Zsb2F0P1wiY3NzRmxvYXRcIjpcInN0eWxlRmxvYXRcIn0sc3R5bGU6ZnVuY3Rpb24oZSx0LG4saSl7aWYoZSYmMyE9PWUubm9kZVR5cGUmJjghPT1lLm5vZGVUeXBlJiZlLnN0eWxlKXt2YXIgbyxhLHMsdT1wdC5jYW1lbENhc2UodCksbD1lLnN0eWxlO2lmKHQ9cHQuY3NzUHJvcHNbdV18fChwdC5jc3NQcm9wc1t1XT1OKGwsdSkpLHM9cHQuY3NzSG9va3NbdF18fHB0LmNzc0hvb2tzW3VdLG49PT1yKXJldHVybiBzJiZcImdldFwiaW4gcyYmKG89cy5nZXQoZSwhMSxpKSkhPT1yP286bFt0XTtpZihhPXR5cGVvZiBuLFwic3RyaW5nXCI9PT1hJiYobz13bi5leGVjKG4pKSYmKG49KG9bMV0rMSkqb1syXStwYXJzZUZsb2F0KHB0LmNzcyhlLHQpKSxhPVwibnVtYmVyXCIpLCEobnVsbD09bnx8XCJudW1iZXJcIj09PWEmJmlzTmFOKG4pfHwoXCJudW1iZXJcIiE9PWF8fHB0LmNzc051bWJlclt1XXx8KG4rPVwicHhcIikscHQuc3VwcG9ydC5jbGVhckNsb25lU3R5bGV8fFwiXCIhPT1ufHwwIT09dC5pbmRleE9mKFwiYmFja2dyb3VuZFwiKXx8KGxbdF09XCJpbmhlcml0XCIpLHMmJlwic2V0XCJpbiBzJiYobj1zLnNldChlLG4saSkpPT09cikpKXRyeXtsW3RdPW59Y2F0Y2goYyl7fX19LGNzczpmdW5jdGlvbihlLHQsbixpKXt2YXIgbyxhLHMsdT1wdC5jYW1lbENhc2UodCk7cmV0dXJuIHQ9cHQuY3NzUHJvcHNbdV18fChwdC5jc3NQcm9wc1t1XT1OKGUuc3R5bGUsdSkpLHM9cHQuY3NzSG9va3NbdF18fHB0LmNzc0hvb2tzW3VdLHMmJlwiZ2V0XCJpbiBzJiYoYT1zLmdldChlLCEwLG4pKSxhPT09ciYmKGE9aG4oZSx0LGkpKSxcIm5vcm1hbFwiPT09YSYmdCBpbiBrbiYmKGE9a25bdF0pLFwiXCI9PT1ufHxuPyhvPXBhcnNlRmxvYXQoYSksbj09PSEwfHxwdC5pc051bWVyaWMobyk/b3x8MDphKTphfX0pLHQuZ2V0Q29tcHV0ZWRTdHlsZT8oZG49ZnVuY3Rpb24oZSl7cmV0dXJuIHQuZ2V0Q29tcHV0ZWRTdHlsZShlLG51bGwpfSxobj1mdW5jdGlvbihlLHQsbil7dmFyIGksbyxhLHM9bnx8ZG4oZSksdT1zP3MuZ2V0UHJvcGVydHlWYWx1ZSh0KXx8c1t0XTpyLGw9ZS5zdHlsZTtyZXR1cm4gcyYmKFwiXCIhPT11fHxwdC5jb250YWlucyhlLm93bmVyRG9jdW1lbnQsZSl8fCh1PXB0LnN0eWxlKGUsdCkpLFRuLnRlc3QodSkmJmJuLnRlc3QodCkmJihpPWwud2lkdGgsbz1sLm1pbldpZHRoLGE9bC5tYXhXaWR0aCxsLm1pbldpZHRoPWwubWF4V2lkdGg9bC53aWR0aD11LHU9cy53aWR0aCxsLndpZHRoPWksbC5taW5XaWR0aD1vLGwubWF4V2lkdGg9YSkpLHV9KTpLLmRvY3VtZW50RWxlbWVudC5jdXJyZW50U3R5bGUmJihkbj1mdW5jdGlvbihlKXtyZXR1cm4gZS5jdXJyZW50U3R5bGV9LGhuPWZ1bmN0aW9uKGUsdCxuKXt2YXIgaSxvLGEscz1ufHxkbihlKSx1PXM/c1t0XTpyLGw9ZS5zdHlsZTtyZXR1cm4gbnVsbD09dSYmbCYmbFt0XSYmKHU9bFt0XSksVG4udGVzdCh1KSYmIXluLnRlc3QodCkmJihpPWwubGVmdCxvPWUucnVudGltZVN0eWxlLGE9byYmby5sZWZ0LGEmJihvLmxlZnQ9ZS5jdXJyZW50U3R5bGUubGVmdCksbC5sZWZ0PVwiZm9udFNpemVcIj09PXQ/XCIxZW1cIjp1LHU9bC5waXhlbExlZnQrXCJweFwiLGwubGVmdD1pLGEmJihvLmxlZnQ9YSkpLFwiXCI9PT11P1wiYXV0b1wiOnV9KSxwdC5lYWNoKFtcImhlaWdodFwiLFwid2lkdGhcIl0sZnVuY3Rpb24oZSx0KXtwdC5jc3NIb29rc1t0XT17Z2V0OmZ1bmN0aW9uKGUsbixpKXtyZXR1cm4gbj8wPT09ZS5vZmZzZXRXaWR0aCYmdm4udGVzdChwdC5jc3MoZSxcImRpc3BsYXlcIikpP3B0LnN3YXAoZSxObixmdW5jdGlvbigpe3JldHVybiBqKGUsdCxpKX0pOmooZSx0LGkpOnJ9LHNldDpmdW5jdGlvbihlLG4scil7dmFyIGk9ciYmZG4oZSk7cmV0dXJuIFMoZSxuLHI/QShlLHQscixwdC5zdXBwb3J0LmJveFNpemluZyYmXCJib3JkZXItYm94XCI9PT1wdC5jc3MoZSxcImJveFNpemluZ1wiLCExLGkpLGkpOjApfX19KSxwdC5zdXBwb3J0Lm9wYWNpdHl8fChwdC5jc3NIb29rcy5vcGFjaXR5PXtnZXQ6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gbW4udGVzdCgodCYmZS5jdXJyZW50U3R5bGU/ZS5jdXJyZW50U3R5bGUuZmlsdGVyOmUuc3R5bGUuZmlsdGVyKXx8XCJcIik/LjAxKnBhcnNlRmxvYXQoUmVnRXhwLiQxKStcIlwiOnQ/XCIxXCI6XCJcIn0sc2V0OmZ1bmN0aW9uKGUsdCl7dmFyIG49ZS5zdHlsZSxyPWUuY3VycmVudFN0eWxlLGk9cHQuaXNOdW1lcmljKHQpP1wiYWxwaGEob3BhY2l0eT1cIisxMDAqdCtcIilcIjpcIlwiLG89ciYmci5maWx0ZXJ8fG4uZmlsdGVyfHxcIlwiO24uem9vbT0xLCh0Pj0xfHxcIlwiPT09dCkmJlwiXCI9PT1wdC50cmltKG8ucmVwbGFjZShnbixcIlwiKSkmJm4ucmVtb3ZlQXR0cmlidXRlJiYobi5yZW1vdmVBdHRyaWJ1dGUoXCJmaWx0ZXJcIiksXCJcIj09PXR8fHImJiFyLmZpbHRlcil8fChuLmZpbHRlcj1nbi50ZXN0KG8pP28ucmVwbGFjZShnbixpKTpvK1wiIFwiK2kpfX0pLHB0KGZ1bmN0aW9uKCl7cHQuc3VwcG9ydC5yZWxpYWJsZU1hcmdpblJpZ2h0fHwocHQuY3NzSG9va3MubWFyZ2luUmlnaHQ9e2dldDpmdW5jdGlvbihlLHQpe3JldHVybiB0P3B0LnN3YXAoZSx7ZGlzcGxheTpcImlubGluZS1ibG9ja1wifSxobixbZSxcIm1hcmdpblJpZ2h0XCJdKTpyfX0pLCFwdC5zdXBwb3J0LnBpeGVsUG9zaXRpb24mJnB0LmZuLnBvc2l0aW9uJiZwdC5lYWNoKFtcInRvcFwiLFwibGVmdFwiXSxmdW5jdGlvbihlLHQpe3B0LmNzc0hvb2tzW3RdPXtnZXQ6ZnVuY3Rpb24oZSxuKXtyZXR1cm4gbj8obj1obihlLHQpLFRuLnRlc3Qobik/cHQoZSkucG9zaXRpb24oKVt0XStcInB4XCI6bik6cn19fSl9KSxwdC5leHByJiZwdC5leHByLmZpbHRlcnMmJihwdC5leHByLmZpbHRlcnMuaGlkZGVuPWZ1bmN0aW9uKGUpe3JldHVybiAwPj1lLm9mZnNldFdpZHRoJiYwPj1lLm9mZnNldEhlaWdodHx8IXB0LnN1cHBvcnQucmVsaWFibGVIaWRkZW5PZmZzZXRzJiZcIm5vbmVcIj09PShlLnN0eWxlJiZlLnN0eWxlLmRpc3BsYXl8fHB0LmNzcyhlLFwiZGlzcGxheVwiKSl9LHB0LmV4cHIuZmlsdGVycy52aXNpYmxlPWZ1bmN0aW9uKGUpe3JldHVybiFwdC5leHByLmZpbHRlcnMuaGlkZGVuKGUpfSkscHQuZWFjaCh7bWFyZ2luOlwiXCIscGFkZGluZzpcIlwiLGJvcmRlcjpcIldpZHRoXCJ9LGZ1bmN0aW9uKGUsdCl7cHQuY3NzSG9va3NbZSt0XT17ZXhwYW5kOmZ1bmN0aW9uKG4pe2Zvcih2YXIgcj0wLGk9e30sbz1cInN0cmluZ1wiPT10eXBlb2Ygbj9uLnNwbGl0KFwiIFwiKTpbbl07ND5yO3IrKylpW2UrRW5bcl0rdF09b1tyXXx8b1tyLTJdfHxvWzBdO3JldHVybiBpfX0sYm4udGVzdChlKXx8KHB0LmNzc0hvb2tzW2UrdF0uc2V0PVMpfSk7dmFyIEFuPS8lMjAvZyxqbj0vXFxbXFxdJC8sRG49L1xccj9cXG4vZyxMbj0vXig/OnN1Ym1pdHxidXR0b258aW1hZ2V8cmVzZXR8ZmlsZSkkL2ksSG49L14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8a2V5Z2VuKS9pO3B0LmZuLmV4dGVuZCh7c2VyaWFsaXplOmZ1bmN0aW9uKCl7cmV0dXJuIHB0LnBhcmFtKHRoaXMuc2VyaWFsaXplQXJyYXkoKSl9LHNlcmlhbGl6ZUFycmF5OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCl7dmFyIGU9cHQucHJvcCh0aGlzLFwiZWxlbWVudHNcIik7cmV0dXJuIGU/cHQubWFrZUFycmF5KGUpOnRoaXN9KS5maWx0ZXIoZnVuY3Rpb24oKXt2YXIgZT10aGlzLnR5cGU7cmV0dXJuIHRoaXMubmFtZSYmIXB0KHRoaXMpLmlzKFwiOmRpc2FibGVkXCIpJiZIbi50ZXN0KHRoaXMubm9kZU5hbWUpJiYhTG4udGVzdChlKSYmKHRoaXMuY2hlY2tlZHx8IXJuLnRlc3QoZSkpfSkubWFwKGZ1bmN0aW9uKGUsdCl7dmFyIG49cHQodGhpcykudmFsKCk7cmV0dXJuIG51bGw9PW4/bnVsbDpwdC5pc0FycmF5KG4pP3B0Lm1hcChuLGZ1bmN0aW9uKGUpe3JldHVybntuYW1lOnQubmFtZSx2YWx1ZTplLnJlcGxhY2UoRG4sXCJcXHJcXG5cIil9fSk6e25hbWU6dC5uYW1lLHZhbHVlOm4ucmVwbGFjZShEbixcIlxcclxcblwiKX19KS5nZXQoKX19KSxwdC5wYXJhbT1mdW5jdGlvbihlLHQpe3ZhciBuLGk9W10sbz1mdW5jdGlvbihlLHQpe3Q9cHQuaXNGdW5jdGlvbih0KT90KCk6bnVsbD09dD9cIlwiOnQsaVtpLmxlbmd0aF09ZW5jb2RlVVJJQ29tcG9uZW50KGUpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudCh0KX07aWYodD09PXImJih0PXB0LmFqYXhTZXR0aW5ncyYmcHQuYWpheFNldHRpbmdzLnRyYWRpdGlvbmFsKSxwdC5pc0FycmF5KGUpfHxlLmpxdWVyeSYmIXB0LmlzUGxhaW5PYmplY3QoZSkpcHQuZWFjaChlLGZ1bmN0aW9uKCl7byh0aGlzLm5hbWUsdGhpcy52YWx1ZSl9KTtlbHNlIGZvcihuIGluIGUpSChuLGVbbl0sdCxvKTtyZXR1cm4gaS5qb2luKFwiJlwiKS5yZXBsYWNlKEFuLFwiK1wiKX0scHQuZWFjaChcImJsdXIgZm9jdXMgZm9jdXNpbiBmb2N1c291dCBsb2FkIHJlc2l6ZSBzY3JvbGwgdW5sb2FkIGNsaWNrIGRibGNsaWNrIG1vdXNlZG93biBtb3VzZXVwIG1vdXNlbW92ZSBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2VlbnRlciBtb3VzZWxlYXZlIGNoYW5nZSBzZWxlY3Qgc3VibWl0IGtleWRvd24ga2V5cHJlc3Mga2V5dXAgZXJyb3IgY29udGV4dG1lbnVcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oZSx0KXtwdC5mblt0XT1mdW5jdGlvbihlLG4pe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPjA/dGhpcy5vbih0LG51bGwsZSxuKTp0aGlzLnRyaWdnZXIodCl9fSkscHQuZm4uZXh0ZW5kKHtob3ZlcjpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLm1vdXNlZW50ZXIoZSkubW91c2VsZWF2ZSh0fHxlKX0sYmluZDpmdW5jdGlvbihlLHQsbil7cmV0dXJuIHRoaXMub24oZSxudWxsLHQsbil9LHVuYmluZDpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLm9mZihlLG51bGwsdCl9LGRlbGVnYXRlOmZ1bmN0aW9uKGUsdCxuLHIpe3JldHVybiB0aGlzLm9uKHQsZSxuLHIpfSx1bmRlbGVnYXRlOmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gMT09PWFyZ3VtZW50cy5sZW5ndGg/dGhpcy5vZmYoZSxcIioqXCIpOnRoaXMub2ZmKHQsZXx8XCIqKlwiLG4pfX0pO3ZhciBxbixfbixNbj1wdC5ub3coKSxPbj0vXFw/LyxGbj0vIy4qJC8sQm49LyhbPyZdKV89W14mXSovLFBuPS9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKVxccj8kL2dtLFJuPS9eKD86YWJvdXR8YXBwfGFwcC1zdG9yYWdlfC4rLWV4dGVuc2lvbnxmaWxlfHJlc3x3aWRnZXQpOiQvLFduPS9eKD86R0VUfEhFQUQpJC8sJG49L15cXC9cXC8vLEluPS9eKFtcXHcuKy1dKzopKD86XFwvXFwvKFteXFwvPyM6XSopKD86OihcXGQrKXwpfCkvLHpuPXB0LmZuLmxvYWQsWG49e30sVW49e30sVm49XCIqL1wiLmNvbmNhdChcIipcIik7dHJ5e19uPVEuaHJlZn1jYXRjaChZbil7X249Sy5jcmVhdGVFbGVtZW50KFwiYVwiKSxfbi5ocmVmPVwiXCIsX249X24uaHJlZn1xbj1Jbi5leGVjKF9uLnRvTG93ZXJDYXNlKCkpfHxbXSxwdC5mbi5sb2FkPWZ1bmN0aW9uKGUsdCxuKXtpZihcInN0cmluZ1wiIT10eXBlb2YgZSYmem4pcmV0dXJuIHpuLmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgaSxvLGEscz10aGlzLHU9ZS5pbmRleE9mKFwiIFwiKTtyZXR1cm4gdT49MCYmKGk9ZS5zbGljZSh1LGUubGVuZ3RoKSxlPWUuc2xpY2UoMCx1KSkscHQuaXNGdW5jdGlvbih0KT8obj10LHQ9cik6dCYmXCJvYmplY3RcIj09dHlwZW9mIHQmJihhPVwiUE9TVFwiKSxzLmxlbmd0aD4wJiZwdC5hamF4KHt1cmw6ZSx0eXBlOmEsZGF0YVR5cGU6XCJodG1sXCIsZGF0YTp0fSkuZG9uZShmdW5jdGlvbihlKXtvPWFyZ3VtZW50cyxzLmh0bWwoaT9wdChcIjxkaXY+XCIpLmFwcGVuZChwdC5wYXJzZUhUTUwoZSkpLmZpbmQoaSk6ZSl9KS5jb21wbGV0ZShuJiZmdW5jdGlvbihlLHQpe3MuZWFjaChuLG98fFtlLnJlc3BvbnNlVGV4dCx0LGVdKX0pLHRoaXN9LHB0LmVhY2goW1wiYWpheFN0YXJ0XCIsXCJhamF4U3RvcFwiLFwiYWpheENvbXBsZXRlXCIsXCJhamF4RXJyb3JcIixcImFqYXhTdWNjZXNzXCIsXCJhamF4U2VuZFwiXSxmdW5jdGlvbihlLHQpe3B0LmZuW3RdPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLm9uKHQsZSl9fSkscHQuZXh0ZW5kKHthY3RpdmU6MCxsYXN0TW9kaWZpZWQ6e30sZXRhZzp7fSxhamF4U2V0dGluZ3M6e3VybDpfbix0eXBlOlwiR0VUXCIsaXNMb2NhbDpSbi50ZXN0KHFuWzFdKSxnbG9iYWw6ITAscHJvY2Vzc0RhdGE6ITAsYXN5bmM6ITAsY29udGVudFR5cGU6XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIixhY2NlcHRzOntcIipcIjpWbix0ZXh0OlwidGV4dC9wbGFpblwiLGh0bWw6XCJ0ZXh0L2h0bWxcIix4bWw6XCJhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sXCIsanNvbjpcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvamF2YXNjcmlwdFwifSxjb250ZW50czp7eG1sOi94bWwvLGh0bWw6L2h0bWwvLGpzb246L2pzb24vfSxyZXNwb25zZUZpZWxkczp7eG1sOlwicmVzcG9uc2VYTUxcIix0ZXh0OlwicmVzcG9uc2VUZXh0XCIsanNvbjpcInJlc3BvbnNlSlNPTlwifSxjb252ZXJ0ZXJzOntcIiogdGV4dFwiOlN0cmluZyxcInRleHQgaHRtbFwiOiEwLFwidGV4dCBqc29uXCI6cHQucGFyc2VKU09OLFwidGV4dCB4bWxcIjpwdC5wYXJzZVhNTH0sZmxhdE9wdGlvbnM6e3VybDohMCxjb250ZXh0OiEwfX0sYWpheFNldHVwOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHQ/TShNKGUscHQuYWpheFNldHRpbmdzKSx0KTpNKHB0LmFqYXhTZXR0aW5ncyxlKX0sYWpheFByZWZpbHRlcjpxKFhuKSxhamF4VHJhbnNwb3J0OnEoVW4pLGFqYXg6ZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKGUsdCxuLGkpe3ZhciBvLGYsdixiLFQsQz10OzIhPT14JiYoeD0yLHUmJmNsZWFyVGltZW91dCh1KSxjPXIscz1pfHxcIlwiLHcucmVhZHlTdGF0ZT1lPjA/NDowLG89ZT49MjAwJiYzMDA+ZXx8MzA0PT09ZSxuJiYoYj1PKHAsdyxuKSksYj1GKHAsYix3LG8pLG8/KHAuaWZNb2RpZmllZCYmKFQ9dy5nZXRSZXNwb25zZUhlYWRlcihcIkxhc3QtTW9kaWZpZWRcIiksVCYmKHB0Lmxhc3RNb2RpZmllZFthXT1UKSxUPXcuZ2V0UmVzcG9uc2VIZWFkZXIoXCJldGFnXCIpLFQmJihwdC5ldGFnW2FdPVQpKSwyMDQ9PT1lfHxcIkhFQURcIj09PXAudHlwZT9DPVwibm9jb250ZW50XCI6MzA0PT09ZT9DPVwibm90bW9kaWZpZWRcIjooQz1iLnN0YXRlLGY9Yi5kYXRhLHY9Yi5lcnJvcixvPSF2KSk6KHY9QywoZXx8IUMpJiYoQz1cImVycm9yXCIsMD5lJiYoZT0wKSkpLHcuc3RhdHVzPWUsdy5zdGF0dXNUZXh0PSh0fHxDKStcIlwiLG8/Zy5yZXNvbHZlV2l0aChkLFtmLEMsd10pOmcucmVqZWN0V2l0aChkLFt3LEMsdl0pLHcuc3RhdHVzQ29kZSh5KSx5PXIsbCYmaC50cmlnZ2VyKG8/XCJhamF4U3VjY2Vzc1wiOlwiYWpheEVycm9yXCIsW3cscCxvP2Y6dl0pLG0uZmlyZVdpdGgoZCxbdyxDXSksbCYmKGgudHJpZ2dlcihcImFqYXhDb21wbGV0ZVwiLFt3LHBdKSwtLXB0LmFjdGl2ZXx8cHQuZXZlbnQudHJpZ2dlcihcImFqYXhTdG9wXCIpKSl9XCJvYmplY3RcIj09dHlwZW9mIGUmJih0PWUsZT1yKSx0PXR8fHt9O3ZhciBpLG8sYSxzLHUsbCxjLGYscD1wdC5hamF4U2V0dXAoe30sdCksZD1wLmNvbnRleHR8fHAsaD1wLmNvbnRleHQmJihkLm5vZGVUeXBlfHxkLmpxdWVyeSk/cHQoZCk6cHQuZXZlbnQsZz1wdC5EZWZlcnJlZCgpLG09cHQuQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIikseT1wLnN0YXR1c0NvZGV8fHt9LHY9e30sYj17fSx4PTAsVD1cImNhbmNlbGVkXCIsdz17cmVhZHlTdGF0ZTowLGdldFJlc3BvbnNlSGVhZGVyOmZ1bmN0aW9uKGUpe3ZhciB0O2lmKDI9PT14KXtpZighZilmb3IoZj17fTt0PVBuLmV4ZWMocyk7KWZbdFsxXS50b0xvd2VyQ2FzZSgpXT10WzJdO3Q9ZltlLnRvTG93ZXJDYXNlKCldfXJldHVybiBudWxsPT10P251bGw6dH0sZ2V0QWxsUmVzcG9uc2VIZWFkZXJzOmZ1bmN0aW9uKCl7cmV0dXJuIDI9PT14P3M6bnVsbH0sc2V0UmVxdWVzdEhlYWRlcjpmdW5jdGlvbihlLHQpe3ZhciBuPWUudG9Mb3dlckNhc2UoKTtyZXR1cm4geHx8KGU9YltuXT1iW25dfHxlLHZbZV09dCksdGhpc30sb3ZlcnJpZGVNaW1lVHlwZTpmdW5jdGlvbihlKXtyZXR1cm4geHx8KHAubWltZVR5cGU9ZSksdGhpc30sc3RhdHVzQ29kZTpmdW5jdGlvbihlKXt2YXIgdDtpZihlKWlmKDI+eClmb3IodCBpbiBlKXlbdF09W3lbdF0sZVt0XV07ZWxzZSB3LmFsd2F5cyhlW3cuc3RhdHVzXSk7cmV0dXJuIHRoaXN9LGFib3J0OmZ1bmN0aW9uKGUpe3ZhciB0PWV8fFQ7cmV0dXJuIGMmJmMuYWJvcnQodCksbigwLHQpLHRoaXN9fTtpZihnLnByb21pc2UodykuY29tcGxldGU9bS5hZGQsdy5zdWNjZXNzPXcuZG9uZSx3LmVycm9yPXcuZmFpbCxwLnVybD0oKGV8fHAudXJsfHxfbikrXCJcIikucmVwbGFjZShGbixcIlwiKS5yZXBsYWNlKCRuLHFuWzFdK1wiLy9cIikscC50eXBlPXQubWV0aG9kfHx0LnR5cGV8fHAubWV0aG9kfHxwLnR5cGUscC5kYXRhVHlwZXM9cHQudHJpbShwLmRhdGFUeXBlfHxcIipcIikudG9Mb3dlckNhc2UoKS5tYXRjaChodCl8fFtcIlwiXSxudWxsPT1wLmNyb3NzRG9tYWluJiYoaT1Jbi5leGVjKHAudXJsLnRvTG93ZXJDYXNlKCkpLHAuY3Jvc3NEb21haW49ISghaXx8aVsxXT09PXFuWzFdJiZpWzJdPT09cW5bMl0mJihpWzNdfHwoXCJodHRwOlwiPT09aVsxXT9cIjgwXCI6XCI0NDNcIikpPT09KHFuWzNdfHwoXCJodHRwOlwiPT09cW5bMV0/XCI4MFwiOlwiNDQzXCIpKSkpLHAuZGF0YSYmcC5wcm9jZXNzRGF0YSYmXCJzdHJpbmdcIiE9dHlwZW9mIHAuZGF0YSYmKHAuZGF0YT1wdC5wYXJhbShwLmRhdGEscC50cmFkaXRpb25hbCkpLF8oWG4scCx0LHcpLDI9PT14KXJldHVybiB3O2w9cC5nbG9iYWwsbCYmMD09PXB0LmFjdGl2ZSsrJiZwdC5ldmVudC50cmlnZ2VyKFwiYWpheFN0YXJ0XCIpLHAudHlwZT1wLnR5cGUudG9VcHBlckNhc2UoKSxwLmhhc0NvbnRlbnQ9IVduLnRlc3QocC50eXBlKSxhPXAudXJsLHAuaGFzQ29udGVudHx8KHAuZGF0YSYmKGE9cC51cmwrPShPbi50ZXN0KGEpP1wiJlwiOlwiP1wiKStwLmRhdGEsZGVsZXRlIHAuZGF0YSkscC5jYWNoZT09PSExJiYocC51cmw9Qm4udGVzdChhKT9hLnJlcGxhY2UoQm4sXCIkMV89XCIrTW4rKyk6YSsoT24udGVzdChhKT9cIiZcIjpcIj9cIikrXCJfPVwiK01uKyspKSxwLmlmTW9kaWZpZWQmJihwdC5sYXN0TW9kaWZpZWRbYV0mJncuc2V0UmVxdWVzdEhlYWRlcihcIklmLU1vZGlmaWVkLVNpbmNlXCIscHQubGFzdE1vZGlmaWVkW2FdKSxwdC5ldGFnW2FdJiZ3LnNldFJlcXVlc3RIZWFkZXIoXCJJZi1Ob25lLU1hdGNoXCIscHQuZXRhZ1thXSkpLChwLmRhdGEmJnAuaGFzQ29udGVudCYmcC5jb250ZW50VHlwZSE9PSExfHx0LmNvbnRlbnRUeXBlKSYmdy5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIscC5jb250ZW50VHlwZSksdy5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIscC5kYXRhVHlwZXNbMF0mJnAuYWNjZXB0c1twLmRhdGFUeXBlc1swXV0/cC5hY2NlcHRzW3AuZGF0YVR5cGVzWzBdXSsoXCIqXCIhPT1wLmRhdGFUeXBlc1swXT9cIiwgXCIrVm4rXCI7IHE9MC4wMVwiOlwiXCIpOnAuYWNjZXB0c1tcIipcIl0pO2ZvcihvIGluIHAuaGVhZGVycyl3LnNldFJlcXVlc3RIZWFkZXIobyxwLmhlYWRlcnNbb10pO2lmKHAuYmVmb3JlU2VuZCYmKHAuYmVmb3JlU2VuZC5jYWxsKGQsdyxwKT09PSExfHwyPT09eCkpcmV0dXJuIHcuYWJvcnQoKTtUPVwiYWJvcnRcIjtmb3IobyBpbntzdWNjZXNzOjEsZXJyb3I6MSxjb21wbGV0ZToxfSl3W29dKHBbb10pO2lmKGM9XyhVbixwLHQsdykpe3cucmVhZHlTdGF0ZT0xLGwmJmgudHJpZ2dlcihcImFqYXhTZW5kXCIsW3cscF0pLHAuYXN5bmMmJnAudGltZW91dD4wJiYodT1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dy5hYm9ydChcInRpbWVvdXRcIil9LHAudGltZW91dCkpO3RyeXt4PTEsYy5zZW5kKHYsbil9Y2F0Y2goQyl7aWYoISgyPngpKXRocm93IEM7bigtMSxDKX19ZWxzZSBuKC0xLFwiTm8gVHJhbnNwb3J0XCIpO3JldHVybiB3fSxnZXRKU09OOmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gcHQuZ2V0KGUsdCxuLFwianNvblwiKX0sZ2V0U2NyaXB0OmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHB0LmdldChlLHIsdCxcInNjcmlwdFwiKX19KSxwdC5lYWNoKFtcImdldFwiLFwicG9zdFwiXSxmdW5jdGlvbihlLHQpe3B0W3RdPWZ1bmN0aW9uKGUsbixpLG8pe3JldHVybiBwdC5pc0Z1bmN0aW9uKG4pJiYobz1vfHxpLGk9bixuPXIpLHB0LmFqYXgoe3VybDplLHR5cGU6dCxkYXRhVHlwZTpvLGRhdGE6bixzdWNjZXNzOml9KX19KSxwdC5hamF4U2V0dXAoe2FjY2VwdHM6e3NjcmlwdDpcInRleHQvamF2YXNjcmlwdCwgYXBwbGljYXRpb24vamF2YXNjcmlwdCwgYXBwbGljYXRpb24vZWNtYXNjcmlwdCwgYXBwbGljYXRpb24veC1lY21hc2NyaXB0XCJ9LGNvbnRlbnRzOntzY3JpcHQ6Lyg/OmphdmF8ZWNtYSlzY3JpcHQvfSxjb252ZXJ0ZXJzOntcInRleHQgc2NyaXB0XCI6ZnVuY3Rpb24oZSl7cmV0dXJuIHB0Lmdsb2JhbEV2YWwoZSksZX19fSkscHQuYWpheFByZWZpbHRlcihcInNjcmlwdFwiLGZ1bmN0aW9uKGUpe2UuY2FjaGU9PT1yJiYoZS5jYWNoZT0hMSksZS5jcm9zc0RvbWFpbiYmKGUudHlwZT1cIkdFVFwiLGUuZ2xvYmFsPSExKX0pLHB0LmFqYXhUcmFuc3BvcnQoXCJzY3JpcHRcIixmdW5jdGlvbihlKXtpZihlLmNyb3NzRG9tYWluKXt2YXIgdCxuPUsuaGVhZHx8cHQoXCJoZWFkXCIpWzBdfHxLLmRvY3VtZW50RWxlbWVudDtyZXR1cm57c2VuZDpmdW5jdGlvbihyLGkpe3Q9Sy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLHQuYXN5bmM9ITAsZS5zY3JpcHRDaGFyc2V0JiYodC5jaGFyc2V0PWUuc2NyaXB0Q2hhcnNldCksdC5zcmM9ZS51cmwsdC5vbmxvYWQ9dC5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oZSxuKXsobnx8IXQucmVhZHlTdGF0ZXx8L2xvYWRlZHxjb21wbGV0ZS8udGVzdCh0LnJlYWR5U3RhdGUpKSYmKHQub25sb2FkPXQub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsdC5wYXJlbnROb2RlJiZ0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodCksdD1udWxsLG58fGkoMjAwLFwic3VjY2Vzc1wiKSl9LG4uaW5zZXJ0QmVmb3JlKHQsbi5maXJzdENoaWxkKX0sYWJvcnQ6ZnVuY3Rpb24oKXt0JiZ0Lm9ubG9hZChyLCEwKX19fX0pO3ZhciBKbj1bXSxHbj0vKD0pXFw/KD89JnwkKXxcXD9cXD8vO3B0LmFqYXhTZXR1cCh7anNvbnA6XCJjYWxsYmFja1wiLGpzb25wQ2FsbGJhY2s6ZnVuY3Rpb24oKXt2YXIgZT1Kbi5wb3AoKXx8cHQuZXhwYW5kbytcIl9cIitNbisrO3JldHVybiB0aGlzW2VdPSEwLGV9fSkscHQuYWpheFByZWZpbHRlcihcImpzb24ganNvbnBcIixmdW5jdGlvbihlLG4saSl7dmFyIG8sYSxzLHU9ZS5qc29ucCE9PSExJiYoR24udGVzdChlLnVybCk/XCJ1cmxcIjpcInN0cmluZ1wiPT10eXBlb2YgZS5kYXRhJiYhKGUuY29udGVudFR5cGV8fFwiXCIpLmluZGV4T2YoXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIikmJkduLnRlc3QoZS5kYXRhKSYmXCJkYXRhXCIpO3JldHVybiB1fHxcImpzb25wXCI9PT1lLmRhdGFUeXBlc1swXT8obz1lLmpzb25wQ2FsbGJhY2s9cHQuaXNGdW5jdGlvbihlLmpzb25wQ2FsbGJhY2spP2UuanNvbnBDYWxsYmFjaygpOmUuanNvbnBDYWxsYmFjayx1P2VbdV09ZVt1XS5yZXBsYWNlKEduLFwiJDFcIitvKTplLmpzb25wIT09ITEmJihlLnVybCs9KE9uLnRlc3QoZS51cmwpP1wiJlwiOlwiP1wiKStlLmpzb25wK1wiPVwiK28pLGUuY29udmVydGVyc1tcInNjcmlwdCBqc29uXCJdPWZ1bmN0aW9uKCl7cmV0dXJuIHN8fHB0LmVycm9yKG8rXCIgd2FzIG5vdCBjYWxsZWRcIiksc1swXX0sZS5kYXRhVHlwZXNbMF09XCJqc29uXCIsYT10W29dLHRbb109ZnVuY3Rpb24oKXtzPWFyZ3VtZW50c30saS5hbHdheXMoZnVuY3Rpb24oKXt0W29dPWEsZVtvXSYmKGUuanNvbnBDYWxsYmFjaz1uLmpzb25wQ2FsbGJhY2ssSm4ucHVzaChvKSkscyYmcHQuaXNGdW5jdGlvbihhKSYmYShzWzBdKSxzPWE9cn0pLFwic2NyaXB0XCIpOnJ9KTt2YXIgUW4sS24sWm49MCxlcj10LkFjdGl2ZVhPYmplY3QmJmZ1bmN0aW9uKCl7dmFyIGU7Zm9yKGUgaW4gUW4pUW5bZV0ociwhMCl9O3B0LmFqYXhTZXR0aW5ncy54aHI9dC5BY3RpdmVYT2JqZWN0P2Z1bmN0aW9uKCl7cmV0dXJuIXRoaXMuaXNMb2NhbCYmQigpfHxQKCl9OkIsS249cHQuYWpheFNldHRpbmdzLnhocigpLHB0LnN1cHBvcnQuY29ycz0hIUtuJiZcIndpdGhDcmVkZW50aWFsc1wiaW4gS24sS249cHQuc3VwcG9ydC5hamF4PSEhS24sS24mJnB0LmFqYXhUcmFuc3BvcnQoZnVuY3Rpb24oZSl7aWYoIWUuY3Jvc3NEb21haW58fHB0LnN1cHBvcnQuY29ycyl7dmFyIG47cmV0dXJue3NlbmQ6ZnVuY3Rpb24oaSxvKXt2YXIgYSxzLHU9ZS54aHIoKTtpZihlLnVzZXJuYW1lP3Uub3BlbihlLnR5cGUsZS51cmwsZS5hc3luYyxlLnVzZXJuYW1lLGUucGFzc3dvcmQpOnUub3BlbihlLnR5cGUsZS51cmwsZS5hc3luYyksZS54aHJGaWVsZHMpZm9yKHMgaW4gZS54aHJGaWVsZHMpdVtzXT1lLnhockZpZWxkc1tzXTtlLm1pbWVUeXBlJiZ1Lm92ZXJyaWRlTWltZVR5cGUmJnUub3ZlcnJpZGVNaW1lVHlwZShlLm1pbWVUeXBlKSxlLmNyb3NzRG9tYWlufHxpW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXXx8KGlbXCJYLVJlcXVlc3RlZC1XaXRoXCJdPVwiWE1MSHR0cFJlcXVlc3RcIik7dHJ5e2ZvcihzIGluIGkpdS5zZXRSZXF1ZXN0SGVhZGVyKHMsaVtzXSl9Y2F0Y2gobCl7fXUuc2VuZChlLmhhc0NvbnRlbnQmJmUuZGF0YXx8bnVsbCksbj1mdW5jdGlvbih0LGkpe3ZhciBzLGwsYyxmO3RyeXtpZihuJiYoaXx8ND09PXUucmVhZHlTdGF0ZSkpaWYobj1yLGEmJih1Lm9ucmVhZHlzdGF0ZWNoYW5nZT1wdC5ub29wLGVyJiZkZWxldGUgUW5bYV0pLGkpNCE9PXUucmVhZHlTdGF0ZSYmdS5hYm9ydCgpO2Vsc2V7Zj17fSxzPXUuc3RhdHVzLGw9dS5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSxcInN0cmluZ1wiPT10eXBlb2YgdS5yZXNwb25zZVRleHQmJihmLnRleHQ9dS5yZXNwb25zZVRleHQpO3RyeXtjPXUuc3RhdHVzVGV4dH1jYXRjaChwKXtjPVwiXCJ9c3x8IWUuaXNMb2NhbHx8ZS5jcm9zc0RvbWFpbj8xMjIzPT09cyYmKHM9MjA0KTpzPWYudGV4dD8yMDA6NDA0fX1jYXRjaChkKXtpfHxvKC0xLGQpfWYmJm8ocyxjLGYsbCl9LGUuYXN5bmM/ND09PXUucmVhZHlTdGF0ZT9zZXRUaW1lb3V0KG4pOihhPSsrWm4sZXImJihRbnx8KFFuPXt9LHB0KHQpLnVubG9hZChlcikpLFFuW2FdPW4pLHUub25yZWFkeXN0YXRlY2hhbmdlPW4pOm4oKX0sYWJvcnQ6ZnVuY3Rpb24oKXtuJiZuKHIsITApfX19fSk7dmFyIHRyLG5yLHJyPS9eKD86dG9nZ2xlfHNob3d8aGlkZSkkLyxpcj1SZWdFeHAoXCJeKD86KFsrLV0pPXwpKFwiK2R0K1wiKShbYS16JV0qKSRcIixcImlcIiksb3I9L3F1ZXVlSG9va3MkLyxhcj1bel0sc3I9e1wiKlwiOltmdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuY3JlYXRlVHdlZW4oZSx0KSxyPW4uY3VyKCksaT1pci5leGVjKHQpLG89aSYmaVszXXx8KHB0LmNzc051bWJlcltlXT9cIlwiOlwicHhcIiksYT0ocHQuY3NzTnVtYmVyW2VdfHxcInB4XCIhPT1vJiYrcikmJmlyLmV4ZWMocHQuY3NzKG4uZWxlbSxlKSkscz0xLHU9MjA7aWYoYSYmYVszXSE9PW8pe289b3x8YVszXSxpPWl8fFtdLGE9K3J8fDE7ZG8gcz1zfHxcIi41XCIsYS89cyxwdC5zdHlsZShuLmVsZW0sZSxhK28pO3doaWxlKHMhPT0ocz1uLmN1cigpL3IpJiYxIT09cyYmLS11KX1yZXR1cm4gaSYmKGE9bi5zdGFydD0rYXx8K3J8fDAsbi51bml0PW8sbi5lbmQ9aVsxXT9hKyhpWzFdKzEpKmlbMl06K2lbMl0pLG59XX07cHQuQW5pbWF0aW9uPXB0LmV4dGVuZCgkLHt0d2VlbmVyOmZ1bmN0aW9uKGUsdCl7cHQuaXNGdW5jdGlvbihlKT8odD1lLGU9W1wiKlwiXSk6ZT1lLnNwbGl0KFwiIFwiKTtmb3IodmFyIG4scj0wLGk9ZS5sZW5ndGg7aT5yO3IrKyluPWVbcl0sc3Jbbl09c3Jbbl18fFtdLHNyW25dLnVuc2hpZnQodCl9LHByZWZpbHRlcjpmdW5jdGlvbihlLHQpe3Q/YXIudW5zaGlmdChlKTphci5wdXNoKGUpfX0pLHB0LlR3ZWVuPVgsWC5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOlgsaW5pdDpmdW5jdGlvbihlLHQsbixyLGksbyl7dGhpcy5lbGVtPWUsdGhpcy5wcm9wPW4sdGhpcy5lYXNpbmc9aXx8XCJzd2luZ1wiLHRoaXMub3B0aW9ucz10LHRoaXMuc3RhcnQ9dGhpcy5ub3c9dGhpcy5jdXIoKSx0aGlzLmVuZD1yLHRoaXMudW5pdD1vfHwocHQuY3NzTnVtYmVyW25dP1wiXCI6XCJweFwiKX0sY3VyOmZ1bmN0aW9uKCl7dmFyIGU9WC5wcm9wSG9va3NbdGhpcy5wcm9wXTtyZXR1cm4gZSYmZS5nZXQ/ZS5nZXQodGhpcyk6WC5wcm9wSG9va3MuX2RlZmF1bHQuZ2V0KHRoaXMpfSxydW46ZnVuY3Rpb24oZSl7dmFyIHQsbj1YLnByb3BIb29rc1t0aGlzLnByb3BdO3JldHVybiB0aGlzLnBvcz10PXRoaXMub3B0aW9ucy5kdXJhdGlvbj9wdC5lYXNpbmdbdGhpcy5lYXNpbmddKGUsdGhpcy5vcHRpb25zLmR1cmF0aW9uKmUsMCwxLHRoaXMub3B0aW9ucy5kdXJhdGlvbik6ZSx0aGlzLm5vdz0odGhpcy5lbmQtdGhpcy5zdGFydCkqdCt0aGlzLnN0YXJ0LHRoaXMub3B0aW9ucy5zdGVwJiZ0aGlzLm9wdGlvbnMuc3RlcC5jYWxsKHRoaXMuZWxlbSx0aGlzLm5vdyx0aGlzKSxuJiZuLnNldD9uLnNldCh0aGlzKTpYLnByb3BIb29rcy5fZGVmYXVsdC5zZXQodGhpcyksdGhpc319LFgucHJvdG90eXBlLmluaXQucHJvdG90eXBlPVgucHJvdG90eXBlLFgucHJvcEhvb2tzPXtfZGVmYXVsdDp7Z2V0OmZ1bmN0aW9uKGUpe3ZhciB0O3JldHVybiBudWxsPT1lLmVsZW1bZS5wcm9wXXx8ZS5lbGVtLnN0eWxlJiZudWxsIT1lLmVsZW0uc3R5bGVbZS5wcm9wXT8odD1wdC5jc3MoZS5lbGVtLGUucHJvcCxcIlwiKSx0JiZcImF1dG9cIiE9PXQ/dDowKTplLmVsZW1bZS5wcm9wXX0sc2V0OmZ1bmN0aW9uKGUpe3B0LmZ4LnN0ZXBbZS5wcm9wXT9wdC5meC5zdGVwW2UucHJvcF0oZSk6ZS5lbGVtLnN0eWxlJiYobnVsbCE9ZS5lbGVtLnN0eWxlW3B0LmNzc1Byb3BzW2UucHJvcF1dfHxwdC5jc3NIb29rc1tlLnByb3BdKT9wdC5zdHlsZShlLmVsZW0sZS5wcm9wLGUubm93K2UudW5pdCk6ZS5lbGVtW2UucHJvcF09ZS5ub3d9fX0sWC5wcm9wSG9va3Muc2Nyb2xsVG9wPVgucHJvcEhvb2tzLnNjcm9sbExlZnQ9e3NldDpmdW5jdGlvbihlKXtlLmVsZW0ubm9kZVR5cGUmJmUuZWxlbS5wYXJlbnROb2RlJiYoZS5lbGVtW2UucHJvcF09ZS5ub3cpfX0scHQuZWFjaChbXCJ0b2dnbGVcIixcInNob3dcIixcImhpZGVcIl0sZnVuY3Rpb24oZSx0KXt2YXIgbj1wdC5mblt0XTtwdC5mblt0XT1mdW5jdGlvbihlLHIsaSl7cmV0dXJuIG51bGw9PWV8fFwiYm9vbGVhblwiPT10eXBlb2YgZT9uLmFwcGx5KHRoaXMsYXJndW1lbnRzKTp0aGlzLmFuaW1hdGUoVSh0LCEwKSxlLHIsaSl9fSkscHQuZm4uZXh0ZW5kKHtmYWRlVG86ZnVuY3Rpb24oZSx0LG4scil7cmV0dXJuIHRoaXMuZmlsdGVyKGspLmNzcyhcIm9wYWNpdHlcIiwwKS5zaG93KCkuZW5kKCkuYW5pbWF0ZSh7b3BhY2l0eTp0fSxlLG4scil9LGFuaW1hdGU6ZnVuY3Rpb24oZSx0LG4scil7dmFyIGk9cHQuaXNFbXB0eU9iamVjdChlKSxvPXB0LnNwZWVkKHQsbixyKSxhPWZ1bmN0aW9uKCl7dmFyIHQ9JCh0aGlzLHB0LmV4dGVuZCh7fSxlKSxvKTsoaXx8cHQuX2RhdGEodGhpcyxcImZpbmlzaFwiKSkmJnQuc3RvcCghMCl9O3JldHVybiBhLmZpbmlzaD1hLGl8fG8ucXVldWU9PT0hMT90aGlzLmVhY2goYSk6dGhpcy5xdWV1ZShvLnF1ZXVlLGEpfSxzdG9wOmZ1bmN0aW9uKGUsdCxuKXt2YXIgaT1mdW5jdGlvbihlKXt2YXIgdD1lLnN0b3A7ZGVsZXRlIGUuc3RvcCx0KG4pfTtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgZSYmKG49dCx0PWUsZT1yKSx0JiZlIT09ITEmJnRoaXMucXVldWUoZXx8XCJmeFwiLFtdKSx0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD0hMCxyPW51bGwhPWUmJmUrXCJxdWV1ZUhvb2tzXCIsbz1wdC50aW1lcnMsYT1wdC5fZGF0YSh0aGlzKTtpZihyKWFbcl0mJmFbcl0uc3RvcCYmaShhW3JdKTtlbHNlIGZvcihyIGluIGEpYVtyXSYmYVtyXS5zdG9wJiZvci50ZXN0KHIpJiZpKGFbcl0pO2ZvcihyPW8ubGVuZ3RoO3ItLTspb1tyXS5lbGVtIT09dGhpc3x8bnVsbCE9ZSYmb1tyXS5xdWV1ZSE9PWV8fChvW3JdLmFuaW0uc3RvcChuKSx0PSExLG8uc3BsaWNlKHIsMSkpOyh0fHwhbikmJnB0LmRlcXVldWUodGhpcyxlKX0pfSxmaW5pc2g6ZnVuY3Rpb24oZSl7cmV0dXJuIGUhPT0hMSYmKGU9ZXx8XCJmeFwiKSx0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdCxuPXB0Ll9kYXRhKHRoaXMpLHI9bltlK1wicXVldWVcIl0saT1uW2UrXCJxdWV1ZUhvb2tzXCJdLG89cHQudGltZXJzLGE9cj9yLmxlbmd0aDowO2ZvcihuLmZpbmlzaD0hMCxwdC5xdWV1ZSh0aGlzLGUsW10pLGkmJmkuc3RvcCYmaS5zdG9wLmNhbGwodGhpcywhMCksdD1vLmxlbmd0aDt0LS07KW9bdF0uZWxlbT09PXRoaXMmJm9bdF0ucXVldWU9PT1lJiYob1t0XS5hbmltLnN0b3AoITApLG8uc3BsaWNlKHQsMSkpO2Zvcih0PTA7YT50O3QrKylyW3RdJiZyW3RdLmZpbmlzaCYmclt0XS5maW5pc2guY2FsbCh0aGlzKTtkZWxldGUgbi5maW5pc2h9KX19KSxwdC5lYWNoKHtzbGlkZURvd246VShcInNob3dcIiksc2xpZGVVcDpVKFwiaGlkZVwiKSxzbGlkZVRvZ2dsZTpVKFwidG9nZ2xlXCIpLGZhZGVJbjp7b3BhY2l0eTpcInNob3dcIn0sZmFkZU91dDp7b3BhY2l0eTpcImhpZGVcIn0sZmFkZVRvZ2dsZTp7b3BhY2l0eTpcInRvZ2dsZVwifX0sZnVuY3Rpb24oZSx0KXtwdC5mbltlXT1mdW5jdGlvbihlLG4scil7cmV0dXJuIHRoaXMuYW5pbWF0ZSh0LGUsbixyKX19KSxwdC5zcGVlZD1mdW5jdGlvbihlLHQsbil7dmFyIHI9ZSYmXCJvYmplY3RcIj09dHlwZW9mIGU/cHQuZXh0ZW5kKHt9LGUpOntjb21wbGV0ZTpufHwhbiYmdHx8cHQuaXNGdW5jdGlvbihlKSYmZSxkdXJhdGlvbjplLGVhc2luZzpuJiZ0fHx0JiYhcHQuaXNGdW5jdGlvbih0KSYmdH07cmV0dXJuIHIuZHVyYXRpb249cHQuZngub2ZmPzA6XCJudW1iZXJcIj09dHlwZW9mIHIuZHVyYXRpb24/ci5kdXJhdGlvbjpyLmR1cmF0aW9uIGluIHB0LmZ4LnNwZWVkcz9wdC5meC5zcGVlZHNbci5kdXJhdGlvbl06cHQuZnguc3BlZWRzLl9kZWZhdWx0LChudWxsPT1yLnF1ZXVlfHxyLnF1ZXVlPT09ITApJiYoci5xdWV1ZT1cImZ4XCIpLHIub2xkPXIuY29tcGxldGUsci5jb21wbGV0ZT1mdW5jdGlvbigpe3B0LmlzRnVuY3Rpb24oci5vbGQpJiZyLm9sZC5jYWxsKHRoaXMpLHIucXVldWUmJnB0LmRlcXVldWUodGhpcyxyLnF1ZXVlKX0scn0scHQuZWFzaW5nPXtsaW5lYXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGV9LHN3aW5nOmZ1bmN0aW9uKGUpe3JldHVybi41LU1hdGguY29zKGUqTWF0aC5QSSkvMn19LHB0LnRpbWVycz1bXSxwdC5meD1YLnByb3RvdHlwZS5pbml0LHB0LmZ4LnRpY2s9ZnVuY3Rpb24oKXt2YXIgZSx0PXB0LnRpbWVycyxuPTA7Zm9yKHRyPXB0Lm5vdygpO3QubGVuZ3RoPm47bisrKWU9dFtuXSxlKCl8fHRbbl0hPT1lfHx0LnNwbGljZShuLS0sMSk7dC5sZW5ndGh8fHB0LmZ4LnN0b3AoKSx0cj1yfSxwdC5meC50aW1lcj1mdW5jdGlvbihlKXtlKCkmJnB0LnRpbWVycy5wdXNoKGUpJiZwdC5meC5zdGFydCgpfSxwdC5meC5pbnRlcnZhbD0xMyxwdC5meC5zdGFydD1mdW5jdGlvbigpe25yfHwobnI9c2V0SW50ZXJ2YWwocHQuZngudGljayxwdC5meC5pbnRlcnZhbCkpfSxwdC5meC5zdG9wPWZ1bmN0aW9uKCl7Y2xlYXJJbnRlcnZhbChuciksbnI9bnVsbH0scHQuZnguc3BlZWRzPXtzbG93OjYwMCxmYXN0OjIwMCxfZGVmYXVsdDo0MDB9LHB0LmZ4LnN0ZXA9e30scHQuZXhwciYmcHQuZXhwci5maWx0ZXJzJiYocHQuZXhwci5maWx0ZXJzLmFuaW1hdGVkPWZ1bmN0aW9uKGUpe3JldHVybiBwdC5ncmVwKHB0LnRpbWVycyxmdW5jdGlvbih0KXtyZXR1cm4gZT09PXQuZWxlbX0pLmxlbmd0aH0pLHB0LmZuLm9mZnNldD1mdW5jdGlvbihlKXtpZihhcmd1bWVudHMubGVuZ3RoKXJldHVybiBlPT09cj90aGlzOnRoaXMuZWFjaChmdW5jdGlvbih0KXtwdC5vZmZzZXQuc2V0T2Zmc2V0KHRoaXMsZSx0KX0pO3ZhciB0LG4saT17dG9wOjAsbGVmdDowfSxvPXRoaXNbMF0sYT1vJiZvLm93bmVyRG9jdW1lbnQ7cmV0dXJuIGE/KHQ9YS5kb2N1bWVudEVsZW1lbnQscHQuY29udGFpbnModCxvKT8odHlwZW9mIG8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0IT09RyYmKGk9by5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksbj1WKGEpLHt0b3A6aS50b3ArKG4ucGFnZVlPZmZzZXR8fHQuc2Nyb2xsVG9wKS0odC5jbGllbnRUb3B8fDApLGxlZnQ6aS5sZWZ0KyhuLnBhZ2VYT2Zmc2V0fHx0LnNjcm9sbExlZnQpLSh0LmNsaWVudExlZnR8fDApfSk6aSk6dm9pZCAwfSxwdC5vZmZzZXQ9e3NldE9mZnNldDpmdW5jdGlvbihlLHQsbil7dmFyIHI9cHQuY3NzKGUsXCJwb3NpdGlvblwiKTtcInN0YXRpY1wiPT09ciYmKGUuc3R5bGUucG9zaXRpb249XCJyZWxhdGl2ZVwiKTt2YXIgaSxvLGE9cHQoZSkscz1hLm9mZnNldCgpLHU9cHQuY3NzKGUsXCJ0b3BcIiksbD1wdC5jc3MoZSxcImxlZnRcIiksYz0oXCJhYnNvbHV0ZVwiPT09cnx8XCJmaXhlZFwiPT09cikmJnB0LmluQXJyYXkoXCJhdXRvXCIsW3UsbF0pPi0xLGY9e30scD17fTtjPyhwPWEucG9zaXRpb24oKSxpPXAudG9wLG89cC5sZWZ0KTooaT1wYXJzZUZsb2F0KHUpfHwwLG89cGFyc2VGbG9hdChsKXx8MCkscHQuaXNGdW5jdGlvbih0KSYmKHQ9dC5jYWxsKGUsbixzKSksbnVsbCE9dC50b3AmJihmLnRvcD10LnRvcC1zLnRvcCtpKSxudWxsIT10LmxlZnQmJihmLmxlZnQ9dC5sZWZ0LXMubGVmdCtvKSxcInVzaW5nXCJpbiB0P3QudXNpbmcuY2FsbChlLGYpOmEuY3NzKGYpfX0scHQuZm4uZXh0ZW5kKHtwb3NpdGlvbjpmdW5jdGlvbigpe2lmKHRoaXNbMF0pe3ZhciBlLHQsbj17dG9wOjAsbGVmdDowfSxyPXRoaXNbMF07cmV0dXJuXCJmaXhlZFwiPT09cHQuY3NzKHIsXCJwb3NpdGlvblwiKT90PXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk6KGU9dGhpcy5vZmZzZXRQYXJlbnQoKSx0PXRoaXMub2Zmc2V0KCkscHQubm9kZU5hbWUoZVswXSxcImh0bWxcIil8fChuPWUub2Zmc2V0KCkpLG4udG9wKz1wdC5jc3MoZVswXSxcImJvcmRlclRvcFdpZHRoXCIsITApLG4ubGVmdCs9cHQuY3NzKGVbMF0sXCJib3JkZXJMZWZ0V2lkdGhcIiwhMCkpLHt0b3A6dC50b3Atbi50b3AtcHQuY3NzKHIsXCJtYXJnaW5Ub3BcIiwhMCksbGVmdDp0LmxlZnQtbi5sZWZ0LXB0LmNzcyhyLFwibWFyZ2luTGVmdFwiLCEwKX19fSxvZmZzZXRQYXJlbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5vZmZzZXRQYXJlbnR8fFo7ZSYmIXB0Lm5vZGVOYW1lKGUsXCJodG1sXCIpJiZcInN0YXRpY1wiPT09cHQuY3NzKGUsXCJwb3NpdGlvblwiKTspZT1lLm9mZnNldFBhcmVudDtyZXR1cm4gZXx8Wn0pfX0pLHB0LmVhY2goe3Njcm9sbExlZnQ6XCJwYWdlWE9mZnNldFwiLHNjcm9sbFRvcDpcInBhZ2VZT2Zmc2V0XCJ9LGZ1bmN0aW9uKGUsdCl7dmFyIG49L1kvLnRlc3QodCk7cHQuZm5bZV09ZnVuY3Rpb24oaSl7cmV0dXJuIHB0LmFjY2Vzcyh0aGlzLGZ1bmN0aW9uKGUsaSxvKXt2YXIgYT1WKGUpO3JldHVybiBvPT09cj9hP3QgaW4gYT9hW3RdOmEuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50W2ldOmVbaV06KGE/YS5zY3JvbGxUbyhuP3B0KGEpLnNjcm9sbExlZnQoKTpvLG4/bzpwdChhKS5zY3JvbGxUb3AoKSk6ZVtpXT1vLHIpfSxlLGksYXJndW1lbnRzLmxlbmd0aCxudWxsKX19KSxwdC5lYWNoKHtIZWlnaHQ6XCJoZWlnaHRcIixXaWR0aDpcIndpZHRoXCJ9LGZ1bmN0aW9uKGUsdCl7cHQuZWFjaCh7cGFkZGluZzpcImlubmVyXCIrZSxjb250ZW50OnQsXCJcIjpcIm91dGVyXCIrZX0sZnVuY3Rpb24obixpKXtwdC5mbltpXT1mdW5jdGlvbihpLG8pe3ZhciBhPWFyZ3VtZW50cy5sZW5ndGgmJihufHxcImJvb2xlYW5cIiE9dHlwZW9mIGkpLHM9bnx8KGk9PT0hMHx8bz09PSEwP1wibWFyZ2luXCI6XCJib3JkZXJcIik7cmV0dXJuIHB0LmFjY2Vzcyh0aGlzLGZ1bmN0aW9uKHQsbixpKXt2YXIgbztyZXR1cm4gcHQuaXNXaW5kb3codCk/dC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbXCJjbGllbnRcIitlXTo5PT09dC5ub2RlVHlwZT8obz10LmRvY3VtZW50RWxlbWVudCxNYXRoLm1heCh0LmJvZHlbXCJzY3JvbGxcIitlXSxvW1wic2Nyb2xsXCIrZV0sdC5ib2R5W1wib2Zmc2V0XCIrZV0sb1tcIm9mZnNldFwiK2VdLG9bXCJjbGllbnRcIitlXSkpOmk9PT1yP3B0LmNzcyh0LG4scyk6cHQuc3R5bGUodCxuLGkscyl9LHQsYT9pOnIsYSxudWxsKX19KX0pLHB0LmZuLnNpemU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5sZW5ndGh9LHB0LmZuLmFuZFNlbGY9cHQuZm4uYWRkQmFjayxcIm9iamVjdFwiPT10eXBlb2YgZSYmZSYmXCJvYmplY3RcIj09dHlwZW9mIGUuZXhwb3J0cz9lLmV4cG9ydHM9cHQ6KHQualF1ZXJ5PXQuJD1wdCxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZuLmFtZCYmbihcImpxdWVyeVwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIHB0fSkpfSh3aW5kb3cpLHIoXCJ1bmRlZmluZWRcIiE9dHlwZW9mICQ/JDp3aW5kb3cuJCl9KS5jYWxsKGdsb2JhbCx2b2lkIDAsdm9pZCAwLHZvaWQgMCxmdW5jdGlvbihlKXttb2R1bGUuZXhwb3J0cz1lfSk7fSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7KGZ1bmN0aW9uKG4sdCxyLGUpeyhmdW5jdGlvbigpe3ZhciBlPXRoaXMsdT1lLl8saT17fSxhPUFycmF5LnByb3RvdHlwZSxvPU9iamVjdC5wcm90b3R5cGUsYz1GdW5jdGlvbi5wcm90b3R5cGUsbD1hLnB1c2gsZj1hLnNsaWNlLHM9YS5jb25jYXQscD1vLnRvU3RyaW5nLHY9by5oYXNPd25Qcm9wZXJ0eSxoPWEuZm9yRWFjaCxkPWEubWFwLGc9YS5yZWR1Y2UseT1hLnJlZHVjZVJpZ2h0LG09YS5maWx0ZXIsYj1hLmV2ZXJ5LF89YS5zb21lLHg9YS5pbmRleE9mLHc9YS5sYXN0SW5kZXhPZixqPUFycmF5LmlzQXJyYXksQT1PYmplY3Qua2V5cyxFPWMuYmluZCxPPWZ1bmN0aW9uKG4pe3JldHVybiBuIGluc3RhbmNlb2YgTz9uOnRoaXMgaW5zdGFuY2VvZiBPP3ZvaWQodGhpcy5fd3JhcHBlZD1uKTpuZXcgTyhuKX07XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHQ/KFwidW5kZWZpbmVkXCIhPXR5cGVvZiBuJiZuLmV4cG9ydHMmJih0PW4uZXhwb3J0cz1PKSx0Ll89Tyk6ZS5fPU8sTy5WRVJTSU9OPVwiMS41LjJcIjt2YXIgaz1PLmVhY2g9Ty5mb3JFYWNoPWZ1bmN0aW9uKG4sdCxyKXtpZihudWxsIT1uKWlmKGgmJm4uZm9yRWFjaD09PWgpbi5mb3JFYWNoKHQscik7ZWxzZSBpZihuLmxlbmd0aD09PStuLmxlbmd0aCl7Zm9yKHZhciBlPTAsdT1uLmxlbmd0aDt1PmU7ZSsrKWlmKHQuY2FsbChyLG5bZV0sZSxuKT09PWkpcmV0dXJufWVsc2UgZm9yKHZhciBhPU8ua2V5cyhuKSxlPTAsdT1hLmxlbmd0aDt1PmU7ZSsrKWlmKHQuY2FsbChyLG5bYVtlXV0sYVtlXSxuKT09PWkpcmV0dXJufTtPLm1hcD1PLmNvbGxlY3Q9ZnVuY3Rpb24obix0LHIpe3ZhciBlPVtdO3JldHVybiBudWxsPT1uP2U6ZCYmbi5tYXA9PT1kP24ubWFwKHQscik6KGsobixmdW5jdGlvbihuLHUsaSl7ZS5wdXNoKHQuY2FsbChyLG4sdSxpKSl9KSxlKX07dmFyIEY9XCJSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlXCI7Ty5yZWR1Y2U9Ty5mb2xkbD1PLmluamVjdD1mdW5jdGlvbihuLHQscixlKXt2YXIgdT1hcmd1bWVudHMubGVuZ3RoPjI7aWYobnVsbD09biYmKG49W10pLGcmJm4ucmVkdWNlPT09ZylyZXR1cm4gZSYmKHQ9Ty5iaW5kKHQsZSkpLHU/bi5yZWR1Y2UodCxyKTpuLnJlZHVjZSh0KTtpZihrKG4sZnVuY3Rpb24obixpLGEpe3U/cj10LmNhbGwoZSxyLG4saSxhKToocj1uLHU9ITApfSksIXUpdGhyb3cgbmV3IFR5cGVFcnJvcihGKTtyZXR1cm4gcn0sTy5yZWR1Y2VSaWdodD1PLmZvbGRyPWZ1bmN0aW9uKG4sdCxyLGUpe3ZhciB1PWFyZ3VtZW50cy5sZW5ndGg+MjtpZihudWxsPT1uJiYobj1bXSkseSYmbi5yZWR1Y2VSaWdodD09PXkpcmV0dXJuIGUmJih0PU8uYmluZCh0LGUpKSx1P24ucmVkdWNlUmlnaHQodCxyKTpuLnJlZHVjZVJpZ2h0KHQpO3ZhciBpPW4ubGVuZ3RoO2lmKGkhPT0raSl7dmFyIGE9Ty5rZXlzKG4pO2k9YS5sZW5ndGh9aWYoayhuLGZ1bmN0aW9uKG8sYyxsKXtjPWE/YVstLWldOi0taSx1P3I9dC5jYWxsKGUscixuW2NdLGMsbCk6KHI9bltjXSx1PSEwKX0pLCF1KXRocm93IG5ldyBUeXBlRXJyb3IoRik7cmV0dXJuIHJ9LE8uZmluZD1PLmRldGVjdD1mdW5jdGlvbihuLHQscil7dmFyIGU7cmV0dXJuIE0obixmdW5jdGlvbihuLHUsaSl7cmV0dXJuIHQuY2FsbChyLG4sdSxpKT8oZT1uLCEwKTp2b2lkIDB9KSxlfSxPLmZpbHRlcj1PLnNlbGVjdD1mdW5jdGlvbihuLHQscil7dmFyIGU9W107cmV0dXJuIG51bGw9PW4/ZTptJiZuLmZpbHRlcj09PW0/bi5maWx0ZXIodCxyKTooayhuLGZ1bmN0aW9uKG4sdSxpKXt0LmNhbGwocixuLHUsaSkmJmUucHVzaChuKX0pLGUpfSxPLnJlamVjdD1mdW5jdGlvbihuLHQscil7cmV0dXJuIE8uZmlsdGVyKG4sZnVuY3Rpb24obixlLHUpe3JldHVybiF0LmNhbGwocixuLGUsdSl9LHIpfSxPLmV2ZXJ5PU8uYWxsPWZ1bmN0aW9uKG4sdCxyKXt0fHwodD1PLmlkZW50aXR5KTt2YXIgZT0hMDtyZXR1cm4gbnVsbD09bj9lOmImJm4uZXZlcnk9PT1iP24uZXZlcnkodCxyKTooayhuLGZ1bmN0aW9uKG4sdSxhKXtyZXR1cm4oZT1lJiZ0LmNhbGwocixuLHUsYSkpP3ZvaWQgMDppfSksISFlKX07dmFyIE09Ty5zb21lPU8uYW55PWZ1bmN0aW9uKG4sdCxyKXt0fHwodD1PLmlkZW50aXR5KTt2YXIgZT0hMTtyZXR1cm4gbnVsbD09bj9lOl8mJm4uc29tZT09PV8/bi5zb21lKHQscik6KGsobixmdW5jdGlvbihuLHUsYSl7cmV0dXJuIGV8fChlPXQuY2FsbChyLG4sdSxhKSk/aTp2b2lkIDB9KSwhIWUpfTtPLmNvbnRhaW5zPU8uaW5jbHVkZT1mdW5jdGlvbihuLHQpe3JldHVybiBudWxsPT1uPyExOngmJm4uaW5kZXhPZj09PXg/LTEhPW4uaW5kZXhPZih0KTpNKG4sZnVuY3Rpb24obil7cmV0dXJuIG49PT10fSl9LE8uaW52b2tlPWZ1bmN0aW9uKG4sdCl7dmFyIHI9Zi5jYWxsKGFyZ3VtZW50cywyKSxlPU8uaXNGdW5jdGlvbih0KTtyZXR1cm4gTy5tYXAobixmdW5jdGlvbihuKXtyZXR1cm4oZT90Om5bdF0pLmFwcGx5KG4scil9KX0sTy5wbHVjaz1mdW5jdGlvbihuLHQpe3JldHVybiBPLm1hcChuLGZ1bmN0aW9uKG4pe3JldHVybiBuW3RdfSl9LE8ud2hlcmU9ZnVuY3Rpb24obix0LHIpe3JldHVybiBPLmlzRW1wdHkodCk/cj92b2lkIDA6W106T1tyP1wiZmluZFwiOlwiZmlsdGVyXCJdKG4sZnVuY3Rpb24obil7Zm9yKHZhciByIGluIHQpaWYodFtyXSE9PW5bcl0pcmV0dXJuITE7cmV0dXJuITB9KX0sTy5maW5kV2hlcmU9ZnVuY3Rpb24obix0KXtyZXR1cm4gTy53aGVyZShuLHQsITApfSxPLm1heD1mdW5jdGlvbihuLHQscil7aWYoIXQmJk8uaXNBcnJheShuKSYmblswXT09PStuWzBdJiY2NTUzNT5uLmxlbmd0aClyZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCxuKTtpZighdCYmTy5pc0VtcHR5KG4pKXJldHVybi0xLzA7dmFyIGU9e2NvbXB1dGVkOi0xLzAsdmFsdWU6LTEvMH07cmV0dXJuIGsobixmdW5jdGlvbihuLHUsaSl7dmFyIGE9dD90LmNhbGwocixuLHUsaSk6bjthPmUuY29tcHV0ZWQmJihlPXt2YWx1ZTpuLGNvbXB1dGVkOmF9KX0pLGUudmFsdWV9LE8ubWluPWZ1bmN0aW9uKG4sdCxyKXtpZighdCYmTy5pc0FycmF5KG4pJiZuWzBdPT09K25bMF0mJjY1NTM1Pm4ubGVuZ3RoKXJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLG4pO2lmKCF0JiZPLmlzRW1wdHkobikpcmV0dXJuIDEvMDt2YXIgZT17Y29tcHV0ZWQ6MS8wLHZhbHVlOjEvMH07cmV0dXJuIGsobixmdW5jdGlvbihuLHUsaSl7dmFyIGE9dD90LmNhbGwocixuLHUsaSk6bjtlLmNvbXB1dGVkPmEmJihlPXt2YWx1ZTpuLGNvbXB1dGVkOmF9KX0pLGUudmFsdWV9LE8uc2h1ZmZsZT1mdW5jdGlvbihuKXt2YXIgdCxyPTAsZT1bXTtyZXR1cm4gayhuLGZ1bmN0aW9uKG4pe3Q9Ty5yYW5kb20ocisrKSxlW3ItMV09ZVt0XSxlW3RdPW59KSxlfSxPLnNhbXBsZT1mdW5jdGlvbihuLHQscil7cmV0dXJuIDI+YXJndW1lbnRzLmxlbmd0aHx8cj9uW08ucmFuZG9tKG4ubGVuZ3RoLTEpXTpPLnNodWZmbGUobikuc2xpY2UoMCxNYXRoLm1heCgwLHQpKX07dmFyIFI9ZnVuY3Rpb24obil7cmV0dXJuIE8uaXNGdW5jdGlvbihuKT9uOmZ1bmN0aW9uKHQpe3JldHVybiB0W25dfX07Ty5zb3J0Qnk9ZnVuY3Rpb24obix0LHIpe3ZhciBlPVIodCk7cmV0dXJuIE8ucGx1Y2soTy5tYXAobixmdW5jdGlvbihuLHQsdSl7cmV0dXJue3ZhbHVlOm4saW5kZXg6dCxjcml0ZXJpYTplLmNhbGwocixuLHQsdSl9fSkuc29ydChmdW5jdGlvbihuLHQpe3ZhciByPW4uY3JpdGVyaWEsZT10LmNyaXRlcmlhO2lmKHIhPT1lKXtpZihyPmV8fHZvaWQgMD09PXIpcmV0dXJuIDE7aWYoZT5yfHx2b2lkIDA9PT1lKXJldHVybi0xfXJldHVybiBuLmluZGV4LXQuaW5kZXh9KSxcInZhbHVlXCIpfTt2YXIgST1mdW5jdGlvbihuKXtyZXR1cm4gZnVuY3Rpb24odCxyLGUpe3ZhciB1PXt9LGk9bnVsbD09cj9PLmlkZW50aXR5OlIocik7cmV0dXJuIGsodCxmdW5jdGlvbihyLGEpe3ZhciBvPWkuY2FsbChlLHIsYSx0KTtuKHUsbyxyKX0pLHV9fTtPLmdyb3VwQnk9SShmdW5jdGlvbihuLHQscil7KE8uaGFzKG4sdCk/blt0XTpuW3RdPVtdKS5wdXNoKHIpfSksTy5pbmRleEJ5PUkoZnVuY3Rpb24obix0LHIpe25bdF09cn0pLE8uY291bnRCeT1JKGZ1bmN0aW9uKG4sdCl7Ty5oYXMobix0KT9uW3RdKys6blt0XT0xfSksTy5zb3J0ZWRJbmRleD1mdW5jdGlvbihuLHQscixlKXtyPW51bGw9PXI/Ty5pZGVudGl0eTpSKHIpO2Zvcih2YXIgdT1yLmNhbGwoZSx0KSxpPTAsYT1uLmxlbmd0aDthPmk7KXt2YXIgbz1pK2E+Pj4xO3U+ci5jYWxsKGUsbltvXSk/aT1vKzE6YT1vfXJldHVybiBpfSxPLnRvQXJyYXk9ZnVuY3Rpb24obil7cmV0dXJuIG4/Ty5pc0FycmF5KG4pP2YuY2FsbChuKTpuLmxlbmd0aD09PStuLmxlbmd0aD9PLm1hcChuLE8uaWRlbnRpdHkpOk8udmFsdWVzKG4pOltdfSxPLnNpemU9ZnVuY3Rpb24obil7cmV0dXJuIG51bGw9PW4/MDpuLmxlbmd0aD09PStuLmxlbmd0aD9uLmxlbmd0aDpPLmtleXMobikubGVuZ3RofSxPLmZpcnN0PU8uaGVhZD1PLnRha2U9ZnVuY3Rpb24obix0LHIpe3JldHVybiBudWxsPT1uP3ZvaWQgMDpudWxsPT10fHxyP25bMF06Zi5jYWxsKG4sMCx0KX0sTy5pbml0aWFsPWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gZi5jYWxsKG4sMCxuLmxlbmd0aC0obnVsbD09dHx8cj8xOnQpKX0sTy5sYXN0PWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gbnVsbD09bj92b2lkIDA6bnVsbD09dHx8cj9uW24ubGVuZ3RoLTFdOmYuY2FsbChuLE1hdGgubWF4KG4ubGVuZ3RoLXQsMCkpfSxPLnJlc3Q9Ty50YWlsPU8uZHJvcD1mdW5jdGlvbihuLHQscil7cmV0dXJuIGYuY2FsbChuLG51bGw9PXR8fHI/MTp0KX0sTy5jb21wYWN0PWZ1bmN0aW9uKG4pe3JldHVybiBPLmZpbHRlcihuLE8uaWRlbnRpdHkpfTt2YXIgUz1mdW5jdGlvbihuLHQscil7cmV0dXJuIHQmJk8uZXZlcnkobixPLmlzQXJyYXkpP3MuYXBwbHkocixuKTooayhuLGZ1bmN0aW9uKG4pe08uaXNBcnJheShuKXx8Ty5pc0FyZ3VtZW50cyhuKT90P2wuYXBwbHkocixuKTpTKG4sdCxyKTpyLnB1c2gobil9KSxyKX07Ty5mbGF0dGVuPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIFMobix0LFtdKX0sTy53aXRob3V0PWZ1bmN0aW9uKG4pe3JldHVybiBPLmRpZmZlcmVuY2UobixmLmNhbGwoYXJndW1lbnRzLDEpKX0sTy51bmlxPU8udW5pcXVlPWZ1bmN0aW9uKG4sdCxyLGUpe08uaXNGdW5jdGlvbih0KSYmKGU9cixyPXQsdD0hMSk7dmFyIHU9cj9PLm1hcChuLHIsZSk6bixpPVtdLGE9W107cmV0dXJuIGsodSxmdW5jdGlvbihyLGUpeyh0P2UmJmFbYS5sZW5ndGgtMV09PT1yOk8uY29udGFpbnMoYSxyKSl8fChhLnB1c2gociksaS5wdXNoKG5bZV0pKX0pLGl9LE8udW5pb249ZnVuY3Rpb24oKXtyZXR1cm4gTy51bmlxKE8uZmxhdHRlbihhcmd1bWVudHMsITApKX0sTy5pbnRlcnNlY3Rpb249ZnVuY3Rpb24obil7dmFyIHQ9Zi5jYWxsKGFyZ3VtZW50cywxKTtyZXR1cm4gTy5maWx0ZXIoTy51bmlxKG4pLGZ1bmN0aW9uKG4pe3JldHVybiBPLmV2ZXJ5KHQsZnVuY3Rpb24odCl7cmV0dXJuIE8uaW5kZXhPZih0LG4pPj0wfSl9KX0sTy5kaWZmZXJlbmNlPWZ1bmN0aW9uKG4pe3ZhciB0PXMuYXBwbHkoYSxmLmNhbGwoYXJndW1lbnRzLDEpKTtyZXR1cm4gTy5maWx0ZXIobixmdW5jdGlvbihuKXtyZXR1cm4hTy5jb250YWlucyh0LG4pfSl9LE8uemlwPWZ1bmN0aW9uKCl7Zm9yKHZhciBuPU8ubWF4KE8ucGx1Y2soYXJndW1lbnRzLFwibGVuZ3RoXCIpLmNvbmNhdCgwKSksdD1BcnJheShuKSxyPTA7bj5yO3IrKyl0W3JdPU8ucGx1Y2soYXJndW1lbnRzLFwiXCIrcik7cmV0dXJuIHR9LE8ub2JqZWN0PWZ1bmN0aW9uKG4sdCl7aWYobnVsbD09bilyZXR1cm57fTtmb3IodmFyIHI9e30sZT0wLHU9bi5sZW5ndGg7dT5lO2UrKyl0P3JbbltlXV09dFtlXTpyW25bZV1bMF1dPW5bZV1bMV07cmV0dXJuIHJ9LE8uaW5kZXhPZj1mdW5jdGlvbihuLHQscil7aWYobnVsbD09bilyZXR1cm4tMTt2YXIgZT0wLHU9bi5sZW5ndGg7aWYocil7aWYoXCJudW1iZXJcIiE9dHlwZW9mIHIpcmV0dXJuIGU9Ty5zb3J0ZWRJbmRleChuLHQpLG5bZV09PT10P2U6LTE7ZT0wPnI/TWF0aC5tYXgoMCx1K3IpOnJ9aWYoeCYmbi5pbmRleE9mPT09eClyZXR1cm4gbi5pbmRleE9mKHQscik7Zm9yKDt1PmU7ZSsrKWlmKG5bZV09PT10KXJldHVybiBlO3JldHVybi0xfSxPLmxhc3RJbmRleE9mPWZ1bmN0aW9uKG4sdCxyKXtpZihudWxsPT1uKXJldHVybi0xO3ZhciBlPW51bGwhPXI7aWYodyYmbi5sYXN0SW5kZXhPZj09PXcpcmV0dXJuIGU/bi5sYXN0SW5kZXhPZih0LHIpOm4ubGFzdEluZGV4T2YodCk7Zm9yKHZhciB1PWU/cjpuLmxlbmd0aDt1LS07KWlmKG5bdV09PT10KXJldHVybiB1O3JldHVybi0xfSxPLnJhbmdlPWZ1bmN0aW9uKG4sdCxyKXsxPj1hcmd1bWVudHMubGVuZ3RoJiYodD1ufHwwLG49MCkscj1hcmd1bWVudHNbMl18fDE7Zm9yKHZhciBlPU1hdGgubWF4KE1hdGguY2VpbCgodC1uKS9yKSwwKSx1PTAsaT1BcnJheShlKTtlPnU7KWlbdSsrXT1uLG4rPXI7cmV0dXJuIGl9O3ZhciBUPWZ1bmN0aW9uKCl7fTtPLmJpbmQ9ZnVuY3Rpb24obix0KXt2YXIgcixlO2lmKEUmJm4uYmluZD09PUUpcmV0dXJuIEUuYXBwbHkobixmLmNhbGwoYXJndW1lbnRzLDEpKTtpZighTy5pc0Z1bmN0aW9uKG4pKXRocm93IG5ldyBUeXBlRXJyb3I7cmV0dXJuIHI9Zi5jYWxsKGFyZ3VtZW50cywyKSxlPWZ1bmN0aW9uKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgZSkpcmV0dXJuIG4uYXBwbHkodCxyLmNvbmNhdChmLmNhbGwoYXJndW1lbnRzKSkpO1QucHJvdG90eXBlPW4ucHJvdG90eXBlO3ZhciB1PW5ldyBUO1QucHJvdG90eXBlPW51bGw7dmFyIGk9bi5hcHBseSh1LHIuY29uY2F0KGYuY2FsbChhcmd1bWVudHMpKSk7cmV0dXJuIE9iamVjdChpKT09PWk/aTp1fX0sTy5wYXJ0aWFsPWZ1bmN0aW9uKG4pe3ZhciB0PWYuY2FsbChhcmd1bWVudHMsMSk7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIG4uYXBwbHkodGhpcyx0LmNvbmNhdChmLmNhbGwoYXJndW1lbnRzKSkpfX0sTy5iaW5kQWxsPWZ1bmN0aW9uKG4pe3ZhciB0PWYuY2FsbChhcmd1bWVudHMsMSk7aWYoMD09PXQubGVuZ3RoKXRocm93IEVycm9yKFwiYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lc1wiKTtyZXR1cm4gayh0LGZ1bmN0aW9uKHQpe25bdF09Ty5iaW5kKG5bdF0sbil9KSxufSxPLm1lbW9pemU9ZnVuY3Rpb24obix0KXt2YXIgcj17fTtyZXR1cm4gdHx8KHQ9Ty5pZGVudGl0eSksZnVuY3Rpb24oKXt2YXIgZT10LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtyZXR1cm4gTy5oYXMocixlKT9yW2VdOnJbZV09bi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fSxPLmRlbGF5PWZ1bmN0aW9uKG4sdCl7dmFyIHI9Zi5jYWxsKGFyZ3VtZW50cywyKTtyZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe3JldHVybiBuLmFwcGx5KG51bGwscil9LHQpfSxPLmRlZmVyPWZ1bmN0aW9uKG4pe3JldHVybiBPLmRlbGF5LmFwcGx5KE8sW24sMV0uY29uY2F0KGYuY2FsbChhcmd1bWVudHMsMSkpKX0sTy50aHJvdHRsZT1mdW5jdGlvbihuLHQscil7dmFyIGUsdSxpLGE9bnVsbCxvPTA7cnx8KHI9e30pO3ZhciBjPWZ1bmN0aW9uKCl7bz1yLmxlYWRpbmc9PT0hMT8wOm5ldyBEYXRlLGE9bnVsbCxpPW4uYXBwbHkoZSx1KX07cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGw9bmV3IERhdGU7b3x8ci5sZWFkaW5nIT09ITF8fChvPWwpO3ZhciBmPXQtKGwtbyk7cmV0dXJuIGU9dGhpcyx1PWFyZ3VtZW50cywwPj1mPyhjbGVhclRpbWVvdXQoYSksYT1udWxsLG89bCxpPW4uYXBwbHkoZSx1KSk6YXx8ci50cmFpbGluZz09PSExfHwoYT1zZXRUaW1lb3V0KGMsZikpLGl9fSxPLmRlYm91bmNlPWZ1bmN0aW9uKG4sdCxyKXt2YXIgZSx1LGksYSxvO3JldHVybiBmdW5jdGlvbigpe2k9dGhpcyx1PWFyZ3VtZW50cyxhPW5ldyBEYXRlO3ZhciBjPWZ1bmN0aW9uKCl7dmFyIGw9bmV3IERhdGUtYTt0Pmw/ZT1zZXRUaW1lb3V0KGMsdC1sKTooZT1udWxsLHJ8fChvPW4uYXBwbHkoaSx1KSkpfSxsPXImJiFlO3JldHVybiBlfHwoZT1zZXRUaW1lb3V0KGMsdCkpLGwmJihvPW4uYXBwbHkoaSx1KSksb319LE8ub25jZT1mdW5jdGlvbihuKXt2YXIgdCxyPSExO3JldHVybiBmdW5jdGlvbigpe3JldHVybiByP3Q6KHI9ITAsdD1uLmFwcGx5KHRoaXMsYXJndW1lbnRzKSxuPW51bGwsdCl9fSxPLndyYXA9ZnVuY3Rpb24obix0KXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgcj1bbl07cmV0dXJuIGwuYXBwbHkocixhcmd1bWVudHMpLHQuYXBwbHkodGhpcyxyKX19LE8uY29tcG9zZT1mdW5jdGlvbigpe3ZhciBuPWFyZ3VtZW50cztyZXR1cm4gZnVuY3Rpb24oKXtmb3IodmFyIHQ9YXJndW1lbnRzLHI9bi5sZW5ndGgtMTtyPj0wO3ItLSl0PVtuW3JdLmFwcGx5KHRoaXMsdCldO3JldHVybiB0WzBdfX0sTy5hZnRlcj1mdW5jdGlvbihuLHQpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiAxPi0tbj90LmFwcGx5KHRoaXMsYXJndW1lbnRzKTp2b2lkIDB9fSxPLmtleXM9QXx8ZnVuY3Rpb24obil7aWYobiE9PU9iamVjdChuKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBvYmplY3RcIik7dmFyIHQ9W107Zm9yKHZhciByIGluIG4pTy5oYXMobixyKSYmdC5wdXNoKHIpO3JldHVybiB0fSxPLnZhbHVlcz1mdW5jdGlvbihuKXtmb3IodmFyIHQ9Ty5rZXlzKG4pLHI9dC5sZW5ndGgsZT1BcnJheShyKSx1PTA7cj51O3UrKyllW3VdPW5bdFt1XV07cmV0dXJuIGV9LE8ucGFpcnM9ZnVuY3Rpb24obil7Zm9yKHZhciB0PU8ua2V5cyhuKSxyPXQubGVuZ3RoLGU9QXJyYXkociksdT0wO3I+dTt1KyspZVt1XT1bdFt1XSxuW3RbdV1dXTtyZXR1cm4gZX0sTy5pbnZlcnQ9ZnVuY3Rpb24obil7Zm9yKHZhciB0PXt9LHI9Ty5rZXlzKG4pLGU9MCx1PXIubGVuZ3RoO3U+ZTtlKyspdFtuW3JbZV1dXT1yW2VdO3JldHVybiB0fSxPLmZ1bmN0aW9ucz1PLm1ldGhvZHM9ZnVuY3Rpb24obil7dmFyIHQ9W107Zm9yKHZhciByIGluIG4pTy5pc0Z1bmN0aW9uKG5bcl0pJiZ0LnB1c2gocik7cmV0dXJuIHQuc29ydCgpfSxPLmV4dGVuZD1mdW5jdGlvbihuKXtyZXR1cm4gayhmLmNhbGwoYXJndW1lbnRzLDEpLGZ1bmN0aW9uKHQpe2lmKHQpZm9yKHZhciByIGluIHQpbltyXT10W3JdfSksbn0sTy5waWNrPWZ1bmN0aW9uKG4pe3ZhciB0PXt9LHI9cy5hcHBseShhLGYuY2FsbChhcmd1bWVudHMsMSkpO3JldHVybiBrKHIsZnVuY3Rpb24ocil7ciBpbiBuJiYodFtyXT1uW3JdKX0pLHR9LE8ub21pdD1mdW5jdGlvbihuKXt2YXIgdD17fSxyPXMuYXBwbHkoYSxmLmNhbGwoYXJndW1lbnRzLDEpKTtmb3IodmFyIGUgaW4gbilPLmNvbnRhaW5zKHIsZSl8fCh0W2VdPW5bZV0pO3JldHVybiB0fSxPLmRlZmF1bHRzPWZ1bmN0aW9uKG4pe3JldHVybiBrKGYuY2FsbChhcmd1bWVudHMsMSksZnVuY3Rpb24odCl7aWYodClmb3IodmFyIHIgaW4gdCl2b2lkIDA9PT1uW3JdJiYobltyXT10W3JdKX0pLG59LE8uY2xvbmU9ZnVuY3Rpb24obil7cmV0dXJuIE8uaXNPYmplY3Qobik/Ty5pc0FycmF5KG4pP24uc2xpY2UoKTpPLmV4dGVuZCh7fSxuKTpufSxPLnRhcD1mdW5jdGlvbihuLHQpe3JldHVybiB0KG4pLG59O3ZhciBOPWZ1bmN0aW9uKG4sdCxyLGUpe2lmKG49PT10KXJldHVybiAwIT09bnx8MS9uPT0xL3Q7aWYobnVsbD09bnx8bnVsbD09dClyZXR1cm4gbj09PXQ7biBpbnN0YW5jZW9mIE8mJihuPW4uX3dyYXBwZWQpLHQgaW5zdGFuY2VvZiBPJiYodD10Ll93cmFwcGVkKTt2YXIgdT1wLmNhbGwobik7aWYodSE9cC5jYWxsKHQpKXJldHVybiExO3N3aXRjaCh1KXtjYXNlXCJbb2JqZWN0IFN0cmluZ11cIjpyZXR1cm4gbj09dCtcIlwiO2Nhc2VcIltvYmplY3QgTnVtYmVyXVwiOnJldHVybiBuIT0rbj90IT0rdDowPT1uPzEvbj09MS90Om49PSt0O2Nhc2VcIltvYmplY3QgRGF0ZV1cIjpjYXNlXCJbb2JqZWN0IEJvb2xlYW5dXCI6cmV0dXJuK249PSt0O2Nhc2VcIltvYmplY3QgUmVnRXhwXVwiOnJldHVybiBuLnNvdXJjZT09dC5zb3VyY2UmJm4uZ2xvYmFsPT10Lmdsb2JhbCYmbi5tdWx0aWxpbmU9PXQubXVsdGlsaW5lJiZuLmlnbm9yZUNhc2U9PXQuaWdub3JlQ2FzZX1pZihcIm9iamVjdFwiIT10eXBlb2Ygbnx8XCJvYmplY3RcIiE9dHlwZW9mIHQpcmV0dXJuITE7Zm9yKHZhciBpPXIubGVuZ3RoO2ktLTspaWYocltpXT09bilyZXR1cm4gZVtpXT09dDt2YXIgYT1uLmNvbnN0cnVjdG9yLG89dC5jb25zdHJ1Y3RvcjtpZihhIT09byYmIShPLmlzRnVuY3Rpb24oYSkmJmEgaW5zdGFuY2VvZiBhJiZPLmlzRnVuY3Rpb24obykmJm8gaW5zdGFuY2VvZiBvKSlyZXR1cm4hMTtyLnB1c2gobiksZS5wdXNoKHQpO3ZhciBjPTAsbD0hMDtpZihcIltvYmplY3QgQXJyYXldXCI9PXUpe2lmKGM9bi5sZW5ndGgsbD1jPT10Lmxlbmd0aClmb3IoO2MtLSYmKGw9TihuW2NdLHRbY10scixlKSk7KTt9ZWxzZXtmb3IodmFyIGYgaW4gbilpZihPLmhhcyhuLGYpJiYoYysrLCEobD1PLmhhcyh0LGYpJiZOKG5bZl0sdFtmXSxyLGUpKSkpYnJlYWs7aWYobCl7Zm9yKGYgaW4gdClpZihPLmhhcyh0LGYpJiYhYy0tKWJyZWFrO2w9IWN9fXJldHVybiByLnBvcCgpLGUucG9wKCksbH07Ty5pc0VxdWFsPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIE4obix0LFtdLFtdKX0sTy5pc0VtcHR5PWZ1bmN0aW9uKG4pe2lmKG51bGw9PW4pcmV0dXJuITA7aWYoTy5pc0FycmF5KG4pfHxPLmlzU3RyaW5nKG4pKXJldHVybiAwPT09bi5sZW5ndGg7Zm9yKHZhciB0IGluIG4paWYoTy5oYXMobix0KSlyZXR1cm4hMTtyZXR1cm4hMH0sTy5pc0VsZW1lbnQ9ZnVuY3Rpb24obil7cmV0dXJuISghbnx8MSE9PW4ubm9kZVR5cGUpfSxPLmlzQXJyYXk9anx8ZnVuY3Rpb24obil7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT1wLmNhbGwobil9LE8uaXNPYmplY3Q9ZnVuY3Rpb24obil7cmV0dXJuIG49PT1PYmplY3Qobil9LGsoW1wiQXJndW1lbnRzXCIsXCJGdW5jdGlvblwiLFwiU3RyaW5nXCIsXCJOdW1iZXJcIixcIkRhdGVcIixcIlJlZ0V4cFwiXSxmdW5jdGlvbihuKXtPW1wiaXNcIituXT1mdW5jdGlvbih0KXtyZXR1cm4gcC5jYWxsKHQpPT1cIltvYmplY3QgXCIrbitcIl1cIn19KSxPLmlzQXJndW1lbnRzKGFyZ3VtZW50cyl8fChPLmlzQXJndW1lbnRzPWZ1bmN0aW9uKG4pe3JldHVybiEoIW58fCFPLmhhcyhuLFwiY2FsbGVlXCIpKX0pLFwiZnVuY3Rpb25cIiE9dHlwZW9mLy4vJiYoTy5pc0Z1bmN0aW9uPWZ1bmN0aW9uKG4pe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG59KSxPLmlzRmluaXRlPWZ1bmN0aW9uKG4pe3JldHVybiBpc0Zpbml0ZShuKSYmIWlzTmFOKHBhcnNlRmxvYXQobikpfSxPLmlzTmFOPWZ1bmN0aW9uKG4pe3JldHVybiBPLmlzTnVtYmVyKG4pJiZuIT0rbn0sTy5pc0Jvb2xlYW49ZnVuY3Rpb24obil7cmV0dXJuIG49PT0hMHx8bj09PSExfHxcIltvYmplY3QgQm9vbGVhbl1cIj09cC5jYWxsKG4pfSxPLmlzTnVsbD1mdW5jdGlvbihuKXtyZXR1cm4gbnVsbD09PW59LE8uaXNVbmRlZmluZWQ9ZnVuY3Rpb24obil7cmV0dXJuIHZvaWQgMD09PW59LE8uaGFzPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHYuY2FsbChuLHQpfSxPLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gZS5fPXUsdGhpc30sTy5pZGVudGl0eT1mdW5jdGlvbihuKXtyZXR1cm4gbn0sTy50aW1lcz1mdW5jdGlvbihuLHQscil7Zm9yKHZhciBlPUFycmF5KE1hdGgubWF4KDAsbikpLHU9MDtuPnU7dSsrKWVbdV09dC5jYWxsKHIsdSk7cmV0dXJuIGV9LE8ucmFuZG9tPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG51bGw9PXQmJih0PW4sbj0wKSxuK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoodC1uKzEpKX07dmFyIHE9e2VzY2FwZTp7XCImXCI6XCImYW1wO1wiLFwiPFwiOlwiJmx0O1wiLFwiPlwiOlwiJmd0O1wiLCdcIic6XCImcXVvdDtcIixcIidcIjpcIiYjeDI3O1wifX07cS51bmVzY2FwZT1PLmludmVydChxLmVzY2FwZSk7dmFyIEI9e2VzY2FwZTpSZWdFeHAoXCJbXCIrTy5rZXlzKHEuZXNjYXBlKS5qb2luKFwiXCIpK1wiXVwiLFwiZ1wiKSx1bmVzY2FwZTpSZWdFeHAoXCIoXCIrTy5rZXlzKHEudW5lc2NhcGUpLmpvaW4oXCJ8XCIpK1wiKVwiLFwiZ1wiKX07Ty5lYWNoKFtcImVzY2FwZVwiLFwidW5lc2NhcGVcIl0sZnVuY3Rpb24obil7T1tuXT1mdW5jdGlvbih0KXtyZXR1cm4gbnVsbD09dD9cIlwiOihcIlwiK3QpLnJlcGxhY2UoQltuXSxmdW5jdGlvbih0KXtyZXR1cm4gcVtuXVt0XX0pfX0pLE8ucmVzdWx0PWZ1bmN0aW9uKG4sdCl7aWYobnVsbD09bilyZXR1cm4gdm9pZCAwO3ZhciByPW5bdF07cmV0dXJuIE8uaXNGdW5jdGlvbihyKT9yLmNhbGwobik6cn0sTy5taXhpbj1mdW5jdGlvbihuKXtrKE8uZnVuY3Rpb25zKG4pLGZ1bmN0aW9uKHQpe3ZhciByPU9bdF09blt0XTtPLnByb3RvdHlwZVt0XT1mdW5jdGlvbigpe3ZhciBuPVt0aGlzLl93cmFwcGVkXTtyZXR1cm4gbC5hcHBseShuLGFyZ3VtZW50cyksVS5jYWxsKHRoaXMsci5hcHBseShPLG4pKX19KX07dmFyIEQ9MDtPLnVuaXF1ZUlkPWZ1bmN0aW9uKG4pe3ZhciB0PSsrRCtcIlwiO3JldHVybiBuP24rdDp0fSxPLnRlbXBsYXRlU2V0dGluZ3M9e2V2YWx1YXRlOi88JShbXFxzXFxTXSs/KSU+L2csaW50ZXJwb2xhdGU6LzwlPShbXFxzXFxTXSs/KSU+L2csZXNjYXBlOi88JS0oW1xcc1xcU10rPyklPi9nfTt2YXIgej0vKC4pXi8sQz17XCInXCI6XCInXCIsXCJcXFxcXCI6XCJcXFxcXCIsXCJcXHJcIjpcInJcIixcIlxcblwiOlwiblwiLFwiXHRcIjpcInRcIixcIlxcdTIwMjhcIjpcInUyMDI4XCIsXCJcXHUyMDI5XCI6XCJ1MjAyOVwifSxQPS9cXFxcfCd8XFxyfFxcbnxcXHR8XFx1MjAyOHxcXHUyMDI5L2c7Ty50ZW1wbGF0ZT1mdW5jdGlvbihuLHQscil7dmFyIGU7cj1PLmRlZmF1bHRzKHt9LHIsTy50ZW1wbGF0ZVNldHRpbmdzKTt2YXIgdT1SZWdFeHAoWyhyLmVzY2FwZXx8eikuc291cmNlLChyLmludGVycG9sYXRlfHx6KS5zb3VyY2UsKHIuZXZhbHVhdGV8fHopLnNvdXJjZV0uam9pbihcInxcIikrXCJ8JFwiLFwiZ1wiKSxpPTAsYT1cIl9fcCs9J1wiO24ucmVwbGFjZSh1LGZ1bmN0aW9uKHQscixlLHUsbyl7cmV0dXJuIGErPW4uc2xpY2UoaSxvKS5yZXBsYWNlKFAsZnVuY3Rpb24obil7cmV0dXJuXCJcXFxcXCIrQ1tuXX0pLHImJihhKz1cIicrXFxuKChfX3Q9KFwiK3IrXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCIpLGUmJihhKz1cIicrXFxuKChfX3Q9KFwiK2UrXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIiksdSYmKGErPVwiJztcXG5cIit1K1wiXFxuX19wKz0nXCIpLGk9byt0Lmxlbmd0aCx0fSksYSs9XCInO1xcblwiLHIudmFyaWFibGV8fChhPVwid2l0aChvYmp8fHt9KXtcXG5cIithK1wifVxcblwiKSxhPVwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLHByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIrYStcInJldHVybiBfX3A7XFxuXCI7dHJ5e2U9RnVuY3Rpb24oci52YXJpYWJsZXx8XCJvYmpcIixcIl9cIixhKX1jYXRjaChvKXt0aHJvdyBvLnNvdXJjZT1hLG99aWYodClyZXR1cm4gZSh0LE8pO3ZhciBjPWZ1bmN0aW9uKG4pe3JldHVybiBlLmNhbGwodGhpcyxuLE8pfTtyZXR1cm4gYy5zb3VyY2U9XCJmdW5jdGlvbihcIisoci52YXJpYWJsZXx8XCJvYmpcIikrXCIpe1xcblwiK2ErXCJ9XCIsY30sTy5jaGFpbj1mdW5jdGlvbihuKXtyZXR1cm4gTyhuKS5jaGFpbigpfTt2YXIgVT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5fY2hhaW4/TyhuKS5jaGFpbigpOm59O08ubWl4aW4oTyksayhbXCJwb3BcIixcInB1c2hcIixcInJldmVyc2VcIixcInNoaWZ0XCIsXCJzb3J0XCIsXCJzcGxpY2VcIixcInVuc2hpZnRcIl0sZnVuY3Rpb24obil7dmFyIHQ9YVtuXTtPLnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3ZhciByPXRoaXMuX3dyYXBwZWQ7cmV0dXJuIHQuYXBwbHkocixhcmd1bWVudHMpLFwic2hpZnRcIiE9biYmXCJzcGxpY2VcIiE9bnx8MCE9PXIubGVuZ3RofHxkZWxldGUgclswXSxVLmNhbGwodGhpcyxyKX19KSxrKFtcImNvbmNhdFwiLFwiam9pblwiLFwic2xpY2VcIl0sZnVuY3Rpb24obil7dmFyIHQ9YVtuXTtPLnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3JldHVybiBVLmNhbGwodGhpcyx0LmFwcGx5KHRoaXMuX3dyYXBwZWQsYXJndW1lbnRzKSl9fSksTy5leHRlbmQoTy5wcm90b3R5cGUse2NoYWluOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NoYWluPSEwLHRoaXN9LHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3dyYXBwZWR9fSksXCJmdW5jdGlvblwiPT10eXBlb2YgciYmci5hbWQmJnIoXCJ1bmRlcnNjb3JlXCIsZnVuY3Rpb24oKXtyZXR1cm4gT30pfSkuY2FsbCh0aGlzKSxlKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBfP186d2luZG93Ll8pfSkuY2FsbChnbG9iYWwsdm9pZCAwLHZvaWQgMCx2b2lkIDAsZnVuY3Rpb24obil7bW9kdWxlLmV4cG9ydHM9bn0pO30pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIixudWxsLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsInZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLFxuICAgLy8gRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICAgaWYgKHR5cGVvZiBVaW50OEFycmF5ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgQXJyYXlCdWZmZXIgPT09ICd1bmRlZmluZWQnKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgLy8gRG9lcyB0aGUgYnJvd3NlciBzdXBwb3J0IGFkZGluZyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXM/IElmXG4gIC8vIG5vdCwgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnQuIFdlIG5lZWQgdG8gYmUgYWJsZSB0b1xuICAvLyBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy5cbiAgLy8gUmVsZXZhbnQgRmlyZWZveCBidWc6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgwKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBBc3N1bWUgb2JqZWN0IGlzIGFuIGFycmF5XG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IGF1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBVaW50OEFycmF5ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICBzdWJqZWN0IGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIFVpbnQ4QXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiBzdHIubGVuZ3RoIC8gMlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0dXJuIHN0ci5sZW5ndGhcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldHVybiBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0dXJuIF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0dXJuIF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXR1cm4gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0dXJuIF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIC8vIGNvcHkhXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7IGkrKylcbiAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuLy8gaHR0cDovL25vZGVqcy5vcmcvYXBpL2J1ZmZlci5odG1sI2J1ZmZlcl9idWZfc2xpY2Vfc3RhcnRfZW5kXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBhdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IHRoZSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbmZ1bmN0aW9uIGF1Z21lbnQgKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCxcbiAgICAgICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50KHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG4iLCJ2YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFpFUk8gICA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUylcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0gpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRtb2R1bGUuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSgpKVxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24oYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSxcbiAgICAgIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDEsXG4gICAgICBlTWF4ID0gKDEgPDwgZUxlbikgLSAxLFxuICAgICAgZUJpYXMgPSBlTWF4ID4+IDEsXG4gICAgICBuQml0cyA9IC03LFxuICAgICAgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwLFxuICAgICAgZCA9IGlzTEUgPyAtMSA6IDEsXG4gICAgICBzID0gYnVmZmVyW29mZnNldCArIGldO1xuXG4gIGkgKz0gZDtcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKTtcbiAgcyA+Pj0gKC1uQml0cyk7XG4gIG5CaXRzICs9IGVMZW47XG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpO1xuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBlID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gbUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzO1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSk7XG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKTtcbiAgICBlID0gZSAtIGVCaWFzO1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pO1xufTtcblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKSxcbiAgICAgIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKSxcbiAgICAgIGQgPSBpc0xFID8gMSA6IC0xLFxuICAgICAgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMDtcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKTtcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMDtcbiAgICBlID0gZU1heDtcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMik7XG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tO1xuICAgICAgYyAqPSAyO1xuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrKztcbiAgICAgIGMgLz0gMjtcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwO1xuICAgICAgZSA9IGVNYXg7XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IGUgKyBlQmlhcztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCk7XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbTtcbiAgZUxlbiArPSBtTGVuO1xuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpO1xuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyODtcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gYSBkdXBsZXggc3RyZWFtIGlzIGp1c3QgYSBzdHJlYW0gdGhhdCBpcyBib3RoIHJlYWRhYmxlIGFuZCB3cml0YWJsZS5cbi8vIFNpbmNlIEpTIGRvZXNuJ3QgaGF2ZSBtdWx0aXBsZSBwcm90b3R5cGFsIGluaGVyaXRhbmNlLCB0aGlzIGNsYXNzXG4vLyBwcm90b3R5cGFsbHkgaW5oZXJpdHMgZnJvbSBSZWFkYWJsZSwgYW5kIHRoZW4gcGFyYXNpdGljYWxseSBmcm9tXG4vLyBXcml0YWJsZS5cblxubW9kdWxlLmV4cG9ydHMgPSBEdXBsZXg7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIHNldEltbWVkaWF0ZSA9IHJlcXVpcmUoJ3Byb2Nlc3MvYnJvd3Nlci5qcycpLm5leHRUaWNrO1xudmFyIFJlYWRhYmxlID0gcmVxdWlyZSgnLi9yZWFkYWJsZS5qcycpO1xudmFyIFdyaXRhYmxlID0gcmVxdWlyZSgnLi93cml0YWJsZS5qcycpO1xuXG5pbmhlcml0cyhEdXBsZXgsIFJlYWRhYmxlKTtcblxuRHVwbGV4LnByb3RvdHlwZS53cml0ZSA9IFdyaXRhYmxlLnByb3RvdHlwZS53cml0ZTtcbkR1cGxleC5wcm90b3R5cGUuZW5kID0gV3JpdGFibGUucHJvdG90eXBlLmVuZDtcbkR1cGxleC5wcm90b3R5cGUuX3dyaXRlID0gV3JpdGFibGUucHJvdG90eXBlLl93cml0ZTtcblxuZnVuY3Rpb24gRHVwbGV4KG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIER1cGxleCkpXG4gICAgcmV0dXJuIG5ldyBEdXBsZXgob3B0aW9ucyk7XG5cbiAgUmVhZGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgV3JpdGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlYWRhYmxlID09PSBmYWxzZSlcbiAgICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy53cml0YWJsZSA9PT0gZmFsc2UpXG4gICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuXG4gIHRoaXMuYWxsb3dIYWxmT3BlbiA9IHRydWU7XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYWxsb3dIYWxmT3BlbiA9PT0gZmFsc2UpXG4gICAgdGhpcy5hbGxvd0hhbGZPcGVuID0gZmFsc2U7XG5cbiAgdGhpcy5vbmNlKCdlbmQnLCBvbmVuZCk7XG59XG5cbi8vIHRoZSBuby1oYWxmLW9wZW4gZW5mb3JjZXJcbmZ1bmN0aW9uIG9uZW5kKCkge1xuICAvLyBpZiB3ZSBhbGxvdyBoYWxmLW9wZW4gc3RhdGUsIG9yIGlmIHRoZSB3cml0YWJsZSBzaWRlIGVuZGVkLFxuICAvLyB0aGVuIHdlJ3JlIG9rLlxuICBpZiAodGhpcy5hbGxvd0hhbGZPcGVuIHx8IHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQpXG4gICAgcmV0dXJuO1xuXG4gIC8vIG5vIG1vcmUgZGF0YSBjYW4gYmUgd3JpdHRlbi5cbiAgLy8gQnV0IGFsbG93IG1vcmUgd3JpdGVzIHRvIGhhcHBlbiBpbiB0aGlzIHRpY2suXG4gIHZhciBzZWxmID0gdGhpcztcbiAgc2V0SW1tZWRpYXRlKGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLmVuZCgpO1xuICB9KTtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmVhbTtcblxudmFyIEVFID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuaW5oZXJpdHMoU3RyZWFtLCBFRSk7XG5TdHJlYW0uUmVhZGFibGUgPSByZXF1aXJlKCcuL3JlYWRhYmxlLmpzJyk7XG5TdHJlYW0uV3JpdGFibGUgPSByZXF1aXJlKCcuL3dyaXRhYmxlLmpzJyk7XG5TdHJlYW0uRHVwbGV4ID0gcmVxdWlyZSgnLi9kdXBsZXguanMnKTtcblN0cmVhbS5UcmFuc2Zvcm0gPSByZXF1aXJlKCcuL3RyYW5zZm9ybS5qcycpO1xuU3RyZWFtLlBhc3NUaHJvdWdoID0gcmVxdWlyZSgnLi9wYXNzdGhyb3VnaC5qcycpO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjQueFxuU3RyZWFtLlN0cmVhbSA9IFN0cmVhbTtcblxuXG5cbi8vIG9sZC1zdHlsZSBzdHJlYW1zLiAgTm90ZSB0aGF0IHRoZSBwaXBlIG1ldGhvZCAodGhlIG9ubHkgcmVsZXZhbnRcbi8vIHBhcnQgb2YgdGhpcyBjbGFzcykgaXMgb3ZlcnJpZGRlbiBpbiB0aGUgUmVhZGFibGUgY2xhc3MuXG5cbmZ1bmN0aW9uIFN0cmVhbSgpIHtcbiAgRUUuY2FsbCh0aGlzKTtcbn1cblxuU3RyZWFtLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24oZGVzdCwgb3B0aW9ucykge1xuICB2YXIgc291cmNlID0gdGhpcztcblxuICBmdW5jdGlvbiBvbmRhdGEoY2h1bmspIHtcbiAgICBpZiAoZGVzdC53cml0YWJsZSkge1xuICAgICAgaWYgKGZhbHNlID09PSBkZXN0LndyaXRlKGNodW5rKSAmJiBzb3VyY2UucGF1c2UpIHtcbiAgICAgICAgc291cmNlLnBhdXNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc291cmNlLm9uKCdkYXRhJywgb25kYXRhKTtcblxuICBmdW5jdGlvbiBvbmRyYWluKCkge1xuICAgIGlmIChzb3VyY2UucmVhZGFibGUgJiYgc291cmNlLnJlc3VtZSkge1xuICAgICAgc291cmNlLnJlc3VtZSgpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Qub24oJ2RyYWluJywgb25kcmFpbik7XG5cbiAgLy8gSWYgdGhlICdlbmQnIG9wdGlvbiBpcyBub3Qgc3VwcGxpZWQsIGRlc3QuZW5kKCkgd2lsbCBiZSBjYWxsZWQgd2hlblxuICAvLyBzb3VyY2UgZ2V0cyB0aGUgJ2VuZCcgb3IgJ2Nsb3NlJyBldmVudHMuICBPbmx5IGRlc3QuZW5kKCkgb25jZS5cbiAgaWYgKCFkZXN0Ll9pc1N0ZGlvICYmICghb3B0aW9ucyB8fCBvcHRpb25zLmVuZCAhPT0gZmFsc2UpKSB7XG4gICAgc291cmNlLm9uKCdlbmQnLCBvbmVuZCk7XG4gICAgc291cmNlLm9uKCdjbG9zZScsIG9uY2xvc2UpO1xuICB9XG5cbiAgdmFyIGRpZE9uRW5kID0gZmFsc2U7XG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGlmIChkaWRPbkVuZCkgcmV0dXJuO1xuICAgIGRpZE9uRW5kID0gdHJ1ZTtcblxuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIG9uY2xvc2UoKSB7XG4gICAgaWYgKGRpZE9uRW5kKSByZXR1cm47XG4gICAgZGlkT25FbmQgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBkZXN0LmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIGRlc3QuZGVzdHJveSgpO1xuICB9XG5cbiAgLy8gZG9uJ3QgbGVhdmUgZGFuZ2xpbmcgcGlwZXMgd2hlbiB0aGVyZSBhcmUgZXJyb3JzLlxuICBmdW5jdGlvbiBvbmVycm9yKGVyKSB7XG4gICAgY2xlYW51cCgpO1xuICAgIGlmIChFRS5saXN0ZW5lckNvdW50KHRoaXMsICdlcnJvcicpID09PSAwKSB7XG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkIHN0cmVhbSBlcnJvciBpbiBwaXBlLlxuICAgIH1cbiAgfVxuXG4gIHNvdXJjZS5vbignZXJyb3InLCBvbmVycm9yKTtcbiAgZGVzdC5vbignZXJyb3InLCBvbmVycm9yKTtcblxuICAvLyByZW1vdmUgYWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgdGhhdCB3ZXJlIGFkZGVkLlxuICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZGF0YScsIG9uZGF0YSk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZHJhaW4nLCBvbmRyYWluKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25lbmQpO1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbmNsb3NlKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBjbGVhbnVwKTtcbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsZWFudXApO1xuICB9XG5cbiAgc291cmNlLm9uKCdlbmQnLCBjbGVhbnVwKTtcbiAgc291cmNlLm9uKCdjbG9zZScsIGNsZWFudXApO1xuXG4gIGRlc3Qub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5lbWl0KCdwaXBlJywgc291cmNlKTtcblxuICAvLyBBbGxvdyBmb3IgdW5peC1saWtlIHVzYWdlOiBBLnBpcGUoQikucGlwZShDKVxuICByZXR1cm4gZGVzdDtcbn07XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gYSBwYXNzdGhyb3VnaCBzdHJlYW0uXG4vLyBiYXNpY2FsbHkganVzdCB0aGUgbW9zdCBtaW5pbWFsIHNvcnQgb2YgVHJhbnNmb3JtIHN0cmVhbS5cbi8vIEV2ZXJ5IHdyaXR0ZW4gY2h1bmsgZ2V0cyBvdXRwdXQgYXMtaXMuXG5cbm1vZHVsZS5leHBvcnRzID0gUGFzc1Rocm91Z2g7XG5cbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCcuL3RyYW5zZm9ybS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbmluaGVyaXRzKFBhc3NUaHJvdWdoLCBUcmFuc2Zvcm0pO1xuXG5mdW5jdGlvbiBQYXNzVGhyb3VnaChvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQYXNzVGhyb3VnaCkpXG4gICAgcmV0dXJuIG5ldyBQYXNzVGhyb3VnaChvcHRpb25zKTtcblxuICBUcmFuc2Zvcm0uY2FsbCh0aGlzLCBvcHRpb25zKTtcbn1cblxuUGFzc1Rocm91Z2gucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIGNiKG51bGwsIGNodW5rKTtcbn07XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3Mpey8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWRhYmxlO1xuUmVhZGFibGUuUmVhZGFibGVTdGF0ZSA9IFJlYWRhYmxlU3RhdGU7XG5cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBTdHJlYW0gPSByZXF1aXJlKCcuL2luZGV4LmpzJyk7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xudmFyIHNldEltbWVkaWF0ZSA9IHJlcXVpcmUoJ3Byb2Nlc3MvYnJvd3Nlci5qcycpLm5leHRUaWNrO1xudmFyIFN0cmluZ0RlY29kZXI7XG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5pbmhlcml0cyhSZWFkYWJsZSwgU3RyZWFtKTtcblxuZnVuY3Rpb24gUmVhZGFibGVTdGF0ZShvcHRpb25zLCBzdHJlYW0pIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy8gdGhlIHBvaW50IGF0IHdoaWNoIGl0IHN0b3BzIGNhbGxpbmcgX3JlYWQoKSB0byBmaWxsIHRoZSBidWZmZXJcbiAgLy8gTm90ZTogMCBpcyBhIHZhbGlkIHZhbHVlLCBtZWFucyBcImRvbid0IGNhbGwgX3JlYWQgcHJlZW1wdGl2ZWx5IGV2ZXJcIlxuICB2YXIgaHdtID0gb3B0aW9ucy5oaWdoV2F0ZXJNYXJrO1xuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSAoaHdtIHx8IGh3bSA9PT0gMCkgPyBod20gOiAxNiAqIDEwMjQ7XG5cbiAgLy8gY2FzdCB0byBpbnRzLlxuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSB+fnRoaXMuaGlnaFdhdGVyTWFyaztcblxuICB0aGlzLmJ1ZmZlciA9IFtdO1xuICB0aGlzLmxlbmd0aCA9IDA7XG4gIHRoaXMucGlwZXMgPSBudWxsO1xuICB0aGlzLnBpcGVzQ291bnQgPSAwO1xuICB0aGlzLmZsb3dpbmcgPSBmYWxzZTtcbiAgdGhpcy5lbmRlZCA9IGZhbHNlO1xuICB0aGlzLmVuZEVtaXR0ZWQgPSBmYWxzZTtcbiAgdGhpcy5yZWFkaW5nID0gZmFsc2U7XG5cbiAgLy8gSW4gc3RyZWFtcyB0aGF0IG5ldmVyIGhhdmUgYW55IGRhdGEsIGFuZCBkbyBwdXNoKG51bGwpIHJpZ2h0IGF3YXksXG4gIC8vIHRoZSBjb25zdW1lciBjYW4gbWlzcyB0aGUgJ2VuZCcgZXZlbnQgaWYgdGhleSBkbyBzb21lIEkvTyBiZWZvcmVcbiAgLy8gY29uc3VtaW5nIHRoZSBzdHJlYW0uICBTbywgd2UgZG9uJ3QgZW1pdCgnZW5kJykgdW50aWwgc29tZSByZWFkaW5nXG4gIC8vIGhhcHBlbnMuXG4gIHRoaXMuY2FsbGVkUmVhZCA9IGZhbHNlO1xuXG4gIC8vIGEgZmxhZyB0byBiZSBhYmxlIHRvIHRlbGwgaWYgdGhlIG9ud3JpdGUgY2IgaXMgY2FsbGVkIGltbWVkaWF0ZWx5LFxuICAvLyBvciBvbiBhIGxhdGVyIHRpY2suICBXZSBzZXQgdGhpcyB0byB0cnVlIGF0IGZpcnN0LCBiZWN1YXNlIGFueVxuICAvLyBhY3Rpb25zIHRoYXQgc2hvdWxkbid0IGhhcHBlbiB1bnRpbCBcImxhdGVyXCIgc2hvdWxkIGdlbmVyYWxseSBhbHNvXG4gIC8vIG5vdCBoYXBwZW4gYmVmb3JlIHRoZSBmaXJzdCB3cml0ZSBjYWxsLlxuICB0aGlzLnN5bmMgPSB0cnVlO1xuXG4gIC8vIHdoZW5ldmVyIHdlIHJldHVybiBudWxsLCB0aGVuIHdlIHNldCBhIGZsYWcgdG8gc2F5XG4gIC8vIHRoYXQgd2UncmUgYXdhaXRpbmcgYSAncmVhZGFibGUnIGV2ZW50IGVtaXNzaW9uLlxuICB0aGlzLm5lZWRSZWFkYWJsZSA9IGZhbHNlO1xuICB0aGlzLmVtaXR0ZWRSZWFkYWJsZSA9IGZhbHNlO1xuICB0aGlzLnJlYWRhYmxlTGlzdGVuaW5nID0gZmFsc2U7XG5cblxuICAvLyBvYmplY3Qgc3RyZWFtIGZsYWcuIFVzZWQgdG8gbWFrZSByZWFkKG4pIGlnbm9yZSBuIGFuZCB0b1xuICAvLyBtYWtlIGFsbCB0aGUgYnVmZmVyIG1lcmdpbmcgYW5kIGxlbmd0aCBjaGVja3MgZ28gYXdheVxuICB0aGlzLm9iamVjdE1vZGUgPSAhIW9wdGlvbnMub2JqZWN0TW9kZTtcblxuICAvLyBDcnlwdG8gaXMga2luZCBvZiBvbGQgYW5kIGNydXN0eS4gIEhpc3RvcmljYWxseSwgaXRzIGRlZmF1bHQgc3RyaW5nXG4gIC8vIGVuY29kaW5nIGlzICdiaW5hcnknIHNvIHdlIGhhdmUgdG8gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZS5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIGluIHRoZSB1bml2ZXJzZSB1c2VzICd1dGY4JywgdGhvdWdoLlxuICB0aGlzLmRlZmF1bHRFbmNvZGluZyA9IG9wdGlvbnMuZGVmYXVsdEVuY29kaW5nIHx8ICd1dGY4JztcblxuICAvLyB3aGVuIHBpcGluZywgd2Ugb25seSBjYXJlIGFib3V0ICdyZWFkYWJsZScgZXZlbnRzIHRoYXQgaGFwcGVuXG4gIC8vIGFmdGVyIHJlYWQoKWluZyBhbGwgdGhlIGJ5dGVzIGFuZCBub3QgZ2V0dGluZyBhbnkgcHVzaGJhY2suXG4gIHRoaXMucmFuT3V0ID0gZmFsc2U7XG5cbiAgLy8gdGhlIG51bWJlciBvZiB3cml0ZXJzIHRoYXQgYXJlIGF3YWl0aW5nIGEgZHJhaW4gZXZlbnQgaW4gLnBpcGUoKXNcbiAgdGhpcy5hd2FpdERyYWluID0gMDtcblxuICAvLyBpZiB0cnVlLCBhIG1heWJlUmVhZE1vcmUgaGFzIGJlZW4gc2NoZWR1bGVkXG4gIHRoaXMucmVhZGluZ01vcmUgPSBmYWxzZTtcblxuICB0aGlzLmRlY29kZXIgPSBudWxsO1xuICB0aGlzLmVuY29kaW5nID0gbnVsbDtcbiAgaWYgKG9wdGlvbnMuZW5jb2RpbmcpIHtcbiAgICBpZiAoIVN0cmluZ0RlY29kZXIpXG4gICAgICBTdHJpbmdEZWNvZGVyID0gcmVxdWlyZSgnc3RyaW5nX2RlY29kZXInKS5TdHJpbmdEZWNvZGVyO1xuICAgIHRoaXMuZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKG9wdGlvbnMuZW5jb2RpbmcpO1xuICAgIHRoaXMuZW5jb2RpbmcgPSBvcHRpb25zLmVuY29kaW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRhYmxlKSlcbiAgICByZXR1cm4gbmV3IFJlYWRhYmxlKG9wdGlvbnMpO1xuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUgPSBuZXcgUmVhZGFibGVTdGF0ZShvcHRpb25zLCB0aGlzKTtcblxuICAvLyBsZWdhY3lcbiAgdGhpcy5yZWFkYWJsZSA9IHRydWU7XG5cbiAgU3RyZWFtLmNhbGwodGhpcyk7XG59XG5cbi8vIE1hbnVhbGx5IHNob3ZlIHNvbWV0aGluZyBpbnRvIHRoZSByZWFkKCkgYnVmZmVyLlxuLy8gVGhpcyByZXR1cm5zIHRydWUgaWYgdGhlIGhpZ2hXYXRlck1hcmsgaGFzIG5vdCBiZWVuIGhpdCB5ZXQsXG4vLyBzaW1pbGFyIHRvIGhvdyBXcml0YWJsZS53cml0ZSgpIHJldHVybnMgdHJ1ZSBpZiB5b3Ugc2hvdWxkXG4vLyB3cml0ZSgpIHNvbWUgbW9yZS5cblJlYWRhYmxlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG5cbiAgaWYgKHR5cGVvZiBjaHVuayA9PT0gJ3N0cmluZycgJiYgIXN0YXRlLm9iamVjdE1vZGUpIHtcbiAgICBlbmNvZGluZyA9IGVuY29kaW5nIHx8IHN0YXRlLmRlZmF1bHRFbmNvZGluZztcbiAgICBpZiAoZW5jb2RpbmcgIT09IHN0YXRlLmVuY29kaW5nKSB7XG4gICAgICBjaHVuayA9IG5ldyBCdWZmZXIoY2h1bmssIGVuY29kaW5nKTtcbiAgICAgIGVuY29kaW5nID0gJyc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlYWRhYmxlQWRkQ2h1bmsodGhpcywgc3RhdGUsIGNodW5rLCBlbmNvZGluZywgZmFsc2UpO1xufTtcblxuLy8gVW5zaGlmdCBzaG91bGQgKmFsd2F5cyogYmUgc29tZXRoaW5nIGRpcmVjdGx5IG91dCBvZiByZWFkKClcblJlYWRhYmxlLnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oY2h1bmspIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgcmV0dXJuIHJlYWRhYmxlQWRkQ2h1bmsodGhpcywgc3RhdGUsIGNodW5rLCAnJywgdHJ1ZSk7XG59O1xuXG5mdW5jdGlvbiByZWFkYWJsZUFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBlbmNvZGluZywgYWRkVG9Gcm9udCkge1xuICB2YXIgZXIgPSBjaHVua0ludmFsaWQoc3RhdGUsIGNodW5rKTtcbiAgaWYgKGVyKSB7XG4gICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuICB9IGVsc2UgaWYgKGNodW5rID09PSBudWxsIHx8IGNodW5rID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgaWYgKCFzdGF0ZS5lbmRlZClcbiAgICAgIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSk7XG4gIH0gZWxzZSBpZiAoc3RhdGUub2JqZWN0TW9kZSB8fCBjaHVuayAmJiBjaHVuay5sZW5ndGggPiAwKSB7XG4gICAgaWYgKHN0YXRlLmVuZGVkICYmICFhZGRUb0Zyb250KSB7XG4gICAgICB2YXIgZSA9IG5ldyBFcnJvcignc3RyZWFtLnB1c2goKSBhZnRlciBFT0YnKTtcbiAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGUpO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUuZW5kRW1pdHRlZCAmJiBhZGRUb0Zyb250KSB7XG4gICAgICB2YXIgZSA9IG5ldyBFcnJvcignc3RyZWFtLnVuc2hpZnQoKSBhZnRlciBlbmQgZXZlbnQnKTtcbiAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhYWRkVG9Gcm9udCAmJiAhZW5jb2RpbmcpXG4gICAgICAgIGNodW5rID0gc3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7XG5cbiAgICAgIC8vIHVwZGF0ZSB0aGUgYnVmZmVyIGluZm8uXG4gICAgICBzdGF0ZS5sZW5ndGggKz0gc3RhdGUub2JqZWN0TW9kZSA/IDEgOiBjaHVuay5sZW5ndGg7XG4gICAgICBpZiAoYWRkVG9Gcm9udCkge1xuICAgICAgICBzdGF0ZS5idWZmZXIudW5zaGlmdChjaHVuayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLm5lZWRSZWFkYWJsZSlcbiAgICAgICAgZW1pdFJlYWRhYmxlKHN0cmVhbSk7XG5cbiAgICAgIG1heWJlUmVhZE1vcmUoc3RyZWFtLCBzdGF0ZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCFhZGRUb0Zyb250KSB7XG4gICAgc3RhdGUucmVhZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIG5lZWRNb3JlRGF0YShzdGF0ZSk7XG59XG5cblxuXG4vLyBpZiBpdCdzIHBhc3QgdGhlIGhpZ2ggd2F0ZXIgbWFyaywgd2UgY2FuIHB1c2ggaW4gc29tZSBtb3JlLlxuLy8gQWxzbywgaWYgd2UgaGF2ZSBubyBkYXRhIHlldCwgd2UgY2FuIHN0YW5kIHNvbWVcbi8vIG1vcmUgYnl0ZXMuICBUaGlzIGlzIHRvIHdvcmsgYXJvdW5kIGNhc2VzIHdoZXJlIGh3bT0wLFxuLy8gc3VjaCBhcyB0aGUgcmVwbC4gIEFsc28sIGlmIHRoZSBwdXNoKCkgdHJpZ2dlcmVkIGFcbi8vIHJlYWRhYmxlIGV2ZW50LCBhbmQgdGhlIHVzZXIgY2FsbGVkIHJlYWQobGFyZ2VOdW1iZXIpIHN1Y2ggdGhhdFxuLy8gbmVlZFJlYWRhYmxlIHdhcyBzZXQsIHRoZW4gd2Ugb3VnaHQgdG8gcHVzaCBtb3JlLCBzbyB0aGF0IGFub3RoZXJcbi8vICdyZWFkYWJsZScgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQuXG5mdW5jdGlvbiBuZWVkTW9yZURhdGEoc3RhdGUpIHtcbiAgcmV0dXJuICFzdGF0ZS5lbmRlZCAmJlxuICAgICAgICAgKHN0YXRlLm5lZWRSZWFkYWJsZSB8fFxuICAgICAgICAgIHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcmsgfHxcbiAgICAgICAgICBzdGF0ZS5sZW5ndGggPT09IDApO1xufVxuXG4vLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cblJlYWRhYmxlLnByb3RvdHlwZS5zZXRFbmNvZGluZyA9IGZ1bmN0aW9uKGVuYykge1xuICBpZiAoIVN0cmluZ0RlY29kZXIpXG4gICAgU3RyaW5nRGVjb2RlciA9IHJlcXVpcmUoJ3N0cmluZ19kZWNvZGVyJykuU3RyaW5nRGVjb2RlcjtcbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5kZWNvZGVyID0gbmV3IFN0cmluZ0RlY29kZXIoZW5jKTtcbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5lbmNvZGluZyA9IGVuYztcbn07XG5cbi8vIERvbid0IHJhaXNlIHRoZSBod20gPiAxMjhNQlxudmFyIE1BWF9IV00gPSAweDgwMDAwMDtcbmZ1bmN0aW9uIHJvdW5kVXBUb05leHRQb3dlck9mMihuKSB7XG4gIGlmIChuID49IE1BWF9IV00pIHtcbiAgICBuID0gTUFYX0hXTTtcbiAgfSBlbHNlIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgaGlnaGVzdCBwb3dlciBvZiAyXG4gICAgbi0tO1xuICAgIGZvciAodmFyIHAgPSAxOyBwIDwgMzI7IHAgPDw9IDEpIG4gfD0gbiA+PiBwO1xuICAgIG4rKztcbiAgfVxuICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gaG93TXVjaFRvUmVhZChuLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwICYmIHN0YXRlLmVuZGVkKVxuICAgIHJldHVybiAwO1xuXG4gIGlmIChzdGF0ZS5vYmplY3RNb2RlKVxuICAgIHJldHVybiBuID09PSAwID8gMCA6IDE7XG5cbiAgaWYgKGlzTmFOKG4pIHx8IG4gPT09IG51bGwpIHtcbiAgICAvLyBvbmx5IGZsb3cgb25lIGJ1ZmZlciBhdCBhIHRpbWVcbiAgICBpZiAoc3RhdGUuZmxvd2luZyAmJiBzdGF0ZS5idWZmZXIubGVuZ3RoKVxuICAgICAgcmV0dXJuIHN0YXRlLmJ1ZmZlclswXS5sZW5ndGg7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHN0YXRlLmxlbmd0aDtcbiAgfVxuXG4gIGlmIChuIDw9IDApXG4gICAgcmV0dXJuIDA7XG5cbiAgLy8gSWYgd2UncmUgYXNraW5nIGZvciBtb3JlIHRoYW4gdGhlIHRhcmdldCBidWZmZXIgbGV2ZWwsXG4gIC8vIHRoZW4gcmFpc2UgdGhlIHdhdGVyIG1hcmsuICBCdW1wIHVwIHRvIHRoZSBuZXh0IGhpZ2hlc3RcbiAgLy8gcG93ZXIgb2YgMiwgdG8gcHJldmVudCBpbmNyZWFzaW5nIGl0IGV4Y2Vzc2l2ZWx5IGluIHRpbnlcbiAgLy8gYW1vdW50cy5cbiAgaWYgKG4gPiBzdGF0ZS5oaWdoV2F0ZXJNYXJrKVxuICAgIHN0YXRlLmhpZ2hXYXRlck1hcmsgPSByb3VuZFVwVG9OZXh0UG93ZXJPZjIobik7XG5cbiAgLy8gZG9uJ3QgaGF2ZSB0aGF0IG11Y2guICByZXR1cm4gbnVsbCwgdW5sZXNzIHdlJ3ZlIGVuZGVkLlxuICBpZiAobiA+IHN0YXRlLmxlbmd0aCkge1xuICAgIGlmICghc3RhdGUuZW5kZWQpIHtcbiAgICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBzdGF0ZS5sZW5ndGg7XG4gIH1cblxuICByZXR1cm4gbjtcbn1cblxuLy8geW91IGNhbiBvdmVycmlkZSBlaXRoZXIgdGhpcyBtZXRob2QsIG9yIHRoZSBhc3luYyBfcmVhZChuKSBiZWxvdy5cblJlYWRhYmxlLnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24obikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICBzdGF0ZS5jYWxsZWRSZWFkID0gdHJ1ZTtcbiAgdmFyIG5PcmlnID0gbjtcblxuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPiAwKVxuICAgIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IGZhbHNlO1xuXG4gIC8vIGlmIHdlJ3JlIGRvaW5nIHJlYWQoMCkgdG8gdHJpZ2dlciBhIHJlYWRhYmxlIGV2ZW50LCBidXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGEgYnVuY2ggb2YgZGF0YSBpbiB0aGUgYnVmZmVyLCB0aGVuIGp1c3QgdHJpZ2dlclxuICAvLyB0aGUgJ3JlYWRhYmxlJyBldmVudCBhbmQgbW92ZSBvbi5cbiAgaWYgKG4gPT09IDAgJiZcbiAgICAgIHN0YXRlLm5lZWRSZWFkYWJsZSAmJlxuICAgICAgKHN0YXRlLmxlbmd0aCA+PSBzdGF0ZS5oaWdoV2F0ZXJNYXJrIHx8IHN0YXRlLmVuZGVkKSkge1xuICAgIGVtaXRSZWFkYWJsZSh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG4gPSBob3dNdWNoVG9SZWFkKG4sIHN0YXRlKTtcblxuICAvLyBpZiB3ZSd2ZSBlbmRlZCwgYW5kIHdlJ3JlIG5vdyBjbGVhciwgdGhlbiBmaW5pc2ggaXQgdXAuXG4gIGlmIChuID09PSAwICYmIHN0YXRlLmVuZGVkKSB7XG4gICAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMClcbiAgICAgIGVuZFJlYWRhYmxlKHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gQWxsIHRoZSBhY3R1YWwgY2h1bmsgZ2VuZXJhdGlvbiBsb2dpYyBuZWVkcyB0byBiZVxuICAvLyAqYmVsb3cqIHRoZSBjYWxsIHRvIF9yZWFkLiAgVGhlIHJlYXNvbiBpcyB0aGF0IGluIGNlcnRhaW5cbiAgLy8gc3ludGhldGljIHN0cmVhbSBjYXNlcywgc3VjaCBhcyBwYXNzdGhyb3VnaCBzdHJlYW1zLCBfcmVhZFxuICAvLyBtYXkgYmUgYSBjb21wbGV0ZWx5IHN5bmNocm9ub3VzIG9wZXJhdGlvbiB3aGljaCBtYXkgY2hhbmdlXG4gIC8vIHRoZSBzdGF0ZSBvZiB0aGUgcmVhZCBidWZmZXIsIHByb3ZpZGluZyBlbm91Z2ggZGF0YSB3aGVuXG4gIC8vIGJlZm9yZSB0aGVyZSB3YXMgKm5vdCogZW5vdWdoLlxuICAvL1xuICAvLyBTbywgdGhlIHN0ZXBzIGFyZTpcbiAgLy8gMS4gRmlndXJlIG91dCB3aGF0IHRoZSBzdGF0ZSBvZiB0aGluZ3Mgd2lsbCBiZSBhZnRlciB3ZSBkb1xuICAvLyBhIHJlYWQgZnJvbSB0aGUgYnVmZmVyLlxuICAvL1xuICAvLyAyLiBJZiB0aGF0IHJlc3VsdGluZyBzdGF0ZSB3aWxsIHRyaWdnZXIgYSBfcmVhZCwgdGhlbiBjYWxsIF9yZWFkLlxuICAvLyBOb3RlIHRoYXQgdGhpcyBtYXkgYmUgYXN5bmNocm9ub3VzLCBvciBzeW5jaHJvbm91cy4gIFllcywgaXQgaXNcbiAgLy8gZGVlcGx5IHVnbHkgdG8gd3JpdGUgQVBJcyB0aGlzIHdheSwgYnV0IHRoYXQgc3RpbGwgZG9lc24ndCBtZWFuXG4gIC8vIHRoYXQgdGhlIFJlYWRhYmxlIGNsYXNzIHNob3VsZCBiZWhhdmUgaW1wcm9wZXJseSwgYXMgc3RyZWFtcyBhcmVcbiAgLy8gZGVzaWduZWQgdG8gYmUgc3luYy9hc3luYyBhZ25vc3RpYy5cbiAgLy8gVGFrZSBub3RlIGlmIHRoZSBfcmVhZCBjYWxsIGlzIHN5bmMgb3IgYXN5bmMgKGllLCBpZiB0aGUgcmVhZCBjYWxsXG4gIC8vIGhhcyByZXR1cm5lZCB5ZXQpLCBzbyB0aGF0IHdlIGtub3cgd2hldGhlciBvciBub3QgaXQncyBzYWZlIHRvIGVtaXRcbiAgLy8gJ3JlYWRhYmxlJyBldGMuXG4gIC8vXG4gIC8vIDMuIEFjdHVhbGx5IHB1bGwgdGhlIHJlcXVlc3RlZCBjaHVua3Mgb3V0IG9mIHRoZSBidWZmZXIgYW5kIHJldHVybi5cblxuICAvLyBpZiB3ZSBuZWVkIGEgcmVhZGFibGUgZXZlbnQsIHRoZW4gd2UgbmVlZCB0byBkbyBzb21lIHJlYWRpbmcuXG4gIHZhciBkb1JlYWQgPSBzdGF0ZS5uZWVkUmVhZGFibGU7XG5cbiAgLy8gaWYgd2UgY3VycmVudGx5IGhhdmUgbGVzcyB0aGFuIHRoZSBoaWdoV2F0ZXJNYXJrLCB0aGVuIGFsc28gcmVhZCBzb21lXG4gIGlmIChzdGF0ZS5sZW5ndGggLSBuIDw9IHN0YXRlLmhpZ2hXYXRlck1hcmspXG4gICAgZG9SZWFkID0gdHJ1ZTtcblxuICAvLyBob3dldmVyLCBpZiB3ZSd2ZSBlbmRlZCwgdGhlbiB0aGVyZSdzIG5vIHBvaW50LCBhbmQgaWYgd2UncmUgYWxyZWFkeVxuICAvLyByZWFkaW5nLCB0aGVuIGl0J3MgdW5uZWNlc3NhcnkuXG4gIGlmIChzdGF0ZS5lbmRlZCB8fCBzdGF0ZS5yZWFkaW5nKVxuICAgIGRvUmVhZCA9IGZhbHNlO1xuXG4gIGlmIChkb1JlYWQpIHtcbiAgICBzdGF0ZS5yZWFkaW5nID0gdHJ1ZTtcbiAgICBzdGF0ZS5zeW5jID0gdHJ1ZTtcbiAgICAvLyBpZiB0aGUgbGVuZ3RoIGlzIGN1cnJlbnRseSB6ZXJvLCB0aGVuIHdlICpuZWVkKiBhIHJlYWRhYmxlIGV2ZW50LlxuICAgIGlmIChzdGF0ZS5sZW5ndGggPT09IDApXG4gICAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgIC8vIGNhbGwgaW50ZXJuYWwgcmVhZCBtZXRob2RcbiAgICB0aGlzLl9yZWFkKHN0YXRlLmhpZ2hXYXRlck1hcmspO1xuICAgIHN0YXRlLnN5bmMgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIElmIF9yZWFkIGNhbGxlZCBpdHMgY2FsbGJhY2sgc3luY2hyb25vdXNseSwgdGhlbiBgcmVhZGluZ2BcbiAgLy8gd2lsbCBiZSBmYWxzZSwgYW5kIHdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgaG93IG11Y2ggZGF0YSB3ZVxuICAvLyBjYW4gcmV0dXJuIHRvIHRoZSB1c2VyLlxuICBpZiAoZG9SZWFkICYmICFzdGF0ZS5yZWFkaW5nKVxuICAgIG4gPSBob3dNdWNoVG9SZWFkKG5PcmlnLCBzdGF0ZSk7XG5cbiAgdmFyIHJldDtcbiAgaWYgKG4gPiAwKVxuICAgIHJldCA9IGZyb21MaXN0KG4sIHN0YXRlKTtcbiAgZWxzZVxuICAgIHJldCA9IG51bGw7XG5cbiAgaWYgKHJldCA9PT0gbnVsbCkge1xuICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgbiA9IDA7XG4gIH1cblxuICBzdGF0ZS5sZW5ndGggLT0gbjtcblxuICAvLyBJZiB3ZSBoYXZlIG5vdGhpbmcgaW4gdGhlIGJ1ZmZlciwgdGhlbiB3ZSB3YW50IHRvIGtub3dcbiAgLy8gYXMgc29vbiBhcyB3ZSAqZG8qIGdldCBzb21ldGhpbmcgaW50byB0aGUgYnVmZmVyLlxuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwICYmICFzdGF0ZS5lbmRlZClcbiAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuXG4gIC8vIElmIHdlIGhhcHBlbmVkIHRvIHJlYWQoKSBleGFjdGx5IHRoZSByZW1haW5pbmcgYW1vdW50IGluIHRoZVxuICAvLyBidWZmZXIsIGFuZCB0aGUgRU9GIGhhcyBiZWVuIHNlZW4gYXQgdGhpcyBwb2ludCwgdGhlbiBtYWtlIHN1cmVcbiAgLy8gdGhhdCB3ZSBlbWl0ICdlbmQnIG9uIHRoZSB2ZXJ5IG5leHQgdGljay5cbiAgaWYgKHN0YXRlLmVuZGVkICYmICFzdGF0ZS5lbmRFbWl0dGVkICYmIHN0YXRlLmxlbmd0aCA9PT0gMClcbiAgICBlbmRSZWFkYWJsZSh0aGlzKTtcblxuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gY2h1bmtJbnZhbGlkKHN0YXRlLCBjaHVuaykge1xuICB2YXIgZXIgPSBudWxsO1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjaHVuaykgJiZcbiAgICAgICdzdHJpbmcnICE9PSB0eXBlb2YgY2h1bmsgJiZcbiAgICAgIGNodW5rICE9PSBudWxsICYmXG4gICAgICBjaHVuayAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAhc3RhdGUub2JqZWN0TW9kZSAmJlxuICAgICAgIWVyKSB7XG4gICAgZXIgPSBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG5vbi1zdHJpbmcvYnVmZmVyIGNodW5rJyk7XG4gIH1cbiAgcmV0dXJuIGVyO1xufVxuXG5cbmZ1bmN0aW9uIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhc3RhdGUuZW5kZWQpIHtcbiAgICB2YXIgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLmVuZCgpO1xuICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHtcbiAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgIHN0YXRlLmxlbmd0aCArPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuXG4gIC8vIGlmIHdlJ3ZlIGVuZGVkIGFuZCB3ZSBoYXZlIHNvbWUgZGF0YSBsZWZ0LCB0aGVuIGVtaXRcbiAgLy8gJ3JlYWRhYmxlJyBub3cgdG8gbWFrZSBzdXJlIGl0IGdldHMgcGlja2VkIHVwLlxuICBpZiAoc3RhdGUubGVuZ3RoID4gMClcbiAgICBlbWl0UmVhZGFibGUoc3RyZWFtKTtcbiAgZWxzZVxuICAgIGVuZFJlYWRhYmxlKHN0cmVhbSk7XG59XG5cbi8vIERvbid0IGVtaXQgcmVhZGFibGUgcmlnaHQgYXdheSBpbiBzeW5jIG1vZGUsIGJlY2F1c2UgdGhpcyBjYW4gdHJpZ2dlclxuLy8gYW5vdGhlciByZWFkKCkgY2FsbCA9PiBzdGFjayBvdmVyZmxvdy4gIFRoaXMgd2F5LCBpdCBtaWdodCB0cmlnZ2VyXG4vLyBhIG5leHRUaWNrIHJlY3Vyc2lvbiB3YXJuaW5nLCBidXQgdGhhdCdzIG5vdCBzbyBiYWQuXG5mdW5jdGlvbiBlbWl0UmVhZGFibGUoc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcbiAgc3RhdGUubmVlZFJlYWRhYmxlID0gZmFsc2U7XG4gIGlmIChzdGF0ZS5lbWl0dGVkUmVhZGFibGUpXG4gICAgcmV0dXJuO1xuXG4gIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IHRydWU7XG4gIGlmIChzdGF0ZS5zeW5jKVxuICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgIGVtaXRSZWFkYWJsZV8oc3RyZWFtKTtcbiAgICB9KTtcbiAgZWxzZVxuICAgIGVtaXRSZWFkYWJsZV8oc3RyZWFtKTtcbn1cblxuZnVuY3Rpb24gZW1pdFJlYWRhYmxlXyhzdHJlYW0pIHtcbiAgc3RyZWFtLmVtaXQoJ3JlYWRhYmxlJyk7XG59XG5cblxuLy8gYXQgdGhpcyBwb2ludCwgdGhlIHVzZXIgaGFzIHByZXN1bWFibHkgc2VlbiB0aGUgJ3JlYWRhYmxlJyBldmVudCxcbi8vIGFuZCBjYWxsZWQgcmVhZCgpIHRvIGNvbnN1bWUgc29tZSBkYXRhLiAgdGhhdCBtYXkgaGF2ZSB0cmlnZ2VyZWRcbi8vIGluIHR1cm4gYW5vdGhlciBfcmVhZChuKSBjYWxsLCBpbiB3aGljaCBjYXNlIHJlYWRpbmcgPSB0cnVlIGlmXG4vLyBpdCdzIGluIHByb2dyZXNzLlxuLy8gSG93ZXZlciwgaWYgd2UncmUgbm90IGVuZGVkLCBvciByZWFkaW5nLCBhbmQgdGhlIGxlbmd0aCA8IGh3bSxcbi8vIHRoZW4gZ28gYWhlYWQgYW5kIHRyeSB0byByZWFkIHNvbWUgbW9yZSBwcmVlbXB0aXZlbHkuXG5mdW5jdGlvbiBtYXliZVJlYWRNb3JlKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKCFzdGF0ZS5yZWFkaW5nTW9yZSkge1xuICAgIHN0YXRlLnJlYWRpbmdNb3JlID0gdHJ1ZTtcbiAgICBzZXRJbW1lZGlhdGUoZnVuY3Rpb24oKSB7XG4gICAgICBtYXliZVJlYWRNb3JlXyhzdHJlYW0sIHN0YXRlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXliZVJlYWRNb3JlXyhzdHJlYW0sIHN0YXRlKSB7XG4gIHZhciBsZW4gPSBzdGF0ZS5sZW5ndGg7XG4gIHdoaWxlICghc3RhdGUucmVhZGluZyAmJiAhc3RhdGUuZmxvd2luZyAmJiAhc3RhdGUuZW5kZWQgJiZcbiAgICAgICAgIHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcmspIHtcbiAgICBzdHJlYW0ucmVhZCgwKTtcbiAgICBpZiAobGVuID09PSBzdGF0ZS5sZW5ndGgpXG4gICAgICAvLyBkaWRuJ3QgZ2V0IGFueSBkYXRhLCBzdG9wIHNwaW5uaW5nLlxuICAgICAgYnJlYWs7XG4gICAgZWxzZVxuICAgICAgbGVuID0gc3RhdGUubGVuZ3RoO1xuICB9XG4gIHN0YXRlLnJlYWRpbmdNb3JlID0gZmFsc2U7XG59XG5cbi8vIGFic3RyYWN0IG1ldGhvZC4gIHRvIGJlIG92ZXJyaWRkZW4gaW4gc3BlY2lmaWMgaW1wbGVtZW50YXRpb24gY2xhc3Nlcy5cbi8vIGNhbGwgY2IoZXIsIGRhdGEpIHdoZXJlIGRhdGEgaXMgPD0gbiBpbiBsZW5ndGguXG4vLyBmb3IgdmlydHVhbCAobm9uLXN0cmluZywgbm9uLWJ1ZmZlcikgc3RyZWFtcywgXCJsZW5ndGhcIiBpcyBzb21ld2hhdFxuLy8gYXJiaXRyYXJ5LCBhbmQgcGVyaGFwcyBub3QgdmVyeSBtZWFuaW5nZnVsLlxuUmVhZGFibGUucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24obikge1xuICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKSk7XG59O1xuXG5SZWFkYWJsZS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uKGRlc3QsIHBpcGVPcHRzKSB7XG4gIHZhciBzcmMgPSB0aGlzO1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuXG4gIHN3aXRjaCAoc3RhdGUucGlwZXNDb3VudCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHN0YXRlLnBpcGVzID0gZGVzdDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMTpcbiAgICAgIHN0YXRlLnBpcGVzID0gW3N0YXRlLnBpcGVzLCBkZXN0XTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzdGF0ZS5waXBlcy5wdXNoKGRlc3QpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgc3RhdGUucGlwZXNDb3VudCArPSAxO1xuXG4gIHZhciBkb0VuZCA9ICghcGlwZU9wdHMgfHwgcGlwZU9wdHMuZW5kICE9PSBmYWxzZSkgJiZcbiAgICAgICAgICAgICAgZGVzdCAhPT0gcHJvY2Vzcy5zdGRvdXQgJiZcbiAgICAgICAgICAgICAgZGVzdCAhPT0gcHJvY2Vzcy5zdGRlcnI7XG5cbiAgdmFyIGVuZEZuID0gZG9FbmQgPyBvbmVuZCA6IGNsZWFudXA7XG4gIGlmIChzdGF0ZS5lbmRFbWl0dGVkKVxuICAgIHNldEltbWVkaWF0ZShlbmRGbik7XG4gIGVsc2VcbiAgICBzcmMub25jZSgnZW5kJywgZW5kRm4pO1xuXG4gIGRlc3Qub24oJ3VucGlwZScsIG9udW5waXBlKTtcbiAgZnVuY3Rpb24gb251bnBpcGUocmVhZGFibGUpIHtcbiAgICBpZiAocmVhZGFibGUgIT09IHNyYykgcmV0dXJuO1xuICAgIGNsZWFudXAoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuICAvLyB3aGVuIHRoZSBkZXN0IGRyYWlucywgaXQgcmVkdWNlcyB0aGUgYXdhaXREcmFpbiBjb3VudGVyXG4gIC8vIG9uIHRoZSBzb3VyY2UuICBUaGlzIHdvdWxkIGJlIG1vcmUgZWxlZ2FudCB3aXRoIGEgLm9uY2UoKVxuICAvLyBoYW5kbGVyIGluIGZsb3coKSwgYnV0IGFkZGluZyBhbmQgcmVtb3ZpbmcgcmVwZWF0ZWRseSBpc1xuICAvLyB0b28gc2xvdy5cbiAgdmFyIG9uZHJhaW4gPSBwaXBlT25EcmFpbihzcmMpO1xuICBkZXN0Lm9uKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgLy8gY2xlYW51cCBldmVudCBoYW5kbGVycyBvbmNlIHRoZSBwaXBlIGlzIGJyb2tlblxuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgb25maW5pc2gpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2RyYWluJywgb25kcmFpbik7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCd1bnBpcGUnLCBvbnVucGlwZSk7XG4gICAgc3JjLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBvbmVuZCk7XG4gICAgc3JjLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBjbGVhbnVwKTtcblxuICAgIC8vIGlmIHRoZSByZWFkZXIgaXMgd2FpdGluZyBmb3IgYSBkcmFpbiBldmVudCBmcm9tIHRoaXNcbiAgICAvLyBzcGVjaWZpYyB3cml0ZXIsIHRoZW4gaXQgd291bGQgY2F1c2UgaXQgdG8gbmV2ZXIgc3RhcnRcbiAgICAvLyBmbG93aW5nIGFnYWluLlxuICAgIC8vIFNvLCBpZiB0aGlzIGlzIGF3YWl0aW5nIGEgZHJhaW4sIHRoZW4gd2UganVzdCBjYWxsIGl0IG5vdy5cbiAgICAvLyBJZiB3ZSBkb24ndCBrbm93LCB0aGVuIGFzc3VtZSB0aGF0IHdlIGFyZSB3YWl0aW5nIGZvciBvbmUuXG4gICAgaWYgKCFkZXN0Ll93cml0YWJsZVN0YXRlIHx8IGRlc3QuX3dyaXRhYmxlU3RhdGUubmVlZERyYWluKVxuICAgICAgb25kcmFpbigpO1xuICB9XG5cbiAgLy8gaWYgdGhlIGRlc3QgaGFzIGFuIGVycm9yLCB0aGVuIHN0b3AgcGlwaW5nIGludG8gaXQuXG4gIC8vIGhvd2V2ZXIsIGRvbid0IHN1cHByZXNzIHRoZSB0aHJvd2luZyBiZWhhdmlvciBmb3IgdGhpcy5cbiAgLy8gY2hlY2sgZm9yIGxpc3RlbmVycyBiZWZvcmUgZW1pdCByZW1vdmVzIG9uZS10aW1lIGxpc3RlbmVycy5cbiAgdmFyIGVyckxpc3RlbmVycyA9IEVFLmxpc3RlbmVyQ291bnQoZGVzdCwgJ2Vycm9yJyk7XG4gIGZ1bmN0aW9uIG9uZXJyb3IoZXIpIHtcbiAgICB1bnBpcGUoKTtcbiAgICBpZiAoZXJyTGlzdGVuZXJzID09PSAwICYmIEVFLmxpc3RlbmVyQ291bnQoZGVzdCwgJ2Vycm9yJykgPT09IDApXG4gICAgICBkZXN0LmVtaXQoJ2Vycm9yJywgZXIpO1xuICB9XG4gIGRlc3Qub25jZSgnZXJyb3InLCBvbmVycm9yKTtcblxuICAvLyBCb3RoIGNsb3NlIGFuZCBmaW5pc2ggc2hvdWxkIHRyaWdnZXIgdW5waXBlLCBidXQgb25seSBvbmNlLlxuICBmdW5jdGlvbiBvbmNsb3NlKCkge1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICB1bnBpcGUoKTtcbiAgfVxuICBkZXN0Lm9uY2UoJ2Nsb3NlJywgb25jbG9zZSk7XG4gIGZ1bmN0aW9uIG9uZmluaXNoKCkge1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG4gICAgdW5waXBlKCk7XG4gIH1cbiAgZGVzdC5vbmNlKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG5cbiAgZnVuY3Rpb24gdW5waXBlKCkge1xuICAgIHNyYy51bnBpcGUoZGVzdCk7XG4gIH1cblxuICAvLyB0ZWxsIHRoZSBkZXN0IHRoYXQgaXQncyBiZWluZyBwaXBlZCB0b1xuICBkZXN0LmVtaXQoJ3BpcGUnLCBzcmMpO1xuXG4gIC8vIHN0YXJ0IHRoZSBmbG93IGlmIGl0IGhhc24ndCBiZWVuIHN0YXJ0ZWQgYWxyZWFkeS5cbiAgaWYgKCFzdGF0ZS5mbG93aW5nKSB7XG4gICAgLy8gdGhlIGhhbmRsZXIgdGhhdCB3YWl0cyBmb3IgcmVhZGFibGUgZXZlbnRzIGFmdGVyIGFsbFxuICAgIC8vIHRoZSBkYXRhIGdldHMgc3Vja2VkIG91dCBpbiBmbG93LlxuICAgIC8vIFRoaXMgd291bGQgYmUgZWFzaWVyIHRvIGZvbGxvdyB3aXRoIGEgLm9uY2UoKSBoYW5kbGVyXG4gICAgLy8gaW4gZmxvdygpLCBidXQgdGhhdCBpcyB0b28gc2xvdy5cbiAgICB0aGlzLm9uKCdyZWFkYWJsZScsIHBpcGVPblJlYWRhYmxlKTtcblxuICAgIHN0YXRlLmZsb3dpbmcgPSB0cnVlO1xuICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgIGZsb3coc3JjKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBkZXN0O1xufTtcblxuZnVuY3Rpb24gcGlwZU9uRHJhaW4oc3JjKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVzdCA9IHRoaXM7XG4gICAgdmFyIHN0YXRlID0gc3JjLl9yZWFkYWJsZVN0YXRlO1xuICAgIHN0YXRlLmF3YWl0RHJhaW4tLTtcbiAgICBpZiAoc3RhdGUuYXdhaXREcmFpbiA9PT0gMClcbiAgICAgIGZsb3coc3JjKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZmxvdyhzcmMpIHtcbiAgdmFyIHN0YXRlID0gc3JjLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgY2h1bms7XG4gIHN0YXRlLmF3YWl0RHJhaW4gPSAwO1xuXG4gIGZ1bmN0aW9uIHdyaXRlKGRlc3QsIGksIGxpc3QpIHtcbiAgICB2YXIgd3JpdHRlbiA9IGRlc3Qud3JpdGUoY2h1bmspO1xuICAgIGlmIChmYWxzZSA9PT0gd3JpdHRlbikge1xuICAgICAgc3RhdGUuYXdhaXREcmFpbisrO1xuICAgIH1cbiAgfVxuXG4gIHdoaWxlIChzdGF0ZS5waXBlc0NvdW50ICYmIG51bGwgIT09IChjaHVuayA9IHNyYy5yZWFkKCkpKSB7XG5cbiAgICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMSlcbiAgICAgIHdyaXRlKHN0YXRlLnBpcGVzLCAwLCBudWxsKTtcbiAgICBlbHNlXG4gICAgICBmb3JFYWNoKHN0YXRlLnBpcGVzLCB3cml0ZSk7XG5cbiAgICBzcmMuZW1pdCgnZGF0YScsIGNodW5rKTtcblxuICAgIC8vIGlmIGFueW9uZSBuZWVkcyBhIGRyYWluLCB0aGVuIHdlIGhhdmUgdG8gd2FpdCBmb3IgdGhhdC5cbiAgICBpZiAoc3RhdGUuYXdhaXREcmFpbiA+IDApXG4gICAgICByZXR1cm47XG4gIH1cblxuICAvLyBpZiBldmVyeSBkZXN0aW5hdGlvbiB3YXMgdW5waXBlZCwgZWl0aGVyIGJlZm9yZSBlbnRlcmluZyB0aGlzXG4gIC8vIGZ1bmN0aW9uLCBvciBpbiB0aGUgd2hpbGUgbG9vcCwgdGhlbiBzdG9wIGZsb3dpbmcuXG4gIC8vXG4gIC8vIE5COiBUaGlzIGlzIGEgcHJldHR5IHJhcmUgZWRnZSBjYXNlLlxuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMCkge1xuICAgIHN0YXRlLmZsb3dpbmcgPSBmYWxzZTtcblxuICAgIC8vIGlmIHRoZXJlIHdlcmUgZGF0YSBldmVudCBsaXN0ZW5lcnMgYWRkZWQsIHRoZW4gc3dpdGNoIHRvIG9sZCBtb2RlLlxuICAgIGlmIChFRS5saXN0ZW5lckNvdW50KHNyYywgJ2RhdGEnKSA+IDApXG4gICAgICBlbWl0RGF0YUV2ZW50cyhzcmMpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGF0IHRoaXMgcG9pbnQsIG5vIG9uZSBuZWVkZWQgYSBkcmFpbiwgc28gd2UganVzdCByYW4gb3V0IG9mIGRhdGFcbiAgLy8gb24gdGhlIG5leHQgcmVhZGFibGUgZXZlbnQsIHN0YXJ0IGl0IG92ZXIgYWdhaW4uXG4gIHN0YXRlLnJhbk91dCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIHBpcGVPblJlYWRhYmxlKCkge1xuICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZS5yYW5PdXQpIHtcbiAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLnJhbk91dCA9IGZhbHNlO1xuICAgIGZsb3codGhpcyk7XG4gIH1cbn1cblxuXG5SZWFkYWJsZS5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24oZGVzdCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuXG4gIC8vIGlmIHdlJ3JlIG5vdCBwaXBpbmcgYW55d2hlcmUsIHRoZW4gZG8gbm90aGluZy5cbiAgaWYgKHN0YXRlLnBpcGVzQ291bnQgPT09IDApXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8ganVzdCBvbmUgZGVzdGluYXRpb24uICBtb3N0IGNvbW1vbiBjYXNlLlxuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMSkge1xuICAgIC8vIHBhc3NlZCBpbiBvbmUsIGJ1dCBpdCdzIG5vdCB0aGUgcmlnaHQgb25lLlxuICAgIGlmIChkZXN0ICYmIGRlc3QgIT09IHN0YXRlLnBpcGVzKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAoIWRlc3QpXG4gICAgICBkZXN0ID0gc3RhdGUucGlwZXM7XG5cbiAgICAvLyBnb3QgYSBtYXRjaC5cbiAgICBzdGF0ZS5waXBlcyA9IG51bGw7XG4gICAgc3RhdGUucGlwZXNDb3VudCA9IDA7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigncmVhZGFibGUnLCBwaXBlT25SZWFkYWJsZSk7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuICAgIGlmIChkZXN0KVxuICAgICAgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNsb3cgY2FzZS4gbXVsdGlwbGUgcGlwZSBkZXN0aW5hdGlvbnMuXG5cbiAgaWYgKCFkZXN0KSB7XG4gICAgLy8gcmVtb3ZlIGFsbC5cbiAgICB2YXIgZGVzdHMgPSBzdGF0ZS5waXBlcztcbiAgICB2YXIgbGVuID0gc3RhdGUucGlwZXNDb3VudDtcbiAgICBzdGF0ZS5waXBlcyA9IG51bGw7XG4gICAgc3RhdGUucGlwZXNDb3VudCA9IDA7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigncmVhZGFibGUnLCBwaXBlT25SZWFkYWJsZSk7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGRlc3RzW2ldLmVtaXQoJ3VucGlwZScsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdHJ5IHRvIGZpbmQgdGhlIHJpZ2h0IG9uZS5cbiAgdmFyIGkgPSBpbmRleE9mKHN0YXRlLnBpcGVzLCBkZXN0KTtcbiAgaWYgKGkgPT09IC0xKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIHN0YXRlLnBpcGVzLnNwbGljZShpLCAxKTtcbiAgc3RhdGUucGlwZXNDb3VudCAtPSAxO1xuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMSlcbiAgICBzdGF0ZS5waXBlcyA9IHN0YXRlLnBpcGVzWzBdO1xuXG4gIGRlc3QuZW1pdCgndW5waXBlJywgdGhpcyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBzZXQgdXAgZGF0YSBldmVudHMgaWYgdGhleSBhcmUgYXNrZWQgZm9yXG4vLyBFbnN1cmUgcmVhZGFibGUgbGlzdGVuZXJzIGV2ZW50dWFsbHkgZ2V0IHNvbWV0aGluZ1xuUmVhZGFibGUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXYsIGZuKSB7XG4gIHZhciByZXMgPSBTdHJlYW0ucHJvdG90eXBlLm9uLmNhbGwodGhpcywgZXYsIGZuKTtcblxuICBpZiAoZXYgPT09ICdkYXRhJyAmJiAhdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nKVxuICAgIGVtaXREYXRhRXZlbnRzKHRoaXMpO1xuXG4gIGlmIChldiA9PT0gJ3JlYWRhYmxlJyAmJiB0aGlzLnJlYWRhYmxlKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgICBpZiAoIXN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nKSB7XG4gICAgICBzdGF0ZS5yZWFkYWJsZUxpc3RlbmluZyA9IHRydWU7XG4gICAgICBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcbiAgICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgICBpZiAoIXN0YXRlLnJlYWRpbmcpIHtcbiAgICAgICAgdGhpcy5yZWFkKDApO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5sZW5ndGgpIHtcbiAgICAgICAgZW1pdFJlYWRhYmxlKHRoaXMsIHN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzO1xufTtcblJlYWRhYmxlLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IFJlYWRhYmxlLnByb3RvdHlwZS5vbjtcblxuLy8gcGF1c2UoKSBhbmQgcmVzdW1lKCkgYXJlIHJlbW5hbnRzIG9mIHRoZSBsZWdhY3kgcmVhZGFibGUgc3RyZWFtIEFQSVxuLy8gSWYgdGhlIHVzZXIgdXNlcyB0aGVtLCB0aGVuIHN3aXRjaCBpbnRvIG9sZCBtb2RlLlxuUmVhZGFibGUucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uKCkge1xuICBlbWl0RGF0YUV2ZW50cyh0aGlzKTtcbiAgdGhpcy5yZWFkKDApO1xuICB0aGlzLmVtaXQoJ3Jlc3VtZScpO1xufTtcblxuUmVhZGFibGUucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKSB7XG4gIGVtaXREYXRhRXZlbnRzKHRoaXMsIHRydWUpO1xuICB0aGlzLmVtaXQoJ3BhdXNlJyk7XG59O1xuXG5mdW5jdGlvbiBlbWl0RGF0YUV2ZW50cyhzdHJlYW0sIHN0YXJ0UGF1c2VkKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcblxuICBpZiAoc3RhdGUuZmxvd2luZykge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pc2FhY3MvcmVhZGFibGUtc3RyZWFtL2lzc3Vlcy8xNlxuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHN3aXRjaCB0byBvbGQgbW9kZSBub3cuJyk7XG4gIH1cblxuICB2YXIgcGF1c2VkID0gc3RhcnRQYXVzZWQgfHwgZmFsc2U7XG4gIHZhciByZWFkYWJsZSA9IGZhbHNlO1xuXG4gIC8vIGNvbnZlcnQgdG8gYW4gb2xkLXN0eWxlIHN0cmVhbS5cbiAgc3RyZWFtLnJlYWRhYmxlID0gdHJ1ZTtcbiAgc3RyZWFtLnBpcGUgPSBTdHJlYW0ucHJvdG90eXBlLnBpcGU7XG4gIHN0cmVhbS5vbiA9IHN0cmVhbS5hZGRMaXN0ZW5lciA9IFN0cmVhbS5wcm90b3R5cGUub247XG5cbiAgc3RyZWFtLm9uKCdyZWFkYWJsZScsIGZ1bmN0aW9uKCkge1xuICAgIHJlYWRhYmxlID0gdHJ1ZTtcblxuICAgIHZhciBjO1xuICAgIHdoaWxlICghcGF1c2VkICYmIChudWxsICE9PSAoYyA9IHN0cmVhbS5yZWFkKCkpKSlcbiAgICAgIHN0cmVhbS5lbWl0KCdkYXRhJywgYyk7XG5cbiAgICBpZiAoYyA9PT0gbnVsbCkge1xuICAgICAgcmVhZGFibGUgPSBmYWxzZTtcbiAgICAgIHN0cmVhbS5fcmVhZGFibGVTdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgc3RyZWFtLnBhdXNlID0gZnVuY3Rpb24oKSB7XG4gICAgcGF1c2VkID0gdHJ1ZTtcbiAgICB0aGlzLmVtaXQoJ3BhdXNlJyk7XG4gIH07XG5cbiAgc3RyZWFtLnJlc3VtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgIGlmIChyZWFkYWJsZSlcbiAgICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgc3RyZWFtLmVtaXQoJ3JlYWRhYmxlJyk7XG4gICAgICB9KTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnJlYWQoMCk7XG4gICAgdGhpcy5lbWl0KCdyZXN1bWUnKTtcbiAgfTtcblxuICAvLyBub3cgbWFrZSBpdCBzdGFydCwganVzdCBpbiBjYXNlIGl0IGhhZG4ndCBhbHJlYWR5LlxuICBzdHJlYW0uZW1pdCgncmVhZGFibGUnKTtcbn1cblxuLy8gd3JhcCBhbiBvbGQtc3R5bGUgc3RyZWFtIGFzIHRoZSBhc3luYyBkYXRhIHNvdXJjZS5cbi8vIFRoaXMgaXMgKm5vdCogcGFydCBvZiB0aGUgcmVhZGFibGUgc3RyZWFtIGludGVyZmFjZS5cbi8vIEl0IGlzIGFuIHVnbHkgdW5mb3J0dW5hdGUgbWVzcyBvZiBoaXN0b3J5LlxuUmVhZGFibGUucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgdmFyIHBhdXNlZCA9IGZhbHNlO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhc3RhdGUuZW5kZWQpIHtcbiAgICAgIHZhciBjaHVuayA9IHN0YXRlLmRlY29kZXIuZW5kKCk7XG4gICAgICBpZiAoY2h1bmsgJiYgY2h1bmsubGVuZ3RoKVxuICAgICAgICBzZWxmLnB1c2goY2h1bmspO1xuICAgIH1cblxuICAgIHNlbGYucHVzaChudWxsKTtcbiAgfSk7XG5cbiAgc3RyZWFtLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICBpZiAoc3RhdGUuZGVjb2RlcilcbiAgICAgIGNodW5rID0gc3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7XG4gICAgaWYgKCFjaHVuayB8fCAhc3RhdGUub2JqZWN0TW9kZSAmJiAhY2h1bmsubGVuZ3RoKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdmFyIHJldCA9IHNlbGYucHVzaChjaHVuayk7XG4gICAgaWYgKCFyZXQpIHtcbiAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICBzdHJlYW0ucGF1c2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHByb3h5IGFsbCB0aGUgb3RoZXIgbWV0aG9kcy5cbiAgLy8gaW1wb3J0YW50IHdoZW4gd3JhcHBpbmcgZmlsdGVycyBhbmQgZHVwbGV4ZXMuXG4gIGZvciAodmFyIGkgaW4gc3RyZWFtKSB7XG4gICAgaWYgKHR5cGVvZiBzdHJlYW1baV0gPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgdHlwZW9mIHRoaXNbaV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzW2ldID0gZnVuY3Rpb24obWV0aG9kKSB7IHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHN0cmVhbVttZXRob2RdLmFwcGx5KHN0cmVhbSwgYXJndW1lbnRzKTtcbiAgICAgIH19KGkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHByb3h5IGNlcnRhaW4gaW1wb3J0YW50IGV2ZW50cy5cbiAgdmFyIGV2ZW50cyA9IFsnZXJyb3InLCAnY2xvc2UnLCAnZGVzdHJveScsICdwYXVzZScsICdyZXN1bWUnXTtcbiAgZm9yRWFjaChldmVudHMsIGZ1bmN0aW9uKGV2KSB7XG4gICAgc3RyZWFtLm9uKGV2LCBmdW5jdGlvbiAoeCkge1xuICAgICAgcmV0dXJuIHNlbGYuZW1pdC5hcHBseShzZWxmLCBldiwgeCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIHdoZW4gd2UgdHJ5IHRvIGNvbnN1bWUgc29tZSBtb3JlIGJ5dGVzLCBzaW1wbHkgdW5wYXVzZSB0aGVcbiAgLy8gdW5kZXJseWluZyBzdHJlYW0uXG4gIHNlbGYuX3JlYWQgPSBmdW5jdGlvbihuKSB7XG4gICAgaWYgKHBhdXNlZCkge1xuICAgICAgcGF1c2VkID0gZmFsc2U7XG4gICAgICBzdHJlYW0ucmVzdW1lKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBzZWxmO1xufTtcblxuXG5cbi8vIGV4cG9zZWQgZm9yIHRlc3RpbmcgcHVycG9zZXMgb25seS5cblJlYWRhYmxlLl9mcm9tTGlzdCA9IGZyb21MaXN0O1xuXG4vLyBQbHVjayBvZmYgbiBieXRlcyBmcm9tIGFuIGFycmF5IG9mIGJ1ZmZlcnMuXG4vLyBMZW5ndGggaXMgdGhlIGNvbWJpbmVkIGxlbmd0aHMgb2YgYWxsIHRoZSBidWZmZXJzIGluIHRoZSBsaXN0LlxuZnVuY3Rpb24gZnJvbUxpc3Qobiwgc3RhdGUpIHtcbiAgdmFyIGxpc3QgPSBzdGF0ZS5idWZmZXI7XG4gIHZhciBsZW5ndGggPSBzdGF0ZS5sZW5ndGg7XG4gIHZhciBzdHJpbmdNb2RlID0gISFzdGF0ZS5kZWNvZGVyO1xuICB2YXIgb2JqZWN0TW9kZSA9ICEhc3RhdGUub2JqZWN0TW9kZTtcbiAgdmFyIHJldDtcblxuICAvLyBub3RoaW5nIGluIHRoZSBsaXN0LCBkZWZpbml0ZWx5IGVtcHR5LlxuICBpZiAobGlzdC5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgaWYgKGxlbmd0aCA9PT0gMClcbiAgICByZXQgPSBudWxsO1xuICBlbHNlIGlmIChvYmplY3RNb2RlKVxuICAgIHJldCA9IGxpc3Quc2hpZnQoKTtcbiAgZWxzZSBpZiAoIW4gfHwgbiA+PSBsZW5ndGgpIHtcbiAgICAvLyByZWFkIGl0IGFsbCwgdHJ1bmNhdGUgdGhlIGFycmF5LlxuICAgIGlmIChzdHJpbmdNb2RlKVxuICAgICAgcmV0ID0gbGlzdC5qb2luKCcnKTtcbiAgICBlbHNlXG4gICAgICByZXQgPSBCdWZmZXIuY29uY2F0KGxpc3QsIGxlbmd0aCk7XG4gICAgbGlzdC5sZW5ndGggPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIHJlYWQganVzdCBzb21lIG9mIGl0LlxuICAgIGlmIChuIDwgbGlzdFswXS5sZW5ndGgpIHtcbiAgICAgIC8vIGp1c3QgdGFrZSBhIHBhcnQgb2YgdGhlIGZpcnN0IGxpc3QgaXRlbS5cbiAgICAgIC8vIHNsaWNlIGlzIHRoZSBzYW1lIGZvciBidWZmZXJzIGFuZCBzdHJpbmdzLlxuICAgICAgdmFyIGJ1ZiA9IGxpc3RbMF07XG4gICAgICByZXQgPSBidWYuc2xpY2UoMCwgbik7XG4gICAgICBsaXN0WzBdID0gYnVmLnNsaWNlKG4pO1xuICAgIH0gZWxzZSBpZiAobiA9PT0gbGlzdFswXS5sZW5ndGgpIHtcbiAgICAgIC8vIGZpcnN0IGxpc3QgaXMgYSBwZXJmZWN0IG1hdGNoXG4gICAgICByZXQgPSBsaXN0LnNoaWZ0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbXBsZXggY2FzZS5cbiAgICAgIC8vIHdlIGhhdmUgZW5vdWdoIHRvIGNvdmVyIGl0LCBidXQgaXQgc3BhbnMgcGFzdCB0aGUgZmlyc3QgYnVmZmVyLlxuICAgICAgaWYgKHN0cmluZ01vZGUpXG4gICAgICAgIHJldCA9ICcnO1xuICAgICAgZWxzZVxuICAgICAgICByZXQgPSBuZXcgQnVmZmVyKG4pO1xuXG4gICAgICB2YXIgYyA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbCAmJiBjIDwgbjsgaSsrKSB7XG4gICAgICAgIHZhciBidWYgPSBsaXN0WzBdO1xuICAgICAgICB2YXIgY3B5ID0gTWF0aC5taW4obiAtIGMsIGJ1Zi5sZW5ndGgpO1xuXG4gICAgICAgIGlmIChzdHJpbmdNb2RlKVxuICAgICAgICAgIHJldCArPSBidWYuc2xpY2UoMCwgY3B5KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGJ1Zi5jb3B5KHJldCwgYywgMCwgY3B5KTtcblxuICAgICAgICBpZiAoY3B5IDwgYnVmLmxlbmd0aClcbiAgICAgICAgICBsaXN0WzBdID0gYnVmLnNsaWNlKGNweSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG5cbiAgICAgICAgYyArPSBjcHk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gZW5kUmVhZGFibGUoc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcblxuICAvLyBJZiB3ZSBnZXQgaGVyZSBiZWZvcmUgY29uc3VtaW5nIGFsbCB0aGUgYnl0ZXMsIHRoZW4gdGhhdCBpcyBhXG4gIC8vIGJ1ZyBpbiBub2RlLiAgU2hvdWxkIG5ldmVyIGhhcHBlbi5cbiAgaWYgKHN0YXRlLmxlbmd0aCA+IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdlbmRSZWFkYWJsZSBjYWxsZWQgb24gbm9uLWVtcHR5IHN0cmVhbScpO1xuXG4gIGlmICghc3RhdGUuZW5kRW1pdHRlZCAmJiBzdGF0ZS5jYWxsZWRSZWFkKSB7XG4gICAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgIC8vIENoZWNrIHRoYXQgd2UgZGlkbid0IGdldCBvbmUgbGFzdCB1bnNoaWZ0LlxuICAgICAgaWYgKCFzdGF0ZS5lbmRFbWl0dGVkICYmIHN0YXRlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzdGF0ZS5lbmRFbWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc3RyZWFtLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgICAgIHN0cmVhbS5lbWl0KCdlbmQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoICh4cywgZikge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHhzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGYoeHNbaV0sIGkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluZGV4T2YgKHhzLCB4KSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKHhzW2ldID09PSB4KSByZXR1cm4gaTtcbiAgfVxuICByZXR1cm4gLTE7XG59XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiKSkiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gYSB0cmFuc2Zvcm0gc3RyZWFtIGlzIGEgcmVhZGFibGUvd3JpdGFibGUgc3RyZWFtIHdoZXJlIHlvdSBkb1xuLy8gc29tZXRoaW5nIHdpdGggdGhlIGRhdGEuICBTb21ldGltZXMgaXQncyBjYWxsZWQgYSBcImZpbHRlclwiLFxuLy8gYnV0IHRoYXQncyBub3QgYSBncmVhdCBuYW1lIGZvciBpdCwgc2luY2UgdGhhdCBpbXBsaWVzIGEgdGhpbmcgd2hlcmVcbi8vIHNvbWUgYml0cyBwYXNzIHRocm91Z2gsIGFuZCBvdGhlcnMgYXJlIHNpbXBseSBpZ25vcmVkLiAgKFRoYXQgd291bGRcbi8vIGJlIGEgdmFsaWQgZXhhbXBsZSBvZiBhIHRyYW5zZm9ybSwgb2YgY291cnNlLilcbi8vXG4vLyBXaGlsZSB0aGUgb3V0cHV0IGlzIGNhdXNhbGx5IHJlbGF0ZWQgdG8gdGhlIGlucHV0LCBpdCdzIG5vdCBhXG4vLyBuZWNlc3NhcmlseSBzeW1tZXRyaWMgb3Igc3luY2hyb25vdXMgdHJhbnNmb3JtYXRpb24uICBGb3IgZXhhbXBsZSxcbi8vIGEgemxpYiBzdHJlYW0gbWlnaHQgdGFrZSBtdWx0aXBsZSBwbGFpbi10ZXh0IHdyaXRlcygpLCBhbmQgdGhlblxuLy8gZW1pdCBhIHNpbmdsZSBjb21wcmVzc2VkIGNodW5rIHNvbWUgdGltZSBpbiB0aGUgZnV0dXJlLlxuLy9cbi8vIEhlcmUncyBob3cgdGhpcyB3b3Jrczpcbi8vXG4vLyBUaGUgVHJhbnNmb3JtIHN0cmVhbSBoYXMgYWxsIHRoZSBhc3BlY3RzIG9mIHRoZSByZWFkYWJsZSBhbmQgd3JpdGFibGVcbi8vIHN0cmVhbSBjbGFzc2VzLiAgV2hlbiB5b3Ugd3JpdGUoY2h1bmspLCB0aGF0IGNhbGxzIF93cml0ZShjaHVuayxjYilcbi8vIGludGVybmFsbHksIGFuZCByZXR1cm5zIGZhbHNlIGlmIHRoZXJlJ3MgYSBsb3Qgb2YgcGVuZGluZyB3cml0ZXNcbi8vIGJ1ZmZlcmVkIHVwLiAgV2hlbiB5b3UgY2FsbCByZWFkKCksIHRoYXQgY2FsbHMgX3JlYWQobikgdW50aWxcbi8vIHRoZXJlJ3MgZW5vdWdoIHBlbmRpbmcgcmVhZGFibGUgZGF0YSBidWZmZXJlZCB1cC5cbi8vXG4vLyBJbiBhIHRyYW5zZm9ybSBzdHJlYW0sIHRoZSB3cml0dGVuIGRhdGEgaXMgcGxhY2VkIGluIGEgYnVmZmVyLiAgV2hlblxuLy8gX3JlYWQobikgaXMgY2FsbGVkLCBpdCB0cmFuc2Zvcm1zIHRoZSBxdWV1ZWQgdXAgZGF0YSwgY2FsbGluZyB0aGVcbi8vIGJ1ZmZlcmVkIF93cml0ZSBjYidzIGFzIGl0IGNvbnN1bWVzIGNodW5rcy4gIElmIGNvbnN1bWluZyBhIHNpbmdsZVxuLy8gd3JpdHRlbiBjaHVuayB3b3VsZCByZXN1bHQgaW4gbXVsdGlwbGUgb3V0cHV0IGNodW5rcywgdGhlbiB0aGUgZmlyc3Rcbi8vIG91dHB1dHRlZCBiaXQgY2FsbHMgdGhlIHJlYWRjYiwgYW5kIHN1YnNlcXVlbnQgY2h1bmtzIGp1c3QgZ28gaW50b1xuLy8gdGhlIHJlYWQgYnVmZmVyLCBhbmQgd2lsbCBjYXVzZSBpdCB0byBlbWl0ICdyZWFkYWJsZScgaWYgbmVjZXNzYXJ5LlxuLy9cbi8vIFRoaXMgd2F5LCBiYWNrLXByZXNzdXJlIGlzIGFjdHVhbGx5IGRldGVybWluZWQgYnkgdGhlIHJlYWRpbmcgc2lkZSxcbi8vIHNpbmNlIF9yZWFkIGhhcyB0byBiZSBjYWxsZWQgdG8gc3RhcnQgcHJvY2Vzc2luZyBhIG5ldyBjaHVuay4gIEhvd2V2ZXIsXG4vLyBhIHBhdGhvbG9naWNhbCBpbmZsYXRlIHR5cGUgb2YgdHJhbnNmb3JtIGNhbiBjYXVzZSBleGNlc3NpdmUgYnVmZmVyaW5nXG4vLyBoZXJlLiAgRm9yIGV4YW1wbGUsIGltYWdpbmUgYSBzdHJlYW0gd2hlcmUgZXZlcnkgYnl0ZSBvZiBpbnB1dCBpc1xuLy8gaW50ZXJwcmV0ZWQgYXMgYW4gaW50ZWdlciBmcm9tIDAtMjU1LCBhbmQgdGhlbiByZXN1bHRzIGluIHRoYXQgbWFueVxuLy8gYnl0ZXMgb2Ygb3V0cHV0LiAgV3JpdGluZyB0aGUgNCBieXRlcyB7ZmYsZmYsZmYsZmZ9IHdvdWxkIHJlc3VsdCBpblxuLy8gMWtiIG9mIGRhdGEgYmVpbmcgb3V0cHV0LiAgSW4gdGhpcyBjYXNlLCB5b3UgY291bGQgd3JpdGUgYSB2ZXJ5IHNtYWxsXG4vLyBhbW91bnQgb2YgaW5wdXQsIGFuZCBlbmQgdXAgd2l0aCBhIHZlcnkgbGFyZ2UgYW1vdW50IG9mIG91dHB1dC4gIEluXG4vLyBzdWNoIGEgcGF0aG9sb2dpY2FsIGluZmxhdGluZyBtZWNoYW5pc20sIHRoZXJlJ2QgYmUgbm8gd2F5IHRvIHRlbGxcbi8vIHRoZSBzeXN0ZW0gdG8gc3RvcCBkb2luZyB0aGUgdHJhbnNmb3JtLiAgQSBzaW5nbGUgNE1CIHdyaXRlIGNvdWxkXG4vLyBjYXVzZSB0aGUgc3lzdGVtIHRvIHJ1biBvdXQgb2YgbWVtb3J5LlxuLy9cbi8vIEhvd2V2ZXIsIGV2ZW4gaW4gc3VjaCBhIHBhdGhvbG9naWNhbCBjYXNlLCBvbmx5IGEgc2luZ2xlIHdyaXR0ZW4gY2h1bmtcbi8vIHdvdWxkIGJlIGNvbnN1bWVkLCBhbmQgdGhlbiB0aGUgcmVzdCB3b3VsZCB3YWl0ICh1bi10cmFuc2Zvcm1lZCkgdW50aWxcbi8vIHRoZSByZXN1bHRzIG9mIHRoZSBwcmV2aW91cyB0cmFuc2Zvcm1lZCBjaHVuayB3ZXJlIGNvbnN1bWVkLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zZm9ybTtcblxudmFyIER1cGxleCA9IHJlcXVpcmUoJy4vZHVwbGV4LmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuaW5oZXJpdHMoVHJhbnNmb3JtLCBEdXBsZXgpO1xuXG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0YXRlKG9wdGlvbnMsIHN0cmVhbSkge1xuICB0aGlzLmFmdGVyVHJhbnNmb3JtID0gZnVuY3Rpb24oZXIsIGRhdGEpIHtcbiAgICByZXR1cm4gYWZ0ZXJUcmFuc2Zvcm0oc3RyZWFtLCBlciwgZGF0YSk7XG4gIH07XG5cbiAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gIHRoaXMudHJhbnNmb3JtaW5nID0gZmFsc2U7XG4gIHRoaXMud3JpdGVjYiA9IG51bGw7XG4gIHRoaXMud3JpdGVjaHVuayA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIGFmdGVyVHJhbnNmb3JtKHN0cmVhbSwgZXIsIGRhdGEpIHtcbiAgdmFyIHRzID0gc3RyZWFtLl90cmFuc2Zvcm1TdGF0ZTtcbiAgdHMudHJhbnNmb3JtaW5nID0gZmFsc2U7XG5cbiAgdmFyIGNiID0gdHMud3JpdGVjYjtcblxuICBpZiAoIWNiKVxuICAgIHJldHVybiBzdHJlYW0uZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ25vIHdyaXRlY2IgaW4gVHJhbnNmb3JtIGNsYXNzJykpO1xuXG4gIHRzLndyaXRlY2h1bmsgPSBudWxsO1xuICB0cy53cml0ZWNiID0gbnVsbDtcblxuICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSB1bmRlZmluZWQpXG4gICAgc3RyZWFtLnB1c2goZGF0YSk7XG5cbiAgaWYgKGNiKVxuICAgIGNiKGVyKTtcblxuICB2YXIgcnMgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIHJzLnJlYWRpbmcgPSBmYWxzZTtcbiAgaWYgKHJzLm5lZWRSZWFkYWJsZSB8fCBycy5sZW5ndGggPCBycy5oaWdoV2F0ZXJNYXJrKSB7XG4gICAgc3RyZWFtLl9yZWFkKHJzLmhpZ2hXYXRlck1hcmspO1xuICB9XG59XG5cblxuZnVuY3Rpb24gVHJhbnNmb3JtKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFRyYW5zZm9ybSkpXG4gICAgcmV0dXJuIG5ldyBUcmFuc2Zvcm0ob3B0aW9ucyk7XG5cbiAgRHVwbGV4LmNhbGwodGhpcywgb3B0aW9ucyk7XG5cbiAgdmFyIHRzID0gdGhpcy5fdHJhbnNmb3JtU3RhdGUgPSBuZXcgVHJhbnNmb3JtU3RhdGUob3B0aW9ucywgdGhpcyk7XG5cbiAgLy8gd2hlbiB0aGUgd3JpdGFibGUgc2lkZSBmaW5pc2hlcywgdGhlbiBmbHVzaCBvdXQgYW55dGhpbmcgcmVtYWluaW5nLlxuICB2YXIgc3RyZWFtID0gdGhpcztcblxuICAvLyBzdGFydCBvdXQgYXNraW5nIGZvciBhIHJlYWRhYmxlIGV2ZW50IG9uY2UgZGF0YSBpcyB0cmFuc2Zvcm1lZC5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuXG4gIC8vIHdlIGhhdmUgaW1wbGVtZW50ZWQgdGhlIF9yZWFkIG1ldGhvZCwgYW5kIGRvbmUgdGhlIG90aGVyIHRoaW5nc1xuICAvLyB0aGF0IFJlYWRhYmxlIHdhbnRzIGJlZm9yZSB0aGUgZmlyc3QgX3JlYWQgY2FsbCwgc28gdW5zZXQgdGhlXG4gIC8vIHN5bmMgZ3VhcmQgZmxhZy5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5zeW5jID0gZmFsc2U7XG5cbiAgdGhpcy5vbmNlKCdmaW5pc2gnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHRoaXMuX2ZsdXNoKVxuICAgICAgdGhpcy5fZmx1c2goZnVuY3Rpb24oZXIpIHtcbiAgICAgICAgZG9uZShzdHJlYW0sIGVyKTtcbiAgICAgIH0pO1xuICAgIGVsc2VcbiAgICAgIGRvbmUoc3RyZWFtKTtcbiAgfSk7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZykge1xuICB0aGlzLl90cmFuc2Zvcm1TdGF0ZS5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gIHJldHVybiBEdXBsZXgucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCBjaHVuaywgZW5jb2RpbmcpO1xufTtcblxuLy8gVGhpcyBpcyB0aGUgcGFydCB3aGVyZSB5b3UgZG8gc3R1ZmYhXG4vLyBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uIGluIGltcGxlbWVudGF0aW9uIGNsYXNzZXMuXG4vLyAnY2h1bmsnIGlzIGFuIGlucHV0IGNodW5rLlxuLy9cbi8vIENhbGwgYHB1c2gobmV3Q2h1bmspYCB0byBwYXNzIGFsb25nIHRyYW5zZm9ybWVkIG91dHB1dFxuLy8gdG8gdGhlIHJlYWRhYmxlIHNpZGUuICBZb3UgbWF5IGNhbGwgJ3B1c2gnIHplcm8gb3IgbW9yZSB0aW1lcy5cbi8vXG4vLyBDYWxsIGBjYihlcnIpYCB3aGVuIHlvdSBhcmUgZG9uZSB3aXRoIHRoaXMgY2h1bmsuICBJZiB5b3UgcGFzc1xuLy8gYW4gZXJyb3IsIHRoZW4gdGhhdCdsbCBwdXQgdGhlIGh1cnQgb24gdGhlIHdob2xlIG9wZXJhdGlvbi4gIElmIHlvdVxuLy8gbmV2ZXIgY2FsbCBjYigpLCB0aGVuIHlvdSdsbCBuZXZlciBnZXQgYW5vdGhlciBjaHVuay5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3RyYW5zZm9ybSA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcbn07XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgdHMgPSB0aGlzLl90cmFuc2Zvcm1TdGF0ZTtcbiAgdHMud3JpdGVjYiA9IGNiO1xuICB0cy53cml0ZWNodW5rID0gY2h1bms7XG4gIHRzLndyaXRlZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgaWYgKCF0cy50cmFuc2Zvcm1pbmcpIHtcbiAgICB2YXIgcnMgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICAgIGlmICh0cy5uZWVkVHJhbnNmb3JtIHx8XG4gICAgICAgIHJzLm5lZWRSZWFkYWJsZSB8fFxuICAgICAgICBycy5sZW5ndGggPCBycy5oaWdoV2F0ZXJNYXJrKVxuICAgICAgdGhpcy5fcmVhZChycy5oaWdoV2F0ZXJNYXJrKTtcbiAgfVxufTtcblxuLy8gRG9lc24ndCBtYXR0ZXIgd2hhdCB0aGUgYXJncyBhcmUgaGVyZS5cbi8vIF90cmFuc2Zvcm0gZG9lcyBhbGwgdGhlIHdvcmsuXG4vLyBUaGF0IHdlIGdvdCBoZXJlIG1lYW5zIHRoYXQgdGhlIHJlYWRhYmxlIHNpZGUgd2FudHMgbW9yZSBkYXRhLlxuVHJhbnNmb3JtLnByb3RvdHlwZS5fcmVhZCA9IGZ1bmN0aW9uKG4pIHtcbiAgdmFyIHRzID0gdGhpcy5fdHJhbnNmb3JtU3RhdGU7XG5cbiAgaWYgKHRzLndyaXRlY2h1bmsgJiYgdHMud3JpdGVjYiAmJiAhdHMudHJhbnNmb3JtaW5nKSB7XG4gICAgdHMudHJhbnNmb3JtaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl90cmFuc2Zvcm0odHMud3JpdGVjaHVuaywgdHMud3JpdGVlbmNvZGluZywgdHMuYWZ0ZXJUcmFuc2Zvcm0pO1xuICB9IGVsc2Uge1xuICAgIC8vIG1hcmsgdGhhdCB3ZSBuZWVkIGEgdHJhbnNmb3JtLCBzbyB0aGF0IGFueSBkYXRhIHRoYXQgY29tZXMgaW5cbiAgICAvLyB3aWxsIGdldCBwcm9jZXNzZWQsIG5vdyB0aGF0IHdlJ3ZlIGFza2VkIGZvciBpdC5cbiAgICB0cy5uZWVkVHJhbnNmb3JtID0gdHJ1ZTtcbiAgfVxufTtcblxuXG5mdW5jdGlvbiBkb25lKHN0cmVhbSwgZXIpIHtcbiAgaWYgKGVyKVxuICAgIHJldHVybiBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG5cbiAgLy8gaWYgdGhlcmUncyBub3RoaW5nIGluIHRoZSB3cml0ZSBidWZmZXIsIHRoZW4gdGhhdCBtZWFuc1xuICAvLyB0aGF0IG5vdGhpbmcgbW9yZSB3aWxsIGV2ZXIgYmUgcHJvdmlkZWRcbiAgdmFyIHdzID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICB2YXIgcnMgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIHZhciB0cyA9IHN0cmVhbS5fdHJhbnNmb3JtU3RhdGU7XG5cbiAgaWYgKHdzLmxlbmd0aClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbGxpbmcgdHJhbnNmb3JtIGRvbmUgd2hlbiB3cy5sZW5ndGggIT0gMCcpO1xuXG4gIGlmICh0cy50cmFuc2Zvcm1pbmcpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsaW5nIHRyYW5zZm9ybSBkb25lIHdoZW4gc3RpbGwgdHJhbnNmb3JtaW5nJyk7XG5cbiAgcmV0dXJuIHN0cmVhbS5wdXNoKG51bGwpO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIEEgYml0IHNpbXBsZXIgdGhhbiByZWFkYWJsZSBzdHJlYW1zLlxuLy8gSW1wbGVtZW50IGFuIGFzeW5jIC5fd3JpdGUoY2h1bmssIGNiKSwgYW5kIGl0J2xsIGhhbmRsZSBhbGxcbi8vIHRoZSBkcmFpbiBldmVudCBlbWlzc2lvbiBhbmQgYnVmZmVyaW5nLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFdyaXRhYmxlO1xuV3JpdGFibGUuV3JpdGFibGVTdGF0ZSA9IFdyaXRhYmxlU3RhdGU7XG5cbnZhciBpc1VpbnQ4QXJyYXkgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCdcbiAgPyBmdW5jdGlvbiAoeCkgeyByZXR1cm4geCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgfVxuICA6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggJiYgeC5jb25zdHJ1Y3RvciAmJiB4LmNvbnN0cnVjdG9yLm5hbWUgPT09ICdVaW50OEFycmF5J1xuICB9XG47XG52YXIgaXNBcnJheUJ1ZmZlciA9IHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCdcbiAgPyBmdW5jdGlvbiAoeCkgeyByZXR1cm4geCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIH1cbiAgOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ICYmIHguY29uc3RydWN0b3IgJiYgeC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXJyYXlCdWZmZXInXG4gIH1cbjtcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBTdHJlYW0gPSByZXF1aXJlKCcuL2luZGV4LmpzJyk7XG52YXIgc2V0SW1tZWRpYXRlID0gcmVxdWlyZSgncHJvY2Vzcy9icm93c2VyLmpzJykubmV4dFRpY2s7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuQnVmZmVyO1xuXG5pbmhlcml0cyhXcml0YWJsZSwgU3RyZWFtKTtcblxuZnVuY3Rpb24gV3JpdGVSZXEoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB0aGlzLmNodW5rID0gY2h1bms7XG4gIHRoaXMuZW5jb2RpbmcgPSBlbmNvZGluZztcbiAgdGhpcy5jYWxsYmFjayA9IGNiO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0YXRlKG9wdGlvbnMsIHN0cmVhbSkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyB0aGUgcG9pbnQgYXQgd2hpY2ggd3JpdGUoKSBzdGFydHMgcmV0dXJuaW5nIGZhbHNlXG4gIC8vIE5vdGU6IDAgaXMgYSB2YWxpZCB2YWx1ZSwgbWVhbnMgdGhhdCB3ZSBhbHdheXMgcmV0dXJuIGZhbHNlIGlmXG4gIC8vIHRoZSBlbnRpcmUgYnVmZmVyIGlzIG5vdCBmbHVzaGVkIGltbWVkaWF0ZWx5IG9uIHdyaXRlKClcbiAgdmFyIGh3bSA9IG9wdGlvbnMuaGlnaFdhdGVyTWFyaztcbiAgdGhpcy5oaWdoV2F0ZXJNYXJrID0gKGh3bSB8fCBod20gPT09IDApID8gaHdtIDogMTYgKiAxMDI0O1xuXG4gIC8vIG9iamVjdCBzdHJlYW0gZmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIG9yIG5vdCB0aGlzIHN0cmVhbVxuICAvLyBjb250YWlucyBidWZmZXJzIG9yIG9iamVjdHMuXG4gIHRoaXMub2JqZWN0TW9kZSA9ICEhb3B0aW9ucy5vYmplY3RNb2RlO1xuXG4gIC8vIGNhc3QgdG8gaW50cy5cbiAgdGhpcy5oaWdoV2F0ZXJNYXJrID0gfn50aGlzLmhpZ2hXYXRlck1hcms7XG5cbiAgdGhpcy5uZWVkRHJhaW4gPSBmYWxzZTtcbiAgLy8gYXQgdGhlIHN0YXJ0IG9mIGNhbGxpbmcgZW5kKClcbiAgdGhpcy5lbmRpbmcgPSBmYWxzZTtcbiAgLy8gd2hlbiBlbmQoKSBoYXMgYmVlbiBjYWxsZWQsIGFuZCByZXR1cm5lZFxuICB0aGlzLmVuZGVkID0gZmFsc2U7XG4gIC8vIHdoZW4gJ2ZpbmlzaCcgaXMgZW1pdHRlZFxuICB0aGlzLmZpbmlzaGVkID0gZmFsc2U7XG5cbiAgLy8gc2hvdWxkIHdlIGRlY29kZSBzdHJpbmdzIGludG8gYnVmZmVycyBiZWZvcmUgcGFzc2luZyB0byBfd3JpdGU/XG4gIC8vIHRoaXMgaXMgaGVyZSBzbyB0aGF0IHNvbWUgbm9kZS1jb3JlIHN0cmVhbXMgY2FuIG9wdGltaXplIHN0cmluZ1xuICAvLyBoYW5kbGluZyBhdCBhIGxvd2VyIGxldmVsLlxuICB2YXIgbm9EZWNvZGUgPSBvcHRpb25zLmRlY29kZVN0cmluZ3MgPT09IGZhbHNlO1xuICB0aGlzLmRlY29kZVN0cmluZ3MgPSAhbm9EZWNvZGU7XG5cbiAgLy8gQ3J5cHRvIGlzIGtpbmQgb2Ygb2xkIGFuZCBjcnVzdHkuICBIaXN0b3JpY2FsbHksIGl0cyBkZWZhdWx0IHN0cmluZ1xuICAvLyBlbmNvZGluZyBpcyAnYmluYXJ5JyBzbyB3ZSBoYXZlIHRvIG1ha2UgdGhpcyBjb25maWd1cmFibGUuXG4gIC8vIEV2ZXJ5dGhpbmcgZWxzZSBpbiB0aGUgdW5pdmVyc2UgdXNlcyAndXRmOCcsIHRob3VnaC5cbiAgdGhpcy5kZWZhdWx0RW5jb2RpbmcgPSBvcHRpb25zLmRlZmF1bHRFbmNvZGluZyB8fCAndXRmOCc7XG5cbiAgLy8gbm90IGFuIGFjdHVhbCBidWZmZXIgd2Uga2VlcCB0cmFjayBvZiwgYnV0IGEgbWVhc3VyZW1lbnRcbiAgLy8gb2YgaG93IG11Y2ggd2UncmUgd2FpdGluZyB0byBnZXQgcHVzaGVkIHRvIHNvbWUgdW5kZXJseWluZ1xuICAvLyBzb2NrZXQgb3IgZmlsZS5cbiAgdGhpcy5sZW5ndGggPSAwO1xuXG4gIC8vIGEgZmxhZyB0byBzZWUgd2hlbiB3ZSdyZSBpbiB0aGUgbWlkZGxlIG9mIGEgd3JpdGUuXG4gIHRoaXMud3JpdGluZyA9IGZhbHNlO1xuXG4gIC8vIGEgZmxhZyB0byBiZSBhYmxlIHRvIHRlbGwgaWYgdGhlIG9ud3JpdGUgY2IgaXMgY2FsbGVkIGltbWVkaWF0ZWx5LFxuICAvLyBvciBvbiBhIGxhdGVyIHRpY2suICBXZSBzZXQgdGhpcyB0byB0cnVlIGF0IGZpcnN0LCBiZWN1YXNlIGFueVxuICAvLyBhY3Rpb25zIHRoYXQgc2hvdWxkbid0IGhhcHBlbiB1bnRpbCBcImxhdGVyXCIgc2hvdWxkIGdlbmVyYWxseSBhbHNvXG4gIC8vIG5vdCBoYXBwZW4gYmVmb3JlIHRoZSBmaXJzdCB3cml0ZSBjYWxsLlxuICB0aGlzLnN5bmMgPSB0cnVlO1xuXG4gIC8vIGEgZmxhZyB0byBrbm93IGlmIHdlJ3JlIHByb2Nlc3NpbmcgcHJldmlvdXNseSBidWZmZXJlZCBpdGVtcywgd2hpY2hcbiAgLy8gbWF5IGNhbGwgdGhlIF93cml0ZSgpIGNhbGxiYWNrIGluIHRoZSBzYW1lIHRpY2ssIHNvIHRoYXQgd2UgZG9uJ3RcbiAgLy8gZW5kIHVwIGluIGFuIG92ZXJsYXBwZWQgb253cml0ZSBzaXR1YXRpb24uXG4gIHRoaXMuYnVmZmVyUHJvY2Vzc2luZyA9IGZhbHNlO1xuXG4gIC8vIHRoZSBjYWxsYmFjayB0aGF0J3MgcGFzc2VkIHRvIF93cml0ZShjaHVuayxjYilcbiAgdGhpcy5vbndyaXRlID0gZnVuY3Rpb24oZXIpIHtcbiAgICBvbndyaXRlKHN0cmVhbSwgZXIpO1xuICB9O1xuXG4gIC8vIHRoZSBjYWxsYmFjayB0aGF0IHRoZSB1c2VyIHN1cHBsaWVzIHRvIHdyaXRlKGNodW5rLGVuY29kaW5nLGNiKVxuICB0aGlzLndyaXRlY2IgPSBudWxsO1xuXG4gIC8vIHRoZSBhbW91bnQgdGhhdCBpcyBiZWluZyB3cml0dGVuIHdoZW4gX3dyaXRlIGlzIGNhbGxlZC5cbiAgdGhpcy53cml0ZWxlbiA9IDA7XG5cbiAgdGhpcy5idWZmZXIgPSBbXTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGUob3B0aW9ucykge1xuICAvLyBXcml0YWJsZSBjdG9yIGlzIGFwcGxpZWQgdG8gRHVwbGV4ZXMsIHRob3VnaCB0aGV5J3JlIG5vdFxuICAvLyBpbnN0YW5jZW9mIFdyaXRhYmxlLCB0aGV5J3JlIGluc3RhbmNlb2YgUmVhZGFibGUuXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBXcml0YWJsZSkgJiYgISh0aGlzIGluc3RhbmNlb2YgU3RyZWFtLkR1cGxleCkpXG4gICAgcmV0dXJuIG5ldyBXcml0YWJsZShvcHRpb25zKTtcblxuICB0aGlzLl93cml0YWJsZVN0YXRlID0gbmV3IFdyaXRhYmxlU3RhdGUob3B0aW9ucywgdGhpcyk7XG5cbiAgLy8gbGVnYWN5LlxuICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcblxuICBTdHJlYW0uY2FsbCh0aGlzKTtcbn1cblxuLy8gT3RoZXJ3aXNlIHBlb3BsZSBjYW4gcGlwZSBXcml0YWJsZSBzdHJlYW1zLCB3aGljaCBpcyBqdXN0IHdyb25nLlxuV3JpdGFibGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignQ2Fubm90IHBpcGUuIE5vdCByZWFkYWJsZS4nKSk7XG59O1xuXG5cbmZ1bmN0aW9uIHdyaXRlQWZ0ZXJFbmQoc3RyZWFtLCBzdGF0ZSwgY2IpIHtcbiAgdmFyIGVyID0gbmV3IEVycm9yKCd3cml0ZSBhZnRlciBlbmQnKTtcbiAgLy8gVE9ETzogZGVmZXIgZXJyb3IgZXZlbnRzIGNvbnNpc3RlbnRseSBldmVyeXdoZXJlLCBub3QganVzdCB0aGUgY2JcbiAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuICBzZXRJbW1lZGlhdGUoZnVuY3Rpb24oKSB7XG4gICAgY2IoZXIpO1xuICB9KTtcbn1cblxuLy8gSWYgd2UgZ2V0IHNvbWV0aGluZyB0aGF0IGlzIG5vdCBhIGJ1ZmZlciwgc3RyaW5nLCBudWxsLCBvciB1bmRlZmluZWQsXG4vLyBhbmQgd2UncmUgbm90IGluIG9iamVjdE1vZGUsIHRoZW4gdGhhdCdzIGFuIGVycm9yLlxuLy8gT3RoZXJ3aXNlIHN0cmVhbSBjaHVua3MgYXJlIGFsbCBjb25zaWRlcmVkIHRvIGJlIG9mIGxlbmd0aD0xLCBhbmQgdGhlXG4vLyB3YXRlcm1hcmtzIGRldGVybWluZSBob3cgbWFueSBvYmplY3RzIHRvIGtlZXAgaW4gdGhlIGJ1ZmZlciwgcmF0aGVyIHRoYW5cbi8vIGhvdyBtYW55IGJ5dGVzIG9yIGNoYXJhY3RlcnMuXG5mdW5jdGlvbiB2YWxpZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBjYikge1xuICB2YXIgdmFsaWQgPSB0cnVlO1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjaHVuaykgJiZcbiAgICAgICdzdHJpbmcnICE9PSB0eXBlb2YgY2h1bmsgJiZcbiAgICAgIGNodW5rICE9PSBudWxsICYmXG4gICAgICBjaHVuayAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAhc3RhdGUub2JqZWN0TW9kZSkge1xuICAgIHZhciBlciA9IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmsnKTtcbiAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG4gICAgc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgY2IoZXIpO1xuICAgIH0pO1xuICAgIHZhbGlkID0gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHZhbGlkO1xufVxuXG5Xcml0YWJsZS5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG4gIHZhciByZXQgPSBmYWxzZTtcblxuICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjaHVuaykgJiYgaXNVaW50OEFycmF5KGNodW5rKSlcbiAgICBjaHVuayA9IG5ldyBCdWZmZXIoY2h1bmspO1xuICBpZiAoaXNBcnJheUJ1ZmZlcihjaHVuaykgJiYgdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgIGNodW5rID0gbmV3IEJ1ZmZlcihuZXcgVWludDhBcnJheShjaHVuaykpO1xuICBcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihjaHVuaykpXG4gICAgZW5jb2RpbmcgPSAnYnVmZmVyJztcbiAgZWxzZSBpZiAoIWVuY29kaW5nKVxuICAgIGVuY29kaW5nID0gc3RhdGUuZGVmYXVsdEVuY29kaW5nO1xuXG4gIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpXG4gICAgY2IgPSBmdW5jdGlvbigpIHt9O1xuXG4gIGlmIChzdGF0ZS5lbmRlZClcbiAgICB3cml0ZUFmdGVyRW5kKHRoaXMsIHN0YXRlLCBjYik7XG4gIGVsc2UgaWYgKHZhbGlkQ2h1bmsodGhpcywgc3RhdGUsIGNodW5rLCBjYikpXG4gICAgcmV0ID0gd3JpdGVPckJ1ZmZlcih0aGlzLCBzdGF0ZSwgY2h1bmssIGVuY29kaW5nLCBjYik7XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGRlY29kZUNodW5rKHN0YXRlLCBjaHVuaywgZW5jb2RpbmcpIHtcbiAgaWYgKCFzdGF0ZS5vYmplY3RNb2RlICYmXG4gICAgICBzdGF0ZS5kZWNvZGVTdHJpbmdzICE9PSBmYWxzZSAmJlxuICAgICAgdHlwZW9mIGNodW5rID09PSAnc3RyaW5nJykge1xuICAgIGNodW5rID0gbmV3IEJ1ZmZlcihjaHVuaywgZW5jb2RpbmcpO1xuICB9XG4gIHJldHVybiBjaHVuaztcbn1cblxuLy8gaWYgd2UncmUgYWxyZWFkeSB3cml0aW5nIHNvbWV0aGluZywgdGhlbiBqdXN0IHB1dCB0aGlzXG4vLyBpbiB0aGUgcXVldWUsIGFuZCB3YWl0IG91ciB0dXJuLiAgT3RoZXJ3aXNlLCBjYWxsIF93cml0ZVxuLy8gSWYgd2UgcmV0dXJuIGZhbHNlLCB0aGVuIHdlIG5lZWQgYSBkcmFpbiBldmVudCwgc28gc2V0IHRoYXQgZmxhZy5cbmZ1bmN0aW9uIHdyaXRlT3JCdWZmZXIoc3RyZWFtLCBzdGF0ZSwgY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjaHVuayA9IGRlY29kZUNodW5rKHN0YXRlLCBjaHVuaywgZW5jb2RpbmcpO1xuICB2YXIgbGVuID0gc3RhdGUub2JqZWN0TW9kZSA/IDEgOiBjaHVuay5sZW5ndGg7XG5cbiAgc3RhdGUubGVuZ3RoICs9IGxlbjtcblxuICB2YXIgcmV0ID0gc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyaztcbiAgc3RhdGUubmVlZERyYWluID0gIXJldDtcblxuICBpZiAoc3RhdGUud3JpdGluZylcbiAgICBzdGF0ZS5idWZmZXIucHVzaChuZXcgV3JpdGVSZXEoY2h1bmssIGVuY29kaW5nLCBjYikpO1xuICBlbHNlXG4gICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCBsZW4sIGNodW5rLCBlbmNvZGluZywgY2IpO1xuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHN0YXRlLndyaXRlbGVuID0gbGVuO1xuICBzdGF0ZS53cml0ZWNiID0gY2I7XG4gIHN0YXRlLndyaXRpbmcgPSB0cnVlO1xuICBzdGF0ZS5zeW5jID0gdHJ1ZTtcbiAgc3RyZWFtLl93cml0ZShjaHVuaywgZW5jb2RpbmcsIHN0YXRlLm9ud3JpdGUpO1xuICBzdGF0ZS5zeW5jID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG9ud3JpdGVFcnJvcihzdHJlYW0sIHN0YXRlLCBzeW5jLCBlciwgY2IpIHtcbiAgaWYgKHN5bmMpXG4gICAgc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgY2IoZXIpO1xuICAgIH0pO1xuICBlbHNlXG4gICAgY2IoZXIpO1xuXG4gIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbn1cblxuZnVuY3Rpb24gb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKSB7XG4gIHN0YXRlLndyaXRpbmcgPSBmYWxzZTtcbiAgc3RhdGUud3JpdGVjYiA9IG51bGw7XG4gIHN0YXRlLmxlbmd0aCAtPSBzdGF0ZS53cml0ZWxlbjtcbiAgc3RhdGUud3JpdGVsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBvbndyaXRlKHN0cmVhbSwgZXIpIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICB2YXIgc3luYyA9IHN0YXRlLnN5bmM7XG4gIHZhciBjYiA9IHN0YXRlLndyaXRlY2I7XG5cbiAgb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKTtcblxuICBpZiAoZXIpXG4gICAgb253cml0ZUVycm9yKHN0cmVhbSwgc3RhdGUsIHN5bmMsIGVyLCBjYik7XG4gIGVsc2Uge1xuICAgIC8vIENoZWNrIGlmIHdlJ3JlIGFjdHVhbGx5IHJlYWR5IHRvIGZpbmlzaCwgYnV0IGRvbid0IGVtaXQgeWV0XG4gICAgdmFyIGZpbmlzaGVkID0gbmVlZEZpbmlzaChzdHJlYW0sIHN0YXRlKTtcblxuICAgIGlmICghZmluaXNoZWQgJiYgIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgJiYgc3RhdGUuYnVmZmVyLmxlbmd0aClcbiAgICAgIGNsZWFyQnVmZmVyKHN0cmVhbSwgc3RhdGUpO1xuXG4gICAgaWYgKHN5bmMpIHtcbiAgICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgYWZ0ZXJXcml0ZShzdHJlYW0sIHN0YXRlLCBmaW5pc2hlZCwgY2IpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYWZ0ZXJXcml0ZShzdHJlYW0sIHN0YXRlLCBmaW5pc2hlZCwgY2IpIHtcbiAgaWYgKCFmaW5pc2hlZClcbiAgICBvbndyaXRlRHJhaW4oc3RyZWFtLCBzdGF0ZSk7XG4gIGNiKCk7XG4gIGlmIChmaW5pc2hlZClcbiAgICBmaW5pc2hNYXliZShzdHJlYW0sIHN0YXRlKTtcbn1cblxuLy8gTXVzdCBmb3JjZSBjYWxsYmFjayB0byBiZSBjYWxsZWQgb24gbmV4dFRpY2ssIHNvIHRoYXQgd2UgZG9uJ3Rcbi8vIGVtaXQgJ2RyYWluJyBiZWZvcmUgdGhlIHdyaXRlKCkgY29uc3VtZXIgZ2V0cyB0aGUgJ2ZhbHNlJyByZXR1cm5cbi8vIHZhbHVlLCBhbmQgaGFzIGEgY2hhbmNlIHRvIGF0dGFjaCBhICdkcmFpbicgbGlzdGVuZXIuXG5mdW5jdGlvbiBvbndyaXRlRHJhaW4oc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwICYmIHN0YXRlLm5lZWREcmFpbikge1xuICAgIHN0YXRlLm5lZWREcmFpbiA9IGZhbHNlO1xuICAgIHN0cmVhbS5lbWl0KCdkcmFpbicpO1xuICB9XG59XG5cblxuLy8gaWYgdGhlcmUncyBzb21ldGhpbmcgaW4gdGhlIGJ1ZmZlciB3YWl0aW5nLCB0aGVuIHByb2Nlc3MgaXRcbmZ1bmN0aW9uIGNsZWFyQnVmZmVyKHN0cmVhbSwgc3RhdGUpIHtcbiAgc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyA9IHRydWU7XG5cbiAgZm9yICh2YXIgYyA9IDA7IGMgPCBzdGF0ZS5idWZmZXIubGVuZ3RoOyBjKyspIHtcbiAgICB2YXIgZW50cnkgPSBzdGF0ZS5idWZmZXJbY107XG4gICAgdmFyIGNodW5rID0gZW50cnkuY2h1bms7XG4gICAgdmFyIGVuY29kaW5nID0gZW50cnkuZW5jb2Rpbmc7XG4gICAgdmFyIGNiID0gZW50cnkuY2FsbGJhY2s7XG4gICAgdmFyIGxlbiA9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuXG4gICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCBsZW4sIGNodW5rLCBlbmNvZGluZywgY2IpO1xuXG4gICAgLy8gaWYgd2UgZGlkbid0IGNhbGwgdGhlIG9ud3JpdGUgaW1tZWRpYXRlbHksIHRoZW5cbiAgICAvLyBpdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gd2FpdCB1bnRpbCBpdCBkb2VzLlxuICAgIC8vIGFsc28sIHRoYXQgbWVhbnMgdGhhdCB0aGUgY2h1bmsgYW5kIGNiIGFyZSBjdXJyZW50bHlcbiAgICAvLyBiZWluZyBwcm9jZXNzZWQsIHNvIG1vdmUgdGhlIGJ1ZmZlciBjb3VudGVyIHBhc3QgdGhlbS5cbiAgICBpZiAoc3RhdGUud3JpdGluZykge1xuICAgICAgYysrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyA9IGZhbHNlO1xuICBpZiAoYyA8IHN0YXRlLmJ1ZmZlci5sZW5ndGgpXG4gICAgc3RhdGUuYnVmZmVyID0gc3RhdGUuYnVmZmVyLnNsaWNlKGMpO1xuICBlbHNlXG4gICAgc3RhdGUuYnVmZmVyLmxlbmd0aCA9IDA7XG59XG5cbldyaXRhYmxlLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIGNiKG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJykpO1xufTtcblxuV3JpdGFibGUucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcblxuICBpZiAodHlwZW9mIGNodW5rID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBjaHVuaztcbiAgICBjaHVuayA9IG51bGw7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjaHVuayAhPT0gJ3VuZGVmaW5lZCcgJiYgY2h1bmsgIT09IG51bGwpXG4gICAgdGhpcy53cml0ZShjaHVuaywgZW5jb2RpbmcpO1xuXG4gIC8vIGlnbm9yZSB1bm5lY2Vzc2FyeSBlbmQoKSBjYWxscy5cbiAgaWYgKCFzdGF0ZS5lbmRpbmcgJiYgIXN0YXRlLmZpbmlzaGVkKVxuICAgIGVuZFdyaXRhYmxlKHRoaXMsIHN0YXRlLCBjYik7XG59O1xuXG5cbmZ1bmN0aW9uIG5lZWRGaW5pc2goc3RyZWFtLCBzdGF0ZSkge1xuICByZXR1cm4gKHN0YXRlLmVuZGluZyAmJlxuICAgICAgICAgIHN0YXRlLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICFzdGF0ZS5maW5pc2hlZCAmJlxuICAgICAgICAgICFzdGF0ZS53cml0aW5nKTtcbn1cblxuZnVuY3Rpb24gZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSkge1xuICB2YXIgbmVlZCA9IG5lZWRGaW5pc2goc3RyZWFtLCBzdGF0ZSk7XG4gIGlmIChuZWVkKSB7XG4gICAgc3RhdGUuZmluaXNoZWQgPSB0cnVlO1xuICAgIHN0cmVhbS5lbWl0KCdmaW5pc2gnKTtcbiAgfVxuICByZXR1cm4gbmVlZDtcbn1cblxuZnVuY3Rpb24gZW5kV3JpdGFibGUoc3RyZWFtLCBzdGF0ZSwgY2IpIHtcbiAgc3RhdGUuZW5kaW5nID0gdHJ1ZTtcbiAgZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSk7XG4gIGlmIChjYikge1xuICAgIGlmIChzdGF0ZS5maW5pc2hlZClcbiAgICAgIHNldEltbWVkaWF0ZShjYik7XG4gICAgZWxzZVxuICAgICAgc3RyZWFtLm9uY2UoJ2ZpbmlzaCcsIGNiKTtcbiAgfVxuICBzdGF0ZS5lbmRlZCA9IHRydWU7XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcblxuZnVuY3Rpb24gYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpIHtcbiAgaWYgKGVuY29kaW5nICYmICFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIH1cbn1cblxudmFyIFN0cmluZ0RlY29kZXIgPSBleHBvcnRzLlN0cmluZ0RlY29kZXIgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICB0aGlzLmVuY29kaW5nID0gKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bLV9dLywgJycpO1xuICBhc3NlcnRFbmNvZGluZyhlbmNvZGluZyk7XG4gIHN3aXRjaCAodGhpcy5lbmNvZGluZykge1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgLy8gQ0VTVS04IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAzLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICAvLyBVVEYtMTYgcmVwcmVzZW50cyBlYWNoIG9mIFN1cnJvZ2F0ZSBQYWlyIGJ5IDItYnl0ZXNcbiAgICAgIHRoaXMuc3Vycm9nYXRlU2l6ZSA9IDI7XG4gICAgICB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyID0gdXRmMTZEZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAvLyBCYXNlLTY0IHN0b3JlcyAzIGJ5dGVzIGluIDQgY2hhcnMsIGFuZCBwYWRzIHRoZSByZW1haW5kZXIuXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAzO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMud3JpdGUgPSBwYXNzVGhyb3VnaFdyaXRlO1xuICAgICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5jaGFyQnVmZmVyID0gbmV3IEJ1ZmZlcig2KTtcbiAgdGhpcy5jaGFyUmVjZWl2ZWQgPSAwO1xuICB0aGlzLmNoYXJMZW5ndGggPSAwO1xufTtcblxuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICB2YXIgY2hhclN0ciA9ICcnO1xuICB2YXIgb2Zmc2V0ID0gMDtcblxuICAvLyBpZiBvdXIgbGFzdCB3cml0ZSBlbmRlZCB3aXRoIGFuIGluY29tcGxldGUgbXVsdGlieXRlIGNoYXJhY3RlclxuICB3aGlsZSAodGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IHJlbWFpbmluZyBieXRlcyB0aGlzIGJ1ZmZlciBoYXMgdG8gb2ZmZXIgZm9yIHRoaXMgY2hhclxuICAgIHZhciBpID0gKGJ1ZmZlci5sZW5ndGggPj0gdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQpID9cbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJMZW5ndGggLSB0aGlzLmNoYXJSZWNlaXZlZCA6XG4gICAgICAgICAgICAgICAgYnVmZmVyLmxlbmd0aDtcblxuICAgIC8vIGFkZCB0aGUgbmV3IGJ5dGVzIHRvIHRoZSBjaGFyIGJ1ZmZlclxuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgdGhpcy5jaGFyUmVjZWl2ZWQsIG9mZnNldCwgaSk7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgKz0gKGkgLSBvZmZzZXQpO1xuICAgIG9mZnNldCA9IGk7XG5cbiAgICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQgPCB0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAgIC8vIHN0aWxsIG5vdCBlbm91Z2ggY2hhcnMgaW4gdGhpcyBidWZmZXI/IHdhaXQgZm9yIG1vcmUgLi4uXG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLy8gZ2V0IHRoZSBjaGFyYWN0ZXIgdGhhdCB3YXMgc3BsaXRcbiAgICBjaGFyU3RyID0gdGhpcy5jaGFyQnVmZmVyLnNsaWNlKDAsIHRoaXMuY2hhckxlbmd0aCkudG9TdHJpbmcodGhpcy5lbmNvZGluZyk7XG5cbiAgICAvLyBsZWFkIHN1cnJvZ2F0ZSAoRDgwMC1EQkZGKSBpcyBhbHNvIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlclxuICAgIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChjaGFyU3RyLmxlbmd0aCAtIDEpO1xuICAgIGlmIChjaGFyQ29kZSA+PSAweEQ4MDAgJiYgY2hhckNvZGUgPD0gMHhEQkZGKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggKz0gdGhpcy5zdXJyb2dhdGVTaXplO1xuICAgICAgY2hhclN0ciA9ICcnO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHRoaXMuY2hhclJlY2VpdmVkID0gdGhpcy5jaGFyTGVuZ3RoID0gMDtcblxuICAgIC8vIGlmIHRoZXJlIGFyZSBubyBtb3JlIGJ5dGVzIGluIHRoaXMgYnVmZmVyLCBqdXN0IGVtaXQgb3VyIGNoYXJcbiAgICBpZiAoaSA9PSBidWZmZXIubGVuZ3RoKSByZXR1cm4gY2hhclN0cjtcblxuICAgIC8vIG90aGVyd2lzZSBjdXQgb2ZmIHRoZSBjaGFyYWN0ZXJzIGVuZCBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhpcyBidWZmZXJcbiAgICBidWZmZXIgPSBidWZmZXIuc2xpY2UoaSwgYnVmZmVyLmxlbmd0aCk7XG4gICAgYnJlYWs7XG4gIH1cblxuICB2YXIgbGVuSW5jb21wbGV0ZSA9IHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIoYnVmZmVyKTtcblxuICB2YXIgZW5kID0gYnVmZmVyLmxlbmd0aDtcbiAgaWYgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGJ1ZmZlciB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXIgYnl0ZXMgd2UgZ290XG4gICAgYnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCAwLCBidWZmZXIubGVuZ3RoIC0gbGVuSW5jb21wbGV0ZSwgZW5kKTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IGxlbkluY29tcGxldGU7XG4gICAgZW5kIC09IGxlbkluY29tcGxldGU7XG4gIH1cblxuICBjaGFyU3RyICs9IGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCBlbmQpO1xuXG4gIHZhciBlbmQgPSBjaGFyU3RyLmxlbmd0aCAtIDE7XG4gIHZhciBjaGFyQ29kZSA9IGNoYXJTdHIuY2hhckNvZGVBdChlbmQpO1xuICAvLyBsZWFkIHN1cnJvZ2F0ZSAoRDgwMC1EQkZGKSBpcyBhbHNvIHRoZSBpbmNvbXBsZXRlIGNoYXJhY3RlclxuICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgIHZhciBzaXplID0gdGhpcy5zdXJyb2dhdGVTaXplO1xuICAgIHRoaXMuY2hhckxlbmd0aCArPSBzaXplO1xuICAgIHRoaXMuY2hhclJlY2VpdmVkICs9IHNpemU7XG4gICAgdGhpcy5jaGFyQnVmZmVyLmNvcHkodGhpcy5jaGFyQnVmZmVyLCBzaXplLCAwLCBzaXplKTtcbiAgICB0aGlzLmNoYXJCdWZmZXIud3JpdGUoY2hhclN0ci5jaGFyQXQoY2hhclN0ci5sZW5ndGggLSAxKSwgdGhpcy5lbmNvZGluZyk7XG4gICAgcmV0dXJuIGNoYXJTdHIuc3Vic3RyaW5nKDAsIGVuZCk7XG4gIH1cblxuICAvLyBvciBqdXN0IGVtaXQgdGhlIGNoYXJTdHJcbiAgcmV0dXJuIGNoYXJTdHI7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAvLyBkZXRlcm1pbmUgaG93IG1hbnkgYnl0ZXMgd2UgaGF2ZSB0byBjaGVjayBhdCB0aGUgZW5kIG9mIHRoaXMgYnVmZmVyXG4gIHZhciBpID0gKGJ1ZmZlci5sZW5ndGggPj0gMykgPyAzIDogYnVmZmVyLmxlbmd0aDtcblxuICAvLyBGaWd1cmUgb3V0IGlmIG9uZSBvZiB0aGUgbGFzdCBpIGJ5dGVzIG9mIG91ciBidWZmZXIgYW5ub3VuY2VzIGFuXG4gIC8vIGluY29tcGxldGUgY2hhci5cbiAgZm9yICg7IGkgPiAwOyBpLS0pIHtcbiAgICB2YXIgYyA9IGJ1ZmZlcltidWZmZXIubGVuZ3RoIC0gaV07XG5cbiAgICAvLyBTZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9VVEYtOCNEZXNjcmlwdGlvblxuXG4gICAgLy8gMTEwWFhYWFhcbiAgICBpZiAoaSA9PSAxICYmIGMgPj4gNSA9PSAweDA2KSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAyO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMFhYWFhcbiAgICBpZiAoaSA8PSAyICYmIGMgPj4gNCA9PSAweDBFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSAzO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gMTExMTBYWFhcbiAgICBpZiAoaSA8PSAzICYmIGMgPj4gMyA9PSAweDFFKSB7XG4gICAgICB0aGlzLmNoYXJMZW5ndGggPSA0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGk7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIHJlcyA9ICcnO1xuICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGgpXG4gICAgcmVzID0gdGhpcy53cml0ZShidWZmZXIpO1xuXG4gIGlmICh0aGlzLmNoYXJSZWNlaXZlZCkge1xuICAgIHZhciBjciA9IHRoaXMuY2hhclJlY2VpdmVkO1xuICAgIHZhciBidWYgPSB0aGlzLmNoYXJCdWZmZXI7XG4gICAgdmFyIGVuYyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgcmVzICs9IGJ1Zi5zbGljZSgwLCBjcikudG9TdHJpbmcoZW5jKTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuXG5mdW5jdGlvbiBwYXNzVGhyb3VnaFdyaXRlKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiB1dGYxNkRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB2YXIgaW5jb21wbGV0ZSA9IHRoaXMuY2hhclJlY2VpdmVkID0gYnVmZmVyLmxlbmd0aCAlIDI7XG4gIHRoaXMuY2hhckxlbmd0aCA9IGluY29tcGxldGUgPyAyIDogMDtcbiAgcmV0dXJuIGluY29tcGxldGU7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NERldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcikge1xuICB2YXIgaW5jb21wbGV0ZSA9IHRoaXMuY2hhclJlY2VpdmVkID0gYnVmZmVyLmxlbmd0aCAlIDM7XG4gIHRoaXMuY2hhckxlbmd0aCA9IGluY29tcGxldGUgPyAzIDogMDtcbiAgcmV0dXJuIGluY29tcGxldGU7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMucnVudGltZVwiKVtcImRlZmF1bHRcIl07XG5cbi8vIENvbXBpbGVyIGltcG9ydHNcbnZhciBBU1QgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2NvbXBpbGVyL2FzdFwiKVtcImRlZmF1bHRcIl07XG52YXIgUGFyc2VyID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9jb21waWxlci9iYXNlXCIpLnBhcnNlcjtcbnZhciBwYXJzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvY29tcGlsZXIvYmFzZVwiKS5wYXJzZTtcbnZhciBDb21waWxlciA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvY29tcGlsZXIvY29tcGlsZXJcIikuQ29tcGlsZXI7XG52YXIgY29tcGlsZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvY29tcGlsZXIvY29tcGlsZXJcIikuY29tcGlsZTtcbnZhciBwcmVjb21waWxlID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9jb21waWxlci9jb21waWxlclwiKS5wcmVjb21waWxlO1xudmFyIEphdmFTY3JpcHRDb21waWxlciA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvY29tcGlsZXIvamF2YXNjcmlwdC1jb21waWxlclwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfY3JlYXRlID0gSGFuZGxlYmFycy5jcmVhdGU7XG52YXIgY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBoYiA9IF9jcmVhdGUoKTtcblxuICBoYi5jb21waWxlID0gZnVuY3Rpb24oaW5wdXQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gY29tcGlsZShpbnB1dCwgb3B0aW9ucywgaGIpO1xuICB9O1xuICBoYi5wcmVjb21waWxlID0gZnVuY3Rpb24gKGlucHV0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHByZWNvbXBpbGUoaW5wdXQsIG9wdGlvbnMsIGhiKTtcbiAgfTtcblxuICBoYi5BU1QgPSBBU1Q7XG4gIGhiLkNvbXBpbGVyID0gQ29tcGlsZXI7XG4gIGhiLkphdmFTY3JpcHRDb21waWxlciA9IEphdmFTY3JpcHRDb21waWxlcjtcbiAgaGIuUGFyc2VyID0gUGFyc2VyO1xuICBoYi5wYXJzZSA9IHBhcnNlO1xuXG4gIHJldHVybiBoYjtcbn07XG5cbkhhbmRsZWJhcnMgPSBjcmVhdGUoKTtcbkhhbmRsZWJhcnMuY3JlYXRlID0gY3JlYXRlO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhhbmRsZWJhcnM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmdsb2JhbHMgSGFuZGxlYmFyczogdHJ1ZSAqL1xudmFyIGJhc2UgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2Jhc2VcIik7XG5cbi8vIEVhY2ggb2YgdGhlc2UgYXVnbWVudCB0aGUgSGFuZGxlYmFycyBvYmplY3QuIE5vIG5lZWQgdG8gc2V0dXAgaGVyZS5cbi8vIChUaGlzIGlzIGRvbmUgdG8gZWFzaWx5IHNoYXJlIGNvZGUgYmV0d2VlbiBjb21tb25qcyBhbmQgYnJvd3NlIGVudnMpXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvdXRpbHNcIik7XG52YXIgcnVudGltZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvcnVudGltZVwiKTtcblxuLy8gRm9yIGNvbXBhdGliaWxpdHkgYW5kIHVzYWdlIG91dHNpZGUgb2YgbW9kdWxlIHN5c3RlbXMsIG1ha2UgdGhlIEhhbmRsZWJhcnMgb2JqZWN0IGEgbmFtZXNwYWNlXG52YXIgY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBoYiA9IG5ldyBiYXNlLkhhbmRsZWJhcnNFbnZpcm9ubWVudCgpO1xuXG4gIFV0aWxzLmV4dGVuZChoYiwgYmFzZSk7XG4gIGhiLlNhZmVTdHJpbmcgPSBTYWZlU3RyaW5nO1xuICBoYi5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGhiLlV0aWxzID0gVXRpbHM7XG5cbiAgaGIuVk0gPSBydW50aW1lO1xuICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG4gIH07XG5cbiAgcmV0dXJuIGhiO1xufTtcblxudmFyIEhhbmRsZWJhcnMgPSBjcmVhdGUoKTtcbkhhbmRsZWJhcnMuY3JlYXRlID0gY3JlYXRlO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEhhbmRsZWJhcnM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgVkVSU0lPTiA9IFwiMS4zLjBcIjtcbmV4cG9ydHMuVkVSU0lPTiA9IFZFUlNJT047dmFyIENPTVBJTEVSX1JFVklTSU9OID0gNDtcbmV4cG9ydHMuQ09NUElMRVJfUkVWSVNJT04gPSBDT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0ge1xuICAxOiAnPD0gMS4wLnJjLjInLCAvLyAxLjAucmMuMiBpcyBhY3R1YWxseSByZXYyIGJ1dCBkb2Vzbid0IHJlcG9ydCBpdFxuICAyOiAnPT0gMS4wLjAtcmMuMycsXG4gIDM6ICc9PSAxLjAuMC1yYy40JyxcbiAgNDogJz49IDEuMC4wJ1xufTtcbmV4cG9ydHMuUkVWSVNJT05fQ0hBTkdFUyA9IFJFVklTSU9OX0NIQU5HRVM7XG52YXIgaXNBcnJheSA9IFV0aWxzLmlzQXJyYXksXG4gICAgaXNGdW5jdGlvbiA9IFV0aWxzLmlzRnVuY3Rpb24sXG4gICAgdG9TdHJpbmcgPSBVdGlscy50b1N0cmluZyxcbiAgICBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmZ1bmN0aW9uIEhhbmRsZWJhcnNFbnZpcm9ubWVudChoZWxwZXJzLCBwYXJ0aWFscykge1xuICB0aGlzLmhlbHBlcnMgPSBoZWxwZXJzIHx8IHt9O1xuICB0aGlzLnBhcnRpYWxzID0gcGFydGlhbHMgfHwge307XG5cbiAgcmVnaXN0ZXJEZWZhdWx0SGVscGVycyh0aGlzKTtcbn1cblxuZXhwb3J0cy5IYW5kbGViYXJzRW52aXJvbm1lbnQgPSBIYW5kbGViYXJzRW52aXJvbm1lbnQ7SGFuZGxlYmFyc0Vudmlyb25tZW50LnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEhhbmRsZWJhcnNFbnZpcm9ubWVudCxcblxuICBsb2dnZXI6IGxvZ2dlcixcbiAgbG9nOiBsb2csXG5cbiAgcmVnaXN0ZXJIZWxwZXI6IGZ1bmN0aW9uKG5hbWUsIGZuLCBpbnZlcnNlKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIGlmIChpbnZlcnNlIHx8IGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpOyB9XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGludmVyc2UpIHsgZm4ubm90ID0gaW52ZXJzZTsgfVxuICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuXG4gIHJlZ2lzdGVyUGFydGlhbDogZnVuY3Rpb24obmFtZSwgc3RyKSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobmFtZSkgPT09IG9iamVjdFR5cGUpIHtcbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLnBhcnRpYWxzLCAgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBzdHI7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdoZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk1pc3NpbmcgaGVscGVyOiAnXCIgKyBhcmcgKyBcIidcIik7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignYmxvY2tIZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlIHx8IGZ1bmN0aW9uKCkge30sIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmKGNvbnRleHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICB9IGVsc2UgaWYoY29udGV4dCA9PT0gZmFsc2UgfHwgY29udGV4dCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgIGlmKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVycy5lYWNoKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbihjb250ZXh0KTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdlYWNoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBmbiA9IG9wdGlvbnMuZm4sIGludmVyc2UgPSBvcHRpb25zLmludmVyc2U7XG4gICAgdmFyIGkgPSAwLCByZXQgPSBcIlwiLCBkYXRhO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgICAgZGF0YSA9IGNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gICAgfVxuXG4gICAgaWYoY29udGV4dCAmJiB0eXBlb2YgY29udGV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICAgIGZvcih2YXIgaiA9IGNvbnRleHQubGVuZ3RoOyBpPGo7IGkrKykge1xuICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICBkYXRhLmxhc3QgID0gKGkgPT09IChjb250ZXh0Lmxlbmd0aC0xKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbaV0sIHsgZGF0YTogZGF0YSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gY29udGV4dCkge1xuICAgICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgaWYoZGF0YSkgeyBcbiAgICAgICAgICAgICAgZGF0YS5rZXkgPSBrZXk7IFxuICAgICAgICAgICAgICBkYXRhLmluZGV4ID0gaTtcbiAgICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRba2V5XSwge2RhdGE6IGRhdGF9KTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZihpID09PSAwKXtcbiAgICAgIHJldCA9IGludmVyc2UodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2lmJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb25kaXRpb25hbCkpIHsgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpOyB9XG5cbiAgICAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHRvIHJlbmRlciB0aGUgcG9zaXRpdmUgcGF0aCBpZiB0aGUgdmFsdWUgaXMgdHJ1dGh5IGFuZCBub3QgZW1wdHkuXG4gICAgLy8gVGhlIGBpbmNsdWRlWmVyb2Agb3B0aW9uIG1heSBiZSBzZXQgdG8gdHJlYXQgdGhlIGNvbmR0aW9uYWwgYXMgcHVyZWx5IG5vdCBlbXB0eSBiYXNlZCBvbiB0aGVcbiAgICAvLyBiZWhhdmlvciBvZiBpc0VtcHR5LiBFZmZlY3RpdmVseSB0aGlzIGRldGVybWluZXMgaWYgMCBpcyBoYW5kbGVkIGJ5IHRoZSBwb3NpdGl2ZSBwYXRoIG9yIG5lZ2F0aXZlLlxuICAgIGlmICgoIW9wdGlvbnMuaGFzaC5pbmNsdWRlWmVybyAmJiAhY29uZGl0aW9uYWwpIHx8IFV0aWxzLmlzRW1wdHkoY29uZGl0aW9uYWwpKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5mbih0aGlzKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd1bmxlc3MnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzWydpZiddLmNhbGwodGhpcywgY29uZGl0aW9uYWwsIHtmbjogb3B0aW9ucy5pbnZlcnNlLCBpbnZlcnNlOiBvcHRpb25zLmZuLCBoYXNoOiBvcHRpb25zLmhhc2h9KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYgKCFVdGlscy5pc0VtcHR5KGNvbnRleHQpKSByZXR1cm4gb3B0aW9ucy5mbihjb250ZXh0KTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgbGV2ZWwgPSBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhLmxldmVsICE9IG51bGwgPyBwYXJzZUludChvcHRpb25zLmRhdGEubGV2ZWwsIDEwKSA6IDE7XG4gICAgaW5zdGFuY2UubG9nKGxldmVsLCBjb250ZXh0KTtcbiAgfSk7XG59XG5cbnZhciBsb2dnZXIgPSB7XG4gIG1ldGhvZE1hcDogeyAwOiAnZGVidWcnLCAxOiAnaW5mbycsIDI6ICd3YXJuJywgMzogJ2Vycm9yJyB9LFxuXG4gIC8vIFN0YXRlIGVudW1cbiAgREVCVUc6IDAsXG4gIElORk86IDEsXG4gIFdBUk46IDIsXG4gIEVSUk9SOiAzLFxuICBsZXZlbDogMyxcblxuICAvLyBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgaG9zdCBlbnZpcm9ubWVudFxuICBsb2c6IGZ1bmN0aW9uKGxldmVsLCBvYmopIHtcbiAgICBpZiAobG9nZ2VyLmxldmVsIDw9IGxldmVsKSB7XG4gICAgICB2YXIgbWV0aG9kID0gbG9nZ2VyLm1ldGhvZE1hcFtsZXZlbF07XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGVbbWV0aG9kXSkge1xuICAgICAgICBjb25zb2xlW21ldGhvZF0uY2FsbChjb25zb2xlLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbmV4cG9ydHMubG9nZ2VyID0gbG9nZ2VyO1xuZnVuY3Rpb24gbG9nKGxldmVsLCBvYmopIHsgbG9nZ2VyLmxvZyhsZXZlbCwgb2JqKTsgfVxuXG5leHBvcnRzLmxvZyA9IGxvZzt2YXIgY3JlYXRlRnJhbWUgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICBVdGlscy5leHRlbmQob2JqLCBvYmplY3QpO1xuICByZXR1cm4gb2JqO1xufTtcbmV4cG9ydHMuY3JlYXRlRnJhbWUgPSBjcmVhdGVGcmFtZTsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcblxuZnVuY3Rpb24gTG9jYXRpb25JbmZvKGxvY0luZm8pe1xuICBsb2NJbmZvID0gbG9jSW5mbyB8fCB7fTtcbiAgdGhpcy5maXJzdExpbmUgICA9IGxvY0luZm8uZmlyc3RfbGluZTtcbiAgdGhpcy5maXJzdENvbHVtbiA9IGxvY0luZm8uZmlyc3RfY29sdW1uO1xuICB0aGlzLmxhc3RDb2x1bW4gID0gbG9jSW5mby5sYXN0X2NvbHVtbjtcbiAgdGhpcy5sYXN0TGluZSAgICA9IGxvY0luZm8ubGFzdF9saW5lO1xufVxuXG52YXIgQVNUID0ge1xuICBQcm9ncmFtTm9kZTogZnVuY3Rpb24oc3RhdGVtZW50cywgaW52ZXJzZVN0cmlwLCBpbnZlcnNlLCBsb2NJbmZvKSB7XG4gICAgdmFyIGludmVyc2VMb2NhdGlvbkluZm8sIGZpcnN0SW52ZXJzZU5vZGU7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGxvY0luZm8gPSBpbnZlcnNlO1xuICAgICAgaW52ZXJzZSA9IG51bGw7XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICBsb2NJbmZvID0gaW52ZXJzZVN0cmlwO1xuICAgICAgaW52ZXJzZVN0cmlwID0gbnVsbDtcbiAgICB9XG5cbiAgICBMb2NhdGlvbkluZm8uY2FsbCh0aGlzLCBsb2NJbmZvKTtcbiAgICB0aGlzLnR5cGUgPSBcInByb2dyYW1cIjtcbiAgICB0aGlzLnN0YXRlbWVudHMgPSBzdGF0ZW1lbnRzO1xuICAgIHRoaXMuc3RyaXAgPSB7fTtcblxuICAgIGlmKGludmVyc2UpIHtcbiAgICAgIGZpcnN0SW52ZXJzZU5vZGUgPSBpbnZlcnNlWzBdO1xuICAgICAgaWYgKGZpcnN0SW52ZXJzZU5vZGUpIHtcbiAgICAgICAgaW52ZXJzZUxvY2F0aW9uSW5mbyA9IHtcbiAgICAgICAgICBmaXJzdF9saW5lOiBmaXJzdEludmVyc2VOb2RlLmZpcnN0TGluZSxcbiAgICAgICAgICBsYXN0X2xpbmU6IGZpcnN0SW52ZXJzZU5vZGUubGFzdExpbmUsXG4gICAgICAgICAgbGFzdF9jb2x1bW46IGZpcnN0SW52ZXJzZU5vZGUubGFzdENvbHVtbixcbiAgICAgICAgICBmaXJzdF9jb2x1bW46IGZpcnN0SW52ZXJzZU5vZGUuZmlyc3RDb2x1bW5cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pbnZlcnNlID0gbmV3IEFTVC5Qcm9ncmFtTm9kZShpbnZlcnNlLCBpbnZlcnNlU3RyaXAsIGludmVyc2VMb2NhdGlvbkluZm8pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbnZlcnNlID0gbmV3IEFTVC5Qcm9ncmFtTm9kZShpbnZlcnNlLCBpbnZlcnNlU3RyaXApO1xuICAgICAgfVxuICAgICAgdGhpcy5zdHJpcC5yaWdodCA9IGludmVyc2VTdHJpcC5sZWZ0O1xuICAgIH0gZWxzZSBpZiAoaW52ZXJzZVN0cmlwKSB7XG4gICAgICB0aGlzLnN0cmlwLmxlZnQgPSBpbnZlcnNlU3RyaXAucmlnaHQ7XG4gICAgfVxuICB9LFxuXG4gIE11c3RhY2hlTm9kZTogZnVuY3Rpb24ocmF3UGFyYW1zLCBoYXNoLCBvcGVuLCBzdHJpcCwgbG9jSW5mbykge1xuICAgIExvY2F0aW9uSW5mby5jYWxsKHRoaXMsIGxvY0luZm8pO1xuICAgIHRoaXMudHlwZSA9IFwibXVzdGFjaGVcIjtcbiAgICB0aGlzLnN0cmlwID0gc3RyaXA7XG5cbiAgICAvLyBPcGVuIG1heSBiZSBhIHN0cmluZyBwYXJzZWQgZnJvbSB0aGUgcGFyc2VyIG9yIGEgcGFzc2VkIGJvb2xlYW4gZmxhZ1xuICAgIGlmIChvcGVuICE9IG51bGwgJiYgb3Blbi5jaGFyQXQpIHtcbiAgICAgIC8vIE11c3QgdXNlIGNoYXJBdCB0byBzdXBwb3J0IElFIHByZS0xMFxuICAgICAgdmFyIGVzY2FwZUZsYWcgPSBvcGVuLmNoYXJBdCgzKSB8fCBvcGVuLmNoYXJBdCgyKTtcbiAgICAgIHRoaXMuZXNjYXBlZCA9IGVzY2FwZUZsYWcgIT09ICd7JyAmJiBlc2NhcGVGbGFnICE9PSAnJic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXNjYXBlZCA9ICEhb3BlbjtcbiAgICB9XG5cbiAgICBpZiAocmF3UGFyYW1zIGluc3RhbmNlb2YgQVNULlNleHByTm9kZSkge1xuICAgICAgdGhpcy5zZXhwciA9IHJhd1BhcmFtcztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3VwcG9ydCBvbGQgQVNUIEFQSVxuICAgICAgdGhpcy5zZXhwciA9IG5ldyBBU1QuU2V4cHJOb2RlKHJhd1BhcmFtcywgaGFzaCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXhwci5pc1Jvb3QgPSB0cnVlO1xuXG4gICAgLy8gU3VwcG9ydCBvbGQgQVNUIEFQSSB0aGF0IHN0b3JlZCB0aGlzIGluZm8gaW4gTXVzdGFjaGVOb2RlXG4gICAgdGhpcy5pZCA9IHRoaXMuc2V4cHIuaWQ7XG4gICAgdGhpcy5wYXJhbXMgPSB0aGlzLnNleHByLnBhcmFtcztcbiAgICB0aGlzLmhhc2ggPSB0aGlzLnNleHByLmhhc2g7XG4gICAgdGhpcy5lbGlnaWJsZUhlbHBlciA9IHRoaXMuc2V4cHIuZWxpZ2libGVIZWxwZXI7XG4gICAgdGhpcy5pc0hlbHBlciA9IHRoaXMuc2V4cHIuaXNIZWxwZXI7XG4gIH0sXG5cbiAgU2V4cHJOb2RlOiBmdW5jdGlvbihyYXdQYXJhbXMsIGhhc2gsIGxvY0luZm8pIHtcbiAgICBMb2NhdGlvbkluZm8uY2FsbCh0aGlzLCBsb2NJbmZvKTtcblxuICAgIHRoaXMudHlwZSA9IFwic2V4cHJcIjtcbiAgICB0aGlzLmhhc2ggPSBoYXNoO1xuXG4gICAgdmFyIGlkID0gdGhpcy5pZCA9IHJhd1BhcmFtc1swXTtcbiAgICB2YXIgcGFyYW1zID0gdGhpcy5wYXJhbXMgPSByYXdQYXJhbXMuc2xpY2UoMSk7XG5cbiAgICAvLyBhIG11c3RhY2hlIGlzIGFuIGVsaWdpYmxlIGhlbHBlciBpZjpcbiAgICAvLyAqIGl0cyBpZCBpcyBzaW1wbGUgKGEgc2luZ2xlIHBhcnQsIG5vdCBgdGhpc2Agb3IgYC4uYClcbiAgICB2YXIgZWxpZ2libGVIZWxwZXIgPSB0aGlzLmVsaWdpYmxlSGVscGVyID0gaWQuaXNTaW1wbGU7XG5cbiAgICAvLyBhIG11c3RhY2hlIGlzIGRlZmluaXRlbHkgYSBoZWxwZXIgaWY6XG4gICAgLy8gKiBpdCBpcyBhbiBlbGlnaWJsZSBoZWxwZXIsIGFuZFxuICAgIC8vICogaXQgaGFzIGF0IGxlYXN0IG9uZSBwYXJhbWV0ZXIgb3IgaGFzaCBzZWdtZW50XG4gICAgdGhpcy5pc0hlbHBlciA9IGVsaWdpYmxlSGVscGVyICYmIChwYXJhbXMubGVuZ3RoIHx8IGhhc2gpO1xuXG4gICAgLy8gaWYgYSBtdXN0YWNoZSBpcyBhbiBlbGlnaWJsZSBoZWxwZXIgYnV0IG5vdCBhIGRlZmluaXRlXG4gICAgLy8gaGVscGVyLCBpdCBpcyBhbWJpZ3VvdXMsIGFuZCB3aWxsIGJlIHJlc29sdmVkIGluIGEgbGF0ZXJcbiAgICAvLyBwYXNzIG9yIGF0IHJ1bnRpbWUuXG4gIH0sXG5cbiAgUGFydGlhbE5vZGU6IGZ1bmN0aW9uKHBhcnRpYWxOYW1lLCBjb250ZXh0LCBzdHJpcCwgbG9jSW5mbykge1xuICAgIExvY2F0aW9uSW5mby5jYWxsKHRoaXMsIGxvY0luZm8pO1xuICAgIHRoaXMudHlwZSAgICAgICAgID0gXCJwYXJ0aWFsXCI7XG4gICAgdGhpcy5wYXJ0aWFsTmFtZSAgPSBwYXJ0aWFsTmFtZTtcbiAgICB0aGlzLmNvbnRleHQgICAgICA9IGNvbnRleHQ7XG4gICAgdGhpcy5zdHJpcCA9IHN0cmlwO1xuICB9LFxuXG4gIEJsb2NrTm9kZTogZnVuY3Rpb24obXVzdGFjaGUsIHByb2dyYW0sIGludmVyc2UsIGNsb3NlLCBsb2NJbmZvKSB7XG4gICAgTG9jYXRpb25JbmZvLmNhbGwodGhpcywgbG9jSW5mbyk7XG5cbiAgICBpZihtdXN0YWNoZS5zZXhwci5pZC5vcmlnaW5hbCAhPT0gY2xvc2UucGF0aC5vcmlnaW5hbCkge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihtdXN0YWNoZS5zZXhwci5pZC5vcmlnaW5hbCArIFwiIGRvZXNuJ3QgbWF0Y2ggXCIgKyBjbG9zZS5wYXRoLm9yaWdpbmFsLCB0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLnR5cGUgPSAnYmxvY2snO1xuICAgIHRoaXMubXVzdGFjaGUgPSBtdXN0YWNoZTtcbiAgICB0aGlzLnByb2dyYW0gID0gcHJvZ3JhbTtcbiAgICB0aGlzLmludmVyc2UgID0gaW52ZXJzZTtcblxuICAgIHRoaXMuc3RyaXAgPSB7XG4gICAgICBsZWZ0OiBtdXN0YWNoZS5zdHJpcC5sZWZ0LFxuICAgICAgcmlnaHQ6IGNsb3NlLnN0cmlwLnJpZ2h0XG4gICAgfTtcblxuICAgIChwcm9ncmFtIHx8IGludmVyc2UpLnN0cmlwLmxlZnQgPSBtdXN0YWNoZS5zdHJpcC5yaWdodDtcbiAgICAoaW52ZXJzZSB8fCBwcm9ncmFtKS5zdHJpcC5yaWdodCA9IGNsb3NlLnN0cmlwLmxlZnQ7XG5cbiAgICBpZiAoaW52ZXJzZSAmJiAhcHJvZ3JhbSkge1xuICAgICAgdGhpcy5pc0ludmVyc2UgPSB0cnVlO1xuICAgIH1cbiAgfSxcblxuICBDb250ZW50Tm9kZTogZnVuY3Rpb24oc3RyaW5nLCBsb2NJbmZvKSB7XG4gICAgTG9jYXRpb25JbmZvLmNhbGwodGhpcywgbG9jSW5mbyk7XG4gICAgdGhpcy50eXBlID0gXCJjb250ZW50XCI7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gIH0sXG5cbiAgSGFzaE5vZGU6IGZ1bmN0aW9uKHBhaXJzLCBsb2NJbmZvKSB7XG4gICAgTG9jYXRpb25JbmZvLmNhbGwodGhpcywgbG9jSW5mbyk7XG4gICAgdGhpcy50eXBlID0gXCJoYXNoXCI7XG4gICAgdGhpcy5wYWlycyA9IHBhaXJzO1xuICB9LFxuXG4gIElkTm9kZTogZnVuY3Rpb24ocGFydHMsIGxvY0luZm8pIHtcbiAgICBMb2NhdGlvbkluZm8uY2FsbCh0aGlzLCBsb2NJbmZvKTtcbiAgICB0aGlzLnR5cGUgPSBcIklEXCI7XG5cbiAgICB2YXIgb3JpZ2luYWwgPSBcIlwiLFxuICAgICAgICBkaWcgPSBbXSxcbiAgICAgICAgZGVwdGggPSAwO1xuXG4gICAgZm9yKHZhciBpPTAsbD1wYXJ0cy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICB2YXIgcGFydCA9IHBhcnRzW2ldLnBhcnQ7XG4gICAgICBvcmlnaW5hbCArPSAocGFydHNbaV0uc2VwYXJhdG9yIHx8ICcnKSArIHBhcnQ7XG5cbiAgICAgIGlmIChwYXJ0ID09PSBcIi4uXCIgfHwgcGFydCA9PT0gXCIuXCIgfHwgcGFydCA9PT0gXCJ0aGlzXCIpIHtcbiAgICAgICAgaWYgKGRpZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIkludmFsaWQgcGF0aDogXCIgKyBvcmlnaW5hbCwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFydCA9PT0gXCIuLlwiKSB7XG4gICAgICAgICAgZGVwdGgrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmlzU2NvcGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlnLnB1c2gocGFydCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5hbCA9IG9yaWdpbmFsO1xuICAgIHRoaXMucGFydHMgICAgPSBkaWc7XG4gICAgdGhpcy5zdHJpbmcgICA9IGRpZy5qb2luKCcuJyk7XG4gICAgdGhpcy5kZXB0aCAgICA9IGRlcHRoO1xuXG4gICAgLy8gYW4gSUQgaXMgc2ltcGxlIGlmIGl0IG9ubHkgaGFzIG9uZSBwYXJ0LCBhbmQgdGhhdCBwYXJ0IGlzIG5vdFxuICAgIC8vIGAuLmAgb3IgYHRoaXNgLlxuICAgIHRoaXMuaXNTaW1wbGUgPSBwYXJ0cy5sZW5ndGggPT09IDEgJiYgIXRoaXMuaXNTY29wZWQgJiYgZGVwdGggPT09IDA7XG5cbiAgICB0aGlzLnN0cmluZ01vZGVWYWx1ZSA9IHRoaXMuc3RyaW5nO1xuICB9LFxuXG4gIFBhcnRpYWxOYW1lTm9kZTogZnVuY3Rpb24obmFtZSwgbG9jSW5mbykge1xuICAgIExvY2F0aW9uSW5mby5jYWxsKHRoaXMsIGxvY0luZm8pO1xuICAgIHRoaXMudHlwZSA9IFwiUEFSVElBTF9OQU1FXCI7XG4gICAgdGhpcy5uYW1lID0gbmFtZS5vcmlnaW5hbDtcbiAgfSxcblxuICBEYXRhTm9kZTogZnVuY3Rpb24oaWQsIGxvY0luZm8pIHtcbiAgICBMb2NhdGlvbkluZm8uY2FsbCh0aGlzLCBsb2NJbmZvKTtcbiAgICB0aGlzLnR5cGUgPSBcIkRBVEFcIjtcbiAgICB0aGlzLmlkID0gaWQ7XG4gIH0sXG5cbiAgU3RyaW5nTm9kZTogZnVuY3Rpb24oc3RyaW5nLCBsb2NJbmZvKSB7XG4gICAgTG9jYXRpb25JbmZvLmNhbGwodGhpcywgbG9jSW5mbyk7XG4gICAgdGhpcy50eXBlID0gXCJTVFJJTkdcIjtcbiAgICB0aGlzLm9yaWdpbmFsID1cbiAgICAgIHRoaXMuc3RyaW5nID1cbiAgICAgIHRoaXMuc3RyaW5nTW9kZVZhbHVlID0gc3RyaW5nO1xuICB9LFxuXG4gIEludGVnZXJOb2RlOiBmdW5jdGlvbihpbnRlZ2VyLCBsb2NJbmZvKSB7XG4gICAgTG9jYXRpb25JbmZvLmNhbGwodGhpcywgbG9jSW5mbyk7XG4gICAgdGhpcy50eXBlID0gXCJJTlRFR0VSXCI7XG4gICAgdGhpcy5vcmlnaW5hbCA9XG4gICAgICB0aGlzLmludGVnZXIgPSBpbnRlZ2VyO1xuICAgIHRoaXMuc3RyaW5nTW9kZVZhbHVlID0gTnVtYmVyKGludGVnZXIpO1xuICB9LFxuXG4gIEJvb2xlYW5Ob2RlOiBmdW5jdGlvbihib29sLCBsb2NJbmZvKSB7XG4gICAgTG9jYXRpb25JbmZvLmNhbGwodGhpcywgbG9jSW5mbyk7XG4gICAgdGhpcy50eXBlID0gXCJCT09MRUFOXCI7XG4gICAgdGhpcy5ib29sID0gYm9vbDtcbiAgICB0aGlzLnN0cmluZ01vZGVWYWx1ZSA9IGJvb2wgPT09IFwidHJ1ZVwiO1xuICB9LFxuXG4gIENvbW1lbnROb2RlOiBmdW5jdGlvbihjb21tZW50LCBsb2NJbmZvKSB7XG4gICAgTG9jYXRpb25JbmZvLmNhbGwodGhpcywgbG9jSW5mbyk7XG4gICAgdGhpcy50eXBlID0gXCJjb21tZW50XCI7XG4gICAgdGhpcy5jb21tZW50ID0gY29tbWVudDtcbiAgfVxufTtcblxuLy8gTXVzdCBiZSBleHBvcnRlZCBhcyBhbiBvYmplY3QgcmF0aGVyIHRoYW4gdGhlIHJvb3Qgb2YgdGhlIG1vZHVsZSBhcyB0aGUgamlzb24gbGV4ZXJcbi8vIG1vc3QgbW9kaWZ5IHRoZSBvYmplY3QgdG8gb3BlcmF0ZSBwcm9wZXJseS5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQVNUOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIHBhcnNlciA9IHJlcXVpcmUoXCIuL3BhcnNlclwiKVtcImRlZmF1bHRcIl07XG52YXIgQVNUID0gcmVxdWlyZShcIi4vYXN0XCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0cy5wYXJzZXIgPSBwYXJzZXI7XG5cbmZ1bmN0aW9uIHBhcnNlKGlucHV0KSB7XG4gIC8vIEp1c3QgcmV0dXJuIGlmIGFuIGFscmVhZHktY29tcGlsZSBBU1Qgd2FzIHBhc3NlZCBpbi5cbiAgaWYoaW5wdXQuY29uc3RydWN0b3IgPT09IEFTVC5Qcm9ncmFtTm9kZSkgeyByZXR1cm4gaW5wdXQ7IH1cblxuICBwYXJzZXIueXkgPSBBU1Q7XG4gIHJldHVybiBwYXJzZXIucGFyc2UoaW5wdXQpO1xufVxuXG5leHBvcnRzLnBhcnNlID0gcGFyc2U7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4uL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbmZ1bmN0aW9uIENvbXBpbGVyKCkge31cblxuZXhwb3J0cy5Db21waWxlciA9IENvbXBpbGVyOy8vIHRoZSBmb3VuZEhlbHBlciByZWdpc3RlciB3aWxsIGRpc2FtYmlndWF0ZSBoZWxwZXIgbG9va3VwIGZyb20gZmluZGluZyBhXG4vLyBmdW5jdGlvbiBpbiBhIGNvbnRleHQuIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBtdXN0YWNoZSBjb21wYXRpYmlsaXR5LCB3aGljaFxuLy8gcmVxdWlyZXMgdGhhdCBjb250ZXh0IGZ1bmN0aW9ucyBpbiBibG9ja3MgYXJlIGV2YWx1YXRlZCBieSBibG9ja0hlbHBlck1pc3NpbmcsXG4vLyBhbmQgdGhlbiBwcm9jZWVkIGFzIGlmIHRoZSByZXN1bHRpbmcgdmFsdWUgd2FzIHByb3ZpZGVkIHRvIGJsb2NrSGVscGVyTWlzc2luZy5cblxuQ29tcGlsZXIucHJvdG90eXBlID0ge1xuICBjb21waWxlcjogQ29tcGlsZXIsXG5cbiAgZGlzYXNzZW1ibGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcGNvZGVzID0gdGhpcy5vcGNvZGVzLCBvcGNvZGUsIG91dCA9IFtdLCBwYXJhbXMsIHBhcmFtO1xuXG4gICAgZm9yICh2YXIgaT0wLCBsPW9wY29kZXMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgb3Bjb2RlID0gb3Bjb2Rlc1tpXTtcblxuICAgICAgaWYgKG9wY29kZS5vcGNvZGUgPT09ICdERUNMQVJFJykge1xuICAgICAgICBvdXQucHVzaChcIkRFQ0xBUkUgXCIgKyBvcGNvZGUubmFtZSArIFwiPVwiICsgb3Bjb2RlLnZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFtcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqPTA7IGo8b3Bjb2RlLmFyZ3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBwYXJhbSA9IG9wY29kZS5hcmdzW2pdO1xuICAgICAgICAgIGlmICh0eXBlb2YgcGFyYW0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHBhcmFtID0gXCJcXFwiXCIgKyBwYXJhbS5yZXBsYWNlKFwiXFxuXCIsIFwiXFxcXG5cIikgKyBcIlxcXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcGFyYW1zLnB1c2gocGFyYW0pO1xuICAgICAgICB9XG4gICAgICAgIG91dC5wdXNoKG9wY29kZS5vcGNvZGUgKyBcIiBcIiArIHBhcmFtcy5qb2luKFwiIFwiKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dC5qb2luKFwiXFxuXCIpO1xuICB9LFxuXG4gIGVxdWFsczogZnVuY3Rpb24ob3RoZXIpIHtcbiAgICB2YXIgbGVuID0gdGhpcy5vcGNvZGVzLmxlbmd0aDtcbiAgICBpZiAob3RoZXIub3Bjb2Rlcy5sZW5ndGggIT09IGxlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBvcGNvZGUgPSB0aGlzLm9wY29kZXNbaV0sXG4gICAgICAgICAgb3RoZXJPcGNvZGUgPSBvdGhlci5vcGNvZGVzW2ldO1xuICAgICAgaWYgKG9wY29kZS5vcGNvZGUgIT09IG90aGVyT3Bjb2RlLm9wY29kZSB8fCBvcGNvZGUuYXJncy5sZW5ndGggIT09IG90aGVyT3Bjb2RlLmFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb3Bjb2RlLmFyZ3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKG9wY29kZS5hcmdzW2pdICE9PSBvdGhlck9wY29kZS5hcmdzW2pdKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGVuID0gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG4gICAgaWYgKG90aGVyLmNoaWxkcmVuLmxlbmd0aCAhPT0gbGVuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuW2ldLmVxdWFscyhvdGhlci5jaGlsZHJlbltpXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIGd1aWQ6IDAsXG5cbiAgY29tcGlsZTogZnVuY3Rpb24ocHJvZ3JhbSwgb3B0aW9ucykge1xuICAgIHRoaXMub3Bjb2RlcyA9IFtdO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLmRlcHRocyA9IHtsaXN0OiBbXX07XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIC8vIFRoZXNlIGNoYW5nZXMgd2lsbCBwcm9wYWdhdGUgdG8gdGhlIG90aGVyIGNvbXBpbGVyIGNvbXBvbmVudHNcbiAgICB2YXIga25vd25IZWxwZXJzID0gdGhpcy5vcHRpb25zLmtub3duSGVscGVycztcbiAgICB0aGlzLm9wdGlvbnMua25vd25IZWxwZXJzID0ge1xuICAgICAgJ2hlbHBlck1pc3NpbmcnOiB0cnVlLFxuICAgICAgJ2Jsb2NrSGVscGVyTWlzc2luZyc6IHRydWUsXG4gICAgICAnZWFjaCc6IHRydWUsXG4gICAgICAnaWYnOiB0cnVlLFxuICAgICAgJ3VubGVzcyc6IHRydWUsXG4gICAgICAnd2l0aCc6IHRydWUsXG4gICAgICAnbG9nJzogdHJ1ZVxuICAgIH07XG4gICAgaWYgKGtub3duSGVscGVycykge1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBrbm93bkhlbHBlcnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmtub3duSGVscGVyc1tuYW1lXSA9IGtub3duSGVscGVyc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hY2NlcHQocHJvZ3JhbSk7XG4gIH0sXG5cbiAgYWNjZXB0OiBmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIHN0cmlwID0gbm9kZS5zdHJpcCB8fCB7fSxcbiAgICAgICAgcmV0O1xuICAgIGlmIChzdHJpcC5sZWZ0KSB7XG4gICAgICB0aGlzLm9wY29kZSgnc3RyaXAnKTtcbiAgICB9XG5cbiAgICByZXQgPSB0aGlzW25vZGUudHlwZV0obm9kZSk7XG5cbiAgICBpZiAoc3RyaXAucmlnaHQpIHtcbiAgICAgIHRoaXMub3Bjb2RlKCdzdHJpcCcpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgcHJvZ3JhbTogZnVuY3Rpb24ocHJvZ3JhbSkge1xuICAgIHZhciBzdGF0ZW1lbnRzID0gcHJvZ3JhbS5zdGF0ZW1lbnRzO1xuXG4gICAgZm9yKHZhciBpPTAsIGw9c3RhdGVtZW50cy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICB0aGlzLmFjY2VwdChzdGF0ZW1lbnRzW2ldKTtcbiAgICB9XG4gICAgdGhpcy5pc1NpbXBsZSA9IGwgPT09IDE7XG5cbiAgICB0aGlzLmRlcHRocy5saXN0ID0gdGhpcy5kZXB0aHMubGlzdC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhIC0gYjtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGNvbXBpbGVQcm9ncmFtOiBmdW5jdGlvbihwcm9ncmFtKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyB0aGlzLmNvbXBpbGVyKCkuY29tcGlsZShwcm9ncmFtLCB0aGlzLm9wdGlvbnMpO1xuICAgIHZhciBndWlkID0gdGhpcy5ndWlkKyssIGRlcHRoO1xuXG4gICAgdGhpcy51c2VQYXJ0aWFsID0gdGhpcy51c2VQYXJ0aWFsIHx8IHJlc3VsdC51c2VQYXJ0aWFsO1xuXG4gICAgdGhpcy5jaGlsZHJlbltndWlkXSA9IHJlc3VsdDtcblxuICAgIGZvcih2YXIgaT0wLCBsPXJlc3VsdC5kZXB0aHMubGlzdC5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICBkZXB0aCA9IHJlc3VsdC5kZXB0aHMubGlzdFtpXTtcblxuICAgICAgaWYoZGVwdGggPCAyKSB7IGNvbnRpbnVlOyB9XG4gICAgICBlbHNlIHsgdGhpcy5hZGREZXB0aChkZXB0aCAtIDEpOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGd1aWQ7XG4gIH0sXG5cbiAgYmxvY2s6IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgdmFyIG11c3RhY2hlID0gYmxvY2subXVzdGFjaGUsXG4gICAgICAgIHByb2dyYW0gPSBibG9jay5wcm9ncmFtLFxuICAgICAgICBpbnZlcnNlID0gYmxvY2suaW52ZXJzZTtcblxuICAgIGlmIChwcm9ncmFtKSB7XG4gICAgICBwcm9ncmFtID0gdGhpcy5jb21waWxlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICB9XG5cbiAgICBpZiAoaW52ZXJzZSkge1xuICAgICAgaW52ZXJzZSA9IHRoaXMuY29tcGlsZVByb2dyYW0oaW52ZXJzZSk7XG4gICAgfVxuXG4gICAgdmFyIHNleHByID0gbXVzdGFjaGUuc2V4cHI7XG4gICAgdmFyIHR5cGUgPSB0aGlzLmNsYXNzaWZ5U2V4cHIoc2V4cHIpO1xuXG4gICAgaWYgKHR5cGUgPT09IFwiaGVscGVyXCIpIHtcbiAgICAgIHRoaXMuaGVscGVyU2V4cHIoc2V4cHIsIHByb2dyYW0sIGludmVyc2UpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzaW1wbGVcIikge1xuICAgICAgdGhpcy5zaW1wbGVTZXhwcihzZXhwcik7XG5cbiAgICAgIC8vIG5vdyB0aGF0IHRoZSBzaW1wbGUgbXVzdGFjaGUgaXMgcmVzb2x2ZWQsIHdlIG5lZWQgdG9cbiAgICAgIC8vIGV2YWx1YXRlIGl0IGJ5IGV4ZWN1dGluZyBgYmxvY2tIZWxwZXJNaXNzaW5nYFxuICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG4gICAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcbiAgICAgIHRoaXMub3Bjb2RlKCdlbXB0eUhhc2gnKTtcbiAgICAgIHRoaXMub3Bjb2RlKCdibG9ja1ZhbHVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYW1iaWd1b3VzU2V4cHIoc2V4cHIsIHByb2dyYW0sIGludmVyc2UpO1xuXG4gICAgICAvLyBub3cgdGhhdCB0aGUgc2ltcGxlIG11c3RhY2hlIGlzIHJlc29sdmVkLCB3ZSBuZWVkIHRvXG4gICAgICAvLyBldmFsdWF0ZSBpdCBieSBleGVjdXRpbmcgYGJsb2NrSGVscGVyTWlzc2luZ2BcbiAgICAgIHRoaXMub3Bjb2RlKCdwdXNoUHJvZ3JhbScsIHByb2dyYW0pO1xuICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG4gICAgICB0aGlzLm9wY29kZSgnZW1wdHlIYXNoJyk7XG4gICAgICB0aGlzLm9wY29kZSgnYW1iaWd1b3VzQmxvY2tWYWx1ZScpO1xuICAgIH1cblxuICAgIHRoaXMub3Bjb2RlKCdhcHBlbmQnKTtcbiAgfSxcblxuICBoYXNoOiBmdW5jdGlvbihoYXNoKSB7XG4gICAgdmFyIHBhaXJzID0gaGFzaC5wYWlycywgcGFpciwgdmFsO1xuXG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hIYXNoJyk7XG5cbiAgICBmb3IodmFyIGk9MCwgbD1wYWlycy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICBwYWlyID0gcGFpcnNbaV07XG4gICAgICB2YWwgID0gcGFpclsxXTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpbmdQYXJhbXMpIHtcbiAgICAgICAgaWYodmFsLmRlcHRoKSB7XG4gICAgICAgICAgdGhpcy5hZGREZXB0aCh2YWwuZGVwdGgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgdmFsLmRlcHRoIHx8IDApO1xuICAgICAgICB0aGlzLm9wY29kZSgncHVzaFN0cmluZ1BhcmFtJywgdmFsLnN0cmluZ01vZGVWYWx1ZSwgdmFsLnR5cGUpO1xuXG4gICAgICAgIGlmICh2YWwudHlwZSA9PT0gJ3NleHByJykge1xuICAgICAgICAgIC8vIFN1YmV4cHJlc3Npb25zIGdldCBldmFsdWF0ZWQgYW5kIHBhc3NlZCBpblxuICAgICAgICAgIC8vIGluIHN0cmluZyBwYXJhbXMgbW9kZS5cbiAgICAgICAgICB0aGlzLnNleHByKHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWNjZXB0KHZhbCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3Bjb2RlKCdhc3NpZ25Ub0hhc2gnLCBwYWlyWzBdKTtcbiAgICB9XG4gICAgdGhpcy5vcGNvZGUoJ3BvcEhhc2gnKTtcbiAgfSxcblxuICBwYXJ0aWFsOiBmdW5jdGlvbihwYXJ0aWFsKSB7XG4gICAgdmFyIHBhcnRpYWxOYW1lID0gcGFydGlhbC5wYXJ0aWFsTmFtZTtcbiAgICB0aGlzLnVzZVBhcnRpYWwgPSB0cnVlO1xuXG4gICAgaWYocGFydGlhbC5jb250ZXh0KSB7XG4gICAgICB0aGlzLklEKHBhcnRpYWwuY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3Bjb2RlKCdwdXNoJywgJ2RlcHRoMCcpO1xuICAgIH1cblxuICAgIHRoaXMub3Bjb2RlKCdpbnZva2VQYXJ0aWFsJywgcGFydGlhbE5hbWUubmFtZSk7XG4gICAgdGhpcy5vcGNvZGUoJ2FwcGVuZCcpO1xuICB9LFxuXG4gIGNvbnRlbnQ6IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgICB0aGlzLm9wY29kZSgnYXBwZW5kQ29udGVudCcsIGNvbnRlbnQuc3RyaW5nKTtcbiAgfSxcblxuICBtdXN0YWNoZTogZnVuY3Rpb24obXVzdGFjaGUpIHtcbiAgICB0aGlzLnNleHByKG11c3RhY2hlLnNleHByKTtcblxuICAgIGlmKG11c3RhY2hlLmVzY2FwZWQgJiYgIXRoaXMub3B0aW9ucy5ub0VzY2FwZSkge1xuICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZEVzY2FwZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGNvZGUoJ2FwcGVuZCcpO1xuICAgIH1cbiAgfSxcblxuICBhbWJpZ3VvdXNTZXhwcjogZnVuY3Rpb24oc2V4cHIsIHByb2dyYW0sIGludmVyc2UpIHtcbiAgICB2YXIgaWQgPSBzZXhwci5pZCxcbiAgICAgICAgbmFtZSA9IGlkLnBhcnRzWzBdLFxuICAgICAgICBpc0Jsb2NrID0gcHJvZ3JhbSAhPSBudWxsIHx8IGludmVyc2UgIT0gbnVsbDtcblxuICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgaWQuZGVwdGgpO1xuXG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgcHJvZ3JhbSk7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hQcm9ncmFtJywgaW52ZXJzZSk7XG5cbiAgICB0aGlzLm9wY29kZSgnaW52b2tlQW1iaWd1b3VzJywgbmFtZSwgaXNCbG9jayk7XG4gIH0sXG5cbiAgc2ltcGxlU2V4cHI6IGZ1bmN0aW9uKHNleHByKSB7XG4gICAgdmFyIGlkID0gc2V4cHIuaWQ7XG5cbiAgICBpZiAoaWQudHlwZSA9PT0gJ0RBVEEnKSB7XG4gICAgICB0aGlzLkRBVEEoaWQpO1xuICAgIH0gZWxzZSBpZiAoaWQucGFydHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLklEKGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2ltcGxpZmllZCBJRCBmb3IgYHRoaXNgXG4gICAgICB0aGlzLmFkZERlcHRoKGlkLmRlcHRoKTtcbiAgICAgIHRoaXMub3Bjb2RlKCdnZXRDb250ZXh0JywgaWQuZGVwdGgpO1xuICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hDb250ZXh0Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5vcGNvZGUoJ3Jlc29sdmVQb3NzaWJsZUxhbWJkYScpO1xuICB9LFxuXG4gIGhlbHBlclNleHByOiBmdW5jdGlvbihzZXhwciwgcHJvZ3JhbSwgaW52ZXJzZSkge1xuICAgIHZhciBwYXJhbXMgPSB0aGlzLnNldHVwRnVsbE11c3RhY2hlUGFyYW1zKHNleHByLCBwcm9ncmFtLCBpbnZlcnNlKSxcbiAgICAgICAgbmFtZSA9IHNleHByLmlkLnBhcnRzWzBdO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5rbm93bkhlbHBlcnNbbmFtZV0pIHtcbiAgICAgIHRoaXMub3Bjb2RlKCdpbnZva2VLbm93bkhlbHBlcicsIHBhcmFtcy5sZW5ndGgsIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmtub3duSGVscGVyc09ubHkpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJZb3Ugc3BlY2lmaWVkIGtub3duSGVscGVyc09ubHksIGJ1dCB1c2VkIHRoZSB1bmtub3duIGhlbHBlciBcIiArIG5hbWUsIHNleHByKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGNvZGUoJ2ludm9rZUhlbHBlcicsIHBhcmFtcy5sZW5ndGgsIG5hbWUsIHNleHByLmlzUm9vdCk7XG4gICAgfVxuICB9LFxuXG4gIHNleHByOiBmdW5jdGlvbihzZXhwcikge1xuICAgIHZhciB0eXBlID0gdGhpcy5jbGFzc2lmeVNleHByKHNleHByKTtcblxuICAgIGlmICh0eXBlID09PSBcInNpbXBsZVwiKSB7XG4gICAgICB0aGlzLnNpbXBsZVNleHByKHNleHByKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiaGVscGVyXCIpIHtcbiAgICAgIHRoaXMuaGVscGVyU2V4cHIoc2V4cHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFtYmlndW91c1NleHByKHNleHByKTtcbiAgICB9XG4gIH0sXG5cbiAgSUQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgdGhpcy5hZGREZXB0aChpZC5kZXB0aCk7XG4gICAgdGhpcy5vcGNvZGUoJ2dldENvbnRleHQnLCBpZC5kZXB0aCk7XG5cbiAgICB2YXIgbmFtZSA9IGlkLnBhcnRzWzBdO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhpcy5vcGNvZGUoJ3B1c2hDb250ZXh0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3Bjb2RlKCdsb29rdXBPbkNvbnRleHQnLCBpZC5wYXJ0c1swXSk7XG4gICAgfVxuXG4gICAgZm9yKHZhciBpPTEsIGw9aWQucGFydHMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgdGhpcy5vcGNvZGUoJ2xvb2t1cCcsIGlkLnBhcnRzW2ldKTtcbiAgICB9XG4gIH0sXG5cbiAgREFUQTogZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMub3B0aW9ucy5kYXRhID0gdHJ1ZTtcbiAgICBpZiAoZGF0YS5pZC5pc1Njb3BlZCB8fCBkYXRhLmlkLmRlcHRoKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdTY29wZWQgZGF0YSByZWZlcmVuY2VzIGFyZSBub3Qgc3VwcG9ydGVkOiAnICsgZGF0YS5vcmlnaW5hbCwgZGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5vcGNvZGUoJ2xvb2t1cERhdGEnKTtcbiAgICB2YXIgcGFydHMgPSBkYXRhLmlkLnBhcnRzO1xuICAgIGZvcih2YXIgaT0wLCBsPXBhcnRzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgIHRoaXMub3Bjb2RlKCdsb29rdXAnLCBwYXJ0c1tpXSk7XG4gICAgfVxuICB9LFxuXG4gIFNUUklORzogZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hTdHJpbmcnLCBzdHJpbmcuc3RyaW5nKTtcbiAgfSxcblxuICBJTlRFR0VSOiBmdW5jdGlvbihpbnRlZ2VyKSB7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgaW50ZWdlci5pbnRlZ2VyKTtcbiAgfSxcblxuICBCT09MRUFOOiBmdW5jdGlvbihib29sKSB7XG4gICAgdGhpcy5vcGNvZGUoJ3B1c2hMaXRlcmFsJywgYm9vbC5ib29sKTtcbiAgfSxcblxuICBjb21tZW50OiBmdW5jdGlvbigpIHt9LFxuXG4gIC8vIEhFTFBFUlNcbiAgb3Bjb2RlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdGhpcy5vcGNvZGVzLnB1c2goeyBvcGNvZGU6IG5hbWUsIGFyZ3M6IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSB9KTtcbiAgfSxcblxuICBkZWNsYXJlOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMub3Bjb2Rlcy5wdXNoKHsgb3Bjb2RlOiAnREVDTEFSRScsIG5hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiAgfSxcblxuICBhZGREZXB0aDogZnVuY3Rpb24oZGVwdGgpIHtcbiAgICBpZihkZXB0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgIGlmKCF0aGlzLmRlcHRoc1tkZXB0aF0pIHtcbiAgICAgIHRoaXMuZGVwdGhzW2RlcHRoXSA9IHRydWU7XG4gICAgICB0aGlzLmRlcHRocy5saXN0LnB1c2goZGVwdGgpO1xuICAgIH1cbiAgfSxcblxuICBjbGFzc2lmeVNleHByOiBmdW5jdGlvbihzZXhwcikge1xuICAgIHZhciBpc0hlbHBlciAgID0gc2V4cHIuaXNIZWxwZXI7XG4gICAgdmFyIGlzRWxpZ2libGUgPSBzZXhwci5lbGlnaWJsZUhlbHBlcjtcbiAgICB2YXIgb3B0aW9ucyAgICA9IHRoaXMub3B0aW9ucztcblxuICAgIC8vIGlmIGFtYmlndW91cywgd2UgY2FuIHBvc3NpYmx5IHJlc29sdmUgdGhlIGFtYmlndWl0eSBub3dcbiAgICBpZiAoaXNFbGlnaWJsZSAmJiAhaXNIZWxwZXIpIHtcbiAgICAgIHZhciBuYW1lID0gc2V4cHIuaWQucGFydHNbMF07XG5cbiAgICAgIGlmIChvcHRpb25zLmtub3duSGVscGVyc1tuYW1lXSkge1xuICAgICAgICBpc0hlbHBlciA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMua25vd25IZWxwZXJzT25seSkge1xuICAgICAgICBpc0VsaWdpYmxlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzSGVscGVyKSB7IHJldHVybiBcImhlbHBlclwiOyB9XG4gICAgZWxzZSBpZiAoaXNFbGlnaWJsZSkgeyByZXR1cm4gXCJhbWJpZ3VvdXNcIjsgfVxuICAgIGVsc2UgeyByZXR1cm4gXCJzaW1wbGVcIjsgfVxuICB9LFxuXG4gIHB1c2hQYXJhbXM6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgIHZhciBpID0gcGFyYW1zLmxlbmd0aCwgcGFyYW07XG5cbiAgICB3aGlsZShpLS0pIHtcbiAgICAgIHBhcmFtID0gcGFyYW1zW2ldO1xuXG4gICAgICBpZih0aGlzLm9wdGlvbnMuc3RyaW5nUGFyYW1zKSB7XG4gICAgICAgIGlmKHBhcmFtLmRlcHRoKSB7XG4gICAgICAgICAgdGhpcy5hZGREZXB0aChwYXJhbS5kZXB0aCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wY29kZSgnZ2V0Q29udGV4dCcsIHBhcmFtLmRlcHRoIHx8IDApO1xuICAgICAgICB0aGlzLm9wY29kZSgncHVzaFN0cmluZ1BhcmFtJywgcGFyYW0uc3RyaW5nTW9kZVZhbHVlLCBwYXJhbS50eXBlKTtcblxuICAgICAgICBpZiAocGFyYW0udHlwZSA9PT0gJ3NleHByJykge1xuICAgICAgICAgIC8vIFN1YmV4cHJlc3Npb25zIGdldCBldmFsdWF0ZWQgYW5kIHBhc3NlZCBpblxuICAgICAgICAgIC8vIGluIHN0cmluZyBwYXJhbXMgbW9kZS5cbiAgICAgICAgICB0aGlzLnNleHByKHBhcmFtKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1twYXJhbS50eXBlXShwYXJhbSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHNldHVwRnVsbE11c3RhY2hlUGFyYW1zOiBmdW5jdGlvbihzZXhwciwgcHJvZ3JhbSwgaW52ZXJzZSkge1xuICAgIHZhciBwYXJhbXMgPSBzZXhwci5wYXJhbXM7XG4gICAgdGhpcy5wdXNoUGFyYW1zKHBhcmFtcyk7XG5cbiAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBwcm9ncmFtKTtcbiAgICB0aGlzLm9wY29kZSgncHVzaFByb2dyYW0nLCBpbnZlcnNlKTtcblxuICAgIGlmIChzZXhwci5oYXNoKSB7XG4gICAgICB0aGlzLmhhc2goc2V4cHIuaGFzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3Bjb2RlKCdlbXB0eUhhc2gnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG59O1xuXG5mdW5jdGlvbiBwcmVjb21waWxlKGlucHV0LCBvcHRpb25zLCBlbnYpIHtcbiAgaWYgKGlucHV0ID09IG51bGwgfHwgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgJiYgaW5wdXQuY29uc3RydWN0b3IgIT09IGVudi5BU1QuUHJvZ3JhbU5vZGUpKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIllvdSBtdXN0IHBhc3MgYSBzdHJpbmcgb3IgSGFuZGxlYmFycyBBU1QgdG8gSGFuZGxlYmFycy5wcmVjb21waWxlLiBZb3UgcGFzc2VkIFwiICsgaW5wdXQpO1xuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGlmICghKCdkYXRhJyBpbiBvcHRpb25zKSkge1xuICAgIG9wdGlvbnMuZGF0YSA9IHRydWU7XG4gIH1cblxuICB2YXIgYXN0ID0gZW52LnBhcnNlKGlucHV0KTtcbiAgdmFyIGVudmlyb25tZW50ID0gbmV3IGVudi5Db21waWxlcigpLmNvbXBpbGUoYXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIG5ldyBlbnYuSmF2YVNjcmlwdENvbXBpbGVyKCkuY29tcGlsZShlbnZpcm9ubWVudCwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydHMucHJlY29tcGlsZSA9IHByZWNvbXBpbGU7ZnVuY3Rpb24gY29tcGlsZShpbnB1dCwgb3B0aW9ucywgZW52KSB7XG4gIGlmIChpbnB1dCA9PSBudWxsIHx8ICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnICYmIGlucHV0LmNvbnN0cnVjdG9yICE9PSBlbnYuQVNULlByb2dyYW1Ob2RlKSkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJZb3UgbXVzdCBwYXNzIGEgc3RyaW5nIG9yIEhhbmRsZWJhcnMgQVNUIHRvIEhhbmRsZWJhcnMuY29tcGlsZS4gWW91IHBhc3NlZCBcIiArIGlucHV0KTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmICghKCdkYXRhJyBpbiBvcHRpb25zKSkge1xuICAgIG9wdGlvbnMuZGF0YSA9IHRydWU7XG4gIH1cblxuICB2YXIgY29tcGlsZWQ7XG5cbiAgZnVuY3Rpb24gY29tcGlsZUlucHV0KCkge1xuICAgIHZhciBhc3QgPSBlbnYucGFyc2UoaW5wdXQpO1xuICAgIHZhciBlbnZpcm9ubWVudCA9IG5ldyBlbnYuQ29tcGlsZXIoKS5jb21waWxlKGFzdCwgb3B0aW9ucyk7XG4gICAgdmFyIHRlbXBsYXRlU3BlYyA9IG5ldyBlbnYuSmF2YVNjcmlwdENvbXBpbGVyKCkuY29tcGlsZShlbnZpcm9ubWVudCwgb3B0aW9ucywgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICByZXR1cm4gZW52LnRlbXBsYXRlKHRlbXBsYXRlU3BlYyk7XG4gIH1cblxuICAvLyBUZW1wbGF0ZSBpcyBvbmx5IGNvbXBpbGVkIG9uIGZpcnN0IHVzZSBhbmQgY2FjaGVkIGFmdGVyIHRoYXQgcG9pbnQuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFjb21waWxlZCkge1xuICAgICAgY29tcGlsZWQgPSBjb21waWxlSW5wdXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBpbGVkLmNhbGwodGhpcywgY29udGV4dCwgb3B0aW9ucyk7XG4gIH07XG59XG5cbmV4cG9ydHMuY29tcGlsZSA9IGNvbXBpbGU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQ09NUElMRVJfUkVWSVNJT04gPSByZXF1aXJlKFwiLi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4uL2Jhc2VcIikuUkVWSVNJT05fQ0hBTkdFUztcbnZhciBsb2cgPSByZXF1aXJlKFwiLi4vYmFzZVwiKS5sb2c7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4uL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbmZ1bmN0aW9uIExpdGVyYWwodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBKYXZhU2NyaXB0Q29tcGlsZXIoKSB7fVxuXG5KYXZhU2NyaXB0Q29tcGlsZXIucHJvdG90eXBlID0ge1xuICAvLyBQVUJMSUMgQVBJOiBZb3UgY2FuIG92ZXJyaWRlIHRoZXNlIG1ldGhvZHMgaW4gYSBzdWJjbGFzcyB0byBwcm92aWRlXG4gIC8vIGFsdGVybmF0aXZlIGNvbXBpbGVkIGZvcm1zIGZvciBuYW1lIGxvb2t1cCBhbmQgYnVmZmVyaW5nIHNlbWFudGljc1xuICBuYW1lTG9va3VwOiBmdW5jdGlvbihwYXJlbnQsIG5hbWUgLyogLCB0eXBlKi8pIHtcbiAgICB2YXIgd3JhcCxcbiAgICAgICAgcmV0O1xuICAgIGlmIChwYXJlbnQuaW5kZXhPZignZGVwdGgnKSA9PT0gMCkge1xuICAgICAgd3JhcCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKC9eWzAtOV0rJC8udGVzdChuYW1lKSkge1xuICAgICAgcmV0ID0gcGFyZW50ICsgXCJbXCIgKyBuYW1lICsgXCJdXCI7XG4gICAgfSBlbHNlIGlmIChKYXZhU2NyaXB0Q29tcGlsZXIuaXNWYWxpZEphdmFTY3JpcHRWYXJpYWJsZU5hbWUobmFtZSkpIHtcbiAgICAgIHJldCA9IHBhcmVudCArIFwiLlwiICsgbmFtZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXQgPSBwYXJlbnQgKyBcIlsnXCIgKyBuYW1lICsgXCInXVwiO1xuICAgIH1cblxuICAgIGlmICh3cmFwKSB7XG4gICAgICByZXR1cm4gJygnICsgcGFyZW50ICsgJyAmJiAnICsgcmV0ICsgJyknO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgfSxcblxuICBjb21waWxlckluZm86IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OLFxuICAgICAgICB2ZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbcmV2aXNpb25dO1xuICAgIHJldHVybiBcInRoaXMuY29tcGlsZXJJbmZvID0gW1wiK3JldmlzaW9uK1wiLCdcIit2ZXJzaW9ucytcIiddO1xcblwiO1xuICB9LFxuXG4gIGFwcGVuZFRvQnVmZmVyOiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5lbnZpcm9ubWVudC5pc1NpbXBsZSkge1xuICAgICAgcmV0dXJuIFwicmV0dXJuIFwiICsgc3RyaW5nICsgXCI7XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFwcGVuZFRvQnVmZmVyOiB0cnVlLFxuICAgICAgICBjb250ZW50OiBzdHJpbmcsXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuIFwiYnVmZmVyICs9IFwiICsgc3RyaW5nICsgXCI7XCI7IH1cbiAgICAgIH07XG4gICAgfVxuICB9LFxuXG4gIGluaXRpYWxpemVCdWZmZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnF1b3RlZFN0cmluZyhcIlwiKTtcbiAgfSxcblxuICBuYW1lc3BhY2U6IFwiSGFuZGxlYmFyc1wiLFxuICAvLyBFTkQgUFVCTElDIEFQSVxuXG4gIGNvbXBpbGU6IGZ1bmN0aW9uKGVudmlyb25tZW50LCBvcHRpb25zLCBjb250ZXh0LCBhc09iamVjdCkge1xuICAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgbG9nKCdkZWJ1ZycsIHRoaXMuZW52aXJvbm1lbnQuZGlzYXNzZW1ibGUoKSArIFwiXFxuXFxuXCIpO1xuXG4gICAgdGhpcy5uYW1lID0gdGhpcy5lbnZpcm9ubWVudC5uYW1lO1xuICAgIHRoaXMuaXNDaGlsZCA9ICEhY29udGV4dDtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0IHx8IHtcbiAgICAgIHByb2dyYW1zOiBbXSxcbiAgICAgIGVudmlyb25tZW50czogW10sXG4gICAgICBhbGlhc2VzOiB7IH1cbiAgICB9O1xuXG4gICAgdGhpcy5wcmVhbWJsZSgpO1xuXG4gICAgdGhpcy5zdGFja1Nsb3QgPSAwO1xuICAgIHRoaXMuc3RhY2tWYXJzID0gW107XG4gICAgdGhpcy5yZWdpc3RlcnMgPSB7IGxpc3Q6IFtdIH07XG4gICAgdGhpcy5oYXNoZXMgPSBbXTtcbiAgICB0aGlzLmNvbXBpbGVTdGFjayA9IFtdO1xuICAgIHRoaXMuaW5saW5lU3RhY2sgPSBbXTtcblxuICAgIHRoaXMuY29tcGlsZUNoaWxkcmVuKGVudmlyb25tZW50LCBvcHRpb25zKTtcblxuICAgIHZhciBvcGNvZGVzID0gZW52aXJvbm1lbnQub3Bjb2Rlcywgb3Bjb2RlO1xuXG4gICAgdGhpcy5pID0gMDtcblxuICAgIGZvcih2YXIgbD1vcGNvZGVzLmxlbmd0aDsgdGhpcy5pPGw7IHRoaXMuaSsrKSB7XG4gICAgICBvcGNvZGUgPSBvcGNvZGVzW3RoaXMuaV07XG5cbiAgICAgIGlmKG9wY29kZS5vcGNvZGUgPT09ICdERUNMQVJFJykge1xuICAgICAgICB0aGlzW29wY29kZS5uYW1lXSA9IG9wY29kZS52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXNbb3Bjb2RlLm9wY29kZV0uYXBwbHkodGhpcywgb3Bjb2RlLmFyZ3MpO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXNldCB0aGUgc3RyaXBOZXh0IGZsYWcgaWYgaXQgd2FzIG5vdCBzZXQgYnkgdGhpcyBvcGVyYXRpb24uXG4gICAgICBpZiAob3Bjb2RlLm9wY29kZSAhPT0gdGhpcy5zdHJpcE5leHQpIHtcbiAgICAgICAgdGhpcy5zdHJpcE5leHQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGbHVzaCBhbnkgdHJhaWxpbmcgY29udGVudCB0aGF0IG1pZ2h0IGJlIHBlbmRpbmcuXG4gICAgdGhpcy5wdXNoU291cmNlKCcnKTtcblxuICAgIGlmICh0aGlzLnN0YWNrU2xvdCB8fCB0aGlzLmlubGluZVN0YWNrLmxlbmd0aCB8fCB0aGlzLmNvbXBpbGVTdGFjay5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ0NvbXBpbGUgY29tcGxldGVkIHdpdGggY29udGVudCBsZWZ0IG9uIHN0YWNrJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlRnVuY3Rpb25Db250ZXh0KGFzT2JqZWN0KTtcbiAgfSxcblxuICBwcmVhbWJsZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IFtdO1xuXG4gICAgaWYgKCF0aGlzLmlzQ2hpbGQpIHtcbiAgICAgIHZhciBuYW1lc3BhY2UgPSB0aGlzLm5hbWVzcGFjZTtcblxuICAgICAgdmFyIGNvcGllcyA9IFwiaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgXCIgKyBuYW1lc3BhY2UgKyBcIi5oZWxwZXJzKTtcIjtcbiAgICAgIGlmICh0aGlzLmVudmlyb25tZW50LnVzZVBhcnRpYWwpIHsgY29waWVzID0gY29waWVzICsgXCIgcGFydGlhbHMgPSB0aGlzLm1lcmdlKHBhcnRpYWxzLCBcIiArIG5hbWVzcGFjZSArIFwiLnBhcnRpYWxzKTtcIjsgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kYXRhKSB7IGNvcGllcyA9IGNvcGllcyArIFwiIGRhdGEgPSBkYXRhIHx8IHt9O1wiOyB9XG4gICAgICBvdXQucHVzaChjb3BpZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQucHVzaCgnJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVudmlyb25tZW50LmlzU2ltcGxlKSB7XG4gICAgICBvdXQucHVzaChcIiwgYnVmZmVyID0gXCIgKyB0aGlzLmluaXRpYWxpemVCdWZmZXIoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKFwiXCIpO1xuICAgIH1cblxuICAgIC8vIHRyYWNrIHRoZSBsYXN0IGNvbnRleHQgcHVzaGVkIGludG8gcGxhY2UgdG8gYWxsb3cgc2tpcHBpbmcgdGhlXG4gICAgLy8gZ2V0Q29udGV4dCBvcGNvZGUgd2hlbiBpdCB3b3VsZCBiZSBhIG5vb3BcbiAgICB0aGlzLmxhc3RDb250ZXh0ID0gMDtcbiAgICB0aGlzLnNvdXJjZSA9IG91dDtcbiAgfSxcblxuICBjcmVhdGVGdW5jdGlvbkNvbnRleHQ6IGZ1bmN0aW9uKGFzT2JqZWN0KSB7XG4gICAgdmFyIGxvY2FscyA9IHRoaXMuc3RhY2tWYXJzLmNvbmNhdCh0aGlzLnJlZ2lzdGVycy5saXN0KTtcblxuICAgIGlmKGxvY2Fscy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnNvdXJjZVsxXSA9IHRoaXMuc291cmNlWzFdICsgXCIsIFwiICsgbG9jYWxzLmpvaW4oXCIsIFwiKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBtaW5pbWl6ZXIgYWxpYXMgbWFwcGluZ3NcbiAgICBpZiAoIXRoaXMuaXNDaGlsZCkge1xuICAgICAgZm9yICh2YXIgYWxpYXMgaW4gdGhpcy5jb250ZXh0LmFsaWFzZXMpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dC5hbGlhc2VzLmhhc093blByb3BlcnR5KGFsaWFzKSkge1xuICAgICAgICAgIHRoaXMuc291cmNlWzFdID0gdGhpcy5zb3VyY2VbMV0gKyAnLCAnICsgYWxpYXMgKyAnPScgKyB0aGlzLmNvbnRleHQuYWxpYXNlc1thbGlhc107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2VbMV0pIHtcbiAgICAgIHRoaXMuc291cmNlWzFdID0gXCJ2YXIgXCIgKyB0aGlzLnNvdXJjZVsxXS5zdWJzdHJpbmcoMikgKyBcIjtcIjtcbiAgICB9XG5cbiAgICAvLyBNZXJnZSBjaGlsZHJlblxuICAgIGlmICghdGhpcy5pc0NoaWxkKSB7XG4gICAgICB0aGlzLnNvdXJjZVsxXSArPSAnXFxuJyArIHRoaXMuY29udGV4dC5wcm9ncmFtcy5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lbnZpcm9ubWVudC5pc1NpbXBsZSkge1xuICAgICAgdGhpcy5wdXNoU291cmNlKFwicmV0dXJuIGJ1ZmZlcjtcIik7XG4gICAgfVxuXG4gICAgdmFyIHBhcmFtcyA9IHRoaXMuaXNDaGlsZCA/IFtcImRlcHRoMFwiLCBcImRhdGFcIl0gOiBbXCJIYW5kbGViYXJzXCIsIFwiZGVwdGgwXCIsIFwiaGVscGVyc1wiLCBcInBhcnRpYWxzXCIsIFwiZGF0YVwiXTtcblxuICAgIGZvcih2YXIgaT0wLCBsPXRoaXMuZW52aXJvbm1lbnQuZGVwdGhzLmxpc3QubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgcGFyYW1zLnB1c2goXCJkZXB0aFwiICsgdGhpcy5lbnZpcm9ubWVudC5kZXB0aHMubGlzdFtpXSk7XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBhIHNlY29uZCBwYXNzIG92ZXIgdGhlIG91dHB1dCB0byBtZXJnZSBjb250ZW50IHdoZW4gcG9zc2libGVcbiAgICB2YXIgc291cmNlID0gdGhpcy5tZXJnZVNvdXJjZSgpO1xuXG4gICAgaWYgKCF0aGlzLmlzQ2hpbGQpIHtcbiAgICAgIHNvdXJjZSA9IHRoaXMuY29tcGlsZXJJbmZvKCkrc291cmNlO1xuICAgIH1cblxuICAgIGlmIChhc09iamVjdCkge1xuICAgICAgcGFyYW1zLnB1c2goc291cmNlKTtcblxuICAgICAgcmV0dXJuIEZ1bmN0aW9uLmFwcGx5KHRoaXMsIHBhcmFtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBmdW5jdGlvblNvdXJjZSA9ICdmdW5jdGlvbiAnICsgKHRoaXMubmFtZSB8fCAnJykgKyAnKCcgKyBwYXJhbXMuam9pbignLCcpICsgJykge1xcbiAgJyArIHNvdXJjZSArICd9JztcbiAgICAgIGxvZygnZGVidWcnLCBmdW5jdGlvblNvdXJjZSArIFwiXFxuXFxuXCIpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uU291cmNlO1xuICAgIH1cbiAgfSxcbiAgbWVyZ2VTb3VyY2U6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFdBUk46IFdlIGFyZSBub3QgaGFuZGxpbmcgdGhlIGNhc2Ugd2hlcmUgYnVmZmVyIGlzIHN0aWxsIHBvcHVsYXRlZCBhcyB0aGUgc291cmNlIHNob3VsZFxuICAgIC8vIG5vdCBoYXZlIGJ1ZmZlciBhcHBlbmQgb3BlcmF0aW9ucyBhcyB0aGVpciBmaW5hbCBhY3Rpb24uXG4gICAgdmFyIHNvdXJjZSA9ICcnLFxuICAgICAgICBidWZmZXI7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuc291cmNlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgbGluZSA9IHRoaXMuc291cmNlW2ldO1xuICAgICAgaWYgKGxpbmUuYXBwZW5kVG9CdWZmZXIpIHtcbiAgICAgICAgaWYgKGJ1ZmZlcikge1xuICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlciArICdcXG4gICAgKyAnICsgbGluZS5jb250ZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJ1ZmZlciA9IGxpbmUuY29udGVudDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGJ1ZmZlcikge1xuICAgICAgICAgIHNvdXJjZSArPSAnYnVmZmVyICs9ICcgKyBidWZmZXIgKyAnO1xcbiAgJztcbiAgICAgICAgICBidWZmZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgc291cmNlICs9IGxpbmUgKyAnXFxuICAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9LFxuXG4gIC8vIFtibG9ja1ZhbHVlXVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBpbnZlcnNlLCBwcm9ncmFtLCB2YWx1ZVxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHJldHVybiB2YWx1ZSBvZiBibG9ja0hlbHBlck1pc3NpbmdcbiAgLy9cbiAgLy8gVGhlIHB1cnBvc2Ugb2YgdGhpcyBvcGNvZGUgaXMgdG8gdGFrZSBhIGJsb2NrIG9mIHRoZSBmb3JtXG4gIC8vIGB7eyNmb299fS4uLnt7L2Zvb319YCwgcmVzb2x2ZSB0aGUgdmFsdWUgb2YgYGZvb2AsIGFuZFxuICAvLyByZXBsYWNlIGl0IG9uIHRoZSBzdGFjayB3aXRoIHRoZSByZXN1bHQgb2YgcHJvcGVybHlcbiAgLy8gaW52b2tpbmcgYmxvY2tIZWxwZXJNaXNzaW5nLlxuICBibG9ja1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNvbnRleHQuYWxpYXNlcy5ibG9ja0hlbHBlck1pc3NpbmcgPSAnaGVscGVycy5ibG9ja0hlbHBlck1pc3NpbmcnO1xuXG4gICAgdmFyIHBhcmFtcyA9IFtcImRlcHRoMFwiXTtcbiAgICB0aGlzLnNldHVwUGFyYW1zKDAsIHBhcmFtcyk7XG5cbiAgICB0aGlzLnJlcGxhY2VTdGFjayhmdW5jdGlvbihjdXJyZW50KSB7XG4gICAgICBwYXJhbXMuc3BsaWNlKDEsIDAsIGN1cnJlbnQpO1xuICAgICAgcmV0dXJuIFwiYmxvY2tIZWxwZXJNaXNzaW5nLmNhbGwoXCIgKyBwYXJhbXMuam9pbihcIiwgXCIpICsgXCIpXCI7XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gW2FtYmlndW91c0Jsb2NrVmFsdWVdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHZhbHVlXG4gIC8vIENvbXBpbGVyIHZhbHVlLCBiZWZvcmU6IGxhc3RIZWxwZXI9dmFsdWUgb2YgbGFzdCBmb3VuZCBoZWxwZXIsIGlmIGFueVxuICAvLyBPbiBzdGFjaywgYWZ0ZXIsIGlmIG5vIGxhc3RIZWxwZXI6IHNhbWUgYXMgW2Jsb2NrVmFsdWVdXG4gIC8vIE9uIHN0YWNrLCBhZnRlciwgaWYgbGFzdEhlbHBlcjogdmFsdWVcbiAgYW1iaWd1b3VzQmxvY2tWYWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jb250ZXh0LmFsaWFzZXMuYmxvY2tIZWxwZXJNaXNzaW5nID0gJ2hlbHBlcnMuYmxvY2tIZWxwZXJNaXNzaW5nJztcblxuICAgIHZhciBwYXJhbXMgPSBbXCJkZXB0aDBcIl07XG4gICAgdGhpcy5zZXR1cFBhcmFtcygwLCBwYXJhbXMpO1xuXG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLnRvcFN0YWNrKCk7XG4gICAgcGFyYW1zLnNwbGljZSgxLCAwLCBjdXJyZW50KTtcblxuICAgIHRoaXMucHVzaFNvdXJjZShcImlmICghXCIgKyB0aGlzLmxhc3RIZWxwZXIgKyBcIikgeyBcIiArIGN1cnJlbnQgKyBcIiA9IGJsb2NrSGVscGVyTWlzc2luZy5jYWxsKFwiICsgcGFyYW1zLmpvaW4oXCIsIFwiKSArIFwiKTsgfVwiKTtcbiAgfSxcblxuICAvLyBbYXBwZW5kQ29udGVudF1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG4gIC8vXG4gIC8vIEFwcGVuZHMgdGhlIHN0cmluZyB2YWx1ZSBvZiBgY29udGVudGAgdG8gdGhlIGN1cnJlbnQgYnVmZmVyXG4gIGFwcGVuZENvbnRlbnQ6IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgICBpZiAodGhpcy5wZW5kaW5nQ29udGVudCkge1xuICAgICAgY29udGVudCA9IHRoaXMucGVuZGluZ0NvbnRlbnQgKyBjb250ZW50O1xuICAgIH1cbiAgICBpZiAodGhpcy5zdHJpcE5leHQpIHtcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoL15cXHMrLywgJycpO1xuICAgIH1cblxuICAgIHRoaXMucGVuZGluZ0NvbnRlbnQgPSBjb250ZW50O1xuICB9LFxuXG4gIC8vIFtzdHJpcF1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG4gIC8vXG4gIC8vIFJlbW92ZXMgYW55IHRyYWlsaW5nIHdoaXRlc3BhY2UgZnJvbSB0aGUgcHJpb3IgY29udGVudCBub2RlIGFuZCBmbGFnc1xuICAvLyB0aGUgbmV4dCBvcGVyYXRpb24gZm9yIHN0cmlwcGluZyBpZiBpdCBpcyBhIGNvbnRlbnQgbm9kZS5cbiAgc3RyaXA6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnBlbmRpbmdDb250ZW50KSB7XG4gICAgICB0aGlzLnBlbmRpbmdDb250ZW50ID0gdGhpcy5wZW5kaW5nQ29udGVudC5yZXBsYWNlKC9cXHMrJC8sICcnKTtcbiAgICB9XG4gICAgdGhpcy5zdHJpcE5leHQgPSAnc3RyaXAnO1xuICB9LFxuXG4gIC8vIFthcHBlbmRdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IHZhbHVlLCAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cbiAgLy9cbiAgLy8gQ29lcmNlcyBgdmFsdWVgIHRvIGEgU3RyaW5nIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBjdXJyZW50IGJ1ZmZlci5cbiAgLy9cbiAgLy8gSWYgYHZhbHVlYCBpcyB0cnV0aHksIG9yIDAsIGl0IGlzIGNvZXJjZWQgaW50byBhIHN0cmluZyBhbmQgYXBwZW5kZWRcbiAgLy8gT3RoZXJ3aXNlLCB0aGUgZW1wdHkgc3RyaW5nIGlzIGFwcGVuZGVkXG4gIGFwcGVuZDogZnVuY3Rpb24oKSB7XG4gICAgLy8gRm9yY2UgYW55dGhpbmcgdGhhdCBpcyBpbmxpbmVkIG9udG8gdGhlIHN0YWNrIHNvIHdlIGRvbid0IGhhdmUgZHVwbGljYXRpb25cbiAgICAvLyB3aGVuIHdlIGV4YW1pbmUgbG9jYWxcbiAgICB0aGlzLmZsdXNoSW5saW5lKCk7XG4gICAgdmFyIGxvY2FsID0gdGhpcy5wb3BTdGFjaygpO1xuICAgIHRoaXMucHVzaFNvdXJjZShcImlmKFwiICsgbG9jYWwgKyBcIiB8fCBcIiArIGxvY2FsICsgXCIgPT09IDApIHsgXCIgKyB0aGlzLmFwcGVuZFRvQnVmZmVyKGxvY2FsKSArIFwiIH1cIik7XG4gICAgaWYgKHRoaXMuZW52aXJvbm1lbnQuaXNTaW1wbGUpIHtcbiAgICAgIHRoaXMucHVzaFNvdXJjZShcImVsc2UgeyBcIiArIHRoaXMuYXBwZW5kVG9CdWZmZXIoXCInJ1wiKSArIFwiIH1cIik7XG4gICAgfVxuICB9LFxuXG4gIC8vIFthcHBlbmRFc2NhcGVkXVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiB2YWx1ZSwgLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogLi4uXG4gIC8vXG4gIC8vIEVzY2FwZSBgdmFsdWVgIGFuZCBhcHBlbmQgaXQgdG8gdGhlIGJ1ZmZlclxuICBhcHBlbmRFc2NhcGVkOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNvbnRleHQuYWxpYXNlcy5lc2NhcGVFeHByZXNzaW9uID0gJ3RoaXMuZXNjYXBlRXhwcmVzc2lvbic7XG5cbiAgICB0aGlzLnB1c2hTb3VyY2UodGhpcy5hcHBlbmRUb0J1ZmZlcihcImVzY2FwZUV4cHJlc3Npb24oXCIgKyB0aGlzLnBvcFN0YWNrKCkgKyBcIilcIikpO1xuICB9LFxuXG4gIC8vIFtnZXRDb250ZXh0XVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiAuLi5cbiAgLy8gQ29tcGlsZXIgdmFsdWUsIGFmdGVyOiBsYXN0Q29udGV4dD1kZXB0aFxuICAvL1xuICAvLyBTZXQgdGhlIHZhbHVlIG9mIHRoZSBgbGFzdENvbnRleHRgIGNvbXBpbGVyIHZhbHVlIHRvIHRoZSBkZXB0aFxuICBnZXRDb250ZXh0OiBmdW5jdGlvbihkZXB0aCkge1xuICAgIGlmKHRoaXMubGFzdENvbnRleHQgIT09IGRlcHRoKSB7XG4gICAgICB0aGlzLmxhc3RDb250ZXh0ID0gZGVwdGg7XG4gICAgfVxuICB9LFxuXG4gIC8vIFtsb29rdXBPbkNvbnRleHRdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IGN1cnJlbnRDb250ZXh0W25hbWVdLCAuLi5cbiAgLy9cbiAgLy8gTG9va3MgdXAgdGhlIHZhbHVlIG9mIGBuYW1lYCBvbiB0aGUgY3VycmVudCBjb250ZXh0IGFuZCBwdXNoZXNcbiAgLy8gaXQgb250byB0aGUgc3RhY2suXG4gIGxvb2t1cE9uQ29udGV4dDogZnVuY3Rpb24obmFtZSkge1xuICAgIHRoaXMucHVzaCh0aGlzLm5hbWVMb29rdXAoJ2RlcHRoJyArIHRoaXMubGFzdENvbnRleHQsIG5hbWUsICdjb250ZXh0JykpO1xuICB9LFxuXG4gIC8vIFtwdXNoQ29udGV4dF1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogY3VycmVudENvbnRleHQsIC4uLlxuICAvL1xuICAvLyBQdXNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjdXJyZW50IGNvbnRleHQgb250byB0aGUgc3RhY2suXG4gIHB1c2hDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ2RlcHRoJyArIHRoaXMubGFzdENvbnRleHQpO1xuICB9LFxuXG4gIC8vIFtyZXNvbHZlUG9zc2libGVMYW1iZGFdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IHZhbHVlLCAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXNvbHZlZCB2YWx1ZSwgLi4uXG4gIC8vXG4gIC8vIElmIHRoZSBgdmFsdWVgIGlzIGEgbGFtYmRhLCByZXBsYWNlIGl0IG9uIHRoZSBzdGFjayBieVxuICAvLyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBsYW1iZGFcbiAgcmVzb2x2ZVBvc3NpYmxlTGFtYmRhOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNvbnRleHQuYWxpYXNlcy5mdW5jdGlvblR5cGUgPSAnXCJmdW5jdGlvblwiJztcblxuICAgIHRoaXMucmVwbGFjZVN0YWNrKGZ1bmN0aW9uKGN1cnJlbnQpIHtcbiAgICAgIHJldHVybiBcInR5cGVvZiBcIiArIGN1cnJlbnQgKyBcIiA9PT0gZnVuY3Rpb25UeXBlID8gXCIgKyBjdXJyZW50ICsgXCIuYXBwbHkoZGVwdGgwKSA6IFwiICsgY3VycmVudDtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBbbG9va3VwXVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiB2YWx1ZSwgLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogdmFsdWVbbmFtZV0sIC4uLlxuICAvL1xuICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSBvbiB0aGUgc3RhY2sgd2l0aCB0aGUgcmVzdWx0IG9mIGxvb2tpbmdcbiAgLy8gdXAgYG5hbWVgIG9uIGB2YWx1ZWBcbiAgbG9va3VwOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdGhpcy5yZXBsYWNlU3RhY2soZnVuY3Rpb24oY3VycmVudCkge1xuICAgICAgcmV0dXJuIGN1cnJlbnQgKyBcIiA9PSBudWxsIHx8IFwiICsgY3VycmVudCArIFwiID09PSBmYWxzZSA/IFwiICsgY3VycmVudCArIFwiIDogXCIgKyB0aGlzLm5hbWVMb29rdXAoY3VycmVudCwgbmFtZSwgJ2NvbnRleHQnKTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBbbG9va3VwRGF0YV1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogZGF0YSwgLi4uXG4gIC8vXG4gIC8vIFB1c2ggdGhlIGRhdGEgbG9va3VwIG9wZXJhdG9yXG4gIGxvb2t1cERhdGE6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgnZGF0YScpO1xuICB9LFxuXG4gIC8vIFtwdXNoU3RyaW5nUGFyYW1dXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHN0cmluZywgY3VycmVudENvbnRleHQsIC4uLlxuICAvL1xuICAvLyBUaGlzIG9wY29kZSBpcyBkZXNpZ25lZCBmb3IgdXNlIGluIHN0cmluZyBtb2RlLCB3aGljaFxuICAvLyBwcm92aWRlcyB0aGUgc3RyaW5nIHZhbHVlIG9mIGEgcGFyYW1ldGVyIGFsb25nIHdpdGggaXRzXG4gIC8vIGRlcHRoIHJhdGhlciB0aGFuIHJlc29sdmluZyBpdCBpbW1lZGlhdGVseS5cbiAgcHVzaFN0cmluZ1BhcmFtOiBmdW5jdGlvbihzdHJpbmcsIHR5cGUpIHtcbiAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwoJ2RlcHRoJyArIHRoaXMubGFzdENvbnRleHQpO1xuXG4gICAgdGhpcy5wdXNoU3RyaW5nKHR5cGUpO1xuXG4gICAgLy8gSWYgaXQncyBhIHN1YmV4cHJlc3Npb24sIHRoZSBzdHJpbmcgcmVzdWx0XG4gICAgLy8gd2lsbCBiZSBwdXNoZWQgYWZ0ZXIgdGhpcyBvcGNvZGUuXG4gICAgaWYgKHR5cGUgIT09ICdzZXhwcicpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3RyaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnB1c2hTdHJpbmcoc3RyaW5nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbChzdHJpbmcpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBlbXB0eUhhc2g6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCgne30nKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaW5nUGFyYW1zKSB7XG4gICAgICB0aGlzLnB1c2goJ3t9Jyk7IC8vIGhhc2hDb250ZXh0c1xuICAgICAgdGhpcy5wdXNoKCd7fScpOyAvLyBoYXNoVHlwZXNcbiAgICB9XG4gIH0sXG4gIHB1c2hIYXNoOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5oYXNoKSB7XG4gICAgICB0aGlzLmhhc2hlcy5wdXNoKHRoaXMuaGFzaCk7XG4gICAgfVxuICAgIHRoaXMuaGFzaCA9IHt2YWx1ZXM6IFtdLCB0eXBlczogW10sIGNvbnRleHRzOiBbXX07XG4gIH0sXG4gIHBvcEhhc2g6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoYXNoID0gdGhpcy5oYXNoO1xuICAgIHRoaXMuaGFzaCA9IHRoaXMuaGFzaGVzLnBvcCgpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpbmdQYXJhbXMpIHtcbiAgICAgIHRoaXMucHVzaCgneycgKyBoYXNoLmNvbnRleHRzLmpvaW4oJywnKSArICd9Jyk7XG4gICAgICB0aGlzLnB1c2goJ3snICsgaGFzaC50eXBlcy5qb2luKCcsJykgKyAnfScpO1xuICAgIH1cblxuICAgIHRoaXMucHVzaCgne1xcbiAgICAnICsgaGFzaC52YWx1ZXMuam9pbignLFxcbiAgICAnKSArICdcXG4gIH0nKTtcbiAgfSxcblxuICAvLyBbcHVzaFN0cmluZ11cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogcXVvdGVkU3RyaW5nKHN0cmluZyksIC4uLlxuICAvL1xuICAvLyBQdXNoIGEgcXVvdGVkIHZlcnNpb24gb2YgYHN0cmluZ2Agb250byB0aGUgc3RhY2tcbiAgcHVzaFN0cmluZzogZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKHRoaXMucXVvdGVkU3RyaW5nKHN0cmluZykpO1xuICB9LFxuXG4gIC8vIFtwdXNoXVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiBleHByLCAuLi5cbiAgLy9cbiAgLy8gUHVzaCBhbiBleHByZXNzaW9uIG9udG8gdGhlIHN0YWNrXG4gIHB1c2g6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICB0aGlzLmlubGluZVN0YWNrLnB1c2goZXhwcik7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH0sXG5cbiAgLy8gW3B1c2hMaXRlcmFsXVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiB2YWx1ZSwgLi4uXG4gIC8vXG4gIC8vIFB1c2hlcyBhIHZhbHVlIG9udG8gdGhlIHN0YWNrLiBUaGlzIG9wZXJhdGlvbiBwcmV2ZW50c1xuICAvLyB0aGUgY29tcGlsZXIgZnJvbSBjcmVhdGluZyBhIHRlbXBvcmFyeSB2YXJpYWJsZSB0byBob2xkXG4gIC8vIGl0LlxuICBwdXNoTGl0ZXJhbDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICB0aGlzLnB1c2hTdGFja0xpdGVyYWwodmFsdWUpO1xuICB9LFxuXG4gIC8vIFtwdXNoUHJvZ3JhbV1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogcHJvZ3JhbShndWlkKSwgLi4uXG4gIC8vXG4gIC8vIFB1c2ggYSBwcm9ncmFtIGV4cHJlc3Npb24gb250byB0aGUgc3RhY2suIFRoaXMgdGFrZXNcbiAgLy8gYSBjb21waWxlLXRpbWUgZ3VpZCBhbmQgY29udmVydHMgaXQgaW50byBhIHJ1bnRpbWUtYWNjZXNzaWJsZVxuICAvLyBleHByZXNzaW9uLlxuICBwdXNoUHJvZ3JhbTogZnVuY3Rpb24oZ3VpZCkge1xuICAgIGlmIChndWlkICE9IG51bGwpIHtcbiAgICAgIHRoaXMucHVzaFN0YWNrTGl0ZXJhbCh0aGlzLnByb2dyYW1FeHByZXNzaW9uKGd1aWQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXNoU3RhY2tMaXRlcmFsKG51bGwpO1xuICAgIH1cbiAgfSxcblxuICAvLyBbaW52b2tlSGVscGVyXVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiBoYXNoLCBpbnZlcnNlLCBwcm9ncmFtLCBwYXJhbXMuLi4sIC4uLlxuICAvLyBPbiBzdGFjaywgYWZ0ZXI6IHJlc3VsdCBvZiBoZWxwZXIgaW52b2NhdGlvblxuICAvL1xuICAvLyBQb3BzIG9mZiB0aGUgaGVscGVyJ3MgcGFyYW1ldGVycywgaW52b2tlcyB0aGUgaGVscGVyLFxuICAvLyBhbmQgcHVzaGVzIHRoZSBoZWxwZXIncyByZXR1cm4gdmFsdWUgb250byB0aGUgc3RhY2suXG4gIC8vXG4gIC8vIElmIHRoZSBoZWxwZXIgaXMgbm90IGZvdW5kLCBgaGVscGVyTWlzc2luZ2AgaXMgY2FsbGVkLlxuICBpbnZva2VIZWxwZXI6IGZ1bmN0aW9uKHBhcmFtU2l6ZSwgbmFtZSwgaXNSb290KSB7XG4gICAgdGhpcy5jb250ZXh0LmFsaWFzZXMuaGVscGVyTWlzc2luZyA9ICdoZWxwZXJzLmhlbHBlck1pc3NpbmcnO1xuICAgIHRoaXMudXNlUmVnaXN0ZXIoJ2hlbHBlcicpO1xuXG4gICAgdmFyIGhlbHBlciA9IHRoaXMubGFzdEhlbHBlciA9IHRoaXMuc2V0dXBIZWxwZXIocGFyYW1TaXplLCBuYW1lLCB0cnVlKTtcbiAgICB2YXIgbm9uSGVscGVyID0gdGhpcy5uYW1lTG9va3VwKCdkZXB0aCcgKyB0aGlzLmxhc3RDb250ZXh0LCBuYW1lLCAnY29udGV4dCcpO1xuXG4gICAgdmFyIGxvb2t1cCA9ICdoZWxwZXIgPSAnICsgaGVscGVyLm5hbWUgKyAnIHx8ICcgKyBub25IZWxwZXI7XG4gICAgaWYgKGhlbHBlci5wYXJhbXNJbml0KSB7XG4gICAgICBsb29rdXAgKz0gJywnICsgaGVscGVyLnBhcmFtc0luaXQ7XG4gICAgfVxuXG4gICAgdGhpcy5wdXNoKFxuICAgICAgJygnXG4gICAgICAgICsgbG9va3VwXG4gICAgICAgICsgJyxoZWxwZXIgJ1xuICAgICAgICAgICsgJz8gaGVscGVyLmNhbGwoJyArIGhlbHBlci5jYWxsUGFyYW1zICsgJykgJ1xuICAgICAgICAgICsgJzogaGVscGVyTWlzc2luZy5jYWxsKCcgKyBoZWxwZXIuaGVscGVyTWlzc2luZ1BhcmFtcyArICcpKScpO1xuXG4gICAgLy8gQWx3YXlzIGZsdXNoIHN1YmV4cHJlc3Npb25zLiBUaGlzIGlzIGJvdGggdG8gcHJldmVudCB0aGUgY29tcG91bmRpbmcgc2l6ZSBpc3N1ZSB0aGF0XG4gICAgLy8gb2NjdXJzIHdoZW4gdGhlIGNvZGUgaGFzIHRvIGJlIGR1cGxpY2F0ZWQgZm9yIGlubGluaW5nIGFuZCBhbHNvIHRvIHByZXZlbnQgZXJyb3JzXG4gICAgLy8gZHVlIHRvIHRoZSBpbmNvcnJlY3Qgb3B0aW9ucyBvYmplY3QgYmVpbmcgcGFzc2VkIGR1ZSB0byB0aGUgc2hhcmVkIHJlZ2lzdGVyLlxuICAgIGlmICghaXNSb290KSB7XG4gICAgICB0aGlzLmZsdXNoSW5saW5lKCk7XG4gICAgfVxuICB9LFxuXG4gIC8vIFtpbnZva2VLbm93bkhlbHBlcl1cbiAgLy9cbiAgLy8gT24gc3RhY2ssIGJlZm9yZTogaGFzaCwgaW52ZXJzZSwgcHJvZ3JhbSwgcGFyYW1zLi4uLCAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiByZXN1bHQgb2YgaGVscGVyIGludm9jYXRpb25cbiAgLy9cbiAgLy8gVGhpcyBvcGVyYXRpb24gaXMgdXNlZCB3aGVuIHRoZSBoZWxwZXIgaXMga25vd24gdG8gZXhpc3QsXG4gIC8vIHNvIGEgYGhlbHBlck1pc3NpbmdgIGZhbGxiYWNrIGlzIG5vdCByZXF1aXJlZC5cbiAgaW52b2tlS25vd25IZWxwZXI6IGZ1bmN0aW9uKHBhcmFtU2l6ZSwgbmFtZSkge1xuICAgIHZhciBoZWxwZXIgPSB0aGlzLnNldHVwSGVscGVyKHBhcmFtU2l6ZSwgbmFtZSk7XG4gICAgdGhpcy5wdXNoKGhlbHBlci5uYW1lICsgXCIuY2FsbChcIiArIGhlbHBlci5jYWxsUGFyYW1zICsgXCIpXCIpO1xuICB9LFxuXG4gIC8vIFtpbnZva2VBbWJpZ3VvdXNdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IGhhc2gsIGludmVyc2UsIHByb2dyYW0sIHBhcmFtcy4uLiwgLi4uXG4gIC8vIE9uIHN0YWNrLCBhZnRlcjogcmVzdWx0IG9mIGRpc2FtYmlndWF0aW9uXG4gIC8vXG4gIC8vIFRoaXMgb3BlcmF0aW9uIGlzIHVzZWQgd2hlbiBhbiBleHByZXNzaW9uIGxpa2UgYHt7Zm9vfX1gXG4gIC8vIGlzIHByb3ZpZGVkLCBidXQgd2UgZG9uJ3Qga25vdyBhdCBjb21waWxlLXRpbWUgd2hldGhlciBpdFxuICAvLyBpcyBhIGhlbHBlciBvciBhIHBhdGguXG4gIC8vXG4gIC8vIFRoaXMgb3BlcmF0aW9uIGVtaXRzIG1vcmUgY29kZSB0aGFuIHRoZSBvdGhlciBvcHRpb25zLFxuICAvLyBhbmQgY2FuIGJlIGF2b2lkZWQgYnkgcGFzc2luZyB0aGUgYGtub3duSGVscGVyc2AgYW5kXG4gIC8vIGBrbm93bkhlbHBlcnNPbmx5YCBmbGFncyBhdCBjb21waWxlLXRpbWUuXG4gIGludm9rZUFtYmlndW91czogZnVuY3Rpb24obmFtZSwgaGVscGVyQ2FsbCkge1xuICAgIHRoaXMuY29udGV4dC5hbGlhc2VzLmZ1bmN0aW9uVHlwZSA9ICdcImZ1bmN0aW9uXCInO1xuICAgIHRoaXMudXNlUmVnaXN0ZXIoJ2hlbHBlcicpO1xuXG4gICAgdGhpcy5lbXB0eUhhc2goKTtcbiAgICB2YXIgaGVscGVyID0gdGhpcy5zZXR1cEhlbHBlcigwLCBuYW1lLCBoZWxwZXJDYWxsKTtcblxuICAgIHZhciBoZWxwZXJOYW1lID0gdGhpcy5sYXN0SGVscGVyID0gdGhpcy5uYW1lTG9va3VwKCdoZWxwZXJzJywgbmFtZSwgJ2hlbHBlcicpO1xuXG4gICAgdmFyIG5vbkhlbHBlciA9IHRoaXMubmFtZUxvb2t1cCgnZGVwdGgnICsgdGhpcy5sYXN0Q29udGV4dCwgbmFtZSwgJ2NvbnRleHQnKTtcbiAgICB2YXIgbmV4dFN0YWNrID0gdGhpcy5uZXh0U3RhY2soKTtcblxuICAgIGlmIChoZWxwZXIucGFyYW1zSW5pdCkge1xuICAgICAgdGhpcy5wdXNoU291cmNlKGhlbHBlci5wYXJhbXNJbml0KTtcbiAgICB9XG4gICAgdGhpcy5wdXNoU291cmNlKCdpZiAoaGVscGVyID0gJyArIGhlbHBlck5hbWUgKyAnKSB7ICcgKyBuZXh0U3RhY2sgKyAnID0gaGVscGVyLmNhbGwoJyArIGhlbHBlci5jYWxsUGFyYW1zICsgJyk7IH0nKTtcbiAgICB0aGlzLnB1c2hTb3VyY2UoJ2Vsc2UgeyBoZWxwZXIgPSAnICsgbm9uSGVscGVyICsgJzsgJyArIG5leHRTdGFjayArICcgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbCgnICsgaGVscGVyLmNhbGxQYXJhbXMgKyAnKSA6IGhlbHBlcjsgfScpO1xuICB9LFxuXG4gIC8vIFtpbnZva2VQYXJ0aWFsXVxuICAvL1xuICAvLyBPbiBzdGFjaywgYmVmb3JlOiBjb250ZXh0LCAuLi5cbiAgLy8gT24gc3RhY2sgYWZ0ZXI6IHJlc3VsdCBvZiBwYXJ0aWFsIGludm9jYXRpb25cbiAgLy9cbiAgLy8gVGhpcyBvcGVyYXRpb24gcG9wcyBvZmYgYSBjb250ZXh0LCBpbnZva2VzIGEgcGFydGlhbCB3aXRoIHRoYXQgY29udGV4dCxcbiAgLy8gYW5kIHB1c2hlcyB0aGUgcmVzdWx0IG9mIHRoZSBpbnZvY2F0aW9uIGJhY2suXG4gIGludm9rZVBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgcGFyYW1zID0gW3RoaXMubmFtZUxvb2t1cCgncGFydGlhbHMnLCBuYW1lLCAncGFydGlhbCcpLCBcIidcIiArIG5hbWUgKyBcIidcIiwgdGhpcy5wb3BTdGFjaygpLCBcImhlbHBlcnNcIiwgXCJwYXJ0aWFsc1wiXTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGF0YSkge1xuICAgICAgcGFyYW1zLnB1c2goXCJkYXRhXCIpO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5hbGlhc2VzLnNlbGYgPSBcInRoaXNcIjtcbiAgICB0aGlzLnB1c2goXCJzZWxmLmludm9rZVBhcnRpYWwoXCIgKyBwYXJhbXMuam9pbihcIiwgXCIpICsgXCIpXCIpO1xuICB9LFxuXG4gIC8vIFthc3NpZ25Ub0hhc2hdXG4gIC8vXG4gIC8vIE9uIHN0YWNrLCBiZWZvcmU6IHZhbHVlLCBoYXNoLCAuLi5cbiAgLy8gT24gc3RhY2ssIGFmdGVyOiBoYXNoLCAuLi5cbiAgLy9cbiAgLy8gUG9wcyBhIHZhbHVlIGFuZCBoYXNoIG9mZiB0aGUgc3RhY2ssIGFzc2lnbnMgYGhhc2hba2V5XSA9IHZhbHVlYFxuICAvLyBhbmQgcHVzaGVzIHRoZSBoYXNoIGJhY2sgb250byB0aGUgc3RhY2suXG4gIGFzc2lnblRvSGFzaDogZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5wb3BTdGFjaygpLFxuICAgICAgICBjb250ZXh0LFxuICAgICAgICB0eXBlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zdHJpbmdQYXJhbXMpIHtcbiAgICAgIHR5cGUgPSB0aGlzLnBvcFN0YWNrKCk7XG4gICAgICBjb250ZXh0ID0gdGhpcy5wb3BTdGFjaygpO1xuICAgIH1cblxuICAgIHZhciBoYXNoID0gdGhpcy5oYXNoO1xuICAgIGlmIChjb250ZXh0KSB7XG4gICAgICBoYXNoLmNvbnRleHRzLnB1c2goXCInXCIgKyBrZXkgKyBcIic6IFwiICsgY29udGV4dCk7XG4gICAgfVxuICAgIGlmICh0eXBlKSB7XG4gICAgICBoYXNoLnR5cGVzLnB1c2goXCInXCIgKyBrZXkgKyBcIic6IFwiICsgdHlwZSk7XG4gICAgfVxuICAgIGhhc2gudmFsdWVzLnB1c2goXCInXCIgKyBrZXkgKyBcIic6IChcIiArIHZhbHVlICsgXCIpXCIpO1xuICB9LFxuXG4gIC8vIEhFTFBFUlNcblxuICBjb21waWxlcjogSmF2YVNjcmlwdENvbXBpbGVyLFxuXG4gIGNvbXBpbGVDaGlsZHJlbjogZnVuY3Rpb24oZW52aXJvbm1lbnQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY2hpbGRyZW4gPSBlbnZpcm9ubWVudC5jaGlsZHJlbiwgY2hpbGQsIGNvbXBpbGVyO1xuXG4gICAgZm9yKHZhciBpPTAsIGw9Y2hpbGRyZW4ubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIGNvbXBpbGVyID0gbmV3IHRoaXMuY29tcGlsZXIoKTtcblxuICAgICAgdmFyIGluZGV4ID0gdGhpcy5tYXRjaEV4aXN0aW5nUHJvZ3JhbShjaGlsZCk7XG5cbiAgICAgIGlmIChpbmRleCA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5wcm9ncmFtcy5wdXNoKCcnKTsgICAgIC8vIFBsYWNlaG9sZGVyIHRvIHByZXZlbnQgbmFtZSBjb25mbGljdHMgZm9yIG5lc3RlZCBjaGlsZHJlblxuICAgICAgICBpbmRleCA9IHRoaXMuY29udGV4dC5wcm9ncmFtcy5sZW5ndGg7XG4gICAgICAgIGNoaWxkLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGNoaWxkLm5hbWUgPSAncHJvZ3JhbScgKyBpbmRleDtcbiAgICAgICAgdGhpcy5jb250ZXh0LnByb2dyYW1zW2luZGV4XSA9IGNvbXBpbGVyLmNvbXBpbGUoY2hpbGQsIG9wdGlvbnMsIHRoaXMuY29udGV4dCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5lbnZpcm9ubWVudHNbaW5kZXhdID0gY2hpbGQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZC5pbmRleCA9IGluZGV4O1xuICAgICAgICBjaGlsZC5uYW1lID0gJ3Byb2dyYW0nICsgaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBtYXRjaEV4aXN0aW5nUHJvZ3JhbTogZnVuY3Rpb24oY2hpbGQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5jb250ZXh0LmVudmlyb25tZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGVudmlyb25tZW50ID0gdGhpcy5jb250ZXh0LmVudmlyb25tZW50c1tpXTtcbiAgICAgIGlmIChlbnZpcm9ubWVudCAmJiBlbnZpcm9ubWVudC5lcXVhbHMoY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBwcm9ncmFtRXhwcmVzc2lvbjogZnVuY3Rpb24oZ3VpZCkge1xuICAgIHRoaXMuY29udGV4dC5hbGlhc2VzLnNlbGYgPSBcInRoaXNcIjtcblxuICAgIGlmKGd1aWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFwic2VsZi5ub29wXCI7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkID0gdGhpcy5lbnZpcm9ubWVudC5jaGlsZHJlbltndWlkXSxcbiAgICAgICAgZGVwdGhzID0gY2hpbGQuZGVwdGhzLmxpc3QsIGRlcHRoO1xuXG4gICAgdmFyIHByb2dyYW1QYXJhbXMgPSBbY2hpbGQuaW5kZXgsIGNoaWxkLm5hbWUsIFwiZGF0YVwiXTtcblxuICAgIGZvcih2YXIgaT0wLCBsID0gZGVwdGhzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgIGRlcHRoID0gZGVwdGhzW2ldO1xuXG4gICAgICBpZihkZXB0aCA9PT0gMSkgeyBwcm9ncmFtUGFyYW1zLnB1c2goXCJkZXB0aDBcIik7IH1cbiAgICAgIGVsc2UgeyBwcm9ncmFtUGFyYW1zLnB1c2goXCJkZXB0aFwiICsgKGRlcHRoIC0gMSkpOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChkZXB0aHMubGVuZ3RoID09PSAwID8gXCJzZWxmLnByb2dyYW0oXCIgOiBcInNlbGYucHJvZ3JhbVdpdGhEZXB0aChcIikgKyBwcm9ncmFtUGFyYW1zLmpvaW4oXCIsIFwiKSArIFwiKVwiO1xuICB9LFxuXG4gIHJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgICB0aGlzLnVzZVJlZ2lzdGVyKG5hbWUpO1xuICAgIHRoaXMucHVzaFNvdXJjZShuYW1lICsgXCIgPSBcIiArIHZhbCArIFwiO1wiKTtcbiAgfSxcblxuICB1c2VSZWdpc3RlcjogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmKCF0aGlzLnJlZ2lzdGVyc1tuYW1lXSkge1xuICAgICAgdGhpcy5yZWdpc3RlcnNbbmFtZV0gPSB0cnVlO1xuICAgICAgdGhpcy5yZWdpc3RlcnMubGlzdC5wdXNoKG5hbWUpO1xuICAgIH1cbiAgfSxcblxuICBwdXNoU3RhY2tMaXRlcmFsOiBmdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIHRoaXMucHVzaChuZXcgTGl0ZXJhbChpdGVtKSk7XG4gIH0sXG5cbiAgcHVzaFNvdXJjZTogZnVuY3Rpb24oc291cmNlKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZ0NvbnRlbnQpIHtcbiAgICAgIHRoaXMuc291cmNlLnB1c2godGhpcy5hcHBlbmRUb0J1ZmZlcih0aGlzLnF1b3RlZFN0cmluZyh0aGlzLnBlbmRpbmdDb250ZW50KSkpO1xuICAgICAgdGhpcy5wZW5kaW5nQ29udGVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZS5wdXNoKHNvdXJjZSk7XG4gICAgfVxuICB9LFxuXG4gIHB1c2hTdGFjazogZnVuY3Rpb24oaXRlbSkge1xuICAgIHRoaXMuZmx1c2hJbmxpbmUoKTtcblxuICAgIHZhciBzdGFjayA9IHRoaXMuaW5jclN0YWNrKCk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIHRoaXMucHVzaFNvdXJjZShzdGFjayArIFwiID0gXCIgKyBpdGVtICsgXCI7XCIpO1xuICAgIH1cbiAgICB0aGlzLmNvbXBpbGVTdGFjay5wdXNoKHN0YWNrKTtcbiAgICByZXR1cm4gc3RhY2s7XG4gIH0sXG5cbiAgcmVwbGFjZVN0YWNrOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBwcmVmaXggPSAnJyxcbiAgICAgICAgaW5saW5lID0gdGhpcy5pc0lubGluZSgpLFxuICAgICAgICBzdGFjayxcbiAgICAgICAgY3JlYXRlZFN0YWNrLFxuICAgICAgICB1c2VkTGl0ZXJhbDtcblxuICAgIC8vIElmIHdlIGFyZSBjdXJyZW50bHkgaW5saW5lIHRoZW4gd2Ugd2FudCB0byBtZXJnZSB0aGUgaW5saW5lIHN0YXRlbWVudCBpbnRvIHRoZVxuICAgIC8vIHJlcGxhY2VtZW50IHN0YXRlbWVudCB2aWEgJywnXG4gICAgaWYgKGlubGluZSkge1xuICAgICAgdmFyIHRvcCA9IHRoaXMucG9wU3RhY2sodHJ1ZSk7XG5cbiAgICAgIGlmICh0b3AgaW5zdGFuY2VvZiBMaXRlcmFsKSB7XG4gICAgICAgIC8vIExpdGVyYWxzIGRvIG5vdCBuZWVkIHRvIGJlIGlubGluZWRcbiAgICAgICAgc3RhY2sgPSB0b3AudmFsdWU7XG4gICAgICAgIHVzZWRMaXRlcmFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEdldCBvciBjcmVhdGUgdGhlIGN1cnJlbnQgc3RhY2sgbmFtZSBmb3IgdXNlIGJ5IHRoZSBpbmxpbmVcbiAgICAgICAgY3JlYXRlZFN0YWNrID0gIXRoaXMuc3RhY2tTbG90O1xuICAgICAgICB2YXIgbmFtZSA9ICFjcmVhdGVkU3RhY2sgPyB0aGlzLnRvcFN0YWNrTmFtZSgpIDogdGhpcy5pbmNyU3RhY2soKTtcblxuICAgICAgICBwcmVmaXggPSAnKCcgKyB0aGlzLnB1c2gobmFtZSkgKyAnID0gJyArIHRvcCArICcpLCc7XG4gICAgICAgIHN0YWNrID0gdGhpcy50b3BTdGFjaygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdGFjayA9IHRoaXMudG9wU3RhY2soKTtcbiAgICB9XG5cbiAgICB2YXIgaXRlbSA9IGNhbGxiYWNrLmNhbGwodGhpcywgc3RhY2spO1xuXG4gICAgaWYgKGlubGluZSkge1xuICAgICAgaWYgKCF1c2VkTGl0ZXJhbCkge1xuICAgICAgICB0aGlzLnBvcFN0YWNrKCk7XG4gICAgICB9XG4gICAgICBpZiAoY3JlYXRlZFN0YWNrKSB7XG4gICAgICAgIHRoaXMuc3RhY2tTbG90LS07XG4gICAgICB9XG4gICAgICB0aGlzLnB1c2goJygnICsgcHJlZml4ICsgaXRlbSArICcpJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFByZXZlbnQgbW9kaWZpY2F0aW9uIG9mIHRoZSBjb250ZXh0IGRlcHRoIHZhcmlhYmxlLiBUaHJvdWdoIHJlcGxhY2VTdGFja1xuICAgICAgaWYgKCEvXnN0YWNrLy50ZXN0KHN0YWNrKSkge1xuICAgICAgICBzdGFjayA9IHRoaXMubmV4dFN0YWNrKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHVzaFNvdXJjZShzdGFjayArIFwiID0gKFwiICsgcHJlZml4ICsgaXRlbSArIFwiKTtcIik7XG4gICAgfVxuICAgIHJldHVybiBzdGFjaztcbiAgfSxcblxuICBuZXh0U3RhY2s6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnB1c2hTdGFjaygpO1xuICB9LFxuXG4gIGluY3JTdGFjazogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdGFja1Nsb3QrKztcbiAgICBpZih0aGlzLnN0YWNrU2xvdCA+IHRoaXMuc3RhY2tWYXJzLmxlbmd0aCkgeyB0aGlzLnN0YWNrVmFycy5wdXNoKFwic3RhY2tcIiArIHRoaXMuc3RhY2tTbG90KTsgfVxuICAgIHJldHVybiB0aGlzLnRvcFN0YWNrTmFtZSgpO1xuICB9LFxuICB0b3BTdGFja05hbWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcInN0YWNrXCIgKyB0aGlzLnN0YWNrU2xvdDtcbiAgfSxcbiAgZmx1c2hJbmxpbmU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbmxpbmVTdGFjayA9IHRoaXMuaW5saW5lU3RhY2s7XG4gICAgaWYgKGlubGluZVN0YWNrLmxlbmd0aCkge1xuICAgICAgdGhpcy5pbmxpbmVTdGFjayA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGlubGluZVN0YWNrLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IGlubGluZVN0YWNrW2ldO1xuICAgICAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBMaXRlcmFsKSB7XG4gICAgICAgICAgdGhpcy5jb21waWxlU3RhY2sucHVzaChlbnRyeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wdXNoU3RhY2soZW50cnkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBpc0lubGluZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5saW5lU3RhY2subGVuZ3RoO1xuICB9LFxuXG4gIHBvcFN0YWNrOiBmdW5jdGlvbih3cmFwcGVkKSB7XG4gICAgdmFyIGlubGluZSA9IHRoaXMuaXNJbmxpbmUoKSxcbiAgICAgICAgaXRlbSA9IChpbmxpbmUgPyB0aGlzLmlubGluZVN0YWNrIDogdGhpcy5jb21waWxlU3RhY2spLnBvcCgpO1xuXG4gICAgaWYgKCF3cmFwcGVkICYmIChpdGVtIGluc3RhbmNlb2YgTGl0ZXJhbCkpIHtcbiAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWlubGluZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhY2tTbG90KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignSW52YWxpZCBzdGFjayBwb3AnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YWNrU2xvdC0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9LFxuXG4gIHRvcFN0YWNrOiBmdW5jdGlvbih3cmFwcGVkKSB7XG4gICAgdmFyIHN0YWNrID0gKHRoaXMuaXNJbmxpbmUoKSA/IHRoaXMuaW5saW5lU3RhY2sgOiB0aGlzLmNvbXBpbGVTdGFjayksXG4gICAgICAgIGl0ZW0gPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcblxuICAgIGlmICghd3JhcHBlZCAmJiAoaXRlbSBpbnN0YW5jZW9mIExpdGVyYWwpKSB7XG4gICAgICByZXR1cm4gaXRlbS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICB9LFxuXG4gIHF1b3RlZFN0cmluZzogZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuICdcIicgKyBzdHJcbiAgICAgIC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXG4gICAgICAucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpXG4gICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG4gICAgICAucmVwbGFjZSgvXFxyL2csICdcXFxccicpXG4gICAgICAucmVwbGFjZSgvXFx1MjAyOC9nLCAnXFxcXHUyMDI4JykgICAvLyBQZXIgRWNtYS0yNjIgNy4zICsgNy44LjRcbiAgICAgIC5yZXBsYWNlKC9cXHUyMDI5L2csICdcXFxcdTIwMjknKSArICdcIic7XG4gIH0sXG5cbiAgc2V0dXBIZWxwZXI6IGZ1bmN0aW9uKHBhcmFtU2l6ZSwgbmFtZSwgbWlzc2luZ1BhcmFtcykge1xuICAgIHZhciBwYXJhbXMgPSBbXSxcbiAgICAgICAgcGFyYW1zSW5pdCA9IHRoaXMuc2V0dXBQYXJhbXMocGFyYW1TaXplLCBwYXJhbXMsIG1pc3NpbmdQYXJhbXMpO1xuICAgIHZhciBmb3VuZEhlbHBlciA9IHRoaXMubmFtZUxvb2t1cCgnaGVscGVycycsIG5hbWUsICdoZWxwZXInKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgIHBhcmFtc0luaXQ6IHBhcmFtc0luaXQsXG4gICAgICBuYW1lOiBmb3VuZEhlbHBlcixcbiAgICAgIGNhbGxQYXJhbXM6IFtcImRlcHRoMFwiXS5jb25jYXQocGFyYW1zKS5qb2luKFwiLCBcIiksXG4gICAgICBoZWxwZXJNaXNzaW5nUGFyYW1zOiBtaXNzaW5nUGFyYW1zICYmIFtcImRlcHRoMFwiLCB0aGlzLnF1b3RlZFN0cmluZyhuYW1lKV0uY29uY2F0KHBhcmFtcykuam9pbihcIiwgXCIpXG4gICAgfTtcbiAgfSxcblxuICBzZXR1cE9wdGlvbnM6IGZ1bmN0aW9uKHBhcmFtU2l6ZSwgcGFyYW1zKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBbXSwgY29udGV4dHMgPSBbXSwgdHlwZXMgPSBbXSwgcGFyYW0sIGludmVyc2UsIHByb2dyYW07XG5cbiAgICBvcHRpb25zLnB1c2goXCJoYXNoOlwiICsgdGhpcy5wb3BTdGFjaygpKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc3RyaW5nUGFyYW1zKSB7XG4gICAgICBvcHRpb25zLnB1c2goXCJoYXNoVHlwZXM6XCIgKyB0aGlzLnBvcFN0YWNrKCkpO1xuICAgICAgb3B0aW9ucy5wdXNoKFwiaGFzaENvbnRleHRzOlwiICsgdGhpcy5wb3BTdGFjaygpKTtcbiAgICB9XG5cbiAgICBpbnZlcnNlID0gdGhpcy5wb3BTdGFjaygpO1xuICAgIHByb2dyYW0gPSB0aGlzLnBvcFN0YWNrKCk7XG5cbiAgICAvLyBBdm9pZCBzZXR0aW5nIGZuIGFuZCBpbnZlcnNlIGlmIG5laXRoZXIgYXJlIHNldC4gVGhpcyBhbGxvd3NcbiAgICAvLyBoZWxwZXJzIHRvIGRvIGEgY2hlY2sgZm9yIGBpZiAob3B0aW9ucy5mbilgXG4gICAgaWYgKHByb2dyYW0gfHwgaW52ZXJzZSkge1xuICAgICAgaWYgKCFwcm9ncmFtKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5hbGlhc2VzLnNlbGYgPSBcInRoaXNcIjtcbiAgICAgICAgcHJvZ3JhbSA9IFwic2VsZi5ub29wXCI7XG4gICAgICB9XG5cbiAgICAgIGlmICghaW52ZXJzZSkge1xuICAgICAgICB0aGlzLmNvbnRleHQuYWxpYXNlcy5zZWxmID0gXCJ0aGlzXCI7XG4gICAgICAgIGludmVyc2UgPSBcInNlbGYubm9vcFwiO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zLnB1c2goXCJpbnZlcnNlOlwiICsgaW52ZXJzZSk7XG4gICAgICBvcHRpb25zLnB1c2goXCJmbjpcIiArIHByb2dyYW0pO1xuICAgIH1cblxuICAgIGZvcih2YXIgaT0wOyBpPHBhcmFtU2l6ZTsgaSsrKSB7XG4gICAgICBwYXJhbSA9IHRoaXMucG9wU3RhY2soKTtcbiAgICAgIHBhcmFtcy5wdXNoKHBhcmFtKTtcblxuICAgICAgaWYodGhpcy5vcHRpb25zLnN0cmluZ1BhcmFtcykge1xuICAgICAgICB0eXBlcy5wdXNoKHRoaXMucG9wU3RhY2soKSk7XG4gICAgICAgIGNvbnRleHRzLnB1c2godGhpcy5wb3BTdGFjaygpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnN0cmluZ1BhcmFtcykge1xuICAgICAgb3B0aW9ucy5wdXNoKFwiY29udGV4dHM6W1wiICsgY29udGV4dHMuam9pbihcIixcIikgKyBcIl1cIik7XG4gICAgICBvcHRpb25zLnB1c2goXCJ0eXBlczpbXCIgKyB0eXBlcy5qb2luKFwiLFwiKSArIFwiXVwiKTtcbiAgICB9XG5cbiAgICBpZih0aGlzLm9wdGlvbnMuZGF0YSkge1xuICAgICAgb3B0aW9ucy5wdXNoKFwiZGF0YTpkYXRhXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9LFxuXG4gIC8vIHRoZSBwYXJhbXMgYW5kIGNvbnRleHRzIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluIGFycmF5c1xuICAvLyB0byBmaWxsIGluXG4gIHNldHVwUGFyYW1zOiBmdW5jdGlvbihwYXJhbVNpemUsIHBhcmFtcywgdXNlUmVnaXN0ZXIpIHtcbiAgICB2YXIgb3B0aW9ucyA9ICd7JyArIHRoaXMuc2V0dXBPcHRpb25zKHBhcmFtU2l6ZSwgcGFyYW1zKS5qb2luKCcsJykgKyAnfSc7XG5cbiAgICBpZiAodXNlUmVnaXN0ZXIpIHtcbiAgICAgIHRoaXMudXNlUmVnaXN0ZXIoJ29wdGlvbnMnKTtcbiAgICAgIHBhcmFtcy5wdXNoKCdvcHRpb25zJyk7XG4gICAgICByZXR1cm4gJ29wdGlvbnM9JyArIG9wdGlvbnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmFtcy5wdXNoKG9wdGlvbnMpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufTtcblxudmFyIHJlc2VydmVkV29yZHMgPSAoXG4gIFwiYnJlYWsgZWxzZSBuZXcgdmFyXCIgK1xuICBcIiBjYXNlIGZpbmFsbHkgcmV0dXJuIHZvaWRcIiArXG4gIFwiIGNhdGNoIGZvciBzd2l0Y2ggd2hpbGVcIiArXG4gIFwiIGNvbnRpbnVlIGZ1bmN0aW9uIHRoaXMgd2l0aFwiICtcbiAgXCIgZGVmYXVsdCBpZiB0aHJvd1wiICtcbiAgXCIgZGVsZXRlIGluIHRyeVwiICtcbiAgXCIgZG8gaW5zdGFuY2VvZiB0eXBlb2ZcIiArXG4gIFwiIGFic3RyYWN0IGVudW0gaW50IHNob3J0XCIgK1xuICBcIiBib29sZWFuIGV4cG9ydCBpbnRlcmZhY2Ugc3RhdGljXCIgK1xuICBcIiBieXRlIGV4dGVuZHMgbG9uZyBzdXBlclwiICtcbiAgXCIgY2hhciBmaW5hbCBuYXRpdmUgc3luY2hyb25pemVkXCIgK1xuICBcIiBjbGFzcyBmbG9hdCBwYWNrYWdlIHRocm93c1wiICtcbiAgXCIgY29uc3QgZ290byBwcml2YXRlIHRyYW5zaWVudFwiICtcbiAgXCIgZGVidWdnZXIgaW1wbGVtZW50cyBwcm90ZWN0ZWQgdm9sYXRpbGVcIiArXG4gIFwiIGRvdWJsZSBpbXBvcnQgcHVibGljIGxldCB5aWVsZFwiXG4pLnNwbGl0KFwiIFwiKTtcblxudmFyIGNvbXBpbGVyV29yZHMgPSBKYXZhU2NyaXB0Q29tcGlsZXIuUkVTRVJWRURfV09SRFMgPSB7fTtcblxuZm9yKHZhciBpPTAsIGw9cmVzZXJ2ZWRXb3Jkcy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gIGNvbXBpbGVyV29yZHNbcmVzZXJ2ZWRXb3Jkc1tpXV0gPSB0cnVlO1xufVxuXG5KYXZhU2NyaXB0Q29tcGlsZXIuaXNWYWxpZEphdmFTY3JpcHRWYXJpYWJsZU5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGlmKCFKYXZhU2NyaXB0Q29tcGlsZXIuUkVTRVJWRURfV09SRFNbbmFtZV0gJiYgL15bYS16QS1aXyRdWzAtOWEtekEtWl8kXSokLy50ZXN0KG5hbWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBKYXZhU2NyaXB0Q29tcGlsZXI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG4vKiBKaXNvbiBnZW5lcmF0ZWQgcGFyc2VyICovXG52YXIgaGFuZGxlYmFycyA9IChmdW5jdGlvbigpe1xudmFyIHBhcnNlciA9IHt0cmFjZTogZnVuY3Rpb24gdHJhY2UoKSB7IH0sXG55eToge30sXG5zeW1ib2xzXzoge1wiZXJyb3JcIjoyLFwicm9vdFwiOjMsXCJzdGF0ZW1lbnRzXCI6NCxcIkVPRlwiOjUsXCJwcm9ncmFtXCI6NixcInNpbXBsZUludmVyc2VcIjo3LFwic3RhdGVtZW50XCI6OCxcIm9wZW5JbnZlcnNlXCI6OSxcImNsb3NlQmxvY2tcIjoxMCxcIm9wZW5CbG9ja1wiOjExLFwibXVzdGFjaGVcIjoxMixcInBhcnRpYWxcIjoxMyxcIkNPTlRFTlRcIjoxNCxcIkNPTU1FTlRcIjoxNSxcIk9QRU5fQkxPQ0tcIjoxNixcInNleHByXCI6MTcsXCJDTE9TRVwiOjE4LFwiT1BFTl9JTlZFUlNFXCI6MTksXCJPUEVOX0VOREJMT0NLXCI6MjAsXCJwYXRoXCI6MjEsXCJPUEVOXCI6MjIsXCJPUEVOX1VORVNDQVBFRFwiOjIzLFwiQ0xPU0VfVU5FU0NBUEVEXCI6MjQsXCJPUEVOX1BBUlRJQUxcIjoyNSxcInBhcnRpYWxOYW1lXCI6MjYsXCJwYXJ0aWFsX29wdGlvbjBcIjoyNyxcInNleHByX3JlcGV0aXRpb24wXCI6MjgsXCJzZXhwcl9vcHRpb24wXCI6MjksXCJkYXRhTmFtZVwiOjMwLFwicGFyYW1cIjozMSxcIlNUUklOR1wiOjMyLFwiSU5URUdFUlwiOjMzLFwiQk9PTEVBTlwiOjM0LFwiT1BFTl9TRVhQUlwiOjM1LFwiQ0xPU0VfU0VYUFJcIjozNixcImhhc2hcIjozNyxcImhhc2hfcmVwZXRpdGlvbl9wbHVzMFwiOjM4LFwiaGFzaFNlZ21lbnRcIjozOSxcIklEXCI6NDAsXCJFUVVBTFNcIjo0MSxcIkRBVEFcIjo0MixcInBhdGhTZWdtZW50c1wiOjQzLFwiU0VQXCI6NDQsXCIkYWNjZXB0XCI6MCxcIiRlbmRcIjoxfSxcbnRlcm1pbmFsc186IHsyOlwiZXJyb3JcIiw1OlwiRU9GXCIsMTQ6XCJDT05URU5UXCIsMTU6XCJDT01NRU5UXCIsMTY6XCJPUEVOX0JMT0NLXCIsMTg6XCJDTE9TRVwiLDE5OlwiT1BFTl9JTlZFUlNFXCIsMjA6XCJPUEVOX0VOREJMT0NLXCIsMjI6XCJPUEVOXCIsMjM6XCJPUEVOX1VORVNDQVBFRFwiLDI0OlwiQ0xPU0VfVU5FU0NBUEVEXCIsMjU6XCJPUEVOX1BBUlRJQUxcIiwzMjpcIlNUUklOR1wiLDMzOlwiSU5URUdFUlwiLDM0OlwiQk9PTEVBTlwiLDM1OlwiT1BFTl9TRVhQUlwiLDM2OlwiQ0xPU0VfU0VYUFJcIiw0MDpcIklEXCIsNDE6XCJFUVVBTFNcIiw0MjpcIkRBVEFcIiw0NDpcIlNFUFwifSxcbnByb2R1Y3Rpb25zXzogWzAsWzMsMl0sWzMsMV0sWzYsMl0sWzYsM10sWzYsMl0sWzYsMV0sWzYsMV0sWzYsMF0sWzQsMV0sWzQsMl0sWzgsM10sWzgsM10sWzgsMV0sWzgsMV0sWzgsMV0sWzgsMV0sWzExLDNdLFs5LDNdLFsxMCwzXSxbMTIsM10sWzEyLDNdLFsxMyw0XSxbNywyXSxbMTcsM10sWzE3LDFdLFszMSwxXSxbMzEsMV0sWzMxLDFdLFszMSwxXSxbMzEsMV0sWzMxLDNdLFszNywxXSxbMzksM10sWzI2LDFdLFsyNiwxXSxbMjYsMV0sWzMwLDJdLFsyMSwxXSxbNDMsM10sWzQzLDFdLFsyNywwXSxbMjcsMV0sWzI4LDBdLFsyOCwyXSxbMjksMF0sWzI5LDFdLFszOCwxXSxbMzgsMl1dLFxucGVyZm9ybUFjdGlvbjogZnVuY3Rpb24gYW5vbnltb3VzKHl5dGV4dCx5eWxlbmcseXlsaW5lbm8seXkseXlzdGF0ZSwkJCxfJCkge1xuXG52YXIgJDAgPSAkJC5sZW5ndGggLSAxO1xuc3dpdGNoICh5eXN0YXRlKSB7XG5jYXNlIDE6IHJldHVybiBuZXcgeXkuUHJvZ3JhbU5vZGUoJCRbJDAtMV0sIHRoaXMuXyQpOyBcbmJyZWFrO1xuY2FzZSAyOiByZXR1cm4gbmV3IHl5LlByb2dyYW1Ob2RlKFtdLCB0aGlzLl8kKTsgXG5icmVhaztcbmNhc2UgMzp0aGlzLiQgPSBuZXcgeXkuUHJvZ3JhbU5vZGUoW10sICQkWyQwLTFdLCAkJFskMF0sIHRoaXMuXyQpO1xuYnJlYWs7XG5jYXNlIDQ6dGhpcy4kID0gbmV3IHl5LlByb2dyYW1Ob2RlKCQkWyQwLTJdLCAkJFskMC0xXSwgJCRbJDBdLCB0aGlzLl8kKTtcbmJyZWFrO1xuY2FzZSA1OnRoaXMuJCA9IG5ldyB5eS5Qcm9ncmFtTm9kZSgkJFskMC0xXSwgJCRbJDBdLCBbXSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgNjp0aGlzLiQgPSBuZXcgeXkuUHJvZ3JhbU5vZGUoJCRbJDBdLCB0aGlzLl8kKTtcbmJyZWFrO1xuY2FzZSA3OnRoaXMuJCA9IG5ldyB5eS5Qcm9ncmFtTm9kZShbXSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgODp0aGlzLiQgPSBuZXcgeXkuUHJvZ3JhbU5vZGUoW10sIHRoaXMuXyQpO1xuYnJlYWs7XG5jYXNlIDk6dGhpcy4kID0gWyQkWyQwXV07XG5icmVhaztcbmNhc2UgMTA6ICQkWyQwLTFdLnB1c2goJCRbJDBdKTsgdGhpcy4kID0gJCRbJDAtMV07IFxuYnJlYWs7XG5jYXNlIDExOnRoaXMuJCA9IG5ldyB5eS5CbG9ja05vZGUoJCRbJDAtMl0sICQkWyQwLTFdLmludmVyc2UsICQkWyQwLTFdLCAkJFskMF0sIHRoaXMuXyQpO1xuYnJlYWs7XG5jYXNlIDEyOnRoaXMuJCA9IG5ldyB5eS5CbG9ja05vZGUoJCRbJDAtMl0sICQkWyQwLTFdLCAkJFskMC0xXS5pbnZlcnNlLCAkJFskMF0sIHRoaXMuXyQpO1xuYnJlYWs7XG5jYXNlIDEzOnRoaXMuJCA9ICQkWyQwXTtcbmJyZWFrO1xuY2FzZSAxNDp0aGlzLiQgPSAkJFskMF07XG5icmVhaztcbmNhc2UgMTU6dGhpcy4kID0gbmV3IHl5LkNvbnRlbnROb2RlKCQkWyQwXSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgMTY6dGhpcy4kID0gbmV3IHl5LkNvbW1lbnROb2RlKCQkWyQwXSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgMTc6dGhpcy4kID0gbmV3IHl5Lk11c3RhY2hlTm9kZSgkJFskMC0xXSwgbnVsbCwgJCRbJDAtMl0sIHN0cmlwRmxhZ3MoJCRbJDAtMl0sICQkWyQwXSksIHRoaXMuXyQpO1xuYnJlYWs7XG5jYXNlIDE4OnRoaXMuJCA9IG5ldyB5eS5NdXN0YWNoZU5vZGUoJCRbJDAtMV0sIG51bGwsICQkWyQwLTJdLCBzdHJpcEZsYWdzKCQkWyQwLTJdLCAkJFskMF0pLCB0aGlzLl8kKTtcbmJyZWFrO1xuY2FzZSAxOTp0aGlzLiQgPSB7cGF0aDogJCRbJDAtMV0sIHN0cmlwOiBzdHJpcEZsYWdzKCQkWyQwLTJdLCAkJFskMF0pfTtcbmJyZWFrO1xuY2FzZSAyMDp0aGlzLiQgPSBuZXcgeXkuTXVzdGFjaGVOb2RlKCQkWyQwLTFdLCBudWxsLCAkJFskMC0yXSwgc3RyaXBGbGFncygkJFskMC0yXSwgJCRbJDBdKSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgMjE6dGhpcy4kID0gbmV3IHl5Lk11c3RhY2hlTm9kZSgkJFskMC0xXSwgbnVsbCwgJCRbJDAtMl0sIHN0cmlwRmxhZ3MoJCRbJDAtMl0sICQkWyQwXSksIHRoaXMuXyQpO1xuYnJlYWs7XG5jYXNlIDIyOnRoaXMuJCA9IG5ldyB5eS5QYXJ0aWFsTm9kZSgkJFskMC0yXSwgJCRbJDAtMV0sIHN0cmlwRmxhZ3MoJCRbJDAtM10sICQkWyQwXSksIHRoaXMuXyQpO1xuYnJlYWs7XG5jYXNlIDIzOnRoaXMuJCA9IHN0cmlwRmxhZ3MoJCRbJDAtMV0sICQkWyQwXSk7XG5icmVhaztcbmNhc2UgMjQ6dGhpcy4kID0gbmV3IHl5LlNleHByTm9kZShbJCRbJDAtMl1dLmNvbmNhdCgkJFskMC0xXSksICQkWyQwXSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgMjU6dGhpcy4kID0gbmV3IHl5LlNleHByTm9kZShbJCRbJDBdXSwgbnVsbCwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgMjY6dGhpcy4kID0gJCRbJDBdO1xuYnJlYWs7XG5jYXNlIDI3OnRoaXMuJCA9IG5ldyB5eS5TdHJpbmdOb2RlKCQkWyQwXSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgMjg6dGhpcy4kID0gbmV3IHl5LkludGVnZXJOb2RlKCQkWyQwXSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgMjk6dGhpcy4kID0gbmV3IHl5LkJvb2xlYW5Ob2RlKCQkWyQwXSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgMzA6dGhpcy4kID0gJCRbJDBdO1xuYnJlYWs7XG5jYXNlIDMxOiQkWyQwLTFdLmlzSGVscGVyID0gdHJ1ZTsgdGhpcy4kID0gJCRbJDAtMV07XG5icmVhaztcbmNhc2UgMzI6dGhpcy4kID0gbmV3IHl5Lkhhc2hOb2RlKCQkWyQwXSwgdGhpcy5fJCk7XG5icmVhaztcbmNhc2UgMzM6dGhpcy4kID0gWyQkWyQwLTJdLCAkJFskMF1dO1xuYnJlYWs7XG5jYXNlIDM0OnRoaXMuJCA9IG5ldyB5eS5QYXJ0aWFsTmFtZU5vZGUoJCRbJDBdLCB0aGlzLl8kKTtcbmJyZWFrO1xuY2FzZSAzNTp0aGlzLiQgPSBuZXcgeXkuUGFydGlhbE5hbWVOb2RlKG5ldyB5eS5TdHJpbmdOb2RlKCQkWyQwXSwgdGhpcy5fJCksIHRoaXMuXyQpO1xuYnJlYWs7XG5jYXNlIDM2OnRoaXMuJCA9IG5ldyB5eS5QYXJ0aWFsTmFtZU5vZGUobmV3IHl5LkludGVnZXJOb2RlKCQkWyQwXSwgdGhpcy5fJCkpO1xuYnJlYWs7XG5jYXNlIDM3OnRoaXMuJCA9IG5ldyB5eS5EYXRhTm9kZSgkJFskMF0sIHRoaXMuXyQpO1xuYnJlYWs7XG5jYXNlIDM4OnRoaXMuJCA9IG5ldyB5eS5JZE5vZGUoJCRbJDBdLCB0aGlzLl8kKTtcbmJyZWFrO1xuY2FzZSAzOTogJCRbJDAtMl0ucHVzaCh7cGFydDogJCRbJDBdLCBzZXBhcmF0b3I6ICQkWyQwLTFdfSk7IHRoaXMuJCA9ICQkWyQwLTJdOyBcbmJyZWFrO1xuY2FzZSA0MDp0aGlzLiQgPSBbe3BhcnQ6ICQkWyQwXX1dO1xuYnJlYWs7XG5jYXNlIDQzOnRoaXMuJCA9IFtdO1xuYnJlYWs7XG5jYXNlIDQ0OiQkWyQwLTFdLnB1c2goJCRbJDBdKTtcbmJyZWFrO1xuY2FzZSA0Nzp0aGlzLiQgPSBbJCRbJDBdXTtcbmJyZWFrO1xuY2FzZSA0ODokJFskMC0xXS5wdXNoKCQkWyQwXSk7XG5icmVhaztcbn1cbn0sXG50YWJsZTogW3szOjEsNDoyLDU6WzEsM10sODo0LDk6NSwxMTo2LDEyOjcsMTM6OCwxNDpbMSw5XSwxNTpbMSwxMF0sMTY6WzEsMTJdLDE5OlsxLDExXSwyMjpbMSwxM10sMjM6WzEsMTRdLDI1OlsxLDE1XX0sezE6WzNdfSx7NTpbMSwxNl0sODoxNyw5OjUsMTE6NiwxMjo3LDEzOjgsMTQ6WzEsOV0sMTU6WzEsMTBdLDE2OlsxLDEyXSwxOTpbMSwxMV0sMjI6WzEsMTNdLDIzOlsxLDE0XSwyNTpbMSwxNV19LHsxOlsyLDJdfSx7NTpbMiw5XSwxNDpbMiw5XSwxNTpbMiw5XSwxNjpbMiw5XSwxOTpbMiw5XSwyMDpbMiw5XSwyMjpbMiw5XSwyMzpbMiw5XSwyNTpbMiw5XX0sezQ6MjAsNjoxOCw3OjE5LDg6NCw5OjUsMTE6NiwxMjo3LDEzOjgsMTQ6WzEsOV0sMTU6WzEsMTBdLDE2OlsxLDEyXSwxOTpbMSwyMV0sMjA6WzIsOF0sMjI6WzEsMTNdLDIzOlsxLDE0XSwyNTpbMSwxNV19LHs0OjIwLDY6MjIsNzoxOSw4OjQsOTo1LDExOjYsMTI6NywxMzo4LDE0OlsxLDldLDE1OlsxLDEwXSwxNjpbMSwxMl0sMTk6WzEsMjFdLDIwOlsyLDhdLDIyOlsxLDEzXSwyMzpbMSwxNF0sMjU6WzEsMTVdfSx7NTpbMiwxM10sMTQ6WzIsMTNdLDE1OlsyLDEzXSwxNjpbMiwxM10sMTk6WzIsMTNdLDIwOlsyLDEzXSwyMjpbMiwxM10sMjM6WzIsMTNdLDI1OlsyLDEzXX0sezU6WzIsMTRdLDE0OlsyLDE0XSwxNTpbMiwxNF0sMTY6WzIsMTRdLDE5OlsyLDE0XSwyMDpbMiwxNF0sMjI6WzIsMTRdLDIzOlsyLDE0XSwyNTpbMiwxNF19LHs1OlsyLDE1XSwxNDpbMiwxNV0sMTU6WzIsMTVdLDE2OlsyLDE1XSwxOTpbMiwxNV0sMjA6WzIsMTVdLDIyOlsyLDE1XSwyMzpbMiwxNV0sMjU6WzIsMTVdfSx7NTpbMiwxNl0sMTQ6WzIsMTZdLDE1OlsyLDE2XSwxNjpbMiwxNl0sMTk6WzIsMTZdLDIwOlsyLDE2XSwyMjpbMiwxNl0sMjM6WzIsMTZdLDI1OlsyLDE2XX0sezE3OjIzLDIxOjI0LDMwOjI1LDQwOlsxLDI4XSw0MjpbMSwyN10sNDM6MjZ9LHsxNzoyOSwyMToyNCwzMDoyNSw0MDpbMSwyOF0sNDI6WzEsMjddLDQzOjI2fSx7MTc6MzAsMjE6MjQsMzA6MjUsNDA6WzEsMjhdLDQyOlsxLDI3XSw0MzoyNn0sezE3OjMxLDIxOjI0LDMwOjI1LDQwOlsxLDI4XSw0MjpbMSwyN10sNDM6MjZ9LHsyMTozMywyNjozMiwzMjpbMSwzNF0sMzM6WzEsMzVdLDQwOlsxLDI4XSw0MzoyNn0sezE6WzIsMV19LHs1OlsyLDEwXSwxNDpbMiwxMF0sMTU6WzIsMTBdLDE2OlsyLDEwXSwxOTpbMiwxMF0sMjA6WzIsMTBdLDIyOlsyLDEwXSwyMzpbMiwxMF0sMjU6WzIsMTBdfSx7MTA6MzYsMjA6WzEsMzddfSx7NDozOCw4OjQsOTo1LDExOjYsMTI6NywxMzo4LDE0OlsxLDldLDE1OlsxLDEwXSwxNjpbMSwxMl0sMTk6WzEsMTFdLDIwOlsyLDddLDIyOlsxLDEzXSwyMzpbMSwxNF0sMjU6WzEsMTVdfSx7NzozOSw4OjE3LDk6NSwxMTo2LDEyOjcsMTM6OCwxNDpbMSw5XSwxNTpbMSwxMF0sMTY6WzEsMTJdLDE5OlsxLDIxXSwyMDpbMiw2XSwyMjpbMSwxM10sMjM6WzEsMTRdLDI1OlsxLDE1XX0sezE3OjIzLDE4OlsxLDQwXSwyMToyNCwzMDoyNSw0MDpbMSwyOF0sNDI6WzEsMjddLDQzOjI2fSx7MTA6NDEsMjA6WzEsMzddfSx7MTg6WzEsNDJdfSx7MTg6WzIsNDNdLDI0OlsyLDQzXSwyODo0MywzMjpbMiw0M10sMzM6WzIsNDNdLDM0OlsyLDQzXSwzNTpbMiw0M10sMzY6WzIsNDNdLDQwOlsyLDQzXSw0MjpbMiw0M119LHsxODpbMiwyNV0sMjQ6WzIsMjVdLDM2OlsyLDI1XX0sezE4OlsyLDM4XSwyNDpbMiwzOF0sMzI6WzIsMzhdLDMzOlsyLDM4XSwzNDpbMiwzOF0sMzU6WzIsMzhdLDM2OlsyLDM4XSw0MDpbMiwzOF0sNDI6WzIsMzhdLDQ0OlsxLDQ0XX0sezIxOjQ1LDQwOlsxLDI4XSw0MzoyNn0sezE4OlsyLDQwXSwyNDpbMiw0MF0sMzI6WzIsNDBdLDMzOlsyLDQwXSwzNDpbMiw0MF0sMzU6WzIsNDBdLDM2OlsyLDQwXSw0MDpbMiw0MF0sNDI6WzIsNDBdLDQ0OlsyLDQwXX0sezE4OlsxLDQ2XX0sezE4OlsxLDQ3XX0sezI0OlsxLDQ4XX0sezE4OlsyLDQxXSwyMTo1MCwyNzo0OSw0MDpbMSwyOF0sNDM6MjZ9LHsxODpbMiwzNF0sNDA6WzIsMzRdfSx7MTg6WzIsMzVdLDQwOlsyLDM1XX0sezE4OlsyLDM2XSw0MDpbMiwzNl19LHs1OlsyLDExXSwxNDpbMiwxMV0sMTU6WzIsMTFdLDE2OlsyLDExXSwxOTpbMiwxMV0sMjA6WzIsMTFdLDIyOlsyLDExXSwyMzpbMiwxMV0sMjU6WzIsMTFdfSx7MjE6NTEsNDA6WzEsMjhdLDQzOjI2fSx7ODoxNyw5OjUsMTE6NiwxMjo3LDEzOjgsMTQ6WzEsOV0sMTU6WzEsMTBdLDE2OlsxLDEyXSwxOTpbMSwxMV0sMjA6WzIsM10sMjI6WzEsMTNdLDIzOlsxLDE0XSwyNTpbMSwxNV19LHs0OjUyLDg6NCw5OjUsMTE6NiwxMjo3LDEzOjgsMTQ6WzEsOV0sMTU6WzEsMTBdLDE2OlsxLDEyXSwxOTpbMSwxMV0sMjA6WzIsNV0sMjI6WzEsMTNdLDIzOlsxLDE0XSwyNTpbMSwxNV19LHsxNDpbMiwyM10sMTU6WzIsMjNdLDE2OlsyLDIzXSwxOTpbMiwyM10sMjA6WzIsMjNdLDIyOlsyLDIzXSwyMzpbMiwyM10sMjU6WzIsMjNdfSx7NTpbMiwxMl0sMTQ6WzIsMTJdLDE1OlsyLDEyXSwxNjpbMiwxMl0sMTk6WzIsMTJdLDIwOlsyLDEyXSwyMjpbMiwxMl0sMjM6WzIsMTJdLDI1OlsyLDEyXX0sezE0OlsyLDE4XSwxNTpbMiwxOF0sMTY6WzIsMThdLDE5OlsyLDE4XSwyMDpbMiwxOF0sMjI6WzIsMThdLDIzOlsyLDE4XSwyNTpbMiwxOF19LHsxODpbMiw0NV0sMjE6NTYsMjQ6WzIsNDVdLDI5OjUzLDMwOjYwLDMxOjU0LDMyOlsxLDU3XSwzMzpbMSw1OF0sMzQ6WzEsNTldLDM1OlsxLDYxXSwzNjpbMiw0NV0sMzc6NTUsMzg6NjIsMzk6NjMsNDA6WzEsNjRdLDQyOlsxLDI3XSw0MzoyNn0sezQwOlsxLDY1XX0sezE4OlsyLDM3XSwyNDpbMiwzN10sMzI6WzIsMzddLDMzOlsyLDM3XSwzNDpbMiwzN10sMzU6WzIsMzddLDM2OlsyLDM3XSw0MDpbMiwzN10sNDI6WzIsMzddfSx7MTQ6WzIsMTddLDE1OlsyLDE3XSwxNjpbMiwxN10sMTk6WzIsMTddLDIwOlsyLDE3XSwyMjpbMiwxN10sMjM6WzIsMTddLDI1OlsyLDE3XX0sezU6WzIsMjBdLDE0OlsyLDIwXSwxNTpbMiwyMF0sMTY6WzIsMjBdLDE5OlsyLDIwXSwyMDpbMiwyMF0sMjI6WzIsMjBdLDIzOlsyLDIwXSwyNTpbMiwyMF19LHs1OlsyLDIxXSwxNDpbMiwyMV0sMTU6WzIsMjFdLDE2OlsyLDIxXSwxOTpbMiwyMV0sMjA6WzIsMjFdLDIyOlsyLDIxXSwyMzpbMiwyMV0sMjU6WzIsMjFdfSx7MTg6WzEsNjZdfSx7MTg6WzIsNDJdfSx7MTg6WzEsNjddfSx7ODoxNyw5OjUsMTE6NiwxMjo3LDEzOjgsMTQ6WzEsOV0sMTU6WzEsMTBdLDE2OlsxLDEyXSwxOTpbMSwxMV0sMjA6WzIsNF0sMjI6WzEsMTNdLDIzOlsxLDE0XSwyNTpbMSwxNV19LHsxODpbMiwyNF0sMjQ6WzIsMjRdLDM2OlsyLDI0XX0sezE4OlsyLDQ0XSwyNDpbMiw0NF0sMzI6WzIsNDRdLDMzOlsyLDQ0XSwzNDpbMiw0NF0sMzU6WzIsNDRdLDM2OlsyLDQ0XSw0MDpbMiw0NF0sNDI6WzIsNDRdfSx7MTg6WzIsNDZdLDI0OlsyLDQ2XSwzNjpbMiw0Nl19LHsxODpbMiwyNl0sMjQ6WzIsMjZdLDMyOlsyLDI2XSwzMzpbMiwyNl0sMzQ6WzIsMjZdLDM1OlsyLDI2XSwzNjpbMiwyNl0sNDA6WzIsMjZdLDQyOlsyLDI2XX0sezE4OlsyLDI3XSwyNDpbMiwyN10sMzI6WzIsMjddLDMzOlsyLDI3XSwzNDpbMiwyN10sMzU6WzIsMjddLDM2OlsyLDI3XSw0MDpbMiwyN10sNDI6WzIsMjddfSx7MTg6WzIsMjhdLDI0OlsyLDI4XSwzMjpbMiwyOF0sMzM6WzIsMjhdLDM0OlsyLDI4XSwzNTpbMiwyOF0sMzY6WzIsMjhdLDQwOlsyLDI4XSw0MjpbMiwyOF19LHsxODpbMiwyOV0sMjQ6WzIsMjldLDMyOlsyLDI5XSwzMzpbMiwyOV0sMzQ6WzIsMjldLDM1OlsyLDI5XSwzNjpbMiwyOV0sNDA6WzIsMjldLDQyOlsyLDI5XX0sezE4OlsyLDMwXSwyNDpbMiwzMF0sMzI6WzIsMzBdLDMzOlsyLDMwXSwzNDpbMiwzMF0sMzU6WzIsMzBdLDM2OlsyLDMwXSw0MDpbMiwzMF0sNDI6WzIsMzBdfSx7MTc6NjgsMjE6MjQsMzA6MjUsNDA6WzEsMjhdLDQyOlsxLDI3XSw0MzoyNn0sezE4OlsyLDMyXSwyNDpbMiwzMl0sMzY6WzIsMzJdLDM5OjY5LDQwOlsxLDcwXX0sezE4OlsyLDQ3XSwyNDpbMiw0N10sMzY6WzIsNDddLDQwOlsyLDQ3XX0sezE4OlsyLDQwXSwyNDpbMiw0MF0sMzI6WzIsNDBdLDMzOlsyLDQwXSwzNDpbMiw0MF0sMzU6WzIsNDBdLDM2OlsyLDQwXSw0MDpbMiw0MF0sNDE6WzEsNzFdLDQyOlsyLDQwXSw0NDpbMiw0MF19LHsxODpbMiwzOV0sMjQ6WzIsMzldLDMyOlsyLDM5XSwzMzpbMiwzOV0sMzQ6WzIsMzldLDM1OlsyLDM5XSwzNjpbMiwzOV0sNDA6WzIsMzldLDQyOlsyLDM5XSw0NDpbMiwzOV19LHs1OlsyLDIyXSwxNDpbMiwyMl0sMTU6WzIsMjJdLDE2OlsyLDIyXSwxOTpbMiwyMl0sMjA6WzIsMjJdLDIyOlsyLDIyXSwyMzpbMiwyMl0sMjU6WzIsMjJdfSx7NTpbMiwxOV0sMTQ6WzIsMTldLDE1OlsyLDE5XSwxNjpbMiwxOV0sMTk6WzIsMTldLDIwOlsyLDE5XSwyMjpbMiwxOV0sMjM6WzIsMTldLDI1OlsyLDE5XX0sezM2OlsxLDcyXX0sezE4OlsyLDQ4XSwyNDpbMiw0OF0sMzY6WzIsNDhdLDQwOlsyLDQ4XX0sezQxOlsxLDcxXX0sezIxOjU2LDMwOjYwLDMxOjczLDMyOlsxLDU3XSwzMzpbMSw1OF0sMzQ6WzEsNTldLDM1OlsxLDYxXSw0MDpbMSwyOF0sNDI6WzEsMjddLDQzOjI2fSx7MTg6WzIsMzFdLDI0OlsyLDMxXSwzMjpbMiwzMV0sMzM6WzIsMzFdLDM0OlsyLDMxXSwzNTpbMiwzMV0sMzY6WzIsMzFdLDQwOlsyLDMxXSw0MjpbMiwzMV19LHsxODpbMiwzM10sMjQ6WzIsMzNdLDM2OlsyLDMzXSw0MDpbMiwzM119XSxcbmRlZmF1bHRBY3Rpb25zOiB7MzpbMiwyXSwxNjpbMiwxXSw1MDpbMiw0Ml19LFxucGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcbn0sXG5wYXJzZTogZnVuY3Rpb24gcGFyc2UoaW5wdXQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsIHN0YWNrID0gWzBdLCB2c3RhY2sgPSBbbnVsbF0sIGxzdGFjayA9IFtdLCB0YWJsZSA9IHRoaXMudGFibGUsIHl5dGV4dCA9IFwiXCIsIHl5bGluZW5vID0gMCwgeXlsZW5nID0gMCwgcmVjb3ZlcmluZyA9IDAsIFRFUlJPUiA9IDIsIEVPRiA9IDE7XG4gICAgdGhpcy5sZXhlci5zZXRJbnB1dChpbnB1dCk7XG4gICAgdGhpcy5sZXhlci55eSA9IHRoaXMueXk7XG4gICAgdGhpcy55eS5sZXhlciA9IHRoaXMubGV4ZXI7XG4gICAgdGhpcy55eS5wYXJzZXIgPSB0aGlzO1xuICAgIGlmICh0eXBlb2YgdGhpcy5sZXhlci55eWxsb2MgPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgdGhpcy5sZXhlci55eWxsb2MgPSB7fTtcbiAgICB2YXIgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICBsc3RhY2sucHVzaCh5eWxvYyk7XG4gICAgdmFyIHJhbmdlcyA9IHRoaXMubGV4ZXIub3B0aW9ucyAmJiB0aGlzLmxleGVyLm9wdGlvbnMucmFuZ2VzO1xuICAgIGlmICh0eXBlb2YgdGhpcy55eS5wYXJzZUVycm9yID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRoaXMueXkucGFyc2VFcnJvcjtcbiAgICBmdW5jdGlvbiBwb3BTdGFjayhuKSB7XG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IHN0YWNrLmxlbmd0aCAtIDIgKiBuO1xuICAgICAgICB2c3RhY2subGVuZ3RoID0gdnN0YWNrLmxlbmd0aCAtIG47XG4gICAgICAgIGxzdGFjay5sZW5ndGggPSBsc3RhY2subGVuZ3RoIC0gbjtcbiAgICB9XG4gICAgZnVuY3Rpb24gbGV4KCkge1xuICAgICAgICB2YXIgdG9rZW47XG4gICAgICAgIHRva2VuID0gc2VsZi5sZXhlci5sZXgoKSB8fCAxO1xuICAgICAgICBpZiAodHlwZW9mIHRva2VuICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHNlbGYuc3ltYm9sc19bdG9rZW5dIHx8IHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9XG4gICAgdmFyIHN5bWJvbCwgcHJlRXJyb3JTeW1ib2wsIHN0YXRlLCBhY3Rpb24sIGEsIHIsIHl5dmFsID0ge30sIHAsIGxlbiwgbmV3U3RhdGUsIGV4cGVjdGVkO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXSkge1xuICAgICAgICAgICAgYWN0aW9uID0gdGhpcy5kZWZhdWx0QWN0aW9uc1tzdGF0ZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc3ltYm9sID09PSBudWxsIHx8IHR5cGVvZiBzeW1ib2wgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHN5bWJvbCA9IGxleCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtzeW1ib2xdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSBcInVuZGVmaW5lZFwiIHx8ICFhY3Rpb24ubGVuZ3RoIHx8ICFhY3Rpb25bMF0pIHtcbiAgICAgICAgICAgIHZhciBlcnJTdHIgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKCFyZWNvdmVyaW5nKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHAgaW4gdGFibGVbc3RhdGVdKVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXJtaW5hbHNfW3BdICYmIHAgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZC5wdXNoKFwiJ1wiICsgdGhpcy50ZXJtaW5hbHNfW3BdICsgXCInXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIuc2hvd1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGVyclN0ciA9IFwiUGFyc2UgZXJyb3Igb24gbGluZSBcIiArICh5eWxpbmVubyArIDEpICsgXCI6XFxuXCIgKyB0aGlzLmxleGVyLnNob3dQb3NpdGlvbigpICsgXCJcXG5FeHBlY3RpbmcgXCIgKyBleHBlY3RlZC5qb2luKFwiLCBcIikgKyBcIiwgZ290ICdcIiArICh0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wpICsgXCInXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gXCJQYXJzZSBlcnJvciBvbiBsaW5lIFwiICsgKHl5bGluZW5vICsgMSkgKyBcIjogVW5leHBlY3RlZCBcIiArIChzeW1ib2wgPT0gMT9cImVuZCBvZiBpbnB1dFwiOlwiJ1wiICsgKHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCkgKyBcIidcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFcnJvcihlcnJTdHIsIHt0ZXh0OiB0aGlzLmxleGVyLm1hdGNoLCB0b2tlbjogdGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sLCBsaW5lOiB0aGlzLmxleGVyLnl5bGluZW5vLCBsb2M6IHl5bG9jLCBleHBlY3RlZDogZXhwZWN0ZWR9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uWzBdIGluc3RhbmNlb2YgQXJyYXkgJiYgYWN0aW9uLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcnNlIEVycm9yOiBtdWx0aXBsZSBhY3Rpb25zIHBvc3NpYmxlIGF0IHN0YXRlOiBcIiArIHN0YXRlICsgXCIsIHRva2VuOiBcIiArIHN5bWJvbCk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgc3RhY2sucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgdnN0YWNrLnB1c2godGhpcy5sZXhlci55eXRleHQpO1xuICAgICAgICAgICAgbHN0YWNrLnB1c2godGhpcy5sZXhlci55eWxsb2MpO1xuICAgICAgICAgICAgc3RhY2sucHVzaChhY3Rpb25bMV0pO1xuICAgICAgICAgICAgc3ltYm9sID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghcHJlRXJyb3JTeW1ib2wpIHtcbiAgICAgICAgICAgICAgICB5eWxlbmcgPSB0aGlzLmxleGVyLnl5bGVuZztcbiAgICAgICAgICAgICAgICB5eXRleHQgPSB0aGlzLmxleGVyLnl5dGV4dDtcbiAgICAgICAgICAgICAgICB5eWxpbmVubyA9IHRoaXMubGV4ZXIueXlsaW5lbm87XG4gICAgICAgICAgICAgICAgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICAgICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA+IDApXG4gICAgICAgICAgICAgICAgICAgIHJlY292ZXJpbmctLTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sID0gcHJlRXJyb3JTeW1ib2w7XG4gICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGxlbiA9IHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMV07XG4gICAgICAgICAgICB5eXZhbC4kID0gdnN0YWNrW3ZzdGFjay5sZW5ndGggLSBsZW5dO1xuICAgICAgICAgICAgeXl2YWwuXyQgPSB7Zmlyc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5maXJzdF9saW5lLCBsYXN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gMV0ubGFzdF9saW5lLCBmaXJzdF9jb2x1bW46IGxzdGFja1tsc3RhY2subGVuZ3RoIC0gKGxlbiB8fCAxKV0uZmlyc3RfY29sdW1uLCBsYXN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5sYXN0X2NvbHVtbn07XG4gICAgICAgICAgICBpZiAocmFuZ2VzKSB7XG4gICAgICAgICAgICAgICAgeXl2YWwuXyQucmFuZ2UgPSBbbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5yYW5nZVswXSwgbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5yYW5nZVsxXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwoeXl2YWwsIHl5dGV4dCwgeXlsZW5nLCB5eWxpbmVubywgdGhpcy55eSwgYWN0aW9uWzFdLCB2c3RhY2ssIGxzdGFjayk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgICAgICBzdGFjayA9IHN0YWNrLnNsaWNlKDAsIC0xICogbGVuICogMik7XG4gICAgICAgICAgICAgICAgdnN0YWNrID0gdnN0YWNrLnNsaWNlKDAsIC0xICogbGVuKTtcbiAgICAgICAgICAgICAgICBsc3RhY2sgPSBsc3RhY2suc2xpY2UoMCwgLTEgKiBsZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhY2sucHVzaCh0aGlzLnByb2R1Y3Rpb25zX1thY3Rpb25bMV1dWzBdKTtcbiAgICAgICAgICAgIHZzdGFjay5wdXNoKHl5dmFsLiQpO1xuICAgICAgICAgICAgbHN0YWNrLnB1c2goeXl2YWwuXyQpO1xuICAgICAgICAgICAgbmV3U3RhdGUgPSB0YWJsZVtzdGFja1tzdGFjay5sZW5ndGggLSAyXV1bc3RhY2tbc3RhY2subGVuZ3RoIC0gMV1dO1xuICAgICAgICAgICAgc3RhY2sucHVzaChuZXdTdGF0ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG59O1xuXG5cbmZ1bmN0aW9uIHN0cmlwRmxhZ3Mob3BlbiwgY2xvc2UpIHtcbiAgcmV0dXJuIHtcbiAgICBsZWZ0OiBvcGVuLmNoYXJBdCgyKSA9PT0gJ34nLFxuICAgIHJpZ2h0OiBjbG9zZS5jaGFyQXQoMCkgPT09ICd+JyB8fCBjbG9zZS5jaGFyQXQoMSkgPT09ICd+J1xuICB9O1xufVxuXG4vKiBKaXNvbiBnZW5lcmF0ZWQgbGV4ZXIgKi9cbnZhciBsZXhlciA9IChmdW5jdGlvbigpe1xudmFyIGxleGVyID0gKHtFT0Y6MSxcbnBhcnNlRXJyb3I6ZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICAgICAgaWYgKHRoaXMueXkucGFyc2VyKSB7XG4gICAgICAgICAgICB0aGlzLnl5LnBhcnNlci5wYXJzZUVycm9yKHN0ciwgaGFzaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcbiAgICAgICAgfVxuICAgIH0sXG5zZXRJbnB1dDpmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5fbW9yZSA9IHRoaXMuX2xlc3MgPSB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy55eWxpbmVubyA9IHRoaXMueXlsZW5nID0gMDtcbiAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sgPSBbJ0lOSVRJQUwnXTtcbiAgICAgICAgdGhpcy55eWxsb2MgPSB7Zmlyc3RfbGluZToxLGZpcnN0X2NvbHVtbjowLGxhc3RfbGluZToxLGxhc3RfY29sdW1uOjB9O1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykgdGhpcy55eWxsb2MucmFuZ2UgPSBbMCwwXTtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuaW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2ggPSB0aGlzLl9pbnB1dFswXTtcbiAgICAgICAgdGhpcy55eXRleHQgKz0gY2g7XG4gICAgICAgIHRoaXMueXlsZW5nKys7XG4gICAgICAgIHRoaXMub2Zmc2V0Kys7XG4gICAgICAgIHRoaXMubWF0Y2ggKz0gY2g7XG4gICAgICAgIHRoaXMubWF0Y2hlZCArPSBjaDtcbiAgICAgICAgdmFyIGxpbmVzID0gY2gubWF0Y2goLyg/Olxcclxcbj98XFxuKS4qL2cpO1xuICAgICAgICBpZiAobGluZXMpIHtcbiAgICAgICAgICAgIHRoaXMueXlsaW5lbm8rKztcbiAgICAgICAgICAgIHRoaXMueXlsbG9jLmxhc3RfbGluZSsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4rKztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykgdGhpcy55eWxsb2MucmFuZ2VbMV0rKztcblxuICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKDEpO1xuICAgICAgICByZXR1cm4gY2g7XG4gICAgfSxcbnVucHV0OmZ1bmN0aW9uIChjaCkge1xuICAgICAgICB2YXIgbGVuID0gY2gubGVuZ3RoO1xuICAgICAgICB2YXIgbGluZXMgPSBjaC5zcGxpdCgvKD86XFxyXFxuP3xcXG4pL2cpO1xuXG4gICAgICAgIHRoaXMuX2lucHV0ID0gY2ggKyB0aGlzLl9pbnB1dDtcbiAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLnl5dGV4dC5zdWJzdHIoMCwgdGhpcy55eXRleHQubGVuZ3RoLWxlbi0xKTtcbiAgICAgICAgLy90aGlzLnl5bGVuZyAtPSBsZW47XG4gICAgICAgIHRoaXMub2Zmc2V0IC09IGxlbjtcbiAgICAgICAgdmFyIG9sZExpbmVzID0gdGhpcy5tYXRjaC5zcGxpdCgvKD86XFxyXFxuP3xcXG4pL2cpO1xuICAgICAgICB0aGlzLm1hdGNoID0gdGhpcy5tYXRjaC5zdWJzdHIoMCwgdGhpcy5tYXRjaC5sZW5ndGgtMSk7XG4gICAgICAgIHRoaXMubWF0Y2hlZCA9IHRoaXMubWF0Y2hlZC5zdWJzdHIoMCwgdGhpcy5tYXRjaGVkLmxlbmd0aC0xKTtcblxuICAgICAgICBpZiAobGluZXMubGVuZ3RoLTEpIHRoaXMueXlsaW5lbm8gLT0gbGluZXMubGVuZ3RoLTE7XG4gICAgICAgIHZhciByID0gdGhpcy55eWxsb2MucmFuZ2U7XG5cbiAgICAgICAgdGhpcy55eWxsb2MgPSB7Zmlyc3RfbGluZTogdGhpcy55eWxsb2MuZmlyc3RfbGluZSxcbiAgICAgICAgICBsYXN0X2xpbmU6IHRoaXMueXlsaW5lbm8rMSxcbiAgICAgICAgICBmaXJzdF9jb2x1bW46IHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbixcbiAgICAgICAgICBsYXN0X2NvbHVtbjogbGluZXMgP1xuICAgICAgICAgICAgICAobGluZXMubGVuZ3RoID09PSBvbGRMaW5lcy5sZW5ndGggPyB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4gOiAwKSArIG9sZExpbmVzW29sZExpbmVzLmxlbmd0aCAtIGxpbmVzLmxlbmd0aF0ubGVuZ3RoIC0gbGluZXNbMF0ubGVuZ3RoOlxuICAgICAgICAgICAgICB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4gLSBsZW5cbiAgICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLnl5bGxvYy5yYW5nZSA9IFtyWzBdLCByWzBdICsgdGhpcy55eWxlbmcgLSBsZW5dO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5tb3JlOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbW9yZSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5sZXNzOmZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHRoaXMudW5wdXQodGhpcy5tYXRjaC5zbGljZShuKSk7XG4gICAgfSxcbnBhc3RJbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwYXN0ID0gdGhpcy5tYXRjaGVkLnN1YnN0cigwLCB0aGlzLm1hdGNoZWQubGVuZ3RoIC0gdGhpcy5tYXRjaC5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gKHBhc3QubGVuZ3RoID4gMjAgPyAnLi4uJzonJykgKyBwYXN0LnN1YnN0cigtMjApLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICB9LFxudXBjb21pbmdJbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuZXh0ID0gdGhpcy5tYXRjaDtcbiAgICAgICAgaWYgKG5leHQubGVuZ3RoIDwgMjApIHtcbiAgICAgICAgICAgIG5leHQgKz0gdGhpcy5faW5wdXQuc3Vic3RyKDAsIDIwLW5leHQubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG5leHQuc3Vic3RyKDAsMjApKyhuZXh0Lmxlbmd0aCA+IDIwID8gJy4uLic6JycpKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG4gICAgfSxcbnNob3dQb3NpdGlvbjpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmUgPSB0aGlzLnBhc3RJbnB1dCgpO1xuICAgICAgICB2YXIgYyA9IG5ldyBBcnJheShwcmUubGVuZ3RoICsgMSkuam9pbihcIi1cIik7XG4gICAgICAgIHJldHVybiBwcmUgKyB0aGlzLnVwY29taW5nSW5wdXQoKSArIFwiXFxuXCIgKyBjK1wiXlwiO1xuICAgIH0sXG5uZXh0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuRU9GO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5faW5wdXQpIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgdmFyIHRva2VuLFxuICAgICAgICAgICAgbWF0Y2gsXG4gICAgICAgICAgICB0ZW1wTWF0Y2gsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGNvbCxcbiAgICAgICAgICAgIGxpbmVzO1xuICAgICAgICBpZiAoIXRoaXMuX21vcmUpIHtcbiAgICAgICAgICAgIHRoaXMueXl0ZXh0ID0gJyc7XG4gICAgICAgICAgICB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5fY3VycmVudFJ1bGVzKCk7XG4gICAgICAgIGZvciAodmFyIGk9MDtpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRlbXBNYXRjaCA9IHRoaXMuX2lucHV0Lm1hdGNoKHRoaXMucnVsZXNbcnVsZXNbaV1dKTtcbiAgICAgICAgICAgIGlmICh0ZW1wTWF0Y2ggJiYgKCFtYXRjaCB8fCB0ZW1wTWF0Y2hbMF0ubGVuZ3RoID4gbWF0Y2hbMF0ubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIG1hdGNoID0gdGVtcE1hdGNoO1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5mbGV4KSBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGxpbmVzID0gbWF0Y2hbMF0ubWF0Y2goLyg/Olxcclxcbj98XFxuKS4qL2cpO1xuICAgICAgICAgICAgaWYgKGxpbmVzKSB0aGlzLnl5bGluZW5vICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMueXlsbG9jID0ge2ZpcnN0X2xpbmU6IHRoaXMueXlsbG9jLmxhc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfbGluZTogdGhpcy55eWxpbmVubysxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfY29sdW1uOiBsaW5lcyA/IGxpbmVzW2xpbmVzLmxlbmd0aC0xXS5sZW5ndGgtbGluZXNbbGluZXMubGVuZ3RoLTFdLm1hdGNoKC9cXHI/XFxuPy8pWzBdLmxlbmd0aCA6IHRoaXMueXlsbG9jLmxhc3RfY29sdW1uICsgbWF0Y2hbMF0ubGVuZ3RofTtcbiAgICAgICAgICAgIHRoaXMueXl0ZXh0ICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgdGhpcy5tYXRjaCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgIHRoaXMubWF0Y2hlcyA9IG1hdGNoO1xuICAgICAgICAgICAgdGhpcy55eWxlbmcgPSB0aGlzLnl5dGV4dC5sZW5ndGg7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xuICAgICAgICAgICAgICAgIHRoaXMueXlsbG9jLnJhbmdlID0gW3RoaXMub2Zmc2V0LCB0aGlzLm9mZnNldCArPSB0aGlzLnl5bGVuZ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9tb3JlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLm1hdGNoZWQgKz0gbWF0Y2hbMF07XG4gICAgICAgICAgICB0b2tlbiA9IHRoaXMucGVyZm9ybUFjdGlvbi5jYWxsKHRoaXMsIHRoaXMueXksIHRoaXMsIHJ1bGVzW2luZGV4XSx0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoLTFdKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRvbmUgJiYgdGhpcy5faW5wdXQpIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRva2VuKSByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICBlbHNlIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faW5wdXQgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkVPRjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRXJyb3IoJ0xleGljYWwgZXJyb3Igb24gbGluZSAnKyh0aGlzLnl5bGluZW5vKzEpKycuIFVucmVjb2duaXplZCB0ZXh0LlxcbicrdGhpcy5zaG93UG9zaXRpb24oKSxcbiAgICAgICAgICAgICAgICAgICAge3RleHQ6IFwiXCIsIHRva2VuOiBudWxsLCBsaW5lOiB0aGlzLnl5bGluZW5vfSk7XG4gICAgICAgIH1cbiAgICB9LFxubGV4OmZ1bmN0aW9uIGxleCgpIHtcbiAgICAgICAgdmFyIHIgPSB0aGlzLm5leHQoKTtcbiAgICAgICAgaWYgKHR5cGVvZiByICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZXgoKTtcbiAgICAgICAgfVxuICAgIH0sXG5iZWdpbjpmdW5jdGlvbiBiZWdpbihjb25kaXRpb24pIHtcbiAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjay5wdXNoKGNvbmRpdGlvbik7XG4gICAgfSxcbnBvcFN0YXRlOmZ1bmN0aW9uIHBvcFN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFjay5wb3AoKTtcbiAgICB9LFxuX2N1cnJlbnRSdWxlczpmdW5jdGlvbiBfY3VycmVudFJ1bGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25zW3RoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGgtMV1dLnJ1bGVzO1xuICAgIH0sXG50b3BTdGF0ZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoLTJdO1xuICAgIH0sXG5wdXNoU3RhdGU6ZnVuY3Rpb24gYmVnaW4oY29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuYmVnaW4oY29uZGl0aW9uKTtcbiAgICB9fSk7XG5sZXhlci5vcHRpb25zID0ge307XG5sZXhlci5wZXJmb3JtQWN0aW9uID0gZnVuY3Rpb24gYW5vbnltb3VzKHl5LHl5XywkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zLFlZX1NUQVJUKSB7XG5cblxuZnVuY3Rpb24gc3RyaXAoc3RhcnQsIGVuZCkge1xuICByZXR1cm4geXlfLnl5dGV4dCA9IHl5Xy55eXRleHQuc3Vic3RyKHN0YXJ0LCB5eV8ueXlsZW5nLWVuZCk7XG59XG5cblxudmFyIFlZU1RBVEU9WVlfU1RBUlRcbnN3aXRjaCgkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zKSB7XG5jYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHl5Xy55eXRleHQuc2xpY2UoLTIpID09PSBcIlxcXFxcXFxcXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpcCgwLDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmVnaW4oXCJtdVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKHl5Xy55eXRleHQuc2xpY2UoLTEpID09PSBcIlxcXFxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmlwKDAsMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpbihcImVtdVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJlZ2luKFwibXVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoeXlfLnl5dGV4dCkgcmV0dXJuIDE0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5icmVhaztcbmNhc2UgMTpyZXR1cm4gMTQ7XG5icmVhaztcbmNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3BTdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbmJyZWFrO1xuY2FzZSAzOnN0cmlwKDAsNCk7IHRoaXMucG9wU3RhdGUoKTsgcmV0dXJuIDE1O1xuYnJlYWs7XG5jYXNlIDQ6cmV0dXJuIDM1O1xuYnJlYWs7XG5jYXNlIDU6cmV0dXJuIDM2O1xuYnJlYWs7XG5jYXNlIDY6cmV0dXJuIDI1O1xuYnJlYWs7XG5jYXNlIDc6cmV0dXJuIDE2O1xuYnJlYWs7XG5jYXNlIDg6cmV0dXJuIDIwO1xuYnJlYWs7XG5jYXNlIDk6cmV0dXJuIDE5O1xuYnJlYWs7XG5jYXNlIDEwOnJldHVybiAxOTtcbmJyZWFrO1xuY2FzZSAxMTpyZXR1cm4gMjM7XG5icmVhaztcbmNhc2UgMTI6cmV0dXJuIDIyO1xuYnJlYWs7XG5jYXNlIDEzOnRoaXMucG9wU3RhdGUoKTsgdGhpcy5iZWdpbignY29tJyk7XG5icmVhaztcbmNhc2UgMTQ6c3RyaXAoMyw1KTsgdGhpcy5wb3BTdGF0ZSgpOyByZXR1cm4gMTU7XG5icmVhaztcbmNhc2UgMTU6cmV0dXJuIDIyO1xuYnJlYWs7XG5jYXNlIDE2OnJldHVybiA0MTtcbmJyZWFrO1xuY2FzZSAxNzpyZXR1cm4gNDA7XG5icmVhaztcbmNhc2UgMTg6cmV0dXJuIDQwO1xuYnJlYWs7XG5jYXNlIDE5OnJldHVybiA0NDtcbmJyZWFrO1xuY2FzZSAyMDovLyBpZ25vcmUgd2hpdGVzcGFjZVxuYnJlYWs7XG5jYXNlIDIxOnRoaXMucG9wU3RhdGUoKTsgcmV0dXJuIDI0O1xuYnJlYWs7XG5jYXNlIDIyOnRoaXMucG9wU3RhdGUoKTsgcmV0dXJuIDE4O1xuYnJlYWs7XG5jYXNlIDIzOnl5Xy55eXRleHQgPSBzdHJpcCgxLDIpLnJlcGxhY2UoL1xcXFxcIi9nLCdcIicpOyByZXR1cm4gMzI7XG5icmVhaztcbmNhc2UgMjQ6eXlfLnl5dGV4dCA9IHN0cmlwKDEsMikucmVwbGFjZSgvXFxcXCcvZyxcIidcIik7IHJldHVybiAzMjtcbmJyZWFrO1xuY2FzZSAyNTpyZXR1cm4gNDI7XG5icmVhaztcbmNhc2UgMjY6cmV0dXJuIDM0O1xuYnJlYWs7XG5jYXNlIDI3OnJldHVybiAzNDtcbmJyZWFrO1xuY2FzZSAyODpyZXR1cm4gMzM7XG5icmVhaztcbmNhc2UgMjk6cmV0dXJuIDQwO1xuYnJlYWs7XG5jYXNlIDMwOnl5Xy55eXRleHQgPSBzdHJpcCgxLDIpOyByZXR1cm4gNDA7XG5icmVhaztcbmNhc2UgMzE6cmV0dXJuICdJTlZBTElEJztcbmJyZWFrO1xuY2FzZSAzMjpyZXR1cm4gNTtcbmJyZWFrO1xufVxufTtcbmxleGVyLnJ1bGVzID0gWy9eKD86W15cXHgwMF0qPyg/PShcXHtcXHspKSkvLC9eKD86W15cXHgwMF0rKS8sL14oPzpbXlxceDAwXXsyLH0/KD89KFxce1xce3xcXFxcXFx7XFx7fFxcXFxcXFxcXFx7XFx7fCQpKSkvLC9eKD86W1xcc1xcU10qPy0tXFx9XFx9KS8sL14oPzpcXCgpLywvXig/OlxcKSkvLC9eKD86XFx7XFx7KH4pPz4pLywvXig/Olxce1xceyh+KT8jKS8sL14oPzpcXHtcXHsofik/XFwvKS8sL14oPzpcXHtcXHsofik/XFxeKS8sL14oPzpcXHtcXHsofik/XFxzKmVsc2VcXGIpLywvXig/Olxce1xceyh+KT9cXHspLywvXig/Olxce1xceyh+KT8mKS8sL14oPzpcXHtcXHshLS0pLywvXig/Olxce1xceyFbXFxzXFxTXSo/XFx9XFx9KS8sL14oPzpcXHtcXHsofik/KS8sL14oPzo9KS8sL14oPzpcXC5cXC4pLywvXig/OlxcLig/PShbPX59XFxzXFwvLildKSkpLywvXig/OltcXC8uXSkvLC9eKD86XFxzKykvLC9eKD86XFx9KH4pP1xcfVxcfSkvLC9eKD86KH4pP1xcfVxcfSkvLC9eKD86XCIoXFxcXFtcIl18W15cIl0pKlwiKS8sL14oPzonKFxcXFxbJ118W14nXSkqJykvLC9eKD86QCkvLC9eKD86dHJ1ZSg/PShbfn1cXHMpXSkpKS8sL14oPzpmYWxzZSg/PShbfn1cXHMpXSkpKS8sL14oPzotP1swLTldKyg/PShbfn1cXHMpXSkpKS8sL14oPzooW15cXHMhXCIjJS0sXFwuXFwvOy0+QFxcWy1cXF5gXFx7LX5dKyg/PShbPX59XFxzXFwvLildKSkpKS8sL14oPzpcXFtbXlxcXV0qXFxdKS8sL14oPzouKS8sL14oPzokKS9dO1xubGV4ZXIuY29uZGl0aW9ucyA9IHtcIm11XCI6e1wicnVsZXNcIjpbNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMTksMjAsMjEsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMjksMzAsMzEsMzJdLFwiaW5jbHVzaXZlXCI6ZmFsc2V9LFwiZW11XCI6e1wicnVsZXNcIjpbMl0sXCJpbmNsdXNpdmVcIjpmYWxzZX0sXCJjb21cIjp7XCJydWxlc1wiOlszXSxcImluY2x1c2l2ZVwiOmZhbHNlfSxcIklOSVRJQUxcIjp7XCJydWxlc1wiOlswLDEsMzJdLFwiaW5jbHVzaXZlXCI6dHJ1ZX19O1xucmV0dXJuIGxleGVyO30pKClcbnBhcnNlci5sZXhlciA9IGxleGVyO1xuZnVuY3Rpb24gUGFyc2VyICgpIHsgdGhpcy55eSA9IHt9OyB9UGFyc2VyLnByb3RvdHlwZSA9IHBhcnNlcjtwYXJzZXIuUGFyc2VyID0gUGFyc2VyO1xucmV0dXJuIG5ldyBQYXJzZXI7XG59KSgpO2V4cG9ydHNbXCJkZWZhdWx0XCJdID0gaGFuZGxlYmFycztcbi8qIGpzaGludCBpZ25vcmU6ZW5kICovIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVmlzaXRvciA9IHJlcXVpcmUoXCIuL3Zpc2l0b3JcIilbXCJkZWZhdWx0XCJdO1xuXG5mdW5jdGlvbiBwcmludChhc3QpIHtcbiAgcmV0dXJuIG5ldyBQcmludFZpc2l0b3IoKS5hY2NlcHQoYXN0KTtcbn1cblxuZXhwb3J0cy5wcmludCA9IHByaW50O2Z1bmN0aW9uIFByaW50VmlzaXRvcigpIHtcbiAgdGhpcy5wYWRkaW5nID0gMDtcbn1cblxuZXhwb3J0cy5QcmludFZpc2l0b3IgPSBQcmludFZpc2l0b3I7UHJpbnRWaXNpdG9yLnByb3RvdHlwZSA9IG5ldyBWaXNpdG9yKCk7XG5cblByaW50VmlzaXRvci5wcm90b3R5cGUucGFkID0gZnVuY3Rpb24oc3RyaW5nLCBuZXdsaW5lKSB7XG4gIHZhciBvdXQgPSBcIlwiO1xuXG4gIGZvcih2YXIgaT0wLGw9dGhpcy5wYWRkaW5nOyBpPGw7IGkrKykge1xuICAgIG91dCA9IG91dCArIFwiICBcIjtcbiAgfVxuXG4gIG91dCA9IG91dCArIHN0cmluZztcblxuICBpZihuZXdsaW5lICE9PSBmYWxzZSkgeyBvdXQgPSBvdXQgKyBcIlxcblwiOyB9XG4gIHJldHVybiBvdXQ7XG59O1xuXG5QcmludFZpc2l0b3IucHJvdG90eXBlLnByb2dyYW0gPSBmdW5jdGlvbihwcm9ncmFtKSB7XG4gIHZhciBvdXQgPSBcIlwiLFxuICAgICAgc3RhdGVtZW50cyA9IHByb2dyYW0uc3RhdGVtZW50cyxcbiAgICAgIGksIGw7XG5cbiAgZm9yKGk9MCwgbD1zdGF0ZW1lbnRzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICBvdXQgPSBvdXQgKyB0aGlzLmFjY2VwdChzdGF0ZW1lbnRzW2ldKTtcbiAgfVxuXG4gIHRoaXMucGFkZGluZy0tO1xuXG4gIHJldHVybiBvdXQ7XG59O1xuXG5QcmludFZpc2l0b3IucHJvdG90eXBlLmJsb2NrID0gZnVuY3Rpb24oYmxvY2spIHtcbiAgdmFyIG91dCA9IFwiXCI7XG5cbiAgb3V0ID0gb3V0ICsgdGhpcy5wYWQoXCJCTE9DSzpcIik7XG4gIHRoaXMucGFkZGluZysrO1xuICBvdXQgPSBvdXQgKyB0aGlzLmFjY2VwdChibG9jay5tdXN0YWNoZSk7XG4gIGlmIChibG9jay5wcm9ncmFtKSB7XG4gICAgb3V0ID0gb3V0ICsgdGhpcy5wYWQoXCJQUk9HUkFNOlwiKTtcbiAgICB0aGlzLnBhZGRpbmcrKztcbiAgICBvdXQgPSBvdXQgKyB0aGlzLmFjY2VwdChibG9jay5wcm9ncmFtKTtcbiAgICB0aGlzLnBhZGRpbmctLTtcbiAgfVxuICBpZiAoYmxvY2suaW52ZXJzZSkge1xuICAgIGlmIChibG9jay5wcm9ncmFtKSB7IHRoaXMucGFkZGluZysrOyB9XG4gICAgb3V0ID0gb3V0ICsgdGhpcy5wYWQoXCJ7e159fVwiKTtcbiAgICB0aGlzLnBhZGRpbmcrKztcbiAgICBvdXQgPSBvdXQgKyB0aGlzLmFjY2VwdChibG9jay5pbnZlcnNlKTtcbiAgICB0aGlzLnBhZGRpbmctLTtcbiAgICBpZiAoYmxvY2sucHJvZ3JhbSkgeyB0aGlzLnBhZGRpbmctLTsgfVxuICB9XG4gIHRoaXMucGFkZGluZy0tO1xuXG4gIHJldHVybiBvdXQ7XG59O1xuXG5QcmludFZpc2l0b3IucHJvdG90eXBlLnNleHByID0gZnVuY3Rpb24oc2V4cHIpIHtcbiAgdmFyIHBhcmFtcyA9IHNleHByLnBhcmFtcywgcGFyYW1TdHJpbmdzID0gW10sIGhhc2g7XG5cbiAgZm9yKHZhciBpPTAsIGw9cGFyYW1zLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICBwYXJhbVN0cmluZ3MucHVzaCh0aGlzLmFjY2VwdChwYXJhbXNbaV0pKTtcbiAgfVxuXG4gIHBhcmFtcyA9IFwiW1wiICsgcGFyYW1TdHJpbmdzLmpvaW4oXCIsIFwiKSArIFwiXVwiO1xuXG4gIGhhc2ggPSBzZXhwci5oYXNoID8gXCIgXCIgKyB0aGlzLmFjY2VwdChzZXhwci5oYXNoKSA6IFwiXCI7XG5cbiAgcmV0dXJuIHRoaXMuYWNjZXB0KHNleHByLmlkKSArIFwiIFwiICsgcGFyYW1zICsgaGFzaDtcbn07XG5cblByaW50VmlzaXRvci5wcm90b3R5cGUubXVzdGFjaGUgPSBmdW5jdGlvbihtdXN0YWNoZSkge1xuICByZXR1cm4gdGhpcy5wYWQoXCJ7eyBcIiArIHRoaXMuYWNjZXB0KG11c3RhY2hlLnNleHByKSArIFwiIH19XCIpO1xufTtcblxuUHJpbnRWaXNpdG9yLnByb3RvdHlwZS5wYXJ0aWFsID0gZnVuY3Rpb24ocGFydGlhbCkge1xuICB2YXIgY29udGVudCA9IHRoaXMuYWNjZXB0KHBhcnRpYWwucGFydGlhbE5hbWUpO1xuICBpZihwYXJ0aWFsLmNvbnRleHQpIHsgY29udGVudCA9IGNvbnRlbnQgKyBcIiBcIiArIHRoaXMuYWNjZXB0KHBhcnRpYWwuY29udGV4dCk7IH1cbiAgcmV0dXJuIHRoaXMucGFkKFwie3s+IFwiICsgY29udGVudCArIFwiIH19XCIpO1xufTtcblxuUHJpbnRWaXNpdG9yLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24oaGFzaCkge1xuICB2YXIgcGFpcnMgPSBoYXNoLnBhaXJzO1xuICB2YXIgam9pbmVkUGFpcnMgPSBbXSwgbGVmdCwgcmlnaHQ7XG5cbiAgZm9yKHZhciBpPTAsIGw9cGFpcnMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgIGxlZnQgPSBwYWlyc1tpXVswXTtcbiAgICByaWdodCA9IHRoaXMuYWNjZXB0KHBhaXJzW2ldWzFdKTtcbiAgICBqb2luZWRQYWlycy5wdXNoKCBsZWZ0ICsgXCI9XCIgKyByaWdodCApO1xuICB9XG5cbiAgcmV0dXJuIFwiSEFTSHtcIiArIGpvaW5lZFBhaXJzLmpvaW4oXCIsIFwiKSArIFwifVwiO1xufTtcblxuUHJpbnRWaXNpdG9yLnByb3RvdHlwZS5TVFJJTkcgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgcmV0dXJuICdcIicgKyBzdHJpbmcuc3RyaW5nICsgJ1wiJztcbn07XG5cblByaW50VmlzaXRvci5wcm90b3R5cGUuSU5URUdFUiA9IGZ1bmN0aW9uKGludGVnZXIpIHtcbiAgcmV0dXJuIFwiSU5URUdFUntcIiArIGludGVnZXIuaW50ZWdlciArIFwifVwiO1xufTtcblxuUHJpbnRWaXNpdG9yLnByb3RvdHlwZS5CT09MRUFOID0gZnVuY3Rpb24oYm9vbCkge1xuICByZXR1cm4gXCJCT09MRUFOe1wiICsgYm9vbC5ib29sICsgXCJ9XCI7XG59O1xuXG5QcmludFZpc2l0b3IucHJvdG90eXBlLklEID0gZnVuY3Rpb24oaWQpIHtcbiAgdmFyIHBhdGggPSBpZC5wYXJ0cy5qb2luKFwiL1wiKTtcbiAgaWYoaWQucGFydHMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBcIlBBVEg6XCIgKyBwYXRoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcIklEOlwiICsgcGF0aDtcbiAgfVxufTtcblxuUHJpbnRWaXNpdG9yLnByb3RvdHlwZS5QQVJUSUFMX05BTUUgPSBmdW5jdGlvbihwYXJ0aWFsTmFtZSkge1xuICAgIHJldHVybiBcIlBBUlRJQUw6XCIgKyBwYXJ0aWFsTmFtZS5uYW1lO1xufTtcblxuUHJpbnRWaXNpdG9yLnByb3RvdHlwZS5EQVRBID0gZnVuY3Rpb24oZGF0YSkge1xuICByZXR1cm4gXCJAXCIgKyB0aGlzLmFjY2VwdChkYXRhLmlkKTtcbn07XG5cblByaW50VmlzaXRvci5wcm90b3R5cGUuY29udGVudCA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcbiAgcmV0dXJuIHRoaXMucGFkKFwiQ09OVEVOVFsgJ1wiICsgY29udGVudC5zdHJpbmcgKyBcIicgXVwiKTtcbn07XG5cblByaW50VmlzaXRvci5wcm90b3R5cGUuY29tbWVudCA9IGZ1bmN0aW9uKGNvbW1lbnQpIHtcbiAgcmV0dXJuIHRoaXMucGFkKFwie3shICdcIiArIGNvbW1lbnQuY29tbWVudCArIFwiJyB9fVwiKTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBWaXNpdG9yKCkge31cblxuVmlzaXRvci5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBWaXNpdG9yLFxuXG4gIGFjY2VwdDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIHRoaXNbb2JqZWN0LnR5cGVdKG9iamVjdCk7XG4gIH1cbn07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gVmlzaXRvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGVycm9yUHJvcHMgPSBbJ2Rlc2NyaXB0aW9uJywgJ2ZpbGVOYW1lJywgJ2xpbmVOdW1iZXInLCAnbWVzc2FnZScsICduYW1lJywgJ251bWJlcicsICdzdGFjayddO1xuXG5mdW5jdGlvbiBFeGNlcHRpb24obWVzc2FnZSwgbm9kZSkge1xuICB2YXIgbGluZTtcbiAgaWYgKG5vZGUgJiYgbm9kZS5maXJzdExpbmUpIHtcbiAgICBsaW5lID0gbm9kZS5maXJzdExpbmU7XG5cbiAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cblxuICB2YXIgdG1wID0gRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgbWVzc2FnZSk7XG5cbiAgLy8gVW5mb3J0dW5hdGVseSBlcnJvcnMgYXJlIG5vdCBlbnVtZXJhYmxlIGluIENocm9tZSAoYXQgbGVhc3QpLCBzbyBgZm9yIHByb3AgaW4gdG1wYCBkb2Vzbid0IHdvcmsuXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGVycm9yUHJvcHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXNbZXJyb3JQcm9wc1tpZHhdXSA9IHRtcFtlcnJvclByb3BzW2lkeF1dO1xuICB9XG5cbiAgaWYgKGxpbmUpIHtcbiAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uID0gbm9kZS5maXJzdENvbHVtbjtcbiAgfVxufVxuXG5FeGNlcHRpb24ucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXhjZXB0aW9uOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBDT01QSUxFUl9SRVZJU0lPTiA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHJlcXVpcmUoXCIuL2Jhc2VcIikuUkVWSVNJT05fQ0hBTkdFUztcblxuZnVuY3Rpb24gY2hlY2tSZXZpc2lvbihjb21waWxlckluZm8pIHtcbiAgdmFyIGNvbXBpbGVyUmV2aXNpb24gPSBjb21waWxlckluZm8gJiYgY29tcGlsZXJJbmZvWzBdIHx8IDEsXG4gICAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcbiAgICAgIHZhciBydW50aW1lVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2N1cnJlbnRSZXZpc2lvbl0sXG4gICAgICAgICAgY29tcGlsZXJWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY29tcGlsZXJSZXZpc2lvbl07XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBwcmVjb21waWxlciB0byBhIG5ld2VyIHZlcnNpb24gKFwiK3J1bnRpbWVWZXJzaW9ucytcIikgb3IgZG93bmdyYWRlIHlvdXIgcnVudGltZSB0byBhbiBvbGRlciB2ZXJzaW9uIChcIitjb21waWxlclZlcnNpb25zK1wiKS5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVzZSB0aGUgZW1iZWRkZWQgdmVyc2lvbiBpbmZvIHNpbmNlIHRoZSBydW50aW1lIGRvZXNuJ3Qga25vdyBhYm91dCB0aGlzIHJldmlzaW9uIHlldFxuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGEgbmV3ZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICBcIlBsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJJbmZvWzFdK1wiKS5cIik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuY2hlY2tSZXZpc2lvbiA9IGNoZWNrUmV2aXNpb247Ly8gVE9ETzogUmVtb3ZlIHRoaXMgbGluZSBhbmQgYnJlYWsgdXAgY29tcGlsZVBhcnRpYWxcblxuZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTm8gZW52aXJvbm1lbnQgcGFzc2VkIHRvIHRlbXBsYXRlXCIpO1xuICB9XG5cbiAgLy8gTm90ZTogVXNpbmcgZW52LlZNIHJlZmVyZW5jZXMgcmF0aGVyIHRoYW4gbG9jYWwgdmFyIHJlZmVyZW5jZXMgdGhyb3VnaG91dCB0aGlzIHNlY3Rpb24gdG8gYWxsb3dcbiAgLy8gZm9yIGV4dGVybmFsIHVzZXJzIHRvIG92ZXJyaWRlIHRoZXNlIGFzIHBzdWVkby1zdXBwb3J0ZWQgQVBJcy5cbiAgdmFyIGludm9rZVBhcnRpYWxXcmFwcGVyID0gZnVuY3Rpb24ocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW52LlZNLmludm9rZVBhcnRpYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAocmVzdWx0ICE9IG51bGwpIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gICAgaWYgKGVudi5jb21waWxlKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHsgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG4gICAgICBwYXJ0aWFsc1tuYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHsgZGF0YTogZGF0YSAhPT0gdW5kZWZpbmVkIH0sIGVudik7XG4gICAgICByZXR1cm4gcGFydGlhbHNbbmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgY29tcGlsZWQgd2hlbiBydW5uaW5nIGluIHJ1bnRpbWUtb25seSBtb2RlXCIpO1xuICAgIH1cbiAgfTtcblxuICAvLyBKdXN0IGFkZCB3YXRlclxuICB2YXIgY29udGFpbmVyID0ge1xuICAgIGVzY2FwZUV4cHJlc3Npb246IFV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG4gICAgaW52b2tlUGFydGlhbDogaW52b2tlUGFydGlhbFdyYXBwZXIsXG4gICAgcHJvZ3JhbXM6IFtdLFxuICAgIHByb2dyYW06IGZ1bmN0aW9uKGksIGZuLCBkYXRhKSB7XG4gICAgICB2YXIgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldO1xuICAgICAgaWYoZGF0YSkge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHByb2dyYW0oaSwgZm4sIGRhdGEpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gcHJvZ3JhbShpLCBmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZ3JhbVdyYXBwZXI7XG4gICAgfSxcbiAgICBtZXJnZTogZnVuY3Rpb24ocGFyYW0sIGNvbW1vbikge1xuICAgICAgdmFyIHJldCA9IHBhcmFtIHx8IGNvbW1vbjtcblxuICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbiAmJiAocGFyYW0gIT09IGNvbW1vbikpIHtcbiAgICAgICAgcmV0ID0ge307XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIGNvbW1vbik7XG4gICAgICAgIFV0aWxzLmV4dGVuZChyZXQsIHBhcmFtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcbiAgICBwcm9ncmFtV2l0aERlcHRoOiBlbnYuVk0ucHJvZ3JhbVdpdGhEZXB0aCxcbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IG51bGxcbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBuYW1lc3BhY2UgPSBvcHRpb25zLnBhcnRpYWwgPyBvcHRpb25zIDogZW52LFxuICAgICAgICBoZWxwZXJzLFxuICAgICAgICBwYXJ0aWFscztcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBoZWxwZXJzID0gb3B0aW9ucy5oZWxwZXJzO1xuICAgICAgcGFydGlhbHMgPSBvcHRpb25zLnBhcnRpYWxzO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gdGVtcGxhdGVTcGVjLmNhbGwoXG4gICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgIG5hbWVzcGFjZSwgY29udGV4dCxcbiAgICAgICAgICBoZWxwZXJzLFxuICAgICAgICAgIHBhcnRpYWxzLFxuICAgICAgICAgIG9wdGlvbnMuZGF0YSk7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgZW52LlZNLmNoZWNrUmV2aXNpb24oY29udGFpbmVyLmNvbXBpbGVySW5mbyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuZXhwb3J0cy50ZW1wbGF0ZSA9IHRlbXBsYXRlO2Z1bmN0aW9uIHByb2dyYW1XaXRoRGVwdGgoaSwgZm4sIGRhdGEgLyosICRkZXB0aCAqLykge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMyk7XG5cbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgW2NvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhXS5jb25jYXQoYXJncykpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gYXJncy5sZW5ndGg7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW1XaXRoRGVwdGggPSBwcm9ncmFtV2l0aERlcHRoO2Z1bmN0aW9uIHByb2dyYW0oaSwgZm4sIGRhdGEpIHtcbiAgdmFyIHByb2cgPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gZm4oY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGEpO1xuICB9O1xuICBwcm9nLnByb2dyYW0gPSBpO1xuICBwcm9nLmRlcHRoID0gMDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbSA9IHByb2dyYW07ZnVuY3Rpb24gaW52b2tlUGFydGlhbChwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICB2YXIgb3B0aW9ucyA9IHsgcGFydGlhbDogdHJ1ZSwgaGVscGVyczogaGVscGVycywgcGFydGlhbHM6IHBhcnRpYWxzLCBkYXRhOiBkYXRhIH07XG5cbiAgaWYocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBmb3VuZFwiKTtcbiAgfSBlbHNlIGlmKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgIHJldHVybiBwYXJ0aWFsKGNvbnRleHQsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydHMuaW52b2tlUGFydGlhbCA9IGludm9rZVBhcnRpYWw7ZnVuY3Rpb24gbm9vcCgpIHsgcmV0dXJuIFwiXCI7IH1cblxuZXhwb3J0cy5ub29wID0gbm9vcDsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIEJ1aWxkIG91dCBvdXIgYmFzaWMgU2FmZVN0cmluZyB0eXBlXG5mdW5jdGlvbiBTYWZlU3RyaW5nKHN0cmluZykge1xuICB0aGlzLnN0cmluZyA9IHN0cmluZztcbn1cblxuU2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFwiXCIgKyB0aGlzLnN0cmluZztcbn07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gU2FmZVN0cmluZzsiLCJcInVzZSBzdHJpY3RcIjtcbi8qanNoaW50IC1XMDA0ICovXG52YXIgU2FmZVN0cmluZyA9IHJlcXVpcmUoXCIuL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIGVzY2FwZSA9IHtcbiAgXCImXCI6IFwiJmFtcDtcIixcbiAgXCI8XCI6IFwiJmx0O1wiLFxuICBcIj5cIjogXCImZ3Q7XCIsXG4gICdcIic6IFwiJnF1b3Q7XCIsXG4gIFwiJ1wiOiBcIiYjeDI3O1wiLFxuICBcImBcIjogXCImI3g2MDtcIlxufTtcblxudmFyIGJhZENoYXJzID0gL1smPD5cIidgXS9nO1xudmFyIHBvc3NpYmxlID0gL1smPD5cIidgXS87XG5cbmZ1bmN0aW9uIGVzY2FwZUNoYXIoY2hyKSB7XG4gIHJldHVybiBlc2NhcGVbY2hyXSB8fCBcIiZhbXA7XCI7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChvYmosIHZhbHVlKSB7XG4gIGZvcih2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSB7XG4gICAgICBvYmpba2V5XSA9IHZhbHVlW2tleV07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO3ZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4vLyBTb3VyY2VkIGZyb20gbG9kYXNoXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0XG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59O1xuLy8gZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zIG9mIENocm9tZSBhbmQgU2FmYXJpXG5pZiAoaXNGdW5jdGlvbigveC8pKSB7XG4gIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gIH07XG59XG52YXIgaXNGdW5jdGlvbjtcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSA/IHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBBcnJheV0nIDogZmFsc2U7XG59O1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICBpZiAoc3RyaW5nIGluc3RhbmNlb2YgU2FmZVN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcudG9TdHJpbmcoKTtcbiAgfSBlbHNlIGlmICghc3RyaW5nICYmIHN0cmluZyAhPT0gMCkge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuICAvLyBhbiBvYmplY3QncyB0byBzdHJpbmcgaGFzIGVzY2FwZWQgY2hhcmFjdGVycyBpbiBpdC5cbiAgc3RyaW5nID0gXCJcIiArIHN0cmluZztcblxuICBpZighcG9zc2libGUudGVzdChzdHJpbmcpKSB7IHJldHVybiBzdHJpbmc7IH1cbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGJhZENoYXJzLCBlc2NhcGVDaGFyKTtcbn1cblxuZXhwb3J0cy5lc2NhcGVFeHByZXNzaW9uID0gZXNjYXBlRXhwcmVzc2lvbjtmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0cy5pc0VtcHR5ID0gaXNFbXB0eTsiLCIvLyBVU0FHRTpcbi8vIHZhciBoYW5kbGViYXJzID0gcmVxdWlyZSgnaGFuZGxlYmFycycpO1xuXG4vLyB2YXIgbG9jYWwgPSBoYW5kbGViYXJzLmNyZWF0ZSgpO1xuXG52YXIgaGFuZGxlYmFycyA9IHJlcXVpcmUoJy4uL2Rpc3QvY2pzL2hhbmRsZWJhcnMnKVtcImRlZmF1bHRcIl07XG5cbmhhbmRsZWJhcnMuVmlzaXRvciA9IHJlcXVpcmUoJy4uL2Rpc3QvY2pzL2hhbmRsZWJhcnMvY29tcGlsZXIvdmlzaXRvcicpW1wiZGVmYXVsdFwiXTtcblxudmFyIHByaW50ZXIgPSByZXF1aXJlKCcuLi9kaXN0L2Nqcy9oYW5kbGViYXJzL2NvbXBpbGVyL3ByaW50ZXInKTtcbmhhbmRsZWJhcnMuUHJpbnRWaXNpdG9yID0gcHJpbnRlci5QcmludFZpc2l0b3I7XG5oYW5kbGViYXJzLnByaW50ID0gcHJpbnRlci5wcmludDtcblxubW9kdWxlLmV4cG9ydHMgPSBoYW5kbGViYXJzO1xuXG4vLyBQdWJsaXNoIGEgTm9kZS5qcyByZXF1aXJlKCkgaGFuZGxlciBmb3IgLmhhbmRsZWJhcnMgYW5kIC5oYnMgZmlsZXNcbmlmICh0eXBlb2YgcmVxdWlyZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVxdWlyZS5leHRlbnNpb25zKSB7XG4gIHZhciBleHRlbnNpb24gPSBmdW5jdGlvbihtb2R1bGUsIGZpbGVuYW1lKSB7XG4gICAgdmFyIGZzID0gcmVxdWlyZShcImZzXCIpO1xuICAgIHZhciB0ZW1wbGF0ZVN0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgXCJ1dGY4XCIpO1xuICAgIG1vZHVsZS5leHBvcnRzID0gaGFuZGxlYmFycy5jb21waWxlKHRlbXBsYXRlU3RyaW5nKTtcbiAgfTtcbiAgcmVxdWlyZS5leHRlbnNpb25zW1wiLmhhbmRsZWJhcnNcIl0gPSBleHRlbnNpb247XG4gIHJlcXVpcmUuZXh0ZW5zaW9uc1tcIi5oYnNcIl0gPSBleHRlbnNpb247XG59XG4iLCIvLyBDcmVhdGUgYSBzaW1wbGUgcGF0aCBhbGlhcyB0byBhbGxvdyBicm93c2VyaWZ5IHRvIHJlc29sdmVcbi8vIHRoZSBydW50aW1lIG9uIGEgc3VwcG9ydGVkIHBhdGguXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9janMvaGFuZGxlYmFycy5ydW50aW1lJyk7XG4iLCIvKmpzaGludCBub2RlOiB0cnVlKi9cblxudmFyIHRocm91Z2ggPSByZXF1aXJlKCd0aHJvdWdoJyk7XG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoXCJoYW5kbGViYXJzXCIpO1xuXG52YXIgZXh0ZW5zaW9ucyA9IHtcbiAgaGJzOiAxLFxuICBoYW5kbGViYXI6IDFcbn07XG5cbmZ1bmN0aW9uIGhic2Z5KGZpbGUpIHtcbiAgaWYgKCFleHRlbnNpb25zW2ZpbGUuc3BsaXQoXCIuXCIpLnBvcCgpXSkgcmV0dXJuIHRocm91Z2goKTtcblxuICB2YXIgYnVmZmVyID0gXCJcIjtcblxuICByZXR1cm4gdGhyb3VnaChmdW5jdGlvbihjaHVuaykge1xuICAgIGJ1ZmZlciArPSBjaHVuay50b1N0cmluZygpO1xuICB9LFxuICBmdW5jdGlvbigpIHtcbiAgICB2YXIganMgPSBIYW5kbGViYXJzLnByZWNvbXBpbGUoYnVmZmVyKTtcbiAgICAvLyBDb21waWxlIG9ubHkgd2l0aCB0aGUgcnVudGltZSBkZXBlbmRlbmN5LlxuICAgIHZhciBjb21waWxlZCA9IFwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxcblwiO1xuICAgIGNvbXBpbGVkICs9IFwidmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XFxuXCI7XG4gICAgY29tcGlsZWQgKz0gXCJtb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoXCIgKyBqcy50b1N0cmluZygpICsgXCIpO1xcblwiO1xuICAgIHRoaXMucXVldWUoY29tcGlsZWQpO1xuICAgIHRoaXMucXVldWUobnVsbCk7XG4gIH0pO1xuXG59O1xuXG5oYnNmeS5jb25maWd1cmUgPSBmdW5jdGlvbihvcHRzKSB7XG4gIGlmICghb3B0cyB8fCAhb3B0cy5leHRlbnNpb25zKSByZXR1cm4gaGJzZnk7XG4gIGV4dGVuc2lvbnMgPSB7fTtcbiAgb3B0cy5leHRlbnNpb25zLmZvckVhY2goZnVuY3Rpb24oZXh0KSB7XG4gICAgZXh0ZW5zaW9uc1tleHRdID0gMTtcbiAgfSk7XG4gIHJldHVybiBoYnNmeTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaGJzZnk7XG5cbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7dmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpXG5cbi8vIHRocm91Z2hcbi8vXG4vLyBhIHN0cmVhbSB0aGF0IGRvZXMgbm90aGluZyBidXQgcmUtZW1pdCB0aGUgaW5wdXQuXG4vLyB1c2VmdWwgZm9yIGFnZ3JlZ2F0aW5nIGEgc2VyaWVzIG9mIGNoYW5naW5nIGJ1dCBub3QgZW5kaW5nIHN0cmVhbXMgaW50byBvbmUgc3RyZWFtKVxuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB0aHJvdWdoXG50aHJvdWdoLnRocm91Z2ggPSB0aHJvdWdoXG5cbi8vY3JlYXRlIGEgcmVhZGFibGUgd3JpdGFibGUgc3RyZWFtLlxuXG5mdW5jdGlvbiB0aHJvdWdoICh3cml0ZSwgZW5kLCBvcHRzKSB7XG4gIHdyaXRlID0gd3JpdGUgfHwgZnVuY3Rpb24gKGRhdGEpIHsgdGhpcy5xdWV1ZShkYXRhKSB9XG4gIGVuZCA9IGVuZCB8fCBmdW5jdGlvbiAoKSB7IHRoaXMucXVldWUobnVsbCkgfVxuXG4gIHZhciBlbmRlZCA9IGZhbHNlLCBkZXN0cm95ZWQgPSBmYWxzZSwgYnVmZmVyID0gW10sIF9lbmRlZCA9IGZhbHNlXG4gIHZhciBzdHJlYW0gPSBuZXcgU3RyZWFtKClcbiAgc3RyZWFtLnJlYWRhYmxlID0gc3RyZWFtLndyaXRhYmxlID0gdHJ1ZVxuICBzdHJlYW0ucGF1c2VkID0gZmFsc2VcblxuLy8gIHN0cmVhbS5hdXRvUGF1c2UgICA9ICEob3B0cyAmJiBvcHRzLmF1dG9QYXVzZSAgID09PSBmYWxzZSlcbiAgc3RyZWFtLmF1dG9EZXN0cm95ID0gIShvcHRzICYmIG9wdHMuYXV0b0Rlc3Ryb3kgPT09IGZhbHNlKVxuXG4gIHN0cmVhbS53cml0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgd3JpdGUuY2FsbCh0aGlzLCBkYXRhKVxuICAgIHJldHVybiAhc3RyZWFtLnBhdXNlZFxuICB9XG5cbiAgZnVuY3Rpb24gZHJhaW4oKSB7XG4gICAgd2hpbGUoYnVmZmVyLmxlbmd0aCAmJiAhc3RyZWFtLnBhdXNlZCkge1xuICAgICAgdmFyIGRhdGEgPSBidWZmZXIuc2hpZnQoKVxuICAgICAgaWYobnVsbCA9PT0gZGF0YSlcbiAgICAgICAgcmV0dXJuIHN0cmVhbS5lbWl0KCdlbmQnKVxuICAgICAgZWxzZVxuICAgICAgICBzdHJlYW0uZW1pdCgnZGF0YScsIGRhdGEpXG4gICAgfVxuICB9XG5cbiAgc3RyZWFtLnF1ZXVlID0gc3RyZWFtLnB1c2ggPSBmdW5jdGlvbiAoZGF0YSkge1xuLy8gICAgY29uc29sZS5lcnJvcihlbmRlZClcbiAgICBpZihfZW5kZWQpIHJldHVybiBzdHJlYW1cbiAgICBpZihkYXRhID09IG51bGwpIF9lbmRlZCA9IHRydWVcbiAgICBidWZmZXIucHVzaChkYXRhKVxuICAgIGRyYWluKClcbiAgICByZXR1cm4gc3RyZWFtXG4gIH1cblxuICAvL3RoaXMgd2lsbCBiZSByZWdpc3RlcmVkIGFzIHRoZSBmaXJzdCAnZW5kJyBsaXN0ZW5lclxuICAvL211c3QgY2FsbCBkZXN0cm95IG5leHQgdGljaywgdG8gbWFrZSBzdXJlIHdlJ3JlIGFmdGVyIGFueVxuICAvL3N0cmVhbSBwaXBlZCBmcm9tIGhlcmUuXG4gIC8vdGhpcyBpcyBvbmx5IGEgcHJvYmxlbSBpZiBlbmQgaXMgbm90IGVtaXR0ZWQgc3luY2hyb25vdXNseS5cbiAgLy9hIG5pY2VyIHdheSB0byBkbyB0aGlzIGlzIHRvIG1ha2Ugc3VyZSB0aGlzIGlzIHRoZSBsYXN0IGxpc3RlbmVyIGZvciAnZW5kJ1xuXG4gIHN0cmVhbS5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgIHN0cmVhbS5yZWFkYWJsZSA9IGZhbHNlXG4gICAgaWYoIXN0cmVhbS53cml0YWJsZSAmJiBzdHJlYW0uYXV0b0Rlc3Ryb3kpXG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RyZWFtLmRlc3Ryb3koKVxuICAgICAgfSlcbiAgfSlcblxuICBmdW5jdGlvbiBfZW5kICgpIHtcbiAgICBzdHJlYW0ud3JpdGFibGUgPSBmYWxzZVxuICAgIGVuZC5jYWxsKHN0cmVhbSlcbiAgICBpZighc3RyZWFtLnJlYWRhYmxlICYmIHN0cmVhbS5hdXRvRGVzdHJveSlcbiAgICAgIHN0cmVhbS5kZXN0cm95KClcbiAgfVxuXG4gIHN0cmVhbS5lbmQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmKGVuZGVkKSByZXR1cm5cbiAgICBlbmRlZCA9IHRydWVcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoKSBzdHJlYW0ud3JpdGUoZGF0YSlcbiAgICBfZW5kKCkgLy8gd2lsbCBlbWl0IG9yIHF1ZXVlXG4gICAgcmV0dXJuIHN0cmVhbVxuICB9XG5cbiAgc3RyZWFtLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYoZGVzdHJveWVkKSByZXR1cm5cbiAgICBkZXN0cm95ZWQgPSB0cnVlXG4gICAgZW5kZWQgPSB0cnVlXG4gICAgYnVmZmVyLmxlbmd0aCA9IDBcbiAgICBzdHJlYW0ud3JpdGFibGUgPSBzdHJlYW0ucmVhZGFibGUgPSBmYWxzZVxuICAgIHN0cmVhbS5lbWl0KCdjbG9zZScpXG4gICAgcmV0dXJuIHN0cmVhbVxuICB9XG5cbiAgc3RyZWFtLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmKHN0cmVhbS5wYXVzZWQpIHJldHVyblxuICAgIHN0cmVhbS5wYXVzZWQgPSB0cnVlXG4gICAgcmV0dXJuIHN0cmVhbVxuICB9XG5cbiAgc3RyZWFtLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZihzdHJlYW0ucGF1c2VkKSB7XG4gICAgICBzdHJlYW0ucGF1c2VkID0gZmFsc2VcbiAgICAgIHN0cmVhbS5lbWl0KCdyZXN1bWUnKVxuICAgIH1cbiAgICBkcmFpbigpXG4gICAgLy9tYXkgaGF2ZSBiZWNvbWUgcGF1c2VkIGFnYWluLFxuICAgIC8vYXMgZHJhaW4gZW1pdHMgJ2RhdGEnLlxuICAgIGlmKCFzdHJlYW0ucGF1c2VkKVxuICAgICAgc3RyZWFtLmVtaXQoJ2RyYWluJylcbiAgICByZXR1cm4gc3RyZWFtXG4gIH1cbiAgcmV0dXJuIHN0cmVhbVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIi9Vc2Vycy9vaXZhL0Ryb3Bib3gvcHJvamVrdGl0L2t1bW1pL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiKSkiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoYW5kbGViYXJzL3J1bnRpbWVcIilbXCJkZWZhdWx0XCJdO1xuIl19
