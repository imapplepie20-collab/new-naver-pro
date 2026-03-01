// ============================================
// 부동산 분석 대시보드
// 전체 현황 요약 및 통계
// ============================================

import { useEffect, useState } from 'react';
import {
    Building2,
    TrendingUp,
    Activity,
    MapPin,
    Home,
    Store,
    Factory,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    RefreshCw,
} from 'lucide-react';
import HudCard from '../../components/common/HudCard';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import PriceTrendChart from '../../components/real-estate/PriceTrendChart';

import { API_BASE } from '../../lib/api';

interface StatData {
    totalProperties: number;
    totalComplexes: number;
    avgPrice: number;
    priceChange: number;
}

interface RegionStatistics {
    cortarNo: string;
    cortarName: string;
    count: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
}

interface PropertyTypeCount {
    realEstateType: string;
    count: number;
    avgPrice: number;
}

interface UserSummary {
    savedCount: number;
    activeAlertCount: number;
    conditionCount: number;
}

const propertyTypeNames: Record<string, string> = {
    APT: '아파트',
    OPST: '오피스텔',
    VL: '빌라/연립',
    DDDGG: '단독/다가구',
    JWJT: '전원주택',
    SGJT: '상가주택',
    ONEROOM: '원룸',
    TWOROOM: '투룸',
    SG: '상가',
    SMS: '사무실',
    GJCG: '공장/창고',
    TJ: '토지',
};

const propertyTypeIcons: Record<string, React.ReactNode> = {
    APT: <Building2 size={20} />,
    OPST: <Building2 size={20} />,
    VL: <Home size={20} />,
    ONEROOM: <Home size={20} />,
    SG: <Store size={20} />,
    default: <Building2 size={20} />,
};

