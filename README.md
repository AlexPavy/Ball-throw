# Ball throw

## How to run

- Install [NPM](https://www.npmjs.com/)
- Run 
```zsh
npm install
npm run serve
```
- Open [base.html](http://localhost:8080/base.html) in a browser
- Click inside the frame, multiple times

## Uses

- HTML, Javascript, CSS
- [NPM](https://www.npmjs.com/)
- [gulp](https://gulpjs.com/)
- Simplified equation of [Bouncing_ball](https://en.wikipedia.org/wiki/Bouncing_ball).
Drag effect is modeled as happening only when the ball reaches the surface frame,
with a constant for the speed reduction on bounces.

## Code structure

- Frame and event handling in [base.html](./src/base.html)
- Engine to move balls in [base.html](./src/engine.js)

### Extensibility

All parameters are declared once, to simplify modifications.
Ex: resizing the frame, the ball, changing the gravity.
The constants that depend on them are calculated.

### Testability

In [engine.test.js](./src/engine.test.js)
To run the tests :
```zsh
npm run test
```

The BallEngine class can is unit tested.
The state of the engine is tested at various times.
