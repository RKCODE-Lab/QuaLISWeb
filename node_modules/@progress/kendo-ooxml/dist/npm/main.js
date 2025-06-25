'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var JSZip = _interopDefault(require('@progress/jszip-esm'));

var current = {
    compile: function(template) {
        return template;
    }
};

var TemplateService = function TemplateService () {};

TemplateService.register = function register (userImplementation) {
    current = userImplementation;
};

TemplateService.compile = function compile (template) {
    return current.compile(template);
};

var FIELD_REGEX = /\[(?:(\d+)|['"](.*?)['"])\]|((?:(?!\[.*?\]|\.).)+)/g;
var getterCache = {};
var UNDEFINED = 'undefined';

getterCache[UNDEFINED] = function(obj) {
    return obj;
};

function getter(field) {
    if (getterCache[field]) {
        return getterCache[field];
    }

    var fields = [];
    field.replace(FIELD_REGEX, function(match, index, indexAccessor, field) {
        fields.push(typeof index !== UNDEFINED ? index : (indexAccessor || field));
    });

    getterCache[field] = function(obj) {
        var result = obj;
        for (var idx = 0; idx < fields.length && result; idx++) {
            result = result[fields[idx]];
        }

        return result;
    };

    return getterCache[field];
}

function map(array, func) {
    return array.reduce(function (result, el, i) {
        var val = func(el, i);
        if (val != null) {
            result.push(val);
        }
        return result;
    }, []);
}

function defaultGroupHeaderTemplate(data) {
    return ((data.title) + ": " + (data.value));
}

function createArray(length, callback) {
    var result = [];

    for (var idx = 0; idx < length; idx++) {
        result.push(callback(idx));
    }

    return result;
}

function defaultItemId(item) {
    return item.id;
}

var ExcelExporter = function ExcelExporter(options) {
    options.columns = this._trimColumns(options.columns || []);

    this.allColumns = map(this._leafColumns(options.columns || []), this._prepareColumn);

    this.columns = this._visibleColumns(this.allColumns);

    this.options = options;
    this.data = options.data || [];
    this.aggregates = options.aggregates || {};
    this.groups = [].concat(options.groups || []);
    this.hasGroups = this.groups.length > 0;
    this.hierarchy = options.hierarchy;
    this.hasGroupHeaderColumn = this.columns.some(function (column) { return column.groupHeaderColumnTemplate; });
    this.collapsible = this.options.collapsible;
};

ExcelExporter.prototype.workbook = function workbook () {
    var workbook = {
        sheets: [ {
            columns: this._columns(),
            rows: this.hierarchy ? this._hierarchyRows() : this._rows(),
            freezePane: this._freezePane(),
            filter: this._filter()
        } ]
    };

    return workbook;
};

ExcelExporter.prototype._trimColumns = function _trimColumns (columns) {
        var this$1 = this;

    return columns.filter(function (column) {
        var result = Boolean(column.field);

        if (!result && column.columns) {
            result = this$1._trimColumns(column.columns).length > 0;
        }

        return result;
    });
};

ExcelExporter.prototype._leafColumns = function _leafColumns (columns) {
        var this$1 = this;

    var result = [];

    for (var idx = 0; idx < columns.length; idx++) {
        if (!columns[idx].columns) {
            result.push(columns[idx]);
        } else {
            result = result.concat(this$1._leafColumns(columns[idx].columns));
        }
    }

    return result;
};

ExcelExporter.prototype._prepareColumn = function _prepareColumn (column) {
    if (!column.field) {
        return null;
    }

    var value = function(dataItem) {
        return getter(column.field, true)(dataItem);
    };

    var values = null;

    if (column.values) {
        values = {};

        column.values.forEach(function(item) {
            values[item.value] = item.text;
        });

        value = function(dataItem) {
            return values[getter(column.field, true)(dataItem)];
        };
    }

    return Object.assign({}, column, {
        value: value,
        values: values,
        groupHeaderTemplate: column.groupHeaderTemplate ? TemplateService.compile(column.groupHeaderTemplate) : defaultGroupHeaderTemplate,
        groupHeaderColumnTemplate: column.groupHeaderColumnTemplate ? TemplateService.compile(column.groupHeaderColumnTemplate) : null,
        groupFooterTemplate: column.groupFooterTemplate ? TemplateService.compile(column.groupFooterTemplate) : null,
        footerTemplate: column.footerTemplate ? TemplateService.compile(column.footerTemplate) : null
    });
};

ExcelExporter.prototype._filter = function _filter () {
    if (!this.options.filterable) {
        return null;
    }

    var depth = this._depth();

    return {
        from: depth,
        to: depth + this.columns.length - 1
    };
};

ExcelExporter.prototype._createPaddingCells = function _createPaddingCells (length) {
        var this$1 = this;

    return createArray(length, function () { return Object.assign({
        background: "#dfdfdf",
        color: "#333"
    }, this$1.options.paddingCellOptions); });
};

ExcelExporter.prototype._dataRow = function _dataRow (dataItem, level, depth) {
        var this$1 = this;

    var cells = this._createPaddingCells(level);

    // grouped
    if (this.hasGroups && depth && dataItem.items) {
        cells = cells.concat(this._groupHeaderCells(dataItem, level, depth));
        var rows = this._dataRows(dataItem.items, level + 1);

        rows.unshift({
            type: "group-header",
            cells: cells,
            level: this.collapsible ? level : null
        });

        return rows.concat(this._footer(dataItem, level));
    }

    var dataCells = [];

    for (var cellIdx = 0; cellIdx < this.columns.length; cellIdx++) {
        dataCells[cellIdx] = this$1._cell(dataItem, this$1.columns[cellIdx]);
    }

    if (this.hierarchy) {
        dataCells[0].colSpan = depth - level + 1;
    }

    return [ {
        type: "data",
        cells: cells.concat(dataCells),
        level: this.collapsible ? level : null
    } ];
};

ExcelExporter.prototype._groupHeaderCells = function _groupHeaderCells (dataItem, level, depth) {
    var cells = [];

    var column = this.allColumns.filter(function(column) {
        return column.field === dataItem.field;
    })[0] || {};

    var title = column && column.title ? column.title : dataItem.field;
    var template = column ? column.groupHeaderTemplate || column.groupHeaderColumnTemplate : null;
    var group = Object.assign({
        title: title,
        field: dataItem.field,
        value: column && column.values ? column.values[dataItem.value] : dataItem.value,
        aggregates: dataItem.aggregates,
        items: dataItem.items
    }, dataItem.aggregates[dataItem.field]);

    var value = template ? template(group) : (title + ": " + (dataItem.value));

    cells.push(Object.assign({
        value: value,
        background: "#dfdfdf",
        color: "#333",
        colSpan: (this.hasGroupHeaderColumn ? 1 : this.columns.length) + depth - level
    }, column.groupHeaderCellOptions));

    if (this.hasGroupHeaderColumn) {
        this.columns.forEach(function(column, index) {
            if (index > 0) {
                cells.push(Object.assign({
                    background: "#dfdfdf",
                    color: "#333",
                    value: column.groupHeaderColumnTemplate ?
                        column.groupHeaderColumnTemplate(Object.assign({ group: group }, group, dataItem.aggregates[column.field])) :
                        undefined
                }, column.groupHeaderCellOptions));
            }
        });
    }

    return cells;
};

ExcelExporter.prototype._dataRows = function _dataRows (dataItems, level) {
        var this$1 = this;

    var depth = this._depth();
    var rows = [];

    for (var idx = 0; idx < dataItems.length; idx++) {
        rows.push.apply(rows, this$1._dataRow(dataItems[idx], level, depth));
    }

    return rows;
};

ExcelExporter.prototype._hierarchyRows = function _hierarchyRows () {
        var this$1 = this;

    var depth = this._depth();
    var data = this.data;
    var itemLevel = this.hierarchy.itemLevel;
    var itemId = this.hierarchy.itemId || defaultItemId;
    var hasFooter = this._hasFooterTemplate();
    var rows = [];
    var parents = [];
    var previousLevel = 0;
    var previousItemId;

    if (!hasFooter) {
        this.collapsible = false;
    }

    for (var idx = 0; idx < data.length; idx++) {
        var item = data[idx];
        var level = itemLevel(item, idx);

        if (hasFooter) {
            if (level > previousLevel) {
                parents.push({ id: previousItemId, level: previousLevel });
            } else if (level < previousLevel) {
                rows.push.apply(rows, this$1._hierarchyFooterRows(parents, level, depth));
            }

            previousLevel = level;
            previousItemId = itemId(item, idx);
        }

        rows.push.apply(rows, this$1._dataRow(item, level + 1, depth));
    }

    if (hasFooter) {
        rows.push.apply(rows, this._hierarchyFooterRows(parents, 0, depth));

        var rootAggregate = data.length ? this.aggregates[data[0].parentId] : {};
        rows.push(this._hierarchyFooter(rootAggregate, 0, depth));
    }

    this._prependHeaderRows(rows);

    return rows;
};

ExcelExporter.prototype._hierarchyFooterRows = function _hierarchyFooterRows (parents, currentLevel, depth) {
        var this$1 = this;

    var rows = [];
    while (parents.length && parents[parents.length - 1].level >= currentLevel) {
        var parent = parents.pop();
        rows.push(this$1._hierarchyFooter(this$1.aggregates[parent.id], parent.level + 1, depth));
    }

    return rows;
};

ExcelExporter.prototype._hasFooterTemplate = function _hasFooterTemplate () {
    var columns = this.columns;
    for (var idx = 0; idx < columns.length; idx++) {
        if (columns[idx].footerTemplate) {
            return true;
        }
    }
};

ExcelExporter.prototype._hierarchyFooter = function _hierarchyFooter (aggregates, level, depth) {
    var cells = this.columns.map(function(column, index) {
        var colSpan = index ? 1 : depth - level + 1;
        if (column.footerTemplate) {
            var fieldAggregates = (aggregates || {})[column.field];
            return Object.assign({
                background: "#dfdfdf",
                color: "#333",
                colSpan: colSpan,
                value: column.footerTemplate(Object.assign({ aggregates: aggregates }, fieldAggregates))
            }, column.footerCellOptions);
        }

        return Object.assign({
            background: "#dfdfdf",
            color: "#333",
            colSpan: colSpan
        }, column.footerCellOptions);
    });

    return {
        type: "footer",
        cells: this._createPaddingCells(level).concat(cells),
        level: this.collapsible ? level : null
    };
};

ExcelExporter.prototype._footer = function _footer (dataItem, level) {
    var rows = [];
    var footer = this.columns.some(function (column) { return column.groupFooterTemplate; });

    var templateData, group;
    if (footer) {
        group = {
            group: { items: dataItem.items,
                     field: dataItem.field,
                     value: dataItem.value }
        };
        templateData = {};
        Object.keys(dataItem.aggregates).forEach(function (key) {
            templateData[key] = Object.assign({}, dataItem.aggregates[key], group);
        });
    }

    var cells = this.columns.map(function (column) {
        if (column.groupFooterTemplate) {
            var data = Object.assign({}, templateData, dataItem.aggregates[column.field], group);
            return Object.assign({
                background: "#dfdfdf",
                color: "#333",
                value: column.groupFooterTemplate(data)
            }, column.groupFooterCellOptions);
        }

        return Object.assign({
            background: "#dfdfdf",
            color: "#333"
        }, column.groupFooterCellOptions);
    });

    if (footer) {
        rows.push({
            type: "group-footer",
            cells: this._createPaddingCells(this.groups.length).concat(cells),
            level: this.collapsible ? level : null
        });
    }

    return rows;
};

ExcelExporter.prototype._isColumnVisible = function _isColumnVisible (column) {
    return this._visibleColumns([ column ]).length > 0 && (column.field || column.columns);
};

ExcelExporter.prototype._visibleColumns = function _visibleColumns (columns) {
        var this$1 = this;

    return columns.filter(function (column) {
        var exportable = column.exportable;
        if (typeof exportable === 'object') {
            exportable = column.exportable.excel;
        }

        var visibleInExport = !column.hidden && exportable !== false;
        var visibleInExportOnly = column.hidden && exportable === true;
        var visible = visibleInExport || visibleInExportOnly;
        if (visible && column.columns) {
            visible = this$1._visibleColumns(column.columns).length > 0;
        }
        return visible;
    });
};

ExcelExporter.prototype._headerRow = function _headerRow (row, groups) {
        var this$1 = this;

    var headers = row.cells.map(function(cell) {
        return Object.assign(cell, {
            colSpan: cell.colSpan > 1 ? cell.colSpan : 1,
            rowSpan: row.rowSpan > 1 && !cell.colSpan ? row.rowSpan : 1
        });
    });

    if (this.hierarchy && headers[0].firstCell) {
        headers[0].colSpan += this._depth();
    }

    return {
        type: "header",
        cells: createArray(groups.length, function () { return Object.assign({
            background: "#7a7a7a",
            color: "#fff"
        }, this$1.options.headerPaddingCellOptions); }).concat(headers)
    };
};

ExcelExporter.prototype._prependHeaderRows = function _prependHeaderRows (rows) {
        var this$1 = this;

    var groups = this.groups;

    var headerRows = [ { rowSpan: 1, cells: [], index: 0 } ];

    this._prepareHeaderRows(headerRows, this.options.columns);

    for (var idx = headerRows.length - 1; idx >= 0; idx--) {
        rows.unshift(this$1._headerRow(headerRows[idx], groups));
    }
};

ExcelExporter.prototype._prepareHeaderRows = function _prepareHeaderRows (rows, columns, parentCell, parentRow) {
        var this$1 = this;

    var row = parentRow || rows[rows.length - 1];
    var childRow = rows[row.index + 1];
    var totalColSpan = 0;

    for (var idx = 0; idx < columns.length; idx++) {
        var column = columns[idx];
        if (this$1._isColumnVisible(column)) {

            var cell = Object.assign({
                background: "#7a7a7a",
                color: "#fff",
                value: column.title || column.field,
                colSpan: 0,
                firstCell: idx === 0 && (!parentCell || parentCell.firstCell)
            }, column.headerCellOptions);
            row.cells.push(cell);

            if (column.columns && column.columns.length) {
                if (!childRow) {
                    childRow = { rowSpan: 0, cells: [], index: rows.length };
                    rows.push(childRow);
                }
                cell.colSpan = this$1._trimColumns(this$1._visibleColumns(column.columns)).length;
                this$1._prepareHeaderRows(rows, column.columns, cell, childRow);
                totalColSpan += cell.colSpan - 1;
                row.rowSpan = rows.length - row.index;
            }
        }
    }

    if (parentCell) {
        parentCell.colSpan += totalColSpan;
    }
};

ExcelExporter.prototype._rows = function _rows () {
        var this$1 = this;

    var rows = this._dataRows(this.data, 0);

    if (this.columns.length) {
        this._prependHeaderRows(rows);
        var footer = false;

        var cells = this.columns.map(function (column) {
            if (column.footerTemplate) {
                footer = true;

                return Object.assign({
                    background: "#dfdfdf",
                    color: "#333",
                    value: column.footerTemplate(Object.assign({}, this$1.aggregates, this$1.aggregates[column.field]))
                }, column.footerCellOptions);
            }

            return Object.assign({
                background: "#dfdfdf",
                color: "#333"
            }, column.footerCellOptions);
        });

        if (footer) {
            rows.push({
                type: "footer",
                cells: this._createPaddingCells(this.groups.length).concat(cells)
            });
        }
    }

    return rows;
};

ExcelExporter.prototype._headerDepth = function _headerDepth (columns) {
        var this$1 = this;

    var result = 1;
    var max = 0;

    for (var idx = 0; idx < columns.length; idx++) {
        if (columns[idx].columns) {
            var temp = this$1._headerDepth(columns[idx].columns);
            if (temp > max) {
                max = temp;
            }
        }
    }
    return result + max;
};

ExcelExporter.prototype._freezePane = function _freezePane () {
    var columns = this._visibleColumns(this.options.columns || []);

    var colSplit = this._visibleColumns(this._trimColumns(this._leafColumns(columns.filter(function(column) {
        return column.locked;
    })))).length;

    return {
        rowSplit: this._headerDepth(columns),
        colSplit: colSplit ? colSplit + this.groups.length : 0
    };
};

ExcelExporter.prototype._cell = function _cell (dataItem, column) {
    return Object.assign({
        value: column.value(dataItem)
    }, column.cellOptions);
};

ExcelExporter.prototype._depth = function _depth () {
    var depth = 0;

    if (this.hierarchy) {
        depth = this.hierarchy.depth;
    } else {
        depth = this.groups.length;
    }

    return depth;
};

ExcelExporter.prototype._columns = function _columns () {
    var depth = this._depth();
    var columns = createArray(depth, function () { return ({ width: 20 }); });

    return columns.concat(this.columns.map(function(column) {
        return {
            width: parseInt(column.width, 10),
            autoWidth: column.width ? false : true
        };
    }));
};

var current$1 = {
    toString: function (value) { return value; }
};

var IntlService = function IntlService () {};

IntlService.register = function register (userImplementation) {
    current$1 = userImplementation;
};

IntlService.toString = function toString (value, format) {
    return current$1.toString(value, format);
};

function createZip() {
    return new JSZip();
}

// date packing utilities from Kendo Spreadsheet

// Julian days algorithms from http://www.hermetic.ch/cal_stud/jdn.htm#comp
function dateToJulianDays(y, m, d) {
    return ((1461 * (y + 4800 + ((m - 13) / 12 | 0))) / 4 | 0) +
        ((367 * (m - 1 - 12 * ((m - 13) / 12 | 0))) / 12 | 0) -
        ((3 * (((y + 4900 + ((m - 13) / 12 | 0)) / 100 | 0))) / 4 | 0) +
        d - 32075;
}

// This uses the Google Spreadsheet approach: treat 1899-12-31 as day 1, allowing to avoid
// implementing the "Leap Year Bug" yet still be Excel compatible for dates starting 1900-03-01.
var BASE_DATE = dateToJulianDays(1900, 0, -1);

function packDate(year, month, date) {
    return dateToJulianDays(year, month, date) - BASE_DATE;
}

function packTime(hh, mm, ss, ms) {
    return (hh + (mm + (ss + ms / 1000) / 60) / 60) / 24;
}

function dateToSerial(date) {
    var time = packTime(date.getHours(),
                          date.getMinutes(),
                          date.getSeconds(),
                          date.getMilliseconds());
    var serial = packDate(date.getFullYear(),
                            date.getMonth(),
                            date.getDate());
    return serial < 0 ? serial - 1 + time : serial + time;
}

var MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
var DATA_URL_PREFIX = "data:" + MIME_TYPE + ";base64,";
var DATA_URL_OPTIONS = { compression: "DEFLATE", type: "base64" };
var BLOB_OPTIONS = { compression: "DEFLATE", type: "blob" };
var ARRAYBUFFER_OPTIONS = { compression: "DEFLATE", type: "arraybuffer" };

/* eslint-disable key-spacing, no-arrow-condition, indent, no-nested-ternary, consistent-return */

function toDataURI(content) {
    return DATA_URL_PREFIX + content;
}

function indexOf(thing, array) {
    return array.indexOf(thing);
}

var parseJSON = JSON.parse.bind(JSON);

function ESC(val) {
    return String(val)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/\'/g, "&#39;");
}

function repeat(count, func) {
    var str = "";
    for (var i = 0; i < count; ++i) {
        str += func(i);
    }
    return str;
}

function foreach(arr, func) {
    var str = "";
    if (arr != null) {
        if (Array.isArray(arr)) {
            for (var i = 0; i < arr.length; ++i) {
                str += func(arr[i], i);
            }
        } else if (typeof arr == "object") {
            Object.keys(arr).forEach(function (key, i) {
                str += func(arr[key], key, i);
            });
        }
    }
    return str;
}

var XMLHEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r';

var RELS = XMLHEAD + "\n            <Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n               <Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties\" Target=\"docProps/app.xml\"/>\n               <Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties\" Target=\"docProps/core.xml\"/>\n               <Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"xl/workbook.xml\"/>\n            </Relationships>";

var CORE = function (ref) {
  var creator = ref.creator;
  var lastModifiedBy = ref.lastModifiedBy;
  var created = ref.created;
  var modified = ref.modified;

  return (XMLHEAD + "\n <cp:coreProperties xmlns:cp=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\"\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:dcterms=\"http://purl.org/dc/terms/\"\n   xmlns:dcmitype=\"http://purl.org/dc/dcmitype/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n   <dc:creator>" + (ESC(creator)) + "</dc:creator>\n   <cp:lastModifiedBy>" + (ESC(lastModifiedBy)) + "</cp:lastModifiedBy>\n   <dcterms:created xsi:type=\"dcterms:W3CDTF\">" + (ESC(created)) + "</dcterms:created>\n   <dcterms:modified xsi:type=\"dcterms:W3CDTF\">" + (ESC(modified)) + "</dcterms:modified>\n</cp:coreProperties>");
};

var APP = function (ref) {
  var sheets = ref.sheets;

  return (XMLHEAD + "\n<Properties xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties\" xmlns:vt=\"http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes\">\n  <Application>Microsoft Excel</Application>\n  <DocSecurity>0</DocSecurity>\n  <ScaleCrop>false</ScaleCrop>\n  <HeadingPairs>\n    <vt:vector size=\"2\" baseType=\"variant\">\n      <vt:variant>\n        <vt:lpstr>Worksheets</vt:lpstr>\n      </vt:variant>\n      <vt:variant>\n        <vt:i4>" + (sheets.length) + "</vt:i4>\n      </vt:variant>\n    </vt:vector>\n  </HeadingPairs>\n  <TitlesOfParts>\n    <vt:vector size=\"" + (sheets.length) + "\" baseType=\"lpstr\">" + (foreach(sheets, function (sheet, i) { return sheet.options.title
          ? ("<vt:lpstr>" + (ESC(sheet.options.title)) + "</vt:lpstr>")
          : ("<vt:lpstr>Sheet" + (i + 1) + "</vt:lpstr>"); }
      )) + "</vt:vector>\n  </TitlesOfParts>\n  <LinksUpToDate>false</LinksUpToDate>\n  <SharedDoc>false</SharedDoc>\n  <HyperlinksChanged>false</HyperlinksChanged>\n  <AppVersion>14.0300</AppVersion>\n</Properties>");
};

var CONTENT_TYPES = function (ref) {
  var sheetCount = ref.sheetCount;
  var commentFiles = ref.commentFiles;
  var drawingFiles = ref.drawingFiles;

  return (XMLHEAD + "\n<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">\n  <Default Extension=\"png\" ContentType=\"image/png\"/>\n  <Default Extension=\"gif\" ContentType=\"image/gif\"/>\n  <Default Extension=\"jpg\" ContentType=\"image/jpeg\"/>\n  <Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\" />\n  <Default Extension=\"xml\" ContentType=\"application/xml\" />\n  <Default Extension=\"vml\" ContentType=\"application/vnd.openxmlformats-officedocument.vmlDrawing\"/>\n  <Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\" />\n  <Override PartName=\"/xl/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml\"/>\n  <Override PartName=\"/xl/sharedStrings.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml\"/>\n  " + (repeat(sheetCount, function (idx) { return ("<Override PartName=\"/xl/worksheets/sheet" + (idx + 1) + ".xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\" />"); })) + "\n  " + (foreach(commentFiles, function (filename) { return ("<Override PartName=\"/xl/" + filename + "\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml\"/>"); })) + "\n  " + (foreach(drawingFiles, function (filename) { return ("<Override PartName=\"/xl/drawings/" + filename + "\" ContentType=\"application/vnd.openxmlformats-officedocument.drawing+xml\"/>"); })) + "\n  <Override PartName=\"/docProps/core.xml\" ContentType=\"application/vnd.openxmlformats-package.core-properties+xml\" />\n  <Override PartName=\"/docProps/app.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.extended-properties+xml\" />\n</Types>");
};

var WORKBOOK = function (ref) {
  var sheets = ref.sheets;
  var filterNames = ref.filterNames;
  var userNames = ref.userNames;

  return (XMLHEAD + "\n<workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">\n  <fileVersion appName=\"xl\" lastEdited=\"5\" lowestEdited=\"5\" rupBuild=\"9303\" />\n  <workbookPr defaultThemeVersion=\"124226\" />\n  <bookViews>\n    <workbookView xWindow=\"240\" yWindow=\"45\" windowWidth=\"18195\" windowHeight=\"7995\" />\n  </bookViews>\n  <sheets>\n  " + (foreach(sheets, function (ref, i) {
    var options = ref.options;

    var name = options.name || options.title || ("Sheet" + (i + 1));
    return ("<sheet name=\"" + (ESC(name)) + "\" sheetId=\"" + (i + 1) + "\" r:id=\"rId" + (i + 1) + "\" />");
  })) + "\n  </sheets>\n  " + (filterNames.length || userNames.length ? ("\n    <definedNames>\n      " + (foreach(filterNames, function (f) { return ("\n         <definedName name=\"_xlnm._FilterDatabase\" hidden=\"1\" localSheetId=\"" + (f.localSheetId) + "\">" + (ESC(quoteSheet(f.name))) + "!" + (ESC(f.from)) + ":" + (ESC(f.to)) + "</definedName>"); })) + "\n      " + (foreach(userNames, function (f) { return ("\n         <definedName name=\"" + (f.name) + "\" hidden=\"" + (f.hidden ? 1 : 0) + "\" " + (f.localSheetId != null ? ("localSheetId=\"" + (f.localSheetId) + "\"") : '') + ">" + (ESC(f.value)) + "</definedName>"); })) + "\n    </definedNames>") : '') + "\n  <calcPr fullCalcOnLoad=\"1\" calcId=\"145621\" />\n</workbook>");
};

var WORKSHEET = function (ref$1) {
  var frozenColumns = ref$1.frozenColumns;
  var frozenRows = ref$1.frozenRows;
  var columns = ref$1.columns;
  var defaults = ref$1.defaults;
  var data = ref$1.data;
  var index = ref$1.index;
  var mergeCells = ref$1.mergeCells;
  var autoFilter = ref$1.autoFilter;
  var filter = ref$1.filter;
  var showGridLines = ref$1.showGridLines;
  var hyperlinks = ref$1.hyperlinks;
  var validations = ref$1.validations;
  var defaultCellStyleId = ref$1.defaultCellStyleId;
  var rtl = ref$1.rtl;
  var legacyDrawing = ref$1.legacyDrawing;
  var drawing = ref$1.drawing;
  var lastRow = ref$1.lastRow;
  var lastCol = ref$1.lastCol;

  return (XMLHEAD + "\n<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:x14ac=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac\" mc:Ignorable=\"x14ac\">\n   " + (lastRow && lastCol ? ("<dimension ref=\"A1:" + (ref(lastRow - 1, lastCol - 1)) + "\" />") : "") + "\n\n   <sheetViews>\n     <sheetView " + (rtl ? 'rightToLeft="1"' : '') + " " + (index === 0 ? 'tabSelected="1"' : '') + " workbookViewId=\"0\" " + (showGridLines === false ? 'showGridLines="0"' : '') + ">\n     " + (frozenRows || frozenColumns ? ("\n       <pane state=\"frozen\"\n         " + (frozenColumns ? ("xSplit=\"" + frozenColumns + "\"") : '') + "\n         " + (frozenRows ? ("ySplit=\"" + frozenRows + "\"") : '') + "\n         topLeftCell=\"" + (String.fromCharCode(65 + (frozenColumns || 0)) + ((frozenRows || 0) + 1)) + "\"\n       />") : '') + "\n     </sheetView>\n   </sheetViews>\n\n   <sheetFormatPr x14ac:dyDescent=\"0.25\" " + (!defaults.skipCustomHeight ? 'customHeight="1"' : '') + " defaultRowHeight=\"" + (defaults.rowHeight ? defaults.rowHeight * 0.75 : 15) + "\"\n     " + (defaults.columnWidth ? ("defaultColWidth=\"" + (toWidth(defaults.columnWidth)) + "\"") : '') + " />\n\n   " + (defaultCellStyleId != null || (columns && columns.length > 0) ? ("\n     <cols>\n       " + (!columns || !columns.length ? ("\n         <col min=\"1\" max=\"16384\" style=\"" + defaultCellStyleId + "\"\n              " + (defaults.columnWidth ? ("width=\"" + (toWidth(defaults.columnWidth)) + "\"") : '') + " /> ") : '') + "\n       " + (foreach(columns, function (column, ci) {
         var columnIndex = typeof column.index === "number" ? column.index + 1 : (ci + 1);
         if (column.width === 0) {
           return ("<col " + (defaultCellStyleId != null ? ("style=\"" + defaultCellStyleId + "\"") : '') + "\n                        min=\"" + columnIndex + "\" max=\"" + columnIndex + "\" hidden=\"1\" customWidth=\"1\" />");
         }
         return ("<col " + (defaultCellStyleId != null ? ("style=\"" + defaultCellStyleId + "\"") : '') + "\n                      min=\"" + columnIndex + "\" max=\"" + columnIndex + "\" customWidth=\"1\"\n                      " + (column.autoWidth
                          ? ("width=\"" + (((column.width * 7 + 5) / 7 * 256) / 256) + "\" bestFit=\"1\"")
                          : ("width=\"" + (toWidth(column.width)) + "\"")) + " />");
       })) + "\n     </cols>") : '') + "\n\n   <sheetData>\n     " + (foreach(data, function (row, ri) {
       var rowIndex = typeof row.index === "number" ? row.index + 1 : (ri + 1);
       return ("\n         <row r=\"" + rowIndex + "\" x14ac:dyDescent=\"0.25\"\n              " + (row.level ? ("outlineLevel=\"" + (row.level) + "\"") : '') + "\n              " + (row.height === 0 ? 'hidden="1"'
                                 : row.height ? ("ht=\"" + (toHeight(row.height)) + "\" customHeight=\"1\"") : "") + ">\n           " + (foreach(row.data, function (cell) { return ("\n             <c r=\"" + (cell.ref) + "\" " + (cell.style ? ("s=\"" + (cell.style) + "\"") : '') + " " + (cell.type ? ("t=\"" + (cell.type) + "\"") : '') + ">\n               " + (cell.formula != null ? writeFormula(cell.formula) : '') + "\n               " + (cell.value != null ? ("<v>" + (ESC(cell.value)) + "</v>") : '') + "\n             </c>"); })) + "\n         </row>\n       ");})) + "\n   </sheetData>\n\n   " + (autoFilter ? ("<autoFilter ref=\"" + (autoFilter.from) + ":" + (autoFilter.to) + "\"/>")
                : filter ? spreadsheetFilters(filter) : '') + "\n\n   " + (mergeCells.length ? ("\n     <mergeCells count=\"" + (mergeCells.length) + "\">\n       " + (foreach(mergeCells, function (ref) { return ("<mergeCell ref=\"" + ref + "\"/>"); })) + "\n     </mergeCells>") : '') + "\n\n   " + (validations.length ? ("\n     <dataValidations>\n       " + (foreach(validations, function (val) { return ("\n         <dataValidation sqref=\"" + (val.sqref.join(" ")) + "\"\n                         showErrorMessage=\"" + (val.showErrorMessage) + "\"\n                         type=\"" + (ESC(val.type)) + "\"\n                         " + (val.type !== "list" ? ("operator=\"" + (ESC(val.operator)) + "\"") : '') + "\n                         allowBlank=\"" + (val.allowBlank) + "\"\n                         showDropDown=\"" + (val.showDropDown) + "\"\n                         " + (val.error ? ("error=\"" + (ESC(val.error)) + "\"") : '') + "\n                         " + (val.errorTitle ? ("errorTitle=\"" + (ESC(val.errorTitle)) + "\"") : '') + ">\n           " + (val.formula1 ? ("<formula1>" + (ESC(val.formula1)) + "</formula1>") : '') + "\n           " + (val.formula2 ? ("<formula2>" + (ESC(val.formula2)) + "</formula2>") : '') + "\n         </dataValidation>"); })) + "\n     </dataValidations>") : '') + "\n\n   " + (hyperlinks.length ? ("\n     <hyperlinks>\n       " + (foreach(hyperlinks, function (link) { return ("\n         <hyperlink ref=\"" + (link.ref) + "\" r:id=\"" + (link.rId) + "\"/>"); })) + "\n     </hyperlinks>") : '') + "\n\n   <pageMargins left=\"0.7\" right=\"0.7\" top=\"0.75\" bottom=\"0.75\" header=\"0.3\" footer=\"0.3\" />\n   " + (drawing ? ("<drawing r:id=\"" + drawing + "\"/>") : '') + "\n   " + (legacyDrawing ? ("<legacyDrawing r:id=\"" + legacyDrawing + "\"/>") : '') + "\n</worksheet>");
};

var WORKBOOK_RELS = function (ref) {
  var count = ref.count;

  return (XMLHEAD + "\n<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n  " + (repeat(count, function (idx) { return ("\n    <Relationship Id=\"rId" + (idx + 1) + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet" + (idx + 1) + ".xml\" />"); })) + "\n  <Relationship Id=\"rId" + (count + 1) + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\" />\n  <Relationship Id=\"rId" + (count + 2) + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings\" Target=\"sharedStrings.xml\" />\n</Relationships>");
};

var WORKSHEET_RELS = function (ref) {
  var hyperlinks = ref.hyperlinks;
  var comments = ref.comments;
  var sheetIndex = ref.sheetIndex;
  var drawings = ref.drawings;

  return (XMLHEAD + "\n<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n  " + (foreach(hyperlinks, function (link) { return ("\n    <Relationship Id=\"" + (link.rId) + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink\" Target=\"" + (ESC(link.target)) + "\" TargetMode=\"External\" />"); })) + "\n  " + (!comments.length ? '' : ("\n    <Relationship Id=\"comment" + sheetIndex + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments\" Target=\"../comments" + sheetIndex + ".xml\"/>\n    <Relationship Id=\"vml" + sheetIndex + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing\" Target=\"../drawings/vmlDrawing" + sheetIndex + ".vml\"/>")) + "\n  " + (!drawings.length ? '' : ("\n    <Relationship Id=\"drw" + sheetIndex + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing\" Target=\"../drawings/drawing" + sheetIndex + ".xml\"/>")) + "\n</Relationships>");
};

var COMMENTS_XML = function (ref) {
  var comments = ref.comments;

  return (XMLHEAD + "\n<comments xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">\n  <authors>\n    <author></author>\n  </authors>\n  <commentList>\n    " + (foreach(comments, function (comment) { return ("\n      <comment ref=\"" + (comment.ref) + "\" authorId=\"0\">\n        <text>\n          <r>\n            <rPr>\n              <sz val=\"8\"/>\n              <color indexed=\"81\"/>\n              <rFont val=\"Tahoma\"/>\n              <charset val=\"1\"/>\n            </rPr>\n            <t>" + (ESC(comment.text)) + "</t>\n          </r>\n        </text>\n      </comment>"); })) + "\n  </commentList>\n</comments>");
};

