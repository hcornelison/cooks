import { execSync } from 'node:child_process';

function getCommitHash(): string | null {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return process.env.GITHUB_SHA ?? null;
  }
}

export const repoUrl = 'https://github.com/hcornelison/cooks';
export const commitHash = getCommitHash();
export const commitHashShort = commitHash?.slice(0, 7) ?? null;
