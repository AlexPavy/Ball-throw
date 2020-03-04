const engine = require('./engine');

test('SingleBall constructor', () => {
  const ballEngine = new engine.SingleBall({}, {style: {}}, 1, 1);
  ballEngine.move();
  expect(ballEngine.x).toBe(1);
});

test('SingleBall can move', (done) => {
  const ballEngine = new engine.SingleBall({}, {style: {}}, 1, 1);
  ballEngine.move();
  setTimeout(function () {
    expect(ballEngine.x).toBe(0);
    done();
  }, 1000);
});
