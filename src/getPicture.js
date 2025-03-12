"use strict"
var action = false;
var personSendingPic;
var textPic;
module.exports = function getPicture(msg, msgGet, dataPic, fs, request, message, api) {
    if (msg.startsWith("#")) {
        getTextPic()
    }
    if (action == true) {
        if (msg !== "/stop") {
            if (message.senderID == personSendingPic) {
                takePic();
                setTimeout(timeOut, 30000)
            }
        } else {
            api.setMessageReaction("👍", message.messageID);
            action = false;
            console.log("----- Request canceled")
        }
    }
    function takePic() {
        var msgPic = message.attachments;
        for (var key in msgPic) {
            var value = msgPic[key];
            var url = value.largePreviewUrl;
            var time = new Date()
            var picName = time.getTime()
            var path = "./data/image-" + picName + ".png";
            const download = (url, path, callback) => {
                request.head(url, (err, res, body) => {
                    request(url)
                        .pipe(fs.createWriteStream(path))
                        .on('close', callback)
                })
            }
            download(url, path, () => {
                api.setMessageReaction("👍", message.messageID);
                console.log('----- Image saved!');
                action = false;
                dataPic[message.threadID][textPic] = "image-" + picName
                var data = JSON.stringify(dataPic, null, 2);
                fs.writeFile('picture.json', data, finished);
                function finished(err) {
                    if (err) return console.error(err);
                }
            })           
            break;
        }        
    }
    function timeOut() {
        action = false
    }
    function getTextPic() {
        textPic = msgGet.substring(1, msg.length);
        if (dataPic[message.threadID][textPic] == undefined) {
            api.sendMessage("Vui lòng gửi ảnh lên 🤡", message.threadID);           
            console.log("----- Requesting Picture...")
            action = true;
            personSendingPic = message.senderID;
        } else {
            api.sendMessage("Hình đã được gán từ trước rồi", message.threadID)
            action = false
        }
    }
}