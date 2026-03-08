import {
	Alert,
	Badge,
	Button,
	Group,
	ScrollArea,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import type {
	ColumnDef,
	ExpandedState,
	GroupingState,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getGroupedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { makeData } from "../../data/makeData";
import type { Person } from "../../data/types";

export function Step09Grouping() {
	const [data] = useState<Person[]>(() => makeData(50));

	// グルーピングは "status" 固定（UI から変更不可）
	const [grouping] = useState<GroupingState>(["status"]);

	// 展開状態（controlled）
	const [expanded, setExpanded] = useState<ExpandedState>({});

	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "status",
				header: "ステータス",
				// この列だけグルーピングを有効化
				enableGrouping: true,
				cell: ({ row, getValue }) => {
					// グループ行 → 展開ボタン + 値 + 件数バッジ
					if (row.getIsGrouped()) {
						return (
							<Group gap="xs" wrap="nowrap">
								<button
									type="button"
									onClick={row.getToggleExpandedHandler()}
									style={{
										cursor: "pointer",
										background: "none",
										border: "none",
										fontSize: 13,
										lineHeight: 1,
										padding: "2px 4px",
										color: "var(--mantine-color-dimmed)",
									}}
								>
									{row.getIsExpanded() ? "▼" : "▶"}
								</button>
								<Text fw={700} size="sm" component="span">
									{String(getValue())}
								</Text>
								<Badge size="sm" variant="filled" color="blue">
									{row.subRows.length} 件
								</Badge>
							</Group>
						);
					}
					// 葉ノード行 → 通常値
					return String(getValue());
				},
			},
			{
				accessorKey: "name",
				header: "名前",
				enableGrouping: false,
			},
			{
				accessorKey: "age",
				header: "年齢",
				enableGrouping: false,
				// グループ行での集計方法
				aggregationFn: "mean",
				// グループ行のセルに表示する内容
				aggregatedCell: ({ getValue }) => (
					<Text size="sm" c="teal" fw={600}>
						平均 {getValue<number>().toFixed(1)} 歳
					</Text>
				),
			},
			{
				accessorKey: "price",
				header: "価格",
				enableGrouping: false,
				cell: ({ getValue }) => `¥${(getValue<number>()).toLocaleString()}`,
			},
			{
				accessorKey: "createdAt",
				header: "作成日",
				enableGrouping: false,
				cell: ({ getValue }) => getValue<string>().slice(0, 10),
			},
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		state: { grouping, expanded },
		// grouping は固定なので onGroupingChange は不要
		onExpandedChange: setExpanded,
		getCoreRowModel: getCoreRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
	});

	const rows = table.getRowModel().rows;
	const groupedRows = table.getGroupedRowModel().rows;

	return (
		<Stack gap="md">
			<Title order={2}>Step 09: Grouping + Expanding</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>getGroupedRowModel()</code> が status
					列でデータをグループ化する —
					グループ行（GroupedRow）と子行（LeafRow）の 2 層構造になる
				</Text>
				<Text size="sm">
					• <code>getExpandedRowModel()</code> が展開/折りたたみを管理し、
					<code>expanded</code> state で制御する
				</Text>
				<Text size="sm">
					• <code>cell.getIsGrouped()</code> /{" "}
					<code>cell.getIsAggregated()</code> /{" "}
					<code>cell.getIsPlaceholder()</code>{" "}
					でセル種別を判定して描画を切り替える
				</Text>
				<Text size="sm">
					• <code>aggregationFn: "mean"</code> を設定した age
					列は、グループ行で平均値が自動計算される
				</Text>
			</Alert>

			{/* コントロール */}
			<Group>
				<Button
					variant="light"
					size="sm"
					onClick={() => table.toggleAllRowsExpanded(true)}
				>
					▼ 全展開
				</Button>
				<Button
					variant="light"
					size="sm"
					onClick={() => table.toggleAllRowsExpanded(false)}
				>
					▶ 全折りたたみ
				</Button>
				<Badge variant="light" color="gray">
					グループ数: {groupedRows.length}
				</Badge>
				<Badge variant="light" color="teal">
					表示行数: {rows.length}
				</Badge>
			</Group>

			{/* テーブル本体（カスタム描画） */}
			<ScrollArea>
				<Table withTableBorder withColumnBorders>
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
						{rows.map((row) => (
							<Table.Tr
								key={row.id}
								bg={
									row.getIsGrouped() ? "var(--mantine-color-blue-0)" : undefined
								}
							>
								{row.getVisibleCells().map((cell, cellIndex) => (
									<Table.Td
										key={cell.id}
										// 葉ノードの先頭セルにインデントを追加
										pl={
											!row.getIsGrouped() && row.depth > 0 && cellIndex === 0
												? "xl"
												: undefined
										}
									>
										{cell.getIsGrouped()
											? // グループ列（status）のセル — cell 定義に toggle ボタンを含む
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)
											: cell.getIsAggregated()
												? // 集計セル（age の平均など）— aggregatedCell 定義を優先
													flexRender(
														cell.column.columnDef.aggregatedCell ??
															cell.column.columnDef.cell,
														cell.getContext(),
													)
												: cell.getIsPlaceholder()
													? // グループ行の非集計セル → 空表示
														null
													: // 通常の葉ノードセル
														flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
									</Table.Td>
								))}
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</ScrollArea>

			<DebugPanel table={table} />
		</Stack>
	);
}
