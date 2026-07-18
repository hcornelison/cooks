import { describe, expect, it } from 'vitest';
import { commitHash, commitHashShort, repoUrl } from '../src/utils/git';

describe('git build info', () => {
  it('points at the real repo', () => {
    expect(repoUrl).toBe('https://github.com/hcornelison/cooks');
  });

  it('resolves a commit hash from the local git checkout', () => {
    // Running inside a git checkout (which CI and local dev both are),
    // this should always resolve rather than fall through to null.
    expect(commitHash).toMatch(/^[0-9a-f]{40}$/);
  });

  it('derives the short hash as a 7-character prefix of the full hash', () => {
    expect(commitHashShort).toBe(commitHash?.slice(0, 7));
    expect(commitHashShort).toMatch(/^[0-9a-f]{7}$/);
  });
});
