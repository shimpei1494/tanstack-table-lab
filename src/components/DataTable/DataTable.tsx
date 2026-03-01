import { ScrollArea, Table } from "@mantine/core";
import { flexRender } from "@tanstack/react-table";
import type { DataTableProps } from "./DataTable.types";

export function DataTable<T>({
	table,
	stickyHeader,
	striped,
	withBorders,
}: DataTableProps<T>) {
	return (
		<ScrollArea>
			<Table
				striped={striped}
				withTableBorder={withBorders}
				withColumnBorders={withBorders}
				stickyHeader={stickyHeader}
				highlightOnHover
			>
				<Table.Thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<Table.Tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<Table.Th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</Table.Th>
							))}
						</Table.Tr>
					))}
				</Table.Thead>
				<Table.Tbody>
					{table.getRowModel().rows.map((row) => (
						<Table.Tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<Table.Td key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</Table.Td>
							))}
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</ScrollArea>
	);
}
