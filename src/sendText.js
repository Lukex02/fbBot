"use strict"
module.exports = function sendText(msgGet, dataText, dataTag, message, api) {
    var value = dataText[message.threadID][msgGet]
    if (value != undefined) {
        var finalText;
        var i = Math.floor((Math.random() * value.length))
        finalText = value[i];
        var msgSending = finalText;
        var ment;
        var finalMent = [];
        if (dataTag[message.threadID][msgGet] == undefined) {
            api.sendMessage(finalText, message.threadID);
            console.log("----- Bot (text): ", finalText);
        } else {
            ment = dataTag[message.threadID][msgGet][i]
            api.getUserInfo(ment, (err, info) => {
                for (var i in info) {
                    if (finalText.includes(info[i].name)) {
                        finalMent.push({
                            tag: "@" + info[i].name,
                            id: i
                        })
                    }
                }
                msgSending = {
                    body: finalText,
                    mentions: finalMent
                }
                api.sendMessage(msgSending, message.threadID);
                console.log("----- Bot (text with mentions): ", msgSending);
            })
        }
    }
}