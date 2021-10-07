// Imports for appinit, rtdb and fbauth
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
// https://firebase.google.com/docs/web/setup#available-libraries
// Eris's Firebase config
const firebaseConfig = {apiKey: "AIzaSyDX0kms6HZKcel43loGXmAQwmRKkvqljv0",authDomain: "erisdb-6f4be.firebaseapp.com",databaseURL: "https://erisdb-6f4be-default-rtdb.firebaseio.com",projectId: "erisdb-6f4be",storageBucket: "erisdb-6f4be.appspot.com",messagingSenderId: "724347705969",appId: "1:724347705969:web:be56f6a9254aef5eea19d0"};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let db = rtdb.getDatabase(app);
const auth = fbauth.getAuth(app);

// Get Current Channel's Chat Messages
let channelID=0; let userID="guest";
let channelRef = rtdb.ref(db, "/channels/"+channelID+"/");
let messageRef = rtdb.ref(db, "/channels/"+channelID+"/messages/");

// Set the callbacks for the page loading
let LoadLoginPage = function(){
    document.querySelector("body").innerHTML = LoginPageT;
    document.querySelector("#login-submit").addEventListener("click", function(){
    //Firebase Auth Login
    let password = document.querySelector("#login-passwd").value;
    let email = document.querySelector("#login-email").value;
    fbauth.signInWithEmailAndPassword(auth, email, password)
        .then( (userCred) => {
	    let user = userCred.user;
	    channelID=0; 
	    rtdb.get( rtdb.ref(db, "/users/"+user.uid) )
		.then( (data) => {
		    userID = data.val();
		})
		.catch( (err) =>{
		    console.log(err.code);
		    console.log(err.message);
		});
	LoadChatPage(channelID);
	})
	.catch( (err) => {
	    console.log(err.code);
	    console.log(err.message);
	});
    });
    document.querySelector("#signup-submit").addEventListener("click", function(){
	// Firebase Auth Register
	if( document.querySelector("#register-passwd").value ==
	    document.querySelector("#register-passwd2").value){
	    let password = document.querySelector("#register-passwd").value;
	    let email = document.querySelector("#register-email").value;
	    fbauth.createUserWithEmailAndPassword(auth, email, password)
		.then( (userCred) => {
		    let user = userCred.user;
		    console.log(userCred);
		    console.log(user);
		    rtdb.set( 
			rtdb.ref(db, "/users/"+user.uid),
			document.querySelector("#register-user").value
		    );
		})
		.catch( (err) => {
		    console.log(err.code);
		    console.log(err.message);
		});
	}
	else{
	    alert("Passwords do not match!!!");
	    document.querySelector("#register-passwd").value = "";
	    document.querySelector("#register-passwd2").value = "";
	}
	//alert("Not functioning yet");
    });
}

let LoadChatPage = function(chatid, user){
    document.querySelector("body").innerHTML = ChatPageT;
    messageRef = rtdb.ref(db, "/channels/"+channelID+"/messages/");
    userID = user.uid;
    rtdb.onValue(messageRef, msgs=>{
	renderChats(msgs);
    });
    document.querySelector("#chat-submit").addEventListener("click", function(){
	let msg = document.querySelector("#chat-message").value;
	pushMessage(msg, userID);
	document.querySelector("#chat-message").value = "";
    });
}

fbauth.onAuthStateChanged(auth, (user) =>{
    if(!!user){
	// User is logged in, go directly to Chat Page
	LoadChatPage(channelID, user);
    }
    else{
	// Send to Login Page
	LoadLoginPage();
    }
});

let pushMessage = function(msg, id){
    let pushObj = JSON.parse('{\"user\": \"' + id + '\", \"message\": \"' + msg + '\"}');
    rtdb.push(messageRef, pushObj);
}
