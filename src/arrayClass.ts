import { _, Data, DataPointClass, execute, Macro as $, MCFunction, Objective, Score, Variable } from "sandstone";

export class PGDataArray {
  private static id = 0;
  private static storage = Data('storage', 'prodigelib:prodigelib', 'PGDataArray')
  private static arrays = this.storage.select('arrays');

  private name: string;
  private length = Objective.create('lib.array.length')('.l');
  private array: DataPointClass;
  private out = PGDataArray.storage.select('out');

  constructor(name?: string) {
    this.name = name ?? `anon_${PGDataArray.id++}`;
    this.array = PGDataArray.arrays.select(this.name);
  }

  /**
   * @param e The element to add
   * @returns The new length of the array
   */
  push(e: any): Score {
    this.array.append(e);
    return this.getLength();
  }

  /**
   * @returns The length of the array
   */
  getLength(): Score {
    execute.store.result(this.length).run.data.get(this.array);
    return this.length;
  }

  /**
   * Loops through the array
   * @param e Element
   * @param i Index
   */
  forEach(callback: (e: DataPointClass, i?: Score) => void) {
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
    forEach();
  }
}