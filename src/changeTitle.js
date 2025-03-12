"use strict"
module.exports = function changeTitle(mess, message, api) {
    if (mess.startsWith(".title") == true) {
        var title = mess.substring(7, mess.length)
        api.setMessageReaction("👍", message.messageID);
        api.setTitle(title, message.threadID);
        console.log("----- Changing title to : ", title)
    }
}