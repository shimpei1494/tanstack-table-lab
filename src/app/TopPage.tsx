import {
	Badge,
	Button,
	Card,
	Group,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Link } from "react-router-dom";

const STEPS: { path: string; label: string; desc: string; badge?: string }[] = [
	{
		path: "/step/00",
		label: "Step 00: Basic",
		desc: "table instance と Mantine Table の接続。getRowModel() の基本。",
	},
	{
		path: "/step/01",
		label: "Step 01: Accessor vs Cell",
		desc: "accessorFn の値（ソート基準）と cell（表示）のズレを体験。",
	},
	{
		path: "/step/02",
		label: "Step 02: Sorting",
		desc: "getSortedRowModel で row model pipeline を体感。",
	},
	{
		path: "/step/03",
		label: "Step 03: Filtering",
		desc: "columnFilters / globalFilter と filtered row model の関係。",
	},
	{
		path: "/step/04",
		label: "Step 04: Pagination",
		desc: "getPaginationRowModel でクライアントサイドページング。",
	},
	{
		path: "/step/05",
		label: "Step 05: Column Visibility",
		desc: "row.getVisibleCells() の意味を列ON/OFFで体感。",
	},
	{
		path: "/step/06",
		label: "Step 06: Row Selection",
		desc: "rowSelection state と selected row model。",
	},
	{
		path: "/step/07",
		label: "Step 07: Editing",
		desc: "外部 React state を更新することで編集を実現。",
	},
	{
		path: "/step/08",
		label: "Step 08: Virtual",
		desc: "10,000件でも軽い仮想スクロール。row model と描画の分離。",
	},
	{
		path: "/step/09",
		label: "Step 09: Grouping + Expanding",
		desc: "getGroupedRowModel / getExpandedRowModel でグループ化と開閉。aggregationFn で平均値を集計。",
	},
	{
		path: "/step/10",
		label: "Step 10: Fullscreen",
		desc: "Mantine の useFullscreen フックでテーブルを全画面表示。TanStack Table のロジックは変更不要。",
		badge: "番外編",
	},
];

export function TopPage() {
	return (
		<Stack gap="lg">
			<div>
				<Title order={1}>TanStack Table Lab</Title>
				<Text c="dimmed" mt="xs">
					TanStack Table の学習リポジトリ。Step ごとに機能を追加して、
					ヘッドレステーブルの仕組みを体験的に理解する。
				</Text>
			</div>

			<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
				{STEPS.map(({ path, label, desc, badge }) => (
					<Card key={path} withBorder padding="md">
						<Group gap="xs" mb="xs">
							<Text fw={700} size="sm">
								{label}
							</Text>
							{badge && (
								<Badge size="xs" variant="light" color="orange">
									{badge}
								</Badge>
							)}
						</Group>
						<Text size="xs" c="dimmed" mb="md">
							{desc}
						</Text>
						<Button component={Link} to={path} size="xs" variant="light">
							開く
						</Button>
					</Card>
				))}
			</SimpleGrid>
		</Stack>
	);
}
