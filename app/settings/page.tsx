'use client';

import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import { useTheme } from '@/components/theme/ThemeProvider';
import {
    UserCircleIcon,
    CpuChipIcon,
    KeyIcon,
    AdjustmentsVerticalIcon,
    ShieldCheckIcon,
    Cog6ToothIcon,
    SparklesIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import {
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    CheckIcon,
} from '@heroicons/react/24/solid';

const demoApiKeys = [
    { id: '1', name: 'Production Key', key: 'sk-recall-****-****-7f3d', created: '2025-12-01', lastUsed: '2 hours ago' },
    { id: '2', name: 'Development Key', key: 'sk-recall-****-****-a1b2', created: '2026-01-15', lastUsed: '5 days ago' },
];

const modelOptions = [
    { id: 'opus', name: 'Opus 4.6', desc: 'Most capable' },
    { id: 'sonnet', name: 'Sonnet 4.6', desc: 'Balanced' },
    { id: 'haiku', name: 'Haiku 4.5', desc: 'Fastest' },
];

type SettingsTab = 'profile' | 'models' | 'theme' | 'apikeys' | 'privacy';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const { theme, setTheme } = useTheme();
    const [defaultModel, setDefaultModel] = useState('sonnet');
    const [extendedThinking, setExtendedThinking] = useState(true);
    const [memoryEnabled, setMemoryEnabled] = useState(true);

    const tabs: { id: SettingsTab; label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
        { id: 'profile', label: 'Profile', Icon: UserCircleIcon },
        { id: 'models', label: 'Models', Icon: CpuChipIcon },
        { id: 'theme', label: 'Appearance', Icon: AdjustmentsVerticalIcon },
        { id: 'apikeys', label: 'API Keys', Icon: KeyIcon },
        { id: 'privacy', label: 'Data & Privacy', Icon: ShieldCheckIcon },
    ];

    return (
        <>
            <Topbar title="Settings" />
            <div className="page-content">
                <div className="page">
                    <div className="page-header">
                        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Cog6ToothIcon style={{ width: 28, height: 28 }} /> Settings
                        </h1>
                    </div>

                    <div className="settings-layout">
                        <nav className="settings-nav">
                            {tabs.map((tab) => (
                                <div
                                    key={tab.id}
                                    className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <tab.Icon style={{ width: 18, height: 18 }} /> {tab.label}
                                </div>
                            ))}
                            <div className="settings-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)', marginTop: '16px' }}>
                                <ArrowRightOnRectangleIcon style={{ width: 18, height: 18 }} /> Log out
                            </div>
                        </nav>

                        <div className="settings-content">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="animate-fade">
                                    <div className="settings-section">
                                        <h3 className="settings-section-title">Profile</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                            <div className="profile-avatar" style={{ width: '64px', height: '64px', fontSize: '24px' }}>A</div>
                                            <button className="btn btn-sm btn-secondary">Upload Photo</button>
                                        </div>
                                        <div className="settings-field">
                                            <label className="settings-label">Full Name</label>
                                            <input type="text" className="input" defaultValue="Ashutosh" />
                                        </div>
                                        <div className="settings-field">
                                            <label className="settings-label">Email</label>
                                            <input type="email" className="input" defaultValue="ashutosh@recall.ai" />
                                        </div>
                                        <button className="btn btn-primary">Save Changes</button>
                                    </div>
                                </div>
                            )}

                            {/* Models Tab */}
                            {activeTab === 'models' && (
                                <div className="animate-fade">
                                    <div className="settings-section">
                                        <h3 className="settings-section-title">Default Model</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {modelOptions.map((model) => (
                                                <div
                                                    key={model.id}
                                                    className="memory-item"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setDefaultModel(model.id)}
                                                >
                                                    <div>
                                                        <div className="memory-key">{model.name}</div>
                                                        <div className="memory-value">{model.desc}</div>
                                                    </div>
                                                    {defaultModel === model.id && (
                                                        <CheckIcon style={{ width: 18, height: 18, color: 'var(--accent)' }} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="settings-section">
                                        <h3 className="settings-section-title">Capabilities</h3>
                                        <div className="memory-item" style={{ marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <SparklesIcon style={{ width: 18, height: 18, color: 'var(--accent)' }} />
                                                <div>
                                                    <div className="memory-key">Extended Thinking</div>
                                                    <div className="memory-value">Enable by default for complex tasks</div>
                                                </div>
                                            </div>
                                            <div className={`toggle ${extendedThinking ? 'active' : ''}`} onClick={() => setExtendedThinking(!extendedThinking)} />
                                        </div>
                                        <div className="memory-item">
                                            <div>
                                                <div className="memory-key">Tool Use</div>
                                                <div className="memory-value">Allow AI to use browser, code, and search tools</div>
                                            </div>
                                            <div className="toggle active" />
                                        </div>
                                    </div>

                                    <div className="settings-section">
                                        <h3 className="settings-section-title">Output Limits</h3>
                                        <div className="settings-field">
                                            <label className="settings-label">Max Output Tokens</label>
                                            <input type="range" min="1024" max="128000" defaultValue="8192" style={{ width: '300px' }} />
                                            <div className="settings-help">8,192 tokens (default)</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Theme Tab */}
                            {activeTab === 'theme' && (
                                <div className="animate-fade">
                                    <div className="settings-section">
                                        <h3 className="settings-section-title">Theme</h3>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {([
                                                { key: 'light' as const, label: 'Light', Icon: SunIcon },
                                                { key: 'dark' as const, label: 'Dark', Icon: MoonIcon },
                                                { key: 'system' as const, label: 'System', Icon: ComputerDesktopIcon },
                                            ]).map((t) => (
                                                <div
                                                    key={t.key}
                                                    className="card"
                                                    style={{
                                                        cursor: 'pointer',
                                                        width: '140px',
                                                        textAlign: 'center',
                                                        borderColor: theme === t.key ? 'var(--accent)' : undefined,
                                                        boxShadow: theme === t.key ? 'var(--shadow-glow)' : undefined,
                                                    }}
                                                    onClick={() => setTheme(t.key)}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                                                        <t.Icon style={{ width: 32, height: 32, color: theme === t.key ? 'var(--accent)' : 'var(--text-secondary)' }} />
                                                    </div>
                                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{t.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* API Keys Tab */}
                            {activeTab === 'apikeys' && (
                                <div className="animate-fade">
                                    <div className="settings-section">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <h3 className="settings-section-title" style={{ margin: 0 }}>API Keys</h3>
                                            <button className="btn btn-primary btn-sm" style={{ gap: '4px' }}>
                                                <KeyIcon style={{ width: 14, height: 14 }} /> Generate Key
                                            </button>
                                        </div>
                                        <div className="table-container">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Key</th>
                                                        <th>Created</th>
                                                        <th>Last Used</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {demoApiKeys.map((key) => (
                                                        <tr key={key.id}>
                                                            <td style={{ fontWeight: 500 }}>{key.name}</td>
                                                            <td><code style={{ fontSize: '12px', background: 'var(--surface-hover)', padding: '2px 6px', borderRadius: '4px' }}>{key.key}</code></td>
                                                            <td>{key.created}</td>
                                                            <td>{key.lastUsed}</td>
                                                            <td>
                                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                                    <button className="btn btn-sm btn-ghost">Rotate</button>
                                                                    <button className="btn btn-sm btn-ghost" style={{ color: 'var(--error)' }}>Delete</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <div className="animate-fade">
                                    <div className="settings-section">
                                        <h3 className="settings-section-title">Data & Privacy</h3>
                                        <div className="memory-item" style={{ marginBottom: '8px' }}>
                                            <div>
                                                <div className="memory-key">Cross-conversation Memory</div>
                                                <div className="memory-value">Remember context across conversations</div>
                                            </div>
                                            <div className={`toggle ${memoryEnabled ? 'active' : ''}`} onClick={() => setMemoryEnabled(!memoryEnabled)} />
                                        </div>
                                        <div className="memory-item" style={{ marginBottom: '8px' }}>
                                            <div>
                                                <div className="memory-key">Training Data</div>
                                                <div className="memory-value">Allow usage for model improvement</div>
                                            </div>
                                            <div className="toggle" />
                                        </div>
                                    </div>
                                    <div className="settings-section">
                                        <h3 className="settings-section-title" style={{ color: 'var(--error)' }}>Danger Zone</h3>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-sm btn-secondary">Export Data</button>
                                            <button className="btn btn-sm btn-secondary" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>Delete All Data</button>
                                            <button className="btn btn-sm btn-secondary" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>Delete Account</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
