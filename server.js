const http=require("http");
const express=require("express");     //loadin express js 
const { Socket } = require("socket.io");

const app=express();                  //made app and gave expressjs     

const server=http.createServer(app);  //creating server connection for app
const port=process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));   //accessing css ang js files

app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/index.html');
});


//    Socket.io setup

const io= require("socket.io")(server);
var users={};



io.on("connection",(socket)=>{
    socket.on("new-user-joined",(username)=>{
        users[socket.id]=username;                                    //each socketid is assigned with username.
        socket.broadcast.emit('user-connected',username);             //sending user-connected event and username to client
        io.emit("user-list",users);                                   //printing no. of users on connection
    });

    //writing for user disconnection in disconnect
socket.on("disconnect",()=>{
    socket.broadcast.emit('user-disconnected',user=users[socket.id]); //getting socketid of the user who is leaving chat
    delete users[socket.id];                                          //and deleting the socket name
    io.emit("user-list",users);                                       //printing users no. on deletion
});                                                                  //for user disconnection we write  a code on client.js

socket.on('message',(data)=>{
    socket.broadcast.emit("message", {user: data.user,msg: data.msg});
});

});

//   socket.io setup ends

server.listen(port,()=>{
    console.log("server started at "+port);
});
