import {
	ActionIcon,
	AppShell,
	Group,
	NavLink,
	Text,
	Title,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Link, Outlet, useLocation } from "react-router-dom";

const NAV_ITEMS = [
	{ path: "/", label: "トップ", exact: true },
	{ path: "/step/00", label: "Step 00: Basic" },
	{ path: "/step/01", label: "Step 01: Accessor vs Cell" },
	{ path: "/step/02", label: "Step 02: Sorting" },
	{ path: "/step/03", label: "Step 03: Filtering" },
	{ path: "/step/04", label: "Step 04: Pagination" },
	{ path: "/step/05", label: "Step 05: Column Visibility" },
	{ path: "/step/06", label: "Step 06: Row Selection" },
	{ path: "/step/07", label: "Step 07: Editing" },
	{ path: "/step/08", label: "Step 08: Virtual" },
	{ path: "/step/09", label: "Step 09: Grouping + Expanding" },
	{ path: "/step/10", label: "Step 10: Fullscreen" },
];

function ColorSchemeToggle() {
	const { setColorScheme } = useMantineColorScheme();
	const computed = useComputedColorScheme("dark");

	return (
		<ActionIcon
			variant="subtle"
			onClick={() => setColorScheme(computed === "dark" ? "light" : "dark")}
			aria-label="テーマ切り替え"
		>
			{computed === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
		</ActionIcon>
	);
}

export function Shell() {
	const { pathname } = useLocation();

	return (
		<AppShell navbar={{ width: 240, breakpoint: "sm" }} padding="md">
			<AppShell.Navbar p="sm">
				<Group justify="space-between" mb="xs">
					<Title order={5}>TanStack Table Lab</Title>
					<ColorSchemeToggle />
				</Group>
				<Text size="xs" c="dimmed" mb="md">
					学習リポジトリ
				</Text>
				{NAV_ITEMS.map(({ path, label, exact }) => (
					<NavLink
						key={path}
						component={Link}
						to={path}
						label={label}
						active={exact ? pathname === path : pathname === path}
						mb={2}
					/>
				))}
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
