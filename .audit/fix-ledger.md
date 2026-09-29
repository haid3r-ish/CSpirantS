# FIX LEDGER
last_updated: 2026-09-29T05:54:01.000Z
conventions_version: v16

## Summary
total_findings: 36
open: 19
in_progress: 0
fixed_pending_verify: 0
verified_fixed: 17
baselined: 0
skipped: 0
deferred: 0

## Entries
# Each entry:
# - id: <card-path>:<finding-index>
#   card: <card-path>
#   file: <source-path>
#   rule_ref: <rule or gp-N>
#   severity: INFO|LOW|MED|HIGH|CRITICAL
#   source: rule | critique
#   status: open | in_progress | fixed_pending_verify | verified_fixed | baselined | skipped | deferred
#   first_seen: <ISO>
#   approved_at: <ISO | null>
#   applied_at: <ISO | null>
#   verified_at: <ISO | null>
#   approach: <A | B | null>
#   commit: <git-sha | null>
#   notes: <1 line | null>

entries:
  - id: .audit/cards/apps_api_src_core_config.ts.card.yml:0
    card: .audit/cards/apps_api_src_core_config.ts.card.yml
    file: apps/api/src/core/config.ts
    rule_ref: cfg-2
    severity: MED
    source: rule
    status: open
    first_seen: 2026-09-27T18:10:12.704Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_modules_auth_auth.routes.ts.card.yml:0
    card: .audit/cards/apps_api_src_modules_auth_auth.routes.ts.card.yml
    file: apps/api/src/modules/auth/auth.routes.ts
    rule_ref: sys-rel-1
    severity: CRITICAL
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:10:12.704Z
    approved_at: 2026-09-28T16:30:00.000Z
    applied_at: 2026-09-28T16:30:00.000Z
    verified_at: 2026-09-28T16:45:00.000Z
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_modules_auth_auth.routes.ts.card.yml:1
    card: .audit/cards/apps_api_src_modules_auth_auth.routes.ts.card.yml
    file: apps/api/src/modules/auth/auth.routes.ts
    rule_ref: sec-2
    severity: CRITICAL
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:10:12.704Z
    approved_at: 2026-09-28T16:30:00.000Z
    applied_at: 2026-09-28T16:30:00.000Z
    verified_at: 2026-09-28T16:45:00.000Z
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_modules_auth_auth.routes.ts.card.yml:new-1
    card: .audit/cards/apps_api_src_modules_auth_auth.routes.ts.card.yml
    file: apps/api/src/modules/auth/auth.routes.ts
    rule_ref: gp-7
    severity: HIGH
    source: verify-review
    status: verified_fixed
    first_seen: 2026-09-28T16:45:00.000Z
    approved_at: 2026-09-28T18:23:00.000Z
    applied_at: 2026-09-28T18:23:00.000Z
    verified_at: 2026-09-28T18:23:00.000Z
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_modules_pipeline_llm-batch.service.ts.card.yml:0
    card: .audit/cards/apps_api_src_modules_pipeline_llm-batch.service.ts.card.yml
    file: apps/api/src/modules/pipeline/llm-batch.service.ts
    rule_ref: db-3
    severity: HIGH
    source: rule
    status: open
    first_seen: 2026-09-27T18:13:20.249Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_modules_pipeline_llm-batch.service.ts.card.yml:1
    card: .audit/cards/apps_api_src_modules_pipeline_llm-batch.service.ts.card.yml
    file: apps/api/src/modules/pipeline/llm-batch.service.ts
    rule_ref: eff-1a
    severity: HIGH
    source: rule
    status: open
    first_seen: 2026-09-27T18:13:20.249Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_orchestrator.ts.card.yml:0
    card: .audit/cards/apps_api_src_pipeline_orchestrator.ts.card.yml
    file: apps/api/src/pipeline/orchestrator.ts
    rule_ref: sys-rel-2
    severity: CRITICAL
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:21:12.892Z
    approved_at: 2026-09-28T23:25:00.000Z
    applied_at: 2026-09-28T23:25:00.000Z
    verified_at: 2026-09-28T18:31:30.912Z
    approach: A
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml:0
    card: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml
    file: apps/api/src/pipeline/stage-discover.ts
    rule_ref: sys-rel-5
    severity: HIGH
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:16:37.074Z
    approved_at: 2026-09-29T05:25:00.000Z
    applied_at: 2026-09-29T05:33:35.000Z
    verified_at: 2026-09-29T05:54:01.000Z
    approach: A
    commit: null
    notes: "Wrapped stage execution in Promise.race with 2500s timeout budget"
  - id: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml:1
    card: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml
    file: apps/api/src/pipeline/stage-discover.ts
    rule_ref: eff-1a
    severity: HIGH
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:16:37.074Z
    approved_at: 2026-09-29T05:38:03.000Z
    applied_at: 2026-09-29T05:38:03.000Z
    verified_at: 2026-09-29T05:54:01.000Z
    approach: A
    commit: null
    notes: "Batch DB queries for discovered links"
  - id: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml:2
    card: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml
    file: apps/api/src/pipeline/stage-discover.ts
    rule_ref: pip-2
    severity: CRITICAL
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:16:37.074Z
    approved_at: 2026-09-29T05:38:03.000Z
    applied_at: 2026-09-29T05:38:03.000Z
    verified_at: 2026-09-29T05:54:01.000Z
    approach: A
    commit: null
    notes: "Atomic stats update using $transaction and FOR UPDATE"
  - id: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml:new-1
    card: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml
    file: apps/api/src/pipeline/stage-discover.ts
    rule_ref: gp-14
    severity: MED
    source: verify-review
    status: verified_fixed
    first_seen: 2026-09-29T05:38:03.000Z
    approved_at: 2026-09-29T05:38:03.000Z
    applied_at: 2026-09-29T05:38:03.000Z
    verified_at: 2026-09-29T05:54:01.000Z
    approach: A
    commit: null
    notes: "Inject correlation IDs in logs"
  - id: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml:new-2
    card: .audit/cards/apps_api_src_pipeline_stage-discover.ts.card.yml
    file: apps/api/src/pipeline/stage-discover.ts
    rule_ref: gp-27
    severity: LOW
    source: verify-review
    status: verified_fixed
    first_seen: 2026-09-29T05:38:03.000Z
    approved_at: 2026-09-29T05:38:03.000Z
    applied_at: 2026-09-29T05:38:03.000Z
    verified_at: 2026-09-29T05:54:01.000Z
    approach: A
    commit: null
    notes: "Replace raw Error with NotFoundError"
  - id: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml:0
    card: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml
    file: apps/api/src/pipeline/stage-evaluate.ts
    rule_ref: sys-rel-5
    severity: HIGH
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:17:39.545Z
    approved_at: 2026-09-29T23:20:00.000Z
    applied_at: 2026-09-29T23:20:00.000Z
    verified_at: 2026-09-29T23:25:00.000Z
    approach: A
    commit: 4decb7d
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml:1
    card: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml
    file: apps/api/src/pipeline/stage-evaluate.ts
    rule_ref: sys-rel-6
    severity: CRITICAL
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:17:39.545Z
    approved_at: 2026-09-29T23:20:00.000Z
    applied_at: 2026-09-29T23:20:00.000Z
    verified_at: 2026-09-29T23:25:00.000Z
    approach: A
    commit: 4decb7d
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml:2
    card: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml
    file: apps/api/src/pipeline/stage-evaluate.ts
    rule_ref: eff-1a
    severity: HIGH
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:17:39.545Z
    approved_at: 2026-09-29T23:20:00.000Z
    applied_at: 2026-09-29T23:20:00.000Z
    verified_at: 2026-09-29T23:25:00.000Z
    approach: A
    commit: 4decb7d
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml:3
    card: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml
    file: apps/api/src/pipeline/stage-evaluate.ts
    rule_ref: pip-2
    severity: CRITICAL
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:17:39.545Z
    approved_at: 2026-09-29T23:20:00.000Z
    applied_at: 2026-09-29T23:20:00.000Z
    verified_at: 2026-09-29T23:25:00.000Z
    approach: A
    commit: 4decb7d
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml:new-1
    card: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml
    file: apps/api/src/pipeline/stage-evaluate.ts
    rule_ref: gp-18
    severity: MED
    source: verify-review
    status: verified_fixed
    first_seen: 2026-09-29T22:00:00.000Z
    approved_at: 2026-09-29T23:20:00.000Z
    applied_at: 2026-09-29T23:20:00.000Z
    verified_at: 2026-09-29T23:25:00.000Z
    approach: A
    commit: 4decb7d
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml:0
    card: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml
    file: apps/api/src/pipeline/stage-extract.ts
    rule_ref: sys-rel-5
    severity: HIGH
    source: rule
    status: open
    first_seen: 2026-09-27T18:18:46.319Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml:1
    card: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml
    file: apps/api/src/pipeline/stage-extract.ts
    rule_ref: eff-1a
    severity: HIGH
    source: rule
    status: open
    first_seen: 2026-09-27T18:18:46.319Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml:2
    card: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml
    file: apps/api/src/pipeline/stage-extract.ts
    rule_ref: pip-2
    severity: CRITICAL
    source: rule
    status: open
    first_seen: 2026-09-27T18:18:46.319Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_db_prisma_schema.prisma.card.yml:0
    card: .audit/cards/packages_db_prisma_schema.prisma.card.yml
    file: packages/db/prisma/schema.prisma
    rule_ref: db-4
    severity: LOW
    source: rule
    status: open
    first_seen: 2026-09-27T17:22:05.641Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_db_src_index.ts.card.yml:0
    card: .audit/cards/packages_db_src_index.ts.card.yml
    file: packages/db/src/index.ts
    rule_ref: cfg-1
    severity: CRITICAL
    source: rule
    status: open
    first_seen: 2026-09-27T17:27:40.539Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_llm-core_src_prompts_css-pms-filter.ts.card.yml:0
    card: .audit/cards/packages_llm-core_src_prompts_css-pms-filter.ts.card.yml
    file: packages/llm-core/src/prompts/css-pms-filter.ts
    rule_ref: llm-4
    severity: MED
    source: rule
    status: open
    first_seen: 2026-09-27T17:33:37.621Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_llm-core_src_providers_base.provider.ts.card.yml:0
    card: .audit/cards/packages_llm-core_src_providers_base.provider.ts.card.yml
    file: packages/llm-core/src/providers/base.provider.ts
    rule_ref: sys-obs-2
    severity: MED
    source: rule
    status: open
    first_seen: 2026-09-27T17:33:37.621Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_llm-core_src_providers_base.provider.ts.card.yml:1
    card: .audit/cards/packages_llm-core_src_providers_base.provider.ts.card.yml
    file: packages/llm-core/src/providers/base.provider.ts
    rule_ref: sys-io-2
    severity: HIGH
    source: rule
    status: open
    first_seen: 2026-09-27T17:33:37.621Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_llm-core_src_providers_base.provider.ts.card.yml:2
    card: .audit/cards/packages_llm-core_src_providers_base.provider.ts.card.yml
    file: packages/llm-core/src/providers/base.provider.ts
    rule_ref: sys-io-4
    severity: HIGH
    source: rule
    status: open
    first_seen: 2026-09-27T17:33:37.621Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_scraper-core_src_engine_cheerio-adapter.ts.card.yml:0
    card: .audit/cards/packages_scraper-core_src_engine_cheerio-adapter.ts.card.yml
    file: packages/scraper-core/src/engine/cheerio-adapter.ts
    rule_ref: sys-obs-2
    severity: MED
    source: rule
    status: open
    first_seen: 2026-09-27T17:30:48.366Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_scraper-core_src_engine_cheerio-adapter.ts.card.yml:1
    card: .audit/cards/packages_scraper-core_src_engine_cheerio-adapter.ts.card.yml
    file: packages/scraper-core/src/engine/cheerio-adapter.ts
    rule_ref: sys-io-3
    severity: MED
    source: rule
    status: open
    first_seen: 2026-09-27T17:30:48.366Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_scraper-core_src_engine_playwright-adapter.ts.card.yml:0
    card: .audit/cards/packages_scraper-core_src_engine_playwright-adapter.ts.card.yml
    file: packages/scraper-core/src/engine/playwright-adapter.ts
    rule_ref: sys-obs-2
    severity: MED
    source: rule
    status: open
    first_seen: 2026-09-27T17:30:48.366Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_scraper-core_src_engine_playwright-adapter.ts.card.yml:1
    card: .audit/cards/packages_scraper-core_src_engine_playwright-adapter.ts.card.yml
    file: packages/scraper-core/src/engine/playwright-adapter.ts
    rule_ref: sys-io-3
    severity: MED
    source: rule
    status: open
    first_seen: 2026-09-27T17:30:48.366Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_scraper-core_src_parsers_dawn.parser.ts.card.yml:0
    card: .audit/cards/packages_scraper-core_src_parsers_dawn.parser.ts.card.yml
    file: packages/scraper-core/src/parsers/dawn.parser.ts
    rule_ref: scr-1
    severity: HIGH
    source: rule
    status: open
    first_seen: 2026-09-27T17:32:07.510Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_scraper-core_src_parsers_index.ts.card.yml:0
    card: .audit/cards/packages_scraper-core_src_parsers_index.ts.card.yml
    file: packages/scraper-core/src/parsers/index.ts
    rule_ref: scr-2
    severity: MED
    source: rule
    status: open
    first_seen: 2026-09-27T17:32:07.510Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null
  - id: .audit/cards/packages_types_src_dashboard.types.ts.card.yml:0
    card: .audit/cards/packages_types_src_dashboard.types.ts.card.yml
    file: packages/types/src/dashboard.types.ts
    rule_ref: typ-1
    severity: HIGH
    source: rule
    status: open
    first_seen: 2026-09-27T17:10:50.970Z
    approved_at: null
    applied_at: null
    verified_at: null
    approach: null
    commit: null
    notes: null

  - id: .audit/cards/apps_api_src_pipeline_orchestrator.ts.card.yml:new-1
    card: .audit/cards/apps_api_src_pipeline_orchestrator.ts.card.yml
    file: apps/api/src/pipeline/orchestrator.ts
    rule_ref: gp-23
    severity: HIGH
    source: verify-review
    status: verified_fixed
    first_seen: 2026-09-28T23:25:00.000Z
    approved_at: 2026-09-28T23:25:00.000Z
    applied_at: 2026-09-28T23:25:00.000Z
    verified_at: 2026-09-28T18:31:30.912Z
    approach: A
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml:new-2
    card: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml
    file: apps/api/src/pipeline/stage-evaluate.ts
    rule_ref: gp-14
    severity: HIGH
    source: verify-review
    status: verified_fixed
    first_seen: 2026-09-29T23:20:00.000Z
    approved_at: 2026-09-29T23:20:00.000Z
    applied_at: 2026-09-29T23:20:00.000Z
    verified_at: 2026-09-29T23:25:00.000Z
    approach: A
    commit: 4decb7d
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml:new-3
    card: .audit/cards/apps_api_src_pipeline_stage-evaluate.ts.card.yml
    file: apps/api/src/pipeline/stage-evaluate.ts
    rule_ref: gp-27
    severity: MED
    source: verify-review
    status: verified_fixed
    first_seen: 2026-09-29T23:20:00.000Z
    approved_at: 2026-09-29T23:20:00.000Z
    applied_at: 2026-09-29T23:20:00.000Z
    verified_at: 2026-09-29T23:25:00.000Z
    approach: A
    commit: 4decb7d
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml:0
    card: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml
    file: apps/api/src/pipeline/stage-extract.ts
    rule_ref: sys-rel-5
    severity: HIGH
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:18:46.319Z
    approved_at: 2026-09-29T23:44:00.000Z
    applied_at: 2026-09-29T23:44:00.000Z
    verified_at: 2026-09-30T00:05:00.000Z
    approach: A
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml:1
    card: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml
    file: apps/api/src/pipeline/stage-extract.ts
    rule_ref: eff-1a
    severity: HIGH
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:18:46.319Z
    approved_at: 2026-09-29T23:44:00.000Z
    applied_at: 2026-09-29T23:44:00.000Z
    verified_at: 2026-09-30T00:05:00.000Z
    approach: A
    commit: null
    notes: null
  - id: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml:2
    card: .audit/cards/apps_api_src_pipeline_stage-extract.ts.card.yml
    file: apps/api/src/pipeline/stage-extract.ts
    rule_ref: pip-2
    severity: CRITICAL
    source: rule
    status: verified_fixed
    first_seen: 2026-09-27T18:18:46.319Z
    approved_at: 2026-09-29T23:44:00.000Z
    applied_at: 2026-09-29T23:44:00.000Z
    verified_at: 2026-09-30T00:05:00.000Z
    approach: A
    commit: null
    notes: null