var LEGACY_DRAWING = function (ref) {
  var comments = ref.comments;

  return ("<xml xmlns:v=\"urn:schemas-microsoft-com:vml\"\n     xmlns:o=\"urn:schemas-microsoft-com:office:office\"\n     xmlns:x=\"urn:schemas-microsoft-com:office:excel\">\n  <v:shapetype coordsize=\"21600,21600\" id=\"_x0000_t202\" path=\"m,l,21600r21600,l21600,xe\">\n    <v:stroke joinstyle=\"miter\"/>\n    <v:path gradientshapeok=\"t\" o:connecttype=\"rect\"/>\n  </v:shapetype>\n  " + (foreach(comments, function (comment) { return ("\n    <v:shape type=\"#_x0000_t202\" style=\"visibility: hidden\" fillcolor=\"#ffffe1\" o:insetmode=\"auto\">\n      <v:shadow on=\"t\" color=\"black\" obscured=\"t\"/>\n      <x:ClientData ObjectType=\"Note\">\n        <x:MoveWithCells/>\n        <x:SizeWithCells/>\n        <x:Anchor>" + (comment.anchor) + "</x:Anchor>\n        <x:AutoFill>False</x:AutoFill>\n        <x:Row>" + (comment.row) + "</x:Row>\n        <x:Column>" + (comment.col) + "</x:Column>\n      </x:ClientData>\n    </v:shape>"); })) + "\n</xml>");
};

var DRAWINGS_XML = function (drawings) { return (XMLHEAD + "\n<xdr:wsDr xmlns:xdr=\"http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing\"\n          xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\"\n          xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">\n  " + (foreach(drawings, function (drawing, index) { return ("\n    <xdr:oneCellAnchor editAs=\"oneCell\">\n      <xdr:from>\n        <xdr:col>" + (drawing.col) + "</xdr:col>\n        <xdr:colOff>" + (drawing.colOffset) + "</xdr:colOff>\n        <xdr:row>" + (drawing.row) + "</xdr:row>\n        <xdr:rowOff>" + (drawing.rowOffset) + "</xdr:rowOff>\n      </xdr:from>\n      <xdr:ext cx=\"" + (drawing.width) + "\" cy=\"" + (drawing.height) + "\" />\n      <xdr:pic>\n        <xdr:nvPicPr>\n          <xdr:cNvPr id=\"" + (index + 1) + "\" name=\"Picture " + (index + 1) + "\"/>\n          <xdr:cNvPicPr/>\n        </xdr:nvPicPr>\n        <xdr:blipFill>\n          <a:blip r:embed=\"" + (drawing.imageId) + "\"/>\n          <a:stretch>\n            <a:fillRect/>\n          </a:stretch>\n        </xdr:blipFill>\n        <xdr:spPr>\n          <a:prstGeom prst=\"rect\">\n            <a:avLst/>\n          </a:prstGeom>\n        </xdr:spPr>\n      </xdr:pic>\n      <xdr:clientData/>\n    </xdr:oneCellAnchor>"); })) + "\n</xdr:wsDr>"); };

var DRAWINGS_RELS_XML = function (rels) { return (XMLHEAD + "\n<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n  " + (foreach(rels, function (rel) { return ("\n    <Relationship Id=\"" + (rel.rId) + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/image\" Target=\"" + (rel.target) + "\"/>"); })) + "\n</Relationships>"); };

var SHARED_STRINGS = function (ref) {
  var count = ref.count;
  var uniqueCount = ref.uniqueCount;
  var indexes = ref.indexes;

  return (XMLHEAD + "\n<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" count=\"" + count + "\" uniqueCount=\"" + uniqueCount + "\">\n  " + (foreach(Object.keys(indexes), function (index) { return ("\n    <si><t xml:space=\"preserve\">" + (ESC(index.substring(1))) + "</t></si>"); })) + "\n</sst>");
};

var STYLES = function (ref) {
  var formats = ref.formats;
  var fonts = ref.fonts;
  var fills = ref.fills;
  var borders = ref.borders;
  var styles = ref.styles;

  return (XMLHEAD + "\n<styleSheet\n    xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\"\n    xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\"\n    mc:Ignorable=\"x14ac\"\n    xmlns:x14ac=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac\">\n  <numFmts count=\"" + (formats.length) + "\">\n  " + (foreach(formats, function (format, fi) { return ("\n    <numFmt formatCode=\"" + (ESC(format.format)) + "\" numFmtId=\"" + (165 + fi) + "\" />"); })) + "\n  </numFmts>\n  <fonts count=\"" + (fonts.length + 1) + "\" x14ac:knownFonts=\"1\">\n    <font>\n       <sz val=\"11\" />\n       <color theme=\"1\" />\n       <name val=\"Calibri\" />\n       <family val=\"2\" />\n       <scheme val=\"minor\" />\n    </font>\n    " + (foreach(fonts, function (font) { return ("\n    <font>\n      " + (font.bold ? '<b/>' : '') + "\n      " + (font.italic ? '<i/>' : '') + "\n      " + (font.underline ? '<u/>' : '') + "\n      <sz val=\"" + (font.fontSize || 11) + "\" />\n      " + (font.color ? ("<color rgb=\"" + (ESC(font.color)) + "\" />") : '<color theme="1" />') + "\n      " + (font.fontFamily ? ("\n        <name val=\"" + (ESC(font.fontFamily)) + "\" />\n        <family val=\"2\" />\n      ") : "\n        <name val=\"Calibri\" />\n        <family val=\"2\" />\n        <scheme val=\"minor\" />\n      ") + "\n    </font>"); })) + "\n  </fonts>\n  <fills count=\"" + (fills.length + 2) + "\">\n      <fill><patternFill patternType=\"none\"/></fill>\n      <fill><patternFill patternType=\"gray125\"/></fill>\n    " + (foreach(fills, function (fill) { return ("\n      " + (fill.background ? ("\n        <fill>\n          <patternFill patternType=\"solid\">\n              <fgColor rgb=\"" + (ESC(fill.background)) + "\"/>\n          </patternFill>\n        </fill>\n      ") : '')); })) + "\n  </fills>\n  <borders count=\"" + (borders.length + 1) + "\">\n    <border><left/><right/><top/><bottom/><diagonal/></border>\n    " + (foreach(borders, borderTemplate)) + "\n  </borders>\n  <cellStyleXfs count=\"1\">\n    <xf borderId=\"0\" fillId=\"0\" fontId=\"0\" />\n  </cellStyleXfs>\n  <cellXfs count=\"" + (styles.length + 1) + "\">\n    <xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" />\n    " + (foreach(styles, function (style) { return ("\n      <xf xfId=\"0\"\n          " + (style.fontId ? ("fontId=\"" + (style.fontId) + "\" applyFont=\"1\"") : '') + "\n          " + (style.fillId ? ("fillId=\"" + (style.fillId) + "\" applyFill=\"1\"") : '') + "\n          " + (style.numFmtId ? ("numFmtId=\"" + (style.numFmtId) + "\" applyNumberFormat=\"1\"") : '') + "\n          " + (style.textAlign || style.verticalAlign || style.wrap ? 'applyAlignment="1"' : '') + "\n          " + (style.borderId ? ("borderId=\"" + (style.borderId) + "\" applyBorder=\"1\"") : '') + ">\n        " + (style.textAlign || style.verticalAlign || style.wrap ? ("\n        <alignment\n          " + (style.textAlign ? ("horizontal=\"" + (ESC(style.textAlign)) + "\"") : '') + "\n          " + (style.verticalAlign ? ("vertical=\"" + (ESC(style.verticalAlign)) + "\"") : '') + "\n          " + (style.indent ? ("indent=\"" + (ESC(style.indent)) + "\"") : '') + "\n          " + (style.wrap ? 'wrapText="1"' : '') + " />\n        ") : '') + "\n      </xf>\n    "); })) + "\n  </cellXfs>\n  <cellStyles count=\"1\">\n    <cellStyle name=\"Normal\" xfId=\"0\" builtinId=\"0\"/>\n  </cellStyles>\n  <dxfs count=\"0\" />\n  <tableStyles count=\"0\" defaultTableStyle=\"TableStyleMedium2\" defaultPivotStyle=\"PivotStyleMedium9\" />\n</styleSheet>");
};

function writeFormula(formula) {
    if (typeof formula == "string") {
        return ("<f>" + (ESC(formula)) + "</f>");
    }
    // array formulas
    return ("<f t=\"array\" ref=\"" + (formula.ref) + "\">" + (ESC(formula.src)) + "</f>");
}

function numChar(colIndex) {
   var letter = Math.floor(colIndex / 26) - 1;

   return (letter >= 0 ? numChar(letter) : "") + String.fromCharCode(65 + (colIndex % 26));
}

function ref(rowIndex, colIndex) {
    return numChar(colIndex) + (rowIndex + 1);
}

function $ref(rowIndex, colIndex) {
    return "$" + numChar(colIndex) + "$" + (rowIndex + 1);
}

function filterRowIndex(options) {
    var frozenRows = options.frozenRows || (options.freezePane || {}).rowSplit || 1;
    return frozenRows - 1;
}

function toWidth(px) {
    var maximumDigitWidth = 7;
    return (px / maximumDigitWidth) - (Math.floor(128 / maximumDigitWidth) / 256);
}

function toHeight(px) {
    return px * 0.75;
}

function stripFunnyChars(value) {
    return String(value)
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, "") // leave CRLF in
        .replace(/\r?\n/g, "\r\n");                   // make sure LF is preceded by CR
}

var Worksheet = function Worksheet(options, sharedStrings, styles, borders) {
      this.options = options;
      this._strings = sharedStrings;
      this._styles = styles;
      this._borders = borders;
      this._validations = {};
      this._comments = [];
      this._drawings = options.drawings || [];
      this._hyperlinks = (this.options.hyperlinks || []).map(
          function (link, i) { return Object.assign({}, link, { rId: ("link" + i) }); });
  };

  Worksheet.prototype.relsToXML = function relsToXML () {
      var hyperlinks = this._hyperlinks;
      var comments = this._comments;
        var drawings = this._drawings;

      if (hyperlinks.length || comments.length || drawings.length) {
          return WORKSHEET_RELS({
              hyperlinks : hyperlinks,
              comments : comments,
              sheetIndex : this.options.sheetIndex,
              drawings : drawings
          });
      }
  };

  Worksheet.prototype.toXML = function toXML (index) {
        var this$1 = this;

      var mergeCells = this.options.mergedCells || [];
      var rows = this.options.rows || [];
      var data = inflate(rows, mergeCells);

      this._readCells(data);

      var autoFilter = this.options.filter;
      var filter;
      if (autoFilter && (typeof autoFilter.from === "number") && (typeof autoFilter.to === "number")) {
          // Grid enables auto filter
          autoFilter = {
              from: ref(filterRowIndex(this.options), autoFilter.from),
              to: ref(filterRowIndex(this.options), autoFilter.to)
          };
      } else if (autoFilter && autoFilter.ref && autoFilter.columns) {
          // this is probably from the Spreadsheet
          filter = autoFilter;
          autoFilter = null;
      }

      var validations = [];
      for (var i in this._validations) {
          if (Object.prototype.hasOwnProperty.call(this$1._validations, i)) {
              validations.push(this$1._validations[i]);
          }
      }

      var defaultCellStyleId = null;
      if (this.options.defaultCellStyle) {
          defaultCellStyleId = this._lookupStyle(this.options.defaultCellStyle);
      }

      var freezePane = this.options.freezePane || {};
      var defaults = this.options.defaults || {};
      var lastRow = this.options.rows ? this._getLastRow() : 1;
      var lastCol = this.options.rows ? this._getLastCol() : 1;

      return WORKSHEET({
          frozenColumns: this.options.frozenColumns || freezePane.colSplit,
          frozenRows: this.options.frozenRows || freezePane.rowSplit,
          columns: this.options.columns,
          defaults: defaults,
          data: data,
          index: index,
          mergeCells: mergeCells,
          autoFilter: autoFilter,
          filter: filter,
          showGridLines: this.options.showGridLines,
          hyperlinks: this._hyperlinks,
          validations: validations,
          defaultCellStyleId: defaultCellStyleId,
          rtl: this.options.rtl !== undefined ? this.options.rtl : defaults.rtl,
          legacyDrawing: this._comments.length ? ("vml" + (this.options.sheetIndex)) : null,
          drawing: this._drawings.length ? ("drw" + (this.options.sheetIndex)) : null,
          lastRow: lastRow,
          lastCol: lastCol
      });
  };

    Worksheet.prototype.commentsXML = function commentsXML () {
        if (this._comments.length) {
            return COMMENTS_XML({ comments: this._comments });
        }
    };

    Worksheet.prototype.drawingsXML = function drawingsXML (images) {
        if (this._drawings.length) {
            var rels = {};
            var main = this._drawings.map(function (drw) {
                var ref = parseRef(drw.topLeftCell);
                var img = rels[drw.image];
                if (!img) {
                    img = rels[drw.image] = {
                        rId: ("img" + (drw.image)),
                        target: images[drw.image].target
                    };
                }
              return {
                  col     : ref.col,
                  colOffset : pixelsToExcel(drw.offsetX),
                  row     : ref.row,
                  rowOffset : pixelsToExcel(drw.offsetY),
                  width   : pixelsToExcel(drw.width),
                  height  : pixelsToExcel(drw.height),
                  imageId : img.rId
              };
          });
          return {
              main: DRAWINGS_XML(main),
              rels: DRAWINGS_RELS_XML(rels)
          };
      }
  };

  Worksheet.prototype.legacyDrawing = function legacyDrawing () {
      if (this._comments.length) {
          return LEGACY_DRAWING({ comments: this._comments });
      }
  };

  Worksheet.prototype._lookupString = function _lookupString (value) {
      var key = "$" + value;
      var index = this._strings.indexes[key];
        var result;

        if (index !== undefined) {
            result = index;
        } else {
            result = this._strings.indexes[key] = this._strings.uniqueCount;
            this._strings.uniqueCount ++;
        }

        this._strings.count ++;

        return result;
  };

  Worksheet.prototype._lookupStyle = function _lookupStyle (style) {
      var json = JSON.stringify(style);

      if (json === "{}") {
          return 0;
      }

      var index = indexOf(json, this._styles);

      if (index < 0) {
          index = this._styles.push(json) - 1;
      }

      // There is one default style
      return index + 1;
    };

    Worksheet.prototype._lookupBorder = function _lookupBorder (border) {
      var json = JSON.stringify(border);
      if (json === "{}") {
            return;
        }

        var index = indexOf(json, this._borders);
      if (index < 0) {
          index = this._borders.push(json) - 1;
      }

        // There is one default border
        return index + 1;
  };

  Worksheet.prototype._readCells = function _readCells (rowData) {
        var this$1 = this;

      for (var i = 0; i < rowData.length; i++) {
          var row = rowData[i];
            var cells = row.cells;

          row.data = [];

          for (var j = 0; j < cells.length; j++) {
              var cellData = this$1._cell(cells[j], row.index, j);
                if (cellData) {
                    row.data.push(cellData);
                }
            }
        }
    };

    Worksheet.prototype._cell = function _cell (data, rowIndex, cellIndex) {
        if (!data || data === EMPTY_CELL) {
            return null;
        }

        var value = data.value;

        var border = {};

        if (data.borderLeft) {
            border.left = data.borderLeft;
        }

        if (data.borderRight) {
          border.right = data.borderRight;
      }

      if (data.borderTop) {
          border.top = data.borderTop;
      }

      if (data.borderBottom) {
          border.bottom = data.borderBottom;
      }

      border = this._lookupBorder(border);

      var defStyle = this.options.defaultCellStyle || {};
      var style = { borderId: border };

      (function(add) {
          add("color");
          add("background");
          add("bold");
            add("italic");
            add("underline");
            if (!add("fontFamily")) { add("fontName", "fontFamily"); }
          add("fontSize");
          add("format");
          if (!add("textAlign")) { add("hAlign", "textAlign"); }
          if (!add("verticalAlign")) { add("vAlign", "verticalAlign"); }
          add("wrap");
          add("indent");
      })(
          function(prop, target) {
              var val = data[prop];
              if (val === undefined) {
                  val = defStyle[prop];
                }
              if (val !== undefined) {
                  style[target || prop] = val;
                    return true;
                }
            }
        );

        var columns = this.options.columns || [];

        var column = columns[cellIndex];
        var type = typeof value;

      if (column && column.autoWidth && (!data.colSpan || data.colSpan === 1)) {
          var displayValue = value;

          // XXX: let's not bring kendo.toString in only for this.
          //    better wait until the spreadsheet engine is available as a separate
          //    component, then we can use a real Excel-like formatter.
            //
            if (type === "number") {
                // kendo.toString will not behave exactly like the Excel format
                // Still, it's the best we have available for estimating the character count.
                displayValue = IntlService.toString(value, data.format);
            }

            column.width = Math.max(column.width || 0, String(displayValue).length);
        }

        if (type === "string") {
            value = stripFunnyChars(value);
            value = this._lookupString(value);
            type = "s";
        } else if (type === "number") {
            type = "n";
        } else if (type === "boolean") {
            type = "b";
            value = Number(value);
        } else if (value && value.getTime) {
            type = null;
            value = dateToSerial(value);
            if (!style.format) {
                style.format = "mm-dd-yy";
          }
      } else {
          type = null;
          value = null;
      }

      style = this._lookupStyle(style);

      var cellName = ref(rowIndex, cellIndex);

      if (data.validation) {
          this._addValidation(data.validation, cellName);
      }

      if (data.comment) {
          var anchor = [
              cellIndex + 1,// start column
              15,           // start column offset
              rowIndex,     // start row
              10,           // start row offset
              cellIndex + 3,// end column
              15,           // end column offset
              rowIndex + 3, // end row
              4             // end row offset
          ];
          this._comments.push({
              ref  : cellName,
              text : data.comment,
              row  : rowIndex,
              col  : cellIndex,
              anchor : anchor.join(", ")
            });
      }

      return {
          value: value,
            formula: data.formula,
            type: type,
            style: style,
            ref: cellName
      };
  };

  Worksheet.prototype._addValidation = function _addValidation (v, ref) {
      var tmp = {
          showErrorMessage : v.type === "reject" ? 1 : 0,
          formula1       : v.from,
          formula2         : v.to,
          type           : MAP_EXCEL_TYPE[v.dataType] || v.dataType,
            operator         : MAP_EXCEL_OPERATOR[v.comparerType] || v.comparerType,
          allowBlank     : v.allowNulls ? 1 : 0,
          showDropDown   : v.showButton ? 0 : 1, // LOL, Excel!
          error          : v.messageTemplate,
            errorTitle     : v.titleTemplate
      };
      var json = JSON.stringify(tmp);
        if (!this._validations[json]) {
            this._validations[json] = tmp;
          tmp.sqref = [];
      }
      this._validations[json].sqref.push(ref);
    };

    Worksheet.prototype._getLastRow = function _getLastRow () {
        return countData(this.options.rows);
    };

    Worksheet.prototype._getLastCol = function _getLastCol () {
        var last = 0;
        this.options.rows.forEach(function(row) {
            if (row.cells) {
                last = Math.max(last, countData(row.cells));
          }
      });
      return last;
  };

function countData(data) {
    var last = data.length;
    data.forEach(function(el) {
        if (el.index && el.index >= last) {
            last = el.index + 1;
        }
    });
    return last;
}

var MAP_EXCEL_OPERATOR = {
    // includes only what differs; key is our operator, value is Excel
    // operator.
    greaterThanOrEqualTo : "greaterThanOrEqual",
    lessThanOrEqualTo    : "lessThanOrEqual"
};

var MAP_EXCEL_TYPE = {
    number: "decimal"
};

var defaultFormats = {
    "General": 0,
    "0": 1,
    "0.00": 2,
    "#,##0": 3,
    "#,##0.00": 4,
    "0%": 9,
    "0.00%": 10,
    "0.00E+00": 11,
    "# ?/?": 12,
    "# ??/??": 13,
    "mm-dd-yy": 14,
    "d-mmm-yy": 15,
    "d-mmm": 16,
    "mmm-yy": 17,
    "h:mm AM/PM": 18,
    "h:mm:ss AM/PM": 19,
    "h:mm": 20,
    "h:mm:ss": 21,
    "m/d/yy h:mm": 22,
    "#,##0 ;(#,##0)": 37,
    "#,##0 ;[Red](#,##0)": 38,
    "#,##0.00;(#,##0.00)": 39,
    "#,##0.00;[Red](#,##0.00)": 40,
    "mm:ss": 45,
    "[h]:mm:ss": 46,
    "mmss.0": 47,
    "##0.0E+0": 48,
    "@": 49,
    "[$-404]e/m/d": 27,
    "m/d/yy": 30,
    "t0": 59,
    "t0.00": 60,
    "t#,##0": 61,
    "t#,##0.00": 62,
    "t0%": 67,
    "t0.00%": 68,
    "t# ?/?": 69,
    "t# ??/??": 70
};

function convertColor(value) {
    var color = value;
    if (color.length < 6) {
        color = color.replace(/(\w)/g, function($0, $1) {
            return $1 + $1;
        });
    }

    color = color.substring(1).toUpperCase();

    if (color.length < 8) {
        color = "FF" + color;
    }

    return color;
}

var Workbook = function Workbook(options) {
      var this$1 = this;

      this.options = options || {};
      this._strings = {
          indexes: {},
          count: 0,
          uniqueCount: 0
      };
      this._styles = [];
      this._borders = [];
      this._images = this.options.images;
      this._imgId = 0;

      this._sheets = map(this.options.sheets || [], function (options, i) {
          options.defaults = this$1.options;
          options.sheetIndex = i + 1;
          return new Worksheet(options, this$1._strings, this$1._styles, this$1._borders);
      });
    };

  Workbook.prototype.imageFilename = function imageFilename (mimeType) {
      var id = ++this._imgId;
      switch (mimeType) {
        case "image/jpg":
        case "image/jpeg":
          return ("image" + id + ".jpg");
        case "image/png":
          return ("image" + id + ".png");
        case "image/gif":
          return ("image" + id + ".gif");
        default:
          return ("image" + id + ".bin"); // XXX: anything better to do here?
      }
  };

  Workbook.prototype.toZIP = function toZIP () {
        var this$1 = this;

      var zip = createZip();

      var docProps = zip.folder("docProps");

      docProps.file("core.xml", CORE({
          creator: this.options.creator || "Kendo UI",
          lastModifiedBy: this.options.creator || "Kendo UI",
          created: this.options.date || new Date().toJSON(),
          modified: this.options.date || new Date().toJSON()
      }));

      var sheetCount = this._sheets.length;

      docProps.file("app.xml", APP({ sheets: this._sheets }));

      var rels = zip.folder("_rels");
      rels.file(".rels", RELS);

      var xl = zip.folder("xl");

      var xlRels = xl.folder("_rels");
      xlRels.file("workbook.xml.rels", WORKBOOK_RELS({ count: sheetCount }));

      if (this._images) {
          var media = xl.folder("media");
          Object.keys(this._images).forEach(function (id) {
              var img = this$1._images[id];
              var filename = this$1.imageFilename(img.type);
              media.file(filename, img.data);
              img.target = "../media/" + filename;
          });
      }

      var sheetIds = {};
      xl.file("workbook.xml", WORKBOOK({
          sheets: this._sheets,
          filterNames: map(this._sheets, function(sheet, index) {
              var options = sheet.options;
              var sheetName = (options.name || options.title || "Sheet" + (index + 1));
              sheetIds[sheetName.toLowerCase()] = index;
              var filter = options.filter;
              if (filter) {
                  if (filter.ref) {
                      // spreadsheet provides `ref`
                      var a = filter.ref.split(":");
                      var from = parseRef(a[0]);
                      var to = parseRef(a[1]);
                      return {
                          localSheetId: index,
                          name: sheetName,
                          from: $ref(from.row, from.col),
                          to: $ref(to.row, to.col)
                      };
                  } else if (typeof filter.from !== "undefined" && typeof filter.to !== "undefined") {
                      // grid does this
                      return {
                          localSheetId: index,
                            name: sheetName,
                            from: $ref(filterRowIndex(options), filter.from),
                            to: $ref(filterRowIndex(options), filter.to)
                        };
                    }
                }
            }),
            userNames: map(this.options.names || [], function(def) {
                return {
                    name: def.localName,
                    localSheetId: def.sheet ? sheetIds[def.sheet.toLowerCase()] : null,
                    value: def.value,
                    hidden: def.hidden
                };
          })
      }));

      var worksheets = xl.folder("worksheets");
      var drawings = xl.folder("drawings");
      var drawingsRels = drawings.folder("_rels");
      var sheetRels = worksheets.folder("_rels");
      var commentFiles = [];
      var drawingFiles = [];

      for (var idx = 0; idx < sheetCount; idx++) {
          var sheet = this$1._sheets[idx];
          var sheetName = "sheet" + (idx + 1) + ".xml";
          var sheetXML = sheet.toXML(idx); // must be called before relsToXML
          var relsXML = sheet.relsToXML();
          var commentsXML = sheet.commentsXML();
          var legacyDrawing = sheet.legacyDrawing();
          var drawingsXML = sheet.drawingsXML(this$1._images);

            if (relsXML) {
                sheetRels.file(sheetName + ".rels", relsXML);
            }
            if (commentsXML) {
                var name = "comments" + (sheet.options.sheetIndex) + ".xml";
                xl.file(name, commentsXML);
                commentFiles.push(name);
            }
            if (legacyDrawing) {
              drawings.file(("vmlDrawing" + (sheet.options.sheetIndex) + ".vml"), legacyDrawing);
          }
          if (drawingsXML) {
              var name$1 = "drawing" + (sheet.options.sheetIndex) + ".xml";
              drawings.file(name$1, drawingsXML.main);
              drawingsRels.file((name$1 + ".rels"), drawingsXML.rels);
                drawingFiles.push(name$1);
          }

          worksheets.file(sheetName, sheetXML);
      }

        var borders = map(this._borders, parseJSON);

        var styles = map(this._styles, parseJSON);

      var hasFont = function(style) {
            return style.underline || style.bold || style.italic || style.color || style.fontFamily || style.fontSize;
      };

      var convertFontSize = function(value) {
            var fontInPx = Number(value);
          var fontInPt;

          if (fontInPx) {
              fontInPt = fontInPx * 3 / 4;
          }

            return fontInPt;
        };

        var fonts = map(styles, function(style) {
            if (style.fontSize) {
                style.fontSize = convertFontSize(style.fontSize);
            }

            if (style.color) {
                style.color = convertColor(style.color);
            }

            if (hasFont(style)) {
                return style;
            }
        });

        var formats = map(styles, function(style) {
          if (style.format && defaultFormats[style.format] === undefined) {
              return style;
          }
      });

      var fills = map(styles, function(style) {
          if (style.background) {
              style.background = convertColor(style.background);
              return style;
          }
      });

      xl.file("styles.xml", STYLES({
          fonts: fonts,
          fills: fills,
          formats: formats,
          borders: borders,
            styles: map(styles, function(style) {
                var result = {};

              if (hasFont(style)) {
                  result.fontId = indexOf(style, fonts) + 1;
              }

              if (style.background) {
                  result.fillId = indexOf(style, fills) + 2;
              }

              result.textAlign = style.textAlign;
              result.indent = style.indent;
              result.verticalAlign = style.verticalAlign;
              result.wrap = style.wrap;
              result.borderId = style.borderId;

              if (style.format) {
                  if (defaultFormats[style.format] !== undefined) {
                        result.numFmtId = defaultFormats[style.format];
                    } else {
                        result.numFmtId = 165 + indexOf(style, formats);
                  }
              }

              return result;
          })
      }));

      xl.file("sharedStrings.xml", SHARED_STRINGS(this._strings));

      zip.file("[Content_Types].xml", CONTENT_TYPES({
          sheetCount: sheetCount,
          commentFiles: commentFiles,
          drawingFiles: drawingFiles
      }));

        return zip;
    };

    Workbook.prototype.toDataURL = function toDataURL () {
        var zip = this.toZIP();

        return zip.generateAsync ? zip.generateAsync(DATA_URL_OPTIONS).then(toDataURI) : toDataURI(zip.generate(DATA_URL_OPTIONS));
    };

    Workbook.prototype.toBlob = function toBlob () {
        var zip = this.toZIP();
        if (zip.generateAsync) {
            return zip.generateAsync(BLOB_OPTIONS);
        }
        return new Blob([ zip.generate(ARRAYBUFFER_OPTIONS) ], { type: MIME_TYPE });
    };

