// regression tests for the ket-expression parser in index.html
const fs = require('fs');
const src = fs.readFileSync('index.html', 'utf8');
let math = src.split('math: complex numbers')[1].split('/* ================= scene')[0];
math = math.slice(math.indexOf('*/') + 2);
const THREE = { Vector3: function (x, y, z) { this.x = x; this.y = y; this.z = z; } };
eval(math);

let failed = 0;
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const near = (x, y) => Math.abs(x - y) < 1e-9;
const throws = fn => { try { fn(); } catch (e) { return e; } return null; };

function check(name, fn) {
  try {
    fn();
    console.log('PASS', name);
  } catch (e) {
    failed++;
    console.log('FAIL', name, '-', e.message);
  }
}

check('1/sqrt(2)|0> + 1/sqrt(2)|1>', () => {
  const s = parseQubit('1/sqrt(2) |0> + 1/sqrt(2) |1>');
  assert(near(s.a.re, Math.SQRT1_2) && near(s.a.im, 0), '|0> amplitude wrong');
  assert(near(s.b.re, Math.SQRT1_2) && near(s.b.im, 0), '|1> amplitude wrong');
});

check('fractions: 1/2 |0> + 1/2 |1> normalizes', () => {
  const s = parseQubit('1/2 |0> + 1/2 |1>');
  assert(near(s.a.re, Math.SQRT1_2) && near(s.b.re, Math.SQRT1_2), 'wrong normalized state');
});

check('sqrt(3)/2 |0> + 1/2 |1>', () => {
  const s = parseQubit('sqrt(3)/2 |0> + 1/2 |1>');
  assert(near(s.a.re, Math.sqrt(3) / 2) && near(s.b.re, 1 / 2), 'wrong state');
});

check('scalar * state (2 |1>)', () => {
  const s = parseQubit('2 |1>');
  assert(near(s.a.re, 0) && near(s.b.re, 1), 'wrong state');
});

check('state * scalar (|1> 2)', () => {
  const s = parseQubit('|1> 2');
  assert(near(s.a.re, 0) && near(s.b.re, 1), 'wrong state');
});

check('scalar division then ket (2/4 |0>)', () => {
  const s = parseQubit('2/4 |0>');
  assert(near(s.a.re, 1) && near(s.b.re, 0), 'wrong state');
});

check('e^(i pi/4) |1>', () => {
  const s = parseQubit('e^(i pi/4) |1>');
  assert(near(s.b.re, Math.SQRT1_2) && near(s.b.im, Math.SQRT1_2), 'wrong phase');
});

check('bare |0> is a state, not a scalar', () => {
  const s = parseQubit('|0>');
  assert(near(s.a.re, 1) && near(s.b.re, 0), 'wrong state');
});

check('bloch vector |0> -> (0, 0, 1)', () => {
  const v = blochVector(parseQubit('|0>'));
  assert(near(v.x, 0) && near(v.y, 0) && near(v.z, 1), `got (${v.x}, ${v.y}, ${v.z})`);
});

check('bloch vector |i> -> (0, 1, 0)', () => {
  const v = blochVector(parseQubit('|i>'));
  assert(near(v.x, 0) && near(v.y, 1) && near(v.z, 0), `got (${v.x}, ${v.y}, ${v.z})`);
});

check('arrow mapping sends |i> to three.js +z', () => {
  const bv = blochVector(parseQubit('|i>'));
  const d = { x: bv.x, y: bv.z, z: bv.y };   // same swap update() applies
  assert(near(d.x, 0) && near(d.y, 0) && near(d.z, 1), `got (${d.x}, ${d.y}, ${d.z})`);
});

check('ket * ket rejected', () => assert(throws(() => parseQubit('|0> |1>')), 'should throw'));
check('bare scalar rejected as qubit', () => assert(throws(() => parseQubit('2')), 'should throw'));
check('scalar + state rejected', () => assert(throws(() => parseQubit('1 + |0>')), 'should throw'));
check('state / state rejected', () => assert(throws(() => parseQubit('|0> / |1>')), 'should throw'));
check('sqrt of state rejected', () => assert(throws(() => parseQubit('sqrt(|0>)')), 'should throw'));

console.log(failed ? `${failed} test(s) FAILED` : 'all tests passed');
process.exit(failed ? 1 : 0);