(function () {
  "use strict";
  var test = angular
    .module("myApp")
    .controller(
      "idtmysAddBalanceTypeMetadataMapController",
      idtAddBalanceTypeMetadataMapController
    );
  idtAddBalanceTypeMetadataMapController.$inject = [
    "$scope",
    "$rootScope",
    "idtmysReportFilterOptionService",
    "idtmysReportFilterService",
  ];
  /**
   * @this idtAddBalanceTypeMetadataMapController
   */
  function idtAddBalanceTypeMetadataMapController(
    $scope,
    $rootScope,
    idtReportFilterOptionService,
    idtReportFilterService
  ) {
    var vm = this;
    vm.limit = -1;
    $scope.error = "false";
    $scope.applyDisable = false;
    console.log(vm);
    setupSourceSystemFilter();
    console.log("idtAddBalanceTypeMetadataMapController");
    vm.productTypeFilter =
      idtReportFilterOptionService.createProductTypeFilter();
    vm.productTypeFilter.updateDropdownOptions = function (filter, $select) {
      var paramList = idtFilterParameterService.getProductTypeParams(
        $select.search,
        vm.sourceSystemFilter.ngModel.key,
        $scope.prodType
      );
      idtReportFilterService.updateDropdownOptionsWithParams(
        filter,
        paramList,
        $select
      );
    };

    $scope.effEndDateOriginal = $scope.effEndDate1;
    $scope.commentsOriginal = $scope.comments;
    $scope.osxindOriginal = $scope.osxind;

    if ($scope.option === "Modify") {
      vm.effStartDate.key = new Date($scope.effStartDate);
      vm.effStartDate.readonly = true;
      vm.effEndDate.key = new Date($scope.effEndDate1);
    }

    function setupSourceSystemFilter() {
      vm.sourceSystemFilter =
        idtReportFilterOptionService.createEriSourceSystem();
      vm.sourceSystemFilter.withoutDate = true;
      vm.sourceSystemFilter.isOptional = false;
      vm.sourceSystemFilter.ngModel = {
        key: $scope.srcSysCode,
        value: $scope.srcSysCode,
      };
      vm.filter = vm.sourceSystemFilter;
      console.log(vm.filter);
      //vm.productTypeFilter.additionalParam = vm.sourceSystemFilter.ngModel.value;
    }
    $scope.resetFields = function () {
      if ($scope.option === "Add") {
        vm.productTypeFilter.ngModel.key = null;
        vm.productTypeFilter.ngModel.value = null;
        vm.sourceSystemFilter.ngModel.key = null;
        vm.sourceSystemFilter.ngModel.value = null;
        $scope.srcBalType = "";
        $scope.derivedBalType = "";
        /* vm.activeStatus.ngModel.key=null;
                vm.activeStatus.ngModel.value=null;*/
        $scope.comments = "";
        $scope.osxind = "";
        vm.effStartDate.key = new Date();
        vm.effEndDate.key = new Date();
      } else {
        $scope.effEndDate = $scope.effEndDate1;
        vm.effEndDate.key = new Date($scope.effEndDate1);
        $scope.comments = angular.copy($scope.commentsOriginal);
        $scope.osxind = angular.copy($scope.osxindOriginal);
      }
    };

    if ($scope.srcSysCode) {
      vm.sourceSystemFilter.ngModel.val = $scope.srcSysCode;
      vm.sourceSystemFilter.isDisabled = true;
    }
    if ($scope.prodType) {
      vm.productTypeFilter.ngModel = {
        key: $scope.prodType,
        value: $scope.prodType,
      };
      vm.productTypeFilter.isDisabled = true;
    }

    if ($scope.srcSysBalType) {
      $scope.srcBalType = $scope.srcSysBalType;
    }

    if ($scope.drvdBalType) {
      $scope.derivedBalType = $scope.drvdBalType;
    }
    if ($scope.comments) {
      $scope.comments = $scope.comments;
    }
    if ($scope.osxind) {
      $scope.osxind = $scope.osxind;
    }
    // if ($scope.recordIndcator === "ACTIVE") {
    //   vm.activeStatus.ngModel.value = "ACTIVE";
    //   vm.activeStatus.ngModel.key = "A";
    // } else {
    //   vm.activeStatus.ngModel.value = "INACTIVE";
    //   vm.activeStatus.ngModel.key = "I";
    // }

    // if (vm.activeStatus.ngModel.value === "ACTIVE") {
    //   vm.activeStatus.ngModel.key = "A";
    // } else {
    //   vm.activeStatus.ngModel.key = "I";
    // }

    $scope.close = function (result) {
      $scope.modalInstance.dismiss("cancel");
    };

    $scope.apply = function () {
      $scope.applyDisable = "true";
      $scope.error = "false";

      var endDate = new Date(vm.effEndDate.key);
      var startDate = new Date(vm.effStartDate.key);
      var currentDate = new Date();
      var sourceSys = vm.sourceSystemFilter.ngModel.value;
      var prodType = vm.productTypeFilter.ngModel;
      if (endDate <= currentDate) {
        $scope.applyDisable = false;
        $scope.error = "true";
        $scope.message = "End Date Should be Future Date";
        return "End Date Should be Future Date";
      } else if (endDate <= startDate) {
        $scope.applyDisable = false;
        $scope.error = "true";
        $scope.message = "End Date Should be Greater Than Start Date";
        return "End Date Should be Future Date";
      } else if (
        sourceSys === null ||
        sourceSys === undefined ||
        sourceSys === ""
      ) {
        $scope.applyDisable = false;
        $scope.error = "true";
        $scope.message = "Source System Code Should not be blank";
        return "Source System should not be Blank";
      } else if (!$scope.srcBalType) {
        $scope.applyDisable = false;
        $scope.error = "true";
        $scope.message = "Source System Balance Type Should not be blank";
        return "Source System should not be Blank";
      } else if (!$scope.derivedBalType) {
        $scope.applyDisable = false;
        $scope.error = "true";
        $scope.message = "Derived Balance Type Should not be blank";
        return "Derived Balance Type should not be Blank";
      } else if (
        prodType === null ||
        prodType === undefined ||
        prodType === ""
      ) {
        $scope.applyDisable = false;
        $scope.error = "true";
        $scope.message = "Product Type Should not be blank";
        return "Product Type should not be Blank";
      } else if (
        // vm.activeStatus.ngModel.value === null ||
        // vm.activeStatus.ngModel.value === undefined ||
        // vm.activeStatus.ngModel.value === ""
        true
      ) {
        $scope.applyDisable = false;
        $scope.error = "true";
        $scope.message = "Active Status Should not be blank";
        return "Active Status should not be Blank";
      } else {
        $scope.applyDisable = "true";
        $scope.error = "false";
        var postData = {
          queryParams: [
            {
              dataFormat: "string",
              paramDataType: "string",
              paramName: "BK_STRT_VAL_DT",
              paramOrder: 1,
              paramValue: moment(vm.effStartDate.key).format("DD-MM-YYYY"),
            },
            {
              dataFormat: "string",
              paramDataType: "string",
              paramName: "BK_END_VAL_DT",
              paramOrder: 2,
              paramValue: moment(vm.effEndDate.key).format("DD-MM-YYYY"),
            },
            {
              dataFormat: "string",
              paramDataType: "string",
              paramName: "BK_SRC_SYS_CD",
              paramOrder: 3,
              paramValue: vm.sourceSystemFilter.ngModel.value,
            },
            {
              dataFormat: "string",
              paramDataType: "string",
              paramName: "BK_SRC_SYS_BAL_TYPE",
              paramOrder: 4,
              paramValue: $scope.srcBalType,
            },
            {
              dataFormat: "string",
              paramDataType: "string",
              paramName: "BK_DRVD_BAL_TYPE",
              paramOrder: 5,
              paramValue: $scope.derivedBalType,
            },
            {
              dataFormat: "string",
              paramDataType: "string",
              paramName: "BK_PROD_TYPE",
              paramOrder: 6,
              paramValue: vm.productTypeFilter.ngModel.value,
            },
            {
              dataFormat: "string",
              paramDataType: "string",
              paramName: "BK_CMNT",
              paramOrder: 7,
              paramValue: $scope.comments,
            },
            {
              dataFormat: "string",
              paramDataType: "string",
              paramName: "BK_RCRD_IND",
              paramOrder: 8,
              paramValue: vm.activeStatus.ngModel.key || "A",
            },
            {
              dataFormat: "string",
              paramDataType: "string",
              paramName: "BK_OSX_IND",
              paramOrder: 9,
              paramValue: $scope.osxind,
            },
          ],
        };
        if ($scope.option === "Modify") {
          if ($scope.effStartDate) {
            vm.effStartDate.key = new Date($scope.effStartDate);
          }
          if ($scope.effEndDate) {
            vm.effEndDate.key = new Date($scope.effEndDate);
          }
          vm.sourceSystemFilter.ngModel.key = $scope.srcSysCode;
          vm.productTypeFilter.ngModel.key = $scope.prodType;
          $scope.srcBalType = $scope.srcSysBalType;
          $scope.derivedBalType = $scope.derivedBalType;
        }
        if ($scope.option === "Add") {
          $scope.isStartSpinner = true;
          idtHttpService
            .saveFRRBalanceMap("Add", postData)
            .then(function (response) {
              if (
                response &&
                response.data &&
                response.data.errors &&
                response.data.errors.description
              ) {
                $scope.error = "true";
                $scope.isStartSpinner = false;
                $scope.applyDisable = false;
                if (response.data.errors.code === "Report-100") {
                  $scope.message = response.data.errors.description;
                } else {
                  $scope.message = "Failed to save Data";
                }
              } else {
                $rootScope.$emit("callGetData", {});
                $scope.close();
              }
            });
          // }
        } else if ($scope.option === "Modify") {
          $scope.isStartSpinner = true;
          idtHttpService
            .saveFRRBalanceMap("Modify", postData)
            .then(function (response) {
              if (
                response &&
                response.data &&
                response.data.errors &&
                response.data.errors.description
              ) {
                $scope.error = "true";
                $scope.isStartSpinner = false;
                $scope.applyDisable = false;
                if (response.data.errors.code === "Report-100") {
                  $scope.message = response.data.errors.description;
                } else {
                  $scope.message = "Failed to save Data";
                }
              } else {
                $rootScope.$emit("callGetData", {});
                $scope.close();
              }
            });
        }
      }
    };
  }
})();
