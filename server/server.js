var http = require('http');
var path = require('path');
var port = 80;
express = require('express.io');
app = express().http().io();

//Set up app
app.set('port', process.env.PORT || port);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser())
app.use(express.session({secret: 'devbox'}))
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));

//Start server
app.listen(port);
