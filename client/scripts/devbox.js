var socket = io.connect();

function getPathFromURL(url) {
	return url.split("?")[1];
}

var projectID = getPathFromURL(document.URL);

projectID = projectID.replace("project=", "");
socket.emit("projects:files", {id: projectID});

socket.on('projects:files', function(ret){

	console.log(ret);

	for ( var i = 0; i < ret.stat.contents.length; i += 1) {
		if (ret.stat.contents[i]['is_dir']) {
			$('#projectFolder').append('<div class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" id="'+'test'+'" class="header">  '+ret.arr[i]+'</div></div></div>');
		} else {
			$('#projectFolder').append('<div onclick="loadFile(\''+ret.stat.contents[i]['path']+'\')" class="item"><i class="fa fa-file-o"></i><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" id="'+'test'+'" class="header">  '+ret.arr[i]+'</div></div></div>');
		}
	}
	
});

socket.on('projects:readFile', function(ret){

	console.log(ret);

	
});

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

function loadFile(filePath) {

	console.log(filePath);

	socket.emit("projects:readFile", {id: projectID, path:filePath});
}