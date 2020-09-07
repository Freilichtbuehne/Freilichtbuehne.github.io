const rpids = {
    7: "pol",
    8: "med",
    9: "feu",
    10: "far",
    11: "sek",
    12: "rpu"
}

const maxEntrys = 10;
const showPageUpEntrys = 6;
var curMembers;
var rpSection;


function load(page) {
    let url;

    switch (page) {
        case 1:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/team.json";
            rpSection = false;
            break;
        case 2:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/bewerbungsteam.json";
            rpSection = false;
            break;
        case 3:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/eventteam.json";
            rpSection = false;
            break;
        case 4:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/teammanagement.json";
            rpSection = false;
            break;
        case 5:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/communitymanager.json";
            rpSection = false;
            break;
        case 7:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/polizei.json";
            rpSection = true;
            ClearSubBox();
            ClearPageBox();
            setActive(rpids[page]);
            break;
        case 8:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/medic.json";
            rpSection = true;
            ClearSubBox();
            ClearPageBox();
            setActive(rpids[page]);
            break;
        case 9:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/feuerwehr.json";
            rpSection = true;
            ClearSubBox();
            ClearPageBox();
            setActive(rpids[page]);
            break;
        case 10:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/fahrschule.json";
            rpSection = true;
            ClearSubBox();
            ClearPageBox();
            setActive(rpids[page]);
            break;
        case 11:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/sek.json";
            rpSection = true;
            ClearSubBox();
            ClearPageBox();
            setActive(rpids[page]);
            break;
        case 12:
            url = "https://raw.githubusercontent.com/Uschipanzer/UschiPanzer.github.io/master/Data/rpunit.json";
            rpSection = true;
            ClearSubBox();
            ClearPageBox();
            setActive(rpids[page]);
            break;
        default:
            ClearPageBox();
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
    var ids = ["pol", "med", "feu", "far", "sek", "rpu"];
    for (let i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).classList.remove("active");
    }
    document.getElementById(id).classList.add("active");
}

function setActivePage(id) {
    var pages = document.getElementsByClassName("activePage");
    if (pages.length != 0) {
        pages[0].classList.remove("activePage");
    }
    document.getElementById(id).classList.add("activePage");
}

function ClearSubBox() {
    var divs = document.getElementById("contentBox").childNodes;
    if (rpSection) {
        while (divs.length > 4) {
            divs[4].parentNode.removeChild(divs[4]);
        }
    } else {
        while (divs.length > 0) {
            divs[0].parentNode.removeChild(divs[0]);
        }
    }
}

function ClearPageBox() {
    var divs = document.getElementById("pageBox").childNodes;
    while (divs.length > 0) {
        divs[0].parentNode.removeChild(divs[0]);
    }
}

function loadingError(error) {
    console.log(error);
    var div = document.createElement("div");
    var t = document.createTextNode("Ein Fehler ist beim Laden der Daten aufgetreten!");
    try {
        document.getElementById("error").parentNode.removeChild(document.getElementById("error"));
    } catch (err) {}
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
    document.getElementById("img" + index).addEventListener('click', function () {
        OpenURL(profile);
    });
    if (highlight) {
        document.getElementById(index).classList.add("highlight");
    }
}

function createPageNav(pages) {
    ShowScrollToTop(true);
    for (let index = 0; index < pages; index++) {
        var box = document.getElementById("pageBox");
        var div = document.createElement("div");
        div.addEventListener('click', function () {
            ClearSubBox(rpSection);
            let curPage = this.id.substring(1);
            setActivePage(this.id);
            for (let i = maxEntrys * curPage; i < maxEntrys * curPage + maxEntrys; i++) {
                if (i < curMembers.members.length) {
                    newElement(curMembers.members[i].picture, curMembers.members[i].name,
                        curMembers.members[i].highlight, i, curMembers.members[i].rank,
                        curMembers.members[i].profile);
                }
                if ((curMembers.members.length - (maxEntrys * curPage + maxEntrys)) + maxEntrys >= showPageUpEntrys) {
                    ShowScrollToTop(true);
                } else {
                    ShowScrollToTop(false);
                }
            }
        });;
        var text = document.createTextNode(index + 1);
        div.appendChild(text);
        box.appendChild(div).id = "p" + index;
    }
    setActivePage("p0");
    for (let i = 0; i < maxEntrys; i++) {
        if (i <= curMembers.members.length) {
            newElement(curMembers.members[i].picture, curMembers.members[i].name,
                curMembers.members[i].highlight, i, curMembers.members[i].rank,
                curMembers.members[i].profile);
        }
    }
}

function processData(value) {
    ShowScrollToTop(false);
    curMembers = value;
    if (curMembers.members.length > maxEntrys) {
        let pages = curMembers.members.length / maxEntrys;
        if (pages === parseInt(pages, 10)) {
            createPageNav(pages);
        } else {
            createPageNav(parseInt(pages) + 1);
        }
    } else {
        for (let i = 0; i < value.members.length; i++) {
            newElement(value.members[i].picture, value.members[i].name, value.members[i].highlight, i, value.members[i].rank, value.members[i].profile);
        }
        if (curMembers.members.length >= showPageUpEntrys) {
            ShowScrollToTop(true);
        }
    }
}

function ShowScrollToTop(show) {
    show ? document.getElementById('scrollUp').style.visibility = 'visible' : document.getElementById('scrollUp').style.visibility = 'hidden';
}

function ScrollToTop() {
    document.getElementById("top").scrollIntoView();
}

function OpenURL(url) {
    window.open(url, '_blank');
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
window.addEventListener("load", function (event) {
    document.getElementsByClassName("loader").remove();
    document.getElementById("scrollUp").onclick = function () {
        ScrollToTop()
    };
});
