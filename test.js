const moment = require('moment')
var objectIdToTimestamp = require('objectid-to-timestamp');
const time = moment(objectIdToTimestamp('563229dd1ee6030100644cbe')).format('YYYY-MM-DD HH:mm')

console.log(time)