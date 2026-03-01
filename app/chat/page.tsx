'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import {
    PlusCircleIcon,
    PaperClipIcon,
    PhotoIcon,
    ArrowUpIcon,
    ClipboardDocumentIcon,
    ArrowPathIcon,
    ChevronDownIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import {
    CheckIcon,
    ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/solid';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

interface Conversation {
    id: string;
    title: string;
    lastMessage: string;
    updatedAt: Date;
}

const demoConversations: Conversation[] = [
    { id: '1', title: 'RAG pipeline optimization', lastMessage: 'Try using a hybrid retrieval...', updatedAt: new Date() },
    { id: '2', title: 'Database schema design', lastMessage: 'For the vector store, I recommend...', updatedAt: new Date(Date.now() - 3600000) },
    { id: '3', title: 'Authentication flow', lastMessage: 'JWT with refresh tokens is the...', updatedAt: new Date(Date.now() - 86400000) },
    { id: '4', title: 'Kubernetes deployment', lastMessage: 'Set resource limits for each pod...', updatedAt: new Date(Date.now() - 172800000) },
    { id: '5', title: 'API rate limiting', lastMessage: 'Use a sliding window algorithm...', updatedAt: new Date(Date.now() - 259200000) },
];

const demoMessages: Message[] = [
    { id: '1', role: 'user', content: 'How do I optimize my RAG pipeline for better retrieval accuracy?', timestamp: new Date(Date.now() - 60000) },
    { id: '2', role: 'ai', content: 'Here are several strategies to optimize your RAG pipeline:\n\n**1. Chunking Strategy**\nUse semantic chunking instead of fixed-size chunks. This preserves context boundaries and improves retrieval relevance.\n\n**2. Hybrid Retrieval**\nCombine dense vector search with sparse BM25 retrieval. This captures both semantic similarity and keyword matches.\n\n```python\nfrom retrieval import HybridRetriever\n\nretriever = HybridRetriever(\n    dense_weight=0.7,\n    sparse_weight=0.3,\n    top_k=10\n)\nresults = retriever.search(query)\n```\n\n**3. Cross-Encoder Reranking**\nAdd a reranking step after initial retrieval to improve precision. Cross-encoders are slower but significantly more accurate.\n\n**4. Query Expansion**\nUse the LLM to generate multiple query variants before retrieval. This captures different phrasings of the same intent.\n\n**5. Metadata Filtering**\nPre-filter by document metadata (date, source, category) to narrow the search space before vector similarity.', timestamp: new Date() },
];

const models = [
    { id: 'opus', name: 'Opus 4.6', desc: 'Most capable for ambitious work' },
    { id: 'sonnet', name: 'Sonnet 4.6', desc: 'Most efficient for everyday tasks' },
    { id: 'haiku', name: 'Haiku 4.5', desc: 'Fastest for quick answers' },
];

export default function ChatPage() {
    const [conversations] = useState(demoConversations);
    const [activeConv, setActiveConv] = useState('1');
    const [messages] = useState(demoMessages);
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState('sonnet');
    const [showModelSelector, setShowModelSelector] = useState(false);
    const [extendedThinking, setExtendedThinking] = useState(true);

    const currentModel = models.find(m => m.id === selectedModel)!;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                setInput('');
            }
        }
    };

    return (
        <>
            <Topbar title="Chat" />
            <div className="page-content">
                <div className="chat-layout">
                    {/* Conversation List */}
                    <div className="chat-sidebar">
                        <div className="chat-sidebar-header">
                            <button className="btn btn-primary btn-sm" style={{ width: '100%', gap: '6px' }}>
                                <PlusCircleIcon style={{ width: 16, height: 16 }} /> New Chat
                            </button>
                        </div>
                        <div className="chat-list">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`chat-list-item ${activeConv === conv.id ? 'active' : ''}`}
                                    onClick={() => setActiveConv(conv.id)}
                                >
                                    <ChatBubbleLeftRightIcon style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.5 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="chat-list-item-title">{conv.title}</div>
                                        <div className="chat-list-item-time">
                                            {conv.updatedAt.toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat area */}
                    <div className="chat-main">
                        {/* Model selector bar */}
                        <div style={{
                            padding: '8px 24px',
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            position: 'relative'
                        }}>
                            <div style={{ position: 'relative' }}>
                                <button
                                    className="home-model-selector"
                                    onClick={() => setShowModelSelector(!showModelSelector)}
                                >
                                    {currentModel.name} {extendedThinking ? '· Extended' : ''}{' '}
                                    <ChevronDownIcon style={{ width: 14, height: 14 }} />
                                </button>
                                {showModelSelector && (
                                    <div className="model-selector-dropdown" style={{ top: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)' }}>
                                        {models.map((model) => (
                                            <div
                                                key={model.id}
                                                className="model-option"
                                                onClick={() => { setSelectedModel(model.id); setShowModelSelector(false); }}
                                            >
                                                <div>
                                                    <div className="model-option-name">{model.name}</div>
                                                    <div className="model-option-desc">{model.desc}</div>
                                                </div>
                                                {selectedModel === model.id && <CheckIcon style={{ width: 18, height: 18, color: 'var(--accent)' }} />}
                                            </div>
                                        ))}
                                        <div className="model-thinking-row">
                                            <div>
                                                <div className="model-thinking-label">
                                                    <SparklesIcon style={{ width: 16, height: 16, display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                                                    Extended thinking
                                                </div>
                                                <div className="model-thinking-desc">Think longer for complex tasks</div>
                                            </div>
                                            <div
                                                className={`toggle ${extendedThinking ? 'active' : ''}`}
                                                onClick={() => setExtendedThinking(!extendedThinking)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className="message">
                                    <div className={`message-avatar ${msg.role === 'user' ? 'user' : 'ai'}`}>
                                        {msg.role === 'user' ? 'A' : 'R'}
                                    </div>
                                    <div className="message-content">
                                        <div className="message-sender">
                                            {msg.role === 'user' ? 'You' : 'Recall'}
                                        </div>
                                        <div className="message-text">
                                            {msg.content.split('\n').map((line, i) => {
                                                if (line.startsWith('```')) return null;
                                                if (line.startsWith('**') && line.endsWith('**')) {
                                                    return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                                                }
                                                return line ? <p key={i}>{line}</p> : <br key={i} />;
                                            })}
                                        </div>
                                        <div className="message-actions">
                                            <button className="btn-icon" title="Copy" style={{ width: '28px', height: '28px' }}>
                                                <ClipboardDocumentIcon style={{ width: 14, height: 14 }} />
                                            </button>
                                            <button className="btn-icon" title="Regenerate" style={{ width: '28px', height: '28px' }}>
                                                <ArrowPathIcon style={{ width: 14, height: 14 }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="chat-input-area">
                            <div className="chat-input-wrapper">
                                <div className="chat-input-actions">
                                    <button className="btn-icon" title="Attach file" style={{ width: '28px', height: '28px' }}>
                                        <PaperClipIcon style={{ width: 16, height: 16 }} />
                                    </button>
                                    <button className="btn-icon" title="Upload image" style={{ width: '28px', height: '28px' }}>
                                        <PhotoIcon style={{ width: 16, height: 16 }} />
                                    </button>
                                </div>
                                <textarea
                                    className="chat-input"
                                    placeholder="Message Recall..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                />
                                <button
                                    className="chat-send-btn"
                                    disabled={!input.trim()}
                                >
                                    <ArrowUpIcon style={{ width: 18, height: 18 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
