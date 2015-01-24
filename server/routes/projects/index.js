'use strict';

var Dropbox = require('dropbox');

exports.files = function (req) {
  if (req.session.user) {
    console.log(req.session.user);
    var tokens = req.session.user.dropboxToken;

    var client = new Dropbox.Client({
      token: tokens.accessToken
    });

    console.log(client);
    client.getAccountInfo(function (error, accountInfo) {
      if (error) {
        console.log(error); // Something went wrong.
      } else {
        client.readdir(req.data.path? req.data.path : "", {}, function(err, arr, stat, statarr){
          req.io.emit('projects:files', {
            err: err,
            arr: arr,
            stat: stat,
            statarr: statarr
          });
        });
      }
    });
  } else {
    req.io.emit('error:login', {});
  }
};
