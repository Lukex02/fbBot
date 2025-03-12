"use strict"
const fs = require("fs");

var ban = fs.readFileSync('blacklist.json'); var dataBan = JSON.parse(ban);

module.exports = function ban(msg, partiID, message, api) {
    if (msg.startsWith(".blacklist ")) {
        api.getThreadInfo(message.threadID, (err, info) => {
            var adminIDs = []
            for (var id in info.adminIDs) {
                adminIDs.push(info.adminIDs[id].id)
            }
            if (adminIDs.includes(message.senderID)) {
                var banLists = partiID
                for (var i in banLists) {
                    if (dataBan[banLists[i]] == undefined) {
                        dataBan[banLists[i]] = 0;
                    } else {
                        api.sendMessage("Đã vào Blacklist rồi", message.threadID)
                    }
                    var data = JSON.stringify(dataBan, null, 2);
                    fs.writeFile('blacklist.json', data, finished);
                    function finished(err) {
                        if (err) return console.error(err);
                        api.setMessageReaction("👍", message.messageID);
                    }
                }
                console.log("----- To the blacklist:", partiID)
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

