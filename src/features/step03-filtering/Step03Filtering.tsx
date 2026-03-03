import {
	Alert,
	Badge,
	Divider,
	Group,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import {
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable/DataTable";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";

type Row = {
	name: string;
	age: number;
	score: number;
	status: "active" | "inactive" | "pending";
};

const FIXED_DATA: Row[] = [
	{ name: "Charlie", age: 32, score: 78, status: "pending" },
	{ name: "Alice", age: 25, score: 91, status: "active" },
	{ name: "Eve", age: 19, score: 55, status: "inactive" },
	{ name: "Bob", age: 28, score: 84, status: "active" },
	{ name: "Diana", age: 22, score: 67, status: "pending" },
	{ name: "Frank", age: 35, score: 42, status: "inactive" },
	{ name: "Grace", age: 29, score: 88, status: "active" },
	{ name: "Henry", age: 41, score: 73, status: "pending" },
];

export function Step03Filtering() {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	// columnFilters 配列から各列の値を取り出すヘルパー
	const nameFilter =
		(columnFilters.find((f) => f.id === "name")?.value as string) ?? "";
	const statusFilter =
		(columnFilters.find((f) => f.id === "status")?.value as string) ?? "";

	const setNameFilter = (value: string) => {
		setColumnFilters((prev) => {
			const rest = prev.filter((f) => f.id !== "name");
			return value ? [...rest, { id: "name", value }] : rest;
		});
	};

	const setStatusFilter = (value: string | null) => {
		setColumnFilters((prev) => {
			const rest = prev.filter((f) => f.id !== "status");
			return value ? [...rest, { id: "status", value }] : rest;
		});
	};

	const columns = useMemo<ColumnDef<Row>[]>(
		() => [
			{
				accessorKey: "name",
				header: "名前",
				// デフォルト filterFn は "includesString"（部分一致・大文字小文字無視）
			},
			{
				accessorKey: "age",
				header: "年齢",
			},
			{
				accessorKey: "score",
				header: "スコア",
			},
			{
				accessorKey: "status",
				header: "ステータス",
				filterFn: "equals", // 完全一致
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
		state: {
			columnFilters,
			globalFilter,
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(), // ← これを追加するとフィルタが有効になる
	});

	return (
		<Stack gap="md">
			<Title order={2}>Step 03: Filtering</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>getFilteredRowModel()</code> を pipeline
					に追加するとフィルタが有効になる
				</Text>
				<Text size="sm">
					• <code>columnFilters</code> state は{" "}
					<code>{'[{ id: "name", value: "..." }]'}</code> の配列 —
					複数列の条件を同時に保持できる
				</Text>
				<Text size="sm">
					• デフォルトの filterFn は <code>includesString</code>（部分一致）。
					status は <code>filterFn: &quot;equals&quot;</code>{" "}
					で完全一致にしている
				</Text>
				<Text size="sm">
					• <code>globalFilter</code> は全列を横断して検索。columnFilters
					と同時適用も可能
				</Text>
			</Alert>

			<Stack gap="xs">
				<Text fw={600} size="sm">
					列フィルタ（columnFilters）
				</Text>
				<Group gap="md">
					<TextInput
						label='名前（filterFn: "includesString" — 部分一致）'
						placeholder="例: a"
						value={nameFilter}
						onChange={(e) => setNameFilter(e.currentTarget.value)}
						style={{ flex: 1 }}
					/>
					<Select
						label='ステータス（filterFn: "equals" — 完全一致）'
						placeholder="すべて"
						data={[
							{ value: "active", label: "active" },
							{ value: "inactive", label: "inactive" },
							{ value: "pending", label: "pending" },
						]}
						value={statusFilter || null}
						onChange={setStatusFilter}
						clearable
						style={{ flex: 1 }}
					/>
				</Group>

				<Divider label="または" labelPosition="center" my="xs" />

				<TextInput
					label="グローバルフィルタ（全列を横断して部分一致）"
					placeholder="例: 2（年齢・スコアの数字にもヒットする）"
					value={globalFilter}
					onChange={(e) => setGlobalFilter(e.currentTarget.value)}
				/>
			</Stack>

			<Text size="xs" c="dimmed" ff="monospace">
				columnFilters: {JSON.stringify(columnFilters)}
				{globalFilter ? ` | globalFilter: "${globalFilter}"` : ""}
			</Text>

			<DataTable table={table} striped withBorders />
			<DebugPanel table={table} />
		</Stack>
	);
}
