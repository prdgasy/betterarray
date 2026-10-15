import { MCFunction, tellraw } from "sandstone";
import { BetterArray } from "./betterArray";

MCFunction('test', () => {
  const array = new BetterArray<string>('name');
  array.push('a');


  array.forEach((e, i) => {
    console.log(`e: ${e.currentTarget}::${e.path}, i: ${i.toString()}`);
  })
})
