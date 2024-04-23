(function () {
  "use strict";

  angular
    .module("myApp")
    .service("idtmysReportFilterOptionService", idtReportFilterOptionService);

  idtReportFilterOptionService.$inject = ["idtmysReportFilterService"];

  function idtReportFilterOptionService(idtReportFilterService) {
    var currencyOptions = [
      {
        key: "USD",
        value: "USD",
      },
      {
        key: "EUR",
        value: "EUR",
      },
      {
        key: "GBP",
        value: "GBP",
      },
      {
        key: "JPY",
        value: "JPY",
      },
      {
        key: "HKD",
        value: "HKD",
      },
      {
        key: "SGD",
        value: "SGD",
      },
    ];

    var errorReportTypeOptions = [
      {
        key: "ACCOUNT",
        value: "Account",
      },
      {
        key: "BALANCE",
        value: "Balance",
      },
    ];

    var hierarchyTypeOptions = [
      {
        name: "Risk",
        hierarchyCode: "G004",
      },
      {
        name: "Standard",
        hierarchyCode: "G001",
      },
    ];
    var errorReportOptions = [
      {
        key: "Summary",
        name: "SUMMARY",
      },
      {
        key: "Detail",
        name: "DETAIL",
      },
    ];

    var countryAttributeOptions = [
      {
        name: "Risk",
      },
      {
        name: "Domicile",
      },
    ];
    var externalAgencyOption = [
      {
        key: "1",
        value: "S & P",
      },
      {
        key: "2",
        value: "Fitch",
      },
      {
        key: "3",
        value: "Moodys",
      },
      {
        key: "4",
        value: "Worst Rating",
      },
    ];
    var externalRatingTypeOption = [
      {
        key: "0",
        value: "Short Term Debt",
      },
      {
        key: "1",
        value: "Long Term Debt",
      },
    ];
    var principalAgencyOptions = [
      {
        key: "3",
        value: "Principal & Agency",
      },
      {
        key: "1",
        value: "Agency",
      },
      {
        key: "2",
        value: "Principal",
      },
    ];
    var indemnified = [
      {
        key: "3",
        value: "Both",
      },
      {
        key: "2",
        value: "Yes",
      },
      {
        key: "1",
        value: "No",
      },
    ];

    var adjustment = [
      {
        key: "Risk Allignment",
        value: "Risk Allignment",
      },
      {
        key: "Exclusion",
        value: "Exclusion",
      },
    ];
    var clientTypeOption = [
      {
        key: "N",
        value: "External",
      },
      {
        key: "Y",
        value: "Internal",
      },
      {
        key: "A",
        value: "Both",
      },
    ];
    var exposureTypeOption = [
      {
        key: "GROSS",
        value: "Gross",
      },
      {
        key: "NET",
        value: "Net",
      },
    ];

    var reportTypeOption = [
      {
        key: "INTRA",
        value: "Intra",
      },
      {
        key: "INTER",
        value: "Inter",
      },
    ];

    var viewTypeOptions = [
      {
        name: "Consolidated",
        key: "Consolidated",
      },
      {
        name: "Standalone",
        key: "Standalone",
      },
    ];

    var intradayViewTypeOptions = [
      {
        name: "Aggregated View",
        key: "Aggregated",
      },
      {
        name: "Short View",
        key: "Short",
      },
    ];

    var options = {
      balanceProductTypeCode: function () {
        return {
          updateDropdownOptions: updateDropdownOptions,
          dropdownId: "BAL_METADATA_PRODUCT_TYPE",
          elementId: "productTypeFilter",
          elementLabel: "Product Type Filter",
          getDefaultNgModel: function () {
            return undefined;
          },
          isOptional: false,
          supportsAll: false,
          uiSelectPlaceHolder: "Search for a Product Type",
          selectOptions: [
            { key: "P1", value: "COLLATERAL", disableChoice: false },
            { key: "P2", value: "SECURITY FINANCE", disableChoice: false },
            { key: "P3", value: "DEPOSITS", disableChoice: false },
            { key: "P4", value: "DEPOSITARY RECEIPTS", disableChoice: false },
            { key: "P5", value: "GUARANTEE", disableChoice: false },
            { key: "P6", value: "LOAN", disableChoice: false },
            { key: "P7", value: "LOC", disableChoice: false },
            { key: "P8", value: "SECURITIES", disableChoice: false },
            { key: "P9", value: "MORTGAGE", disableChoice: false },
            { key: "P10", value: "LEASE", disableChoice: false },
            { key: "P11", value: "DERIVATIVE", disableChoice: false },
            { key: "P12", value: "FAILED_TRANSACTION", disableChoice: false },
            { key: "P13", value: "LIFE_INSURANCE", disableChoice: false },
            { key: "P14", value: "EQUITY", disableChoice: false },
            { key: "P15", value: "RECON", disableChoice: false },
            { key: "P16", value: "EQTY", disableChoice: false },
          ],
          paramData: [
            {
              paramName: "BK_SRSYS",
              paramDisplayName: "BK_SRSYS",
              paramDataType: "string",
            },
            {
              paramName: "BK_PROD_TYPE",
              paramDisplayName: "BK_PROD_TYPE",
              paramDataType: "string",
            },
          ],
        };
      },
      eriSourceSystem: function () {
        return {
          updateDropdownOptions: updateDropdownOptions,
          dropdownId: "ERI_SRC_SYSTEMS",
          elementId: "eriSourceSystemInputFilter",
          elementLabel: "Source System",
          getDefaultNgModel: function () {
            return undefined;
          },
          isOptional: false,
          supportsAll: false,
          uiSelectPlaceHolder: "Search for Source System",
          selectOptions: [
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
          ],
          paramData: {
            paramName: "Source System",
            paramDataType: "string",
          },
        };
      },
    };

    function updateDropdownOptions(filter, $select) {
      var searchString = $select.search;
      /*
       * if the search criteria is not entered and there are no previous select options, update the list to
       * hide the "No records found message"
       *
       * otherwise if there is criteria entered, display the loading message
       */
      if (
        (searchString === undefined || searchString === "") &&
        filter.selectOptions === undefined &&
        $select.selected === undefined
      ) {
        // the list should display empty to hide the default ui-select error message
        filter.selectOptions = [
          {
            key: null,
            disableChoice: true,
            disableChoiceReason: "NULL",
          },
        ];
        if (filter.isMultiSelect) {
          $select.selected = [];
        }
      } else if (searchString !== "") {
        filter.selectOptions = [
          {
            key: "Loading...",
            disableChoice: true,
            disableChoiceReason: "LOADING",
          },
        ];
      }

      idtReportFilterService.updateDropdownOptions(filter, $select);
    }

    var service = {
      createProductTypeFilter: createProductTypeFilter,
      createEriSourceSystem: createEriSourceSystem,
    };
    return service;

    function value(filter) {
      var element = filter;
      var ngModel = element.ngModel;
      var paramValue;
      if (angular.isDefined(ngModel)) {
        // if the ngModel is an array, convert to quoted strings delimited by commas
        // [1,2,3] => "'1','2','3'"
        if (angular.isArray(ngModel)) {
          var quotedValueArray = ngModel.map(function (element) {
            return "'" + element.key + "'";
          });

          paramValue = quotedValueArray.join(",");
        } else {
          if (angular.isDate(ngModel.key)) {
            paramValue = moment(element.ngModel.key).format("DD-MMM-YYYY");
          } else {
            paramValue = element.ngModel.key;
          }
        }
      }
      return paramValue;
    }

    function createProductTypeFilter() {
      return create("balanceProductTypeCode", false);
    }
    function createEriSourceSystem(getBusinessEffectiveDate, isMultiSelect) {
      return create("eriSourceSystem", getBusinessEffectiveDate, isMultiSelect);
    }

    function create(name, isMultiSelect) {
      // default to no multi-select if no option given
      isMultiSelect = isMultiSelect || false;
      var filter = options[name]();
      console.log(filter);
      filter.isMultiSelect = isMultiSelect;

      if (filter.getDisplayNameByCode === undefined) {
        filter.getDisplayNameByCode = function () {
          return this.ngModel.key;
        };
      }
      console.log(filter);
      // default ngModel when the filter doesn't support ALL
      var noAllDefaultNgModel = filter.getDefaultNgModel();
      // handle both cases when filter supports ALL and when it doesn't support ALL
      filter.getDefaultNgModel = function () {
        if (filter.supportsAll) {
          if (filter.isMultiSelect) {
            return [
              {
                key: "ALL",
                value: "ALL",
              },
            ];
          } else {
            return {
              key: "ALL",
              value: "ALL",
            };
          }
        } else {
          if (filter.isMultiSelect) {
            return [];
          } else {
            // return a new copy so that the original default ngModel is not overwritten
            return angular.copy(noAllDefaultNgModel);
          }
        }
      };
      console.log(filter);
      filter.value = function () {
        return value(filter);
      };
      console.log(filter);
      return filter;
    }
  }
})();
