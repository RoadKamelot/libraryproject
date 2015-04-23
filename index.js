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
    app = express(),
    passport = require('passport'),
    clearDbAccessor = require('./ClearDBAccessor');

var dbconfig = {
    connectionLimit: 100, //important
    debug: false,
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'b17bd3ffac20b3',
    password: 'd64c505b20f19d7',
    database: 'heroku_a6679b0da499276'
};

var pool = mysql.createPool(dbconfig);

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

app.set('port', (process.env.PORT || 8080))
    /*http://codeforgeek.com/2015/01/render-html-file-expressjs/
     Allow server to load html files.
    */

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/login-validate', function(req, res) {
    var username = req.headers.username,
        password = req.headers.password;

    //connect to clearDB
    clearDbAccessor.findMatchingUsernameAndPassword(username, password, function(err, result) {
        console.log('result: ' + result);
        return result ? res.send(true): res.send(false);
    });
});

/*============================== Register button ===============
        This will do the check with database and insert information */
app.post('/register', function(req, res) {
    // var result = true;
    //post is the package information user type in, to be added to table:
    var post = {
        'Username': req.body.username,
        'Lname': req.body.lastName,
        'Fname': req.body.firstName,
        'Addr': req.body.street,
        'Email': req.body.email,
        'City': req.body.city,
        'Zipcode': req.body.zip,
        'Phone': req.body.phone,
        'Password': req.body.password
    };

    clearDbAccessor.registerAndValidateUser(post, function(err, result) {
        console.log('err: ' + err);
        console.log('err: ' + JSON.stringify(err));
        if (err) {
            return res.status(400).send({ error: err.message });
        } else {
            return res.send(result);
        }
    });
});

/********************************************************** ISBN Search button ******************************************
                                        Query information from database and return result to jquery to display*/
app.get('/isbn-search', function(req, res) {
    clearDbAccessor.findMatchingISBN(req.headers.isbn, function(err, result) {
        return result ? res.send(result) : res.send(err);
    });
});

/********************************************************** AUTHOR Search button ******************************************
                        Query information from database and return result to jquery to display*/
app.get('/author-search', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query('select ISBN, Author, Title, Category from bookinfo where Author like ?', '%' + req.headers.author + '%', function(err, rows, fields) {
            if (err) {
                console.log(err);
                res.send(err);
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
    });
});
/********************************************************** TITLE Search button ******************************************
                        Query information from database and return result to jquery to display */
app.get('/title-search', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query('select ISBN, Author, Title, Category from bookinfo where Title like ?', '%' + req.headers.title + '%', function(queryError, rows, fields) {
            if (queryError) {
                // res.send(err);
                res.status(400).send('ClearDB responded with an error:', queryError);
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
    });
});
/***********************************************************DC *****************************************/
app.get('/dc', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
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
    });
});

/********************************************** MARVEL category link ******************************************************
                                                    Query information from database and return result to jquery to display*/
app.get('/marvel', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
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
    });
});

/*************************************************MANGA *******************************************************
                                    Query information from database and return result to jquery to display*/
app.get('/manga', function(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
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
    });
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});