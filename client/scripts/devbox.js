window.onload = function() {
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	var XmlMode = require("ace/mode/xml").Mode;
	editor.getSession().setMode(new XmlMode());

  var socket = io.connect();
  socket.emit("projects:list", {
  });

};

function showRightBar() {
	$('.right.sidebar').sidebar('toggle');
}

function showLeftBar() {
	$('.left.sidebar').sidebar('toggle');
}
