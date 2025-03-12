"use strict"
module.exports = function changeGroupAvatar(msg, msgGet, dataPic, fs, message, api) {
    if (msg.startsWith(".group")) {
        var groupPic = msgGet.substring(7, msgGet.length);
        var path = "./data/" + dataPic[groupPic] + ".png"
        api.changeGroupImage(fs.createReadStream(path), message.threadID, (err) => {
            if (err) {
                api.sendMessage("Ảnh không tồn tại!", message.threadID)
                console.log("----- No picture available in directory")
            } else if (!err) {
                api.setMessageReaction("👍", message.messageID);
                console.log("----- Changing group avatar to :", path);
            }
        })
    }    
}