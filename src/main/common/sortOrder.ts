/**
 * Enumeration representing the sorting order of a datagrid column. It is a constant Enum,
 * i.e. each value needs to be treated as a `number`, starting at index 0.
 *
 * @export
 * @enum {number}
 */
export enum SortOrder {
    Unsorted = 0,
    Asc = 1,
    Desc = -1,
}
