/**
 * GitHub API wrapper with rate limiting and error handling.
 */

const GITHUB_API = 'https://api.github.com';

function getToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('Missing GITHUB_TOKEN env var');
  return token;
}

async function githubFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = path.startsWith('http') ? path : `${GITHUB_API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options?.headers,
    },
  });

  // Handle rate limiting
  const remaining = res.headers.get('x-ratelimit-remaining');
  if (remaining && parseInt(remaining) < 10) {
    const resetAt = res.headers.get('x-ratelimit-reset');
    const waitMs = resetAt ? (parseInt(resetAt) * 1000 - Date.now()) : 60000;
    console.warn(`GitHub API rate limit low (${remaining} remaining). Waiting ${Math.round(waitMs / 1000)}s...`);
    await sleep(Math.max(waitMs, 1000));
  }

  return res;
}

export async function getRepoInfo(owner: string, repo: string): Promise<{
  exists: boolean;
  stars: number;
  license: string | null;
  defaultBranch: string;
  pushedAt: string;
  archived: boolean;
} | null> {
  const res = await githubFetch(`/repos/${owner}/${repo}`);
  if (!res.ok) return null;

  const data = await res.json() as any;
  return {
    exists: true,
    stars: data.stargazers_count,
    license: data.license?.spdx_id || null,
    defaultBranch: data.default_branch,
    pushedAt: data.pushed_at,
    archived: data.archived,
  };
}

export async function getLatestCommitSha(owner: string, repo: string, branch?: string): Promise<string | null> {
  const ref = branch || 'HEAD';
  const res = await githubFetch(`/repos/${owner}/${repo}/commits/${ref}`);
  if (!res.ok) return null;

  const data = await res.json() as any;
  return data.sha;
}

export async function getFileTree(owner: string, repo: string, sha: string): Promise<Array<{
  path: string;
  type: 'blob' | 'tree';
  size: number;
}>> {
  const res = await githubFetch(`/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`);
  if (!res.ok) return [];

  const data = await res.json() as any;
  return (data.tree || []).map((item: any) => ({
    path: item.path,
    type: item.type,
    size: item.size || 0,
  }));
}

export async function getFileContent(owner: string, repo: string, path: string): Promise<string | null> {
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${path}`, {
    headers: { 'Accept': 'application/vnd.github.raw+json' },
  });
  if (!res.ok) return null;
  return res.text();
}

export async function searchRepos(query: string, perPage = 30): Promise<Array<{
  fullName: string;
  description: string;
  stars: number;
  pushedAt: string;
  topics: string[];
}>> {
  const res = await githubFetch(`/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=${perPage}`);
  if (!res.ok) return [];

  const data = await res.json() as any;
  return (data.items || []).map((item: any) => ({
    fullName: item.full_name,
    description: item.description || '',
    stars: item.stargazers_count,
    pushedAt: item.pushed_at,
    topics: item.topics || [],
  }));
}

export async function searchCode(query: string, perPage = 30): Promise<Array<{
  repo: string;
  path: string;
  name: string;
}>> {
  // Code search has stricter rate limits: 10 req/min
  await sleep(7000);

  const res = await githubFetch(`/search/code?q=${encodeURIComponent(query)}&per_page=${perPage}`);
  if (!res.ok) return [];

  const data = await res.json() as any;
  return (data.items || []).map((item: any) => ({
    repo: item.repository.full_name,
    path: item.path,
    name: item.name,
  }));
}

// --- GitHub PR creation ---

export async function createBranch(owner: string, repo: string, branchName: string, fromSha: string): Promise<boolean> {
  const res = await githubFetch(`/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: fromSha }),
  });
  return res.ok;
}

export async function createOrUpdateFile(
  owner: string, repo: string, path: string, content: string,
  message: string, branch: string, existingSha?: string
): Promise<boolean> {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch,
  };
  if (existingSha) body.sha = existingSha;

  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return res.ok;
}

export async function createPullRequest(
  owner: string, repo: string,
  title: string, body: string,
  head: string, base: string
): Promise<{ number: number; url: string } | null> {
  const res = await githubFetch(`/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    body: JSON.stringify({ title, body, head, base }),
  });
  if (!res.ok) return null;

  const data = await res.json() as any;
  return { number: data.number, url: data.html_url };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
