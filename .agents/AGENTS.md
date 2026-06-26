# Debugging and Execution Rule

When encountering bugs or complex issues that require debugging:
- ALWAYS prioritize running thorough debug scripts and carefully analyzing the state (e.g., database, API responses, exact file contents) over making quick guesses.
- It is perfectly acceptable to take a long time and write/execute comprehensive debug scripts. Do not rush.
- Avoid the cycle of "execute once -> fail -> retry -> fail again". Ensure that before applying a fix, the root cause is irrefutably proven through debugging (like writing debug output to a JSON file to inspect state).
- Quality and "getting it right the first time" are strictly prioritized over speed.
