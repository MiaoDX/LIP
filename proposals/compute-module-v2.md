# Compute Module V2: Concept and Semantics Proposal

- **Status**: Concept review draft
- **Date**: 2026-07-20
- **Scope**: Greenfield design informed by production experience from Perception Compute Module V1
- **Review target**: Product model, domain boundaries, and observable runtime semantics

> This document prioritizes concepts and observable semantics. Its final section
> contains only enough non-normative implementation shape to start a prototype;
> later agents may choose concrete APIs, libraries, schemas, and package layout.

## 1. Review contract

This proposal answers four questions before implementation choices are locked:

1. What problem is Compute Module V2 solving?
2. Which concepts belong in the smallest coherent runtime?
3. What behavior must users observe regardless of implementation language or
   scheduler?
4. Which semantic decisions remain open and require evidence?

Status labels have precise meanings:

| Status | Meaning |
| --- | --- |
| **Foundational** | Direction inherited from proven V1 experience and proposed as the stable basis for V2 |
| **Proposed** | Candidate Alpha semantic that requires review before becoming normative |
| **Open** | Material semantic choice that must be decided before the affected implementation slice |
| **Deferred** | Intentionally outside Alpha unless evidence changes the boundary |

This proposal is the only source of truth for conceptual and observable
semantics. The non-normative implementation guidance in Section 12 may explore
ways to realize them, but must not silently redefine them.

## 2. Context and problem

The original Perception Compute Module addressed recurring problems in a growing
perception codebase:

- algorithm logic accumulated inside large application classes;
- modules used inconsistent interfaces and coding styles;
- global flags and parameters obscured ownership;
- profiling and debug logic was embedded throughout business code;
- changing algorithm composition often required source edits and recompilation.

V1 separated four responsibilities: a module composed smaller Units, Units
implemented computation, a World owned shared data, and configuration selected
and ordered Units. Explicit resource relationships later enabled dependency
analysis, parallel scheduling, GPU locking, state-aware execution, and
visualization.

The production lesson is not that V2 should reproduce every V1 feature. It is
that separating data, computation, composition, and execution creates a useful
extension boundary.

V2 is therefore a greenfield runtime, not a source-compatible rewrite of the
C++ implementation.

## 3. Goals and boundaries

### 3.1 Product goals

- Preserve the proven separation between data, computation, composition, and
  execution.
- Create a standalone runtime with a smaller core and a broader domain than
  perception.
- Make Rust and Python first-class Unit authoring environments while keeping one
  runtime semantic model.
- Validate composition before running business code.
- Support efficient in-process exchange of large arrays, tensors, and
  device-backed buffers without promising universal zero-copy.
- Make runtime decisions inspectable by humans and AI coding agents.
- Allow scheduling and resource policies to evolve without changing Unit
  business logic.

### 3.2 Engineering goals

- Declare every Unit's resource access explicitly.
- Derive dependencies and access conflicts from those declarations.
- Avoid copying large resources unless ownership or isolation requires it.
- Give sequential and parallel schedulers one observable semantic contract.
- Separate declaration, validation, binding, execution, and physical memory
  planning.
- Produce diagnostics that identify the Unit, resource, access intent, and
  dependency involved in a failure.

### 3.3 AI-assisted development goals

- Expose machine-readable Unit, resource, configuration, and Plan declarations.
- Generate scaffolding, examples, tests, and documentation from shared metadata.
- Let agents inspect why a Unit runs, waits, conflicts, fails, or is skipped.
- Prefer explicit contracts over constructor side effects and implicit naming.

### 3.4 Non-goals for Alpha

- Source compatibility with V1 C++ Units.
- A complete entity-component-system framework.
- Dynamic or conditional graph mutation during the lifetime of a bound Compute
  Module.
- Distributed or transparent remote execution.
- Automatic optimization of arbitrary graphs.
- A first-class C++ Unit SDK.
- Sandboxing hostile Units.
- Universal zero-copy across languages, processes, and resource types.
- Reproducing every historical V1 extension.

## 4. Foundational design

