export default class GraphDirective {
  restrict = 'E';
  templateUrl = '/html/graph.html'

  static instance() {
      return new Info();
  }

  link(scope, elements, attrs) {
      //your code
  }
}
