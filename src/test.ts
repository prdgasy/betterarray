import { MCFunction, tellraw } from "sandstone";
import { CjArray } from "./arrayClass";

MCFunction('test', () => {
  const array = new CjArray('name');
  array.push('a');
  array.push('b');
  array.push('c');

  array.forEach((e, i) => {
    console.log(`e: ${e.currentTarget}::${e.path}, i: ${i.toString()} `);
  })
})
