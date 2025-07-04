// 카카오 픽셀 이벤트 테스트 JavaScript (새로운 UI)

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeEventHandlers();
});

// 이벤트 핸들러 초기화
function initializeEventHandlers() {
    // 이벤트 타입 선택 시 버튼 활성화
    const eventType = document.getElementById('eventType');
    const executeBtn = document.getElementById('executeBtn');
    
    eventType.addEventListener('change', function() {
        if (this.value) {
            executeBtn.disabled = false;
        } else {
            executeBtn.disabled = true;
        }
    });
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

// 결과 표시 함수
function showResult(message, isSuccess = true) {
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    
    resultContent.innerHTML = `
        <p style="color: ${isSuccess ? 'green' : 'red'}; font-weight: bold;">
            ${message}
        </p>
        <p><small>실행 시간: ${new Date().toLocaleString()}</small></p>
    `;
    
    resultDiv.classList.add('show');
    
    // 10초 후 결과 숨기기
    setTimeout(() => {
        resultDiv.classList.remove('show');
    }, 10000);
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
        productQuantity: document.getElementById('productQuantity').value,
        productPrice: document.getElementById('productPrice').value,
        totalQuantity: document.getElementById('totalQuantity').value,
        totalPrice: document.getElementById('totalPrice').value,
        currency: document.getElementById('currency').value
    };
}

// 상품 데이터 객체 생성
function createProductData(data) {
    let productData = {};
    
    if (data.productId) productData.id = data.productId;
    if (data.productName) productData.name = data.productName;
    if (data.productQuantity) productData.quantity = data.productQuantity;
    if (data.productPrice) productData.price = data.productPrice;
    if (data.tag) productData.tag = data.tag;
    
    return Object.keys(productData).length > 0 ? productData : null;
}

// 구매 데이터 객체 생성
function createPurchaseData(data) {
    let purchaseData = {};
    
    if (data.totalQuantity) purchaseData.total_quantity = data.totalQuantity;
    if (data.totalPrice) purchaseData.total_price = data.totalPrice;
    if (data.currency) purchaseData.currency = data.currency;
    
    // 상품 정보가 있으면 추가
    const productData = createProductData(data);
    if (productData && productData.id) {
        // tag를 제거하고 products 배열에 추가
        const productInfo = { ...productData };
        delete productInfo.tag;
        purchaseData.products = [productInfo];
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

// 컨텐츠 조회 이벤트
function executeViewContent(data, logData) {
    const productData = createProductData(data);
    
    if (productData) {
        logData.data = productData;
        console.log('👁️ [카카오 픽셀 이벤트] 컨텐츠 조회 (상품정보)', logData);
        kakaoPixel(data.trackId).viewContent(productData);
        showResult(`컨텐츠 조회 이벤트가 상품 정보와 함께 실행되었습니다: ${JSON.stringify(productData)}`);
    } else {
        console.log('👁️ [카카오 픽셀 이벤트] 컨텐츠 조회', logData);
        kakaoPixel(data.trackId).viewContent();
        showResult('컨텐츠 조회 이벤트가 실행되었습니다.');
    }
}

// 위시리스트 추가 이벤트
function executeAddToWishList(data, logData) {
    const productData = createProductData(data);
    
    if (productData) {
        logData.data = productData;
        console.log('❤️ [카카오 픽셀 이벤트] 위시리스트 추가 (상품정보)', logData);
        kakaoPixel(data.trackId).addToWishList(productData);
        showResult(`위시리스트 추가 이벤트가 상품 정보와 함께 실행되었습니다: ${JSON.stringify(productData)}`);
    } else {
        console.log('❤️ [카카오 픽셀 이벤트] 위시리스트 추가', logData);
        kakaoPixel(data.trackId).addToWishList();
        showResult('위시리스트 추가 이벤트가 실행되었습니다.');
    }
}

// 장바구니 추가 이벤트
function executeAddToCart(data, logData) {
    const productData = createProductData(data);
    
    if (productData) {
        logData.data = productData;
        console.log('🛒 [카카오 픽셀 이벤트] 장바구니 추가 (상품정보)', logData);
        kakaoPixel(data.trackId).addToCart(productData);
        showResult(`장바구니 추가 이벤트가 상품 정보와 함께 실행되었습니다: ${JSON.stringify(productData)}`);
    } else {
        console.log('🛒 [카카오 픽셀 이벤트] 장바구니 추가', logData);
        kakaoPixel(data.trackId).addToCart();
        showResult('장바구니 추가 이벤트가 실행되었습니다.');
    }
}

// 장바구니 조회 이벤트
function executeViewCart(data, logData) {
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

// 구매 이벤트
function executePurchase(data, logData) {
    const purchaseData = createPurchaseData(data);
    
    if (purchaseData) {
        logData.data = purchaseData;
        console.log('💳 [카카오 픽셀 이벤트] 구매 (데이터 포함)', logData);
        kakaoPixel(data.trackId).purchase(purchaseData);
        showResult(`구매 이벤트가 데이터와 함께 실행되었습니다: ${JSON.stringify(purchaseData)}`);
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