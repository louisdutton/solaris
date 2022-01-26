// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
export function mulberry32(a: number) {
	return function () {
		var t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

let value = mulberry32(1);
const range = (min: number, max: number) => min + value() * (max - min);
const setSeed = (seed: number) => {
	value = mulberry32(seed);
};

export default {
	value,
	range,
	setSeed,
};
