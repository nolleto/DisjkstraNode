export default class GraphDirective {
  constructor() {
    this.restrict = 'E';
    this.templateUrl = '/html/directives/graph.html';
  }

  static instance() {
      return new GraphDirective();
  }

  link(scope, elements, attrs) {
      //your code
  }
}
