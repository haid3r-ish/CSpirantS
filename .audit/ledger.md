# LEDGER
files_analyzed:
  - {path: apps/api/src/pipeline/orchestrator.ts, hash: 65c86149}
  - {path: apps/api/src/pipeline/slot-scheduler.ts, hash: d18295eb}
  - {path: apps/api/src/pipeline/stage-extract.ts, hash: 0e02bb5c}
  - {path: apps/api/src/pipeline/stage-evaluate.ts, hash: be128fe9}
  - {path: apps/api/src/pipeline/stage-discover.ts, hash: db1283ab}
  - {path: apps/api/src/modules/pipeline/llm-batch.routes.ts, hash: 2f61fcec}
  - {path: apps/api/src/modules/pipeline/llm-batch.service.ts, hash: feb2171b}
  - {path: apps/api/src/modules/pipeline/pipeline.routes.ts, hash: 49ed9336}
  - {path: apps/api/src/modules/pipeline/pipeline.service.ts, hash: 23fdef40}
  - {path: apps/api/src/modules/scraper/source.routes.test.ts, hash: d488bc9c}
  - {path: apps/api/src/modules/scraper/source.routes.ts, hash: 51d38253}
  - {path: apps/api/src/modules/scraper/source.service.ts, hash: 2a6f20f3}
  - {path: apps/api/src/core/config.ts, hash: 6651b310}
  - {path: apps/api/src/core/error-handler.ts, hash: 0526dbd3}
  - {path: apps/api/src/core/errors.ts, hash: 220f8c49}
  - {path: apps/api/src/core/server.ts, hash: a5452b80}
  - {path: apps/api/src/modules/auth/auth.middleware.ts, hash: a28bb8e1}
  - {path: apps/api/src/modules/auth/auth.routes.ts, hash: 62957d80}
  - {path: apps/api/src/modules/auth/auth.service.ts, hash: 1a39d16f}
  - {path: packages/llm-core/src/formatter/pipe-delimited.ts, hash: ed51cf49}
  - {path: packages/llm-core/src/prompts/css-pms-filter.ts, hash: 2b653f3c}
  - {path: packages/llm-core/src/providers/base.provider.ts, hash: 11568ec7}
  - {path: packages/llm-core/src/providers/factory.ts, hash: 7e090928}
  - {path: packages/llm-core/src/providers/gemini.provider.ts, hash: 90f2210e}
  - {path: packages/llm-core/src/providers/manual.provider.ts, hash: 5e98ace3}
  - {path: packages/llm-core/src/index.ts, hash: 1cf35513}
  - {path: packages/scraper-core/src/parsers/base.parser.ts, hash: 68a46a69}
  - {path: packages/scraper-core/src/parsers/dawn.parser.ts, hash: 15058906}
  - {path: packages/scraper-core/src/parsers/errors.ts, hash: ff5cd580}
  - {path: packages/scraper-core/src/parsers/index.ts, hash: 14f395b2}
  - {path: packages/scraper-core/src/index.ts, hash: 609f902f}
  - {path: packages/scraper-core/src/engine/cheerio-adapter.ts, hash: 761994a3}
  - {path: packages/scraper-core/src/engine/hybrid-fetch.ts, hash: 601f0c7f}
  - {path: packages/scraper-core/src/engine/playwright-adapter.ts, hash: 712d48fa}
  - {path: packages/scraper-core/src/extractor/declarative.ts, hash: 99fce2b3}
  - {path: packages/scraper-core/src/extractor/json-ld.ts, hash: 38ce6e58}
  - {path: packages/scraper-core/src/extractor/transforms.ts, hash: 82f07916}
  - {path: packages/scraper-core/src/hasher/canonical-url.ts, hash: c379a432}
  - {path: packages/db/src/index.ts, hash: 853444ae}
  - {path: packages/db/prisma/schema.prisma, hash: 6e9a24d0}
  - {path: packages/types/src/auth.types.ts, hash: 242011b9}
  - {path: packages/types/src/dashboard.types.ts, hash: 63f89e22}
  - {path: packages/types/src/dedup.types.ts, hash: c67cbf02}
  - {path: packages/types/src/llm.types.ts, hash: 82a4cb4a}
  - {path: packages/types/src/pipeline.types.ts, hash: a7fe2a4e}
  - {path: packages/types/src/scraper.types.ts, hash: 8aa4fe48}
  - {path: packages/types/src/vocab.interfaces.ts, hash: 293fbc6f}
  - {path: packages/types/src/vocab.types.ts, hash: 7825d379}
  - {path: packages/types/src/index.ts, hash: 802f3f62}
  - {path: packages/db/package.json, hash: 83e9c17f}
  - {path: packages/llm-core/package.json, hash: c19a5bc7}
  - {path: packages/scraper-core/package.json, hash: d1133189}
  - {path: packages/types/package.json, hash: 2f81732e}
  - {path: apps/api/package.json, hash: 606e80b4}
  - {path: package.json, hash: bd79743c}
  - {path: turbo.json, hash: ed56141a}
  - {path: pnpm-workspace.yaml, hash: 6745af6c}
  - {path: docker-compose.yml, hash: b2810f69}
  - {path: .env.example, hash: 50d0d105}
  - {path: apps/api/.env.example, hash: b61d9062}
