# @openai/agents-core

## 0.0.14

### Patch Changes

- fba44d9: Fix #246 by exposing RunHandoffOutputItem type

## 0.0.13

### Patch Changes

- bd463ef: Fix #219 MCPServer#invalidateToolsCache() not exposed while being mentioned in the documents

## 0.0.12

### Patch Changes

- af73bfb: Rebinds cached tools to the current MCP server to avoid stale tool invocation (fixes #195)
- 046f8cc: Fix typos across repo
- ed66acf: Fixes handling of `agent_updated_stream_event` in run implementation and adds corresponding test coverage.
- 40dc0be: Fix #216 Publicly accessible PDF file URL is not yet supported in the input_file content data

## 0.0.11

### Patch Changes

- a60eabe: Fix #131 Human in the Loop MCP approval fails
- a153963: Tentative fix for #187 : Lock zod version to <=3.25.67
- 17077d8: Fix #175 by removing internal system.exit calls

## 0.0.10

### Patch Changes

- c248a7d: Fix #138 by checking the unexpected absence of state.currentAgent.handoffs
- ff63127: Fix #129 The model in run config should be used over an agent's default setting
- 9c60282: Fix a bug where some of the exceptions thrown from runImplementation.ts could be unhandled
- f61fd18: Don't enable `cacheToolsList` per default for MCP servers
- c248a7d: Fix #138 by checking the unexpected absence of currentAgent.handoffs

## 0.0.9

### Patch Changes

- 9028df4: Adjust Usage object to accept empty data
- ce62f7c: Fix #117 by adding groupId, metadata to trace data

## 0.0.8

### Patch Changes

- 6e1d67d: Add OpenAI Response object on ResponseSpanData for other exporters.
- 52eb3f9: fix(interruptions): avoid double outputting function calls for approval requests
- 9e6db14: Adding support for prompt configuration to agents
- 0565bf1: Add details to output guardrail execution
- 52eb3f9: fix(interruptions): avoid accidental infinite loop if all interruptions were not cleared. expose interruptions helper on state

## 0.0.7

### Patch Changes

- 0580b9b: Add remote MCP server (Streamable HTTP) support
- 77c603a: Add allowed_tools and headers to hosted mcp server factory method
- 1fccdca: Publishes types that were marked as internal but caused build errors when not exported in typings.
- 2fae25c: Add hosted MCP server support

## 0.0.6

### Patch Changes

- 2c6cfb1: Pass through signal to model call
- 36a401e: Add force flush to global provider. Consistently default disable logging loop in Cloudflare Workers and Browser

## 0.0.5

### Patch Changes

- 544ed4b: Continue agent execution when function calls are pending

## 0.0.4

### Patch Changes

- 25165df: fix: Process hangs on SIGINT because `process.exit` is never called
- 6683db0: fix(shims): Naively polyfill AsyncLocalStorage in browser
- 78811c6: fix(shims): Bind crypto to randomUUID
- 426ad73: ensure getTransferMessage returns valid JSON

## 0.0.3

### Patch Changes

- d7fd8dc: Export CURRENT_SCHEMA_VERSION constant and use it when serializing run state.
- 284d0ab: Update internal module in agents-core to accept a custom logger

## 0.0.2

### Patch Changes

- a2979b6: fix: ensure process.on exists and is a function before adding event handlers

## 0.0.1

### Patch Changes

- aaa6d08: Initial release

## 0.0.1-next.0

### Patch Changes

- Initial release
