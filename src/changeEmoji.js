"use strict"
module.exports = function changeEmoji(msg, message, api) {
    if (msg.startsWith(".emoji") == true) {
        api.changeThreadEmoji(msg.substring(7, msg.length), message.threadID, (err) => {
            if (err) {
                api.setMessageReaction("😠", message.messageID);
                api.sendMessage("Emoji không hợp lệ", message.threadID);
                console.log("----- Emoji isn't valid")
            } else {
                api.setMessageReaction("👍", message.messageID);
                console.log("----- Changed Emoji")
            }
        });
    }
}