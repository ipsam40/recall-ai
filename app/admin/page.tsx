'use client';

import Topbar from '@/components/layout/Topbar';
import {
    ChartBarSquareIcon,
    UsersIcon,
    CubeTransparentIcon,
    HeartIcon,
    ChartBarIcon,
    ArrowPathIcon,
    InboxStackIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const stats = [
    { label: 'Active Users', value: '2,847', change: '+12.5%', direction: 'up', Icon: UsersIcon, color: '#3B82F6' },
    { label: 'Messages Today', value: '45,231', change: '+8.3%', direction: 'up', Icon: InboxStackIcon, color: '#10B981' },
    { label: 'Avg Latency', value: '142ms', change: '-5.2%', direction: 'down', Icon: ChartBarIcon, color: '#F97316' },
    { label: 'Token Usage', value: '12.4M', change: '+15.1%', direction: 'up', Icon: CubeTransparentIcon, color: '#8B5CF6' },
];

const recentUsers = [
    { name: 'Ashutosh', email: 'ashutosh@recall.ai', role: 'Admin', status: 'active', lastSeen: '2 mins ago' },
    { name: 'Sarah Chen', email: 'sarah@example.com', role: 'User', status: 'active', lastSeen: '15 mins ago' },
    { name: 'James Wilson', email: 'james@example.com', role: 'User', status: 'inactive', lastSeen: '2 days ago' },
    { name: 'Priya Patel', email: 'priya@example.com', role: 'User', status: 'active', lastSeen: '1 hour ago' },
    { name: 'Marcus Johnson', email: 'marcus@example.com', role: 'User', status: 'active', lastSeen: '30 mins ago' },
];

const systemHealth = [
    { service: 'API Gateway', status: 'operational', uptime: '99.99%' },
    { service: 'Vector DB (Pinecone)', status: 'operational', uptime: '99.97%' },
    { service: 'Redis Cache', status: 'operational', uptime: '99.99%' },
    { service: 'Worker Queue', status: 'degraded', uptime: '98.5%' },
    { service: 'AI Inference', status: 'operational', uptime: '99.95%' },
];

export default function AdminPage() {
    return (
        <>
            <Topbar title="Admin" />
            <div className="page-content">
                <div className="page">
                    <div className="page-header">
                        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ChartBarSquareIcon style={{ width: 28, height: 28 }} /> Admin Dashboard
                        </h1>
                        <p className="page-subtitle">System overview, user management, and infrastructure health.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="admin-grid">
                        {stats.map((stat) => (
                            <div key={stat.label} className="stat-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div className="stat-label">{stat.label}</div>
                                    <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                                        <stat.Icon style={{ width: 20, height: 20 }} />
                                    </div>
                                </div>
                                <div className="stat-value">{stat.value}</div>
                                <div className={`stat-change ${stat.direction === 'up' ? 'up' : 'down'}`}>
                                    {stat.change} from last week
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Users Table */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UsersIcon style={{ width: 20, height: 20 }} /> Recent Users
                        </h3>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Last Seen</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr key={user.email}>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{user.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{user.email}</div>
                                            </td>
                                            <td><span className="badge badge-info">{user.role}</span></td>
                                            <td>
                                                <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    {user.status === 'active' ? (
                                                        <CheckCircleIcon style={{ width: 12, height: 12 }} />
                                                    ) : (
                                                        <ExclamationTriangleIcon style={{ width: 12, height: 12 }} />
                                                    )}
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{user.lastSeen}</td>
                                            <td>
                                                <button className="btn btn-sm btn-ghost">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* System Health */}
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HeartIcon style={{ width: 20, height: 20 }} /> System Health
                        </h3>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Status</th>
                                        <th>Uptime</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {systemHealth.map((svc) => (
                                        <tr key={svc.service}>
                                            <td style={{ fontWeight: 500 }}>{svc.service}</td>
                                            <td>
                                                <span className={`badge ${svc.status === 'operational' ? 'badge-success' : 'badge-warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    {svc.status === 'operational' ? (
                                                        <CheckCircleIcon style={{ width: 12, height: 12 }} />
                                                    ) : (
                                                        <ExclamationTriangleIcon style={{ width: 12, height: 12 }} />
                                                    )}
                                                    {svc.status}
                                                </span>
                                            </td>
                                            <td>{svc.uptime}</td>
                                            <td>
                                                <button className="btn btn-sm btn-ghost" style={{ gap: '4px' }}>
                                                    <ArrowPathIcon style={{ width: 13, height: 13 }} /> Reindex
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
