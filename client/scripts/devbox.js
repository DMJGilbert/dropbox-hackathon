var socket = io.connect();

var filePath;
var cachedContent;
var supportedFormats = ['js', 'txt', 'html', 'php', 'css', 'sql', 'json', 'ini', 'xml'];
var dmp = new diff_match_patch();

function getPathFromURL(url) {
	return url.split("?")[1];
}

function goBack() {
	window.location.href = "/projects.html"
}

var projectID = getPathFromURL(document.URL);

var paths = [];

projectID = projectID.replace("project=", "");
socket.emit("projects:files", {
	id: projectID
});

socket.on('projects:files', function (ret) {

	for (var i = 0; i < ret.stat.contents.length; i += 1) {
		var fileFormat = ret.stat.contents[i]['path'].split("").reverse().join("");
		fileFormat = fileFormat.substring(0, fileFormat.indexOf('.'));
		fileFormat = fileFormat.split("").reverse().join("");

		paths[i] = [ret.stat.path, ret.stat.contents[i]['path']];

		if (ret.stat.contents[i]['is_dir']) {
			$('#projectFolder').append('<div title="' + ret.arr[i] + '" style="cursor:pointer;" onclick="openFolder(\'' + i + '\')" class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" id="' + 'test' + '" class="header">&nbsp;&nbsp;' + ret.arr[i] + '</div></div></div>');
		} else if (supportedFormats.indexOf(fileFormat) !== -1) {
			$('#projectFolder').append('<div title="' + ret.arr[i] + '" style="cursor:pointer;" onclick="loadFile(\'' + ret.stat.contents[i]['path'] + '\')" class="item"><i class="fa fa-file-code-o"></i><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" id="' + 'test' + '" class="header">&nbsp;&nbsp;' + ret.arr[i] + '</div></div></div>');
		} else {
			$('#projectFolder').append('<div title="' + ret.arr[i] + '" style="cursor:default;" class="item"><i class="fa fa-file-o"></i><div style="display:inline-block;" class="content"><div style="color:rgba(0, 0, 0, 0.25); white-space:nowrap;" class="header">&nbsp;&nbsp;' + ret.arr[i] + '</div></div></div>');
		}
	}

});

socket.on('files:list', function (ret) {

	if (ret && ret.stats && ret.stats.content) {

		for (var i = 0; i < ret.stat.contents.length; i += 1) {
			var fileFormat = ret.stat.contents[i]['path'].split("").reverse().join("");
			fileFormat = fileFormat.substring(0, fileFormat.indexOf('.'));
			fileFormat = fileFormat.split("").reverse().join("");

			paths[i] = [ret.stat.path, ret.stat.contents[i]['path']];

			if (ret.stat.contents[i]['is_dir']) {
				$('#projectFolder').append('<div title="' + ret.arr[i] + '" style="cursor:pointer;" onclick="openFolder(\'' + i + '\')" class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" id="' + 'test' + '" class="header">&nbsp;&nbsp;' + ret.arr[i] + '</div></div></div>');
			} else if (supportedFormats.indexOf(fileFormat) !== -1) {
				$('#projectFolder').append('<div title="' + ret.arr[i] + '" style="cursor:pointer;" onclick="loadFile(\'' + ret.stat.contents[i]['path'] + '\')" class="item"><i class="fa fa-file-code-o"></i><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" id="' + 'test' + '" class="header">&nbsp;&nbsp;' + ret.arr[i] + '</div></div></div>');
			} else {
				$('#projectFolder').append('<div title="' + ret.arr[i] + '" style="cursor:default;" class="item"><i class="fa fa-file-o"></i><div style="display:inline-block;" class="content"><div style="color:rgba(0, 0, 0, 0.25); white-space:nowrap;" class="header">&nbsp;&nbsp;' + ret.arr[i] + '</div></div></div>');
			}
		}

	}

});

