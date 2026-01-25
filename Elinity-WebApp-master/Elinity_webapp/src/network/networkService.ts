import { fetchWithAuth } from '../services/apiClient';
import type { Person } from './types';

// Helper to map API response to Person
function mapToPerson(data: any): Person {
  // data matches the structure returned by my new /connections/ endpoint OR /users/{id}
  // If from /connections/, it has: id, connection_id, name, avatar, relation, bio, metrics
  // If from /users/{id}, it has: id, personal_info, bio, etc.

  if (data.connection_id) {
    // From /connections/
    return {
      id: data.id,
      name: data.name,
      avatar: data.avatar || undefined,
      relation: data.relation || 'Connection',
      bio: data.bio || '',
      metrics: data.metrics,
      // history: [] // fetch if needed
    };
  } else {
    // From /users/{id}
    const pi = data.personal_info || {};
    return {
      id: data.id,
      name: `${pi.first_name || ''} ${pi.last_name || ''}`.trim() || 'Unknown',
      avatar: data.profile_image_url || undefined,
      relation: 'Connection', // default
      bio: data.bio || '',
      metrics: { healthScore: 50, positiveInteractions: 0, sharedActivities: [] }
    };
  }
}

export async function getNetworkPeople(): Promise<Person[]> {
  try {
    const res = await fetchWithAuth('/connections/?status_filter=personal_circle');
    if (!res.ok) throw new Error('Failed to fetch connections');
    const data = await res.json();
    return data.map(mapToPerson);
  } catch (err) {
    console.error("getNetworkPeople error:", err);
    return [];
  }
}

export async function getPersonById(id: string): Promise<Person | undefined> {
  try {
    // Ideally we fetch connection details to know relation, but fetching user profile is a fallback
    const res = await fetchWithAuth(`/users/${id}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    return mapToPerson(data);
  } catch (err) {
    console.error(`getPersonById ${id} error:`, err);
    return undefined;
  }
}

export async function searchPeople(query: string): Promise<Person[]> {
  const all = await getNetworkPeople();
  const q = query.toLowerCase();
  return all.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.relation && p.relation.toLowerCase().includes(q))
  );
}
