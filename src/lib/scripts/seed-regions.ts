// ============================================
// 전국 지역 정보 DB 저장 스크립트
// 네이버 부동산 API에서 모든 지역 정보를 가져와 DB에 저장
// ============================================

import prisma from '../db/prisma';

const API_BASE = 'http://localhost:3001';

interface Region {
  cortarNo: string;
  cortarName: string;
  cortarType: 'city' | 'dvsn' | 'dongs';
  centerLat: number;
  centerLon: number;
}

interface RegionResponse {
  regionList: Region[];
}

/**
 * 지역 목록 조회
 */
async function fetchRegions(cortarNo: string): Promise<Region[]> {
  const response = await fetch(`${API_BASE}/api/regions?cortarNo=${cortarNo}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch regions: ${response.statusText}`);
  }
  const data: RegionResponse = await response.json();
  return data.regionList || [];
}

/**
 * 지역 저장 (upsert)
 */
async function saveRegion(
  region: Region,
  parentCortarNo: string | null,
  depth: number
): Promise<void> {
  await prisma.region.upsert({
    where: { cortarNo: region.cortarNo },
    update: {
      cortarName: region.cortarName,
      cortarType: region.cortarType,
      centerLat: region.centerLat,
      centerLon: region.centerLon,
      depth,
      parentCortarNo,
    },
    create: {
      cortarNo: region.cortarNo,
      cortarName: region.cortarName,
      cortarType: region.cortarType,
      centerLat: region.centerLat,
      centerLon: region.centerLon,
      depth,
      parentCortarNo,
    },
  });
}

/**
 * 하위 지역 재귀적으로 저장
 */
async function saveRegionsRecursively(
  cortarNo: string,
  parentCortarNo: string | null,
  depth: number
): Promise<void> {
  try {
    const regions = await fetchRegions(cortarNo);

    for (const region of regions) {
      await saveRegion(region, parentCortarNo, depth);

      // 하위 지역이 있으면 재귀 호출
      if (region.cortarType === 'city' || region.cortarType === 'dvsn') {
        // 진행 상황 출력
        console.log(
          `${'  '.repeat(depth)}[${region.cortarName}] (${region.cortarNo}) 저장 완료`
        );

        await saveRegionsRecursively(region.cortarNo, region.cortarNo, depth + 1);
      }
    }
  } catch (error) {
    console.error(`Error processing ${cortarNo}:`, error);
  }
}

/**
 * 메인 함수
 */
async function main() {
  console.log('='.repeat(50));
  console.log('전국 지역 정보 DB 저장 시작');
  console.log('='.repeat(50));

  const startTime = Date.now();

  // 최상위 지역부터 시작
  const topRegions = await fetchRegions('0000000000');
  console.log(`\n최상위 지역 ${topRegions.length}개 발견\n`);

  let savedCount = 0;
  for (const region of topRegions) {
    console.log(`[${region.cortarName}] (${region.cortarNo}) 및 하위 지역 저장 중...`);
    await saveRegion(region, null, 0);
    savedCount++;

    // 하위 지역 재귀 저장
    await saveRegionsRecursively(region.cortarNo, region.cortarNo, 1);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  // 저장된 지역 수 확인
  const totalRegions = await prisma.region.count();

  console.log('\n' + '='.repeat(50));
  console.log('저장 완료!');
  console.log(`총 ${totalRegions}개 지역 저장됨`);
  console.log(`소요 시간: ${elapsed}초`);
  console.log('='.repeat(50));
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
