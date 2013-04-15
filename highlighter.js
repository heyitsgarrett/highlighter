
var content = document.getElementById('content'),
    url = location.protocol+'//'+location.host+location.pathname;

content.onmouseup = function(e){
    var selection;

    if (window.getSelection()) {
        selection = window.getSelection();
    } else if (document.getSelection()) {
        selection = document.getSelection();
    }

    if (selection.type !== 'Range') return destroyPopups();
    if (e.srcElement.tagName === 'A') return;

    showHighlighterPopup(e,selection);

};

window.onresize = function(e) {
    clearSelection();
    destroyPopups();
}

function showHighlighterPopup(e,selection) {

    destroyPopups();

    // Build url hash
    console.log(range);
    var range = [selection.anchorOffset, selection.extentOffset];
    range.sort(function(a,b){return a-b});

    var hash = '#hl-' + range[0] + '-' + range[1];

    // Add, style popup
    var popup = document.createElement("a");
    popup.innerHTML = '#';
    popup.setAttribute('id','highlighter-pop');
    popup.setAttribute('href', url + hash);
    popup.style.left = e.layerX - 25;

    if (selection.baseOffset < selection.extentOffset) {
        // Selected from top to bottom
        popup.setAttribute('class','point-up');
        popup.style.top = e.layerY + 30;
    } else {
        // Selected from bottom to top
        popup.style.top = e.layerY - 80;
    }

    content.appendChild(popup);
}

function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}

function destroyPopups() {
    var popup = document.getElementById('highlighter-pop');

    if(popup)
        content.removeChild(popup);
    else return;
}


function getHashParams() {
    // As seen in http://stackoverflow.com/a/4198132/1567196
    var hashParams = {};
    var e,
        a = /\+/g,
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);

    while (e = r.exec(q))
       hashParams[d(e[1])] = d(e[2]);

    return hashParams;
}
