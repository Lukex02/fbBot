"use strict"
//--------DEAD API---------//
/*var coronaURL = "https://code.junookyo.xyz/api/ncov-moh/data.json";
module.exports = function getCorona(msg, request, message, api) {
    if (msg.startsWith(".corona")) {
        var options = { json: true };        
        request(coronaURL, options, (err, res, corona) => {
            if (err) return console.log(error)
            api.sendMessage("🌎 Thế giới:\n\n" + "😷 Số người nhiễm: " + corona.data.global.cases + "\n\n" + "💀 Số người chết: " + corona.data.global.deaths + "\n\n" + "💚 Số người phục hồi: " + corona.data.global.recovered, message.threadID);
            api.sendMessage("🇻🇳 Việt Nam:\n\n" + "😷 Số người nhiễm: " + corona.data.vietnam.cases + "\n\n" + "💀 Số người chết: " + corona.data.vietnam.deaths + "\n\n" + "💚 Số người phục hồi: " + corona.data.vietnam.recovered, message.threadID);
            console.log("----- Sent corona virus information")
        })
    }
}*/
var url = "https://disease.sh"
var keyword
var options = { json: true };  
module.exports = function getCorona(msg, request, message, api) {
    if (msg.startsWith(".corona ")) {
        keyword = msg.substring(8, msg.length)
        if (keyword == "global") {
            getGlobal()
        } else {
            getCountry(keyword)
        }
    }
    function getGlobal() {
        var call = "/v3/covid-19/all?yesterday=false"
        var requestUrl = url + call
        request(requestUrl, options, (err, res, data) => {
            var cases = data.cases
            var deaths = data.deaths
            var recovered = data.recovered
            var todayCases = data.todayCases
            var todayDeaths = data.todayDeaths
            var todayRecovered = data.todayRecovered
            api.sendMessage("🌐 Thế giới:\n\n" + "😷 Số người nhiễm: " + cases + "\n(+" + todayCases + ")" + "\n\n" + "💀 Số người chết: " + deaths + "\n(+" + todayDeaths + ")" + "\n\n" + "💚 Số người phục hồi: " + recovered + "\n(+" + todayRecovered + ")", message.threadID);
            console.log("----- Sent global corona data")
        })
    }
    function getCountry(country) {
        var call = "/v3/covid-19/countries/" + country + "?yesterday=false"
        var requestUrl = url + call
        request(requestUrl, options, (err, res, data) => {
            if (data != undefined) {
                if (data.message == undefined) {
                    var countryName = data.country
                    var cases = data.cases
                    var deaths = data.deaths
                    var recovered = data.recovered
                    var todayCases = data.todayCases
                    var todayDeaths = data.todayDeaths
                    var todayRecovered = data.todayRecovered
                    api.sendMessage(countryName + ":\n\n" + "😷 Số người nhiễm: " + cases + "\n(+" + todayCases + ")" + "\n\n" + "💀 Số người chết: " + deaths + "\n(+" + todayDeaths + ")" + "\n\n" + "💚 Số người phục hồi: " + recovered + "\n(+" + todayRecovered + ")", message.threadID);
                    console.log("----- Sent corona data from: " + countryName)
                } else api.sendMessage("Tên nước sai hoặc nước này không có ca nhiễm nào", message.threadID)
            } else api.sendMessage("Tên nước sai hoặc nước này không có ca nhiễm nào", message.threadID)
        })
    }
}