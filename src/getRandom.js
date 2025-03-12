"use strict"
var url = "https://www.random.org/integers/?num=1&col=1&base=10&format=plain&rnd=new"
module.exports = function getRandom(msg, request, message, api) {
    if (msg.startsWith(".random ")) {
        var value = msg.substring(8, msg.length).split(" ")
        if (value.length !== 2) {
            api.sendMessage("Chỉ nhập 2 số vào thôi", message.threadID)
        } else {
            var min = Number(value[0])
            var max = Number(value[1])
            if (Number.isNaN(min) || Number.isNaN(max)) {
                api.sendMessage("Số lồn j đây đéo chơi", message.threadID)
            } else if (min < -1000000000 || max > 1000000000) {
                api.sendMessage("[-10^9;10^9] thôi bạn ơi", message.threadID)
            } else {
                var reqMin = "&min=" + min
                var reqMax = "&max=" + max
                var newUrl = url + reqMin + reqMax
                request(newUrl, (err, res, data) => {
                    api.sendMessage("Số của bạn là: " + data, message.threadID)
                })
            }
        }
    }
}