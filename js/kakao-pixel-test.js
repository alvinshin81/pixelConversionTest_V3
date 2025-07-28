// 카카오 픽셀 이벤트 테스트 JavaScript (새로운 UI)

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeEventHandlers();
});

// 버튼 활성화 상태 검사 함수
function checkButtonActivation() {
    const trackId = document.getElementById('trackId').value.trim();
    const eventType = document.getElementById('eventType').value;
    const executeBtn = document.getElementById('executeBtn');
    
    // Track ID와 이벤트 타입이 모두 입력/선택되었을 때만 버튼 활성화
    if (trackId && eventType) {
        executeBtn.disabled = false;
    } else {
        executeBtn.disabled = true;
    }
}

// 이벤트 핸들러 초기화
function initializeEventHandlers() {
    const trackIdInput = document.getElementById('trackId');
    const eventTypeSelect = document.getElementById('eventType');
    
    // Track ID 입력 시 버튼 상태 검사
    trackIdInput.addEventListener('input', checkButtonActivation);
    
    // 이벤트 타입 선택 시 버튼 상태 검사
    eventTypeSelect.addEventListener('change', checkButtonActivation);
    
    // 초기 상태 검사
    checkButtonActivation();
}

// Track ID 유효성 검사
function validateTrackId() {
    let trackId = document.getElementById('trackId');
    
    if (!trackId.value) {
        showResult('오류: Track ID는 필수 입력 항목입니다.', false);
        return false;
    }
    
    // sample.js와 동일한 패턴으로 trackId.value를 직접 반환
    return trackId.value;
}

