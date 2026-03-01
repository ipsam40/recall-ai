'use client';

import { useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import {
    SunIcon,
    MoonIcon,
    BellAlertIcon,
    ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import {
    SunIcon as SunSolid,
    MoonIcon as MoonSolid,
    ComputerDesktopIcon as ComputerSolid,
} from '@heroicons/react/24/solid';

export default function Topbar({ title }: { title?: string }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    return (
        <header className="topbar">
            <div className="topbar-left">
                {title && <h1 className="topbar-title">{title}</h1>}
            </div>

            <div className="topbar-right">
                <div className="dropdown">
                    <button
                        className="btn-icon"
                        onClick={() => setShowThemeMenu(!showThemeMenu)}
                        title="Theme"
                    >
                        {resolvedTheme === 'dark' ? (
                            <MoonIcon style={{ width: 20, height: 20 }} />
                        ) : (
                            <SunIcon style={{ width: 20, height: 20 }} />
                        )}
                    </button>
                    <div className={`dropdown-menu ${showThemeMenu ? 'open' : ''}`}>
                        <div
                            className={`dropdown-item ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                        >
                            <SunSolid style={{ width: 16, height: 16 }} /> Light
                        </div>
                        <div
                            className={`dropdown-item ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                        >
                            <MoonSolid style={{ width: 16, height: 16 }} /> Dark
                        </div>
                        <div
                            className={`dropdown-item ${theme === 'system' ? 'active' : ''}`}
                            onClick={() => { setTheme('system'); setShowThemeMenu(false); }}
                        >
                            <ComputerSolid style={{ width: 16, height: 16 }} /> System
                        </div>
                    </div>
                </div>

                <button className="btn-icon" title="Notifications">
                    <BellAlertIcon style={{ width: 20, height: 20 }} />
                </button>
            </div>
        </header>
    );
}
