/** Optional parameters and their default values */
const OPTIONAL_PARAMS = {
  REFRESH_INTERVAL: 3, // milliseconds
  BALL_SIZE: 10, // px
  GROUND_SLOW_FACTOR: 1.1, // no unit
  G: 0.001, // px / milliseconds^2
  ZERO_SPEED_THRESHOLD: 0.0005, // px / milliseconds
  INITIAL_SPEED_FACTOR: 1, // px / milliseconds
  LOG_PERIOD: 1000, // milliseconds
};

class BallEngine {

  constructor(frame, params) {
    this.frame = frame;
    // required params
    if (params.PANEL_HEIGHT === undefined || params.PANEL_WIDTH === undefined) {
      throw new Error("PANEL_HEIGHT and PANEL_WIDTH are required")
    }
    this.params = {
      PANEL_HEIGHT: params.PANEL_HEIGHT, // px
      PANEL_WIDTH: params.PANEL_WIDTH, // px
    };

    // optional params
    for (let k in OPTIONAL_PARAMS) {
      if (params[k] !== undefined) {
        this.params[k] = params[k];
      } else {
        this.params[k] = OPTIONAL_PARAMS[k]
      }
    }

    // calculated params
    this.params.ZERO_HEIGHT_THRESHOLD = this.params.PANEL_HEIGHT / 1000.0; // no unit
    this.params.MAX_Y = this.params.PANEL_HEIGHT - this.params.BALL_SIZE; // px
    this.params.MIN_Y = this.params.BALL_SIZE; // px
    this.params.MAX_X = this.params.PANEL_WIDTH - this.params.BALL_SIZE; // px
    this.params.MIN_X = this.params.BALL_SIZE; // px

    console.log("BallEngine - Parameters", this.params)
  }

  createBall(ball, x, y, v_x, v_y) {
    if (v_x === undefined) {
      v_x = this.randomSpeed();
    }
    if (v_y === undefined) {
      v_y = this.randomSpeed();
    }
    ball.style.width = this.params.BALL_SIZE + "px";
    ball.style.height = this.params.BALL_SIZE + "px";
    ball.style.position = "absolute";
    ball.style["background-color"] = "#00801b";
    ball.style["border-radius"] = "50%";
    this.frame.appendChild(ball);
    const singleBall = new SingleBall(this.params, ball, x, y);
    singleBall.start(v_x, v_y);
    return singleBall;
  }

  randomSpeed() {
    return (Math.random() - 0.5) * 2 * this.params.INITIAL_SPEED_FACTOR;
  }
}

class SingleBall {

  constructor(params, ball, x, y) {
    this.params = params;

    /** Variables */
    this.ball = ball; // dom element
    this.x = x; // px
    this.y = y; // px
    this.v_x = 0; // px / milliseconds
    this.v_y = 0; // px / milliseconds

    this.dt = null; // t - t1, milliseconds
    this.t1 = null; // previous time, milliseconds
    this.lastLogTime = null; // last time where values were logged
    this.nbBouncesX = 0; // number times it bounced on X axis
    this.nbBouncesY = 0; // number times it bounced on Y axis
  }

  async start(v_x, v_y) {
    this.v_x += v_x;
    this.v_y += v_y;
    this.setTime();
    this.display();
    this.ball.style.display = "block";

    while (!this.isNearZeroSpeed()) {
      this.setTime();
      this.logPeriodically();
      this.move();
      this.display();
      await timeout(this.params.REFRESH_INTERVAL);
    }
    this.stop();
    return this;
  }

  move() {
    this.v_y += this.params.G * this.dt;
    this.y += this.v_y * this.dt;
    this.x += this.v_x * this.dt;

    // bounce if hit ground or wall
    if (this.y > this.params.MAX_Y) {
      this.y = 2 * this.params.MAX_Y - this.y;
      this.v_y = -(this.v_y / this.params.GROUND_SLOW_FACTOR);
      this.v_x = this.v_x / this.params.GROUND_SLOW_FACTOR;
      this.nbBouncesY++;
    }
    if (this.y < this.params.MIN_Y) {
      this.y = 2 * this.params.MIN_Y - this.y;
      this.v_y = -(this.v_y / this.params.GROUND_SLOW_FACTOR);
      this.v_x = this.v_x / this.params.GROUND_SLOW_FACTOR;
      this.nbBouncesY++;
    }
    if (this.x > this.params.MAX_X) {
      this.x = 2 * this.params.MAX_X - this.x;
      this.v_y = this.v_y / this.params.GROUND_SLOW_FACTOR;
      this.v_x = -(this.v_x / this.params.GROUND_SLOW_FACTOR);
      this.nbBouncesX++;
    }
    if (this.x < this.params.MIN_X) {
      this.x = 2 * this.params.MIN_X - this.x;
      this.v_y = this.v_y / this.params.GROUND_SLOW_FACTOR;
      this.v_x = -(this.v_x / this.params.GROUND_SLOW_FACTOR);
      this.nbBouncesX++;
    }
  }

  setTime() {
    const now = new Date();
    if (this.t1) this.dt = now.getTime() - this.t1;
    this.t1 = now.getTime();
  }

  logPeriodically() {
    if ((this.t1 - this.lastLogTime) > this.params.LOG_PERIOD) {
      console.log(
        `dt:${this.dt} ; x:${this.x} ; y:${this.y} ; v_x:${this.v_x} ; v_y:${this.v_y}`
      );
      this.lastLogTime = this.t1;
    }
  }

  isNearZeroSpeed() {
    if (
      (this.params.MAX_Y - this.y) < this.params.ZERO_HEIGHT_THRESHOLD
      && Math.abs(this.v_y) < this.params.ZERO_SPEED_THRESHOLD
      && Math.abs(this.v_x) < this.params.ZERO_SPEED_THRESHOLD
    ) {
      return true
    }
  }

  stop() {
    this.y = this.params.MAX_Y;
    this.v_x = 0;
    this.v_y = 0;
    this.display();
  }

  display() {
    this.ball.style.left = this.x + "px";
    this.ball.style.top = this.y + "px";
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Should use a web framework instead
if (window) {
  window.BallEngine = BallEngine;
}
if (module) {
  module.exports = {
    BallEngine,
    SingleBall,
  }
}
