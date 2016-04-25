import angular from 'angular';
import 'angular-bootstrap-npm';
import homeCtrl from './controllers/HomeController';
import graphCtrl from './controllers/GraphController';
import nodoFactory from './factories/NodoFactory';
import homeDir from './directives/HomeDirective';
import graphDir from './directives/GraphDirective';
import d3Directive from './directives/D3Directive';

var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('homeCtrl', ['$http', '$scope', '$sce', 'nodoFactory', ($http, $scope, $sce, nodoFactory) => new homeCtrl($http, $scope, $sce, nodoFactory)]);
app.controller('graphCtrl',['$scope', 'nodoFactory', ($scope, nodoFactory) => new graphCtrl($scope, nodoFactory)]);
app.factory('nodoFactory', () => new nodoFactory());
app.directive('home', () => new homeDir());
app.directive('graph', () => new graphDir());
app.directive('d3Graph', ['$window', '$parse', ($window, $parse) => new d3Directive($window, $parse)]);
app.directive('ngIf', function () {
    return {
        link: function (scope, element, attrs) {
            if (scope.$eval(attrs.ngIf)) {
                element.replaceWith(element.children());
            }
            else {
                element.replaceWith(' ');
            }
        }
    };
});
