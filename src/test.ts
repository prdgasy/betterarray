import { MCFunction, tellraw, Variable } from "sandstone";
import { BetterArray } from "./betterArray";

MCFunction('test', () => {
  const array = new BetterArray<string>('array').push(...['a', 'b', 'c']);
  tellraw('@p', array.get(0));
  tellraw('@p', array.get(Variable(2)));

  array.forEach((e, i) => {
    console.log(`e: ${e.currentTarget}::${e.path}, i: ${i.toString()}`);
  })
})
