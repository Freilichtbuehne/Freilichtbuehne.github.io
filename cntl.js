const rpids = {
    7: "pol",
    8: "med",
    9: "feu",
    10: "far"
}

function load(page) {
    let url;

    switch (page) {
        case 1:
            url = "https://raw.githubusercontent.com/Uschipanzer/GPXPanel2/master/team.json";
            break;
        case 2:
            url = "https://raw.githubusercontent.com/Uschipanzer/GPXPanel2/master/bewerbungsteam.json";
            break;
        case 3:
            url = "https://raw.githubusercontent.com/Uschipanzer/GPXPanel2/master/eventteam.json";
            break;
        case 4:
            url = "https://raw.githubusercontent.com/Uschipanzer/GPXPanel2/master/teammanagement.json";
            break;
        case 5:
            url = "https://raw.githubusercontent.com/Uschipanzer/GPXPanel2/master/communitymanager.json";
            break;
        case 7:
            url = "https://raw.githubusercontent.com/Uschipanzer/GPXPanel2/master/polizei.json";
            ClearSubBox();
            setActive(rpids[page]);
            break;
        case 8:
            url = "https://raw.githubusercontent.com/Uschipanzer/GPXPanel2/master/medic.json";
            ClearSubBox();
            setActive(rpids[page]);
            break;
        case 9:
            url = "https://raw.githubusercontent.com/Uschipanzer/GPXPanel2/master/feuerwehr.json";
            ClearSubBox();
            setActive(rpids[page]);
            break;
        case 10:
            url = "https://raw.githubusercontent.com/Uschipanzer/GPXPanel2/master/fahrschule.json";
            ClearSubBox();
            setActive(rpids[page]);
        default:
            loadingError("Ladefehler");
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            processData(data);
        })
        .catch(error => loadingError(error))
}

function setActive(id) {
    var ids = ["pol", "med", "feu", "far"];
    for (let i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).classList.remove("active");
    }
    document.getElementById(id).classList.add("active");
}

function ClearSubBox() {
    var divs = document.getElementById("contentBox").childNodes;
    while (divs.length > 4) {
        divs[4].parentNode.removeChild(divs[4]);
    }
}

function loadingError(error) {
    console.log(error);
    var div = document.createElement("div");
    var t = document.createTextNode("Ein Fehler ist beim Laden der Daten aufgetreten!");
    try {
        document.getElementById("error").parentNode.removeChild(document.getElementById("error"));
    } catch {}
    document.getElementById("contentBox").appendChild(div).id = "error";
    document.getElementById("error").appendChild(t).classList.add("highlight");
}

function newElement(url, name, highlight, index, text, profile) {
    if (text == "none") {
        text = "";
    } else {
        text = " (" + text + ")";
    }
    var div = document.createElement("div");

    var t = document.createTextNode(name + text);
    var i = document.createElement("img");
    document.getElementById("contentBox").appendChild(div).id = index;
    document.getElementById(index).appendChild(i).id = "img" + index;
    document.getElementById(index).appendChild(t).id = "text" + index;

    document.getElementById("img" + index).src = url;
    document.getElementById("img" + index).addEventListener('click', function(event) {
        OpenURL(profile);
    });
    if (highlight) {
        document.getElementById(index).classList.add("highlight");
    }
}

function processData(value) {
    for (let i = 0; i < value.members.length; i++) {
        newElement(value.members[i].picture, value.members[i].name, value.members[i].highlight, i, value.members[i].rank, value.members[i].profile);
    }
}

function OpenURL(url) {
    window.open(url, '_blank');
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
window.addEventListener("load", function(event) {
    document.getElementsByClassName("loader").remove();
});