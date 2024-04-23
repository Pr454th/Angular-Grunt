(function () {
  "use strict";

  angular
    .module("myApp")
    .service("idtmysReportFilterService", idtReportFilterService);

  idtReportFilterService.$inject = ["$filter"];

  /**
   * Common report filter functions
   *
   * @namespace eriReportFilterService
   */
  function idtReportFilterService(idtHttpService, $filter, idtDateService) {
    return {
      resetFilterParameters: resetFilterParameters,
      generateParameterList: generateParameterList,
      generateParameterListV2: generateParameterListV2,
      parseDropdownResponse: parseDropdownResponse,
      updateClosedFilterTextForFilters: updateClosedFilterTextForFilters,
      updateDropdownOptions: updateDropdownOptions,
      updateDropdownOptionsWithParams: updateDropdownOptionsWithParams,
      watchFilter: watchFilter,
    };

    /**
     * Given an ngModel object, return the appropriate human-readable value for display
     * @param ngModel
     * @returns {*}
     */
    function parseElementNgModel(ngModel) {
      if (angular.isDefined(ngModel.key)) {
        if (angular.isDate(ngModel.key)) {
          return idtDateService.dateToD3String(ngModel.key);
        } else {
          return ngModel.key;
        }
      } else {
        return "";
      }
    }

    /**
     * Given a list of filters, populate the appropriate "pill" information for the NEXEN expand/collapse component
     * These values are used when the toggle is closed
     * @param filters
     * @returns {Array}
     *
     * See Intraday -> Client Hierarchy for detailed comments and implementation example.
     */
    function updateClosedFilterTextForFilters(filters) {
      var filterText = [];
      angular.forEach(filters, function (filter) {
        var textElement = { name: filter.elementLabel };

        if (angular.isDefined(filter.ngModel)) {
          if (angular.isDefined(filter.getDisplayNameByCode)) {
            textElement.name += ": " + filter.getDisplayNameByCode();
          } else {
            textElement.name += ": " + parseElementNgModel(filter.ngModel);
          }
        }

        filterText.push(textElement);
      });

      return filterText;
    }

    /**
     * reset each filter in the given filterList to the default ngModel based on the filter's getDefaultNgModel function
     * @param filterList {filter[]} the list of filters to reset
     * @memberof eriReportFilterService
     * @instance
     */
    function resetFilterParameters(filterList) {
      angular.forEach(filterList, function (element) {
        element.ngModel = element.getDefaultNgModel();

        // datepickers will not have selectOptions, but other filters will as they are dropdowns
        if (element.idtDatepickerIsOpen === undefined) {
          // ReportFilterOptionService uses defaultSelectOptions, but FilterConfigurationService uses getOptions() so it is the same
          // function for both dropdowns and radio buttons - this should be changed to getOptions() only if ReportFilterOptionService
          // is ever completely deprecated
          var defaultOptions;
          if (element.defaultSelectOptions) {
            defaultOptions = element.defaultSelectOptions;
          } else if (element.getOptions) {
            defaultOptions = element.getOptions();
          }

          element.selectOptions = angular.copy(defaultOptions);
        }
      });

      if (
        filterList.length > 0 &&
        angular.isDefined(filterList[0].updateClosedFilterText)
      ) {
        filterList[0].updateClosedFilterText();
      }
    }

    function generateParameterList(filters, filterAndCount) {
      var dynamicParams = [];

      if (!filters) {
        return [];
      }

      angular.forEach(filters, function (element, index) {
        var ngModel = element.ngModel;
        var paramValue;
        var paramKeyVal;

        if (angular.isDefined(ngModel)) {
          // if the ngModel is an array, convert to quoted strings delimited by commas and unquoted string delimited by commas and \n
          // [1,2,3] => "'1','2','3'"  and "1\n,2\n,3\n"
          if (angular.isArray(ngModel)) {
            var quotedValueArray = ngModel.map(function (element) {
              return "'" + element.key + "'";
            });
            var keyValueArray = ngModel.map(function (element) {
              return element.value;
            });
            paramValue = quotedValueArray.join(",");
            paramKeyVal = keyValueArray.join(",\n");
          } else if (angular.isDate(ngModel.key)) {
            paramValue = moment(element.ngModel.key).format("DD-MMM-YYYY");
          } else {
            paramValue = element.ngModel.key;
          }
        }
        if (angular.isDefined(filterAndCount)) {
          var count = filterAndCount[element.elementId];
          for (var i = 0; i < count; i++) {
            createParamData(dynamicParams, element, paramValue, paramKeyVal);
          }
        } else {
          createParamData(dynamicParams, element, paramValue, paramKeyVal);
        }
      });

      return dynamicParams;
    }

    function generateParameterListV2(filters) {
      var params = [];

      angular.forEach(filters, function (filter) {
        if (filter.valid() && filter.key() && filter.paramData) {
          params.push({
            paramName: filter.paramData.paramName,
            paramDisplayName: filter.paramData.paramDisplayName,
            paramOrder: 1 + params.length,
            paramValue: filter.value(true),
            paramKeyVal: filter.key(),
            paramDataType: filter.paramData.paramDataType,
          });
        }
      });

      return params;
    }

    /**
     * Add the element and paramValue to the list of dynamicParams
     * @param dynamicParams {object[]} the list of parameters to add a new parameter to
     * @param element {object} the element to add
     * @param paramValue {string|number|date} the value associated with the element
     * @memberof eriReportFilterService
     * @instance
     */
    function createParamData(dynamicParams, element, paramValue, paramKeyVal) {
      if (!element.paramData) {
        return;
      }

      dynamicParams.push({
        paramName: element.paramData.paramName,
        paramDisplayName: element.paramData.paramDisplayName,
        paramOrder: 1 + dynamicParams.length,
        paramValue: paramValue,
        paramKeyVal: paramKeyVal,
        paramDataType: element.paramData.paramDataType,
      });
    }

    /**
     * Makes an HTTP request to update the given filter's select options based on the value entered in $select.search
     * @param filter {object} the filter to update
     * @param $select {$select} the ui-select element that the filter contains
     * @memberof eriReportFilterService
     * @instance
     */
    function updateDropdownOptions(filter, $select) {
      var paramList;
      if (
        !($select instanceof Object) ||
        $select === null ||
        $select === undefined
      ) {
        return;
      }
      if (filter.isMultiSelect && $select.selected === undefined) {
        return;
      }

      var searchString = $select.search;

      if (searchString === undefined || searchString === "") {
        return;
      }
      if (filter.withoutDate === undefined) {
        paramList = [
          {
            paramName: "keyValue",
            paramOrder: 1,
            paramValue: "%" + searchString + "%",
            paramDataType: "string",
          },
          {
            paramName: "BK_BUS_EFF_DT",
            paramOrder: 2,
            paramValue: "07-AUG-2017",
            paramDataType: "string",
          },
        ];
      }

      if (filter.withoutDate === false && filter.effectiveDate) {
        paramList = [
          {
            paramName: "keyValue",
            paramOrder: 1,
            paramValue: "%" + searchString + "%",
            paramDataType: "string",
          },
          {
            paramName: "BK_BUS_EFF_DT",
            paramOrder: 2,
            paramValue: moment(filter.effectiveDate).format("DD-MM-YYYY"),
            paramDataType: "string",
          },
        ];
      }

      if (filter.withoutDate === true) {
        paramList = [
          {
            paramName: "keyValue",
            paramOrder: 1,
            paramValue: "%" + searchString + "%",
            paramDataType: "string",
          },
        ];
      }

      if (filter.additionalParam && paramList.length > 0) {
        var additionalParamObj = {
          paramName: "additionalParam",
          paramOrder: 3,
          paramValue: filter.additionalParam,
          paramDataType: "string",
        };

        paramList.push(additionalParamObj);
      }

      updateDropdownOptionsWithParams(filter, paramList, $select);
    }

    function watchFilter(scope, filters, onMatch) {
      angular.forEach(filters, function (filter) {
        scope.$watch(
          function () {
            if (filter.isMultiSelect) {
              return filter.ngModel;
            } else if (!angular.isDefined(filter.ngModel)) {
              return filter.ngModel;
            } else if (!angular.isDefined(filter.ngModel.key)) {
              return filter.ngModel;
            } else {
              return filter.ngModel.key;
            }
          },
          function () {
            onMatch();
            //gridHasRequiredFilters();
          }
        );
      });
    }

    /**
     * Makes an HTTP request to update the given filter's select options based on the value entered in $select.search
     * @param filter {object} the filter to update
     * @param paramList {object[]} the parameter list to pass
     * @param $select {$select} the ui-select $select element
     * @memberof eriReportFilterService
     * @instance
     */
    function updateDropdownOptionsWithParams(filter, paramList, $select) {
      if (
        !($select instanceof Object) ||
        $select === null ||
        $select === undefined
      ) {
        return;
      }

      var searchString = $select.search;

      if (searchString === undefined || searchString === "") {
        return;
      }

      var dropdownPostData = {
        identifier: filter.dropdownId,
        isParamRequired: true,
        queryParams: paramList,
      };

      data = [
        { key: "S1", value: "LNT" },
        { key: "S2", value: "YFH" },
        { key: "S3", value: "YEM" },
        { key: "S4", value: "DMM" },
        { key: "S5", value: "ADR" },
        { key: "S6", value: "AFS" },
        { key: "S7", value: "BDC" },
        { key: "S8", value: "BRM" },
        { key: "S9", value: "CFD" },
        { key: "S10", value: "GMR" },
        { key: "S11", value: "GSC" },
        { key: "S12", value: "GTS" },
        { key: "S13", value: "IRD" },
        { key: "S14", value: "ITR" },
        { key: "S15", value: "MLI" },
        { key: "S16", value: "MMD" },
        { key: "S17", value: "MRX" },
        { key: "S18", value: "NEX" },
        { key: "S19", value: "RPO" },
        { key: "S20", value: "SGI" },
        { key: "S21", value: "TBL" },
        { key: "S22", value: "TPR" },
        { key: "S23", value: "WSS" },
        { key: "S24", value: "YAM" },
        { key: "S25", value: "FXU" },
        { key: "S26", value: "GCL" },
        { key: "S27", value: "PWU" },
        { key: "S28", value: "DAF" },
        { key: "S29", value: "CAS" },
        { key: "S30", value: "CDS" },
        { key: "S31", value: "BYH" },
        { key: "S32", value: "YEL" },
      ];
      parseDropdownResponse(filter, data, $select);
    }

    /**
     * Given a filter to update, the RDS items, and the $select element that supports the filter, update the dropdown options
     * @param filter {object} the filter to update
     * @param dataFromRds {object} the RDS response
     * @param $select {$select} the ui-select $select element
     * @memberof eriReportFilterService
     * @instance
     */
    function parseDropdownResponse(filter, dataFromRds, $select) {
      filter.selectOptions = [];

      if (dataFromRds.error) {
        if (angular.isDefined($select.status)) {
          $select.status.selectHasError(true);
        }

        return;
      }

      if (filter.supportsAll) {
        filter.selectOptions.push({
          key: "ALL",
          value: "ALL",
        });
      }

      if (filter.supportsUnassigned && filter.supportsUnassigned.support) {
        filter.selectOptions.push({
          key: "Unassigned",
          value: filter.supportsUnassigned.display,
        });
      }

      if (filter.supportsDefaultSelectOptions) {
        angular.forEach(filter.defaultSelectOptions, function (option) {
          filter.selectOptions.push({
            key: option.key,
            value: option.value,
          });
        });
      }

      // filter out the items that to not match the search criteria
      var filteredOptionsFromRds = $filter("filter")(dataFromRds.items, {
        $: $select.search,
      });

      Array.prototype.push.apply(filter.selectOptions, filteredOptionsFromRds);

      if (filter.selectOptions.length > 0 && filter.isMultiSelect) {
        var selectedKeys = [];

        if ($select && $select.selected) {
          selectedKeys = $select.selected.map(function (element) {
            return element.key;
          });
        }

        filter.selectOptions = filter.selectOptions.filter(function (element) {
          return selectedKeys.indexOf(element.key) < 0;
        });

        // disable selection of "..."
        angular.forEach(filter.selectOptions, function (element) {
          if (element.key === "...") {
            element.disableChoice = true;
            element.disableChoiceReason = "...";
          }
        });
      }
      if (angular.isDefined($select.status)) {
        $select.status.listOfOptionsChanged(filter.selectOptions);
      }
    }
  }
})();
