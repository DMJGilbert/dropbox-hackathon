'use strict';

exports.list = function(req) {
	if(req.session.user){
		console.log(req.session.user);
	} else{
		req.io.emit('error:login', {});
	}
};
