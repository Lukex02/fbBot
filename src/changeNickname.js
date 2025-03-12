"use strict"
module.exports = function changeNickname(msg, partiID, message, api) {
    if (msg.startsWith(".nickname ")) {
        if (partiID.length == 0) {
            var name = msg.replace(".nickname ", "");
            if (name == msg) {
                api.changeNickname("", message.threadID, message.senderID);
                console.log("----- Removing nickname of the sender");
            } else {
                api.changeNickname(name, message.threadID, message.senderID);
                console.log("----- Changing nickname of the sender to : ", name);
            }
            api.setMessageReaction("👍", message.messageID);
        } else {
            for (var id in partiID) {
                var split = msg.substring(10, msg.length).split('"')
                var name = split[1]
                if (name == "") {
                    api.changeNickname("", message.threadID, partiID[id]);
                    console.log("----- Removing nickname of : ", partiID[id]);
                    api.setMessageReaction("👍", message.messageID);
                } else if (name == undefined) {
                    api.sendMessage('Vui lòng đặt nickname trong ngoặc kép " "', message.threadID)
                } else {
                    api.changeNickname(name, message.threadID, partiID[id]);
                    console.log("----- Changing nickname of ", partiID[id], "to : ", name);
                    api.setMessageReaction("👍", message.messageID);
                }
            }
        }
    }    
}