var express = require('express');
var app = express();
var flowController = require('./controllers/flowController.js')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "pug");
app.use(require("body-parser").urlencoded({extended: false}));
app.use("/public", express.static(__dirname + '/public'));

app.get("/", (req, res) =>
  res.render("index.pug", {keyPublishable}));

app.get("/payment", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType){
    flowController.flow("payment.pug", __dirname, req, callback);
  }
})

app.get("/style", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType){
    flowController.flow("year.pug", __dirname, req, callback);
  }
})

app.get("/printingType", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style){
    flowController.flow("printingType.pug", __dirname, req, callback);
  }
})

app.get("/club", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if((req.query.deliveryType && req.query.style && req.query.printingType == "hero") || (req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "prem")){
    flowController.flow("club.pug", __dirname, req, callback);
  }
})

app.get("/premOrDifferent", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom"){
    flowController.flow("premOrDifferent.pug", __dirname, req, callback);
  }
})

app.get("/strip", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType && req.query.club){
    flowController.flow("strip.pug", __dirname, req, callback);
  }
})

app.get("/colour", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "different"){
    flowController.flow("colour.pug", __dirname, req, callback);
  }
})

app.get("/letter", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "different" && req.query.colour){
    flowController.flow("letter.pug", __dirname, req, callback);
  }
})

app.get("/nameNumber", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "different" && req.query.colour && req.query.letter){
    flowController.flow("nameNumber.pug", __dirname, req, callback);
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
      flowController.flow("hero.pug", __dirname, req, callback);
    } else if(req.query.printingType == "custom" && req.query.premOrDifferent) {
      flowController.flow("nameNumber.pug", __dirname, req, callback);
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
      flowController.flow("sleeves.pug", __dirname, req, callback);
    } else if(req.query.printingType == "custom" && req.query.premOrDifferent == "prem" && req.query.club && req.query.strip && req.query.name && req.query.number) {
      flowController.flow("sleeves.pug", __dirname, req, callback);
    } else if(req.query.printingType == "custom" && req.query.premOrDifferent == "different" && req.query.letter && req.query.colour && req.query.name && req.query.number){
      flowController.flow("sleeves.pug", __dirname, req, callback);
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

app.post("/charge", (req, res) => {
  let amount = 500;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    card: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
      currency: "usd",
      customer: customer.id
    }))
  .catch(err => console.log("Error:", err))
  .then(charge => res.render("charge.pug"));
});


app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});