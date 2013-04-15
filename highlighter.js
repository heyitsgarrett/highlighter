
var content = document.getElementById('content'),
    url = window.location.href;

document.onmouseup = function(e){
    var selection;

    if (window.getSelection()) {
        selection = window.getSelection();
    } else if (document.getSelection()) {
        selection = document.getSelection();
    }

    if (selection.type === 'Caret') return destroyPopups();

    showHighlighterPopup(e,selection);

};

window.onresize = function(e) {
    clearSelection();
    destroyPopups();
}

function showHighlighterPopup(e,selection) {

    destroyPopups();

    // Build url hash
    var range = [selection.anchorOffset, selection.extentOffset];
    range.sort();

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
