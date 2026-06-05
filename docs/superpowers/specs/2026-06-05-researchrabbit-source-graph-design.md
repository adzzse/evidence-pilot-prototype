# ResearchRabbit-Style Source Graph Design

## Context

EvidencePilot is currently a student-facing frontend prototype. The existing graph view is claim-centered and rendered as a small inspector relationship list.

This feature changes the graph model to behave more like ResearchRabbit: students explore a source network first, then inspect the claims supported by a selected source.

The prototype remains hardcoded. No backend, real citation graph, real AI retrieval, or real file parsing is required.

## Goal

Replace the current claim-first graph view with a source-first network graph where source nodes connect to related sources, and selecting a source reveals the claims and evidence connected to that source.

## Primary Actor

The primary actor is the Student.

The student uses the graph to understand how uploaded sources relate to each other and which claims each source supports.

## Graph Model

### Nodes

Each node represents one source.

Examples:

- `agile-risk-management.pdf`
- `sprint-review-feedback.docx`
- `https://example.com/agile-evidence-map`

Claims are not primary graph nodes in this design. Claims appear in the selected-source detail panel.

### Edges

Each edge represents a relationship between two sources.

For the prototype, two sources are connected when they:

- Support the same claim.
- Support related claims.
- Share a similar evidence topic.

Edge labels can use simple hardcoded relationship names:

- `shared claim`
- `related evidence`
- `same topic`

### Node Weight

Node visual darkness represents connection strength.

Rule:

- More connections means a darker node.
- Fewer connections means a lighter node.

This can be computed from the number of edges connected to the source.

Example visual mapping:

- 0-1 connections: light blue.
- 2 connections: medium blue.
- 3 or more connections: dark blue.

The selected source node should also receive a clear ring or outline so selection is visible even if the node is already dark.

## Graph Interaction

When the `Graph` tab is active:

1. The graph shows all source nodes for the current project.
2. Source nodes are positioned in a ResearchRabbit-like map layout.
3. Edges visually connect related sources.
4. Student can click a source node.
5. The clicked source becomes selected.
6. A right-side detail panel shows the source details and supported claims.

The graph should feel exploratory but remain simple enough for a prototype.

## Selected Source Detail Panel

The selected-source detail panel appears on the right side of the graph area.

Required content:

- Source title.
- Source type.
- Source status.
- Connection count.
- Supported or suggested claims associated with this source.
- Evidence excerpts for those claims.
- Mapping status for each evidence item, such as `mapped` or `suggested`.

If no source is selected, the panel should show a concise empty state:

`Select a source node to inspect its claims.`

## Relationship To Source Tab

The `Source` tab remains list-based.

The `Graph` tab becomes visual and source-network based.

Both tabs use the same hardcoded source, claim, and evidence data:

- `Source` tab shows source/evidence as cards.
- `Graph` tab shows source/evidence relationships as a network.

## Fit With Existing Workspace

The graph feature stays inside the current workspace and does not create a separate page.

The existing editor remains available in the workspace. When a supported claim is clicked in the editor, the app may still open the `Graph` tab, but the graph should select the first source mapped to that claim instead of centering on the claim itself.

## Non-Goals

- No real ResearchRabbit integration.
- No force-directed physics engine unless already easy to add without dependency churn.
- No real citation graph generation.
- No backend graph API.
- No real upload parsing.
- No autonomous AI relationship discovery.

## Prototype Data Requirements

The populated project should include enough hardcoded data to make the graph look meaningful:

- At least 5 source nodes.
- At least 5 source-to-source edges.
- At least one highly connected darker source.
- At least one selected source with multiple supported or suggested claims.
- At least one source with only one connection.

The empty project should show the graph empty state.

## Verification

After implementation:

- Build must pass.
- TypeScript check must pass.
- Browser verification should confirm:
  - Graph tab shows source nodes, not claim nodes.
  - Sources are connected by visible edges.
  - Higher-connection sources are darker.
  - Clicking a source selects it.
  - Selected source detail panel shows associated claims.
  - Empty project graph shows the empty state.
  - Mobile layout does not create horizontal overflow.
