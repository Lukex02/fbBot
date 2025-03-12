"use strict"
const fs = require("fs");
const request = require("request");

var girl1 = fs.readFileSync('TempData/girl.json'); var dataGirl1 = JSON.parse(girl1);
var access = fs.readFileSync('TempData/access.json'); var dataAccess = JSON.parse(access);
var pathGirl = "privateData/tempGirl.jpg"
module.exports = function girl(msg, msgGet, message, api) {
    if (msg == ".access" && dataAccess[message.threadID] == undefined) {
        dataAccess[message.threadID] = "allow"
        var data = JSON.stringify(dataAccess, null, 2);
        fs.writeFile('TempData/access.json', data, finished);
        function finished(err) {
            if (err) return console.error(err);
        }
        api.setMessageReaction("👍", message.messageID);
    }
    if (dataAccess[message.threadID] == "allow") {
        if (msgGet == "ảnh gái 1") {
            getPicInJson(dataGirl1, 1, 42747)
        }      
        if (msgGet == "ảnh gái 2") {
            getPicInFolder("girl_2", 2950)
        }      
        if (msgGet == "ảnh gái 3") {
            getPicInFolder("girl_3", 1550)
        }
    }
    if (message.senderID == "100015511416756") {       
        if (msgGet == "ảnh gái 4") {
            getPicInFolder("girl_4", 191)
        }
    }
    function getPicInFolder(folder, size) {
        var num = Math.floor(Math.random() * size)
        console.log("----- Source", folder + ":", num + "/" + size)             
        var pic = { attachment: fs.createReadStream("TempData/" + folder + "/girl " + "(" + num + ")" + ".jpg") }        
        api.sendMessage(pic, message.threadID)
    }
    function getPicInJson(dataReq, index, size) {
        var num = Math.floor(Math.random() * size)
        console.log("----- Source", index + ":", num + "/" + size)
        request(dataReq[num])
            .pipe(fs.createWriteStream(pathGirl))
            .on('close', sendPic)
        api.sendMessage("Đợi tí đang lấy sốt", message.threadID)
        //setTimeout(sendPic, 4000)   
    }
    function deleteTemp() {
        fs.unlink(pathGirl, (err) => {
            if (err) throw err;
        })
    }
    function sendPic() {
        var msgPic = { attachment: fs.createReadStream(pathGirl) }
        api.sendMessage(msgPic, message.threadID, (err, cb) => {
            deleteTemp()
        })
    }
}