| ID | Status | Proposal |
| --- | --- | --- |
| CM-F01 | **Foundational** | Data and computation remain separate: Units implement behavior; the World governs logical resources and leases, while physical storage may be runtime-owned or borrowed from the host. |
| CM-F02 | **Foundational** | The World may be large, but each Unit receives only its declared resource view. |
| CM-F03 | **Foundational** | Access is an explicit contract available before Unit construction or execution. |
| CM-F04 | **Foundational** | Every frontend compiles into one language-neutral logical Plan. |
| CM-F05 | **Foundational** | Invalid graphs, bindings, types, and conflicts fail before business code runs. |
| CM-F06 | **Foundational** | Logical resource semantics are separate from physical allocation and buffer reuse. |
| CM-F07 | **Foundational** | Sequential and parallel schedulers implement the same Plan rather than different Unit APIs. |
| CM-F08 | **Foundational** | Diagnostics and explanations are part of the product contract. |
| CM-F09 | **Foundational** | New runtime features require a concrete scenario that the smaller kernel cannot express. |

## 5. Conceptual model

```text
Plan sources
    |
    v
validated logical Plan
    |
    +---- dependency and access model
    |
    +---- binding and physical memory plan
    |
    v
bound Execution Plan
    |
    v
Scheduler ---- Unit instances
    |                |
    +------ World ---+
```

| Term | Definition |
| --- | --- |
| Compute Module V2 | The framework and runtime described by this proposal |
| Module Definition | Declarative composition of resources, Unit instances, bindings, configuration, and policies |
| Compute Module | A validated and bound runtime instance of one Module Definition |
| Unit | The smallest scheduled computation |
| Resource | A typed logical value registered by the World and backed by runtime-owned or borrowed storage |
| World | The authority for logical resource identity, publication, and leases visible to one Compute Module; it is not necessarily the physical storage owner |
| Unit Declaration | Inspectable metadata describing a Unit type, configuration, and resource access slots |
| Logical Plan | A validated language-neutral graph whose resource versions, dependencies, access constraints, and declaration provenance are fixed before binding |
| Execution Plan | An immutable Logical Plan bound to Unit instances, concrete resources, and a physical storage plan |
| Physical storage planning | The mapping from logical resources and lifetimes to physical storage; whether this is a first-class artifact is an implementation choice |
| Scheduler | The policy that executes ready Units from an Execution Plan |
| Process Cycle | One complete execution for one request, frame, or tick |

One Compute Module owns one World and one immutable bound Execution Plan.
Separate module instances do not share resources unless the host explicitly
supplies shared external resources. Replication is safe only when those
resources are immutable, disjoint, or coordinated by the host; cross-module
writable sharing is an open concurrency boundary.

## 6. Proposed Alpha semantics

These statements are the primary idea-review surface. They are proposals, not
yet frozen implementation contracts.

### 6.1 Unit and lifecycle

- **CM-S01, Proposed:** A Unit declares its identity, configuration, resource
  access, lifecycle needs, and synchronous processing behavior.
- **CM-S02, Proposed:** Configuration, resource binding, startup, processing,
  shutdown, and destruction occur in a defined order. Exact hooks and API names
  are implementation choices.
- **CM-S03, Proposed:** A Unit may retain private algorithm state and prepared
  handles, but may not retain frame-scoped resource access beyond its allowed
  lifetime.
- **CM-S34, Proposed:** Scheduler-visible correctness may depend only on declared
  resources and ordering constraints. Private state is exclusive to one Unit
  instance. Shared mutable state, host callbacks, I/O, and other externally
  visible effects must be mediated through declared Resources or an explicit
  serial policy that compiles to non-data ordering constraints. Otherwise the
  Plan is not eligible for parallel scheduling or scheduler-equivalence.
  Serial ordering alone does not give an external effect value-equivalence or
  rollback guarantees; effects needing those guarantees must be represented as
  Resources.
- **CM-S04, Open:** Cleanup guarantees after partial initialization, fatal
  failure, explicit shutdown, and host destruction must be defined before the
  lifecycle API is fixed.

### 6.2 Process Cycle

- **CM-S05, Proposed:** Alpha executes at most one Process Cycle at a time per
  Compute Module. An overlapping invocation is rejected with a structured
  admission error before inputs are refreshed or Unit business code runs;
  Alpha does not silently block or queue it. Applications may use multiple
  module instances for overlap.
