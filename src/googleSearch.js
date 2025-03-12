"use strict"
var url = "https://www.google.com/search?oq=test&aqs=chrome..69i57j69i61j69i60l2j5.1162j0j1&sourceid=chrome&ie=UTF-8&q="
module.exports = function googleSearch(msg, message, api) {
    if (msg.startsWith(".google ")) {
        var query = encodeURI(msg.substring(8, msg.length))
        var search = url + query
        api.sendMessage({ url: search }, message.threadID)
        api.sendMessage("Lười tới thế thì bố cũng thua :|", message.threadID)
        console.log("----- Sent google search for idiot")
    }
}