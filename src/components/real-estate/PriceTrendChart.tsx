// ============================================
// 가격 추이 차트 컴포넌트
// 지역별/단지별 가격 변화 시각화
// ============================================

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Building2, MapPin, Loader2 } from 'lucide-react';

interface PriceDataPoint {
    date: string;
    price: number;
    count: number;
}

interface PriceTrendChartProps {
    cortarNo?: string;
    complexNo?: string;
    title?: string;
    period?: '3month' | '6month' | '1year' | 'all';
}

import { API_BASE } from '../../lib/api';

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
    cortarNo,
    complexNo,
    title,
    period = '6month'
}) => {
    const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState(period);

    useEffect(() => {
        fetchPriceTrend();
    }, [cortarNo, complexNo, selectedPeriod]);

    const fetchPriceTrend = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (cortarNo) params.append('cortarNo', cortarNo);
            if (complexNo) params.append('complexNo', complexNo);
            params.append('period', selectedPeriod);

            const response = await fetch(`${API_BASE}/api/statistics/price-trend?${params}`);
            if (response.ok) {
                const data = await response.json();
                setPriceData(data.trend || []);
            } else {
                // API가 없으면 mock 데이터 사용
                generateMockData();
            }
        } catch (error) {
            console.error('Failed to fetch price trend:', error);
            generateMockData();
        } finally {
            setIsLoading(false);
        }
    };

    const generateMockData = () => {
        // Mock 데이터 생성
        const now = new Date();
        const months = selectedPeriod === '3month' ? 3 : selectedPeriod === '6month' ? 6 : 12;
        const data: PriceDataPoint[] = [];

        let basePrice = 50000; // 5억 기준
        for (let i = months; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const variation = (Math.random() - 0.4) * 5000; // -2000 ~ +3000 변동
            basePrice = Math.max(30000, basePrice + variation);

            data.push({
                date: date.toISOString().slice(0, 7), // YYYY-MM
                price: Math.round(basePrice),
                count: Math.floor(Math.random() * 50) + 10,
            });
        }

        setPriceData(data);
    };

    const formatPrice = (price: number): string => {
        const ok = Math.floor(price / 10000);
        const man = Math.floor((price % 10000) / 100);

        if (ok > 0) return `${ok}억 ${man}천만원`;
        return `${man}천만원`;
    };

    const calculateChange = () => {
        if (priceData.length < 2) return { value: 0, percentage: 0 };
        const first = priceData[0].price;
        const last = priceData[priceData.length - 1].price;
        const value = last - first;
        const percentage = ((value / first) * 100);
        return { value, percentage };
    };

    const change = calculateChange();
    const maxPrice = Math.max(...priceData.map(d => d.price));
    const minPrice = Math.min(...priceData.map(d => d.price));

    if (isLoading) {
        return (
            <div className="bg-hud-bg-secondary border border-hud-border-secondary rounded-lg p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-hud-accent-primary animate-spin" />
                        <p className="text-sm text-hud-text-muted">데이터를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-hud-bg-secondary border border-hud-border-secondary rounded-lg p-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-hud-accent-primary" />
                    <div>
                        <h3 className="text-lg font-semibold text-hud-text-primary">
                            {title || '가격 추이'}
                        </h3>
                        <p className="text-xs text-hud-text-muted">
                            최근 {priceData.length}개월 데이터
                        </p>
                    </div>
                </div>

                {/* 기간 선택 */}
                <div className="flex gap-1">
                    {[
                        { value: '3month', label: '3개월' },
                        { value: '6month', label: '6개월' },
                        { value: '1year', label: '1년' },
                    ].map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setSelectedPeriod(p.value as any)}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${selectedPeriod === p.value
                                    ? 'bg-hud-accent-primary text-hud-bg-primary'
                                    : 'bg-hud-bg-primary text-hud-text-secondary hover:bg-hud-bg-hover'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 변화 요약 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-hud-bg-primary rounded-lg">
                    <p className="text-xs text-hud-text-muted mb-1">현재 평균가</p>
                    <p className="text-lg font-bold text-hud-text-primary">
                        {priceData.length > 0 && formatPrice(priceData[priceData.length - 1].price)}
                    </p>
                </div>
                <div className="p-3 bg-hud-bg-primary rounded-lg">
                    <p className="text-xs text-hud-text-muted mb-1">최고가</p>
                    <p className="text-lg font-bold text-hud-accent-warning">
                        {formatPrice(maxPrice)}
                    </p>
                </div>
                <div className="p-3 bg-hud-bg-primary rounded-lg">
                    <p className="text-xs text-hud-text-muted mb-1">변동률</p>
                    <p className={`text-lg font-bold ${change.percentage >= 0 ? 'text-hud-accent-success' : 'text-hud-accent-danger'}`}>
                        {change.percentage >= 0 ? '+' : ''}{change.percentage.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* 차트 영역 */}
            <div className="relative h-48">
                {/* Y축 라인 */}
                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                    {[0, 25, 50, 75, 100].map((percent) => (
                        <div key={percent} className="relative w-full">
                            <div className="absolute inset-0 border-t border-dashed border-hud-border-secondary" style={{ top: `${percent}%` }} />
                            <span className="absolute left-0 -translate-y-1/2 -translate-x-full pr-2 text-xs text-hud-text-muted">
                                {formatPrice(Math.round(maxPrice - (maxPrice - minPrice) * (percent / 100)))}
                            </span>
                        </div>
                    ))}
                </div>

                {/* SVG 라인 차트 */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00FFCC" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#00FFCC" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* 영역 채우기 */}
                    {priceData.length > 1 && (
                        <path
                            d={`
                                M 0,${100 - ((priceData[0].price - minPrice) / (maxPrice - minPrice)) * 100}
                                ${priceData.slice(1).map((d, i) => {
                                const x = ((i + 1) / (priceData.length - 1)) * 100;
                                const y = 100 - ((d.price - minPrice) / (maxPrice - minPrice)) * 100;
                                return ` L ${x},${y}`;
                            }).join('')}
                                L 100,100 L 0,100 Z
                            `}
                            fill="url(#lineGradient)"
                        />
                    )}

                    {/* 라인 */}
                    {priceData.length > 1 && (
                        <path
                            d={`
                                M 0,${100 - ((priceData[0].price - minPrice) / (maxPrice - minPrice)) * 100}
                                ${priceData.slice(1).map((d, i) => {
                                const x = ((i + 1) / (priceData.length - 1)) * 100;
                                const y = 100 - ((d.price - minPrice) / (maxPrice - minPrice)) * 100;
                                return ` L ${x},${y}`;
                            }).join('')}
                            `}
                            fill="none"
                            stroke="#00FFCC"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* 데이터 포인트 */}
                    {priceData.map((d, i) => {
                        const x = (i / (priceData.length - 1 || 1)) * 100;
                        const y = 100 - ((d.price - minPrice) / (maxPrice - minPrice || 1)) * 100;
                        return (
                            <g key={i}>
                                <circle
                                    cx={`${x}%`}
                                    cy={`${y}%`}
                                    r="4"
                                    fill="#00FFCC"
                                    className="cursor-pointer hover:r-6 transition-all"
                                />
                                {/* 툴팁 */}
                                <foreignObject
                                    x={`${x}%`}
                                    y={`${y - 25}%`}
                                    width="80"
                                    height="40"
                                    transform={`translate(-40, 0)`}
                                >
                                    <div className="bg-hud-bg-primary border border-hud-border-secondary rounded px-2 py-1 text-xs">
                                        <p className="text-hud-text-muted">{d.date}</p>
                                        <p className="text-hud-text-primary font-medium">{formatPrice(d.price)}</p>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* X축 라벨 */}
            <div className="flex justify-between mt-2 pt-2 border-t border-hud-border-secondary">
                {priceData.map((d, i) => {
                    const showLabel = i % Math.ceil(priceData.length / 6) === 0;
                    return (
                        <span
                            key={i}
                            className={`text-xs text-hud-text-muted ${showLabel ? '' : 'invisible'}`}
                        >
                            {d.date.slice(2)} // MM 형식
                        </span>
                    );
                })}
            </div>

            {/* 거래량 정보 */}
            <div className="mt-4 pt-4 border-t border-hud-border-secondary flex items-center justify-between text-xs text-hud-text-muted">
                <span>총 {priceData.reduce((sum, d) => sum + d.count, 0)}건 거래</span>
                <span>평균 {Math.round(priceData.reduce((sum, d) => sum + d.count, 0) / priceData.length)}건/월</span>
            </div>
        </div>
    );
};

export default PriceTrendChart;
