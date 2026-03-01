'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import {
    FolderOpenIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    Cog6ToothIcon,
    ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

const demoProjects = [
    { id: '1', name: 'RAG Pipeline v2', description: 'Production RAG system with hybrid retrieval', files: 24, lastUpdated: '2 hours ago', color: '#F97316' },
    { id: '2', name: 'Auth Service', description: 'JWT authentication with refresh tokens', files: 12, lastUpdated: '1 day ago', color: '#8B5CF6' },
    { id: '3', name: 'Vector DB Benchmark', description: 'Comparing Pinecone, Milvus, and Weaviate', files: 8, lastUpdated: '3 days ago', color: '#10B981' },
    { id: '4', name: 'API Gateway', description: 'FastAPI gateway with rate limiting', files: 18, lastUpdated: '5 days ago', color: '#3B82F6' },
    { id: '5', name: 'Streaming Chat UI', description: 'Next.js SSE streaming chat interface', files: 15, lastUpdated: '1 week ago', color: '#EC4899' },
    { id: '6', name: 'Kubernetes Infra', description: 'K8s deployment manifests and Terraform', files: 32, lastUpdated: '2 weeks ago', color: '#EAB308' },
];

export default function ProjectsPage() {
    const [search, setSearch] = useState('');
    const [showNewProject, setShowNewProject] = useState(false);

    const filtered = demoProjects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Topbar title="Projects" />
            <div className="page-content">
                <div className="page">
                    <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FolderOpenIcon style={{ width: 28, height: 28 }} /> Projects
                            </h1>
                            <p className="page-subtitle">Organize your work into focused projects with files, chat, and RAG context.</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowNewProject(!showNewProject)} style={{ gap: '6px' }}>
                            <PlusIcon style={{ width: 16, height: 16 }} /> New Project
                        </button>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
                        <MagnifyingGlassIcon style={{ width: 16, height: 16, position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            className="input"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: '38px' }}
                        />
                    </div>

                    {showNewProject && (
                        <div className="card animate-slide-up" style={{ marginBottom: '24px', maxWidth: '500px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Create New Project</h3>
                            <div className="settings-field">
                                <label className="settings-label">Project Name</label>
                                <input type="text" className="input" placeholder="My awesome project" />
                            </div>
                            <div className="settings-field">
                                <label className="settings-label">Description</label>
                                <input type="text" className="input" placeholder="What is this project about?" />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-primary btn-sm">Create</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowNewProject(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-3">
                        {filtered.map((project) => (
                            <div key={project.id} className="card" style={{ cursor: 'pointer' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: 'var(--radius-md)',
                                    background: `${project.color}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '12px',
                                    color: project.color
                                }}>
                                    <FolderOpenIcon style={{ width: 22, height: 22 }} />
                                </div>
                                <div className="card-title" style={{ marginBottom: '4px' }}>{project.name}</div>
                                <div className="card-description" style={{ marginBottom: '12px' }}>{project.description}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                        {project.files} files · {project.lastUpdated}
                                    </span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button className="btn-icon" title="Upload" style={{ width: '28px', height: '28px' }}>
                                            <ArrowUpTrayIcon style={{ width: 14, height: 14 }} />
                                        </button>
                                        <button className="btn-icon" title="Settings" style={{ width: '28px', height: '28px' }}>
                                            <Cog6ToothIcon style={{ width: 14, height: 14 }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