open_duplication:
  - {group: runtime, sym: PipelineRunStatsInit, file: apps/api/src/pipeline/stage-evaluate.ts, fingerprint: fetchPipelineRun_statsInit}
  - {group: runtime, sym: PipelineRunStatsInit, file: apps/api/src/pipeline/stage-extract.ts, fingerprint: fetchPipelineRun_statsInit}
  - {group: runtime, sym: PipelineRunStatsUpdate, file: apps/api/src/pipeline/stage-evaluate.ts, fingerprint: updatePipelineRun_statsUpdate}
  - {group: runtime, sym: PipelineRunStatsUpdate, file: apps/api/src/pipeline/stage-extract.ts, fingerprint: updatePipelineRun_statsUpdate}
  - {group: resource, sym: applyRandomDelay, file: packages/scraper-core/src/engine/cheerio-adapter.ts, fingerprint: applyRandomDelay_mathRandom}
  - {group: resource, sym: applyRandomDelay, file: packages/scraper-core/src/engine/playwright-adapter.ts, fingerprint: applyRandomDelay_mathRandom}
open_questions: []
cross_file_pending: []
conventions_version: v21
file_write_policy: enabled
synthesis_rules: [SYN-dead-1, SYN-dead-2, SYN-dead-3, SYN-dead-4, SYN-dead-5]
pass_groups: [identity, structure, runtime, resource, domain]
conventions_categories:
  - architecture
  - coding
  - config-env
  - database
  - efficiency
  - error-handling
  - llm-core
  - naming
  - pipeline-lifecycle
  - project-specific
  - queue-concurrency
  - scraper-core
  - security
  - types-hygiene
  - system-design
baseline_findings: {CRITICAL:8, HIGH:12, MED:8, LOW:1, INFO:0}
batches_done: [0, 1a, 1b, 1c, 2, 3, 4, 5, 6, 7, 8a, 8b, 8c, 9a, 9b]
batches_pending: []
batches_progress:
  0: {done: true, passes_complete: [0, 1]}
  1a: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  1b: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  1c: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  2: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  3: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  4: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  5: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  6: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  7: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  8a: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  8b: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  8c: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  9a: {done: true, passes_complete: [0, 1, 2, 3, 4]}
  9b: {done: true, passes_complete: [0, 1, 2, 3, 4]}


dead_code_inventory:
  - {rule: SYN-dead-1, sym: User.sessions}
dead_code_check: {reliable: true, last_run: "2026-09-28T03:19:34.128Z"}

verify_report: {trust: TRUSTWORTHY, timestamp: "2026-09-28T03:19:34.132Z"}
self_test_results: [{file: "mock", rule: "mock", verified: true}]
