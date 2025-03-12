const fs = require("fs");
const request = require("request");

var data = fs.readFileSync('privateData/text.json'); var dataText = JSON.parse(data);
var pic = fs.readFileSync('privateData/picture.json'); var dataPic = JSON.parse(pic);
//----------------------------------------------------//
var adviceUrl = "https://api.adviceslip.com/advice"
var action = false;
var personSendingPic;
var textPic;
var options = { json: true }
module.exports = function private(msg, msgGet, message, api) {
    if (message.threadID == "100015511416756") {
        if (message.body != undefined || message.attachments != undefined) {
            api.markAsRead(message.threadID)
        }
        //----------Get Text----------//
        if (msg.includes(" => ") == true) {
            var textToSave = msgGet.substring(0, msg.indexOf(" => "));
            var textSave = [msg.substring(msg.indexOf(" => ") + 4, msg.length)];

            api.setMessageReaction("👍", message.messageID);
            if (dataText[textToSave] == undefined) {
                dataText[textToSave] = textSave
            } else {
                dataText[textToSave] = dataText[textToSave].concat(textSave);
            }
            var data = JSON.stringify(dataText, null, 2);
            fs.writeFile('privateData/text.json', data, finished);

            function finished(err) {
                if (err) return console.error(err);
            }
            console.log("----- Text '", textToSave, "' was saved as", textSave[0])
        }
        //---------Get Picture--------//
        if (msg.startsWith("#")) {
            getTextPic()
        }
        if (action == true) {
            if (msg !== "/stop") {
                if (message.senderID == personSendingPic) {
                    takePic();
                    setTimeout(timeOut, 20000)
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
                var path = "./privateData/image-" + picName + ".png";
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
                    dataPic[textPic] = "image-" + picName
                    var data = JSON.stringify(dataPic, null, 2);
                    fs.writeFile('privateData/picture.json', data, finished);
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
            if (dataPic[textPic] == undefined) {
                api.sendMessage("Vui lòng gửi ảnh lên 🤡", message.threadID);
                console.log("----- Requesting Picture...")
                action = true;
                personSendingPic = message.senderID;
            } else {
                api.sendMessage("Hình đã được gán từ trước rồi", message.threadID)
                action = false
            }
        }
        //--------Send Picture--------//
        var value = dataPic[msgGet]
        if (value != undefined) {
            var path = "privateData/" + value + ".png"
            var msgPic = { attachment: fs.createReadStream(path) };
            api.sendMessage(msgPic, message.threadID);
            console.log("----- Bot (pic): ", path);
        }
        //----------Send Text---------//
        var value0 = dataText[msgGet]
        if (value0 != undefined) {
            var finalText;
            var i = Math.floor((Math.random() * value0.length))
            finalText = value0[i];
            var msgSending = finalText;
            var ment;
            var finalMent = [];
            if (finalText.includes("@") == false) {
                api.sendMessage(finalText, message.threadID);
                console.log("----- Bot (text): ", finalText);
            } else {
                ment = dataTag[msgGet][i]
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
        //-----------Delete-----------//
        if (msg.startsWith(".picdel ")) {
            var objDel = msgGet.substring(8, msg.length);
            var value = dataPic[objDel]
            if (value != undefined) {
                delete dataPic[objDel];
                var data = JSON.stringify(dataPic, null, 2);
                var path = "privateData/" + value + ".png"
                fs.writeFile('privateData/picture.json', data, finished);
                function finished(err) {
                    if (err) return console.error(err);
                }
                fs.unlink(path, (err) => {
                    if (err) throw err;
                    console.log("----- Delete this image :", path);
                })
                api.setMessageReaction("👍", message.messageID);
            } else {
                api.sendMessage("Chưa lưu, đéo xóa được hình", message.threadID);
                console.log("----- No picture in directory")
            }
        }
        if (msg.startsWith(".txtdel ")) {
            var objDel = msgGet.substring(8, msg.length);
            var value = dataText[objDel]
            if (value != undefined) {
                delete dataText[objDel];
                var data = JSON.stringify(dataText, null, 2);
                fs.writeFile('privateData/text.json', data, finished);
                function finished(err) {
                    if (err) return console.error(err);
                    console.log("----- Delete text : ", objDel)
                }
                api.setMessageReaction("👍", message.messageID);
            } else {
                api.sendMessage("Chưa lưu, đéo xóa được", message.threadID);
                console.log("----- No text in data")
            }
        }
        //-----------Unseen-------------//
        if (msg == ".unseen") {
            if (message.type == "message_reply" && message.messageReply.senderID == "100001308494834") {
                var msgID = message.messageReply.messageID
                api.unsendMessage(msgID)
                api.setMessageReaction("👍", message.messageID);
            } else api.sendMessage("Chưa chọn tin để gỡ hoặc tin đó đéo phải của bố", message.threadID)
        }
        //----------Advice--------------//
        if (msg == ".advice") {
            request(adviceUrl, options, (err, res, data) => {
                api.sendMessage(data.slip.advice, message.threadID)
            })
        }
    }
}