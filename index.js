
var express = require('express'), 
	mysql = require('mysql'),
	path = require('path');
var app = express();

/*these are to load local resources (any file in libclone after '/' such as pictures and main.css
without them the pictures or css file.*/
app.use(express.static(__dirname+'/'));
app.use('/pictures', express.static(__dirname+'/'));
/*http://codeforgeek.com/2015/01/render-html-file-expressjs/
 Allow server to load html files.
*/
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/login.html'));
});

var server = app.listen(8080, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log(host+ ' : '+port);
});

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'password',
	database : 'nguyen_khanh_db'
});

connection.connect();

connection.query('select * from bookauthor', function(err, rows, fields){

	if(err) 
		 console.log(err);
	else
	console.log('connect successfully');
});



connection.end();
