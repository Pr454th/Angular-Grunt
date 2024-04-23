// myDirective.js
angular.module("myApp").directive("myCustomDirective", function () {
  return {
    restrict: "E", // Restrict to element
    template:
      '<div style="background-color: lightblue; padding: 10px;">This is a custom directive!</div>',
  };
});
