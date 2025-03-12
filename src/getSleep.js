"use strict"
module.exports = function getSleep(msg, message, api) {
    if (msg.startsWith(".sleep ")) {
        var time = msg.substring(7, msg.length).split(":")
        var hours = Number(time[0])
        var minutes = Number(time[1])
        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
            api.sendMessage("M ngủ giờ đéo j thế này", message.threadID)
        } else if (hours < 0 || hours > 24 || minutes < 0 || minutes > 60) {
            api.sendMessage("M lại ngủ giờ giấc ngoài hành tinh à", message.threadID)
        } else {
            var timeInMin = hours * 60 + minutes
            var wakeTime = timeInMin - 630
            var wakeTimeInFormat = []
            if (wakeTime < 0) {
                wakeTime = 1440 + wakeTime
            }
            for (var i = 0; i < 4; i++) {
                wakeTime += 90
                if (wakeTime > 1440) {
                    wakeTime += - 1440
                }
                var hoursWakeTime = String(Math.floor(wakeTime / 60))
                var tempMin = "0" + String(wakeTime - hoursWakeTime * 60)
                var minutesWakeTime = tempMin.slice(-2)
                wakeTimeInFormat.push(hoursWakeTime + ":" + minutesWakeTime)
            }
            var tempRenameMin = "0" + minutes
            var renameMin = tempRenameMin.slice(-2)
            api.sendMessage("Để có 1 giấc ngủ ngon và có thể dậy vào lúc " + hours + ":" + renameMin + ", bạn nên ngủ vào những khung giờ sau:\n" + wakeTimeInFormat[0] + ", " + wakeTimeInFormat[1] + ", " + wakeTimeInFormat[2] + ", " + wakeTimeInFormat[3] + "\nHãy nhớ rằng bạn cần trung bình 14 phút đi có thể đi vào giấc ngủ, sống thật lành mạnh nhé bạn tôi ❤", message.threadID)
        }
    }
}