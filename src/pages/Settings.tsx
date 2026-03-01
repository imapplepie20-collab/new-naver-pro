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
                            {/* ===== 테마 모드 - Premium Redesign ===== */}
                            <HudCard title="테마 모드" subtitle="선호하는 테마를 선택하세요">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* 라이트 테마 */}
                                    <button
                                        onClick={() => setMode('light')}
                                        className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${mode === 'light'
                                            ? 'border-hud-accent-primary shadow-[0_0_20px_rgba(var(--hud-accent-primary-rgb),0.25)] scale-[1.02]'
                                            : 'border-hud-border-secondary hover:border-hud-border-primary hover:scale-[1.01]'
                                            }`}
                                    >
                                        {/* Mini Preview */}
                                        <div className="p-3 pb-2">
                                            <div className="rounded-lg overflow-hidden border border-gray-600/30" style={{ background: '#1a1f2e' }}>
                                                <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-600/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                                </div>
                                                <div className="flex h-14">
                                                    <div className="w-8 border-r border-gray-600/20 p-1 space-y-1">
                                                        <div className="w-full h-1 rounded bg-gray-500/40"></div>
                                                        <div className="w-full h-1 rounded bg-gray-500/30"></div>
                                                        <div className="w-full h-1 rounded bg-gray-500/20"></div>
                                                    </div>
                                                    <div className="flex-1 p-1.5 space-y-1">
                                                        <div className="w-3/4 h-1.5 rounded bg-gray-400/40"></div>
                                                        <div className="flex gap-1">
                                                            <div className="flex-1 h-4 rounded bg-gray-500/20 border border-gray-500/10"></div>
                                                            <div className="flex-1 h-4 rounded bg-gray-500/20 border border-gray-500/10"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 pb-3 flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg transition-colors ${mode === 'light' ? 'bg-hud-accent-primary/20 text-hud-accent-primary' : 'bg-hud-bg-hover text-hud-text-muted'}`}>
                                                <Sun size={14} />
                                            </div>
                                            <span className={`text-sm font-medium ${mode === 'light' ? 'text-hud-accent-primary' : 'text-hud-text-secondary'}`}>라이트</span>
                                        </div>
                                        {mode === 'light' && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-hud-accent-primary rounded-full flex items-center justify-center shadow-lg">
                                                <Check size={12} className="text-hud-bg-primary" />
                                            </div>
                                        )}
                                    </button>

                                    {/* 다크 테마 */}
                                    <button
                                        onClick={() => setMode('dark')}
                                        className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${mode === 'dark'
                                            ? 'border-hud-accent-primary shadow-[0_0_20px_rgba(var(--hud-accent-primary-rgb),0.25)] scale-[1.02]'
                                            : 'border-hud-border-secondary hover:border-hud-border-primary hover:scale-[1.01]'
                                            }`}
                                    >
                                        <div className="p-3 pb-2">
                                            <div className="rounded-lg overflow-hidden border border-gray-700/30" style={{ background: '#0a0e1a' }}>
                                                <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-700/30">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                                </div>
                                                <div className="flex h-14">
                                                    <div className="w-8 border-r border-cyan-500/10 p-1 space-y-1">
                                                        <div className="w-full h-1 rounded bg-cyan-400/30"></div>
                                                        <div className="w-full h-1 rounded bg-gray-600/30"></div>
                                                        <div className="w-full h-1 rounded bg-gray-600/20"></div>
                                                    </div>
                                                    <div className="flex-1 p-1.5 space-y-1">
                                                        <div className="w-3/4 h-1.5 rounded bg-gray-300/30"></div>
                                                        <div className="flex gap-1">
                                                            <div className="flex-1 h-4 rounded bg-cyan-400/10 border border-cyan-400/20"></div>
                                                            <div className="flex-1 h-4 rounded bg-cyan-400/10 border border-cyan-400/20"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 pb-3 flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg transition-colors ${mode === 'dark' ? 'bg-hud-accent-primary/20 text-hud-accent-primary' : 'bg-hud-bg-hover text-hud-text-muted'}`}>
                                                <Moon size={14} />
                                            </div>
                                            <span className={`text-sm font-medium ${mode === 'dark' ? 'text-hud-accent-primary' : 'text-hud-text-secondary'}`}>다크</span>
                                        </div>
                                        {mode === 'dark' && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-hud-accent-primary rounded-full flex items-center justify-center shadow-lg">
                                                <Check size={12} className="text-hud-bg-primary" />
                                            </div>
                                        )}
                                    </button>

                                    {/* 스마트 테마 - Special Premium Card */}
                                    <button
                                        onClick={() => setMode('smart')}
                                        className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${mode === 'smart'
                                            ? 'border-hud-accent-primary shadow-[0_0_24px_rgba(var(--hud-accent-primary-rgb),0.3)] scale-[1.02]'
                                            : 'border-hud-border-secondary hover:border-hud-border-primary hover:scale-[1.01]'
                                            }`}
                                    >
                                        {/* Animated gradient background for smart theme */}
                                        <div className="absolute inset-0 opacity-20" style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #ffd89b 75%, #667eea 100%)',
                                            backgroundSize: '400% 400%',
                                            animation: 'smartGradient 6s ease infinite',
                                        }}></div>
                                        <div className="relative p-3 pb-2">
                                            {/* Split preview: day + night */}
                                            <div className="rounded-lg overflow-hidden border border-purple-400/20 flex">
                                                {/* Day half */}
                                                <div className="flex-1" style={{ background: '#f1f5f9' }}>
                                                    <div className="flex items-center gap-0.5 px-1.5 py-1 border-b border-gray-300/50">
                                                        <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                        <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                                                        <div className="w-1 h-1 rounded-full bg-green-400"></div>
                                                    </div>
                                                    <div className="p-1 h-12 space-y-0.5">
                                                        <div className="w-full h-1 rounded bg-gray-400/40"></div>
                                                        <div className="w-3/4 h-1 rounded bg-gray-400/30"></div>
                                                        <div className="flex gap-0.5 mt-1">
                                                            <div className="flex-1 h-3 rounded-sm bg-purple-200/60"></div>
                                                            <div className="flex-1 h-3 rounded-sm bg-blue-200/60"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Night half */}
                                                <div className="flex-1" style={{ background: '#0a0e1a' }}>
                                                    <div className="flex items-center gap-0.5 px-1.5 py-1 border-b border-gray-700/50">
                                                        <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                        <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                                                        <div className="w-1 h-1 rounded-full bg-green-400"></div>
                                                    </div>
                                                    <div className="p-1 h-12 space-y-0.5">
                                                        <div className="w-full h-1 rounded bg-gray-400/30"></div>
                                                        <div className="w-3/4 h-1 rounded bg-gray-400/20"></div>
                                                        <div className="flex gap-0.5 mt-1">
                                                            <div className="flex-1 h-3 rounded-sm bg-cyan-400/20"></div>
                                                            <div className="flex-1 h-3 rounded-sm bg-cyan-400/15"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Day/Night indicator */}
                                            <div className="flex justify-center gap-3 mt-1">
                                                <span className="text-[9px] text-amber-400/70 flex items-center gap-0.5"><Sun size={8} /> 낮</span>
                                                <span className="text-[9px] text-indigo-300/70 flex items-center gap-0.5"><Moon size={8} /> 밤</span>
                                            </div>
                                        </div>
                                        <div className="relative px-3 pb-3 flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg transition-colors ${mode === 'smart'
                                                ? 'bg-gradient-to-br from-amber-400/30 to-indigo-500/30 text-hud-accent-primary'
                                                : 'bg-hud-bg-hover text-hud-text-muted'}`}>
                                                <Coffee size={14} />
                                            </div>
                                            <div className="text-left">
                                                <span className={`text-sm font-medium block leading-tight ${mode === 'smart' ? 'text-hud-accent-primary' : 'text-hud-text-secondary'}`}>스마트</span>
                                                <span className="text-[10px] text-hud-text-muted leading-tight">시간대 자동 전환</span>
                                            </div>
                                        </div>
                                        {mode === 'smart' && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-hud-accent-primary rounded-full flex items-center justify-center shadow-lg">
                                                <Check size={12} className="text-hud-bg-primary" />
                                            </div>
                                        )}
                                    </button>

                                    {/* 시스템 테마 */}
                                    <button
                                        onClick={() => setMode('system')}
                                        className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${mode === 'system'
                                            ? 'border-hud-accent-primary shadow-[0_0_20px_rgba(var(--hud-accent-primary-rgb),0.25)] scale-[1.02]'
                                            : 'border-hud-border-secondary hover:border-hud-border-primary hover:scale-[1.01]'
                                            }`}
                                    >
                                        <div className="p-3 pb-2">
                                            <div className="rounded-lg overflow-hidden border border-gray-600/20 flex" style={{ background: 'linear-gradient(135deg, #1e293b 50%, #e2e8f0 50%)' }}>
                                                <div className="w-full">
                                                    <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                                    </div>
                                                    <div className="flex h-14 items-center justify-center">
                                                        <Monitor size={16} className="text-gray-400/60" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 pb-3 flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg transition-colors ${mode === 'system' ? 'bg-hud-accent-primary/20 text-hud-accent-primary' : 'bg-hud-bg-hover text-hud-text-muted'}`}>
                                                <Monitor size={14} />
                                            </div>
                                            <span className={`text-sm font-medium ${mode === 'system' ? 'text-hud-accent-primary' : 'text-hud-text-secondary'}`}>시스템</span>
                                        </div>
                                        {mode === 'system' && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-hud-accent-primary rounded-full flex items-center justify-center shadow-lg">
                                                <Check size={12} className="text-hud-bg-primary" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </HudCard>

                            {/* ===== 강조 색상 ===== */}
                            <HudCard title="강조 색상" subtitle="앱의 강조 색상을 선택하세요">
                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3">
                                    {(Object.keys(ACCENT_COLORS) as Array<AccentColor>).map((color) => {
                                        const config = ACCENT_COLORS[color]
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => setAccentColor(color)}
                                                className="relative group"
                                            >
                                                <div
                                                    className={`w-full aspect-square rounded-2xl transition-all duration-300 ${accentColor === color
                                                        ? 'ring-2 ring-offset-2 ring-offset-hud-bg-secondary ring-white scale-110 shadow-lg'
                                                        : 'ring-0 scale-100 hover:scale-105 hover:shadow-md'
                                                        }`}
                                                    style={{
                                                        background: `linear-gradient(135deg, ${config.primary}, ${config.info})`,
                                                        boxShadow: accentColor === color ? `0 8px 24px ${config.primary}40` : undefined,
                                                    }}
                                                />
                                                <div className="mt-2 text-center">
                                                    <span className={`text-xs font-medium transition-colors ${accentColor === color ? 'text-hud-accent-primary' : 'text-hud-text-muted'}`}>
                                                        {config.name}
                                                    </span>
                                                </div>
                                                {accentColor === color && (
                                                    <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                        <Check size={12} className="text-gray-900" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </HudCard>

                            {/* ===== 글자 크기 ===== */}
                            <HudCard title="글자 크기" subtitle="텍스트 크기를 조절하세요">
                                <div className="grid grid-cols-3 gap-4">
                                    {fontSizes.map((size) => (
                                        <button
                                            key={size.value}
                                            onClick={() => setFontSize(size.value)}
                                            className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${fontSize === size.value
                                                ? 'border-hud-accent-primary bg-hud-accent-primary/10 shadow-[0_0_16px_rgba(var(--hud-accent-primary-rgb),0.15)]'
                                                : 'border-hud-border-secondary bg-hud-bg-primary hover:border-hud-border-primary hover:bg-hud-bg-hover'
                                                }`}
                                        >
                                            <span className={`font-semibold ${size.value === 'small' ? 'text-lg' : size.value === 'large' ? 'text-3xl' : 'text-2xl'} ${fontSize === size.value ? 'text-hud-accent-primary' : 'text-hud-text-secondary'}`}>
                                                가
                                            </span>
                                            <span className={`text-xs ${fontSize === size.value ? 'text-hud-accent-primary' : 'text-hud-text-muted'}`}>
                                                {size.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </HudCard>

                            {/* ===== 모서리 둥글기 ===== */}
                            <HudCard title="모서리 둥글기" subtitle="UI 요소의 모서리 스타일을 선택하세요">
                                <div className="grid grid-cols-3 gap-4">
                                    {borderRadii.map((radius) => (
                                        <button
                                            key={radius.value}
                                            onClick={() => setBorderRadius(radius.value)}
                                            className={`p-5 border-2 transition-all duration-300 flex flex-col items-center gap-3 ${radius.preview} ${borderRadius === radius.value
                                                ? 'border-hud-accent-primary bg-hud-accent-primary/10 shadow-[0_0_16px_rgba(var(--hud-accent-primary-rgb),0.15)]'
                                                : 'border-hud-border-secondary bg-hud-bg-primary hover:border-hud-border-primary hover:bg-hud-bg-hover'
                                                }`}
                                        >
                                            {/* Visual preview of border radius */}
                                            <div
                                                className={`w-10 h-10 border-2 transition-colors ${radius.value === 'sharp' ? 'rounded-none' : radius.value === 'medium' ? 'rounded-lg' : 'rounded-2xl'} ${borderRadius === radius.value ? 'border-hud-accent-primary bg-hud-accent-primary/20' : 'border-hud-text-muted/30 bg-hud-bg-hover'}`}
                                            ></div>
                                            <span className={`text-xs ${borderRadius === radius.value ? 'text-hud-accent-primary' : 'text-hud-text-muted'}`}>
                                                {radius.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </HudCard>

                            {/* ===== 기타 설정 ===== */}
                            <HudCard title="기타 설정" subtitle="추가 표시 옵션">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-hud-bg-primary rounded-xl border border-hud-border-secondary/50 transition-all hover:border-hud-border-primary/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-hud-accent-primary/10">
                                                <Sparkles size={18} className="text-hud-accent-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-hud-text-primary">컴팩트 모드</p>
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
