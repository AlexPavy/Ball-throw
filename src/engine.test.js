const engine = require('./engine');

test('adds 1 + 2 to equal 3', () => {
  const ballEngine = new engine.BallEngine({}, 1, 1);
  ballEngine.move();
  expect(ballEngine.x).toBe(1);
});
