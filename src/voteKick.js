"use strict"
var votekick = false;
var f1 = 0;
var personGetKicked;
var peopleVoted = [];
module.exports = function voteKick(msg, msgGet, participantNames, partiID, fs, message, api) {
    //
    //Votekick
    //
    if (msg.startsWith(".votekick")) {
        for (var id in participantNames) {
            if (msg.includes(participantNames[id]) == true) {
                api.setMessageReaction("👍", message.messageID);
                personGetKicked = partiID[id];
                var msgSend = { attachment: fs.createReadStream("temp/v0tekick1.png") };
                api.sendMessage("30 giây để votekick! Cần ít nhất 3 phiếu", message.threadID);
                api.sendMessage(msgSend, message.threadID);
                votekick = true;
                break;
                console.log("----- Got a votekick request for : ", personGetKicked)
            }
        }
    }
    if (votekick == true) {
        if (msgGet == "f1" && peopleVoted.includes(message.senderID) == false) {
            f1++;
            var personVote = message.senderID;
            peopleVoted.push(personVote);
            console.log("----- Just got a vote!")
            console.log("-----Number of votes now: ", f1);
            api.setMessageReaction("😢", message.messageID);
        } else if (msgGet == "f1") {
            api.sendMessage("M F1 2 lần làm j? Tưởng t ko biết à", message.threadID);
            console.log("----- Who the fuck just press F1 twice")
        }
        setTimeout(VoteKick, 30000);
    }
    //
    //Function kick for /votekick
    //
    function VoteKick() {
        if (f1 >= 3) {
            var msg = { attachment: fs.createReadStream("temp/v0tekick2.png") };
            api.sendMessage(msg, message.threadID);
            api.sendMessage("Big F, lên đường vui vẻ!", message.threadID)
            setTimeout(kick, 4000)
            f1 = 0;
            votekick = false;
            peopleVoted = []
        } else if (f1 < 3 && votekick == true) {
            api.sendMessage("Không đủ số phiếu, hủy kick!", message.threadID);
            votekick = false;
            f1 = 0;
            console.log("----- Cancelling votekick")
            peopleVoted = []
        }
    }
    function kick() {
        api.removeUserFromGroup(personGetKicked, message.threadID)
        console.log("----- Kicked successful")
        peopleVoted = []
    }
}