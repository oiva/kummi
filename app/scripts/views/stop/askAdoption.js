/** @jsx React.DOM */

'use strict';

require('react.backbone');

var AskAdoptionView = React.createBackboneClass({
  changeOptions: 'change:code',
  render: function() {
    return (
      <div className="col-xs-12 col-sm-12">
        <h3>Käytkö usein tällä pysäkillä?</h3>
        <p>Jos käyt pysäkillä lähes päivittäin, voit ryhtyä sen kummiksi.</p>
        <p>Pysäkkikummin velvollisuutena on...</p>
        <ul>
          <li>Tarkkailla pysäkin kuntoa</li>
          <li>Raportoida jos jotain on pielessä</li>
        </ul>
        <p>Kummina autat pitämään kaupunkimme paremmassa kunnossa.</p>
        
        <button id="adopt-stop" type="button" className="btn btn-primary" onClick={this.adoptStop}>
          Ryhdy pysäkin kummiksi
        </button>

        <div id="adopt-form" className="hidden">
          <div className="form-group">
            <label htmlFor="email">Sähköpostiosoitteesi</label>
            <input type="email" name="email" id="email" placeholder="" />
            <button id="adopt-send" type="submit" className="btn btn-default">Lähetä</button>
          </div>
        </div>
      </div>
    );
  },
  adoptStop: function() {
    appRouter.navigate('adopt/'+this.getModel().get('code'), {trigger: true});
    return false;
  }
});

module.exports = AskAdoptionView;