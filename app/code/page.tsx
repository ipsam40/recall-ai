'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import {
    FolderIcon,
    DocumentIcon,
    PlayCircleIcon,
    BugAntIcon,
    CheckBadgeIcon,
    ClipboardDocumentIcon,
    ArrowPathIcon,
    ArrowUpIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

const demoFiles = [
    {
        name: 'src', type: 'folder', children: [
            { name: 'main.py', type: 'file' },
            { name: 'retriever.py', type: 'file' },
            { name: 'embedder.py', type: 'file' },
            { name: 'config.py', type: 'file' },
        ]
    },
    {
        name: 'tests', type: 'folder', children: [
            { name: 'test_retriever.py', type: 'file' },
            { name: 'test_embedder.py', type: 'file' },
        ]
    },
    { name: 'requirements.txt', type: 'file' },
    { name: 'README.md', type: 'file' },
];

const demoCode = `import numpy as np
from typing import List, Optional
from dataclasses import dataclass

@dataclass
class SearchResult:
    """A single search result from the vector store."""
    doc_id: str
    content: str
    score: float
    metadata: dict

class HybridRetriever:
    """
    Hybrid retriever combining dense vector search
    with sparse BM25 retrieval for optimal recall.
    """
    
    def __init__(
        self,
        dense_weight: float = 0.7,
        sparse_weight: float = 0.3,
        top_k: int = 10
    ):
        self.dense_weight = dense_weight
        self.sparse_weight = sparse_weight
        self.top_k = top_k
        self._index = None
    
    def search(
        self,
        query: str,
        filters: Optional[dict] = None
    ) -> List[SearchResult]:
        """
        Execute hybrid search combining dense
        and sparse retrieval strategies.
        """
        dense_results = self._dense_search(query)
        sparse_results = self._sparse_search(query)
        
        merged = self._reciprocal_rank_fusion(
            dense_results,
            sparse_results
        )
        
        if filters:
            merged = self._apply_filters(merged, filters)
        
        return merged[:self.top_k]
    
    def _dense_search(self, query: str):
        embedding = self._embed(query)
        return self._index.search(embedding)
    
    def _sparse_search(self, query: str):
        tokens = self._tokenize(query)
        return self._bm25.search(tokens)
    
    def _reciprocal_rank_fusion(
        self, *result_lists
    ) -> List[SearchResult]:
        scores = {}
        for results in result_lists:
            for rank, result in enumerate(results):
                if result.doc_id not in scores:
                    scores[result.doc_id] = 0
                scores[result.doc_id] += 1.0 / (rank + 60)
        
        sorted_ids = sorted(
            scores, key=scores.get, reverse=True
        )
        return [
            SearchResult(doc_id=did, ...)
            for did in sorted_ids
        ]`;

export default function CodePage() {
    const [activeFile, setActiveFile] = useState('retriever.py');
    const [aiInput, setAiInput] = useState('');

    return (
        <>
            <Topbar title="Code" />
            <div className="page-content">
                <div className="code-layout">
                    {/* File Tree */}
                    <div className="code-file-tree">
                        <div style={{ padding: '4px 8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>FILES</span>
                            <button className="btn-icon" style={{ width: '24px', height: '24px' }}>
                                <PlusIcon style={{ width: 14, height: 14 }} />
                            </button>
                        </div>
                        {demoFiles.map((item) => (
                            <div key={item.name}>
                                <div
                                    className={`nav-item ${item.type === 'file' && item.name === activeFile ? 'active' : ''}`}
                                    onClick={() => item.type === 'file' && setActiveFile(item.name)}
                                    style={{ padding: '6px 8px', fontSize: '13px', gap: '6px' }}
                                >
                                    <span style={{ width: 16, height: 16, display: 'flex' }}>
                                        {item.type === 'folder' ? <FolderIcon style={{ width: 16, height: 16 }} /> : <DocumentIcon style={{ width: 16, height: 16 }} />}
                                    </span>
                                    {item.name}
                                </div>
                                {item.type === 'folder' && item.children && (
                                    <div style={{ paddingLeft: '16px' }}>
                                        {item.children.map((child) => (
                                            <div
                                                key={child.name}
                                                className={`nav-item ${child.name === activeFile ? 'active' : ''}`}
                                                onClick={() => setActiveFile(child.name)}
                                                style={{ padding: '5px 8px', fontSize: '13px', gap: '6px' }}
                                            >
                                                <span style={{ width: 16, height: 16, display: 'flex' }}>
                                                    <DocumentIcon style={{ width: 16, height: 16 }} />
                                                </span>
                                                {child.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Editor */}
                    <div className="code-editor-area">
                        <div className="code-editor-tabs">
                            <div className="code-editor-tab active">{activeFile}</div>
                        </div>
                        <div className="code-editor-content">
                            <pre style={{ margin: 0 }}>
                                <code>{demoCode}</code>
                            </pre>
                        </div>
                    </div>

                    {/* AI Panel */}
                    <div className="code-ai-panel">
                        <div className="code-ai-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: 18, height: 18, display: 'flex', color: 'var(--accent)' }}>✦</span>
                            AI Assistant
                        </div>
                        <div className="code-ai-messages" style={{ padding: '16px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '4px' }}>RECALL</div>
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    I can see you&apos;re working on <code style={{ background: 'var(--surface-hover)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>retriever.py</code>. Here&apos;s what I notice:
                                    <br /><br />
                                    ✅ Good use of Reciprocal Rank Fusion for combining results
                                    <br />
                                    ⚠️ The <code style={{ background: 'var(--surface-hover)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>_embed</code> and <code style={{ background: 'var(--surface-hover)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>_tokenize</code> methods need implementation
                                    <br />
                                    💡 Consider adding async support for concurrent search
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                <button className="btn btn-sm btn-secondary" style={{ gap: '4px' }}>
                                    <ClipboardDocumentIcon style={{ width: 13, height: 13 }} /> Explain
                                </button>
                                <button className="btn btn-sm btn-secondary" style={{ gap: '4px' }}>
                                    <ArrowPathIcon style={{ width: 13, height: 13 }} /> Refactor
                                </button>
                                <button className="btn btn-sm btn-secondary" style={{ gap: '4px' }}>
                                    <CheckBadgeIcon style={{ width: 13, height: 13 }} /> Tests
                                </button>
                                <button className="btn btn-sm btn-secondary" style={{ gap: '4px' }}>
                                    <BugAntIcon style={{ width: 13, height: 13 }} /> Debug
                                </button>
                                <button className="btn btn-sm btn-secondary" style={{ gap: '4px' }}>
                                    <PlayCircleIcon style={{ width: 13, height: 13 }} /> Run
                                </button>
                            </div>
                        </div>
                        <div className="code-ai-input">
                            <div className="chat-input-wrapper" style={{ borderRadius: '12px', padding: '8px 12px' }}>
                                <textarea
                                    className="chat-input"
                                    placeholder="Ask about this code..."
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    rows={1}
                                    style={{ fontSize: '13px' }}
                                />
                                <button className="chat-send-btn" style={{ width: '28px', height: '28px' }}>
                                    <ArrowUpIcon style={{ width: 14, height: 14 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
