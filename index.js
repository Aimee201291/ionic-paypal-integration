
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "xrz6vmkbjbt65sxc",
  publicKey: "pzrg43jh22f5kxgm",
  privateKey: "5ced6f9516ca295700435331c9e34123"
});

app.use(cors());
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({
  extended:true
}));

//  Braintree Paypal Payment
app.get("/brainTreeClientToken", (req, res) => {
  gateway.clientToken.generate({}).then((response) => {
    console.log('Token', response);
    res.send(response);
  });
});


app.post("/checkoutWithPayment", jsonParser, (req, res) => {
  console.log(req.body)
  const nonceFromTheClient = req.body.nonceFromTheClient;
  const payment = req.body.paymentAmount;
  gateway.transaction.sale({
    amount: payment,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }).then((result) => {
      console.log(result);
      res.send(result);    
   });
});
app.listen(3000, () => {
    console.log("Server Started at", process.env.PORT || 3000);
});