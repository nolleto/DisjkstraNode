import Neighbor from './Neighbor'

class Nodo {
  constructor(id, name) {
    this.Id = id,
    this.Name = name,
    this.Distances = [];
    this.Neighbors = [];
  }

  addNeighbor(id, distance) {
    var temp = new Neighbor(id, distance);
    this.Neighbors.push(temp);
  }
}

export default Nodo;
