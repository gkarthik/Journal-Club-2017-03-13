function _doSimulationStep (network, seedNode) {
  var currentSystemTemperature = 1000;
  var freezingTemperature = 0;
  var coolingFactor = 1;
  var oldState = seedNode;
  var newState = null;
  var _interval = setInterval(function(){
    var newState = generateNeighbor(oldState);    
    acceptNeighbor(newState, oldState);
    oldState = newState;
    currentSystemTemperature = currentSystemTemperature - coolingFactor;
    updateDiv(network, currentSystemTemperature);
    if(currentSystemTemperature <= freezingTemperature) {
      clearInterval(_interval);
    }
  }, 10);
}

function generateNeighbor(_n){
  var i = Math.round(Math.random() * (_n.neighbors.length - 1));
  return _n.neighbors[i];
}

function acceptNeighbor(_new, _old){
  _new.heat += 1;
}

function getHeatArray(n){
  var h = [];
  for(var t in n){
    h.push(n[t].heat);
  }
  return h;
}

function scaleHeat(h, max, min){
  return ((h-min)/(max-min));
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
    el.innerHTML = _name.toUpperCase() + "<br>" +n[t].heat;
    el.style.background = "hsla(113, 100%, 50%, "+scaleHeat(n[t].heat, max_h, min_h)+")";
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

function NodeObject(_name){
  var _node = {};
  _node.name = _name;
  _node.neighbors = [];
  _node.heat = 0;
  return _node;
}

function startSA(){
  var a = NodeObject("A");
  var b = NodeObject("B");
  var c = NodeObject("C");
  var d = NodeObject("D");
  var e = NodeObject("E");
  var h = NodeObject("H");
  var i = NodeObject("I");
  var j = NodeObject("J");
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
  _doSimulationStep(_nodes, h);
}