- **CM-S06, Proposed:** Before Unit business code runs, each cycle validates the
  complete host input envelope, including declared presence, no unknown inputs,
  semantic and representation compatibility, and required leases. It
  then creates frame-scoped state, executes ready Units, publishes successful
  results, and keeps explicitly exported values valid for their declared
  host-visible lifetime.
- **CM-S07, Open:** The next-cycle behavior while a prior frame output remains
  live must be explicit. Ownership transfer, copying, shared ownership,
  rejection, blocking, or additional storage are implementation candidates.
- **CM-S30, Open:** Writable resources shared by multiple Compute Modules require
  a host/runtime coordination contract or must be rejected.

### 6.3 Resource ownership and lifetime

A resource must declare enough information to answer:

- who owns its storage;
- whether it lives for a cycle, across cycles, or outside the runtime;
- whether it has an initial value;
- whether it may be observed, created, or updated;
- when a borrowed view expires;
- whether it can be exported from a cycle.

The initial taxonomy may use frame, persistent, external, parameter, and scratch
resources, but those names and their representation remain implementation
candidates. If scratch exists, it is Unit-private temporary storage: other Units
cannot address or export it, and it creates no dependency edge.

- **CM-S08, Proposed:** Persistent and read-only parameter state is initialized
  before processing; host-owned per-cycle inputs are supplied for each cycle.
- **CM-S09, Proposed:** Frame values begin uninitialized. Alpha treats every
  Observe and Update input as required; optional reads and the conditional or
  degraded execution they imply are deferred. Every read and required export
  must resolve to a successful publication. Optional exports, if accepted by
  CM-S36, do not make an upstream dependency optional.
- **CM-S36, Open:** Alpha must decide whether optional exports exist and, if so,
  how absence is represented without weakening required-value validation.
- **CM-S10, Open:** Ownership, lifetime, and mutability may need to be separate
  dimensions rather than one storage-class enum, especially for writable
  external resources.
- **CM-S37, Proposed:** Host-visible result values are explicit exports
  regardless of resource lifetime. Persistent resources are not automatically
  readable through inspection or cycle results. Exporting a value grants the
  declared host-visible lifetime, but does not grant write authority unless a
  separate writable lease contract does so.

### 6.4 Access and publication

V2 needs three semantic access intents:

| Intent | Meaning |
| --- | --- |
| Observe | Read the currently committed value without modifying it |
| Create | Publish a new logical value without depending on the prior value |
| Update | Read the current value and publish its successor with exclusive access |

Names such as `Read`, `Produce`, and `Mutate` are SDK candidates, not conceptual
requirements.

- **CM-S11, Proposed:** Access outside a Unit's declaration is unavailable.
- **CM-S12, Proposed:** A new logical publication from Create or Update becomes
  available only at the Unit's successful completion boundary. Physical
  in-place Update is legal only while the runtime holds an exclusive lease and
  no host or retained language view can observe the storage before commit.
- **CM-S13, Proposed:** Readers may run together; updates require exclusivity;
  readers around an update must have an unambiguous old-or-new ordering.
- **CM-S14, Proposed:** Alpha permits one Create and no Update for each logical
  frame resource. Transformation stages use distinct logical resources. This is
  an Alpha simplification; rejecting ambiguous multiple writers remains a
  durable safety rule.
- **CM-S31, Proposed:** Every Observe and Update is bound in the Logical Plan to
  a specific predecessor publication: an initial value or one planned writer.
  A frontend may infer that predecessor only when exactly one legal candidate
  exists; otherwise Plan validation rejects the binding until the source makes
  the predecessor and required non-data ordering explicit. Scheduler readiness
  never selects a resource version. Create does not expose any prior value to
  the Unit.
- **CM-S32, Proposed:** Alpha permits at most one update of a persistent logical
  resource per cycle. Ordered update chains require distinct logical resources
  unless idea review deliberately expands this rule.
- **CM-S33, Open:** The semantic model needs publication identity and history,
  but whether it exposes monotonically increasing version IDs is not yet
  decided.
- **CM-S15, Open:** The transaction boundary is not yet settled. The design must
  choose whether successful Unit commits remain visible after another Unit
  fails, or whether a cycle stages and commits state as a whole.
- **CM-S16, Open:** A failed in-place Update publishes no successor and must not
  re-expose possibly modified storage as the prior committed value. The design
  must still define whether the resource, current cycle, or entire module is
  poisoned and how recovery occurs.

