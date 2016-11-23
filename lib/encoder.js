var byteArray = require('./bytearray');
var SIGNATURE = require('./utils').SIGNATURE;
var IMAGE_HEADER = require('./utils').IMAGE_HEADER;

/*
 *   image : {
 *      type : 48,
 *      subtype : 
 *      width: 48,
 *      height: 48,
 *      xhot : 5,
 *      yhot : 7,
 *      delay : 50,
 *      data : pixels
 *      }
 */

/**
 * Xcur Encoder
 *
 * @name Encoder
 * @function
 * @access public
 * @param {Array} images array of image objects 
 */
var Encoder = function(images) {
  this.images = [];
  images = images || [];
  for ( var i = 0; i < images.length; i++) {
    this.addImage(images[i]);
  }
};

/**
 * Append a single image into images array
 *
 * @name addImage
 * @function
 * @access public
 * @param {Object} image image object
 */
Encoder.prototype.addImage = function(image) {
  this.images.push({
    type : image.type,
    subtype : image.subtype || 1,
    width: image.width || image.type,
    height: image.height || image.type,
    xhot : image.xhot || 0,
    yhot : image.yhot || 0,
    delay : image.delay || 50,
    data : image.data
  });
};

Encoder.prototype._imagesSize = function(images) {
  return images.reduce(function(a, b) {
    return a + 48 + ((b.width * b.height) * 4);
  }, 16);
};

Encoder.prototype._imagePos = function(images, position) {
  return (12 * images.length) + 16 + images.filter(function(i, p) {
    return p < position;
  }).reduce(function(a, b) {
    return a + 36 + ((b.width * b.height) * 4);
  }, 0);
};

/**
 * Pack images into Xcur stream
 *
 * @name pack
 * @function
 * @access public
 * @param {Array or null} images
 * @returns {Int8Array} packed Xcur data
 */
Encoder.prototype.pack = function(images) {
  this.images = images || this.images;
  var data = new byteArray(this._imagesSize(this.images));

  /* Insert magic header */
  data.insertBytes(SIGNATURE);
  data.insertInt(16);
  data.insertInt(1);
  data.insertInt(this.images.length);

  /* Insert ntoc headers */
  for (var i = 0; i < this.images.length; i++) {
    data.insertBytes(IMAGE_HEADER);
    data.insertInt(this.images[i].type);
    data.insertInt(this._imagePos(this.images, i));
  }

  /* Insert images */
  for (i = 0; i < this.images.length; i++) {
    data.insertInt(36);
    data.insertBytes(IMAGE_HEADER);
    data.insertInt(this.images[i].type);
    data.insertInt(this.images[i].subtype);
    data.insertInt(this.images[i].width);
    data.insertInt(this.images[i].height);
    data.insertInt(this.images[i].xhot);
    data.insertInt(this.images[i].yhot);
    data.insertInt(this.images[i].delay);
    data.insertBytes(this.images[i].data, this.images[i].data.length);
  }

  /* eslint no-undef:0 */
  return new Uint8Array(data);
};

module.exports = Encoder;
