import {
	Alert,
	Badge,
	Checkbox,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable/DataTable";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { makeData } from "../../data/makeData";
import type { Person } from "../../data/types";

const DATA = makeData(50);

export function Step05ColumnVisibility() {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			{ accessorKey: "id", header: "ID" },
			{ accessorKey: "name", header: "名前" },
			{ accessorKey: "age", header: "年齢" },
			{
				accessorKey: "status",
				header: "ステータス",
				cell: ({ getValue }) => {
					const s = getValue() as string;
					const color =
						s === "active" ? "green" : s === "pending" ? "yellow" : "gray";
					return (
						<Badge color={color} variant="light" size="sm">
							{s}
						</Badge>
					);
				},
			},
			{
				accessorKey: "price",
				header: "価格",
				cell: ({ getValue }) => `¥${(getValue() as number).toLocaleString()}`,
			},
			{
				accessorKey: "tax",
				header: "税額",
				cell: ({ getValue }) => `¥${(getValue() as number).toLocaleString()}`,
			},
			{ accessorKey: "createdAt", header: "作成日" },
		],
		[],
	);

	const table = useReactTable({
		data: DATA,
		columns,
		state: { columnVisibility },
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Stack gap="md">
			<Title order={2}>Step 05: Column Visibility</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>columnVisibility</code> state で列の表示/非表示を制御する
				</Text>
				<Text size="sm">
					• <code>row.getVisibleCells()</code> は非表示列を除いたセルのみ返す —
					DataTable は常にこれを使うので自動的に連動する
				</Text>
				<Text size="sm">
					• <code>column.getIsVisible()</code> /{" "}
					<code>column.toggleVisibility()</code> で列ごとに制御できる
				</Text>
			</Alert>

			<Paper withBorder p="md" radius="sm">
				<Stack gap="xs">
					<Text size="sm" fw={600}>
						列の表示/非表示
					</Text>
					<Group gap="md" wrap="wrap">
						{table.getAllLeafColumns().map((column) => (
							<Checkbox
								key={column.id}
								label={String(column.columnDef.header ?? column.id)}
								checked={column.getIsVisible()}
								onChange={column.getToggleVisibilityHandler()}
							/>
						))}
					</Group>
				</Stack>
			</Paper>

			<Text size="sm" c="dimmed">
				表示列数: {table.getVisibleLeafColumns().length} /{" "}
				{table.getAllLeafColumns().length}
			</Text>

			<DataTable table={table} striped withBorders />

			<DebugPanel table={table} />
		</Stack>
	);
}
