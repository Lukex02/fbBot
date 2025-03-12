"use strict"
module.exports = function getText(msg, msgGet, dataText, dataTag, partiID, fs, message, api) {
    if (msg.includes(" => ") == true) {
        var textToSave = msgGet.substring(0, msg.indexOf(" => "));
        var textSave = [msg.substring(msg.indexOf(" => ") + 4, msg.length)];
        var textTag = partiID
        var index
        if (textTag.length > 0) {
            if (dataText[message.threadID][textToSave] == undefined) {
                index = 0

            } else {
                index = dataText[message.threadID][textToSave].length                
            }
            if (dataTag[message.threadID][textToSave] == undefined) {
                dataTag[message.threadID][textToSave] = {}
                dataTag[message.threadID][textToSave][index] = textTag;
            } else {
                dataTag[message.threadID][textToSave][index] = textTag
            }
        }
        if (dataText[message.threadID][textToSave] == undefined) {
            dataText[message.threadID][textToSave] = textSave
            save()
        } else if (dataText[message.threadID][textToSave].includes(textSave[0]) == false) {
            dataText[message.threadID][textToSave] = dataText[message.threadID][textToSave].concat(textSave);
            save()
        } else {
            api.sendMessage("M lưu trùng làm cc j tml", message.threadID)
        }
        function save() {
            var data = JSON.stringify(dataText, null, 2);
            fs.writeFile('data.json', data, finished);
            if (textTag.length > 0) {
                var data0 = JSON.stringify(dataTag, null, 2);
                fs.writeFile('tag.json', data0, finished);
            }
            api.setMessageReaction("👍", message.messageID);
            console.log("----- Text '", textToSave, "' was saved as", textSave[0])
        }
    }
    function finished(err) {
        if (err) return console.error(err);
    }
}