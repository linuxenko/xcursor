var Decoder = require('../lib/decoder');
var Utils = require('../lib/utils');
var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');

var arrowfile = path.resolve(__dirname, 'misc/arrow');
var watchfile = path.resolve(__dirname, 'misc/watch');
var data;
var decoder;

describe('Test cursor decoder', function() {
  before(function() {
    data = fs.readFileSync(arrowfile);
    decoder = new Decoder(data);
  });


  it('should has well formed decoder', function() {
    expect(data).to.be.exist;
    expect(data.length).not.be.an('undefined');
    expect(decoder).to.be.exist;
    expect(decoder).to.be.instanceof(Decoder);
  });

  it('should handle any kind of buffer', function() {
    expect(function() {
      new Decoder([0,0,0]);
    }).to.throw(Error);

    expect(function() {
      new Decoder(Utils.SIGNATURE);
      var arr = Array.from(Utils.SIGNATURE.slice(0, 5));
      new Decoder(arr);
    }).not.throw(Error);
  });

  it('should return number of images', function() {
    expect(decoder.images()).to.equal(3);
  });

  it('sould read image info', function() {
    var info0 = decoder.imageInfo(0);
    var info1 = decoder.imageInfo(1);
    var info2 = decoder.imageInfo(2);

    expect(info0).to.be.exist;
    expect(info0.width).to.be.equal(24);
    expect(info0.height).to.be.equal(24);
    expect(info0.start > 52).to.be.true;

    expect(info1).to.be.exist;
    expect(info1.width).to.be.equal(32);
    expect(info1.height).to.be.equal(32);

    expect(info2).to.be.exist;
    expect(info2.type).to.be.equal(48);
    expect(info2.width).to.be.equal(48);
    expect(info2.height).to.be.equal(48);
    expect(info2.start > 52).to.be.true;
  });

  it('should read image data', function() {
    expect(decoder.getDataByNum(2)).to.be.exist;
    expect(decoder.getDataByNum(2).length > 1).to.be.true;

    var info = decoder.imageInfo(1);
    expect(decoder.getData(info).length > 1).to.be.true;
  });

  it('should get image types', function() {
    var decoder = new Decoder(fs.readFileSync(watchfile));
    var entries = 93;

    expect(decoder.images()).to.be.equal(entries);
    expect(decoder.imageTypes()).to.be.exist;
    expect(decoder.imageTypes()).to.be.an('array');
    expect(decoder.imageTypes().length).to.be.equal(3);
  });

  it('should get images by type', function() {
    var decoder = new Decoder(fs.readFileSync(watchfile));

    expect(decoder.getByType(32)).to.be.an('array');
    expect(decoder.getByType(24).length).to.be.equal(31);
  });
});
