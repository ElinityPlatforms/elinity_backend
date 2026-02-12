import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdSearch, MdPerson, MdEvent, MdBook, MdForum, MdArrowForward } from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { searchApi } from '../../api/search';
import './SearchResultsPage.css';

const SearchResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';

    const { data, isLoading, error } = useQuery({
        queryKey: ['search', query],
        queryFn: () => searchApi.globalSearch(query),
        enabled: !!query,
    });

    const categories = [
        { id: 'users', label: 'People', icon: <MdPerson /> },
        { id: 'events', label: 'Events', icon: <MdEvent /> },
        { id: 'journals', label: 'Journals', icon: <MdBook /> },
        { id: 'posts', label: 'Community', icon: <MdForum /> },
    ];

    return (
        <div className="search-results-page-content" style={{ padding: '24px' }}>
            <div className="search-header">
                <h1 className="search-title">
                    {query ? `Search Results for "${query}"` : 'Global Search'}
                </h1>
                <p className="search-subtitle">
                    Find people, events, journals, and community discussions
                </p>
            </div>

            {isLoading ? (
                <div className="search-loading">Searching Elinity universe...</div>
            ) : error ? (
                <div className="search-error">Failed to perform search. Please try again.</div>
            ) : data ? (
                <div className="results-container">
                    {categories.map((cat) => (
                        <section key={cat.id} className="results-section">
                            <div className="section-header">
                                <div className="section-icon">{cat.icon}</div>
                                <h2>{cat.label}</h2>
                                <span className="results-count">
                                    {data[cat.id]?.length || 0} found
                                </span>
                            </div>

                            <div className="results-grid">
                                {data[cat.id]?.length > 0 ? (
                                    data[cat.id].map((item: any, idx: number) => (
                                        <Card
                                            key={idx}
                                            variant="glass"
                                            hoverable
                                            clickable
                                            className="result-item-card"
                                            onClick={() => {
                                                // Navigate to appropriate detail page
                                                if (cat.id === 'users') navigate(`/profile/${item.id || item.email}`);
                                                if (cat.id === 'events') navigate(`/events/${item.id}`);
                                                if (cat.id === 'journals') navigate(`/journal`);
                                                if (cat.id === 'posts') navigate(`/community`);
                                            }}
                                        >
                                            <div className="result-item-content">
                                                <h3 className="result-item-title">
                                                    {item.name || item.title || item.email || 'Untitled'}
                                                </h3>
                                                <p className="result-item-snippet">
                                                    {item.description || item.content || item.bio || 'Jump into this connection...'}
                                                </p>
                                            </div>
                                            {cat.id === 'users' ? (
                                                <div className="search-result-actions">
                                                    {item.connection_status === 'matched' ? (
                                                        <Button size="sm" variant="primary" onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/chat/${item.id}`);
                                                        }}>Message</Button>
                                                    ) : (
                                                        <Button size="sm" variant="ghost">View Profile</Button>
                                                    )}
                                                </div>
                                            ) : (
                                                <MdArrowForward className="result-arrow" />
                                            )}
                                        </Card>
                                    ))
                                ) : (
                                    <div className="empty-results">No {cat.label.toLowerCase()} found.</div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                <div className="search-empty-state">
                    <MdSearch style={{ fontSize: 64, opacity: 0.2 }} />
                    <p>Enter a search term to explore Elinity</p>
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;
