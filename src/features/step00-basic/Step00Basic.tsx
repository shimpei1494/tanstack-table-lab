import { Alert, Stack, Text, Title } from "@mantine/core";
import type { ColumnDef } from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DataTable } from "../../components/DataTable/DataTable";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { makeData } from "../../data/makeData";
import type { Person } from "../../data/types";

export function Step00Basic() {
	const [data] = useState(() => makeData(50));

	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			{ accessorKey: "id", header: "ID" },
			{ accessorKey: "name", header: "名前" },
			{ accessorKey: "age", header: "年齢" },
			{ accessorKey: "price", header: "価格" },
			{ accessorKey: "tax", header: "税額" },
			{ accessorKey: "status", header: "ステータス" },
			{ accessorKey: "createdAt", header: "作成日" },
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Stack gap="md">
			<Title order={2}>Step 00: Basic（最小表示）</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>useReactTable()</code> で table instance を作成し、 DataTable
					に渡すだけで描画できる
				</Text>
				<Text size="sm">
					• DataTable は <code>table.getRowModel().rows</code>{" "}
					を使って描画する（ヘッドレス）
				</Text>
				<Text size="sm">
					• <code>getCoreRowModel</code> のみ設定した場合、全ての row count
					が同じ数になることを Debug Panel で確認しよう
				</Text>
			</Alert>

			<DataTable table={table} striped withBorders />
			<DebugPanel table={table} />
		</Stack>
	);
}
