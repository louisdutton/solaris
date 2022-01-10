// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
export function mulberry32(a: number) {
	return function () {
		var t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function whiteNoiseBuffer(
	ctx: AudioContext,
	duration: number,
	gain = 0.11
) {
	var sampleRate = ctx.sampleRate;
	var bufferSize = duration * sampleRate;
	var buffer = ctx.createBuffer(1, bufferSize, sampleRate);
	var channel = buffer.getChannelData(0);
	for (var i = 0; i < bufferSize; i++) {
		channel[i] = gain * Math.random() * 2 - 1;
	}
	return buffer;
}
