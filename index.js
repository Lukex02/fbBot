//------------------------------------------------------//
//--------------------Get Packages----------------------//
//------------------------------------------------------//
const fbApi = require("facebook-chat-api");
const fs = require("fs");
const request = require("request");
const readline = require("readline");
//------------------------------------------------------//
//--------------------Get Function----------------------//
//------------------------------------------------------//
const allowActive = require("./src/allowActive")
const changeTitle = require("./src/changeTitle");
const changeEmoji = require("./src/changeEmoji");
const changeGroupAvatar = require("./src/changeGroupAvatar");
const changeNickname = require("./src/changeNickname");
const setAdmin = require("./src/setAdmin");
const getText = require("./src/getText");
const sendText = require("./src/sendText");
const deleteText = require("./src/deleteText");
const getPicture = require("./src/getPicture");
const sendPicture = require("./src/sendPicture");
const deletePicture = require("./src/deletePicture");
const getCorona = require("./src/getCorona");
const juanDeag = require("./src/juanDeag");
const voteKick = require("./src/voteKick");
const private = require("./src/private")
const girl = require("./src/girl");
const googleSearch = require("./src/googleSearch");
const count = require("./src/count");
const addLeave = require("./src/addLeave")
const gambling = require("./src/gambling")
//const blacklist = require("./src/blacklist")
//const getSpeech = require("./src/getSpeech")
const cmdHelp = require("./src/cmdHelp")
const unsendMessage = require("./src/unsendMessage")
const define = require("./src/define")
const getQr = require("./src/getQr")
const getRandom = require("./src/getRandom")
const getSleep = require("./src/getSleep")
//const getSteam = require("./src/getSteam")
//const getWeather = require("./src/getWeather")
//------------------------------------------------------//
//---------------------Get Data-------------------------//
//------------------------------------------------------//
var data = fs.readFileSync('data.json');    var dataText = JSON.parse(data);
var pic = fs.readFileSync('picture.json');  var dataPic = JSON.parse(pic);
var allow = fs.readFileSync('allow.json'); var dataAllow = JSON.parse(allow);
var tag = fs.readFileSync('tag.json'); var dataTag = JSON.parse(tag);
var def = fs.readFileSync('define.json'); var dataDef = JSON.parse(def);
//------------------------------------------------------//
//------------------------------------------------------//
//------------------------------------------------------//
/*
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
*/
const log = { forceLogin: true, userAgent: 'Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 87.0.4280.101 Safari / 537.36', email: "huynhbaminh2004@gmail.com", password: "lukelol1401" };
//fbApi(log, (err, api) => {
fbApi({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }, (err, api) => {
    //fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    if (err) {
        switch (err.error) {
            case 'login-approval':
                console.log('Enter code > ');
                rl.on('line', (line) => {
                    err.continue(line);
                    rl.close();
                });
                break;
            default:
                console.error(err);
        }
        return;
    }
    api.setOptions({       
        //autoMarkRead: true,
        listenEvents: true,
    
    })
    api.listenMqtt((err, message) => {
        if (message != undefined) {
            //-------------Global Variables----------------//
            var msg = String(message.body);
            var msgCmd;
            var msgGet = msg.toLowerCase();
            var participantNames = [];
            var partiID = [];
            var tag = message.mentions
            //--------------Main function------------------//       
            //api.markAsRead("3354501691291779");
            //if (message.threadID != undefined && message.body != undefined) {
            //api.markAsRead(message.threadID)
            //}
            for (var key in tag) {
                partiID = (Object.getOwnPropertyNames(tag))
                participantNames = (Object.values(tag))
                if (key > 1) {
                    break;
                }
            }
            function logging() {
                if (message.body !== undefined) {
                    var current = new Date()
                    var date = current.getDate();
                    var month = current.getMonth();
                    var year = current.getFullYear();
                    var hours = current.getHours();
                    var minutes = current.getMinutes();
                    var seconds = current.getSeconds();
                    api.getUserInfo(message.senderID, function (err, user) {
                        var key = message.senderID
                        var userName = user[key].name;
                        if (key == message.threadID) {
                            console.log("[", date + "/" + month + "/" + year, "=====", hours + "h:" + minutes + "m:" + seconds + "s", "]", "*****", "(inbox)", userName, " :\n" + msg + "\n");
                            if (message.attachments.length !== 0) {
                                var pic = message.attachments[0].largePreviewUrl;
                                console.log("===== Pic url : ", pic)
                            }
                        } else {
                            api.getThreadInfo(message.threadID, (err, info) => {
                                console.log("[", date + "/" + month + "/" + year, "=====", hours + "h:" + minutes + "m:" + seconds + "s", "]", "*****", "(" + info.name + ")", userName, " :\n" + msg + "\n");
                                if (message.attachments.length !== 0) {
                                    var pic = message.attachments[0].largePreviewUrl;
                                    console.log("===== Pic url : ", pic)
                                }
                            })
                        }
                    })
                }
            }
            //console.log(message)
            function setBase() {
                if (dataText[message.threadID] == undefined) {
                    dataText[message.threadID] = {}
                    var data = JSON.stringify(dataText, null, 2);
                    fs.writeFile('data.json', data, finished);
                } else if (dataTag[message.threadID] == undefined) {
                    dataTag[message.threadID] = {}
                    var data = JSON.stringify(dataTag, null, 2);
                    fs.writeFile('tag.json', data, finished);
                } else if (dataPic[message.threadID] == undefined) {
                    dataPic[message.threadID] = {}
                    var data = JSON.stringify(dataPic, null, 2);
                    fs.writeFile('picture.json', data, finished);
                }
                function finished(err) {
                    if (err) return console.error(err);
                }
            }
            setBase
            girl(msg, msgGet, message, api)
            private(msg, msgGet, message, api)
            allowActive(msg, dataAllow, dataText, dataTag, dataPic, fs, message, api)
            if (dataAllow[message.threadID] != undefined) {
                //logging()                                                                           //---Logging message to console
                //blacklist(msg, partiID, message, api)
                gambling(msg, request, message, api)                                                //---Gambling
                sendPicture(msgGet, dataPic, fs, message, api)                                      //---Send Picture
                sendText(msgGet, dataText, dataTag, message, api)                                   //---Send Text
                deletePicture(msg, msgGet, dataPic, fs, message, api)                               //---Delete Picture
                deleteText(msg, msgGet, dataText, dataTag, fs, message, api)                        //---Delete Text
                getText(msg, msgGet, dataText, dataTag, partiID, fs, message, api)                  //---Get Text
                getPicture(msg, msgGet, dataPic, fs, request, message, api)                         //---Get Picture
                msgCmd = define(msg, msgGet, dataDef, fs, message, api)                             //---Define text to command
                if (msgCmd != undefined) {
                    addLeave(msg, message, api)
                    changeTitle(msgCmd, message, api)                                               //---Change Title
                    changeEmoji(msgCmd, message, api)                                               //---Change Emoji
                    changeGroupAvatar(msgCmd, msgGet, dataPic, fs, message, api)                    //---Change Group Avatar
                    changeNickname(msgCmd, partiID, message, api)                                   //---Change Nickname
                    getCorona(msgCmd, request, message, api)                                        //---Get Corona
                    setAdmin(msgCmd, participantNames, partiID, fs, message, api)                   //---Set Admin Status
                    voteKick(msgCmd, msgGet, participantNames, partiID, fs, message, api)           //---Votekick
                    juanDeag(msgCmd, participantNames, partiID, fs, message, api)                   //---JuanDeag
                    unsendMessage(msgCmd, message, api)                                             //---Unsend Message
                    //getSpeech(msgCmd, msgGet, request, fs, message, api)                          //---Get Speech
                    cmdHelp(msgCmd, message, api)                                                   //---Command Instruction
                    //getSteam(msgCmd, fs, request, message, api)                                   //---Get Steam Info
                    getQr(msgCmd, fs, request, message, api)                                        //---Get QR Code
                    getRandom(msgCmd, request, message, api)                                        //---Get Random Number
                    //getWeather(msgCmd, request, message, api)
                    getSleep(msgCmd, message, api)                                                  //---Get Recommend Sleep Time
                    googleSearch(msg, message, api)                                                 //---Google Search
                    count(msg, message, api)                                                        //---Count messages
                }
            }
        }
    })
})
