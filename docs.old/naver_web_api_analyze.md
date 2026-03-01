https://new.land.naver.com/complexes?ms=37.2718,127.0135,16&a=OPST:PRE&b=A1:B1:B2:B3&e=RETAIL



 ** 매물타입
 아파트·오피스텔
    아파트 - APT
    오피스텔 - OPST
 
 빌라·주택
    빌리/연립 - VL
    단독/다가구 - DDDGG
    전원주택  - JWJT
    상가주택 - SGJT

 원룸·투룸
    원룸 - ONEROOM
    투룸 - TWOROOM

 상가·업무·공장·토지
    상가 - SG
    사무실 - SMS
    공장/창고 - GJCG
    지식산업센터-  APTHGJ
    건물 - GM
    토지 - TJ  
 
 ** 거래방식
 매매 - A1
 전세 - B1
 월세 - B2
 단기임대 - B3



 지역 목록 API - 우리 프로젝트에서는 중앙 DB에서 관리

 최상위
 await fetch("https://new.land.naver.com/api/regions/list?cortarNo=0000000000", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0",
        "Accept": "*/*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3NzE4MDYxOTEsImV4cCI6MTc3MTgxNjk5MX0.HC7FJ5_wLdt57K158TbhuPFzEy75oRAb6Dzu0YQORyE",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
    },
    "referrer": "https://new.land.naver.com/complexes?ms=37.3602697,127.1315452,15&a=APT:OPST:PRE&e=RETAIL",
    "method": "GET",
    "mode": "cors"
});
{
	"regionList": [
		{
			"cortarNo": "1100000000",
			"centerLat": 37.566427,
			"centerLon": 126.977872,
			"cortarName": "서울시",
			"cortarType": "city"
		},
		{
			"cortarNo": "4100000000",
			"centerLat": 37.274939,
			"centerLon": 127.008689,
			"cortarName": "경기도",
			"cortarType": "city"
		},
		{
			"cortarNo": "2800000000",
			"centerLat": 37.456054,
			"centerLon": 126.705151,
			"cortarName": "인천시",
			"cortarType": "city"
		},
		{
			"cortarNo": "2600000000",
			"centerLat": 35.180143,
			"centerLon": 129.075413,
			"cortarName": "부산시",
			"cortarType": "city"
		},
		{
			"cortarNo": "3000000000",
			"centerLat": 36.350465,
			"centerLon": 127.384953,
			"cortarName": "대전시",
			"cortarType": "city"
		},
		{
			"cortarNo": "2700000000",
			"centerLat": 35.87139,
			"centerLon": 128.601763,
			"cortarName": "대구시",
			"cortarType": "city"
		},
		{
			"cortarNo": "3100000000",
			"centerLat": 35.5386,
			"centerLon": 129.311375,
			"cortarName": "울산시",
			"cortarType": "city"
		},
		{
			"cortarNo": "3600000000",
			"centerLat": 36.592907,
			"centerLon": 127.292375,
			"cortarName": "세종시",
			"cortarType": "city"
		},
		{
			"cortarNo": "2900000000",
			"centerLat": 35.160032,
			"centerLon": 126.851338,
			"cortarName": "광주시",
			"cortarType": "city"
		},
		{
			"cortarNo": "5100000000",
			"centerLat": 37.885399,
			"centerLon": 127.72975,
			"cortarName": "강원도",
			"cortarType": "city"
		},
		{
			"cortarNo": "4300000000",
			"centerLat": 36.636149,
			"centerLon": 127.491238,
			"cortarName": "충청북도",
			"cortarType": "city"
		},
		{
			"cortarNo": "4400000000",
			"centerLat": 36.63629,
			"centerLon": 126.68957,
			"cortarName": "충청남도",
			"cortarType": "city"
		},
		{
			"cortarNo": "4700000000",
			"centerLat": 36.518504,
			"centerLon": 128.437796,
			"cortarName": "경상북도",
			"cortarType": "city"
		},
		{
			"cortarNo": "4800000000",
			"centerLat": 35.238343,
			"centerLon": 128.6924,
			"cortarName": "경상남도",
			"cortarType": "city"
		},
		{
			"cortarNo": "5200000000",
			"centerLat": 35.820433,
			"centerLon": 127.108875,
			"cortarName": "전북도",
			"cortarType": "city"
		},
		{
			"cortarNo": "4600000000",
			"centerLat": 34.816358,
			"centerLon": 126.462443,
			"cortarName": "전라남도",
			"cortarType": "city"
		},
		{
			"cortarNo": "5000000000",
			"centerLat": 33.488976,
			"centerLon": 126.498238,
			"cortarName": "제주도",
			"cortarType": "city"
		}
	]
}

