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

  public forEach(callback: (e: DataPointClass, i: Score) => void): FinalCommandOutput;
  public forEach(callback: (e: DataPointClass) => void): FinalCommandOutput;

  public forEach(callback: (e: DataPointClass, i: Score) => void) {
    const forEach = MCFunction(`lib/array/for_each/${this.name}`, () => {
      _.for([0, this.getLength()], 'iterate', (i) => {
        const e = this.out.select('e');
        const getElement = MCFunction(`lib/array/get_element/${this.name}`, (_loop: any, i: Score) => {
          $.data.modify(e).set.from(this.array.select($`[${i}]`));
          this.out.select('i').set(i);
        });
        getElement(i);
        callback(e, i);
      });
    });
    return forEach();
  }

  public static uninstall() {
    this.storage.remove();
  }
}