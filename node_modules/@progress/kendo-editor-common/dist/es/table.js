/**
 * Creates a table.
 * @returns Node
 */
export var createTable = function (nodes, rows, columns) {
    var table = nodes.table, table_row = nodes.table_row, table_cell = nodes.table_cell;
    var tableRows = [];
    var cells;
    for (var r = 0; r < rows + 1; r++) {
        cells = [];
        for (var c = 0; c < columns + 1; c++) {
            cells.push(table_cell.createAndFill());
        }
        tableRows.push(table_row.createAndFill(undefined, cells));
    }
    return table.createAndFill(undefined, tableRows);
};
