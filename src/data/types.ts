export type Status = "active" | "inactive" | "pending";

export type Person = {
	id: string;
	name: string;
	age: number;
	price: number;
	tax: number;
	status: Status;
	createdAt: string; // ISO
};
