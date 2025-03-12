"use strict"
module.exports = function deleteText(msg, msgGet, dataText, dataTag, fs, message, api) {
    if (msg.startsWith(".txtdel ")) {
        api.getThreadInfo(message.threadID, (err, info) => {
            var adminIDs = []
            for (var id in info.adminIDs) {
                adminIDs.push(info.adminIDs[id].id)
            }
            if (adminIDs.includes(message.senderID)) {
                var objDel = msgGet.substring(8, msg.length);
                var value = dataText[message.threadID][objDel]
                if (value != undefined) {
                    delete dataText[message.threadID][objDel];                  
                    var data = JSON.stringify(dataText, null, 2);
                    fs.writeFile('data.json', data, finished);                 
                    
                    if (dataTag[message.threadID][objDel] != undefined) {
                        delete dataTag[message.threadID][objDel];
                        var data1 = JSON.stringify(dataTag, null, 2);                       
                        fs.writeFile('tag.json', data1, finished);
                    }                   
                    function finished(err) {
                        if (err) return console.error(err);                        
                    }
                    console.log("----- Delete text : ", objDel)
                    api.setMessageReaction("👍", message.messageID);
                } else {
                    api.sendMessage("Chưa lưu, đéo xóa được", message.threadID);
                    console.log("----- No text in data")
                }
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