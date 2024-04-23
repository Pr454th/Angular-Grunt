// app.js
angular.module("myApp", []).controller("MainController", [
  "$scope",
  "myService",
  function ($scope, myService) {
    $scope.message = myService.getMessage();
    console.log($scope.message);
  },
]);
