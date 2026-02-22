// ═══════════════════════════════════════
// ⚙️ Settings — 설정 페이지
//    사이드 탭 네비게이션 + 토글 스위치
// ═══════════════════════════════════════

import { useState } from 'react'
import {
    User, Bell, Lock, Palette, Globe, Shield, CreditCard,
    Moon, Sun, Save,
} from 'lucide-react'
import HudCard from '../components/common/HudCard'
import Button from '../components/common/Button'

// ═══════════════════════════════════════
// 📋 설정 섹션 데이터
//    아이콘 + 라벨
// ═══════════════════════════════════════
const settingsSections = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'language', label: 'Language', icon: <Globe size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
]

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile')
    const [darkMode, setDarkMode] = useState(true)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ═══════════════════════════════════════
                페이지 헤더
                ═══════════════════════════════════════ */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">Settings</h1>
                    {/* ⭐ find() + 옵셔널 체이닝(?.) */}
                    <p className="text-hud-text-muted mt-1">
                        {settingsSections.find(s => s.id === activeSection)?.label} settings
                    </p>
                </div>
                <Button variant="primary" glow leftIcon={<Save size={18} />}>
                    Save Changes
                </Button>
            </div>

            <div className="flex gap-6">
                {/* ═══════════════════════════════════════
                    좌측 사이드 탭 네비게이션
                    ═══════════════════════════════════════ */}
                <div className="w-56 flex-shrink-0">
                    <HudCard noPadding>
                        <div className="py-2">
                            {settingsSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 transition-hud ${
                                        activeSection === section.id
                                            ? 'bg-hud-accent-primary/10 text-hud-accent-primary border-l-2 border-hud-accent-primary'
                                            : 'text-hud-text-secondary hover:bg-hud-bg-hover hover:text-hud-text-primary'
                                    }`}
                                >
                                    {section.icon}
                                    <span className="text-sm">{section.label}</span>
                                </button>
                            ))}
                        </div>
                    </HudCard>
                </div>

                {/* ═══════════════════════════════════════
                    우측 콘텐츠 — activeSection에 따라 다른 섹션 표시
                    ═══════════════════════════════════════ */}
                <div className="flex-1 space-y-6">
                    {/* ═══════════════════════════════════════
                        Profile 섹션
                        ═══════════════════════════════════════ */}
                    {activeSection === 'profile' && (
                        <HudCard title="Profile Settings" subtitle="Update your personal information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">First Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Admin"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        defaultValue="User"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="admin@hudadmin.com"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        defaultValue="+1 (555) 123-4567"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm text-hud-text-secondary mb-2">Bio</label>
                                <textarea
                                    rows={4}
                                    defaultValue="Full-stack developer and admin."
                                    className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud resize-none"
                                />
                            </div>
                        </HudCard>
                    )}

                    {/* ═══════════════════════════════════════
                        Appearance 섹션 — ⭐ 토글 스위치
                        ═══════════════════════════════════════ */}
                    {activeSection === 'appearance' && (
                        <HudCard title="Appearance" subtitle="Customize the look and feel">
                            <div className="space-y-6">
                                {/* 다크모드 토글 */}
                                <div className="flex items-center justify-between p-4 rounded-lg bg-hud-bg-primary">
                                    <div className="flex items-center gap-3">
                                        {darkMode ? (
                                            <Moon size={20} className="text-hud-accent-primary" />
                                        ) : (
                                            <Sun size={20} className="text-hud-accent-warning" />
                                        )}
                                        <div>
                                            <p className="text-sm text-hud-text-primary">Dark Mode</p>
                                            <p className="text-xs text-hud-text-muted">
                                                {darkMode ? 'Dark theme is active' : 'Light theme is active'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* ⭐ CSS만으로 만든 토글 스위치 */}
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            darkMode ? 'bg-hud-accent-primary' : 'bg-hud-text-muted'
                                        }`}
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                            darkMode ? 'translate-x-6' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </HudCard>
                    )}

                    {/* ═══════════════════════════════════════
                        Notifications 섹션
                        ═══════════════════════════════════════ */}
                    {activeSection === 'notifications' && (
                        <HudCard title="Notification Preferences" subtitle="Choose what you get notified about">
                            <div className="space-y-4">
                                {['Email Notifications', 'Push Notifications', 'SMS Notifications', 'Weekly Digest'].map((item) => (
                                    <div key={item} className="flex items-center justify-between p-4 rounded-lg bg-hud-bg-primary">
                                        <span className="text-sm text-hud-text-primary">{item}</span>
                                        <button className="relative w-12 h-6 rounded-full bg-hud-accent-primary transition-colors">
                                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full translate-x-6" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </HudCard>
                    )}

                    {/* ═══════════════════════════════════════
                        Security 섹션
                        ═══════════════════════════════════════ */}
                    {activeSection === 'security' && (
                        <HudCard title="Security Settings" subtitle="Manage your account security">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        defaultValue="password123"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-hud-text-secondary mb-2">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-hud-text-secondary mb-2">Confirm Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-hud-border-secondary">
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-hud-bg-primary">
                                        <div>
                                            <p className="text-sm text-hud-text-primary">Two-Factor Authentication</p>
                                            <p className="text-xs text-hud-text-muted">Add an extra layer of security</p>
                                        </div>
                                        <button className="relative w-12 h-6 rounded-full bg-hud-text-muted transition-colors">
                                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full translate-x-0" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </HudCard>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Settings
