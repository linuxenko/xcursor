var byteArray = require('../lib/bytearray');
var expect = require('chai').expect;

describe('Test bytearray tranisitions', function() {
  it('should create arrays and compare it', function() {
    var a1 = new byteArray([1,2,3,4]);
    var a2 = new byteArray([1,2,3,4]);
    var b1 = new byteArray([4,3,2,1]);

    expect(a1).to.be.exist;
    expect(a1.length).to.be.exist;

    expect(a1.cmp).to.be.exist;
    expect(a1.cmp(a2)).to.be.true;
    expect(a1.cmp(b1)).to.be.false;
  });

  it('should work with integers', function() {
    var a1 = new byteArray([3, 0, 0, 0]);
    var a2 = new byteArray([0,0,0,0,4,0,0,0]);

    expect(a1.toInt()).to.be.equal(3);
    expect(a1.length).to.be.equal(4);
    expect(a2.nextInt()).to.be.equal(0);
    expect(a2.nextInt()).to.be.equal(4);
    expect(a1.toBytes(3).toInt()).to.equal(3);

    expect(a1.toBytes(38201).toInt()).to.equal(38201);
    expect(a1.toBytes(78999).toInt()).to.equal(78999);
    expect(a1.toBytes(36422).toInt()).to.equal(36422);
  });

  it('should work with bytes well', function() {
    var ba = new byteArray();
    var a1 = [3, 0, 0, 0];

    expect(ba.toInt(a1)).to.be.equal(3);
    expect(ba.toInt(new byteArray(a1).nextIntBytes())).to.be.equal(3);
  });

  it('should append items', function() {
    var a = new byteArray(4);

    expect(a.length).to.be.equal(4);

    a.insertInt(1000);

    expect(a.length).to.be.equal(4);
    a.off = 0;
    expect(a.nextInt()).to.be.equal(1000);

  });
});
