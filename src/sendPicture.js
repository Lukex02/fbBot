"use strict"
module.exports = function sendPicture(msgGet, dataPic, fs, message, api) {
    var value = dataPic[message.threadID][msgGet]
    if (value != undefined) {
        var path = "data/" + value + ".png"
        var msgPic = { attachment: fs.createReadStream(path) };
        api.sendMessage(msgPic, message.threadID);
        console.log("----- Bot (pic): ", path);       
    }
}