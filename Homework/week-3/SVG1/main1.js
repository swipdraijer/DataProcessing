// Swip Draijer
// 10192239
// Changes color of countries on map

window.onload = function() {
 	changeColor("den", "008080");
 	changeColor("dui", "472747");
 	changeColor("rsa", "edcf09");
 	changeColor("ch", "ff00ff");
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    document.getElementById(id).style.fill = color;
}