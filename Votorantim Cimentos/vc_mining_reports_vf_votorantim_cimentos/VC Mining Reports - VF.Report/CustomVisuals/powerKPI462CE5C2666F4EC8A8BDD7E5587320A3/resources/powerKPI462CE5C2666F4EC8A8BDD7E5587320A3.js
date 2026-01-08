/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
                var DataViewTransform;
                (function (DataViewTransform) {
                    // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
                    function createValueColumns(values, valueIdentityFields, source) {
                        if (values === void 0) { values = []; }
                        var result = values;
                        setGrouped(result);
                        if (valueIdentityFields) {
                            result.identityFields = valueIdentityFields;
                        }
                        if (source) {
                            result.source = source;
                        }
                        return result;
                    }
                    DataViewTransform.createValueColumns = createValueColumns;
                    function setGrouped(values, groupedResult) {
                        values.grouped = groupedResult
                            ? function () { return groupedResult; }
                            : function () { return groupValues(values); };
                    }
                    DataViewTransform.setGrouped = setGrouped;
                    /** Group together the values with a common identity. */
                    function groupValues(values) {
                        var groups = [], currentGroup;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var value = values[i];
                            if (!currentGroup || currentGroup.identity !== value.identity) {
                                currentGroup = {
                                    values: []
                                };
                                if (value.identity) {
                                    currentGroup.identity = value.identity;
                                    var source = value.source;
                                    // allow null, which will be formatted as (Blank).
                                    if (source.groupName !== undefined) {
                                        currentGroup.name = source.groupName;
                                    }
                                    else if (source.displayName) {
                                        currentGroup.name = source.displayName;
                                    }
                                }
                                groups.push(currentGroup);
                            }
                            currentGroup.values.push(value);
                        }
                        return groups;
                    }
                    DataViewTransform.groupValues = groupValues;
                })(DataViewTransform = dataview.DataViewTransform || (dataview.DataViewTransform = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataRoleHelper;
                (function (DataRoleHelper) {
                    function getMeasureIndexOfRole(grouped, roleName) {
                        if (!_.isEmpty(grouped)) {
                            var firstGroup = grouped[0];
                            if (firstGroup.values && firstGroup.values.length > 0) {
                                for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                                    var value = firstGroup.values[i];
                                    if (value && value.source) {
                                        if (hasRole(value.source, roleName)) {
                                            return i;
                                        }
                                    }
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole;
                    function getCategoryIndexOfRole(categories, roleName) {
                        if (!_.isEmpty(categories)) {
                            for (var i = 0, ilen = categories.length; i < ilen; i++) {
                                if (hasRole(categories[i].source, roleName)) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole;
                    function hasRole(column, name) {
                        var roles = column.roles;
                        return roles && roles[name];
                    }
                    DataRoleHelper.hasRole = hasRole;
                    function hasRoleInDataView(dataView, name) {
                        return dataView != null
                            && dataView.metadata != null
                            && dataView.metadata.columns
                            && _.some(dataView.metadata.columns, function (c) { return c.roles && c.roles[name] !== undefined; }); // any is an alias of some
                    }
                    DataRoleHelper.hasRoleInDataView = hasRoleInDataView;
                    function hasRoleInValueColumn(valueColumn, name) {
                        return valueColumn
                            && valueColumn.source
                            && valueColumn.source.roles
                            && (valueColumn.source.roles[name] === true);
                    }
                    DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
                })(DataRoleHelper = dataview.DataRoleHelper || (dataview.DataRoleHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObject;
                (function (DataViewObject) {
                    function getValue(object, propertyName, defaultValue) {
                        if (!object) {
                            return defaultValue;
                        }
                        var propertyValue = object[propertyName];
                        if (propertyValue === undefined) {
                            return defaultValue;
                        }
                        return propertyValue;
                    }
                    DataViewObject.getValue = getValue;
                    /** Gets the solid color from a fill property using only a propertyName */
                    function getFillColorByPropertyName(object, propertyName, defaultColor) {
                        var value = getValue(object, propertyName);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
                })(DataViewObject = dataview.DataViewObject || (dataview.DataViewObject = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjects;
                (function (DataViewObjects) {
                    /** Gets the value of the given object/property pair. */
                    function getValue(objects, propertyId, defaultValue) {
                        if (!objects) {
                            return defaultValue;
                        }
                        return dataview.DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
                    }
                    DataViewObjects.getValue = getValue;
                    /** Gets an object from objects. */
                    function getObject(objects, objectName, defaultValue) {
                        if (objects && objects[objectName]) {
                            return objects[objectName];
                        }
                        return defaultValue;
                    }
                    DataViewObjects.getObject = getObject;
                    /** Gets the solid color from a fill property. */
                    function getFillColor(objects, propertyId, defaultColor) {
                        var value = getValue(objects, propertyId);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObjects.getFillColor = getFillColor;
                    function getCommonValue(objects, propertyId, defaultValue) {
                        var value = getValue(objects, propertyId, defaultValue);
                        if (value && value.solid) {
                            return value.solid.color;
                        }
                        if (value === undefined
                            || value === null
                            || (typeof value === "object" && !value.solid)) {
                            return defaultValue;
                        }
                        return value;
                    }
                    DataViewObjects.getCommonValue = getCommonValue;
                })(DataViewObjects = dataview.DataViewObjects || (dataview.DataViewObjects = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // powerbi.extensibility.utils.dataview
                var DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
                var converterHelper;
                (function (converterHelper) {
                    function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
                        if (dataView.categories && dataView.categories.length > 0) {
                            // Need to pivot data if our category soure is a series role
                            var category = dataView.categories[0];
                            return category.source &&
                                DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                                DataRoleHelper.hasRole(category.source, categoryRoleName);
                        }
                        return false;
                    }
                    converterHelper.categoryIsAlsoSeriesRole = categoryIsAlsoSeriesRole;
                    function getSeriesName(source) {
                        return (source.groupName !== undefined)
                            ? source.groupName
                            : source.queryName;
                    }
                    converterHelper.getSeriesName = getSeriesName;
                    function isImageUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.imageUrl === true;
                    }
                    converterHelper.isImageUrlColumn = isImageUrlColumn;
                    function isWebUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.webUrl === true;
                    }
                    converterHelper.isWebUrlColumn = isWebUrlColumn;
                    function getMiscellaneousTypeDescriptor(column) {
                        return column
                            && column.type
                            && column.type.misc;
                    }
                    converterHelper.getMiscellaneousTypeDescriptor = getMiscellaneousTypeDescriptor;
                    function hasImageUrlColumn(dataView) {
                        if (!dataView || !dataView.metadata || _.isEmpty(dataView.metadata.columns))
                            return false;
                        return _.some(dataView.metadata.columns, function (column) { return isImageUrlColumn(column) === true; });
                    }
                    converterHelper.hasImageUrlColumn = hasImageUrlColumn;
                })(converterHelper = dataview.converterHelper || (dataview.converterHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjectsParser = (function () {
                    function DataViewObjectsParser() {
                    }
                    DataViewObjectsParser.getDefault = function () {
                        return new this();
                    };
                    DataViewObjectsParser.createPropertyIdentifier = function (objectName, propertyName) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    };
                    DataViewObjectsParser.parse = function (dataView) {
                        var dataViewObjectParser = this.getDefault(), properties;
                        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                            return dataViewObjectParser;
                        }
                        properties = dataViewObjectParser.getProperties();
                        for (var objectName in properties) {
                            for (var propertyName in properties[objectName]) {
                                var defaultValue = dataViewObjectParser[objectName][propertyName];
                                dataViewObjectParser[objectName][propertyName] = dataview.DataViewObjects.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
                            }
                        }
                        return dataViewObjectParser;
                    };
                    DataViewObjectsParser.isPropertyEnumerable = function (propertyName) {
                        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
                    };
                    DataViewObjectsParser.enumerateObjectInstances = function (dataViewObjectParser, options) {
                        var dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
                        if (!dataViewProperties) {
                            return [];
                        }
                        var instance = {
                            objectName: options.objectName,
                            selector: null,
                            properties: {}
                        };
                        for (var key in dataViewProperties) {
                            if (_.has(dataViewProperties, key)) {
                                instance.properties[key] = dataViewProperties[key];
                            }
                        }
                        return {
                            instances: [instance]
                        };
                    };
                    DataViewObjectsParser.prototype.getProperties = function () {
                        var _this = this;
                        var properties = {}, objectNames = Object.keys(this);
                        objectNames.forEach(function (objectName) {
                            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                var propertyNames = Object.keys(_this[objectName]);
                                properties[objectName] = {};
                                propertyNames.forEach(function (propertyName) {
                                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                        properties[objectName][propertyName] =
                                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                                    }
                                });
                            }
                        });
                        return properties;
                    };
                    DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
                    return DataViewObjectsParser;
                }());
                dataview.DataViewObjectsParser = DataViewObjectsParser;
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var EventName;
                (function (EventName) {
                    EventName["onClick"] = "onClick";
                    EventName["onSelect"] = "onSelect";
                    EventName["onClearSelection"] = "onClearSelection";
                    EventName["onHighlight"] = "onHighlight";
                })(EventName = powerKpi.EventName || (powerKpi.EventName = {}));
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var LayoutEnum;
                (function (LayoutEnum) {
                    LayoutEnum[LayoutEnum["Top"] = 0] = "Top";
                    LayoutEnum[LayoutEnum["Right"] = 1] = "Right";
                    LayoutEnum[LayoutEnum["Bottom"] = 2] = "Bottom";
                    LayoutEnum[LayoutEnum["Left"] = 3] = "Left";
                })(LayoutEnum = powerKpi.LayoutEnum || (powerKpi.LayoutEnum = {}));
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var HorizontalLayoutEnum;
                (function (HorizontalLayoutEnum) {
                    HorizontalLayoutEnum[HorizontalLayoutEnum["Left"] = 0] = "Left";
                    HorizontalLayoutEnum[HorizontalLayoutEnum["Right"] = 1] = "Right";
                })(HorizontalLayoutEnum = powerKpi.HorizontalLayoutEnum || (powerKpi.HorizontalLayoutEnum = {}));
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var LayoutToStyleEnum;
                (function (LayoutToStyleEnum) {
                    LayoutToStyleEnum[LayoutToStyleEnum["columnLayout"] = 0] = "columnLayout";
                    LayoutToStyleEnum[LayoutToStyleEnum["columnReversedLayout"] = 1] = "columnReversedLayout";
                    LayoutToStyleEnum[LayoutToStyleEnum["rowLayout"] = 2] = "rowLayout";
                    LayoutToStyleEnum[LayoutToStyleEnum["rowReversedLayout"] = 3] = "rowReversedLayout";
                })(LayoutToStyleEnum = powerKpi.LayoutToStyleEnum || (powerKpi.LayoutToStyleEnum = {}));
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var CommonCapabilitiesBuilder = /** @class */ (function () {
                    function CommonCapabilitiesBuilder() {
                    }
                    CommonCapabilitiesBuilder.prototype.makeDataRoles = function () {
                        return [
                            powerKpi.categoryColumn,
                            powerKpi.seriesColumn,
                            powerKpi.valuesColumn,
                            powerKpi.secondaryValuesColumn,
                            powerKpi.kpiColumn,
                            powerKpi.kpiIndicatorValueColumn,
                            powerKpi.secondKPIIndicatorValueColumn,
                        ];
                    };
                    CommonCapabilitiesBuilder.prototype.makeDataViewMappings = function () {
                        return [{
                                conditions: [
                                    (_a = {},
                                        _a[powerKpi.categoryColumn.name] = { max: 1 },
                                        _a[powerKpi.seriesColumn.name] = { max: 0 },
                                        _a[powerKpi.valuesColumn.name] = { max: 0 },
                                        _a[powerKpi.secondaryValuesColumn.name] = { max: 0 },
                                        _a[powerKpi.kpiColumn.name] = { max: 0 },
                                        _a[powerKpi.kpiIndicatorValueColumn.name] = { max: 0 },
                                        _a[powerKpi.secondKPIIndicatorValueColumn.name] = { max: 0 },
                                        _a),
                                    (_b = {},
                                        _b[powerKpi.categoryColumn.name] = { max: 1 },
                                        _b[powerKpi.seriesColumn.name] = { max: 1 },
                                        _b[powerKpi.valuesColumn.name] = { max: 1 },
                                        _b[powerKpi.secondaryValuesColumn.name] = { max: 1 },
                                        _b[powerKpi.kpiColumn.name] = { max: 0 },
                                        _b[powerKpi.kpiIndicatorValueColumn.name] = { max: 1 },
                                        _b[powerKpi.secondKPIIndicatorValueColumn.name] = { max: 1 },
                                        _b),
                                    (_c = {},
                                        _c[powerKpi.categoryColumn.name] = { max: 1 },
                                        _c[powerKpi.seriesColumn.name] = { max: 0 },
                                        _c[powerKpi.valuesColumn.name] = { min: 1 },
                                        _c[powerKpi.kpiColumn.name] = { max: 0 },
                                        _c[powerKpi.kpiIndicatorValueColumn.name] = { max: 1 },
                                        _c[powerKpi.secondKPIIndicatorValueColumn.name] = { max: 1 },
                                        _c),
                                    (_d = {},
                                        _d[powerKpi.categoryColumn.name] = { max: 1 },
                                        _d[powerKpi.seriesColumn.name] = { max: 1 },
                                        _d[powerKpi.valuesColumn.name] = { max: 1 },
                                        _d[powerKpi.secondaryValuesColumn.name] = { max: 1 },
                                        _d[powerKpi.kpiColumn.name] = { max: 1 },
                                        _d[powerKpi.kpiIndicatorValueColumn.name] = { max: 1 },
                                        _d[powerKpi.secondKPIIndicatorValueColumn.name] = { max: 1 },
                                        _d),
                                    (_e = {},
                                        _e[powerKpi.categoryColumn.name] = { max: 1 },
                                        _e[powerKpi.seriesColumn.name] = { max: 0 },
                                        _e[powerKpi.valuesColumn.name] = { min: 1 },
                                        _e[powerKpi.kpiColumn.name] = { max: 1 },
                                        _e[powerKpi.kpiIndicatorValueColumn.name] = { max: 1 },
                                        _e[powerKpi.secondKPIIndicatorValueColumn.name] = { max: 1 },
                                        _e),
                                ],
                                categorical: {
                                    categories: {
                                        for: {
                                            in: powerKpi.categoryColumn.name
                                        },
                                        dataReductionAlgorithm: {
                                            window: { count: 30000 }
                                        }
                                    },
                                    values: {
                                        group: {
                                            by: powerKpi.seriesColumn.name,
                                            select: [
                                                {
                                                    for: {
                                                        in: powerKpi.valuesColumn.name
                                                    }
                                                },
                                                {
                                                    for: {
                                                        in: powerKpi.secondaryValuesColumn.name
                                                    }
                                                },
                                                {
                                                    for: {
                                                        in: powerKpi.kpiColumn.name
                                                    }
                                                },
                                                {
                                                    for: {
                                                        in: powerKpi.kpiIndicatorValueColumn.name
                                                    }
                                                },
                                                {
                                                    for: {
                                                        in: powerKpi.secondKPIIndicatorValueColumn.name
                                                    }
                                                },
                                            ]
                                        }
                                    }
                                }
                            }];
                        var _a, _b, _c, _d, _e;
                    };
                    CommonCapabilitiesBuilder.prototype.makeObjects = function () {
                        var kpiIndicatorProperties = powerKpi.KPIIndicatorDescriptor
                            .createDefault()
                            .getObjectProperties();
                        kpiIndicatorProperties["show"] = this.boolean();
                        kpiIndicatorProperties["fontSize"] = this.fontSize("Size");
                        kpiIndicatorProperties["position"] = this.position("Position", powerKpi.horizontalPositionEnum);
                        kpiIndicatorProperties["shouldBackgroundColorMatchKpiColor"] = this.boolean("Background Match KPI Color");
                        var kpiIndicatorValue = this.getKPISettings("KPI Indicator Value", true, true);
                        kpiIndicatorValue.properties["matchKPIColor"] = this.boolean("Match KPI Indicator Color");
                        return {
                            layout: {
                                displayName: "Layout",
                                properties: {
                                    autoHideVisualComponents: this.boolean("Auto Scale"),
                                    auto: this.boolean("Auto"),
                                    layout: this.layout()
                                }
                            },
                            title: {
                                displayName: "Title",
                                properties: {}
                            },
                            subtitle: {
                                displayName: "Subtitle",
                                properties: {
                                    show: this.boolean(),
                                    titleText: {
                                        displayName: "Title Text",
                                        type: { text: true },
                                        suppressFormatPainterCopy: true,
                                    },
                                    fontColor: this.fontColor(),
                                    background: this.nullableColor(),
                                    alignment: {
                                        displayName: "Alignment",
                                        type: { formatting: { alignment: true } }
                                    },
                                    fontSize: this.fontSize(),
                                    fontFamily: this.fontFamily(),
                                }
                            },
                            kpiIndicator: {
                                displayName: "KPI Indicator",
                                description: "KPI Indicator options",
                                properties: kpiIndicatorProperties
                            },
                            kpiIndicatorValue: kpiIndicatorValue,
                            kpiIndicatorLabel: this.getKPIIndicatorLabel("KPI Indicator Label"),
                            secondKPIIndicatorValue: this.getKPISettings("Second KPI Indicator Value", true, true),
                            secondKPIIndicatorLabel: this.getKPIIndicatorLabel("Second KPI Indicator Label"),
                            actualValueKPI: this.getKPISettings("KPI Actual Value", true),
                            actualLabelKPI: this.getKPISettings("KPI Actual Label"),
                            dateValueKPI: this.getKPISettings("KPI Date Value", true, true),
                            dateLabelKPI: this.getKPISettings("KPI Date Label"),
                            labels: {
                                displayName: "Data Labels",
                                description: "Display data label options",
                                properties: {
                                    show: this.boolean(),
                                    color: this.color(),
                                    displayUnits: this.displayUnits(),
                                    precision: this.precision(),
                                    fontSize: this.fontSize(),
                                    fontFamily: this.fontFamily(),
                                    isBold: this.isBold(),
                                    isItalic: this.isItalic(),
                                    percentile: this.numeric("Label Density")
                                }
                            },
                            line: {
                                displayName: "Line",
                                properties: {
                                    fillColor: this.color(),
                                    shouldMatchKpiColor: {
                                        displayName: "Match KPI Color",
                                        type: { bool: true }
                                    },
                                    lineType: {
                                        displayName: "Type",
                                        type: { enumeration: powerKpi.lineTypeEnumType }
                                    },
                                    thickness: {
                                        displayName: "Thickness",
                                        type: { numeric: true }
                                    },
                                    rawOpacity: {
                                        displayName: "Opacity",
                                        type: { numeric: true }
                                    },
                                    rawAreaOpacity: {
                                        displayName: "Area Opacity",
                                        type: { numeric: true }
                                    },
                                    lineStyle: {
                                        displayName: "Style",
                                        type: { enumeration: powerKpi.lineStyleEnumType }
                                    },
                                    interpolation: {
                                        displayName: "Interpolation",
                                        type: { enumeration: powerKpi.lineInterpolationEnumType }
                                    },
                                    interpolationWithColorizedLine: {
                                        displayName: "Interpolation",
                                        type: { enumeration: powerKpi.lineInterpolationWithColorizedLineEnumType }
                                    },
                                }
                            },
                            // series, lineStyle, lineThickness are here for backward compatibility. It's been actually moved to line
                            series: {
                                displayName: "Data Colors",
                                properties: {
                                    fillColor: {
                                        displayName: "Color",
                                        type: {
                                            fill: {
                                                solid: {
                                                    color: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            lineStyle: {
                                displayName: "Line Style",
                                properties: {
                                    lineStyle: {
                                        type: {
                                            enumeration: powerKpi.lineStyleEnumType
                                        }
                                    }
                                }
                            },
                            lineThickness: {
                                displayName: "Line Thickness",
                                properties: {
                                    thickness: {
                                        type: {
                                            numeric: true
                                        }
                                    }
                                }
                            },
                            legend: {
                                displayName: "Legend",
                                description: "Display legend options",
                                properties: {
                                    show: this.boolean(),
                                    position: this.position("Position", powerKpi.positionEnum),
                                    showTitle: this.boolean("Title"),
                                    titleText: this.text("Legend Name"),
                                    labelColor: this.color(),
                                    fontFamily: this.fontFamily(),
                                    fontSize: this.fontSize(),
                                    style: {
                                        displayName: "Style",
                                        type: { enumeration: powerKpi.legendStyleEnum }
                                    },
                                }
                            },
                            xAxis: this.getAxis("X Axis"),
                            yAxis: this.getAxis("Y Axis", true),
                            secondaryYAxis: this.getAxis("Secondary Y Axis", true),
                            referenceLineOfXAxis: this.getAxisLineSettings("X Axis Reference Lines"),
                            referenceLineOfYAxis: this.getAxisLineSettings("Y Axis Reference Lines"),
                            secondaryReferenceLineOfYAxis: this.getAxisLineSettings("Secondary Y Axis Reference Lines"),
                            tooltipLabel: this.getTooltipSettings("Tooltip Label", true),
                            tooltipVariance: this.getTooltipSettings("Tooltip KPI Indicator Value", true),
                            secondTooltipVariance: this.getTooltipSettings("Second Tooltip KPI Indicator Value", true),
                            tooltipValues: this.getTooltipSettings("Tooltip Values")
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.makeSorting = function () {
                        return {
                            implicit: {
                                clauses: [{
                                        role: powerKpi.categoryColumn.name,
                                        direction: 1
                                    }]
                            }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.boolean = function (displayName) {
                        if (displayName === void 0) { displayName = "Show"; }
                        return {
                            displayName: displayName,
                            type: { bool: true }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.fontColor = function (displayName) {
                        if (displayName === void 0) { displayName = "Font Color"; }
                        return {
                            displayName: displayName,
                            type: { fill: { solid: { color: true } } }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.nullableColor = function (displayName) {
                        if (displayName === void 0) { displayName = "Background Color"; }
                        return {
                            displayName: displayName,
                            type: { fill: { solid: { color: { nullable: true } } } }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.fontSize = function (displayName) {
                        if (displayName === void 0) { displayName = "Text Size"; }
                        return {
                            displayName: displayName,
                            type: { formatting: { fontSize: true } }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.numeric = function (displayName, placeHolderText) {
                        if (displayName === void 0) { displayName = "Number"; }
                        return {
                            displayName: displayName,
                            placeHolderText: placeHolderText,
                            type: { numeric: true },
                            suppressFormatPainterCopy: true
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.color = function (displayName) {
                        if (displayName === void 0) { displayName = "Color"; }
                        return {
                            displayName: displayName,
                            type: { fill: { solid: { color: true } } }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.displayUnits = function (displayName) {
                        if (displayName === void 0) { displayName = "Display Units"; }
                        return {
                            displayName: displayName,
                            description: "Select the units (millions, billions, etc.)",
                            type: { formatting: { labelDisplayUnits: true } },
                            suppressFormatPainterCopy: true,
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.precision = function (displayName) {
                        if (displayName === void 0) { displayName = "Decimal Places"; }
                        return {
                            displayName: displayName,
                            description: "Select the number of decimal places to display",
                            placeHolderText: "Auto",
                            type: { numeric: true },
                            suppressFormatPainterCopy: true
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.fontFamily = function (displayName) {
                        if (displayName === void 0) { displayName = "Font Family"; }
                        return {
                            displayName: displayName,
                            type: { formatting: { fontFamily: true } }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.isBold = function (displayName) {
                        if (displayName === void 0) { displayName = "Bold"; }
                        return {
                            displayName: displayName,
                            type: { bool: true }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.isItalic = function (displayName) {
                        if (displayName === void 0) { displayName = "Italic"; }
                        return {
                            displayName: displayName,
                            type: { bool: true }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.text = function (displayName, placeHolderText) {
                        if (displayName === void 0) { displayName = "Text"; }
                        return {
                            displayName: displayName,
                            placeHolderText: placeHolderText,
                            type: { text: true }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.format = function (displayName, placeHolderText) {
                        if (displayName === void 0) { displayName = "Format"; }
                        return this.text(displayName, placeHolderText);
                    };
                    CommonCapabilitiesBuilder.prototype.position = function (displayName, positionEnum) {
                        return {
                            displayName: displayName,
                            type: { enumeration: positionEnum }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.layout = function (displayName) {
                        if (displayName === void 0) { displayName = "Layout"; }
                        return {
                            displayName: displayName,
                            type: { enumeration: powerKpi.layoutEnum }
                        };
                    };
                    CommonCapabilitiesBuilder.prototype.getKPISettings = function (displayName, isNumberFormattingSupported, isFormatSupported) {
                        if (isNumberFormattingSupported === void 0) { isNumberFormattingSupported = false; }
                        if (isFormatSupported === void 0) { isFormatSupported = false; }
                        var objectDescriptor = {
                            displayName: displayName,
                            properties: {
                                show: this.boolean(),
                                fontColor: this.fontColor(),
                                fontSize: this.fontSize(),
                                isBold: this.isBold(),
                                isItalic: this.isItalic(),
                                fontFamily: this.fontFamily(),
                            }
                        };
                        if (isFormatSupported) {
                            objectDescriptor.properties['format'] = this.format();
                        }
                        if (isNumberFormattingSupported) {
                            objectDescriptor.properties['displayUnits'] = this.displayUnits();
                            objectDescriptor.properties['precision'] = this.precision();
                        }
                        return objectDescriptor;
                    };
                    CommonCapabilitiesBuilder.prototype.getTooltipSettings = function (displayName, isFormatSupported) {
                        if (isFormatSupported === void 0) { isFormatSupported = false; }
                        var objectDescriptor = {
                            displayName: displayName,
                            properties: {
                                show: this.boolean(),
                                displayUnits: this.displayUnits(),
                                precision: this.precision(),
                                label: this.text("Label", "Variance")
                            }
                        };
                        if (isFormatSupported) {
                            objectDescriptor.properties['format'] = this.format();
                        }
                        return objectDescriptor;
                    };
                    CommonCapabilitiesBuilder.prototype.getAxis = function (displayName, isMinMaxCustomizable) {
                        if (isMinMaxCustomizable === void 0) { isMinMaxCustomizable = false; }
                        var descriptor = {
                            displayName: displayName,
                            properties: {
                                show: this.boolean(),
                                fontColor: this.fontColor(),
                                displayUnits: this.displayUnits(),
                                precision: this.precision(),
                                fontSize: this.fontSize(),
                                percentile: this.numeric("Ticks Density"),
                                fontFamily: this.fontFamily(),
                            }
                        };
                        if (isMinMaxCustomizable) {
                            descriptor.properties["min"] = this.numeric("Min", "Auto");
                            descriptor.properties["max"] = this.numeric("Max", "Auto");
                        }
                        return descriptor;
                    };
                    CommonCapabilitiesBuilder.prototype.getKPIIndicatorLabel = function (displayName) {
                        var kpiIndicatorLabel = this.getKPISettings(displayName);
                        kpiIndicatorLabel.properties["label"] = this.text("Label");
                        return kpiIndicatorLabel;
                    };
                    CommonCapabilitiesBuilder.prototype.getAxisLineSettings = function (displayName) {
                        return {
                            displayName: displayName,
                            properties: {
                                show: this.boolean(""),
                                color: this.color(),
                                thickness: this.numeric("Thickness")
                            }
                        };
                    };
                    return CommonCapabilitiesBuilder;
                }());
                powerKpi.CommonCapabilitiesBuilder = CommonCapabilitiesBuilder;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var VisualDataRoleKind = powerbi.VisualDataRoleKind;
                powerKpi.categoryColumn = {
                    name: "Axis",
                    displayName: "Axis",
                    kind: VisualDataRoleKind.Grouping
                };
                powerKpi.kpiColumn = {
                    name: "KPI",
                    displayName: "KPI Indicator Index",
                    kind: VisualDataRoleKind.Measure,
                };
                powerKpi.kpiIndicatorValueColumn = {
                    name: "KPIIndicatorValue",
                    displayName: "KPI Indicator Value",
                    kind: VisualDataRoleKind.Measure,
                };
                powerKpi.secondKPIIndicatorValueColumn = {
                    name: "SecondKPIIndicatorValue",
                    displayName: "Second KPI Indicator Value",
                    kind: VisualDataRoleKind.Measure,
                };
                powerKpi.valuesColumn = {
                    name: "Values",
                    displayName: "Values",
                    kind: VisualDataRoleKind.Measure,
                };
                powerKpi.seriesColumn = {
                    name: "SeriesColumn",
                    displayName: "Series",
                    kind: VisualDataRoleKind.Grouping,
                };
                powerKpi.secondaryValuesColumn = {
                    name: "SecondaryValues",
                    displayName: "Secondary Values",
                    kind: VisualDataRoleKind.Measure,
                };
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var CapabilitiesFactory = /** @class */ (function () {
                    function CapabilitiesFactory(builders) {
                        if (builders === void 0) { builders = []; }
                        this.builders = builders;
                    }
                    CapabilitiesFactory.prototype.getCapabilities = function () {
                        var dataRoles = [];
                        var dataViewMappings = [];
                        var objects = {};
                        var sorting = {};
                        this.builders.forEach(function (builder) {
                            dataRoles.push.apply(dataRoles, builder.makeDataRoles());
                            dataViewMappings.push.apply(dataViewMappings, builder.makeDataViewMappings());
                            objects = __assign({}, objects, builder.makeObjects());
                            sorting = __assign({}, sorting, builder.makeSorting());
                        });
                        return {
                            dataRoles: dataRoles,
                            objects: objects,
                            dataViewMappings: dataViewMappings,
                            sorting: sorting,
                        };
                    };
                    return CapabilitiesFactory;
                }());
                powerKpi.CapabilitiesFactory = CapabilitiesFactory;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var BaseDescriptor = /** @class */ (function () {
                    function BaseDescriptor() {
                    }
                    BaseDescriptor.prototype.applyDefault = function (defaultSettings) {
                        var _this = this;
                        if (!defaultSettings) {
                            return;
                        }
                        Object
                            .keys(defaultSettings)
                            .forEach(function (propertyName) {
                            _this[propertyName] = defaultSettings[propertyName];
                        });
                    };
                    BaseDescriptor.prototype.enumerateProperties = function () {
                        var properties = {};
                        for (var key in this) {
                            var shouldKeyBeEnumerated = this.shouldKeyBeEnumerated
                                ? this.shouldKeyBeEnumerated(key)
                                : this.hasOwnProperty(key);
                            if (shouldKeyBeEnumerated) {
                                if (this.getValueByKey) {
                                    properties[key] = this.getValueByKey(key);
                                }
                                else {
                                    properties[key] = this[key];
                                }
                            }
                        }
                        return properties;
                    };
                    return BaseDescriptor;
                }());
                powerKpi.BaseDescriptor = BaseDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var ViewportDescriptor = /** @class */ (function (_super) {
                    __extends(ViewportDescriptor, _super);
                    function ViewportDescriptor(_viewport) {
                        if (_viewport === void 0) { _viewport = { width: 0, height: 0 }; }
                        var _this = _super.call(this) || this;
                        _this._viewport = _viewport;
                        return _this;
                    }
                    return ViewportDescriptor;
                }(powerKpi.BaseDescriptor));
                powerKpi.ViewportDescriptor = ViewportDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var ShowDescriptor = /** @class */ (function (_super) {
                    __extends(ShowDescriptor, _super);
                    function ShowDescriptor(viewport) {
                        if (viewport === void 0) { viewport = { width: 0, height: 0 }; }
                        var _this = _super.call(this, viewport) || this;
                        _this._show = true;
                        _this.isAbleToBeShown = true;
                        Object.defineProperty(_this, "show", Object.getOwnPropertyDescriptor(ShowDescriptor.prototype, "show"));
                        return _this;
                    }
                    Object.defineProperty(ShowDescriptor.prototype, "show", {
                        get: function () {
                            if (!this.isAbleToBeShown) {
                                return false;
                            }
                            return this._show;
                        },
                        set: function (isShown) {
                            this._show = isShown;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ShowDescriptor.prototype.parse = function (options) {
                        this.isAbleToBeShown = !(options
                            && options.isAutoHideBehaviorEnabled
                            && options.viewport
                            && this._viewport
                            &&
                                (options.viewport.width <= this._viewport.width
                                    ||
                                        options.viewport.height <= this._viewport.height));
                    };
                    return ShowDescriptor;
                }(powerKpi.ViewportDescriptor));
                powerKpi.ShowDescriptor = ShowDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var FontSizeDescriptor = /** @class */ (function (_super) {
                    __extends(FontSizeDescriptor, _super);
                    function FontSizeDescriptor(viewport) {
                        var _this = _super.call(this, viewport) || this;
                        _this.minFontSize = 8;
                        _this.isMinFontSizeApplied = false;
                        _this.viewportForFontSize8 = {
                            width: 210,
                            height: 210
                        };
                        _this._fontSize = _this.minFontSize; // This value is in pt.
                        Object.defineProperty(_this, "fontSize", Object.getOwnPropertyDescriptor(FontSizeDescriptor.prototype, "fontSize"));
                        return _this;
                    }
                    Object.defineProperty(FontSizeDescriptor.prototype, "fontSize", {
                        get: function () {
                            if (this.isMinFontSizeApplied) {
                                return this.minFontSize;
                            }
                            return this._fontSize;
                        },
                        set: function (fontSize) {
                            // Power BI returns numbers as strings for some unknown reason. This is why we convert value to number.
                            var parsedFontSize = +fontSize;
                            this._fontSize = isNaN(parsedFontSize)
                                ? this.minFontSize
                                : parsedFontSize;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FontSizeDescriptor.prototype, "fontSizeInPx", {
                        get: function () {
                            return PixelConverter.fromPointToPixel(this.fontSize);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    FontSizeDescriptor.prototype.parse = function (options) {
                        _super.prototype.parse.call(this, options);
                        this.isMinFontSizeApplied =
                            options
                                && options.isAutoHideBehaviorEnabled
                                && options.viewport
                                &&
                                    (options.viewport.width <= this.viewportForFontSize8.width
                                        ||
                                            options.viewport.height <= this.viewportForFontSize8.height);
                    };
                    return FontSizeDescriptor;
                }(powerKpi.ShowDescriptor));
                powerKpi.FontSizeDescriptor = FontSizeDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var NumberDescriptorBase = /** @class */ (function (_super) {
                    __extends(NumberDescriptorBase, _super);
                    function NumberDescriptorBase(viewport, shouldPropertiesBeHiddenByType) {
                        if (shouldPropertiesBeHiddenByType === void 0) { shouldPropertiesBeHiddenByType = false; }
                        var _this = _super.call(this, viewport) || this;
                        _this.minPrecision = 0;
                        _this.maxPrecision = 17;
                        _this.format = undefined;
                        _this.defaultFormat = undefined;
                        _this.columnFormat = undefined;
                        _this.displayUnits = 0;
                        _this.precision = undefined;
                        _this.shouldNumericPropertiesBeHiddenByType = shouldPropertiesBeHiddenByType;
                        return _this;
                    }
                    NumberDescriptorBase.prototype.parse = function (options) {
                        _super.prototype.parse.call(this, options);
                        this.precision = this.getValidPrecision(this.precision);
                        this.hidePropertiesByType(options.type);
                    };
                    NumberDescriptorBase.prototype.hidePropertiesByType = function (type) {
                        if (type === void 0) { type = powerKpi.DataRepresentationTypeEnum.NumberType; }
                        this.applyDefaultFormatByType(type);
                        if (this.shouldNumericPropertiesBeHiddenByType
                            && type !== powerKpi.DataRepresentationTypeEnum.NumberType) {
                            this.hideNumberProperties();
                        }
                        if (!(type === powerKpi.DataRepresentationTypeEnum.NumberType
                            || type === powerKpi.DataRepresentationTypeEnum.DateType)) {
                            this.hideFormatProperty();
                        }
                    };
                    NumberDescriptorBase.prototype.getValidPrecision = function (precision) {
                        if (isNaN(precision)) {
                            return precision;
                        }
                        return Math.min(Math.max(this.minPrecision, precision), this.maxPrecision);
                    };
                    /**
                     * Hides properties at the formatting panel
                     */
                    NumberDescriptorBase.prototype.hideNumberProperties = function () {
                        Object.defineProperties(this, {
                            displayUnits: {
                                enumerable: false
                            },
                            precision: {
                                enumerable: false
                            }
                        });
                    };
                    NumberDescriptorBase.prototype.hideFormatProperty = function () {
                        Object.defineProperty(this, "format", {
                            enumerable: false
                        });
                    };
                    NumberDescriptorBase.prototype.applyDefaultFormatByType = function (type) {
                        if (this.defaultFormat) {
                            return;
                        }
                        switch (type) {
                            case powerKpi.DataRepresentationTypeEnum.DateType: {
                                this.defaultFormat = "%M/%d/yyyy";
                                if (this.format === undefined) {
                                    this.format = this.defaultFormat;
                                }
                                break;
                            }
                            case powerKpi.DataRepresentationTypeEnum.NumberType: {
                                this.defaultFormat = "#,0.00";
                                break;
                            }
                            default: {
                                this.defaultFormat = undefined;
                            }
                        }
                    };
                    NumberDescriptorBase.prototype.getFormat = function () {
                        return this.format || this.columnFormat || this.defaultFormat;
                    };
                    NumberDescriptorBase.prototype.setColumnFormat = function (format) {
                        if (!format) {
                            return;
                        }
                        this.columnFormat = format;
                    };
                    NumberDescriptorBase.prototype.getValueByKey = function (key) {
                        if (key === "format") {
                            return this.getFormat();
                        }
                        return this[key];
                    };
                    return NumberDescriptorBase;
                }(powerKpi.FontSizeDescriptor));
                powerKpi.NumberDescriptorBase = NumberDescriptorBase;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var AxisDescriptor = /** @class */ (function (_super) {
                    __extends(AxisDescriptor, _super);
                    function AxisDescriptor(viewportToBeHidden, viewportToIncreaseDensity, shouldPropertiesBeHiddenByType) {
                        if (shouldPropertiesBeHiddenByType === void 0) { shouldPropertiesBeHiddenByType = false; }
                        var _this = _super.call(this, viewportToBeHidden, shouldPropertiesBeHiddenByType) || this;
                        _this.shouldDensityBeAtMax = false;
                        _this.maxDensity = 100;
                        _this.fontColor = "rgb(0,0,0)";
                        _this._percentile = _this.maxDensity;
                        _this.fontFamily = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";
                        _this.viewportToIncreaseDensity = viewportToIncreaseDensity;
                        Object.defineProperty(_this, "percentile", Object.getOwnPropertyDescriptor(AxisDescriptor.prototype, "percentile"));
                        return _this;
                    }
                    Object.defineProperty(AxisDescriptor.prototype, "percentile", {
                        // This property is an alias of density and it's defined special for Power BI. It's predefined PBI property name in order to create a percentage slider at format panel
                        get: function () {
                            if (this.shouldDensityBeAtMax) {
                                return this.maxDensity;
                            }
                            return this._percentile;
                        },
                        set: function (value) {
                            this._percentile = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(AxisDescriptor.prototype, "density", {
                        get: function () {
                            return this.percentile;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    AxisDescriptor.prototype.parse = function (options) {
                        _super.prototype.parse.call(this, options);
                        this.shouldDensityBeAtMax = options.isAutoHideBehaviorEnabled
                            && this.viewportToIncreaseDensity
                            && options.viewport
                            && (options.viewport.width <= this.viewportToIncreaseDensity.width
                                ||
                                    options.viewport.height <= this.viewportToIncreaseDensity.height);
                    };
                    return AxisDescriptor;
                }(powerKpi.NumberDescriptorBase));
                powerKpi.AxisDescriptor = AxisDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var YAxisDescriptor = /** @class */ (function (_super) {
                    __extends(YAxisDescriptor, _super);
                    function YAxisDescriptor() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.min = NaN;
                        _this.max = NaN;
                        return _this;
                    }
                    return YAxisDescriptor;
                }(powerKpi.AxisDescriptor));
                powerKpi.YAxisDescriptor = YAxisDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var AxisReferenceLineDescriptor = /** @class */ (function (_super) {
                    __extends(AxisReferenceLineDescriptor, _super);
                    function AxisReferenceLineDescriptor(isShown) {
                        if (isShown === void 0) { isShown = true; }
                        var _this = _super.call(this) || this;
                        _this._minThickness = 0.2;
                        _this._maxThickness = 5;
                        _this.color = "#e9e9e9";
                        _this.thickness = 1;
                        _this.show = isShown;
                        return _this;
                    }
                    AxisReferenceLineDescriptor.prototype.parse = function () {
                        this.thickness = Math.min(Math.max(this._minThickness, this.thickness), this._maxThickness);
                    };
                    return AxisReferenceLineDescriptor;
                }(powerKpi.BaseDescriptor));
                powerKpi.AxisReferenceLineDescriptor = AxisReferenceLineDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var SubtitleAlignment;
                (function (SubtitleAlignment) {
                    SubtitleAlignment[SubtitleAlignment["left"] = "left"] = "left";
                    SubtitleAlignment[SubtitleAlignment["center"] = "center"] = "center";
                    SubtitleAlignment[SubtitleAlignment["right"] = "right"] = "right";
                })(SubtitleAlignment = powerKpi.SubtitleAlignment || (powerKpi.SubtitleAlignment = {}));
                var SubtitleDescriptor = /** @class */ (function (_super) {
                    __extends(SubtitleDescriptor, _super);
                    function SubtitleDescriptor() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.titleText = "";
                        _this.fontColor = "#A6A6A6";
                        _this.background = "";
                        _this.alignment = SubtitleAlignment.left;
                        _this.fontFamily = "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif";
                        return _this;
                    }
                    return SubtitleDescriptor;
                }(powerKpi.FontSizeDescriptor));
                powerKpi.SubtitleDescriptor = SubtitleDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                /**
                 * We use this class to move the Title option up above the Subtitle at the formatting panel
                 */
                var FakeTitleDescriptor = /** @class */ (function (_super) {
                    __extends(FakeTitleDescriptor, _super);
                    function FakeTitleDescriptor() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.untrackedProperty = false;
                        return _this;
                    }
                    return FakeTitleDescriptor;
                }(powerKpi.BaseDescriptor));
                powerKpi.FakeTitleDescriptor = FakeTitleDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var LabelsDescriptor = /** @class */ (function (_super) {
                    __extends(LabelsDescriptor, _super);
                    function LabelsDescriptor(viewport) {
                        var _this = _super.call(this, viewport) || this;
                        _this.color = "rgb(119, 119, 119)";
                        _this.fontFamily = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";
                        _this.isBold = false;
                        _this.isItalic = false;
                        _this.percentile = 100; // This property is an alias of density and it's defined special for Power BI. It's predefined PBI property name in order to create a percentage slider at format panel
                        _this.show = false;
                        return _this;
                    }
                    Object.defineProperty(LabelsDescriptor.prototype, "density", {
                        get: function () {
                            return this.percentile;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return LabelsDescriptor;
                }(powerKpi.NumberDescriptorBase));
                powerKpi.LabelsDescriptor = LabelsDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var LegendStyle;
                (function (LegendStyle) {
                    LegendStyle["circle"] = "circle";
                    LegendStyle["box"] = "box";
                    LegendStyle["line"] = "line";
                    LegendStyle["styledLine"] = "styledLine";
                })(LegendStyle = powerKpi.LegendStyle || (powerKpi.LegendStyle = {}));
                powerKpi.legendStyleEnum = powerbi.createEnumType([
                    { value: LegendStyle.circle, displayName: "Circle" },
                    { value: LegendStyle.box, displayName: "Box" },
                    { value: LegendStyle.line, displayName: "Line" },
                    { value: LegendStyle.styledLine, displayName: "Styled Line" },
                ]);
                var LegendMarkerShape;
                (function (LegendMarkerShape) {
                    LegendMarkerShape["square"] = "square";
                    LegendMarkerShape["none"] = "none";
                    LegendMarkerShape["circle"] = "circle";
                })(LegendMarkerShape = powerKpi.LegendMarkerShape || (powerKpi.LegendMarkerShape = {}));
                var LegendLineStyle;
                (function (LegendLineStyle) {
                    LegendLineStyle["dotted"] = "dotted";
                    LegendLineStyle["dashed"] = "dashed";
                    LegendLineStyle["solid"] = "solid";
                })(LegendLineStyle = powerKpi.LegendLineStyle || (powerKpi.LegendLineStyle = {}));
                var LegendDescriptor = /** @class */ (function (_super) {
                    __extends(LegendDescriptor, _super);
                    function LegendDescriptor() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.position = "BottomCenter";
                        _this.showTitle = true;
                        _this.titleText = undefined;
                        _this.labelColor = "rgb(102, 102, 102)";
                        _this.fontFamily = "'Segoe UI Light', wf_segoe-ui_light, helvetica, arial, sans-serif";
                        _this.style = LegendStyle.circle;
                        return _this;
                    }
                    LegendDescriptor.prototype.getLegendMarkerShape = function () {
                        switch (this.style) {
                            case LegendStyle.box: {
                                return LegendMarkerShape.square;
                            }
                            case LegendStyle.line:
                            case LegendStyle.styledLine: {
                                return LegendMarkerShape.none;
                            }
                            case LegendStyle.circle:
                            default: {
                                return LegendMarkerShape.circle;
                            }
                        }
                    };
                    LegendDescriptor.prototype.getLegendLineStyle = function (lineStyle) {
                        switch (this.style) {
                            case LegendStyle.styledLine: {
                                switch (lineStyle) {
                                    case powerKpi.LineStyle.dottedLine: {
                                        return LegendLineStyle.dotted;
                                    }
                                    case powerKpi.LineStyle.dashedLine:
                                    case powerKpi.LineStyle.dotDashedLine: {
                                        return LegendLineStyle.dashed;
                                    }
                                    case powerKpi.LineStyle.solidLine:
                                    default: {
                                        return LegendLineStyle.solid;
                                    }
                                }
                            }
                            case LegendStyle.line: {
                                return LegendLineStyle.solid;
                            }
                        }
                        return undefined;
                    };
                    return LegendDescriptor;
                }(powerKpi.FontSizeDescriptor));
                powerKpi.LegendDescriptor = LegendDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var KPIIndicatorValueDescriptor = /** @class */ (function (_super) {
                    __extends(KPIIndicatorValueDescriptor, _super);
                    function KPIIndicatorValueDescriptor(viewport, shouldPropertiesBeHiddenByType) {
                        if (shouldPropertiesBeHiddenByType === void 0) { shouldPropertiesBeHiddenByType = false; }
                        var _this = _super.call(this, viewport, shouldPropertiesBeHiddenByType) || this;
                        _this.fontColor = "#333333";
                        _this.isBold = true;
                        _this.isItalic = false;
                        _this.fontFamily = "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif";
                        _this.fontSize = 12;
                        _this.displayUnits = 1;
                        return _this;
                    }
                    return KPIIndicatorValueDescriptor;
                }(powerKpi.NumberDescriptorBase));
                powerKpi.KPIIndicatorValueDescriptor = KPIIndicatorValueDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var KPIIndicatorLabelDescriptor = /** @class */ (function (_super) {
                    __extends(KPIIndicatorLabelDescriptor, _super);
                    function KPIIndicatorLabelDescriptor(viewport) {
                        var _this = _super.call(this, viewport) || this;
                        _this.fontColor = "#acacac";
                        _this.fontSize = 9;
                        _this.isBold = false;
                        return _this;
                    }
                    return KPIIndicatorLabelDescriptor;
                }(powerKpi.KPIIndicatorValueDescriptor));
                powerKpi.KPIIndicatorLabelDescriptor = KPIIndicatorLabelDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var KPIIndicatorDescriptor = /** @class */ (function (_super) {
                    __extends(KPIIndicatorDescriptor, _super);
                    function KPIIndicatorDescriptor(viewport) {
                        var _this = _super.call(this, viewport) || this;
                        _this.position = powerKpi.HorizontalLayoutEnum[powerKpi.HorizontalLayoutEnum.Left];
                        _this.shouldBackgroundColorMatchKpiColor = false;
                        _this._maxAmountOfKPIs = 5;
                        _this._default = Object.freeze({
                            color: null,
                            shape: null
                        });
                        _this.kpiIndexPropertyName = "kpiIndex";
                        _this._colors = [
                            "#01b7a8",
                            "#f2c80f",
                            "#fd625e",
                            "#a66999",
                            "#374649"
                        ];
                        _this._shapes = [
                            { name: "circle-full", displayName: "Circle" },
                            { name: "triangle", displayName: "Triangle" },
                            { name: "rhombus", displayName: "Diamond" },
                            { name: "square", displayName: "Square" },
                            { name: "flag", displayName: "Flag" },
                            { name: "exclamation", displayName: "Exclamation" },
                            { name: "checkmark", displayName: "Checkmark" },
                            { name: "arrow-up", displayName: "Arrow Up" },
                            { name: "arrow-right-up", displayName: "Arrow Right Up" },
                            { name: "arrow-right-down", displayName: "Arrow Right Down" },
                            { name: "arrow-down", displayName: "Arrow Down" },
                            { name: "caret-up", displayName: "Caret Up" },
                            { name: "caret-down", displayName: "Caret Down" },
                            { name: "circle-empty", displayName: "Circle Empty" },
                            { name: "circle-x", displayName: "Circle X" },
                            { name: "circle-exclamation", displayName: "Circle Exclamation" },
                            { name: "circle-checkmark", displayName: "Circle Checkmark" },
                            { name: "x", displayName: "X" },
                            { name: "star-empty", displayName: "Star Empty" },
                            { name: "star-full", displayName: "Star Full" }
                        ];
                        _this._properties = [
                            {
                                name: "color",
                                displayName: function (text) { return text; },
                                defaultValue: function (index) {
                                    var color = _this.getElementByIndex(_this._colors, index);
                                    return color || _this._colors[0];
                                },
                                type: { fill: { solid: { color: true } } }
                            },
                            {
                                name: "shape",
                                displayName: function () { return "    Indicator"; },
                                defaultValue: function (index) {
                                    var shape = _this.getElementByIndex(_this._shapes, index);
                                    return shape
                                        ? shape.name
                                        : _this._shapes[0].name;
                                },
                                type: { enumeration: _this.getEnumType() }
                            },
                            {
                                name: _this.kpiIndexPropertyName,
                                displayName: function () { return "    Value"; },
                                defaultValue: function (index) { return index + 1; },
                                type: { numeric: true },
                            },
                        ];
                        _this.applySettingToContext();
                        _this.show = true;
                        _this.fontSize = 12;
                        return _this;
                    }
                    KPIIndicatorDescriptor.prototype.getElementByIndex = function (setOfValues, index) {
                        var amountOfValues = setOfValues.length;
                        var currentIndex = index < amountOfValues
                            ? index
                            : Math.round(index / amountOfValues);
                        return setOfValues[currentIndex];
                    };
                    KPIIndicatorDescriptor.prototype.applySettingToContext = function () {
                        var _this = this;
                        var _loop_1 = function (index) {
                            this_1._properties.forEach(function (property) {
                                var indexedName = _this.getPropertyName(property.name, index);
                                _this[indexedName] = typeof property.defaultValue === "function"
                                    ? property.defaultValue(index)
                                    : property.defaultValue;
                            });
                        };
                        var this_1 = this;
                        for (var index = 0; index < this._maxAmountOfKPIs; index++) {
                            _loop_1(index);
                        }
                    };
                    KPIIndicatorDescriptor.prototype.getEnumType = function () {
                        var members = this._shapes.map(function (shape) {
                            return {
                                value: shape.name,
                                displayName: shape.displayName
                            };
                        });
                        return powerbi.createEnumType(members);
                    };
                    KPIIndicatorDescriptor.prototype.getPropertyName = function (name, index) {
                        return name + "_" + index;
                    };
                    KPIIndicatorDescriptor.prototype.getObjectProperties = function () {
                        var _this = this;
                        var objectProperties = {};
                        var _loop_2 = function (index) {
                            this_2._properties.forEach(function (property) {
                                var indexedName = _this.getPropertyName(property.name, index);
                                objectProperties[indexedName] = {
                                    displayName: property.displayName("KPI " + (index + 1)),
                                    type: property.type
                                };
                            });
                        };
                        var this_2 = this;
                        for (var index = 0; index < this._maxAmountOfKPIs; index++) {
                            _loop_2(index);
                        }
                        return objectProperties;
                    };
                    KPIIndicatorDescriptor.prototype.getCurrentKPI = function (kpiIndex) {
                        var _this = this;
                        if (!isNaN(kpiIndex) && kpiIndex !== null) {
                            var _loop_3 = function (index) {
                                var currentKPIIndex = this_3[this_3.getPropertyName(this_3.kpiIndexPropertyName, index)];
                                if (currentKPIIndex === kpiIndex) {
                                    return { value: this_3._properties.reduce(function (current, property) {
                                            var indexedName = _this.getPropertyName(property.name, index);
                                            current[property.name] = _this[indexedName];
                                            return current;
                                        }, {}) };
                                }
                            };
                            var this_3 = this;
                            for (var index = 0; index < this._maxAmountOfKPIs; index++) {
                                var state_1 = _loop_3(index);
                                if (typeof state_1 === "object")
                                    return state_1.value;
                            }
                        }
                        return this._default;
                    };
                    KPIIndicatorDescriptor.createDefault = function () {
                        return new KPIIndicatorDescriptor();
                    };
                    return KPIIndicatorDescriptor;
                }(powerKpi.FontSizeDescriptor));
                powerKpi.KPIIndicatorDescriptor = KPIIndicatorDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var KPIIndicatorCustomizableLabelDescriptor = /** @class */ (function (_super) {
                    __extends(KPIIndicatorCustomizableLabelDescriptor, _super);
                    function KPIIndicatorCustomizableLabelDescriptor(viewport) {
                        var _this = _super.call(this, viewport) || this;
                        _this.label = "";
                        _this.show = false;
                        return _this;
                    }
                    KPIIndicatorCustomizableLabelDescriptor.prototype.isShown = function () {
                        return this.show && !!this.label;
                    };
                    return KPIIndicatorCustomizableLabelDescriptor;
                }(powerKpi.KPIIndicatorLabelDescriptor));
                powerKpi.KPIIndicatorCustomizableLabelDescriptor = KPIIndicatorCustomizableLabelDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var KPIIndicatorValueSignDescriptor = /** @class */ (function (_super) {
                    __extends(KPIIndicatorValueSignDescriptor, _super);
                    function KPIIndicatorValueSignDescriptor(viewport) {
                        var _this = _super.call(this, viewport) || this;
                        _this.matchKPIColor = true;
                        /**
                         * Below is small hack to change order of properties
                         * The matchKPIColor should be before fontColor for better UX
                         */
                        delete _this.fontColor;
                        _this.fontColor = "#333333";
                        return _this;
                    }
                    KPIIndicatorValueSignDescriptor.prototype.parse = function (options) {
                        _super.prototype.parse.call(this, options);
                        this.makePropertyFontColorPropertyEnumerable(!this.matchKPIColor);
                    };
                    KPIIndicatorValueSignDescriptor.prototype.makePropertyFontColorPropertyEnumerable = function (isEnumerable) {
                        Object.defineProperty(this, "fontColor", {
                            enumerable: isEnumerable
                        });
                    };
                    return KPIIndicatorValueSignDescriptor;
                }(powerKpi.KPIIndicatorValueDescriptor));
                powerKpi.KPIIndicatorValueSignDescriptor = KPIIndicatorValueSignDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var LineInterpolation;
                (function (LineInterpolation) {
                    LineInterpolation["linear"] = "linear";
                    LineInterpolation["stepBefore"] = "step-before";
                    LineInterpolation["stepAfter"] = "step-after";
                    LineInterpolation["basis"] = "basis";
                    LineInterpolation["basisOpen"] = "basis-open";
                    LineInterpolation["basisClosed"] = "basis-closed";
                    LineInterpolation["bundle"] = "bundle";
                    LineInterpolation["cardinal"] = "cardinal";
                    LineInterpolation["cardinalOpen"] = "cardinal-open";
                    LineInterpolation["cardinalClosed"] = "cardinal-closed";
                    LineInterpolation["monotone"] = "monotone";
                })(LineInterpolation = powerKpi.LineInterpolation || (powerKpi.LineInterpolation = {}));
                powerKpi.lineInterpolationEnumType = powerbi.createEnumType([
                    {
                        value: LineInterpolation.linear,
                        displayName: "Linear"
                    },
                    {
                        value: LineInterpolation.stepBefore,
                        displayName: "Step-before"
                    },
                    {
                        value: LineInterpolation.stepAfter,
                        displayName: "Step-after"
                    },
                    {
                        value: LineInterpolation.basis,
                        displayName: "Basis"
                    },
                    {
                        value: LineInterpolation.basisOpen,
                        displayName: "Basis-open"
                    },
                    {
                        value: LineInterpolation.basisClosed,
                        displayName: "Basis-closed"
                    },
                    {
                        value: LineInterpolation.bundle,
                        displayName: "Bundle"
                    },
                    {
                        value: LineInterpolation.cardinal,
                        displayName: "Cardinal"
                    },
                    {
                        value: LineInterpolation.cardinalOpen,
                        displayName: "Cardinal-open"
                    },
                    {
                        value: LineInterpolation.cardinalClosed,
                        displayName: "Cardinal-closed"
                    },
                    {
                        value: LineInterpolation.monotone,
                        displayName: "Monotone"
                    },
                ]);
                powerKpi.lineInterpolationWithColorizedLineEnumType = powerbi.createEnumType([
                    {
                        value: LineInterpolation.linear,
                        displayName: "Linear"
                    },
                    {
                        value: LineInterpolation.stepBefore,
                        displayName: "Step-before"
                    },
                    {
                        value: LineInterpolation.stepAfter,
                        displayName: "Step-after"
                    },
                ]);
                var LineStyle;
                (function (LineStyle) {
                    LineStyle["solidLine"] = "solidLine";
                    LineStyle["dottedLine"] = "dottedLine";
                    LineStyle["dashedLine"] = "dashedLine";
                    LineStyle["dotDashedLine"] = "dotDashedLine";
                })(LineStyle = powerKpi.LineStyle || (powerKpi.LineStyle = {}));
                powerKpi.lineStyleEnumType = powerbi.createEnumType([
                    {
                        value: LineStyle.solidLine,
                        displayName: "Solid"
                    },
                    {
                        value: LineStyle.dottedLine,
                        displayName: "Dotted"
                    },
                    {
                        value: LineStyle.dashedLine,
                        displayName: "Dashed"
                    },
                    {
                        value: LineStyle.dotDashedLine,
                        displayName: "Dot-dashed"
                    },
                ]);
                var LineType;
                (function (LineType) {
                    LineType["line"] = "line";
                    LineType["area"] = "area";
                    LineType["column"] = "column";
                })(LineType = powerKpi.LineType || (powerKpi.LineType = {}));
                powerKpi.lineTypeEnumType = powerbi.createEnumType([
                    {
                        value: LineType.line,
                        displayName: "Line",
                    },
                    {
                        value: LineType.area,
                        displayName: "Area",
                    },
                ]);
                var LineDescriptor = /** @class */ (function (_super) {
                    __extends(LineDescriptor, _super);
                    function LineDescriptor() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.minThickness = 0.25;
                        _this.maxThickness = 10;
                        _this.minOpacity = 15;
                        _this.maxOpacity = 100;
                        _this.fillColor = undefined;
                        _this.shouldMatchKpiColor = false;
                        _this.lineType = LineType.line;
                        _this.thickness = 2;
                        _this.rawOpacity = 100;
                        _this.rawAreaOpacity = 50;
                        _this.lineStyle = LineStyle.solidLine;
                        _this.interpolation = LineInterpolation.linear;
                        _this.interpolationWithColorizedLine = LineInterpolation.linear;
                        return _this;
                    }
                    Object.defineProperty(LineDescriptor.prototype, "opacity", {
                        get: function () {
                            return this.convertOpacityToCssFormat(this.rawOpacity);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(LineDescriptor.prototype, "areaOpacity", {
                        get: function () {
                            return this.convertOpacityToCssFormat(this.rawAreaOpacity);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    LineDescriptor.prototype.convertOpacityToCssFormat = function (opacity) {
                        return opacity / 100;
                    };
                    LineDescriptor.prototype.getInterpolation = function () {
                        return this.shouldMatchKpiColor
                            ? this.interpolationWithColorizedLine
                            : this.interpolation;
                    };
                    LineDescriptor.prototype.parse = function () {
                        this.thickness = Math.min(Math.max(this.minThickness, this.thickness), this.maxThickness);
                        this.rawOpacity = this.getOpacity(this.rawOpacity);
                        this.rawAreaOpacity = this.getOpacity(this.rawAreaOpacity);
                    };
                    LineDescriptor.prototype.getOpacity = function (opacity) {
                        return Math.min(this.maxOpacity, Math.max(this.minOpacity, opacity));
                    };
                    LineDescriptor.prototype.shouldKeyBeEnumerated = function (key) {
                        if (key === "interpolation" && this.shouldMatchKpiColor) {
                            return false;
                        }
                        if (key === "interpolationWithColorizedLine" && !this.shouldMatchKpiColor) {
                            return false;
                        }
                        if (key === "rawAreaOpacity" && this.lineType !== LineType.area) {
                            return false;
                        }
                        return this.hasOwnProperty(key);
                    };
                    return LineDescriptor;
                }(powerKpi.BaseDescriptor));
                powerKpi.LineDescriptor = LineDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                powerKpi.horizontalPositionEnum = powerbi.createEnumType([
                    {
                        value: "Left",
                        displayName: "Left"
                    },
                    {
                        value: "Right",
                        displayName: "Right"
                    },
                ]);
                powerKpi.layoutEnum = powerbi.createEnumType([
                    { value: "Top", displayName: "Top" },
                    { value: "Left", displayName: "Left" },
                    { value: "Bottom", displayName: "Bottom" },
                    { value: "Right", displayName: "Right" }
                ]);
                powerKpi.positionEnum = powerbi.createEnumType([
                    { value: "Top", displayName: "Top" },
                    { value: "Bottom", displayName: "Bottom" },
                    { value: "Left", displayName: "Left" },
                    { value: "Right", displayName: "Right" },
                    { value: "TopCenter", displayName: "Top Center" },
                    { value: "BottomCenter", displayName: "Bottom Center" },
                    { value: "LeftCenter", displayName: "Left Center" },
                    { value: "RightCenter", displayName: "Right Center" }
                ]);
                var LayoutDescriptor = /** @class */ (function (_super) {
                    __extends(LayoutDescriptor, _super);
                    function LayoutDescriptor() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this._minSupportedHeight = 250;
                        _this.autoHideVisualComponents = true;
                        _this.auto = true;
                        _this.layout = powerKpi.LayoutEnum[powerKpi.LayoutEnum.Top];
                        return _this;
                    }
                    LayoutDescriptor.prototype.parse = function (options) {
                        if (this.auto) {
                            Object.defineProperty(this, "layout", {
                                enumerable: false
                            });
                            if (options.viewport.height < this._minSupportedHeight) {
                                this._layout = powerKpi.LayoutEnum[powerKpi.LayoutEnum.Left];
                            }
                            else {
                                this._layout = powerKpi.LayoutEnum[powerKpi.LayoutEnum.Top];
                            }
                            return;
                        }
                        this._layout = this.layout;
                    };
                    LayoutDescriptor.prototype.getLayout = function () {
                        return this._layout;
                    };
                    return LayoutDescriptor;
                }(powerKpi.BaseDescriptor));
                powerKpi.LayoutDescriptor = LayoutDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var TooltipDescriptor = /** @class */ (function (_super) {
                    __extends(TooltipDescriptor, _super);
                    function TooltipDescriptor() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.show = true;
                        return _this;
                    }
                    return TooltipDescriptor;
                }(powerKpi.NumberDescriptorBase));
                powerKpi.TooltipDescriptor = TooltipDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var TooltipLabelDescriptor = /** @class */ (function (_super) {
                    __extends(TooltipLabelDescriptor, _super);
                    function TooltipLabelDescriptor() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.label = "";
                        return _this;
                    }
                    return TooltipLabelDescriptor;
                }(powerKpi.TooltipDescriptor));
                powerKpi.TooltipLabelDescriptor = TooltipLabelDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var DotsDescriptor = /** @class */ (function (_super) {
                    __extends(DotsDescriptor, _super);
                    function DotsDescriptor() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.radiusFactor = 1.4;
                        return _this;
                    }
                    DotsDescriptor.prototype.getMarginByThickness = function (thickness, defaultMargin) {
                        if (isNaN(thickness)) {
                            return defaultMargin;
                        }
                        var currentThickness = thickness * this.radiusFactor;
                        return {
                            top: currentThickness,
                            right: currentThickness,
                            bottom: currentThickness,
                            left: currentThickness
                        };
                    };
                    return DotsDescriptor;
                }(powerKpi.BaseDescriptor));
                powerKpi.DotsDescriptor = DotsDescriptor;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // powerbi.extensibility.utils.dataview
                var DataViewObjects = powerbi.extensibility.utils.dataview.DataViewObjects;
                var DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
                // powerbi.extensibility.utils.dataview
                var SettingsBase = /** @class */ (function (_super) {
                    __extends(SettingsBase, _super);
                    function SettingsBase() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    SettingsBase.prototype.parse = function (dataView) {
                        return this.parseObjects(dataView
                            && dataView.metadata
                            && dataView.metadata.objects);
                    };
                    SettingsBase.prototype.parseObjects = function (objects) {
                        if (objects) {
                            var properties = this.getProperties();
                            for (var objectName in properties) {
                                for (var propertyName in properties[objectName]) {
                                    var defaultValue = this[objectName][propertyName];
                                    this[objectName][propertyName] = DataViewObjects.getCommonValue(objects, properties[objectName][propertyName], defaultValue);
                                }
                                this.processDescriptor(this[objectName]);
                            }
                        }
                        return this;
                    };
                    SettingsBase.prototype.processDescriptor = function (descriptor) {
                        if (!descriptor || !descriptor.parse) {
                            return;
                        }
                        descriptor.parse();
                    };
                    SettingsBase.prototype.enumerateObjectInstances = function (options) {
                        var descriptor = this[options.objectName];
                        if (!descriptor) {
                            return [];
                        }
                        return [{
                                objectName: options.objectName,
                                selector: null,
                                properties: descriptor.enumerateProperties(),
                            }];
                    };
                    return SettingsBase;
                }(DataViewObjectsParser));
                powerKpi.SettingsBase = SettingsBase;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var SeriesSettings = /** @class */ (function (_super) {
                    __extends(SeriesSettings, _super);
                    function SeriesSettings() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.line = new powerKpi.LineDescriptor();
                        return _this;
                    }
                    SeriesSettings.prototype.parseObjects = function (objects) {
                        if (objects) {
                            var lineObject = (objects.line || {});
                            if (!lineObject.fillColor
                                && objects.series
                                && objects.series.fillColor) {
                                lineObject.fillColor = objects.series.fillColor;
                            }
                            if (!lineObject.lineStyle
                                && objects.lineStyle
                                && objects.lineStyle.lineStyle !== undefined
                                && objects.lineStyle.lineStyle !== null) {
                                lineObject.lineStyle = objects.lineStyle.lineStyle;
                            }
                            if (!lineObject.thickness
                                && objects.lineThickness
                                && objects.lineThickness.thickness !== undefined
                                && objects.lineThickness.thickness !== null) {
                                lineObject.thickness = objects.lineThickness.thickness;
                            }
                            return _super.prototype.parseObjects.call(this, __assign({}, objects, { line: lineObject }));
                        }
                        return _super.prototype.parseObjects.call(this, objects);
                    };
                    return SeriesSettings;
                }(powerKpi.SettingsBase));
                powerKpi.SeriesSettings = SeriesSettings;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                /* These viewports describe the minimal viewport for each visual component */
                var kpiCaptionViewport = {
                    width: 90,
                    height: 90
                };
                var kpiLabelViewport = {
                    width: 165,
                    height: 165
                };
                var subtitleViewport = {
                    width: 150,
                    height: 150
                };
                var legendViewport = {
                    width: 120,
                    height: 120
                };
                var LabelsViewport = {
                    width: 80,
                    height: 80
                };
                var axisViewportToDecreaseFontSize = {
                    width: 70,
                    height: 70
                };
                var axisViewportToIncreaseDensity = {
                    width: 250,
                    height: 250
                };
                var Settings = /** @class */ (function (_super) {
                    __extends(Settings, _super);
                    function Settings() {
                        var _this = _super.call(this) || this;
                        _this.layout = new powerKpi.LayoutDescriptor();
                        _this.title = new powerKpi.FakeTitleDescriptor();
                        _this.subtitle = new powerKpi.SubtitleDescriptor(subtitleViewport);
                        _this.kpiIndicator = new powerKpi.KPIIndicatorDescriptor(kpiCaptionViewport);
                        _this.kpiIndicatorValue = new powerKpi.KPIIndicatorValueSignDescriptor(kpiCaptionViewport);
                        _this.kpiIndicatorLabel = new powerKpi.KPIIndicatorCustomizableLabelDescriptor(kpiLabelViewport);
                        _this.secondKPIIndicatorValue = new powerKpi.KPIIndicatorValueDescriptor(kpiCaptionViewport);
                        _this.secondKPIIndicatorLabel = new powerKpi.KPIIndicatorCustomizableLabelDescriptor(kpiLabelViewport);
                        _this.actualValueKPI = new powerKpi.KPIIndicatorValueDescriptor(kpiCaptionViewport);
                        _this.actualLabelKPI = new powerKpi.KPIIndicatorLabelDescriptor(kpiLabelViewport);
                        _this.dateValueKPI = new powerKpi.KPIIndicatorValueDescriptor(kpiCaptionViewport, true);
                        _this.dateLabelKPI = new powerKpi.KPIIndicatorLabelDescriptor(kpiLabelViewport);
                        _this.labels = new powerKpi.LabelsDescriptor(LabelsViewport);
                        _this.line = new powerKpi.LineDescriptor();
                        _this.dots = new powerKpi.DotsDescriptor();
                        _this.legend = new powerKpi.LegendDescriptor(legendViewport);
                        _this.xAxis = new powerKpi.AxisDescriptor(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, true);
                        _this.yAxis = new powerKpi.YAxisDescriptor(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, false);
                        _this.secondaryYAxis = new powerKpi.YAxisDescriptor(axisViewportToDecreaseFontSize, axisViewportToIncreaseDensity, false);
                        _this.referenceLineOfXAxis = new powerKpi.AxisReferenceLineDescriptor(false);
                        _this.referenceLineOfYAxis = new powerKpi.AxisReferenceLineDescriptor();
                        _this.secondaryReferenceLineOfYAxis = new powerKpi.AxisReferenceLineDescriptor(false);
                        _this.tooltipLabel = new powerKpi.TooltipDescriptor(undefined, true);
                        _this.tooltipVariance = new powerKpi.TooltipLabelDescriptor();
                        _this.secondTooltipVariance = new powerKpi.TooltipLabelDescriptor();
                        _this.tooltipValues = new powerKpi.TooltipDescriptor();
                        var percentageFormat = "+0.00 %;-0.00 %;0.00 %";
                        _this.kpiIndicatorValue.defaultFormat = percentageFormat;
                        _this.secondKPIIndicatorValue.defaultFormat = percentageFormat;
                        _this.tooltipVariance.defaultFormat = percentageFormat;
                        _this.secondTooltipVariance.defaultFormat = percentageFormat;
                        return _this;
                    }
                    Settings.prototype.parseSettings = function (viewport, type) {
                        var _this = this;
                        var options = {
                            viewport: viewport,
                            type: type,
                            isAutoHideBehaviorEnabled: this.layout.autoHideVisualComponents
                        };
                        Object.keys(this)
                            .forEach(function (settingName) {
                            var settingsObj = _this[settingName];
                            if (settingsObj.parse) {
                                settingsObj.parse(options);
                            }
                        });
                    };
                    Settings.prototype.processDescriptor = function (descriptor) { };
                    return Settings;
                }(powerKpi.SettingsBase));
                powerKpi.Settings = Settings;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var DataRepresentationScale = /** @class */ (function () {
                    function DataRepresentationScale(scale, isOrdinal) {
                        if (scale === void 0) { scale = null; }
                        if (isOrdinal === void 0) { isOrdinal = false; }
                        this.isOrdinalScale = false;
                        this.baseScale = scale;
                        this.isOrdinalScale = isOrdinal;
                    }
                    DataRepresentationScale.create = function () {
                        return new DataRepresentationScale();
                    };
                    DataRepresentationScale.prototype.domain = function (values, type) {
                        var scale;
                        if (values && values.length) {
                            switch (type) {
                                case powerKpi.DataRepresentationTypeEnum.DateType: {
                                    scale = d3.time.scale();
                                    break;
                                }
                                case powerKpi.DataRepresentationTypeEnum.NumberType: {
                                    scale = d3.scale.linear();
                                    break;
                                }
                                case powerKpi.DataRepresentationTypeEnum.StringType: {
                                    scale = d3.scale.ordinal();
                                    this.isOrdinalScale = true;
                                    break;
                                }
                            }
                        }
                        if (scale) {
                            scale.domain(values);
                        }
                        this.baseScale = scale;
                        return this;
                    };
                    DataRepresentationScale.prototype.getDomain = function () {
                        if (!this.baseScale) {
                            return [];
                        }
                        return this.baseScale.domain() || [];
                    };
                    DataRepresentationScale.prototype.scale = function (value) {
                        if (!this.baseScale) {
                            return 0;
                        }
                        return this.baseScale(value);
                    };
                    DataRepresentationScale.prototype.copy = function () {
                        return new DataRepresentationScale(this.baseScale && this.baseScale.copy(), this.isOrdinalScale);
                    };
                    DataRepresentationScale.prototype.range = function (rangeValues) {
                        if (this.baseScale) {
                            if (this.isOrdinalScale) {
                                this.baseScale.rangePoints(rangeValues);
                            }
                            else {
                                this.baseScale.range(rangeValues);
                            }
                        }
                        return this;
                    };
                    Object.defineProperty(DataRepresentationScale.prototype, "isOrdinal", {
                        get: function () {
                            return this.isOrdinalScale;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return DataRepresentationScale;
                }());
                powerKpi.DataRepresentationScale = DataRepresentationScale;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var DataRepresentationTypeEnum;
                (function (DataRepresentationTypeEnum) {
                    DataRepresentationTypeEnum[DataRepresentationTypeEnum["None"] = 0] = "None";
                    DataRepresentationTypeEnum[DataRepresentationTypeEnum["DateType"] = 1] = "DateType";
                    DataRepresentationTypeEnum[DataRepresentationTypeEnum["NumberType"] = 2] = "NumberType";
                    DataRepresentationTypeEnum[DataRepresentationTypeEnum["StringType"] = 3] = "StringType";
                })(DataRepresentationTypeEnum = powerKpi.DataRepresentationTypeEnum || (powerKpi.DataRepresentationTypeEnum = {}));
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var DataRepresentationPointFilter = /** @class */ (function () {
                    function DataRepresentationPointFilter() {
                    }
                    DataRepresentationPointFilter.prototype.isPointValid = function (point) {
                        return point
                            && point.y !== null
                            && point.y !== undefined
                            && !isNaN(point.y);
                    };
                    DataRepresentationPointFilter.prototype.groupPointByColor = function (gradientPoints, point) {
                        if (!this.isPointValid(point) || !gradientPoints) {
                            return;
                        }
                        var currentGradient = gradientPoints.slice(-1)[0];
                        if (!currentGradient) {
                            gradientPoints.push({
                                color: point.color,
                                points: [point],
                            });
                        }
                        else if (currentGradient && currentGradient.color === point.color) {
                            currentGradient.points.push(point);
                        }
                        else if (currentGradient && currentGradient.color !== point.color) {
                            currentGradient.points.push(point);
                            gradientPoints.push({
                                color: point.color,
                                points: [point],
                            });
                        }
                    };
                    return DataRepresentationPointFilter;
                }());
                powerKpi.DataRepresentationPointFilter = DataRepresentationPointFilter;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var VarianceConverter = /** @class */ (function () {
                    function VarianceConverter() {
                        this.pointFilter = new powerKpi.DataRepresentationPointFilter();
                    }
                    VarianceConverter.prototype.getVarianceByCurrentPointsOfSeries = function (firstSeries, secondSeries) {
                        if (!this.isSeriesValid(firstSeries) || !this.isSeriesValid(secondSeries)) {
                            return NaN;
                        }
                        var firstPoint = firstSeries.current, index = firstPoint.index, secondPoint = !isNaN(index) && secondSeries.points[index];
                        return this.getVarianceByPoints(firstPoint, secondPoint);
                    };
                    VarianceConverter.prototype.isSeriesValid = function (series) {
                        return series && series.current && series.current.y !== null;
                    };
                    VarianceConverter.prototype.getVarianceByPoints = function (firstPoint, secondePoint) {
                        if (!this.pointFilter.isPointValid(firstPoint) || !this.pointFilter.isPointValid(secondePoint)) {
                            return NaN;
                        }
                        return this.getVariance(firstPoint.y, secondePoint.y);
                    };
                    VarianceConverter.prototype.getVariance = function (firstValue, secondValue) {
                        return firstValue / secondValue - 1;
                    };
                    return VarianceConverter;
                }());
                powerKpi.VarianceConverter = VarianceConverter;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var SelectionIdBuilder = powerbi.visuals.SelectionIdBuilder;
                var DataConverter = /** @class */ (function (_super) {
                    __extends(DataConverter, _super);
                    function DataConverter() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    DataConverter.prototype.convert = function (options) {
                        var dataRepresentation = this.process(options);
                        this.postProcess(dataRepresentation);
                        return dataRepresentation;
                    };
                    DataConverter.prototype.process = function (options) {
                        var _this = this;
                        var dataView = options.dataView, viewport = options.viewport, style = options.style, hasSelection = options.hasSelection;
                        var settings = powerKpi.Settings.parse(dataView);
                        var type = powerKpi.DataRepresentationTypeEnum.None;
                        var dataRepresentation = {
                            viewport: viewport,
                            settings: settings,
                            series: [],
                            groups: [],
                            sortedSeries: [],
                            x: {
                                type: type,
                                values: [],
                                min: undefined,
                                max: undefined,
                                metadata: undefined,
                                name: undefined,
                                format: undefined,
                                scale: powerKpi.DataRepresentationScale.create()
                            },
                            variance: [],
                            variances: [],
                            margin: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0
                            },
                            isGrouped: false,
                        };
                        if (!dataView
                            || !dataView.categorical
                            || !dataView.categorical.categories
                            || !dataView.categorical.categories[0]
                            || !dataView.categorical.categories[0].values
                            || !dataView.categorical.values
                            || !dataView.categorical.values.grouped) {
                            return dataRepresentation;
                        }
                        var axisCategory = dataView.categorical.categories[0];
                        var axisCategoryType = axisCategory.source.type;
                        dataRepresentation.x.metadata = axisCategory.source;
                        dataRepresentation.x.name = axisCategory.source.displayName;
                        if (axisCategoryType.dateTime) {
                            type = powerKpi.DataRepresentationTypeEnum.DateType;
                        }
                        else if (axisCategoryType.integer || axisCategoryType.numeric) {
                            type = powerKpi.DataRepresentationTypeEnum.NumberType;
                        }
                        else if (axisCategoryType.text) {
                            type = powerKpi.DataRepresentationTypeEnum.StringType;
                        }
                        settings.parse(dataView);
                        settings.parseSettings(viewport, type);
                        dataRepresentation.x.type = type;
                        var maxThickness = NaN;
                        var seriesColorIndex = 0;
                        if (dataView.categorical.values
                            && dataView.categorical.values.source
                            && dataView.categorical.values.source.displayName
                            && settings.legend.titleText === undefined) {
                            settings.legend.titleText = dataView.categorical.values.source.displayName;
                        }
                        dataView.categorical.values.grouped().forEach(function (group) {
                            var groupedValues = group.values;
                            var currentKPIColumn = groupedValues
                                .filter(function (groupedValue) {
                                return groupedValue.source.roles[powerKpi.kpiColumn.name];
                            });
                            var kpiIndexes = (currentKPIColumn
                                && currentKPIColumn[0]
                                && currentKPIColumn[0].values) || [];
                            groupedValues.forEach(function (groupedValue) {
                                var format = _this.getFormatStringByColumn(groupedValue.source);
                                if (groupedValue.source.roles[powerKpi.kpiIndicatorValueColumn.name]) {
                                    dataRepresentation.variances[0] = groupedValue.values;
                                    settings.kpiIndicatorValue.setColumnFormat(format);
                                    settings.tooltipVariance.setColumnFormat(format);
                                }
                                if (groupedValue.source.roles[powerKpi.secondKPIIndicatorValueColumn.name]) {
                                    dataRepresentation.variances[1] = groupedValue.values;
                                    settings.secondKPIIndicatorValue.setColumnFormat(format);
                                    settings.secondTooltipVariance.setColumnFormat(format);
                                }
                                var groupIndex = -1;
                                if (groupedValue.source.roles[powerKpi.valuesColumn.name]) {
                                    groupIndex = 0;
                                }
                                else if (groupedValue.source.roles[powerKpi.secondaryValuesColumn.name]) {
                                    groupIndex = 1;
                                }
                                if (groupIndex !== -1) {
                                    if (!dataRepresentation.groups[groupIndex]) {
                                        dataRepresentation.groups[groupIndex] = {
                                            series: [],
                                            y: {
                                                format: format,
                                                min: undefined,
                                                max: undefined,
                                                scale: powerKpi.DataRepresentationScale.create(),
                                            }
                                        };
                                    }
                                    var seriesGroup_1 = dataRepresentation.groups[groupIndex];
                                    var currentPoint_1 = {
                                        x: null,
                                        y: NaN,
                                        index: NaN,
                                        kpiIndex: NaN,
                                        color: undefined,
                                    };
                                    var seriesSettings_1 = powerKpi.SeriesSettings.getDefault();
                                    for (var propertyName in seriesSettings_1) {
                                        var descriptor = seriesSettings_1[propertyName];
                                        var defaultDescriptor = settings[propertyName];
                                        if (descriptor && descriptor.applyDefault && defaultDescriptor) {
                                            descriptor.applyDefault(defaultDescriptor);
                                        }
                                    }
                                    seriesSettings_1.parseObjects(group.objects || groupedValue.source.objects);
                                    if (!seriesSettings_1.line.fillColor
                                        && style
                                        && style.colorPalette
                                        && style.colorPalette.dataColors) {
                                        seriesSettings_1.line.fillColor = style.colorPalette.dataColors
                                            .getColorByIndex(seriesColorIndex)
                                            .value;
                                        seriesColorIndex++;
                                    }
                                    var gradientPoints_1 = [];
                                    var seriesY_1 = {
                                        min: undefined,
                                        max: undefined,
                                    };
                                    var points = axisCategory
                                        .values
                                        .map(function (axisValue, categoryIndex) {
                                        var value = groupedValue.values[categoryIndex];
                                        _this.applyXArguments(dataRepresentation, axisValue);
                                        _this.applyYArguments(seriesGroup_1.y, value);
                                        _this.applyYArguments(seriesY_1, value);
                                        var kpiIndex = _this.getKPIIndex(kpiIndexes[categoryIndex]);
                                        var color = seriesSettings_1.line.fillColor;
                                        if (seriesSettings_1.line.shouldMatchKpiColor) {
                                            var currentKPI = settings
                                                .kpiIndicator
                                                .getCurrentKPI(kpiIndex);
                                            color = currentKPI && currentKPI.color || color;
                                        }
                                        if (value !== null) {
                                            currentPoint_1.x = axisValue;
                                            currentPoint_1.y = value;
                                            currentPoint_1.index = categoryIndex;
                                            currentPoint_1.kpiIndex = kpiIndex;
                                            currentPoint_1.color = color;
                                        }
                                        var point = {
                                            color: color,
                                            kpiIndex: kpiIndex,
                                            x: axisValue,
                                            y: value,
                                        };
                                        _this.pointFilter.groupPointByColor(gradientPoints_1, point);
                                        return point;
                                    });
                                    var isGrouped = group && !!group.identity;
                                    if (isGrouped) {
                                        dataRepresentation.isGrouped = isGrouped;
                                    }
                                    var identity = SelectionIdBuilder.builder()
                                        .withSeries(dataView.categorical.values, isGrouped
                                        ? group
                                        : groupedValue)
                                        .withMeasure(groupedValue.source.queryName)
                                        .createSelectionId();
                                    if (isNaN(maxThickness) || seriesSettings_1.line.thickness > maxThickness) {
                                        maxThickness = seriesSettings_1.line.thickness;
                                    }
                                    var name_1 = isGrouped && group.name
                                        ? group.name + " - " + groupedValue.source.displayName
                                        : groupedValue.source.displayName;
                                    var groupName = isGrouped && group.name
                                        ? "" + group.name
                                        : undefined;
                                    seriesGroup_1.series.push({
                                        name: name_1,
                                        points: points,
                                        format: format,
                                        identity: identity,
                                        groupName: groupName,
                                        hasSelection: hasSelection,
                                        gradientPoints: gradientPoints_1,
                                        domain: seriesY_1,
                                        y: seriesGroup_1.y,
                                        current: currentPoint_1,
                                        settings: seriesSettings_1,
                                        selected: false,
                                    });
                                }
                            });
                        });
                        var axisCategoryFormat = this.getFormatStringByColumn(axisCategory && axisCategory.source);
                        dataRepresentation.settings.dateValueKPI.setColumnFormat(axisCategoryFormat);
                        dataRepresentation.settings.tooltipLabel.setColumnFormat(axisCategoryFormat);
                        dataRepresentation.x.values = axisCategory.values;
                        // Applies series formats
                        dataRepresentation.x.format = dataRepresentation.settings.dateValueKPI.getFormat();
                        this.getXAxisScale(dataRepresentation.x.scale, dataRepresentation.x.min, dataRepresentation.x.max, dataRepresentation.x.type, axisCategory.values);
                        dataRepresentation.margin = settings.dots.getMarginByThickness(maxThickness, dataRepresentation.margin);
                        var group = dataRepresentation.groups
                            && (dataRepresentation.groups[0] || dataRepresentation.groups[1]);
                        if (dataRepresentation.variances[0]) {
                            dataRepresentation.variance.push(dataRepresentation.variances[0]
                                && dataRepresentation.variances[0].length
                                && dataRepresentation.variances[0].slice(-1)[0] || NaN);
                        }
                        else {
                            dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(group && group.series[0], group && group.series[1]));
                        }
                        if (dataRepresentation.variances[1]) {
                            dataRepresentation.variance.push(dataRepresentation.variances[1]
                                && dataRepresentation.variances[1].length
                                && dataRepresentation.variances[1].slice(-1)[0] || NaN);
                        }
                        else {
                            dataRepresentation.variance.push(this.getVarianceByCurrentPointsOfSeries(group && group.series[0], group && group.series[2]));
                        }
                        return dataRepresentation;
                    };
                    DataConverter.prototype.postProcess = function (dataRepresentation) {
                        var _this = this;
                        if (!dataRepresentation || !dataRepresentation.groups) {
                            return;
                        }
                        var groups = dataRepresentation.groups, settings = dataRepresentation.settings, viewport = dataRepresentation.viewport;
                        dataRepresentation.groups.forEach(function (seriesGroup, seriesGroupIndex) {
                            if (seriesGroup) {
                                dataRepresentation.series = dataRepresentation.series.concat(seriesGroup.series);
                                var yAxisSettings = seriesGroupIndex === 0
                                    ? settings.yAxis
                                    : settings.secondaryYAxis;
                                var yMin = _this.getNotNaNValue(yAxisSettings.min, seriesGroup.y.min);
                                var yMax = _this.getNotNaNValue(yAxisSettings.max, seriesGroup.y.max);
                                seriesGroup.y.min = Math.min(yMin, yMax);
                                seriesGroup.y.max = Math.max(yMin, yMax);
                                seriesGroup.y.scale.domain([seriesGroup.y.min, seriesGroup.y.max], powerKpi.DataRepresentationTypeEnum.NumberType);
                            }
                        });
                        dataRepresentation.sortedSeries = this.sortSeries(dataRepresentation.series, viewport.height);
                    };
                    DataConverter.prototype.sortSeries = function (series, height) {
                        return series
                            .slice()
                            .sort(function (a, b) {
                            // To sort series we have to convert value to px as scales are not the same
                            var aYScale = a.y.scale
                                .copy()
                                .range([height, 0]);
                            var bYScale = b.y.scale
                                .copy()
                                .range([height, 0]);
                            var bScaledMin = bYScale.scale(b.domain.min);
                            var bScaledMax = bYScale.scale(b.domain.max);
                            var aScaledMin = aYScale.scale(a.domain.min);
                            var aScaledMax = aYScale.scale(a.domain.max);
                            return (aScaledMax - bScaledMax)
                                || (aScaledMin - bScaledMin); // Brackets are not required but they make this condition simpler to understand
                        });
                    };
                    DataConverter.prototype.applyXArguments = function (dataRepresentation, axisValue) {
                        if (dataRepresentation.x.min === undefined) {
                            dataRepresentation.x.min = axisValue;
                        }
                        if (dataRepresentation.x.max === undefined) {
                            dataRepresentation.x.max = axisValue;
                        }
                        if (dataRepresentation.x.type === powerKpi.DataRepresentationTypeEnum.DateType
                            || dataRepresentation.x.type === powerKpi.DataRepresentationTypeEnum.NumberType) {
                            if (axisValue < dataRepresentation.x.min) {
                                dataRepresentation.x.min = axisValue;
                            }
                            if (axisValue > dataRepresentation.x.max) {
                                dataRepresentation.x.max = axisValue;
                            }
                        }
                        else if (dataRepresentation.x.type === powerKpi.DataRepresentationTypeEnum.StringType) {
                            var textLength = this.getLength(axisValue);
                            if (textLength < this.getLength(dataRepresentation.x.min)) {
                                dataRepresentation.x.min = axisValue;
                            }
                            if (textLength > this.getLength(dataRepresentation.x.max)) {
                                dataRepresentation.x.max = axisValue;
                            }
                        }
                    };
                    DataConverter.prototype.getNotNaNValue = function (value, fallbackValue) {
                        return isNaN(value)
                            ? fallbackValue
                            : value;
                    };
                    DataConverter.prototype.getLength = function (text) {
                        if (!text || !text.length) {
                            return 0;
                        }
                        return text.length;
                    };
                    DataConverter.prototype.applyYArguments = function (axis, value) {
                        if (axis.min === undefined) {
                            axis.min = value;
                        }
                        if (axis.max === undefined) {
                            axis.max = value;
                        }
                        if (value !== null && value < axis.min) {
                            axis.min = value;
                        }
                        if (value !== null && value > axis.max) {
                            axis.max = value;
                        }
                    };
                    DataConverter.prototype.getKPIIndex = function (kpiIndex) {
                        return kpiIndex === undefined
                            || kpiIndex === null
                            || isNaN(kpiIndex)
                            || kpiIndex instanceof Date
                            ? NaN
                            : kpiIndex;
                    };
                    DataConverter.prototype.getXAxisScale = function (scale, min, max, type, categoryValues) {
                        var values;
                        switch (type) {
                            case powerKpi.DataRepresentationTypeEnum.DateType:
                            case powerKpi.DataRepresentationTypeEnum.NumberType: {
                                values = [min, max];
                                break;
                            }
                            case powerKpi.DataRepresentationTypeEnum.StringType: {
                                values = categoryValues;
                                break;
                            }
                        }
                        return scale.domain(values, type);
                    };
                    DataConverter.prototype.getFormatStringByColumn = function (column) {
                        if (!column || !column.format) {
                            return undefined;
                        }
                        return column.format;
                    };
                    return DataConverter;
                }(powerKpi.VarianceConverter));
                powerKpi.DataConverter = DataConverter;
                function createConverter() {
                    return new DataConverter();
                }
                powerKpi.createConverter = createConverter;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
                var BaseComponent = /** @class */ (function () {
                    function BaseComponent() {
                        this.isComponentShown = true;
                        this.classNamePrefix = "powerKpi_";
                        this.hiddenClassName = this.getClassNameWithPrefix("hidden");
                        this.boldClassName = this.getClassNameWithPrefix("bold");
                        this.italicClassName = this.getClassNameWithPrefix("italic");
                        this.underlinedClassName = this.getClassNameWithPrefix("underlined");
                        this.minWidth = 20;
                        this.width = 0;
                        this.minHeight = 20;
                        this.height = 0;
                    }
                    BaseComponent.prototype.highlight = function (hasSelection) { };
                    BaseComponent.prototype.initElement = function (baseElement, className, tagName) {
                        if (tagName === void 0) { tagName = "div"; }
                        this.element = this.createElement(baseElement, className, tagName);
                    };
                    BaseComponent.prototype.createElement = function (baseElement, className, tagName) {
                        if (tagName === void 0) { tagName = "div"; }
                        return baseElement
                            .append(tagName)
                            .classed(this.getClassNameWithPrefix(className), true);
                    };
                    BaseComponent.prototype.getClassNameWithPrefix = function (className) {
                        return className
                            ? "" + this.classNamePrefix + className
                            : className;
                    };
                    BaseComponent.prototype.getSelectorWithPrefix = function (className) {
                        return createClassAndSelector(this.getClassNameWithPrefix(className));
                    };
                    BaseComponent.prototype.clear = function () {
                        if (!this.element) {
                            return;
                        }
                        this.clearElement(this.element);
                    };
                    BaseComponent.prototype.clearElement = function (element) {
                        element
                            .selectAll("*")
                            .remove();
                    };
                    BaseComponent.prototype.destroy = function () {
                        if (this.element) {
                            this.element.remove();
                        }
                        this.element = null;
                        this.constructorOptions = null;
                        this.renderOptions = null;
                    };
                    BaseComponent.prototype.updateViewport = function (viewport) {
                        this.element.style({
                            width: PixelConverter.toString(viewport.width),
                            height: PixelConverter.toString(viewport.height)
                        });
                    };
                    BaseComponent.prototype.hide = function () {
                        if (!this.element || !this.isComponentShown) {
                            return;
                        }
                        this.element.style("display", "none");
                        this.isComponentShown = false;
                    };
                    BaseComponent.prototype.show = function () {
                        if (!this.element || this.isComponentShown) {
                            return;
                        }
                        this.element.style("display", null);
                        this.isComponentShown = true;
                    };
                    BaseComponent.prototype.toggle = function () {
                        if (this.isComponentShown) {
                            this.hide();
                        }
                        else {
                            this.show();
                        }
                    };
                    Object.defineProperty(BaseComponent.prototype, "isShown", {
                        get: function () {
                            return this.isComponentShown;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    BaseComponent.prototype.updateBackgroundColor = function (element, color) {
                        if (!element) {
                            return;
                        }
                        element.style("background-color", color || null);
                    };
                    BaseComponent.prototype.updateSize = function (width, height) {
                        if (!isNaN(width) && isFinite(width)) {
                            this.width = Math.max(this.minWidth, width);
                        }
                        else {
                            this.width = undefined;
                        }
                        if (!isNaN(height) && isFinite(height)) {
                            this.height = Math.max(this.minHeight, height);
                        }
                        else {
                            this.height = undefined;
                        }
                        this.updateSizeOfElement(this.width, this.height);
                    };
                    BaseComponent.prototype.updateSizeOfElement = function (width, height) {
                        if (!this.element) {
                            return;
                        }
                        var styleObject = {};
                        styleObject["width"]
                            = styleObject["min-width"]
                                = styleObject["max-width"]
                                    = width !== undefined && width !== null
                                        ? PixelConverter.toString(width)
                                        : null;
                        styleObject["height"]
                            = styleObject["min-height"]
                                = styleObject["max-height"]
                                    = height !== undefined && height !== null
                                        ? PixelConverter.toString(height)
                                        : null;
                        this.element.style(styleObject);
                    };
                    BaseComponent.prototype.getViewport = function () {
                        return {
                            width: this.width,
                            height: this.height,
                        };
                    };
                    BaseComponent.prototype.updateElementOrder = function (element, order) {
                        if (!element) {
                            return;
                        }
                        var browserSpecificOrder = order + 1;
                        element.style({
                            "-webkit-box-ordinal-group": browserSpecificOrder,
                            "-ms-flex-order": order,
                            order: order,
                        });
                    };
                    BaseComponent.prototype.updateElementOpacity = function (element, opacity, selected, hasSelection) {
                        if (!element) {
                            return;
                        }
                        var shouldBeSelected = hasSelection
                            ? selected
                            : true;
                        element.style("opacity", shouldBeSelected ? opacity : opacity / 3);
                    };
                    BaseComponent.prototype.getRenderOptions = function () {
                        return this.renderOptions || null;
                    };
                    BaseComponent.prototype.clickHandler = function () {
                        if (!this.constructorOptions
                            || !this.constructorOptions.eventDispatcher) {
                            return;
                        }
                        this.constructorOptions.eventDispatcher[powerKpi.EventName.onClick](this, d3.event);
                    };
                    return BaseComponent;
                }());
                powerKpi.BaseComponent = BaseComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var BaseContainerComponent = /** @class */ (function (_super) {
                    __extends(BaseContainerComponent, _super);
                    function BaseContainerComponent() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.components = [];
                        return _this;
                    }
                    BaseContainerComponent.prototype.clear = function (components) {
                        if (components === void 0) { components = this.components; }
                        this.forEach(components, function (component) {
                            component.clear();
                        });
                        _super.prototype.clear.call(this);
                    };
                    BaseContainerComponent.prototype.destroy = function (components) {
                        if (components === void 0) { components = this.components; }
                        this.destroyComponents(components);
                        _super.prototype.destroy.call(this);
                    };
                    BaseContainerComponent.prototype.destroyComponents = function (components) {
                        if (components === void 0) { components = this.components; }
                        this.forEach(components.splice(0, components.length), function (component) {
                            component.destroy();
                        });
                    };
                    BaseContainerComponent.prototype.forEach = function (components, iterator) {
                        components.forEach(function (component, index) {
                            if (component) {
                                iterator(component, index);
                            }
                        });
                    };
                    BaseContainerComponent.prototype.initComponents = function (components, expectedAmountOfComponents, initComponent) {
                        if (!components) {
                            return;
                        }
                        components
                            .splice(expectedAmountOfComponents)
                            .forEach(function (component) {
                            component.clear();
                            component.destroy();
                        });
                        if (components.length < expectedAmountOfComponents) {
                            for (var index = components.length; index < expectedAmountOfComponents; index++) {
                                components.push(initComponent(index));
                            }
                        }
                    };
                    BaseContainerComponent.prototype.highlight = function (hasSelection, components) {
                        if (components === void 0) { components = this.components; }
                        this.forEach(components, function (component) {
                            if (component.highlight) {
                                component.highlight(hasSelection);
                            }
                        });
                    };
                    return BaseContainerComponent;
                }(powerKpi.BaseComponent));
                powerKpi.BaseContainerComponent = BaseContainerComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon.CssConstants
                var PixelConverter = jsCommon.PixelConverter;
                var LineComponent = /** @class */ (function (_super) {
                    __extends(LineComponent, _super);
                    function LineComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "lineComponent";
                        _this.lineSelector = _this.getSelectorWithPrefix(_this.className + "_line");
                        _this.initElement(options.element, _this.className, "g");
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        return _this;
                    }
                    LineComponent.prototype.render = function (options) {
                        var _this = this;
                        var x = options.x, y = options.y, viewport = options.viewport, thickness = options.thickness, interpolation = options.interpolation, gradientPoints = options.gradientPoints, lineStyle = options.lineStyle, series = options.series;
                        this.renderOptions = options;
                        var xScale = x
                            .copy()
                            .range([0, viewport.width]);
                        var yScale = y
                            .copy()
                            .range([viewport.height, 0]);
                        this.lineSelection = this.element
                            .selectAll(this.lineSelector.selector)
                            .data(gradientPoints);
                        this.lineSelection.enter()
                            .append("svg:path")
                            .classed(this.lineSelector.class, true)
                            .on("click", this.clickHandler.bind(this));
                        this.lineSelection
                            .attr({
                            d: function (gradientGroup) {
                                return _this.getLine(xScale, yScale, interpolation)(gradientGroup.points);
                            },
                            "class": this.lineSelector.class + " " + lineStyle,
                        })
                            .style({
                            "stroke": function (gradientGroup) { return gradientGroup.color; },
                            "stroke-width": function () { return PixelConverter.toString(thickness); },
                        });
                        this.highlight(series && series.hasSelection);
                        this.lineSelection
                            .exit()
                            .remove();
                    };
                    LineComponent.prototype.getLine = function (xScale, yScale, interpolation) {
                        return d3.svg.line()
                            .x(function (data) {
                            return xScale.scale(data.x);
                        })
                            .y(function (data) {
                            return yScale.scale(data.y);
                        })
                            .interpolate(interpolation);
                    };
                    LineComponent.prototype.destroy = function () {
                        this.lineSelection = null;
                        _super.prototype.destroy.call(this);
                    };
                    LineComponent.prototype.highlight = function (hasSelection) {
                        this.updateElementOpacity(this.lineSelection, this.renderOptions && this.renderOptions.opacity, this.renderOptions && this.renderOptions.series && this.renderOptions.series.selected, hasSelection);
                    };
                    return LineComponent;
                }(powerKpi.BaseComponent));
                powerKpi.LineComponent = LineComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var AreaComponent = /** @class */ (function (_super) {
                    __extends(AreaComponent, _super);
                    function AreaComponent(options) {
                        var _this = _super.call(this, options) || this;
                        _this.additionalClassName = "areaComponent";
                        _this.areaSelector = _this.getSelectorWithPrefix(_this.additionalClassName + "_area");
                        _this.element.classed(_this.additionalClassName, true);
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        return _this;
                    }
                    AreaComponent.prototype.render = function (options) {
                        this.renderArea(options);
                        _super.prototype.render.call(this, options);
                    };
                    AreaComponent.prototype.renderArea = function (options) {
                        var _this = this;
                        var x = options.x, y = options.y, viewport = options.viewport, interpolation = options.interpolation, gradientPoints = options.gradientPoints, areaOpacity = options.areaOpacity, series = options.series;
                        this.renderOptions = options;
                        var xScale = x
                            .copy()
                            .range([0, viewport.width]);
                        var yScale = y
                            .copy()
                            .range([viewport.height, 0]);
                        this.areaSelection = this.element
                            .selectAll(this.areaSelector.selector)
                            .data(gradientPoints);
                        this.areaSelection.enter()
                            .append("svg:path")
                            .classed(this.areaSelector.class, true)
                            .on("click", this.clickHandler.bind(this));
                        this.areaSelection
                            .attr({
                            d: function (gradientGroup) {
                                return _this.getArea(xScale, yScale, viewport, interpolation)(gradientGroup.points);
                            },
                        })
                            .style("fill", function (gradientGroup) { return gradientGroup.color; });
                        this.highlight(series && series.hasSelection);
                        this.areaSelection
                            .exit()
                            .remove();
                    };
                    AreaComponent.prototype.getArea = function (xScale, yScale, viewport, interpolation) {
                        return d3.svg.area()
                            .x(function (dataPoint) {
                            return xScale.scale(dataPoint.x);
                        })
                            .y0(viewport.height)
                            .y1(function (dataPoint) {
                            return yScale.scale(dataPoint.y);
                        })
                            .interpolate(interpolation);
                    };
                    AreaComponent.prototype.destroy = function () {
                        this.areaSelection = null;
                        _super.prototype.destroy.call(this);
                    };
                    AreaComponent.prototype.highlight = function (hasSelection) {
                        this.updateElementOpacity(this.areaSelection, this.renderOptions && this.renderOptions.areaOpacity, this.renderOptions && this.renderOptions.series && this.renderOptions.series.selected, hasSelection);
                        _super.prototype.highlight.call(this, hasSelection);
                    };
                    return AreaComponent;
                }(powerKpi.LineComponent));
                powerKpi.AreaComponent = AreaComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var ComboComponent = /** @class */ (function (_super) {
                    __extends(ComboComponent, _super);
                    function ComboComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "comboComponent";
                        _this.initElement(options.element, _this.className, "g");
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        return _this;
                    }
                    ComboComponent.prototype.render = function (options) {
                        var _this = this;
                        var lineType = options.lineType;
                        this.renderOptions = options;
                        if (lineType !== this.currentLineType) {
                            this.destroyComponents();
                            this.currentLineType = lineType;
                        }
                        this.initComponents(this.components, 1, function () {
                            switch (_this.currentLineType) {
                                case powerKpi.LineType.area: {
                                    return new powerKpi.AreaComponent(_this.constructorOptions);
                                }
                                case powerKpi.LineType.column:
                                default: {
                                    return new powerKpi.LineComponent(_this.constructorOptions);
                                }
                            }
                        });
                        this.forEach(this.components, function (component) {
                            component.render(options);
                        });
                    };
                    return ComboComponent;
                }(powerKpi.BaseContainerComponent));
                powerKpi.ComboComponent = ComboComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var ChartComponent = /** @class */ (function (_super) {
                    __extends(ChartComponent, _super);
                    function ChartComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "multiShapeComponent";
                        _this.amountOfDataPointsForFallbackComponents = 1;
                        _this.shouldRenderFallbackComponents = false;
                        _this.initElement(options.element, _this.className, "g");
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        if (_this.constructorOptions.eventDispatcher) {
                            _this.constructorOptions.eventDispatcher.on(powerKpi.EventName.onHighlight, _this.highlight.bind(_this));
                        }
                        return _this;
                    }
                    ChartComponent.prototype.render = function (options) {
                        var _this = this;
                        var _a = options.data, sortedSeries = _a.sortedSeries, viewport = _a.viewport, x = _a.x, settings = _a.settings;
                        var shouldRenderFallbackComponents = sortedSeries
                            && sortedSeries[0]
                            && sortedSeries[0].points
                            && sortedSeries[0].points.length === this.amountOfDataPointsForFallbackComponents;
                        if (this.shouldRenderFallbackComponents !== shouldRenderFallbackComponents) {
                            this.forEach(this.components, function (component) {
                                component.destroy();
                            });
                            this.components = [];
                            this.shouldRenderFallbackComponents = shouldRenderFallbackComponents;
                        }
                        this.initComponents(this.components, sortedSeries.length, function () {
                            return _this.shouldRenderFallbackComponents
                                ? new powerKpi.DotComponent(_this.constructorOptions)
                                : new powerKpi.ComboComponent(_this.constructorOptions);
                        });
                        this.forEach(this.components, function (component, componentIndex) {
                            var currentSeries = sortedSeries[componentIndex];
                            if (_this.shouldRenderFallbackComponents) {
                                var point = currentSeries.points[0];
                                component.render({
                                    point: point,
                                    viewport: viewport,
                                    thickness: currentSeries.settings.line.thickness,
                                    x: x.scale,
                                    y: currentSeries.y.scale,
                                    radiusFactor: settings.dots.radiusFactor,
                                    opacity: currentSeries.settings.line.opacity,
                                    series: currentSeries,
                                });
                            }
                            else {
                                component.render({
                                    viewport: viewport,
                                    thickness: currentSeries.settings.line.thickness,
                                    x: x.scale,
                                    y: currentSeries.y.scale,
                                    interpolation: currentSeries.settings.line.getInterpolation(),
                                    lineStyle: currentSeries.settings.line.lineStyle,
                                    gradientPoints: currentSeries.gradientPoints,
                                    lineType: currentSeries.settings.line.lineType,
                                    opacity: currentSeries.settings.line.opacity,
                                    areaOpacity: currentSeries.settings.line.areaOpacity,
                                    series: currentSeries,
                                });
                            }
                        });
                    };
                    return ChartComponent;
                }(powerKpi.BaseContainerComponent));
                powerKpi.ChartComponent = ChartComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // powerbi
                var ValueType = powerbi.ValueType;
                var NumberFormat = powerbi.NumberFormat;
                var DateTimeSequence = powerbi.DateTimeSequence;
                // powerbi.visuals
                var axisScale = powerbi.visuals.axisScale;
                var AxisHelper = powerbi.visuals.AxisHelper;
                var valueFormatter = powerbi.visuals.valueFormatter;
                var PowerKPIAxisHelper;
                (function (PowerKPIAxisHelper) {
                    var DefaultOuterPadding = 0;
                    var DefaultInnerTickSize = 6;
                    var DefaultOuterTickSize = 0;
                    var OrientationLeft = "left";
                    var OrientationBottom = "bottom";
                    var DefaultXLabelMaxWidth = 1;
                    var DefaultXLabelFactor = 2;
                    var DefaultMinInterval = 0;
                    var MinTickInterval100Pct = 0.01;
                    var MinTickIntervalInteger = 1;
                    var RecommendedNumberOfTicksSmall = 3;
                    var RecommendedNumberOfTicksMiddle = 5;
                    var RecommendedNumberOfTicksLarge = 8;
                    var AvailableWidthYAxisSmall = 150;
                    var AvailableWidthYAxisMiddle = 300;
                    var MinAmountOfTicksForDates = 1;
                    var MinAmountOfTicks = 0;
                    /**
                     * Default ranges are for when we have a field chosen for the axis,
                     * but no values are returned by the query.
                     */
                    PowerKPIAxisHelper.emptyDomain = [0, 0];
                    var TickLabelPadding = 2; // between text labels, used by AxisHelper
                    var MinOrdinalRectThickness = 20;
                    var ScalarTickLabelPadding = 3;
                    var MinTickCount = 2;
                    var DefaultBestTickCount = 3;
                    /**
                     * Create a D3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
                     * @param options The properties used to create the axis.
                     */
                    function createAxis(options) {
                        var pixelSpan = options.pixelSpan, dataDomain = options.dataDomain, metaDataColumn = options.metaDataColumn, formatString = options.formatString, outerPadding = options.outerPadding || DefaultOuterPadding, isCategoryAxis = !!options.isCategoryAxis, isScalar = !!options.isScalar, isVertical = !!options.isVertical, useTickIntervalForDisplayUnits = !!options.useTickIntervalForDisplayUnits, getValueFn = options.getValueFn, categoryThickness = options.categoryThickness, axisDisplayUnits = options.axisDisplayUnits, axisPrecision = options.axisPrecision, is100Pct = !!options.is100Pct, tickLabelPadding = options.tickLabelPadding || TickLabelPadding;
                        var dataType = getCategoryValueType(metaDataColumn, isScalar);
                        // Create the Scale
                        var scaleResult = createScale(options);
                        var scale = scaleResult.scale;
                        var bestTickCount = scaleResult.bestTickCount;
                        var scaleDomain = scale.domain();
                        var isLogScaleAllowed = isLogScalePossible(dataDomain, dataType);
                        // fix categoryThickness if scalar and the domain was adjusted when making the scale "nice"
                        if (categoryThickness && isScalar && dataDomain && dataDomain.length === 2) {
                            var oldSpan = dataDomain[1] - dataDomain[0];
                            var newSpan = scaleDomain[1] - scaleDomain[0];
                            if (oldSpan > 0 && newSpan > 0) {
                                categoryThickness = categoryThickness * oldSpan / newSpan;
                            }
                        }
                        var minTickInterval = isScalar
                            ? getMinTickValueInterval(formatString, dataType, is100Pct)
                            : undefined;
                        var tickValues = getRecommendedTickValues(bestTickCount, scale, dataType, isScalar, minTickInterval, options.shouldTheMinValueBeIncluded);
                        if (isScalar
                            && bestTickCount === 1
                            && tickValues
                            && tickValues.length > 1) {
                            tickValues = [tickValues[0]];
                        }
                        if (options.scaleType && options.scaleType === axisScale.log && isLogScaleAllowed) {
                            tickValues = tickValues.filter(function (d) {
                                return powerOfTen(d);
                            });
                        }
                        var formatter = createFormatter(scaleDomain, dataDomain, dataType, isScalar, formatString, bestTickCount, tickValues, getValueFn, useTickIntervalForDisplayUnits, axisDisplayUnits, axisPrecision);
                        // sets default orientation only, cartesianChart will fix y2 for comboChart
                        // tickSize(pixelSpan) is used to create gridLines
                        var axis = d3.svg.axis()
                            .scale(scale)
                            .tickSize(DefaultInnerTickSize, DefaultOuterTickSize)
                            .orient(isVertical
                            ? OrientationLeft
                            : OrientationBottom)
                            .ticks(bestTickCount)
                            .tickValues(tickValues);
                        var formattedTickValues = [];
                        if (metaDataColumn) {
                            formattedTickValues = formatAxisTickValues(axis, tickValues, formatter, dataType, getValueFn);
                        }
                        var xLabelMaxWidth;
                        // Use category layout of labels if specified, otherwise use scalar layout of labels
                        if (!isScalar && categoryThickness) {
                            xLabelMaxWidth = Math.max(DefaultXLabelMaxWidth, categoryThickness - tickLabelPadding * DefaultXLabelFactor);
                        }
                        else {
                            // When there are 0 or 1 ticks, then xLabelMaxWidth = pixelSpan
                            xLabelMaxWidth = tickValues.length > DefaultXLabelMaxWidth
                                ? getScalarLabelMaxWidth(scale, tickValues)
                                : pixelSpan;
                            xLabelMaxWidth = xLabelMaxWidth - ScalarTickLabelPadding * DefaultXLabelFactor;
                        }
                        return {
                            scale: scale,
                            axis: axis,
                            formatter: formatter,
                            values: formattedTickValues,
                            axisType: dataType,
                            axisLabel: null,
                            isCategoryAxis: isCategoryAxis,
                            xLabelMaxWidth: xLabelMaxWidth,
                            categoryThickness: categoryThickness,
                            outerPadding: outerPadding,
                            usingDefaultDomain: scaleResult.usingDefaultDomain,
                            isLogScaleAllowed: isLogScaleAllowed,
                            dataDomain: dataDomain,
                        };
                    }
                    PowerKPIAxisHelper.createAxis = createAxis;
                    /**
                     * Indicates whether the number is power of 10.
                     */
                    function powerOfTen(d) {
                        var value = Math.abs(d);
                        // formula log2(Y)/log2(10) = log10(Y)
                        // because double issues this won"t return exact value
                        // we need to ceil it to nearest number.
                        var log10 = Math.log(value) / Math.LN10;
                        log10 = Math.ceil(log10 - 1e-12);
                        return value / Math.pow(10, log10) === 1;
                    }
                    PowerKPIAxisHelper.powerOfTen = powerOfTen;
                    function getScalarLabelMaxWidth(scale, tickValues) {
                        // find the distance between two ticks. scalar ticks can be anywhere, such as:
                        // |---50----------100--------|
                        if (scale && !_.isEmpty(tickValues)) {
                            return Math.abs(scale(tickValues[1]) - scale(tickValues[0]));
                        }
                        return DefaultXLabelMaxWidth;
                    }
                    function createFormatter(scaleDomain, dataDomain, dataType, isScalar, formatString, bestTickCount, tickValues, getValueFn, useTickIntervalForDisplayUnits, axisDisplayUnits, axisPrecision) {
                        if (useTickIntervalForDisplayUnits === void 0) { useTickIntervalForDisplayUnits = false; }
                        var formatter;
                        if (dataType.dateTime) {
                            if (isScalar) {
                                var value = new Date(scaleDomain[0]);
                                var value2 = new Date(scaleDomain[1]);
                                // datetime with only one value needs to pass the same value
                                // (from the original dataDomain value, not the adjusted scaleDomain)
                                // so formatting works correctly.
                                if (bestTickCount === 1) {
                                    value = value2 = new Date(dataDomain[0]);
                                }
                                // this will ignore the formatString and create one based on the smallest non-zero portion of the values supplied.
                                formatter = valueFormatter.create({
                                    format: formatString,
                                    value: value,
                                    value2: value2,
                                    tickCount: bestTickCount,
                                });
                            }
                            else {
                                // Use the model formatString for ordinal datetime
                                formatter = valueFormatter.createDefaultFormatter(formatString, true);
                            }
                        }
                        else {
                            if (useTickIntervalForDisplayUnits && isScalar && tickValues.length > 1) {
                                var value1 = axisDisplayUnits
                                    ? axisDisplayUnits
                                    : tickValues[1] - tickValues[0];
                                var options = {
                                    format: formatString,
                                    value: value1,
                                    value2: 0,
                                    allowFormatBeautification: true,
                                };
                                if (axisPrecision) {
                                    options.precision = axisPrecision;
                                }
                                else {
                                    options.precision = AxisHelper.calculateAxisPrecision(tickValues[0], tickValues[1], axisDisplayUnits, formatString);
                                }
                                formatter = valueFormatter.create(options);
                            }
                            else {
                                // do not use display units, just the basic value formatter
                                // datetime is handled above, so we are ordinal and either boolean, numeric, or text.
                                formatter = valueFormatter.createDefaultFormatter(formatString, true);
                            }
                        }
                        return formatter;
                    }
                    PowerKPIAxisHelper.createFormatter = createFormatter;
                    function getMinTickValueInterval(formatString, columnType, is100Pct) {
                        var isCustomFormat = formatString && !NumberFormat.isStandardFormat(formatString);
                        if (isCustomFormat) {
                            var precision = NumberFormat.getCustomFormatMetadata(formatString, true).precision;
                            if (formatString.indexOf("%") > -1) {
                                precision += 2; // percent values are multiplied by 100 during formatting
                            }
                            return Math.pow(10, -precision);
                        }
                        else if (is100Pct) {
                            return MinTickInterval100Pct;
                        }
                        else if (columnType.integer) {
                            return MinTickIntervalInteger;
                        }
                        return DefaultMinInterval;
                    }
                    PowerKPIAxisHelper.getMinTickValueInterval = getMinTickValueInterval;
                    /**
                     * Format the linear tick labels or the category labels.
                     */
                    function formatAxisTickValues(axis, tickValues, formatter, dataType, getValueFn) {
                        var formattedTickValues = [];
                        if (!getValueFn) {
                            getValueFn = function (data) { return data; };
                        }
                        if (formatter) {
                            axis.tickFormat(function (d) { return formatter.format(getValueFn(d, dataType)); });
                            formattedTickValues = tickValues.map(function (d) { return formatter.format(getValueFn(d, dataType)); });
                        }
                        else {
                            formattedTickValues = tickValues.map(function (d) { return getValueFn(d, dataType); });
                        }
                        return formattedTickValues;
                    }
                    function isLogScalePossible(domain, axisType) {
                        if (domain == null || domain.length < 2 || isDateTime(axisType)) {
                            return false;
                        }
                        return (domain[0] > 0 && domain[1] > 0)
                            || (domain[0] < 0 && domain[1] < 0); // domain must exclude 0
                    }
                    PowerKPIAxisHelper.isLogScalePossible = isLogScalePossible;
                    function isDateTime(type) {
                        return !!(type && type.dateTime);
                    }
                    PowerKPIAxisHelper.isDateTime = isDateTime;
                    function getRecommendedTickValues(maxTicks, scale, axisType, isScalar, minTickInterval, shouldTheMinValueBeIncluded) {
                        if (shouldTheMinValueBeIncluded === void 0) { shouldTheMinValueBeIncluded = false; }
                        if (!isScalar || isOrdinalScale(scale)) {
                            return getRecommendedTickValuesForAnOrdinalRange(maxTicks, scale.domain());
                        }
                        else if (isDateTime(axisType)) {
                            return getRecommendedTickValuesForADateTimeRange(maxTicks, scale.domain());
                        }
                        return getRecommendedTickValuesForAQuantitativeRange(maxTicks, scale, minTickInterval, shouldTheMinValueBeIncluded);
                    }
                    PowerKPIAxisHelper.getRecommendedTickValues = getRecommendedTickValues;
                    function getRecommendedTickValuesForAnOrdinalRange(maxTicks, labels) {
                        var tickLabels = [];
                        // return no ticks in this case
                        if (maxTicks <= 0) {
                            return tickLabels;
                        }
                        var len = labels.length;
                        if (maxTicks > len) {
                            return labels;
                        }
                        for (var i = 0, step = Math.ceil(len / maxTicks); i < len; i += step) {
                            tickLabels.push(labels[i]);
                        }
                        return tickLabels;
                    }
                    PowerKPIAxisHelper.getRecommendedTickValuesForAnOrdinalRange = getRecommendedTickValuesForAnOrdinalRange;
                    function getRecommendedTickValuesForAQuantitativeRange(maxTicks, scale, minInterval, shouldTheMinValueBeIncluded) {
                        if (shouldTheMinValueBeIncluded === void 0) { shouldTheMinValueBeIncluded = false; }
                        var tickLabels = [];
                        // if maxticks is zero return none
                        if (maxTicks === 0) {
                            return tickLabels;
                        }
                        if (scale.ticks) {
                            if (shouldTheMinValueBeIncluded && scale.domain) {
                                var domain = scale.domain();
                                var minValue = domain[0];
                                var maxValue = domain[1] !== undefined && domain[1] !== null
                                    ? domain[1]
                                    : minValue;
                                var span = Math.abs(maxValue - minValue);
                                var step = Math.pow(10, Math.floor(Math.log(span / maxTicks) / Math.LN10));
                                var err = maxTicks / span * step;
                                if (err <= .15) {
                                    step *= 10;
                                }
                                else if (err <= .35) {
                                    step *= 5;
                                }
                                else if (err <= .75) {
                                    step *= 2;
                                }
                                if (!isNaN(step) && isFinite(step)) {
                                    tickLabels = d3.range(minValue, maxValue, step);
                                }
                            }
                            else {
                                tickLabels = scale.ticks(maxTicks);
                                if (tickLabels.length > maxTicks && maxTicks > 1) {
                                    tickLabels = scale.ticks(maxTicks - 1);
                                }
                                if (tickLabels.length < MinTickCount) {
                                    tickLabels = scale.ticks(maxTicks + 1);
                                }
                            }
                            tickLabels = createTrueZeroTickLabel(tickLabels);
                            if (minInterval && tickLabels.length > 1) {
                                var tickInterval = tickLabels[1] - tickLabels[0];
                                while (tickInterval > 0 && tickInterval < minInterval) {
                                    for (var i = 1; i < tickLabels.length; i++) {
                                        tickLabels.splice(i, 1);
                                    }
                                    tickInterval = tickInterval * 2;
                                }
                                // keep at least two labels - the loop above may trim all but one if we have odd # of tick labels and dynamic range < minInterval
                                if (tickLabels.length === 1) {
                                    tickLabels.push(tickLabels[0] + minInterval);
                                }
                            }
                            return tickLabels;
                        }
                        return tickLabels;
                    }
                    PowerKPIAxisHelper.getRecommendedTickValuesForAQuantitativeRange = getRecommendedTickValuesForAQuantitativeRange;
                    function getRecommendedTickValuesForADateTimeRange(maxTicks, dataDomain) {
                        var tickLabels = [];
                        if (dataDomain[0] === 0 && dataDomain[1] === 0) {
                            return [];
                        }
                        var dateTimeTickLabels = DateTimeSequence.calculate(new Date(dataDomain[0]), new Date(dataDomain[1]), maxTicks).sequence;
                        tickLabels = dateTimeTickLabels.map(function (d) { return d.getTime(); });
                        tickLabels = ensureValuesInRange(tickLabels, dataDomain[0], dataDomain[1]);
                        return tickLabels;
                    }
                    function isOrdinalScale(scale) {
                        return typeof scale.invert === "undefined";
                    }
                    PowerKPIAxisHelper.isOrdinalScale = isOrdinalScale;
                    /**
                     * Gets the ValueType of a category column, defaults to Text if the type is not present.
                     */
                    function getCategoryValueType(metadataColumn, isScalar) {
                        if (metadataColumn && columnDataTypeHasValue(metadataColumn.type)) {
                            return metadataColumn.type;
                        }
                        if (isScalar) {
                            return ValueType.fromDescriptor({ numeric: true });
                        }
                        return ValueType.fromDescriptor({ text: true });
                    }
                    PowerKPIAxisHelper.getCategoryValueType = getCategoryValueType;
                    function columnDataTypeHasValue(dataType) {
                        return dataType && (dataType.bool || dataType.numeric || dataType.text || dataType.dateTime);
                    }
                    PowerKPIAxisHelper.columnDataTypeHasValue = columnDataTypeHasValue;
                    function createScale(options) {
                        var pixelSpan = options.pixelSpan, dataDomain = options.dataDomain, metaDataColumn = options.metaDataColumn, isScalar = options.isScalar, isVertical = options.isVertical, forcedTickCount = options.forcedTickCount, shouldClamp = options.shouldClamp, maxTickCount = options.maxTickCount, density = options.density;
                        var outerPadding = options.outerPadding || DefaultOuterPadding, minOrdinalRectThickness = options.minOrdinalRectThickness || MinOrdinalRectThickness;
                        var dataType = getCategoryValueType(metaDataColumn, isScalar);
                        var maxTicks = isVertical
                            ? getRecommendedNumberOfTicksForYAxis(pixelSpan)
                            : getRecommendedNumberOfTicksForXAxis(pixelSpan, minOrdinalRectThickness);
                        if (maxTickCount &&
                            maxTicks > maxTickCount) {
                            maxTicks = maxTickCount;
                        }
                        var scalarDomain = dataDomain
                            ? dataDomain.slice()
                            : null;
                        var bestTickCount = maxTicks;
                        var scale;
                        var usingDefaultDomain = false;
                        if (dataDomain == null
                            || (dataDomain.length === 2 && dataDomain[0] == null && dataDomain[1] == null)
                            || (dataDomain.length !== 2 && isScalar)) {
                            usingDefaultDomain = true;
                            if (dataType.dateTime || !isOrdinal(dataType)) {
                                dataDomain = PowerKPIAxisHelper.emptyDomain;
                            }
                            else { // ordinal
                                dataDomain = [];
                            }
                            if (isOrdinal(dataType)) {
                                scale = createOrdinalScale(pixelSpan, dataDomain);
                            }
                            else {
                                scale = createNumericalScale(options.scaleType, pixelSpan, dataDomain, dataType, outerPadding, bestTickCount);
                            }
                        }
                        else {
                            if (isScalar && dataDomain.length > 0) {
                                bestTickCount = forcedTickCount !== undefined
                                    ? (maxTicks !== 0 ? forcedTickCount : 0)
                                    : getBestNumberOfTicks(dataDomain[0], dataDomain[dataDomain.length - 1], [metaDataColumn], maxTicks, dataType.dateTime);
                                var normalizedRange = normalizeLinearDomain({
                                    min: dataDomain[0],
                                    max: dataDomain[dataDomain.length - 1]
                                });
                                scalarDomain = [
                                    normalizedRange.min,
                                    normalizedRange.max
                                ];
                            }
                            if (isScalar && dataType.numeric && !dataType.dateTime) {
                                // Note: Don't pass bestTickCount to createNumericalScale, because it overrides boundaries of the domain.
                                scale = createNumericalScale(options.scaleType, pixelSpan, scalarDomain, dataType, outerPadding, null, shouldClamp);
                                bestTickCount = maxTicks === 0
                                    ? 0
                                    : getAmountOfTicksByDensity(Math.floor((pixelSpan - outerPadding) / minOrdinalRectThickness), density);
                            }
                            else if (isScalar && dataType.dateTime) {
                                // Use of a linear scale, instead of a D3.time.scale, is intentional since we want
                                // to control the formatting of the time values, since d3"s implementation isn"t
                                // in accordance to our design.
                                // scalarDomain: should already be in long-int time (via category.values[0].getTime())
                                scale = createLinearScale(pixelSpan, scalarDomain, outerPadding, null, shouldClamp); // DO NOT PASS TICKCOUNT
                                bestTickCount = maxTicks === 0 ? 0
                                    : getAmountOfTicksByDensity((Math.max(MinAmountOfTicksForDates, (pixelSpan - outerPadding) / minOrdinalRectThickness)), density);
                                bestTickCount = bestTickCount < MinAmountOfTicksForDates
                                    ? MinAmountOfTicksForDates
                                    : bestTickCount;
                            }
                            else if (dataType.text || dataType.dateTime || dataType.numeric || dataType.bool) {
                                scale = createOrdinalScale(pixelSpan, scalarDomain);
                                bestTickCount = maxTicks === 0
                                    ? 0
                                    : getAmountOfTicksByDensity((Math.min(scalarDomain.length, (pixelSpan - outerPadding) / minOrdinalRectThickness)), density);
                            }
                        }
                        // vertical ordinal axis (e.g. categorical bar chart) does not need to reverse
                        if (isVertical && isScalar) {
                            scale.range(scale.range().reverse());
                        }
                        normalizeInfinityInScale(scale);
                        return {
                            scale: scale,
                            bestTickCount: bestTickCount,
                            usingDefaultDomain: usingDefaultDomain,
                        };
                    }
                    PowerKPIAxisHelper.createScale = createScale;
                    function getAmountOfTicksByDensity(amountOfTicks, density) {
                        return Math.floor(Math.max(amountOfTicks, MinAmountOfTicks) * density / 100);
                    }
                    function normalizeInfinityInScale(scale) {
                        // When large values (eg Number.MAX_VALUE) are involved, a call to scale.nice occasionally
                        // results in infinite values being included in the domain. To correct for that, we need to
                        // re-normalize the domain now to not include infinities.
                        var scaledDomain = scale.domain();
                        for (var i = 0, len = scaledDomain.length; i < len; ++i) {
                            if (scaledDomain[i] === Number.POSITIVE_INFINITY) {
                                scaledDomain[i] = Number.MAX_VALUE;
                            }
                            else if (scaledDomain[i] === Number.NEGATIVE_INFINITY) {
                                scaledDomain[i] = -Number.MAX_VALUE;
                            }
                        }
                        scale.domain(scaledDomain);
                    }
                    PowerKPIAxisHelper.normalizeInfinityInScale = normalizeInfinityInScale;
                    function createOrdinalScale(pixelSpan, dataDomain) {
                        return d3.scale.ordinal()
                            .rangePoints([0, pixelSpan])
                            .domain(dataDomain);
                    }
                    PowerKPIAxisHelper.createOrdinalScale = createOrdinalScale;
                    function normalizeLinearDomain(domain) {
                        if (isNaN(domain.min) || isNaN(domain.max)) {
                            domain.min = PowerKPIAxisHelper.emptyDomain[0];
                            domain.max = PowerKPIAxisHelper.emptyDomain[1];
                        }
                        else if (domain.min === domain.max) {
                            // d3 linear scale will give zero tickValues if max === min, so extend a little
                            domain.min = domain.min < 0 ? domain.min * 1.2 : domain.min * 0.8;
                            domain.max = domain.max < 0 ? domain.max * 0.8 : domain.max * 1.2;
                        }
                        else {
                            // Check that min is very small and is a negligable portion of the whole domain.
                            // (fix floating pt precision bugs)
                            // sometimes highlight value math causes small negative numbers which makes the axis add
                            // a large tick interval instead of just rendering at zero.
                            if (Math.abs(domain.min) < 0.0001 && domain.min / (domain.max - domain.min) < 0.0001) {
                                domain.min = 0;
                            }
                        }
                        return domain;
                    }
                    // this function can return different scales e.g. log, linear
                    // NOTE: export only for testing, do not access directly
                    function createNumericalScale(axisScaleType, pixelSpan, dataDomain, dataType, outerPadding, niceCount, shouldClamp) {
                        if (outerPadding === void 0) { outerPadding = 0; }
                        return createLinearScale(pixelSpan, dataDomain, outerPadding, niceCount, shouldClamp);
                    }
                    PowerKPIAxisHelper.createNumericalScale = createNumericalScale;
                    // NOTE: export only for testing, do not access directly
                    function createLinearScale(pixelSpan, dataDomain, outerPadding, niceCount, shouldClamp) {
                        if (outerPadding === void 0) { outerPadding = 0; }
                        var originalScale = d3.scale.linear()
                            .range([dataDomain[0], dataDomain[1]])
                            .domain([0, pixelSpan])
                            .clamp(false);
                        var end = pixelSpan - outerPadding;
                        var scale = d3.scale.linear()
                            .range([0, end])
                            .domain([originalScale(0), originalScale(end)])
                            .clamp(shouldClamp);
                        // we use millisecond ticks since epoch for datetime, so we don"t want any "nice" with numbers like 17398203392.
                        if (niceCount) {
                            scale.nice(niceCount);
                        }
                        return scale;
                    }
                    PowerKPIAxisHelper.createLinearScale = createLinearScale;
                    function getRecommendedNumberOfTicksForXAxis(availableWidth, minOrdinalRectThickness) {
                        var numberOfTicks = RecommendedNumberOfTicksLarge;
                        for (; numberOfTicks > 1; numberOfTicks--) {
                            if (numberOfTicks * minOrdinalRectThickness < availableWidth) {
                                break;
                            }
                        }
                        return numberOfTicks;
                    }
                    PowerKPIAxisHelper.getRecommendedNumberOfTicksForXAxis = getRecommendedNumberOfTicksForXAxis;
                    function getRecommendedNumberOfTicksForYAxis(availableWidth) {
                        if (availableWidth < AvailableWidthYAxisSmall) {
                            return RecommendedNumberOfTicksSmall;
                        }
                        if (availableWidth < AvailableWidthYAxisMiddle) {
                            return RecommendedNumberOfTicksMiddle;
                        }
                        return RecommendedNumberOfTicksLarge;
                    }
                    PowerKPIAxisHelper.getRecommendedNumberOfTicksForYAxis = getRecommendedNumberOfTicksForYAxis;
                    function isOrdinal(type) {
                        return !!(type
                            && (type.text
                                || type.bool
                                || (type.misc && type.misc.barcode)
                                || (type.geography && type.geography.postalCode)));
                    }
                    PowerKPIAxisHelper.isOrdinal = isOrdinal;
                    /**
                     * Get the best number of ticks based on minimum value, maximum value,
                     * measure metadata and max tick count.
                     *
                     * @param min The minimum of the data domain.
                     * @param max The maximum of the data domain.
                     * @param valuesMetadata The measure metadata array.
                     * @param maxTickCount The max count of intervals.
                     * @param isDateTime - flag to show single tick when min is equal to max.
                     */
                    function getBestNumberOfTicks(min, max, valuesMetadata, maxTickCount, isDateTime) {
                        if (isNaN(min) || isNaN(max)) {
                            return DefaultBestTickCount;
                        }
                        if (maxTickCount <= 1 || (max <= 1 && min >= -1)) {
                            return maxTickCount;
                        }
                        if (min === max) {
                            // datetime needs to only show one tick value in this case so formatting works correctly
                            if (!!isDateTime) {
                                return 1;
                            }
                            return DefaultBestTickCount;
                        }
                        if (hasNonIntegerData(valuesMetadata)) {
                            return maxTickCount;
                        }
                        // e.g. 5 - 2 + 1 = 4, => [2,3,4,5]
                        return Math.min(max - min + 1, maxTickCount);
                    }
                    PowerKPIAxisHelper.getBestNumberOfTicks = getBestNumberOfTicks;
                    function ensureValuesInRange(values, min, max) {
                        var filteredValues = values.filter(function (v) { return v >= min && v <= max; });
                        if (filteredValues.length < 2) {
                            filteredValues = [min, max];
                        }
                        return filteredValues;
                    }
                    PowerKPIAxisHelper.ensureValuesInRange = ensureValuesInRange;
                    function hasNonIntegerData(valuesMetadata) {
                        for (var i = 0, len = valuesMetadata.length; i < len; i++) {
                            var currentMetadata = valuesMetadata[i];
                            if (currentMetadata && currentMetadata.type && !currentMetadata.type.integer) {
                                return true;
                            }
                        }
                        return false;
                    }
                    PowerKPIAxisHelper.hasNonIntegerData = hasNonIntegerData;
                    /**
                     * Round out very small zero tick values (e.g. -1e-33 becomes 0).
                     *
                     * @param ticks Array of numbers (from d3.scale.ticks([maxTicks])).
                     * @param epsilon Max ratio of calculated tick interval which we will recognize as zero.
                     *
                     * e.g.
                     *     ticks = [-2, -1, 1e-10, 3, 4]; epsilon = 1e-5;
                     *     closeZero = 1e-5 * | 2 - 1 | = 1e-5
                     *     // Tick values <= 1e-5 replaced with 0
                     *     return [-2, -1, 0, 3, 4];
                     */
                    function createTrueZeroTickLabel(ticks, epsilon) {
                        if (epsilon === void 0) { epsilon = 1e-5; }
                        if (!ticks || ticks.length < 2) {
                            return ticks;
                        }
                        var closeZero = epsilon * Math.abs(ticks[1] - ticks[0]);
                        return ticks.map(function (tick) { return Math.abs(tick) <= closeZero ? 0 : tick; });
                    }
                })(PowerKPIAxisHelper = powerKpi.PowerKPIAxisHelper || (powerKpi.PowerKPIAxisHelper = {}));
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var AxisBaseComponent = /** @class */ (function (_super) {
                    __extends(AxisBaseComponent, _super);
                    function AxisBaseComponent() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    AxisBaseComponent.prototype.getTicks = function () {
                        return this.axisProperties
                            && this.axisProperties.axis
                            && this.axisProperties.axis.tickValues
                            && this.axisProperties.axis.tickValues() || [];
                    };
                    AxisBaseComponent.prototype.destroy = function () {
                        _super.prototype.destroy.call(this);
                        this.element = null;
                        this.gElement = null;
                    };
                    AxisBaseComponent.prototype.getLabelHeight = function (value, formatter, fontSize, fontFamily) {
                        var text = formatter.format(value);
                        var textProperties = this.getTextProperties(text, fontSize, fontFamily);
                        return powerbi.TextMeasurementService.measureSvgTextHeight(textProperties, text);
                    };
                    AxisBaseComponent.prototype.getLabelWidth = function (values, formatter, fontSize, fontFamily) {
                        var _this = this;
                        var width = Math.max.apply(Math, values.map(function (value) {
                            var text = formatter.format(value);
                            var textProperties = _this.getTextProperties(text, fontSize, fontFamily);
                            return powerbi.TextMeasurementService.measureSvgTextWidth(textProperties, text);
                        }));
                        return isFinite(width)
                            ? width
                            : 0;
                    };
                    AxisBaseComponent.prototype.getTextProperties = function (text, fontSize, fontFamily) {
                        return {
                            text: text,
                            fontFamily: fontFamily,
                            fontSize: PixelConverter.toString(fontSize)
                        };
                    };
                    AxisBaseComponent.prototype.getValueFormatter = function (min, max, metadata, tickCount, precision, valueFormat) {
                        return visuals.valueFormatter.create({
                            tickCount: tickCount,
                            precision: precision,
                            format: valueFormat,
                            value: min,
                            value2: max,
                            columnType: metadata && metadata.type
                        });
                    };
                    return AxisBaseComponent;
                }(powerKpi.BaseComponent));
                powerKpi.AxisBaseComponent = AxisBaseComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var TextMeasurementService = powerbi.TextMeasurementService;
                // powerbi.visuals
                var SVGUtil = powerbi.visuals.SVGUtil;
                var XAxisComponent = /** @class */ (function (_super) {
                    __extends(XAxisComponent, _super);
                    function XAxisComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.labelPadding = 8;
                        _this.className = "visualXAxis";
                        _this.elementClassNameContainer = "visualXAxisContainer";
                        _this.maxElementHeight = 0;
                        _this.maxElementWidth = 0;
                        _this.firstLabelWidth = 0;
                        _this.latestLabelWidth = 0;
                        _this.mainElementYOffset = -7.5;
                        _this.maxAmountOfTicks = 50;
                        _this.additionalLabelHeight = 5;
                        _this.additionalLabelWidth = 8;
                        _this.element = options.element
                            .append("div")
                            .classed(_this.className, true)
                            .append("svg")
                            .classed(_this.elementClassNameContainer, true);
                        _this.gElement = _this.element
                            .append("g")
                            .attr({
                            transform: SVGUtil.translate(0, _this.mainElementYOffset)
                        });
                        return _this;
                    }
                    XAxisComponent.prototype.preRender = function (options) {
                        if (!this.areRenderOptionsValid(options)) {
                            return;
                        }
                        var axis = options.axis, settings = options.settings;
                        if (settings.show) {
                            this.show();
                        }
                        else {
                            this.hide();
                        }
                        var fontSize = settings.fontSizeInPx;
                        this.formatter = this.getValueFormatterOfXAxis(axis, settings);
                        var domain = axis.scale.getDomain();
                        this.maxElementHeight = this.getLabelHeight(axis.max, this.formatter, fontSize, settings.fontFamily);
                        this.maxElementWidth = this.getLabelWidth([axis.min, axis.max], this.formatter, fontSize, settings.fontFamily);
                        this.firstLabelWidth = this.getLabelWidthWithAdditionalOffset([domain[0] || ""], this.formatter, fontSize, settings.fontFamily) / 2;
                        this.latestLabelWidth = this.getLabelWidthWithAdditionalOffset([domain.slice(-1)[0] || ""], this.formatter, fontSize, settings.fontFamily) / 2;
                    };
                    XAxisComponent.prototype.render = function (options) {
                        var _this = this;
                        if (!this.areRenderOptionsValid(options)) {
                            this.hide();
                            this.axisProperties = null;
                            return;
                        }
                        var axis = options.axis, settings = options.settings, viewport = options.viewport, margin = options.margin, additionalMargin = options.additionalMargin;
                        var fontSize = settings.fontSizeInPx;
                        var width = Math.max(0, viewport.width - margin.left - margin.right);
                        this.axisProperties = this.getAxisProperties(width, axis.scale.getDomain(), axis.metadata, !axis.scale.isOrdinal, settings.density);
                        if (!this.isShown) {
                            return;
                        }
                        this.element.style({
                            "font-family": settings.fontFamily,
                            "font-size": PixelConverter.toString(fontSize),
                            fill: settings.fontColor
                        });
                        this.updateViewport({
                            width: width,
                            height: this.maxElementHeight
                        });
                        this.element.style("margin-left", PixelConverter.toString(margin.left + additionalMargin.left));
                        this.gElement.attr("transform", SVGUtil.translate(0, 0));
                        this.axisProperties.axis
                            .orient("bottom")
                            .tickFormat(function (item, index) {
                            var currentValue = axis.type === powerKpi.DataRepresentationTypeEnum.DateType
                                ? new Date(item)
                                : item;
                            var formattedLabel = axis.metadata && axis.metadata.type && axis.metadata.type.dateTime
                                ? _this.axisProperties.formatter.format(currentValue)
                                : _this.formatter.format(currentValue);
                            var availableWidth = NaN;
                            if (_this.maxElementWidth > width) {
                                availableWidth = width;
                            }
                            if (!isNaN(availableWidth)) {
                                return TextMeasurementService.getTailoredTextOrDefault(_this.getTextProperties(formattedLabel, fontSize, settings.fontFamily), availableWidth);
                            }
                            return formattedLabel;
                        });
                        this.gElement.call(this.axisProperties.axis);
                    };
                    XAxisComponent.prototype.getAxisProperties = function (pixelSpan, dataDomain, metaDataColumn, isScalar, density) {
                        return powerKpi.PowerKPIAxisHelper.createAxis({
                            pixelSpan: pixelSpan,
                            dataDomain: dataDomain,
                            isScalar: isScalar,
                            density: density,
                            metaDataColumn: metaDataColumn,
                            isVertical: false,
                            isCategoryAxis: true,
                            formatString: undefined,
                            outerPadding: 0,
                            useTickIntervalForDisplayUnits: true,
                            shouldClamp: false,
                            outerPaddingRatio: 0,
                            innerPaddingRatio: 1,
                            tickLabelPadding: undefined,
                            minOrdinalRectThickness: this.maxElementWidth + this.labelPadding
                        });
                    };
                    XAxisComponent.prototype.getViewport = function () {
                        if (!this.isShown) {
                            return {
                                width: 0,
                                height: 0,
                                height2: 0,
                                width2: 0,
                            };
                        }
                        var height = this.maxElementHeight + this.additionalLabelHeight;
                        return {
                            width: this.firstLabelWidth,
                            width2: this.latestLabelWidth,
                            height: height,
                            height2: 0,
                        };
                    };
                    XAxisComponent.prototype.areRenderOptionsValid = function (options) {
                        return !!(options && options.axis && options.settings);
                    };
                    XAxisComponent.prototype.getValueFormatterOfXAxis = function (x, xAxis) {
                        var minValue;
                        var maxValue;
                        var precision;
                        if (x.type === powerKpi.DataRepresentationTypeEnum.NumberType) {
                            minValue = xAxis.displayUnits || x.max;
                            precision = xAxis.precision;
                        }
                        else {
                            minValue = x.min;
                            maxValue = x.max;
                        }
                        return this.getValueFormatter(minValue, maxValue, x.metadata, this.maxAmountOfTicks, precision, x.format || undefined);
                    };
                    XAxisComponent.prototype.getLabelWidthWithAdditionalOffset = function (values, formatter, fontSize, fontFamily) {
                        var width = this.getLabelWidth(values, formatter, fontSize, fontFamily);
                        return width > 0
                            ? width + this.additionalLabelWidth
                            : 0;
                    };
                    return XAxisComponent;
                }(powerKpi.AxisBaseComponent));
                powerKpi.XAxisComponent = XAxisComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var TextMeasurementService = powerbi.TextMeasurementService;
                var SVGUtil = powerbi.visuals.SVGUtil;
                var valueFormatter = powerbi.visuals.valueFormatter;
                var YAxisComponent = /** @class */ (function (_super) {
                    __extends(YAxisComponent, _super);
                    function YAxisComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "visualYAxis";
                        _this.additionalOffset = 10;
                        _this.labelOffset = 12;
                        _this.maxLabelWidth = 0;
                        _this.maxLabelHeight = 0;
                        _this.maxXAxisLabelWidth = 100;
                        _this.valueFormat = valueFormatter.DefaultNumericFormat;
                        _this.initElement(options.element, _this.className, "svg");
                        _this.gElement = _this.element.append("g");
                        return _this;
                    }
                    YAxisComponent.prototype.preRender = function (options) {
                        if (!this.areRenderOptionsValid(options)) {
                            return;
                        }
                        var axis = options.axis, settings = options.settings;
                        if (settings.show) {
                            this.show();
                        }
                        else {
                            this.hide();
                        }
                        var fontSize = settings.fontSizeInPx;
                        this.formatter = this.getValueFormatter(settings.displayUnits || axis.max, undefined, undefined, undefined, settings.precision, axis.format || this.valueFormat);
                        this.maxLabelHeight = this.getLabelHeight(axis.max, this.formatter, fontSize, settings.fontFamily);
                    };
                    YAxisComponent.prototype.render = function (options) {
                        var _this = this;
                        if (!this.areRenderOptionsValid(options)) {
                            this.hide();
                            this.axisProperties = null;
                            return;
                        }
                        var axis = options.axis, margin = options.margin, settings = options.settings, viewport = options.viewport;
                        var fontSize = settings.fontSizeInPx;
                        var height = Math.max(0, viewport.height - margin.top - margin.bottom);
                        this.axisProperties = this.getAxisProperties(height, [axis.min, axis.max], settings.density, settings.density === settings.maxDensity);
                        if (!this.isShown) {
                            return;
                        }
                        this.maxLabelWidth = settings.show
                            ? this.getLabelWidth(this.getTicks(), this.formatter, fontSize, settings.fontFamily)
                            : 0;
                        var availableWidth = viewport.width / 2;
                        var shouldLabelsBeTruncated = false;
                        if (this.maxLabelWidth > availableWidth) {
                            this.maxLabelWidth = availableWidth;
                            shouldLabelsBeTruncated = true;
                        }
                        this.element.style({
                            "font-family": settings.fontFamily,
                            "font-size": PixelConverter.toString(fontSize),
                            fill: settings.fontColor,
                            "padding": PixelConverter.toString(margin.top) + " 0 " + PixelConverter.toString(this.maxLabelHeight / 2) + " 0",
                        });
                        this.updateViewport({
                            height: height,
                            width: this.getTickWidth(),
                        });
                        this.gElement.attr({
                            transform: SVGUtil.translate(this.maxLabelWidth + this.labelOffset, this.maxLabelHeight / 2)
                        });
                        this.axisProperties.axis.tickFormat(function (item) {
                            var formattedLabel = _this.formatter.format(item);
                            if (shouldLabelsBeTruncated) {
                                return TextMeasurementService.getTailoredTextOrDefault(_this.getTextProperties(formattedLabel, fontSize, settings.fontFamily), availableWidth);
                            }
                            return formattedLabel;
                        });
                        this.gElement.call(this.axisProperties.axis);
                    };
                    YAxisComponent.prototype.getAxisProperties = function (pixelSpan, dataDomain, density, isDensityAtMax) {
                        return powerKpi.PowerKPIAxisHelper.createAxis({
                            pixelSpan: pixelSpan,
                            dataDomain: dataDomain,
                            density: density,
                            isVertical: true,
                            isScalar: true,
                            isCategoryAxis: false,
                            metaDataColumn: null,
                            formatString: undefined,
                            outerPadding: this.maxLabelHeight / 2,
                            useTickIntervalForDisplayUnits: true,
                            shouldClamp: false,
                            outerPaddingRatio: 0,
                            is100Pct: true,
                            innerPaddingRatio: 1,
                            tickLabelPadding: undefined,
                            minOrdinalRectThickness: this.maxLabelHeight,
                            shouldTheMinValueBeIncluded: isDensityAtMax
                        });
                    };
                    YAxisComponent.prototype.getViewport = function () {
                        if (!this.isShown) {
                            return {
                                width: 0,
                                height: 0
                            };
                        }
                        return {
                            width: this.getTickWidth(),
                            height: this.maxLabelHeight / 2,
                        };
                    };
                    YAxisComponent.prototype.getTickWidth = function () {
                        return this.maxLabelWidth + this.additionalOffset;
                    };
                    YAxisComponent.prototype.areRenderOptionsValid = function (options) {
                        return !!(options && options.axis && options.settings);
                    };
                    return YAxisComponent;
                }(powerKpi.AxisBaseComponent));
                powerKpi.YAxisComponent = YAxisComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
                var AxisReferenceLineBaseComponent = /** @class */ (function (_super) {
                    __extends(AxisReferenceLineBaseComponent, _super);
                    function AxisReferenceLineBaseComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "axisReferenceLineComponent";
                        _this.lineSelector = createClassAndSelector("axisReferenceLine");
                        _this.initElement(options.element, _this.className, "g");
                        return _this;
                    }
                    AxisReferenceLineBaseComponent.prototype.render = function (options) {
                        var ticks = options.ticks, scale = options.scale, settings = options.settings;
                        if (!ticks || !scale || !settings || !ticks.length) {
                            this.hide();
                            return;
                        }
                        this.show();
                        var lineSelection = this.element
                            .selectAll(this.lineSelector.selector)
                            .data(settings.show ? ticks : []);
                        var line = d3.svg.line()
                            .x(function (positions) {
                            return positions[0] || 0;
                        })
                            .y(function (positions) {
                            return positions[1] || 0;
                        });
                        var getPoints = this.getPoints(options);
                        lineSelection
                            .enter()
                            .append("svg:path")
                            .classed(this.lineSelector.class, true);
                        lineSelection
                            .attr({
                            d: function (value) {
                                return line(getPoints(value));
                            }
                        })
                            .style({
                            "stroke": settings.color,
                            "stroke-width": settings.thickness
                        });
                        lineSelection
                            .exit()
                            .remove();
                    };
                    return AxisReferenceLineBaseComponent;
                }(powerKpi.BaseComponent));
                powerKpi.AxisReferenceLineBaseComponent = AxisReferenceLineBaseComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var YAxisReferenceLineComponent = /** @class */ (function (_super) {
                    __extends(YAxisReferenceLineComponent, _super);
                    function YAxisReferenceLineComponent() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    YAxisReferenceLineComponent.prototype.getPoints = function (options) {
                        var scale = options.scale, viewport = options.viewport;
                        var yScale = scale
                            .copy()
                            .range([viewport.height, 0]);
                        return function (value) {
                            var y = yScale.scale(value);
                            return [
                                [0, y],
                                [viewport.width, y]
                            ];
                        };
                    };
                    return YAxisReferenceLineComponent;
                }(powerKpi.AxisReferenceLineBaseComponent));
                powerKpi.YAxisReferenceLineComponent = YAxisReferenceLineComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var XAxisReferenceLineComponent = /** @class */ (function (_super) {
                    __extends(XAxisReferenceLineComponent, _super);
                    function XAxisReferenceLineComponent() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    XAxisReferenceLineComponent.prototype.getPoints = function (options) {
                        var scale = options.scale, viewport = options.viewport;
                        var xScale = scale
                            .copy()
                            .range([0, viewport.width]);
                        return function (value) {
                            var x = xScale.scale(value);
                            return [
                                [x, 0],
                                [x, viewport.height]
                            ];
                        };
                    };
                    return XAxisReferenceLineComponent;
                }(powerKpi.AxisReferenceLineBaseComponent));
                powerKpi.XAxisReferenceLineComponent = XAxisReferenceLineComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var DotComponent = /** @class */ (function (_super) {
                    __extends(DotComponent, _super);
                    function DotComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.initElement(options.element, "dotComponent", "circle");
                        _this.element.on("click", _this.clickHandler.bind(_this));
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        return _this;
                    }
                    DotComponent.prototype.render = function (options) {
                        var x = options.x, y = options.y, point = options.point, viewport = options.viewport, thickness = options.thickness, radiusFactor = options.radiusFactor;
                        this.renderOptions = options;
                        var xScale = x
                            .copy()
                            .range([0, viewport.width]);
                        var yScale = y
                            .copy()
                            .range([viewport.height, 0]);
                        this.element
                            .attr({
                            cx: xScale.scale(point.x),
                            cy: yScale.scale(point.y),
                            r: thickness * radiusFactor
                        })
                            .style({
                            fill: point.color
                        });
                    };
                    return DotComponent;
                }(powerKpi.BaseComponent));
                powerKpi.DotComponent = DotComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var DotsComponent = /** @class */ (function (_super) {
                    __extends(DotsComponent, _super);
                    function DotsComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "dotsComponent";
                        _this.initElement(options.element, _this.className, "g");
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        return _this;
                    }
                    DotsComponent.prototype.render = function (options) {
                        var _this = this;
                        var _a = options.data, x = _a.x, series = _a.series, viewport = _a.viewport, dots = _a.settings.dots;
                        this.initComponents(this.components, series.length, function () {
                            return new powerKpi.DotComponent(_this.constructorOptions);
                        });
                        this.forEach(this.components, function (component, componentIndex) {
                            var currentSeries = series[componentIndex];
                            var point = currentSeries.points
                                .filter(function (point) {
                                return point.y !== null && !isNaN(point.y);
                            })[0];
                            if (point) {
                                component.show();
                                component.render({
                                    x: x.scale,
                                    point: point,
                                    viewport: viewport,
                                    y: currentSeries.y.scale,
                                    thickness: currentSeries.settings.line.thickness,
                                    radiusFactor: dots.radiusFactor,
                                    series: currentSeries,
                                });
                            }
                            else {
                                component.hide();
                            }
                        });
                    };
                    return DotsComponent;
                }(powerKpi.BaseContainerComponent));
                powerKpi.DotsComponent = DotsComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
                var VerticalLineComponent = /** @class */ (function (_super) {
                    __extends(VerticalLineComponent, _super);
                    function VerticalLineComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "verticalLineComponent";
                        _this.lineSelector = createClassAndSelector("verticalLine");
                        _this.initElement(options.element, _this.className, "g");
                        return _this;
                    }
                    VerticalLineComponent.prototype.render = function (options) {
                        var _a = options.data, series = _a.series, viewport = _a.viewport, x = _a.x;
                        var xScale = x.scale
                            .copy()
                            .range([0, viewport.width]);
                        var points = series
                            && series[0]
                            && series[0].points
                            || [];
                        var lineSelection = this.element
                            .selectAll(this.lineSelector.selector)
                            .data(points);
                        lineSelection
                            .enter()
                            .append("line")
                            .classed(this.lineSelector.class, true);
                        lineSelection
                            .attr({
                            x1: function (point) { return xScale.scale(point.x); },
                            y1: 0,
                            x2: function (point) { return xScale.scale(point.x); },
                            y2: viewport.height
                        });
                        lineSelection
                            .exit()
                            .remove();
                    };
                    VerticalLineComponent.prototype.clear = function () {
                        this.element
                            .selectAll("*")
                            .remove();
                    };
                    VerticalLineComponent.prototype.destroy = function () {
                        this.element = null;
                    };
                    return VerticalLineComponent;
                }(powerKpi.BaseComponent));
                powerKpi.VerticalLineComponent = VerticalLineComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // powerbi.visuals
                var valueFormatter = powerbi.visuals.valueFormatter;
                var ToolTipComponent = powerbi.visuals.ToolTipComponent;
                // powerbi.visuals.controls
                var Rectangle = powerbi.visuals.controls.TouchUtils.Rectangle;
                var TooltipMarkerShapeEnum;
                (function (TooltipMarkerShapeEnum) {
                    TooltipMarkerShapeEnum[TooltipMarkerShapeEnum["circle"] = 0] = "circle";
                    TooltipMarkerShapeEnum[TooltipMarkerShapeEnum["none"] = 1] = "none";
                })(TooltipMarkerShapeEnum || (TooltipMarkerShapeEnum = {}));
                var TooltipComponent = /** @class */ (function (_super) {
                    __extends(TooltipComponent, _super);
                    function TooltipComponent() {
                        var _this = _super.call(this) || this;
                        _this.varianceDisplayName = "Variance";
                        _this.secondVarianceDisplayName = _this.varianceDisplayName + " 2";
                        _this.numberFormat = valueFormatter.DefaultNumericFormat;
                        /**
                         * TODO:
                         * We use ToolTipComponent instead of Tooltip API due to inability to use it on dashboard page.
                         * Let's revisit it once the issue is fixed
                         */
                        try {
                            _this.tooltipComponent = new ToolTipComponent();
                        }
                        catch (err) {
                            _this.tooltipComponent = null;
                        }
                        return _this;
                    }
                    TooltipComponent.prototype.render = function (options) {
                        if (!options.position || !this.tooltipComponent) {
                            return;
                        }
                        this.showTooltip(options);
                    };
                    TooltipComponent.prototype.showTooltip = function (options) {
                        var _this = this;
                        var position = options.position, _a = options.data, x = _a.x, series = _a.series, _b = _a.settings, kpiIndicator = _b.kpiIndicator, tooltipLabel = _b.tooltipLabel, tooltipVariance = _b.tooltipVariance, secondTooltipVariance = _b.secondTooltipVariance, tooltipValues = _b.tooltipValues, legend = _b.legend, variances = _a.variances;
                        if (!tooltipLabel.show
                            && !tooltipVariance.show
                            && !tooltipValues.show
                            && !secondTooltipVariance.show) {
                            this.clear();
                            return;
                        }
                        var dataItems = [];
                        var firstVariance = this.getVarianceTooltip(series[0] && series[0].points[0], series[1] && series[1].points[0], tooltipVariance, this.varianceDisplayName, kpiIndicator.getCurrentKPI(series[0]
                            && series[0].points[0]
                            && series[0].points[0].kpiIndex), (variances[0] || [])[0], legend, series[0] && series[0].settings);
                        if (firstVariance) {
                            dataItems.push(firstVariance);
                        }
                        var secondVariance = this.getVarianceTooltip(series[0] && series[0].points[0], series[2] && series[2].points[0], secondTooltipVariance, this.secondVarianceDisplayName, undefined, (variances[1] || [])[0]);
                        if (secondVariance) {
                            dataItems.push(secondVariance);
                        }
                        if (dataItems.length) {
                            dataItems.push({
                                displayName: "   ",
                                value: "",
                                markerShape: this.getTooltipMarkerShape(TooltipMarkerShapeEnum.none)
                            }, {
                                displayName: "   ",
                                value: "",
                                markerShape: this.getTooltipMarkerShape(TooltipMarkerShapeEnum.none)
                            });
                        }
                        if (tooltipValues.show) {
                            series.forEach(function (dataSeries) {
                                var valueFormatter = _this.getValueFormatterByFormat(dataSeries.format || _this.numberFormat, tooltipValues.displayUnits, tooltipValues.precision);
                                var point = dataSeries
                                    && dataSeries.points
                                    && dataSeries.points[0];
                                if (point
                                    && point.y !== null
                                    && point.y !== undefined
                                    && !isNaN(point.y)) {
                                    dataItems.push({
                                        displayName: "" + dataSeries.name,
                                        value: valueFormatter.format(point.y),
                                        color: dataSeries.settings.line.fillColor,
                                        lineStyle: legend.getLegendLineStyle(dataSeries.settings.line.lineStyle),
                                        markerShape: legend.getLegendMarkerShape(),
                                        lineColor: dataSeries.settings.line.fillColor,
                                    });
                                }
                            });
                        }
                        var point = series
                            && series[0]
                            && series[0].points
                            && series[0].points[0];
                        if (tooltipLabel.show
                            && point
                            && point.x !== undefined
                            && point.x !== null) {
                            var formatter = this.getValueFormatterByFormat(tooltipLabel.getFormat(), x.type === powerKpi.DataRepresentationTypeEnum.NumberType
                                ? tooltipLabel.displayUnits
                                : undefined, x.type === powerKpi.DataRepresentationTypeEnum.NumberType
                                ? tooltipLabel.precision
                                : undefined);
                            var text = formatter
                                ? formatter.format(point.x)
                                : point.x;
                            dataItems = [
                                {
                                    displayName: "",
                                    value: text,
                                    markerShape: this.getTooltipMarkerShape(TooltipMarkerShapeEnum.circle)
                                }
                            ].concat(dataItems);
                        }
                        var rect = new Rectangle(position.x, position.y, 0, 0);
                        if (dataItems.length) {
                            this.tooltipComponent.show(dataItems, rect);
                        }
                        else {
                            this.clear();
                        }
                    };
                    TooltipComponent.prototype.getVarianceTooltip = function (firstPoint, secondPoint, settings, displayName, commonKPISettings, kpiIndicatorVariance, legendDescriptor, seriesSetting) {
                        if (commonKPISettings === void 0) { commonKPISettings = {}; }
                        if (!settings.show) {
                            return null;
                        }
                        var variance = !isNaN(kpiIndicatorVariance) && kpiIndicatorVariance !== null
                            ? kpiIndicatorVariance
                            : this.getVarianceByPoints(firstPoint, secondPoint);
                        if (isNaN(variance)) {
                            return null;
                        }
                        var varianceFormatter = this.getValueFormatterByFormat(settings.getFormat(), settings.displayUnits, settings.precision);
                        var lineStyle = legendDescriptor && seriesSetting
                            ? legendDescriptor.getLegendLineStyle(seriesSetting.line.lineStyle)
                            : undefined;
                        var markerShape = legendDescriptor
                            ? legendDescriptor.getLegendMarkerShape()
                            : this.getTooltipMarkerShape(TooltipMarkerShapeEnum.circle);
                        var color = commonKPISettings.color || "rgba(0,0,0,0)";
                        var lineColor = seriesSetting
                            ? color
                            : undefined;
                        return {
                            color: color,
                            lineStyle: lineStyle,
                            markerShape: markerShape,
                            lineColor: lineColor,
                            displayName: "" + settings.label || "" + displayName,
                            value: varianceFormatter.format(variance),
                        };
                    };
                    TooltipComponent.prototype.getValueFormatterByFormat = function (format, displayUnits, precision) {
                        return valueFormatter.create({
                            format: format,
                            precision: precision,
                            value: displayUnits
                        });
                    };
                    TooltipComponent.prototype.getTooltipMarkerShape = function (markerShape) {
                        return TooltipMarkerShapeEnum[markerShape];
                    };
                    TooltipComponent.prototype.clear = function () {
                        if (!this.tooltipComponent || !this.tooltipComponent.isTooltipComponentVisible) {
                            return;
                        }
                        this.tooltipComponent.hide();
                    };
                    TooltipComponent.prototype.destroy = function () {
                        this.clear();
                        this.tooltipComponent = null;
                    };
                    TooltipComponent.prototype.hide = function () {
                        this.clear();
                    };
                    return TooltipComponent;
                }(powerKpi.VarianceConverter));
                powerKpi.TooltipComponent = TooltipComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var LabelLayout = powerbi.LabelLayout;
                var TextMeasurementService = powerbi.TextMeasurementService;
                // powerbi.visuals
                var LabelUtils = powerbi.visuals.LabelUtils;
                var FontSize = powerbi.visuals.Units.FontSize;
                var valueFormatter = powerbi.visuals.valueFormatter;
                var LabelsComponent = /** @class */ (function (_super) {
                    __extends(LabelsComponent, _super);
                    function LabelsComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "labelsComponent";
                        _this.minimumLabelsToRender = 1;
                        _this.estimatedLabelWidth = 40; // This value represents a width of label just for optimization
                        _this.pointFilter = new powerKpi.DataRepresentationPointFilter();
                        _this.initElement(options.element, _this.className, "g");
                        return _this;
                    }
                    LabelsComponent.prototype.render = function (options) {
                        var labels = options.data.settings.labels;
                        if (labels.show) {
                            try { // This try-catch protects visual from being destroyed by PBI core team due to changes for core visuals
                                this.renderLabels(options);
                            }
                            catch (err) {
                                this.clear();
                            }
                        }
                        else {
                            this.clear();
                        }
                    };
                    LabelsComponent.prototype.renderLabels = function (options) {
                        var _a = options.data, viewport = _a.viewport, labels = _a.settings.labels;
                        this.element
                            .classed(this.italicClassName, labels.isItalic)
                            .classed(this.boldClassName, labels.isBold);
                        var labelLayoutOptions = LabelUtils.getDataLabelLayoutOptions(null);
                        var labelLayout = new LabelLayout(labelLayoutOptions);
                        var labelGroups = this.getLabelGroups(options);
                        var dataLabels = labelLayout.layout(labelGroups, viewport);
                        LabelUtils.drawDefaultLabels(this.element, dataLabels, true);
                    };
                    LabelsComponent.prototype.getTextProperties = function (text, fontSize, fontFamily) {
                        return {
                            text: text,
                            fontFamily: fontFamily,
                            fontSize: PixelConverter.toString(fontSize)
                        };
                    };
                    LabelsComponent.prototype.getLabelGroups = function (options) {
                        var _this = this;
                        var _a = options.data, x = _a.x, series = _a.series, viewport = _a.viewport, labels = _a.settings.labels;
                        var xScale = x.scale
                            .copy()
                            .range([0, viewport.width]);
                        var fontSizeInPx = PixelConverter.fromPointToPixel(labels.fontSize);
                        var pointsLength = series
                            && series[0]
                            && series[0].points
                            && series[0].points.length
                            || 0;
                        var lastPointIndex = pointsLength - 1;
                        var availableAmountOfLabels = LabelUtils.getNumberOfLabelsToRender(viewport.width, labels.density, this.minimumLabelsToRender, this.estimatedLabelWidth);
                        var maxNumberOfLabels = Math.round(availableAmountOfLabels * labels.density / 100);
                        var indexScale = d3.scale
                            .quantize()
                            .domain([0, maxNumberOfLabels])
                            .range(d3.range(0, pointsLength, 1));
                        return series.map(function (currentSeries, seriesIndex) {
                            var labelDataPoints = [];
                            var labelDisplayUnits = labels.displayUnits || currentSeries.domain.max;
                            var valueFormatters = series.map(function (seriesGroup) {
                                return _this.getValueFormatter(labelDisplayUnits, labels.precision, seriesGroup.format);
                            });
                            var yScale = currentSeries.y.scale
                                .copy()
                                .range([viewport.height, 0]);
                            for (var index = 0, previousPointIndex = -1; index <= maxNumberOfLabels; index++) {
                                var pointIndex = indexScale(index);
                                var point = currentSeries.points[pointIndex];
                                if (previousPointIndex !== pointIndex && _this.pointFilter.isPointValid(point)) {
                                    previousPointIndex = pointIndex;
                                    var formattedValue = valueFormatters[seriesIndex].format(point.y);
                                    var textProperties = _this.getTextProperties(formattedValue, fontSizeInPx, labels.fontFamily);
                                    var textWidth = TextMeasurementService.measureSvgTextWidth(textProperties);
                                    var textHeight = TextMeasurementService.estimateSvgTextHeight(textProperties);
                                    var parentShape = {
                                        point: {
                                            x: xScale.scale(point.x),
                                            y: yScale.scale(point.y),
                                        },
                                        radius: 0,
                                        validPositions: [
                                            1 /* Above */,
                                            2 /* Below */,
                                            4 /* Left */,
                                            8 /* Right */
                                        ]
                                    };
                                    var labelDataPoint = {
                                        isPreferred: pointIndex === 0 || pointIndex === lastPointIndex,
                                        text: formattedValue,
                                        textSize: {
                                            width: textWidth,
                                            height: textHeight
                                        },
                                        outsideFill: labels.color,
                                        insideFill: labels.color,
                                        parentType: 0 /* Point */,
                                        parentShape: parentShape,
                                        fontProperties: {
                                            family: labels.fontFamily,
                                            color: labels.color,
                                            size: FontSize.createFromPt(labels.fontSize)
                                        },
                                        identity: null
                                    };
                                    labelDataPoints.push(labelDataPoint);
                                }
                            }
                            return {
                                labelDataPoints: labelDataPoints,
                                maxNumberOfLabels: labelDataPoints.length
                            };
                        });
                    };
                    LabelsComponent.prototype.getValueFormatter = function (displayUnits, precision, format) {
                        return valueFormatter.create({
                            format: format,
                            precision: precision,
                            value: displayUnits
                        });
                    };
                    return LabelsComponent;
                }(powerKpi.BaseComponent));
                powerKpi.LabelsComponent = LabelsComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon.CssConstants
                var PixelConverter = jsCommon.PixelConverter;
                var SvgComponent = /** @class */ (function (_super) {
                    __extends(SvgComponent, _super);
                    function SvgComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "svgComponent";
                        _this.dynamicComponents = [];
                        _this.initElement(options.element, _this.className, "svg");
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        _this.xAxisReferenceLineComponent = new powerKpi.XAxisReferenceLineComponent(_this.constructorOptions);
                        _this.yAxisReferenceLineComponent = new powerKpi.YAxisReferenceLineComponent(_this.constructorOptions);
                        _this.secondaryYAxisReferenceLineComponent = new powerKpi.YAxisReferenceLineComponent(_this.constructorOptions);
                        _this.chartComponent = new powerKpi.ChartComponent(_this.constructorOptions);
                        _this.labelsComponent = new powerKpi.LabelsComponent(_this.constructorOptions);
                        _this.components = [
                            _this.xAxisReferenceLineComponent,
                            _this.yAxisReferenceLineComponent,
                            _this.secondaryYAxisReferenceLineComponent,
                            _this.chartComponent,
                            _this.labelsComponent,
                        ];
                        _this.dynamicComponents = [
                            new powerKpi.VerticalLineComponent(_this.constructorOptions),
                            new powerKpi.DotsComponent(_this.constructorOptions),
                            new powerKpi.TooltipComponent(),
                        ];
                        _this.bindEvents();
                        if (_this.constructorOptions.eventDispatcher) {
                            _this.constructorOptions.eventDispatcher.on(powerKpi.EventName.onClick, _this.clickComponentHandler.bind(_this));
                        }
                        return _this;
                    }
                    SvgComponent.prototype.bindEvents = function () {
                        var _this = this;
                        this.element.on("mousemove", function () { return _this.pointerMoveEvent(_this.renderOptions); });
                        this.element.on("touchmove", function () { return _this.pointerMoveEvent(_this.renderOptions); });
                        this.element.on("mouseleave", function () { return _this.pointerLeaveHandler(); });
                        this.element.on("touchend", function () { return _this.pointerLeaveHandler(); });
                        this.element.on("click", (this.clickHandler.bind(this)));
                    };
                    SvgComponent.prototype.render = function (options) {
                        var _a = options.data, _b = _a.groups, firstGroup = _b[0], secondGroup = _b[1], settings = _a.settings, viewport = _a.viewport, margin = _a.margin, _c = _a.x, values = _c.values, scale = _c.scale, additionalMargin = options.additionalMargin;
                        var reducedViewport = {
                            width: Math.max(0, viewport.width - margin.left - margin.right),
                            height: Math.max(0, viewport.height - margin.top - margin.bottom),
                        };
                        this.updateViewport(reducedViewport);
                        this.updateMargin(margin, additionalMargin);
                        this.positions = this.getPositions(reducedViewport, values, scale);
                        this.renderOptions = __assign({}, options, { data: __assign({}, options.data, { viewport: reducedViewport }) });
                        this.xAxisReferenceLineComponent.render({
                            scale: scale,
                            ticks: options.xTicks,
                            settings: settings.referenceLineOfXAxis,
                            viewport: reducedViewport,
                        });
                        this.yAxisReferenceLineComponent.render({
                            scale: firstGroup && firstGroup.y && firstGroup.y.scale,
                            ticks: options.yTicks,
                            settings: settings.referenceLineOfYAxis,
                            viewport: reducedViewport,
                        });
                        this.secondaryYAxisReferenceLineComponent.render({
                            scale: secondGroup && secondGroup.y && secondGroup.y.scale,
                            ticks: options.secondaryYTicks,
                            settings: settings.secondaryReferenceLineOfYAxis,
                            viewport: reducedViewport,
                        });
                        this.chartComponent.render(this.renderOptions);
                        this.labelsComponent.render(this.renderOptions);
                    };
                    SvgComponent.prototype.updateMargin = function (margin, additionalMargin) {
                        this.element.style({
                            "padding-top": PixelConverter.toString(margin.top + additionalMargin.top),
                            "padding-right": PixelConverter.toString(margin.right + additionalMargin.right),
                            "padding-bottom": PixelConverter.toString(margin.bottom + additionalMargin.bottom),
                            "padding-left": PixelConverter.toString(margin.left + additionalMargin.left),
                        });
                    };
                    SvgComponent.prototype.getPositions = function (viewport, values, xScale) {
                        var scale = xScale
                            .copy()
                            .range([0, viewport.width]);
                        return values.map(function (value) {
                            return scale.scale(value);
                        });
                    };
                    SvgComponent.prototype.pointerMoveEvent = function (options) {
                        var _a = options.data, settings = _a.settings, variance = _a.variance;
                        var isSecondTooltipShown = variance
                            && !isNaN(variance[1])
                            && settings.secondTooltipVariance.show;
                        if (!settings.tooltipLabel.show
                            && !settings.tooltipValues.show
                            && !settings.tooltipVariance.show
                            && !isSecondTooltipShown) {
                            this.pointerLeaveHandler();
                            return;
                        }
                        var event = d3.event;
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        var offsetX = Number.MAX_VALUE;
                        var originalXPosition = Number.MAX_VALUE;
                        var originalYPosition = Number.MAX_VALUE;
                        switch (event.type) {
                            case "mousemove": {
                                originalXPosition = event.pageX;
                                originalYPosition = event.pageY;
                                offsetX = event.offsetX;
                                break;
                            }
                            case "touchmove": {
                                var touch = event;
                                if (touch && touch.touches && touch.touches[0]) {
                                    originalXPosition = touch.touches[0].pageX;
                                    originalYPosition = touch.touches[0].pageY;
                                    var element = this.element.node();
                                    var xScaleViewport = this.getXScale(element);
                                    offsetX = (originalXPosition - element.getBoundingClientRect().left) / xScaleViewport;
                                }
                                break;
                            }
                        }
                        this.renderDynamicComponentByPosition(offsetX, originalXPosition, originalYPosition, options);
                    };
                    // TODO: Looks like this method should be refactored in order to make it more understandable
                    SvgComponent.prototype.renderDynamicComponentByPosition = function (offsetX, xPosition, yPosition, baseOptions) {
                        var _a = baseOptions.data, series = _a.series, margin = _a.margin, yAxis = _a.settings.yAxis, additionalMargin = baseOptions.additionalMargin;
                        var amountOfPoints = series
                            && series[0]
                            && series[0].points
                            && series[0].points.length
                            || 0;
                        var dataPointIndex = this.getIndexByPosition(offsetX - margin.left - additionalMargin.left);
                        dataPointIndex = Math.min(Math.max(0, dataPointIndex), amountOfPoints);
                        var dataSeries = [];
                        baseOptions.data.series.forEach(function (series) {
                            var point = series.points[dataPointIndex];
                            if (point) {
                                var seriesToReturn = __assign({}, series, { points: [point] });
                                dataSeries.push(seriesToReturn);
                            }
                        });
                        var options = {
                            position: { x: xPosition, y: yPosition },
                            data: __assign({}, baseOptions.data, { series: dataSeries }),
                        };
                        if (options.data.variances.length) {
                            options.data.variances = options.data.variances.map(function (varianceGroup) {
                                var variance = varianceGroup[dataPointIndex];
                                if (!isNaN(variance) && variance !== null) {
                                    return [variance];
                                }
                                return [];
                            });
                        }
                        this.forEach(this.dynamicComponents, function (component) {
                            component.render(options);
                            if (component.show) {
                                component.show();
                            }
                        });
                    };
                    SvgComponent.prototype.getXScale = function (container) {
                        var rect = container.getBoundingClientRect();
                        var clientWidth = container.clientWidth || $(container).width();
                        return rect.width / clientWidth;
                    };
                    /**
                     * This method linear search
                     *
                     * This method is a small hack. Please improve if you know how to improve it
                     *
                     * @param position {number} Current pointer position
                     */
                    SvgComponent.prototype.getIndexByPosition = function (position) {
                        if (!this.positions) {
                            return NaN;
                        }
                        var length = this.positions.length;
                        for (var index = 0; index < length; index++) {
                            var condition = (index === 0
                                && position <= this.positions[index])
                                || (index === 0
                                    && this.positions[index + 1] !== undefined
                                    && position <= this.positions[index] + (this.positions[index + 1] - this.positions[index]) / 2)
                                || (index === length - 1
                                    && position >= this.positions[index])
                                || (index === length - 1
                                    && this.positions[index - 1] !== undefined
                                    && position >= this.positions[index] - (this.positions[index] - this.positions[index - 1]) / 2)
                                || (this.positions[index - 1] !== undefined
                                    && this.positions[index] !== undefined
                                    && this.positions[index + 1] !== undefined
                                    && (position >= (this.positions[index] - Math.abs(this.positions[index] - this.positions[index - 1]) / 2))
                                    && (position <= (this.positions[index] + Math.abs(this.positions[index + 1] - this.positions[index]) / 2)));
                            if (condition) {
                                return index;
                            }
                        }
                        return NaN;
                    };
                    SvgComponent.prototype.pointerLeaveHandler = function () {
                        this.forEach(this.dynamicComponents, function (component) {
                            component.hide();
                        });
                    };
                    SvgComponent.prototype.clear = function () {
                        _super.prototype.clear.call(this, this.dynamicComponents);
                        _super.prototype.clear.call(this);
                    };
                    SvgComponent.prototype.destroy = function () {
                        _super.prototype.destroy.call(this, this.dynamicComponents);
                        _super.prototype.destroy.call(this);
                        this.xAxisReferenceLineComponent = null;
                        this.yAxisReferenceLineComponent = null;
                        this.secondaryYAxisReferenceLineComponent = null;
                        this.chartComponent = null;
                        this.labelsComponent = null;
                    };
                    SvgComponent.prototype.clickComponentHandler = function (component, event) {
                        if (!this.constructorOptions || !this.constructorOptions.eventDispatcher) {
                            return;
                        }
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        if (this === component) {
                            this.constructorOptions.eventDispatcher[powerKpi.EventName.onClearSelection]();
                            return;
                        }
                        var renderOptions = component
                            && component.getRenderOptions
                            && component.getRenderOptions();
                        var series = renderOptions && renderOptions.series;
                        if (!series) {
                            return;
                        }
                        this.constructorOptions.eventDispatcher[powerKpi.EventName.onSelect](event, series);
                    };
                    return SvgComponent;
                }(powerKpi.BaseContainerComponent));
                powerKpi.SvgComponent = SvgComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var PlotComponent = /** @class */ (function (_super) {
                    __extends(PlotComponent, _super);
                    function PlotComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.additionalWidthOffset = 5;
                        _this.initElement(options.element, "plot");
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        _this.hide();
                        _this.yAxisComponent = new powerKpi.YAxisComponent(_this.constructorOptions);
                        _this.svgComponent = new powerKpi.SvgComponent(_this.constructorOptions);
                        _this.secondaryYAxisComponent = new powerKpi.YAxisComponent(_this.constructorOptions);
                        _this.xAxisComponent = new powerKpi.XAxisComponent(_this.constructorOptions);
                        _this.components = [
                            _this.yAxisComponent,
                            _this.svgComponent,
                            _this.secondaryYAxisComponent,
                            _this.xAxisComponent,
                        ];
                        return _this;
                    }
                    PlotComponent.prototype.render = function (options) {
                        var _a = options.data, x = _a.x, margin = _a.margin, _b = _a.groups, firstGroup = _b[0], secondGroup = _b[1], viewport = _a.viewport, _c = _a.settings, xAxis = _c.xAxis, yAxis = _c.yAxis, secondaryYAxis = _c.secondaryYAxis;
                        if (!firstGroup && !secondGroup) {
                            this.hide();
                            return;
                        }
                        this.show();
                        this.updateViewport(viewport);
                        var reducedViewport = {
                            height: viewport.height,
                            width: Math.max(0, viewport.width - this.additionalWidthOffset),
                        };
                        this.xAxisComponent.preRender({
                            axis: x,
                            settings: xAxis,
                            margin: null,
                            viewport: null,
                            additionalMargin: null,
                        });
                        this.yAxisComponent.preRender({
                            margin: null,
                            viewport: null,
                            settings: yAxis,
                            axis: firstGroup && firstGroup.y,
                        });
                        this.secondaryYAxisComponent.preRender({
                            margin: null,
                            viewport: null,
                            settings: secondaryYAxis,
                            axis: secondGroup && secondGroup.y
                        });
                        var xAxisViewport = this.xAxisComponent.getViewport();
                        var maxYAxisHeight = Math.max(this.yAxisComponent.getViewport().height, this.secondaryYAxisComponent.getViewport().height);
                        var height = Math.max(0, reducedViewport.height - xAxisViewport.height - maxYAxisHeight);
                        this.yAxisComponent.render({
                            margin: margin,
                            viewport: {
                                height: height,
                                width: reducedViewport.width,
                            },
                            axis: firstGroup && firstGroup.y,
                            settings: yAxis,
                        });
                        this.secondaryYAxisComponent.render({
                            margin: margin,
                            viewport: {
                                height: height,
                                width: reducedViewport.width,
                            },
                            axis: secondGroup && secondGroup.y,
                            settings: secondaryYAxis,
                        });
                        var yAxisViewport = this.yAxisComponent.getViewport();
                        var secondaryYAxisViewport = this.secondaryYAxisComponent.getViewport();
                        var leftOffset = this.getOffset(xAxisViewport.width, yAxisViewport.width);
                        var rightOffset = this.getOffset(xAxisViewport.width2, secondaryYAxisViewport.width);
                        var width = Math.max(0, reducedViewport.width
                            - yAxisViewport.width
                            - secondaryYAxisViewport.width
                            - leftOffset
                            - rightOffset);
                        this.xAxisComponent.render({
                            margin: margin,
                            additionalMargin: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: yAxisViewport.width + leftOffset,
                            },
                            viewport: {
                                width: width,
                                height: reducedViewport.height,
                            },
                            axis: x,
                            settings: xAxis,
                        });
                        this.svgComponent.render({
                            data: __assign({}, options.data, { margin: margin, viewport: {
                                    width: width,
                                    height: height,
                                } }),
                            xTicks: this.xAxisComponent.getTicks(),
                            yTicks: this.yAxisComponent.getTicks(),
                            secondaryYTicks: this.secondaryYAxisComponent.getTicks(),
                            additionalMargin: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: leftOffset
                            },
                        });
                    };
                    PlotComponent.prototype.destroy = function () {
                        _super.prototype.destroy.call(this);
                        this.xAxisComponent = null;
                        this.yAxisComponent = null;
                        this.secondaryYAxisComponent = null;
                        this.svgComponent = null;
                    };
                    PlotComponent.prototype.getOffset = function (xAxisWidth, yAxisWidth) {
                        return xAxisWidth > yAxisWidth
                            ? xAxisWidth - yAxisWidth
                            : 0;
                    };
                    return PlotComponent;
                }(powerKpi.BaseContainerComponent));
                powerKpi.PlotComponent = PlotComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var LegendIcon = powerbi.visuals.LegendIcon;
                var createLegend = powerbi.visuals.createLegend;
                var LegendPosition = powerbi.visuals.LegendPosition;
                var LegendComponent = /** @class */ (function (_super) {
                    __extends(LegendComponent, _super);
                    function LegendComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "legendComponent";
                        _this.initElement(options.element, _this.className);
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        _this.legend = _this.createLegend(_this.constructorOptions);
                        return _this;
                    }
                    LegendComponent.prototype.createLegend = function (options) {
                        // Try-catch protects Power KPI from being completely broken due to createLegend incompatibility in different PBI Desktop versions
                        try {
                            var pbiDesktopFeb2018RegExp = /legendParentElement, interactive, interactivityService, isScrollable, legendPosition, legendSmallViewPortProperties, style/;
                            if (pbiDesktopFeb2018RegExp.test(createLegend.toString())) {
                                var createLegendAny = createLegend;
                                return createLegendAny($(options.element.node()), false, options.interactivityService || undefined, true, undefined, undefined, options.style || undefined);
                            }
                            else {
                                return createLegend($(options.element.node()), false, options.interactivityService || undefined, true, undefined, options.style || undefined, false);
                            }
                        }
                        catch (err) {
                            return null;
                        }
                    };
                    LegendComponent.prototype.render = function (options) {
                        if (!this.legend) {
                            return;
                        }
                        var legend = options.data.settings.legend;
                        var legendData = this.createLegendData(options.data, legend);
                        // Try-catch protects Power KPI from being completely broken due to createLegend incompatibility in different PBI Desktop versions
                        try {
                            this.legend.changeOrientation(this.getLegendPosition(legend.position));
                            this.legend.drawLegend(legendData, options.data.viewport);
                        }
                        catch (_) { }
                    };
                    LegendComponent.prototype.createLegendData = function (data, settings) {
                        var legendDataPoints = data.series
                            .map(function (series) {
                            return {
                                color: series.settings.line.fillColor,
                                icon: LegendIcon.Circle,
                                label: series.name,
                                identity: series.identity,
                                selected: series.selected,
                                lineStyle: settings.getLegendLineStyle(series.settings.line.lineStyle),
                                markerShape: settings.getLegendMarkerShape(),
                                lineColor: series.settings.line.fillColor,
                            };
                        });
                        var fontSizeInPx = PixelConverter.fromPointToPixel(settings.fontSize);
                        return {
                            show: settings.show,
                            position: this.getLegendPosition(settings.position),
                            title: settings.titleText,
                            showTitle: settings.showTitle,
                            dataPoints: legendDataPoints,
                            grouped: false,
                            fontProperties: {
                                color: settings.labelColor,
                                family: settings.fontFamily,
                                size: {
                                    pt: settings.fontSize,
                                    px: PixelConverter.fromPointToPixel(settings.fontSize)
                                },
                                sizePx: fontSizeInPx,
                                toTextProperties: function (text) {
                                    return {
                                        text: text,
                                        fontFamily: settings.fontFamily,
                                        fontSize: PixelConverter.toString(fontSizeInPx),
                                        sizePx: fontSizeInPx,
                                    };
                                },
                                toSVGStyle: function () {
                                    return {
                                        "font-size": PixelConverter.toString(fontSizeInPx),
                                        "font-family": settings.fontFamily,
                                        fill: settings.labelColor,
                                    };
                                }
                            }
                        };
                    };
                    LegendComponent.prototype.getLegendPosition = function (position) {
                        var positionIndex = LegendPosition[position];
                        return positionIndex === undefined
                            ? LegendPosition.BottomCenter
                            : positionIndex;
                    };
                    LegendComponent.prototype.destroy = function () {
                        this.legend = null;
                        _super.prototype.destroy.call(this);
                    };
                    LegendComponent.prototype.getViewport = function () {
                        if (!this.legend) {
                            return {
                                width: 0,
                                height: 0
                            };
                        }
                        return this.legend.getMargins();
                    };
                    return LegendComponent;
                }(powerKpi.BaseComponent));
                powerKpi.LegendComponent = LegendComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var AlignEnum;
                (function (AlignEnum) {
                    AlignEnum[AlignEnum["alignLeft"] = 0] = "alignLeft";
                    AlignEnum[AlignEnum["alignCenter"] = 1] = "alignCenter";
                    AlignEnum[AlignEnum["alignRight"] = 2] = "alignRight";
                })(AlignEnum = powerKpi.AlignEnum || (powerKpi.AlignEnum = {}));
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var ContentAlignEnum;
                (function (ContentAlignEnum) {
                    ContentAlignEnum[ContentAlignEnum["contentLeft"] = 0] = "contentLeft";
                    ContentAlignEnum[ContentAlignEnum["contentRight"] = 1] = "contentRight";
                })(ContentAlignEnum = powerKpi.ContentAlignEnum || (powerKpi.ContentAlignEnum = {}));
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
                var CaptionKPIComponent = /** @class */ (function () {
                    function CaptionKPIComponent(options) {
                        this.className = "captionKPIComponent";
                        this.invisibleClassName = "invisible";
                        this.innerContainerSelector = createClassAndSelector("captionKPIComponentInnerContainer");
                        this.captionContainerSelector = createClassAndSelector("kpiCaptionContainer");
                        this.captionSelector = createClassAndSelector("kpiCaption");
                        this.sizeOffset = {
                            width: 15,
                            height: 5
                        };
                        this.isComponentRendered = false;
                        this.element = options.element
                            .append("div")
                            .classed(this.className, true)
                            .classed(options.className, true);
                    }
                    CaptionKPIComponent.prototype.render = function (options) {
                        var captions = options.captions, align = options.align, _a = options.data, viewport = _a.viewport, layout = _a.settings.layout;
                        var _b = this.getAttributes(captions), isShown = _b.isShown, size = _b.size;
                        this.size = size;
                        isShown = layout.autoHideVisualComponents
                            ? isShown && this.canComponentBeRenderedAtViewport(viewport, layout.getLayout())
                            : isShown;
                        this.isComponentRendered = isShown;
                        this.element.classed(this.invisibleClassName, !isShown);
                        this.innerContainer = this.getDynamicElement(this.element, this.innerContainerSelector, isShown, align);
                        this.renderElement(this.innerContainer, captions, this.captionContainerSelector, this.captionSelector);
                    };
                    CaptionKPIComponent.prototype.getAttributes = function (captions) {
                        var _this = this;
                        var isShown = false;
                        var size = {
                            width: 0,
                            height: 0
                        };
                        captions.forEach(function (captionList) {
                            var width = 0;
                            var height = 0;
                            captionList.forEach(function (caption) {
                                isShown = isShown || caption.settings.show;
                                if (caption.settings.show) {
                                    var text = caption.value || "M";
                                    var rect = powerbi.TextMeasurementService.measureSvgTextRect({
                                        text: text,
                                        fontFamily: caption.settings.fontFamily,
                                        fontSize: PixelConverter.toString(PixelConverter.fromPointToPixel(caption.settings.fontSize))
                                    }, text);
                                    height = Math.max(height, rect.height + _this.sizeOffset.height);
                                    width += rect.width + _this.sizeOffset.width;
                                }
                            });
                            size.height += height;
                            size.width = Math.max(size.width, width);
                        });
                        return {
                            size: size,
                            isShown: isShown
                        };
                    };
                    CaptionKPIComponent.prototype.canComponentBeRenderedAtViewport = function (viewport, layout) {
                        switch (powerKpi.LayoutEnum[layout]) {
                            case powerKpi.LayoutEnum.Left:
                            case powerKpi.LayoutEnum.Right: {
                                return viewport.height >= this.size.height;
                            }
                            case powerKpi.LayoutEnum.Top:
                            case powerKpi.LayoutEnum.Bottom: {
                                return viewport.width >= this.size.width;
                            }
                            default: {
                                return false;
                            }
                        }
                    };
                    CaptionKPIComponent.prototype.getDynamicElement = function (element, selector, shouldElementBeRendered, align) {
                        var selection = element
                            .selectAll(selector.selector)
                            .data(shouldElementBeRendered ? [shouldElementBeRendered] : []);
                        selection
                            .enter()
                            .append("div")
                            .classed(selector.class, true);
                        selection.attr({
                            "class": selector.class + " " + powerKpi.AlignEnum[align]
                        });
                        selection
                            .exit()
                            .remove();
                        return selection;
                    };
                    CaptionKPIComponent.prototype.renderElement = function (element, captions, containerSelector, selector) {
                        var containerSelection = element
                            .selectAll(containerSelector.selector)
                            .data(captions);
                        containerSelection
                            .enter()
                            .append("div")
                            .classed(containerSelector.class, true);
                        var elementSelection = containerSelection
                            .selectAll(selector.selector)
                            .data(function (captions) {
                            return (captions || []).filter(function (options) {
                                return options
                                    && options.settings
                                    && options.settings.show;
                            });
                        });
                        elementSelection
                            .enter()
                            .append("div")
                            .classed(selector.class, true);
                        elementSelection
                            .attr({
                            title: function (options) { return options.title || null; },
                            "class": function (options) {
                                var className = selector.class;
                                if (options.settings.isBold) {
                                    className += " boldStyle";
                                }
                                if (options.settings.isItalic) {
                                    className += " italicStyle";
                                }
                                if (options.className) {
                                    className += " " + options.className;
                                }
                                return className;
                            }
                        })
                            .style({
                            color: function (options) { return options.settings.fontColor; },
                            "font-size": function (options) {
                                return PixelConverter.toString(PixelConverter.fromPointToPixel(options.settings.fontSize));
                            },
                            "font-family": function (options) { return options.settings.fontFamily; },
                        })
                            .text(function (options) { return options.value; });
                        elementSelection
                            .exit()
                            .remove();
                        containerSelection
                            .exit()
                            .remove();
                    };
                    CaptionKPIComponent.prototype.isRendered = function () {
                        return this.isComponentRendered;
                    };
                    CaptionKPIComponent.prototype.clear = function () {
                        this.element.remove();
                    };
                    CaptionKPIComponent.prototype.destroy = function () {
                        this.element = null;
                    };
                    CaptionKPIComponent.prototype.getViewport = function () {
                        if (!this.size) {
                            return {
                                height: 0,
                                width: 0
                            };
                        }
                        return this.size;
                    };
                    return CaptionKPIComponent;
                }());
                powerKpi.CaptionKPIComponent = CaptionKPIComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var VarianceBaseComponent = /** @class */ (function (_super) {
                    __extends(VarianceBaseComponent, _super);
                    function VarianceBaseComponent() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    VarianceBaseComponent.prototype.getValueFormatter = function (displayUnits, precision, format) {
                        return visuals.valueFormatter.create({
                            format: format,
                            precision: precision,
                            value: displayUnits,
                            displayUnitSystemType: powerbi.DisplayUnitSystemType.WholeUnits,
                        });
                    };
                    VarianceBaseComponent.prototype.clear = function () {
                        this.element
                            .selectAll("*")
                            .remove();
                    };
                    VarianceBaseComponent.prototype.destroy = function () {
                        this.element = null;
                    };
                    return VarianceBaseComponent;
                }(powerKpi.CaptionKPIComponent));
                powerKpi.VarianceBaseComponent = VarianceBaseComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // powerbi.visuals
                var valueFormatter = powerbi.visuals.valueFormatter;
                var DateKPIComponent = /** @class */ (function (_super) {
                    __extends(DateKPIComponent, _super);
                    function DateKPIComponent(options) {
                        var _this = _super.call(this, {
                            element: options.element,
                            className: options.className
                        }) || this;
                        _this.extraClassName = "dateKPIComponent";
                        _this.element.classed(_this.extraClassName, true);
                        return _this;
                    }
                    DateKPIComponent.prototype.render = function (options) {
                        var _a = options.data, settings = _a.settings, x = _a.x, captionDetailsKPIComponentOptions = _.clone(options);
                        var axisValue = options.data.series
                            && options.data.series[0]
                            && options.data.series[0].current.x;
                        var formattedValue = "";
                        if (axisValue) {
                            var formatter = this.getValueFormatter(x.type, settings.dateValueKPI.getFormat(), settings.dateValueKPI.displayUnits || x.max, settings.dateValueKPI.precision);
                            if (formatter) {
                                formattedValue = formatter.format(axisValue);
                            }
                            else {
                                formattedValue = "" + axisValue;
                            }
                        }
                        var valueCaption = {
                            value: formattedValue,
                            settings: settings.dateValueKPI,
                            title: options.data.x.name || formattedValue
                        };
                        var labelCaption = {
                            value: options.data.x.name,
                            settings: settings.dateLabelKPI
                        };
                        captionDetailsKPIComponentOptions.captions = [
                            [valueCaption],
                            [labelCaption]
                        ];
                        captionDetailsKPIComponentOptions.align = powerKpi.AlignEnum.alignLeft;
                        _super.prototype.render.call(this, captionDetailsKPIComponentOptions);
                    };
                    DateKPIComponent.prototype.getValueFormatter = function (type, format, value, precision) {
                        var currentValue, currentPrecision;
                        if (type === powerKpi.DataRepresentationTypeEnum.NumberType) {
                            currentValue = value;
                            currentPrecision = precision;
                        }
                        return this.getValueFormatterByFormat(format, currentValue, currentPrecision);
                    };
                    DateKPIComponent.prototype.getValueFormatterByFormat = function (format, value, precision) {
                        return valueFormatter.create({
                            format: format,
                            value: value,
                            precision: precision
                        });
                    };
                    return DateKPIComponent;
                }(powerKpi.CaptionKPIComponent));
                powerKpi.DateKPIComponent = DateKPIComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // powerbi.visuals
                var valueFormatter = powerbi.visuals.valueFormatter;
                var ValueKPIComponent = /** @class */ (function (_super) {
                    __extends(ValueKPIComponent, _super);
                    function ValueKPIComponent(options) {
                        var _this = _super.call(this, {
                            element: options.element,
                            className: options.className
                        }) || this;
                        _this.extraClassName = "valueKPIComponent";
                        _this.element.classed(_this.extraClassName, true);
                        _this.valueFormat = valueFormatter.DefaultNumericFormat;
                        return _this;
                    }
                    ValueKPIComponent.prototype.render = function (options) {
                        var _a = options.data, series = _a.series, settings = _a.settings, variance = _a.variance, captionDetailsKPIComponentOptions = _.clone(options);
                        var caption = "", details = "", title = "";
                        if (options.data.series
                            && options.data.series[0]
                            && options.data.series[0].current
                            && !isNaN(options.data.series[0].current.y)) {
                            var formatter = valueFormatter.create({
                                format: options.data.series[0].format || this.valueFormat,
                                precision: settings.actualValueKPI.precision,
                                value: settings.actualValueKPI.displayUnits || series[0].domain.max,
                                displayUnitSystemType: powerbi.DisplayUnitSystemType.WholeUnits,
                            });
                            var value = options.data.series[0].current.y;
                            title = "" + value;
                            caption = formatter.format(value);
                            details = options.data.series[0].name;
                        }
                        var valueCaption = {
                            title: details || title,
                            value: caption,
                            settings: settings.actualValueKPI
                        };
                        var labelCaption = {
                            value: details,
                            settings: settings.actualLabelKPI
                        };
                        captionDetailsKPIComponentOptions.captions = [
                            [valueCaption],
                            [labelCaption]
                        ];
                        var isVarianceKPIAvailable = series
                            && series.length > 0
                            && series[0]
                            && series[0].current
                            && !isNaN(series[0].current.kpiIndex);
                        var currentAlign = powerKpi.AlignEnum.alignCenter;
                        if (!settings.dateLabelKPI.show && !settings.dateValueKPI.show) {
                            currentAlign = powerKpi.AlignEnum.alignLeft;
                        }
                        else if (((!settings.kpiIndicatorValue.show || isNaN(variance[0]))
                            && (!settings.kpiIndicatorLabel.isShown() || (isNaN(variance[0]) && series[0] && series[0].current && isNaN(series[0].current.kpiIndex)))
                            && (!isVarianceKPIAvailable || !settings.kpiIndicator.show))
                            && (!settings.secondKPIIndicatorValue.show && !settings.secondKPIIndicatorLabel.isShown()
                                || isNaN(variance[1]))) {
                            currentAlign = powerKpi.AlignEnum.alignRight;
                        }
                        captionDetailsKPIComponentOptions.align = currentAlign;
                        _super.prototype.render.call(this, captionDetailsKPIComponentOptions);
                    };
                    return ValueKPIComponent;
                }(powerKpi.CaptionKPIComponent));
                powerKpi.ValueKPIComponent = ValueKPIComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var VarianceComponentWithIndicator = /** @class */ (function (_super) {
                    __extends(VarianceComponentWithIndicator, _super);
                    function VarianceComponentWithIndicator(options) {
                        var _this = _super.call(this, {
                            element: options.element,
                            className: options.className
                        }) || this;
                        _this.componentClassName = "varianceComponentWithSymbol";
                        _this.indicatorClassName = "kpiIndicator";
                        _this.indicatorValueClassName = "kpiIndicatorValueCaption";
                        _this.hiddenElementClassName = "hiddenElement";
                        _this.fakedKPIIndicatorClassName = "fakedKPIIndicator";
                        _this.glyphClassName = "powerKPI_glyphIcon";
                        _this.element.classed(_this.componentClassName, true);
                        return _this;
                    }
                    VarianceComponentWithIndicator.prototype.render = function (options) {
                        var _a = options.data, series = _a.series, _b = _a.settings, dateLabelKPI = _b.dateLabelKPI, dateValueKPI = _b.dateValueKPI, actualValueKPI = _b.actualValueKPI, actualLabelKPI = _b.actualLabelKPI, secondKPIIndicatorValue = _b.secondKPIIndicatorValue, secondKPIIndicatorLabel = _b.secondKPIIndicatorLabel, kpiIndicatorValue = _b.kpiIndicatorValue, kpiIndicatorLabel = _b.kpiIndicatorLabel, kpiIndicator = _b.kpiIndicator, variance = _a.variance;
                        var current = (series && series.length > 0 && series[0]).current, kpiIndex = NaN;
                        if (current) {
                            kpiIndex = current.kpiIndex;
                        }
                        var kpiIndicatorSettings = kpiIndicator.getCurrentKPI(kpiIndex);
                        var varianceSettings = _.clone(kpiIndicatorValue);
                        var kpiLabelSettings = _.clone(kpiIndicatorLabel);
                        kpiLabelSettings.show = kpiIndicatorLabel.isShown();
                        varianceSettings.fontColor = kpiIndicatorValue.matchKPIColor
                            && kpiIndicatorSettings
                            && kpiIndicatorSettings.color
                            ? kpiIndicatorSettings.color
                            : kpiIndicatorValue.fontColor;
                        if (isNaN(variance[0])) {
                            varianceSettings.show = false;
                        }
                        var indicatorSettings = new powerKpi.KPIIndicatorValueDescriptor();
                        indicatorSettings.fontColor = kpiIndicatorSettings.color;
                        indicatorSettings.show = kpiIndicator.show;
                        indicatorSettings.isBold = false; // This options doesn't make any sense for symbol
                        indicatorSettings.fontSize = kpiIndicator.fontSize;
                        indicatorSettings.fontFamily = null;
                        if (isNaN(kpiIndex)) {
                            indicatorSettings.show = false;
                        }
                        if (isNaN(variance[0]) && isNaN(kpiIndex)) {
                            kpiLabelSettings.show = false;
                        }
                        var currentAlign = powerKpi.AlignEnum.alignRight;
                        if (!dateLabelKPI.show
                            && !dateValueKPI.show
                            && !actualLabelKPI.show
                            && (!actualValueKPI.show || series[0] && series[0].current && isNaN(series[0] && series[0].current.y))
                            && (!secondKPIIndicatorValue.show && !secondKPIIndicatorLabel.isShown() || isNaN(variance[1]))) {
                            currentAlign = powerKpi.AlignEnum.alignLeft;
                        }
                        else if (!varianceSettings.show && !kpiLabelSettings.show) {
                            currentAlign = powerKpi.AlignEnum.alignCenter;
                        }
                        var className = kpiIndicatorSettings.shape
                            ? this.indicatorClassName + " " + this.glyphClassName + " " + kpiIndicatorSettings.shape
                            : undefined;
                        var title = kpiIndicatorLabel.label || "" + variance[0];
                        var indicatorCaption = {
                            title: title,
                            value: "",
                            settings: indicatorSettings,
                            className: className
                        };
                        var fakedIndicatorSettings = new powerKpi.KPIIndicatorValueDescriptor();
                        // We should implement a copy method for settings
                        fakedIndicatorSettings.fontColor = indicatorSettings.fontColor;
                        fakedIndicatorSettings.show = indicatorSettings.show;
                        fakedIndicatorSettings.isBold = indicatorSettings.isBold;
                        fakedIndicatorSettings.fontSize = indicatorSettings.fontSize;
                        fakedIndicatorSettings.show = fakedIndicatorSettings.show
                            && varianceSettings.show
                            && kpiLabelSettings.show
                            && !!kpiIndicatorLabel.label;
                        var fakedIndicatorCaption = {
                            title: title,
                            value: "",
                            settings: fakedIndicatorSettings,
                            className: className
                                ? className + " " + this.hiddenElementClassName + " " + this.fakedKPIIndicatorClassName
                                : this.hiddenElementClassName + " " + this.fakedKPIIndicatorClassName
                        };
                        var formatter = this.getValueFormatter(varianceSettings.displayUnits, varianceSettings.precision, kpiIndicatorValue.getFormat());
                        var valueCaption = {
                            title: title,
                            value: formatter.format(variance[0]),
                            settings: varianceSettings
                        };
                        var labelCaption = {
                            value: kpiIndicatorLabel.label,
                            settings: kpiLabelSettings,
                            className: this.indicatorValueClassName
                        };
                        var captions = [];
                        switch (powerKpi.HorizontalLayoutEnum[kpiIndicator.position]) {
                            case powerKpi.HorizontalLayoutEnum.Right: {
                                captions.push([valueCaption, indicatorCaption], [labelCaption, fakedIndicatorCaption]);
                                break;
                            }
                            case powerKpi.HorizontalLayoutEnum.Left:
                            default: {
                                captions.push([indicatorCaption, valueCaption], [fakedIndicatorCaption, labelCaption]);
                                break;
                            }
                        }
                        _super.prototype.render.call(this, {
                            captions: captions,
                            data: options.data,
                            align: currentAlign
                        });
                    };
                    return VarianceComponentWithIndicator;
                }(powerKpi.VarianceBaseComponent));
                powerKpi.VarianceComponentWithIndicator = VarianceComponentWithIndicator;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var VarianceComponentWithCustomLabel = /** @class */ (function (_super) {
                    __extends(VarianceComponentWithCustomLabel, _super);
                    function VarianceComponentWithCustomLabel(options) {
                        var _this = _super.call(this, {
                            element: options.element,
                            className: options.className
                        }) || this;
                        _this.componentClassName = "varianceComponentWithCustomLabel";
                        _this.element.classed(_this.componentClassName, true);
                        return _this;
                    }
                    VarianceComponentWithCustomLabel.prototype.render = function (options) {
                        var _a = options.data, series = _a.series, variance = _a.variance, _b = _a.settings, dateLabelKPI = _b.dateLabelKPI, dateValueKPI = _b.dateValueKPI, actualValueKPI = _b.actualValueKPI, actualLabelKPI = _b.actualLabelKPI, kpiIndicatorValue = _b.kpiIndicatorValue, kpiIndicatorLabel = _b.kpiIndicatorLabel, secondKPIIndicatorValue = _b.secondKPIIndicatorValue, secondKPIIndicatorLabel = _b.secondKPIIndicatorLabel, kpiIndicator = _b.kpiIndicator;
                        var varianceSettings = _.clone(secondKPIIndicatorValue);
                        var labelSettings = _.clone(secondKPIIndicatorLabel);
                        labelSettings.show = secondKPIIndicatorLabel.isShown();
                        if (isNaN(variance[1])) {
                            varianceSettings.show = false;
                            labelSettings.show = false;
                        }
                        var isVarianceKPIAvailable = series
                            && series.length > 0
                            && series[0]
                            && series[0].current
                            && !isNaN(series[0].current.kpiIndex);
                        var currentAlign = powerKpi.AlignEnum.alignCenter;
                        if (!dateLabelKPI.show
                            && !dateValueKPI.show
                            && (!actualValueKPI.show || series[0] && series[0].current && isNaN(series[0] && series[0].current.y))
                            && !actualLabelKPI.show) {
                            currentAlign = powerKpi.AlignEnum.alignLeft;
                        }
                        else if ((!kpiIndicatorValue.show || isNaN(variance[0]))
                            && (!kpiIndicatorLabel.isShown() || (isNaN(variance[0]) && series[0] && series[0].current && isNaN(series[0].current.kpiIndex)))
                            && (!isVarianceKPIAvailable || !kpiIndicator.show)) {
                            currentAlign = powerKpi.AlignEnum.alignRight;
                        }
                        var formatter = this.getValueFormatter(varianceSettings.displayUnits, varianceSettings.precision, secondKPIIndicatorValue.getFormat());
                        var valueCaption = {
                            value: formatter.format(variance[1]),
                            title: secondKPIIndicatorLabel.label || "" + variance[1],
                            settings: varianceSettings
                        };
                        var labelCaption = {
                            value: secondKPIIndicatorLabel.label,
                            settings: labelSettings
                        };
                        _super.prototype.render.call(this, {
                            captions: [
                                [valueCaption],
                                [labelCaption]
                            ],
                            data: options.data,
                            align: currentAlign
                        });
                    };
                    return VarianceComponentWithCustomLabel;
                }(powerKpi.VarianceBaseComponent));
                powerKpi.VarianceComponentWithCustomLabel = VarianceComponentWithCustomLabel;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
                // powerbi.visuals
                var LegendPosition = powerbi.visuals.LegendPosition;
                var KPIComponentLayoutEnum;
                (function (KPIComponentLayoutEnum) {
                    KPIComponentLayoutEnum[KPIComponentLayoutEnum["kpiComponentRow"] = 0] = "kpiComponentRow";
                    KPIComponentLayoutEnum[KPIComponentLayoutEnum["kpiComponentColumn"] = 1] = "kpiComponentColumn";
                })(KPIComponentLayoutEnum || (KPIComponentLayoutEnum = {}));
                var KPIComponent = /** @class */ (function (_super) {
                    __extends(KPIComponent, _super);
                    function KPIComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "kpiComponent";
                        _this.layout = powerKpi.LayoutEnum.Top;
                        _this.childSelector = createClassAndSelector("kpiComponentChild");
                        _this.initElement(options.element, _this.className);
                        var className = _this.childSelector.class;
                        var constructorOptions = __assign({}, options, { className: className, element: _this.element });
                        _this.components = [
                            new powerKpi.VarianceComponentWithIndicator(constructorOptions),
                            new powerKpi.DateKPIComponent(constructorOptions),
                            new powerKpi.ValueKPIComponent(constructorOptions),
                            new powerKpi.VarianceComponentWithCustomLabel(constructorOptions),
                        ];
                        return _this;
                    }
                    KPIComponent.prototype.render = function (options) {
                        var _this = this;
                        var _a = options.data, _b = _a.viewport, width = _b.width, height = _b.height, _c = _a.settings, layout = _c.layout, legend = _c.legend;
                        var viewport = { width: width, height: height };
                        this.layout = powerKpi.LayoutEnum[layout.getLayout()];
                        this.applyStyleBasedOnLayout(layout, legend, viewport);
                        var howManyComponentsWasRendered = 0;
                        this.components.forEach(function (component) {
                            component.render(options);
                            if (component.isRendered()) {
                                howManyComponentsWasRendered++;
                            }
                            if (component.getViewport) {
                                var margins = component.getViewport();
                                switch (_this.layout) {
                                    case powerKpi.LayoutEnum.Left:
                                    case powerKpi.LayoutEnum.Right: {
                                        options.data.viewport.height -= margins.height;
                                        break;
                                    }
                                    case powerKpi.LayoutEnum.Bottom:
                                    case powerKpi.LayoutEnum.Top:
                                    default: {
                                        options.data.viewport.width -= margins.width;
                                        break;
                                    }
                                }
                            }
                        });
                        options.data.viewport = viewport;
                        this.applyWidthToChildren(howManyComponentsWasRendered);
                    };
                    KPIComponent.prototype.applyStyleBasedOnLayout = function (layoutSettings, legend, viewport) {
                        var currentLayout, kpiLayout, maxWidth;
                        switch (powerKpi.LayoutEnum[layoutSettings.getLayout()]) {
                            case powerKpi.LayoutEnum.Left:
                            case powerKpi.LayoutEnum.Right: {
                                kpiLayout = KPIComponentLayoutEnum.kpiComponentColumn;
                                maxWidth = null;
                                if (!legend.show
                                    || (LegendPosition[legend.position]
                                        && (LegendPosition[legend.position] === LegendPosition.Bottom
                                            || LegendPosition[legend.position] === LegendPosition.BottomCenter))) {
                                    currentLayout = powerKpi.LayoutToStyleEnum.columnReversedLayout;
                                }
                                else {
                                    currentLayout = powerKpi.LayoutToStyleEnum.columnLayout;
                                }
                                break;
                            }
                            case powerKpi.LayoutEnum.Bottom:
                            case powerKpi.LayoutEnum.Top:
                            default: {
                                currentLayout = powerKpi.LayoutToStyleEnum.rowLayout;
                                kpiLayout = KPIComponentLayoutEnum.kpiComponentRow;
                                maxWidth = PixelConverter.toString(Math.floor(viewport.width));
                                break;
                            }
                        }
                        this.element
                            .style({
                            "max-width": maxWidth
                        })
                            .attr({
                            "class": this.className + " " + powerKpi.LayoutToStyleEnum[currentLayout] + " " + KPIComponentLayoutEnum[kpiLayout]
                        });
                    };
                    KPIComponent.prototype.applyWidthToChildren = function (howManyComponentsWasRendered) {
                        var width = 100;
                        if (this.layout === powerKpi.LayoutEnum.Top || this.layout === powerKpi.LayoutEnum.Bottom) {
                            width = width / howManyComponentsWasRendered;
                        }
                        var widthInPercentage = width + "%";
                        this.element
                            .selectAll(this.childSelector.selector)
                            .style({
                            width: widthInPercentage,
                            "max-width": widthInPercentage
                        });
                    };
                    /**
                     * The clientHeight and clientWidth might return invalid values if some DOM elements force this element to squash.
                     * Such issue often occurs if flex layout is used
                     *
                     * To fix this issue plotComponent is hidden by default.
                     */
                    KPIComponent.prototype.getViewport = function () {
                        var viewport = {
                            height: 0,
                            width: 0
                        };
                        if (this.element) {
                            var element = this.element.node();
                            switch (this.layout) {
                                case powerKpi.LayoutEnum.Left:
                                case powerKpi.LayoutEnum.Right: {
                                    viewport.width = element.clientWidth;
                                    break;
                                }
                                case powerKpi.LayoutEnum.Top:
                                case powerKpi.LayoutEnum.Bottom:
                                default: {
                                    viewport.height = element.clientHeight;
                                    break;
                                }
                            }
                        }
                        return viewport;
                    };
                    return KPIComponent;
                }(powerKpi.BaseContainerComponent));
                powerKpi.KPIComponent = KPIComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon.CssConstants
                var PixelConverter = jsCommon.PixelConverter;
                var createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
                var SubtitleComponent = /** @class */ (function (_super) {
                    __extends(SubtitleComponent, _super);
                    function SubtitleComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "subtitleComponent";
                        _this.subTitleSelector = createClassAndSelector("subtitle");
                        _this.initElement(options.element, _this.className);
                        return _this;
                    }
                    SubtitleComponent.prototype.render = function (options) {
                        var subtitle = options.data.settings.subtitle;
                        var data = subtitle.show
                            ? [subtitle]
                            : [];
                        var subtitleSelection = this.element
                            .selectAll(this.subTitleSelector.selector)
                            .data(data);
                        subtitleSelection
                            .enter()
                            .append("div")
                            .classed(this.subTitleSelector.class, true);
                        subtitleSelection
                            .text(function (settings) { return settings.titleText; })
                            .style({
                            color: function (settings) { return settings.fontColor; },
                            "text-align": function (settings) { return settings.alignment; },
                            "font-size": function (settings) {
                                var fontSizeInPx = PixelConverter.fromPointToPixel(settings.fontSize);
                                return PixelConverter.toString(fontSizeInPx);
                            },
                            "background-color": function (settings) { return settings.background; },
                            "font-family": function (settings) { return settings.fontFamily; },
                        });
                        subtitleSelection
                            .exit()
                            .remove();
                    };
                    SubtitleComponent.prototype.getViewport = function () {
                        var viewport = {
                            height: 0,
                            width: 0
                        };
                        if (this.element) {
                            viewport.height = $(this.element.node()).height();
                        }
                        return viewport;
                    };
                    return SubtitleComponent;
                }(powerKpi.BaseComponent));
                powerKpi.SubtitleComponent = SubtitleComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon
                var PixelConverter = jsCommon.PixelConverter;
                var LayoutComponent = /** @class */ (function (_super) {
                    __extends(LayoutComponent, _super);
                    function LayoutComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "layoutComponent";
                        _this.initElement(options.element, _this.className);
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        _this.components = [
                            new powerKpi.KPIComponent(_this.constructorOptions),
                            new powerKpi.PlotComponent(_this.constructorOptions),
                        ];
                        return _this;
                    }
                    LayoutComponent.prototype.render = function (options) {
                        var _a = options.data, viewport = _a.viewport, layout = _a.settings.layout;
                        var selectedLayout = this.getLayout(layout.getLayout());
                        var widthInPx = PixelConverter.toString(viewport.width);
                        var heightInPx = PixelConverter.toString(viewport.height);
                        this.element
                            .attr({
                            "class": this.getClassNameWithPrefix(this.className) + " " + powerKpi.LayoutToStyleEnum[selectedLayout]
                        })
                            .style({
                            "min-width": widthInPx,
                            "max-width": widthInPx,
                            "width": widthInPx,
                            "min-height": heightInPx,
                            "max-height": heightInPx,
                            "height": heightInPx,
                        });
                        this.forEach(this.components, function (component) {
                            component.render(options);
                            if (component.getViewport) {
                                var margins = component.getViewport();
                                options.data.viewport.height -= margins.height;
                                options.data.viewport.width -= margins.width;
                            }
                        });
                    };
                    LayoutComponent.prototype.getLayout = function (layout) {
                        switch (powerKpi.LayoutEnum[layout]) {
                            case powerKpi.LayoutEnum.Left: {
                                return powerKpi.LayoutToStyleEnum.rowLayout;
                            }
                            case powerKpi.LayoutEnum.Right: {
                                return powerKpi.LayoutToStyleEnum.rowReversedLayout;
                            }
                            case powerKpi.LayoutEnum.Bottom: {
                                return powerKpi.LayoutToStyleEnum.columnReversedLayout;
                            }
                            case powerKpi.LayoutEnum.Top:
                            default: {
                                return powerKpi.LayoutToStyleEnum.columnLayout;
                            }
                        }
                    };
                    return LayoutComponent;
                }(powerKpi.BaseContainerComponent));
                powerKpi.LayoutComponent = LayoutComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // jsCommon.CssConstants
                var PixelConverter = jsCommon.PixelConverter;
                var MainComponent = /** @class */ (function (_super) {
                    __extends(MainComponent, _super);
                    function MainComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "powerKPI";
                        _this.classNameForPhantomJs = "powerKPI_phantom_js";
                        _this.initElement(options.element, _this.className);
                        _this.element.classed(_this.classNameForPhantomJs, _this.isExecutedInPhantomJs());
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        _this.components = [
                            new powerKpi.SubtitleComponent(_this.constructorOptions),
                            new powerKpi.CommonComponent(_this.constructorOptions),
                        ];
                        return _this;
                    }
                    /**
                     * We detect Phantom JS in order to detect PBI Snapshot Service
                     * This is required as phantom js does not support CSS Flex Box well
                     *
                     * This code must be removed once PBI Snapshot Service is updated to Chromium
                     */
                    MainComponent.prototype.isExecutedInPhantomJs = function () {
                        try {
                            return /PhantomJS/.test(window.navigator.userAgent);
                        }
                        catch (_) {
                            return false;
                        }
                    };
                    MainComponent.prototype.render = function (options) {
                        var _a = options.data, series = _a.series, viewport = _a.viewport, kpiIndicator = _a.settings.kpiIndicator;
                        var backgroundColor = null;
                        if (kpiIndicator.shouldBackgroundColorMatchKpiColor
                            && series
                            && series.length > 0
                            && series[0]
                            && series[0].current) {
                            var kpiIndicatorSettings = kpiIndicator.getCurrentKPI(series[0].current.kpiIndex);
                            if (kpiIndicatorSettings && kpiIndicatorSettings.color) {
                                backgroundColor = kpiIndicatorSettings.color;
                            }
                        }
                        this.element.style({
                            width: PixelConverter.toString(viewport.width),
                            height: PixelConverter.toString(viewport.height),
                            "background-color": backgroundColor,
                        });
                        this.forEach(this.components, function (component) {
                            component.render(options);
                            if (component.getViewport) {
                                var margins = component.getViewport();
                                options.data.viewport.height -= margins.height;
                                options.data.viewport.width -= margins.width;
                            }
                        });
                    };
                    return MainComponent;
                }(powerKpi.BaseContainerComponent));
                powerKpi.MainComponent = MainComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                // powerbi.visuals
                var LegendPosition = powerbi.visuals.LegendPosition;
                var CommonComponent = /** @class */ (function (_super) {
                    __extends(CommonComponent, _super);
                    function CommonComponent(options) {
                        var _this = _super.call(this) || this;
                        _this.className = "commonComponent";
                        _this.initElement(options.element, _this.className, "div");
                        _this.element.classed(_this.className, true);
                        _this.constructorOptions = __assign({}, options, { element: _this.element });
                        _this.components = [
                            new powerKpi.LegendComponent(_this.constructorOptions),
                            new powerKpi.LayoutComponent(_this.constructorOptions),
                        ];
                        return _this;
                    }
                    CommonComponent.prototype.render = function (options) {
                        var viewport = __assign({}, options.data.viewport);
                        this.forEach(this.components, function (component) {
                            component.render(options);
                            if (component.getViewport) {
                                var viewport_1 = component.getViewport();
                                options.data.viewport.height -= viewport_1.height;
                                options.data.viewport.width -= viewport_1.width;
                            }
                        });
                        var legend = options.data.settings.legend;
                        var layout = this.getLayout(legend.position);
                        this.element.attr({
                            "class": this.getClassNameWithPrefix(this.className) + " " + powerKpi.LayoutToStyleEnum[layout]
                        });
                    };
                    CommonComponent.prototype.getLayout = function (position) {
                        switch (LegendPosition[position]) {
                            case LegendPosition.Left:
                            case LegendPosition.LeftCenter: {
                                return powerKpi.LayoutToStyleEnum.rowLayout;
                            }
                            case LegendPosition.Right:
                            case LegendPosition.RightCenter: {
                                return powerKpi.LayoutToStyleEnum.rowReversedLayout;
                            }
                            case LegendPosition.Top:
                            case LegendPosition.TopCenter: {
                                return powerKpi.LayoutToStyleEnum.columnLayout;
                            }
                            case LegendPosition.Bottom:
                            case LegendPosition.BottomCenter:
                            default: {
                                return powerKpi.LayoutToStyleEnum.columnReversedLayout;
                            }
                        }
                    };
                    return CommonComponent;
                }(powerKpi.BaseContainerComponent));
                powerKpi.CommonComponent = CommonComponent;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            var powerKpi;
            (function (powerKpi) {
                var Behavior = /** @class */ (function () {
                    function Behavior() {
                    }
                    Behavior.prototype.bindEvents = function (options, selectionHandler) {
                        this.options = options;
                        this.options.eventDispatcher.on(powerKpi.EventName.onSelect, function (event, series) {
                            if (!event || !series) {
                                return;
                            }
                            selectionHandler.handleSelection(series, event.ctrlKey, { x: 100, y: 100 });
                        });
                        this.options.eventDispatcher.on(powerKpi.EventName.onClearSelection, function () {
                            selectionHandler.handleClearSelection();
                        });
                    };
                    Behavior.prototype.renderSelection = function () {
                        this.options.eventDispatcher[powerKpi.EventName.onHighlight](this.options.interactivityService.hasSelection());
                    };
                    return Behavior;
                }());
                powerKpi.Behavior = Behavior;
            })(powerKpi = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi || (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi = {}));
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var powerKPI462CE5C2666F4EC8A8BDD7E5587320A3;
        (function (powerKPI462CE5C2666F4EC8A8BDD7E5587320A3) {
            // powerKPI
            var Behavior = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi.Behavior;
            var EventName = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi.EventName;
            var MainComponent = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi.MainComponent;
            var SeriesSettings = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi.SeriesSettings;
            var CapabilitiesFactory = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi.CapabilitiesFactory;
            var CommonCapabilitiesBuilder = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi.CommonCapabilitiesBuilder;
            var PowerKPI = /** @class */ (function () {
                function PowerKPI() {
                    this.eventDispatcher = d3.dispatch.apply(d3, Object.keys(EventName));
                }
                PowerKPI.prototype.init = function (options) {
                    this.rootElement = d3.select(options.element.get(0));
                    this.converter = powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.powerKpi.createConverter();
                    this.behavior = new Behavior();
                    this.interactivityService = visuals.createInteractivityService(options.host);
                    this.style = options.style;
                    this.component = new MainComponent({
                        element: this.rootElement,
                        style: this.style,
                        eventDispatcher: this.eventDispatcher,
                        interactivityService: this.interactivityService,
                    });
                };
                PowerKPI.prototype.update = function (options) {
                    var dataView = options && options.dataViews && options.dataViews[0];
                    var viewport = options
                        && options.viewport
                        && {
                            width: options.viewport.width - PowerKPI.ViewportReducer,
                            height: options.viewport.height - PowerKPI.ViewportReducer,
                        }
                        || { height: 0, width: 0 };
                    var dataRepresentation = this.converter.convert({
                        dataView: dataView,
                        viewport: viewport,
                        style: this.style,
                        hasSelection: this.interactivityService && this.interactivityService.hasSelection(),
                    });
                    if (this.interactivityService) {
                        this.interactivityService.applySelectionStateToData(dataRepresentation.series);
                        var behaviorOptions = {
                            eventDispatcher: this.eventDispatcher,
                            interactivityService: this.interactivityService,
                        };
                        this.interactivityService.bind(dataRepresentation.series, this.behavior, behaviorOptions);
                    }
                    this.render(dataRepresentation);
                };
                PowerKPI.prototype.render = function (dataRepresentation) {
                    this.dataRepresentation = dataRepresentation;
                    this.component.render({
                        data: this.dataRepresentation
                    });
                };
                PowerKPI.prototype.enumerateObjectInstances = function (options) {
                    var objectName = options.objectName;
                    var shouldUseContainers = Object.keys(new SeriesSettings()).indexOf(objectName) !== -1;
                    if (shouldUseContainers) {
                        var enumerationBuilder = new visuals.ObjectEnumerationBuilder();
                        this.enumerateSettings(enumerationBuilder, objectName, this.getSettings.bind(this));
                        return enumerationBuilder.complete();
                    }
                    var instances = this.dataRepresentation
                        && this.dataRepresentation.settings
                        && this.dataRepresentation.settings.enumerateObjectInstances(options)
                        || [];
                    switch (options.objectName) {
                        case "kpiIndicator": {
                            if (this.dataRepresentation
                                && (this.dataRepresentation.variance
                                    && isNaN(this.dataRepresentation.variance[0])
                                    || (this.dataRepresentation.settings
                                        && !this.dataRepresentation.settings.kpiIndicatorValue.show))
                                && instances
                                && instances[0]
                                && instances[0].properties) {
                                delete instances[0].properties["position"];
                            }
                            break;
                        }
                        case "kpiIndicatorValue": {
                            if (this.dataRepresentation
                                && this.dataRepresentation.variance
                                && isNaN(this.dataRepresentation.variance[0])) {
                                instances = [];
                            }
                            break;
                        }
                        case "kpiIndicatorLabel": {
                            if (this.dataRepresentation
                                && this.dataRepresentation.variance
                                && isNaN(this.dataRepresentation.variance[0])
                                && this.dataRepresentation.series
                                && this.dataRepresentation.series[0]
                                && this.dataRepresentation.series[0].current
                                && isNaN(this.dataRepresentation.series[0].current.kpiIndex)) {
                                instances = [];
                            }
                            break;
                        }
                        case "secondKPIIndicatorValue":
                        case "secondKPIIndicatorLabel":
                        case "secondTooltipVariance": {
                            if (!this.dataRepresentation.series
                                || !this.dataRepresentation.variance
                                || isNaN(this.dataRepresentation.variance[1])) {
                                instances = [];
                            }
                            break;
                        }
                        case "secondaryYAxis":
                        case "secondaryReferenceLineOfYAxis": {
                            if (!this.dataRepresentation
                                || !this.dataRepresentation.groups
                                || !this.dataRepresentation.groups[1]) {
                                instances = [];
                            }
                            break;
                        }
                    }
                    return instances;
                };
                PowerKPI.prototype.enumerateSettings = function (enumerationBuilder, objectName, getSettings) {
                    this.applySettings(objectName, "[All]", null, enumerationBuilder, getSettings(this.dataRepresentation.settings[objectName]));
                    this.enumerateSettingsDeep(this.getSeries(this.dataRepresentation), objectName, enumerationBuilder, getSettings);
                };
                PowerKPI.prototype.getSeries = function (dataRepresentation) {
                    if (!dataRepresentation) {
                        return [];
                    }
                    if (!dataRepresentation.isGrouped) {
                        return dataRepresentation.series;
                    }
                    var seriesGroup = dataRepresentation.groups
                        .filter(function (group) {
                        return !!group && !!group.series;
                    })[0];
                    return seriesGroup && seriesGroup.series || [];
                };
                PowerKPI.prototype.getSettings = function (settings) {
                    return settings.enumerateProperties();
                };
                PowerKPI.prototype.applySettings = function (objectName, displayName, selector, enumerationBuilder, properties) {
                    enumerationBuilder.pushContainer({ displayName: displayName });
                    var instance = {
                        selector: selector,
                        objectName: objectName,
                        properties: properties,
                    };
                    enumerationBuilder.pushInstance(instance);
                    enumerationBuilder.popContainer();
                };
                PowerKPI.prototype.enumerateSettingsDeep = function (seriesArray, objectName, enumerationBuilder, getSettings) {
                    for (var _i = 0, seriesArray_1 = seriesArray; _i < seriesArray_1.length; _i++) {
                        var series = seriesArray_1[_i];
                        var name_2 = series.groupName || series.name;
                        this.applySettings(objectName, name_2, visuals.ColorHelper.normalizeSelector(series.identity.getSelector()), enumerationBuilder, getSettings(series.settings[objectName]));
                    }
                };
                PowerKPI.prototype.onClearSelection = function () {
                    if (this.interactivityService) {
                        this.interactivityService.clearSelection();
                    }
                };
                PowerKPI.prototype.onRestoreSelection = function (options) {
                    if (this.interactivityService && options) {
                        return this.interactivityService.restoreSelection(options.selection);
                    }
                    return false;
                };
                PowerKPI.prototype.destroy = function () {
                    this.component.destroy();
                    this.converter = null;
                    this.rootElement = null;
                    this.component = null;
                    this.dataRepresentation = null;
                    this.interactivityService = null;
                    this.behavior = null;
                };
                PowerKPI.ViewportReducer = 3;
                PowerKPI.capabilities = new CapabilitiesFactory([
                    new CommonCapabilitiesBuilder(),
                ]).getCapabilities();
                return PowerKPI;
            }());
            powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.PowerKPI = PowerKPI;
        })(powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 || (visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3 = {
                name: 'powerKPI462CE5C2666F4EC8A8BDD7E5587320A3',
                class: 'powerKPI462CE5C2666F4EC8A8BDD7E5587320A3',
                capabilities: powerbi.visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.PowerKPI.capabilities,
                custom: true,
                create: function () { return new powerbi.visuals.powerKPI462CE5C2666F4EC8A8BDD7E5587320A3.PowerKPI(); }
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
