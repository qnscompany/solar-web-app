'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { supabase } from '@/lib/supabase';
import { formatKoreanWon } from '@/utils/formatters';

interface Company {
    id: string;
    company_name: string;
    headquarters_address: string;
    is_verified: boolean;
    service_areas: string[];
    latitude: number;
    longitude: number;
    distance?: number;
    capabilities: {
        cumulative_capacity_mw: number;
        construction_capacity_value: number;
    };
}

interface UserLocation {
    lat: number;
    lng: number;
    address?: string;
}

// 하버사인 공식을 이용한 두 좌표 간 거리 계산 (km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userLoc, setUserLoc] = useState<UserLocation | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const activeOverlay = useRef<any>(null);

    // 업체 데이터 가져오기
    useEffect(() => {
        async function fetchCompanies() {
            try {
                const { data, error } = await supabase
                    .from('company_profiles')
                    .select(`
                        id,
                        company_name,
                        headquarters_address,
                        is_verified,
                        service_areas,
                        latitude,
                        longitude,
                        capabilities:company_capabilities (
                            cumulative_capacity_mw,
                            construction_capacity_value
                        )
                    `)
                    .eq('is_verified', true);

                if (error) throw error;

                const formattedData = (data as any[]).map(item => ({
                    ...item,
                    capabilities: Array.isArray(item.capabilities) ? item.capabilities[0] : item.capabilities
                }));

                setCompanies(formattedData);
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCompanies();

        const kakao = (window as any).kakao;
        if (kakao && kakao.maps) {
            setMapReady(true);
        }
    }, []);

    // 사용자 위치 가져오기
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLoc({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                },
                (err) => {
                    console.warn('Geolocation failed:', err);
                }
            );
        }
    }, []);

    // 거리 계산 및 정렬
    const sortedCompanies = [...companies].map(c => {
        if (userLoc && c.latitude && c.longitude) {
            return { ...c, distance: calculateDistance(userLoc.lat, userLoc.lng, c.latitude, c.longitude) };
        }
        return c;
    }).sort((a, b) => (a.distance || 9999) - (b.distance || 9999));

    // 지도 초기화 및 마커 표시
    useEffect(() => {
        if (!mapReady || !mapContainer.current || sortedCompanies.length === 0) return;

        const kakao = (window as any).kakao;
        if (!kakao || !kakao.maps) return;

        kakao.maps.load(() => {
            if (!mapContainer.current) return;

            const centerLat = userLoc?.lat || sortedCompanies.find(c => c.latitude)?.latitude || 36.5;
            const centerLng = userLoc?.lng || sortedCompanies.find(c => c.longitude)?.longitude || 127.5;

            const options = {
                center: new kakao.maps.LatLng(centerLat, centerLng),
                level: 8
            };

            mapContainer.current.innerHTML = '';
            const map = new kakao.maps.Map(mapContainer.current, options);
            mapInstance.current = map;

            // 지도 빈 곳 클릭 시 팝업 닫기
            kakao.maps.event.addListener(map, 'click', () => {
                if (activeOverlay.current) {
                    activeOverlay.current.setMap(null);
                    activeOverlay.current = null;
                }
            });

            sortedCompanies.forEach(company => {
                if (!company.latitude || !company.longitude) return;

                const position = new kakao.maps.LatLng(company.latitude, company.longitude);

                // 마커 역할을 할 별표 이모지 오버레이
                const markerContent = document.createElement('div');
                markerContent.innerHTML = '<span style="font-size: 28px; cursor: pointer; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">⭐</span>';

                const markerOverlay = new kakao.maps.CustomOverlay({
                    position: position,
                    content: markerContent,
                    yAnchor: 1
                });
                markerOverlay.setMap(map);

                // 상세 정보 팝업 (CustomOverlay)
                const popupContent = document.createElement('div');
                popupContent.className = 'bg-white rounded-lg shadow-xl border border-gray-100 min-w-[220px] overflow-hidden';
                popupContent.style.transform = 'translateY(-50px)';

                // HTML 문자열로 팝업 내부 구성
                popupContent.innerHTML = `
                    <div class="p-4" style="font-family: sans-serif;">
                        <div class="flex items-center gap-1 mb-1" style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
                            <span style="font-size: 14px;">🌟</span>
                            <h4 style="margin: 0; font-size: 14px; font-weight: 900; color: #0f172a;">${company.company_name}</h4>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 8px;">
                            <span style="color: #eab308;">⭐ 4.8점</span>
                            <span>·</span>
                            <span>시공 47건</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; color: #94a3b8; margin-bottom: 4px;">
                            <span>📍</span>
                            <span>${company.headquarters_address.split(' ').slice(0, 2).join(' ')}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; color: #94a3b8; margin-bottom: 16px;">
                            <span>🔧</span>
                            <span>보증 15년 · 3~100kW</span>
                        </div>
                        <a href="/companies/${company.id}" style="display: block; width: 100%; text-align: center; padding: 8px 0; background-color: #0f172a; color: white; font-size: 11px; font-weight: 900; border-radius: 6px; text-decoration: none; transition: background-color 0.2s;">
                            상세보기 →
                        </a>
                    </div>
                `;

                // Tailwind 클래스가 CustomOverlay 내에서 잘 작동하지 않을 수 있으므로 인라인 스타일 병행
                const detailOverlay = new kakao.maps.CustomOverlay({
                    position: position,
                    content: popupContent,
                    yAnchor: 1,
                    zIndex: 10
                });

                markerContent.onclick = () => {
                    if (activeOverlay.current) {
                        activeOverlay.current.setMap(null);
                    }
                    detailOverlay.setMap(map);
                    activeOverlay.current = detailOverlay;
                    map.panTo(new kakao.maps.LatLng(company.latitude + 0.005, company.longitude));
                };
            });

            // 내 위치 표시
            if (userLoc) {
                const userContent = `
                    <div style="cursor: pointer; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.2)); display: flex; flex-direction: column; align-items: center;">
                        <div style="background: white; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ff9d00; position: relative;">
                            <span style="font-size: 28px;">🐹</span>
                        </div>
                        <div style="background: #ff9d00; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 800; margin-top: 4px; white-space: nowrap; border: 1px solid white;">내 위치</div>
                    </div>
                `;
                new kakao.maps.CustomOverlay({
                    position: new kakao.maps.LatLng(userLoc.lat, userLoc.lng),
                    content: userContent,
                    map: map,
                    yAnchor: 1
                });
            }
        });
    }, [mapReady, sortedCompanies, userLoc]);

    if (loading) return <div className="p-8 text-center">불러오는 중...</div>;
    if (error) return <div className="p-8 text-center text-red-500">에러 발생: {error}</div>;

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <Script
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`}
                onLoad={() => {
                    const kakao = (window as any).kakao;
                    kakao.maps.load(() => setMapReady(true));
                }}
            />

            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">업체 비교 리스트</h1>
                    <p className="text-gray-500">내 위치와 가까운 업체를 지도에서 확인해 보세요.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                    <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm sticky top-8">
                        <div
                            ref={mapContainer}
                            className="w-full h-[500px] rounded-xl overflow-hidden"
                            id="map"
                        />
                        <div className="p-4 flex gap-6 text-xs font-bold text-gray-500">
                            <div className="flex items-center gap-1">
                                <span className="text-xl">🐹</span> 내 위치
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xl">⭐</span> 파트너 업체
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 space-y-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            {userLoc ? '거리순 추천 업체' : '전체 등록 업체'}
                            <span className="ml-2 text-sm font-normal text-gray-400">({sortedCompanies.length})</span>
                        </h2>
                    </div>

                    <div className="grid gap-4">
                        {sortedCompanies.map((company) => (
                            <Link href={`/companies/${company.id}`} key={company.id}>
                                <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {company.company_name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                {company.headquarters_address}
                                            </p>
                                        </div>
                                        {company.distance && (
                                            <div className="text-right">
                                                <span className="text-lg font-black text-gray-900">
                                                    {company.distance.toFixed(1)}
                                                </span>
                                                <span className="text-xs font-bold text-gray-400 ml-1">km</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">누적설치용량</p>
                                            <p className="text-sm font-black text-gray-700">{company.capabilities?.cumulative_capacity_mw ?? 0} <small className="font-bold">MW</small></p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">시공능력평가액</p>
                                            <p className="text-sm font-black text-gray-700">{formatKoreanWon(company.capabilities?.construction_capacity_value ?? 0)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