Alpha uses this access-by-lifetime legality baseline:

| Resource lifetime | Observe | Create | Update |
| --- | --- | --- | --- |
| Frame | After its planned producer | One planned producer | Rejected in Alpha; use a distinct logical resource |
| Persistent | From its initialized publication | Initialization only, before cycles | At most once per cycle |
| External cycle | Allowed | Rejected | Only for explicitly writable storage under an exclusive host/runtime lease |
| Read-only parameter | Allowed | Initialization only, before cycles | Rejected |

Scratch storage remains Unit-private and does not participate in this matrix.

### 6.5 Planning and validation

- **CM-S17, Proposed:** Unit declarations are inspectable before constructors or
  business code run.
- **CM-S18, Proposed:** Plan validation resolves Unit types, configuration,
  resources, bindings, access intents, dependencies, policies, and exports.
- **CM-S19, Proposed:** The planner rejects unknown types, missing configuration
  or bindings, incompatible resource types, unresolved required values,
  ambiguous predecessor publications, conflicting writers, unordered
  read/update pairs, prohibited frame updates, and cycles.
- **CM-S20, Proposed:** Data relationships derive dependency edges. Non-data
  ordering is explicit; source-list order does not silently create dependencies.
  A serial policy is represented by explained non-data ordering constraints in
  the Logical Plan. Mutual exclusion without a planned order is not sufficient
  for externally visible effects whose order matters.
- **CM-S21, Proposed:** Every edge carries an explanation and provenance back to
  its declaration source.
- **CM-S35, Proposed:** Every resource type has a language-neutral semantic type
  identity and schema/version. Type identity, logical compatibility, and
  physical representation compatibility are separate checks. Logical Plan
  equivalence compares the normalized labeled graph: Unit semantic types and
  normalized configuration, resource semantic types and schemas, publication
  predecessor bindings, access intents, dependencies, policies, and explicit
  exports. It excludes source-list order, generated internal IDs, declaration
  provenance, Unit implementation language, and physical storage choices.
  Provenance may make diagnostics different without making Plans semantically
  different. Concrete IDs, normalization mechanisms, and schema formats remain
  implementation choices.

The Logical Plan equivalence oracle uses these baseline examples:

| Difference between two Plans | Logical Plan equivalent? |
| --- | --- |
| Source declaration order only | Yes |
| Rust versus Python Unit implementation language only | Yes |
| Generated internal IDs or declaration provenance only | Yes; diagnostics may differ |
| Raw configuration that normalizes to the same semantic configuration | Yes |
| Physical allocation, buffer reuse, or storage placement only | Yes; Execution Plans may differ |
| Semantic schema version, normalized configuration, predecessor binding, policy, or explicit export | No |

### 6.6 Scheduling and determinism

- **CM-S22, Proposed:** A stable sequential scheduler is the reference model for
  correctness, debugging, and deterministic testing. Its tie-break among ready,
  unordered, effect-free Units is deterministic for a Logical Plan but creates
  no dependency and is not a user-visible ordering guarantee.
- **CM-S23, Proposed:** A parallel scheduler runs only Units whose dependencies
  and access constraints are satisfied.
- **CM-S24, Proposed:** For successful cycles with fixed inputs and Unit code
  whose shared effects satisfy CM-S34, sequential and parallel schedulers expose
  the same value at every access boundary and the same final values.
- **CM-S25, Open:** Failed-cycle equivalence must be decided separately. Parallel
  execution must not acquire undocumented timing-dependent persistent state.

The runtime does not promise bitwise determinism for floating-point reductions,
random sources, external libraries, thread assignment, or wall-clock timing.

### 6.7 Failure behavior

- **CM-S38, Proposed:** Structured failures carry a conceptual phase and effect
  classification, independent of a concrete Rust enum or Python exception
  hierarchy. When the runtime retains control, diagnostics state whether Unit
  processing may have run, whether a cycle began or failed, and whether the
  module remains reusable or is poisoned. The classification does not decide
  the still-open transaction and recovery choices in CM-S04, CM-S15, CM-S16,
  CM-S25, or CM-S28.

