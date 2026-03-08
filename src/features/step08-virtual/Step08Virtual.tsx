import {
	Alert,
	Badge,
	Button,
	Center,
	Group,
	Loader,
	Modal,
	ScrollArea,
	Stack,
	Switch,
	Table,
	Text,
	Title,
} from "@mantine/core";
import type { ColumnDef } from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";
import { DebugPanel } from "../../components/DebugPanel/DebugPanel";
import { makeLargeData } from "../../data/makeData";
import type { Person } from "../../data/types";

export function Step08Virtual() {
	const [data] = useState<Person[]>(() => makeLargeData());
	const [isVirtualized, setIsVirtualized] = useState(true);
	const [showConfirm, setShowConfirm] = useState(false);
	const [isRendering, setIsRendering] = useState(false);

	// 重いレンダー完了後に isRendering を false にするフラグ
	const clearRenderingRef = useRef(false);

	// 仮想化 ON に戻す（即時）
	function handleToggleOn() {
		setIsVirtualized(true);
	}

	// 仮想化 OFF の確認を承諾 → ローディング表示してから重いレンダーを開始
	function handleConfirmOff() {
		setShowConfirm(false);
		setIsRendering(true);
		// ダブル rAF: 1フレーム目でローディング UI を描画し、
		// 2フレーム目で 10,000 行のレンダーを開始する
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				clearRenderingRef.current = true;
				setIsVirtualized(false);
			});
		});
	}

	// 重いレンダー完了後に isRendering を解除する
	useEffect(() => {
		if (clearRenderingRef.current) {
			clearRenderingRef.current = false;
			setIsRendering(false);
		}
	});

	const columns = useMemo<ColumnDef<Person>[]>(
		() => [
			{ accessorKey: "id", header: "ID" },
			{ accessorKey: "name", header: "名前" },
			{ accessorKey: "age", header: "年齢" },
			{ accessorKey: "status", header: "ステータス" },
			{ accessorKey: "price", header: "価格" },
			{ accessorKey: "tax", header: "税額" },
			{ accessorKey: "createdAt", header: "作成日" },
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const rows = table.getRowModel().rows;

	// --- 仮想化あり ---
	const viewportRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => viewportRef.current,
		estimateSize: () => 35,
		overscan: 20,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();
	const totalSize = rowVirtualizer.getTotalSize();
	const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
	const paddingBottom =
		virtualItems.length > 0
			? totalSize - virtualItems[virtualItems.length - 1].end
			: 0;

	const domRowCount = isVirtualized ? virtualItems.length : rows.length;

	return (
		<Stack gap="md">
			<Title order={2}>Step 08: Virtual</Title>

			{/* 仮想化OFFの確認ダイアログ */}
			<Modal
				opened={showConfirm}
				onClose={() => setShowConfirm(false)}
				title="⚠️ 仮想化を無効にしますか？"
				centered
			>
				<Stack gap="md">
					<Alert color="orange" variant="light">
						<Text size="sm">
							10,000 行すべてを DOM
							に生成します。ブラウザが数秒間フリーズする可能性があります。
						</Text>
						<Text size="sm" mt="xs">
							これは「仮想化が必要な理由」を体感するための操作です。
						</Text>
					</Alert>
					<Group justify="flex-end">
						<Button variant="default" onClick={() => setShowConfirm(false)}>
							キャンセル
						</Button>
						<Button color="orange" onClick={handleConfirmOff}>
							理解した上で OFF にする
						</Button>
					</Group>
				</Stack>
			</Modal>

			<Alert title="学習ポイント" color="blue" variant="light">
				<Text size="sm">
					• <code>@tanstack/react-virtual</code> は描画最適化ツール — TanStack
					Table の row model 計算とは完全に分離している
				</Text>
				<Text size="sm">
					• <code>table.getRowModel().rows</code> で全 10,000
					行を参照しつつ、DOM に描画するのはビューポート内の数十行のみ
				</Text>
				<Text size="sm">
					•
					上下に高さだけのスペーサー行を置くことで、スクロールバーの位置と挙動を全件表示と同じに保つ
				</Text>
				<Text size="sm">
					• <code>overscan: 20</code>{" "}
					でビューポート外に余分にレンダリングし、スクロール時のちらつきを防ぐ
				</Text>
			</Alert>

			{/* コントロールバー */}
			<Group align="center">
				<Switch
					label="仮想化（useVirtualizer）"
					checked={isVirtualized}
					disabled={isRendering}
					onChange={(e) => {
						if (e.currentTarget.checked) {
							handleToggleOn();
						} else {
							setShowConfirm(true);
						}
					}}
					color="teal"
				/>
				<Badge color={isVirtualized ? "teal" : "red"} variant="light" size="lg">
					DOM に描画中: {isRendering ? "..." : domRowCount.toLocaleString()} 行
					／ 全 {rows.length.toLocaleString()} 行
				</Badge>
			</Group>

			{/* テーブル本体 or ローディング */}
			{isRendering ? (
				<Center
					h={500}
					style={{
						border: "1px solid var(--mantine-color-gray-3)",
						borderRadius: 8,
					}}
				>
					<Stack align="center" gap="sm">
						<Loader size="lg" />
						<Text size="sm" c="dimmed">
							10,000 行の DOM を生成中...
						</Text>
					</Stack>
				</Center>
			) : isVirtualized ? (
				// --- 仮想化あり: ビューポート内の行だけ描画 ---
				<ScrollArea h={500} viewportRef={viewportRef}>
					<Table withTableBorder withColumnBorders stickyHeader>
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
							{paddingTop > 0 && (
								<Table.Tr>
									<Table.Td
										colSpan={columns.length}
										style={{ height: paddingTop, padding: 0 }}
									/>
								</Table.Tr>
							)}
							{virtualItems.map((virtualRow) => {
								const row = rows[virtualRow.index];
								return (
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
								);
							})}
							{paddingBottom > 0 && (
								<Table.Tr>
									<Table.Td
										colSpan={columns.length}
										style={{ height: paddingBottom, padding: 0 }}
									/>
								</Table.Tr>
							)}
						</Table.Tbody>
					</Table>
				</ScrollArea>
			) : (
				// --- 仮想化なし: 全行を DOM に描画 ---
				<ScrollArea h={500}>
					<Table withTableBorder withColumnBorders stickyHeader>
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
			)}

			<DebugPanel table={table} />
		</Stack>
	);
}
