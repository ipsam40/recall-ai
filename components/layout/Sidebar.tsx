'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    ChatBubbleBottomCenterIcon,
    RocketLaunchIcon,
    FolderOpenIcon,
    CodeBracketSquareIcon,
    BookmarkSquareIcon,
    PuzzlePieceIcon,
    Cog6ToothIcon,
    ChartBarSquareIcon,
    ArrowRightOnRectangleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    HomeIcon,
    BookOpenIcon,
} from '@heroicons/react/24/outline';

const navItems = [
    { href: '/', icon: HomeIcon, label: 'Home' },
    { href: '/chat', icon: ChatBubbleBottomCenterIcon, label: 'Chat' },
    { href: '/research', icon: RocketLaunchIcon, label: 'Research' },
    { href: '/code', icon: CodeBracketSquareIcon, label: 'Code' },
    { href: '/projects', icon: FolderOpenIcon, label: 'Projects' },
    { href: '/memory', icon: BookmarkSquareIcon, label: 'Memory' },
    { href: '/extensions', icon: PuzzlePieceIcon, label: 'Extensions' },
    { href: '/docs', icon: BookOpenIcon, label: 'Docs' },
];

const bottomItems = [
    { href: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
    { href: '/admin', icon: ChartBarSquareIcon, label: 'Admin' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">R</div>
                    {!collapsed && <span>Recall</span>}
                </div>
                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? (
                        <ChevronRightIcon style={{ width: 16, height: 16 }} />
                    ) : (
                        <ChevronLeftIcon style={{ width: 16, height: 16 }} />
                    )}
                </button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    {!collapsed && <div className="nav-section-title">Main</div>}
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                            title={collapsed ? item.label : undefined}
                        >
                            <span className="nav-icon">
                                <item.icon style={{ width: 20, height: 20 }} />
                            </span>
                            {!collapsed && <span className="nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </div>

                <div className="nav-section">
                    {!collapsed && <div className="nav-section-title">System</div>}
                    {bottomItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                            title={collapsed ? item.label : undefined}
                        >
                            <span className="nav-icon">
                                <item.icon style={{ width: 20, height: 20 }} />
                            </span>
                            {!collapsed && <span className="nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-profile">
                    <div className="profile-avatar">A</div>
                    {!collapsed && (
                        <div className="profile-info">
                            <div className="profile-name">Ashutosh</div>
                            <div className="profile-email">ashutosh@recall.ai</div>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <button className="nav-item" style={{ marginTop: '4px', color: 'var(--text-tertiary)' }}>
                        <span className="nav-icon">
                            <ArrowRightOnRectangleIcon style={{ width: 20, height: 20 }} />
                        </span>
                        <span className="nav-label">Log out</span>
                    </button>
                )}
            </div>
        </aside>
    );
}