| Failure phase | May Unit processing have run? | Required semantic distinction |
| --- | --- | --- |
| Plan validation | No | Compilation fails before construction or processing |
| Binding or initialization | No | No cycle starts; cleanup follows CM-S04 once decided |
| Cycle admission or input validation | No | Inputs are not refreshed and no Unit processing starts |
| Unit execution | Yes | The failing Unit and blocked dependents are identified |
| Publication or commit | Yes | Visibility and module usability follow the reviewed transaction and recovery rules |
| Contract violation or fatal boundary | Possibly | Reusable, poisoned, or unrecoverable state is explicit when the runtime can report it |

A Rust error returned by Unit processing and a Python exception raised during
Unit processing and contained by its adapter map to the same Unit-execution
failure concept. Process aborts, memory-safety violations, and failures that
escape the runtime's control have no structured recovery guarantee.

- **CM-S26, Proposed:** Unit failure stops new dependent work for the current
  cycle and returns a structured error.
- **CM-S27, Proposed:** A failed creation publishes no value, and a failed result
  exposes no uncommitted frame output.
- **CM-S28, Open:** Fail-fast launch behavior, already-running independent work,
  persistent commits, and recovery are coupled to CM-S15 and CM-S25 and must be
  reviewed together.
- **CM-S29, Deferred:** Retry, fallback, skip, timeout, cancellation, and degraded
  execution policies follow the Alpha baseline. Any staging or rollback needed
  to realize the chosen CM-S15 transaction boundary is not deferred.

## 7. Product and integration boundaries

### 7.1 Language direction

- **CM-P01, Proposed:** Rust is the runtime-kernel language.
- **CM-P02, Proposed:** Rust and Python are the first Unit authoring languages
  and produce equivalent Unit declarations.
- **CM-P03, Proposed:** Python is hosted by the runtime and follows the same
  access, publication, error, and lifetime semantics as Rust.
- **CM-P04, Deferred:** A first-class C++ SDK. A coarse legacy-module adapter or
  process boundary may support evaluation without shaping the kernel.

### 7.2 Interoperability and zero-copy

- **CM-P05, Foundational:** Zero-copy is an outcome of compatible ownership,
  representation, and lifetime. It is not a universal promise.
- **CM-P06, Proposed:** Host and device resources describe the metadata needed
  to validate representation, layout, memory domain, and synchronization.
- **CM-P07, Open:** Cross-language read-only enforcement and retained-view
  behavior must be safe even when a native Python library keeps a reference.
- **CM-P08, Proposed:** Physical buffer reuse is legal only after all readers and
  leases have ended and representation constraints remain compatible.
- **CM-P09, Proposed:** For device-backed work, synchronous Unit completion means
  either the device work is complete or the publication carries a completion
  fence that the runtime waits on before making dependent work ready. General
  GPU scheduling is deferred; this publication-ordering rule is not.

### 7.3 Observability and AI-assisted development

The runtime should expose structured information for:

- the source and compiled Plan;
- Unit and resource declarations;
- graph edges and their reasons;
- memory ownership, lifetime, and physical storage accounting;
- scheduling, dependency, execution, and language-boundary timing;
- resource publication history, copies, and retained views;
- structured errors with source provenance.

Humans and agents should be able to ask why a Unit ran, waited, conflicted, or
failed; which Unit produced a resource; which physical storage backed it; and
whether a language boundary copied data.

### 7.4 Proposed trust boundary

- **CM-T01, Proposed:** Rust Units compiled into the host are trusted native
  code.
- **CM-T02, Proposed:** Python Units are trusted application code, but adapters
  must still enforce the runtime's memory and access safety contract.
- **CM-T03, Proposed:** Future native plugins are unsafe foreign-function
  boundaries.
- **CM-T04, Proposed:** Plan sources are input and require schema validation.
- **CM-T05, Proposed:** Resource deserialization must not instantiate untrusted
  code implicitly.

## 8. Canonical scenario

A host supplies a point cloud for one cycle. A preprocessing Unit observes it
and creates normalized points. A detector observes the normalized points and
creates objects. A tracker observes the objects and updates persistent tracks.

```text
host points -> preprocess -> normalized points -> detector -> objects -> tracker
                                                                        |
                                                                        v
                                                               persistent tracks
```

For a successful cycle, the host receives explicitly exported objects and
persistent tracks. If detection fails, no objects are exported and tracking does
not run. What happens to successful independent persistent updates during that
failed cycle is intentionally left to CM-S15, CM-S25, and CM-S28.

