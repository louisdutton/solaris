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
