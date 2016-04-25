import Neighbor from './Neighbor'

class Nodo {
  constructor(id, name) {
    this.id = id,
    this.name = name,
    this.distances = [];
    this.neighbors = [];
  }

  addNeighbor(id, distance) {
    var temp = new Neighbor(id, distance);
    this.neighbors.push(temp);
  }
}

export default Nodo;
