/** Static parameters */
const REFRESH_INTERVAL = 3; // milliseconds
const BALL_SIZE = 10; // px
const GROUND_SLOW_FACTOR = 1.1; // no unit
const G = 0.001; // px / milliseconds^2
const ZERO_SPEED_THRESHOLD = 0.0005; // px / milliseconds
const INITIAL_SPEED_FACTOR = 1; // px / milliseconds

function randomSpeed() {
  return (Math.random() - 0.5) * 2 * INITIAL_SPEED_FACTOR;
}

class BallEngine {

  constructor(frame, PANEL_WIDTH, PANEL_HEIGHT) {
    this.frame = frame;
    this.params = {
      PANEL_HEIGHT: PANEL_HEIGHT, // px
      PANEL_WIDTH: PANEL_WIDTH, // px
      ZERO_HEIGHT_THRESHOLD: PANEL_HEIGHT / 1000.0, // no unit
      MAX_Y: PANEL_HEIGHT - BALL_SIZE, // px
      MIN_Y: BALL_SIZE, // px
      MAX_X: PANEL_WIDTH - BALL_SIZE, // px
      MIN_X: BALL_SIZE, // px
    };
  }

  createBall(ball, x, y, v_x, v_y) {
    if (v_x === undefined) {
      v_x = randomSpeed();
    }
    if (v_y  === undefined) {
      v_y = randomSpeed();
    }
    ball.style.width = BALL_SIZE + "px";
    ball.style.height = BALL_SIZE + "px";
    ball.style.position = "absolute";
    ball.style["background-color"] = "#00801b";
    ball.style["border-radius"] = "50%";
    this.frame.appendChild(ball);
    const singleBall = new SingleBall(this.params, ball, x, y);
    singleBall.start(v_x, v_y);
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
    this.t1 = null; // milliseconds
  }

  start(v_x, v_y) {
    this.v_x += v_x;
    this.v_y += v_y;
    this.t1 = new Date().getTime(); // previous
    this.display();
    this.ball.style.display = "block";
    this.move();
  }

  move() {
    const now = new Date().getTime();
    const t = now - this.t1;
    this.t1 = now;
    console.log(
      `t:${t} ; x:${this.x} ; y:${this.y} ; v_x:${this.v_x} ; v_y:${this.v_y}`
    );

    if (this.stopIfNearZeroSpeed()) return;

    this.v_y += G * t;
    this.y += this.v_y * t;
    this.x += this.v_x * t;
    this.bounceIfOnGround();

    this.display();
    setTimeout(this.move.bind(this), REFRESH_INTERVAL);
  }

  stopIfNearZeroSpeed() {
    if (
      (this.params.MAX_Y - this.y) < this.params.ZERO_HEIGHT_THRESHOLD
      && Math.abs(this.v_y) < ZERO_SPEED_THRESHOLD
      && Math.abs(this.v_x) < ZERO_SPEED_THRESHOLD
    ) {
      this.v_x = 0;
      this.v_y = 0;
      this.display();
      return true;
    }
  }

  bounceIfOnGround() {
    if (this.y > this.params.MAX_Y) {
      this.y = 2 * this.params.MAX_Y - this.y;
      this.v_y = -(this.v_y / GROUND_SLOW_FACTOR);
      this.v_x = this.v_x / GROUND_SLOW_FACTOR;
    }
    if (this.y < this.params.MIN_Y) {
      this.y = 2 * this.params.MIN_Y - this.y;
      this.v_y = -(this.v_y / GROUND_SLOW_FACTOR);
      this.v_x = this.v_x / GROUND_SLOW_FACTOR;
    }
    if (this.x > this.params.MAX_X) {
      this.x = 2 * this.params.MAX_X - this.x;
      this.v_y = this.v_y / GROUND_SLOW_FACTOR;
      this.v_x = -(this.v_x / GROUND_SLOW_FACTOR);
    }
    if (this.x < this.params.MIN_X) {
      this.x = 2 * this.params.MIN_X - this.x;
      this.v_y = this.v_y / GROUND_SLOW_FACTOR;
      this.v_x = -(this.v_x / GROUND_SLOW_FACTOR);
    }
  }

  display() {
    this.ball.style.left = this.x + "px";
    this.ball.style.top = this.y + "px";
  }
}

window.BallEngine = BallEngine;
