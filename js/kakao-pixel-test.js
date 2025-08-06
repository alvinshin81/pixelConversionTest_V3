// 카카오 픽셀 이벤트 테스트 JavaScript (통합 버전)

// 환경 설정 함수
function getEnvironmentConfig() {
    const isCBT = window.location.pathname.includes('cbt_event') || 
                  document.title.includes('CBT');
    
    return {
        isCBT: isCBT,
        isProduction: isCBT,
        envPrefix: isCBT ? '[CBT] ' : '',
        envText: isCBT ? ' (CBT)' : '',
        theme: {
            gradient: isCBT ? 
                'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            name: isCBT ? 'CBT (운영)' : 'Sandbox (개발)'
        },
        scriptUrl: isCBT ? 
            '//t1.daumcdn.net/kas/static/kp.js' : 
            '//t1.daumcdn.net/kas/static/kp.dev.min.js',
        targetPage: isCBT ? 'index.html' : 'cbt_event.html',
        buttonText: isCBT ? 'Sandbox에서 발생시키기' : 'CBT에서 발생시키기',
        buttonId: isCBT ? 'sandboxBtn' : 'cbtBtn'
    };
}

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeEventHandlers();
    initializeNavigationButton();
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
        const env = getEnvironmentConfig();
        showResult(`${env.envPrefix}오류: Track ID는 필수 입력 항목입니다.`, false);
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

// 모바일 디바이스 감지 함수
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768);
}

// 새 창에서 이벤트 실행하는 함수
function executeEventInNewWindow(eventType, trackId, eventData) {
    const env = getEnvironmentConfig();
    
    // 모바일에서는 팝업 차단 가능성이 높으므로 같은 창에서 실행
    if (isMobile()) {
        executeEventInSamePage(eventType, trackId, eventData);
        return;
    }
    
    // 새 창 열기 (데스크톱)
    const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    
    // 팝업이 차단된 경우 처리
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.warn('팝업이 차단되어 같은 창에서 이벤트를 실행합니다.');
        showResult(`${env.envPrefix}팝업이 차단되어 같은 창에서 이벤트를 실행합니다.`, false);
        executeEventInSamePage(eventType, trackId, eventData);
        return;
    }
    
    // 이벤트별 실행 스크립트 생성
    let executeScript = '';
    
    switch(eventType) {
        case 'pageView':
            if (eventData && eventData.tag) {
                executeScript = `kakaoPixel('${trackId}').pageView('${eventData.tag}');`;
            } else {
                executeScript = `kakaoPixel('${trackId}').pageView();`;
            }
            break;
            
        case 'completeRegistration':
            executeScript = `kakaoPixel('${trackId}').pageView();`;
            if (eventData && eventData.tag) {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').completeRegistration('${eventData.tag}'), 100);`;
            } else {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').completeRegistration(), 100);`;
            }
            break;
            
        case 'search':
            executeScript = `kakaoPixel('${trackId}').pageView();`;
            if (eventData && Object.keys(eventData).length > 0) {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').search(${JSON.stringify(eventData)}), 100);`;
            } else {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').search(), 100);`;
            }
            break;
            
        case 'viewContent':
        case 'addToWishList':
        case 'addToCart':
            const methodName = eventType;
            executeScript = `kakaoPixel('${trackId}').pageView();`;
            if (eventData && Object.keys(eventData).length > 0) {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').${methodName}(${JSON.stringify(eventData)}), 100);`;
            } else {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').${methodName}(), 100);`;
            }
            break;
            
        case 'viewCart':
            executeScript = `kakaoPixel('${trackId}').pageView();`;
            if (eventData && eventData.tag) {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').viewCart('${eventData.tag}'), 100);`;
            } else {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').viewCart(), 100);`;
            }
            break;
            
        case 'purchase':
            executeScript = `kakaoPixel('${trackId}').pageView();`;
            if (eventData && Object.keys(eventData).length > 0) {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').purchase(${JSON.stringify(eventData)}), 100);`;
            } else if (eventData && eventData.tag) {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').purchase('${eventData.tag}'), 100);`;
            } else {
                executeScript += `\n                    setTimeout(() => kakaoPixel('${trackId}').purchase(), 100);`;
            }
            break;
            
        default:
            executeScript = `throw new Error('지원하지 않는 이벤트 타입: ${eventType}');`;
    }
    
    // HTML 동적 생성
    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>카카오 픽셀 이벤트 실행 - ${eventType}${env.envText}</title>
    <script type="text/javascript" charset="UTF-8" src="${env.scriptUrl}"></script>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: ${env.theme.gradient};
            color: white;
            text-align: center;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            margin-top: 50px;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            font-weight: bold;
        }
        .success { background-color: rgba(40, 167, 69, 0.8); }
        .error { background-color: rgba(220, 53, 69, 0.8); }
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 카카오 픽셀 이벤트 실행${env.envText}</h1>
        <p><strong>이벤트 타입:</strong> ${eventType}</p>
        <p><strong>Track ID:</strong> ${trackId}</p>
        <p><strong>환경:</strong> ${env.theme.name}</p>
        <div id="loading" style="margin: 20px 0;">
            <div class="loading"></div>
            <p>이벤트 실행 중...</p>
        </div>
        <div id="result"></div>
    </div>
    
    <script type="text/javascript">
        console.log('🔍 [새 창 이벤트] 스크립트 로딩 시작');
        
        window.onload = function() {
            console.log('🔍 [새 창 이벤트] 페이지 로드 완료');
            console.log('🔍 [새 창 이벤트] KakaoPixel 타입:', typeof kakaoPixel);
            
            setTimeout(() => {
                try {
                    console.log('🔍 [새 창 이벤트] 이벤트 실행 시작: ${eventType}');
                    
                    ${executeScript}
                    
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('result').innerHTML = 
                        '<div class="result success">✅${env.envText} ${eventType} 이벤트가 성공적으로 실행되었습니다!</div>';
                    
                    console.log('✅ [새 창 이벤트] ${eventType} 실행 완료');
                    
                    // 3초 후 창 닫기
                    setTimeout(() => {
                        console.log('🔍 [새 창 이벤트] 창 닫기');
                        window.close();
                    }, 3000);
                    
                } catch(error) {
                    console.error('❌ [새 창 이벤트] 실행 오류:', error);
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('result').innerHTML = 
                        '<div class="result error">❌ 오류: ' + error.message + '</div>';
                }
            }, 1000); // 1초 대기 후 실행
        };
    </script>
