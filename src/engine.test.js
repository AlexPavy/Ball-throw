const engine = require('./engine');

const TEST_PANEL_HEIGHT = 30;
const TEST_PANEL_WIDTH = 30;
const TEST_BALL_SIZE = 2;

function getTestParams() {
  const params = {
    PANEL_HEIGHT: TEST_PANEL_HEIGHT,
    PANEL_WIDTH: TEST_PANEL_WIDTH,
    BALL_SIZE: TEST_BALL_SIZE,
    ZERO_HEIGHT_THRESHOLD: TEST_PANEL_HEIGHT / 1000.0,
    MAX_Y: TEST_PANEL_HEIGHT - TEST_BALL_SIZE,
    MIN_Y: TEST_BALL_SIZE,
    MAX_X: TEST_PANEL_WIDTH - TEST_BALL_SIZE,
    MIN_X: TEST_BALL_SIZE,
  };
  const ballEngine = new engine.BallEngine(null, params);
  return ballEngine.params;
}

test('SingleBall one tick on v_x', () => {
  const ball = document.createElement("span");
  const singleBall = new engine.SingleBall(getTestParams(), ball, 15, 15);
  singleBall.start(1, 0);
  expectAlmostEqual(singleBall.x, 17);
  expectAlmostEqual(singleBall.y, 15);
  singleBall.stop();
});

test('SingleBall one tick on v_y', () => {
  const ball = document.createElement("span");
  const singleBall = new engine.SingleBall(getTestParams(), ball, 15, 15);
  singleBall.start(0, -1);
  expectAlmostEqual(singleBall.x, 15);
  expectAlmostEqual(singleBall.y, 14);
  singleBall.stop();
});

test('SingleBall wait bounce down', async () => {
  const ball = document.createElement("span");
  const singleBall = new engine.SingleBall(getTestParams(), ball, 15, 5);
  singleBall.start(0, 0.02);
  await timeout(200);
  expect(singleBall.nbBouncesX).toBe(0);
  expect(singleBall.nbBouncesY).toBe(1);
  expectAlmostEqual(singleBall.x, 15);
  expectAlmostEqual(singleBall.y, 26.3);
  singleBall.stop();
});

test('SingleBall wait bounce right', async () => {
  const ball = document.createElement("span");
  const singleBall = new engine.SingleBall(getTestParams(), ball, 15, 5);
  singleBall.start(0.07, -0.02);
  await timeout(200);
  expectAlmostEqual(singleBall.x, 26.9);
  expectAlmostEqual(singleBall.y, 21.6);
  expect(singleBall.nbBouncesX).toBe(1);
  expect(singleBall.nbBouncesY).toBe(0);
  singleBall.stop();
});

test('BallEngine bounce until stops', async () => {
  const ball = document.createElement("span");
  const params = getTestParams();
  params.GROUND_SLOW_FACTOR = 2; // have test fast enough
  const singleBall = new engine.SingleBall(params, ball, 15, 5);
  await singleBall.start(0.1, -0.02);
  expectAlmostEqual(singleBall.x, 14);
  expectAlmostEqual(singleBall.y, 28);
  expect(singleBall.nbBouncesX).toBe(1);
  // Total number of Y-bounces is actually random
  expect(singleBall.nbBouncesY).toBeGreaterThan(4);
  singleBall.stop();
});

test('BallEngine create ball random speed eventually stops', async () => {
  const frame = document.createElement("div");
  const params = getTestParams();
  params.GROUND_SLOW_FACTOR = 4; // have test fast enough
  const ballEngine = new engine.BallEngine(frame, params);
  const ball = document.createElement("span");
  const singleBall = ballEngine.createBall(ball, 5, 27);
  await timeout(4800);
  expect(singleBall.isNearZeroSpeed()).toBeTruthy();
  expect(singleBall.nbBouncesY).toBeGreaterThan(2)
});

test('BallEngine constructor required parameters', async () => {
  try {
    new engine.BallEngine(null, {PANEL_WIDTH: 400});
    fail("Should require parameter");
  } catch (e) {
    expect(e.message).toBe("PANEL_HEIGHT and PANEL_WIDTH are required")
  }
});

test('BallEngine constructor calculated parameters', async () => {
  const ballEngine = new engine.BallEngine(null, {
    PANEL_WIDTH: 400,
    PANEL_HEIGHT: 500,
    BALL_SIZE: 3,
    MAX_Y: 77, // ignored
    MIN_X: 77, // ignored
  });
  const params = ballEngine.params;
  expect(params.PANEL_WIDTH).toBe(400);
  expect(params.PANEL_HEIGHT).toBe(500);
  expect(params.ZERO_HEIGHT_THRESHOLD).toBe(0.5);
  expect(params.MAX_Y).toBe(497);
  expect(params.MIN_Y).toBe(3);
  expect(params.MAX_X).toBe(397);
  expect(params.MIN_X).toBe(3);
});

test('BallEngine constructor optional parameters', async () => {
  const ballEngine = new engine.BallEngine(null, {
    PANEL_WIDTH: 400,
    PANEL_HEIGHT: 500,
    G: 0.004, // override
    LOG_PERIOD: 5000, // override
    INVALID_PARAM: 77 // ignored
  });
  const params = ballEngine.params;
  expect(params.G).toBe(0.004);
  expect(params.LOG_PERIOD).toBe(5000);
  expect(params.BALL_SIZE).toBe(10);
  expect(params.INITIAL_SPEED_FACTOR).toBe(1);
  expect(params.REFRESH_INTERVAL).toBe(3);
  expect(params.GROUND_SLOW_FACTOR).toBe(1.1);
  expect(params.ZERO_SPEED_THRESHOLD).toBe(0.0005);
  expect(params.INVALID_PARAM).toBe(undefined);
});

function expectAlmostEqual(expected, actual) {
  const diff = Math.abs(expected - actual);
  expect(diff).toBeLessThan(2);
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