const Dashboard = () => {
    const [stats, setStats] = useState<StatData | null>(null);
    const [regionStats, setRegionStats] = useState<RegionStatistics[]>([]);
    const [typeStats, setTypeStats] = useState<PropertyTypeCount[]>([]);
    const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchDashboardData = async (showRefreshing = false) => {
        if (showRefreshing) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            // 전체 통계 조회
            const statsRes = await fetch(`${API_BASE}/api/statistics/overview`);
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // 지역별 통계 (상위 10개)
            const regionRes = await fetch(`${API_BASE}/api/statistics/regions?limit=10`);
            if (regionRes.ok) {
                const regionData = await regionRes.json();
                setRegionStats(regionData.statistics || []);
            }

            // 매물타입별 통계
            const typeRes = await fetch(`${API_BASE}/api/statistics/types`);
            if (typeRes.ok) {
                const typeData = await typeRes.json();
                setTypeStats(typeData.statistics || []);
            }

            // 사용자 요약 정보
            const userRes = await fetch(`${API_BASE}/api/user/summary`, {
                headers: { 'x-user-id': 'temp-user' },
            });
            if (userRes.ok) {
                const userData = await userRes.json();
                setUserSummary(userData);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatPrice = (price: number): string => {
        const ok = Math.floor(price / 100000000);
        const man = Math.floor((price % 100000000) / 10000);

        const parts: string[] = [];
        if (ok > 0) parts.push(`${ok}억`);
        if (man > 0) parts.push(`${man.toLocaleString()}만`);

        return parts.join(' ') || '0';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-hud-accent-primary animate-spin" />
                    <p className="text-hud-text-muted">데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hud-text-primary">부동산 분석 대시보드</h1>
                    <p className="text-hud-text-muted mt-1">전국 부동산 매물 현황 및 통계</p>
                </div>
                <Button
                    variant="primary"
                    glow
                    leftIcon={<RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />}
                    onClick={() => fetchDashboardData(true)}
                    disabled={isRefreshing}
                >
                    새로고침
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="전체 매물"
                    value={stats?.totalProperties?.toLocaleString() || '0'}
                    change={5.2}
                    icon={<Building2 size={24} />}
                    variant="primary"
                />
                <StatCard
                    title="단지 수"
                    value={stats?.totalComplexes?.toLocaleString() || '0'}
                    change={3.1}
                    icon={<MapPin size={24} />}
                    variant="secondary"
                />
                <StatCard
                    title="평균 매매가"
                    value={stats ? formatPrice(stats.avgPrice) : '0'}
                    change={stats?.priceChange || 0}
                    icon={<TrendingUp size={24} />}
                    variant="warning"
                />
                <StatCard
                    title="누적 조회"
                    value="12.5K"
                    change={8.7}
                    icon={<Activity size={24} />}
                    variant="info"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 매물타입별 분포 */}
                <HudCard
                    title="매물유형별 분포"
                    subtitle="유형별 매물 수 및 평균가"
                    className="lg:col-span-2"
                >
                    <div className="space-y-4">
                        {typeStats.length > 0 ? (
                            typeStats.map((type) => {
                                const maxCount = Math.max(...typeStats.map(t => t.count));
                                const percentage = (type.count / maxCount) * 100;

                                return (
                                    <div key={type.realEstateType}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {propertyTypeIcons[type.realEstateType] || propertyTypeIcons.default}
                                                <span className="text-sm font-medium text-hud-text-primary">
                                                    {propertyTypeNames[type.realEstateType] || type.realEstateType}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-hud-text-muted">
                                                    {type.count.toLocaleString()}개
                                                </span>
                                                <span className="text-sm font-mono text-hud-accent-primary">
                                                    {formatPrice(type.avgPrice)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-3 bg-hud-bg-primary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-hud-accent-primary to-hud-accent-secondary rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-hud-text-muted">
                                데이터가 없습니다
                            </div>
                        )}
                    </div>
                </HudCard>

                {/* 거래방식별 비율 */}
                <HudCard title="거래방식별 비율" subtitle="매매/전세/월세">
                    <div className="space-y-6">
                        {[
                            { label: '매매', value: 42, color: 'bg-hud-accent-primary' },
                            { label: '전세', value: 35, color: 'bg-hud-accent-info' },
                            { label: '월세', value: 23, color: 'bg-hud-accent-warning' },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-hud-text-secondary">{item.label}</span>
                                    <span className="text-hud-text-primary font-medium">{item.value}%</span>
                                </div>
                                <div className="h-2 bg-hud-bg-primary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </HudCard>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 지역별 통계 */}
                <HudCard
                    title="지역별 평균가"
                    subtitle="평균 매매가 기준 상위 지역"
                    noPadding
                    action={
                        <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight size={14} />}>
                            더보기
                        </Button>
                    }
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-hud-border-secondary">
                                    <th className="text-left px-5 py-3 text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                        지역명
                                    </th>
                                    <th className="text-right px-5 py-3 text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                        매물 수
                                    </th>
                                    <th className="text-right px-5 py-3 text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                        평균가
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {regionStats.length > 0 ? (
                                    regionStats.map((region) => (
                                        <tr
                                            key={region.cortarNo}
                                            className="border-b border-hud-border-secondary last:border-0 hover:bg-hud-bg-hover transition-hud"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-hud-accent-primary" />
                                                    <span className="text-sm text-hud-text-primary">{region.cortarName}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span className="text-sm font-mono text-hud-text-secondary">
                                                    {region.count.toLocaleString()}개
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span className="text-sm font-mono text-hud-accent-primary">
                                                    {formatPrice(region.avgPrice)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-8 text-center text-hud-text-muted">
                                            데이터가 없습니다
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </HudCard>

                {/* 최근 등록 매물 */}
                <HudCard
                    title="최근 등록 매물"
                    subtitle="최근 등록된 매물 정보"
                    noPadding
                    action={
                        <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight size={14} />}>
                            전체보기
                        </Button>
                    }
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-hud-border-secondary">
                                    <th className="text-left px-5 py-3 text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                        매물명
                                    </th>
                                    <th className="text-left px-5 py-3 text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                        유형
                                    </th>
                                    <th className="text-right px-5 py-3 text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                        가격
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: '역삼힐스테이트', type: '아파트', price: '18억 5,000만', trend: 'up' },
                                    { name: '강남역 더샵', type: '오피스텔', price: '12억 3,000만', trend: 'up' },
                                    { name: '삼성동 빌라', type: '빌라', price: '8억 7,000만', trend: 'down' },
                                    { name: '선릉역 원룸', type: '원룸', price: '5억 2,000만', trend: 'same' },
                                    { name: '대치동 상가', type: '상가', price: '25억', trend: 'up' },
                                ].map((item, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-hud-border-secondary last:border-0 hover:bg-hud-bg-hover transition-hud"
                                    >
                                        <td className="px-5 py-3">
                                            <span className="text-sm text-hud-text-primary">{item.name}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-hud-accent-info/10 text-hud-accent-info">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-sm font-mono text-hud-text-primary">{item.price}</span>
                                                {item.trend === 'up' && <ArrowUpRight size={14} className="text-hud-accent-success" />}
                                                {item.trend === 'down' && <ArrowDownRight size={14} className="text-hud-accent-danger" />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </HudCard>
            </div>

            {/* User Summary */}
            <HudCard title="내 정보" subtitle="저장한 매물 및 알림">
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-hud-bg-primary rounded-lg text-center">
                        <p className="text-2xl font-bold text-hud-accent-primary">{userSummary?.savedCount || 0}</p>
                        <p className="text-xs text-hud-text-muted mt-1">저장한 매물</p>
                    </div>
                    <div className="p-4 bg-hud-bg-primary rounded-lg text-center">
                        <p className="text-2xl font-bold text-hud-accent-warning">{userSummary?.activeAlertCount || 0}</p>
                        <p className="text-xs text-hud-text-muted mt-1">활성 알림</p>
                    </div>
                    <div className="p-4 bg-hud-bg-primary rounded-lg text-center">
                        <p className="text-2xl font-bold text-hud-accent-info">{userSummary?.conditionCount || 0}</p>
                        <p className="text-xs text-hud-text-muted mt-1">저장한 조건</p>
                    </div>
                </div>
            </HudCard>

            {/* Price Trend Chart */}
            <PriceTrendChart title="전국 평균 가격 추이" period="6month" />

            {/* System Status */}
            <HudCard title="시스템 상태" subtitle="API 및 데이터베이스 상태">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'API 서버', status: '정상', color: 'text-hud-accent-success' },
                        { label: '데이터베이스', status: '정상', color: 'text-hud-accent-success' },
                        { label: '토큰 관리', status: '정상', color: 'text-hud-accent-success' },
                        { label: '크롤러', status: '대기중', color: 'text-hud-accent-warning' },
                    ].map((item) => (
                        <div key={item.label} className="p-4 bg-hud-bg-primary rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-hud-text-secondary">{item.label}</span>
                                <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
                            </div>
                            <div className="mt-2 h-1.5 bg-hud-bg-hover rounded-full overflow-hidden">
                                <div className={`h-full ${item.color.replace('text', 'bg')} rounded-full`} style={{ width: '100%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </HudCard>
        </div>
    );
};

export default Dashboard;
