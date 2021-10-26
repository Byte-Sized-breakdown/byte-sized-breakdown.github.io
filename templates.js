const LoginPageT =
`
<div id="LoginPage">
    <div id=login-wrapper> 
        <div id=login-entry>
	    <input type=text id=login-email placeholder="Email"/>
	    <input type=password id=login-passwd placeholder="Password"/>
	    <button id=login-submit>Login</button>
	</div>
	<div id=register-entry>
	    <input type=text id=register-email placeholder="E-mail" />
	    <input type=text id=register-user placeholder="New Username" />
	    <input type=password id=register-passwd placeholder="Password" />
	    <input type=password id=register-passwd2 placeholder="Confirm Password" />
	    <button id=signup-submit>Sign Up</button>
	</div>
    </div>
</div>
`

const ChatPageT = 
`
<div id="ChatPage">
    <div id=landing-navbar>
	<p id=welcome-banner></p>
	<button id=new-server>New Server</button>
	<button id=new-channel>New Channel</button>
	<button id=session-signout>Log Out</button>
    </div>
    <div id=eris-list>
	<div id=server-list></div>
	<div id=channel-list></div>
    </div>
    <div id=chat-messages></div>
    <div id=server-users></div>
    <div id=chat-entrybar>
        <input id="chat-message" type="text" />
        <button id=chat-submit>Send Message</button>
    </div>
</div>
`
// Chat Item Factory
let makeChatItem = function(id, user, message){
    let chatitem = document.createElement("div");
    let chatitem_msg = document.createElement("div");
    let chatitem_usr = document.createElement("div");
    // Create the User section of the  chat div
    chatitem_usr.setAttribute("id", id + "-userid"); chatitem_usr.setAttribute("class", "userid"); chatitem_usr.append(user);
    // Create the Message section of the chat div
    chatitem_msg.setAttribute("id", id + "-msgtxt"); chatitem_msg.setAttribute("class", "msgtxt"); chatitem_msg.append(message);
    // Combine the two sections back into the chat item div
    chatitem.append(chatitem_usr); chatitem.append(chatitem_msg);
    // Finalize chat div
    chatitem.setAttribute("id", id); chatitem.setAttribute("class", "chatitem");

    return chatitem;
}

/****
 * Rendering functions for the chat page:
 *	renderChats: puts the chat items in the center
 *	renderServers: puts the server list on the top left
 *	renderChannels: puts the channel list of the given server on the bottom left
 *	renderServerUsers: puts the list of members and their roles on the right
 */
const renderChats = function(chat){
    document.querySelector("#chat-messages").innerHTML = "";
    chat = JSON.parse(JSON.stringify(chat));
    let ids = Object.keys(chat);
    ids.map( id => {
	let msg = chat[id];
	let user = msg.user; let message = msg.message;
	document.querySelector("#chat-messages").append( makeChatItem(id, user, message));
    });
}

const renderChannels = function(channels){
    document.querySelector("#channel-list").innerHTML = "";
    channels = JSON.parse(JSON.stringify(channels));
    let ids = Object.keys(channels);
    ids.map( id => {
	let name = channels[id].name;
	channeldiv = document.createElement("div");
	channeldiv.setAttribute("id", "chan"+id);
	channeldiv.setAttribute("class", "channelitem");
	channeldiv.append("#"+name);
	//channeldiv.addEventListener("click", changeChannel(id));
	document.querySelector("#channel-list").append(channeldiv);
    });
}

const renderServers = function(servers){
    document.querySelector("#server-list").innerHTML = "";
    servers = JSON.parse(JSON.stringify(servers));
    let ids = Object.keys(servers);
    ids.map( id => {
	let name = servers[id];
	serverdiv = document.createElement("div");
	serverdiv.setAttribute("id", "serv"+id);
	serverdiv.setAttribute("class", "serveritem");
	serverdiv.append(name);
	//serverdiv.addEventListener("click", changeServer(id));
	document.querySelector("#server-list").append(serverdiv);
    });
    //console.log(JSON.stringify(servers));
}

const renderServerUsers = function(users) {
    document.querySelector("#server-users").innerHTML = "";
    users = JSON.parse(JSON.stringify(users));
    let ids = Object.keys(users);
    ids.map(id => {
	let username = users[id];
	userdiv = document.createElement("div");
	userdiv.setAttribute("id", `user-${id}`);
	userdiv.innerText = username;
	document.querySelector("#server-users").append(userdiv);
    });
}

/****
 * Class for holding the current session data
 */
class ErisSession{
    serverID; channelID; userID; 
    channelRef; messageRef; membersRef; usermapRef; serverRef;
    constructor(serverID, channelID, userID){
	this.serverID = serverID;
	this.channelID = channelID;
	this.userID = userID;
    }
}

/****
 * Error handlers for various operations
 */
let errChannel = function(err){
    alert("You are not allowed to add new channels to this server. Ask an admin to add a server for you");
    console.log(err.code);
    console.log(err.message);
}

let errServer = function(err){

    alert(`There was the following error 
	    when adding/changing the server:\n
	    ${err.code}\n${err.message}`);
    console.log(err.code);
    console.log(err.message);
}
