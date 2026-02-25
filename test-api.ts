import { NaverLandClient } from './src/lib/scraper/naver-client';

async function main() {
    const client = new NaverLandClient();
    try {
        console.log("Fetching...");
        // Fetch complex markers for Gaepo-dong (cortarNo: 1168010300)
        const result = await client.getComplexMarkers({
            cortarNo: '1168010300',
            zoom: 16,
            realEstateType: 'APT:OPST',
        });
        
        if (result.complexMarkerList && result.complexMarkerList.length > 0) {
            console.log(JSON.stringify(result.complexMarkerList[0], null, 2));
        } else {
            console.log("No markers found.");
        }
    } catch(e) {
        console.error(e);
    }
}

main();
