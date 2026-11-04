import { Macro as $, _, Data, DataPointClass, DataVariable, defaultNamespace, execute, MCFunction, Objective, Score, Variable } from "sandstone";
import { FinalCommandOutput } from "sandstone/commands";
import { MacroLiteral } from "sandstone/core";

export class BetterArray {
	private static nextId = 0;
	private static ns = defaultNamespace.toString();
	private static storage = Data('storage', `${this.ns}:prodigelib`, 'BetterArray')
	private static arrays = this.storage.select('arrays');

	private name: string;
	private array: DataPointClass;
	private out: DataPointClass;
	private id = BetterArray.nextId++;

	constructor(arr?: any[]) {
		this.name = `arr_${this.id}`;
		this.out = BetterArray.storage.select(`out_${this.id}`);
		this.array = BetterArray.arrays.select(this.name);
		this.array.set(arr ?? []);
	}

	public push(...values: any[]): this {
		for (const v of values) {
			this.array.append(v);
		}
		return this;
	}

	public toData(): DataPointClass {
		return this.array;
	}

	public length(): Score {
		const l = Variable();
		execute.store.result(l).run.data.get(this.array);
		return l;
	}

	private getFromScore(i: Score | DataPointClass): DataPointClass {
		const temp = DataVariable();
		const getElement = MCFunction(`__lib/array/get_from_score/${this.name}`, (_loop: any, i: Score | DataPointClass) => {
			$.data.modify(temp).set.from(this.array.select($`[${i}]`));
		}, { onConflict: 'ignore' });
		getElement(i);
		return this.out.set(temp);
	}

	public get(i: number | Score | DataPointClass): DataPointClass {
		if (typeof i === 'number') return this.array.select(`[${i}]`);
		return this.getFromScore(i);
	}

	public forEach(callback: (element: DataPointClass, index: Score) => void): FinalCommandOutput;
	public forEach(callback: (element: DataPointClass) => void): FinalCommandOutput;
	public forEach(callback: (element: DataPointClass, index: Score) => void) {
		const forEach = MCFunction(`__lib/array/for_each/${this.name}`, () => {
			_.for([0, this.length()], 'iterate', (i) => callback(this.getFromScore(i), i));
		});
		return forEach();
	}

	public map(callback: (e: DataPointClass) => MacroLiteral) {

	}

	public static uninstall() {
		this.storage.remove();
	}
}