'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import {
    RocketLaunchIcon,
    ClockIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
    ListBulletIcon,
    ClipboardDocumentIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const depthOptions = [
    { id: 'quick', label: 'Quick', desc: '30 seconds', icon: ClockIcon },
    { id: 'deep', label: 'Deep', desc: '2-5 minutes', icon: MagnifyingGlassIcon },
    { id: 'synthesis', label: 'Multi-Source', desc: '5-15 minutes', icon: ListBulletIcon },
];

const demoSources = [
    { title: 'Vector Database Architectures - A Comprehensive Survey', url: 'arxiv.org', relevance: 94 },
    { title: 'Building Production RAG Systems', url: 'engineering.blog', relevance: 91 },
    { title: 'Hybrid Search: Combining Dense and Sparse Retrieval', url: 'research.ai', relevance: 88 },
    { title: 'Chunking Strategies for LLM Context Windows', url: 'docs.langchain.com', relevance: 85 },
];

const demoResearchJobs = [
    { id: '1', topic: 'Vector database performance comparison', status: 'completed', sources: 12, date: '2 hours ago' },
    { id: '2', topic: 'RAG evaluation metrics', status: 'completed', sources: 8, date: '1 day ago' },
    { id: '3', topic: 'Transformer attention mechanisms', status: 'running', sources: 3, date: 'Just now' },
];

export default function ResearchPage() {
    const [topic, setTopic] = useState('');
    const [depth, setDepth] = useState('deep');
    const [isRunning, setIsRunning] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleStart = () => {
        if (topic.trim()) {
            setIsRunning(true);
            setTimeout(() => {
                setIsRunning(false);
                setShowResults(true);
            }, 2000);
        }
    };

    return (
        <>
            <Topbar title="Research" />
            <div className="page-content">
                <div className="research-container">
                    <div className="page-header" style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                            <RocketLaunchIcon style={{ width: 40, height: 40, color: 'var(--accent)' }} />
                        </div>
                        <h1 className="page-title">Deep Research</h1>
                        <p className="page-subtitle">
                            Multi-step AI research agent that browses, analyzes, and synthesizes information from multiple sources.
                        </p>
                    </div>

                    {/* Input area */}
                    <div className="research-input-area animate-slide-up">
                        <input
                            type="text"
                            className="input input-lg"
                            placeholder="Enter a research topic..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                        />

                        <div className="research-depth">
                            {depthOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    className={`research-depth-btn ${depth === opt.id ? 'selected' : ''}`}
                                    onClick={() => setDepth(opt.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <opt.icon style={{ width: 14, height: 14 }} />
                                    {opt.label}
                                    <span style={{ opacity: 0.7, fontSize: '11px' }}>{opt.desc}</span>
                                </button>
                            ))}
                            <div style={{ flex: 1 }} />
                            <button
                                className="btn btn-primary"
                                onClick={handleStart}
                                disabled={!topic.trim() || isRunning}
                                style={{ gap: '6px' }}
                            >
                                {isRunning ? (
                                    <><ClockIcon style={{ width: 16, height: 16 }} /> Researching...</>
                                ) : (
                                    <><RocketLaunchIcon style={{ width: 16, height: 16 }} /> Start Research</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Running indicator */}
                    {isRunning && (
                        <div className="animate-fade" style={{ textAlign: 'center', padding: '40px' }}>
                            <div className="typing-indicator" style={{ justifyContent: 'center', marginBottom: '12px' }}>
                                <div className="typing-dot" />
                                <div className="typing-dot" />
                                <div className="typing-dot" />
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                Browsing sources and analyzing content...
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {showResults && (
                        <div className="research-results animate-slide-up">
                            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <DocumentTextIcon style={{ width: 20, height: 20 }} /> Sources Found
                            </h3>
                            {demoSources.map((source, i) => (
                                <div key={i} className="research-source">
                                    <span style={{ color: 'var(--accent)', fontWeight: 600, minWidth: '40px' }}>{source.relevance}%</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>{source.title}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{source.url}</div>
                                    </div>
                                    <button className="btn btn-sm btn-secondary">View</button>
                                </div>
                            ))}

                            <div className="card" style={{ marginTop: '24px' }}>
                                <h3 style={{ marginBottom: '12px', fontWeight: 600 }}>Research Report</h3>
                                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    <p>Based on analysis of 12 sources, here are the key findings about vector database performance:</p>
                                    <br />
                                    <p><strong>1. Architecture Comparison</strong></p>
                                    <p>HNSW-based indexes (used by Pinecone, Weaviate) offer the best balance of recall and latency for most workloads. IVF-Flat (used by Milvus) is better for very large datasets.</p>
                                    <br />
                                    <p><strong>2. Scaling Patterns</strong></p>
                                    <p>Horizontal sharding becomes necessary above ~10M vectors. All tested databases support this, but with varying complexity.</p>
                                    <br />
                                    <p><strong>3. Recommendations</strong></p>
                                    <p>For production RAG systems, Pinecone provides the best managed experience while Milvus offers the most control for self-hosted deployments.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <button className="btn btn-sm btn-secondary" style={{ gap: '4px' }}>
                                        <ClipboardDocumentIcon style={{ width: 14, height: 14 }} /> Copy
                                    </button>
                                    <button className="btn btn-sm btn-secondary" style={{ gap: '4px' }}>
                                        <ArrowDownTrayIcon style={{ width: 14, height: 14 }} /> Export PDF
                                    </button>
                                    <button className="btn btn-sm btn-secondary" style={{ gap: '4px' }}>
                                        <DocumentTextIcon style={{ width: 14, height: 14 }} /> Save to Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Previous Research */}
                    {!showResults && !isRunning && (
                        <div style={{ marginTop: '48px' }}>
                            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                Recent Research
                            </h3>
                            {demoResearchJobs.map((job) => (
                                <div key={job.id} className="research-source" style={{ cursor: 'pointer' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>{job.topic}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                            {job.sources} sources · {job.date}
                                        </div>
                                    </div>
                                    <span className={`badge ${job.status === 'completed' ? 'badge-success' : 'badge-warning'}`} style={{ gap: '4px', display: 'flex', alignItems: 'center' }}>
                                        {job.status === 'completed' && <CheckCircleIcon style={{ width: 12, height: 12 }} />}
                                        {job.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
