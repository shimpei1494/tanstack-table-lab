import { Stack, Text, Title } from "@mantine/core";

export function Step01AccessorVsCell() {
	return (
		<Stack gap="md">
			<Title order={2}>Step 01: Accessor vs Cell</Title>
			<Text c="dimmed">
				Coming Soon — accessorFn の値（ソート基準）と
				cell（表示）のズレを体験する
			</Text>
		</Stack>
	);
}
