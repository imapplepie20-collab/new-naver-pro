// ============================================
// 네이버 부동산 상태 관리 스토어
// ============================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  Article,
  RealEstateTypeCode,
  TradeTypeCode,
  PropertyFilter,
} from '../types/naver-land';

// 지역 정보 타입
export interface Region {
  cortarNo: string;
  cortarName: string;
  cortarType: string;
  centerLat?: number;
  centerLon?: number;
  children?: Region[];
}

// 필터 상태 타입
interface FilterState {
  cortarNo: string;
  cortarName: string;
  realEstateTypes: RealEstateTypeCode[];
  tradeTypes: TradeTypeCode[];
  priceMin: number;
  priceMax: number;
  rentPriceMin: number;
  rentPriceMax: number;
  areaMin: number;
  areaMax: number;
  sortBy: 'rank' | 'prcDesc' | 'prcAsc' | 'areaDesc' | 'areaAsc';
}

interface RealEstateState {
  // 데이터
  regions: Region[];
  articles: Article[];
  selectedRegion: Region | null;

  // 로딩 상태
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // 페이지네이션
  currentPage: number;
  totalPage: number;
  isMoreData: boolean;

  // 필터
  filters: FilterState;

  // 액션 - 지역
  setRegions: (regions: Region[]) => void;
  setSelectedRegion: (region: Region | null) => void;

  // 액션 - 매물
  setArticles: (articles: Article[]) => void;
  appendArticles: (articles: Article[]) => void;
  clearArticles: () => void;

  // 액션 - 로딩/에러
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;

  // 액션 - 페이지네이션
  setCurrentPage: (page: number) => void;
  setTotalPage: (total: number) => void;
  setIsMoreData: (more: boolean) => void;

  // 액션 - 필터
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // 유틸리티
  getRealEstateTypesString: () => string;
  getTradeTypesString: () => string;
}

const defaultFilters: FilterState = {
  cortarNo: '',
  cortarName: '',
  realEstateTypes: ['APT', 'OPST'],
  tradeTypes: ['A1', 'B1', 'B2'],
  priceMin: 0,
  priceMax: 900000000,
  rentPriceMin: 0,
  rentPriceMax: 900000000,
  areaMin: 0,
  areaMax: 900000000,
  sortBy: 'rank',
};

export const useRealEstateStore = create<RealEstateState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        regions: [],
        articles: [],
        selectedRegion: null,
        isLoading: false,
        isRefreshing: false,
        error: null,
        currentPage: 1,
        totalPage: 1,
        isMoreData: true,
        filters: defaultFilters,

        // 지역 관련 액션
        setRegions: (regions) => set({ regions }),
        setSelectedRegion: (region) =>
          set({
            selectedRegion: region,
            filters: {
              ...get().filters,
              cortarNo: region?.cortarNo || '',
              cortarName: region?.cortarName || '',
            },
            articles: [],
            currentPage: 1,
          }),

        // 매물 관련 액션
        setArticles: (articles) => set({ articles }),
        appendArticles: (articles) =>
          set((state) => ({
            articles: [...state.articles, ...articles],
          })),
        clearArticles: () => set({ articles: [] }),

        // 로딩/에러 액션
        setLoading: (isLoading) => set({ isLoading }),
        setRefreshing: (isRefreshing) => set({ isRefreshing }),
        setError: (error) => set({ error }),

        // 페이지네이션 액션
        setCurrentPage: (currentPage) => set({ currentPage }),
        setTotalPage: (totalPage) => set({ totalPage }),
        setIsMoreData: (isMoreData) => set({ isMoreData }),

        // 필터 액션
        setFilter: (key, value) =>
          set((state) => ({
            filters: { ...state.filters, [key]: value },
          })),
        setFilters: (newFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          })),
        resetFilters: () =>
          set({
            filters: { ...defaultFilters, cortarNo: get().filters.cortarNo },
          }),

        // 유틸리티
        getRealEstateTypesString: () => {
          const { realEstateTypes } = get().filters;
          return realEstateTypes.join(':');
        },
        getTradeTypesString: () => {
          const { tradeTypes } = get().filters;
          return tradeTypes.join(':');
        },
      }),
      {
        name: 'real-estate-storage',
        partialize: (state) => ({
          filters: state.filters,
          selectedRegion: state.selectedRegion,
        }),
      }
    ),
    { name: 'RealEstateStore' }
  )
);
