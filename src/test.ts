import { MCFunction } from "sandstone";
import { PGDataArray } from "./arrayClass";
import { macro as $, richTellraw } from "@prodigelib/easymacro";

MCFunction('test', () => {
  const array = new PGDataArray('name');
  array.push('a');
  array.push('b');
  array.push('c');

  array.forEach((e, i) => {
    richTellraw([$`e: ${e}, i: ${i}`]);
  })
})
