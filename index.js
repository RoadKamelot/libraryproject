
var express = require('express'), 
	mysql = require('mysql'),
	path = require('path'),
	bodyParser = require('body-parser'),
	_und = require('underscore');
var app = express();

/*these are to load local resources (any file in libclone after '/' such as pictures and main.css
without them the pictures or css file.*/
app.use(express.static(__dirname+'/'));
app.use('/pictures', express.static(__dirname+'/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
//to simplify all the processes, allow user to access database
app.use(function(req, res, next){
	res.header('Access-Controll-Allow-Origin', '*');
	res.header('Access-Controll-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

/*http://codeforgeek.com/2015/01/render-html-file-expressjs/
 Allow server to load html files.
*/
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/login.html'));
});
//connect to my database
app.get('/login-validate', function(req, res){
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'password',
		database : 'nguyen_khanh_db'
	});
	connection.connect();
	connection.query('select username, pw from useraccount', function(err, rows, fields){
		if(err) {
			console.log("Fail to query!");
		} else {
			var result = 'false';
			for(var i=0; i<rows.length; i++){
				// console.log('From jquery: '+req.headers.username);
				// console.log('From database: '+rows[i].username);
				if((rows[i].username==req.headers.username) &&
					(rows[i].pw==req.headers.password)){
					result='true';
				}
			}
			res.send(result);
		}
	});
	connection.end();
});
/*============================== Register button ===============*/
app.post('/register', function(req, res){
	var propValue;
	// for(var propName in req.body){
	// 	propValue=req.body[propName];
	// 	console.log(propName+" : "+propValue);
	// };
	console.log(req.body.firstName);
	console.log(req.body.lastName);
	console.log(req.body.username);

	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'password',
		database : 'nguyen_khanh_db'
	});
	var result = false;
	connection.connect();
	//post is the package information user type in, to be added to table:
	var post = {Username: req.body.username, 
		Lname: req.body.lastName,
		Fname: req.body.firstName,
		Addr: req.body.street,
		Email: req.body.email,
		City: req.body.city,
		Zipcode: req.body.zip,
		Phone: req.body.phone
		};
	connection.query('select Username, Email from userinfo', function(err, rows, fields){
		for(var value in rows){
			if(rows[value].Username == req.body.username || rows[value].Email == req.body.email){
				result=false;
				// console.log(rows[value].Username+" check availability =============================================");
				res.send("Fail to register");
				return;
			}
		};
		
	});
	if(result==true) {
		connection.query('insert into userinfo set ?',post, function(err, rows, fields){
			if(err){
				//insert into <table> value();
				console.log("Fail to register !");
			} else {
				result = true;
				// console.log("Just added to the whatever");
				res.send("User successfully registered !");
			}

		});
	}	
	
	
	connection.end();
	
});
/********************************************************** ISBN Search button *******************************************/
app.get('/isbn-search', function(req, res){
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'password',
		database : 'nguyen_khanh_db'
	});
	connection.connect();
	connection.query('select ISBN, Title, Author, Category from bookinfo', function(err, rows, fields){
		if(err) {
			console.log("Fail to query!");
		} else {
			for(var value in rows){
				if(req.headers.isbn == rows[value].ISBN){
					var isbn = rows[value].ISBN;
					var author = rows[value].Author;
					var title = rows[value].Title;
					var category=rows[value].Category;

					return res.send('<div class="container searchbox-div"><div><strong>'+isbn+ '</strong></div><div>'+author+'</div><div>'+title+'</div><div> '+category+ '</div><div class="col-xs-3 col-sm-3 col-md-3"><button class="btn btn-primary btn-block">Add to Cart</button></div></div>');

				}
			}
			res.send(false);
		}
	});
	connection.end();
});
/********************************************************** AUTHOR Search button *******************************************/
app.get('/author-search', function(req, res){
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'password',
		database : 'nguyen_khanh_db'
	});
	connection.connect();
	
	connection.query('select ISBN, Author, Title, Category from bookinfo where Author like ?','%'+req.headers.author+'%', function(err, rows, fields){
		if(err) {
			console.log(err);
		} else {
			var result = false,
				resultList = [];
			for(var value in rows){
				console.log(rows[value]);
				var test = rows[value].Author.toLowerCase();
				if(test.indexOf(req.headers.author.toLowerCase())>-1){
					var isbn = rows[value].ISBN;
					var author = rows[value].Author;
					var title = rows[value].Title;
					var category=rows[value].Category;

					result = true;
					resultList.push('<div class="container searchbox-div"><div>'+isbn+ '</div><div><strong>'+author+'</strong></div><div>'+title+'</div><div> '+category+ '</div><div class="col-xs-3 col-sm-3 col-md-3"><button class="btn btn-primary btn-block">Add to Cart</button></div></div>');
				}
			}
			if (result) {
				var resultListTemplate = '';
				resultList.forEach(function(html) {
					resultListTemplate += html;
				});

				return res.send(resultListTemplate);
			} else {
				return res.send(false);
			}
		}
	});
	connection.end();
});
/********************************************************** TITLE Search button *******************************************/
app.get('/title-search', function(req, res){
	var connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'password',
		database : 'nguyen_khanh_db'
	});
	connection.connect();
	
	connection.query('select ISBN, Author, Title, Category from bookinfo where Title like ?','%'+req.headers.title+'%', function(err, rows, fields){
		if(err) {
			console.log(err);
		} else {
			var result = false,
				resultList = [];
			for(var value in rows){
				console.log(rows[value]);
				var test = rows[value].Title.toLowerCase();
				if(test.indexOf(req.headers.title.toLowerCase())>-1){
					var isbn = rows[value].ISBN;
					var author = rows[value].Author;
					var title = rows[value].Title;
					var category=rows[value].Category;

					result = true;
					resultList.push('<div class="container searchbox-div"><div>'+isbn+ '</div><div>'+author+'</div><div><strong>'+title+'</strong></div><div> '+category+ '</div><div class="col-xs-3 col-sm-3 col-md-3"><button class="btn btn-primary btn-block">Add to Cart</button></div></div>');
				}
			}
			if (result) {
				var resultListTemplate = '';
				resultList.forEach(function(html) {
					resultListTemplate += html;
				});

				return res.send(resultListTemplate);
			} else {
				return res.send(false);
			}
		}
	});
	connection.end();
});
/************************************************** Record links **************/
// app.get('/record', function(req, res){
// 	var connection = mysql.createConnection({
// 		host:'localhost',
// 		user:'root',
// 		password:'password',
// 		database : 'nguyen_khanh_db'
// 	});
// 	connection.connect();
	
// 	connection.query('select * from userbook where Username =?',req.headers.username, function(err, rows, fields){
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			var result = false,
// 				resultList = [];

// 							console.log(req.headers.username);

// 			for(var value in rows){
// 				console.log(rows[value]);

// 				var test = rows[value].Title.toLowerCase();
// 				if(rows[value].Username == req.headers.username){
// 					var isbn = rows[value].ISBN;
// 					var checkout = rows[value].Checkout_date;
// 					var returnD = rows[value].Return_date;
// 					// var category=rows[value].Category;

// 					result = true;
// 					resultList.push('<div class="container searchbox-div"><div>'+isbn+ '</div><div>'+checkout+'</div><div><strong>'+returnDate+'</strong></div></div>');
// 				}
// 			}
// 			if (result) {
// 				var resultListTemplate = '';
// 				resultList.forEach(function(html) {
// 					resultListTemplate += html;
// 				});

// 				return res.send(resultListTemplate);
// 			} else {
// 				return res.send(false);
// 			}
// 		}
// 	});
	
// 	connection.end();
// });


var server = app.listen(8080, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log(host+ ' : '+port);
});

