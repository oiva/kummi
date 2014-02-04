/** @jsx React.DOM */

'use strict';

require('react.backbone');

var AskAdoptionView = React.createBackboneClass({
  changeOptions: 'change:code',
  render: function() {
    return (
      React.DOM.div( {className:"col-xs-12 col-sm-12"}, 
        React.DOM.h3(null, "Käytkö usein tällä pysäkillä?"),
        React.DOM.p(null, "Jos käyt pysäkillä lähes päivittäin, voit ryhtyä sen kummiksi."),
        React.DOM.p(null, "Pysäkkikummin velvollisuutena on..."),
        React.DOM.ul(null, 
          React.DOM.li(null, "Tarkkailla pysäkin kuntoa"),
          React.DOM.li(null, "Raportoida jos jotain on pielessä")
        ),
        React.DOM.p(null, "Kummina autat pitämään kaupunkimme paremmassa kunnossa."),
        
        React.DOM.button( {id:"adopt-stop", type:"button", className:"btn btn-primary", onClick:this.adoptStop}, 
          " Ryhdy pysäkin kummiksi "
        ),

        React.DOM.div( {id:"adopt-form", className:"hidden"}, 
          React.DOM.div( {className:"form-group"}, 
            React.DOM.label( {htmlFor:"email"}, "Sähköpostiosoitteesi"),
            React.DOM.input( {type:"email", name:"email", id:"email", placeholder:""} ),
            React.DOM.button( {id:"adopt-send", type:"submit", className:"btn btn-default"}, "Lähetä")
          )
        )
      )
    );
  },
  adoptStop: function() {
    appRouter.navigate('adopt/'+this.getModel().get('code'), {trigger: true});
    return false;
  }
});

module.exports = AskAdoptionView;