import Nodo from '../models/Nodo'

class NodoFactory {
    constructor() {
        this.nodos = [];
        this.createNodos();
    }

    createNodos() {
      console.log(this);
        var n0 = new Nodo("0", "Nodo 0");
        var n1 = new Nodo("1", "Nodo 1");
        var n2 = new Nodo("2", "Nodo 2");
        var n3 = new Nodo("3", "Nodo 3");
        var n4 = new Nodo("4", "Nodo 4");
        var n5 = new Nodo("5", "Nodo 5");
        var n6 = new Nodo("6", "Nodo 6");
        var n7 = new Nodo("7", "Nodo 7");
        this.nodos = [n0, n1, n2, n3, n4, n5, n6, n7];

        n0.addNeighbor(n5.Id, 1);
        n0.addNeighbor(n2.Id, 1);
        n1.addNeighbor(n0.Id, 1);
        n2.addNeighbor(n1.Id, 1);
        n2.addNeighbor(n3.Id, 1);
        n3.addNeighbor(n0.Id, 1);
        n4.addNeighbor(n2.Id, 1);
        n5.addNeighbor(n6.Id, 1);
        n5.addNeighbor(n7.Id, 1);
        n6.addNeighbor(n4.Id, 1);
        n7.addNeighbor(n4.Id, 1);
    }

    removeNeighbor(id, n) {
        var nodo = this.nodos.filter(x => x.Id == id)[0];
        nodo.Neighbors = nodo.Neighbors.filter(x => x.Id != n.Id);
    }

    addNeighbor(nodoId, nodoIdNeighbor, distance) {
        var nodo = this.nodos.filter(x => x.Id == nodoId)[0];
        var nodoN = this.nodos.filter(x => x.Id == nodoIdNeighbor)[0];

        if (nodo == null || nodoN == null || distance == undefined || distance <= 0) return false;
        nodo.addNeighbor(nodoN.Id, distance);
        return true;
    }
}

export default NodoFactory;
