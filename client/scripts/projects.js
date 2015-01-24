var socket = io.connect();

socket.on('error:login', function(ret){
  window.location.href= "/index.html"
});


socket.emit("files:list", {});

socket.on('files:list', function(ret){

	console.log(ret);

	for ( var i = 0; i < ret.stat.contents.length; i += 1) {
		if (ret.stat.contents[i]['is_dir'] ) {
			$('#sharedFolders').append('<div class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div id="'+'test'+'" onclick="getPath(this);" class="header"> '+ret.arr[i]+'</div></div></div>');
		} 
	}
	
});



function getPath(folder) {

	socket.emit("projects:files", {path: "Uni"});

	console.log(folder);
}


socket.on('projects:files', function(ret){

	console.log(ret);

	// $(folder).append('<div class="item"><i class="fa fa-folder-open"></i><div style="display:inline-block;" class="content"><div onclick="getPath(this);" class="header"> '+ret.arr[i]+'</div></div></div>');
	
});
