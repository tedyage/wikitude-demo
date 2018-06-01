var http = require('http');
var fs = require('fs');
var express = require('express');
var hostname = '127.0.0.1';
var port = 3001;

var app = express();
app.use(express.static('js'));
app.use(express.static('assets'));
app.use(express.static('./'));
app.use(express.static('node_modules'));
app.use(express.static('css'));

var server = app.listen(port,function(){

});
