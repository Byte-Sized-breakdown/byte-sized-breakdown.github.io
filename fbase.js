// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDX0kms6HZKcel43loGXmAQwmRKkvqljv0",
    authDomain: "erisdb-6f4be.firebaseapp.com",
    databaseURL: "https://erisdb-6f4be-default-rtdb.firebaseio.com",
    projectId: "erisdb-6f4be",
    storageBucket: "erisdb-6f4be.appspot.com",
    messagingSenderId: "724347705969",
    appId: "1:724347705969:web:be56f6a9254aef5eea19d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let db = rtdb.getDatabase(app);

// Get Current Channel's Chat Messages
const channelID=0; const userID="guest";
const channelRef = rtdb.ref(db, "/channels/"+channelID+"/");
const messageRef = rtdb.ref(db, "/channels/"+channelID+"/messages/");
rtdb.onValue(messageRef, ss=>{
	renderChats(ss);
});
$(function(){
	$("#submit").click( function(){
		let msg = document.querySelector("#msg").value;
		pushMessage(msg);
	});
});

let renderChats = function(chat){
    chat = JSON.parse(JSON.stringify(chat));
    $("#chatbox").empty();
    /*
	$("#chatbox").append(
		`<div class=msg>${JSON.parse(JSON.stringify(chat)).motd}</div>`
	);
	*/
    console.log(JSON.stringify(chat));
    let ids = Object.keys(chat);
    console.log(JSON.stringify(ids));
    ids.map( id => {
	let msg = chat[id];
	console.log(msg);
	let chatid = JSON.stringify(id);
	let user = msg.user;
	let message = msg.message;
	console.log(user + "," + message);
	$("#chatbox").append(
		`<div id=${chatid} class=chatitem>
		    <div class=userid>${user}</div>
		    <div class=msgtxt>${message}</div>
		</div>`
	);
    });
}

let pushMessage = function(msg){
    let pushObj = JSON.parse('{\"user\": \"guest\", \"message\": \"' + msg + '\"}');
    rtdb.push(messageRef, pushObj);
}
