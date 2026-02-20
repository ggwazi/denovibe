.PHONY: all start dev test lint fmt check mcp agent bench clean help

# Default target
all: check lint test

start:       ## Start the server
	deno task start

dev:         ## Start dev server with watch
	deno task dev

test:        ## Run all tests
	deno task test

lint:        ## Run linter
	deno task lint

fmt:         ## Format code
	deno task fmt

check:       ## Type-check
	deno task check

mcp:         ## Start MCP server
	deno task mcp

agent:       ## Run agent CLI (use ARGS="--skill deno-test")
	deno task agent $(ARGS)

bench:       ## Run benchmarks
	deno bench --allow-net --allow-read --allow-env src/router_bench.ts

coverage:    ## Run tests with coverage
	deno test --allow-net --allow-read --allow-env --allow-run --coverage=coverage/
	deno coverage coverage/ --lcov --output=coverage/lcov.info
	deno coverage coverage/

clean:       ## Remove generated files
	rm -rf coverage/ docs/api.json .deno-cache/

help:        ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
