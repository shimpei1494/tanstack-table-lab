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
import { useFullscreen } from "@mantine/hooks";
import type { ColumnDef } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { makeData } from "../../data/makeData";
import type { Person } from "../../data/types";

export function Step10Fullscreen() {
	const [data] = useState<Person[]>(() => makeData(100));

	// useFullscreen: ref を付けた要素をブラウザの Fullscreen API で全画面化する
	const { ref, toggle, fullscreen } = useFullscreen<HTMLDivElement>();

	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			{ accessorKey: "id", header: "ID" },
			{ accessorKey: "name", header: "名前" },
			{ accessorKey: "age", header: "年齢" },
			{ accessorKey: "status", header: "ステータス" },
			{
				accessorKey: "price",
				header: "価格",
				cell: ({ getValue }) => `¥${(getValue<number>()).toLocaleString()}`,
			},
			{ accessorKey: "tax", header: "税額" },
			{
				accessorKey: "createdAt",
				header: "作成日",
				cell: ({ getValue }) => getValue<string>().slice(0, 10),
			},
		],
		[],
	);

	// ★ TanStack Table のロジックはまったく変更不要
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const rows = table.getRowModel().rows;

	return (
		<Stack gap="md">
			<Title order={2}>Step 10: Fullscreen Table</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>useFullscreen()</code>（@mantine/hooks）はブラウザの
					Fullscreen API をラップしたフック — <code>ref</code>{" "}
					を付けた要素だけを全画面化する
				</Text>
				<Text size="sm">
					• TanStack Table のロジック（data / columns /
					useReactTable）は一切変更不要 — 全画面演出は UI 側の責務
				</Text>
				<Text size="sm">
					• DataTable
					コンポーネント自体も変更不要という設計を維持しつつ、インライン描画で高さ制御を行っている
				</Text>
			</Alert>

			{/*
			 * ★ この div が全画面化の対象
			 * ref を付けるだけで useFullscreen が管理する
			 */}
			<div
				ref={ref}
				style={{
					background: "var(--mantine-color-body)",
					padding: fullscreen ? 16 : 0,
					boxSizing: "border-box",
				}}
			>
				{/* ヘッダーバー */}
				<Group justify="space-between" mb="sm">
					<Group gap="sm">
						<Badge variant="light" color={fullscreen ? "teal" : "gray"}>
							{fullscreen ? "全画面モード" : "通常モード"}
						</Badge>
						<Text size="sm" c="dimmed">
							{data.length} 件
						</Text>
					</Group>
					<Button onClick={toggle} variant="light" size="sm">
						{fullscreen ? "⊡ 通常表示に戻す" : "⛶ 全画面表示"}
					</Button>
				</Group>

				{/*
				 * テーブル描画
				 * 全画面時: ScrollArea の高さを calc(100vh - ヘッダー分) に設定
				 * 通常時: 固定高さ 500px
				 */}
				<ScrollArea h={fullscreen ? "calc(100vh - 80px)" : 500}>
					<Table
						withTableBorder
						withColumnBorders
						stickyHeader={fullscreen}
						highlightOnHover
						striped
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
							{rows.map((row) => (
								<Table.Tr key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<Table.Td key={cell.id}>
											{flexRender(
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
			</div>

			{/* DebugPanel は全画面時には ref div の外側にあるため自動的に非表示 */}
			{!fullscreen && <DebugPanel table={table} />}
		</Stack>
	);
}
