'use strict';
var Dropbox = require('dropbox');

var projects = [];

exports.list = function (req) {
  if (req.session.user) {
    var retProjects = [];
    for(var i = 0; i < 0; i++){
      var project = projects[i];
      if(project.users.indexOf(req.session.user.id) != -1){
        retProjects.push(project);
      }
    }
    req.io.emit('projects:list', {
      projects: retProjects
    });
  } else {
    req.io.emit('error:login', {});
  }
};

exports.create = function (req) {
  if (req.session.user) {
    var tokens = req.session.user.dropboxToken;
    var project = {
      name: req.data.name,
      token: tokens.accessToken,
      path: req.data.path,
      users: [req.session.user.id]
    };
    projects.push(project);
    req.io.emit('projects:create', {
      id: projects.length - 1
    });
  } else {
    req.io.emit('error:login', {});
  }
};

exports.files = function (req) {
  if (req.session.user) {
    var project = projects[req.data.id];

    var client = new Dropbox.Client({
      token: project.accessToken
    });

    client.readdir(project.path + (req.data.path ? "\\" + req.data.path : ""), {}, function (err, arr, stat, statarr) {
      req.io.emit('projects:list', {
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
