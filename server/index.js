const express = require("express");
const bp = require("body-parser");
const ml = require("./regression.js");
const knex = require("knex")
const config = require("../knexfile")[process.env.NODE_ENV || "development"]
const SupermarketService = require("./SupermarketService.js");

const app = express();
app.use(bp.json({limit: '50mb', extended: true}))
app.use(bp.urlencoded({limit: '50mb', extended: true }))
app.use(express.static("./public"));

//const database = knex(config)

//test thing
app.get("/test", (req, res) => {
  res.send("no")
});
app.post("/pred", (req, res) => {
  //sends the weights and biases for the model
  var data = req.body.data;
  var model = ml.gradDescent(data.X, data.y)
  res.send(model)
});

app.listen(3000, () => {
  console.log('server started');
});

app.get("/store_name", async (req, res, next) => {
  var data = req.body.data;
  console.log(data);
  await SupermarketService.saveStoresData(data);
  var weeklyAvg = res.json(await SupermarketService.getWeeklyAverageAllProducts());
  var totalProd = res.json(await SupermarketService.getWeeklyTotalAllProducts());
  res.send({weeklyAvg, totalProd});
})