</body>
</html>`;
    
    // 새 창에 HTML 작성
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    
    console.log(`🚀 [새 창 실행] ${eventType} 이벤트를 새 창에서 실행합니다.`);
}

// 같은 페이지에서 이벤트 실행하는 함수 (모바일/팝업 차단 대응)
function executeEventInSamePage(eventType, trackId, eventData) {
    const env = getEnvironmentConfig();
    
    console.log(`📱 [같은 창 실행] ${eventType} 이벤트를 같은 창에서 실행합니다.`);
    
    // 토스트 메시지로 실행 상태 표시
    showResult(`${env.envPrefix}${isMobile() ? '모바일' : '팝업차단'} ${eventType} 이벤트를 같은 창에서 실행합니다.`, true);
    
    try {
        // 이벤트별 실행 로직
        switch(eventType) {
            case 'pageView':
                if (eventData && eventData.tag) {
                    kakaoPixel(trackId).pageView(eventData.tag);
                } else {
                    kakaoPixel(trackId).pageView();
                }
                break;
                
            case 'completeRegistration':
                kakaoPixel(trackId).pageView();
                setTimeout(() => {
                    if (eventData && eventData.tag) {
                        kakaoPixel(trackId).completeRegistration(eventData.tag);
                    } else {
                        kakaoPixel(trackId).completeRegistration();
                    }
                }, 100);
                break;
                
            case 'search':
                kakaoPixel(trackId).pageView();
                setTimeout(() => {
                    if (eventData && Object.keys(eventData).length > 0) {
                        kakaoPixel(trackId).search(eventData);
                    } else {
                        kakaoPixel(trackId).search();
                    }
                }, 100);
                break;
                
            case 'viewContent':
            case 'addToWishList':
            case 'addToCart':
                kakaoPixel(trackId).pageView();
                setTimeout(() => {
                    if (eventData && Object.keys(eventData).length > 0) {
                        kakaoPixel(trackId)[eventType](eventData);
                    } else {
                        kakaoPixel(trackId)[eventType]();
                    }
                }, 100);
                break;
                
            case 'viewCart':
                kakaoPixel(trackId).pageView();
                setTimeout(() => {
                    if (eventData && eventData.tag) {
                        kakaoPixel(trackId).viewCart(eventData.tag);
                    } else {
                        kakaoPixel(trackId).viewCart();
                    }
                }, 100);
                break;
                
            case 'purchase':
                kakaoPixel(trackId).pageView();
                setTimeout(() => {
                    if (eventData && Object.keys(eventData).length > 0) {
                        kakaoPixel(trackId).purchase(eventData);
                    } else if (eventData && eventData.tag) {
                        kakaoPixel(trackId).purchase(eventData.tag);
                    } else {
                        kakaoPixel(trackId).purchase();
                    }
                }, 100);
                break;
                
            default:
                throw new Error(`지원하지 않는 이벤트 타입: ${eventType}`);
        }
        
        console.log(`✅ [같은 창 실행] ${eventType} 이벤트가 성공적으로 실행되었습니다.`);
        
        // 3초 후 성공 메시지 표시
        setTimeout(() => {
            showResult(`${env.envPrefix}✅ ${eventType} 이벤트가 성공적으로 실행되었습니다!`, true);
        }, 1000);
        
    } catch(error) {
        console.error(`❌ [같은 창 실행] ${eventType} 실행 오류:`, error);
        showResult(`${env.envPrefix}❌ 오류: ${error.message}`, false);
    }
}

// 메인 이벤트 실행 함수
function executeEvent() {
    const env = getEnvironmentConfig();
    const data = collectInputData();
    
    if (!data.trackId) return;
    
    if (!data.eventType) {
        showResult(`${env.envPrefix}오류: 이벤트 타입을 선택해주세요.`, false);
        return;
    }
    
    // 상품 필드 유효성 검증
    if (!validateProductFields()) {
        return;
    }
    
    // 이벤트별 데이터 준비
    let eventData = {};
    
    switch (data.eventType) {
        case 'pageView':
        case 'viewCart':
            if (data.tag) eventData.tag = data.tag;
            break;
        case 'completeRegistration':
            if (data.tag) eventData.tag = data.tag;
            break;
        case 'search':
            eventData = createSearchData(data) || {};
            break;
        case 'viewContent':
        case 'addToWishList':
        case 'addToCart':
            eventData = createProductData(data) || {};
            break;
        case 'purchase':
            eventData = createPurchaseData(data) || {};
            if (!eventData || Object.keys(eventData).length === 0) {
                if (data.tag) eventData = { tag: data.tag };
            }
            break;
    }
    
    // 실행될 스크립트 내역 로그 (HTML 스크립트 태그 형식)
    let scriptLog = '';
    
    switch (data.eventType) {
        case 'pageView':
            if (eventData && eventData.tag) {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView('${eventData.tag}');\n</script>`;
            } else {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n</script>`;
            }
            break;
        case 'completeRegistration':
            if (eventData && eventData.tag) {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').completeRegistration('${eventData.tag}');\n</script>`;
            } else {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').completeRegistration();\n</script>`;
            }
            break;
        case 'search':
            if (eventData && Object.keys(eventData).length > 0) {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').search(${JSON.stringify(eventData, null, 12).replace(/\n/g, '\n      ')});\n</script>`;
            } else {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').search();\n</script>`;
            }
            break;
        case 'viewContent':
        case 'addToWishList':
        case 'addToCart':
            if (eventData && Object.keys(eventData).length > 0) {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').${data.eventType}(${JSON.stringify(eventData, null, 12).replace(/\n/g, '\n      ')});\n</script>`;
            } else {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').${data.eventType}();\n</script>`;
            }
            break;
        case 'viewCart':
            if (eventData && eventData.tag) {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').viewCart('${eventData.tag}');\n</script>`;
            } else {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').viewCart();\n</script>`;
            }
            break;
        case 'purchase':
            if (eventData && Object.keys(eventData).length > 0) {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').purchase(${JSON.stringify(eventData, null, 12).replace(/\n/g, '\n      ')});\n</script>`;
            } else if (eventData && eventData.tag) {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').purchase('${eventData.tag}');\n</script>`;
            } else {
                scriptLog = `<script type="text/javascript">\n      kakaoPixel('${data.trackId}').pageView();\n      kakaoPixel('${data.trackId}').purchase();\n</script>`;
            }
            break;
    }
    
    // 원래 창에 상세 로그 출력
    console.log('🚀 [이벤트 실행] 새 창에서 실행됩니다.');
    console.log('📋 [실행 스크립트]', scriptLog);
    console.log('🔍 [이벤트 데이터]', {
        eventType: data.eventType,
        trackId: data.trackId,
        eventData: eventData,
        timestamp: new Date().toISOString(),
        environment: env.theme.name
    });
    
    // 새 창에서 이벤트 실행
    executeEventInNewWindow(data.eventType, data.trackId, eventData);
    
    // 기존 방식의 토스트 알림
    showResult(`${env.envPrefix}${data.eventType} 이벤트를 새 창에서 실행합니다.`, true);
}

