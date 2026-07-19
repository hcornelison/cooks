#!/usr/bin/env node
// Turns Playwright's JSON reporter output into a markdown table appended to
// $GITHUB_STEP_SUMMARY, so pass/fail counts show up on the Actions run
// summary page instead of being buried in step logs.
import { readFileSync, appendFileSync } from 'node:fs';

const [, , reportPath] = process.argv;
const report = JSON.parse(readFileSync(reportPath, 'utf8'));

const byProject = {};
function walk(suite) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const stats = (byProject[test.projectName] ??= { expected: 0, unexpected: 0, flaky: 0, skipped: 0 });
      stats[test.status] = (stats[test.status] ?? 0) + 1;
    }
  }
  for (const child of suite.suites ?? []) walk(child);
}
for (const suite of report.suites ?? []) walk(suite);

const { expected, unexpected, flaky, skipped, duration } = report.stats;
const lines = [
  '## Playwright e2e results',
  '',
  `**${expected} passed**, ${unexpected} failed, ${flaky} flaky, ${skipped} skipped — ${(duration / 1000).toFixed(1)}s`,
  '',
  '| Project | Passed | Failed | Flaky | Skipped |',
  '|---|---|---|---|---|',
  ...Object.entries(byProject).map(
    ([name, s]) => `| ${name} | ${s.expected ?? 0} | ${s.unexpected ?? 0} | ${s.flaky ?? 0} | ${s.skipped ?? 0} |`,
  ),
];
if (unexpected > 0) {
  lines.push('', '⚠️ See the `playwright-report` artifact on this run for full traces and screenshots.');
}

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
const output = lines.join('\n') + '\n';
if (summaryPath) {
  appendFileSync(summaryPath, output);
} else {
  console.log(output);
}
