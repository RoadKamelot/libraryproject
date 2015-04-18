var _und = require('underscore'),
	mysql = require('mysql');

var dbconfig = {
    connectionLimit: 100, //important
    debug: false,
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'b17bd3ffac20b3',
    password: 'd64c505b20f19d7',
    database: 'heroku_a6679b0da499276'
};

var pool = mysql.createPool(dbconfig);

function _findMatchingUsernameAndPassword(username, password, callback) {
	pool.getConnection(function(err, connection) {
		checkSQLConnection(err, connection);
	    connection.query('select username, pw from useraccount', function(err, dbResult) {
	        connection.release();
	        if (err) {
	            return err;
	        } else {
	            var result = _und.find(dbResult, function(row) {
	                return row.username == username && row.pw == password;
	            });
                callback(null, result);
	        }
	    });
	});
}

function _registerAndValidateUser(post, callback) {
	var username = post.Username,
		email = post.Email,
		useraccountPost = { Username : post.Username, Pw : post.Password };
	delete post['Password'];

	pool.getConnection(function(err, connection) {
		checkSQLConnection(err, connection);
	    connection.query('select Username, Email from userinfo', function(err, dbResult) {
	        if (err) {
	            return callback(err, null);
	        } else {
	            var searchUser = _und.find(dbResult, function(row) {
	                return row.username == username || row.Email == email;
	            });

	            if (searchUser != null) {
	            	console.log('It is really in here');
	            	return callback(new Error('Duplicated User'), null);
	            }

	            connection.query('insert into userinfo set ?', post, function(err, dbResult, fields) {
	            	//{"fieldCount":0,"affectedRows":1,"insertId":182,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}

	                if (err) {
	                    return callback(err, null);
	                } else {
	                	useraccountPost.UserNo = dbResult.insertId;

	                	connection.query('insert into useraccount set ?', useraccountPost, function(err, dbResult, fields) {
			            	connection.release();
			            	if (err) {
			            		return callback(err, null);
			            	} else {
			            		return callback(null, useraccountPost);
			            	}
		            	});
	                }
	            });

	            console.log('useraccountPost: ' + JSON.stringify(useraccountPost));

	            //insert into useraccount (UserNo, Username, Pw) values(888, 'inno23', 'xxxx');
	            
	        }
	    });
	});
}

function _findMatchingISBN(isbn, callback) {
	pool.getConnection(function(err, connection) {
		checkSQLConnection(err, connection);
		connection.query('select ISBN, Title, Author, Category from bookinfo', function(err, dbResult) {
			if (err) {
                return callback(err, null);
            } else {
                var result = _und.find(dbResult, function(row) {
                	return row.ISBN == isbn; //isbn == req.headers.isbn
                });
                callback(null, result);
            }
		});
	});
}

function checkSQLConnection(err, connection) {
    if (err) {
        connection.release();
        res.json({
            "code": 100,
            "status": "Error in connection database"
        });
        return;
    }
}

module.exports = {
	findMatchingUsernameAndPassword : _findMatchingUsernameAndPassword,
	registerAndValidateUser : _registerAndValidateUser,
	findMatchingISBN : _findMatchingISBN
};