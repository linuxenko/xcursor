/*
 * LE byteArray implementation
 * by Svetlana Linuxenko <linuxenko@yahoo.com>
 */

/* eslint no-undef: 0 */
var byteArray = Int8Array;

var cmp = function(a, b) {
  if (!b) b = a; a = this;
  return a.filter(function(c,i) { return c === b[i]; }).length === a.length;
};

var toInt = function(a) {
  if (!a) a = this.slice(this.off, 4);
  return a[0] & 0xff | (a[1] << 8) & 0xffff | (a[2] << 16) & 0xffffff | (a[3] << 24) & 0xffffffff;
};

var toBytes = function(int) {
  return new byteArray([
    int & 0xff,
    (int >> 8) & 0xff,
    (int >> 16) & 0xff,
    (int >> 24) & 0xff
  ]);
};

var nextInt = function() {
  return this.toInt(this.slice(this.off, (this.off += 4)));
};

var nextIntBytes = function() {
  return this.slice(this.off, (this.off += 4));
};

var insertInt = function(int) {
  this.insertBytes(this.toBytes(int));
};

var insertBytes = function(bytes, length) {
  length = length || 4;
  this.set(bytes, this.off, length);
  this.off += length;
};

byteArray.prototype.cmp = cmp;
byteArray.prototype.toInt = toInt;
byteArray.prototype.nextInt = nextInt;
byteArray.prototype.nextIntBytes = nextIntBytes;
byteArray.prototype.toBytes = toBytes;
byteArray.prototype.insertInt = insertInt;
byteArray.prototype.insertBytes = insertBytes;

Object.defineProperty(byteArray.prototype , 'off', {
  enumerable: false,
  configurable: false,
  writable: true,
  value : 0
});

module.exports = byteArray;
