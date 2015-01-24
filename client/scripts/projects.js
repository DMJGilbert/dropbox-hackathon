var socket = io.connect();

socket.on('error:login', function(ret){
	window.location.href= "/index.html"
});


socket.emit("files:list", {});

socket.on('files:list', function(ret){

	if(ret.path) {
		$('#'+ret.path.substring(1).replace('%20', '')).append('&nbsp;<div style="background-color: rgb(144, 229, 149);" class="circular ui mini icon button"><i onclick="createProject(\''+ret.path.substring(1)+'\', \''+ret.path+'\')" class="icon plus"></i></div>')
	} else {
		for ( var i = 0; i < ret.stat.contents.length; i += 1) {
			if (ret.stat.contents[i]['is_dir'] ) {
				$('#sharedFolders').append('<div class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div style="cursor:pointer;" id="'+ret.stat.contents[i]['path'].substring(1).replace(/\s/g, '')+'" onclick="getPath(\''+encodeURI(ret.stat.contents[i]['path'])+'\')" class="header"> '+ret.arr[i]+'</div></div></div>');
			} 
		}
	}
});


socket.on('project:create', function(ret){

	console.log(ret);

	$('#projectFolders').append('<div class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div id="'+ret.stat.contents[i]['path'].substring(1).replace(/\s/g, '')+'" onclick="gotoProject(\''+encodeURI(ret.stat.contents[i]['path'])+'\')" class="header"> '+ret.arr[i]+'</div></div></div>');
			
});


function getPath(folderPath) {

	socket.emit("files:list", {path: folderPath});

}

function gotoProject(projectName) {

}

function createProject(projectName, projectPath) {

	socket.emit("project:create", {name:projectName, path:projectPath});
}