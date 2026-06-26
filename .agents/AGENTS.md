# Debugging and Execution Rule

When encountering bugs or complex issues that require debugging:
- ALWAYS prioritize running thorough debug scripts and carefully analyzing the state (e.g., database, API responses, exact file contents) over making quick guesses.
- It is perfectly acceptable to take a long time and write/execute comprehensive debug scripts. Do not rush.
- Avoid the cycle of "execute once -> fail -> retry -> fail again". Ensure that before applying a fix, the root cause is irrefutably proven through debugging (like writing debug output to a JSON file to inspect state).
- Quality and "getting it right the first time" are strictly prioritized over speed.

# Flowchart Generation Rule

When the user asks to create a flowchart or diagram, ALWAYS use an HTML file format with `mermaid.js` and `html2canvas`. 
- Set `htmlLabels: true` in the Mermaid initialization.
- Implement a "Download PNG (HD)" button that uses `html2canvas` (`html2canvas(container, {backgroundColor: '#0d1117', scale: 3})`) to capture the DOM exactly as rendered.
- Do NOT rely on Mermaid's native SVG/PNG export if the user wants an image download, as it strips HTML labels in offline viewers. Use the `html2canvas` boilerplate instead to guarantee exact rendering.
- Always include modern CSS styling (e.g. dark mode, gradients, Inter font) to make it look premium.
