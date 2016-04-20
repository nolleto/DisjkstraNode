function Disjkstra() {

  function calcule(nodos, callback) {
    var length = nodos.length;

    nodos = nodos.map(function(nodo) {
      var dist = generateDefaultDistances(nodos);
      var researched = [nodo.Id];
      dist[nodo.Id].value = 0;

      execute(nodos, nodo, dist, researched, 0);
      nodo.Distances = doIt(dist);
      return nodo;
    });

    callback(nodos);
  }

  function doIt(dist) {
    var d = [];
    var temp;
    for (var key in dist) {
      temp = dist[key];
      d.push({
        IdTarget: key,
        Value: temp.value,
        Traveleds: temp.distance
      });
    }
    return d;
  }

  function execute(nodos, nodo, dist, researched, weight) {
    distNeighbors(nodo, dist, weight);
    var newId = lowerDistanceValid(dist, researched);
    dist[newId].distance = getResearched(researched);
    researched.push(newId);

    if (nodos.length > researched.length) {
      var n = nodos.filter(function(item) {
        return item.Id == newId
      })[0];
      execute(nodos, n, dist, researched, dist[newId].value);
    }
  }

  function getResearched(list) {
    var clone = list.slice();
    clone.shift();
    return clone;
  }

  function distNeighbors(nodo, dist, weight) {
    nodo.Neighbors.map(function(neig) {
      var d = neig.Distance + weight;
      if (dist[neig.Id].value > d) {
        dist[neig.Id].value = d;
      }
    });
  }

  function lowerDistanceValid(dist, researched) {
    var id;
    var value = Number.MAX_SAFE_INTEGER;
    for (var key in dist) {
      if (researched.indexOf(key) !== -1) continue;
      if (value > dist[key].value) {
        id = key;
        value = dist[key].value;
      }
    }
    return id;
  }

  function generateDefaultDistances(nodos) {
    var result = {};
    for (var index in nodos) {
      var nodo = nodos[index];
      result[nodo.Id] = {
        value: Number.MAX_SAFE_INTEGER,
        distance: []
      };
    }
    return result;
  }

  return {
    calcule: calcule
  }
}


module.exports = new Disjkstra();
