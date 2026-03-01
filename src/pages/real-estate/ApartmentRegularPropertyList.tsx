// ============================================
// 정규 매물 목록 페이지
// 서버 DB에서 저장한 매물 목록 조회 (그리드 형식)
// ============================================

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Building2,
  Filter,
  Home,
  Loader2,
} from 'lucide-react';
import HudCard from '../../components/common/HudCard';
import Button from '../../components/common/Button';
import ExcelExportModal, { EXPORT_FIELDS, ExportFieldKey } from '../../components/real-estate/ExcelExportModal';
import type { Article } from '../../types/naver-land';

const ITEMS_PER_PAGE = 50;
import { API_BASE } from '../../lib/api';

// 정규 매물 타입
interface RegularArticle extends Article {
  id: string;
  complexNo?: string;
  complexName?: string;
  savedAt: string; // 저장된 시간
}

// 서버에서 받은 매물 타입
interface SavedPropertyFromServer {
  articleNo: string;
  complexNo?: string;
  complexName?: string;
  cachedName: string;
  cachedPrice: string;
  cachedType: string;
  cachedTrade: string;
  articleData: string | null;
  createdAt: string;
  updatedAt: string;
}

const ApartmentRegularPropertyList = () => {
  const navigate = useNavigate();

  // 상태
  const [articles, setArticles] = useState<RegularArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 정렬 상태
  const [sortField, setSortField] = useState<'savedAt' | 'price' | 'area' | 'complex'>('savedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 필터 상태
  const [filterComplex, setFilterComplex] = useState('');
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<Set<string>>(new Set());
  const [selectedTradeType, setSelectedTradeType] = useState<string>(''); // '' = 전체

  // 매물 유형 정의 (네이버 부동산 기준)
  const PROPERTY_TYPES = [
    { code: 'APT', label: '아파트' },
    { code: 'OPST', label: '오피스텔' },
    { code: 'VL', label: '빌라' },
    { code: 'ONEROOM', label: '원룸' },
    { code: 'TWOROOM', label: '투룸' },
    { code: 'SG', label: '상가' },
    { code: 'DDDGG', label: '단독/다가구' },
  ];

  // 서버에서 정규 매물 로드
  useEffect(() => {
    loadRegularArticles();
  }, []);

  const loadRegularArticles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/user/saved-properties`);

      if (!response.ok) {
        throw new Error('서버 조회 실패');
      }

      const data = await response.json();
      const savedProperties: SavedPropertyFromServer[] = data.savedProperties || [];

      // 서버 데이터를 RegularArticle 형식으로 변환
      const convertedArticles: RegularArticle[] = savedProperties.map((prop) => {
        // articleData JSON 파싱
        let articleData: Article | null = null;
        if (prop.articleData) {
          try {
            articleData = JSON.parse(prop.articleData);
          } catch (e) {
            console.warn('articleData 파싱 실패:', prop.articleNo);
          }
        }

        return {
          ...(articleData || {}),
          id: prop.articleNo,
          articleNo: prop.articleNo,
          complexNo: prop.complexNo,
          complexName: prop.complexName || prop.cachedName,
          savedAt: prop.createdAt,
          // articleData가 없으면 캐시된 데이터 사용
          articleName: articleData?.articleName || prop.cachedName,
          dealOrWarrantPrc: articleData?.dealOrWarrantPrc || prop.cachedPrice,
          tradeTypeName: articleData?.tradeTypeName || prop.cachedTrade,
          realEstateTypeName: articleData?.realEstateTypeName || prop.cachedType,
        } as RegularArticle;
      });

      setArticles(convertedArticles);
    } catch (apiError) {
      console.error('API 호출 실패:', apiError);
      setError('매물을 불러오는데 실패했습니다.');
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 정렬 및 필터링된 매물 목록
  const processedArticles = useMemo(() => {
    let processed = [...articles];

    // 매물 유형 필터
    if (selectedPropertyTypes.size > 0) {
      processed = processed.filter((a) => {
        const realEstateType = a.realEstateTypeCode || '';
        return selectedPropertyTypes.has(realEstateType);
      });
    }

    // 거래 유형 필터
    if (selectedTradeType) {
      processed = processed.filter((a) => a.tradeTypeCode === selectedTradeType);
    }

    // 단지명 필터
    if (filterComplex) {
      processed = processed.filter(
        (a) =>
          (a.complexName && a.complexName.toLowerCase().includes(filterComplex.toLowerCase())) ||
          (a.buildingName && a.buildingName.toLowerCase().includes(filterComplex.toLowerCase()))
      );
    }

    // 정렬
    processed.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'savedAt':
          comparison = a.savedAt.localeCompare(b.savedAt);
          break;
        case 'price':
          const parsePriceToMan = (prc: string | undefined): number => {
            if (!prc) return 0;
            let total = 0;
            const okMatch = prc.match(/(\d+)억/);
            if (okMatch) total += parseInt(okMatch[1]) * 10000;
            const remaining = prc.replace(/\d+억\s*/, '');
            const numPart = parseInt(remaining.replace(/,/g, ''));
            if (!isNaN(numPart)) total += numPart;
            return total;
          };
          const priceA = parsePriceToMan(a.dealOrWarrantPrc);
          const priceB = parsePriceToMan(b.dealOrWarrantPrc);
          comparison = priceA - priceB;
          break;
        case 'area':
          const areaA = a.area1 || 0;
          const areaB = b.area1 || 0;
          comparison = areaA - areaB;
          break;
        case 'complex':
          const nameA = a.complexName || a.buildingName || '';
          const nameB = b.complexName || b.buildingName || '';
          comparison = nameA.localeCompare(nameB, 'ko');
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return processed;
  }, [articles, selectedPropertyTypes, selectedTradeType, filterComplex, sortField, sortOrder]);

  // 페이징 처리
  const totalPages = Math.ceil(processedArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = processedArticles.slice(startIndex, endIndex);

  // 전체 선택 토글 (현재 페이지만)
  const toggleSelectAll = () => {
    const currentPageIds = new Set(currentArticles.map((a) => a.id));
    const allSelected = currentPageIds.size > 0 && [...currentPageIds].every((id) => selectedItems.has(id));

    if (allSelected) {
      const newSelected = new Set(selectedItems);
      currentPageIds.forEach((id) => newSelected.delete(id));
      setSelectedItems(newSelected);
    } else {
      setSelectedItems(new Set([...selectedItems, ...currentPageIds]));
    }
  };

  // 개별 선택 토글
  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // 현재 페이지가 모두 선택되었는지 확인
  const isCurrentPageAllSelected =
    currentArticles.length > 0 && currentArticles.every((a) => selectedItems.has(a.id));

  // 개별 삭제 (서버 API 호출)
  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/user/saved-properties/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 로컬 상태에서 제거
        const updated = articles.filter((a) => a.id !== id);
        setArticles(updated);

        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 선택된 항목 일괄 삭제 (서버 API 호출)
  const deleteSelected = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`${selectedItems.size}개 매물을 삭제하시겠습니까?`)) return;

    try {
      const articleNos = Array.from(selectedItems);
      const response = await fetch(`${API_BASE}/api/user/saved-properties`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleNos }),
      });

      if (response.ok) {
        const result = await response.json();
        // 로컬 상태에서 제거
        const updated = articles.filter((a) => !selectedItems.has(a.id));
        setArticles(updated);
        setSelectedItems(new Set());

        // 페이지 조정
        const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('일괄 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 전체 삭제
  const deleteAll = async () => {
    if (articles.length === 0) return;
    if (!confirm(`정말로 전체 ${articles.length}개 매물을 모두 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;

    try {
      const articleNos = articles.map((a) => a.id);
      const response = await fetch(`${API_BASE}/api/user/saved-properties`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleNos }),
      });

      if (response.ok) {
        setArticles([]);
        setSelectedItems(new Set());
        setCurrentPage(1);
      } else {
        alert('전체 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('전체 삭제 실패:', error);
      alert('전체 삭제에 실패했습니다.');
    }
  };

  // 엑셀 다운로드
  const handleExport = async (fields: ExportFieldKey[]) => {
    const selectedData = selectedItems.size > 0
      ? articles.filter((a) => selectedItems.has(a.id))
      : articles;

    if (selectedData.length === 0) {
      alert('내보낼 매물이 없습니다.');
      return;
    }

    // CSV 헤더
    const selectedFieldsConfig = EXPORT_FIELDS.filter((f) => fields.includes(f.key));
    const headers = ['저장일시', ...selectedFieldsConfig.map((f) => f.label)];

    // CSV 데이터 생성
    const formatCellValue = (value: any): string => {
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) return `"${value.join(', ')}"`;
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = [
      headers.join(','),
      ...selectedData.map((article) => {
        const savedAtFormatted = new Date(article.savedAt).toLocaleString('ko-KR');
        const fieldValues = selectedFieldsConfig.map((fieldConfig) => {
          let value: any;

          switch (fieldConfig.key) {
            case 'articleName':
              value = article.articleName || article.buildingName || '';
              break;
            case 'dealOrWarrantPrc':
              value = article.dealOrWarrantPrc || '';
              break;
            case 'rentPrc':
              value = article.rentPrc || '';
              break;
            case 'area1':
              value = article.area1 || '';
              break;
            case 'area2':
              value = article.area2 || '';
              break;
            case 'floorInfo':
              value = article.floorInfo || '';
              break;
            case 'direction':
              value = article.direction || '';
              break;
            case 'articleConfirmYmd':
              value = article.articleConfirmYmd
                ? article.articleConfirmYmd.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
                : '';
              break;
            case 'buildingName':
              value = article.buildingName || '';
              break;
            case 'detailAddress':
              value = article.detailAddress || '';
              break;
            case 'articleFeatureDesc':
              value = article.articleFeatureDesc || '';
              break;
            case 'tagList':
              value = article.tagList || [];
              break;
            case 'cpName':
              value = article.cpName || '';
              break;
            case 'realtorName':
              value = article.realtorName || '';
              break;
            case 'latitude':
              value = article.latitude || '';
              break;
            case 'longitude':
              value = article.longitude || '';
              break;
            default:
              value = article[fieldConfig.key as keyof Article] || '';
          }

          return formatCellValue(value);
        });
        return [formatCellValue(savedAtFormatted), ...fieldValues].join(',');
      }),
    ];

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `정규매물_${dateStr}.csv`;
    link.click();

    return Promise.resolve();
  };

  // 포맷 함수
  // 포맷 함수 (정확학 파싱)
  const formatPrice = (priceStr: string | null) => {
    if (!priceStr) return '-';

    if (priceStr.includes('억')) {
      return priceStr;
    }

    const num = parseInt(priceStr.replace(/,/g, ''));
    if (isNaN(num)) return priceStr;

    if (num >= 10000) {
      const uk = Math.floor(num / 10000);
      const man = num % 10000;
      return man > 0 ? `${uk}억 ${man.toLocaleString()}` : `${uk}억`;
    }
    return `${num.toLocaleString()}`;
  };

  const parseFloor = (floorInfo: string) => {
    if (!floorInfo) return '-';
    return floorInfo;
  };

  // 정렬 핸들러
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 통계
  const stats = useMemo(() => {
    const byTradeType = articles.reduce((acc, a) => {
      acc[a.tradeTypeName] = (acc[a.tradeTypeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byComplex = articles.reduce((acc, a) => {
      const key = a.complexName || a.buildingName || '기타';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 매물 유형별 집계
    const byPropertyType = articles.reduce((acc, a) => {
      const typeCode = a.realEstateTypeCode || 'unknown';
      const typeLabel = PROPERTY_TYPES.find((t) => t.code === typeCode)?.label || '기타';
      acc[typeLabel] = (acc[typeLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCount: articles.length,
      byTradeType,
      uniqueComplexes: Object.keys(byComplex).length,
      byPropertyType,
    };
  }, [articles]);

  return (
    <div className="p-4">
      {/* 헤더 */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/real-estate')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              단지 목록
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-hud-text-primary">
                정규 매물 목록
              </h1>
              <div className="flex items-center gap-2 mt-0.5 text-xs sm:text-sm text-hud-text-muted">
                <span>총 {stats.totalCount}건</span>
                <span>·</span>
                <span>{stats.uniqueComplexes}개 단지</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteSelected}
              disabled={selectedItems.size === 0}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              선택 삭제 ({selectedItems.size})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteAll}
              disabled={articles.length === 0}
              className="text-hud-accent-danger hover:text-hud-accent-danger"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              전체 삭제
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="w-4 h-4 mr-1" />
              엑셀 다운로드
            </Button>
          </div>
        </div>
      </div>

      {/* 매물 유형 + 거래 유형 필터 */}
      <div className="mb-4 p-3 bg-hud-bg-secondary border border-hud-border-secondary rounded-lg space-y-3">
        {/* 매물 유형 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-hud-text-secondary font-medium min-w-[70px]">매물 유형:</span>
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setSelectedPropertyTypes(new Set())}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedPropertyTypes.size === 0
                ? 'bg-hud-accent-primary text-white'
                : 'bg-hud-bg-tertiary text-hud-text-secondary hover:bg-hud-bg-hover'
                }`}
            >
              전체
            </button>
            {PROPERTY_TYPES.map((type) => {
              const isSelected = selectedPropertyTypes.has(type.code);
              return (
                <button
                  key={type.code}
                  onClick={() => {
                    const newTypes = new Set(selectedPropertyTypes);
                    if (isSelected) {
                      newTypes.delete(type.code);
                    } else {
                      newTypes.add(type.code);
                    }
                    setSelectedPropertyTypes(newTypes);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isSelected
                    ? 'bg-hud-accent-primary text-white'
                    : 'bg-hud-bg-tertiary text-hud-text-secondary hover:bg-hud-bg-hover'
                    }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 거래 유형 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-hud-text-secondary font-medium min-w-[70px]">거래 유형:</span>
          <div className="flex gap-1">
            {[
              { code: '', label: '전체' },
              { code: 'A1', label: '매매' },
              { code: 'B1', label: '전세' },
              { code: 'B2', label: '월세' },
            ].map((type) => (
              <button
                key={type.code}
                onClick={() => {
                  setSelectedTradeType(type.code);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedTradeType === type.code
                  ? 'bg-hud-accent-primary text-white'
                  : 'bg-hud-bg-tertiary text-hud-text-secondary hover:bg-hud-bg-hover'
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <HudCard className="p-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-hud-accent-primary">{stats.totalCount}</p>
            <p className="text-xs text-hud-text-muted">전체 매물</p>
          </div>
        </HudCard>
        <HudCard className="p-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-hud-accent-info">{stats.byTradeType['매매'] || 0}</p>
            <p className="text-xs text-hud-text-muted">매매</p>
          </div>
        </HudCard>
        <HudCard className="p-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-hud-accent-success">{stats.byTradeType['전세'] || 0}</p>
            <p className="text-xs text-hud-text-muted">전세</p>
          </div>
        </HudCard>
        <HudCard className="p-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-hud-accent-warning">{stats.byTradeType['월세'] || 0}</p>
            <p className="text-xs text-hud-text-muted">월세</p>
          </div>
        </HudCard>
      </div>

      {/* 필터 & 정렬 바 */}
      <HudCard className="mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-hud-text-muted" />
            <span className="text-sm text-hud-text-secondary">정렬:</span>
            <div className="flex gap-1">
              {[
                { field: 'savedAt' as const, label: '저장일' },
                { field: 'complex' as const, label: '단지명' },
                { field: 'price' as const, label: '가격' },
                { field: 'area' as const, label: '면적' },
              ].map((item) => (
                <button
                  key={item.field}
                  onClick={() => handleSort(item.field)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${sortField === item.field
                    ? 'bg-hud-accent-primary text-white'
                    : 'bg-hud-bg-secondary text-hud-text-secondary hover:bg-hud-bg-hover'
                    }`}
                >
                  {item.label}
                  {sortField === item.field && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="단지명 검색..."
              value={filterComplex}
              onChange={(e) => setFilterComplex(e.target.value)}
              className="px-3 py-1.5 bg-hud-bg-secondary border border-hud-border-secondary rounded-lg text-sm text-hud-text-primary placeholder:text-hud-text-muted focus:outline-none focus:border-hud-accent-primary"
            />
            <span className="text-sm text-hud-text-muted whitespace-nowrap">
              선택: {selectedItems.size}건
            </span>
          </div>
        </div>
      </HudCard>

      {/* 그리드 테이블 */}
      <HudCard noPadding className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-hud-accent-primary animate-spin" />
              <p className="text-sm text-hud-text-muted">매물을 불러오는 중...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <Home className="w-16 h-16 mx-auto mb-4 text-hud-accent-danger" />
            <p className="text-hud-text-danger">{error}</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={loadRegularArticles}
            >
              다시 시도
            </Button>
          </div>
        ) : processedArticles.length === 0 ? (
          <div className="p-12 text-center">
            <Home className="w-16 h-16 mx-auto mb-4 text-hud-text-muted" />
            <p className="text-hud-text-muted">정규 매물이 없습니다.</p>
            <p className="text-sm text-hud-text-muted mt-1">임시 매물 목록에서 매물을 저장해주세요.</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/real-estate')}
            >
              단지 목록으로 이동
            </Button>
          </div>
        ) : (
          <>
            <div className="min-w-[900px]">
              {/* 테이블 헤더 */}
              <div className="grid grid-cols-12 gap-0 px-4 py-3 bg-hud-bg-secondary border-b border-hud-border-secondary text-sm font-medium text-hud-text-primary">
                <div className="col-span-1 flex items-center border-r border-hud-border-secondary pr-2">
                  <button
                    onClick={toggleSelectAll}
                    className="p-1 hover:bg-hud-bg-hover rounded"
                    title={isCurrentPageAllSelected ? '전체 해제' : '전체 선택'}
                  >
                    {isCurrentPageAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-hud-accent-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-hud-text-muted" />
                    )}
                  </button>
                </div>
                <div className="col-span-2 px-2 border-r border-hud-border-secondary">단지명/매물명</div>
                <div className="col-span-1 px-2 border-r border-hud-border-secondary">매물유형</div>
                <div className="col-span-1 px-2 border-r border-hud-border-secondary">거래</div>
                <div className="col-span-1 px-2 border-r border-hud-border-secondary cursor-pointer hover:text-hud-accent-primary" onClick={() => handleSort('price')}>
                  가격 {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="col-span-1 px-2 border-r border-hud-border-secondary">월세</div>
                <div className="col-span-1 px-2 border-r border-hud-border-secondary">면적</div>
                <div className="col-span-1 px-2 border-r border-hud-border-secondary">층</div>
                <div className="col-span-1 px-2 border-r border-hud-border-secondary">저장일시</div>
                <div className="col-span-1 px-2">관리</div>
              </div>

              {/* 테이블 바디 */}
              <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                {currentArticles.map((article) => (
                  <div
                    key={article.id}
                    className={`grid grid-cols-12 gap-0 px-4 py-3 border-b border-hud-border-secondary text-sm hover:bg-hud-bg-hover/50 transition-colors ${selectedItems.has(article.id) ? 'bg-hud-accent-primary/10' : 'bg-hud-bg-primary'
                      }`}
                  >
                    <div className="col-span-1 flex items-center border-r border-hud-border-secondary px-2">
                      <button
                        onClick={() => toggleSelectItem(article.id)}
                        className="p-1 hover:bg-hud-bg-hover rounded"
                      >
                        {selectedItems.has(article.id) ? (
                          <CheckSquare className="w-4 h-4 text-hud-accent-primary" />
                        ) : (
                          <Square className="w-4 h-4 text-hud-text-muted" />
                        )}
                      </button>
                    </div>
                    <div className="col-span-2 px-2 border-r border-hud-border-secondary">
                      <p className="truncate text-hud-text-primary" title={article.complexName || article.buildingName}>
                        {article.complexName || article.buildingName || '-'}
                      </p>
                      <p className="text-xs text-hud-text-muted truncate" title={article.articleName}>
                        {article.articleName}
                      </p>
                    </div>
                    <div className="col-span-1 px-2 border-r border-hud-border-secondary">
                      <span className="text-xs text-hud-text-secondary">
                        {PROPERTY_TYPES.find((t) => t.code === article.realEstateTypeCode)?.label || article.realEstateTypeName || '-'}
                      </span>
                    </div>
                    <div className="col-span-1 px-2 border-r border-hud-border-secondary">
                      <span className={`inline-flex px-1.5 py-0.5 text-xs rounded ${article.tradeTypeCode === 'A1'
                        ? 'bg-red-100 text-red-700'
                        : article.tradeTypeCode === 'B1'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {article.tradeTypeName}
                      </span>
                    </div>
                    <div className="col-span-1 px-2 border-r border-hud-border-secondary text-hud-accent-primary font-medium">
                      {formatPrice(article.dealOrWarrantPrc)}
                    </div>
                    <div className="col-span-1 px-2 border-r border-hud-border-secondary text-hud-text-secondary">
                      {article.rentPrc ? `${article.rentPrc}만` : '-'}
                    </div>
                    <div className="col-span-1 px-2 border-r border-hud-border-secondary text-hud-text-secondary">
                      <span>{article.area1 || '-'}㎡</span>
                    </div>
                    <div className="col-span-1 px-2 border-r border-hud-border-secondary text-hud-text-secondary">
                      {parseFloor(article.floorInfo)}
                    </div>
                    <div className="col-span-1 px-2 border-r border-hud-border-secondary text-hud-text-secondary text-xs">
                      {new Date(article.savedAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="col-span-1 px-2 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem(article.id)}
                        className="p-1 text-hud-text-muted hover:text-hud-accent-danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이징 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-hud-bg-secondary border-t border-hud-border-secondary">
                  <div className="text-sm text-hud-text-muted">
                    {startIndex + 1}-{Math.min(endIndex, processedArticles.length)} / {processedArticles.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-hud-text-primary px-3">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </HudCard>

      {/* 엑셀 다운로드 모달 */}
      <ExcelExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        title="정규 매물 엑셀 다운로드"
        totalCount={selectedItems.size > 0 ? selectedItems.size : processedArticles.length}
      />
    </div>
  );
};

export default ApartmentRegularPropertyList;
