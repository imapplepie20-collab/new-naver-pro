// ============================================
// 매물 지도 뷰 컴포넌트
// Leaflet + OpenStreetMap 사용 (API 키 불필요)
// ============================================

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Loader2, Layers, Map as MapIcon } from 'lucide-react';
import L from 'leaflet';

// Leaflet 마커 아이콘 생성 함수
const createIcon = (isSelected: boolean, priceText: string) => {
    const color = isSelected ? '#00FFCC' : '#FF0000';
    return L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div style="
                background: ${color};
                color: white;
                padding: 10px 14px;
                border-radius: 24px;
                font-size: 16px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                cursor: pointer;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                border: 3px solid white;
                min-width: 80px;
                text-align: center;
            ">
                ${priceText}
            </div>
        `,
        iconSize: [100, 40],
        iconAnchor: [50, 20],
        popupAnchor: [0, -20],
    });
};

interface Property {
    articleNo: string;
    articleName: string;
    latitude: number;
    longitude: number;
    dealOrWarrantPrc: string | null;
    realEstateTypeName: string;
    tradeTypeName: string;
    tradeTypeCode?: string;
    area1?: string;
    buildingName?: string;
}

interface Complex {
    markerId: string;
    complexName: string;
    latitude: number;
    longitude: number;
    realEstateTypeName: string;
    realEstateTypeCode: string;
    dealCount?: number;
    leaseCount?: number;
    rentCount?: number;
    totalArticleCount?: number;
}

interface PropertyMapViewProps {
    properties: Property[];
    complexes?: Complex[];
    selectedProperty: Property | null;
    onPropertySelect: (property: Property | null) => void;
    onComplexClick?: (complex: Complex) => void;
    onClose: () => void;
}

const PropertyMapView: React.FC<PropertyMapViewProps> = ({
    properties,
    complexes = [],
    selectedProperty,
    onPropertySelect,
    onComplexClick,
    onClose,
}) => {
    const navigate = useNavigate();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
    const [mapReady, setMapReady] = useState(false);
    const initialFitDoneRef = useRef(false);

    // 콜백을 ref에 저장하여 useEffect dependency에서 제외
    const onPropertySelectRef = useRef(onPropertySelect);
    onPropertySelectRef.current = onPropertySelect;
    const onComplexClickRef = useRef(onComplexClick);
    onComplexClickRef.current = onComplexClick;

    // Leaflet 로드 확인
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).L) {
            setMapLoaded(true);
            return;
        }
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && (window as any).L) {
                setMapLoaded(true);
            } else {
                setLoadingError(true);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // 지도 초기화 (한 번만 실행 — mapLoaded가 true가 되면)
    useEffect(() => {
        if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

        try {
            const map = L.map(mapRef.current, {
                center: [37.5665, 126.9780], // 초기 센터 (서울)
                zoom: 12,
                zoomControl: false,
            });

            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            tileLayerRef.current = tileLayer;
            mapInstanceRef.current = map;
            L.control.zoom({ position: 'topright' }).addTo(map);
            setMapReady(true);
        } catch (error) {
            console.error('Failed to initialize map:', error);
            setLoadingError(true);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapLoaded]);

    // 마커 표시 (complexes/properties 변경 시 마커만 갱신)
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        const map = mapInstanceRef.current;

        // 기존 마커 제거
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        const bounds = L.latLngBounds([]);
        let hasValidBounds = false;

        // 매물 마커
        properties.forEach((property) => {
            if (!property.latitude || !property.longitude || isNaN(property.latitude) || isNaN(property.longitude)) return;

            const position: L.LatLngExpression = [property.latitude, property.longitude];
            const isSelected = selectedProperty?.articleNo === property.articleNo;
            const priceText = property.dealOrWarrantPrc || '가격문의';

            const icon = createIcon(isSelected, priceText);
            const marker = L.marker(position, { icon });

            const popupContent = `
                <div style="min-width: 150px; font-family: sans-serif;">
                    <strong style="display: block; margin-bottom: 4px;">${property.articleName}</strong>
                    <div style="color: #6366F1; font-weight: bold; font-size: 14px;">${priceText}</div>
                    <div style="color: #666; font-size: 12px;">${property.realEstateTypeName}</div>
                    <div style="color: #666; font-size: 12px;">${property.tradeTypeName}</div>
                </div>
            `;
            marker.bindPopup(popupContent);

            marker.on('click', () => {
                onPropertySelectRef.current(property);
            });

            marker.addTo(map);
            markersRef.current.push(marker);
            bounds.extend(position);
            hasValidBounds = true;
        });

        // 단지 마커
        complexes.forEach((complex) => {
            if (!complex.latitude || !complex.longitude || isNaN(complex.latitude) || isNaN(complex.longitude)) return;

            const position: L.LatLngExpression = [complex.latitude, complex.longitude];
            const countText = complex.totalArticleCount ? `${complex.totalArticleCount}건` : '단지';

            const complexIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `
                    <div style="
                        background: #F59E0B;
                        color: white;
                        padding: 8px 12px;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: bold;
                        white-space: nowrap;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                        cursor: pointer;
                        border: 3px solid white;
                        min-width: 60px;
                        text-align: center;
                    ">
                        <div style="font-size: 10px; opacity: 0.9;">단지</div>
                        <div>${countText}</div>
                    </div>
                `,
                iconSize: [80, 50],
                iconAnchor: [40, 25],
                popupAnchor: [0, -25],
            });

            const marker = L.marker(position, { icon: complexIcon });

            const popupContent = `
                <div style="min-width: 180px; font-family: sans-serif;">
                    <strong style="display: block; margin-bottom: 4px;">${complex.complexName}</strong>
                    <div style="color: #666; font-size: 12px;">${complex.realEstateTypeName}</div>
                    <div style="color: #F59E0B; font-weight: bold; font-size: 13px; margin-top: 4px;">
                        총 ${complex.totalArticleCount || 0}건
                        ${complex.dealCount ? `(매매 ${complex.dealCount})` : ''}
                        ${complex.leaseCount ? `(전세 ${complex.leaseCount})` : ''}
                    </div>
                    <div style="color: #6366F1; font-size: 11px; margin-top: 6px;">클릭하면 매물 목록으로 이동</div>
                </div>
            `;
            marker.bindPopup(popupContent);

            // 클릭 시 임시 매물 목록으로 이동
            marker.on('click', () => {
                if (onComplexClickRef.current) {
                    onComplexClickRef.current(complex);
                } else {
                    const params = new URLSearchParams({
                        complexNo: complex.markerId,
                        complexName: complex.complexName,
                        realEstateType: complex.realEstateTypeCode || 'APT',
                    });
                    navigate(`/real-estate/temp-properties?${params.toString()}`);
                }
            });

            marker.addTo(map);
            markersRef.current.push(marker);
            bounds.extend(position);
            hasValidBounds = true;
        });

        // 모든 마커가 보이도록 fitBounds (최초 1회 또는 데이터 변경 시)
        if (hasValidBounds) {
            if (!initialFitDoneRef.current) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                initialFitDoneRef.current = true;
            } else {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
        }
    }, [properties, complexes, selectedProperty, navigate, mapReady]);

    // 선택된 매물로 이동
    useEffect(() => {
        if (!mapInstanceRef.current || !selectedProperty) return;
        const map = mapInstanceRef.current;
        map.setView([selectedProperty.latitude, selectedProperty.longitude], 15, {
            animate: true,
            duration: 0.5,
        });
    }, [selectedProperty]);

    // 지도 타입 변경
    useEffect(() => {
        if (!mapInstanceRef.current || !tileLayerRef.current) return;

        const map = mapInstanceRef.current;
        tileLayerRef.current.remove();

        if (mapType === 'street') {
            const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);
            tileLayerRef.current = streetLayer;
        } else {
            const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; Esri',
                maxZoom: 19,
            }).addTo(map);
            tileLayerRef.current = satelliteLayer;
        }
    }, [mapType]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[80vw] h-[80vh] flex flex-col bg-hud-bg-primary rounded-lg shadow-2xl overflow-hidden">
                {/* 타이틀바 */}
                <div className="flex items-center justify-between px-4 py-3 bg-hud-bg-secondary border-b border-hud-border-secondary">
                    <div className="flex items-center gap-2">
                        <MapIcon className="w-4 h-4 text-hud-accent-primary" />
                        <span className="text-sm font-medium text-hud-text-primary">
                            지도 보기 {complexes.length > 0 && `(${complexes.length}개 단지)`} {properties.length > 0 && `(${properties.length}개 매물)`}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-hud-bg-hover rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-hud-text-secondary" />
                    </button>
                </div>

                {/* 지도 영역 */}
                <div className="flex-1 relative">
                    <div ref={mapRef} className="w-full h-full bg-gray-800" />

                    {/* 로딩 상태 */}
                    {!mapLoaded && !loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-hud-bg-primary z-10">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-10 h-10 text-hud-accent-primary animate-spin" />
                                <p className="text-sm text-hud-text-muted">지도를 불러오는 중...</p>
                            </div>
                        </div>
                    )}

                    {/* 매물 없음 안내 */}
                    {mapLoaded && properties.length === 0 && complexes.length === 0 && !loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-hud-bg-primary z-10">
                            <div className="text-center p-6">
                                <MapPin className="w-12 h-12 text-hud-text-muted mx-auto mb-3" />
                                <p className="text-hud-text-primary mb-2">지도에 표시할 매물이 없습니다</p>
                                <p className="text-sm text-hud-text-muted">선택하신 지역의 매물은 좌표 정보를 제공하지 않습니다.</p>
                            </div>
                        </div>
                    )}

                    {/* 매물/단지 수 표시 */}
                    {(properties.length > 0 || complexes.length > 0) && (
                        <div className="absolute bottom-4 left-4 z-[1000] px-4 py-2 bg-hud-bg-secondary/90 backdrop-blur border border-hud-border-secondary rounded-lg shadow-lg">
                            <span className="text-sm text-hud-text-primary">
                                {complexes.length > 0 && (
                                    <><span className="font-bold text-hud-accent-warning">{complexes.length}</span>개 단지 </>
                                )}
                                {properties.length > 0 && (
                                    <><span className="font-bold text-hud-accent-primary">{properties.length}</span>개 매물</>
                                )}
                            </span>
                        </div>
                    )}

                    {/* 지도 타입 전환 */}
                    {mapLoaded && (
                        <div className="absolute top-4 right-4 z-[1000] flex gap-2">
                            <button
                                onClick={() => setMapType('street')}
                                className={`px-3 py-2 backdrop-blur border rounded-lg text-sm transition-colors ${mapType === 'street'
                                        ? 'bg-hud-accent-primary/20 border-hud-accent-primary text-hud-accent-primary'
                                        : 'bg-hud-bg-secondary/90 border-hud-border-secondary text-hud-text-primary hover:bg-hud-bg-hover'
                                    }`}
                            >
                                <Layers size={16} className="inline mr-1" />
                                지적도
                            </button>
                            <button
                                onClick={() => setMapType('satellite')}
                                className={`px-3 py-2 backdrop-blur border rounded-lg text-sm transition-colors ${mapType === 'satellite'
                                        ? 'bg-hud-accent-primary/20 border-hud-accent-primary text-hud-accent-primary'
                                        : 'bg-hud-bg-secondary/90 border-hud-border-secondary text-hud-text-primary hover:bg-hud-bg-hover'
                                    }`}
                            >
                                위성
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyMapView;
