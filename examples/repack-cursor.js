var Encoder = require('../').Encoder;
var Decoder = require('../').Decoder;

var fs = require('fs');
var path = require('path');

var arrowfile = path.resolve(__dirname, '../tests/misc/watch');
var outdir = path.resolve(__dirname, './out');

var decoder = new Decoder(fs.readFileSync(arrowfile));

var images = decoder.getByType(48).map(function(i) {
  return {
    type : 48,
    xhot : i.xhot,
    yhot : i.yhot,
    delay : i.delay,
    data : decoder.getData(i)
  };
});

var encoder = new Encoder(images);

fs.writeFileSync(path.resolve(outdir, 'repacked'), Buffer.from(encoder.pack()));

