

process.on("unhandledRejection", function (reason, promise) {
    console.error("Unhandled rejection", { reason: reason, promise: promise });
  });
  
process.on("uncaughtException", err => {
    console.error("There was an uncaught error", err);
    process.exit(1); //mandatory (as per the Node docs)
});
  
const trim = (string, max) => {
    if (string.length <= max) return string;
    return `${string.slice(0, max - 3)}...`;
}

const fetch = require("node-fetch");
const pawn = require("pawntakespawn");
const client = new pawn();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`We are inbound. PORT ${PORT}`);
  
});

app.get("*", (req, res) => {
    res.status(200).send("200 - OK");
});

client.events.on("eeUpdate", async (result, before, timestamp) => {
const message = trim(`${client.dir()} have just been updated at ${new Date(timestamp).toUTCString()}. Check them out!`, 2000);
    await fetch(process.env.WEBHOOK_URL, 
    {
        "method":"post",
        "body":JSON.stringify({content: message}),
        "headers":{"Content-Type":"application/json"}
    }).catch((e) => {
        console.error(e);
    })
    console.log(message);
})

client.events.on("error", async (error) => {
console.error(error);
})

