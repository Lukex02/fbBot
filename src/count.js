"use strict"
module.exports = function count(msg, message, api) {
    if (msg == ".count") {
        api.getThreadInfo(message.threadID, (err, info) => {
            var count = info.messageCount
            if (info.threadID == "3146959471981655") {
                count += 255794
            }
            api.sendMessage("Tổng số tin nhắn: " + count, message.threadID)
            console.log("----- Sent message count:", count)
        })
    }
}