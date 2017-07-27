var express = require('express');
var fs = require('fs');
var cookieParser = require('cookie-parser')

var app = express();
var keyPublishable = process.env.PUBLISHABLE_KEY;
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var flowController = require('./controllers/flowController.js')
var paymentController = require('./controllers/paymentController.js')
var basketController = require('./controllers/basketController.js')
var ownerController = require('./controllers/ownerController.js')

app.set("view engine", "pug");
app.set('port', (process.env.PORT || 5000));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
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

app.get("/service", (req, res) => {
  res.render("service.pug", {keyPublishable});
});

app.get("/payment", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  paymentController.paymentBuilder(req, keyPublishable, callback);
})

app.post("/paymentResult", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.body.stripeEmail && req.query.cost && req.query.shirtArray){
    paymentController.makePayment(req, res);
  } else {
    res.send(req.query)
  }
})

app.get("/basket", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.shirtObject){
    var shirtObject = JSON.parse(req.query.shirtObject)
    basketController.buildBasket(res, req, shirtObject, callback);
  } else {
    basketController.buildBasket(res, req, null, callback);    
  }
})

app.get("/confirmation", (req, res) => {
  var callback = function(data, err){
    res.render("confirmation.pug", data);
  }
  if(req.query.shirtObject){
    flowController.confirmation(req, callback);
  }
})

app.get("/userOrders", (req, res) => {
  var callback = function(err, template, data){
    res.render(template, {data: data});
  }
  ownerController.getAll(callback);    
})

app.get("/updateStatus", (req, res) => {
  ownerController.updateOrder(req, res);    
})

app.get("/statusesForOrderNo", (req, res) => {
  var callback = function(err, template, data){
    res.render(template, {data: data});
  }
  ownerController.statusesForOrderNo(req.query.orderNumber, callback);    
})

app.get("/deleteShirtFromBasket", (req, res) => {
  var callback = function(template, data){
    res.render(template, data);
  }
  if(req.query.timestamp){
    basketController.deleteCookie(res, req, req.query.timestamp, callback);
  }
})

app.get("/style", (req, res) => {
  var callback = function(template, data, err){
    res.render(template, data);
  }
  if(req.query.deliveryType){
    flowController.selectTemplate("style.pug", req, callback);
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
    } else if(req.query.printingType == "custom" && req.query.club && req.query.strip && req.query.name && req.query.number) {
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