import { Node, NodeType } from 'prosemirror-model';
/**
 * Creates a table.
 * @returns Node
 */
export declare const createTable: (nodes: {
    table: NodeType<any>;
    table_row: NodeType<any>;
    table_cell: NodeType<any>;
}, rows: number, columns: number) => Node<any>;
