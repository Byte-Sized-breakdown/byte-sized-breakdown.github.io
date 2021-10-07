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
    <p> Welcome to Eris </p>
    <div id=chat-messages></div>
    <div id=chat-entrybar>
        <input id="chat-message" type="text" />
        <button id=chat-submit>Send Message</button>
    </div>
</div>
`

const renderChats = function(chat){
    chat = JSON.parse(JSON.stringify(chat));
    $("#chat-messages").empty();
    let ids = Object.keys(chat);
    ids.map( id => {
	let msg = chat[id];
	let chatid = JSON.stringify(id); let user = msg.user; let message = msg.message;
	$("#chat-messages").append(
	    `<div id=${chatid} class=chatitem>
		<div class=userid>${user}</div>
		<div class=msgtxt>${message}</div>
	    </div>`
	);
    });
}

