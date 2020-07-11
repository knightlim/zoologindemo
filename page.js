var db = firebase.firestore();

function checkUser(){
	console.log("Checking User");
  	var userEmail = sessionStorage.getItem("useremail");
  	
	  if (userEmail != null) {
	  	console.log("Checking User");
      	var docRef = db.collection("UserLogin").doc(userEmail);
      	docRef.get().then(function(doc) {	
	    if (doc.exists) {
	    console.log("Check Time.");
	    	//Check whether more than 24 hours.
	    	var timeDifference = 1;
	    	var timeNow = Date.now();
	 		timeDifference = timeNow - doc.data().loginTime;
	 		console.log("Duration: ", timeDifference);
	 		//Timeout is 6 hours
	 		if(timeDifference >= 21600000){
	 			console.log("Timeout logout");
	 			logout();
	 		}
	    }
	    else{
	    	logout();
	    } 
		}).catch(function(error) {
		console.log("Error getting document:", error);
		});
	  }
	  else{
		  	//Not login user redirect to login page
		  	location.href = '/index.html';
	  }
}

function logout(){
	sessionStorage.clear();
  	firebase.auth().signOut();
  	location.href = '/index.html';
}
