'use strict';
var Dropbox = require('dropbox');

var projects = [];

exports.list = function (req) {
  if (req.session.user) {
    var retProjects = [];
    for (var i = 0; i < 0; i++) {
      var project = projects[i];
      if (project.users.indexOf(req.session.user.id) != -1) {
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
    console.log(project);
    projects.push(project);
    req.io.emit('projects:create', {
      id: projects.length - 1,
      project: project
    });
  } else {
    req.io.emit('error:login', {});
  }
};

exports.files = function (req) {
  console.log("Test");
  if (req.session.user) {
    var project = projects[req.data.id];
    if (project) {
      var client = new Dropbox.Client({
        token: project.accessToken
      });

      client.readdir(project.path + (req.data.path ? "\\" + req.data.path : ""), {}, function (err, arr, stat, statarr) {
        req.io.emit('projects:files', {
          err: err,
          content: content,
          stat: stat,
          statarr: statarr,
          path: req.data.path
        });
      });
    }
  } else {
    req.io.emit('error:login', {});
  }
};

exports.readFile = function (req) {
  if (req.session.user) {
    var project = projects[req.data.id];
    if (project) {
      var client = new Dropbox.Client({
        token: project.accessToken
      });

      client.readFile(project.path + (req.data.path ? "\\" + req.data.path : ""), {}, function (err, arr, stat, statarr) {
        req.io.emit('projects:readFile', {
          err: err,
          arr: arr,
          stat: stat,
          statarr: statarr,
          path: req.data.path
        });
      });
    }
  } else {
    req.io.emit('error:login', {});
  }
};

exports.createFile = function (req) {
  if (req.session.user) {
    var project = projects[req.data.id];
    if (project) {
      var client = new Dropbox.Client({
        token: project.accessToken
      });

      client.writeFile(project.path + (req.data.path ? "\\" + req.data.path : ""), "", {}, function (err, arr, stat, statarr) {
        req.io.emit('projects:createFile', {
          err: err,
          arr: arr,
          stat: stat,
          statarr: statarr,
          path: req.data.path
        });
      });
    }
  } else {
    req.io.emit('error:login', {});
  }
};

exports.createDir = function (req) {
  if (req.session.user) {
    var project = projects[req.data.id];
    if (project) {
      var client = new Dropbox.Client({
        token: project.accessToken
      });

      client.mkdir(project.path + (req.data.path ? "\\" + req.data.path : ""), "", function (err, arr, stat, statarr) {
        req.io.emit('projects:createDir', {
          err: err,
          arr: arr,
          stat: stat,
          statarr: statarr,
          path: req.data.path
        });
      });
    }
  } else {
    req.io.emit('error:login', {});
  }
};

exports.delete = function (req) {
  if (req.session.user) {
    var project = projects[req.data.id];
    if (project) {
      var client = new Dropbox.Client({
        token: project.accessToken
      });

      client.remove(project.path + (req.data.path ? "\\" + req.data.path : ""), function (err, arr, stat, statarr) {
        req.io.emit('projects:delete', {
          err: err,
          arr: arr,
          stat: stat,
          statarr: statarr,
          path: req.data.path
        });
      });
    }
  } else {
    req.io.emit('error:login', {});
  }
};
