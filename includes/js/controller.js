const rpids = {
    7: "pol",
    9: "feu",
    10: "far",
    11: "sek",
    12: "cri",
//    13: "sani",
//    14: "arzt",
    15: "flug",
    17: "tan"
}

const urls = {
    2: "bewerbungsteam.json",
    3: "eventteam.json",
    4: "teammanagement.json",
    5: "rpunit.json",
    6: "communityorganizer.json",
    7: "polizei.json",
    9: "feuerwehr.json",
    10: "fahrschule.json",
    11: "sek.json",
    12: "crips.json",
//    13: "sani.json",
//    14: "arzt.json",
    15: "flugschule.json",
    16: "communitybuilder.json",
    17: "tanaka.json",
    18: "socialmedia.json",
}

const maxEntrys = 10;
const showPageUpEntrys = 8;
var curMembers;
var rpSection;


function load(page) {
    let baseURL = "https://raw.githubusercontent.com/Freilichtbuehne/Freilichtbuehne.github.io/master/data/"
    let url;
    // check if page exists
    if (urls[page]){
        // concat url with base url
        url = baseURL + urls[page];

        // check if page is a rp fraction
        if (rpids[page]){
            rpSection = true;
            ClearSubBox();
            ClearPageBox();
            setActive(rpids[page]);
        }
        else {
            rpSection = false;
        }
    }
    else{
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
    var ids = ["pol", "feu", "far", "sek", "cri", /*"sani", "arzt",*/ "flug", "tan", "soc"];
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
    text = (text == "none") ? "" : " (" + text + ")";
    url = (url == "?") ? "https://i.ibb.co/8cqjd0m/image.png" : url;
    
    var div = document.createElement("div");

    var t = document.createTextNode(name + text);
    var i = document.createElement("img");
    document.getElementById("contentBox").appendChild(div).id = index;
    document.getElementById(index).appendChild(i).id = "img" + index;
    document.getElementById(index).appendChild(t).id = "text" + index;

    document.getElementById("img" + index).src = url;
    document.getElementById("img" + index).onerror = function() {
        this.src = 'https://www.goldphoenix.de/wcf/images/avatars/avatar-default.svg';
    };
    document.getElementById("img" + index).addEventListener('click', function() {
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
        div.addEventListener('click', function() {
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
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
window.addEventListener("load", function(event) {
    document.getElementsByClassName("loader").remove();
    document.getElementById("scrollUp").onclick = function() {
        ScrollToTop()
    };
});

