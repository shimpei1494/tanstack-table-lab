import type { Table } from "@tanstack/react-table";

export interface DataTableProps<T> {
	table: Table<T>;
	stickyHeader?: boolean;
	striped?: boolean;
	withBorders?: boolean;
}
