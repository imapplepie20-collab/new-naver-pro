import { useState } from 'react'
import {
    User,
    Bell,
    Lock,
    Palette,
    Globe,
    Shield,
    CreditCard,
    Mail,
    Smartphone,
    Moon,
    Sun,
    Monitor,
    Coffee,
    Check,
    Sparkles,
} from 'lucide-react'
import HudCard from '../components/common/HudCard'
import Button from '../components/common/Button'
import { useThemeStore, AccentColor, ThemeMode, FontSize, BorderRadius, ACCENT_COLORS } from '../stores/themeStore'

const settingsSections = [
    { id: 'profile', label: '프로필', icon: <User size={18} /> },
    { id: 'notifications', label: '알림', icon: <Bell size={18} /> },
    { id: 'security', label: '보안', icon: <Lock size={18} /> },
    { id: 'appearance', label: '외관', icon: <Palette size={18} /> },
    { id: 'language', label: '언어', icon: <Globe size={18} /> },
    { id: 'privacy', label: '개인정보', icon: <Shield size={18} /> },
    { id: 'billing', label: '결제', icon: <CreditCard size={18} /> },
]

const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: '라이트', icon: <Sun size={16} /> },
    { value: 'dark', label: '다크', icon: <Moon size={16} /> },
    { value: 'smart', label: '스마트', icon: <Coffee size={16} /> },
    { value: 'system', label: '시스템', icon: <Monitor size={16} /> },
]

const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'small', label: '작게' },
    { value: 'medium', label: '보통' },
    { value: 'large', label: '크게' },
]

