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

var byteArray = require('./bytearray');

exports.SIGNATURE = new byteArray([0x58, 0x63, 0x75, 0x72]);
exports.IMAGE_HEADER = new byteArray([0x02, 0x00, 0xfd, 0xff]);
exports.COMMENT_HEADER = new byteArray([0x01, 0x00, 0xfd, 0xff]);

/* eslint no-console : 0 */
exports.debug = console.log;
