var Encoder = require('../lib/encoder');
var Decoder = require('../lib/decoder');

var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var watchfile = path.resolve(__dirname, 'misc/watch');
var images32 = [];


describe('Test cursor encoder', function() {
  before(function() {
    var decoder = new Decoder(fs.readFileSync(watchfile));
    images32 = decoder.getByType(32).map(function(i) {
      return {
        type : 32,
        subtype : i.subtype,
        width: i.width,
        height: i.height,
        xhot : i.xhot,
        yhot : i.yhot,
        delay : i.delay,
        data : decoder.getData(i)
      };
    });
  });

  it('should unpack 32 images', function() {
    expect(images32).to.be.an('array');
    expect(images32.length).to.be.equal(31);
    expect(images32[30].width).to.be.exist;
  });

  it('should pack all 32 images', function() {
    var encoder = new Encoder(images32);

    expect(encoder).to.be.exist;
    var data = encoder.pack();

    var decoder = new Decoder(data);
    expect(decoder.images()).to.be.equal(31);
    expect(decoder.imageTypes()).to.deep.equal([32]);
    expect(decoder.imageInfo(2).width).to.be.equal(32);
  });
});
