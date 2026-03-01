import {
	Alert,
	Badge,
	Group,
	SegmentedControl,
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
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { makeStudentData, type Student } from "./studentData";

type DisplayMode = "raw" | "formatted";

export function Step01AccessorVsCell() {
	const [data] = useState(() => makeStudentData(20));
	const [mode, setMode] = useState<DisplayMode>("raw");
	const [sorting, setSorting] = useState<SortingState>([]);

	const columns = useMemo<ColumnDef<Student>[]>(
		() => [
			{ accessorKey: "name", header: "名前" },
			{ accessorKey: "math", header: "数学" },
			{ accessorKey: "english", header: "英語" },
			{ accessorKey: "science", header: "理科" },
			{
				id: "totalScore",
				header: ({ column }) => (
					<UnstyledButton
						onClick={column.getToggleSortingHandler()}
						style={{ cursor: "pointer", fontWeight: "bold" }}
					>
						合計点{" "}
						{column.getIsSorted() === "asc"
							? "▲"
							: column.getIsSorted() === "desc"
								? "▼"
								: "⇅"}
					</UnstyledButton>
				),
				accessorFn: (row) => row.math + row.english + row.science,
				cell:
					mode === "raw"
						? ({ getValue }) => getValue() as number
						: ({ getValue }) => {
								const score = getValue() as number;
								const color =
									score >= 240 ? "green" : score >= 180 ? "blue" : "gray";
								return (
									<Badge color={color} variant="light">
										{score}点
									</Badge>
								);
							},
			},
		],
		[mode],
	);

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<Stack gap="md">
			<Title order={2}>Step 01: Accessor vs Cell</Title>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>accessorFn</code> — TanStack Table
					が内部で使う値（ソート・フィルタの基準）
				</Text>
				<Text size="sm">
					• <code>cell</code> —
					画面の見た目だけを担う（単位・色・バッジなど自由に装飾できる）
				</Text>
				<Text size="sm">
					• <code>cell</code> をどれだけ変えても、ソートは{" "}
					<code>accessorFn</code> の値で動く
				</Text>
				<Text size="sm">
					• 「合計点
					⇅」でソートして、どちらのモードでも同じ順序になることを確認しよう
				</Text>
			</Alert>

			<Group align="center">
				<Text fw={500}>表示モード:</Text>
				<SegmentedControl
					value={mode}
					onChange={(v) => setMode(v as DisplayMode)}
					data={[
						{ label: "Mode A: 生の数値（cell = getValue()）", value: "raw" },
						{ label: "Mode B: バッジ表示（cell で装飾）", value: "formatted" },
					]}
				/>
			</Group>

			{mode === "raw" ? (
				<Alert color="gray" title="Mode A: cell = getValue()">
					<Text size="sm">
						<code>{"cell: ({ getValue }) => getValue()"}</code>
					</Text>
					<Text size="sm" mt="xs">
						accessorFn の値をそのまま表示。「合計点 ⇅」でソートしてみよう。
					</Text>
				</Alert>
			) : (
				<Alert color="blue" title="Mode B: cell でバッジ装飾">
					<Text size="sm">
						<code>{"cell: ({ getValue }) => <Badge>{score}点</Badge>"}</code>
					</Text>
					<Text size="sm" mt="xs">
						見た目はバッジに変わるが、「合計点 ⇅」でソートすると{" "}
						<strong>Mode A と同じ順序</strong>になる。 ソートは cell
						の表示に関係なく <code>accessorFn</code> の値で動くため。
					</Text>
				</Alert>
			)}

			<DataTable table={table} striped withBorders />
			<DebugPanel table={table} />
		</Stack>
	);
}
