// ============================================
// 매물 검색 필터 컴포넌트 (반응형)
// ============================================

import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  MapPin,
  Building2,
  DollarSign,
  Maximize,
} from 'lucide-react';
import type { RealEstateTypeCode, TradeTypeCode } from '../../types/naver-land';
import {
  PROPERTY_CATEGORIES,
  TRADE_TYPES,
  SORT_OPTIONS,
} from '../../types/naver-land';

interface PropertyFilterProps {
  selectedRegion?: string;
  selectedRegionName?: string;
  realEstateTypes: RealEstateTypeCode[];
  tradeTypes: TradeTypeCode[];
  sortBy: 'rank' | 'prcDesc' | 'prcAsc' | 'areaDesc' | 'areaAsc';
  priceMin: number;
  priceMax: number;
  onRegionChange?: (region: { cortarNo: string; cortarName: string }) => void;
  onRealEstateTypeChange: (types: RealEstateTypeCode[]) => void;
  onTradeTypeChange: (types: TradeTypeCode[]) => void;
  onSortChange: (sort: 'rank' | 'prcDesc' | 'prcAsc' | 'areaDesc' | 'areaAsc') => void;
  onPriceChange: (min: number, max: number) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  selectedRegion,
  selectedRegionName,
  realEstateTypes,
  tradeTypes,
  sortBy,
  priceMin,
  priceMax,
  onRegionChange,
  onRealEstateTypeChange,
  onTradeTypeChange,
  onSortChange,
  onPriceChange,
  onSearch,
  onReset,
  isLoading = false,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleRealEstateTypeToggle = (type: RealEstateTypeCode) => {
    if (realEstateTypes.includes(type)) {
      onRealEstateTypeChange(realEstateTypes.filter((t) => t !== type));
    } else {
      onRealEstateTypeChange([...realEstateTypes, type]);
    }
  };

  const handleTradeTypeToggle = (type: TradeTypeCode) => {
    if (tradeTypes.includes(type)) {
      onTradeTypeChange(tradeTypes.filter((t) => t !== type));
    } else {
      onTradeTypeChange([...tradeTypes, type]);
    }
  };

  const isRealEstateTypeSelected = (category: typeof PROPERTY_CATEGORIES[keyof typeof PROPERTY_CATEGORIES]) => {
    return category.code.some((code) => realEstateTypes.includes(code));
  };

  const isTradeTypeSelected = (code: TradeTypeCode) => {
    return tradeTypes.includes(code);
  };

