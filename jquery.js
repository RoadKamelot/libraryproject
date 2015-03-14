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
$('#isbn-text').keydown(validate);

$('#logout').click(function(){
	$(location).attr('href','/login.html');
});
/*==================interaction for LOGIN button in login.html====================================*/
	$('#login-button').click(function(){
		if($('#userName').val().length == 0 || $('#userPassword').val().length ==0){
			alert('Incorrect username or password');
			return;
		} else {
			var	$username = $('#userName').val();
			var $password = $('#userPassword').val();
			// console.log('Input - username is ====' + $username);
			$.ajax({
				headers:{'username':$username, 'password':$password},
				url:'http://localhost:8080/login-validate',
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

/*==================interaction for REGISTER button in login.html====================================*/
$('#registerButton').click(function(){
	console.log("in here");
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
	var userData = {
		'firstName': $('#first-name').val(),
		'lastName': $('#last-name').val(),
		'email': $('#email').val(),
		'confirmEmail': $('#confirm-email').val(),
		'username': $('#username').val(),
		'password': $('#password').val(),
		'confirmPassword': $('#confirm-password').val(),
		'street': $('#street').val(),
		'city': $('#city').val(),
		'zip':$('#zip').val(),
		'phone': $('#phone').val()
	};
	$.ajax({
	    url : "http://localhost:8080/register",
	    type: "POST",
	    data : userData,
	    dataType:'text',
	    contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
	    // processData: false,
	    success: function(data, textStatus, jqXHR)
	    {
	        console.log(data);
	        if(data=='User successfully registered!'){
	        	//once everything satisfied, insert all info into database and move to dashboard
		 		alert( "Welcome to the mini library, where you can find your favorite comic books !" );
		 		$(location).attr('href','/dashboard.html');
	        } else{
	        	alert(data);
	        	alert("Username or email already exist. Please choose a different username or email address.");
	        	return;
	        }
	    },
	    error: function (jqXHR, textStatus, errorThrown)
	    {
	 		console.log('errorThrown: ' + errorThrown);
	    }
	});
});

/********************************************************interaction for ISBN search buttons in dashboard:***/
$('#isbn-search-button').click(function(){
	var $input = $('#isbn-text').val();
	if ($input.length ==0){
		alert('What is the ISBN you\'d like to search for?');
		return;
	} else {
		//display list of book from mysql here
		var $isbn = $('#isbn-text').val();
		$.ajax({
			headers:{'isbn':$isbn},
			url:'http://localhost:8080/isbn-search',
			method:'GET',
			contentType:'application/x-www-form-urlencoded; charset=UTF-8',
			dataType:'text',
			processData: false,
			success: function(result){
				console.log(result);
				if(result != 'false'){
					//alert('books of search result will be displayed: ');
					$('#searchbox').empty();
					$('#searchbox').append(result);
					
				} else {
					$('#searchbox').empty();
					alert('Book not found.');
					return;
				}		
			}
		});
	}
});
/********************************************************interaction for AUTHOR search buttons in dashboard:***/

$('#author-search-button').click(function(){
	var $input = $('#author-text').val();
	if ($input.length ==0){
		alert('What is the author you\'d like to search for?');
		return;
	}
	else {
		//display list of book from mysql here
		var $author = $('#author-text').val();
		$.ajax({
			headers:{'author':$author},
			url:'http://localhost:8080/author-search',
			method:'GET',
			contentType:'application/x-www-form-urlencoded; charset=UTF-8',
			dataType:'text',
			processData: false,
			success: function(result){
				console.log(result);
				if(result != 'false'){
					//alert('books of search result will be displayed: ');
					$('#searchbox').empty();
					$('#searchbox').append(result);
					
				} else {
					$('#searchbox').empty();
					alert('Book not found.');
					return;
				}		
			}
		});
	}
});
/********************************************************interaction for TITLE search buttons in dashboard:***/
$('#title-search-button').click(function(){
	var $input = $('#title-text').val();
	if ($input.length ==0){
		alert('What is the book title you\'d like to search for?');
		return;
	}
	else {
		//display list of book from mysql here
		var $title = $('#title-text').val();
		$.ajax({
				headers:{'title':$title},
				url:'http://localhost:8080/title-search',
				method:'GET',
				contentType:'application/x-www-form-urlencoded; charset=UTF-8',
				dataType:'text',
				processData: false,
				success: function(result){
					console.log(result);
					if(result != 'false'){
						//alert('books of search result will be displayed: ');
						$('#searchbox').empty();
						$('#searchbox').append(result);
						
					} else {
						$('#searchbox').empty();
						alert('Book not found.');
						return;
					}
						
				}
				
			});
	}
});

/*********************************** MY RECORD link ************************/
// $('#record').click(function(){
// 	//display list of book from mysql here
// 		//need username to search for record in userbook
// 	console.log('Test for: '+$username);
// 	$.ajax({
// 		headers:{'username':$username},
// 		url:'http://localhost:8080/record',
// 		method:'GET',
// 		contentType:'application/x-www-form-urlencoded; charset=UTF-8',
// 		dataType:'text',
// 		processData: false,
// 		success: function(result){
// 			console.log(result);
// 			if(result != 'false'){
// 				alert('Showing books');
// 				//alert('books of search result will be displayed: ');
// 				// $('#searchbox').empty();
// 				// $('#searchbox').append(result);
				
// 			} else {
// 				// $('#searchbox').empty();
// 				alert('No result for');
// 				return;
// 			}	
// 		}
// 	});

// });
/********************************************DC LIST *****************************************/
$('#dclist').click(function(){
	
		//display list of book from mysql here
		var $category = 'DC Comics';
		$.ajax({
				headers:{'category':$category},
				url:'http://localhost:8080/dc',
				method:'GET',
				contentType:'application/x-www-form-urlencoded; charset=UTF-8',
				dataType:'text',
				processData: false,
				success: function(result){
					console.log(result);
					if(result != 'false'){
						//alert('books of search result will be displayed: ');
						$('#searchbox').empty();
						$('#searchbox').append(result);
						
					} else {
						$('#searchbox').empty();
						alert('No book found in DC Comics');
						return;
					}
						
				}
				
			});
	
});
/********************************************NARVEL LIST **************************************/
$('#marvellist').click(function(){
	
		//display list of book from mysql here
		var $category = 'Marvel Comics';
		$.ajax({
				headers:{'category':$category},
				url:'http://localhost:8080/marvel',
				method:'GET',
				contentType:'application/x-www-form-urlencoded; charset=UTF-8',
				dataType:'text',
				processData: false,
				success: function(result){
					console.log(result);
					if(result != 'false'){
						//alert('books of search result will be displayed: ');
						$('#searchbox').empty();
						$('#searchbox').append(result);
						
					} else {
						$('#searchbox').empty();
						alert('No book found in '+$category);
						return;
					}
						
				}
				
			});
	
});
/****************************************************MANgA********************************************/
$('#mangalist').click(function(){
	
		//display list of book from mysql here
		var $category = 'Manga';
		$.ajax({
				headers:{'category':$category},
				url:'http://localhost:8080/manga',
				method:'GET',
				contentType:'application/x-www-form-urlencoded; charset=UTF-8',
				dataType:'text',
				processData: false,
				success: function(result){
					console.log(result);
					if(result != 'false'){
						//alert('books of search result will be displayed: ');
						$('#searchbox').empty();
						$('#searchbox').append(result);
						
					} else {
						$('#searchbox').empty();
						alert('No book found in '+$category);
						return;
					}
						
				}
				
			});
	
});



});