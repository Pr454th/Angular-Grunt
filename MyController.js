angular.module("myApp").controller("MyController", [
  "$scope",
  "MyService",
  function ($scope, MyService) {
    $scope.message = MyService.getMessage();
  },
]);
