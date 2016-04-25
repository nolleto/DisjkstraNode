export default class HomeController {
  constructor($http, $scope, $sce, nodoFact) {
    this.$http = $http;
    this.$scope = $scope;
    this.$sce = $sce;
    this.nodoFact = nodoFact;
    this.nodos = [];
  }

  calculate() {
    var self = this;
    var n = this.formatNodo();

    this.$http.post('/Execute', { nodos: n }, {}).then(function successCallback(response) {
        self.nodos = response.data;

    }, function errorCallback(response) {
        console.log('error', response);
    });
  }

  formatNodo() {
    return [];
  }

  generatePopover(nodo, distance) {
    if (nodo.Id == distance.IdTarget) return 'Nodo de origem';
    else if (distance.Traveleds.length == 0) return 'Chegou de primeira';
    var list = distance.Traveleds.map((id, index) => {
        var name = this.nodos.filter(x => x.Id == id)[0].Name;
        if (index == 0) return name;
        else return ` -> ${name}`;
    });
    return list.join('');
  }
}
