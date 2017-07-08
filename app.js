var express = require('express');
var fs = require('fs');
var app = express();
var flowController = require('./controllers/flowController.js')
var paymentController = require('./controllers/paymentController.js')
var pg = require('pg');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "pug");
app.use(require("body-parser").urlencoded({extended: false}));
app.use("/public", express.static(__dirname + '/public'));

app.get("/", (req, res) =>
  res.render("index.pug", {keyPublishable}));

app.get("/dbTest", (req,res) => {
  var conString = "postgres://wjjqnjduyhktca:8ef3e929ad76924d6892432179d558d24dfb798a48f57223f75eef58c66dc2ac@ec2-23-21-96-159.compute-1.amazonaws.com:5432/ddgf1kja4g6fpg";
  var client = new pg.Client({
    user: "wjjqnjduyhktca",
    password: "8ef3e929ad76924d6892432179d558d24dfb798a48f57223f75eef58c66dc2ac",
    database: "ddgf1kja4g6fpg",
    port: 5432,
    host: "ec2-23-21-96-159.compute-1.amazonaws.com",
    ssl: true
  });
  client.connect();
})

app.post("/paymentResult", (req, res) => {
  let amount = 500;
  console.log(req.body.stripeEmail)
  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "GBP",
         customer: customer.id
    }))
  .then(charge => {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'harleyrowland17@gmail.com', // Your email id
            pass: 'Omg_0923' // Your password
        }
    });
    var text = 'Payment made from \n\n Harley';
    var mailOptions = {
      from: 'harleyrowland17@gmail.com', // sender address
      to: req.body.stripeEmail, // list of receivers
      subject: 'Email Example',
      html: fs.readFileSync('emailTemplates/orderProcessed.txt', 'utf8')
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
          res.json({yo: 'error'});
      }else{
          console.log('Message sent: ' + info.response);
          res.json({yo: info.response});
      };
    });
    res.render("paymentResult.pug", {finalCost: req.query.finalCost});
  })
})

app.get("/payment", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType){
    flowController.flow("payment.pug", __dirname, req, callback, keyPublishable);
  }
})


app.get("/", (req, res) => {
  res.render("index.pug");
})

app.get("/style", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType){
    flowController.flow("year.pug", req, callback);
  }
})

app.get("/printingType", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style){
    flowController.flow("printingType.pug", req, callback);
  }
})

app.get("/club", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if((req.query.deliveryType && req.query.style && req.query.printingType == "hero") || (req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "prem")){
    flowController.flow("club.pug", req, callback);
  }
})

app.get("/premOrDifferent", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom"){
    flowController.flow("premOrDifferent.pug", req, callback);
  }
})

app.get("/strip", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType && req.query.club){
    flowController.flow("strip.pug", req, callback);
  }
})

app.get("/colour", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "different"){
    flowController.flow("colour.pug", req, callback);
  }
})

app.get("/letter", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "different" && req.query.colour){
    flowController.flow("letter.pug", req, callback);
  }
})

app.get("/nameNumber", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "different" && req.query.colour && req.query.letter){
    flowController.flow("nameNumber.pug", req, callback);
  } else {
    res.send(req.query)
  }
})

app.get("/heroOrCustom", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType && req.query.club && req.query.strip){
    if(req.query.printingType == "hero"){
      flowController.flow("hero.pug", req, callback);
    } else if(req.query.printingType == "custom" && req.query.premOrDifferent) {
      flowController.flow("nameNumber.pug", req, callback);
    } else {
      res.send(req.query);
    }
  } else {
    res.send(req.query)
  }
})

app.get("/sleeves", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType){
    if(req.query.printingType == "hero" && req.query.club && req.query.strip && req.query.playerNumber){
      flowController.flow("sleeves.pug", req, callback);
    } else if(req.query.printingType == "custom" && req.query.premOrDifferent == "prem" && req.query.club && req.query.strip && req.query.name && req.query.number) {
      flowController.flow("sleeves.pug", req, callback);
    } else if(req.query.printingType == "custom" && req.query.premOrDifferent == "different" && req.query.letter && req.query.colour && req.query.name && req.query.number){
      flowController.flow("sleeves.pug", req, callback);
    } else {
      res.send(req.query);
    }
  } else {
    res.send(req.query)
  }
})

app.get("/contact", (req, res) =>
  res.render("contact.pug", {keyPublishable}));

app.get("/faq", (req, res) =>
  res.render("faq.pug", {keyPublishable}));
app.get("/quote", (req, res) =>
  res.render("quote.pug", {keyPublishable}));

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});