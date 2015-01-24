var socket = io.connect();

socket.on('error:login', function(ret){
	window.location.href= "/index.html"
});


socket.emit("files:list", {});

socket.on('files:list', function(ret){

	if(ret.path) {
		$('#'+ret.path.substring(1).replace('%20', '')).append('&nbsp;<div onclick="createProject(\''+ret.path.substring(1)+'\', \''+ret.path+'\')" style="background-color: rgb(144, 229, 149);" class="circular ui mini icon button"><i class="icon plus"></i></div>')
	} else {
		for ( var i = 0; i < ret.stat.contents.length; i += 1) {
			if (ret.stat.contents[i]['is_dir'] ) {
				$('#sharedFolders').append('<div class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div style="cursor:pointer;" id="'+ret.stat.contents[i]['path'].substring(1).replace(/\s/g, '')+'" class="header"><span onclick="getPath(\''+encodeURI(ret.stat.contents[i]['path'])+'\')">'+ret.arr[i]+'</span></div></div></div>');
			} 
		}
	}
});


socket.emit("projects:list", {});

socket.on('projects:list', function(ret){
	console.log(ret);
	for ( var i = 0; i < ret.projects.length; i += 1) {
		$('#projectFolders').append('<div class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div id="'+ret.projects[i].name+'" onclick="gotoProject(\''+i+'\')" class="header"><span style="cursor:pointer;"> '+ret.projects[i].name+'</span></div></div></div>');
	}
});


socket.on('projects:create', function(ret){
	
	$('#projectFolders').append('<div class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div id="'+ret.project.name+'" onclick="gotoProject(\''+ret.id+'\')" class="header"><span style="cursor:pointer;"> '+ret.project.name+'</span></div></div></div>');
	
});


function getPath(folderPath) {

	socket.emit("files:list", {path: folderPath});

}

function gotoProject(projectID) {

	console.log('/devbox.html?project='+projectID);

	window.location = '/devbox.html?project='+projectID;

}

function createProject(projectName, projectPath) {

	var projectExists = false;

	if ($('#projectFolders').find('span').length != 0) {
		for ( var i = 0; i < $('#projectFolders').find('span').length; i += 1) {
			if ($('#projectFolders').find('span')[i].innerHTML.trim() == projectName.trim()) {
				projectExists = true;
				$('#errorMessage').show();
				break;
			}
		}

		if(!projectExists) {
			socket.emit("projects:create", {name:decodeURI(projectName), path:decodeURI(projectPath)});
			$('#errorMessage').hide();
		}

	} else {
		socket.emit("projects:create", {name:decodeURI(projectName), path:decodeURI(projectPath)});
		$('#errorMessage').hide();
	}
}
