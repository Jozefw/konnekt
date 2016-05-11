var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port',process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine','jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(express.static(__dirname +'/public'));

mongoose.connect('mongodb://localhost/tester');

var Schema = new mongoose.Schema({
	_id: String,
	name: String,
	age: Number
});
// use the Schema from above and its name is employee
var user = mongoose.model('employee', Schema);

app.get('/view', function(req,res){
	user.find({}, function(err,docs){
		if(err) res.json(err);
		else res.render('index',{users: docs});
	});
});
app.post('/new', function(req,res){
	new user({
		_id: req.body.id,
		name: req.body.name,
		age: req.body.age

	}).save(function(err,doc){
		if(err) res.json(err);
		else res.send("All good here");
	});
});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server lstenning on port " + app.get('port'));
});