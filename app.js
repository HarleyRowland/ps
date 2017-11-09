var express = require('express');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const app = express();

var customerController = require('./controllers/customerController.js')
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
app.use("/public", express.static(__dirname + '/public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https')
    if(req.header('host').includes("www")){
      res.redirect("https://" + req.header('host') + req.url);
    } else {
      res.redirect("https://www." + req.header('host') + req.url);
    }
  else
    next()
})

var callback = function(error, res, template, data){
  if(error){
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

// Root
app.get("/", (req, res) => customerController.getThreeScorers(res, "index.pug", callback));

// Shirt Selection Flow
app.get("/scorerDiscounts", (req, res) => customerController.getScorerDiscounts(req, res, "scorerDiscounts.pug", callback));
app.get("/style", (req, res) => customerController.selectTemplate(req, res, "style.pug", callback));
app.get("/childOrAdult", (req, res) => customerController.selectTemplate(req, res, "childOrAdult.pug",callback));
app.get("/printingType", (req, res) => customerController.printingType(req, res, "printingType.pug", callback));
app.get("/premOrDifferent", (req, res) => customerController.selectTemplate(req, res, "premOrDifferent.pug", callback));
app.get("/club", (req, res) => customerController.club(req, res, "club.pug", callback));
app.get("/strip", (req, res) => customerController.strip(req, res, "strip.pug", callback));
app.get("/heroOrCustom", (req, res) => customerController.heroOrCustom(req, res, "hero.pug", callback));
app.get("/nameNumber", (req, res) => customerController.selectTemplate(req, res, "nameNumber.pug", callback));
app.get("/colour", (req, res) => customerController.selectTemplate(req, res, "colour.pug", callback));
app.get("/letter", (req, res) => customerController.selectTemplate(req, res, "letter.pug", callback));
app.get("/sleeves", (req, res) => customerController.sleeves(req, res, "sleeves.pug", callback));
app.get("/confirmation", (req, res) => customerController.confirmation(req, res, "confirmation.pug", callback));

// Payment
app.get("/basket", (req, res) => basketController.buildBasket(req, res, "basket.pug", callback));
app.get("/payment", (req, res) => paymentController.paymentBuilder(req, res, "payment.pug", callback));
app.get("/deleteShirtFromBasket", (req, res) => basketController.deleteCookie(res, req, "basket.pug", callback));

// Contact
app.get("/quote", (req, res) => customerController.selectTemplate(req, res, "quote.pug", callback));
app.get("/contact", (req, res) => customerController.selectTemplate(req, res, "contact.pug", callback));
app.post("/paymentResult", (req, res) => paymentController.makePayment(req, res, "paymentResult.pug", callback));

// Admin
app.get("/webmail", (req, res) => ownerController.sendToWebmail(res));
app.get("/administrationForPremierShirts", (req, res) => ownerController.getScorers(res, "admin.pug", callback));
app.get("/inputScorerDiscounts", (req, res) => ownerController.inputScorers(req, res, "/administrationForPremierShirts", callbackRedirect));
app.get("/clearScorers", (req, res) => ownerController.clearScorers(res, "admin.pug", callback));
app.get("/newPriceForTheShirts", (req, res) => ownerController.updatePrice(req, res, '/administrationForPremierShirts', callbackRedirect));
app.get("/userOrders", (req, res) => ownerController.getAllUserOrders(res, "userUpdates.pug", callback));
app.get("/updateStatus", (req, res) => ownerController.updateOrder(req, res, "/userOrders", callbackRedirect));
app.get("/statusesForOrderNo", (req, res) => ownerController.statusesForOrderNo(req, res, "userUpdates.pug", callback));
app.get("/sendQuoteEmail", (req, res) => ownerController.quoteEmail(req, res, "quote.pug", callback));
app.get("/sendQueryEmail", (req, res) => ownerController.queryEmail(req, res, "contact.pug", callback));

app.get("*", (req, res) => res.send("ERROR"))
app.post("*", (req, res) => res.send("ERROR"))
app.delete("*", (req, res) => res.send("ERROR"))
app.put("*", (req, res) => res.send("ERROR"))


app.listen(app.get('port'), function() {
  console.info('Node app is running on port', app.get('port'));
});