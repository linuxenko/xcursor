var Decoder = require('../').Decoder;
var fs = require('fs');
var path = require('path');


var arrowfile = path.resolve(__dirname, '../tests/misc/arrow');
var outdir = path.resolve(__dirname, './out');

var arrowData = fs.readFileSync(arrowfile);
var decoder = new Decoder(arrowData);

for (var i = 0; i < decoder.images(); i++) {
  var image = decoder.imageInfo(i);
  var filename = path.join(outdir, image.type + '-' + i + '.data');
  var data = decoder.getData(image);
  fs.writeFileSync(filename, Buffer.from(data));
}

