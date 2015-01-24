window.onload = function() {
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	var XmlMode = require("ace/mode/xml").Mode;
	editor.getSession().setMode(new XmlMode());
	editor.setShowPrintMargin(false);
};

function showRightBar() {
	$('#videoBar').toggle();
}

function showLeftBar() {
	$('#leftBar').toggle();
}
var socket = io.connect();
socket.on('error:login', function(ret){
  window.location.href= "/index.html"
});
