import { mulberry32 } from "./utils";

let value = mulberry32(0);
let range = (min: number, max: number) => min + value() * (max - min);

export const Random = {
	value,
	range,
};
