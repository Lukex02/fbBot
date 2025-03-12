"use strict"
/*
 * LuKeLOL 76561198394344094
*/
var iconPath = "http://media.steampowered.com/steamcommunity/public/images/apps/"
var path = "http://api.steampowered.com/"
var interfaceName;
var methodName;
var version;
var apiKey = "?key=8699BD769833ED746C475E145A0ECCEC"
var userUrl = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/"
var steamUserID;
var tempPath1 = "temp/game.jpg"
var tempPath2 = "temp/profile.jpg"
var options = { json: true };

module.exports = function getSteam(msg, fs, request, message, api) {
    function getRecentGames(id) {
        interfaceName = "IPlayerService/"
        methodName = "GetRecentlyPlayedGames/"
        version = "v0001/"
        var url = path + interfaceName + methodName + version + apiKey + "&steamid=" + id + "&format=json"
        request(url, options, (err, res, stats) => {
            //console.log(url)
            //console.log(stats)
            if (stats.response != undefined) {
                api.sendMessage("🎮 Số game gần đây chơi: " + stats.response.total_count, message.threadID, (err, info) => {
                    for (var num in stats.response.games) {
                        var gameName = "🕹 Game: " + stats.response.games[num].name
                        var twoWeeks = "📅 Thời gian chơi trong 2 tuần qua: " + Math.floor(stats.response.games[num].playtime_2weeks / 60) + "h"
                        var playtime = "🕙 Thời gian đã chơi: " + Math.floor(stats.response.games[num].playtime_forever / 60) + "h"
                        request(iconPath + stats.response.games[num].appid + "/" + stats.response.games[num].img_icon_url + ".jpg")
                            .pipe(fs.createWriteStream(tempPath1))
                        api.sendMessage(gameName + "\n" + twoWeeks + "\n" + playtime, message.threadID, (err, messageInfo) => {
                            var gameIcon = { attachment: fs.createReadStream(tempPath1) }
                            api.sendMessage(gameIcon, message.threadID, (err, messageInfo) => {
                                deleteTemp(tempPath1)
                                console.log("-----Sent recent activities of a steam account, url: ", url)
                            });
                        })
                    }
                })
            } else api.sendMessage("Lỗi cc j đó r", message.threadID)
        });
    }
    function getCsgoStats(id) {
        interfaceName = "ISteamUserStats/"
        methodName = "GetUserStatsForGame/"
        version = "v0002/"
        var url = path + interfaceName + methodName + version + apiKey + id + "&appid=730"
        request(url, options, (err, res, stats) => {
            console.log(url)
            //console.log(stats)
            /*if (stats.playerstats != undefined) {
                var data = stats.playerstats.stats
                var kills = data[0].value
                var hs = math(data[25].value, kills)
                var kd = math(kills, data[1].value)
                var wins = data[5].value
                var kills_knife = data[9].value
                var kills_zeus = data[169].value
                var kills_glock = data[11].value
                var kills_de = data[12].value
                var kills_awp = data[19].value
                var kills_ak = data[20].value
                var kills_m4 = data[166].value
                var acc_de = math(data[46].value, data[60].value)
                var acc_glock = math(data[47].value, data[61].value)
                var acc_awp = math(data[50].value, data[64].value)
                var acc_ak = math(data[51].value, data[65].value)
                var acc_m4 = math(data[170].value, data[173].value)
                var msgSending1 = "☠ Số kill: " + kills + " (K/D: " + kd + ")" + "\n🎯 Tỉ lệ headshot: " + hs * 100 + "%\n🚩 Số game win: " + wins + "\n🐦 Số chim xiên được: " + kills_knife + "\n🐤 Số thằng bị Zeus: " + kills_zeus + "\n"
                var msgSending2 = "🔫 Glock-18: " + kills_glock + "\n🔫 Desert Eagle: " + kills_de + "\n🔫 AWP: " + kills_awp + "\n🔫 AK-47: " + kills_ak + "\n🔫 M4A1: " + kills_m4
                api.sendMessage(msgSending1 + msgSending2, message.threadID)
                console.log("----- Sent CSGO stats of a steam account, url: ", url)
            } else api.sendMessage("Lỗi cc j đó r", message.threadID)*/
        })
    }
    function getSteamInfo(id) {
        interfaceName = "ISteamUser/"
        methodName = "GetPlayerSummaries/"
        version = "v0002/"
        var url = path + interfaceName + methodName + version + apiKey + "&steamids=" + id
        request(url, options, (err, res, stats) => {
            //console.log(url)
            //console.log(stats)
            if (stats.response != undefined) {
                var data = stats.response.players[0]
                var status
                if (data.personastate == 0) var status = "Offline"
                else if (data.personastate == 1) var status = "Online"
                else if (data.personastate == 2) var status = "Busy"
                else if (data.personastate == 3) var status = "Away"
                else if (data.personastate == 4) var status = "Snooze"
                else if (data.personastate == 5) var status = "Looking to trade"
                else if (data.personastate == 6) var status = "Looking to play"
                var name = data.personaname
                var id64 = data.steamid
                request(data.avatarfull)
                    .pipe(fs.createWriteStream(tempPath2))
                api.sendMessage("🕜 Trạng thái: " + status + "\n📛 Tên profile: " + name + "\n👨‍💻 SteamID64: " + id64, message.threadID, (err, messageInfo) => {
                    var profileImg = { attachment: fs.createReadStream(tempPath2) }
                    api.sendMessage(profileImg, message.threadID, (err, messageInfo) => {
                        deleteTemp(tempPath2)
                        console.log("-----Sent info of a steam account, url: ", url)
                        getRecentGames(id)
                    });
                });
            } else api.sendMessage("Lỗi cc j đó r", message.threadID)
        })
    }
    function math(firstNum, secondNum) {
        var tempResult = firstNum / secondNum * 100
        return (Math.round(tempResult) / 100).toFixed(2)
    }
    function deleteTemp(path) {
        fs.unlink(path, (err) => {
            if (err) throw err;
        })
    }
    //For recent stats
    var temp1 = ".stats https://steamcommunity.com/id/"
    var temp1a = ".stats https://steamcommunity.com/profiles/"
    if (msg.startsWith(temp1)) {
        var newUserUrl = userUrl + apiKey + "&vanityurl=" + msg.substring(temp1.length, msg.length)
        if (newUserUrl.endsWith("/")) {
            newUserUrl = userUrl + apiKey + "&vanityurl=" + msg.substring(temp1.length, msg.length - 1)
        }
        request(newUserUrl, options, (err, res, info) => {
            steamUserID = info.response.steamid
            getSteamInfo(steamUserID)
        })
    } else if (msg.startsWith(temp1a)) {
        steamUserID = msg.substring(temp2a.length, msg.length)
        if (steamUserID.endsWith("/")) {
            steamUserID = "&steamid=" + msg.substring(temp2a.length, msg.length - 1)
        }
        getSteamInfo(steamUserID)
        getRecentGames(steamUserID)
    } else if (msg.startsWith(".stats ")) {
        api.sendMessage("Link Steam không hợp lệ.", message.threadID)
    }
    //For csgo stats
    var temp2 = ".csgo https://steamcommunity.com/id/"
    var temp2a = ".csgo https://steamcommunity.com/profiles/"
    if (msg.startsWith(temp2)) {
        var newUserUrl = userUrl + apiKey + "&vanityurl=" + msg.substring(temp2.length, msg.length)
        if (newUserUrl.endsWith("/")) {
            newUserUrl = userUrl + apiKey + "&vanityurl=" + msg.substring(temp2.length, msg.length - 1)
        }
        request(newUserUrl, options, (err, res, info) => {
            console.log(newUserUrl)
            steamUserID = "&steamid=" + info.response.steamid
            getCsgoStats(steamUserID)
        })
    } else if (msg.startsWith(temp2a)) {
        steamUserID = "&steamid=" + msg.substring(temp2a.length, msg.length)
        if (steamUserID.endsWith("/")) {
            steamUserID = "&steamid=" + msg.substring(temp2a.length, msg.length - 1)
        }       
        getCsgoStats(steamUserID)
    } else if (msg.startsWith(".csgo ")) {
        api.sendMessage("Link Steam không hợp lệ.", message.threadID)
    }
}