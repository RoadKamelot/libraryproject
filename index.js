
var express = require('express'), 
	mysql = require('mysql'),
	path = require('path');
var app = express();

/*these are to load local resources (any file in libclone after '/' such as pictures and main.css
without them the pictures or css file.*/
app.use(express.static(__dirname+'/'));
app.use('/pictures', express.static(__dirname+'/'));

//to simplify all the processes, allow user to access database
// app.use(function(req, res, next){
// 	res.header('Access-Controll-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// 	next();
// });

/*http://codeforgeek.com/2015/01/render-html-file-expressjs/
 Allow server to load html files.
*/
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/login.html'));
});
//connect to my database
app.get('/mysql', function(req, res){
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
	console.log(rows);
});

connection.end();
res.send('Hello');
});

var server = app.listen(8080, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log(host+ ' : '+port);
});
// reference: http://www.nodewiz.biz/nodejs-rest-api-with-mysql-and-express/

