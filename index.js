
var express = require('express'), 
	mysql = require('mysql');
var app = express();

app.get('/', function(req, res) {
	res.sendFile(__dirname+'/login.html');

});
app.get('/signuppage', function(req, res){
	res.sendFile(__dirname+'/signuppage.html');
});
app.get('/dashboard', function(req, res){
	res.sendFile(__dirname+'/dashboard.html');
});

var server = app.listen(8080, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log(host+ ' : '+port);
});

// var connection = mysql.createConnection({
// 	host:'KonNguyen',
// 	user:'root',
// 	password:'password'
// });

// connection.connect();

// connection.query('select * from bookauthor', function(err, rows, fields){

// 	if(err) 
// 		 console.log(err);
	
// 	console.log('connect successfully');
// });



// connection.end();
