
var content = document.getElementById('content');

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

    // Add popup
    var popup = document.createElement("a");
    popup.innerHTML = '#';
    popup.setAttribute('id','highlighter-pop');
    popup.style.left = e.pageX - 25;

    if (selection.baseOffset < selection.extentOffset) {
        // Selected from top to bottom
        popup.setAttribute('class','point-up');
        popup.style.top = e.pageY;
    } else {
        // Selected from bottom to top
        popup.style.top = e.pageY - 120;
    }

    content.appendChild(popup);

    console.log(e);
    console.log(selection);
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
