
var timeNow = Date.now();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var user = firebase.auth().currentUser;

	if(user != null){
      	var email_id = user.email;
      	document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
        document.getElementById("user_div").style.display = "block";
    	document.getElementById("login_div").style.display = "none";
    	var db = firebase.firestore();
      	var docRef = db.collection("UserLogin").doc(email_id);
      	docRef.get().then(function(doc) {	
	    if (doc.exists) {
	    	//Check whether more than 24 hours.
	    	console.log("Check Time");
	    	var timeDifference = 1;
	    	timeNow = Date.now();
	 		timeDifference = timeNow - doc.data().loginTime;
	 		console.log("Duration: ", timeDifference);
	 		//Timeout is 15 hours
	 		if(timeDifference >= 54000000){
	 			console.log("Timeout logout");
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
  var db = firebase.firestore();
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  localStorage.setItem("useremail", userEmail);
  localStorage.setItem("userpassword", userPass);
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
			//Timeout is 15 hours
			if(timeDifference >= 54000000  || loginBefore == 1){
				console.log("Login more than 24 hours or login before.")	
			}
			else{
				firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
				  .then(function() {
				    // Existing and future Auth states are now persisted in the current
				    // session only. Closing the window would clear any existing state even
				    // if a user forgets to sign out.
				    // ...
				    // New sign-in will be persisted with session persistence.
				    return firebase.auth().signInWithEmailAndPassword(userEmail, userPass);
				  })
				  .catch(function(error) {
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
	        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
			  .then(function() {
			    // Existing and future Auth states are now persisted in the current
			    // session only. Closing the window would clear any existing state even
			    // if a user forgets to sign out.
			    // ...
			    // New sign-in will be persisted with session persistence.
			    return firebase.auth().signInWithEmailAndPassword(userEmail, userPass);
			  })
			  .catch(function(error) {
			    // Handle Errors here.
			    var errorCode = error.code;
			    var errorMessage = error.message;
			    window.alert("Error : " + errorMessage);
			  });
    	}
	}).catch(function(error) {
	console.log("Error getting document:", error);
	});
}

function logout(){
	localStorage.clear();
  	firebase.auth().signOut();
  	location.href = '/index.html';
}
