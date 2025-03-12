"use strict"
var personGetKicked;
var kick = false;
module.exports = function juanDeag(msg, participantNames, partiID, fs, message, api) {
    //
    //Random JuanDeag
    //
    if (msg == ".juandeag") {
        api.getThreadInfo(message.threadID, (err, info) => {
            var adminIDs = []
            for (var id in info.adminIDs) {
                adminIDs.push(info.adminIDs[id].id)
            }
            if (adminIDs.includes(message.senderID)) {
                api.setMessageReaction("👍", message.messageID);
                api.getThreadInfo(message.threadID, (err, info) => {
                    partiID = info.participantIDs
                    var id = Math.floor((Math.random() * partiID.length) + 0);
                    personGetKicked = partiID[id];
                    console.log("----- Person get kicked : ", personGetKicked);
                })
                kick = true;
            } else {
                notAdmin();
            }
        })
    }
    if (kick == true) {
        deKicking();
    }
    //
    //Function kick for /juandeag
    //
    function deKicking() {
        setTimeout(function () {
            api.removeUserFromGroup(personGetKicked, message.threadID)
            console.log("----- Kicked successful")
        }, 4000)
        kick = false;
        var msgSend = { attachment: fs.createReadStream("temp/juandeag.jpg") };
        api.sendMessage(msgSend, message.threadID);
        api.sendMessage("F, vỡ cái mồm này", message.threadID)
    }
    function notAdmin() {
        api.sendMessage("M tuổi j mà đòi ra lệnh t 😒", message.threadID);
        console.log("unvalid Admin");
    }
}