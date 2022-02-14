const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");

mailchimp.setConfig({
  apiKey: "0ac0501de0c9173ac935b9626da363bf-us20",
  server: "us20",
});

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){
  var firstN = req.body.fName;
  var lastN = req.body.lName;
  var emal = req.body.email;

  console.log(firstN,lastN,emal);
  const listId = "50633a113";
  const subscribingUser = {
    firstName: firstN,
    lastName: lastN,
    email: emal
  };

  async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
      LNAME: subscribingUser.lastName
    }
  });

  console.log(
    `Successfully added contact as an audience member. The contact's id is ${
      response.id
    }.`
  );

  const subscriberHash = md5(emal.toLowerCase());

  async function run1() {
    try {
      const response = await mailchimp.lists.getListMember(
        listId,
        subscriberHash
      );

      res.sendFile(__dirname+"/success.html");
    } catch (e) {
      console.log(e);
      if (e.status === 404) {
        res.sendFile(__dirname+"/failure.html");
      }
    }
  }
  run1();

}

run();

});


app.listen(3000, function(){
  console.log("Server is running on port 3000");
})

//Api key: 0ac0501de0c9173ac935b9626da363bf-us20
//list id:5063f3a113
