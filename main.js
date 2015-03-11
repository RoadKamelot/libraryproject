$(document).ready(function(){
	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host:'KonNguyen',
		user:'root',
		password:'password'
	});

	connection.connect();

	connection.query('select * from bookauthor', function(err, rows, fields){

		if(err) 
			 console.log(err);
		
		console.log('connect successfully');
	});

 	 	$('#registerButton').click(function(){
 	 		//check if all fields are filled
 	 		//check if emails are matching
 	 		//check if passwords are matching
 	 		//check if phone numher == 10 digits.
 	 		//check if username is unique
 	 		//check if zipcode == 5 digits

 	 		//once everything satisfied, save all info into database and move to dashboard
 		alert( "you just registered." );
 		window.location.href='dashboard.html';
 	});
 	 	connection.end();
});
