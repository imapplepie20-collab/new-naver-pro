// ============================================
// 네이버 부동산 매물 검색 페이지
// HUD 테마 기반 반응형 UI
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    RefreshCw,
    Building2,
    MapPin,
    Loader2,
    Home,
    AlertCircle,
    ChevronDown,
    X,
    Map,
    Heart,
    HeartOff,
    SlidersHorizontal,
    TrendingUp,
    ArrowUpDown,
    Layers,
} from 'lucide-react';
import RegionSelectorModal from '../../components/real-estate/RegionSelectorModal';
import PropertyMapView from '../../components/real-estate/PropertyMapView';
import HudCard from '../../components/common/HudCard';
import Button from '../../components/common/Button';
import type { RealEstateTypeCode, TradeTypeCode } from '../../types/naver-land';

const API_BASE = import.meta.env.VITE_API_BASE || window.location.protocol + '//' + window.location.hostname + ':3001';

// ============================================
// 타입 정의
// ============================================

type Article = {
    articleNo: string;
    articleName: string;
    tradeTypeName: string;
    tradeTypeCode: string;
    dealOrWarrantPrc: string | null;  // API 응답은 문자열 "9억 5,000"
    rentPrc?: number;  // 월세
    area1: number;
    area2: number;
    floorInfo: string;
    direction?: string;
    articleConfirmYmd: string;
    buildingName?: string;
    realEstateTypeName: string;
    realEstateTypeCode: string;
    tagList: string[];
    latitude?: string;
    longitude?: string;
    cortarNo: string;
    complexNo?: string;
};

type Complex = {
    markerId: string;  // complexNo
    complexName: string;
    realEstateTypeName: string;
    realEstateTypeCode: string;
    latitude: number;
    longitude: number;
    dealCount?: number;
    leaseCount?: number;
    rentCount?: number;
    totalArticleCount?: number;
};

type Region = {
    cortarNo: string;
    cortarName: string;
    cortarType: string;
    centerLat?: number;
    centerLon?: number;
};

type SortOption = 'rank' | 'price' | 'area' | 'date';

// ============================================
// 상수 정의
// ============================================

const PROPERTY_TYPES = [
    { code: 'APT' as const, name: '아파트', icon: <Building2 size={16} /> },
    { code: 'OPST' as const, name: '오피스텔', icon: <Building2 size={16} /> },
    { code: 'VL' as const, name: '빌라/연립', icon: <Home size={16} /> },
    { code: 'ONEROOM' as const, name: '원룸', icon: <Home size={16} /> },
    { code: 'TWOROOM' as const, name: '투룸', icon: <Home size={16} /> },
    { code: 'SG' as const, name: '상가', icon: <Layers size={16} /> },
];

const TRADE_TYPES = [
    { code: 'A1' as const, name: '매매', color: 'bg-hud-accent-danger/10 text-hud-accent-danger' },
    { code: 'B1' as const, name: '전세', color: 'bg-hud-accent-success/10 text-hud-accent-success' },
    { code: 'B2' as const, name: '월세', color: 'bg-hud-accent-warning/10 text-hud-accent-warning' },
];

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'rank', label: '정확순', icon: <TrendingUp size={14} /> },
    { value: 'price', label: '가격순', icon: <ArrowUpDown size={14} /> },
    { value: 'area', label: '면적순', icon: <Layers size={14} /> },
    { value: 'date', label: '최신순', icon: <Home size={14} /> },
];

// ============================================
// 컴포넌트
// ============================================

