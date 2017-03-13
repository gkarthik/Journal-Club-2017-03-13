function _doSimulationStep (network, seedNode) {
  var currentSystemTemperature = 1000;
  var freezingTemperature = 0;
  var coolingFactor = 1;
  var oldState = seedNode;
  var newState = null;
  var diff = 0;
  var _name, el;
  var _interval = setInterval(function(){
    newState = generateNeighbor(oldState, currentSystemTemperature);
    newState = acceptNeighbor(newState, oldState, currentSystemTemperature);
    currentSystemTemperature = currentSystemTemperature - coolingFactor;
    updateDiv(network, currentSystemTemperature);
    _name = newState.name;
    newState.heat += 1;
    oldState = newState;
    el = document.getElementById("sa_node_"+_name.toLowerCase());
    el.style.border = "3px solid red";
    console.log(_name);
    if(currentSystemTemperature <= freezingTemperature) {
      clearInterval(_interval);
    }
  }, 20);
}

function generateNeighbor(_n){
  var i = Math.round(Math.random() * (_n.neighbors.length - 1));
  return _n.neighbors[i];
}

function acceptNeighbor(_new, _old, t){
  var diff = _new.energy - _old.energy;
  var e = Math.exp(diff/t);
  if(Math.random() <= e ){	// As temp decreases probability of moving reduces.
    return _new;
  }
  return _old;
}

function scaleHeat(h, max, min){
  return ((h-min)/(max-min));
}

function getHeatArray(n){
  var h = [];
  for(var t in n){
    h.push(n[t].heat);    
  }
  return h;
}

function getEnergyArray(n){
  var h = [];
  for(var t in n){
    h.push(n[t].energy);    
  }
  return h;
}

function updateDiv(n, currentSystemTemperature){
  var h = getHeatArray(n);
  var el = null;
  var _name = "";
  var max_h = Math.max.apply(Math, h);
  var min_h = Math.min.apply(Math, h);
  el = document.getElementById("show_temperature");
  el.innerHTML = currentSystemTemperature;
  for(var t in n){
    _name = n[t].name.toLowerCase();
    el = document.getElementById("sa_node_"+_name);
    el.style.background = "hsla(113, 100%, 50%, "+scaleHeat(n[t].heat, max_h, min_h)+")";
    el.style.border = "0px";
  }
}

// Network
/*
        J - I
            |
A - B - E - H
|   |   
C - D   
*/

function NodeObject(_name, energy){
  var _node = {};
  _node.name = _name;
  _node.neighbors = [];
  _node.heat = 0;
  _node.energy = energy;
  return _node;
}

function startSA(){
  var a = NodeObject("A", Math.floor(Math.random() * 1000));
  var b = NodeObject("B", Math.floor(Math.random() * 1000));
  var c = NodeObject("C", Math.floor(Math.random() * 1000));
  var d = NodeObject("D", Math.floor(Math.random() * 1000));
  var e = NodeObject("E", Math.floor(Math.random() * 1000));
  var h = NodeObject("H", Math.floor(Math.random() * 1000));
  var i = NodeObject("I", Math.floor(Math.random() * 1000));
  var j = NodeObject("J", Math.floor(Math.random() * 1000));
  var _nodes = [a, b, c, d, e, h, i, j];
  a.neighbors = [b, c];
  b.neighbors = [a, d, e];
  c.neighbors = [a, d];
  d.neighbors = [b, c];
  e.neighbors = [h, b];
  h.neighbors = [e, i];
  i.neighbors = [h, j];
  j.neighbors = [i];
  console.log(_nodes);
  var el, n = _nodes, _name = "";
  for(var t in n){
    _name = n[t].name.toLowerCase();
    el = document.getElementById("sa_node_"+_name);
    el.innerHTML = _name.toUpperCase() + "<br>" +n[t].energy;
  }
  setTimeout(function(){
      _doSimulationStep(_nodes, h);
  }, 3000);
}
