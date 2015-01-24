window.onload = function() {
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	var XmlMode = require("ace/mode/xml").Mode;
	editor.getSession().setMode(new XmlMode());

  var socket = io.connect();

  socket.on('projects:files', function(ret){
    console.log(ret);
  });

  socket.emit("projects:files", {
  });

  socket.emit("projects:files", {
  path: "Uni"});

};

function showRightBar() {
	$('#videoBar').toggle();
}

function showLeftBar() {
	$('#leftBar').toggle();
}
