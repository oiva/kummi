/**
 * Based on Matti Aarnio´s convertion algorithms
 *  <http://www.viestikallio.fi/tools/kkj-wgs84.php>
 * 
 * Licensed under MIT with Matti Aarnio's permission.
 * 
 * @license MIT (see ../license.txt)
 */

var wgsCon = {
  rad2deg: function(rad){
    return (rad / (Math.PI)) * 180;
  },
  
  deg2rad: function(deg){
    return (deg * Math.PI) / 180;
  },
  
  KKJzone: function(KKJlo){
    var KKJ_ZONE = [18.0, 21.0, 24.0, 27.0, 30.0, 33.0];
    var ZoneNumber = 0;
    while (ZoneNumber <= 5) {
      if (Math.abs(KKJlo - KKJ_ZONE[ZoneNumber]) <= 1.5) {
        break;
      }
      ZoneNumber = ZoneNumber + 1;
    }
    return ZoneNumber;
  },
  
  WGSlalo_to_KKJlalo: function(WGS){
    var La = WGS[0];
    var Lo = WGS[1];
    var dLa = wgsCon.deg2rad(-0.124766E+01 + 0.269941E+00 * La - 0.191342E+00 * Lo - 0.356086E-02 * La * La + 0.122353E-02 * La * Lo + 0.335456E-03 * Lo * Lo) / 3600.0;
    var dLo = wgsCon.deg2rad(0.286008E+02 - 0.114139E+01 * La + 0.581329E+00 * Lo + 0.152376E-01 * La * La - 0.118166E-01 * La * Lo - 0.826201E-03 * Lo * Lo) / 3600.0;
    var KKJla = wgsCon.rad2deg(wgsCon.deg2rad(La) + dLa);
    var KKJlo = wgsCon.rad2deg(wgsCon.deg2rad(Lo) + dLo);
    var KKJ = [KKJla, KKJlo];
    return KKJ;
  },
  
  KKJlalo_to_KKJxy: function(INP, ZoneNumber){
    var KKJ_ZONE = [18.0, 21.0, 24.0, 27.0, 30.0, 33.0];
    var Lo = (wgsCon.deg2rad(INP[1]) - wgsCon.deg2rad(KKJ_ZONE[ZoneNumber]));
    var a = 6378388.0; // Hayford ellipsoid
    var f = 1 / 297.0;
    var b = (1.0 - f) * a;
    var bb = b * b;
    var c = (a / b) * a;
    var ee = (a * a - bb) / bb;
    var n = (a - b) / (a + b);
    var nn = n * n;
    var cosLa = Math.cos(wgsCon.deg2rad(INP[0]));
    var NN = ee * cosLa * cosLa;
    var LaF = Math.atan(Math.tan(wgsCon.deg2rad(INP[0])) / Math.cos(Lo * Math.sqrt(1 + NN)));
    var cosLaF = Math.cos(LaF);
    var t = (Math.tan(Lo) * cosLaF) / Math.sqrt(1 + ee * cosLaF * cosLaF);
    var A = a / (1 + n);
    var A1 = A * (1 + nn / 4 + nn * nn / 64);
    var A2 = A * 1.5 * n * (1 - nn / 8);
    var A3 = A * 0.9375 * nn * (1 - nn / 4);
    var A4 = A * 35 / 48.0 * nn * n;
    var OUT = [0, 0];
    OUT[0] = A1 * LaF - A2 * Math.sin(2 * LaF) + A3 * Math.sin(4 * LaF) - A4 * Math.sin(6 * LaF);
    OUT[1] = c * Math.log(t + Math.sqrt(1 + t * t)) + 500000.0 + ZoneNumber * 1000000.0;
    return OUT;
  },
  
  WGS84lalo_to_KKJxy: function(lat, lon){
    var wgs84 = [lat, lon];
    
    var KKJlalo = wgsCon.WGSlalo_to_KKJlalo(wgs84);
    var ZoneNumber = wgsCon.KKJzone(KKJlalo[1]);
    var KKJxy = wgsCon.KKJlalo_to_KKJxy(KKJlalo, ZoneNumber)
    return KKJxy;
  }
}

module.exports = wgsCon;