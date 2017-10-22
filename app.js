var express = require('express');
var async = require('async');
var databaseClient = require('./clients/databaseClient.js')

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

var callback = function(error, res, template, data){
  if(error){
    console.log("here error");
    return console.error(error);
  }
  res.render(template, {data: data});
}

var callbackRedirect = function(error, res, redirectRoute){
  if(error){
    return console.error(error);
  }
  res.redirect(redirectRoute);
}

app.get("/", (req, res) => flowController.getThreeScorers(res, "index.pug", callback));
app.get("/payment", (req, res) => paymentController.paymentBuilder(req, res, "payment.pug", callback));
app.get("/webmail", (req, res) => ownerController.sendToWebmail(res));
app.get("/administrationForPremierShirts", (req, res) => ownerController.getScorers(res, "admin.pug", callback));
app.get("/inputScorerDiscounts", (req, res) => ownerController.inputScorers(req, res, "/administrationForPremierShirts", callbackRedirect));
app.get("/clearScorers", (req, res) => ownerController.clearScorers(res, "admin.pug", callback));
app.get("/newPriceForTheShirts", (req, res) => ownerController.updatePrice(req, res, '/administrationForPremierShirts', callbackRedirect));
app.get("/userOrders", (req, res) => ownerController.getAllUserOrders(res, "userUpdates.pug", callback));
app.get("/updateStatus", (req, res) => ownerController.updateOrder(req, res, "/userOrders", callbackRedirect));
app.get("/confirmation", (req, res) => flowController.confirmation(req, res, "confirmation.pug", callback));
app.get("/statusesForOrderNo", (req, res) => ownerController.statusesForOrderNo(req, res, "userUpdates.pug", callback));
app.get("/sendQuoteEmail", (req, res) => ownerController.quoteEmail(req, res, "quote.pug", callback));
app.get("/sendQueryEmail", (req, res) => ownerController.queryEmail(req, res, "contact.pug", callback));
app.get("/deleteShirtFromBasket", (req, res) => basketController.deleteCookie(res, req, "basket.pug", callback));
app.get("/style", (req, res) => flowController.selectTemplate(req, res, "style.pug", callback));
app.get("/contact", (req, res) => flowController.contact(res, "contact.pug", callback));
app.get("/quote", (req, res) => flowController.contact(res, "quote.pug", callback));
app.get("/basket", (req, res) => basketController.buildBasket(req, res, "basket.pug", callback));
app.get("/printingType", (req, res) => flowController.printingType(req, res, "printingType.pug", callback));
app.get("/premOrDifferent", (req, res) => flowController.premOrDifferent(req, res, "premOrDifferent.pug", callback));
app.get("/strip", (req, res) => flowController.strip(req, res, "strip.pug", callback));
app.get("/childOrAdult", (req, res) => flowController.childOrAdult(req, res, "childOrAdult.pug",callback));
app.get("/colour", (req, res) => flowController.colour(req, res, "colour.pug", callback));
app.get("/letter", (req, res) => flowController.letter(req, res, "letter.pug", callback));
app.get("/club", (req, res) => flowController.club(req, res, "club.pug", callback));
app.get("/nameNumber", (req, res) => flowController.nameNumber(req, res, "nameNumber.pug", callback));
app.get("/heroOrCustom", (req, res) => flowController.heroOrCustom(req, res, "hero.pug", callback));
app.get("/sleeves", (req, res) => flowController.sleeves(req, res, "sleeves.pug", callback));
app.post("/paymentResult", (req, res) => paymentController.makePayment(req, res, "paymentResult.pug", callback));

app.get("/scorerDiscounts", (req, res) => {
  var callback = function(err, res, template, data){
    var price;
    async.waterfall([
        function(asyncCallback) {
          databaseClient.getPrice(asyncCallback)
        },
        function(cost, asyncCallback) {
          price = parseFloat(cost[cost.length-1].shirtprice);
          databaseClient.getScorers(asyncCallback)
        }
    ], function (err, data) {
      var clubList = []
      data.forEach(function(obj){
        obj.shirtCost = price-obj.discount;
        obj.club = obj.club.trim();
        obj.kitname = obj.kitname.trim();
        obj.kitnumber = obj.kitnumber.trim();
        if(!clubList.includes(obj.club.trim())){
          clubList.push(obj.club.trim());
        }
      })
      res.render(template, {data: data, clubList: clubList});
    });
  }
  ownerController.getScorers(res, "scorerDiscounts.pug", callback);  
})

app.listen(app.get('port'), function() {
  console.info('Node app is running on port', app.get('port'));
});