차상위
await fetch("https://new.land.naver.com/api/regions/list?cortarNo=4100000000", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0",
        "Accept": "*/*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3NzE4MDYxOTEsImV4cCI6MTc3MTgxNjk5MX0.HC7FJ5_wLdt57K158TbhuPFzEy75oRAb6Dzu0YQORyE",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
    },
    "referrer": "https://new.land.naver.com/complexes?ms=37.3602697,127.1315452,15&a=APT:OPST:PRE&e=RETAIL",
    "method": "GET",
    "mode": "cors"
});
regionList	(47)[ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
0	
cortarNo	"4182000000"
centerLat	37.831171
centerLon	127.509625
cortarName	"가평군"
cortarType	"dvsn"
1	
cortarNo	"4128100000"
centerLat	37.637433
centerLon	126.832359
cortarName	"고양시 덕양구"
cortarType	"dvsn"
2	
cortarNo	"4128500000"
centerLat	37.65879
centerLon	126.775025
cortarName	"고양시 일산동구"
cortarType	"dvsn"
....



최하 단위까지 선택후 뜨는 박스에서 
<span class="btn_mapview_inner"><i class="icon icon_map" aria-hidden="true"></i><span class="text_result"> 매산로2가 </span><span class="text_mapview">지도로 보기</span></span> 
이 버튼 클릭 아래 api 호출



 아파트·오피스텔
await fetch("https://new.land.naver.com/api/complexes/single-markers/2.0?cortarNo=4111513500&zoom=16&priceType=RETAIL&markerId&markerType&selectedComplexNo&selectedComplexBuildingNo&fakeComplexMarker&realEstateType=OPST&tradeType=A1&tag=%3A%3A%3A%3A%3A%3A%3A%3A&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=false&minMaintenanceCost&maxMaintenanceCost&directions=&leftLon=126.98289&rightLon=127.027286&topLat=37.2744814&bottomLat=37.260752&isPresale=false", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0",
        "Accept": "*/*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3NzE4MDYxOTEsImV4cCI6MTc3MTgxNjk5MX0.HC7FJ5_wLdt57K158TbhuPFzEy75oRAb6Dzu0YQORyE",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    },
    "referrer": "https://new.land.naver.com/complexes?ms=37.267617,127.005088,16&a=OPST&b=A1&e=RETAIL",
    "method": "GET",
    "mode": "cors"
});

0	{ markerId: "151498", markerType: "COMPLEX", latitude: 37.268126, … }
markerId	"151498"
markerType	"COMPLEX"
latitude	37.268126
longitude	127.00781
complexName	"다원팰리스"
realEstateTypeCode	"OPST"
realEstateTypeName	"오피스텔"
completionYearMonth	"201711"
totalDongCount	1
totalHouseholdCount	3
floorAreaRatio	389
minArea	"104.66"
maxArea	"104.66"
priceCount	0
representativeArea	104.66
isPresales	false
photoCount	0
dealCount	0
leaseCount	0
rentCount	0
shortTermRentCount	0
totalArticleCount	0
existPriceTab	true
isComplexTourExist	false
1	{ markerId: "152702", markerType: "COMPLEX", latitude: 37.264439, … }
2	{ markerId: "144773", markerType: "COMPLEX", latitude: 37.26098, … } .....

 
 빌라·주택
 await fetch("https://new.land.naver.com/api/articles?cortarNo=4111513200&order=rank&realEstateType=VL%3AYR%3ADSD%3AYR%3ADSD%3AYR%3ADSD%3AYR%3ADSD%3AYR%3ADSD%3AYR%3ADSD&tradeType=&tag=%3A%3A%3A%3A%3A%3A%3A%3A&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=false&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&directions=&page=1&articleState", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0",
        "Accept": "*/*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3NzE4NDEwOTMsImV4cCI6MTc3MTg1MTg5M30.UMx6IE02xjrHUI8KsOfCFFid8JFN4j5AJf_BsJH03Es",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    },
    "referrer": "https://new.land.naver.com/houses?ms=37.2718,127.0135,16&a=VL&e=RETAIL",
    "method": "GET",
    "mode": "cors"
});