// 토스트 팝업 표시 함수
function showResult(message, isSuccess = true) {
    const toast = document.getElementById('toast');
    const toastContent = document.getElementById('toastContent');
    
    // 메시지와 타임스탬프 설정
    toastContent.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">
            ${message}
        </div>
        <div style="font-size: 12px; opacity: 0.8;">
            실행 시간: ${new Date().toLocaleString()}
        </div>
    `;
    
    // 기존 클래스 제거
    toast.classList.remove('success', 'error', 'show');
    
    // 성공/실패에 따른 스타일 적용
    if (isSuccess) {
        toast.classList.add('success');
    } else {
        toast.classList.add('error');
    }
    
    // 토스트 표시
    toast.classList.add('show');
    
    // 4초 후 토스트 숨기기
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// 복수 입력값 파싱 함수
function parseMultipleValues(value) {
    if (!value || value.trim() === '') return [];
    return value.split(',').map(item => item.trim()).filter(item => item !== '');
}

// 상품 필드 유효성 검증 함수 (brand 필드 포함)
function validateProductFields() {
    const productIdValue = document.getElementById('productId').value.trim();
    const productNameValue = document.getElementById('productName').value.trim();
    const productQuantityValue = document.getElementById('productQuantity').value.trim();
    const productPriceValue = document.getElementById('productPrice').value.trim();
    const productBrandValue = document.getElementById('productBrand').value.trim();
    
    // 비어있는 필드는 검증하지 않음
    const fields = [];
    if (productIdValue) fields.push({ name: '상품 ID', values: parseMultipleValues(productIdValue) });
    if (productNameValue) fields.push({ name: '상품명', values: parseMultipleValues(productNameValue) });
    if (productQuantityValue) fields.push({ name: '상품 수량', values: parseMultipleValues(productQuantityValue) });
    if (productPriceValue) fields.push({ name: '상품 가격', values: parseMultipleValues(productPriceValue) });
    if (productBrandValue) fields.push({ name: '브랜드명', values: parseMultipleValues(productBrandValue) });
    
    if (fields.length === 0) return true; // 모든 필드가 비어있으면 유효
    
    // 첫 번째 필드의 개수를 기준으로 검증
    const expectedCount = fields[0].values.length;
    
    for (let i = 1; i < fields.length; i++) {
        if (fields[i].values.length !== expectedCount) {
            alert(`상품 정보 입력 오류: 모든 상품 필드의 개수가 일치해야 합니다.\n${fields[0].name}: ${expectedCount}개\n${fields[i].name}: ${fields[i].values.length}개`);
            return false;
        }
    }
    
    return true;
}

// 입력값 수집 함수
function collectInputData() {
    return {
        trackId: validateTrackId(),
        eventType: document.getElementById('eventType').value,
        tag: document.getElementById('tagValue').value.trim(),
        keyword: document.getElementById('keywordValue').value.trim(),
        productId: document.getElementById('productId').value.trim(),
        productName: document.getElementById('productName').value.trim(),
        productQuantity: document.getElementById('productQuantity').value.trim(),
        productPrice: document.getElementById('productPrice').value.trim(),
        productBrand: document.getElementById('productBrand').value.trim(),
        currency: document.getElementById('currency').value
    };
}

// 신규 상품 데이터 객체 생성 (2025.07.18 업데이트 반영)
function createNewProductData(data) {
    const productIds = parseMultipleValues(data.productId);
    const productNames = parseMultipleValues(data.productName);
    const productQuantities = parseMultipleValues(data.productQuantity);
    const productPrices = parseMultipleValues(data.productPrice);
    const productBrands = parseMultipleValues(data.productBrand);
    
    if (productIds.length === 0) return null;
    
    const products = [];
    for (let i = 0; i < productIds.length; i++) {
        const product = {};
        if (productIds[i]) product.id = productIds[i];
        if (productNames[i]) product.name = productNames[i];
        if (productQuantities[i]) product.quantity = productQuantities[i];
        if (productPrices[i]) product.price = productPrices[i];
        if (productBrands[i]) product.brand = productBrands[i];
        
        if (Object.keys(product).length > 0) {
            products.push(product);
        }
    }
    
    if (products.length === 0) return null;
    
    const eventData = {
        currency: data.currency || "KRW",
        products: products
    };
    
    if (data.tag) eventData.tag = data.tag;
    
    return eventData;
}

// 기존 상품 데이터 객체 생성 (호환성 유지, 2026.01.31까지 지원)
function createLegacyProductData(data) {
    const productIds = parseMultipleValues(data.productId);
    const productNames = parseMultipleValues(data.productName);
    const productQuantities = parseMultipleValues(data.productQuantity);
    const productPrices = parseMultipleValues(data.productPrice);
    
    // 단일 상품인 경우 기존 방식 유지
    if (productIds.length <= 1) {
        let productData = {};
        
        if (data.productId) productData.id = data.productId;
        if (data.productName) productData.name = data.productName;
        if (data.productQuantity) productData.quantity = data.productQuantity;
        if (data.productPrice) productData.price = data.productPrice;
        if (data.tag) productData.tag = data.tag;
        
        return Object.keys(productData).length > 0 ? productData : null;
    }
    
    // 복수 상품인 경우 첫 번째 상품만 반환 (기존 이벤트 호환성 유지)
    let productData = {};
    if (productIds[0]) productData.id = productIds[0];
    if (productNames[0]) productData.name = productNames[0];
    if (productQuantities[0]) productData.quantity = productQuantities[0];
    if (productPrices[0]) productData.price = productPrices[0];
    if (data.tag) productData.tag = data.tag;
    
    return Object.keys(productData).length > 0 ? productData : null;
}

// 상품 데이터 객체 생성 (주요 인터페이스)
function createProductData(data) {
    // 2026.01.31 이후에는 신규 형식만 사용
    const currentDate = new Date();
    const deprecationDate = new Date('2026-02-01');
    
    if (currentDate >= deprecationDate) {
        return createNewProductData(data);
    } else {
        // 현재는 신규 형식 우선 사용
        return createNewProductData(data);
    }
}

// 총 수량/가격 계산 함수
function calculateTotals(data) {
    const productQuantities = parseMultipleValues(data.productQuantity);
    const productPrices = parseMultipleValues(data.productPrice);
    
    let totalQuantity = 0;
    let totalPrice = 0;
    
    // 수량 합산
    productQuantities.forEach(qty => {
        const num = parseFloat(qty);
        if (!isNaN(num)) totalQuantity += num;
    });
    
    // 가격 합산
    productPrices.forEach(price => {
        const num = parseFloat(price);
        if (!isNaN(num)) totalPrice += num;
    });
    
    return {
        totalQuantity: totalQuantity > 0 ? totalQuantity : null,
        totalPrice: totalPrice > 0 ? totalPrice : null
    };
}

// 구매 데이터 객체 생성 (2025.07.18 업데이트 반영, brand 매개변수 포함)
function createPurchaseData(data) {
    let purchaseData = {};
    
    // 총 수량/가격 계산
    const totals = calculateTotals(data);
    if (totals.totalQuantity) purchaseData.total_quantity = totals.totalQuantity.toString();
    if (totals.totalPrice) purchaseData.total_price = totals.totalPrice.toString();
    if (data.currency) purchaseData.currency = data.currency;
    
    // 복수 상품 정보 처리 (brand 포함)
    const productIds = parseMultipleValues(data.productId);
    const productNames = parseMultipleValues(data.productName);
    const productQuantities = parseMultipleValues(data.productQuantity);
    const productPrices = parseMultipleValues(data.productPrice);
    const productBrands = parseMultipleValues(data.productBrand);
    
    if (productIds.length > 0) {
        const products = [];
        
        for (let i = 0; i < productIds.length; i++) {
            const product = {};
            if (productIds[i]) product.id = productIds[i];
            if (productNames[i]) product.name = productNames[i];
            if (productQuantities[i]) product.quantity = productQuantities[i];
            if (productPrices[i]) product.price = productPrices[i];
            if (productBrands[i]) product.brand = productBrands[i]; // 신규 brand 매개변수 추가
            
            if (Object.keys(product).length > 0) {
                products.push(product);
            }
        }
        
        if (products.length > 0) {
            purchaseData.products = products;
        }
    }
    
    if (data.tag) purchaseData.tag = data.tag;
    
    return Object.keys(purchaseData).length > 0 ? purchaseData : null;
}

// 검색 데이터 객체 생성
function createSearchData(data) {
    let searchData = {};
    
    if (data.keyword) searchData.search_string = data.keyword;
    if (data.tag) searchData.tag = data.tag;
    
    return Object.keys(searchData).length > 0 ? searchData : null;
}

// 메인 이벤트 실행 함수
function executeEvent() {
    const data = collectInputData();
    
    if (!data.trackId) return;
    
    if (!data.eventType) {
        showResult('오류: 이벤트 타입을 선택해주세요.', false);
        return;
    }
    
    // 상품 필드 유효성 검증
    if (!validateProductFields()) {
        return;
    }
    
    try {
        // 로그용 데이터 준비
        const logData = {
            event: data.eventType,
            trackId: data.trackId,
            timestamp: new Date().toISOString()
        };
        
        switch (data.eventType) {
            case 'pageView':
                executePageView(data, logData);
                break;
            case 'completeRegistration':
                executeCompleteRegistration(data, logData);
                break;
            case 'search':
                executeSearch(data, logData);
                break;
            case 'viewContent':
                executeViewContent(data, logData);
                break;
            case 'addToWishList':
                executeAddToWishList(data, logData);
                break;
            case 'addToCart':
                executeAddToCart(data, logData);
                break;
            case 'viewCart':
                executeViewCart(data, logData);
                break;
            case 'purchase':
                executePurchase(data, logData);
                break;
            default:
                showResult('지원하지 않는 이벤트 타입입니다.', false);
        }
    } catch (error) {
        console.error('❌ [카카오 픽셀 이벤트] 실행 오류:', error);
        showResult(`이벤트 실행 중 오류가 발생했습니다: ${error.message}`, false);
    }
}

// 페이지 뷰 이벤트
function executePageView(data, logData) {
    if (data.tag) {
        logData.tag = data.tag;
        console.log('🔍 [카카오 픽셀 이벤트] 방문 (태그 포함)', logData);
        kakaoPixel(data.trackId).pageView(data.tag);
        showResult(`방문 이벤트가 태그 "${data.tag}"와 함께 실행되었습니다.`);
    } else {
        console.log('🔍 [카카오 픽셀 이벤트] 방문', logData);
        kakaoPixel(data.trackId).pageView();
        showResult('방문 이벤트가 실행되었습니다.');
    }
}

// 회원가입 이벤트
function executeCompleteRegistration(data, logData) {
    // pageView 이벤트 먼저 실행
    kakaoPixel(data.trackId).pageView();
    
    if (data.tag) {
        logData.tag = data.tag;
        console.log('👤 [카카오 픽셀 이벤트] 회원가입 (태그 포함)', logData);
        kakaoPixel(data.trackId).completeRegistration(data.tag);
        showResult(`회원가입 이벤트가 태그 "${data.tag}"와 함께 실행되었습니다.`);
    } else {
        console.log('👤 [카카오 픽셀 이벤트] 회원가입', logData);
        kakaoPixel(data.trackId).completeRegistration();
        showResult('회원가입 이벤트가 실행되었습니다.');
    }
}

// 검색 이벤트
function executeSearch(data, logData) {
    // pageView 이벤트 먼저 실행
    kakaoPixel(data.trackId).pageView();
    
    const searchData = createSearchData(data);
    
    if (searchData) {
        logData.data = searchData;
        console.log('🔍 [카카오 픽셀 이벤트] 검색 (데이터 포함)', logData);
        kakaoPixel(data.trackId).search(searchData);
        showResult(`검색 이벤트가 데이터와 함께 실행되었습니다: ${JSON.stringify(searchData)}`);
    } else {
        console.log('🔍 [카카오 픽셀 이벤트] 검색', logData);
        kakaoPixel(data.trackId).search();
        showResult('검색 이벤트가 실행되었습니다.');
    }
}

// 컨텐츠 조회 이벤트 (2025.07.18 업데이트 반영)
function executeViewContent(data, logData) {
    // pageView 이벤트 먼저 실행
    kakaoPixel(data.trackId).pageView();
    
    const productData = createProductData(data);
    
    if (productData) {
        logData.data = productData;
        console.log('👁️ [카카오 픽셀 이벤트] 컨텐츠 조회 (신규 형식)', logData);
        kakaoPixel(data.trackId).viewContent(productData);
        showResult(`컨텐츠 조회 이벤트가 신규 형식으로 실행되었습니다: ${JSON.stringify(productData)}`);
    } else {
        console.log('👁️ [카카오 픽셀 이벤트] 컨텐츠 조회', logData);
        kakaoPixel(data.trackId).viewContent();
        showResult('컨텐츠 조회 이벤트가 실행되었습니다.');
    }
}

// 위시리스트 추가 이벤트 (2025.07.18 업데이트 반영)
function executeAddToWishList(data, logData) {
    // pageView 이벤트 먼저 실행
    kakaoPixel(data.trackId).pageView();
    
    const productData = createProductData(data);
    
    if (productData) {
        logData.data = productData;
        console.log('❤️ [카카오 픽셀 이벤트] 위시리스트 추가 (신규 형식)', logData);
        kakaoPixel(data.trackId).addToWishList(productData);
        showResult(`위시리스트 추가 이벤트가 신규 형식으로 실행되었습니다: ${JSON.stringify(productData)}`);
    } else {
        console.log('❤️ [카카오 픽셀 이벤트] 위시리스트 추가', logData);
        kakaoPixel(data.trackId).addToWishList();
        showResult('위시리스트 추가 이벤트가 실행되었습니다.');
    }
}

// 장바구니 추가 이벤트 (2025.07.18 업데이트 반영)
function executeAddToCart(data, logData) {
    // pageView 이벤트 먼저 실행
    kakaoPixel(data.trackId).pageView();
    
    const productData = createProductData(data);
    
    if (productData) {
        logData.data = productData;
        console.log('🛒 [카카오 픽셀 이벤트] 장바구니 추가 (신규 형식)', logData);
        kakaoPixel(data.trackId).addToCart(productData);
        showResult(`장바구니 추가 이벤트가 신규 형식으로 실행되었습니다: ${JSON.stringify(productData)}`);
    } else {
        console.log('🛒 [카카오 픽셀 이벤트] 장바구니 추가', logData);
        kakaoPixel(data.trackId).addToCart();
        showResult('장바구니 추가 이벤트가 실행되었습니다.');
    }
}

// 장바구니 조회 이벤트
function executeViewCart(data, logData) {
    // pageView 이벤트 먼저 실행
    kakaoPixel(data.trackId).pageView();
    
    if (data.tag) {
        logData.tag = data.tag;
        console.log('🛒 [카카오 픽셀 이벤트] 장바구니 조회 (태그 포함)', logData);
        kakaoPixel(data.trackId).viewCart(data.tag);
        showResult(`장바구니 조회 이벤트가 태그 "${data.tag}"와 함께 실행되었습니다.`);
    } else {
        console.log('🛒 [카카오 픽셀 이벤트] 장바구니 조회', logData);
        kakaoPixel(data.trackId).viewCart();
        showResult('장바구니 조회 이벤트가 실행되었습니다.');
    }
}

// 구매 이벤트 (2025.07.18 업데이트 반영, brand 매개변수 포함)
function executePurchase(data, logData) {
    // pageView 이벤트 먼저 실행
    kakaoPixel(data.trackId).pageView();
    
    const purchaseData = createPurchaseData(data);
    
    if (purchaseData) {
        logData.data = purchaseData;
        console.log('💳 [카카오 픽셀 이벤트] 구매 (신규 형식, brand 포함)', logData);
        kakaoPixel(data.trackId).purchase(purchaseData);
        showResult(`구매 이벤트가 신규 형식으로 실행되었습니다 (brand 포함): ${JSON.stringify(purchaseData)}`);
    } else {
        if (data.tag) {
            logData.tag = data.tag;
            console.log('💳 [카카오 픽셀 이벤트] 구매 (태그)', logData);
            kakaoPixel(data.trackId).purchase(data.tag);
            showResult(`구매 이벤트가 태그 "${data.tag}"와 함께 실행되었습니다.`);
        } else {
            console.log('💳 [카카오 픽셀 이벤트] 구매', logData);
            kakaoPixel(data.trackId).purchase();
            showResult('구매 이벤트가 실행되었습니다.');
        }
    }
}

// 카카오 픽셀 스크립트 로드 확인
function checkKakaoPixelLoaded() {
    if (typeof kakaoPixel === 'undefined') {
        showResult('카카오 픽셀 스크립트가 로드되지 않았습니다. 페이지를 새로고침해주세요.', false);
        return false;
    }
    return true;
}

// 페이지 로드 시 스크립트 확인
window.addEventListener('load', function() {
    setTimeout(() => {
        if (!checkKakaoPixelLoaded()) {
            console.warn('Kakao Pixel script not loaded properly');
        }
    }, 2000);
});