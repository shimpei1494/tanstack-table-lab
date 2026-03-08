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
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable/DataTable";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { makeData } from "../../data/makeData";
import type { Person } from "../../data/types";

const DATA = makeData(50);

export function Step06RowSelection() {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={table.getIsAllPageRowsSelected()}
						indeterminate={table.getIsSomePageRowsSelected()}
						onChange={table.getToggleAllPageRowsSelectedHandler()}
						aria-label="全行を選択"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						disabled={!row.getCanSelect()}
						onChange={row.getToggleSelectedHandler()}
						aria-label="行を選択"
					/>
				),
				size: 40,
			},
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
			{ accessorKey: "createdAt", header: "作成日" },
		],
		[],
	);

	const table = useReactTable({
		data: DATA,
		columns,
		state: { rowSelection },
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		enableRowSelection: true,
	});

	const selectedRows = table.getSelectedRowModel().rows;

	return (
		<Stack gap="md">
			<Title order={2}>Step 06: Row Selection</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>rowSelection</code> state は{" "}
					<code>{"{ [rowIndex]: boolean }"}</code> の形で選択行を管理する
				</Text>
				<Text size="sm">
					• チェックボックス列は <code>accessorKey</code> を持たない "display
					column"（<code>id</code> のみ指定）
				</Text>
				<Text size="sm">
					• <code>table.getSelectedRowModel().rows</code> で選択行のみ取得できる
				</Text>
				<Text size="sm">
					• ヘッダーの <code>getToggleAllPageRowsSelectedHandler()</code>{" "}
					で全選択/全解除ができる
				</Text>
			</Alert>

			<Paper withBorder p="md" radius="sm">
				<Group gap="md" align="center">
					<Text size="sm" fw={600}>
						選択件数:
					</Text>
					<Badge size="lg" variant="filled">
						{selectedRows.length} / {DATA.length} 件
					</Badge>
					{selectedRows.length > 0 && (
						<Text size="sm" c="dimmed" style={{ flex: 1 }}>
							選択 ID:{" "}
							{selectedRows.map((r) => r.original.id.slice(0, 8)).join(", ")}
						</Text>
					)}
				</Group>
			</Paper>

			<DataTable table={table} striped withBorders />

			<DebugPanel table={table} />
		</Stack>
	);
}
