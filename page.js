var db = firebase.firestore();
var timeNow = Date.now();

function checkUser(){
	console.log("Checking User");
	firebase.auth().onAuthStateChanged(function(user) {
	console.log("Checking User 2");	
	  if (user) {
	  console.log("Checking User 3");
	    var user = firebase.auth().currentUser;
	    console.log("Logged in.");
		if(user != null){
	      	var email_id = user.email;
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
			}).catch(function(error) {
			console.log("Error getting document:", error);
			});
	    }

	  }
	  else{
	  	location.href = 'index.html';
	  }
	});
}

function logout(){
  firebase.auth().signOut();
  location.href = 'index.html';
}
