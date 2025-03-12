"use strict"
var timestamp = undefined
module.exports = function unsendMessage(msg, message, api) {
    if (msg == ".unseen") {
        api.getThreadInfo(message.threadID, (err, info) => {
            var adminIDs = []
            for (var id in info.adminIDs) {
                adminIDs.push(info.adminIDs[id].id)
            }
            if (adminIDs.includes(message.senderID)) {
                if (message.type == "message_reply" && message.messageReply.senderID == "100001308494834") {
                    var msgID = message.messageReply.messageID
                    api.unsendMessage(msgID)
                    api.setMessageReaction("👍", message.messageID);
                } else api.sendMessage("Chưa chọn tin để gỡ hoặc tin đó đéo phải của bố", message.threadID)
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