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
let session = new ErisSession(0, 0, "");

// Set the callbacks for the page loading
let LoadLoginPage = function(){
	document.querySelector("body").innerHTML = LoginPageT;
	document.querySelector("#login-submit").addEventListener("click", function(){
	//Firebase Auth Login
	let password = document.querySelector("#login-passwd").value;
	let email = document.querySelector("#login-email").value;
	fbauth.signInWithEmailAndPassword(auth, email, password)
		.then( (userCred) => {
		session.serverID=0;
		session.channelID=0;
		})
		.catch( (err) => {
		console.log(err.code);
		console.log(err.message);
		});
		console.log(session.userID);
	});
	document.querySelector("#signup-submit").addEventListener("click", function(){
	// Firebase Auth Register
	if(document.querySelector("#register-passwd").value ==
		document.querySelector("#register-passwd2").value){
		let password = document.querySelector("#register-passwd").value;
		let email = document.querySelector("#register-email").value;
		let username = document.querySelector("#register-user").value;
		let updateStr = '{\"displayName\": \"'+ username +'\"}';
		fbauth.createUserWithEmailAndPassword(auth, email, password)
		.then( (userCred) => {
			fbauth.updateProfile(userCred.user, JSON.parse(updateStr) )
			.catch( (err) => {
				console.log(err.code);
				console.log(err.messages);
			});
			session.serverID=0;
			session.channelID=0;
			console.log("updateProfile:");
			console.log(userCred.user);
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

let LoadChatPage = function(){
	// Loads the Chat Page from a template, and adds 
	document.querySelector("body").innerHTML = ChatPageT;
	// Reference setup for messages, channels,  roles, and servers
	session.messageRef = rtdb.ref(db, "/servers/"+session.serverID+"/channels/"+session.channelID+"/messages/");
	session.channelRef = rtdb.ref(db,"/servers/"+session.serverID+"/channels/");
	session.rolesRef = rtdb.ref(db, "/servers/"+session.serverID+"/members/");
	session.serverRef = rtdb.ref(db, "/servers/");
	session.usermapRef = rtdb.ref(db, "/usermap/"+auth.currentUser.uid+"/");
	// Chat list callback
	rtdb.onValue(session.messageRef, msgs => {
	renderChats(msgs);
	});
	// Channel list onlyOnce callback
	rtdb.onValue(session.channelRef, chnls => {
	renderChannels(chnls);
	}, {
		onlyOnce:true
	});
	// User list callback
	rtdb.onValue(session.rolesRef, usrs => {
	renderServerUsers(usrs);
	});
	// Server list callback
	rtdb.onValue(session.usermapRef, srvs => {
	renderServers(srvs);
	})

	// Chat Submit Button Event Handler
	document.querySelector("#chat-submit").addEventListener("click", function(){
	let msg = document.querySelector("#chat-message").value;
	pushMessage(msg, auth.currentUser);
	document.querySelector("#chat-message").value = "";
	});

	// Sign-Out Button Event Handler
	document.querySelector("#session-signout").addEventListener("click", function(){
	fbauth.signOut(auth)
		.then( () => {
		alert("You have successfully logged out.");
		})
		.catch( (err) =>{
		console.log(err.code);
		console.log(err.messages);
		});
	});
}

fbauth.onAuthStateChanged(auth, (user) =>{
	// Load up the params and change nav IDs
	const navParams = new URLSearchParams(window.location.search);
	if(navParams.has("servID")){ session.serverID = navParams.get("servID") }
	if(navParams.has("chatID")){ session.channelID = navParams.get("chatID") }
	if(!!user){
	// User is logged in, go directly to Chat Page
	/*console.log("onAuthChange:");
	console.log(user);*/
	session.userID = user.displayName;
	LoadChatPage();
	}
	else{
	// Send to Login Page
	LoadLoginPage();
	}
});

/**
	* Adds another message to the message list
	*/
let pushMessage = function(msg, user){
	/*console.log("push msg:");
	console.log(user.uid);
	console.log(user.displayName);*/
	let pushObj = JSON.parse(
		`{
		"user":"${user.displayName}",
		"owner":"${user.uid}",
		"message":"${msg}"
			}`
	);
	rtdb.push(session.messageRef, pushObj);
}

let pushServer = function(name, motd, user){
	let servObj = JSON.parse(
	`{
		"name":"${name}",
		"members":{
		"${user.uid}":"${user.displayName}"
		},
		"roles":{
		"owner":"${user.uid}"
		},
		"channels":{
		"0":{
			"name":"general"
		}
		}
	}`
	);
	rtdb.push(session.serverRef, pushObj);
}