This scenario must remain expressible through every supported frontend and must
produce one equivalent logical Plan.

Two smaller fixtures protect ordering semantics:

1. If a persistent observer could bind to either an initial publication or an
   updated publication, the frontend must identify the intended predecessor and
   any required order. The planner rejects ambiguity; the scheduler never picks
   a version at runtime.
2. Given an unordered effect-free Unit A and externally effectful Units B and C,
   A may overlap either effectful Unit. B and C may use serial policy only when
   the Logical Plan contains their explicit relative order and explains its
   provenance. A sequential tie-break alone creates no such order.

## 9. Conceptual proof requirements

The reviewed model should be implementable and evaluable in scenarios where:

- one logical Plan can represent equivalent Rust, Python, and declarative Module
  Definitions;
- declared access can be validated before Unit execution;
- ambiguous predecessor publications and prohibited frame updates fail before
  Unit execution;
- invalid bindings, types, writers, ordering, and cycles fail with actionable
  diagnostics;
- missing, unknown, incompatible, or unleasable cycle inputs fail before input
  refresh or Unit execution;
- only explicitly exported values appear as host-visible cycle results;
- the sequential reference behavior is deterministic for supported resources;
- sequential and parallel execution preserve successful-cycle visible results;
- persistent state and frame outputs follow the reviewed failure semantics;
- a representative large buffer can cross Rust and Python without a copy under
  a safe lifetime contract;
- graph edges, conflicts, copies, and scheduling behavior are explainable;
- Rust and Python failures use one structured conceptual error model;
- overlapping cycles on one module are rejected before the second invocation
  refreshes inputs or runs Unit code;
- the kernel can be demonstrated without making C++ a first-class SDK.

Exact fixtures, commands, thresholds, and test placement are implementation
choices and should be selected when the prototype exists.

## 10. Idea-review agenda

The next review should decide these questions before implementation details are
promoted to contracts:

| Question | Related IDs | Why it matters |
| --- | --- | --- |
| What is the transaction boundary: Unit or Process Cycle? | CM-S15, CM-S28 | Determines state visibility and recovery after failure |
| What state equivalence is required after failed sequential and parallel cycles? | CM-S25, CM-S34 | Covers World state, Unit-private state, and externally visible effects |
| May updates be physically in place, and what is invalidated when they fail? | CM-S16 | Determines rollback, poisoning, and module recovery |
| Are ownership, lifetime, mutability, and storage location separate dimensions? | CM-S10 | Makes external and device resource contracts representable |
| How are cross-language read-only and lifetime rules enforced? | CM-P07 | Protects scheduler correctness and memory safety |
| What happens while a prior frame output remains alive? | CM-S07 | Defines backpressure, ownership, and allocation behavior |
| How are writable external resources coordinated across module instances? | CM-S30 | Prevents cross-instance races outside one Scheduler |
| Are optional exports allowed, and how is absence represented? | CM-S36 | Defines successful result completeness without weakening required exports |
| What cleanup is guaranteed across every lifecycle exit? | CM-S04 | Protects native and Python resources |
| Who initializes persistent state: host, factory, or restoration service? | CM-S08 | Clarifies ownership and reproducibility |

## 11. Deferred capabilities

- asynchronous Units;
- dynamic native loading;
- dynamic or conditional Plans;
- multiple in-flight cycles per module;
- general GPU resource scheduling;
- process-isolated Python workers;
- ownership-consuming access for aggressive buffer reuse;
- stable serialized Plan compatibility;
- persistent caching and checkpointing;
- remote execution.

Each capability requires a representative workload and explicit proof that the
Alpha kernel cannot meet the need without it.

## 12. Minimal implementation guidance

This section is intentionally non-normative. It gives a future agent a compact
starting shape without prescribing crate boundaries, concrete Rust traits,
Python decorators, serialization formats, schedulers, or interoperability
libraries.

### 12.1 Smallest useful host surface

The implementation should preserve these responsibilities even when it combines
or renames operations:

```text
compile(module_definition, unit_registry) -> logical_plan
instantiate(logical_plan, initial_resources) -> module
run_cycle(module, external_resources) -> cycle_result
inspect(module) -> runtime_snapshot
shutdown(module)
```

