/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	
	__webpack_require__(2);
	
	var _decoder = __webpack_require__(3);
	
	var _decoder2 = _interopRequireDefault(_decoder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	
	ctx.fillStyle = '#FFFFFF';
	var loadCursor = function loadCursor(data) {
	  var decoder = new _decoder2.default(data);
	
	  var images = decoder.getByType(48).map(function (i) {
	    i.data = ctx.createImageData(i.width, i.height);
	    i.data.data.set(new Uint8Array(decoder.getData(i)));
	    return i;
	  });
	
	  var idx = 0;
	
	  setInterval(function () {
	    ctx.fillRect(0, 0, 200, 200);
	    idx = idx >= images.length - 1 ? 0 : idx + 1;
	    ctx.putImageData(images[idx].data, 0, 0);
	  }, images[0].delay);
	};
	
	var oReq = new XMLHttpRequest();
	oReq.open("GET", '/watch.cur', true);
	oReq.responseType = 'arraybuffer';
	
	oReq.onload = function (oEvent) {
	  var arrayBuffer = oReq.response; // Note: not oReq.responseText
	  if (arrayBuffer) {
	    var byteArray = new Uint8Array(arrayBuffer);
	    loadCursor(byteArray);
	  }
	};
	
	oReq.send(null);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "watch.cur";

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var byteArray = __webpack_require__(4);
	var SIGNATURE = __webpack_require__(5).SIGNATURE;
	var IMAGE_HEADER = __webpack_require__(5).IMAGE_HEADER;
	
	/**
	 * Xcur decoder
	 *
	 * @name Decoder
	 * @class
	 * @access public
	 * @param {Array} data array of data bytes
	 */
	var Decoder = function (data) {
	  if (data instanceof byteArray) {
	    this.data = data;
	  } else {
	    this.data = new byteArray(data);
	  }
	
	  if (!this.isCursor()) {
	    throw new Error('No Xcur header found');
	  }
	};
	
	Decoder.prototype.isCursor = function () {
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
	Decoder.prototype.images = function () {
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
	Decoder.prototype.imageInfo = function (num) {
	  this.data.off = num * 12 + 16;
	
	  if (!IMAGE_HEADER.cmp(this.data.nextIntBytes())) {
	    return;
	  }
	
	  this.data.nextInt();
	  this.data.off = this.data.nextInt();
	
	  if (this.data.nextInt() !== 36 || !IMAGE_HEADER.cmp(this.data.nextIntBytes())) {
	    return;
	  }
	
	  return {
	    type: this.data.nextInt(),
	    subtype: this.data.nextInt(),
	    width: this.data.nextInt(),
	    height: this.data.nextInt(),
	    xhot: this.data.nextInt(),
	    yhot: this.data.nextInt(),
	    delay: this.data.nextInt(),
	    start: this.data.off
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
	Decoder.prototype.getDataByNum = function (num) {
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
	Decoder.prototype.getData = function (info) {
	  return this.data.slice(info.start, info.start + info.width * info.height * 4);
	};
	
	/**
	 * Available image types
	 *
	 * @name imageTypes
	 * @function
	 * @access public
	 * @returns {Array} array of available image types
	 */
	Decoder.prototype.imageTypes = function () {
	  var types = [];
	
	  for (var i = 0; i < this.images(); i++) {
	    this.data.off = i * 12 + 20;
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
	Decoder.prototype.getByType = function (type) {
	  var images = [];
	
	  for (var i = 0; i < this.images(); i++) {
	    this.data.off = i * 12 + 20;
	    if (this.data.nextInt() === type) {
	      images.push(this.imageInfo(i));
	    }
	  }
	
	  return images;
	};
	
	module.exports = Decoder;

/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
	 * LE byteArray implementation
	 * by Svetlana Linuxenko <linuxenko@yahoo.com>
	 */
	
	/* eslint no-undef: 0 */
	var byteArray = Int8Array;
	
	var cmp = function (a, b) {
	  if (!b) b = a;a = this;
	  return a.filter(function (c, i) {
	    return c === b[i];
	  }).length === a.length;
	};
	
	var toInt = function (a) {
	  if (!a) a = this.slice(this.off, 4);
	  return a[0] & 0xff | a[1] << 8 & 0xffff | a[2] << 16 & 0xffffff | a[3] << 24 & 0xffffffff;
	};
	
	var toBytes = function (int) {
	  return new byteArray([int & 0xff, int >> 8 & 0xff, int >> 16 & 0xff, int >> 24 & 0xff]);
	};
	
	var nextInt = function () {
	  return this.toInt(this.slice(this.off, this.off += 4));
	};
	
	var nextIntBytes = function () {
	  return this.slice(this.off, this.off += 4);
	};
	
	var insertInt = function (int) {
	  this.insertBytes(this.toBytes(int));
	};
	
	var insertBytes = function (bytes, length) {
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
	
	Object.defineProperty(byteArray.prototype, 'off', {
	  enumerable: false,
	  configurable: false,
	  writable: true,
	  value: 0
	});
	
	module.exports = byteArray;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * From man page
	 *
	   magic: CARD32 'Xcur' (0x58, 0x63, 0x75, 0x72)
	   header: CARD32 bytes in this header
	   version: CARD32 file version number
	   ntoc: CARD32 number of toc entries
	   toc: LISTofTOC table of contents Each table of contents entry looks like:
	
	   type: CARD32 entry type
	   subtype: CARD32 type-specific label - size for images
	   position: CARD32 absolute byte position of table in file Each chunk in the
	   file has set of common header fields followed by additional 
	   type-specific fields:
	
	   header: CARD32 bytes in chunk header (including type-specific fields)
	   type: CARD32 must match type in TOC for this chunk
	   subtype: CARD32 must match subtype in TOC for this chunk
	   version: CARD32 version number for this chunk type There are currently 
	   two chunk types defined for cursor files; comments and images. 
	
	   header: 20 Comment headers are 20 bytes
	   type: 0xfffe0001 Comment type is 0xfffe0001
	   subtype: { 1 (COPYRIGHT), 2 (LICENSE), 3 (OTHER) }
	   version: 1
	   length: CARD32 byte length of UTF-8 string
	   string: LISTofCARD8 UTF-8 string Images look like:
	
	   header: 36 Image headers are 36 bytes
	   type: 0xfffd0002 Image type is 0xfffd0002
	   subtype: CARD32 Image subtype is the nominal size
	   version: 1
	   width: CARD32 Must be less than or equal to 0x7fff
	   height: CARD32 Must be less than or equal to 0x7fff
	   xhot: CARD32 Must be less than or equal to width
	   yhot: CARD32 Must be less than or equal to height
	   delay: CARD32 Delay between animation frames in milliseconds
	   pixels: LISTofCARD32 Packed ARGB format pixels
	*/
	
	var byteArray = __webpack_require__(4);
	
	exports.SIGNATURE = new byteArray([0x58, 0x63, 0x75, 0x72]);
	exports.IMAGE_HEADER = new byteArray([0x02, 0x00, 0xfd, 0xff]);
	exports.COMMENT_HEADER = new byteArray([0x01, 0x00, 0xfd, 0xff]);
	
	/* eslint no-console : 0 */
	exports.debug = console.log;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map