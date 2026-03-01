import type { Person, Status } from "./types";

const names = [
	"Alice Johnson",
	"Bob Smith",
	"Charlie Brown",
	"Diana Prince",
	"Eve Wilson",
	"Frank Miller",
	"Grace Lee",
	"Henry Davis",
	"Iris Chen",
	"Jack Thompson",
	"Karen White",
	"Leo Garcia",
	"Mia Martinez",
	"Noah Anderson",
	"Olivia Taylor",
	"Paul Walker",
	"Quinn Reed",
	"Rachel Green",
	"Sam Harris",
	"Tina Turner",
];

const statuses: Status[] = ["active", "inactive", "pending"];

function randomItem<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function makePerson(id: number): Person {
	const price = Math.floor(Math.random() * 50000) + 1000;
	const tax = Math.floor(Math.random() * 8000) + 100;
	const daysAgo = Math.floor(Math.random() * 365);
	const createdAt = new Date(
		Date.now() - daysAgo * 24 * 60 * 60 * 1000,
	).toISOString();

	return {
		id: String(id),
		name: randomItem(names),
		age: Math.floor(Math.random() * 50) + 18,
		price,
		tax,
		status: randomItem(statuses),
		createdAt,
	};
}

/** 通常用（50件）または指定件数 */
export function makeData(count = 50): Person[] {
	return Array.from({ length: count }, (_, i) => makePerson(i + 1));
}

/** Step08 virtual用（10,000件） */
export function makeLargeData(): Person[] {
	return makeData(10_000);
}
