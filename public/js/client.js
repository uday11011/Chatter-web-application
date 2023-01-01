const socket=io();

var username;
var chats=document.querySelector(".chats");
var users_list=document.querySelector(".users-list");
var users_count=document.querySelector(".users-count");
var msg_send= document.querySelector("#user-send");
var user_msg=document.querySelector("#user-msg");


do{
    username=prompt("enter your name: ");
}while(!username);

// it will be called when user is joined.
socket.emit("new-user-joined",username); //after this request goes to server  socket.emit used for broadcasting ot others whereas io.emit is used for broadcasting to everyone including the user

// notifies that user has joined
socket.on('user-connected',(socket_name)=>{                         //username will store in socket_name
                                                            

    userJoinLeft(socket_name,'joined');
});


//function to print user joined and left status

function userJoinLeft(name,status){

 let div=document.createElement("div");
 div.classList.add('user-join');
 let content= `<p><b>${name} </b> ${status} the chat </p>`;
 div.innerHTML=content;
 chats.appendChild(div);                                     //in chats class showing this above div 
 chats.scrollTop=chats.scrollHeight;
}

socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left');
});


// for updating users list and users count
socket.on('user-list',(users)=>{
    users_list.innerHTML=" ";     //by giving empty braces we are creating new list everytime
    users_arr=Object.values(users);   //names of the user we are taking
    for(i=0;i<users_arr.length;i++)
    {
        let p=document.createElement('p');    //creating p tag because we deleted everything
        p.innerText=users_arr[i];             //giving username to p tag
        users_list.appendChild(p);            //updating userslist by appending the names to the list 
    }

    users_count.innerHTML=users_arr.length;
});

// for sending messages

msg_send.addEventListener('click',()=>{
    let data={
        user: username,
        msg: user_msg.value
    };

    if(user_msg.value!=''){                      //if msg is not blank
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value=''; 
    }
});

function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content=`
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;   //implementing chat height and scrolling functuonaliy
}

var input = document.querySelector("#user-msg");
input.addEventListener("keypress", (e) => {
    var inputVal = input.value;
    if(e.key === "Enter") {
    let data={
        user: username,
        msg: inputVal
    };

    if(input.value!=''){                      //if msg is not blank
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        input.value=''; 
    }
}
} )


socket.on('message',(data)=>{
    appendMessage(data,'incoming');
});