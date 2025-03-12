"use strict"
const fs = require("fs");
var remove = fs.readFileSync('remove.json'); var dataRemove = JSON.parse(remove);
module.exports = function addLeave(msg, message, api) {
    if (msg == ".leave") {       
        dataRemove["kicked"] = message.senderID
        var data = JSON.stringify(dataRemove, null, 2);
        fs.writeFile('remove.json', data, finished);       
        api.removeUserFromGroup(message.senderID, message.threadID)
    }
    if (msg == ".add") {
        var user = dataRemove["kicked"]
        if (user != undefined) {
            api.getThreadInfo(message.threadID, (err, info) => {
                if (info.participantIDs.includes(user)) {
                    api.sendMessage("Nó ở trong group rồi", message.threadID)
                    del()
                } else {
                    del()
                    api.addUserToGroup(user, message.threadID)
                }
            })                   
        } else {
            api.sendMessage("Đã thằng nào đi tìm đường cứu nước đâu mà add vào", message.threadID)
        }
    }
    function finished(err) {
        if (err) return console.error(err);
    }
    function del() {
        delete dataRemove["kicked"]
        var data = JSON.stringify(dataRemove, null, 2);
        fs.writeFile('remove.json', data, finished);
    }
}