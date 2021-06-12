
//#region Constants

// Intervals
const UNISON = 1;
const m2 = SEMITONE = 1.059463; // 2^1/12
const M2 = 1.122462;
const m3 = 1.189207;
const M3 = 1.259921;
const P4 = 1.334839;
const TRITONE = 1.414213;
const P5 = 1.498307;
const m6 = 1.587401;
const M6 = 1.681792;
const m7 = 1.781797;
const M7 = 1.887748;
const OCTAVE = 2;

// Physics
const C = 343; // speed of sound (m/s)

//#endregion

//#region Settings
var cnv, cam;
var reverb, fm, env, vib;

// Audio
var isPlaying = false;
var decay = .99;
var gain = .01;
var baseFreq = 55;
var attenuation = 1000;

// Time
var hour, day, month, year;
var zoom;

// Graphics
var resolution = 24; // resolution;
var rotation; 

// Orbit
var sunSize = 50;
var planetSize = 10;
var planetCount = 16;
var planets = {};
const RADIAL_SPACING = 10;
const ANGULAR_VELOCITY = .001;
//#endregion

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  day = day();
  month = month();
  print(day, month);
  cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  cnv.mousePressed(onMousePressed);
  cnv.mouseWheel(onMouseWheel);
  angleMode(DEGREES);

  reverb = new p5.Reverb();

  vib = new p5.Oscillator(10);
  vib.amp(10);
  vib.start();
  vib.disconnect();
  
  for (var i = 0; i < planetCount; i++){
    var osc = new p5.Oscillator();
    osc.start();
    osc.freq(baseFreq * (i+1));
    osc.freq(vib);
    osc.connect(reverb);
    var size = planetSize * (1+random());
    planets[i] = new Planet(i+1, size, resolution, osc);
  }

  // Camera
  cam = new CameraController();
  setCamera(cam.cam);
}

function draw() {
  // Background
  background('#222');
  noFill();
  var c = color(255, 255, 255, 164);
  stroke(c);
  strokeWeight(.25);

  // camera
  cam.update();

  // Shapes
  push()
  sun();
  pop();

  // Update planets
  for (var i = 0; i < planetCount; i++) { planets[i].update(); }
}

//#region User Interaction
function onMousePressed(event) {
  userStartAudio();
}

function mouseDragged(event) {
  cam.orbit(event.movementX, event.movementY);
}

function onMouseWheel(event) {
  cam.zoom(Math.sign(event.deltaY));
}
//#endregion

//#region Scaled functions

// Celestial Bodies
function sun() { 
  return sphere(sunSize, resolution, resolution);
}

class Planet {
  constructor(index, size, resolution, oscillator){
    this.seed = random(0, 10000);
    this.i = index;
    this.r = index * RADIAL_SPACING + sunSize;
    this.size = size;
    this.res = resolution;
    this.osc = oscillator;
    this.velocity = createVector(index / 100, index / 100);
    this.offset = random(0, 360);
    this.freq = oscillator.freq;
    this.amp = gain * pow(decay, index);
    this.distance = 0;
  }

  update() {
    var v = this.velocity;
    // if
    // var v = month / 12 * 360;
    var x = v.x * frameCount;
    var y = v.y * frameCount;
    // var z = cos(v + this.offset);
    var pos = sphereCoords(this.r, x, y);

    // Doppler effect !!! NOT WORKING
    var doppler = y;
    // print(y);
    var freq = this.freq * doppler;
    this.osc.freq(freq);

    // Spatialisation
    var dist = p5.Vector.dist(pos, cam.position);
    var amp = constrain(1000 / (dist * dist), 0, this.amp);
    this.osc.amp(amp);

    push();
    translate(pos);
    sphere(this.size, this.res, this.res);
    pop();
  }
}

//#endregion

class CameraController {
  constructor() {
    this.distance = 400;
    this.cam = createCamera();
    this.theta = 0;
    this.phi = 0;
    this.rotationSpeed = .5;
    this.zoomSpeed = 15;
    this.position = sphereCoords(this.r, this.theta, this.phi);
  }

  update() {
    var x = this.position.x;
    var y = this.position.y;
    var z = this.position.z;
    this.cam.setPosition(x, y, z);
    this.cam.lookAt(0, 0, 0);
  }

  zoom(direction) {
    this.distance += this.zoomSpeed * direction;
    this.position = sphereCoords(this.distance, this.theta, this.phi);
  }

  orbit(dx, dy) {
    this.theta = constrain(this.theta + -dy * this.rotationSpeed, -360, 360);
    this.phi = constrain(this.phi -dx * this.rotationSpeed, -360, 360);

    this.position = sphereCoords(this.distance, this.theta, this.phi);
  }
}

function sphereCoords(r, theta, phi) {
  var x = r * sin(phi) * cos(theta);
  var y = r * sin(phi) * sin(theta);
  var z = r * cos(phi);

  return createVector(x, y, z);
}