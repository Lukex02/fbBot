"use strict"
module.exports = function setAdmin(msg, participantNames, partiID, fs, message, api) {
    if (msg.startsWith(".admin ")) {
        api.getThreadInfo(message.threadID, (err, info) => {
            var adminIDs = []
            for (var id in info.adminIDs) {            
                adminIDs.push(info.adminIDs[id].id)
            }
            if (adminIDs.includes(message.senderID)) {
                console.log("----- valid Admin, addding Admin!");
                if (partiID.length != 0) {
                    for (var id in partiID) {
                        var adminIDs = partiID
                        api.changeAdminStatus(message.threadID, adminIDs, true, adminCallback)
                        api.setMessageReaction("👍", message.messageID);
                    }
                } else api.sendMessage("Bạn phải tag người muốn làm admin vào", message.threadID)
            } else {
                notAdmin();
            }
        })

    }
    function notAdmin() {
        api.sendMessage("M tuổi j mà đòi ra lệnh t 😒", message.threadID);
        console.log("----- unvalid Admin");
    }
    function adminCallback(err) {
        console.log("----- Admin added successful!");
    }
}