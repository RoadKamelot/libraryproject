$(document).ready(function(){

	$('#login-button').click(function(){
		if($('#userName').val().length == 0 || $('#userPassword').val().length ==0){
			alert('Incorrect username or password');
			return;
		}
		else {
			$.ajax({
				url:'http://localhost:8080/mysql',
				method:'GET',
				beforeSend:function(xhr){
				xhr.setRequestHeader('user-input', $('#userName').val());
				xhr.setRequestHeader('password-input', $('#userPassword').val());
		}
		
	}).done(function(success){
		console.log(success);
	});
		//check with mysql for matching username and pw
		alert('you want to log in');
		}
	
	});
 	 	$('#registerButton').click(function(){
 	 		//check if all fields are filled
 	 		if($('#first-name').val().length == 0 || 
 	 			$('#last-name').val().length ==0 ||
 	 			$('#email').val().length==0 || 
 	 			$('#confirm-email').val().length==0 || 
 	 			$('#confirm-email').val().length==0 ||
 	 			$('#username').val().length==0 || 
 	 			$('#password').val().length==0 ||
 	 			$('#confirm-password').val().length==0 || 
 	 			$('#street').val().length==0 ||
 	 			$('#city').val().length==0 || 
 	 			$('#zip').val().length==0){
 	 				alert("Please fill in require field (*)");
 	 			return;
 	 		}
 	 		//check if email matching
 	 		if($('#email').val() != $('#confirm-email').val()){
 	 			alert("Email does not match !");
 	 			return;
 	 		}
 	 		 //check if passwords are matching
	 		if($('#password').val() != $('#confirm-password').val()){
 	 			alert("Password does not match !");
 	 			return;
 	 		}
 	 		//check if username is unique, pass all info to header
 	 		$.ajax({
				url:'http://localhost:8080/mysql',
				method:'GET',
				beforeSend:function(xhr){
				xhr.setRequestHeader('first-name', $('#first-name').val());
				xhr.setRequestHeader('last-name', $('#last-name').val());
				xhr.setRequestHeader('email', $('#email').val());
				xhr.setRequestHeader('confirm-email', $('#confirm-email').val());
				xhr.setRequestHeader('password', $('#password').val());
				xhr.setRequestHeader('confirm-password', $('#confirm-password').val());
				xhr.setRequestHeader('street', $('#street').val());
				xhr.setRequestHeader('city', $('#city').val());
				xhr.setRequestHeader('zip', $('#zip').val());
				xhr.setRequestHeader('state', $('#state').val());
				xhr.setRequestHeader('phone', $('#phone').val());
		}
		
	}).done(function(success){
		console.log(success);
	});
			//check with exist usernames in database:

 	 		//once everything satisfied, insert all info into database and move to dashboard
 		alert( "Welcome to the mini library, where you can find your favorite comic books !" );

 	});
});
