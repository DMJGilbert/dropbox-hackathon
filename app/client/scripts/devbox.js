var socket = io.connect();
var filePath;
var cachedContent;
var supportedFormats = ['js', 'txt'];
var dmp = new diff_match_patch();

function getPathFromURL(url) {
	return url.split("?")[1];
}

var projectID = getPathFromURL(document.URL);

projectID = projectID.replace("project=", "");
socket.emit("projects:files", {
	id: projectID
});

socket.on('projects:files', function (ret) {

	console.log(ret);

	for (var i = 0; i < ret.stat.contents.length; i += 1) {
		var fileFormat = ret.stat.contents[i]['path'].split("").reverse().join("");
		fileFormat = fileFormat.substring(0, fileFormat.indexOf('.'));
		fileFormat = fileFormat.split("").reverse().join("");

		console.log(fileFormat);

		if (ret.stat.contents[i]['is_dir']) {
			$('#projectFolder').append('<div class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" id="' + 'test' + '" class="header">  ' + ret.arr[i] + '</div></div></div>');
		} else if (supportedFormats.indexOf(fileFormat) !== -1) {
			$('#projectFolder').append('<div onclick="loadFile(\'' + ret.stat.contents[i]['path'] + '\')" class="item"><i class="fa fa-file-code-o"></i><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" id="' + 'test' + '" class="header">  ' + ret.arr[i] + '</div></div></div>');
		} else {
			$('#projectFolder').append('<div onclick="loadFile(\'' + ret.stat.contents[i]['path'] + '\')" class="item"><i class="fa fa-file-o"></i><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" id="' + 'test' + '" class="header">  ' + ret.arr[i] + '</div></div></div>');
		}
	}

});

socket.on('projects:readFile', function (ret) {
	var editor = ace.edit("editor");
	editor.setValue(ret.content, 1);
	cachedContent = ret.content;
	filePath = ret.path;
});

socket.on('projects:editFile', function (ret) {
  console.log(ret)
	if (ret.path === filePath) {
		var editor = ace.edit("editor");
		var content = editor.getValue();

		var patches = dmp.patch_fromText(ret.patch);
		var results = dmp.patch_apply(patches, content);
		cachedContent = results[0];
		editor.setValue(results[0], 1);
	}
});

window.onload = function () {
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	var XmlMode = require("ace/mode/xml").Mode;
	editor.getSession().setMode(new XmlMode());
	editor.setShowPrintMargin(false);
	var editorElement = document.getElementsByClassName('ace_text-input')[0];
	editorElement.addEventListener('keyup', function (e) {
		var editor = ace.edit("editor");
		var newContent = editor.getValue();

		var diff = dmp.diff_main(cachedContent, newContent, true);
		var patch_list = dmp.patch_make(cachedContent, newContent, diff);
		var patch_text = dmp.patch_toText(patch_list);

	  	cachedContent = newContent;
		socket.emit("projects:editFile", {
			id: projectID,
			path: filePath,
			patch: patch_text
		});
	});
};

function showRightBar() {
	$('#videoBar').toggle();
}

function showLeftBar() {
	$('#leftBar').toggle();
}
var socket = io.connect();
socket.on('error:login', function (ret) {
	window.location.href = "/index.html"
});

function loadFile(filePath) {

	console.log(filePath);

	socket.emit("projects:readFile", {
		id: projectID,
		path: filePath
	});
}
