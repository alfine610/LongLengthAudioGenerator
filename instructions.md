# Usage & Development Instructions

---

## 1. Overview

This application allows you to visually select a loop section from a BGM or other MP3 file, and generate a new, extended MP3 by repeating the selected section N times—all within your browser.  
It also features **automatic loop point detection** (find similar waveform segments for seamless looping).

---

## 2. Setup

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```
    By default, the app will be available at `http://localhost:3000`.

---

## 3. Basic Usage

1. Upload an MP3 file via the file selector.
2. The waveform will be displayed.
3. Select the loop region (start and end) by dragging on the waveform or entering values.
4. (Optional) Use the "Auto Detect Loop Point" button to automatically suggest similar segments.
5. Specify the number of loops (N).
6. Click the "Generate" button to create a new MP3 where the selected region is repeated N times.
7. Download the resulting file.

---

## 4. Development & Contribution

- Focus first on implementing core features: upload, waveform display, region selection, and loop generation.
- Propose new features or improvements via GitHub Issues or Pull Requests.
- Follow code style guidelines (Prettier, ESLint, etc.).

---

## 5. Technical Notes

- Refer to the documentation for wavesurfer.js, ffmpeg.wasm, and the Web Audio API.
- The loop region detection uses JavaScript algorithms (autocorrelation, sliding window, etc.) on PCM data from the Web Audio API.
- Large files (over 10MB) may be limited by browser resources.

---

## 6. Troubleshooting

- If `npm start` fails, try deleting `node_modules` and reinstalling.
- Check for version compatibility with wavesurfer.js and ffmpeg.wasm.

---

## 7. Contribution Guidelines

- Keep README, design_spec.md, and this instructions.md up to date.
- Use standard GitHub workflow for Issues and PRs.
- When in doubt, open an Issue for discussion.