socket.on('projects:readFile', function (ret) {
	$('.ace_text-input').removeAttr("disabled");
	var editor = ace.edit("editor");
	editor.setValue(ret.content, 1);
	cachedContent = ret.content;
	filePath = ret.path;
});

socket.on('projects:editFile', function (ret) {
	if (ret.path === filePath) {
		var editor = ace.edit("editor");
		var content = editor.getValue();

		var patches = dmp.patch_fromText(ret.patch);
		var results = dmp.patch_apply(patches, content);
		cachedContent = results[0];

		var currentPosition = editor.getCursorPosition();

		editor.setValue(results[0], 1);

		console

		if (!isNaN(currentPosition.row) && !isNaN(currentPosition.column)) {
			editor.moveCursorTo(currentPosition.row, currentPosition.column);
		}

	}
});

window.onload = function () {
	$('.ace_text-input').attr('disabled', 'disabled');
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	var XmlMode = require("ace/mode/xml").Mode;
	editor.getSession().setMode(new XmlMode());
	editor.setShowPrintMargin(false);
	var editorElement = document.getElementsByClassName('ace_text-input')[0];
	editorElement.addEventListener('keyup', function (e) {
		//		var editor = ace.edit("editor");
		//		var newContent = editor.getValue();
		//
		//		var diff = dmp.diff_main(cachedContent, newContent, true);
		//		var patch_list = dmp.patch_make(cachedContent, newContent, diff);
		//		var patch_text = dmp.patch_toText(patch_list);
		//
		//	  	cachedContent = newContent;
		//		socket.emit("projects:editFile", {
		//			id: projectID,
		//			path: filePath,
		//			patch: patch_text
		//		});
	});
	setInterval(function () {
		var editor = ace.edit("editor");
		var newContent = editor.getValue();
		if(cachedContent != null && newContent != cachedContent){
			var diff = dmp.diff_main(cachedContent, newContent, true);
			var patch_list = dmp.patch_make(cachedContent, newContent, diff);
			var patch_text = dmp.patch_toText(patch_list);

			cachedContent = newContent;
			socket.emit("projects:editFile", {
				id: projectID,
				path: filePath,
				patch: patch_text
			});
		}
	}, 1000);
};

function showRightBar() {
	$('#rightBar').toggle();
}

function showLeftBar() {
	$('#leftBar').toggle();
}
var socket = io.connect();
// socket.on('error:login', function (ret) {
// 	window.location.href = "/index.html"
// });

function loadFile(filePath) {

	console.log(filePath);
	socket.emit("projects:readFile", {
		id: projectID,
		path: filePath
	});
}

function openFolder(index) {
	$('#projectFolder').empty();
	$('#projectFolder').append('<div onclick="parentFolder(\'' + paths[index][0] + '\')" style="cursor:pointer;" class="item"><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" class="header">../</div></div></div>');

	socket.emit("files:list", {
		path: paths[index][1]
	});
}

function parentFolder(parentPath) {
	$('#projectFolder').empty();

	var currentPath = parentPath.split("/");
	var newPath = "";

	if (currentPath.length > 2) {
		for (var i = 1; i < currentPath.length - 1; i += 1) {
			newPath += '/' + currentPath[i];
		}
		console.log(newPath);
		$('#projectFolder').append('<div onclick="parentFolder(\'' + newPath + '\')" style="cursor:pointer;" class="item"><div style="display:inline-block;" class="content"><div style="white-space:nowrap;" class="header">../</div></div></div>');
	}

	socket.emit("files:list", {
		path: parentPath
	});
}

var webrtc = new SimpleWebRTC({
	// the id/element dom element that will hold "our" video
	localVideoEl: 'localVideo',
	// the id/element dom element that will hold remote videos
	remoteVideosEl: 'remotesVideos',
	// immediately ask for camera access
	autoRequestMedia: true
});

// we have to wait until it's ready
webrtc.on('readyToCall', function () {
	// you can name it anything
	webrtc.joinRoom('dev-box-dropbox-hackathon-'+projectID);
});
