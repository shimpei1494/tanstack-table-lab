import {
	Alert,
	Badge,
	Grid,
	Stack,
	Text,
	Title,
	UnstyledButton,
} from "@mantine/core";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable/DataTable";

type Row = { name: string; age: number; score: number; status: string };

// ソートの効果がわかりやすい固定データ（意図的にバラバラな順序）
const FIXED_DATA: Row[] = [
	{ name: "Charlie", age: 32, score: 78, status: "pending" },
	{ name: "Alice", age: 25, score: 91, status: "active" },
	{ name: "Eve", age: 19, score: 55, status: "inactive" },
	{ name: "Bob", age: 28, score: 84, status: "active" },
	{ name: "Diana", age: 22, score: 67, status: "pending" },
	{ name: "Frank", age: 35, score: 42, status: "inactive" },
];

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
	if (sorted === "asc") return <span>▲</span>;
	if (sorted === "desc") return <span>▼</span>;
	return <span style={{ opacity: 0.3 }}>⇅</span>;
}

function SortableTable({ withSortedModel }: { withSortedModel: boolean }) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const columns = useMemo<ColumnDef<Row>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<UnstyledButton
						onClick={column.getToggleSortingHandler()}
						style={{ cursor: "pointer", fontWeight: "bold" }}
					>
						名前 <SortIcon sorted={column.getIsSorted()} />
					</UnstyledButton>
				),
			},
			{
				accessorKey: "age",
				header: ({ column }) => (
					<UnstyledButton
						onClick={column.getToggleSortingHandler()}
						style={{ cursor: "pointer", fontWeight: "bold" }}
					>
						年齢 <SortIcon sorted={column.getIsSorted()} />
					</UnstyledButton>
				),
			},
			{
				accessorKey: "score",
				header: ({ column }) => (
					<UnstyledButton
						onClick={column.getToggleSortingHandler()}
						style={{ cursor: "pointer", fontWeight: "bold" }}
					>
						スコア <SortIcon sorted={column.getIsSorted()} />
					</UnstyledButton>
				),
			},
			{
				accessorKey: "status",
				header: ({ column }) => (
					<UnstyledButton
						onClick={column.getToggleSortingHandler()}
						style={{ cursor: "pointer", fontWeight: "bold" }}
					>
						ステータス <SortIcon sorted={column.getIsSorted()} />
					</UnstyledButton>
				),
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
		],
		[],
	);

	const table = useReactTable({
		data: FIXED_DATA,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: withSortedModel ? getSortedRowModel() : undefined,
	});

	return (
		<Stack gap="xs">
			<Text size="xs" c="dimmed" ff="monospace">
				sorting:{" "}
				{sorting.length > 0
					? sorting.map((s) => `${s.id} ${s.desc ? "desc" : "asc"}`).join(", ")
					: "(なし)"}
			</Text>
			<DataTable table={table} striped withBorders />
		</Stack>
	);
}

export function Step02Sorting() {
	return (
		<Stack gap="md">
			<Title order={2}>Step 02: Sorting</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>getSortedRowModel()</code> を pipeline
					に追加することでソートが有効になる
				</Text>
				<Text size="sm">
					• ヘッダークリックで <code>sorting</code> state
					は両テーブルともに更新される
				</Text>
				<Text size="sm">
					• 右のテーブルは state が変わっても行が並び替わらない — pipeline に
					getSortedRowModel がないため
				</Text>
			</Alert>

			<Grid>
				<Grid.Col span={6}>
					<Stack gap="xs">
						<Text fw={600} c="blue" size="sm">
							✅ getSortedRowModel: あり → ソートされる
						</Text>
						<SortableTable withSortedModel={true} />
					</Stack>
				</Grid.Col>
				<Grid.Col span={6}>
					<Stack gap="xs">
						<Text fw={600} c="red" size="sm">
							❌ getSortedRowModel: なし → ソートされない
						</Text>
						<SortableTable withSortedModel={false} />
					</Stack>
				</Grid.Col>
			</Grid>
		</Stack>
	);
}
