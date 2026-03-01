export type Student = {
	id: string;
	name: string;
	math: number;
	english: number;
	science: number;
};

const names = [
	"Alice",
	"Bob",
	"Charlie",
	"Diana",
	"Eve",
	"Frank",
	"Grace",
	"Henry",
	"Iris",
	"Jack",
	"Karen",
	"Leo",
	"Mia",
	"Noah",
	"Olivia",
	"Paul",
	"Quinn",
	"Rachel",
	"Sam",
	"Tina",
];

function randomItem<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomScore(): number {
	return Math.floor(Math.random() * 101);
}

function makeStudent(id: number): Student {
	return {
		id: String(id),
		name: randomItem(names),
		math: randomScore(),
		english: randomScore(),
		science: randomScore(),
	};
}

export function makeStudentData(count = 20): Student[] {
	return Array.from({ length: count }, (_, i) => makeStudent(i + 1));
}
