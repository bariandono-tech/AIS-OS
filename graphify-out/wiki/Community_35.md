# Community 35

> 12 nodes

## Key Concepts

- **update** (11 connections)
- **graphify reference: incremental update and cluster-only** (1 connections)
- **For --update (incremental re-extraction)** (1 connections)
- **Load new extraction and incremental state** (1 connections)
- **Also prune old nodes for re-extracted (changed) files before inserting fresh AST.** (1 connections)
- **Without this, build_merge's dedup pass tries to reconcile old and new versions of** (1 connections)
- **the same file's nodes and can collapse same-named symbols across files (#1178).** (1 connections)
- **Use build_merge() — reads graph.json directly without NetworkX round-trip** (1 connections)
- **so edge direction (calls, implements, imports) is always preserved (#801).** (1 connections)
- **Write merged result back to .graphify_extract.json so Step 4 sees the full graph** (1 connections)
- **Save manifest so next --update diffs against today's state, not the** (1 connections)
- **d} for n, d in G.nodes(data=True)],
    'edges': [
        # Explicit source/target last so they win over any stale attrs in d.
        {** (1 connections)

## Relationships

- No strong cross-community connections detected

## Audit Trail

- EXTRACTED: 22 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*