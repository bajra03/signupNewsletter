const express = require('express');
const app = new express();
const request = require('request');
const port = 3000;
const https = require('https');

// for use to get the form data from html
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set all static folder that use to html like images, css etc
app.use(express.static("assets"));
  
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function (req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const list_id = "1249750d78";
  const apiKey = "f14e506cdaf3d3e3f13a3d2acd1a69cd-us5";
  const url = `https://us5.api.mailchimp.com/3.0/lists/${list_id}`;

  // store data to mailchip, the key based on mailchimp
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  }

  // options based on mailchimp
  const options = {
    method: "POST",
    auth: "putubajra:f14e506cdaf3d3e3f13a3d2acd1a69cd-us5"
    
  }

  const jsonData = JSON.stringify(data);

  // post data to mailchimp using https request node
  const request = https.request(url, options, function (response) {
    console.log(response.statusCode);
    const statusCode = response.statusCode;

    if (statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.listen(port, function (req, res) {
  console.log('Server is running on port ' + port);
});

// API KEY f14e506cdaf3d3e3f13a3d2acd1a69cd-us5
// mailchimp unique ID/List ID 1249750d78