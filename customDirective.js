(function () {
  "use strict";

  angular.module("myApp").directive("idtmysDropDown", idtDropDown);

  /**
   * @class Dropdown
   */
  function idtDropDown() {
    var directive = {
      scope: { filter: "=" },
      restrict: "E",
      controller: "idtmysAddBalanceTypeMetadataMapController",
      link: Link,
      controllerAs: "vm",
      templateUrl: "dropdown.html",
    };

    Controller.$inject = ["$scope"];

    /**
     * The controller function for the drop down directive
     * @param $scope {object} the internal directive scope
     * @memberof Dropdown
     * @namespace
     */
    function Controller($scope) {
      var vm = this;

      vm.filter = $scope.filter;
      vm.selectItem = selectItem;
      vm.removeItem = removeItem;
      vm.display = display;
      vm.removeAllFromMultiSelect = removeAllFromMultiSelect;
      vm.setDefaultNgModel = setDefaultNgModel;
      vm.searchCriteriaChangedForSelect = searchCriteriaChangedForSelect;
      vm.updateDropdownOptions = updateDropdownOptions;

      function searchCriteriaChangedForSelect($select) {
        if (angular.isDefined($select) && angular.isDefined($select.status)) {
          $select.status.searchChanged();
        }
      }

      function updateDropdownOptions($select) {
        if (angular.isDefined($select) && angular.isDefined($select.status)) {
          $select.status.selectHasError(false);
        }

        vm.filter.updateDropdownOptions(vm.filter, $select);
      }

      /**
       * set the default ngModel for the drop down
       * @function
       * @instance
       * @memberof Dropdown.Controller
       */
      function setDefaultNgModel() {
        if (vm.filter.supportsAll) {
          if (vm.filter.isMultiSelect) {
            vm.filter.ngModel = [
              {
                key: "ALL",
                value: "",
              },
            ];
          } else {
            vm.filter.ngModel = {
              key: "ALL",
              value: "ALL",
            };
          }
        }
      }

      /**
       * create the display of the multy select value
       * @param item
       * @returns {*}
       */
      function display(item) {
        if (item.key === "ALL") {
          return item.key;
        }
        return item.value;
      }

      /**
       * update the multi select options with the 'ALL" for when a filter.supportsAll is true
       */
      function removeAllFromMultiSelect() {
        if (vm.filter.isMultiSelect && vm.filter.supportsAll) {
          if (vm.filter.ngModel.length > 1) {
            // if the user selects an item and ALL is selected
            if (vm.filter.ngModel[0].key === "ALL") {
              //remove the all
              vm.filter.ngModel.splice(0, 1);
            }

            // if the user selects ALL when other items are selected
            if (vm.filter.ngModel[vm.filter.ngModel.length - 1].key === "ALL") {
              //remove every thing but the all
              vm.filter.ngModel.splice(0, vm.filter.ngModel.length - 1);
            }
          }
        }
      }

      /**
       * if the filter defines its own selectItem function, call that function
       * otherwise if the drop down is a multi-select, clear the search text entered in the given $select element on the page
       * @param $select {object} The object provided by ui-select to manipulate the drop down
       * @param $model {object} The object provided by ui-select that represents the selected item
       * @function
       * @instance
       * @memberof Dropdown.Controller
       */
      function selectItem($select, $model) {
        if (angular.isDefined($select.status)) {
          $select.status.selectedItemsChanged();
        }

        if (angular.isDefined(vm.filter.selectItem)) {
          vm.filter.selectItem($select, $model);
        }

        if (vm.filter.isMultiSelect) {
          vm.removeAllFromMultiSelect();
        }

        if (angular.isDefined(vm.filter.updateClosedFilterText)) {
          vm.filter.updateClosedFilterText();
        }
      }

      /**
       * if the filter defines its own selectItem function, call that function
       * @param $select {object} the ui-select $select object
       * @param $model {object} The object provided by ui-select that represents the removed item
       * @function
       * @instance
       * @memberof Dropdown.Controller
       */
      function removeItem($select, $model) {
        if (angular.isDefined($select.status)) {
          $select.status.selectedItemsChanged();
        }

        if (angular.isDefined(vm.filter.removeItem)) {
          vm.filter.removeItem($select, $model);
        }

        if (angular.isDefined(vm.filter.updateClosedFilterText)) {
          vm.filter.updateClosedFilterText();
        }
      }
    }

    /**
     * the link function for the drop down directive
     * @param $scope {object} the internal directive scope
     * @param element {object} the HTML element
     * @param attrs {object} the attributes on the HTML element
     * @memberof Dropdown
     * @namespace
     */
    function Link($scope, element, attrs) {
      $scope.$watch("filter", function (newValue, oldValue) {
        console.log($scope.vm);
        // $scope.vm.filter = newValue;

        if ($scope.vm.filter.isMultiSelect) {
          if (
            $scope.vm.filter.ngModel === undefined ||
            $scope.vm.filter.ngModel.length === 0
          ) {
            $scope.vm.setDefaultNgModel();
          }
        }

        // $scope.vm.removeAllFromMultiSelect(); // remove all if necessary on load
      });

      if (angular.isDefined($scope.vm.filter.updateClosedFilterText)) {
        $scope.vm.filter.updateClosedFilterText();
      }
    }

    return directive;
  }
})();
