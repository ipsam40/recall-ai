'use client';

import Topbar from '@/components/layout/Topbar';
import {
    GlobeAltIcon,
    ChartPieIcon,
    PresentationChartBarIcon,
    ArrowDownTrayIcon,
    PuzzlePieceIcon,
    CodeBracketSquareIcon,
    LinkIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const extensions = [
    {
        id: 'chrome',
        Icon: GlobeAltIcon,
        title: 'Chrome Extension',
        desc: 'Use Recall directly in your browser. Highlight text, right-click to analyze, or open the side panel for AI assistance while browsing.',
        status: 'connected',
        color: '#4285F4',
        actions: ['Configure', 'Documentation'],
    },
    {
        id: 'excel',
        Icon: ChartPieIcon,
        title: 'Excel Add-in',
        desc: 'Analyze spreadsheets, generate formulas, create visualizations, and get AI-powered data insights directly in Microsoft Excel.',
        status: 'connected',
        color: '#217346',
        actions: ['Open in Excel', 'Documentation'],
    },
    {
        id: 'powerpoint',
        Icon: PresentationChartBarIcon,
        title: 'PowerPoint Add-in',
        desc: 'Generate presentations, improve slides, create speaker notes, and design professional layouts with AI assistance.',
        status: 'disconnected',
        color: '#D24726',
        actions: ['Install', 'Documentation'],
    },
    {
        id: 'api',
        Icon: LinkIcon,
        title: 'API Access',
        desc: 'Integrate Recall into your own applications. Full REST API with streaming support, tool use, and all model access.',
        status: 'connected',
        color: '#F97316',
        actions: ['API Docs', 'Playground'],
    },
    {
        id: 'slack',
        Icon: EnvelopeIcon,
        title: 'Slack Integration',
        desc: 'Add Recall to Slack channels. Ask questions, search your knowledge base, and get AI responses directly in Slack.',
        status: 'disconnected',
        color: '#4A154B',
        actions: ['Connect', 'Documentation'],
    },
    {
        id: 'vscode',
        Icon: CodeBracketSquareIcon,
        title: 'VS Code Extension',
        desc: 'AI-powered code completion, refactoring, and debugging directly in Visual Studio Code. Supports all languages.',
        status: 'connected',
        color: '#007ACC',
        actions: ['Configure', 'Documentation'],
    },
    {
        id: 'mcp',
        Icon: PuzzlePieceIcon,
        title: 'MCP Connectors',
        desc: 'Connect any context or tool through Model Context Protocol. Integrate databases, APIs, file systems, and custom tools.',
        status: 'connected',
        color: '#8B5CF6',
        actions: ['Manage Connectors', 'Documentation'],
    },
    {
        id: 'google',
        Icon: GlobeAltIcon,
        title: 'Google Workspace',
        desc: 'Connect Gmail, Google Docs, Sheets, and Drive. Search emails, analyze documents, and create content across Google services.',
        status: 'disconnected',
        color: '#EA4335',
        actions: ['Connect', 'Documentation'],
    },
];

export default function ExtensionsPage() {
    return (
        <>
            <Topbar title="Extensions" />
            <div className="page-content">
                <div className="page">
                    <div className="page-header">
                        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <PuzzlePieceIcon style={{ width: 28, height: 28 }} /> Extensions
                        </h1>
                        <p className="page-subtitle">
                            Connect Recall to your favorite tools and services. All extensions are included — no upgrade required.
                        </p>
                    </div>

                    <div className="grid grid-3">
                        {extensions.map((ext) => (
                            <div key={ext.id} className="extension-card">
                                <div className="extension-icon" style={{ background: `${ext.color}15`, color: ext.color }}>
                                    <ext.Icon style={{ width: 28, height: 28 }} />
                                </div>
                                <div>
                                    <div className="extension-title">{ext.title}</div>
                                    <div className="extension-status" style={{ marginTop: '4px' }}>
                                        {ext.status === 'connected' ? (
                                            <CheckCircleIcon style={{ width: 14, height: 14, color: 'var(--success)' }} />
                                        ) : (
                                            <div className="status-dot disconnected" />
                                        )}
                                        <span style={{ fontSize: '12px', color: ext.status === 'connected' ? 'var(--success)' : 'var(--text-tertiary)' }}>
                                            {ext.status === 'connected' ? 'Connected' : 'Not connected'}
                                        </span>
                                    </div>
                                </div>
                                <p className="extension-desc">{ext.desc}</p>
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                    {ext.actions.map((action) => (
                                        <button key={action} className="btn btn-sm btn-secondary" style={{ gap: '4px' }}>
                                            {action === 'Install' && <ArrowDownTrayIcon style={{ width: 13, height: 13 }} />}
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
