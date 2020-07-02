var db = firebase.firestore();
var timeNow = Date.now();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var user = firebase.auth().currentUser;

	if(user != null){
      	var email_id = user.email;
      	document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
        document.getElementById("user_div").style.display = "block";
    	document.getElementById("login_div").style.display = "none";

      	var docRef = db.collection("UserLogin").doc(email_id);
      	docRef.get().then(function(doc) {	
	    if (doc.exists) {
	    	//Check whether more than 24 hours.
	    	var timeDifference = 1;
	 		timeDifference = Date.now() - doc.data().loginTime;
	 		if(timeDifference >= 86400){
	 			logout();
	 		}
	    } 
	    else {
	    	var login_time = Date.now();
	      	db.collection("UserLogin").doc(email_id).set({
	      	userID: email_id,
		  	loginTime: login_time,
		  	loginOnce : 1
	      	})
	      	.then(function() {
	          	console.log("Logged in.");
	      	})
	      	.catch(function(error) {
	          	console.error("Error writing document: ", error);
	      	});
	    }
		}).catch(function(error) {
		console.log("Error getting document:", error);
		});

    }

  }
  else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";

  }
});

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  var docRef = db.collection("UserLogin").doc(userEmail);
  var timeDifference = 1;
  var loginBefore = 0;
	//Check user signed before or not.
	docRef.get().then(function(doc) {
	    if (doc.exists) {
	        console.log(doc.data().loginTime)
	        //Check user login more than 24 hours.
			timeDifference = timeNow - doc.data().loginTime;
			loginBefore = doc.data().loginOnce;
			console.log("timeDifference: ", timeDifference);
			console.log("loginBefore: ", loginBefore);
			if(timeDifference >= 86400  || loginBefore == 1){
				console.log("Login more than 24 hours or login before.")	
			}
			else{
				firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				window.alert("Error : " + errorMessage);
				});
			}
	    } 
	    else {
	        //No login record found
	        console.log("No login record found");
	        firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			window.alert("Error : " + errorMessage);

			// ...
			});
	    }
	}).catch(function(error) {
	console.log("Error getting document:", error);
	});
}

function logout(){
  firebase.auth().signOut();
}
