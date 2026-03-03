import {
	Alert,
	Badge,
	Group,
	Pagination,
	Select,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable/DataTable";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { makeData } from "../../data/makeData";
import type { Person } from "../../data/types";

// コンポーネント外で固定（ランダム再生成を防ぐ）
const DATA = makeData(50);

export function Step04Pagination() {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

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
		],
		[],
	);

	const table = useReactTable({
		data: DATA,
		columns,
		state: { pagination },
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const { pageIndex, pageSize } = table.getState().pagination;
	const pageCount = table.getPageCount();
	const totalRows = table.getCoreRowModel().rows.length;

	return (
		<Stack gap="md">
			<Title order={2}>Step 04: Pagination</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>getPaginationRowModel()</code> を pipeline
					に追加するとページネーションが有効になる
				</Text>
				<Text size="sm">
					• <code>pagination</code> state は{" "}
					<code>{"{ pageIndex: 0, pageSize: 10 }"}</code> の形式 — pageIndex は
					0 始まり
				</Text>
				<Text size="sm">
					• <code>table.getRowModel().rows</code> は現在ページ分のみ返す（Debug
					Panel で件数を確認！）
				</Text>
				<Text size="sm">
					• <code>table.getPrePaginationRowModel().rows.length</code>{" "}
					がページング前の全件数
				</Text>
			</Alert>

			<Group justify="space-between" align="flex-end">
				<Text size="sm" c="dimmed">
					全 {totalRows} 件 | ページ {pageIndex + 1} / {pageCount}
				</Text>
				<Select
					label="1ページの表示件数"
					value={String(pageSize)}
					onChange={(v) => {
						if (v) table.setPageSize(Number(v));
					}}
					data={["5", "10", "20", "50"].map((n) => ({
						value: n,
						label: `${n} 件`,
					}))}
					size="xs"
					w={130}
				/>
			</Group>

			<DataTable table={table} striped withBorders />

			<Group justify="center">
				<Pagination
					total={pageCount}
					value={pageIndex + 1}
					onChange={(page) => table.setPageIndex(page - 1)}
					size="sm"
				/>
			</Group>

			<DebugPanel table={table} />
		</Stack>
	);
}
