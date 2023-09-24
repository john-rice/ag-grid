"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFilter = exports.DateFilterModelFormatter = void 0;
var context_1 = require("../../../context/context");
var dateCompWrapper_1 = require("./dateCompWrapper");
var simpleFilter_1 = require("../simpleFilter");
var scalarFilter_1 = require("../scalarFilter");
var date_1 = require("../../../utils/date");
var DEFAULT_MIN_YEAR = 1000;
var DEFAULT_MAX_YEAR = Infinity;
var DateFilterModelFormatter = /** @class */ (function (_super) {
    __extends(DateFilterModelFormatter, _super);
    function DateFilterModelFormatter(dateFilterParams, localeService, optionsFactory) {
        var _this = _super.call(this, localeService, optionsFactory) || this;
        _this.dateFilterParams = dateFilterParams;
        return _this;
    }
    DateFilterModelFormatter.prototype.conditionToString = function (condition, options) {
        var type = condition.type;
        var numberOfInputs = (options || {}).numberOfInputs;
        var isRange = type == simpleFilter_1.SimpleFilter.IN_RANGE || numberOfInputs === 2;
        var dateFrom = date_1.parseDateTimeFromString(condition.dateFrom);
        var dateTo = date_1.parseDateTimeFromString(condition.dateTo);
        var format = this.dateFilterParams.inRangeFloatingFilterDateFormat;
        if (isRange) {
            var formattedFrom = dateFrom !== null ? date_1.dateToFormattedString(dateFrom, format) : 'null';
            var formattedTo = dateTo !== null ? date_1.dateToFormattedString(dateTo, format) : 'null';
            return formattedFrom + "-" + formattedTo;
        }
        if (dateFrom != null) {
            return date_1.dateToFormattedString(dateFrom, format);
        }
        // cater for when the type doesn't need a value
        return "" + type;
    };
    DateFilterModelFormatter.prototype.updateParams = function (params) {
        _super.prototype.updateParams.call(this, params);
        this.dateFilterParams = params.dateFilterParams;
    };
    return DateFilterModelFormatter;
}(simpleFilter_1.SimpleFilterModelFormatter));
exports.DateFilterModelFormatter = DateFilterModelFormatter;
var DateFilter = /** @class */ (function (_super) {
    __extends(DateFilter, _super);
    function DateFilter() {
        var _this = _super.call(this, 'dateFilter') || this;
        _this.eConditionPanelsFrom = [];
        _this.eConditionPanelsTo = [];
        _this.dateConditionFromComps = [];
        _this.dateConditionToComps = [];
        _this.minValidYear = DEFAULT_MIN_YEAR;
        _this.maxValidYear = DEFAULT_MAX_YEAR;
        _this.minValidDate = null;
        _this.maxValidDate = null;
        return _this;
    }
    DateFilter.prototype.afterGuiAttached = function (params) {
        _super.prototype.afterGuiAttached.call(this, params);
        this.dateConditionFromComps[0].afterGuiAttached(params);
    };
    DateFilter.prototype.mapValuesFromModel = function (filterModel) {
        // unlike the other filters, we do two things here:
        // 1) allow for different attribute names (same as done for other filters) (eg the 'from' and 'to'
        //    are in different locations in Date and Number filter models)
        // 2) convert the type (because Date filter uses Dates, however model is 'string')
        //
        // NOTE: The conversion of string to date also removes the timezone - i.e. when user picks
        //       a date from the UI, it will have timezone info in it. This is lost when creating
        //       the model. When we recreate the date again here, it's without a timezone.
        var _a = filterModel || {}, dateFrom = _a.dateFrom, dateTo = _a.dateTo, type = _a.type;
        return [
            dateFrom && date_1.parseDateTimeFromString(dateFrom) || null,
            dateTo && date_1.parseDateTimeFromString(dateTo) || null,
        ].slice(0, this.getNumberOfInputs(type));
    };
    DateFilter.prototype.comparator = function () {
        return this.dateFilterParams.comparator ? this.dateFilterParams.comparator : this.defaultComparator.bind(this);
    };
    DateFilter.prototype.defaultComparator = function (filterDate, cellValue) {
        // The default comparator assumes that the cellValue is a date
        var cellAsDate = cellValue;
        if (cellValue == null || cellAsDate < filterDate) {
            return -1;
        }
        if (cellAsDate > filterDate) {
            return 1;
        }
        return 0;
    };
    DateFilter.prototype.setParams = function (params) {
        this.dateFilterParams = params;
        _super.prototype.setParams.call(this, params);
        var yearParser = function (param, fallback) {
            if (params[param] != null) {
                if (!isNaN(params[param])) {
                    return params[param] == null ? fallback : Number(params[param]);
                }
                else {
                    console.warn("AG Grid: DateFilter " + param + " is not a number");
                }
            }
            return fallback;
        };
        this.minValidYear = yearParser('minValidYear', DEFAULT_MIN_YEAR);
        this.maxValidYear = yearParser('maxValidYear', DEFAULT_MAX_YEAR);
        if (this.minValidYear > this.maxValidYear) {
            console.warn("AG Grid: DateFilter minValidYear should be <= maxValidYear");
        }
        if (params.minValidDate) {
            this.minValidDate = params.minValidDate instanceof Date ? params.minValidDate : date_1.parseDateTimeFromString(params.minValidDate);
        }
        else {
            this.minValidDate = null;
        }
        if (params.maxValidDate) {
            this.maxValidDate = params.maxValidDate instanceof Date ? params.maxValidDate : date_1.parseDateTimeFromString(params.maxValidDate);
        }
        else {
            this.maxValidDate = null;
        }
        if (this.minValidDate && this.maxValidDate && this.minValidDate > this.maxValidDate) {
            console.warn("AG Grid: DateFilter minValidDate should be <= maxValidDate");
        }
        this.filterModelFormatter = new DateFilterModelFormatter(this.dateFilterParams, this.localeService, this.optionsFactory);
    };
    DateFilter.prototype.createDateCompWrapper = function (element) {
        var _this = this;
        var dateCompWrapper = new dateCompWrapper_1.DateCompWrapper(this.getContext(), this.userComponentFactory, {
            onDateChanged: function () { return _this.onUiChanged(); },
            filterParams: this.dateFilterParams
        }, element);
        this.addDestroyFunc(function () { return dateCompWrapper.destroy(); });
        return dateCompWrapper;
    };
    DateFilter.prototype.setElementValue = function (element, value) {
        element.setDate(value);
    };
    DateFilter.prototype.setElementDisplayed = function (element, displayed) {
        element.setDisplayed(displayed);
    };
    DateFilter.prototype.setElementDisabled = function (element, disabled) {
        element.setDisabled(disabled);
    };
    DateFilter.prototype.getDefaultFilterOptions = function () {
        return DateFilter.DEFAULT_FILTER_OPTIONS;
    };
    DateFilter.prototype.createValueElement = function () {
        var eCondition = document.createElement('div');
        eCondition.classList.add('ag-filter-body');
        this.createFromToElement(eCondition, this.eConditionPanelsFrom, this.dateConditionFromComps, 'from');
        this.createFromToElement(eCondition, this.eConditionPanelsTo, this.dateConditionToComps, 'to');
        return eCondition;
    };
    DateFilter.prototype.createFromToElement = function (eCondition, eConditionPanels, dateConditionComps, fromTo) {
        var eConditionPanel = document.createElement('div');
        eConditionPanel.classList.add("ag-filter-" + fromTo);
        eConditionPanel.classList.add("ag-filter-date-" + fromTo);
        eConditionPanels.push(eConditionPanel);
        eCondition.appendChild(eConditionPanel);
        dateConditionComps.push(this.createDateCompWrapper(eConditionPanel));
    };
    DateFilter.prototype.removeValueElements = function (startPosition, deleteCount) {
        this.removeDateComps(this.dateConditionFromComps, startPosition, deleteCount);
        this.removeDateComps(this.dateConditionToComps, startPosition, deleteCount);
        this.removeItems(this.eConditionPanelsFrom, startPosition, deleteCount);
        this.removeItems(this.eConditionPanelsTo, startPosition, deleteCount);
    };
    DateFilter.prototype.removeDateComps = function (components, startPosition, deleteCount) {
        var removedComponents = this.removeItems(components, startPosition, deleteCount);
        removedComponents.forEach(function (comp) { return comp.destroy(); });
    };
    DateFilter.prototype.isValidDateValue = function (value) {
        if (value === null) {
            return false;
        }
        if (this.minValidDate) {
            if (value < this.minValidDate) {
                return false;
            }
        }
        else {
            if (value.getUTCFullYear() < this.minValidYear) {
                return false;
            }
        }
        if (this.maxValidDate) {
            if (value > this.maxValidDate) {
                return false;
            }
        }
        else {
            if (value.getUTCFullYear() > this.maxValidYear) {
                return false;
            }
        }
        return true;
    };
    ;
    DateFilter.prototype.isConditionUiComplete = function (position) {
        var _this = this;
        if (!_super.prototype.isConditionUiComplete.call(this, position)) {
            return false;
        }
        var valid = true;
        this.forEachInput(function (element, index, elPosition, numberOfInputs) {
            if (elPosition !== position || !valid || index >= numberOfInputs) {
                return;
            }
            valid = valid && _this.isValidDateValue(element.getDate());
        });
        return valid;
    };
    DateFilter.prototype.areSimpleModelsEqual = function (aSimple, bSimple) {
        return aSimple.dateFrom === bSimple.dateFrom
            && aSimple.dateTo === bSimple.dateTo
            && aSimple.type === bSimple.type;
    };
    DateFilter.prototype.getFilterType = function () {
        return 'date';
    };
    DateFilter.prototype.createCondition = function (position) {
        var type = this.getConditionType(position);
        var model = {};
        var values = this.getValues(position);
        if (values.length > 0) {
            model.dateFrom = date_1.serialiseDate(values[0]);
        }
        if (values.length > 1) {
            model.dateTo = date_1.serialiseDate(values[1]);
        }
        return __assign({ dateFrom: null, dateTo: null, filterType: this.getFilterType(), type: type }, model);
    };
    DateFilter.prototype.resetPlaceholder = function () {
        var globalTranslate = this.localeService.getLocaleTextFunc();
        var placeholder = this.translate('dateFormatOoo');
        var ariaLabel = globalTranslate('ariaFilterValue', 'Filter Value');
        this.forEachInput(function (element) {
            element.setInputPlaceholder(placeholder);
            element.setInputAriaLabel(ariaLabel);
        });
    };
    DateFilter.prototype.getInputs = function (position) {
        if (position >= this.dateConditionFromComps.length) {
            return [null, null];
        }
        return [this.dateConditionFromComps[position], this.dateConditionToComps[position]];
    };
    DateFilter.prototype.getValues = function (position) {
        var result = [];
        this.forEachPositionInput(position, function (element, index, _elPosition, numberOfInputs) {
            if (index < numberOfInputs) {
                result.push(element.getDate());
            }
        });
        return result;
    };
    DateFilter.prototype.getModelAsString = function (model) {
        var _a;
        return (_a = this.filterModelFormatter.getModelAsString(model)) !== null && _a !== void 0 ? _a : '';
    };
    DateFilter.DEFAULT_FILTER_OPTIONS = [
        scalarFilter_1.ScalarFilter.EQUALS,
        scalarFilter_1.ScalarFilter.GREATER_THAN,
        scalarFilter_1.ScalarFilter.LESS_THAN,
        scalarFilter_1.ScalarFilter.NOT_EQUAL,
        scalarFilter_1.ScalarFilter.IN_RANGE,
        scalarFilter_1.ScalarFilter.BLANK,
        scalarFilter_1.ScalarFilter.NOT_BLANK,
    ];
    __decorate([
        context_1.Autowired('userComponentFactory')
    ], DateFilter.prototype, "userComponentFactory", void 0);
    return DateFilter;
}(scalarFilter_1.ScalarFilter));
exports.DateFilter = DateFilter;