0	{ articleNo: "2610236130", articleName: "빌라", articleStatus: "R0", … }
articleNo	"2610236130"
articleName	"빌라"
articleStatus	"R0"
realEstateTypeCode	"VL"
realEstateTypeName	"빌라"
articleRealEstateTypeCode	"C03"
articleRealEstateTypeName	"빌라/연립"
tradeTypeCode	"A1"
tradeTypeName	"매매"
verificationTypeCode	"OWNER"
floorInfo	"B1/3"
priceChangeState	"SAME"
isPriceModification	false
dealOrWarrantPrc	"7,500"
area1	39
area2	39
direction	"남동향"
articleConfirmYmd	"20260223"
siteImageCount	0
articleFeatureDesc	"여성가족회관인근 팔달산아래 투룸빌라"
tagList	(4)[ "25년이상", "소형평수", "방두개", "화장실한개" ]
buildingName	"빌라"
sameAddrCnt	1
sameAddrDirectCnt	0
sameAddrMaxPrc	"7,500"
sameAddrMinPrc	"7,500"
cpid	"bizmk"
cpName	"매경부동산"
cpPcArticleUrl	"http://land.mk.co.kr/rd/rd.php?UID=2610236130"
cpPcArticleBridgeUrl	""
cpPcArticleLinkUseAtArticleTitleYn	false
cpPcArticleLinkUseAtCpNameYn	true
cpMobileArticleUrl	""
cpMobileArticleLinkUseAtArticleTitleYn	false
cpMobileArticleLinkUseAtCpNameYn	false
latitude	"37.273696"
longitude	"127.014081"
isLocationShow	true
realtorName	"대명공인중개사사무소"
realtorId	"2345900"
tradeCheckedByOwner	false
isDirectTrade	false
isInterest	false
isComplex	false
detailAddress	""
detailAddressYn	"N"
virtualAddressYn	"N"
isVrExposed	false
isSafeLessorOfHug	false
1	{ articleNo: "2609169297", articleName: "빌라", articleStatus: "R0", … } ....

 원룸·투룸

 await fetch("https://new.land.naver.com/api/articles?cortarNo=4111513200&order=rank&realEstateType=APT%3AOPST%3AABYG%3AOBYG%3AGM%3AOR%3ADDDGG%3AJWJT%3ASGJT%3AVL%3AYR%3ADSD&tradeType=&tag=%3A%3A%3A%3A%3A%3A%3ASMALLSPCRENT%3AONEROOM&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=false&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&directions=&page=1&articleState", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0",
        "Accept": "*/*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3NzE4NDU4ODQsImV4cCI6MTc3MTg1NjY4NH0.JALeZ3QkRdXs9Hw4yr9lJo3-m5U5_SEJ4TJnlgx2rys",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
    },
    "referrer": "https://new.land.naver.com/rooms?ms=37.2718,127.0135,16&a=APT:OPST:ABYG:OBYG:GM:OR:DDDGG:JWJT:SGJT:VL&e=RETAIL&aa=SMALLSPCRENT",
    "method": "GET",
    "mode": "cors"
});

 상가·업무·공장·토지

