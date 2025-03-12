"use strict"
var options = {
    url: "https://api.fpt.ai/hmi/tts/v5",
    method: "POST",
    headers: {
        api_key: "FyvFVmTYgJYlcLdEXr7Ou1A2QOrZwm1U",
        speed: 0,
        voice: "leminh",
        format: "mp3",
        callback_url: "http://your.domain.com:3000"
    },
    body: ""
};
const path = "temp/speech.mp3"
var url;
module.exports = function getSpeech(msg, msgGet, request, fs, message, api) {
    if (msg.startsWith(".say ") && msg.length > 2) {
        var speech = msgGet.substring(5, msgGet.length);
        /*if (speech.length > 500) {
            api.sendMessage("Phải từ 3-500 kí tự!", message.threadID)
            console.log("----- Speech request was invalid, cancelling request")
        } else if (speech.length <= 500) {*/
        options.body = speech;
        request(options, function callback(err, response, body) {
            if (err) return console.log(err)
            var data = JSON.parse(body)
            url = data.async
            //download(url, 100)
            download(url)
        })
        //getFile(path, 1000)
    }
    function sendSpeech() {
        var msgSending = {
            attachment: fs.createReadStream(path)
        }
        //console.log("----- Text Speech :", speech)
        api.sendMessage(msgSending, message.threadID, (err, messageInfo) => {
            deleteTemp()
            //console.log("----- Bot just sent a speech");
        });
        api.sendMessage({ url: url }, message.threadID)
    }
    function deleteTemp() {
        fs.unlink(path, (err) => {
            if (err) throw err;
            //console.log("----- Temp audio was deleted!");
        })
    }
    /*function download(url, timeout) {
        timeout = setInterval(function () {
            if (url != undefined) {
                console.log(url)
                request(url)
                    .pipe(fs.createWriteStream(path))
                    .on('close', getFile)
                //console.log("----- Downloaded the File")
                clearInterval(timeout)
            } else return timeout
        }, timeout)           
    }
    */
    function download(url) {
        request(url)
            .pipe(fs.createWriteStream(path))
            .on('close', sendSpeech)
    }
    /*
    function getFile(path, timeout) {
        timeout = setInterval(function () {
            const file = path
            var fileExists = fs.existsSync(file);
            //console.log('--- Checking for: ', file);
            //console.log('--- Exists: ', fileExists);
            if (fileExists) {
                clearInterval(timeout);
                sendSpeech()
            } else return timeout
        }, timeout);
    };*/
    //}
}