  return (
    <div className="bg-hud-bg-primary rounded-xl shadow-sm border border-hud-border-secondary">
      {/* 모바일 필터 토글 버튼 */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-hud-border-secondary">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-hud-accent-primary" />
          <span className="font-medium text-hud-text-primary">
            {selectedRegionName || '지역을 선택해주세요'}
          </span>
        </div>
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-hud-text-secondary bg-hud-bg-secondary rounded-lg hover:bg-hud-bg-hover transition-colors"
        >
          <Filter className="w-4 h-4" />
          필터
        </button>
      </div>

      {/* 필터 컨텐츠 */}
      <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block p-4 lg:p-6`}>
        {/* 지역 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-hud-text-secondary mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              지역
            </div>
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedRegionName || ''}
              placeholder="지역을 검색해주세요"
              className="w-full px-4 py-2.5 pr-10 border border-hud-border-secondary rounded-lg focus:ring-2 focus:ring-hud-accent-primary focus:border-hud-accent-primary bg-hud-bg-primary text-hud-text-primary"
              readOnly
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hud-text-muted" />
          </div>
        </div>

        {/* 매물 유형 - 카테고리별 그룹 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-hud-text-secondary mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              매물 유형
            </div>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.values(PROPERTY_CATEGORIES).map((category) => {
              const isSelected = isRealEstateTypeSelected(category);
              return (
                <div key={category.name} className="space-y-1.5">
                  <button
                    onClick={() => {
                      // 카테고리 전체 선택/해제
                      if (isSelected) {
                        onRealEstateTypeChange(
                          realEstateTypes.filter((t) => !category.code.includes(t))
                        );
                      } else {
                        onRealEstateTypeChange([
                          ...new Set([...realEstateTypes, ...category.code]),
                        ]);
                      }
                    }}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-lg border transition-colors text-left ${
                      isSelected
                        ? 'bg-hud-accent-primary/20 border-hud-accent-primary text-hud-accent-primary'
                        : 'bg-hud-bg-primary border-hud-border-secondary text-hud-text-secondary hover:bg-hud-bg-hover'
                    }`}
                  >
                    {category.name}
                  </button>
                  {/* 세부 유형 체크박스 */}
                  <div className="pl-2 space-y-1">
                    {category.subTypes.map((subType) => (
                      <label
                        key={subType.code}
                        className="flex items-center gap-2 text-sm text-hud-text-secondary cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={realEstateTypes.includes(subType.code)}
                          onChange={() => handleRealEstateTypeToggle(subType.code)}
                          className="w-3.5 h-3.5 rounded border-hud-border-secondary text-hud-accent-primary focus:ring-hud-accent-primary"
                        />
                        {subType.name}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 거래 방식 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-hud-text-secondary mb-2">
            거래 방식
          </label>
          <div className="flex flex-wrap gap-2">
            {TRADE_TYPES.map((type) => (
              <button
                key={type.code}
                onClick={() => handleTradeTypeToggle(type.code)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  isTradeTypeSelected(type.code)
                    ? 'bg-hud-accent-primary border-hud-accent-primary text-white'
                    : 'bg-hud-bg-primary border-hud-border-secondary text-hud-text-secondary hover:bg-hud-bg-hover'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* 가격 범위 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-hud-text-secondary mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              가격 범위 (만원)
            </div>
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <input
                type="number"
                value={priceMin === 0 ? '' : priceMin / 10000}
                onChange={(e) =>
                  onPriceChange(
                    (parseInt(e.target.value) || 0) * 10000,
                    priceMax
                  )
                }
                placeholder="최소 가격"
                className="w-full px-4 py-2 border border-hud-border-secondary rounded-lg focus:ring-2 focus:ring-hud-accent-primary focus:border-hud-accent-primary bg-hud-bg-primary text-hud-text-primary"
              />
            </div>
            <span className="text-hud-text-muted">~</span>
            <div className="flex-1 w-full">
              <input
                type="number"
                value={priceMax === 900000000 ? '' : priceMax / 10000}
                onChange={(e) =>
                  onPriceChange(
                    priceMin,
                    (parseInt(e.target.value) || 90000) * 10000
                  )
                }
                placeholder="최대 가격"
                className="w-full px-4 py-2 border border-hud-border-secondary rounded-lg focus:ring-2 focus:ring-hud-accent-primary focus:border-hud-accent-primary bg-hud-bg-primary text-hud-text-primary"
              />
            </div>
            <span className="text-sm text-hud-text-muted whitespace-nowrap">만원</span>
          </div>
        </div>

        {/* 정렬 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-hud-text-secondary mb-2">
            정렬
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'rank' | 'prcDesc' | 'prcAsc' | 'areaDesc' | 'areaAsc')}
              className="w-full px-4 py-2.5 pr-10 border border-hud-border-secondary rounded-lg appearance-none focus:ring-2 focus:ring-hud-accent-primary focus:border-hud-accent-primary bg-hud-bg-primary text-hud-text-primary"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hud-text-muted pointer-events-none" />
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-hud-border-secondary">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-hud-text-secondary bg-hud-bg-primary border border-hud-border-secondary rounded-lg hover:bg-hud-bg-hover transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <X className="w-4 h-4" />
              초기화
            </div>
          </button>
          <button
            onClick={() => {
              onSearch();
              setIsMobileFilterOpen(false);
            }}
            disabled={isLoading || !selectedRegion}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-hud-accent-primary rounded-lg hover:bg-hud-accent-primary/80 disabled:bg-hud-bg-disabled disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              {isLoading ? '검색 중...' : '매물 검색'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
