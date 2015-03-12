$(document).ready(function(){
//validate zipcode is only number, phone only number.
 function validate(e){
	// Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1
             // Allow: Ctrl+A
            ||(e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
}
$('#zip').keydown(validate);
$('#phone').keydown(validate);
//interaction for login button in login.html
	$('#login-button').click(function(){
		if($('#userName').val().length == 0 || $('#userPassword').val().length ==0){
			alert('Incorrect username or password');
			return;
		} else {
			var $username = $('#userName').val();
			var $password = $('#userPassword').val();
			// console.log('Input - username is ====' + $username);
			$.ajax({
				headers:{'username':$username, 'password':$password},
				url:'http://localhost:8080/mysql',
				method:'GET',
				contentType:'application/x-www-form-urlencoded; charset=UTF-8',
				dataType:'text',
				processData: false,
				success: function(result){
					console.log(result);
					if(result=='true'){
						alert('Welcome, '+ $username);
						$(location).attr('href','/dashboard.html');
					}
					else
						alert('Invalid username or password.');
					
				}
				
			});
		}
	});
//interaction for register button in signuppage.html
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
//interaction for search buttons in dashboard:
$('#isbn-search-button').click(function(){
	var $input = $('#isbn-text').val();
	if ($input.length ==0){
		alert('What is the ISBN you\'d like to search for?');
		return;
	}
	else {
		//display list of book from mysql here
		alert('Find book in process');
	}
});
$('#author-search-button').click(function(){
	var $input = $('#author-text').val();
	if ($input.length ==0){
		alert('What is the author you\'d like to search for?');
		return;
	}
	else {
		//display list of book from mysql here
		alert('Find book in process');
	}
});

$('#title-search-button').click(function(){
	var $input = $('#title-text').val();
	if ($input.length ==0){
		alert('What is the book title you\'d like to search for?');
		return;
	}
	else {
		//display list of book from mysql here


		alert('Find book in process');
	}
});


});
