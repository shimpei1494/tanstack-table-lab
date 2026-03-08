import {
	Code,
	Group,
	Paper,
	ScrollArea,
	Stack,
	Switch,
	Text,
} from "@mantine/core";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";

interface DebugPanelProps<T> {
	table: Table<T>;
}

export function DebugPanel<T>({ table }: DebugPanelProps<T>) {
	const [visible, setVisible] = useState(true);

	const coreCount = table.getCoreRowModel().rows.length;
	const filteredCount = table.getFilteredRowModel().rows.length;
	const sortedCount = table.getSortedRowModel().rows.length;
	const prePaginationCount = table.getPrePaginationRowModel().rows.length;
	const finalCount = table.getRowModel().rows.length;
	const selectedCount = table.getSelectedRowModel().rows.length;

	return (
		<Paper withBorder p="md" mt="md">
			<Group justify="space-between" mb="xs">
				<Text fw={700} size="sm">
					Debug Panel
				</Text>
				<Switch
					checked={visible}
					onChange={(e) => setVisible(e.currentTarget.checked)}
					label="表示"
					size="sm"
				/>
			</Group>

			{visible && (
				<Stack gap="xs">
					<Text size="xs" fw={600} c="dimmed">
						Row Counts
					</Text>
					<Group gap="xl">
						<Text size="xs">Core: {coreCount}</Text>
						<Text size="xs">Filtered: {filteredCount}</Text>
						<Text size="xs">Sorted: {sortedCount}</Text>
						<Text size="xs">Pre-pagination: {prePaginationCount}</Text>
						<Text size="xs" fw={700}>
							Final (getRowModel): {finalCount}
						</Text>
						{selectedCount > 0 && (
							<Text size="xs" c="blue" fw={700}>
								Selected: {selectedCount}
							</Text>
						)}
					</Group>

					<Text size="xs" fw={600} c="dimmed" mt="xs">
						Table State
					</Text>
					<ScrollArea h={200}>
						<Code block fz="xs">
							{JSON.stringify(table.getState(), null, 2)}
						</Code>
					</ScrollArea>
				</Stack>
			)}
		</Paper>
	);
}
