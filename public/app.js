//train/get ML model from server
var modelWeights = [];
var modelBias = 0;
async function getModel(X, y) {
  await fetch('/pred', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {X:X, y:y}
        }) 
      })
        .then((res) => res.json())
        .then((res) => {
          //send the data up!
          modelWeights = res.weights;
          modelBias = res.bias;
          console.log("Done!")
          console.log(res)
          /*var model = hypothesis(res.weights, res.bias)
          for (var i = 0; i < testData.length; i++) {
            console.log(model(testData[i]))
          }*/
        })
}
function hypothesis(weights, bias) {
  return (x) => {
    var tot = bias;
    for (var i = 0; i < weights.length; i++) {
      tot += x[i] * weights[i]
    }
    return tot
  };
}

//UI input/data labelling
var databox = document.getElementsByClassName("data-labelling")[0];
var tableSize = [1,0];
function addWeek() {
  var row = document.createElement("tr");
  var weekLabel = document.createElement("td");
  weekLabel.appendChild(document.createTextNode(`Week ${tableSize[1]+1}`))
  weekLabel.classList.add("week-label");
  row.appendChild(weekLabel)
  for (var i = 0; i < tableSize[0]; i++) {
    var inputWrapper = document.createElement("td");
    var inputBox = document.createElement("input");
    inputWrapper.appendChild(inputBox)
    inputBox.classList.add("item"+i,"week"+tableSize[1],"data-label");
    row.appendChild(inputWrapper)
  }
  databox.appendChild(row)
  tableSize[1] ++;
}
addWeek();
addWeek();

//maybe add support for multiple items at once
function addItem() {
  
}

function getData(item) {
  var X = [];
  var y = [];
  var allSales = document.getElementsByClassName("item"+item);
  for (var i = 0; i < allSales.length; i++) {
    X.push([i, i**2, i**3]);//polynomial reg
    //interpolate missing values
    if (allSales[i].value == "" && i > 0){
      console.log("filling in value")
      allSales[i].value = allSales[i-1].value;
    }
    y.push(parseInt(allSales[i].value));
  }
  return {X, y}
}

//add model to the thing
async function updateChart() {
  var d = getData(0)
  //add points to chart
  setData(myChart, range(0,d.X[d.X.length-1][0]), d.y, 0)
  //add ML prediction to chart
  await getModel(d.X, d.y);
  console.log("model is update")
  var model = hypothesis(modelWeights, modelBias);
  var preds = [];
  for (var i = 0; i < d.X.length; i++) {
    preds.push(model(d.X[i]))
  }
  //extrapolation continuing from highest val
  numPred = 2;//how many weeks forward to extrapolate
  for (var i = d.X[d.X.length-1][0]+1; i < d.X[d.X.length-1][0] + 1 + numPred; i++) {
    preds.push(model([i, i**2, i**3]))
  }
  setData(myChart, range(0,preds.length), preds, 1);
  predictionMsg(d.X.length+1,preds.slice(preds.length-numPred));
}
//write out the prediction
function predictionMsg(week, amount) {
  var ele = document.getElementById("prediction");
  ele.innerText = "";
  for (var i = 0; i < amount.length; i++) {
    ele.innerText += `You are predicted to sell ${Math.max(0,Math.round(amount[i]))} products in week ${week + i}\n`;
  }
}
//sequential array from x to y
function range(start, end) {
  var r = [];
  for (i = start; i < end; i++) {
    r.push(i)
  }
  return r;
}

