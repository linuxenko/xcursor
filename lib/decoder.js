var byteArray = require('./bytearray');
var SIGNATURE = require('./utils').SIGNATURE;
var IMAGE_HEADER = require('./utils').IMAGE_HEADER;

/**
 * Xcur decoder
 *
 * @name Decoder
 * @class
 * @access public
 * @param {Array} data array of data bytes
 */
var Decoder = function(data) {
  if (data instanceof byteArray) {
    this.data = data;
  } else {
    this.data = new byteArray(data);
  }

  if (!this.isCursor()) {
    throw new Error('No Xcur header found');
  }
};

Decoder.prototype.isCursor = function() {
  return SIGNATURE.cmp(this.data.nextIntBytes());
};

/**
 * Get number of images
 *
 * @name images
 * @function
 * @access public
 * @returns {int}
 */
Decoder.prototype.images = function() {
  this.data.off = 12;
  return this.data.nextInt();
};

/**
 * Get entry information
 *
 * @name imageInfo
 * @function
 * @access public
 * @param {int} num number of entry
 * @returns {Object} Image information e.g dimenstions, delay etc.
 */
Decoder.prototype.imageInfo = function(num) {
  this.data.off = (num * 12) + 16;

  if (!IMAGE_HEADER.cmp(this.data.nextIntBytes())) {
    return;
  }

  this.data.nextInt();
  this.data.off = this.data.nextInt();

  if (this.data.nextInt() !== 36 || !IMAGE_HEADER.cmp(this.data.nextIntBytes())) {
    return;
  }

  return {
    type : this.data.nextInt(),
    subtype : this.data.nextInt(),
    width: this.data.nextInt(),
    height: this.data.nextInt(),
    xhot : this.data.nextInt(),
    yhot : this.data.nextInt(),
    delay : this.data.nextInt(),
    start : this.data.off,
  };
};

/**
 * Get image pixel data by entry number
 *
 * @name getDataByNum
 * @function
 * @access public
 * @param {int} num Number of entry
 * @returns {Array | Int8Array if available} pixel data
 */
Decoder.prototype.getDataByNum = function(num) {
  return this.getData(this.imageInfo(num));
};

/**
 * Get image data by imageInfo
 *
 * @name getData
 * @function
 * @access public
 * @param {ImageInfo (Object)} info info created by imageInfo()
 * @returns {Array | Int8Array} pixels
 */
Decoder.prototype.getData = function(info) {
  return this.data.slice(info.start, info.start + (info.width * info.height) * 4);
};

/**
 * Available image types
 *
 * @name imageTypes
 * @function
 * @access public
 * @returns {Array} array of available image types
 */
Decoder.prototype.imageTypes = function() {
  var types = [];

  for (var i = 0; i < this.images(); i++) {
    this.data.off = (i * 12) + 20;
    var type = this.data.nextInt();
    if (types.indexOf(type) === -1) {
      types.push(type);
    }
  }

  return types;
};

/**
 * Get images by type
 *
 * @name getByType
 * @function
 * @access public
 * @param {type} type type of the images
 * @returns {Array} array of all available images with specified type
 */
Decoder.prototype.getByType = function(type) {
  var images = [];

  for (var i = 0; i < this.images(); i++) {
    this.data.off = (i * 12) + 20;
    if (this.data.nextInt() === type) {
      images.push(this.imageInfo(i));
    }
  }

  return images;
};

module.exports = Decoder;
