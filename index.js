// Importing packages
const express = require("express");
const bodyParser = require("body-parser");
const Discord = require("webhook-discord");

const webhook = new Discord.Webhook(
  "https://discordapp.com/api/webhooks/724483491449798716/1RRbFpcgUE72FhJNw_TSMO7GFDSKnIusk8NS1B7C-GDAOFD2dFQoCq-fPZL-5eyoGZhY"
);

// Initializing express app
const app = express();

// Setting port
const port = process.env.PORT || 3000;

// Parse the request body
app.use(bodyParser.json());

// Receive HTTP POST requests
app.post("/linear", (req, res) => {
  const payload = req.body;
  console.log(req.body);
  console.log(`Labels: ${req.body.data.labels}`);
  // console.log(`Labels 1: ${req.body.data.labels[0]}`);
  const { action, data, type, createdAt } = payload;

  // Logging data to see how hook formatting should be handled
  console.log(payload);
  console.log(`Payload Action: ${action}`);
  console.log(`Payload Data: ${data}`);
  console.log(`Payload Type: ${type}`);
  console.log(`Payload Created Time: ${createdAt}`);

  console.log("---");
  console.log(payload.url);
  console.log(payload.data.title);
  console.log(payload.data.number);
  console.log(payload.data.priority);
  console.log(payload.data.estimate);
  console.log(action);
  console.log(type);

  if (action == "create" && type == "Issue") {
    console.log("Identified new issue");
    newIssue(payload);
  }

  function newIssue(payload) {
    console.log("---");
    console.log(payload.url);
    console.log(payload.data.title);
    console.log(payload.data.number);
    console.log(payload.data.priority);
    console.log(payload.data.estimate);

    // Defining Discord embed
    const msg = new Discord.MessageBuilder()
      .setName("Linear")
      .setColor("#606CCC")
      .setTitle("New Issue Created")
      .setDescription("There has been a new issue created.")
      .setURL(payload.url)
      .setTime()
      .addField("Title", payload.data.title, true)
      .addField("ID", payload.data.number, true)
      .addField("Priority", priorityValue(payload.data.priority), false)
      .addField("Points", payload.data.estimate, true)
      .setFooter(
        "Linear App",
        "https://pbs.twimg.com/profile_images/1121592030449168385/MF6whgy1_400x400.png"
      );

    // Sending Discord embed
    webhook
      .send(msg)
      .then(() => {
        console.log("Webhook Sent");
      })
      .catch((err) => {
        console.log(`Error sending webhook: ${err}`);
      });
  }

  // Finally, respond with a HTTP 200 to signal all good
  res.sendStatus(200);
});

app.listen(port, () =>
  console.log(`My webhook consumer listening on port ${port}!`)
);

// Job to send webhooks
function priorityValue(priority) {
  switch (priority) {
    case 0:
      return "None";
    case 1:
      return "Urgent";
    case 2:
      return "High";
    case 3:
      return "Medium";
    case 4:
      return "Low";
  }
}

// Event I want handled
// - Archive issue
// - Create issue
// - Edited issue
// - Create project
// - Edit project
// - Archive project
