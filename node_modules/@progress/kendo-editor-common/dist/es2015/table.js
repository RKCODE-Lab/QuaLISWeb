/**
 * Creates a table.
 * @returns Node
 */
export const createTable = (nodes, rows, columns) => {
    const { table, table_row, table_cell } = nodes;
    const tableRows = [];
    let cells;
    for (let r = 0; r < rows + 1; r++) {
        cells = [];
        for (let c = 0; c < columns + 1; c++) {
            cells.push(table_cell.createAndFill());
        }
        tableRows.push(table_row.createAndFill(undefined, cells));
    }
    return table.createAndFill(undefined, tableRows);
};
