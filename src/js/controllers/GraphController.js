import Nodo from '../models/Nodo';

export default class GraphController {
  constructor($scope, nodoFact) {
    this.$scope = $scope;
    this.nodoFact = nodoFact;
    this.model = {};
    this.nodes = nodoFact.nodos;
    this.lastId = parseInt(this.nodes.slice(-1)[0].id);
    this.link;
    this.node;
  }

  addNode() {
    this.lastId++
    let id = this.lastId;
    let newNodo = new Nodo(id, "Nodo " + id);
    this.nodes.push(newNodo);
  }

  removeNode(node) {
    this.nodes = this.nodes.filter(x => x.id !== node.id);
    console.log('removeNode', node);
  }

  addLink(source, target) {
    console.log('addLink',source, target);
    source.addNeighbor(target.id, 1);
  }

  removeLink(link) {
      console.log('removeLink', link);
  }

  updateSelectNode(node) {
      // console.log('selectNode', node);
      this.node = node;
  }

  updateSelectLink(link) {
      // console.log('selectLink', link);
      this.link = link;
  }

  exibirInformativo() {
    return this.link || this.node;
  }

  onSelectLink() {
    return this.selected_node || this.selected_link;
  }

  getNodo(id) {
      return this.nodoFact.nodes.filter(x => x.Id == id)[0];
  }

  getNeighbornodes() {
      if (this.model.NodoId) {
          var nodo = this.nodes.filter(x => x.Id == this.model.NodoId)[0];
          var blockIds = nodo.neighbors.map(x => x.nodo.id);
          blockIds.push(nodo.id);
          return this.nodes.filter(x => blockIds.indexOf(x.id) === -1);
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
