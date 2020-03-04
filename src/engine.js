class BallEngine {

  constructor(ball, x, y) {
    /** Variables */
    this.ball = ball; // dom element
    this.x = x; // px
    this.y = y;
    this.v_x = 0; // px / milliseconds
    this.v_y = 0; // px / milliseconds
    this.t1 = null; // milliseconds
  }

  start(v_x, v_y) {
    this.v_x += v_x;
    this.v_y += v_y;
    this.t1 = new Date().getTime();
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

    if (
      (MAX_Y - this.y) < ZERO_HEIGHT_THRESHOLD
      && Math.abs(this.v_y) < ZERO_SPEED_THRESHOLD
      && Math.abs(this.v_x) < ZERO_SPEED_THRESHOLD
    ) {
      this.v_x = 0;
      this.v_y = 0;
      this.display();
      return;
    }

    this.v_y += G * t;
    this.y += this.v_y * t;
    this.x += this.v_x * t;
    if (this.y > MAX_Y) {
      this.y = 2 * MAX_Y - this.y;
      this.v_y = -(this.v_y / GROUND_SLOW_FACTOR);
      this.v_x = this.v_x / GROUND_SLOW_FACTOR;
    }
    if (this.y < MIN_Y) {
      this.y = 2 * MIN_Y - this.y;
      this.v_y = -(this.v_y / GROUND_SLOW_FACTOR);
      this.v_x = this.v_x / GROUND_SLOW_FACTOR;
    }
    if (this.x > MAX_X) {
      this.x = 2 * MAX_X - this.x;
      this.v_y = this.v_y / GROUND_SLOW_FACTOR;
      this.v_x = -(this.v_x / GROUND_SLOW_FACTOR);
    }
    if (this.x < MIN_X) {
      this.x = 2 * MIN_X - this.x;
      this.v_y = this.v_y / GROUND_SLOW_FACTOR;
      this.v_x = -(this.v_x / GROUND_SLOW_FACTOR);
    }
    if (this.y < 0) {
      this.y = MAX_Y;
      this.v_y = 0;
    }

    this.display();
    setTimeout(this.move.bind(this), FREQ);
  }

  display() {
    this.ball.style.left = this.x + "px";
    this.ball.style.top = this.y + "px";
  }
}

module.exports = {
  BallEngine
};
