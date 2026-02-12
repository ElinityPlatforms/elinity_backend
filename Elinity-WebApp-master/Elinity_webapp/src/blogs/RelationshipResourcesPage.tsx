import React, { useState, useEffect } from 'react';
import { getRelationshipResources, getResourcesByCategory } from './blogService';
import type { Resource } from './types';
import './Blogs.css';

const RelationshipResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all resources first to get categories
        const all = await getRelationshipResources();
        const uniqueCategories = Array.from(new Set(all.map(r => r.category)));
        setCategories(uniqueCategories);

        if (selectedCategory) {
          const filtered = await getResourcesByCategory(selectedCategory);
          setResources(filtered);
        } else {
          setResources(all);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  return (
    <div className="relationship-resources-page">
      {/* Resources Grid */}
      <div className="resources-grid">
        {resources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <div className="resource-icon">{resource.icon}</div>
            <h3>{resource.title}</h3>
            <p className="resource-description">{resource.description}</p>
            <div className="resource-tags">
              {resource.tags.map((tag) => (
                <span key={tag} className="resource-tag">
                  {tag}
                </span>
              ))}
            </div>
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="resource-link">
              Access Resource →
            </a>
          </div>
        ))}
      </div>

      {/* Additional Info Section */}
      <div className="resources-info">
        <h2>Need Help?</h2>
        <div className="info-cards">
          <div className="info-card">
            <h3>Professional Counseling</h3>
            <p>Connect with licensed therapists specializing in relationship counseling. Our directory helps you find qualified professionals near you.</p>
          </div>
          <div className="info-card">
            <h3>Self-Help Resources</h3>
            <p>Access books, articles, and guides designed to help you navigate common relationship challenges and build stronger connections.</p>
          </div>
          <div className="info-card">
            <h3>Community Support</h3>
            <p>Join support groups and communities with others on similar relationship journeys. Share experiences and learn from others.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipResourcesPage;
