import { _, Data, DataPointClass, defaultNamespace, execute, Macro as $, MCFunction, Objective, Score, Variable } from "sandstone";
import { FinalCommandOutput } from "sandstone/commands";

export class BetterArray<T extends number | string> {
  private static id = 0;
  private static ns = defaultNamespace.toString();
  private static storage = Data('storage', `${this.ns}:prodigelib`, 'BetterArray')
  private static arrays = this.storage.select('arrays');

  private name: string;
  private length = Objective.create('lib.array.length')('.l');
  private array: DataPointClass;
  private out = BetterArray.storage.select('out');

  constructor(name?: string) {
    this.name = name ?? `anon_${BetterArray.id++}`;
    this.array = BetterArray.arrays.select(this.name);
  }

  public push(...values: T[]): this {
    for (const v of values) {
      this.array.append(v);
    }
    return this;
  }

  public getLength(): Score {
    execute.store.result(this.length).run.data.get(this.array);
    return this.length;
  }

  private getFromScore(i: Score | DataPointClass) {
    const getElement = MCFunction(`lib/array/get_from_score/${this.name}`, (_loop: any, i: Score | DataPointClass) => {
      $.data.modify(this.out).set.from(this.array.select($`[${i}]`));
    }, { onConflict: 'ignore' });
    getElement(i);
    return this.out;
  }

  public get(i: number | Score | DataPointClass): DataPointClass {
    if (typeof i === 'number') return this.array.select(`[${i}]`);
    return this.getFromScore(i);
  }

  public forEach(callback: (element: DataPointClass, index: Score) => void): FinalCommandOutput;
  public forEach(callback: (element: DataPointClass) => void): FinalCommandOutput;
  public forEach(callback: (element: DataPointClass, index: Score) => void) {
    const forEach = MCFunction(`lib/array/for_each/${this.name}`, () => {
      _.for([0, this.getLength()], 'iterate', (i) => callback(this.getFromScore(i), i));
    });
    return forEach();
  }

  public static uninstall() {
    this.storage.remove();
  }
}