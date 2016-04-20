export default class HomeDirective {
  restrict = 'E';
  templateUrl = '/html/home.html'

  static instance() {
      return new Info();
  }

  link(scope, elements, attrs) {
      //your code
  }
}
