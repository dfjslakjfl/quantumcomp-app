# quantumcomp-app — Bloch Sphere Visualizer

An interactive 3D Bloch sphere visualizer for single-qubit quantum states.
Type ket expressions in the textbox and watch the state vector update in real time.

## Features

- **Real-time parser** for ket expressions: `|0>`, `|1>`, `|+>`, `|->`, `|i>`, `|-i>`, and arbitrary superpositions like `1/sqrt(2) |0> + 1/sqrt(2) |1>`.
- **Complex-number math**: supports `i`, `pi`, `e`, `sqrt()`, arithmetic (`+`, `-`, `*`, `/`), and complex exponentials (`e^(i pi/4)`).
- **Bloch sphere rendering**: interactive 3D scene with axes, equator, state vector arrow, and phase labels.
- **Multi-qubit display**: enter multiple comma-separated states to view several spheres side by side.
- **Auto-framing camera**: the view automatically pulls back to fit the row of spheres as you add qubits.
- **Blender-style navigation**:
  - **Left drag**: orbit/rotate the view
  - **Middle drag** (or Shift+Left drag): pan / move around
  - **Scroll wheel**: zoom in/out

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js (for running the parser tests, optional)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blochsphere-app
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On Linux
   xdg-open index.html

   # On macOS
   open index.html

   # On Windows
   start index.html
   ```

   Or simply drag `index.html` into your browser window.

No build step or server required — the app runs directly from the HTML file using ES modules and Three.js loaded from CDN.

## Usage

Type a single-qubit state expression in the textbox at the bottom of the screen:

```
|0>
1/sqrt(2) |0> + 1/sqrt(2) |1>
sqrt(3)/2 |0> + 1/2 |1>
|+>
e^(i pi/4) |1>
```

To display multiple qubits, separate expressions with commas:

```
|0>, |+>, |i>, 1/sqrt(2) |0> + 1/sqrt(2) |1>
```

The Bloch sphere(s) update immediately as you type. Invalid expressions are highlighted with a red border on the textbox.

### Supported Syntax

| Syntax | Description |
|---|---|
| `\|0>`, `\|1>` | Computational basis states |
| `\|+>`, `\|->` | Plus/minus states (`(\|0> ± \|1>)/√2`) |
| `\|i>`, `\|-i>` | Y-basis states (`(\|0> ± i\|1>)/√2`) |
| `a \|0> + b \|1>` | General superposition (a, b are complex numbers) |
| `sqrt(2)`, `1/sqrt(2)` | Square root |
| `e^(i pi/4)` | Complex exponential |
| `pi`, `e` | Mathematical constants |
| `i` | Imaginary unit (`i² = -1`) |
| `+`, `-`, `*`, `/` | Arithmetic operators |
| `( )` | Parentheses for grouping |
| Comma (`,`) | Separates multiple qubits |

### Navigation Controls

| Input | Action |
|---|---|
| **Left drag** | Rotate/orbit the camera around the sphere |
| **Middle drag** or **Shift+Left drag** | Pan the view (move camera) |
| **Scroll wheel** | Zoom in/out |
| **Type in textbox** | Update the quantum state(s) |

The camera automatically reframes to fit all spheres whenever the number of qubits changes.

## Project Structure

```
blochsphere-app/
├── index.html        # Main application (HTML + CSS + JavaScript)
├── fonts/            # Ostrich Sans font files (UI typography)
├── test-parser.js    # Regression tests for the ket parser
└── README.md         # This file
```

### Key Components in `index.html`

- **Math & Parser** (`math: complex numbers & ket expressions`): Complex-number arithmetic, tokenizer, recursive-descent parser for ket expressions.
- **Scene** (`scene: reusable Bloch sphere assemblies`): Three.js setup, Bloch sphere geometry, label sprites, axis arrows.
- **Navigation** (`navigation: Blender-style camera controls`): Orbit, pan, and zoom camera controls.
- **UI** (`#textbox`, `#hint`): Input textarea and navigation hint overlay.

## Development

### Running Tests

The parser has a comprehensive test suite in `test-parser.js`. To run it:

```bash
node test-parser.js
```

The test suite extracts the math/parser section from `index.html` and runs it in isolation, covering:
- Complex-number arithmetic (addition, subtraction, multiplication, division)
- Parser correctness (kets, superpositions, phases, constants)
- Bloch vector mapping (Bloch coordinates ↔ three.js orientation)
- Error handling (invalid syntax, type mismatches)

All tests should pass before committing changes.

### Modifying the Parser

The parser lives in the `math: complex numbers & ket expressions` section of `index.html`. Key functions:

- `tokenize(src)`: Breaks input into tokens (numbers, identifiers, operators, kets).
- `parseExpr(tokens)`: Recursive-descent parser producing a state/complex value.
- `parseQubit(src)`: Top-level entry point; parses a ket expression and returns `{a, b}` amplitudes.
- `blochVector(state)`: Converts `{a, b}` amplitudes to Bloch sphere coordinates `(x, y, z)`.

After modifying the parser, run `node test-parser.js` to verify correctness.

### Customizing the Scene

The 3D scene is built with Three.js (loaded from CDN). The Bloch sphere assembly is created in `makeAssembly()` and includes:
- Wireframe sphere (latitude/longitude grid)
- Solid sphere with transparency
- X, Y, Z axis arrows with labels
- Equator circle
- State vector arrow (updated dynamically)

To change colors, materials, or geometry, edit the constants and constructors in the `scene` section.

### Fonts

The UI uses [Ostrich Sans](https://github.com/theleagueof/ostrich-sans) (Light, Medium, Bold weights). Font files are located in `fonts/`. If the font fails to load, the browser falls back to `sans-serif`.

To use a different font:
1. Place the font file(s) in `fonts/`.
2. Update the `@font-face` declarations in the `<style>` section of `index.html`.
3. Change the `font-family` in the `#textbox` and `#hint` CSS rules.

## Browser Compatibility

- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+

The app uses ES modules, Three.js, and modern CSS. Older browsers may not support all features.

## Known Issues

- The parser does not support multi-qubit entangled states (e.g., Bell states). Each comma-separated expression is treated as an independent single qubit.
- Phase labels (`|i>`, `|-i>`) may overlap in some orientations; this is cosmetic and does not affect functionality.
- The `.otf` font format may not render in very old browsers. Convert to `.woff2` for maximum compatibility.

## License

This project is open-source. See the repository's license file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) — 3D rendering library
- [Ostrich Sans](https://github.com/theleagueof/ostrich-sans) — Typeface by The League of Moveable Type
- Inspired by quantum computing education tools and interactive physics visualizations