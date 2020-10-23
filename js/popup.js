var popup_z_index_value = 10000;
var Popup_bg = document.createElement('div');
Popup_bg.onclick = function(){
    for(let popupNum in PopupArray){
        let popup = PopupArray[popupNum];
        if(!popup.isModal) popup.hide();
    }
}
Popup_bg.style.position = "fixed";
Popup_bg.style.left = "0px";
Popup_bg.style.right = "0px";
Popup_bg.style.top = "0px";
Popup_bg.style.bottom = "0px";
Popup_bg.style['z-index'] = popup_z_index_value-1;
Popup_bg.style.display = "none";
document.addEventListener("DOMContentLoaded", function(){document.getElementsByTagName("body")[0].appendChild(Popup_bg);});

var PopupArray = [];

function Popup(tag){
    if(new.target==undefined) return new Popup(tag);

    this.mainDiv = tag;
    this.mainDiv.style['z-index'] = popup_z_index_value;
    this.show = function(){
        for(let popupNum in PopupArray){
            let popup = PopupArray[popupNum];
            if(!popup.isModal) popup.hide();
        }
        this.mainDiv.style.display = "block";
        Popup_bg.style.display = "block";
    }

    this.hide = function(){
        this.mainDiv.style.display = "none";
        Popup_bg.style.display = "none";
    }

    this.hide();
    this.isModal = false;
    this.id = tag.id;

    PopupArray.push(this);
}