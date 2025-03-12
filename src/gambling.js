"use strict"
const fs = require("fs")
/*
 * 
*/
var delay = false
var announce = ""
var result = {}
var start = false
var finished = []
var valueManager = {}
var constPath = "temp/"
var deckID
var threadID
var options = { json: true }
var playing = false
var confirm
var players = []
const getDeck = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
var getCardUrl = "https://deckofcardsapi.com/api/deck/"
var getCard = ""
module.exports = function gambling(msg, request, message, api) {
    if (msg == ".blackjack" && start == false && playing == false) {
        api.sendMessage("20 giây điểm danh bằng cách like tin này", message.threadID, (err, messageInfo) => {
            confirm = messageInfo.messageID
        })
        playing = true
        threadID = message.threadID
        result = {}
        finished = []
        valueManager = {}
        players = []
        deckID = ""
        announce = ""
        getCard = ""
    }
    if (playing == true) {
        if (message.reaction == "👍" && message.messageID == confirm) {
            players.push(message.userID)
        }
        if (message.reaction == undefined && message.messageID == confirm && players.includes(message.userID)) {
            var removeIndex = players.indexOf(message.userID)
            players.splice(removeIndex, 1)
        }
        setTimeout(() => {
            if (players.length < 1 && playing == true) {
                playing = false
                api.sendMessage("Không ai chơi à, v thôi 😞", threadID)
            } else if (playing == true) {
                api.sendMessage("Đang gửi bài cho mọi người... 🎴 🃏", threadID)
                request(getDeck, options, (err, res, deck) => {
                    if (deck.success == true) {
                        deckID = deck.deck_id
                        getCard = getCardUrl + deckID + "/draw/?count="
                        var length = players.length
                        var idPlayer = players.concat(players)
                        for (var id in players) {
                            api.sendMessage("🎴 Alo olA bài đây bài đây ♠♦♣♥", players[id])
                        }
                        getCards(getCard, idPlayer, length * 2)
                        //console.log(valueManager)
                        //console.log(idPlayer)
                        setTimeout(gameStart, 1000 * length)
                    }
                })
                playing = false
            }
        }, 20000)
    }
    function getCards(url, ids, num) {
        //console.log(url)        
        request(url + num, options, (err, res, cards) => {
            //console.log(cards.cards)  
            for (var index in cards.cards) {
                var valueNum = cards.cards[index].value
                var path = constPath + cards.cards[index].code + ".png"
                var player = ids[index]
                sendCard(path, player, valueNum)
                function sendCard(path, player, valueNum) {
                    var playerCard = { attachment: fs.createReadStream(path) }
                    api.sendMessage(playerCard, player, (err, msgInfo) => {
                        if (valueManager[player] == undefined) {
                            valueManager[player] = []
                        }
                        valueManager[player].push(valueNum)                       
                        delay = false
                        //console.log(valueManager)                       
                    })
                }
                /*
                console.log(ids)
                console.log(index)
                console.log(player)*/
            }
            console.log("----- Số lá còn lại: ", cards.remaining, cards.deck_id)
        })
        //console.log(idPlayer)
    }    
    function gameStart() {        
        api.sendMessage('Đã phát xong bài 🃏\n"/rut" : Rút thêm\n"/dan" : Dằn bài', threadID)
        start = true      
    }
    if (start == true) {
        if (msg == "/rut") {
            if (valueManager[message.senderID] == undefined) {
                api.sendMessage("Không chơi thì cút", threadID)
            } else {
                if (finished.includes(message.senderID)) {
                    api.sendMessage("Dằn bài rồi không được rút nha em", threadID)
                } else if (valueManager[message.senderID].length > 4) {
                    api.sendMessage("Rút 5 lá rồi, dằn bài đi", threadID)
                } else if (valueManager[message.senderID] != undefined) {
                    getCards(getCard, [message.senderID], 1)
                    api.setMessageReaction("👍", message.messageID);
                    delay = true
                }
            }
            
        } else if (msg == "/dan" && delay == false) {
            if (valueManager[message.senderID] == undefined) {
                api.sendMessage("Không chơi thì cút", threadID)
            } else {
                if (finished.includes(message.senderID)) {
                    api.sendMessage("M dằn bài rồi dằn j nữa", threadID)
                } else if (valueManager[message.senderID] != undefined) {
                    finished.push(message.senderID)
                    api.setMessageReaction("👍", message.messageID);
                }
            }
        }
        if (msg == "/quit") {
            api.getThreadInfo(message.threadID, (err, info) => {
                var adminIDs = []
                for (var id in info.adminIDs) {
                    adminIDs.push(info.adminIDs[id].id)
                }
                if (adminIDs.includes(message.senderID)) {
                    api.sendMessage("Hủy cuộc chơi tại đây, hê", threadID)
                    start = false
                    api.setMessageReaction("👍", message.messageID);
                } else {
                    api.sendMessage("M tuổi j mà đòi ra lệnh t 😒", message.threadID);
                    console.log("----- unvalid Admin");
                }
            })
        }
        if (finished.length == players.length) {
            //console.log(valueManager)
            //valueManager["100015511416756"] = ["10", "ACE", "ACE"]
            start = false
            for (var id in valueManager) {
                var finalValue = 0
                for (var num in valueManager[id]) {
                    var currentCard = Number(valueManager[id][num])
                    if (Number.isNaN(currentCard) == true) {
                        if (valueManager[id][num] == "KING" || valueManager[id][num] == "QUEEN" || valueManager[id][num] == "JACK") {
                            currentCard = 10
                        }
                        if (valueManager[id][num] == "ACE") {
                            currentCard = 11
                        }
                    }
                    finalValue += currentCard
                }
                if (finalValue > 21) {
                    function Ace(cards) {
                        return cards == "ACE"
                    }
                    var aceArray = valueManager[id].filter(Ace)
                    if (aceArray != undefined) {
                        for (var n in aceArray) {
                            if (aceArray[n] == "ACE" && finalValue > 21) {
                                if (finalValue - 1 > 21) {
                                    finalValue -= 10
                                    //console.log("Ace = 1")
                                } else {
                                    finalValue -= 1
                                    //console.log("Ace = 10")
                                }
                            }
                        }
                    }
                }
                result[id] = finalValue
            }
            //console.log(result)
            api.getUserInfo(Object.keys(result), (err, info) => {
                for (var id in info) {                   
                    if (result[id] < 16 && valueManager[id].length < 5) {
                        announce = info[id].name + " : " + result[id] + " (Chưa đủ sao dằn rồi!?)"
                    } else if (result[id] <= 21 && valueManager[id].length == 5) {
                        announce = info[id].name + " : " + result[id] + " (Ngũ linh)"
                    } else if (result[id] == 21 && valueManager[id].length == 2) {
                        if (valueManager[id].length == 2) {
                            if (valueManager[id] == ["ACE", "ACE"]) {
                                announce = info[id].name + " : " + result[id] + " (Xì bàng ACELELELELELE)"
                            } else {
                                announce = info[id].name + " : " + result[id] + " (Xì dách)"
                            }
                        } else {
                            announce = info[id].name + " : " + result[id]
                        }
                    } else if (result[id] <= 21 && 2 < valueManager[id].length < 5) {
                        announce = info[id].name + " : " + result[id]
                    } else if (result[id] > 21) {
                        announce = info[id].name + " : " + result[id] + " (Quắc 🐔)"
                    } 
                    //console.log(announce)
                    api.sendMessage(announce, threadID)
                }
            })
        }
    }
}