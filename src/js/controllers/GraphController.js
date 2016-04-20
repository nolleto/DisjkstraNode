export default class GraphController {
  constructor($scope, nodoFact) {
    this.$scope = $scope;
    this.nodoFact = nodoFact;
    this.model = {};
    this.nodos = nodoFact.nodos;
  }

  getNodo(id) {
      return this.nodoFact.nodos.filter(x => x.Id == id)[0];
  }

  getNeighborNodos() {
      if (this.model.NodoId) {
          var nodo = this.nodos.filter(x => x.Id == this.model.NodoId)[0];
          var blockIds = nodo.Neighbors.map(x => x.Id);
          blockIds.push(nodo.Id);
          return this.nodos.filter(x => blockIds.indexOf(x.Id) === -1);
      }
      return [];
  }

  removeNeighbor(id, n) {
      this.nodoFact.removeNeighbor(id, n);
  }

  addNeighbor() {
      if (this.nodoFact.addNeighbor(this.model.NodoId, this.model.NodoIdNeighbor, this.model.Distance)) {
          this.model = {};
      }
  }
}
