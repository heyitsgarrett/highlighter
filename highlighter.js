
var content = document.getElementById('content'),
    contentText = content.innerHTML.toString(),
    url = location.protocol+'//'+location.host+location.pathname,
    hashes = getHashParams();

// console.log(contentText);

// Init
if(hashes['hl']) {
    var hl = hashes['hl'].split('-'),
        hlstr = contentText.substr(hl[0],hl[1]);

    // Get range of highlight
    var before = contentText.substr(0,hl[0]),
        highlight = '<span class="highlight">' + hlstr + '</span>',
        after = contentText.substr(before.length + hlstr.length);

    // Replace that range with contents plus span with class
    content.innerHTML = before + highlight + after;
}

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
    var range = getSelectionRange();

    var hash = '#hl=' + range[0] + '-' + range[1];

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

function getSelectionRange() {

    var blockLength,
        blockText,
        start,
        end;
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            blockLength = container.innerHTML.length;
            blockText = container.innerText;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            blockLength = document.selection.createRange().innerHTML.length;
            blockText = document.selection.createRange().innerText;
        }
    }

    // Sanitize block text (in case of multiple paragraphs,blocks)
    // We only need the start index, and hopefully enough text is selected to
    // find it.
    blockText = blockText.split('\n');

    // Build range
    start = contentText.indexOf(blockText[0]);
    range = [start,blockLength];

    return range;
}