'use strict';

var Dropbox = require('dropbox');

exports.list = function (req) {
  if (req.session.user) {
    console.log(req.session.user);
    var tokens = req.session.user.dropboxToken;

    var client = new Dropbox.Client({
      token: tokens.accessToken
    });

    client.readdir(req.data.path ? req.data.path : "", {}, function (err, arr, stat, statarr) {
      req.io.emit('files:list', {
        err: err,
        arr: arr,
        stat: stat,
        statarr: statarr,
        path: req.data.path
      });
    });

  } else {
    req.io.emit('error:login', {});
  }
};
