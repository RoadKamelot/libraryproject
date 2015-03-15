/* index.js
Khanh Nguyen
This javascript file has plug-in installations, connect to mysql, query information that was passing from jquery.
*/
var express = require('express'),
    mysql = require('mysql'),
    path = require('path'),
    bodyParser = require('body-parser'),
    _und = require('underscore'),
    cool = require('cool-ascii-faces'),
    app = express(), connection;
/*these are to load local resources (any file in libclone after '/' such as pictures and main.css
without them the pictures or css file.*/
app.use(express.static(__dirname + '/'));
app.use('/pictures', express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//to simplify all the processes, allow user to access database
app.use(function(req, res, next) {
    res.header('Access-Controll-Allow-Origin', '*');
    res.header('Access-Controll-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.set('port', (process.env.PORT || 8080));
/* database to heroku */
var dbconfig = {
    host: process.env.CLEARDB_DATABASE_URL || 'localhost',
    user: process.env.CLEARDB_USERNAME || 'root',
    password: process.env.CLEARDB_PASSWORD || 'password',
    database: process.env.CLEARDB_DATABASE || 'nguyen_khanh_db'
};
console.log('connecting to database ...');

connection = mysql.createConnection(dbconfig);
connection.connect(function(err, conn) {
    if (err) {
        console.log('MySQL connection error: ', err);
        process.exit(1);
    } else {
        app.listen(app.get('port'), function() {
            console.log("Node app is running at localhost:" + app.get('port'))
        });
    }
});
connection.on('error', function(err) {
    console.log(err);
});
/*http://codeforgeek.com/2015/01/render-html-file-expressjs/
Allow server to load html files.
*/
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});
//connect to my database
app.get('/login-validate', function(req, res) {
    connection.query('select username, pw from useraccount', function(err, rows, fields) {
        if (err) {
            console.log("Fail to query!");
        } else {
            var result = 'false';
            for (var i = 0; i < rows.length; i++) {
                // console.log('From jquery: '+req.headers.username);
                // console.log('From database: '+rows[i].username);
                if ((rows[i].username == req.headers.username) &&
                    (rows[i].pw == req.headers.password)) {
                    result = 'true';
                }
            }
            res.send(result);
        }
    });
    connection.release();
});
/*============================== Register button ===============
        This will do the check with database and insert information */
app.post('/register', function(req, res) {
    var result = true;
    //post is the package information user type in, to be added to table:
    var post = {
        Username: req.body.username,
        Lname: req.body.lastName,
        Fname: req.body.firstName,
        Addr: req.body.street,
        Email: req.body.email,
        City: req.body.city,
        Zipcode: req.body.zip,
        Phone: req.body.phone
    };
    connection.query('select Username, Email from userinfo', function(err, rows, fields) {
        for (var value in rows) {
            var isDuplicate = rows[value].Username == req.body.username || rows[value].Email == req.body.email;
            if (isDuplicate) {
                result = false;
                connection.release();
                return res.send("Fail to register because of duplicated userinfo");;
            }
        };
        connection.query('insert into userinfo set ?', post, function(err, rows, fields) {
            console.log('err: ' + err);
            if (err) {
                connection.release();
                return res.send(false);
            } else {
                connection.release();
                return res.send("User successfully registered!");
            }
        });
    });
});
/********************************************************** ISBN Search button ******************************************
                                        Query information from database and return result to jquery to display*/
app.get('/isbn-search', function(req, res) {
    connection.query('select ISBN, Title, Author, Category from bookinfo', function(err, rows, fields) {
        if (err) {
            console.log("Fail to query!");
        } else {
            for (var value in rows) {
                if (req.headers.isbn == rows[value].ISBN) {
                    var isbn = rows[value].ISBN;
                    var author = rows[value].Author;
                    var title = rows[value].Title;
                    var category = rows[value].Category;
                    return res.send('<div class="container searchbox-div"><div><strong>' + isbn + '</strong></div><div>' + author + '</div><div>' + title + '</div><div> ' + category + '</div></div>');
                }
            }
            res.send(false);
        }
    });
    connection.release();
});
/********************************************************** AUTHOR Search button ******************************************
                        Query information from database and return result to jquery to display*/
app.get('/author-search', function(req, res) {
    connection.query('select ISBN, Author, Title, Category from bookinfo where Author like ?', '%' + req.headers.author + '%', function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            var result = false,
                resultList = [];
            for (var value in rows) {
                console.log(rows[value]);
                var test = rows[value].Author.toLowerCase();
                if (test.indexOf(req.headers.author.toLowerCase()) > -1) {
                    var isbn = rows[value].ISBN;
                    var author = rows[value].Author;
                    var title = rows[value].Title;
                    var category = rows[value].Category;
                    result = true;
                    resultList.push('<div class="container searchbox-div"><div>' + isbn + '</div><div><strong>' + author + '</strong></div><div>' + title + '</div><div> ' + category + '</div></div>');
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
    connection.release();
});
/********************************************************** TITLE Search button ******************************************
                        Query information from database and return result to jquery to display */
app.get('/title-search', function(req, res) {
    connection.query('select ISBN, Author, Title, Category from bookinfo where Title like ?', '%' + req.headers.title + '%', function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            var result = false,
                resultList = [];
            for (var value in rows) {
                console.log(rows[value]);
                var test = rows[value].Title.toLowerCase();
                if (test.indexOf(req.headers.title.toLowerCase()) > -1) {
                    var isbn = rows[value].ISBN;
                    var author = rows[value].Author;
                    var title = rows[value].Title;
                    var category = rows[value].Category;
                    result = true;
                    resultList.push('<div class="container searchbox-div"><div>' + isbn + '</div><div>' + author + '</div><div><strong>' + title + '</strong></div><div> ' + category + '</div></div>');
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
    connection.release();
});
/***********************************************************DC *****************************************/
app.get('/dc', function(req, res) {
    connection.query("select ISBN, Author, Title, Category from bookinfo where Category='DC Comics'", function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            var resultList = [];
            for (var value in rows) {
                var isbn = rows[value].ISBN;
                var author = rows[value].Author;
                var title = rows[value].Title;
                var category = rows[value].Category;
                console.log(rows[value]);
                resultList.push('<div class="container searchbox-div"><div>' + isbn + '</div><div>' + author + '</div><div><strong>' + title + '</strong></div><div> ' + category + '</div></div>');
            }
            if (resultList.length > 0) {
                var resultListTemplate = '';
                resultList.forEach(function(html) {
                    resultListTemplate += html;
                });
                return res.send(resultListTemplate);
            } else {
                res.send('false');
            }
        }
    });
    connection.release();
});
/********************************************** MARVEL category link ******************************************************
                                                    Query information from database and return result to jquery to display*/
app.get('/marvel', function(req, res) {
    connection.query("select ISBN, Author, Title, Category from bookinfo where Category='Marvel Comics'", function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            var resultList = [];
            for (var value in rows) {
                var isbn = rows[value].ISBN;
                var author = rows[value].Author;
                var title = rows[value].Title;
                var category = rows[value].Category;
                console.log(rows[value]);
                resultList.push('<div class="container searchbox-div"><div>' + isbn + '</div><div>' + author + '</div><div><strong>' + title + '</strong></div><div> ' + category + '</div></div>');
            }
            if (resultList.length > 0) {
                var resultListTemplate = '';
                resultList.forEach(function(html) {
                    resultListTemplate += html;
                });
                return res.send(resultListTemplate);
            } else {
                res.send('false');
            }
        }
    });
    connection.release();
});
/*************************************************MANGA *******************************************************
                                    Query information from database and return result to jquery to display*/
app.get('/manga', function(req, res) {
    connection.query("select ISBN, Author, Title, Category from bookinfo where Category='Manga'", function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            var resultList = [];
            for (var value in rows) {
                var isbn = rows[value].ISBN;
                var author = rows[value].Author;
                var title = rows[value].Title;
                var category = rows[value].Category;
                console.log(rows[value]);
                resultList.push('<div class="container searchbox-div"><div>' + isbn + '</div><div>' + author + '</div><div><strong>' + title + '</strong></div><div> ' + category + '</div></div>');
            }
            if (resultList.length > 0) {
                var resultListTemplate = '';
                resultList.forEach(function(html) {
                    resultListTemplate += html;
                });
                return res.send(resultListTemplate);
            } else {
                res.send('false');
            }
        }
    });
    connection.release();
});