articleList	(20)[ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
0	{ articleNo: "2609869190", articleName: "도시형생활주택", articleStatus: "R0", … }
articleNo	"2609869190"
articleName	"도시형생활주택"
articleStatus	"R0"
realEstateTypeCode	"OR"
realEstateTypeName	"원룸"
articleRealEstateTypeCode	"C01"
articleRealEstateTypeName	"방"
tradeTypeCode	"B2"
tradeTypeName	"월세"
verificationTypeCode	"DOC"
floorInfo	"중/7"
rentPrc	"43"
priceChangeState	"SAME"
isPriceModification	false
dealOrWarrantPrc	"500"
area1	19
area2	15
direction	"서향"
articleConfirmYmd	"20260221"
siteImageCount	0
articleFeatureDesc	"수원역,매교역,풀옵션,보증금조정가능,공실,협의입주가능,베란다"
tagList	(4)[ "15년이내", "융자금적은", "화장실한개", "소형평수" ]
buildingName	"도시형생활주택"


await fetch("https://new.land.naver.com/api/articles?cortarNo=4111513200&order=rank&realEstateType=TJ%3ASMS%3ASG&tradeType=&tag=%3A%3A%3A%3A%3A%3A%3A%3A&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=false&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&directions=&page=1&articleState", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:147.0) Gecko/20100101 Firefox/147.0",
        "Accept": "*/*",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3NzE4NDYyODcsImV4cCI6MTc3MTg1NzA4N30.1qubnWjj5XGgjrlkcNM4F29zjzF5H72jm7MLKLUkaOo",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
    },
    "referrer": "https://new.land.naver.com/offices?ms=37.2718,127.0135,16&a=TJ:SMS&e=RETAIL",
    "method": "GET",
    "mode": "cors"
});

isMoreData	true
articleList	(20)[ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
0	{ articleNo: "2610049936", articleName: "일반상가", articleStatus: "R0", … }
articleNo	"2610049936"
articleName	"일반상가"
articleStatus	"R0"
realEstateTypeCode	"SG"
realEstateTypeName	"상가"
articleRealEstateTypeCode	"D02"
articleRealEstateTypeName	"상가점포"
tradeTypeCode	"B2"
tradeTypeName	"월세"
verificationTypeCode	"OWNER"
floorInfo	"8/10"
rentPrc	"140"
priceChangeState	"SAME"
isPriceModification	false
dealOrWarrantPrc	"2,000"
area1	174
area2	88
direction	"북동향"
articleConfirmYmd	"20260223"
siteImageCount	0
articleFeatureDesc	"수원역근처,인프라 대비 파격적 임대료,주차 편리,신축컨디션최상"
tagList	(4)[ "4년이내", "융자금적은", "고층", "관리비20만원이하" ]
buildingName	"일반상가"
sameAddrCnt	1
sameAddrDirectCnt	0
sameAddrMaxPrc	"2,000/140"
sameAddrMinPrc	"2,000/140"
cpid	"sunbang"
cpName	"선방"
cpPcArticleUrl	"http://homesdid.co.kr/rd.asp?UID=2610049936"
cpPcArticleBridgeUrl	""
cpPcArticleLinkUseAtArticleTitleYn	false
cpPcArticleLinkUseAtCpNameYn	true
cpMobileArticleUrl	""
cpMobileArticleLinkUseAtArticleTitleYn	false
cpMobileArticleLinkUseAtCpNameYn	false
latitude	"37.270429"
longitude	"127.012195"
isLocationShow	true
realtorName	"더블유(W)타워공인중개사사무소"
realtorId	"msoonhwa8669"
tradeCheckedByOwner	false
isDirectTrade	false
isInterest	false
isComplex	false
detailAddress	""
detailAddressYn	"N"
virtualAddressYn	"N"
isVrExposed	false
isSafeLessorOfHug	false
1	{ articleNo: "2610134122", articleName: "일반상가", articleStatus: "R0", … }
2	{ articleNo: "2610004469", articleName: "일반상가", articleStatus: "R0", … }
3	{ art