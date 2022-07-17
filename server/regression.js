//hyperparameters machine learning model
var Xsize = 3;//# input params
var alpha = 0.01;//learning rate
var lambda = 10;//regularization term
var steps = 1500;//gradient steps

//linear/polynomial model
function hypothesis(weights, bias) {
  return (x) => {
    var tot = bias;
    for (var i = 0; i < weights.length; i++) {
      tot += x[i] * weights[i]
    }
    return tot
  };
}

//error squared cost function (not really necessary)
function cost(X, y, weights, bias) {
  var J = 0;
  var model = hypothesis(weights, bias);
  for (var i = 0; i < X.length; i++) {
    J += ((model(X[i]) - y[i])**2)/X.length;
  }
  //regularization term
  for (var j = 0; j < weights.length; j++) {
    J += lambda * (weights[j]**2)/X.length
  }
  return J;
}

//derivative
function costPrime(X, y, weights, bias) {
  var dJdW = [];
  var model = hypothesis(weights, bias);
  
  for (var j = 0; j < weights.length; j ++) {
    dJdW.push(0)
    for (var i = 0; i < X.length; i++) {
      dJdW[dJdW.length-1] += (model(X[i]) - y[i]) * X[i][j]/X.length;
    }
    //regularization term
    dJdW[dJdW.length-1] += lambda * weights[j]/X.length;
  }
  //bias
  dJdW.push(0)
  for (var i = 0; i < X.length; i++) {
    dJdW[dJdW.length-1] += (model(X[i]) - y[i]);
  }
  dJdW[dJdW.length-1] /= X.length;
  
  return dJdW;
}

//gradient in respect to each weight
function gradDescent(X, y) {
  var learningRate = alpha;
  var weights = [];
  var bias = 0;
  for (var i = 0; i < Xsize; i++) {
    weights.push(0);
  }
  var bias = 0;
  console.log("new training")
  var oldCost = Infinity;
  for (var i = 0; i < steps; i++) {
    //grad descent
    var JPrime = costPrime(X, y, weights, bias);
    for (var j = 0; j < JPrime.length-1; j++) {
      weights[j] -= learningRate * JPrime[j]
    }
    bias -= learningRate * JPrime[JPrime.length - 1]
    //update learning rate
    //console.log("cost: " + cost(X, y, weights, bias))
    if (cost(X, y, weights, bias) > oldCost) {
      learningRate /= 2;
      i -= steps - i;//double # remaining steps
      console.log("runaway ascent, decreasing alpha")
    }
    oldCost = cost(X, y, weights, bias)
  }
  return {weights, bias};
}
/*Sample Script to model y = x1 + x2
var X = [[1,4],[2,3],[3,7],[4,2]];
var y = [5,5,10,6];
var pred = gradDescent(X, y);
console.log(pred([1,2]));*/
module.exports = {gradDescent}