import Random from "./random";

const SAMPLES = [
	"soprano-1.mp3",
	"soprano-1_1.mp3",
	"soprano-1_1.mp3",
	"soprano-1_2.mp3",
	"soprano-1_3.mp3",
	"soprano-1_4.mp3",
	"soprano-1_5.mp3",
	"soprano-2.mp3",
	"soprano-2_1.mp3",
	"soprano-2_1.mp3",
	"soprano-2_2.mp3",
	"soprano-2_3.mp3",
	"soprano-2_4.mp3",
	"soprano-2_5.mp3",
	"alto-1.mp3",
	"alto-1_1.mp3",
	"alto-1_1.mp3",
	"alto-1_2.mp3",
	"alto-1_3.mp3",
	"alto-1_4.mp3",
	"alto-1_5.mp3",
	"alto-2.mp3",
	"alto-2_1.mp3",
	"alto-2_1.mp3",
	"alto-2_2.mp3",
	"alto-2_3.mp3",
	"alto-2_4.mp3",
	"alto-2_5.mp3",
	"alto-2_6.mp3",
];

export class Voice {
	audio: HTMLAudioElement;
	source: MediaElementAudioSourceNode;
	// buffers: AudioBuffer[];

	constructor(ctx: AudioContext, url: string) {
		// this.buffers = [];
		this.audio = new Audio("/audio/vocal/" + url);
		this.source = ctx.createMediaElementSource(this.audio);
		// this.source.connect(ctx.destination);

		/// Asyncrhonously load each of the given SAMPLES into an AudioBuffer array
		// fetch("/audio/vocal/" + key)
		// .then((res) => res.arrayBuffer())
		// .then((ArrayBuffer) => ctx.decodeAudioData(ArrayBuffer))
		// .then((data) => {
		//   this.buffers.push(data);
		//   this.source. = data;
		// });
	}

	play() {
		this.audio.play();
	}
}

export class Choir {
	voices: Voice[];
	gain: GainNode;

	constructor(ctx: AudioContext) {
		// create gain
		this.gain = new GainNode(ctx);
		this.gain.gain.value = 0.02;

		// create voices from array of sample urls
		this.voices = SAMPLES.map((url) => {
			const voice = new Voice(ctx, url);
			voice.source.connect(this.gain);
			return voice;
		});
	}

	test() {
		console.log("starting choir");
		this.voices[0].play();
	}

	tick() {
		// roughly every 4 seconds
		if (Random.value() > 1 / 120) return;

		Random.within(this.voices).play();
	}

	connect(node: AudioNode) {
		this.gain.connect(node);
	}
}
