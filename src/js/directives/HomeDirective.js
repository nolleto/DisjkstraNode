export default class HomeDirective {
  constructor() {
    this.restrict = 'E';
    this.templateUrl = '/html/directives/home.html';
  }

  static instance() {
      return new HomeDirective();
  }

  link(scope, elements, attrs) {
      //your code
  }
}
