"use strict"
module.exports = function deletePicture(msg, msgGet, dataPic, fs, message, api) {
    if (msg.startsWith(".picdel ")) {
        api.getThreadInfo(message.threadID, (err, info) => {
            var adminIDs = []
            for (var id in info.adminIDs) {
                adminIDs.push(info.adminIDs[id].id)
            }
            if (adminIDs.includes(message.senderID)) {
                var objDel = msgGet.substring(8, msg.length);
                var value = dataPic[message.threadID][objDel]
                if (value != undefined) {
                    delete dataPic[message.threadID][objDel];
                    var data = JSON.stringify(dataPic, null, 2);
                    var path = "data/" + value + ".png"
                    fs.writeFile('picture.json', data, finished);
                    function finished(err) {
                        if (err) return console.error(err);
                    }
                    fs.unlink(path, (err) => {
                        if (err) throw err;
                        console.log("----- Delete this image :", path);
                    })
                    api.setMessageReaction("👍", message.messageID);
                } else {
                    api.sendMessage("Chưa lưu, đéo xóa được hình", message.threadID);
                    console.log("----- No picture in directory")
                }
            } else {
                notAdmin();
            }
        })
    }
    function notAdmin() {
        api.sendMessage("M tuổi j mà đòi ra lệnh t 😒", message.threadID);
        console.log("----- unvalid Admin");
    }
}