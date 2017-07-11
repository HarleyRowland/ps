var express = require('express');
var fs = require('fs');
var cookieParser = require('cookie-parser')
var pg = require('pg');

var app = express();
var keyPublishable = process.env.PUBLISHABLE_KEY;
var keySecret = process.env.SECRET_KEY;
var stripe = require("stripe")(keySecret);
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var flowController = require('./controllers/flowController.js')
var paymentController = require('./controllers/paymentController.js')
var basketController = require('./controllers/basketController.js')

app.set("view engine", "pug");
app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require("body-parser").urlencoded({extended: false}));
app.use("/public", express.static(__dirname + '/public'));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.render("index.pug", {keyPublishable});
});

app.post("/paymentResult", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.stripeEmail && req.query.cost && req.query.shirtArray && req.query.shirtArray.length > 0){
    paymentController.makePayment(req, callback);
  }
})

app.get("/basket", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.shirtObject){
    var shirtObject = JSON.parse(req.query.shirtObject)
    basketController.buildBasket("basket.pug", res, req, shirtObject, callback);
  }
})

app.get("/style", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType){
    flowController.selectTemplate("year.pug", req, callback);
  }
})

app.get("/printingType", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style){
    flowController.selectTemplate("printingType.pug", req, callback);
  }
})

app.get("/club", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if((req.query.deliveryType && req.query.style && req.query.printingType == "hero") || (req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "prem")){
    flowController.selectTemplate("club.pug", req, callback);
  }
})

app.get("/premOrDifferent", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom"){
    flowController.selectTemplate("premOrDifferent.pug", req, callback);
  }
})

app.get("/strip", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType && req.query.club){
    flowController.selectTemplate("strip.pug", req, callback);
  }
})

app.get("/colour", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "different"){
    flowController.selectTemplate("colour.pug", req, callback);
  }
})

app.get("/letter", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "different" && req.query.colour){
    flowController.selectTemplate("letter.pug", req, callback);
  }
})

app.get("/nameNumber", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType && req.query.style && req.query.printingType == "custom" && req.query.premOrDifferent == "different" && req.query.colour && req.query.letter){
    flowController.selectTemplate("nameNumber.pug", req, callback);
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
      flowController.selectTemplate("hero.pug", req, callback);
    } else if(req.query.printingType == "custom" && req.query.premOrDifferent) {
      flowController.selectTemplate("nameNumber.pug", req, callback);
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
    if(req.query.printingType == "hero" && req.query.club && req.query.strip && req.query.name && req.query.number){
      flowController.selectTemplate("sleeves.pug", req, callback);
    } else if(req.query.printingType == "custom" && req.query.premOrDifferent == "prem" && req.query.club && req.query.strip && req.query.name && req.query.number) {
      flowController.selectTemplate("sleeves.pug", req, callback);
    } else if(req.query.printingType == "custom" && req.query.premOrDifferent == "different" && req.query.letter && req.query.colour && req.query.name && req.query.number){
      flowController.selectTemplate("sleeves.pug", req, callback);
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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});