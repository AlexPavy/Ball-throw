# Ball throw

## How to run

Open [base.html](./base.html) in a browser
Click inside the frame

The initial y-speed and x-speed are random values

## Uses

- HTML, Javascript, CSS
- Simplified equation of [Bouncing_ball](https://en.wikipedia.org/wiki/Bouncing_ball).
Drag effect is modeled as happening only when the ball reaches the surface frame,
with a constant for the speed reduction on bounces.

## Code structure

Lightweight code in one file and the main loop in move() to move the ball

### Extensibility

All parameters are declared once, to simplify modifications.
Ex: resizing the frame, the ball, changing the gravity.
The constants that depend on them are calculated.

The javascript could be moved to a file and it could be integrated 
with a web framework like Angular or React

### Testability

The BallEngine class can be unit tested. The state of the engine can be tested
at various times.

The loop could use await sleep() with an async function to be testable
as an async function.
