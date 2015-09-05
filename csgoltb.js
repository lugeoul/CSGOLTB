var trades = [];
var blockedUsers = [];

// ----------Google Analytics----------
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'csgoltbga');

csgoltbga('create', 'UA-67226819-2', 'auto');
csgoltbga('set', 'forceSSL', true);
csgoltbga('send', 'pageview');

// ---------/Google Analytics----------

Init();

function InjectBlockButtons() {
    for (var i = 0; i < trades.length; i++) {
        var blockButton = document.createElement("a");
        var blockImage = document.createElement("img");


        blockImage.src = "http://i.imgur.com/H9pY2HP.png";
        blockImage.width = "14";

        blockButton.setAttribute("id", trades[i].id);

        blockButton.onclick = function () {
            BlockUser(this.id, null);
            HideATrade(this.parentNode);
        };

        blockButton.appendChild(blockImage);
        blockButton.innerHTML += "&nbsp;";

        trades[i].node.insertBefore(blockButton, trades[i].node.getElementsByTagName("a")[0]);
    }
}

function GetBlockedUsers() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://csgolounge.com/ajax/banList.php", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var blockedUserHTML = document.createElement("div");
            blockedUserHTML.innerHTML = xhr.response;

            var blockedUserNodes = blockedUserHTML.getElementsByTagName("li");

            for (var i = 0; i < blockedUserNodes.length; i++) {
                blockedUsers.push({ id: blockedUserNodes[i].children[0].href.slice(blockedUserNodes[i].children[0].href.indexOf("=") + 1), name: blockedUserNodes[i].children[0].innerHTML });
            }

            HideBlockedUsersTrades();
        }
    };
}

function HideBlockedUsersTrades() {
    for (var i = 0; i < blockedUsers.length; i++) {
        for (var j = 0; j < trades.length; j++) {
            if (trades[j].name == "noname") {
                //TODO 
            }
            else if (blockedUsers[i].name == trades[j].name) {
                HideATrade(trades[j].node);
                trades.splice(j, 1);
                j--;
            }
        }
    }
    InjectBlockButtons();
}

function HideATrade(trade) {
    trade.parentNode.parentNode.removeChild(trade.parentNode);
}

function Init() {
    var tempTradesList = document.getElementsByClassName('tradeheader');

    for (var i = 0; i < tempTradesList.length; i++) {
        var tradeID = tempTradesList[i].getElementsByTagName('span')[0].parentNode.href;
        tradeID = tradeID.slice(tradeID.indexOf("=") + 1);

        trades.push({ node: tempTradesList[i], id: tradeID, name: tempTradesList[i].getElementsByTagName("b")[0].innerHTML });
    }

    GetBlockedUsers();
}

function GetUserId(tradeID) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://csgolounge.com/trade?t=" + tradeID, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var tempUserPage = document.createElement("div");
            tempUserPage.innerHTML = xhr.response;
            var userID = tempUserPage.getElementsByTagName("span")[0].parentNode.href;
            userID = userID.slice(userID.indexOf("=") + 1);
            BlockUser(tradeID, userID);
        }
    };
}

function BlockUser(tradeID, userID) {
    if (userID == null) {
        GetUserId(tradeID);
        return;
    }
    csgoltbga('send', 'event', 'block user', userID);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://csgolounge.com/ajax/msgBan.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("banned=" + userID);
}
