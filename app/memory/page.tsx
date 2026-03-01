'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import {
    BookmarkSquareIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const demoMemories = [
    { id: '1', key: 'Preferred language', value: 'Python for backend, TypeScript for frontend', category: 'Preferences' },
    { id: '2', key: 'Architecture style', value: 'Prefers microservices with event-driven communication', category: 'Preferences' },
    { id: '3', key: 'Current project', value: 'Building a production RAG system with hybrid retrieval', category: 'Context' },
    { id: '4', key: 'Vector DB choice', value: 'Using Pinecone for managed, Milvus for self-hosted', category: 'Context' },
    { id: '5', key: 'Deployment platform', value: 'AWS ECS with Terraform, Cloudflare CDN', category: 'Infrastructure' },
    { id: '6', key: 'Testing philosophy', value: 'Integration tests over unit tests, property-based testing when possible', category: 'Preferences' },
    { id: '7', key: 'Security background', value: 'Cloud security expertise, focus on zero-trust architectures', category: 'Profile' },
    { id: '8', key: 'Code style', value: 'Functional programming patterns, explicit over implicit', category: 'Preferences' },
];

export default function MemoryPage() {
    const [search, setSearch] = useState('');
    const [memories, setMemories] = useState(demoMemories);
    const [showAdd, setShowAdd] = useState(false);

    const filtered = memories.filter(m =>
        m.key.toLowerCase().includes(search.toLowerCase()) ||
        m.value.toLowerCase().includes(search.toLowerCase())
    );

    const categories = [...new Set(memories.map(m => m.category))];

    return (
        <>
            <Topbar title="Memory" />
            <div className="page-content">
                <div className="page">
                    <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <BookmarkSquareIcon style={{ width: 28, height: 28 }} /> Memory
                            </h1>
                            <p className="page-subtitle">
                                Recall remembers your preferences, context, and working style across conversations.
                            </p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)} style={{ gap: '6px' }}>
                            <PlusIcon style={{ width: 16, height: 16 }} /> Add Memory
                        </button>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
                        <MagnifyingGlassIcon style={{ width: 16, height: 16, position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            className="input"
                            placeholder="Search memories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '38px' }}
                        />
                    </div>

                    {showAdd && (
                        <div className="card animate-slide-up" style={{ marginBottom: '24px', maxWidth: '500px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Add Memory</h3>
                            <div className="settings-field">
                                <label className="settings-label">Key</label>
                                <input type="text" className="input" placeholder="e.g. Preferred framework" />
                            </div>
                            <div className="settings-field">
                                <label className="settings-label">Value</label>
                                <input type="text" className="input" placeholder="e.g. Next.js with App Router" />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-primary btn-sm">Save</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {categories.map((category) => {
                        const catMemories = filtered.filter(m => m.category === category);
                        if (catMemories.length === 0) return null;
                        return (
                            <div key={category} style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {category}
                                </h3>
                                <div className="memory-list">
                                    {catMemories.map((memory) => (
                                        <div key={memory.id} className="memory-item">
                                            <div>
                                                <div className="memory-key">{memory.key}</div>
                                                <div className="memory-value">{memory.value}</div>
                                            </div>
                                            <div className="memory-actions">
                                                <button className="btn-icon" title="Edit" style={{ width: '28px', height: '28px' }}>
                                                    <PencilSquareIcon style={{ width: 14, height: 14 }} />
                                                </button>
                                                <button
                                                    className="btn-icon"
                                                    title="Delete"
                                                    style={{ width: '28px', height: '28px' }}
                                                    onClick={() => setMemories(memories.filter(m => m.id !== memory.id))}
                                                >
                                                    <TrashIcon style={{ width: 14, height: 14 }} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
