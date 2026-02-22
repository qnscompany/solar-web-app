'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { supabase } from '@/lib/supabase';

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
                console.log('Fetched companies:', data?.length);

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

        // SDK가 이미 헤더에 로드되어 있는 경우를 위한 즉시 체크
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

            // 지도 중심 설정
            const centerLat = userLoc?.lat || sortedCompanies.find(c => c.latitude)?.latitude || 36.5;
            const centerLng = userLoc?.lng || sortedCompanies.find(c => c.longitude)?.longitude || 127.5;

            const options = {
                center: new kakao.maps.LatLng(centerLat, centerLng),
                level: 8
            };

            // 컨테이너 초기화 및 지도 생성
            mapContainer.current.innerHTML = '';
            const map = new kakao.maps.Map(mapContainer.current, options);
            mapInstance.current = map;

            // 마커 및 정보창 추가
            sortedCompanies.forEach(company => {
                if (!company.latitude || !company.longitude) return;

                const position = new kakao.maps.LatLng(company.latitude, company.longitude);

                // 이미지 로딩 문제를 피하기 위해 이모지 별표 사용 (CustomOverlay)
                const content = `
                    <div style="cursor: pointer; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); text-align: center;">
                        <span style="font-size: 28px;">⭐</span>
                    </div>
                `;

                const overlay = new kakao.maps.CustomOverlay({
                    position: position,
                    content: content,
                    yAnchor: 1
                });

                overlay.setMap(map);

                // 정보창 표시를 위한 보이지 않는 마커 (이벤트용)
                const marker = new kakao.maps.Marker({
                    position: position,
                    map: map,
                    opacity: 0
                });

                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:10px;font-size:12px;color:#333;font-weight:bold;border-radius:8px;background:white;border:1px solid #ddd;min-width:120px;text-align:center;">${company.company_name}</div>`
                });

                kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
                kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());
            });

            // 내 위치 표시 (귀여운 동물 마스코트로 변경)
            if (userLoc) {
                const userContent = `
                    <div style="cursor: pointer; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.2)); display: flex; flex-direction: column; align-items: center;">
                        <div style="background: white; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ff9d00; position: relative;">
                            <span style="font-size: 28px;">🐹</span>
                            <div style="position: absolute; -top: 5px; -right: 5px; background: #ff9d00; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>
                        </div>
                        <div style="background: #ff9d00; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 800; margin-top: 4px; white-space: nowrap; border: 1px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">내 위치</div>
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
                {/* 왼쪽: 지도 영역 */}
                <div className="lg:w-1/2">
                    {companies.length === 1 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800 font-bold">
                            ⚠️ 보안 정책(RLS)으로 인해 내 업체 정보만 표시되고 있습니다. <br />
                            다른 모든 업체를 보시려면 Supabase SQL Editor에서 가이드드린 SQL을 실행해 주세요.
                        </div>
                    )}
                    <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm sticky top-8">
                        <div
                            ref={mapContainer}
                            className="w-full h-[500px] rounded-xl overflow-hidden grayscale-[0.2] contrast-[1.1]"
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

                {/* 오른쪽: 리스트 영역 */}
                <div className="lg:w-1/2 space-y-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            {userLoc ? '거리순 추천 업체' : '전체 등록 업체'}
                            <span className="ml-2 text-sm font-normal text-gray-400">({sortedCompanies.length})</span>
                        </h2>
                        {userLoc && (
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-blue-100">
                                내 위치 기준 정렬됨
                            </span>
                        )}
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
                                            <p className="text-xs text-blue-500 font-bold mt-1">
                                                {company.service_areas?.join(', ') || '전국 서비스'}
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
                                            <p className="text-sm font-black text-gray-700">{(company.capabilities?.construction_capacity_value ?? 0).toLocaleString()} <small className="font-bold">원</small></p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {sortedCompanies.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold">등록된 업체가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
