import { DomainConfig } from './types';

const VERCEL_API = 'https://api.vercel.com';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

async function vercelFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${VERCEL_API}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(error.error?.message || 'Vercel API error');
  }

  return response.json();
}

export async function addDomainToVercel(domain: string): Promise<void> {
  const teamQuery = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
  await vercelFetch(`/v10/projects/${VERCEL_PROJECT_ID}/domains${teamQuery}`, {
    method: 'POST',
    body: JSON.stringify({ name: domain }),
  });
}

export async function removeDomainFromVercel(domain: string): Promise<void> {
  const teamQuery = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
  await vercelFetch(`/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}${teamQuery}`, {
    method: 'DELETE',
  });
}

export async function getDomainConfig(domain: string): Promise<DomainConfig> {
  const teamQuery = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
  return await vercelFetch(`/v6/domains/${domain}/config${teamQuery}`);
}

export async function verifyDomain(domain: string): Promise<DomainConfig> {
  const teamQuery = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
  return await vercelFetch(`/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify${teamQuery}`, {
    method: 'POST',
  });
}

export function isVercelConfigured(): boolean {
  return !!(VERCEL_TOKEN && VERCEL_PROJECT_ID);
}
