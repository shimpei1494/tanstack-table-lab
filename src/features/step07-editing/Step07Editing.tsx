import {
	Alert,
	NumberInput,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable/DataTable";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { makeData } from "../../data/makeData";
import type { Person, Status } from "../../data/types";

// TanStack Table の meta 型を拡張（updateData を型安全に使えるようにする）
declare module "@tanstack/react-table" {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
	{ value: "pending", label: "Pending" },
];

export function Step07Editing() {
	const [data, setData] = useState<Person[]>(() => makeData(20));

	// rowIndex と columnId を指定して data state を更新する関数
	// table の meta として渡すことで cell 内から呼び出せる
	function updateData(rowIndex: number, columnId: string, value: unknown) {
		setData((prev) =>
			prev.map((row, index) =>
				index === rowIndex ? { ...row, [columnId]: value } : row,
			),
		);
	}

	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			{ accessorKey: "id", header: "ID", enableEditing: false },
			{
				accessorKey: "name",
				header: "名前",
				cell: ({ getValue, row, column, table }) => (
					<TextInput
						value={getValue() as string}
						onChange={(e) =>
							table.options.meta?.updateData(
								row.index,
								column.id,
								e.currentTarget.value,
							)
						}
						size="xs"
						styles={{ input: { minWidth: 120 } }}
					/>
				),
			},
			{
				accessorKey: "age",
				header: "年齢",
				cell: ({ getValue, row, column, table }) => (
					<NumberInput
						value={getValue() as number}
						onChange={(value) =>
							table.options.meta?.updateData(row.index, column.id, value)
						}
						size="xs"
						min={0}
						max={120}
						styles={{ input: { width: 70 } }}
					/>
				),
			},
			{
				accessorKey: "status",
				header: "ステータス",
				cell: ({ getValue, row, column, table }) => (
					<Select
						value={getValue() as string}
						onChange={(value) =>
							table.options.meta?.updateData(row.index, column.id, value)
						}
						data={STATUS_OPTIONS}
						size="xs"
						styles={{ input: { minWidth: 110 } }}
					/>
				),
			},
			{
				accessorKey: "price",
				header: "価格",
				cell: ({ getValue, row, column, table }) => (
					<NumberInput
						value={getValue() as number}
						onChange={(value) =>
							table.options.meta?.updateData(row.index, column.id, value)
						}
						size="xs"
						min={0}
						prefix="¥"
						thousandSeparator=","
						styles={{ input: { width: 110 } }}
					/>
				),
			},
			{
				accessorKey: "tax",
				header: "税額",
				cell: ({ getValue, row, column, table }) => (
					<NumberInput
						value={getValue() as number}
						onChange={(value) =>
							table.options.meta?.updateData(row.index, column.id, value)
						}
						size="xs"
						min={0}
						prefix="¥"
						thousandSeparator=","
						styles={{ input: { width: 90 } }}
					/>
				),
			},
			{ accessorKey: "createdAt", header: "作成日" },
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: { updateData },
	});

	return (
		<Stack gap="md">
			<Title order={2}>Step 07: Editing</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• TanStack Table はデータを管理しない — <code>row.original</code>{" "}
					を直接書き換えず、外部の <code>data</code> state を更新する
				</Text>
				<Text size="sm">
					• <code>meta: {"{ updateData }"}</code> を table options
					に渡すことで、
					<code>cell</code> 内の任意の場所から呼び出せる
				</Text>
				<Text size="sm">
					• <code>updateData(rowIndex, columnId, value)</code> で{" "}
					<code>setData</code> を呼ぶ → React 再レンダリング → 表が自動更新
				</Text>
				<Text size="sm">
					• <code>getValue()</code> を input の value に使うことで、accessor
					の値と表示が常に一致する
				</Text>
			</Alert>

			<DataTable table={table} withBorders />

			<DebugPanel table={table} />
		</Stack>
	);
}