function borderStyle(width) {
    var alias = "thin";

    if (width === 2) {
        alias = "medium";
    } else if (width === 3) {
        alias = "thick";
    }

    return alias;
}

function borderSideTemplate(name, style) {
    var result = "";

    if (style) {
        result += "<" + name + " style=\"" + borderStyle(style.size) + "\">";
        if (style.color) {
            result += "<color rgb=\"" + convertColor(style.color) + "\"/>";
        }
        result += "</" + name + ">";
    }

    return result;
}

function borderTemplate(border) {
    return "<border>" +
       borderSideTemplate("left", border.left) +
       borderSideTemplate("right", border.right) +
       borderSideTemplate("top", border.top) +
       borderSideTemplate("bottom", border.bottom) +
   "</border>";
}

var EMPTY_CELL = {};
function inflate(rows, mergedCells) {
    var rowData = [];
    var rowsByIndex = [];

    indexRows(rows, function(row, index) {
        var data = {
            _source: row,
            index: index,
            height: row.height,
            level: row.level,
            cells: []
        };

        rowData.push(data);
        rowsByIndex[index] = data;
    });

    var sorted = sortByIndex(rowData).slice(0);
    var ctx = {
        rowData: rowData,
        rowsByIndex: rowsByIndex,
        mergedCells: mergedCells
    };

    for (var i = 0; i < sorted.length; i++) {
        fillCells(sorted[i], ctx);
        delete sorted[i]._source;
    }

    return sortByIndex(rowData);
}

function indexRows(rows, callback) {
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!row) {
            continue;
        }

        var index = row.index;
        if (typeof index !== "number") {
            index = i;
        }

        callback(row, index);
    }
}

function sortByIndex(items) {
    return items.sort(function(a, b) {
        return a.index - b.index;
    });
}

function pushUnique(array, el) {
    if (array.indexOf(el) < 0) {
        array.push(el);
    }
}

function getSpan(mergedCells, ref) {
    for (var i = 0; i < mergedCells.length; ++i) {
        var range = mergedCells[i];
        var a = range.split(":");
        var topLeft = a[0];
        if (topLeft === ref) {
            var bottomRight = a[1];
            topLeft = parseRef(topLeft);
            bottomRight = parseRef(bottomRight);
            return {
                rowSpan: bottomRight.row - topLeft.row + 1,
                colSpan: bottomRight.col - topLeft.col + 1
            };
        }
    }
}

function parseRef(ref) {
    function getcol(str) {
        var upperStr = str.toUpperCase();
        var col = 0;
        for (var i = 0; i < upperStr.length; ++i) {
            col = col * 26 + upperStr.charCodeAt(i) - 64;
        }
        return col - 1;
    }

    function getrow(str) {
        return parseInt(str, 10) - 1;
    }

    var m = /^([a-z]+)(\d+)$/i.exec(ref);
    return {
        row: getrow(m[2]),
        col: getcol(m[1])
    };
}

function pixelsToExcel(px) {
    return Math.round(px * 9525);
}

function fillCells(data, ctx) {
    var row = data._source;
    var rowIndex = data.index;
    var cells = row.cells;
    var cellData = data.cells;

    if (!cells) {
        return;
    }

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i] || EMPTY_CELL;

        var rowSpan = cell.rowSpan || 1;
        var colSpan = cell.colSpan || 1;

        var cellIndex = insertCell(cellData, cell);
        var topLeftRef = ref(rowIndex, cellIndex);

        if (rowSpan === 1 && colSpan === 1) {
            // could still be merged: the spreadsheet does not send
            // rowSpan/colSpan, but mergedCells is already populated.
            // https://github.com/telerik/kendo-ui-core/issues/2401
            var tmp = getSpan(ctx.mergedCells, topLeftRef);
            if (tmp) {
                colSpan = tmp.colSpan;
                rowSpan = tmp.rowSpan;
            }
        }

        spanCell(cell, cellData, cellIndex, colSpan);

        if (rowSpan > 1 || colSpan > 1) {
            pushUnique(ctx.mergedCells,
                       topLeftRef + ":" + ref(rowIndex + rowSpan - 1,
                                              cellIndex + colSpan - 1));
        }

        if (rowSpan > 1) {
            for (var ri = rowIndex + 1; ri < rowIndex + rowSpan; ri++) {
                var nextRow = ctx.rowsByIndex[ri];
                if (!nextRow) {
                    nextRow = ctx.rowsByIndex[ri] = { index: ri, cells: [] };
                    ctx.rowData.push(nextRow);
                }

                spanCell(cell, nextRow.cells, cellIndex - 1, colSpan + 1);
            }
        }
    }
}

function insertCell(data, cell) {
    var index;

    if (typeof cell.index === "number") {
        index = cell.index;
        insertCellAt(data, cell, cell.index);
    } else {
        index = appendCell(data, cell);
    }

    return index;
}

function insertCellAt(data, cell, index) {
    data[index] = cell;
}

function appendCell(data, cell) {
    var index = data.length;

    for (var i = 0; i < data.length + 1; i++) {
        if (!data[i]) {
            data[i] = cell;
            index = i;
            break;
        }
    }

    return index;
}

function spanCell(cell, row, startIndex, colSpan) {
    for (var i = 1; i < colSpan; i++) {
        var tmp = {
            borderTop    : cell.borderTop,
            borderRight  : cell.borderRight,
            borderBottom : cell.borderBottom,
            borderLeft   : cell.borderLeft
        };
        insertCellAt(row, tmp, startIndex + i);
    }
}

var SPREADSHEET_FILTERS = function (ref$1) {
  var ref = ref$1.ref;
  var columns = ref$1.columns;
  var generators = ref$1.generators;

  return ("\n<autoFilter ref=\"" + ref + "\">\n  " + (foreach(columns, function (col) { return ("\n    <filterColumn colId=\"" + (col.index) + "\">\n      " + (generators[col.filter](col)) + "\n    </filterColumn>\n  "); })) + "\n</autoFilter>");
};

var SPREADSHEET_CUSTOM_FILTER = function (ref) {
  var logic = ref.logic;
  var criteria = ref.criteria;

  return ("\n<customFilters " + (logic === 'and' ? 'and="1"' : '') + ">\n" + (foreach(criteria, function (f) {
    var op = spreadsheetFilters.customOperator(f);
    var val = spreadsheetFilters.customValue(f);
    return ("<customFilter " + (op ? ("operator=\"" + op + "\"") : '') + " val=\"" + val + "\"/>");
})) + "\n</customFilters>");
};

var SPREADSHEET_DYNAMIC_FILTER = function (ref) {
  var type = ref.type;

  return ("<dynamicFilter type=\"" + (spreadsheetFilters.dynamicFilterType(type)) + "\" />");
};

var SPREADSHEET_TOP_FILTER = function (ref) {
  var type = ref.type;
  var value = ref.value;

  return ("<top10 percent=\"" + (/percent$/i.test(type) ? 1 : 0) + "\"\n       top=\"" + (/^top/i.test(type) ? 1 : 0) + "\"\n       val=\"" + value + "\" />");
};

var SPREADSHEET_VALUE_FILTER = function (ref) {
    var blanks = ref.blanks;
    var values = ref.values;

    return ("<filters " + (blanks ? 'blank="1"' : '') + ">\n    " + (foreach(values, function (value) { return ("\n      <filter val=\"" + value + "\" />"); })) + "\n  </filters>");
};

function spreadsheetFilters(filter) {
    return SPREADSHEET_FILTERS({
        ref: filter.ref,
        columns: filter.columns,
        generators: {
            custom  : SPREADSHEET_CUSTOM_FILTER,
            dynamic : SPREADSHEET_DYNAMIC_FILTER,
            top     : SPREADSHEET_TOP_FILTER,
            value   : SPREADSHEET_VALUE_FILTER
        }
    });
}

spreadsheetFilters.customOperator = function(f) {
    return {
        eq  : "equal",
        gt  : "greaterThan",
        gte : "greaterThanOrEqual",
        lt  : "lessThan",
        lte : "lessThanOrEqual",
        ne  : "notEqual",

        // These are not in the spec, but seems to be how Excel does
        // it (see customValue below).  For the non-negated versions,
        // the operator attribute is missing completely.
        doesnotstartwith: "notEqual",
        doesnotendwith: "notEqual",
        doesnotcontain: "notEqual",
        doesnotmatch: "notEqual"
    }[f.operator.toLowerCase()];
};

function quoteSheet(name) {
    if (/^\'/.test(name)) { // assume already quoted, the Spreadsheet does it.
        return name;
    }
    if (/^[a-z_][a-z0-9_]*$/i.test(name)) {
        return name;        // no need to quote it
    }
    return "'" + name.replace(/\x27/g, "\\'") + "'";
}

spreadsheetFilters.customValue = function(f) {
    function esc(str) {
        return str.replace(/([*?])/g, "~$1");
    }

    switch (f.operator.toLowerCase()) {
        case "startswith":
        case "doesnotstartwith":
            return esc(f.value) + "*";

        case "endswith":
        case "doesnotendwith":
            return "*" + esc(f.value);

        case "contains":
        case "doesnotcontain":
            return "*" + esc(f.value) + "*";

        default:
            return f.value;
    }
};

spreadsheetFilters.dynamicFilterType = function(type) {
    return {
        quarter1  : "Q1",
        quarter2  : "Q2",
        quarter3  : "Q3",
        quarter4  : "Q4",
        january   : "M1",
        february  : "M2",
        march     : "M3",
        april     : "M4",
        may       : "M5",
        june      : "M6",
        july      : "M7",
        august    : "M8",
        september : "M9",
        october   : "M10",
        november  : "M11",
        december  : "M12"
    }[type.toLowerCase()] || type;
};