const borderRadii: { value: BorderRadius; label: string; preview: string }[] = [
    { value: 'sharp', label: '없음', preview: 'rounded-none' },
    { value: 'medium', label: '보통', preview: 'rounded-lg' },
    { value: 'rounded', label: '둥글게', preview: 'rounded-2xl' },
]

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile')

    // Theme store
    const {
        mode,
        accentColor,
        fontSize,
        borderRadius,
        compactMode,
        setMode,
        setAccentColor,
        setFontSize,
        setBorderRadius,
        setCompactMode,
    } = useThemeStore()

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">설정</h1>
                    <p className="text-hud-text-muted mt-1">계정과 환경설정을 관리하세요.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full md:w-56 flex-shrink-0">
                    <HudCard noPadding>
                        <div className="py-2">
                            {settingsSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 transition-hud ${activeSection === section.id
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

                {/* Content */}
                <div className="flex-1 space-y-6">
                    {activeSection === 'profile' && (
                        <HudCard title="프로필 설정" subtitle="개인 정보를 수정하세요">
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
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-hud-text-secondary mb-2">Bio</label>
                                    <textarea
                                        rows={4}
                                        defaultValue="Senior Full Stack Developer with 8+ years of experience."
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud resize-none"
                                    />
                                </div>
                            </div>
                        </HudCard>
                    )}

                    {activeSection === 'notifications' && (
                        <HudCard title="Notification Preferences" subtitle="Manage how you receive notifications">
                            <div className="space-y-6">
                                {[
                                    { icon: <Mail size={18} />, title: 'Email Notifications', desc: 'Receive email updates about your account' },
                                    { icon: <Bell size={18} />, title: 'Push Notifications', desc: 'Get push notifications on your devices' },
                                    { icon: <Smartphone size={18} />, title: 'SMS Notifications', desc: 'Receive SMS for important updates' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-hud-bg-primary rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-hud-accent-primary/10 rounded-lg text-hud-accent-primary">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm text-hud-text-primary">{item.title}</p>
                                                <p className="text-xs text-hud-text-muted">{item.desc}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-hud-bg-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hud-accent-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </HudCard>
                    )}

                    {activeSection === 'appearance' && (
                        <div className="space-y-6">
                            <HudCard title="테마 모드" subtitle="선호하는 테마를 선택하세요">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {themeModes.map((theme) => (
                                        <button
                                            key={theme.value}
                                            onClick={() => setMode(theme.value)}
                                            className={`relative p-4 rounded-xl border-2 transition-all ${mode === theme.value
                                                ? 'border-hud-accent-primary bg-hud-accent-primary/10'
                                                : 'border-hud-border-secondary bg-hud-bg-primary hover:border-hud-border-primary'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`p-2 rounded-lg ${mode === theme.value ? 'bg-hud-accent-primary/20 text-hud-accent-primary' : 'bg-hud-bg-hover text-hud-text-muted'}`}>
                                                    {theme.icon}
                                                </div>
                                                <span className={`text-sm font-medium ${mode === theme.value ? 'text-hud-accent-primary' : 'text-hud-text-secondary'}`}>
                                                    {theme.label}
                                                </span>
                                            </div>
                                            {mode === theme.value && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-hud-accent-primary rounded-full flex items-center justify-center">
                                                    <Check size={12} className="text-hud-bg-primary" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </HudCard>

                            <HudCard title="강조 색상" subtitle="앱의 강조 색상을 선택하세요">
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                    {(Object.keys(ACCENT_COLORS) as Array<AccentColor>).map((color) => {
                                        const config = ACCENT_COLORS[color]
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => setAccentColor(color)}
                                                className={`relative group`}
                                            >
                                                <div
                                                    className={`w-full aspect-square rounded-xl transition-all ${accentColor === color
                                                        ? 'ring-2 ring-offset-2 ring-offset-hud-bg-secondary ring-white scale-110'
                                                        : 'ring-0 scale-100 hover:scale-105'
                                                        }`}
                                                    style={{ backgroundColor: config.primary }}
                                                />
                                                <div className="mt-2 text-center">
                                                    <span className={`text-xs ${accentColor === color ? 'text-hud-accent-primary font-medium' : 'text-hud-text-muted'}`}>
                                                        {config.name}
                                                    </span>
                                                </div>
                                                {accentColor === color && (
                                                    <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                        <Check size={10} className="text-gray-900" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </HudCard>

                            <HudCard title="글자 크기" subtitle="텍스트 크기를 조절하세요">
                                <div className="grid grid-cols-3 gap-3">
                                    {fontSizes.map((size) => (
                                        <button
                                            key={size.value}
                                            onClick={() => setFontSize(size.value)}
                                            className={`p-4 rounded-xl border-2 transition-all ${fontSize === size.value
                                                ? 'border-hud-accent-primary bg-hud-accent-primary/10'
                                                : 'border-hud-border-secondary bg-hud-bg-primary hover:border-hud-border-primary'
                                                }`}
                                        >
                                            <span
                                                className={`block ${size.value === 'small' ? 'text-sm' :
                                                    size.value === 'large' ? 'text-lg' : 'text-base'
                                                    } ${fontSize === size.value ? 'text-hud-accent-primary' : 'text-hud-text-secondary'}`}
                                            >
                                                {size.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </HudCard>

                            <HudCard title="모서리 둥글기" subtitle="UI 요소의 모서리 스타일을 선택하세요">
                                <div className="grid grid-cols-3 gap-3">
                                    {borderRadii.map((radius) => (
                                        <button
                                            key={radius.value}
                                            onClick={() => setBorderRadius(radius.value)}
                                            className={`p-4 border-2 transition-all ${radius.preview} ${borderRadius === radius.value
                                                ? 'border-hud-accent-primary bg-hud-accent-primary/10'
                                                : 'border-hud-border-secondary bg-hud-bg-primary hover:border-hud-border-primary'
                                                }`}
                                        >
                                            <span className={`text-sm ${borderRadius === radius.value ? 'text-hud-accent-primary' : 'text-hud-text-secondary'}`}>
                                                {radius.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </HudCard>

                            <HudCard title="기타 설정" subtitle="추가 표시 옵션">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-hud-bg-primary rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Sparkles size={18} className="text-hud-accent-primary" />
                                            <div>
                                                <p className="text-sm text-hud-text-primary">컴팩트 모드</p>
                                                <p className="text-xs text-hud-text-muted">더 좁은 간격으로 표시</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={compactMode}
                                                onChange={(e) => setCompactMode(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-hud-bg-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hud-accent-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </HudCard>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <HudCard title="Security Settings" subtitle="Protect your account">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-hud-text-secondary mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        className="w-full px-4 py-2.5 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-hud-text-primary focus:outline-none focus:border-hud-accent-primary transition-hud"
                                    />
                                </div>
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

                                <div className="pt-4 border-t border-hud-border-secondary">
                                    <div className="flex items-center justify-between p-4 bg-hud-bg-primary rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-hud-accent-primary/10 rounded-lg text-hud-accent-primary">
                                                <Shield size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-hud-text-primary">Two-Factor Authentication</p>
                                                <p className="text-xs text-hud-text-muted">Add an extra layer of security</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Enable</Button>
                                    </div>
                                </div>
                            </div>
                        </HudCard>
                    )}

                    {(activeSection !== 'profile' && activeSection !== 'notifications' && activeSection !== 'appearance' && activeSection !== 'security') && (
                        <HudCard title={settingsSections.find(s => s.id === activeSection)?.label} subtitle="Settings coming soon">
                            <div className="py-12 text-center">
                                <p className="text-hud-text-muted">This section is under development.</p>
                            </div>
                        </HudCard>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Settings