// 네비게이션 버튼 초기화
function initializeNavigationButton() {
    const env = getEnvironmentConfig();
    const navBtn = document.getElementById(env.buttonId);
    
    if (navBtn) {
        navBtn.addEventListener('click', function() {
            window.location.href = env.targetPage;
        });
    }
    
    // Fixed Event 버튼 초기화 (index.html에서만 - CBT 페이지에서는 예외처리)
    const fixedEventBtn = document.getElementById('fixedEventBtn');
    if (fixedEventBtn) {
        fixedEventBtn.addEventListener('click', function() {
            console.log('Fixed Event 버튼 클릭됨');
            alert('Fixed Event 버튼 클릭 - 이동 시도');
            window.location.href = 'fixed_event.html';
        });
    } else if (!env.isCBT) {
        // CBT 환경이 아닌 경우에만 오류 로그 출력
        console.error('fixedEventBtn 요소를 찾을 수 없음');
    }
}

// 카카오 픽셀 스크립트 로드 확인
function checkKakaoPixelLoaded() {
    const env = getEnvironmentConfig();
    
    if (typeof kakaoPixel === 'undefined') {
        showResult(`${env.envPrefix}카카오 픽셀 스크립트가 로드되지 않았습니다. 페이지를 새로고침해주세요.`, false);
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