const RealEstate = () => {
    const navigate = useNavigate();

    // ============================================
    // State
    // ============================================
    const [selectedTypes, setSelectedTypes] = useState<RealEstateTypeCode[]>(['APT']);
    const [selectedTrade, setSelectedTrade] = useState<TradeTypeCode>('A1');
    const [priceMin, setPriceMin] = useState<number>(0);
    const [priceMax, setPriceMax] = useState<number>(1000000); // 만원단위
    const [areaMin, setAreaMin] = useState<number>(0);
    const [areaMax, setAreaMax] = useState<number>(200);
    const [sortBy, setSortBy] = useState<SortOption>('rank');

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);
    const [complexes, setComplexes] = useState<Complex[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 지역 선택
    const [showRegionModal, setShowRegionModal] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

    // 지도 뷰
    const [showMapView, setShowMapView] = useState(false);
    const [selectedMapProperty, setSelectedMapProperty] = useState<Article | null>(null);

    // 저장한 매물
    const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());

    // 필터 토글 (모바일)
    const [showFilter, setShowFilter] = useState(false);

    // ============================================
    // Effects
    // ============================================
    useEffect(() => {
        // 저장한 매물 목록 로드
        const fetchSavedProperties = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/user/saved-properties`, {
                    headers: { 'x-user-id': 'temp-user' },
                });
                if (response.ok) {
                    const data = await response.json();
                    const savedSet = new Set<string>(data.savedProperties.map((s: any) => s.articleNo));
                    setSavedArticles(savedSet);
                }
            } catch (error) {
                console.error('Failed to fetch saved properties:', error);
            }
        };

        fetchSavedProperties();

        // 단지 목록 상태 복원 (localStorage에서)
        const savedComplexListState = localStorage.getItem('complexListState');
        if (savedComplexListState) {
            try {
                const state = JSON.parse(savedComplexListState);
                // 복원할 상태들이 있으면 적용
                if (state.complexes && state.complexes.length > 0) {
                    setComplexes(state.complexes);
                    setHasSearched(true);
                    if (state.selectedRegion) {
                        setSelectedRegion(state.selectedRegion);
                    }
                    if (state.selectedTypes) {
                        setSelectedTypes(state.selectedTypes);
                    }
                    if (state.selectedTrade) {
                        setSelectedTrade(state.selectedTrade);
                    }
                }
            } catch (e) {
                console.error('Failed to restore complex list state:', e);
            }
        }
    }, []);

    // 단지 클릭 시 매물 목록 페이지로 이동
    // (페이지에서 직접 API 호출하여 무한 스크롤로 로드)
    const handleComplexClick = (complex: Complex) => {
        // 임시 매물 목록 페이지로 이동 (페이지에서 API 직접 호출)
        const queryParams = new URLSearchParams({
            complexNo: complex.markerId,
            complexName: complex.complexName,
            realEstateType: complex.realEstateTypeCode || 'APT',
        });
        navigate(`/real-estate/apartment-temp-properties?${queryParams.toString()}`);
    };

    const searchArticles = async (pageNum: number = 1) => {
        if (!selectedRegion) return;

        const loading = pageNum === 1 ? setIsLoading : setIsLoadingMore;
        loading(true);

        try {
            const realEstateType = selectedTypes.length > 0 ? selectedTypes.join(':') : '';

            // 아파트/오피스텔은 단지(complexes) API를 먼저 호출
            if (selectedTypes.includes('APT') || selectedTypes.includes('OPST')) {
                const params = new URLSearchParams({
                    cortarNo: selectedRegion.cortarNo,
                    realEstateType: selectedTypes.includes('APT') ? 'APT' : 'OPST',
                    tradeType: selectedTrade,
                    zoom: '15', // 줌 레벨
                });

                const response = await fetch(`${API_BASE}/api/complexes?${params.toString()}`);
                const data = await response.json();

                // 응답이 배열일 수도 있고, complexMarkerList 필드에 있을 수도 있음
                const newComplexes = Array.isArray(data) ? data : (data.complexMarkerList || []);

                // State 업데이트
                setArticles([]); // 단지 모드에서는 매물 비움
                setComplexes(newComplexes);
                setHasMore(false);

                // 단지 목록 상태를 localStorage에 저장 (나중에 복원하기 위해)
                localStorage.setItem('complexListState', JSON.stringify({
                    complexes: newComplexes,
                    selectedRegion,
                    selectedTypes,
                    selectedTrade,
                    timestamp: new Date().toISOString(),
                }));
            } else {
                // 빌라/원룸/상가는 매물(articles) API 직접 호출
                const params = new URLSearchParams({
                    cortarNo: selectedRegion.cortarNo,
                    realEstateType,
                    tradeType: selectedTrade,
                    page: pageNum.toString(),
                });

                if (priceMin > 0) params.append('priceMin', (priceMin * 10000).toString());
                if (priceMax < 1000000) params.append('priceMax', (priceMax * 10000).toString());

                const response = await fetch(`${API_BASE}/api/articles?${params.toString()}`);
                const data = await response.json();

                const newArticles = data.articleList || [];

                if (pageNum === 1) {
                    setArticles(newArticles);
                } else {
                    setArticles(prev => [...prev, ...newArticles]);
                }

                setPage(pageNum);
                setHasMore(data.isMoreData || false);
                setComplexes([]); // 매물 모드에서는 단지 비움
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            loading(false);
        }
    };

    // ============================================
    // Handlers
    // ============================================
    const toggleType = (code: RealEstateTypeCode) => {
        setSelectedTypes(prev =>
            prev.includes(code) ? prev.filter(t => t !== code) : [...prev, code]
        );
    };

    const handleRegionSelect = (region: Region) => {
        setSelectedRegion(region);
        setShowRegionModal(false);
    };

    const handleSearch = () => {
        if (!selectedRegion) {
            setShowRegionModal(true);
            return;
        }
        setHasSearched(true);
        searchArticles(1);
    };

    const handleLoadMore = () => {
        if (isLoadingMore || !hasMore) return;
        searchArticles(page + 1);
    };

    const handleReset = () => {
        setArticles([]);
        setComplexes([]);
        setHasSearched(false);
        setPage(1);
        setHasMore(true);
    };

    const toggleSaveProperty = async (article: Article) => {
        const isSaved = savedArticles.has(article.articleNo);

        try {
            if (isSaved) {
                await fetch(`${API_BASE}/api/user/saved-properties/${article.articleNo}`, {
                    method: 'DELETE',
                    headers: { 'x-user-id': 'temp-user' },
                });
                setSavedArticles(prev => {
                    const next = new Set(prev);
                    next.delete(article.articleNo);
                    return next;
                });
            } else {
                await fetch(`${API_BASE}/api/user/saved-properties`, {
                    method: 'POST',
                    headers: {
                        'x-user-id': 'temp-user',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        articleNo: article.articleNo,
                        cachedName: article.articleName,
                        cachedPrice: parsePriceToNumber(article.dealOrWarrantPrc),
                        cachedType: article.realEstateTypeName,
                        cachedTrade: article.tradeTypeName,
                    }),
                });
                setSavedArticles(prev => new Set(prev).add(article.articleNo));
            }
        } catch (error) {
            console.error('Save property error:', error);
        }
    };

    // ============================================
    // Utilities
    // ============================================
    const formatPrice = (article: Article): string => {
        // dealOrWarrantPrc는 이미 문자열로 "9억 5,000" 형태로 옴
        if (article.tradeTypeCode === 'B2' && article.rentPrc) {
            // 월세
            const deposit = article.dealOrWarrantPrc || '0';
            const monthly = `${article.rentPrc}만`;
            return `${deposit} / ${monthly}`;
        }
        // 매매, 전세 - 이미 포맷된 문자열
        return article.dealOrWarrantPrc || '가격문의';
    };

    const formatDate = (Ymd: string): string => {
        if (!Ymd || Ymd.length !== 8) return '-';
        return `${Ymd.slice(0, 4)}.${Ymd.slice(4, 6)}.${Ymd.slice(6, 8)}`;
    };

    // 가격 문자열을 숫자(만원)로 변환 ("9억 5,000" -> 95000)
    const parsePriceToNumber = (priceStr: string | null): number | null => {
        if (!priceStr) return null;

        // "9억 5,000" 형식 파싱
        const okMatch = priceStr.match(/(\d+)억/);
        const manMatch = priceStr.match(/(\d+(?:,\d+)?)만/);

        let total = 0;
        if (okMatch) {
            total += parseInt(okMatch[1].replace(/,/g, '')) * 10000;
        }
        if (manMatch) {
            total += parseInt(manMatch[1].replace(/,/g, ''));
        }

        return total > 0 ? total : null;
    };

    const getTradeTypeStyle = (code: string) => {
        return TRADE_TYPES.find(t => t.code === code)?.color || 'bg-hud-bg-primary text-hud-text-secondary';
    };

    // ============================================
    // Render
    // ============================================
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-hud-accent-primary/10 rounded-lg">
                        <Building2 className="w-6 h-6 text-hud-accent-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-hud-text-primary">부동산 매물 검색</h1>
                        <p className="text-sm text-hud-text-muted">네이버 부동산 매물을 검색하고 분석하세요</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {hasSearched && (articles.length > 0 || complexes.length > 0) && (
                        <Button
                            variant="secondary"
                            leftIcon={<Map size={18} />}
                            onClick={() => {
                                setShowMapView(true);
                            }}
                        >
                            <span className="hidden sm:inline">지도 보기</span>
                            <span className="sm:hidden">지도</span>
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        leftIcon={<RefreshCw size={18} />}
                        onClick={() => {
                            handleReset();
                            setSelectedRegion(null);
                        }}
                    >
                        <span className="hidden sm:inline">초기화</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
                <Button
                    variant="secondary"
                    fullWidth
                    leftIcon={<SlidersHorizontal size={18} />}
                    rightIcon={<ChevronDown size={18} className={showFilter ? 'rotate-180' : ''} />}
                    onClick={() => setShowFilter(!showFilter)}
                >
                    {showFilter ? '필터 닫기' : '필터 열기'}
                </Button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Filter Sidebar */}
                <div className={`${showFilter ? 'block' : 'hidden'} xl:block xl:col-span-1`}>
                    <HudCard title="검색 조건" subtitle="필터를 설정하세요">
                        <div className="space-y-5">
                            {/* 지역 선택 */}
                            <div>
                                <label className="block text-sm font-medium text-hud-text-secondary mb-2">
                                    <MapPin size={14} className="inline mr-1" />
                                    지역
                                </label>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    rightIcon={selectedRegion ? <X size={14} /> : <ChevronDown size={14} />}
                                    onClick={() => setShowRegionModal(true)}
                                    className="justify-between"
                                >
                                    {selectedRegion ? selectedRegion.cortarName : '지역 선택'}
                                </Button>
                                {selectedRegion && (
                                    <button
                                        onClick={() => setSelectedRegion(null)}
                                        className="mt-2 text-xs text-hud-accent-primary hover:underline"
                                    >
                                        지역 초기화
                                    </button>
                                )}
                            </div>

                            {/* 매물 타입 */}
                            <div>
                                <label className="block text-sm font-medium text-hud-text-secondary mb-2">
                                    <Building2 size={14} className="inline mr-1" />
                                    매물 유형
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {PROPERTY_TYPES.map((type) => (
                                        <button
                                            key={type.code}
                                            onClick={() => toggleType(type.code)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${selectedTypes.includes(type.code)
                                                    ? 'bg-hud-accent-primary/20 border-hud-accent-primary text-hud-accent-primary'
                                                    : 'bg-hud-bg-primary border-hud-border-secondary text-hud-text-secondary hover:bg-hud-bg-hover'
                                                }`}
                                        >
                                            {type.icon}
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 거래 방식 */}
                            <div>
                                <label className="block text-sm font-medium text-hud-text-secondary mb-2">
                                    <ArrowUpDown size={14} className="inline mr-1" />
                                    거래 방식
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {TRADE_TYPES.map((type) => (
                                        <button
                                            key={type.code}
                                            onClick={() => setSelectedTrade(type.code)}
                                            className={`px-3 py-2 text-xs rounded-lg border transition-all ${selectedTrade === type.code
                                                    ? 'bg-hud-accent-primary border-hud-accent-primary text-hud-bg-primary font-medium'
                                                    : 'bg-hud-bg-primary border-hud-border-secondary text-hud-text-secondary hover:bg-hud-bg-hover'
                                                }`}
                                        >
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 가격 범위 */}
                            <div>
                                <label className="block text-sm font-medium text-hud-text-secondary mb-2">
                                    가격 범위 (만원)
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={priceMin || ''}
                                            onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
                                            placeholder="최소"
                                            className="w-full px-3 py-2 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-sm text-hud-text-primary focus:outline-none focus:border-hud-accent-primary"
                                        />
                                    </div>
                                    <span className="text-hud-text-muted">~</span>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={priceMax === 1000000 ? '' : priceMax}
                                            onChange={(e) => setPriceMax(Number(e.target.value) || 1000000)}
                                            placeholder="최대"
                                            className="w-full px-3 py-2 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-sm text-hud-text-primary focus:outline-none focus:border-hud-accent-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 면적 범위 */}
                            <div>
                                <label className="block text-sm font-medium text-hud-text-secondary mb-2">
                                    면적 범위 (㎡)
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={areaMin || ''}
                                            onChange={(e) => setAreaMin(Number(e.target.value) || 0)}
                                            placeholder="최소"
                                            className="w-full px-3 py-2 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-sm text-hud-text-primary focus:outline-none focus:border-hud-accent-primary"
                                        />
                                    </div>
                                    <span className="text-hud-text-muted">~</span>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={areaMax === 200 ? '' : areaMax}
                                            onChange={(e) => setAreaMax(Number(e.target.value) || 200)}
                                            placeholder="최대"
                                            className="w-full px-3 py-2 bg-hud-bg-primary border border-hud-border-secondary rounded-lg text-sm text-hud-text-primary focus:outline-none focus:border-hud-accent-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 검색 버튼 */}
                            <div className="pt-2 space-y-2">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    glow
                                    leftIcon={<Search size={18} />}
                                    onClick={handleSearch}
                                    disabled={isLoading || !selectedRegion}
                                >
                                    {isLoading ? '검색 중...' : '검색하기'}
                                </Button>
                            </div>
                        </div>
                    </HudCard>

                    {/* 요약 카드 - 검색 후 표시 */}
                    {hasSearched && articles.length > 0 && (
                        <HudCard title="검색 결과" subtitle="현재 조건">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-hud-bg-primary rounded-lg">
                                    <span className="text-sm text-hud-text-secondary">총 매물</span>
                                    <span className="text-lg font-bold text-hud-accent-primary">
                                        {articles.length.toLocaleString()}건
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-hud-bg-primary rounded-lg">
                                    <span className="text-sm text-hud-text-secondary">검색 지역</span>
                                    <span className="text-sm font-medium text-hud-text-primary">
                                        {selectedRegion?.cortarName}
                                    </span>
                                </div>
                            </div>
                        </HudCard>
                    )}
                </div>

                {/* Results Area */}
                <div className="xl:col-span-3">
                    <HudCard
                        title={complexes.length > 0 ? "단지 목록" : "매물 목록"}
                        subtitle={selectedRegion ? `${selectedRegion.cortarName} ${hasSearched ? `(${complexes.length > 0 ? complexes.length + '개 단지' : articles.length + '건'})` : ''}` : '지역을 선택하세요'}
                        noPadding
                    >
                        <div className="p-4 sm:p-6">
                            {/* 초기 상태 */}
                            {!hasSearched && !isLoading && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="p-4 bg-hud-bg-primary rounded-full mb-4">
                                        <Search className="w-12 h-12 text-hud-text-muted" />
                                    </div>
                                    <p className="text-lg font-medium text-hud-text-primary">매물을 검색해주세요</p>
                                    <p className="text-sm text-hud-text-muted mt-2">
                                        지역과 필터를 설정하고 검색 버튼을 클릭하세요
                                    </p>
                                </div>
                            )}

                            {/* 로딩 상태 */}
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Loader2 className="w-12 h-12 text-hud-accent-primary animate-spin mb-4" />
                                    <p className="text-sm text-hud-text-muted">매물을 불러오는 중...</p>
                                </div>
                            )}

                            {/* 빈 결과 */}
                            {hasSearched && !isLoading && articles.length === 0 && complexes.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="p-4 bg-hud-bg-primary rounded-full mb-4">
                                        <AlertCircle className="w-12 h-12 text-hud-text-muted" />
                                    </div>
                                    <p className="text-lg font-medium text-hud-text-primary">검색 결과가 없습니다</p>
                                    <p className="text-sm text-hud-text-muted mt-2">검색 조건을 변경해보세요</p>
                                </div>
                            )}

                            {/* 단지 목록 (아파트/오피스텔) */}
                            {complexes.length > 0 && (
                                <>
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-hud-border-secondary">
                                        <span className="text-sm text-hud-text-muted">
                                            단지 <span className="font-bold text-hud-accent-primary">{complexes.length}</span>개
                                        </span>
                                        <span className="text-xs text-hud-text-muted">단지를 선택하면 매물을 볼 수 있습니다</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {complexes.map((complex) => (
                                            <div
                                                key={complex.markerId}
                                                onClick={() => handleComplexClick(complex)}
                                                className="bg-hud-bg-primary border border-hud-border-secondary rounded-lg p-4 hover:border-hud-accent-primary/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-hud-accent-primary/10"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-semibold text-hud-text-primary truncate">
                                                            {complex.complexName}
                                                        </h3>
                                                        <p className="text-xs text-hud-text-muted">{complex.realEstateTypeName}</p>
                                                    </div>
                                                    {complex.totalArticleCount !== undefined && (
                                                        <span className="text-xs bg-hud-accent-primary/20 text-hud-accent-primary px-2 py-1 rounded-full">
                                                            {complex.totalArticleCount}건
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 text-xs text-hud-text-muted">
                                                    {complex.dealCount !== undefined && complex.dealCount > 0 && (
                                                        <span>매매 {complex.dealCount}</span>
                                                    )}
                                                    {complex.leaseCount !== undefined && complex.leaseCount > 0 && (
                                                        <span>전세 {complex.leaseCount}</span>
                                                    )}
                                                    {complex.rentCount !== undefined && complex.rentCount > 0 && (
                                                        <span>월세 {complex.rentCount}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* 매물 목록 - 단지 모드일 때는 숨김 */}
                            {hasSearched && !isLoading && articles.length > 0 && complexes.length === 0 && (
                                <>
                                    {/* 정렬 옵션 */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-hud-border-secondary">
                                        <span className="text-sm text-hud-text-muted">
                                            전체 {articles.length}건
                                        </span>
                                        <div className="flex gap-1">
                                            {SORT_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setSortBy(option.value)}
                                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${sortBy === option.value
                                                            ? 'bg-hud-accent-primary text-hud-bg-primary'
                                                            : 'bg-hud-bg-primary text-hud-text-secondary hover:bg-hud-bg-hover'
                                                        }`}
                                                >
                                                    {option.icon}
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 데스크톱: 테이블 뷰 */}
                                    <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-hud-border-secondary">
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                                        매물 정보
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                                        거래
                                                    </th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                                        가격
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                                        면적
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                                        층수/방향
                                                    </th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium text-hud-text-muted uppercase tracking-wider">
                                                        저장
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {articles.map((article) => (
                                                    <tr
                                                        key={article.articleNo}
                                                        className="border-b border-hud-border-secondary hover:bg-hud-bg-hover transition-hud"
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="max-w-xs">
                                                                <p className="text-sm font-medium text-hud-text-primary truncate">
                                                                    {article.articleName}
                                                                </p>
                                                                {article.buildingName && article.buildingName !== article.articleName && (
                                                                    <p className="text-xs text-hud-text-muted truncate">
                                                                        {article.buildingName}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex px-2 py-1 text-xs rounded ${getTradeTypeStyle(article.tradeTypeCode)}`}>
                                                                {article.tradeTypeName}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="text-sm font-mono font-medium text-hud-accent-primary">
                                                                {formatPrice(article)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-sm text-hud-text-secondary">
                                                                {article.area2 || article.area1}㎡
                                                            </span>
                                                            {article.area2 && (
                                                                <span className="text-xs text-hud-text-muted ml-1">
                                                                    (공급 {article.area1}㎡)
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="text-sm text-hud-text-secondary">
                                                                {article.floorInfo}
                                                                {article.direction && (
                                                                    <span className="text-xs text-hud-text-muted ml-1">
                                                                        ({article.direction})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button
                                                                onClick={() => toggleSaveProperty(article)}
                                                                className="p-2 hover:bg-hud-bg-primary rounded-lg transition-colors"
                                                            >
                                                                {savedArticles.has(article.articleNo) ? (
                                                                    <Heart className="w-5 h-5 text-hud-accent-danger fill-hud-accent-danger" />
                                                                ) : (
                                                                    <HeartOff className="w-5 h-5 text-hud-text-muted" />
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 모바일: 카드 뷰 */}
                                    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {articles.map((article) => (
                                            <div
                                                key={article.articleNo}
                                                className="bg-hud-bg-primary border border-hud-border-secondary rounded-lg p-4 hover:border-hud-accent-primary/50 transition-colors"
                                            >
                                                {/* 헤더: 매물명 + 찜 */}
                                                <div className="flex justify-between items-start gap-2 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-hud-text-primary truncate">
                                                            {article.articleName}
                                                        </h3>
                                                        {article.buildingName && article.buildingName !== article.articleName && (
                                                            <p className="text-xs text-hud-text-muted truncate">
                                                                {article.buildingName}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => toggleSaveProperty(article)}
                                                        className="p-1.5 hover:bg-hud-bg-hover rounded-lg transition-colors flex-shrink-0"
                                                    >
                                                        {savedArticles.has(article.articleNo) ? (
                                                            <Heart className="w-4 h-4 text-hud-accent-danger fill-hud-accent-danger" />
                                                        ) : (
                                                            <HeartOff className="w-4 h-4 text-hud-text-muted" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* 거래 타입 */}
                                                <div className="mb-3">
                                                    <span className={`inline-flex px-2 py-1 text-xs rounded ${getTradeTypeStyle(article.tradeTypeCode)}`}>
                                                        {article.tradeTypeName}
                                                    </span>
                                                    <span className="ml-2 text-xs text-hud-text-muted">
                                                        {article.realEstateTypeName}
                                                    </span>
                                                </div>

                                                {/* 가격 */}
                                                <div className="mb-3 p-3 bg-hud-bg-secondary rounded-lg">
                                                    <p className="text-lg font-bold text-hud-accent-primary">
                                                        {formatPrice(article)}
                                                    </p>
                                                </div>

                                                {/* 상세 정보 */}
                                                <div className="space-y-1.5 text-xs text-hud-text-secondary">
                                                    <div className="flex justify-between">
                                                        <span>면적</span>
                                                        <span className="text-hud-text-primary">
                                                            {article.area2 || article.area1}㎡
                                                            {article.area2 && <span className="text-hud-text-muted"> (공급 {article.area1}㎡)</span>}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>층수</span>
                                                        <span className="text-hud-text-primary">
                                                            {article.floorInfo}
                                                            {article.direction && <span className="text-hud-text-muted"> ({article.direction})</span>}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>확정일</span>
                                                        <span className="text-hud-text-primary">{formatDate(article.articleConfirmYmd)}</span>
                                                    </div>
                                                </div>

                                                {/* 태그 */}
                                                {article.tagList && article.tagList.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-1">
                                                        {article.tagList.slice(0, 3).map((tag, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-hud-bg-hover text-hud-text-muted text-xs rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* 더보기 버튼 */}
                                    {hasMore && (
                                        <div className="mt-6 flex justify-center">
                                            <Button
                                                variant="secondary"
                                                leftIcon={isLoadingMore ? <Loader2 size={18} className="animate-spin" /> : <ChevronDown size={18} />}
                                                onClick={handleLoadMore}
                                                disabled={isLoadingMore}
                                            >
                                                {isLoadingMore ? '불러오는 중...' : '더 보기'}
                                            </Button>
                                        </div>
                                    )}

                                    {/* 마지막 페이지 안내 */}
                                    {!hasMore && articles.length > 0 && (
                                        <div className="mt-6 text-center text-sm text-hud-text-muted pb-4">
                                            더 이상 매물이 없습니다
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </HudCard>
                </div>
            </div>

            {/* 지역 선택 모달 */}
            <RegionSelectorModal
                isOpen={showRegionModal}
                onClose={() => setShowRegionModal(false)}
                onSelect={handleRegionSelect}
            />

            {/* 지도 뷰 */}
            {showMapView && (
                <PropertyMapView
                    properties={articles
                        .filter(a => a.latitude && a.longitude)
                        .map(a => ({
                            articleNo: a.articleNo,
                            articleName: a.articleName,
                            latitude: parseFloat(a.latitude!),
                            longitude: parseFloat(a.longitude!),
                            dealOrWarrantPrc: a.dealOrWarrantPrc,
                            realEstateTypeName: a.realEstateTypeName,
                            tradeTypeName: a.tradeTypeName,
                            tradeTypeCode: a.tradeTypeCode,
                            area1: a.area1?.toString(),
                            buildingName: a.buildingName,
                        }))}
                    complexes={complexes
                        .filter(c => c.latitude && c.longitude)
                        .map(c => ({
                            markerId: c.markerId,
                            complexName: c.complexName,
                            latitude: parseFloat(c.latitude!.toString()),
                            longitude: parseFloat(c.longitude!.toString()),
                            realEstateTypeName: c.realEstateTypeName,
                            realEstateTypeCode: c.realEstateTypeCode,
                            dealCount: c.dealCount,
                            leaseCount: c.leaseCount,
                            rentCount: c.rentCount,
                            totalArticleCount: c.totalArticleCount,
                        }))}
                    selectedProperty={selectedMapProperty ? {
                        articleNo: selectedMapProperty.articleNo,
                        articleName: selectedMapProperty.articleName,
                        latitude: parseFloat(selectedMapProperty.latitude || '0'),
                        longitude: parseFloat(selectedMapProperty.longitude || '0'),
                        dealOrWarrantPrc: selectedMapProperty.dealOrWarrantPrc,
                        realEstateTypeName: selectedMapProperty.realEstateTypeName,
                        tradeTypeName: selectedMapProperty.tradeTypeName,
                        tradeTypeCode: selectedMapProperty.tradeTypeCode,
                        area1: selectedMapProperty.area1?.toString(),
                        buildingName: selectedMapProperty.buildingName,
                    } : null}
                    onPropertySelect={(prop) => {
                        if (prop) {
                            const matchingArticle = articles.find(a => a.articleNo === prop.articleNo);
                            if (matchingArticle) {
                                setSelectedMapProperty(matchingArticle);
                            }
                        } else {
                            setSelectedMapProperty(null);
                        }
                    }}
                    onClose={() => {
                        setShowMapView(false);
                        setSelectedMapProperty(null);
                    }}
                    onComplexClick={handleComplexClick}
                />
            )}
        </div>
    );
};

export default RealEstate;
