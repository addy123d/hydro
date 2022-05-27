const express = require("express");
const { client } = require("websocket");
const ejs = require("ejs");
const webSocket = require("ws");
const { response } = require("express");
const port = process.env.PORT || 3000;
const host = '0.0.0.0';

let app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");

app.get("/controls",(request,response)=>{
    response.render("index");
})

let server = app.listen(port, host, () => {
    console.log("Server is running...");
});

let wss = new webSocket.Server({ server: server });

wss.on("connection", (ws) => {
    ws.send(JSON.stringify({
        message: "Connection Opened..."
    }));

    // Receive Commands from client !
    ws.on("message", (commands) => {

        // Goal : We have to receive commands here and send these commands to device and clients connected to these server !

        let parsed_commands = JSON.parse(commands);

        console.log("Commands: ");
        console.log(parsed_commands);
        // console.log(parsed_commands.command);

        // Broadcast that command over all clients !
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === webSocket.OPEN) {
                if(parsed_commands.device === "client"){
                client.send(JSON.stringify({
                    message: "Data Received",
                    solenoid : parsed_commands.solenoid,
                    red :parsed_commands.red,
                    green : parsed_commands.green,
                    blue : parsed_commands.blue,
                    all : parsed_commands.all
                }));
            }else{
                client.send(JSON.stringify({
                    message: "Data Received"
                }));
            }
            }
        });
    })

    // Prompts when client connects to server !
    console.log("Client Connected !");
});