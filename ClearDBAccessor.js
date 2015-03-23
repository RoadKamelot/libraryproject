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

function _findMatchingUsernameAndPassword(username_input, password_input, callback) {
	pool.getConnection(function(err, connection) {
		checkSQLConnection(err, connection);
	    connection.query('select username, pw from useraccount', function(err, dbResult) {
	        connection.release();
	        if (err) {
	            return err;
	        } else {
	            var result = _und.find(dbResult, function(row) {
	                return row.username == username_input && row.pw == password_input;
	            });
                callback(result);
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
	findMatchingUsernameAndPassword : _findMatchingUsernameAndPassword
};