exports.ExcelExporter = ExcelExporter;
exports.IntlService = IntlService;
exports.TemplateService = TemplateService;
exports.Workbook = Workbook;
exports.Worksheet = Worksheet;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9yb290L3NyYy9naXRodWIuY29tL3RlbGVyaWsva2VuZG8tb294bWwvc3JjL3NlcnZpY2VzL3RlbXBsYXRlLXNlcnZpY2UuanMiLCIvcm9vdC9zcmMvZ2l0aHViLmNvbS90ZWxlcmlrL2tlbmRvLW9veG1sL3NyYy91dGlscy9nZXR0ZXIuanMiLCIvcm9vdC9zcmMvZ2l0aHViLmNvbS90ZWxlcmlrL2tlbmRvLW9veG1sL3NyYy91dGlscy9tYXAuanMiLCIvcm9vdC9zcmMvZ2l0aHViLmNvbS90ZWxlcmlrL2tlbmRvLW9veG1sL3NyYy9leGNlbC1leHBvcnRlci5qcyIsIi9yb290L3NyYy9naXRodWIuY29tL3RlbGVyaWsva2VuZG8tb294bWwvc3JjL3NlcnZpY2VzL2ludGwtc2VydmljZS5qcyIsIi9yb290L3NyYy9naXRodWIuY29tL3RlbGVyaWsva2VuZG8tb294bWwvc3JjL3V0aWxzL2NyZWF0ZS16aXAuanMiLCIvcm9vdC9zcmMvZ2l0aHViLmNvbS90ZWxlcmlrL2tlbmRvLW9veG1sL3NyYy91dGlscy90aW1lLmpzIiwiL3Jvb3Qvc3JjL2dpdGh1Yi5jb20vdGVsZXJpay9rZW5kby1vb3htbC9zcmMvb294bWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGN1cnJlbnQgPSB7XG4gICAgY29tcGlsZTogZnVuY3Rpb24odGVtcGxhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cbn07XG5cbmNsYXNzIFRlbXBsYXRlU2VydmljZSB7XG4gICAgc3RhdGljIHJlZ2lzdGVyKHVzZXJJbXBsZW1lbnRhdGlvbikge1xuICAgICAgICBjdXJyZW50ID0gdXNlckltcGxlbWVudGF0aW9uO1xuICAgIH1cblxuICAgIHN0YXRpYyBjb21waWxlKHRlbXBsYXRlKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50LmNvbXBpbGUodGVtcGxhdGUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGVtcGxhdGVTZXJ2aWNlOyIsImNvbnN0IEZJRUxEX1JFR0VYID0gL1xcWyg/OihcXGQrKXxbJ1wiXSguKj8pWydcIl0pXFxdfCgoPzooPyFcXFsuKj9cXF18XFwuKS4pKykvZztcbmNvbnN0IGdldHRlckNhY2hlID0ge307XG5jb25zdCBVTkRFRklORUQgPSAndW5kZWZpbmVkJztcblxuZ2V0dGVyQ2FjaGVbVU5ERUZJTkVEXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXR0ZXIoZmllbGQpIHtcbiAgICBpZiAoZ2V0dGVyQ2FjaGVbZmllbGRdKSB7XG4gICAgICAgIHJldHVybiBnZXR0ZXJDYWNoZVtmaWVsZF07XG4gICAgfVxuXG4gICAgY29uc3QgZmllbGRzID0gW107XG4gICAgZmllbGQucmVwbGFjZShGSUVMRF9SRUdFWCwgZnVuY3Rpb24obWF0Y2gsIGluZGV4LCBpbmRleEFjY2Vzc29yLCBmaWVsZCkge1xuICAgICAgICBmaWVsZHMucHVzaCh0eXBlb2YgaW5kZXggIT09IFVOREVGSU5FRCA/IGluZGV4IDogKGluZGV4QWNjZXNzb3IgfHwgZmllbGQpKTtcbiAgICB9KTtcblxuICAgIGdldHRlckNhY2hlW2ZpZWxkXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBsZXQgcmVzdWx0ID0gb2JqO1xuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBmaWVsZHMubGVuZ3RoICYmIHJlc3VsdDsgaWR4KyspIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFtmaWVsZHNbaWR4XV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICByZXR1cm4gZ2V0dGVyQ2FjaGVbZmllbGRdO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hcChhcnJheSwgZnVuYykge1xuICAgIHJldHVybiBhcnJheS5yZWR1Y2UoKHJlc3VsdCwgZWwsIGkpID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gZnVuYyhlbCwgaSk7XG4gICAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIFtdKTtcbn0iLCJpbXBvcnQgVGVtcGxhdGVTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvdGVtcGxhdGUtc2VydmljZSc7XG5pbXBvcnQgZ2V0dGVyIGZyb20gJy4vdXRpbHMvZ2V0dGVyJztcbmltcG9ydCBtYXAgZnJvbSAnLi91dGlscy9tYXAnO1xuXG5mdW5jdGlvbiBkZWZhdWx0R3JvdXBIZWFkZXJUZW1wbGF0ZShkYXRhKSB7XG4gICAgcmV0dXJuIGAkeyBkYXRhLnRpdGxlIH06ICR7IGRhdGEudmFsdWUgfWA7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFycmF5KGxlbmd0aCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgcmVzdWx0LnB1c2goY2FsbGJhY2soaWR4KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdEl0ZW1JZChpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uaWQ7XG59XG5cbmNsYXNzIEV4Y2VsRXhwb3J0ZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5jb2x1bW5zID0gdGhpcy5fdHJpbUNvbHVtbnMob3B0aW9ucy5jb2x1bW5zIHx8IFtdKTtcblxuICAgICAgICB0aGlzLmFsbENvbHVtbnMgPSBtYXAodGhpcy5fbGVhZkNvbHVtbnMob3B0aW9ucy5jb2x1bW5zIHx8IFtdKSwgdGhpcy5fcHJlcGFyZUNvbHVtbik7XG5cbiAgICAgICAgdGhpcy5jb2x1bW5zID0gdGhpcy5fdmlzaWJsZUNvbHVtbnModGhpcy5hbGxDb2x1bW5zKTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmRhdGEgPSBvcHRpb25zLmRhdGEgfHwgW107XG4gICAgICAgIHRoaXMuYWdncmVnYXRlcyA9IG9wdGlvbnMuYWdncmVnYXRlcyB8fCB7fTtcbiAgICAgICAgdGhpcy5ncm91cHMgPSBbXS5jb25jYXQob3B0aW9ucy5ncm91cHMgfHwgW10pO1xuICAgICAgICB0aGlzLmhhc0dyb3VwcyA9IHRoaXMuZ3JvdXBzLmxlbmd0aCA+IDA7XG4gICAgICAgIHRoaXMuaGllcmFyY2h5ID0gb3B0aW9ucy5oaWVyYXJjaHk7XG4gICAgICAgIHRoaXMuaGFzR3JvdXBIZWFkZXJDb2x1bW4gPSB0aGlzLmNvbHVtbnMuc29tZShjb2x1bW4gPT4gY29sdW1uLmdyb3VwSGVhZGVyQ29sdW1uVGVtcGxhdGUpO1xuICAgICAgICB0aGlzLmNvbGxhcHNpYmxlID0gdGhpcy5vcHRpb25zLmNvbGxhcHNpYmxlO1xuICAgIH1cblxuICAgIHdvcmtib29rKCkge1xuICAgICAgICBjb25zdCB3b3JrYm9vayA9IHtcbiAgICAgICAgICAgIHNoZWV0czogWyB7XG4gICAgICAgICAgICAgICAgY29sdW1uczogdGhpcy5fY29sdW1ucygpLFxuICAgICAgICAgICAgICAgIHJvd3M6IHRoaXMuaGllcmFyY2h5ID8gdGhpcy5faGllcmFyY2h5Um93cygpIDogdGhpcy5fcm93cygpLFxuICAgICAgICAgICAgICAgIGZyZWV6ZVBhbmU6IHRoaXMuX2ZyZWV6ZVBhbmUoKSxcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IHRoaXMuX2ZpbHRlcigpXG4gICAgICAgICAgICB9IF1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gd29ya2Jvb2s7XG4gICAgfVxuXG4gICAgX3RyaW1Db2x1bW5zKGNvbHVtbnMpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbnMuZmlsdGVyKChjb2x1bW4pID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBCb29sZWFuKGNvbHVtbi5maWVsZCk7XG5cbiAgICAgICAgICAgIGlmICghcmVzdWx0ICYmIGNvbHVtbi5jb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fdHJpbUNvbHVtbnMoY29sdW1uLmNvbHVtbnMpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9sZWFmQ29sdW1ucyhjb2x1bW5zKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBjb2x1bW5zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIGlmICghY29sdW1uc1tpZHhdLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjb2x1bW5zW2lkeF0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KHRoaXMuX2xlYWZDb2x1bW5zKGNvbHVtbnNbaWR4XS5jb2x1bW5zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIF9wcmVwYXJlQ29sdW1uKGNvbHVtbikge1xuICAgICAgICBpZiAoIWNvbHVtbi5maWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSBmdW5jdGlvbihkYXRhSXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldHRlcihjb2x1bW4uZmllbGQsIHRydWUpKGRhdGFJdGVtKTtcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgdmFsdWVzID0gbnVsbDtcblxuICAgICAgICBpZiAoY29sdW1uLnZhbHVlcykge1xuICAgICAgICAgICAgdmFsdWVzID0ge307XG5cbiAgICAgICAgICAgIGNvbHVtbi52YWx1ZXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzW2l0ZW0udmFsdWVdID0gaXRlbS50ZXh0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhbHVlID0gZnVuY3Rpb24oZGF0YUl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW2dldHRlcihjb2x1bW4uZmllbGQsIHRydWUpKGRhdGFJdGVtKV07XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGNvbHVtbiwge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgdmFsdWVzOiB2YWx1ZXMsXG4gICAgICAgICAgICBncm91cEhlYWRlclRlbXBsYXRlOiBjb2x1bW4uZ3JvdXBIZWFkZXJUZW1wbGF0ZSA/IFRlbXBsYXRlU2VydmljZS5jb21waWxlKGNvbHVtbi5ncm91cEhlYWRlclRlbXBsYXRlKSA6IGRlZmF1bHRHcm91cEhlYWRlclRlbXBsYXRlLFxuICAgICAgICAgICAgZ3JvdXBIZWFkZXJDb2x1bW5UZW1wbGF0ZTogY29sdW1uLmdyb3VwSGVhZGVyQ29sdW1uVGVtcGxhdGUgPyBUZW1wbGF0ZVNlcnZpY2UuY29tcGlsZShjb2x1bW4uZ3JvdXBIZWFkZXJDb2x1bW5UZW1wbGF0ZSkgOiBudWxsLFxuICAgICAgICAgICAgZ3JvdXBGb290ZXJUZW1wbGF0ZTogY29sdW1uLmdyb3VwRm9vdGVyVGVtcGxhdGUgPyBUZW1wbGF0ZVNlcnZpY2UuY29tcGlsZShjb2x1bW4uZ3JvdXBGb290ZXJUZW1wbGF0ZSkgOiBudWxsLFxuICAgICAgICAgICAgZm9vdGVyVGVtcGxhdGU6IGNvbHVtbi5mb290ZXJUZW1wbGF0ZSA/IFRlbXBsYXRlU2VydmljZS5jb21waWxlKGNvbHVtbi5mb290ZXJUZW1wbGF0ZSkgOiBudWxsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9maWx0ZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmZpbHRlcmFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVwdGggPSB0aGlzLl9kZXB0aCgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmcm9tOiBkZXB0aCxcbiAgICAgICAgICAgIHRvOiBkZXB0aCArIHRoaXMuY29sdW1ucy5sZW5ndGggLSAxXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX2NyZWF0ZVBhZGRpbmdDZWxscyhsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUFycmF5KGxlbmd0aCwgKCkgPT4gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcIiNkZmRmZGZcIixcbiAgICAgICAgICAgIGNvbG9yOiBcIiMzMzNcIlxuICAgICAgICB9LCB0aGlzLm9wdGlvbnMucGFkZGluZ0NlbGxPcHRpb25zKSk7XG4gICAgfVxuXG4gICAgX2RhdGFSb3coZGF0YUl0ZW0sIGxldmVsLCBkZXB0aCkge1xuICAgICAgICBsZXQgY2VsbHMgPSB0aGlzLl9jcmVhdGVQYWRkaW5nQ2VsbHMobGV2ZWwpO1xuXG4gICAgICAgIC8vIGdyb3VwZWRcbiAgICAgICAgaWYgKHRoaXMuaGFzR3JvdXBzICYmIGRlcHRoICYmIGRhdGFJdGVtLml0ZW1zKSB7XG4gICAgICAgICAgICBjZWxscyA9IGNlbGxzLmNvbmNhdCh0aGlzLl9ncm91cEhlYWRlckNlbGxzKGRhdGFJdGVtLCBsZXZlbCwgZGVwdGgpKTtcbiAgICAgICAgICAgIGNvbnN0IHJvd3MgPSB0aGlzLl9kYXRhUm93cyhkYXRhSXRlbS5pdGVtcywgbGV2ZWwgKyAxKTtcblxuICAgICAgICAgICAgcm93cy51bnNoaWZ0KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImdyb3VwLWhlYWRlclwiLFxuICAgICAgICAgICAgICAgIGNlbGxzOiBjZWxscyxcbiAgICAgICAgICAgICAgICBsZXZlbDogdGhpcy5jb2xsYXBzaWJsZSA/IGxldmVsIDogbnVsbFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByb3dzLmNvbmNhdCh0aGlzLl9mb290ZXIoZGF0YUl0ZW0sIGxldmVsKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhQ2VsbHMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBjZWxsSWR4ID0gMDsgY2VsbElkeCA8IHRoaXMuY29sdW1ucy5sZW5ndGg7IGNlbGxJZHgrKykge1xuICAgICAgICAgICAgZGF0YUNlbGxzW2NlbGxJZHhdID0gdGhpcy5fY2VsbChkYXRhSXRlbSwgdGhpcy5jb2x1bW5zW2NlbGxJZHhdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhpZXJhcmNoeSkge1xuICAgICAgICAgICAgZGF0YUNlbGxzWzBdLmNvbFNwYW4gPSBkZXB0aCAtIGxldmVsICsgMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbIHtcbiAgICAgICAgICAgIHR5cGU6IFwiZGF0YVwiLFxuICAgICAgICAgICAgY2VsbHM6IGNlbGxzLmNvbmNhdChkYXRhQ2VsbHMpLFxuICAgICAgICAgICAgbGV2ZWw6IHRoaXMuY29sbGFwc2libGUgPyBsZXZlbCA6IG51bGxcbiAgICAgICAgfSBdO1xuICAgIH1cblxuICAgIF9ncm91cEhlYWRlckNlbGxzKGRhdGFJdGVtLCBsZXZlbCwgZGVwdGgpIHtcbiAgICAgICAgY29uc3QgY2VsbHMgPSBbXTtcblxuICAgICAgICBjb25zdCBjb2x1bW4gPSB0aGlzLmFsbENvbHVtbnMuZmlsdGVyKGZ1bmN0aW9uKGNvbHVtbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbi5maWVsZCA9PT0gZGF0YUl0ZW0uZmllbGQ7XG4gICAgICAgIH0pWzBdIHx8IHt9O1xuXG4gICAgICAgIGNvbnN0IHRpdGxlID0gY29sdW1uICYmIGNvbHVtbi50aXRsZSA/IGNvbHVtbi50aXRsZSA6IGRhdGFJdGVtLmZpZWxkO1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGNvbHVtbiA/IGNvbHVtbi5ncm91cEhlYWRlclRlbXBsYXRlIHx8IGNvbHVtbi5ncm91cEhlYWRlckNvbHVtblRlbXBsYXRlIDogbnVsbDtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIGZpZWxkOiBkYXRhSXRlbS5maWVsZCxcbiAgICAgICAgICAgIHZhbHVlOiBjb2x1bW4gJiYgY29sdW1uLnZhbHVlcyA/IGNvbHVtbi52YWx1ZXNbZGF0YUl0ZW0udmFsdWVdIDogZGF0YUl0ZW0udmFsdWUsXG4gICAgICAgICAgICBhZ2dyZWdhdGVzOiBkYXRhSXRlbS5hZ2dyZWdhdGVzLFxuICAgICAgICAgICAgaXRlbXM6IGRhdGFJdGVtLml0ZW1zXG4gICAgICAgIH0sIGRhdGFJdGVtLmFnZ3JlZ2F0ZXNbZGF0YUl0ZW0uZmllbGRdKTtcblxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRlbXBsYXRlID8gdGVtcGxhdGUoZ3JvdXApIDogYCR7IHRpdGxlIH06ICR7IGRhdGFJdGVtLnZhbHVlIH1gO1xuXG4gICAgICAgIGNlbGxzLnB1c2goT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcIiNkZmRmZGZcIixcbiAgICAgICAgICAgIGNvbG9yOiBcIiMzMzNcIixcbiAgICAgICAgICAgIGNvbFNwYW46ICh0aGlzLmhhc0dyb3VwSGVhZGVyQ29sdW1uID8gMSA6IHRoaXMuY29sdW1ucy5sZW5ndGgpICsgZGVwdGggLSBsZXZlbFxuICAgICAgICB9LCBjb2x1bW4uZ3JvdXBIZWFkZXJDZWxsT3B0aW9ucykpO1xuXG4gICAgICAgIGlmICh0aGlzLmhhc0dyb3VwSGVhZGVyQ29sdW1uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbihjb2x1bW4sIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjZWxscy5wdXNoKE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjZGZkZmRmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMzMzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29sdW1uLmdyb3VwSGVhZGVyQ29sdW1uVGVtcGxhdGUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbi5ncm91cEhlYWRlckNvbHVtblRlbXBsYXRlKE9iamVjdC5hc3NpZ24oeyBncm91cDogZ3JvdXAgfSwgZ3JvdXAsIGRhdGFJdGVtLmFnZ3JlZ2F0ZXNbY29sdW1uLmZpZWxkXSkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfSwgY29sdW1uLmdyb3VwSGVhZGVyQ2VsbE9wdGlvbnMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjZWxscztcbiAgICB9XG5cbiAgICBfZGF0YVJvd3MoZGF0YUl0ZW1zLCBsZXZlbCkge1xuICAgICAgICBjb25zdCBkZXB0aCA9IHRoaXMuX2RlcHRoKCk7XG4gICAgICAgIGNvbnN0IHJvd3MgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBkYXRhSXRlbXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgcm93cy5wdXNoLmFwcGx5KHJvd3MsIHRoaXMuX2RhdGFSb3coZGF0YUl0ZW1zW2lkeF0sIGxldmVsLCBkZXB0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfVxuXG4gICAgX2hpZXJhcmNoeVJvd3MoKSB7XG4gICAgICAgIGNvbnN0IGRlcHRoID0gdGhpcy5fZGVwdGgoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgY29uc3QgaXRlbUxldmVsID0gdGhpcy5oaWVyYXJjaHkuaXRlbUxldmVsO1xuICAgICAgICBjb25zdCBpdGVtSWQgPSB0aGlzLmhpZXJhcmNoeS5pdGVtSWQgfHwgZGVmYXVsdEl0ZW1JZDtcbiAgICAgICAgY29uc3QgaGFzRm9vdGVyID0gdGhpcy5faGFzRm9vdGVyVGVtcGxhdGUoKTtcbiAgICAgICAgY29uc3Qgcm93cyA9IFtdO1xuICAgICAgICBjb25zdCBwYXJlbnRzID0gW107XG4gICAgICAgIGxldCBwcmV2aW91c0xldmVsID0gMDtcbiAgICAgICAgbGV0IHByZXZpb3VzSXRlbUlkO1xuXG4gICAgICAgIGlmICghaGFzRm9vdGVyKSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNpYmxlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBkYXRhLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2lkeF07XG4gICAgICAgICAgICBjb25zdCBsZXZlbCA9IGl0ZW1MZXZlbChpdGVtLCBpZHgpO1xuXG4gICAgICAgICAgICBpZiAoaGFzRm9vdGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxldmVsID4gcHJldmlvdXNMZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRzLnB1c2goeyBpZDogcHJldmlvdXNJdGVtSWQsIGxldmVsOiBwcmV2aW91c0xldmVsIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGV2ZWwgPCBwcmV2aW91c0xldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaC5hcHBseShyb3dzLCB0aGlzLl9oaWVyYXJjaHlGb290ZXJSb3dzKHBhcmVudHMsIGxldmVsLCBkZXB0aCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHByZXZpb3VzTGV2ZWwgPSBsZXZlbDtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0l0ZW1JZCA9IGl0ZW1JZChpdGVtLCBpZHgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByb3dzLnB1c2guYXBwbHkocm93cywgdGhpcy5fZGF0YVJvdyhpdGVtLCBsZXZlbCArIDEsIGRlcHRoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzRm9vdGVyKSB7XG4gICAgICAgICAgICByb3dzLnB1c2guYXBwbHkocm93cywgdGhpcy5faGllcmFyY2h5Rm9vdGVyUm93cyhwYXJlbnRzLCAwLCBkZXB0aCkpO1xuXG4gICAgICAgICAgICBjb25zdCByb290QWdncmVnYXRlID0gZGF0YS5sZW5ndGggPyB0aGlzLmFnZ3JlZ2F0ZXNbZGF0YVswXS5wYXJlbnRJZF0gOiB7fTtcbiAgICAgICAgICAgIHJvd3MucHVzaCh0aGlzLl9oaWVyYXJjaHlGb290ZXIocm9vdEFnZ3JlZ2F0ZSwgMCwgZGVwdGgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3ByZXBlbmRIZWFkZXJSb3dzKHJvd3MpO1xuXG4gICAgICAgIHJldHVybiByb3dzO1xuICAgIH1cblxuICAgIF9oaWVyYXJjaHlGb290ZXJSb3dzKHBhcmVudHMsIGN1cnJlbnRMZXZlbCwgZGVwdGgpIHtcbiAgICAgICAgY29uc3Qgcm93cyA9IFtdO1xuICAgICAgICB3aGlsZSAocGFyZW50cy5sZW5ndGggJiYgcGFyZW50c1twYXJlbnRzLmxlbmd0aCAtIDFdLmxldmVsID49IGN1cnJlbnRMZXZlbCkge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gcGFyZW50cy5wb3AoKTtcbiAgICAgICAgICAgIHJvd3MucHVzaCh0aGlzLl9oaWVyYXJjaHlGb290ZXIodGhpcy5hZ2dyZWdhdGVzW3BhcmVudC5pZF0sIHBhcmVudC5sZXZlbCArIDEsIGRlcHRoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBfaGFzRm9vdGVyVGVtcGxhdGUoKSB7XG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmNvbHVtbnM7XG4gICAgICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IGNvbHVtbnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgaWYgKGNvbHVtbnNbaWR4XS5mb290ZXJUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2hpZXJhcmNoeUZvb3RlcihhZ2dyZWdhdGVzLCBsZXZlbCwgZGVwdGgpIHtcbiAgICAgICAgY29uc3QgY2VsbHMgPSB0aGlzLmNvbHVtbnMubWFwKGZ1bmN0aW9uKGNvbHVtbiwgaW5kZXgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbFNwYW4gPSBpbmRleCA/IDEgOiBkZXB0aCAtIGxldmVsICsgMTtcbiAgICAgICAgICAgIGlmIChjb2x1bW4uZm9vdGVyVGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZEFnZ3JlZ2F0ZXMgPSAoYWdncmVnYXRlcyB8fCB7fSlbY29sdW1uLmZpZWxkXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2RmZGZkZlwiLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMzMzXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbFNwYW46IGNvbFNwYW4sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb2x1bW4uZm9vdGVyVGVtcGxhdGUoT2JqZWN0LmFzc2lnbih7IGFnZ3JlZ2F0ZXM6IGFnZ3JlZ2F0ZXMgfSwgZmllbGRBZ2dyZWdhdGVzKSlcbiAgICAgICAgICAgICAgICB9LCBjb2x1bW4uZm9vdGVyQ2VsbE9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjZGZkZmRmXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IFwiIzMzM1wiLFxuICAgICAgICAgICAgICAgIGNvbFNwYW46IGNvbFNwYW5cbiAgICAgICAgICAgIH0sIGNvbHVtbi5mb290ZXJDZWxsT3B0aW9ucyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBcImZvb3RlclwiLFxuICAgICAgICAgICAgY2VsbHM6IHRoaXMuX2NyZWF0ZVBhZGRpbmdDZWxscyhsZXZlbCkuY29uY2F0KGNlbGxzKSxcbiAgICAgICAgICAgIGxldmVsOiB0aGlzLmNvbGxhcHNpYmxlID8gbGV2ZWwgOiBudWxsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX2Zvb3RlcihkYXRhSXRlbSwgbGV2ZWwpIHtcbiAgICAgICAgY29uc3Qgcm93cyA9IFtdO1xuICAgICAgICBjb25zdCBmb290ZXIgPSB0aGlzLmNvbHVtbnMuc29tZShjb2x1bW4gPT4gY29sdW1uLmdyb3VwRm9vdGVyVGVtcGxhdGUpO1xuXG4gICAgICAgIGxldCB0ZW1wbGF0ZURhdGEsIGdyb3VwO1xuICAgICAgICBpZiAoZm9vdGVyKSB7XG4gICAgICAgICAgICBncm91cCA9IHtcbiAgICAgICAgICAgICAgICBncm91cDogeyBpdGVtczogZGF0YUl0ZW0uaXRlbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGRhdGFJdGVtLmZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkYXRhSXRlbS52YWx1ZSB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGVtcGxhdGVEYXRhID0ge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhkYXRhSXRlbS5hZ2dyZWdhdGVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEYXRhW2tleV0gPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhSXRlbS5hZ2dyZWdhdGVzW2tleV0sIGdyb3VwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2VsbHMgPSB0aGlzLmNvbHVtbnMubWFwKChjb2x1bW4pID0+IHtcbiAgICAgICAgICAgIGlmIChjb2x1bW4uZ3JvdXBGb290ZXJUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgdGVtcGxhdGVEYXRhLCBkYXRhSXRlbS5hZ2dyZWdhdGVzW2NvbHVtbi5maWVsZF0sIGdyb3VwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2RmZGZkZlwiLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMzMzXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb2x1bW4uZ3JvdXBGb290ZXJUZW1wbGF0ZShkYXRhKVxuICAgICAgICAgICAgICAgIH0sIGNvbHVtbi5ncm91cEZvb3RlckNlbGxPcHRpb25zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiI2RmZGZkZlwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcIiMzMzNcIlxuICAgICAgICAgICAgfSwgY29sdW1uLmdyb3VwRm9vdGVyQ2VsbE9wdGlvbnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZm9vdGVyKSB7XG4gICAgICAgICAgICByb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZ3JvdXAtZm9vdGVyXCIsXG4gICAgICAgICAgICAgICAgY2VsbHM6IHRoaXMuX2NyZWF0ZVBhZGRpbmdDZWxscyh0aGlzLmdyb3Vwcy5sZW5ndGgpLmNvbmNhdChjZWxscyksXG4gICAgICAgICAgICAgICAgbGV2ZWw6IHRoaXMuY29sbGFwc2libGUgPyBsZXZlbCA6IG51bGxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfVxuXG4gICAgX2lzQ29sdW1uVmlzaWJsZShjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Zpc2libGVDb2x1bW5zKFsgY29sdW1uIF0pLmxlbmd0aCA+IDAgJiYgKGNvbHVtbi5maWVsZCB8fCBjb2x1bW4uY29sdW1ucyk7XG4gICAgfVxuXG4gICAgX3Zpc2libGVDb2x1bW5zKGNvbHVtbnMpIHtcbiAgICAgICAgcmV0dXJuIGNvbHVtbnMuZmlsdGVyKChjb2x1bW4pID0+IHtcbiAgICAgICAgICAgIGxldCBleHBvcnRhYmxlID0gY29sdW1uLmV4cG9ydGFibGU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydGFibGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgZXhwb3J0YWJsZSA9IGNvbHVtbi5leHBvcnRhYmxlLmV4Y2VsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB2aXNpYmxlSW5FeHBvcnQgPSAhY29sdW1uLmhpZGRlbiAmJiBleHBvcnRhYmxlICE9PSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IHZpc2libGVJbkV4cG9ydE9ubHkgPSBjb2x1bW4uaGlkZGVuICYmIGV4cG9ydGFibGUgPT09IHRydWU7XG4gICAgICAgICAgICBsZXQgdmlzaWJsZSA9IHZpc2libGVJbkV4cG9ydCB8fCB2aXNpYmxlSW5FeHBvcnRPbmx5O1xuICAgICAgICAgICAgaWYgKHZpc2libGUgJiYgY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICB2aXNpYmxlID0gdGhpcy5fdmlzaWJsZUNvbHVtbnMoY29sdW1uLmNvbHVtbnMpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmlzaWJsZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2hlYWRlclJvdyhyb3csIGdyb3Vwcykge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gcm93LmNlbGxzLm1hcChmdW5jdGlvbihjZWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihjZWxsLCB7XG4gICAgICAgICAgICAgICAgY29sU3BhbjogY2VsbC5jb2xTcGFuID4gMSA/IGNlbGwuY29sU3BhbiA6IDEsXG4gICAgICAgICAgICAgICAgcm93U3Bhbjogcm93LnJvd1NwYW4gPiAxICYmICFjZWxsLmNvbFNwYW4gPyByb3cucm93U3BhbiA6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5oaWVyYXJjaHkgJiYgaGVhZGVyc1swXS5maXJzdENlbGwpIHtcbiAgICAgICAgICAgIGhlYWRlcnNbMF0uY29sU3BhbiArPSB0aGlzLl9kZXB0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IFwiaGVhZGVyXCIsXG4gICAgICAgICAgICBjZWxsczogY3JlYXRlQXJyYXkoZ3JvdXBzLmxlbmd0aCwgKCkgPT4gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjN2E3YTdhXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IFwiI2ZmZlwiXG4gICAgICAgICAgICB9LCB0aGlzLm9wdGlvbnMuaGVhZGVyUGFkZGluZ0NlbGxPcHRpb25zKSkuY29uY2F0KGhlYWRlcnMpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX3ByZXBlbmRIZWFkZXJSb3dzKHJvd3MpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBzID0gdGhpcy5ncm91cHM7XG5cbiAgICAgICAgY29uc3QgaGVhZGVyUm93cyA9IFsgeyByb3dTcGFuOiAxLCBjZWxsczogW10sIGluZGV4OiAwIH0gXTtcblxuICAgICAgICB0aGlzLl9wcmVwYXJlSGVhZGVyUm93cyhoZWFkZXJSb3dzLCB0aGlzLm9wdGlvbnMuY29sdW1ucyk7XG5cbiAgICAgICAgZm9yIChsZXQgaWR4ID0gaGVhZGVyUm93cy5sZW5ndGggLSAxOyBpZHggPj0gMDsgaWR4LS0pIHtcbiAgICAgICAgICAgIHJvd3MudW5zaGlmdCh0aGlzLl9oZWFkZXJSb3coaGVhZGVyUm93c1tpZHhdLCBncm91cHMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9wcmVwYXJlSGVhZGVyUm93cyhyb3dzLCBjb2x1bW5zLCBwYXJlbnRDZWxsLCBwYXJlbnRSb3cpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gcGFyZW50Um93IHx8IHJvd3Nbcm93cy5sZW5ndGggLSAxXTtcbiAgICAgICAgbGV0IGNoaWxkUm93ID0gcm93c1tyb3cuaW5kZXggKyAxXTtcbiAgICAgICAgbGV0IHRvdGFsQ29sU3BhbiA9IDA7XG5cbiAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgY29sdW1ucy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW4gPSBjb2x1bW5zW2lkeF07XG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb2x1bW5WaXNpYmxlKGNvbHVtbikpIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjN2E3YTdhXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbHVtbi50aXRsZSB8fCBjb2x1bW4uZmllbGQsXG4gICAgICAgICAgICAgICAgICAgIGNvbFNwYW46IDAsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0Q2VsbDogaWR4ID09PSAwICYmICghcGFyZW50Q2VsbCB8fCBwYXJlbnRDZWxsLmZpcnN0Q2VsbClcbiAgICAgICAgICAgICAgICB9LCBjb2x1bW4uaGVhZGVyQ2VsbE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHJvdy5jZWxscy5wdXNoKGNlbGwpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbHVtbi5jb2x1bW5zICYmIGNvbHVtbi5jb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoaWxkUm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFJvdyA9IHsgcm93U3BhbjogMCwgY2VsbHM6IFtdLCBpbmRleDogcm93cy5sZW5ndGggfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3MucHVzaChjaGlsZFJvdyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2VsbC5jb2xTcGFuID0gdGhpcy5fdHJpbUNvbHVtbnModGhpcy5fdmlzaWJsZUNvbHVtbnMoY29sdW1uLmNvbHVtbnMpKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXBhcmVIZWFkZXJSb3dzKHJvd3MsIGNvbHVtbi5jb2x1bW5zLCBjZWxsLCBjaGlsZFJvdyk7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsQ29sU3BhbiArPSBjZWxsLmNvbFNwYW4gLSAxO1xuICAgICAgICAgICAgICAgICAgICByb3cucm93U3BhbiA9IHJvd3MubGVuZ3RoIC0gcm93LmluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJlbnRDZWxsKSB7XG4gICAgICAgICAgICBwYXJlbnRDZWxsLmNvbFNwYW4gKz0gdG90YWxDb2xTcGFuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3Jvd3MoKSB7XG4gICAgICAgIGNvbnN0IHJvd3MgPSB0aGlzLl9kYXRhUm93cyh0aGlzLmRhdGEsIDApO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbHVtbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLl9wcmVwZW5kSGVhZGVyUm93cyhyb3dzKTtcbiAgICAgICAgICAgIGxldCBmb290ZXIgPSBmYWxzZTtcblxuICAgICAgICAgICAgY29uc3QgY2VsbHMgPSB0aGlzLmNvbHVtbnMubWFwKChjb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uLmZvb3RlclRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvb3RlciA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjZGZkZmRmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjMzMzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29sdW1uLmZvb3RlclRlbXBsYXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuYWdncmVnYXRlcywgdGhpcy5hZ2dyZWdhdGVzW2NvbHVtbi5maWVsZF0pKVxuICAgICAgICAgICAgICAgICAgICB9LCBjb2x1bW4uZm9vdGVyQ2VsbE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCIjZGZkZmRmXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiMzMzNcIlxuICAgICAgICAgICAgICAgIH0sIGNvbHVtbi5mb290ZXJDZWxsT3B0aW9ucyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGZvb3Rlcikge1xuICAgICAgICAgICAgICAgIHJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZm9vdGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIGNlbGxzOiB0aGlzLl9jcmVhdGVQYWRkaW5nQ2VsbHModGhpcy5ncm91cHMubGVuZ3RoKS5jb25jYXQoY2VsbHMpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm93cztcbiAgICB9XG5cbiAgICBfaGVhZGVyRGVwdGgoY29sdW1ucykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSAxO1xuICAgICAgICBsZXQgbWF4ID0gMDtcblxuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBjb2x1bW5zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIGlmIChjb2x1bW5zW2lkeF0uY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB0aGlzLl9oZWFkZXJEZXB0aChjb2x1bW5zW2lkeF0uY29sdW1ucyk7XG4gICAgICAgICAgICAgICAgaWYgKHRlbXAgPiBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gdGVtcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdCArIG1heDtcbiAgICB9XG5cbiAgICBfZnJlZXplUGFuZSgpIHtcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMuX3Zpc2libGVDb2x1bW5zKHRoaXMub3B0aW9ucy5jb2x1bW5zIHx8IFtdKTtcblxuICAgICAgICBjb25zdCBjb2xTcGxpdCA9IHRoaXMuX3Zpc2libGVDb2x1bW5zKHRoaXMuX3RyaW1Db2x1bW5zKHRoaXMuX2xlYWZDb2x1bW5zKGNvbHVtbnMuZmlsdGVyKGZ1bmN0aW9uKGNvbHVtbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbi5sb2NrZWQ7XG4gICAgICAgIH0pKSkpLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcm93U3BsaXQ6IHRoaXMuX2hlYWRlckRlcHRoKGNvbHVtbnMpLFxuICAgICAgICAgICAgY29sU3BsaXQ6IGNvbFNwbGl0ID8gY29sU3BsaXQgKyB0aGlzLmdyb3Vwcy5sZW5ndGggOiAwXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX2NlbGwoZGF0YUl0ZW0sIGNvbHVtbikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICB2YWx1ZTogY29sdW1uLnZhbHVlKGRhdGFJdGVtKVxuICAgICAgICB9LCBjb2x1bW4uY2VsbE9wdGlvbnMpO1xuICAgIH1cblxuICAgIF9kZXB0aCgpIHtcbiAgICAgICAgbGV0IGRlcHRoID0gMDtcblxuICAgICAgICBpZiAodGhpcy5oaWVyYXJjaHkpIHtcbiAgICAgICAgICAgIGRlcHRoID0gdGhpcy5oaWVyYXJjaHkuZGVwdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZXB0aCA9IHRoaXMuZ3JvdXBzLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXB0aDtcbiAgICB9XG5cbiAgICBfY29sdW1ucygpIHtcbiAgICAgICAgY29uc3QgZGVwdGggPSB0aGlzLl9kZXB0aCgpO1xuICAgICAgICBjb25zdCBjb2x1bW5zID0gY3JlYXRlQXJyYXkoZGVwdGgsICgpID0+ICh7IHdpZHRoOiAyMCB9KSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbHVtbnMuY29uY2F0KHRoaXMuY29sdW1ucy5tYXAoZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiBwYXJzZUludChjb2x1bW4ud2lkdGgsIDEwKSxcbiAgICAgICAgICAgICAgICBhdXRvV2lkdGg6IGNvbHVtbi53aWR0aCA/IGZhbHNlIDogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXhjZWxFeHBvcnRlcjtcbiIsImxldCBjdXJyZW50ID0ge1xuICAgIHRvU3RyaW5nOiAodmFsdWUpID0+IHZhbHVlXG59O1xuXG5jbGFzcyBJbnRsU2VydmljZSB7XG4gICAgc3RhdGljIHJlZ2lzdGVyKHVzZXJJbXBsZW1lbnRhdGlvbikge1xuICAgICAgICBjdXJyZW50ID0gdXNlckltcGxlbWVudGF0aW9uO1xuICAgIH1cblxuICAgIHN0YXRpYyB0b1N0cmluZyh2YWx1ZSwgZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50LnRvU3RyaW5nKHZhbHVlLCBmb3JtYXQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW50bFNlcnZpY2U7IiwiaW1wb3J0IEpTWmlwIGZyb20gJ0Bwcm9ncmVzcy9qc3ppcC1lc20nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVaaXAoKSB7XG4gICAgcmV0dXJuIG5ldyBKU1ppcCgpO1xufVxuIiwiLy8gZGF0ZSBwYWNraW5nIHV0aWxpdGllcyBmcm9tIEtlbmRvIFNwcmVhZHNoZWV0XG5cbi8vIEp1bGlhbiBkYXlzIGFsZ29yaXRobXMgZnJvbSBodHRwOi8vd3d3Lmhlcm1ldGljLmNoL2NhbF9zdHVkL2pkbi5odG0jY29tcFxuZnVuY3Rpb24gZGF0ZVRvSnVsaWFuRGF5cyh5LCBtLCBkKSB7XG4gICAgcmV0dXJuICgoMTQ2MSAqICh5ICsgNDgwMCArICgobSAtIDEzKSAvIDEyIHwgMCkpKSAvIDQgfCAwKSArXG4gICAgICAgICgoMzY3ICogKG0gLSAxIC0gMTIgKiAoKG0gLSAxMykgLyAxMiB8IDApKSkgLyAxMiB8IDApIC1cbiAgICAgICAgKCgzICogKCgoeSArIDQ5MDAgKyAoKG0gLSAxMykgLyAxMiB8IDApKSAvIDEwMCB8IDApKSkgLyA0IHwgMCkgK1xuICAgICAgICBkIC0gMzIwNzU7XG59XG5cbi8vIFRoaXMgdXNlcyB0aGUgR29vZ2xlIFNwcmVhZHNoZWV0IGFwcHJvYWNoOiB0cmVhdCAxODk5LTEyLTMxIGFzIGRheSAxLCBhbGxvd2luZyB0byBhdm9pZFxuLy8gaW1wbGVtZW50aW5nIHRoZSBcIkxlYXAgWWVhciBCdWdcIiB5ZXQgc3RpbGwgYmUgRXhjZWwgY29tcGF0aWJsZSBmb3IgZGF0ZXMgc3RhcnRpbmcgMTkwMC0wMy0wMS5cbmNvbnN0IEJBU0VfREFURSA9IGRhdGVUb0p1bGlhbkRheXMoMTkwMCwgMCwgLTEpO1xuXG5mdW5jdGlvbiBwYWNrRGF0ZSh5ZWFyLCBtb250aCwgZGF0ZSkge1xuICAgIHJldHVybiBkYXRlVG9KdWxpYW5EYXlzKHllYXIsIG1vbnRoLCBkYXRlKSAtIEJBU0VfREFURTtcbn1cblxuZnVuY3Rpb24gcGFja1RpbWUoaGgsIG1tLCBzcywgbXMpIHtcbiAgICByZXR1cm4gKGhoICsgKG1tICsgKHNzICsgbXMgLyAxMDAwKSAvIDYwKSAvIDYwKSAvIDI0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRlVG9TZXJpYWwoZGF0ZSkge1xuICAgIGNvbnN0IHRpbWUgPSBwYWNrVGltZShkYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGUuZ2V0TWludXRlcygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlLmdldFNlY29uZHMoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSk7XG4gICAgY29uc3Qgc2VyaWFsID0gcGFja0RhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGUuZ2V0TW9udGgoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlLmdldERhdGUoKSk7XG4gICAgcmV0dXJuIHNlcmlhbCA8IDAgPyBzZXJpYWwgLSAxICsgdGltZSA6IHNlcmlhbCArIHRpbWU7XG59XG4iLCJpbXBvcnQgbWFwIGZyb20gJy4vdXRpbHMvbWFwJztcbmltcG9ydCBjcmVhdGVaaXAgZnJvbSAnLi91dGlscy9jcmVhdGUtemlwJztcbmltcG9ydCBJbnRsU2VydmljZSBmcm9tICcuL3NlcnZpY2VzL2ludGwtc2VydmljZSc7XG5pbXBvcnQgZGF0ZVRvU2VyaWFsIGZyb20gJy4vdXRpbHMvdGltZSc7XG5cbmNvbnN0IE1JTUVfVFlQRSA9IFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXRcIjtcbmNvbnN0IERBVEFfVVJMX1BSRUZJWCA9IGBkYXRhOiR7TUlNRV9UWVBFfTtiYXNlNjQsYDtcbmNvbnN0IERBVEFfVVJMX09QVElPTlMgPSB7IGNvbXByZXNzaW9uOiBcIkRFRkxBVEVcIiwgdHlwZTogXCJiYXNlNjRcIiB9O1xuY29uc3QgQkxPQl9PUFRJT05TID0geyBjb21wcmVzc2lvbjogXCJERUZMQVRFXCIsIHR5cGU6IFwiYmxvYlwiIH07XG5jb25zdCBBUlJBWUJVRkZFUl9PUFRJT05TID0geyBjb21wcmVzc2lvbjogXCJERUZMQVRFXCIsIHR5cGU6IFwiYXJyYXlidWZmZXJcIiB9O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBrZXktc3BhY2luZywgbm8tYXJyb3ctY29uZGl0aW9uLCBpbmRlbnQsIG5vLW5lc3RlZC10ZXJuYXJ5LCBjb25zaXN0ZW50LXJldHVybiAqL1xuXG5mdW5jdGlvbiB0b0RhdGFVUkkoY29udGVudCkge1xuICAgIHJldHVybiBEQVRBX1VSTF9QUkVGSVggKyBjb250ZW50O1xufVxuXG5mdW5jdGlvbiBpbmRleE9mKHRoaW5nLCBhcnJheSkge1xuICAgIHJldHVybiBhcnJheS5pbmRleE9mKHRoaW5nKTtcbn1cblxuY29uc3QgcGFyc2VKU09OID0gSlNPTi5wYXJzZS5iaW5kKEpTT04pO1xuXG5mdW5jdGlvbiBFU0ModmFsKSB7XG4gICAgcmV0dXJuIFN0cmluZyh2YWwpXG4gICAgICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgICAgICAucmVwbGFjZSgvXFxcIi9nLCBcIiZxdW90O1wiKVxuICAgICAgICAucmVwbGFjZSgvXFwnL2csIFwiJiMzOTtcIik7XG59XG5cbmZ1bmN0aW9uIHJlcGVhdChjb3VudCwgZnVuYykge1xuICAgIGxldCBzdHIgPSBcIlwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgICBzdHIgKz0gZnVuYyhpKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cblxuZnVuY3Rpb24gZm9yZWFjaChhcnIsIGZ1bmMpIHtcbiAgICBsZXQgc3RyID0gXCJcIjtcbiAgICBpZiAoYXJyICE9IG51bGwpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBzdHIgKz0gZnVuYyhhcnJbaV0sIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcnIgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXJyKS5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgICAgICAgICAgICBzdHIgKz0gZnVuYyhhcnJba2V5XSwga2V5LCBpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59XG5cbmNvbnN0IFhNTEhFQUQgPSAnPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIiBzdGFuZGFsb25lPVwieWVzXCI/Plxccic7XG5cbmNvbnN0IFJFTFMgPSBgJHtYTUxIRUFEfVxuICAgICAgICAgICAgPFJlbGF0aW9uc2hpcHMgeG1sbnM9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L3JlbGF0aW9uc2hpcHNcIj5cbiAgICAgICAgICAgICAgIDxSZWxhdGlvbnNoaXAgSWQ9XCJySWQzXCIgVHlwZT1cImh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9vZmZpY2VEb2N1bWVudC8yMDA2L3JlbGF0aW9uc2hpcHMvZXh0ZW5kZWQtcHJvcGVydGllc1wiIFRhcmdldD1cImRvY1Byb3BzL2FwcC54bWxcIi8+XG4gICAgICAgICAgICAgICA8UmVsYXRpb25zaGlwIElkPVwicklkMlwiIFR5cGU9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L3JlbGF0aW9uc2hpcHMvbWV0YWRhdGEvY29yZS1wcm9wZXJ0aWVzXCIgVGFyZ2V0PVwiZG9jUHJvcHMvY29yZS54bWxcIi8+XG4gICAgICAgICAgICAgICA8UmVsYXRpb25zaGlwIElkPVwicklkMVwiIFR5cGU9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9yZWxhdGlvbnNoaXBzL29mZmljZURvY3VtZW50XCIgVGFyZ2V0PVwieGwvd29ya2Jvb2sueG1sXCIvPlxuICAgICAgICAgICAgPC9SZWxhdGlvbnNoaXBzPmA7XG5cbmNvbnN0IENPUkUgPSAoeyBjcmVhdG9yLCBsYXN0TW9kaWZpZWRCeSwgY3JlYXRlZCwgbW9kaWZpZWQgfSkgPT4gYCR7WE1MSEVBRH1cbiA8Y3A6Y29yZVByb3BlcnRpZXMgeG1sbnM6Y3A9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L21ldGFkYXRhL2NvcmUtcHJvcGVydGllc1wiXG4gICB4bWxuczpkYz1cImh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvXCIgeG1sbnM6ZGN0ZXJtcz1cImh0dHA6Ly9wdXJsLm9yZy9kYy90ZXJtcy9cIlxuICAgeG1sbnM6ZGNtaXR5cGU9XCJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvXCIgeG1sbnM6eHNpPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2VcIj5cbiAgIDxkYzpjcmVhdG9yPiR7RVNDKGNyZWF0b3IpfTwvZGM6Y3JlYXRvcj5cbiAgIDxjcDpsYXN0TW9kaWZpZWRCeT4ke0VTQyhsYXN0TW9kaWZpZWRCeSl9PC9jcDpsYXN0TW9kaWZpZWRCeT5cbiAgIDxkY3Rlcm1zOmNyZWF0ZWQgeHNpOnR5cGU9XCJkY3Rlcm1zOlczQ0RURlwiPiR7RVNDKGNyZWF0ZWQpfTwvZGN0ZXJtczpjcmVhdGVkPlxuICAgPGRjdGVybXM6bW9kaWZpZWQgeHNpOnR5cGU9XCJkY3Rlcm1zOlczQ0RURlwiPiR7RVNDKG1vZGlmaWVkKX08L2RjdGVybXM6bW9kaWZpZWQ+XG48L2NwOmNvcmVQcm9wZXJ0aWVzPmA7XG5cbmNvbnN0IEFQUCA9ICh7IHNoZWV0cyB9KSA9PiBgJHtYTUxIRUFEfVxuPFByb3BlcnRpZXMgeG1sbnM9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9leHRlbmRlZC1wcm9wZXJ0aWVzXCIgeG1sbnM6dnQ9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9kb2NQcm9wc1ZUeXBlc1wiPlxuICA8QXBwbGljYXRpb24+TWljcm9zb2Z0IEV4Y2VsPC9BcHBsaWNhdGlvbj5cbiAgPERvY1NlY3VyaXR5PjA8L0RvY1NlY3VyaXR5PlxuICA8U2NhbGVDcm9wPmZhbHNlPC9TY2FsZUNyb3A+XG4gIDxIZWFkaW5nUGFpcnM+XG4gICAgPHZ0OnZlY3RvciBzaXplPVwiMlwiIGJhc2VUeXBlPVwidmFyaWFudFwiPlxuICAgICAgPHZ0OnZhcmlhbnQ+XG4gICAgICAgIDx2dDpscHN0cj5Xb3Jrc2hlZXRzPC92dDpscHN0cj5cbiAgICAgIDwvdnQ6dmFyaWFudD5cbiAgICAgIDx2dDp2YXJpYW50PlxuICAgICAgICA8dnQ6aTQ+JHtzaGVldHMubGVuZ3RofTwvdnQ6aTQ+XG4gICAgICA8L3Z0OnZhcmlhbnQ+XG4gICAgPC92dDp2ZWN0b3I+XG4gIDwvSGVhZGluZ1BhaXJzPlxuICA8VGl0bGVzT2ZQYXJ0cz5cbiAgICA8dnQ6dmVjdG9yIHNpemU9XCIke3NoZWV0cy5sZW5ndGh9XCIgYmFzZVR5cGU9XCJscHN0clwiPiR7XG4gICAgICBmb3JlYWNoKHNoZWV0cywgKHNoZWV0LCBpKSA9PlxuICAgICAgICBzaGVldC5vcHRpb25zLnRpdGxlXG4gICAgICAgICAgPyBgPHZ0Omxwc3RyPiR7RVNDKHNoZWV0Lm9wdGlvbnMudGl0bGUpfTwvdnQ6bHBzdHI+YFxuICAgICAgICAgIDogYDx2dDpscHN0cj5TaGVldCR7aSArIDF9PC92dDpscHN0cj5gXG4gICAgICApXG4gICAgfTwvdnQ6dmVjdG9yPlxuICA8L1RpdGxlc09mUGFydHM+XG4gIDxMaW5rc1VwVG9EYXRlPmZhbHNlPC9MaW5rc1VwVG9EYXRlPlxuICA8U2hhcmVkRG9jPmZhbHNlPC9TaGFyZWREb2M+XG4gIDxIeXBlcmxpbmtzQ2hhbmdlZD5mYWxzZTwvSHlwZXJsaW5rc0NoYW5nZWQ+XG4gIDxBcHBWZXJzaW9uPjE0LjAzMDA8L0FwcFZlcnNpb24+XG48L1Byb3BlcnRpZXM+YDtcblxuY29uc3QgQ09OVEVOVF9UWVBFUyA9ICh7IHNoZWV0Q291bnQsIGNvbW1lbnRGaWxlcywgZHJhd2luZ0ZpbGVzIH0pID0+IGAke1hNTEhFQUR9XG48VHlwZXMgeG1sbnM9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L2NvbnRlbnQtdHlwZXNcIj5cbiAgPERlZmF1bHQgRXh0ZW5zaW9uPVwicG5nXCIgQ29udGVudFR5cGU9XCJpbWFnZS9wbmdcIi8+XG4gIDxEZWZhdWx0IEV4dGVuc2lvbj1cImdpZlwiIENvbnRlbnRUeXBlPVwiaW1hZ2UvZ2lmXCIvPlxuICA8RGVmYXVsdCBFeHRlbnNpb249XCJqcGdcIiBDb250ZW50VHlwZT1cImltYWdlL2pwZWdcIi8+XG4gIDxEZWZhdWx0IEV4dGVuc2lvbj1cInJlbHNcIiBDb250ZW50VHlwZT1cImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1wYWNrYWdlLnJlbGF0aW9uc2hpcHMreG1sXCIgLz5cbiAgPERlZmF1bHQgRXh0ZW5zaW9uPVwieG1sXCIgQ29udGVudFR5cGU9XCJhcHBsaWNhdGlvbi94bWxcIiAvPlxuICA8RGVmYXVsdCBFeHRlbnNpb249XCJ2bWxcIiBDb250ZW50VHlwZT1cImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC52bWxEcmF3aW5nXCIvPlxuICA8T3ZlcnJpZGUgUGFydE5hbWU9XCIveGwvd29ya2Jvb2sueG1sXCIgQ29udGVudFR5cGU9XCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldC5tYWluK3htbFwiIC8+XG4gIDxPdmVycmlkZSBQYXJ0TmFtZT1cIi94bC9zdHlsZXMueG1sXCIgQ29udGVudFR5cGU9XCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zdHlsZXMreG1sXCIvPlxuICA8T3ZlcnJpZGUgUGFydE5hbWU9XCIveGwvc2hhcmVkU3RyaW5ncy54bWxcIiBDb250ZW50VHlwZT1cImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoYXJlZFN0cmluZ3MreG1sXCIvPlxuICAke3JlcGVhdChzaGVldENvdW50LCBpZHggPT5cbiAgICBgPE92ZXJyaWRlIFBhcnROYW1lPVwiL3hsL3dvcmtzaGVldHMvc2hlZXQke2lkeCArIDF9LnhtbFwiIENvbnRlbnRUeXBlPVwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwud29ya3NoZWV0K3htbFwiIC8+YCl9XG4gICR7Zm9yZWFjaChjb21tZW50RmlsZXMsIGZpbGVuYW1lID0+XG4gICAgYDxPdmVycmlkZSBQYXJ0TmFtZT1cIi94bC8ke2ZpbGVuYW1lfVwiIENvbnRlbnRUeXBlPVwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuY29tbWVudHMreG1sXCIvPmApfVxuICAke2ZvcmVhY2goZHJhd2luZ0ZpbGVzLCBmaWxlbmFtZSA9PlxuICAgIGA8T3ZlcnJpZGUgUGFydE5hbWU9XCIveGwvZHJhd2luZ3MvJHtmaWxlbmFtZX1cIiBDb250ZW50VHlwZT1cImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5kcmF3aW5nK3htbFwiLz5gKX1cbiAgPE92ZXJyaWRlIFBhcnROYW1lPVwiL2RvY1Byb3BzL2NvcmUueG1sXCIgQ29udGVudFR5cGU9XCJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtcGFja2FnZS5jb3JlLXByb3BlcnRpZXMreG1sXCIgLz5cbiAgPE92ZXJyaWRlIFBhcnROYW1lPVwiL2RvY1Byb3BzL2FwcC54bWxcIiBDb250ZW50VHlwZT1cImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5leHRlbmRlZC1wcm9wZXJ0aWVzK3htbFwiIC8+XG48L1R5cGVzPmA7XG5cbmNvbnN0IFdPUktCT09LID0gKHsgc2hlZXRzLCBmaWx0ZXJOYW1lcywgdXNlck5hbWVzIH0pID0+IGAke1hNTEhFQUR9XG48d29ya2Jvb2sgeG1sbnM9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvc3ByZWFkc2hlZXRtbC8yMDA2L21haW5cIiB4bWxuczpyPVwiaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwc1wiPlxuICA8ZmlsZVZlcnNpb24gYXBwTmFtZT1cInhsXCIgbGFzdEVkaXRlZD1cIjVcIiBsb3dlc3RFZGl0ZWQ9XCI1XCIgcnVwQnVpbGQ9XCI5MzAzXCIgLz5cbiAgPHdvcmtib29rUHIgZGVmYXVsdFRoZW1lVmVyc2lvbj1cIjEyNDIyNlwiIC8+XG4gIDxib29rVmlld3M+XG4gICAgPHdvcmtib29rVmlldyB4V2luZG93PVwiMjQwXCIgeVdpbmRvdz1cIjQ1XCIgd2luZG93V2lkdGg9XCIxODE5NVwiIHdpbmRvd0hlaWdodD1cIjc5OTVcIiAvPlxuICA8L2Jvb2tWaWV3cz5cbiAgPHNoZWV0cz5cbiAgJHtmb3JlYWNoKHNoZWV0cywgKHsgb3B0aW9ucyB9LCBpKSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IG9wdGlvbnMubmFtZSB8fCBvcHRpb25zLnRpdGxlIHx8IGBTaGVldCR7aSArIDF9YDtcbiAgICByZXR1cm4gYDxzaGVldCBuYW1lPVwiJHtFU0MobmFtZSl9XCIgc2hlZXRJZD1cIiR7aSArIDF9XCIgcjppZD1cInJJZCR7aSArIDF9XCIgLz5gO1xuICB9KX1cbiAgPC9zaGVldHM+XG4gICR7ZmlsdGVyTmFtZXMubGVuZ3RoIHx8IHVzZXJOYW1lcy5sZW5ndGggPyBgXG4gICAgPGRlZmluZWROYW1lcz5cbiAgICAgICR7Zm9yZWFjaChmaWx0ZXJOYW1lcywgKGYpID0+IGBcbiAgICAgICAgIDxkZWZpbmVkTmFtZSBuYW1lPVwiX3hsbm0uX0ZpbHRlckRhdGFiYXNlXCIgaGlkZGVuPVwiMVwiIGxvY2FsU2hlZXRJZD1cIiR7Zi5sb2NhbFNoZWV0SWR9XCI+JHtFU0MocXVvdGVTaGVldChmLm5hbWUpKX0hJHtFU0MoZi5mcm9tKX06JHtFU0MoZi50byl9PC9kZWZpbmVkTmFtZT5gKX1cbiAgICAgICR7Zm9yZWFjaCh1c2VyTmFtZXMsIChmKSA9PiBgXG4gICAgICAgICA8ZGVmaW5lZE5hbWUgbmFtZT1cIiR7Zi5uYW1lfVwiIGhpZGRlbj1cIiR7Zi5oaWRkZW4gPyAxIDogMH1cIiAke2YubG9jYWxTaGVldElkICE9IG51bGwgPyBgbG9jYWxTaGVldElkPVwiJHtmLmxvY2FsU2hlZXRJZH1cImAgOiAnJ30+JHtFU0MoZi52YWx1ZSl9PC9kZWZpbmVkTmFtZT5gKX1cbiAgICA8L2RlZmluZWROYW1lcz5gIDogJyd9XG4gIDxjYWxjUHIgZnVsbENhbGNPbkxvYWQ9XCIxXCIgY2FsY0lkPVwiMTQ1NjIxXCIgLz5cbjwvd29ya2Jvb2s+YDtcblxuY29uc3QgV09SS1NIRUVUID0gKHtcbiAgICBmcm96ZW5Db2x1bW5zLFxuICAgIGZyb3plblJvd3MsXG4gICAgY29sdW1ucyxcbiAgICBkZWZhdWx0cyxcbiAgICBkYXRhLFxuICAgIGluZGV4LFxuICAgIG1lcmdlQ2VsbHMsXG4gICAgYXV0b0ZpbHRlcixcbiAgICBmaWx0ZXIsXG4gICAgc2hvd0dyaWRMaW5lcyxcbiAgICBoeXBlcmxpbmtzLFxuICAgIHZhbGlkYXRpb25zLFxuICAgIGRlZmF1bHRDZWxsU3R5bGVJZCxcbiAgICBydGwsXG4gICAgbGVnYWN5RHJhd2luZyxcbiAgICBkcmF3aW5nLFxuICAgIGxhc3RSb3csXG4gICAgbGFzdENvbFxufSkgPT4gYCR7WE1MSEVBRH1cbjx3b3Jrc2hlZXQgeG1sbnM9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvc3ByZWFkc2hlZXRtbC8yMDA2L21haW5cIiB4bWxuczptYz1cImh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9tYXJrdXAtY29tcGF0aWJpbGl0eS8yMDA2XCIgeG1sbnM6cj1cImh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9vZmZpY2VEb2N1bWVudC8yMDA2L3JlbGF0aW9uc2hpcHNcIiB4bWxuczp4MTRhYz1cImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vb2ZmaWNlL3NwcmVhZHNoZWV0bWwvMjAwOS85L2FjXCIgbWM6SWdub3JhYmxlPVwieDE0YWNcIj5cbiAgICR7bGFzdFJvdyAmJiBsYXN0Q29sID8gYDxkaW1lbnNpb24gcmVmPVwiQTE6JHtyZWYobGFzdFJvdyAtIDEsIGxhc3RDb2wgLSAxKX1cIiAvPmAgOiBcIlwifVxuXG4gICA8c2hlZXRWaWV3cz5cbiAgICAgPHNoZWV0VmlldyAkeyBydGwgPyAncmlnaHRUb0xlZnQ9XCIxXCInIDogJycgfSAke2luZGV4ID09PSAwID8gJ3RhYlNlbGVjdGVkPVwiMVwiJyA6ICcnfSB3b3JrYm9va1ZpZXdJZD1cIjBcIiAke3Nob3dHcmlkTGluZXMgPT09IGZhbHNlID8gJ3Nob3dHcmlkTGluZXM9XCIwXCInIDogJyd9PlxuICAgICAke2Zyb3plblJvd3MgfHwgZnJvemVuQ29sdW1ucyA/IGBcbiAgICAgICA8cGFuZSBzdGF0ZT1cImZyb3plblwiXG4gICAgICAgICAke2Zyb3plbkNvbHVtbnMgPyBgeFNwbGl0PVwiJHtmcm96ZW5Db2x1bW5zfVwiYCA6ICcnfVxuICAgICAgICAgJHtmcm96ZW5Sb3dzID8gYHlTcGxpdD1cIiR7ZnJvemVuUm93c31cImAgOiAnJ31cbiAgICAgICAgIHRvcExlZnRDZWxsPVwiJHtTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgKGZyb3plbkNvbHVtbnMgfHwgMCkpICsgKChmcm96ZW5Sb3dzIHx8IDApICsgMSl9XCJcbiAgICAgICAvPmAgOiAnJ31cbiAgICAgPC9zaGVldFZpZXc+XG4gICA8L3NoZWV0Vmlld3M+XG5cbiAgIDxzaGVldEZvcm1hdFByIHgxNGFjOmR5RGVzY2VudD1cIjAuMjVcIiAkeyFkZWZhdWx0cy5za2lwQ3VzdG9tSGVpZ2h0ID8gJ2N1c3RvbUhlaWdodD1cIjFcIicgOiAnJ30gZGVmYXVsdFJvd0hlaWdodD1cIiR7ZGVmYXVsdHMucm93SGVpZ2h0ID8gZGVmYXVsdHMucm93SGVpZ2h0ICogMC43NSA6IDE1fVwiXG4gICAgICR7ZGVmYXVsdHMuY29sdW1uV2lkdGggPyBgZGVmYXVsdENvbFdpZHRoPVwiJHt0b1dpZHRoKGRlZmF1bHRzLmNvbHVtbldpZHRoKX1cImAgOiAnJ30gLz5cblxuICAgJHtkZWZhdWx0Q2VsbFN0eWxlSWQgIT0gbnVsbCB8fCAoY29sdW1ucyAmJiBjb2x1bW5zLmxlbmd0aCA+IDApID8gYFxuICAgICA8Y29scz5cbiAgICAgICAkeyFjb2x1bW5zIHx8ICFjb2x1bW5zLmxlbmd0aCA/IGBcbiAgICAgICAgIDxjb2wgbWluPVwiMVwiIG1heD1cIjE2Mzg0XCIgc3R5bGU9XCIke2RlZmF1bHRDZWxsU3R5bGVJZH1cIlxuICAgICAgICAgICAgICAke2RlZmF1bHRzLmNvbHVtbldpZHRoID8gYHdpZHRoPVwiJHt0b1dpZHRoKGRlZmF1bHRzLmNvbHVtbldpZHRoKX1cImAgOiAnJ30gLz4gYCA6ICcnfVxuICAgICAgICR7Zm9yZWFjaChjb2x1bW5zLCAoY29sdW1uLCBjaSkgPT4ge1xuICAgICAgICAgY29uc3QgY29sdW1uSW5kZXggPSB0eXBlb2YgY29sdW1uLmluZGV4ID09PSBcIm51bWJlclwiID8gY29sdW1uLmluZGV4ICsgMSA6IChjaSArIDEpO1xuICAgICAgICAgaWYgKGNvbHVtbi53aWR0aCA9PT0gMCkge1xuICAgICAgICAgICByZXR1cm4gYDxjb2wgJHtkZWZhdWx0Q2VsbFN0eWxlSWQgIT0gbnVsbCA/IGBzdHlsZT1cIiR7ZGVmYXVsdENlbGxTdHlsZUlkfVwiYCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiJHtjb2x1bW5JbmRleH1cIiBtYXg9XCIke2NvbHVtbkluZGV4fVwiIGhpZGRlbj1cIjFcIiBjdXN0b21XaWR0aD1cIjFcIiAvPmA7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gYDxjb2wgJHtkZWZhdWx0Q2VsbFN0eWxlSWQgIT0gbnVsbCA/IGBzdHlsZT1cIiR7ZGVmYXVsdENlbGxTdHlsZUlkfVwiYCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIiR7Y29sdW1uSW5kZXh9XCIgbWF4PVwiJHtjb2x1bW5JbmRleH1cIiBjdXN0b21XaWR0aD1cIjFcIlxuICAgICAgICAgICAgICAgICAgICAgICR7Y29sdW1uLmF1dG9XaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICA/IGB3aWR0aD1cIiR7KChjb2x1bW4ud2lkdGggKiA3ICsgNSkgLyA3ICogMjU2KSAvIDI1Nn1cIiBiZXN0Rml0PVwiMVwiYFxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IGB3aWR0aD1cIiR7dG9XaWR0aChjb2x1bW4ud2lkdGgpfVwiYH0gLz5gO1xuICAgICAgIH0pfVxuICAgICA8L2NvbHM+YCA6ICcnfVxuXG4gICA8c2hlZXREYXRhPlxuICAgICAke2ZvcmVhY2goZGF0YSwgKHJvdywgcmkpID0+IHtcbiAgICAgICBjb25zdCByb3dJbmRleCA9IHR5cGVvZiByb3cuaW5kZXggPT09IFwibnVtYmVyXCIgPyByb3cuaW5kZXggKyAxIDogKHJpICsgMSk7XG4gICAgICAgcmV0dXJuIGBcbiAgICAgICAgIDxyb3cgcj1cIiR7cm93SW5kZXh9XCIgeDE0YWM6ZHlEZXNjZW50PVwiMC4yNVwiXG4gICAgICAgICAgICAgICR7cm93LmxldmVsID8gYG91dGxpbmVMZXZlbD1cIiR7cm93LmxldmVsfVwiYCA6ICcnfVxuICAgICAgICAgICAgICAke3Jvdy5oZWlnaHQgPT09IDAgPyAnaGlkZGVuPVwiMVwiJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiByb3cuaGVpZ2h0ID8gYGh0PVwiJHt0b0hlaWdodChyb3cuaGVpZ2h0KX1cIiBjdXN0b21IZWlnaHQ9XCIxXCJgIDogXCJcIn0+XG4gICAgICAgICAgICR7Zm9yZWFjaChyb3cuZGF0YSwgKGNlbGwpID0+IGBcbiAgICAgICAgICAgICA8YyByPVwiJHtjZWxsLnJlZn1cIiAke2NlbGwuc3R5bGUgPyBgcz1cIiR7Y2VsbC5zdHlsZX1cImAgOiAnJ30gJHtjZWxsLnR5cGUgPyBgdD1cIiR7Y2VsbC50eXBlfVwiYCA6ICcnfT5cbiAgICAgICAgICAgICAgICR7Y2VsbC5mb3JtdWxhICE9IG51bGwgPyB3cml0ZUZvcm11bGEoY2VsbC5mb3JtdWxhKSA6ICcnfVxuICAgICAgICAgICAgICAgJHtjZWxsLnZhbHVlICE9IG51bGwgPyBgPHY+JHtFU0MoY2VsbC52YWx1ZSl9PC92PmAgOiAnJ31cbiAgICAgICAgICAgICA8L2M+YCl9XG4gICAgICAgICA8L3Jvdz5cbiAgICAgICBgO30pfVxuICAgPC9zaGVldERhdGE+XG5cbiAgICR7YXV0b0ZpbHRlciA/IGA8YXV0b0ZpbHRlciByZWY9XCIke2F1dG9GaWx0ZXIuZnJvbX06JHthdXRvRmlsdGVyLnRvfVwiLz5gXG4gICAgICAgICAgICAgICAgOiBmaWx0ZXIgPyBzcHJlYWRzaGVldEZpbHRlcnMoZmlsdGVyKSA6ICcnfVxuXG4gICAke21lcmdlQ2VsbHMubGVuZ3RoID8gYFxuICAgICA8bWVyZ2VDZWxscyBjb3VudD1cIiR7bWVyZ2VDZWxscy5sZW5ndGh9XCI+XG4gICAgICAgJHtmb3JlYWNoKG1lcmdlQ2VsbHMsIChyZWYpID0+IGA8bWVyZ2VDZWxsIHJlZj1cIiR7cmVmfVwiLz5gKX1cbiAgICAgPC9tZXJnZUNlbGxzPmAgOiAnJ31cblxuICAgJHt2YWxpZGF0aW9ucy5sZW5ndGggPyBgXG4gICAgIDxkYXRhVmFsaWRhdGlvbnM+XG4gICAgICAgJHtmb3JlYWNoKHZhbGlkYXRpb25zLCAodmFsKSA9PiBgXG4gICAgICAgICA8ZGF0YVZhbGlkYXRpb24gc3FyZWY9XCIke3ZhbC5zcXJlZi5qb2luKFwiIFwiKX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dFcnJvck1lc3NhZ2U9XCIke3ZhbC5zaG93RXJyb3JNZXNzYWdlfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIiR7RVNDKHZhbC50eXBlKX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICR7IHZhbC50eXBlICE9PSBcImxpc3RcIiA/IGBvcGVyYXRvcj1cIiR7RVNDKHZhbC5vcGVyYXRvcil9XCJgIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgYWxsb3dCbGFuaz1cIiR7dmFsLmFsbG93Qmxhbmt9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBzaG93RHJvcERvd249XCIke3ZhbC5zaG93RHJvcERvd259XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAke3ZhbC5lcnJvciA/IGBlcnJvcj1cIiR7RVNDKHZhbC5lcnJvcil9XCJgIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgJHt2YWwuZXJyb3JUaXRsZSA/IGBlcnJvclRpdGxlPVwiJHtFU0ModmFsLmVycm9yVGl0bGUpfVwiYCA6ICcnfT5cbiAgICAgICAgICAgJHt2YWwuZm9ybXVsYTEgPyBgPGZvcm11bGExPiR7RVNDKHZhbC5mb3JtdWxhMSl9PC9mb3JtdWxhMT5gIDogJyd9XG4gICAgICAgICAgICR7dmFsLmZvcm11bGEyID8gYDxmb3JtdWxhMj4ke0VTQyh2YWwuZm9ybXVsYTIpfTwvZm9ybXVsYTI+YCA6ICcnfVxuICAgICAgICAgPC9kYXRhVmFsaWRhdGlvbj5gKX1cbiAgICAgPC9kYXRhVmFsaWRhdGlvbnM+YCA6ICcnfVxuXG4gICAke2h5cGVybGlua3MubGVuZ3RoID8gYFxuICAgICA8aHlwZXJsaW5rcz5cbiAgICAgICAke2ZvcmVhY2goaHlwZXJsaW5rcywgKGxpbmspID0+IGBcbiAgICAgICAgIDxoeXBlcmxpbmsgcmVmPVwiJHtsaW5rLnJlZn1cIiByOmlkPVwiJHtsaW5rLnJJZH1cIi8+YCl9XG4gICAgIDwvaHlwZXJsaW5rcz5gIDogJyd9XG5cbiAgIDxwYWdlTWFyZ2lucyBsZWZ0PVwiMC43XCIgcmlnaHQ9XCIwLjdcIiB0b3A9XCIwLjc1XCIgYm90dG9tPVwiMC43NVwiIGhlYWRlcj1cIjAuM1wiIGZvb3Rlcj1cIjAuM1wiIC8+XG4gICAke2RyYXdpbmcgPyBgPGRyYXdpbmcgcjppZD1cIiR7ZHJhd2luZ31cIi8+YCA6ICcnfVxuICAgJHtsZWdhY3lEcmF3aW5nID8gYDxsZWdhY3lEcmF3aW5nIHI6aWQ9XCIke2xlZ2FjeURyYXdpbmd9XCIvPmAgOiAnJ31cbjwvd29ya3NoZWV0PmA7XG5cbmNvbnN0IFdPUktCT09LX1JFTFMgPSAoeyBjb3VudCB9KSA9PiBgJHtYTUxIRUFEfVxuPFJlbGF0aW9uc2hpcHMgeG1sbnM9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L3JlbGF0aW9uc2hpcHNcIj5cbiAgJHtyZXBlYXQoY291bnQsIChpZHgpID0+IGBcbiAgICA8UmVsYXRpb25zaGlwIElkPVwicklkJHtpZHggKyAxfVwiIFR5cGU9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9yZWxhdGlvbnNoaXBzL3dvcmtzaGVldFwiIFRhcmdldD1cIndvcmtzaGVldHMvc2hlZXQke2lkeCArIDF9LnhtbFwiIC8+YCl9XG4gIDxSZWxhdGlvbnNoaXAgSWQ9XCJySWQke2NvdW50ICsgMX1cIiBUeXBlPVwiaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy9zdHlsZXNcIiBUYXJnZXQ9XCJzdHlsZXMueG1sXCIgLz5cbiAgPFJlbGF0aW9uc2hpcCBJZD1cInJJZCR7Y291bnQgKyAyfVwiIFR5cGU9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9yZWxhdGlvbnNoaXBzL3NoYXJlZFN0cmluZ3NcIiBUYXJnZXQ9XCJzaGFyZWRTdHJpbmdzLnhtbFwiIC8+XG48L1JlbGF0aW9uc2hpcHM+YDtcblxuY29uc3QgV09SS1NIRUVUX1JFTFMgPSAoeyBoeXBlcmxpbmtzLCBjb21tZW50cywgc2hlZXRJbmRleCwgZHJhd2luZ3MgfSkgPT4gYCR7WE1MSEVBRH1cbjxSZWxhdGlvbnNoaXBzIHhtbG5zPVwiaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL3BhY2thZ2UvMjAwNi9yZWxhdGlvbnNoaXBzXCI+XG4gICR7Zm9yZWFjaChoeXBlcmxpbmtzLCAobGluaykgPT4gYFxuICAgIDxSZWxhdGlvbnNoaXAgSWQ9XCIke2xpbmsucklkfVwiIFR5cGU9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9yZWxhdGlvbnNoaXBzL2h5cGVybGlua1wiIFRhcmdldD1cIiR7RVNDKGxpbmsudGFyZ2V0KX1cIiBUYXJnZXRNb2RlPVwiRXh0ZXJuYWxcIiAvPmApfVxuICAkeyFjb21tZW50cy5sZW5ndGggPyAnJyA6IGBcbiAgICA8UmVsYXRpb25zaGlwIElkPVwiY29tbWVudCR7c2hlZXRJbmRleH1cIiBUeXBlPVwiaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy9jb21tZW50c1wiIFRhcmdldD1cIi4uL2NvbW1lbnRzJHtzaGVldEluZGV4fS54bWxcIi8+XG4gICAgPFJlbGF0aW9uc2hpcCBJZD1cInZtbCR7c2hlZXRJbmRleH1cIiBUeXBlPVwiaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy92bWxEcmF3aW5nXCIgVGFyZ2V0PVwiLi4vZHJhd2luZ3Mvdm1sRHJhd2luZyR7c2hlZXRJbmRleH0udm1sXCIvPmB9XG4gICR7IWRyYXdpbmdzLmxlbmd0aCA/ICcnIDogYFxuICAgIDxSZWxhdGlvbnNoaXAgSWQ9XCJkcncke3NoZWV0SW5kZXh9XCIgVHlwZT1cImh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9vZmZpY2VEb2N1bWVudC8yMDA2L3JlbGF0aW9uc2hpcHMvZHJhd2luZ1wiIFRhcmdldD1cIi4uL2RyYXdpbmdzL2RyYXdpbmcke3NoZWV0SW5kZXh9LnhtbFwiLz5gfVxuPC9SZWxhdGlvbnNoaXBzPmA7XG5cbmNvbnN0IENPTU1FTlRTX1hNTCA9ICh7IGNvbW1lbnRzIH0pID0+IGAke1hNTEhFQUR9XG48Y29tbWVudHMgeG1sbnM9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvc3ByZWFkc2hlZXRtbC8yMDA2L21haW5cIj5cbiAgPGF1dGhvcnM+XG4gICAgPGF1dGhvcj48L2F1dGhvcj5cbiAgPC9hdXRob3JzPlxuICA8Y29tbWVudExpc3Q+XG4gICAgJHtmb3JlYWNoKGNvbW1lbnRzLCBjb21tZW50ID0+IGBcbiAgICAgIDxjb21tZW50IHJlZj1cIiR7Y29tbWVudC5yZWZ9XCIgYXV0aG9ySWQ9XCIwXCI+XG4gICAgICAgIDx0ZXh0PlxuICAgICAgICAgIDxyPlxuICAgICAgICAgICAgPHJQcj5cbiAgICAgICAgICAgICAgPHN6IHZhbD1cIjhcIi8+XG4gICAgICAgICAgICAgIDxjb2xvciBpbmRleGVkPVwiODFcIi8+XG4gICAgICAgICAgICAgIDxyRm9udCB2YWw9XCJUYWhvbWFcIi8+XG4gICAgICAgICAgICAgIDxjaGFyc2V0IHZhbD1cIjFcIi8+XG4gICAgICAgICAgICA8L3JQcj5cbiAgICAgICAgICAgIDx0PiR7RVNDKGNvbW1lbnQudGV4dCl9PC90PlxuICAgICAgICAgIDwvcj5cbiAgICAgICAgPC90ZXh0PlxuICAgICAgPC9jb21tZW50PmApfVxuICA8L2NvbW1lbnRMaXN0PlxuPC9jb21tZW50cz5gO1xuXG5jb25zdCBMRUdBQ1lfRFJBV0lORyA9ICh7IGNvbW1lbnRzIH0pID0+IGBcXFxuPHhtbCB4bWxuczp2PVwidXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp2bWxcIlxuICAgICB4bWxuczpvPVwidXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTpvZmZpY2U6b2ZmaWNlXCJcbiAgICAgeG1sbnM6eD1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOmV4Y2VsXCI+XG4gIDx2OnNoYXBldHlwZSBjb29yZHNpemU9XCIyMTYwMCwyMTYwMFwiIGlkPVwiX3gwMDAwX3QyMDJcIiBwYXRoPVwibSxsLDIxNjAwcjIxNjAwLGwyMTYwMCx4ZVwiPlxuICAgIDx2OnN0cm9rZSBqb2luc3R5bGU9XCJtaXRlclwiLz5cbiAgICA8djpwYXRoIGdyYWRpZW50c2hhcGVvaz1cInRcIiBvOmNvbm5lY3R0eXBlPVwicmVjdFwiLz5cbiAgPC92OnNoYXBldHlwZT5cbiAgJHtmb3JlYWNoKGNvbW1lbnRzLCBjb21tZW50ID0+IGBcbiAgICA8djpzaGFwZSB0eXBlPVwiI194MDAwMF90MjAyXCIgc3R5bGU9XCJ2aXNpYmlsaXR5OiBoaWRkZW5cIiBmaWxsY29sb3I9XCIjZmZmZmUxXCIgbzppbnNldG1vZGU9XCJhdXRvXCI+XG4gICAgICA8djpzaGFkb3cgb249XCJ0XCIgY29sb3I9XCJibGFja1wiIG9ic2N1cmVkPVwidFwiLz5cbiAgICAgIDx4OkNsaWVudERhdGEgT2JqZWN0VHlwZT1cIk5vdGVcIj5cbiAgICAgICAgPHg6TW92ZVdpdGhDZWxscy8+XG4gICAgICAgIDx4OlNpemVXaXRoQ2VsbHMvPlxuICAgICAgICA8eDpBbmNob3I+JHtjb21tZW50LmFuY2hvcn08L3g6QW5jaG9yPlxuICAgICAgICA8eDpBdXRvRmlsbD5GYWxzZTwveDpBdXRvRmlsbD5cbiAgICAgICAgPHg6Um93PiR7Y29tbWVudC5yb3d9PC94OlJvdz5cbiAgICAgICAgPHg6Q29sdW1uPiR7Y29tbWVudC5jb2x9PC94OkNvbHVtbj5cbiAgICAgIDwveDpDbGllbnREYXRhPlxuICAgIDwvdjpzaGFwZT5gKX1cbjwveG1sPmA7XG5cbmNvbnN0IERSQVdJTkdTX1hNTCA9IChkcmF3aW5ncykgPT4gYCR7WE1MSEVBRH1cbjx4ZHI6d3NEciB4bWxuczp4ZHI9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvZHJhd2luZ21sLzIwMDYvc3ByZWFkc2hlZXREcmF3aW5nXCJcbiAgICAgICAgICB4bWxuczphPVwiaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL2RyYXdpbmdtbC8yMDA2L21haW5cIlxuICAgICAgICAgIHhtbG5zOnI9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9yZWxhdGlvbnNoaXBzXCI+XG4gICR7Zm9yZWFjaChkcmF3aW5ncywgKGRyYXdpbmcsIGluZGV4KSA9PiBgXG4gICAgPHhkcjpvbmVDZWxsQW5jaG9yIGVkaXRBcz1cIm9uZUNlbGxcIj5cbiAgICAgIDx4ZHI6ZnJvbT5cbiAgICAgICAgPHhkcjpjb2w+JHtkcmF3aW5nLmNvbH08L3hkcjpjb2w+XG4gICAgICAgIDx4ZHI6Y29sT2ZmPiR7ZHJhd2luZy5jb2xPZmZzZXR9PC94ZHI6Y29sT2ZmPlxuICAgICAgICA8eGRyOnJvdz4ke2RyYXdpbmcucm93fTwveGRyOnJvdz5cbiAgICAgICAgPHhkcjpyb3dPZmY+JHtkcmF3aW5nLnJvd09mZnNldH08L3hkcjpyb3dPZmY+XG4gICAgICA8L3hkcjpmcm9tPlxuICAgICAgPHhkcjpleHQgY3g9XCIke2RyYXdpbmcud2lkdGh9XCIgY3k9XCIke2RyYXdpbmcuaGVpZ2h0fVwiIC8+XG4gICAgICA8eGRyOnBpYz5cbiAgICAgICAgPHhkcjpudlBpY1ByPlxuICAgICAgICAgIDx4ZHI6Y052UHIgaWQ9XCIke2luZGV4ICsgMX1cIiBuYW1lPVwiUGljdHVyZSAke2luZGV4ICsgMX1cIi8+XG4gICAgICAgICAgPHhkcjpjTnZQaWNQci8+XG4gICAgICAgIDwveGRyOm52UGljUHI+XG4gICAgICAgIDx4ZHI6YmxpcEZpbGw+XG4gICAgICAgICAgPGE6YmxpcCByOmVtYmVkPVwiJHtkcmF3aW5nLmltYWdlSWR9XCIvPlxuICAgICAgICAgIDxhOnN0cmV0Y2g+XG4gICAgICAgICAgICA8YTpmaWxsUmVjdC8+XG4gICAgICAgICAgPC9hOnN0cmV0Y2g+XG4gICAgICAgIDwveGRyOmJsaXBGaWxsPlxuICAgICAgICA8eGRyOnNwUHI+XG4gICAgICAgICAgPGE6cHJzdEdlb20gcHJzdD1cInJlY3RcIj5cbiAgICAgICAgICAgIDxhOmF2THN0Lz5cbiAgICAgICAgICA8L2E6cHJzdEdlb20+XG4gICAgICAgIDwveGRyOnNwUHI+XG4gICAgICA8L3hkcjpwaWM+XG4gICAgICA8eGRyOmNsaWVudERhdGEvPlxuICAgIDwveGRyOm9uZUNlbGxBbmNob3I+YCl9XG48L3hkcjp3c0RyPmA7XG5cbmNvbnN0IERSQVdJTkdTX1JFTFNfWE1MID0gKHJlbHMpID0+IGAke1hNTEhFQUR9XG48UmVsYXRpb25zaGlwcyB4bWxucz1cImh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9wYWNrYWdlLzIwMDYvcmVsYXRpb25zaGlwc1wiPlxuICAke2ZvcmVhY2gocmVscywgcmVsID0+IGBcbiAgICA8UmVsYXRpb25zaGlwIElkPVwiJHtyZWwucklkfVwiIFR5cGU9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9yZWxhdGlvbnNoaXBzL2ltYWdlXCIgVGFyZ2V0PVwiJHtyZWwudGFyZ2V0fVwiLz5gKX1cbjwvUmVsYXRpb25zaGlwcz5gO1xuXG5jb25zdCBTSEFSRURfU1RSSU5HUyA9ICh7IGNvdW50LCB1bmlxdWVDb3VudCwgaW5kZXhlcyB9KSA9PiBgJHtYTUxIRUFEfVxuPHNzdCB4bWxucz1cImh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9zcHJlYWRzaGVldG1sLzIwMDYvbWFpblwiIGNvdW50PVwiJHtjb3VudH1cIiB1bmlxdWVDb3VudD1cIiR7dW5pcXVlQ291bnR9XCI+XG4gICR7Zm9yZWFjaChPYmplY3Qua2V5cyhpbmRleGVzKSwgKGluZGV4KSA9PiBgXG4gICAgPHNpPjx0IHhtbDpzcGFjZT1cInByZXNlcnZlXCI+JHtFU0MoaW5kZXguc3Vic3RyaW5nKDEpKX08L3Q+PC9zaT5gKX1cbjwvc3N0PmA7XG5cbmNvbnN0IFNUWUxFUyA9ICh7XG4gICAgZm9ybWF0cyxcbiAgICBmb250cyxcbiAgICBmaWxscyxcbiAgICBib3JkZXJzLFxuICAgIHN0eWxlc1xufSkgPT4gYCR7WE1MSEVBRH1cbjxzdHlsZVNoZWV0XG4gICAgeG1sbnM9XCJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvc3ByZWFkc2hlZXRtbC8yMDA2L21haW5cIlxuICAgIHhtbG5zOm1jPVwiaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL21hcmt1cC1jb21wYXRpYmlsaXR5LzIwMDZcIlxuICAgIG1jOklnbm9yYWJsZT1cIngxNGFjXCJcbiAgICB4bWxuczp4MTRhYz1cImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vb2ZmaWNlL3NwcmVhZHNoZWV0bWwvMjAwOS85L2FjXCI+XG4gIDxudW1GbXRzIGNvdW50PVwiJHtmb3JtYXRzLmxlbmd0aH1cIj5cbiAgJHtmb3JlYWNoKGZvcm1hdHMsIChmb3JtYXQsIGZpKSA9PiBgXG4gICAgPG51bUZtdCBmb3JtYXRDb2RlPVwiJHtFU0MoZm9ybWF0LmZvcm1hdCl9XCIgbnVtRm10SWQ9XCIkezE2NSArIGZpfVwiIC8+YCl9XG4gIDwvbnVtRm10cz5cbiAgPGZvbnRzIGNvdW50PVwiJHtmb250cy5sZW5ndGggKyAxfVwiIHgxNGFjOmtub3duRm9udHM9XCIxXCI+XG4gICAgPGZvbnQ+XG4gICAgICAgPHN6IHZhbD1cIjExXCIgLz5cbiAgICAgICA8Y29sb3IgdGhlbWU9XCIxXCIgLz5cbiAgICAgICA8bmFtZSB2YWw9XCJDYWxpYnJpXCIgLz5cbiAgICAgICA8ZmFtaWx5IHZhbD1cIjJcIiAvPlxuICAgICAgIDxzY2hlbWUgdmFsPVwibWlub3JcIiAvPlxuICAgIDwvZm9udD5cbiAgICAke2ZvcmVhY2goZm9udHMsIChmb250KSA9PiBgXG4gICAgPGZvbnQ+XG4gICAgICAke2ZvbnQuYm9sZCA/ICc8Yi8+JyA6ICcnfVxuICAgICAgJHtmb250Lml0YWxpYyA/ICc8aS8+JyA6ICcnfVxuICAgICAgJHtmb250LnVuZGVybGluZSA/ICc8dS8+JyA6ICcnfVxuICAgICAgPHN6IHZhbD1cIiR7Zm9udC5mb250U2l6ZSB8fCAxMX1cIiAvPlxuICAgICAgJHtmb250LmNvbG9yID8gYDxjb2xvciByZ2I9XCIke0VTQyhmb250LmNvbG9yKX1cIiAvPmAgOiAnPGNvbG9yIHRoZW1lPVwiMVwiIC8+J31cbiAgICAgICR7Zm9udC5mb250RmFtaWx5ID8gYFxuICAgICAgICA8bmFtZSB2YWw9XCIke0VTQyhmb250LmZvbnRGYW1pbHkpfVwiIC8+XG4gICAgICAgIDxmYW1pbHkgdmFsPVwiMlwiIC8+XG4gICAgICBgIDogYFxuICAgICAgICA8bmFtZSB2YWw9XCJDYWxpYnJpXCIgLz5cbiAgICAgICAgPGZhbWlseSB2YWw9XCIyXCIgLz5cbiAgICAgICAgPHNjaGVtZSB2YWw9XCJtaW5vclwiIC8+XG4gICAgICBgfVxuICAgIDwvZm9udD5gKX1cbiAgPC9mb250cz5cbiAgPGZpbGxzIGNvdW50PVwiJHtmaWxscy5sZW5ndGggKyAyfVwiPlxuICAgICAgPGZpbGw+PHBhdHRlcm5GaWxsIHBhdHRlcm5UeXBlPVwibm9uZVwiLz48L2ZpbGw+XG4gICAgICA8ZmlsbD48cGF0dGVybkZpbGwgcGF0dGVyblR5cGU9XCJncmF5MTI1XCIvPjwvZmlsbD5cbiAgICAke2ZvcmVhY2goZmlsbHMsIChmaWxsKSA9PiBgXG4gICAgICAke2ZpbGwuYmFja2dyb3VuZCA/IGBcbiAgICAgICAgPGZpbGw+XG4gICAgICAgICAgPHBhdHRlcm5GaWxsIHBhdHRlcm5UeXBlPVwic29saWRcIj5cbiAgICAgICAgICAgICAgPGZnQ29sb3IgcmdiPVwiJHtFU0MoZmlsbC5iYWNrZ3JvdW5kKX1cIi8+XG4gICAgICAgICAgPC9wYXR0ZXJuRmlsbD5cbiAgICAgICAgPC9maWxsPlxuICAgICAgYCA6ICcnfWApfVxuICA8L2ZpbGxzPlxuICA8Ym9yZGVycyBjb3VudD1cIiR7Ym9yZGVycy5sZW5ndGggKyAxfVwiPlxuICAgIDxib3JkZXI+PGxlZnQvPjxyaWdodC8+PHRvcC8+PGJvdHRvbS8+PGRpYWdvbmFsLz48L2JvcmRlcj5cbiAgICAke2ZvcmVhY2goYm9yZGVycywgYm9yZGVyVGVtcGxhdGUpfVxuICA8L2JvcmRlcnM+XG4gIDxjZWxsU3R5bGVYZnMgY291bnQ9XCIxXCI+XG4gICAgPHhmIGJvcmRlcklkPVwiMFwiIGZpbGxJZD1cIjBcIiBmb250SWQ9XCIwXCIgLz5cbiAgPC9jZWxsU3R5bGVYZnM+XG4gIDxjZWxsWGZzIGNvdW50PVwiJHtzdHlsZXMubGVuZ3RoICsgMX1cIj5cbiAgICA8eGYgbnVtRm10SWQ9XCIwXCIgZm9udElkPVwiMFwiIGZpbGxJZD1cIjBcIiBib3JkZXJJZD1cIjBcIiB4ZklkPVwiMFwiIC8+XG4gICAgJHtmb3JlYWNoKHN0eWxlcywgKHN0eWxlKSA9PiBgXG4gICAgICA8eGYgeGZJZD1cIjBcIlxuICAgICAgICAgICR7c3R5bGUuZm9udElkID8gYGZvbnRJZD1cIiR7c3R5bGUuZm9udElkfVwiIGFwcGx5Rm9udD1cIjFcImAgOiAnJ31cbiAgICAgICAgICAke3N0eWxlLmZpbGxJZCA/IGBmaWxsSWQ9XCIke3N0eWxlLmZpbGxJZH1cIiBhcHBseUZpbGw9XCIxXCJgIDogJyd9XG4gICAgICAgICAgJHtzdHlsZS5udW1GbXRJZCA/IGBudW1GbXRJZD1cIiR7c3R5bGUubnVtRm10SWR9XCIgYXBwbHlOdW1iZXJGb3JtYXQ9XCIxXCJgIDogJyd9XG4gICAgICAgICAgJHtzdHlsZS50ZXh0QWxpZ24gfHwgc3R5bGUudmVydGljYWxBbGlnbiB8fCBzdHlsZS53cmFwID8gJ2FwcGx5QWxpZ25tZW50PVwiMVwiJyA6ICcnfVxuICAgICAgICAgICR7c3R5bGUuYm9yZGVySWQgPyBgYm9yZGVySWQ9XCIke3N0eWxlLmJvcmRlcklkfVwiIGFwcGx5Qm9yZGVyPVwiMVwiYCA6ICcnfT5cbiAgICAgICAgJHtzdHlsZS50ZXh0QWxpZ24gfHwgc3R5bGUudmVydGljYWxBbGlnbiB8fCBzdHlsZS53cmFwID8gYFxuICAgICAgICA8YWxpZ25tZW50XG4gICAgICAgICAgJHtzdHlsZS50ZXh0QWxpZ24gPyBgaG9yaXpvbnRhbD1cIiR7RVNDKHN0eWxlLnRleHRBbGlnbil9XCJgIDogJyd9XG4gICAgICAgICAgJHtzdHlsZS52ZXJ0aWNhbEFsaWduID8gYHZlcnRpY2FsPVwiJHtFU0Moc3R5bGUudmVydGljYWxBbGlnbil9XCJgIDogJyd9XG4gICAgICAgICAgJHtzdHlsZS5pbmRlbnQgPyBgaW5kZW50PVwiJHtFU0Moc3R5bGUuaW5kZW50KX1cImAgOiAnJ31cbiAgICAgICAgICAke3N0eWxlLndyYXAgPyAnd3JhcFRleHQ9XCIxXCInIDogJyd9IC8+XG4gICAgICAgIGAgOiAnJ31cbiAgICAgIDwveGY+XG4gICAgYCl9XG4gIDwvY2VsbFhmcz5cbiAgPGNlbGxTdHlsZXMgY291bnQ9XCIxXCI+XG4gICAgPGNlbGxTdHlsZSBuYW1lPVwiTm9ybWFsXCIgeGZJZD1cIjBcIiBidWlsdGluSWQ9XCIwXCIvPlxuICA8L2NlbGxTdHlsZXM+XG4gIDxkeGZzIGNvdW50PVwiMFwiIC8+XG4gIDx0YWJsZVN0eWxlcyBjb3VudD1cIjBcIiBkZWZhdWx0VGFibGVTdHlsZT1cIlRhYmxlU3R5bGVNZWRpdW0yXCIgZGVmYXVsdFBpdm90U3R5bGU9XCJQaXZvdFN0eWxlTWVkaXVtOVwiIC8+XG48L3N0eWxlU2hlZXQ+YDtcblxuZnVuY3Rpb24gd3JpdGVGb3JtdWxhKGZvcm11bGEpIHtcbiAgICBpZiAodHlwZW9mIGZvcm11bGEgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gYDxmPiR7RVNDKGZvcm11bGEpfTwvZj5gO1xuICAgIH1cbiAgICAvLyBhcnJheSBmb3JtdWxhc1xuICAgIHJldHVybiBgPGYgdD1cImFycmF5XCIgcmVmPVwiJHtmb3JtdWxhLnJlZn1cIj4ke0VTQyhmb3JtdWxhLnNyYyl9PC9mPmA7XG59XG5cbmZ1bmN0aW9uIG51bUNoYXIoY29sSW5kZXgpIHtcbiAgIGNvbnN0IGxldHRlciA9IE1hdGguZmxvb3IoY29sSW5kZXggLyAyNikgLSAxO1xuXG4gICByZXR1cm4gKGxldHRlciA+PSAwID8gbnVtQ2hhcihsZXR0ZXIpIDogXCJcIikgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgKGNvbEluZGV4ICUgMjYpKTtcbn1cblxuZnVuY3Rpb24gcmVmKHJvd0luZGV4LCBjb2xJbmRleCkge1xuICAgIHJldHVybiBudW1DaGFyKGNvbEluZGV4KSArIChyb3dJbmRleCArIDEpO1xufVxuXG5mdW5jdGlvbiAkcmVmKHJvd0luZGV4LCBjb2xJbmRleCkge1xuICAgIHJldHVybiBcIiRcIiArIG51bUNoYXIoY29sSW5kZXgpICsgXCIkXCIgKyAocm93SW5kZXggKyAxKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVyUm93SW5kZXgob3B0aW9ucykge1xuICAgIGNvbnN0IGZyb3plblJvd3MgPSBvcHRpb25zLmZyb3plblJvd3MgfHwgKG9wdGlvbnMuZnJlZXplUGFuZSB8fCB7fSkucm93U3BsaXQgfHwgMTtcbiAgICByZXR1cm4gZnJvemVuUm93cyAtIDE7XG59XG5cbmZ1bmN0aW9uIHRvV2lkdGgocHgpIHtcbiAgICBjb25zdCBtYXhpbXVtRGlnaXRXaWR0aCA9IDc7XG4gICAgcmV0dXJuIChweCAvIG1heGltdW1EaWdpdFdpZHRoKSAtIChNYXRoLmZsb29yKDEyOCAvIG1heGltdW1EaWdpdFdpZHRoKSAvIDI1Nik7XG59XG5cbmZ1bmN0aW9uIHRvSGVpZ2h0KHB4KSB7XG4gICAgcmV0dXJuIHB4ICogMC43NTtcbn1cblxuZnVuY3Rpb24gc3RyaXBGdW5ueUNoYXJzKHZhbHVlKSB7XG4gICAgcmV0dXJuIFN0cmluZyh2YWx1ZSlcbiAgICAgICAgLnJlcGxhY2UoL1tcXHgwMC1cXHgwOVxceDBCXFx4MENcXHgwRS1cXHgxRl0vZywgXCJcIikgLy8gbGVhdmUgQ1JMRiBpblxuICAgICAgICAucmVwbGFjZSgvXFxyP1xcbi9nLCBcIlxcclxcblwiKTsgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIExGIGlzIHByZWNlZGVkIGJ5IENSXG59XG5cbmNsYXNzIFdvcmtzaGVldCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zLCBzaGFyZWRTdHJpbmdzLCBzdHlsZXMsIGJvcmRlcnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5fc3RyaW5ncyA9IHNoYXJlZFN0cmluZ3M7XG4gICAgICAgIHRoaXMuX3N0eWxlcyA9IHN0eWxlcztcbiAgICAgICAgdGhpcy5fYm9yZGVycyA9IGJvcmRlcnM7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRpb25zID0ge307XG4gICAgICAgIHRoaXMuX2NvbW1lbnRzID0gW107XG4gICAgICAgIHRoaXMuX2RyYXdpbmdzID0gb3B0aW9ucy5kcmF3aW5ncyB8fCBbXTtcbiAgICAgICAgdGhpcy5faHlwZXJsaW5rcyA9ICh0aGlzLm9wdGlvbnMuaHlwZXJsaW5rcyB8fCBbXSkubWFwKFxuICAgICAgICAgICAgKGxpbmssIGkpID0+IE9iamVjdC5hc3NpZ24oe30sIGxpbmssIHsgcklkOiBgbGluayR7aX1gIH0pKTtcbiAgICB9XG5cbiAgICByZWxzVG9YTUwoKSB7XG4gICAgICAgIGNvbnN0IGh5cGVybGlua3MgPSB0aGlzLl9oeXBlcmxpbmtzO1xuICAgICAgICBjb25zdCBjb21tZW50cyA9IHRoaXMuX2NvbW1lbnRzO1xuICAgICAgICBjb25zdCBkcmF3aW5ncyA9IHRoaXMuX2RyYXdpbmdzO1xuXG4gICAgICAgIGlmIChoeXBlcmxpbmtzLmxlbmd0aCB8fCBjb21tZW50cy5sZW5ndGggfHwgZHJhd2luZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gV09SS1NIRUVUX1JFTFMoe1xuICAgICAgICAgICAgICAgIGh5cGVybGlua3MgOiBoeXBlcmxpbmtzLFxuICAgICAgICAgICAgICAgIGNvbW1lbnRzICAgOiBjb21tZW50cyxcbiAgICAgICAgICAgICAgICBzaGVldEluZGV4IDogdGhpcy5vcHRpb25zLnNoZWV0SW5kZXgsXG4gICAgICAgICAgICAgICAgZHJhd2luZ3MgICA6IGRyYXdpbmdzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvWE1MKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IG1lcmdlQ2VsbHMgPSB0aGlzLm9wdGlvbnMubWVyZ2VkQ2VsbHMgfHwgW107XG4gICAgICAgIGNvbnN0IHJvd3MgPSB0aGlzLm9wdGlvbnMucm93cyB8fCBbXTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGluZmxhdGUocm93cywgbWVyZ2VDZWxscyk7XG5cbiAgICAgICAgdGhpcy5fcmVhZENlbGxzKGRhdGEpO1xuXG4gICAgICAgIGxldCBhdXRvRmlsdGVyID0gdGhpcy5vcHRpb25zLmZpbHRlcjtcbiAgICAgICAgbGV0IGZpbHRlcjtcbiAgICAgICAgaWYgKGF1dG9GaWx0ZXIgJiYgKHR5cGVvZiBhdXRvRmlsdGVyLmZyb20gPT09IFwibnVtYmVyXCIpICYmICh0eXBlb2YgYXV0b0ZpbHRlci50byA9PT0gXCJudW1iZXJcIikpIHtcbiAgICAgICAgICAgIC8vIEdyaWQgZW5hYmxlcyBhdXRvIGZpbHRlclxuICAgICAgICAgICAgYXV0b0ZpbHRlciA9IHtcbiAgICAgICAgICAgICAgICBmcm9tOiByZWYoZmlsdGVyUm93SW5kZXgodGhpcy5vcHRpb25zKSwgYXV0b0ZpbHRlci5mcm9tKSxcbiAgICAgICAgICAgICAgICB0bzogcmVmKGZpbHRlclJvd0luZGV4KHRoaXMub3B0aW9ucyksIGF1dG9GaWx0ZXIudG8pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGF1dG9GaWx0ZXIgJiYgYXV0b0ZpbHRlci5yZWYgJiYgYXV0b0ZpbHRlci5jb2x1bW5zKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIHByb2JhYmx5IGZyb20gdGhlIFNwcmVhZHNoZWV0XG4gICAgICAgICAgICBmaWx0ZXIgPSBhdXRvRmlsdGVyO1xuICAgICAgICAgICAgYXV0b0ZpbHRlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWxpZGF0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuX3ZhbGlkYXRpb25zKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX3ZhbGlkYXRpb25zLCBpKSkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRpb25zLnB1c2godGhpcy5fdmFsaWRhdGlvbnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlZmF1bHRDZWxsU3R5bGVJZCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVmYXVsdENlbGxTdHlsZSkge1xuICAgICAgICAgICAgZGVmYXVsdENlbGxTdHlsZUlkID0gdGhpcy5fbG9va3VwU3R5bGUodGhpcy5vcHRpb25zLmRlZmF1bHRDZWxsU3R5bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZnJlZXplUGFuZSA9IHRoaXMub3B0aW9ucy5mcmVlemVQYW5lIHx8IHt9O1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMub3B0aW9ucy5kZWZhdWx0cyB8fCB7fTtcbiAgICAgICAgY29uc3QgbGFzdFJvdyA9IHRoaXMub3B0aW9ucy5yb3dzID8gdGhpcy5fZ2V0TGFzdFJvdygpIDogMTtcbiAgICAgICAgY29uc3QgbGFzdENvbCA9IHRoaXMub3B0aW9ucy5yb3dzID8gdGhpcy5fZ2V0TGFzdENvbCgpIDogMTtcblxuICAgICAgICByZXR1cm4gV09SS1NIRUVUKHtcbiAgICAgICAgICAgIGZyb3plbkNvbHVtbnM6IHRoaXMub3B0aW9ucy5mcm96ZW5Db2x1bW5zIHx8IGZyZWV6ZVBhbmUuY29sU3BsaXQsXG4gICAgICAgICAgICBmcm96ZW5Sb3dzOiB0aGlzLm9wdGlvbnMuZnJvemVuUm93cyB8fCBmcmVlemVQYW5lLnJvd1NwbGl0LFxuICAgICAgICAgICAgY29sdW1uczogdGhpcy5vcHRpb25zLmNvbHVtbnMsXG4gICAgICAgICAgICBkZWZhdWx0czogZGVmYXVsdHMsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgbWVyZ2VDZWxsczogbWVyZ2VDZWxscyxcbiAgICAgICAgICAgIGF1dG9GaWx0ZXI6IGF1dG9GaWx0ZXIsXG4gICAgICAgICAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICAgICAgICAgIHNob3dHcmlkTGluZXM6IHRoaXMub3B0aW9ucy5zaG93R3JpZExpbmVzLFxuICAgICAgICAgICAgaHlwZXJsaW5rczogdGhpcy5faHlwZXJsaW5rcyxcbiAgICAgICAgICAgIHZhbGlkYXRpb25zOiB2YWxpZGF0aW9ucyxcbiAgICAgICAgICAgIGRlZmF1bHRDZWxsU3R5bGVJZDogZGVmYXVsdENlbGxTdHlsZUlkLFxuICAgICAgICAgICAgcnRsOiB0aGlzLm9wdGlvbnMucnRsICE9PSB1bmRlZmluZWQgPyB0aGlzLm9wdGlvbnMucnRsIDogZGVmYXVsdHMucnRsLFxuICAgICAgICAgICAgbGVnYWN5RHJhd2luZzogdGhpcy5fY29tbWVudHMubGVuZ3RoID8gYHZtbCR7dGhpcy5vcHRpb25zLnNoZWV0SW5kZXh9YCA6IG51bGwsXG4gICAgICAgICAgICBkcmF3aW5nOiB0aGlzLl9kcmF3aW5ncy5sZW5ndGggPyBgZHJ3JHt0aGlzLm9wdGlvbnMuc2hlZXRJbmRleH1gIDogbnVsbCxcbiAgICAgICAgICAgIGxhc3RSb3c6IGxhc3RSb3csXG4gICAgICAgICAgICBsYXN0Q29sOiBsYXN0Q29sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbW1lbnRzWE1MKCkge1xuICAgICAgICBpZiAodGhpcy5fY29tbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gQ09NTUVOVFNfWE1MKHsgY29tbWVudHM6IHRoaXMuX2NvbW1lbnRzIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhd2luZ3NYTUwoaW1hZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLl9kcmF3aW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCByZWxzID0ge307XG4gICAgICAgICAgICBsZXQgbWFpbiA9IHRoaXMuX2RyYXdpbmdzLm1hcChkcncgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWYgPSBwYXJzZVJlZihkcncudG9wTGVmdENlbGwpO1xuICAgICAgICAgICAgICAgIGxldCBpbWcgPSByZWxzW2Rydy5pbWFnZV07XG4gICAgICAgICAgICAgICAgaWYgKCFpbWcpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gcmVsc1tkcncuaW1hZ2VdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcklkOiBgaW1nJHtkcncuaW1hZ2V9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogaW1hZ2VzW2Rydy5pbWFnZV0udGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbCAgICAgICA6IHJlZi5jb2wsXG4gICAgICAgICAgICAgICAgICAgIGNvbE9mZnNldCA6IHBpeGVsc1RvRXhjZWwoZHJ3Lm9mZnNldFgpLFxuICAgICAgICAgICAgICAgICAgICByb3cgICAgICAgOiByZWYucm93LFxuICAgICAgICAgICAgICAgICAgICByb3dPZmZzZXQgOiBwaXhlbHNUb0V4Y2VsKGRydy5vZmZzZXRZKSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggICAgIDogcGl4ZWxzVG9FeGNlbChkcncud2lkdGgpLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgICAgOiBwaXhlbHNUb0V4Y2VsKGRydy5oZWlnaHQpLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZUlkICAgOiBpbWcucklkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBtYWluOiBEUkFXSU5HU19YTUwobWFpbiksXG4gICAgICAgICAgICAgICAgcmVsczogRFJBV0lOR1NfUkVMU19YTUwocmVscylcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZWdhY3lEcmF3aW5nKCkge1xuICAgICAgICBpZiAodGhpcy5fY29tbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gTEVHQUNZX0RSQVdJTkcoeyBjb21tZW50czogdGhpcy5fY29tbWVudHMgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfbG9va3VwU3RyaW5nKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IFwiJFwiICsgdmFsdWU7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fc3RyaW5ncy5pbmRleGVzW2tleV07XG4gICAgICAgIGxldCByZXN1bHQ7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGluZGV4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5fc3RyaW5ncy5pbmRleGVzW2tleV0gPSB0aGlzLl9zdHJpbmdzLnVuaXF1ZUNvdW50O1xuICAgICAgICAgICAgdGhpcy5fc3RyaW5ncy51bmlxdWVDb3VudCArKztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3N0cmluZ3MuY291bnQgKys7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBfbG9va3VwU3R5bGUoc3R5bGUpIHtcbiAgICAgICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHN0eWxlKTtcblxuICAgICAgICBpZiAoanNvbiA9PT0gXCJ7fVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbmRleCA9IGluZGV4T2YoanNvbiwgdGhpcy5fc3R5bGVzKTtcblxuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuX3N0eWxlcy5wdXNoKGpzb24pIC0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZXJlIGlzIG9uZSBkZWZhdWx0IHN0eWxlXG4gICAgICAgIHJldHVybiBpbmRleCArIDE7XG4gICAgfVxuXG4gICAgX2xvb2t1cEJvcmRlcihib3JkZXIpIHtcbiAgICAgICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KGJvcmRlcik7XG4gICAgICAgIGlmIChqc29uID09PSBcInt9XCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbmRleCA9IGluZGV4T2YoanNvbiwgdGhpcy5fYm9yZGVycyk7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5fYm9yZGVycy5wdXNoKGpzb24pIC0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZXJlIGlzIG9uZSBkZWZhdWx0IGJvcmRlclxuICAgICAgICByZXR1cm4gaW5kZXggKyAxO1xuICAgIH1cblxuICAgIF9yZWFkQ2VsbHMocm93RGF0YSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IHJvd0RhdGFbaV07XG4gICAgICAgICAgICBjb25zdCBjZWxscyA9IHJvdy5jZWxscztcblxuICAgICAgICAgICAgcm93LmRhdGEgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjZWxscy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxEYXRhID0gdGhpcy5fY2VsbChjZWxsc1tqXSwgcm93LmluZGV4LCBqKTtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93LmRhdGEucHVzaChjZWxsRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2NlbGwoZGF0YSwgcm93SW5kZXgsIGNlbGxJbmRleCkge1xuICAgICAgICBpZiAoIWRhdGEgfHwgZGF0YSA9PT0gRU1QVFlfQ0VMTCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhLnZhbHVlO1xuXG4gICAgICAgIGxldCBib3JkZXIgPSB7fTtcblxuICAgICAgICBpZiAoZGF0YS5ib3JkZXJMZWZ0KSB7XG4gICAgICAgICAgICBib3JkZXIubGVmdCA9IGRhdGEuYm9yZGVyTGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLmJvcmRlclJpZ2h0KSB7XG4gICAgICAgICAgICBib3JkZXIucmlnaHQgPSBkYXRhLmJvcmRlclJpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEuYm9yZGVyVG9wKSB7XG4gICAgICAgICAgICBib3JkZXIudG9wID0gZGF0YS5ib3JkZXJUb3A7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YS5ib3JkZXJCb3R0b20pIHtcbiAgICAgICAgICAgIGJvcmRlci5ib3R0b20gPSBkYXRhLmJvcmRlckJvdHRvbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJvcmRlciA9IHRoaXMuX2xvb2t1cEJvcmRlcihib3JkZXIpO1xuXG4gICAgICAgIGNvbnN0IGRlZlN0eWxlID0gdGhpcy5vcHRpb25zLmRlZmF1bHRDZWxsU3R5bGUgfHwge307XG4gICAgICAgIGxldCBzdHlsZSA9IHsgYm9yZGVySWQ6IGJvcmRlciB9O1xuXG4gICAgICAgIChmdW5jdGlvbihhZGQpIHtcbiAgICAgICAgICAgIGFkZChcImNvbG9yXCIpO1xuICAgICAgICAgICAgYWRkKFwiYmFja2dyb3VuZFwiKTtcbiAgICAgICAgICAgIGFkZChcImJvbGRcIik7XG4gICAgICAgICAgICBhZGQoXCJpdGFsaWNcIik7XG4gICAgICAgICAgICBhZGQoXCJ1bmRlcmxpbmVcIik7XG4gICAgICAgICAgICBpZiAoIWFkZChcImZvbnRGYW1pbHlcIikpIHsgYWRkKFwiZm9udE5hbWVcIiwgXCJmb250RmFtaWx5XCIpOyB9XG4gICAgICAgICAgICBhZGQoXCJmb250U2l6ZVwiKTtcbiAgICAgICAgICAgIGFkZChcImZvcm1hdFwiKTtcbiAgICAgICAgICAgIGlmICghYWRkKFwidGV4dEFsaWduXCIpKSB7IGFkZChcImhBbGlnblwiLCBcInRleHRBbGlnblwiKTsgfVxuICAgICAgICAgICAgaWYgKCFhZGQoXCJ2ZXJ0aWNhbEFsaWduXCIpKSB7IGFkZChcInZBbGlnblwiLCBcInZlcnRpY2FsQWxpZ25cIik7IH1cbiAgICAgICAgICAgIGFkZChcIndyYXBcIik7XG4gICAgICAgICAgICBhZGQoXCJpbmRlbnRcIik7XG4gICAgICAgIH0pKFxuICAgICAgICAgICAgZnVuY3Rpb24ocHJvcCwgdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IGRhdGFbcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCA9IGRlZlN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVbdGFyZ2V0IHx8IHByb3BdID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgY29sdW1ucyA9IHRoaXMub3B0aW9ucy5jb2x1bW5zIHx8IFtdO1xuXG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IGNvbHVtbnNbY2VsbEluZGV4XTtcbiAgICAgICAgbGV0IHR5cGUgPSB0eXBlb2YgdmFsdWU7XG5cbiAgICAgICAgaWYgKGNvbHVtbiAmJiBjb2x1bW4uYXV0b1dpZHRoICYmICghZGF0YS5jb2xTcGFuIHx8IGRhdGEuY29sU3BhbiA9PT0gMSkpIHtcbiAgICAgICAgICAgIGxldCBkaXNwbGF5VmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgLy8gWFhYOiBsZXQncyBub3QgYnJpbmcga2VuZG8udG9TdHJpbmcgaW4gb25seSBmb3IgdGhpcy5cbiAgICAgICAgICAgIC8vICAgICAgYmV0dGVyIHdhaXQgdW50aWwgdGhlIHNwcmVhZHNoZWV0IGVuZ2luZSBpcyBhdmFpbGFibGUgYXMgYSBzZXBhcmF0ZVxuICAgICAgICAgICAgLy8gICAgICBjb21wb25lbnQsIHRoZW4gd2UgY2FuIHVzZSBhIHJlYWwgRXhjZWwtbGlrZSBmb3JtYXR0ZXIuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBrZW5kby50b1N0cmluZyB3aWxsIG5vdCBiZWhhdmUgZXhhY3RseSBsaWtlIHRoZSBFeGNlbCBmb3JtYXRcbiAgICAgICAgICAgICAgICAvLyBTdGlsbCwgaXQncyB0aGUgYmVzdCB3ZSBoYXZlIGF2YWlsYWJsZSBmb3IgZXN0aW1hdGluZyB0aGUgY2hhcmFjdGVyIGNvdW50LlxuICAgICAgICAgICAgICAgIGRpc3BsYXlWYWx1ZSA9IEludGxTZXJ2aWNlLnRvU3RyaW5nKHZhbHVlLCBkYXRhLmZvcm1hdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbHVtbi53aWR0aCA9IE1hdGgubWF4KGNvbHVtbi53aWR0aCB8fCAwLCBTdHJpbmcoZGlzcGxheVZhbHVlKS5sZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHZhbHVlID0gc3RyaXBGdW5ueUNoYXJzKHZhbHVlKTtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fbG9va3VwU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgIHR5cGUgPSBcInNcIjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB0eXBlID0gXCJuXCI7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIHR5cGUgPSBcImJcIjtcbiAgICAgICAgICAgIHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAmJiB2YWx1ZS5nZXRUaW1lKSB7XG4gICAgICAgICAgICB0eXBlID0gbnVsbDtcbiAgICAgICAgICAgIHZhbHVlID0gZGF0ZVRvU2VyaWFsKHZhbHVlKTtcbiAgICAgICAgICAgIGlmICghc3R5bGUuZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgc3R5bGUuZm9ybWF0ID0gXCJtbS1kZC15eVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHlwZSA9IG51bGw7XG4gICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzdHlsZSA9IHRoaXMuX2xvb2t1cFN0eWxlKHN0eWxlKTtcblxuICAgICAgICBjb25zdCBjZWxsTmFtZSA9IHJlZihyb3dJbmRleCwgY2VsbEluZGV4KTtcblxuICAgICAgICBpZiAoZGF0YS52YWxpZGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9hZGRWYWxpZGF0aW9uKGRhdGEudmFsaWRhdGlvbiwgY2VsbE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEuY29tbWVudCkge1xuICAgICAgICAgICAgbGV0IGFuY2hvciA9IFtcbiAgICAgICAgICAgICAgICBjZWxsSW5kZXggKyAxLCAgLy8gc3RhcnQgY29sdW1uXG4gICAgICAgICAgICAgICAgMTUsICAgICAgICAgICAgIC8vIHN0YXJ0IGNvbHVtbiBvZmZzZXRcbiAgICAgICAgICAgICAgICByb3dJbmRleCwgICAgICAgLy8gc3RhcnQgcm93XG4gICAgICAgICAgICAgICAgMTAsICAgICAgICAgICAgIC8vIHN0YXJ0IHJvdyBvZmZzZXRcbiAgICAgICAgICAgICAgICBjZWxsSW5kZXggKyAzLCAgLy8gZW5kIGNvbHVtblxuICAgICAgICAgICAgICAgIDE1LCAgICAgICAgICAgICAvLyBlbmQgY29sdW1uIG9mZnNldFxuICAgICAgICAgICAgICAgIHJvd0luZGV4ICsgMywgICAvLyBlbmQgcm93XG4gICAgICAgICAgICAgICAgNCAgICAgICAgICAgICAgIC8vIGVuZCByb3cgb2Zmc2V0XG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgdGhpcy5fY29tbWVudHMucHVzaCh7XG4gICAgICAgICAgICAgICAgcmVmICAgIDogY2VsbE5hbWUsXG4gICAgICAgICAgICAgICAgdGV4dCAgIDogZGF0YS5jb21tZW50LFxuICAgICAgICAgICAgICAgIHJvdyAgICA6IHJvd0luZGV4LFxuICAgICAgICAgICAgICAgIGNvbCAgICA6IGNlbGxJbmRleCxcbiAgICAgICAgICAgICAgICBhbmNob3IgOiBhbmNob3Iuam9pbihcIiwgXCIpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBmb3JtdWxhOiBkYXRhLmZvcm11bGEsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgc3R5bGU6IHN0eWxlLFxuICAgICAgICAgICAgcmVmOiBjZWxsTmFtZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9hZGRWYWxpZGF0aW9uKHYsIHJlZikge1xuICAgICAgICBjb25zdCB0bXAgPSB7XG4gICAgICAgICAgICBzaG93RXJyb3JNZXNzYWdlIDogdi50eXBlID09PSBcInJlamVjdFwiID8gMSA6IDAsXG4gICAgICAgICAgICBmb3JtdWxhMSAgICAgICAgIDogdi5mcm9tLFxuICAgICAgICAgICAgZm9ybXVsYTIgICAgICAgICA6IHYudG8sXG4gICAgICAgICAgICB0eXBlICAgICAgICAgICAgIDogTUFQX0VYQ0VMX1RZUEVbdi5kYXRhVHlwZV0gfHwgdi5kYXRhVHlwZSxcbiAgICAgICAgICAgIG9wZXJhdG9yICAgICAgICAgOiBNQVBfRVhDRUxfT1BFUkFUT1Jbdi5jb21wYXJlclR5cGVdIHx8IHYuY29tcGFyZXJUeXBlLFxuICAgICAgICAgICAgYWxsb3dCbGFuayAgICAgICA6IHYuYWxsb3dOdWxscyA/IDEgOiAwLFxuICAgICAgICAgICAgc2hvd0Ryb3BEb3duICAgICA6IHYuc2hvd0J1dHRvbiA/IDAgOiAxLCAvLyBMT0wsIEV4Y2VsIVxuICAgICAgICAgICAgZXJyb3IgICAgICAgICAgICA6IHYubWVzc2FnZVRlbXBsYXRlLFxuICAgICAgICAgICAgZXJyb3JUaXRsZSAgICAgICA6IHYudGl0bGVUZW1wbGF0ZVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkodG1wKTtcbiAgICAgICAgaWYgKCF0aGlzLl92YWxpZGF0aW9uc1tqc29uXSkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWRhdGlvbnNbanNvbl0gPSB0bXA7XG4gICAgICAgICAgICB0bXAuc3FyZWYgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl92YWxpZGF0aW9uc1tqc29uXS5zcXJlZi5wdXNoKHJlZik7XG4gICAgfVxuXG4gICAgX2dldExhc3RSb3coKSB7XG4gICAgICAgIHJldHVybiBjb3VudERhdGEodGhpcy5vcHRpb25zLnJvd3MpO1xuICAgIH1cblxuICAgIF9nZXRMYXN0Q29sKCkge1xuICAgICAgICBsZXQgbGFzdCA9IDA7XG4gICAgICAgIHRoaXMub3B0aW9ucy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93KSB7XG4gICAgICAgICAgICBpZiAocm93LmNlbGxzKSB7XG4gICAgICAgICAgICAgICAgbGFzdCA9IE1hdGgubWF4KGxhc3QsIGNvdW50RGF0YShyb3cuY2VsbHMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsYXN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY291bnREYXRhKGRhdGEpIHtcbiAgICBsZXQgbGFzdCA9IGRhdGEubGVuZ3RoO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoZWwuaW5kZXggJiYgZWwuaW5kZXggPj0gbGFzdCkge1xuICAgICAgICAgICAgbGFzdCA9IGVsLmluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBsYXN0O1xufVxuXG5jb25zdCBNQVBfRVhDRUxfT1BFUkFUT1IgPSB7XG4gICAgLy8gaW5jbHVkZXMgb25seSB3aGF0IGRpZmZlcnM7IGtleSBpcyBvdXIgb3BlcmF0b3IsIHZhbHVlIGlzIEV4Y2VsXG4gICAgLy8gb3BlcmF0b3IuXG4gICAgZ3JlYXRlclRoYW5PckVxdWFsVG8gOiBcImdyZWF0ZXJUaGFuT3JFcXVhbFwiLFxuICAgIGxlc3NUaGFuT3JFcXVhbFRvICAgIDogXCJsZXNzVGhhbk9yRXF1YWxcIlxufTtcblxuY29uc3QgTUFQX0VYQ0VMX1RZUEUgPSB7XG4gICAgbnVtYmVyOiBcImRlY2ltYWxcIlxufTtcblxuY29uc3QgZGVmYXVsdEZvcm1hdHMgPSB7XG4gICAgXCJHZW5lcmFsXCI6IDAsXG4gICAgXCIwXCI6IDEsXG4gICAgXCIwLjAwXCI6IDIsXG4gICAgXCIjLCMjMFwiOiAzLFxuICAgIFwiIywjIzAuMDBcIjogNCxcbiAgICBcIjAlXCI6IDksXG4gICAgXCIwLjAwJVwiOiAxMCxcbiAgICBcIjAuMDBFKzAwXCI6IDExLFxuICAgIFwiIyA/Lz9cIjogMTIsXG4gICAgXCIjID8/Lz8/XCI6IDEzLFxuICAgIFwibW0tZGQteXlcIjogMTQsXG4gICAgXCJkLW1tbS15eVwiOiAxNSxcbiAgICBcImQtbW1tXCI6IDE2LFxuICAgIFwibW1tLXl5XCI6IDE3LFxuICAgIFwiaDptbSBBTS9QTVwiOiAxOCxcbiAgICBcImg6bW06c3MgQU0vUE1cIjogMTksXG4gICAgXCJoOm1tXCI6IDIwLFxuICAgIFwiaDptbTpzc1wiOiAyMSxcbiAgICBcIm0vZC95eSBoOm1tXCI6IDIyLFxuICAgIFwiIywjIzAgOygjLCMjMClcIjogMzcsXG4gICAgXCIjLCMjMCA7W1JlZF0oIywjIzApXCI6IDM4LFxuICAgIFwiIywjIzAuMDA7KCMsIyMwLjAwKVwiOiAzOSxcbiAgICBcIiMsIyMwLjAwO1tSZWRdKCMsIyMwLjAwKVwiOiA0MCxcbiAgICBcIm1tOnNzXCI6IDQ1LFxuICAgIFwiW2hdOm1tOnNzXCI6IDQ2LFxuICAgIFwibW1zcy4wXCI6IDQ3LFxuICAgIFwiIyMwLjBFKzBcIjogNDgsXG4gICAgXCJAXCI6IDQ5LFxuICAgIFwiWyQtNDA0XWUvbS9kXCI6IDI3LFxuICAgIFwibS9kL3l5XCI6IDMwLFxuICAgIFwidDBcIjogNTksXG4gICAgXCJ0MC4wMFwiOiA2MCxcbiAgICBcInQjLCMjMFwiOiA2MSxcbiAgICBcInQjLCMjMC4wMFwiOiA2MixcbiAgICBcInQwJVwiOiA2NyxcbiAgICBcInQwLjAwJVwiOiA2OCxcbiAgICBcInQjID8vP1wiOiA2OSxcbiAgICBcInQjID8/Lz8/XCI6IDcwXG59O1xuXG5mdW5jdGlvbiBjb252ZXJ0Q29sb3IodmFsdWUpIHtcbiAgICBsZXQgY29sb3IgPSB2YWx1ZTtcbiAgICBpZiAoY29sb3IubGVuZ3RoIDwgNikge1xuICAgICAgICBjb2xvciA9IGNvbG9yLnJlcGxhY2UoLyhcXHcpL2csIGZ1bmN0aW9uKCQwLCAkMSkge1xuICAgICAgICAgICAgcmV0dXJuICQxICsgJDE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbG9yID0gY29sb3Iuc3Vic3RyaW5nKDEpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICBpZiAoY29sb3IubGVuZ3RoIDwgOCkge1xuICAgICAgICBjb2xvciA9IFwiRkZcIiArIGNvbG9yO1xuICAgIH1cblxuICAgIHJldHVybiBjb2xvcjtcbn1cblxuY2xhc3MgV29ya2Jvb2sge1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB0aGlzLl9zdHJpbmdzID0ge1xuICAgICAgICAgICAgaW5kZXhlczoge30sXG4gICAgICAgICAgICBjb3VudDogMCxcbiAgICAgICAgICAgIHVuaXF1ZUNvdW50OiAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3N0eWxlcyA9IFtdO1xuICAgICAgICB0aGlzLl9ib3JkZXJzID0gW107XG4gICAgICAgIHRoaXMuX2ltYWdlcyA9IHRoaXMub3B0aW9ucy5pbWFnZXM7XG4gICAgICAgIHRoaXMuX2ltZ0lkID0gMDtcblxuICAgICAgICB0aGlzLl9zaGVldHMgPSBtYXAodGhpcy5vcHRpb25zLnNoZWV0cyB8fCBbXSwgKG9wdGlvbnMsIGkpID0+IHtcbiAgICAgICAgICAgIG9wdGlvbnMuZGVmYXVsdHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICBvcHRpb25zLnNoZWV0SW5kZXggPSBpICsgMTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgV29ya3NoZWV0KG9wdGlvbnMsIHRoaXMuX3N0cmluZ3MsIHRoaXMuX3N0eWxlcywgdGhpcy5fYm9yZGVycyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGltYWdlRmlsZW5hbWUobWltZVR5cGUpIHtcbiAgICAgICAgY29uc3QgaWQgPSArK3RoaXMuX2ltZ0lkO1xuICAgICAgICBzd2l0Y2ggKG1pbWVUeXBlKSB7XG4gICAgICAgICAgY2FzZSBcImltYWdlL2pwZ1wiOlxuICAgICAgICAgIGNhc2UgXCJpbWFnZS9qcGVnXCI6XG4gICAgICAgICAgICByZXR1cm4gYGltYWdlJHtpZH0uanBnYDtcbiAgICAgICAgICBjYXNlIFwiaW1hZ2UvcG5nXCI6XG4gICAgICAgICAgICByZXR1cm4gYGltYWdlJHtpZH0ucG5nYDtcbiAgICAgICAgICBjYXNlIFwiaW1hZ2UvZ2lmXCI6XG4gICAgICAgICAgICByZXR1cm4gYGltYWdlJHtpZH0uZ2lmYDtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGBpbWFnZSR7aWR9LmJpbmA7IC8vIFhYWDogYW55dGhpbmcgYmV0dGVyIHRvIGRvIGhlcmU/XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b1pJUCgpIHtcbiAgICAgICAgY29uc3QgemlwID0gY3JlYXRlWmlwKCk7XG5cbiAgICAgICAgY29uc3QgZG9jUHJvcHMgPSB6aXAuZm9sZGVyKFwiZG9jUHJvcHNcIik7XG5cbiAgICAgICAgZG9jUHJvcHMuZmlsZShcImNvcmUueG1sXCIsIENPUkUoe1xuICAgICAgICAgICAgY3JlYXRvcjogdGhpcy5vcHRpb25zLmNyZWF0b3IgfHwgXCJLZW5kbyBVSVwiLFxuICAgICAgICAgICAgbGFzdE1vZGlmaWVkQnk6IHRoaXMub3B0aW9ucy5jcmVhdG9yIHx8IFwiS2VuZG8gVUlcIixcbiAgICAgICAgICAgIGNyZWF0ZWQ6IHRoaXMub3B0aW9ucy5kYXRlIHx8IG5ldyBEYXRlKCkudG9KU09OKCksXG4gICAgICAgICAgICBtb2RpZmllZDogdGhpcy5vcHRpb25zLmRhdGUgfHwgbmV3IERhdGUoKS50b0pTT04oKVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29uc3Qgc2hlZXRDb3VudCA9IHRoaXMuX3NoZWV0cy5sZW5ndGg7XG5cbiAgICAgICAgZG9jUHJvcHMuZmlsZShcImFwcC54bWxcIiwgQVBQKHsgc2hlZXRzOiB0aGlzLl9zaGVldHMgfSkpO1xuXG4gICAgICAgIGNvbnN0IHJlbHMgPSB6aXAuZm9sZGVyKFwiX3JlbHNcIik7XG4gICAgICAgIHJlbHMuZmlsZShcIi5yZWxzXCIsIFJFTFMpO1xuXG4gICAgICAgIGNvbnN0IHhsID0gemlwLmZvbGRlcihcInhsXCIpO1xuXG4gICAgICAgIGNvbnN0IHhsUmVscyA9IHhsLmZvbGRlcihcIl9yZWxzXCIpO1xuICAgICAgICB4bFJlbHMuZmlsZShcIndvcmtib29rLnhtbC5yZWxzXCIsIFdPUktCT09LX1JFTFMoeyBjb3VudDogc2hlZXRDb3VudCB9KSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2ltYWdlcykge1xuICAgICAgICAgICAgY29uc3QgbWVkaWEgPSB4bC5mb2xkZXIoXCJtZWRpYVwiKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2ltYWdlcykuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nID0gdGhpcy5faW1hZ2VzW2lkXTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHRoaXMuaW1hZ2VGaWxlbmFtZShpbWcudHlwZSk7XG4gICAgICAgICAgICAgICAgbWVkaWEuZmlsZShmaWxlbmFtZSwgaW1nLmRhdGEpO1xuICAgICAgICAgICAgICAgIGltZy50YXJnZXQgPSBgLi4vbWVkaWEvJHtmaWxlbmFtZX1gO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaGVldElkcyA9IHt9O1xuICAgICAgICB4bC5maWxlKFwid29ya2Jvb2sueG1sXCIsIFdPUktCT09LKHtcbiAgICAgICAgICAgIHNoZWV0czogdGhpcy5fc2hlZXRzLFxuICAgICAgICAgICAgZmlsdGVyTmFtZXM6IG1hcCh0aGlzLl9zaGVldHMsIGZ1bmN0aW9uKHNoZWV0LCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBzaGVldC5vcHRpb25zO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoZWV0TmFtZSA9IChvcHRpb25zLm5hbWUgfHwgb3B0aW9ucy50aXRsZSB8fCBcIlNoZWV0XCIgKyAoaW5kZXggKyAxKSk7XG4gICAgICAgICAgICAgICAgc2hlZXRJZHNbc2hlZXROYW1lLnRvTG93ZXJDYXNlKCldID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyLnJlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3ByZWFkc2hlZXQgcHJvdmlkZXMgYHJlZmBcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhID0gZmlsdGVyLnJlZi5zcGxpdChcIjpcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZnJvbSA9IHBhcnNlUmVmKGFbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvID0gcGFyc2VSZWYoYVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2hlZXRJZDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2hlZXROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICRyZWYoZnJvbS5yb3csIGZyb20uY29sKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogJHJlZih0by5yb3csIHRvLmNvbClcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpbHRlci5mcm9tICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBmaWx0ZXIudG8gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdyaWQgZG9lcyB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2hlZXRJZDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2hlZXROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICRyZWYoZmlsdGVyUm93SW5kZXgob3B0aW9ucyksIGZpbHRlci5mcm9tKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogJHJlZihmaWx0ZXJSb3dJbmRleChvcHRpb25zKSwgZmlsdGVyLnRvKVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdXNlck5hbWVzOiBtYXAodGhpcy5vcHRpb25zLm5hbWVzIHx8IFtdLCBmdW5jdGlvbihkZWYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBkZWYubG9jYWxOYW1lLFxuICAgICAgICAgICAgICAgICAgICBsb2NhbFNoZWV0SWQ6IGRlZi5zaGVldCA/IHNoZWV0SWRzW2RlZi5zaGVldC50b0xvd2VyQ2FzZSgpXSA6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkZWYudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGhpZGRlbjogZGVmLmhpZGRlblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29uc3Qgd29ya3NoZWV0cyA9IHhsLmZvbGRlcihcIndvcmtzaGVldHNcIik7XG4gICAgICAgIGNvbnN0IGRyYXdpbmdzID0geGwuZm9sZGVyKFwiZHJhd2luZ3NcIik7XG4gICAgICAgIGNvbnN0IGRyYXdpbmdzUmVscyA9IGRyYXdpbmdzLmZvbGRlcihcIl9yZWxzXCIpO1xuICAgICAgICBjb25zdCBzaGVldFJlbHMgPSB3b3Jrc2hlZXRzLmZvbGRlcihcIl9yZWxzXCIpO1xuICAgICAgICBjb25zdCBjb21tZW50RmlsZXMgPSBbXTtcbiAgICAgICAgY29uc3QgZHJhd2luZ0ZpbGVzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgc2hlZXRDb3VudDsgaWR4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHNoZWV0ID0gdGhpcy5fc2hlZXRzW2lkeF07XG4gICAgICAgICAgICBjb25zdCBzaGVldE5hbWUgPSBgc2hlZXQke2lkeCArIDF9LnhtbGA7XG4gICAgICAgICAgICBjb25zdCBzaGVldFhNTCA9IHNoZWV0LnRvWE1MKGlkeCk7IC8vIG11c3QgYmUgY2FsbGVkIGJlZm9yZSByZWxzVG9YTUxcbiAgICAgICAgICAgIGNvbnN0IHJlbHNYTUwgPSBzaGVldC5yZWxzVG9YTUwoKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnRzWE1MID0gc2hlZXQuY29tbWVudHNYTUwoKTtcbiAgICAgICAgICAgIGNvbnN0IGxlZ2FjeURyYXdpbmcgPSBzaGVldC5sZWdhY3lEcmF3aW5nKCk7XG4gICAgICAgICAgICBjb25zdCBkcmF3aW5nc1hNTCA9IHNoZWV0LmRyYXdpbmdzWE1MKHRoaXMuX2ltYWdlcyk7XG5cbiAgICAgICAgICAgIGlmIChyZWxzWE1MKSB7XG4gICAgICAgICAgICAgICAgc2hlZXRSZWxzLmZpbGUoc2hlZXROYW1lICsgXCIucmVsc1wiLCByZWxzWE1MKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb21tZW50c1hNTCkge1xuICAgICAgICAgICAgICAgIGxldCBuYW1lID0gYGNvbW1lbnRzJHtzaGVldC5vcHRpb25zLnNoZWV0SW5kZXh9LnhtbGA7XG4gICAgICAgICAgICAgICAgeGwuZmlsZShuYW1lLCBjb21tZW50c1hNTCk7XG4gICAgICAgICAgICAgICAgY29tbWVudEZpbGVzLnB1c2gobmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGVnYWN5RHJhd2luZykge1xuICAgICAgICAgICAgICAgIGRyYXdpbmdzLmZpbGUoYHZtbERyYXdpbmcke3NoZWV0Lm9wdGlvbnMuc2hlZXRJbmRleH0udm1sYCwgbGVnYWN5RHJhd2luZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZHJhd2luZ3NYTUwpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IGBkcmF3aW5nJHtzaGVldC5vcHRpb25zLnNoZWV0SW5kZXh9LnhtbGA7XG4gICAgICAgICAgICAgICAgZHJhd2luZ3MuZmlsZShuYW1lLCBkcmF3aW5nc1hNTC5tYWluKTtcbiAgICAgICAgICAgICAgICBkcmF3aW5nc1JlbHMuZmlsZShgJHtuYW1lfS5yZWxzYCwgZHJhd2luZ3NYTUwucmVscyk7XG4gICAgICAgICAgICAgICAgZHJhd2luZ0ZpbGVzLnB1c2gobmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdvcmtzaGVldHMuZmlsZShzaGVldE5hbWUsIHNoZWV0WE1MKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJvcmRlcnMgPSBtYXAodGhpcy5fYm9yZGVycywgcGFyc2VKU09OKTtcblxuICAgICAgICBjb25zdCBzdHlsZXMgPSBtYXAodGhpcy5fc3R5bGVzLCBwYXJzZUpTT04pO1xuXG4gICAgICAgIGNvbnN0IGhhc0ZvbnQgPSBmdW5jdGlvbihzdHlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlLnVuZGVybGluZSB8fCBzdHlsZS5ib2xkIHx8IHN0eWxlLml0YWxpYyB8fCBzdHlsZS5jb2xvciB8fCBzdHlsZS5mb250RmFtaWx5IHx8IHN0eWxlLmZvbnRTaXplO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNvbnZlcnRGb250U2l6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgZm9udEluUHggPSBOdW1iZXIodmFsdWUpO1xuICAgICAgICAgICAgbGV0IGZvbnRJblB0O1xuXG4gICAgICAgICAgICBpZiAoZm9udEluUHgpIHtcbiAgICAgICAgICAgICAgICBmb250SW5QdCA9IGZvbnRJblB4ICogMyAvIDQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmb250SW5QdDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBmb250cyA9IG1hcChzdHlsZXMsIGZ1bmN0aW9uKHN0eWxlKSB7XG4gICAgICAgICAgICBpZiAoc3R5bGUuZm9udFNpemUpIHtcbiAgICAgICAgICAgICAgICBzdHlsZS5mb250U2l6ZSA9IGNvbnZlcnRGb250U2l6ZShzdHlsZS5mb250U2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdHlsZS5jb2xvcikge1xuICAgICAgICAgICAgICAgIHN0eWxlLmNvbG9yID0gY29udmVydENvbG9yKHN0eWxlLmNvbG9yKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhhc0ZvbnQoc3R5bGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBmb3JtYXRzID0gbWFwKHN0eWxlcywgZnVuY3Rpb24oc3R5bGUpIHtcbiAgICAgICAgICAgIGlmIChzdHlsZS5mb3JtYXQgJiYgZGVmYXVsdEZvcm1hdHNbc3R5bGUuZm9ybWF0XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBmaWxscyA9IG1hcChzdHlsZXMsIGZ1bmN0aW9uKHN0eWxlKSB7XG4gICAgICAgICAgICBpZiAoc3R5bGUuYmFja2dyb3VuZCkge1xuICAgICAgICAgICAgICAgIHN0eWxlLmJhY2tncm91bmQgPSBjb252ZXJ0Q29sb3Ioc3R5bGUuYmFja2dyb3VuZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB4bC5maWxlKFwic3R5bGVzLnhtbFwiLCBTVFlMRVMoe1xuICAgICAgICAgICAgZm9udHM6IGZvbnRzLFxuICAgICAgICAgICAgZmlsbHM6IGZpbGxzLFxuICAgICAgICAgICAgZm9ybWF0czogZm9ybWF0cyxcbiAgICAgICAgICAgIGJvcmRlcnM6IGJvcmRlcnMsXG4gICAgICAgICAgICBzdHlsZXM6IG1hcChzdHlsZXMsIGZ1bmN0aW9uKHN0eWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFzRm9udChzdHlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmZvbnRJZCA9IGluZGV4T2Yoc3R5bGUsIGZvbnRzKSArIDE7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlLmJhY2tncm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmZpbGxJZCA9IGluZGV4T2Yoc3R5bGUsIGZpbGxzKSArIDI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0LnRleHRBbGlnbiA9IHN0eWxlLnRleHRBbGlnbjtcbiAgICAgICAgICAgICAgICByZXN1bHQuaW5kZW50ID0gc3R5bGUuaW5kZW50O1xuICAgICAgICAgICAgICAgIHJlc3VsdC52ZXJ0aWNhbEFsaWduID0gc3R5bGUudmVydGljYWxBbGlnbjtcbiAgICAgICAgICAgICAgICByZXN1bHQud3JhcCA9IHN0eWxlLndyYXA7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmJvcmRlcklkID0gc3R5bGUuYm9yZGVySWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUuZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0Rm9ybWF0c1tzdHlsZS5mb3JtYXRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5udW1GbXRJZCA9IGRlZmF1bHRGb3JtYXRzW3N0eWxlLmZvcm1hdF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQubnVtRm10SWQgPSAxNjUgKyBpbmRleE9mKHN0eWxlLCBmb3JtYXRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgeGwuZmlsZShcInNoYXJlZFN0cmluZ3MueG1sXCIsIFNIQVJFRF9TVFJJTkdTKHRoaXMuX3N0cmluZ3MpKTtcblxuICAgICAgICB6aXAuZmlsZShcIltDb250ZW50X1R5cGVzXS54bWxcIiwgQ09OVEVOVF9UWVBFUyh7XG4gICAgICAgICAgICBzaGVldENvdW50OiBzaGVldENvdW50LFxuICAgICAgICAgICAgY29tbWVudEZpbGVzOiBjb21tZW50RmlsZXMsXG4gICAgICAgICAgICBkcmF3aW5nRmlsZXM6IGRyYXdpbmdGaWxlc1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgcmV0dXJuIHppcDtcbiAgICB9XG5cbiAgICB0b0RhdGFVUkwoKSB7XG4gICAgICAgIGNvbnN0IHppcCA9IHRoaXMudG9aSVAoKTtcblxuICAgICAgICByZXR1cm4gemlwLmdlbmVyYXRlQXN5bmMgPyB6aXAuZ2VuZXJhdGVBc3luYyhEQVRBX1VSTF9PUFRJT05TKS50aGVuKHRvRGF0YVVSSSkgOiB0b0RhdGFVUkkoemlwLmdlbmVyYXRlKERBVEFfVVJMX09QVElPTlMpKTtcbiAgICB9XG5cbiAgICB0b0Jsb2IoKSB7XG4gICAgICAgIGNvbnN0IHppcCA9IHRoaXMudG9aSVAoKTtcbiAgICAgICAgaWYgKHppcC5nZW5lcmF0ZUFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gemlwLmdlbmVyYXRlQXN5bmMoQkxPQl9PUFRJT05TKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJsb2IoWyB6aXAuZ2VuZXJhdGUoQVJSQVlCVUZGRVJfT1BUSU9OUykgXSwgeyB0eXBlOiBNSU1FX1RZUEUgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBib3JkZXJTdHlsZSh3aWR0aCkge1xuICAgIGxldCBhbGlhcyA9IFwidGhpblwiO1xuXG4gICAgaWYgKHdpZHRoID09PSAyKSB7XG4gICAgICAgIGFsaWFzID0gXCJtZWRpdW1cIjtcbiAgICB9IGVsc2UgaWYgKHdpZHRoID09PSAzKSB7XG4gICAgICAgIGFsaWFzID0gXCJ0aGlja1wiO1xuICAgIH1cblxuICAgIHJldHVybiBhbGlhcztcbn1cblxuZnVuY3Rpb24gYm9yZGVyU2lkZVRlbXBsYXRlKG5hbWUsIHN0eWxlKSB7XG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XG5cbiAgICBpZiAoc3R5bGUpIHtcbiAgICAgICAgcmVzdWx0ICs9IFwiPFwiICsgbmFtZSArIFwiIHN0eWxlPVxcXCJcIiArIGJvcmRlclN0eWxlKHN0eWxlLnNpemUpICsgXCJcXFwiPlwiO1xuICAgICAgICBpZiAoc3R5bGUuY29sb3IpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBcIjxjb2xvciByZ2I9XFxcIlwiICsgY29udmVydENvbG9yKHN0eWxlLmNvbG9yKSArIFwiXFxcIi8+XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ICs9IFwiPC9cIiArIG5hbWUgKyBcIj5cIjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBib3JkZXJUZW1wbGF0ZShib3JkZXIpIHtcbiAgICByZXR1cm4gXCI8Ym9yZGVyPlwiICtcbiAgICAgICBib3JkZXJTaWRlVGVtcGxhdGUoXCJsZWZ0XCIsIGJvcmRlci5sZWZ0KSArXG4gICAgICAgYm9yZGVyU2lkZVRlbXBsYXRlKFwicmlnaHRcIiwgYm9yZGVyLnJpZ2h0KSArXG4gICAgICAgYm9yZGVyU2lkZVRlbXBsYXRlKFwidG9wXCIsIGJvcmRlci50b3ApICtcbiAgICAgICBib3JkZXJTaWRlVGVtcGxhdGUoXCJib3R0b21cIiwgYm9yZGVyLmJvdHRvbSkgK1xuICAgXCI8L2JvcmRlcj5cIjtcbn1cblxuY29uc3QgRU1QVFlfQ0VMTCA9IHt9O1xuZnVuY3Rpb24gaW5mbGF0ZShyb3dzLCBtZXJnZWRDZWxscykge1xuICAgIGNvbnN0IHJvd0RhdGEgPSBbXTtcbiAgICBjb25zdCByb3dzQnlJbmRleCA9IFtdO1xuXG4gICAgaW5kZXhSb3dzKHJvd3MsIGZ1bmN0aW9uKHJvdywgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIF9zb3VyY2U6IHJvdyxcbiAgICAgICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgICAgIGhlaWdodDogcm93LmhlaWdodCxcbiAgICAgICAgICAgIGxldmVsOiByb3cubGV2ZWwsXG4gICAgICAgICAgICBjZWxsczogW11cbiAgICAgICAgfTtcblxuICAgICAgICByb3dEYXRhLnB1c2goZGF0YSk7XG4gICAgICAgIHJvd3NCeUluZGV4W2luZGV4XSA9IGRhdGE7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3J0ZWQgPSBzb3J0QnlJbmRleChyb3dEYXRhKS5zbGljZSgwKTtcbiAgICBjb25zdCBjdHggPSB7XG4gICAgICAgIHJvd0RhdGE6IHJvd0RhdGEsXG4gICAgICAgIHJvd3NCeUluZGV4OiByb3dzQnlJbmRleCxcbiAgICAgICAgbWVyZ2VkQ2VsbHM6IG1lcmdlZENlbGxzXG4gICAgfTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc29ydGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZpbGxDZWxscyhzb3J0ZWRbaV0sIGN0eCk7XG4gICAgICAgIGRlbGV0ZSBzb3J0ZWRbaV0uX3NvdXJjZTtcbiAgICB9XG5cbiAgICByZXR1cm4gc29ydEJ5SW5kZXgocm93RGF0YSk7XG59XG5cbmZ1bmN0aW9uIGluZGV4Um93cyhyb3dzLCBjYWxsYmFjaykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByb3cgPSByb3dzW2ldO1xuICAgICAgICBpZiAoIXJvdykge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5kZXggPSByb3cuaW5kZXg7XG4gICAgICAgIGlmICh0eXBlb2YgaW5kZXggIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKHJvdywgaW5kZXgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc29ydEJ5SW5kZXgoaXRlbXMpIHtcbiAgICByZXR1cm4gaXRlbXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmluZGV4IC0gYi5pbmRleDtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcHVzaFVuaXF1ZShhcnJheSwgZWwpIHtcbiAgICBpZiAoYXJyYXkuaW5kZXhPZihlbCkgPCAwKSB7XG4gICAgICAgIGFycmF5LnB1c2goZWwpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U3BhbihtZXJnZWRDZWxscywgcmVmKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXJnZWRDZWxscy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCByYW5nZSA9IG1lcmdlZENlbGxzW2ldO1xuICAgICAgICBjb25zdCBhID0gcmFuZ2Uuc3BsaXQoXCI6XCIpO1xuICAgICAgICBsZXQgdG9wTGVmdCA9IGFbMF07XG4gICAgICAgIGlmICh0b3BMZWZ0ID09PSByZWYpIHtcbiAgICAgICAgICAgIGxldCBib3R0b21SaWdodCA9IGFbMV07XG4gICAgICAgICAgICB0b3BMZWZ0ID0gcGFyc2VSZWYodG9wTGVmdCk7XG4gICAgICAgICAgICBib3R0b21SaWdodCA9IHBhcnNlUmVmKGJvdHRvbVJpZ2h0KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcm93U3BhbjogYm90dG9tUmlnaHQucm93IC0gdG9wTGVmdC5yb3cgKyAxLFxuICAgICAgICAgICAgICAgIGNvbFNwYW46IGJvdHRvbVJpZ2h0LmNvbCAtIHRvcExlZnQuY29sICsgMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VSZWYocmVmKSB7XG4gICAgZnVuY3Rpb24gZ2V0Y29sKHN0cikge1xuICAgICAgICBsZXQgdXBwZXJTdHIgPSBzdHIudG9VcHBlckNhc2UoKTtcbiAgICAgICAgbGV0IGNvbCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXBwZXJTdHIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNvbCA9IGNvbCAqIDI2ICsgdXBwZXJTdHIuY2hhckNvZGVBdChpKSAtIDY0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb2wgLSAxO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldHJvdyhzdHIpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0ciwgMTApIC0gMTtcbiAgICB9XG5cbiAgICBjb25zdCBtID0gL14oW2Etel0rKShcXGQrKSQvaS5leGVjKHJlZik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcm93OiBnZXRyb3cobVsyXSksXG4gICAgICAgIGNvbDogZ2V0Y29sKG1bMV0pXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gcGl4ZWxzVG9FeGNlbChweCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHB4ICogOTUyNSk7XG59XG5cbmZ1bmN0aW9uIGZpbGxDZWxscyhkYXRhLCBjdHgpIHtcbiAgICBjb25zdCByb3cgPSBkYXRhLl9zb3VyY2U7XG4gICAgY29uc3Qgcm93SW5kZXggPSBkYXRhLmluZGV4O1xuICAgIGNvbnN0IGNlbGxzID0gcm93LmNlbGxzO1xuICAgIGNvbnN0IGNlbGxEYXRhID0gZGF0YS5jZWxscztcblxuICAgIGlmICghY2VsbHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGNlbGxzW2ldIHx8IEVNUFRZX0NFTEw7XG5cbiAgICAgICAgbGV0IHJvd1NwYW4gPSBjZWxsLnJvd1NwYW4gfHwgMTtcbiAgICAgICAgbGV0IGNvbFNwYW4gPSBjZWxsLmNvbFNwYW4gfHwgMTtcblxuICAgICAgICBjb25zdCBjZWxsSW5kZXggPSBpbnNlcnRDZWxsKGNlbGxEYXRhLCBjZWxsKTtcbiAgICAgICAgY29uc3QgdG9wTGVmdFJlZiA9IHJlZihyb3dJbmRleCwgY2VsbEluZGV4KTtcblxuICAgICAgICBpZiAocm93U3BhbiA9PT0gMSAmJiBjb2xTcGFuID09PSAxKSB7XG4gICAgICAgICAgICAvLyBjb3VsZCBzdGlsbCBiZSBtZXJnZWQ6IHRoZSBzcHJlYWRzaGVldCBkb2VzIG5vdCBzZW5kXG4gICAgICAgICAgICAvLyByb3dTcGFuL2NvbFNwYW4sIGJ1dCBtZXJnZWRDZWxscyBpcyBhbHJlYWR5IHBvcHVsYXRlZC5cbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZWxlcmlrL2tlbmRvLXVpLWNvcmUvaXNzdWVzLzI0MDFcbiAgICAgICAgICAgIGNvbnN0IHRtcCA9IGdldFNwYW4oY3R4Lm1lcmdlZENlbGxzLCB0b3BMZWZ0UmVmKTtcbiAgICAgICAgICAgIGlmICh0bXApIHtcbiAgICAgICAgICAgICAgICBjb2xTcGFuID0gdG1wLmNvbFNwYW47XG4gICAgICAgICAgICAgICAgcm93U3BhbiA9IHRtcC5yb3dTcGFuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3BhbkNlbGwoY2VsbCwgY2VsbERhdGEsIGNlbGxJbmRleCwgY29sU3Bhbik7XG5cbiAgICAgICAgaWYgKHJvd1NwYW4gPiAxIHx8IGNvbFNwYW4gPiAxKSB7XG4gICAgICAgICAgICBwdXNoVW5pcXVlKGN0eC5tZXJnZWRDZWxscyxcbiAgICAgICAgICAgICAgICAgICAgICAgdG9wTGVmdFJlZiArIFwiOlwiICsgcmVmKHJvd0luZGV4ICsgcm93U3BhbiAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEluZGV4ICsgY29sU3BhbiAtIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb3dTcGFuID4gMSkge1xuICAgICAgICAgICAgZm9yIChsZXQgcmkgPSByb3dJbmRleCArIDE7IHJpIDwgcm93SW5kZXggKyByb3dTcGFuOyByaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRSb3cgPSBjdHgucm93c0J5SW5kZXhbcmldO1xuICAgICAgICAgICAgICAgIGlmICghbmV4dFJvdykge1xuICAgICAgICAgICAgICAgICAgICBuZXh0Um93ID0gY3R4LnJvd3NCeUluZGV4W3JpXSA9IHsgaW5kZXg6IHJpLCBjZWxsczogW10gfTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LnJvd0RhdGEucHVzaChuZXh0Um93KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzcGFuQ2VsbChjZWxsLCBuZXh0Um93LmNlbGxzLCBjZWxsSW5kZXggLSAxLCBjb2xTcGFuICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluc2VydENlbGwoZGF0YSwgY2VsbCkge1xuICAgIGxldCBpbmRleDtcblxuICAgIGlmICh0eXBlb2YgY2VsbC5pbmRleCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBpbmRleCA9IGNlbGwuaW5kZXg7XG4gICAgICAgIGluc2VydENlbGxBdChkYXRhLCBjZWxsLCBjZWxsLmluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IGFwcGVuZENlbGwoZGF0YSwgY2VsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluZGV4O1xufVxuXG5mdW5jdGlvbiBpbnNlcnRDZWxsQXQoZGF0YSwgY2VsbCwgaW5kZXgpIHtcbiAgICBkYXRhW2luZGV4XSA9IGNlbGw7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZENlbGwoZGF0YSwgY2VsbCkge1xuICAgIGxldCBpbmRleCA9IGRhdGEubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aCArIDE7IGkrKykge1xuICAgICAgICBpZiAoIWRhdGFbaV0pIHtcbiAgICAgICAgICAgIGRhdGFbaV0gPSBjZWxsO1xuICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW5kZXg7XG59XG5cbmZ1bmN0aW9uIHNwYW5DZWxsKGNlbGwsIHJvdywgc3RhcnRJbmRleCwgY29sU3Bhbikge1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgY29sU3BhbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IHtcbiAgICAgICAgICAgIGJvcmRlclRvcCAgICA6IGNlbGwuYm9yZGVyVG9wLFxuICAgICAgICAgICAgYm9yZGVyUmlnaHQgIDogY2VsbC5ib3JkZXJSaWdodCxcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbSA6IGNlbGwuYm9yZGVyQm90dG9tLFxuICAgICAgICAgICAgYm9yZGVyTGVmdCAgIDogY2VsbC5ib3JkZXJMZWZ0XG4gICAgICAgIH07XG4gICAgICAgIGluc2VydENlbGxBdChyb3csIHRtcCwgc3RhcnRJbmRleCArIGkpO1xuICAgIH1cbn1cblxuY29uc3QgU1BSRUFEU0hFRVRfRklMVEVSUyA9ICh7IHJlZiwgY29sdW1ucywgZ2VuZXJhdG9ycyB9KSA9PiBgXG48YXV0b0ZpbHRlciByZWY9XCIke3JlZn1cIj5cbiAgJHtmb3JlYWNoKGNvbHVtbnMsIChjb2wpID0+IGBcbiAgICA8ZmlsdGVyQ29sdW1uIGNvbElkPVwiJHtjb2wuaW5kZXh9XCI+XG4gICAgICAke2dlbmVyYXRvcnNbY29sLmZpbHRlcl0oY29sKX1cbiAgICA8L2ZpbHRlckNvbHVtbj5cbiAgYCl9XG48L2F1dG9GaWx0ZXI+YDtcblxuY29uc3QgU1BSRUFEU0hFRVRfQ1VTVE9NX0ZJTFRFUiA9ICh7IGxvZ2ljLCBjcml0ZXJpYSB9KSA9PiBgXG48Y3VzdG9tRmlsdGVycyAke2xvZ2ljID09PSAnYW5kJyA/ICdhbmQ9XCIxXCInIDogJyd9PlxuJHtmb3JlYWNoKGNyaXRlcmlhLCAoZikgPT4ge1xuICAgIGxldCBvcCA9IHNwcmVhZHNoZWV0RmlsdGVycy5jdXN0b21PcGVyYXRvcihmKTtcbiAgICBsZXQgdmFsID0gc3ByZWFkc2hlZXRGaWx0ZXJzLmN1c3RvbVZhbHVlKGYpO1xuICAgIHJldHVybiBgPGN1c3RvbUZpbHRlciAke29wID8gYG9wZXJhdG9yPVwiJHtvcH1cImAgOiAnJ30gdmFsPVwiJHt2YWx9XCIvPmA7XG59KX1cbjwvY3VzdG9tRmlsdGVycz5gO1xuXG5jb25zdCBTUFJFQURTSEVFVF9EWU5BTUlDX0ZJTFRFUiA9ICh7IHR5cGUgfSkgPT5cbmA8ZHluYW1pY0ZpbHRlciB0eXBlPVwiJHtzcHJlYWRzaGVldEZpbHRlcnMuZHluYW1pY0ZpbHRlclR5cGUodHlwZSl9XCIgLz5gO1xuXG5jb25zdCBTUFJFQURTSEVFVF9UT1BfRklMVEVSID0gKHsgdHlwZSwgdmFsdWUgfSkgPT5cbmA8dG9wMTAgcGVyY2VudD1cIiR7L3BlcmNlbnQkL2kudGVzdCh0eXBlKSA/IDEgOiAwfVwiXG4gICAgICAgdG9wPVwiJHsvXnRvcC9pLnRlc3QodHlwZSkgPyAxIDogMH1cIlxuICAgICAgIHZhbD1cIiR7dmFsdWV9XCIgLz5gO1xuXG5jb25zdCBTUFJFQURTSEVFVF9WQUxVRV9GSUxURVIgPSAoeyBibGFua3MsIHZhbHVlcyB9KSA9PlxuICBgPGZpbHRlcnMgJHtibGFua3MgPyAnYmxhbms9XCIxXCInIDogJyd9PlxuICAgICR7Zm9yZWFjaCh2YWx1ZXMsICh2YWx1ZSkgPT4gYFxuICAgICAgPGZpbHRlciB2YWw9XCIke3ZhbHVlfVwiIC8+YCl9XG4gIDwvZmlsdGVycz5gO1xuXG5mdW5jdGlvbiBzcHJlYWRzaGVldEZpbHRlcnMoZmlsdGVyKSB7XG4gICAgcmV0dXJuIFNQUkVBRFNIRUVUX0ZJTFRFUlMoe1xuICAgICAgICByZWY6IGZpbHRlci5yZWYsXG4gICAgICAgIGNvbHVtbnM6IGZpbHRlci5jb2x1bW5zLFxuICAgICAgICBnZW5lcmF0b3JzOiB7XG4gICAgICAgICAgICBjdXN0b20gIDogU1BSRUFEU0hFRVRfQ1VTVE9NX0ZJTFRFUixcbiAgICAgICAgICAgIGR5bmFtaWMgOiBTUFJFQURTSEVFVF9EWU5BTUlDX0ZJTFRFUixcbiAgICAgICAgICAgIHRvcCAgICAgOiBTUFJFQURTSEVFVF9UT1BfRklMVEVSLFxuICAgICAgICAgICAgdmFsdWUgICA6IFNQUkVBRFNIRUVUX1ZBTFVFX0ZJTFRFUlxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbnNwcmVhZHNoZWV0RmlsdGVycy5jdXN0b21PcGVyYXRvciA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBlcSAgOiBcImVxdWFsXCIsXG4gICAgICAgIGd0ICA6IFwiZ3JlYXRlclRoYW5cIixcbiAgICAgICAgZ3RlIDogXCJncmVhdGVyVGhhbk9yRXF1YWxcIixcbiAgICAgICAgbHQgIDogXCJsZXNzVGhhblwiLFxuICAgICAgICBsdGUgOiBcImxlc3NUaGFuT3JFcXVhbFwiLFxuICAgICAgICBuZSAgOiBcIm5vdEVxdWFsXCIsXG5cbiAgICAgICAgLy8gVGhlc2UgYXJlIG5vdCBpbiB0aGUgc3BlYywgYnV0IHNlZW1zIHRvIGJlIGhvdyBFeGNlbCBkb2VzXG4gICAgICAgIC8vIGl0IChzZWUgY3VzdG9tVmFsdWUgYmVsb3cpLiAgRm9yIHRoZSBub24tbmVnYXRlZCB2ZXJzaW9ucyxcbiAgICAgICAgLy8gdGhlIG9wZXJhdG9yIGF0dHJpYnV0ZSBpcyBtaXNzaW5nIGNvbXBsZXRlbHkuXG4gICAgICAgIGRvZXNub3RzdGFydHdpdGg6IFwibm90RXF1YWxcIixcbiAgICAgICAgZG9lc25vdGVuZHdpdGg6IFwibm90RXF1YWxcIixcbiAgICAgICAgZG9lc25vdGNvbnRhaW46IFwibm90RXF1YWxcIixcbiAgICAgICAgZG9lc25vdG1hdGNoOiBcIm5vdEVxdWFsXCJcbiAgICB9W2Yub3BlcmF0b3IudG9Mb3dlckNhc2UoKV07XG59O1xuXG5mdW5jdGlvbiBxdW90ZVNoZWV0KG5hbWUpIHtcbiAgICBpZiAoL15cXCcvLnRlc3QobmFtZSkpIHsgLy8gYXNzdW1lIGFscmVhZHkgcXVvdGVkLCB0aGUgU3ByZWFkc2hlZXQgZG9lcyBpdC5cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuICAgIGlmICgvXlthLXpfXVthLXowLTlfXSokL2kudGVzdChuYW1lKSkge1xuICAgICAgICByZXR1cm4gbmFtZTsgICAgICAgIC8vIG5vIG5lZWQgdG8gcXVvdGUgaXRcbiAgICB9XG4gICAgcmV0dXJuIFwiJ1wiICsgbmFtZS5yZXBsYWNlKC9cXHgyNy9nLCBcIlxcXFwnXCIpICsgXCInXCI7XG59XG5cbnNwcmVhZHNoZWV0RmlsdGVycy5jdXN0b21WYWx1ZSA9IGZ1bmN0aW9uKGYpIHtcbiAgICBmdW5jdGlvbiBlc2Moc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvKFsqP10pL2csIFwifiQxXCIpO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZi5vcGVyYXRvci50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgXCJzdGFydHN3aXRoXCI6XG4gICAgICAgIGNhc2UgXCJkb2Vzbm90c3RhcnR3aXRoXCI6XG4gICAgICAgICAgICByZXR1cm4gZXNjKGYudmFsdWUpICsgXCIqXCI7XG5cbiAgICAgICAgY2FzZSBcImVuZHN3aXRoXCI6XG4gICAgICAgIGNhc2UgXCJkb2Vzbm90ZW5kd2l0aFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiKlwiICsgZXNjKGYudmFsdWUpO1xuXG4gICAgICAgIGNhc2UgXCJjb250YWluc1wiOlxuICAgICAgICBjYXNlIFwiZG9lc25vdGNvbnRhaW5cIjpcbiAgICAgICAgICAgIHJldHVybiBcIipcIiArIGVzYyhmLnZhbHVlKSArIFwiKlwiO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZi52YWx1ZTtcbiAgICB9XG59O1xuXG5zcHJlYWRzaGVldEZpbHRlcnMuZHluYW1pY0ZpbHRlclR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcXVhcnRlcjEgIDogXCJRMVwiLFxuICAgICAgICBxdWFydGVyMiAgOiBcIlEyXCIsXG4gICAgICAgIHF1YXJ0ZXIzICA6IFwiUTNcIixcbiAgICAgICAgcXVhcnRlcjQgIDogXCJRNFwiLFxuICAgICAgICBqYW51YXJ5ICAgOiBcIk0xXCIsXG4gICAgICAgIGZlYnJ1YXJ5ICA6IFwiTTJcIixcbiAgICAgICAgbWFyY2ggICAgIDogXCJNM1wiLFxuICAgICAgICBhcHJpbCAgICAgOiBcIk00XCIsXG4gICAgICAgIG1heSAgICAgICA6IFwiTTVcIixcbiAgICAgICAganVuZSAgICAgIDogXCJNNlwiLFxuICAgICAgICBqdWx5ICAgICAgOiBcIk03XCIsXG4gICAgICAgIGF1Z3VzdCAgICA6IFwiTThcIixcbiAgICAgICAgc2VwdGVtYmVyIDogXCJNOVwiLFxuICAgICAgICBvY3RvYmVyICAgOiBcIk0xMFwiLFxuICAgICAgICBub3ZlbWJlciAgOiBcIk0xMVwiLFxuICAgICAgICBkZWNlbWJlciAgOiBcIk0xMlwiXG4gICAgfVt0eXBlLnRvTG93ZXJDYXNlKCldIHx8IHR5cGU7XG59O1xuXG5leHBvcnQge1xuICAgIFdvcmtib29rLFxuICAgIFdvcmtzaGVldFxufTtcbiJdLCJuYW1lcyI6WyJsZXQiLCJjb25zdCIsInRoaXMiLCJjdXJyZW50IiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQUEsSUFBSSxPQUFPLEdBQUc7SUFDVixPQUFPLEVBQUUsU0FBUyxRQUFRLEVBQUU7UUFDeEIsT0FBTyxRQUFRLENBQUM7S0FDbkI7Q0FDSixDQUFDOztBQUVGLElBQU0sZUFBZSxHQUFDOztBQUFBLGdCQUNsQixRQUFlLHNCQUFDLGtC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