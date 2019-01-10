var outer_width = 1.17116;
var outer_height = 0.6192;
var vert_margin = 0.08992;
var inner_height = 0.82015;
var hor_margin = 0.064337;
var inner_width = 0.87133;
var rectangle_heights = [0.29829, 0.2276, 0.16713];
var rectangle_y_offsets = [0.08992, 0.44713, 0.7445];
var outer_margin_left = 0.15625;

var running = true;

var rect_position;

var start_x_coordinates;

var images = [];
var imageRectArray = [];

var awcFont;

class Rectangle {
  constructor(x, y, width, height) {
    this.position = createVector(x, y);
    this.width = width;
    this.height = height;
    }

  draw() {
    stroke(255);
    noFill();
    rect(this.position.x, this.position.y, this.width, this.height);
  }
}

class SeekingRectangle extends Rectangle {
  constructor(x, y, width, height, targetX, targetY) {
    super(x, y, width, height);
    this.target = createVector(targetX, targetY);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.maxspeed = 20.0;
    this.maxforce = 1.35;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    if (running == false) {
      return;
    }
    let desired = p5.Vector.sub(this.target, this.position);
    let distance = desired.mag();
    desired.normalize();
    if (distance < 100) {
      let speed = map(distance, 0, 100, 0, this.maxspeed);
      desired.mult(speed);
    } else {
      desired.mult(this.maxspeed);
    }

    let steering_force = p5.Vector.sub(desired, this.velocity);
    steering_force.limit(this.maxforce);

    this.applyForce(steering_force);

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
}

class ImageRectangle extends SeekingRectangle {
  constructor(image, x, y, width, height, targetX, targetY) {
    super(x, y, width, height, targetX, targetY);
    this.image = image;
    this.image.resize(this.width, this.height);
  }

  draw() {
    image(this.image, this.position.x, this.position.y);
  }
}

function preload() {
  // awcFont = loadFont("stop.ttf");
  images.push(loadImage("words/all.png"));
  images.push(loadImage("words/wings.png"));
  images.push(loadImage("words/considered.png"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  outer_height *= windowHeight;
  outer_width *= outer_height;

  vert_margin *= outer_height;
  hor_margin *= outer_width;
  inner_height *= outer_height;
  inner_width *= outer_width;

  outer_margin_left *= windowWidth;

  start_x_coordinates = [windowWidth, -outer_width*2, windowWidth*1.5];

  outer_rectangle = new Rectangle(outer_margin_left,
    (windowHeight - outer_height) / 2, outer_width, outer_height);

  for (let i = 0; i < rectangle_heights.length; i++) {
    rectangle_heights[i] *= outer_height;
    rectangle_y_offsets[i] *= outer_height;
    rectangle_y_offsets[i] += outer_rectangle.position.y;
    imageRectArray.push(new ImageRectangle(images[i],
      start_x_coordinates[i],
      rectangle_y_offsets[i],
      inner_width,
      rectangle_heights[i],
      outer_margin_left + hor_margin,
      rectangle_y_offsets[i]));
  }
}
  

function draw() {
  clear();
  background("#005087");

  // outer_rectangle.draw();

  for (image_rect of imageRectArray) {
    image_rect.update();
    image_rect.draw();
  }
}

function mouseClicked() {
  running = true;
}
