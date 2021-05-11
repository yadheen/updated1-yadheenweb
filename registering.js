var input1 = document.getElementsByTagName("input")[0];
var input2 = document.getElementsByTagName("input")[1];
var input3 = document.getElementsByTagName("input")[2];
var submit = document.getElementsByTagName("button");
input1.addEventListener("keypress", function(event) {
    if ((event.keyCode === 13) && (input1.value.length >= 6)) {
        event.preventDefault();
        input2.focus();
    }
});

input2.addEventListener("keypress", function(event) {
    if ((event.keyCode === 13) && (input2.value.length >= 10)) {
        event.preventDefault();
        input3.focus();
    }
});
input3.addEventListener("keypress", function(event) {
    if ((event.keyCode === 13) && (input3.value.length >= 6)) {
        event.preventDefault();
        submit.focus();
    }
});

var btn = document.createElement("BUTTON");