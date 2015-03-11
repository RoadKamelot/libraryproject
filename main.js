$(document).ready(function(){

	$('#login-button').click(function(){
	$.ajax({
		url:'http://localhost:8080/mysql',
		method:'GET',
		beforeSend:function(xhr){
			xhr.setRequestHeader('user-input', $('#userName').val());
			xhr.setRequestHeader('password-input', $('#userPassword').val());
		}
		// success:function(data){
		// 	console.log(data + 'in here-----------------');
		// },
		// error:function(err){
		// 	console.log(err);
		// }
	}).done(function(success){
		console.log(success);
	});
		//check with mysql for matching username and pw
		alert('you want to log in');
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
 	});
});
