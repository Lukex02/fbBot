"use strict"
var requestUrl = "http://api.qrserver.com/v1/create-qr-code/?size=150x150&data="
const tempPath = "temp/qr.jpg"
var options = {

}
module.exports = function getQr(msg, fs, request, message, api) {
    if (msg.startsWith(".qr ")) {
        var qr = encodeURI(msg.substring(4, msg.length))           
        request(requestUrl + qr, callback)
            .pipe(fs.createWriteStream(tempPath))
        console.log(requestUrl + qr)
    }
    function deleteTemp() {
        fs.unlink(tempPath, (err) => {
            if (err) throw err;
        })
    }
    function callback() {
        var code = { attachment: fs.createReadStream(tempPath) }
        api.sendMessage(code, message.threadID, (err, info) => {
            deleteTemp()
            console.log("----- Sent QR Code")
        })
    }
}