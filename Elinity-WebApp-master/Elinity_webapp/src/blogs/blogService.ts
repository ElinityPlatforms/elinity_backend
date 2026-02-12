import { fetchWithAuth } from '../services/apiClient';
import type { Blog, Resource } from './types';

export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const res = await fetchWithAuth('/blogs/');
    if (!res.ok) throw new Error('Failed to fetch blogs');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

export const getBlogById = async (id: string): Promise<Blog | undefined> => {
  try {
    const res = await fetchWithAuth(`/blogs/${id}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    return undefined;
  }
};

export const searchBlogs = async (query: string): Promise<Blog[]> => {
  try {
    const res = await fetchWithAuth(`/blogs/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search blogs');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error searching blogs:", error);
    // Fallback: fetch all and filter client-side if search endpoint doesn't exist
    const allBlogs = await getBlogs();
    const lowerQuery = query.toLowerCase();
    return allBlogs.filter(blog =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.excerpt.toLowerCase().includes(lowerQuery) ||
      blog.category.toLowerCase().includes(lowerQuery)
    );
  }
};

export const getBlogsByCategory = async (category: string): Promise<Blog[]> => {
  try {
    const res = await fetchWithAuth(`/blogs/category/${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error('Failed to fetch blogs by category');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching blogs for category ${category}:`, error);
    // Fallback
    const allBlogs = await getBlogs();
    return allBlogs.filter(blog => blog.category === category);
  }
};

export const getRelationshipResources = async (): Promise<Resource[]> => {
  try {
    // Mapping relationship-skills to resources as they seem conceptually similar
    const res = await fetchWithAuth('/relationship-skills/');
    if (!res.ok) throw new Error('Failed to fetch relationship skills');
    const data = await res.json();

    // Map backend response to frontend Resource type
    return data.map((item: any) => ({
      id: String(item.id),
      title: item.name,
      description: item.description,
      category: 'Skill', // Default category as backend might not have it
      link: `/skill/${item.id}`, // Internal link to skill practice
      icon: '🎓', // Default icon
      tags: ['Relationship', 'Skill'],
    }));
  } catch (error) {
    console.error("Error fetching relationship resources:", error);
    return [];
  }
};

export const getResourcesByCategory = async (category: string): Promise<Resource[]> => {
  const all = await getRelationshipResources();
  return all.filter(r => r.category === category);
};
