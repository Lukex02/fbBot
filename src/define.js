"use strict"
const availableCmd = [
    ".title ",
    ".emoji ",
    ".corona",
    ".group ",
    ".juandeag ",
    ".votekick ",
    ".nickname ",
    ".help"
]
module.exports = function define(msg, msgGet, dataDef, fs, message, api) {
    if (msg.includes(" --> ") == true) {
        var textToSave = msgGet.substring(0, msg.indexOf(" --> "));
        var cmd = msg.substring(msg.indexOf(" --> ") + 5, msg.length);
        console.log("cmd", cmd)
        if (cmd.startsWith(availableCmd[0]) || cmd.startsWith(availableCmd[1]) || cmd.startsWith(availableCmd[2]) || cmd.startsWith(availableCmd[3]) || cmd.startsWith(availableCmd[4]) || cmd.startsWith(availableCmd[5]) || cmd.startsWith(availableCmd[6]) || cmd.startsWith(availableCmd[7])) {
            api.setMessageReaction("👍", message.messageID);
            dataDef[textToSave] = cmd;
            var data = JSON.stringify(dataDef, null, 2);
            fs.writeFile('define.json', data, finished);
            function finished(err) {
                if (err) return console.error(err);
            }
            console.log("----- Text '", textToSave, "' was defined as:", cmd)
        } else {
            api.sendMessage("Gán lệnh không hợp lệ.", message.threadID)
        }
    } else if (msg.startsWith(".defdel ")) {
        api.getThreadInfo(message.threadID, (err, info) => {
            var adminIDs = []
            for (var id in info.adminIDs) {
                adminIDs.push(info.adminIDs[id].id)
            }
            if (adminIDs.includes(message.senderID)) {
                var objDel = msgGet.substring(8, msg.length);
                var value = dataDef[objDel]
                if (value != undefined) {
                    delete dataDef[objDel];
                    var data = JSON.stringify(dataDef, null, 2);
                    fs.writeFile('define.json', data, finished);
                    function finished(err) {
                        if (err) return console.error(err);
                        console.log("----- Delete commands for text :", objDel)
                    }
                    api.setMessageReaction("👍", message.messageID);
                } else {
                    api.sendMessage("Chưa lưu, đéo xóa được", message.threadID);
                    console.log("----- No text in data")
                }
            } else {
                notAdmin();
            }            
        })          
    } else {
        var value = dataDef[msgGet]
        if (value != undefined) {
            return value
        } else return msg
    }
    function notAdmin() {
        api.sendMessage("M tuổi j mà đòi ra lệnh t 😒", message.threadID);
        console.log("----- unvalid Admin");
    }
}