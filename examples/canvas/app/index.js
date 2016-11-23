import './index.html';
import './watch.cur';
import Decoder from 'decoder';


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = '#FFFFFF';
let loadCursor = function(data) {
  var decoder = new Decoder(data);

  var images = decoder.getByType(48).map(function(i) {
    i.data = ctx.createImageData(i.width, i.height);
    i.data.data.set(new Uint8Array(decoder.getData(i)));
    return i;
  });

  var idx = 0;

  setInterval(function() {
    ctx.fillRect(0,0,200,200);
    idx = idx >= images.length - 1 ? 0 : idx + 1;
    ctx.putImageData(images[idx].data, 0, 0);
  }, images[0].delay);

};

var oReq = new XMLHttpRequest();
oReq.open("GET", './watch.cur', true);
oReq.responseType = 'arraybuffer';

oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    loadCursor(byteArray);
  }
};

oReq.send(null)