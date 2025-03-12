"use strict"
module.exports = function allowActive(msg, dataAllow, dataText, dataTag, dataPic, fs, message, api) {
    if (msg == ".allow" && dataAllow[message.threadID] == undefined) {
        api.getThreadInfo(message.threadID, (err, info) => {
            var adminIDs = []
            for (var id in info.adminIDs) {
                adminIDs.push(info.adminIDs[id].id)
            }
            if (adminIDs.includes(message.senderID) || message.senderID == "100015511416756") {
                if (info.isGroup == true) {
                    var threadID = info.threadID
                    dataAllow[threadID] = threadID
                    var data = JSON.stringify(dataAllow, null, 2);
                    function finished(err) {
                        if (err) return console.error(err);
                        console.log("----- Bot activate! in:", info.name);
                        api.sendMessage("Tôi đã được cấp quyền hoạt động tại group này, .help để biết tôi có thể làm được gì", message.threadID)
                        if (dataText[message.threadID] == undefined) {
                            dataText[message.threadID] = {}
                            var data = JSON.stringify(dataText, null, 2);
                            fs.writeFile('data.json', data, finished);
                        }
                        if (dataTag[message.threadID] == undefined) {
                            dataTag[message.threadID] = {}
                            var data = JSON.stringify(dataTag, null, 2);
                            fs.writeFile('tag.json', data, finished);
                        }
                        if (dataPic[message.threadID] == undefined) {
                            dataPic[message.threadID] = {}
                            var data = JSON.stringify(dataPic, null, 2);
                            fs.writeFile('picture.json', data, finished);
                        }
                        function finished(err) {
                            if (err) return console.error(err);
                        }
                    }
                    fs.writeFile('allow.json', data, finished);
                }
            } else {
                api.sendMessage("M tuổi j mà đòi ra lệnh t 😒", message.threadID);
                console.log("----- unvalid Admin");
            }
        })
    }
    if (msg == ".disallow") {
        api.getThreadInfo(message.threadID, (err, info) => {
            var adminIDs = []
            for (var id in info.adminIDs) {
                adminIDs.push(info.adminIDs[id].id)
            }
            if (adminIDs.includes(message.senderID)) {
                api.setMessageReaction("😢", message.messageID)
                delete dataAllow[message.threadID]
                var data = JSON.stringify(dataAllow, null, 2);
                fs.writeFile('allow.json', data, finished);
                function finished(err) {
                    if (err) return console.error(err);
                    console.log("----- Disabling bot in:", info.name)
                }
            } else {
                api.sendMessage("M tuổi j mà đòi ra lệnh t 😒", message.threadID);
                console.log("----- unvalid Admin");
            }
        })
    }
}