- compilation reads inspectable Unit declarations and runs no Unit business
  logic;
- instantiation creates Units, initializes persistent state, binds resources,
  and prepares physical storage;
- each cycle receives its complete external input envelope explicitly and
  validates it before refreshing inputs or running Unit business code;
- overlapping cycle calls on one module fail admission rather than queueing;
- inspection exposes metadata and immutable runtime snapshots, not an alternate
  path for undeclared business-data exports or mutable World access;
- shutdown and partial-initialization failure release initialized resources in a
  defined order, after CM-S04 is decided.

### 12.2 Smallest useful Plan example

The syntax is illustrative. An implementation may use builders, YAML, another
declarative format, or several equivalent frontends.

```yaml
resources:
  raw_points: { type: PointCloud, lifetime: external-cycle }
  normalized_points: { type: PointCloud, lifetime: frame }
  objects:    { type: Objects, lifetime: frame, export: true }
  tracks:     { type: Tracks, lifetime: persistent, export: true }

units:
  - id: preprocess
    type: Preprocessor
    bind: { points: raw_points, normalized: normalized_points }
  - id: detector
    type: Detector
    bind: { points: normalized_points, objects: objects }
  - id: tracker
    type: Tracker
    bind: { objects: objects, tracks: tracks }
```

The Unit declarations, rather than this Plan source, state whether each binding
observes, creates, or updates a resource. A minimal authoring model is:

```text
Unit Detector
  points:  Observe<PointCloud>
  objects: Create<Objects>

  process(context):
    points = context.observe(points)
    objects = context.create(objects)
    detect(points, objects)
```

Names such as `Observe`, `Create`, `Update`, `process`, and `context` may change.
The semantic IDs in Sections 4-7 are the contract under review.

### 12.3 Implementation freedom

A future implementation agent may choose:

- workspace, crate, module, and package boundaries;
- internal ID, declaration, Plan, error, and storage representations;
- explicit traits, builders, macros, decorators, or generated code;
- a thread pool or executor for parallel scheduling;
- embedded Python integration and supported buffer protocols;
- allocation, lease, staging, and buffer-reuse strategies;
- CLI commands, diagnostics rendering, and test organization.

Those choices must remain replaceable until evidence validates them. An agent
must not silently resolve an **Open** item from Section 10; it should prototype
alternatives or return the decision to idea review.

### 12.4 First implementation increment

The smallest useful increment is Rust-only and sequential. It uses a narrow
temporary baseline that does not decide the remaining failed-cycle questions:
the host supplies initial tracks, publications are staged logically, physical
in-place Update is disabled, and negative execution tests fail before any
persistent Update begins.

- register typed resources and inspectable Unit declarations;
- construct one Plan manually;
- validate bindings, types, required producers, predecessor publications,
  conflicting writers, prohibited frame updates, and cycles;
- derive a stable DAG and explain every edge;
- execute the successful canonical scenario with a sequential reference
  scheduler;
- prove successful publication, explicit exports, host input admission,
  overlapping-cycle rejection, validation failures, and failed Create before
  tracking with executable tests.

Failure during or after persistent Update is not part of this increment. It is
blocked on CM-S15, CM-S16, CM-S25, and CM-S28 rather than being silently assigned
prototype semantics.

It should not add Python, parallel execution, dynamic loading, generalized
buffer reuse, or stable serialized compatibility. These are later evidence
steps, not prerequisites for learning whether the core model works.

### 12.5 Evidence expected from later increments

- equivalent Rust, Python, and declarative Module Definitions compile to the
  same logical Plan;
- the equivalence oracle distinguishes semantic graph changes from source order,
  provenance, implementation language, and physical storage changes;
- supported Python views enforce Observe access and safe lifetime behavior;
- successful sequential and parallel executions expose equivalent values;
- failed cycles follow the decisions for CM-S15, CM-S25, and CM-S28;
- lifecycle cleanup covers partial initialization and fatal failure;
- copy count, allocation, scheduling time, and dependency wait are measurable;
- one declaration can drive source scaffolding, configuration schema, Plan
  fragments, contract tests, documentation, examples, and a benchmark harness.

The implementation should update this document only when evidence changes a
concept, semantic decision, open question, or proof boundary. Ordinary API and
code evolution belongs in the implementation and its tests, not in additional
design documents.
