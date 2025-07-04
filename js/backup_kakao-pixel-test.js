// 카카오 픽셀 이벤트 테스트 JavaScript

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeEventHandlers();
});

// 이벤트 핸들러 초기화
function initializeEventHandlers() {
    // 체크박스 토글 이벤트
    const checkboxes = [
        { checkbox: 'pageViewTag', target: 'pageViewOptional' },
        { checkbox: 'signupTag', target: 'signupOptional' },
        { checkbox: 'searchKeyword', target: 'searchOptional' },
        { checkbox: 'searchTag', target: 'searchTagOptional' },
        { checkbox: 'purchaseProduct', target: 'purchaseProductOptional' },
        { checkbox: 'purchaseTag', target: 'purchaseTagOptional' }
    ];

    checkboxes.forEach(item => {
        const checkbox = document.getElementById(item.checkbox);
        const target = document.getElementById(item.target);
        
        if (checkbox && target) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    target.classList.add('show');
                } else {
                    target.classList.remove('show');
                }
            });
        }
    });

    // 장바구니 조건 라디오 버튼 이벤트
    const cartRadios = document.querySelectorAll('input[name="cartCondition"]');
    cartRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // 모든 조건 섹션 숨기기
            document.getElementById('cartCondition1').style.display = 'none';
            document.getElementById('cartCondition2').style.display = 'none';
            
            // 선택된 조건 섹션 표시
            if (this.value === 'productOnly') {
                document.getElementById('cartCondition1').style.display = 'block';
            } else if (this.value === 'productAndTag') {
                document.getElementById('cartCondition2').style.display = 'block';
            }
        });
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

// 페이지 뷰 이벤트 트리거
function triggerPageView() {
    const trackId = validateTrackId();
    if (!trackId) return;
    
    try {
        const hasTag = document.getElementById('pageViewTag').checked;
        const tagValue = document.getElementById('pageViewTagValue').value.trim();
        
        if (hasTag && tagValue) {
            // 태그가 있는 경우
            console.log('🔍 [카카오 픽셀 이벤트] 페이지 뷰 (태그 포함)', {
                event: 'pageView',
                trackId: trackId,
                tag: tagValue,
                timestamp: new Date().toISOString()
            });
            kakaoPixel(trackId).pageView(tagValue);
            showResult(`페이지 뷰 이벤트가 태그 "${tagValue}"와 함께 실행되었습니다.`);
        } else {
            // 기본 페이지 뷰
            console.log('🔍 [카카오 픽셀 이벤트] 페이지 뷰', {
                event: 'pageView',
                trackId: trackId,
                timestamp: new Date().toISOString()
            });
            kakaoPixel(trackId).pageView();
            showResult('페이지 뷰 이벤트가 실행되었습니다.');
        }
    } catch (error) {
        console.error('❌ [카카오 픽셀 이벤트] 페이지 뷰 오류:', error);
        showResult(`페이지 뷰 이벤트 실행 중 오류가 발생했습니다: ${error.message}`, false);
    }
}

// 회원가입 이벤트 트리거
function triggerSignup() {
    const trackId = validateTrackId();
    if (!trackId) return;
    
    try {
        const hasTag = document.getElementById('signupTag').checked;
        const tagValue = document.getElementById('signupTagValue').value.trim();
        
        if (hasTag && tagValue) {
            // 태그가 있는 경우
            console.log('👤 [카카오 픽셀 이벤트] 회원가입 (태그 포함)', {
                event: 'completeRegistration',
                trackId: trackId,
                tag: tagValue,
                timestamp: new Date().toISOString()
            });
            kakaoPixel(trackId).completeRegistration(tagValue);
            showResult(`회원가입 이벤트가 태그 "${tagValue}"와 함께 실행되었습니다.`);
        } else {
            // 기본 회원가입
            console.log('👤 [카카오 픽셀 이벤트] 회원가입', {
                event: 'completeRegistration',
                trackId: trackId,
                timestamp: new Date().toISOString()
            });
            kakaoPixel(trackId).completeRegistration();
            showResult('회원가입 이벤트가 실행되었습니다.');
        }
    } catch (error) {
        console.error('❌ [카카오 픽셀 이벤트] 회원가입 오류:', error);
        showResult(`회원가입 이벤트 실행 중 오류가 발생했습니다: ${error.message}`, false);
    }
}

// 검색 이벤트 트리거
function triggerSearch() {
    const trackId = validateTrackId();
    if (!trackId) return;
    
    try {
        const hasKeyword = document.getElementById('searchKeyword').checked;
        const keywordValue = document.getElementById('searchKeywordValue').value.trim();
        const hasTag = document.getElementById('searchTag').checked;
        const tagValue = document.getElementById('searchTagValue').value.trim();
        
        let searchData = {};
        
        if (hasKeyword && keywordValue) {
            searchData.search_string = keywordValue;
        }
        
        if (hasTag && tagValue) {
            searchData.tag = tagValue;
        }
        
        if (Object.keys(searchData).length > 0) {
            console.log('🔍 [카카오 픽셀 이벤트] 검색 (데이터 포함)', {
                event: 'search',
                trackId: trackId,
                data: searchData,
                timestamp: new Date().toISOString()
            });
            kakaoPixel(trackId).search(searchData);
            showResult(`검색 이벤트가 데이터와 함께 실행되었습니다: ${JSON.stringify(searchData)}`);
        } else {
            console.log('🔍 [카카오 픽셀 이벤트] 검색', {
                event: 'search',
                trackId: trackId,
                timestamp: new Date().toISOString()
            });
            kakaoPixel(trackId).search();
            showResult('검색 이벤트가 실행되었습니다.');
        }
    } catch (error) {
        console.error('❌ [카카오 픽셀 이벤트] 검색 오류:', error);
        showResult(`검색 이벤트 실행 중 오류가 발생했습니다: ${error.message}`, false);
    }
}

// 장바구니 추가 이벤트 트리거
function triggerAddToCart() {
    const trackId = validateTrackId();
    if (!trackId) return;
    
    try {
        const selectedCondition = document.querySelector('input[name="cartCondition"]:checked');
        
        if (!selectedCondition) {
            showResult('장바구니 이벤트 조건을 선택해주세요.', false);
            return;
        }
        
        const condition = selectedCondition.value;
        
        if (condition === 'eventOnly') {
            // 이벤트만 사용
            console.log('🛒 [카카오 픽셀 이벤트] 장바구니 추가 (이벤트만)', {
                event: 'addToCart',
                trackId: trackId,
                condition: 'eventOnly',
                timestamp: new Date().toISOString()
            });
            kakaoPixel(trackId).addToCart();
            showResult('장바구니 추가 이벤트가 실행되었습니다 (이벤트만 사용).');
        } else if (condition === 'productOnly') {
            // 상품고유값만 추가
            const productId = document.getElementById('cartProductId').value.trim();
            const productName = document.getElementById('cartProductName').value.trim();
            const quantity = document.getElementById('cartProductQuantity').value;
            const price = document.getElementById('cartProductPrice').value;
            
            if (!productId) {
                showResult('상품 ID는 필수 입력 항목입니다.', false);
                return;
            }
            
            const productData = {
                id: productId,
                name: productName || undefined,
                quantity: quantity || undefined,
                price: price || undefined
            };
            
            // undefined 값 제거
            Object.keys(productData).forEach(key => {
                if (productData[key] === undefined || productData[key] === '') {
                    delete productData[key];
                }
            });
            
            console.log('🛒 [카카오 픽셀 이벤트] 장바구니 추가 (상품정보)', {
                event: 'addToCart',
                trackId: trackId,
                condition: 'productOnly',
                data: productData,
                timestamp: new Date().toISOString()
            });
            kakaoPixel(trackId).addToCart(productData);
            showResult(`장바구니 추가 이벤트가 상품 정보와 함께 실행되었습니다: ${JSON.stringify(productData)}`);
        } else if (condition === 'productAndTag') {
            // 상품고유값 + 태그 추가
            const productId = document.getElementById('cartProductId2').value.trim();
            const productName = document.getElementById('cartProductName2').value.trim();
            const quantity = document.getElementById('cartProductQuantity2').value;
            const price = document.getElementById('cartProductPrice2').value;
            const tagValue = document.getElementById('cartTagValue').value.trim();
            
            if (!productId) {
                showResult('상품 ID는 필수 입력 항목입니다.', false);
                return;
            }
            
            const productData = {
                id: productId,
                name: productName || undefined,
                quantity: quantity || undefined,
                price: price || undefined
            };
            
            // undefined 값 제거
            Object.keys(productData).forEach(key => {
                if (productData[key] === undefined || productData[key] === '') {
                    delete productData[key];
                }
            });
            
            if (tagValue) {
                // sample.js 방식: 태그값을 객체 안에 포함
                productData.tag = tagValue;
                console.log('🛒 [카카오 픽셀 이벤트] 장바구니 추가 (상품정보+태그)', {
                    event: 'addToCart',
                    trackId: trackId,
                    condition: 'productAndTag',
                    data: productData,
                    timestamp: new Date().toISOString()
                });
                kakaoPixel(trackId).addToCart(productData);
                showResult(`장바구니 추가 이벤트가 상품 정보와 태그 "${tagValue}"와 함께 실행되었습니다: ${JSON.stringify(productData)}`);
            } else {
                console.log('🛒 [카카오 픽셀 이벤트] 장바구니 추가 (상품정보)', {
                    event: 'addToCart',
                    trackId: trackId,
                    condition: 'productAndTag',
                    data: productData,
                    timestamp: new Date().toISOString()
                });
                kakaoPixel(trackId).addToCart(productData);
                showResult(`장바구니 추가 이벤트가 상품 정보와 함께 실행되었습니다: ${JSON.stringify(productData)}`);
            }
        }
    } catch (error) {
        console.error('❌ [카카오 픽셀 이벤트] 장바구니 추가 오류:', error);
        showResult(`장바구니 추가 이벤트 실행 중 오류가 발생했습니다: ${error.message}`, false);
    }
}

// 구매 이벤트 트리거
function triggerPurchase() {
    const trackId = validateTrackId();
    if (!trackId) return;
    
    try {
        const totalQuantity = document.getElementById('purchaseTotalQuantity').value;
        const totalPrice = document.getElementById('purchaseTotalPrice').value;
        const currency = document.getElementById('purchaseCurrency').value;
        const hasProduct = document.getElementById('purchaseProduct').checked;
        const hasTag = document.getElementById('purchaseTag').checked;
        
        let purchaseData = {};
        
        // 기본 구매 정보
        if (totalQuantity) purchaseData.total_quantity = totalQuantity;
        if (totalPrice) purchaseData.total_price = totalPrice;
        if (currency) purchaseData.currency = currency;
        
        // 상품 정보 추가
        if (hasProduct) {
            const productId = document.getElementById('purchaseProductId').value.trim();
            const productName = document.getElementById('purchaseProductName').value.trim();
            const productQuantity = document.getElementById('purchaseProductQuantity').value;
            const productPrice = document.getElementById('purchaseProductPrice').value;
            
            if (productId) {
                const product = {
                    id: productId,
                    name: productName || undefined,
                    quantity: productQuantity || undefined,
                    price: productPrice || undefined
                };
                
                // undefined 값 제거
                Object.keys(product).forEach(key => {
                    if (product[key] === undefined || product[key] === '') {
                        delete product[key];
                    }
                });
                
                purchaseData.products = [product];
            }
        }
        
        // 태그 정보
        const tagValue = hasTag ? document.getElementById('purchaseTagValue').value.trim() : '';
        
        if (Object.keys(purchaseData).length > 0) {
            if (tagValue) {
                console.log('💳 [카카오 픽셀 이벤트] 구매 (데이터+태그)', {
                    event: 'purchase',
                    trackId: trackId,
                    data: purchaseData,
                    tag: tagValue,
                    timestamp: new Date().toISOString()
                });
                kakaoPixel(trackId).purchase(purchaseData, tagValue);
                showResult(`구매 이벤트가 데이터와 태그 "${tagValue}"와 함께 실행되었습니다: ${JSON.stringify(purchaseData)}`);
            } else {
                console.log('💳 [카카오 픽셀 이벤트] 구매 (데이터)', {
                    event: 'purchase',
                    trackId: trackId,
                    data: purchaseData,
                    timestamp: new Date().toISOString()
                });
                kakaoPixel(trackId).purchase(purchaseData);
                showResult(`구매 이벤트가 데이터와 함께 실행되었습니다: ${JSON.stringify(purchaseData)}`);
            }
        } else {
            if (tagValue) {
                console.log('💳 [카카오 픽셀 이벤트] 구매 (태그)', {
                    event: 'purchase',
                    trackId: trackId,
                    tag: tagValue,
                    timestamp: new Date().toISOString()
                });
                kakaoPixel(trackId).purchase(tagValue);
                showResult(`구매 이벤트가 태그 "${tagValue}"와 함께 실행되었습니다.`);
            } else {
                console.log('💳 [카카오 픽셀 이벤트] 구매', {
                    event: 'purchase',
                    trackId: trackId,
                    timestamp: new Date().toISOString()
                });
                kakaoPixel(trackId).purchase();
                showResult('구매 이벤트가 실행되었습니다.');
            }
        }
    } catch (error) {
        console.error('❌ [카카오 픽셀 이벤트] 구매 오류:', error);
        showResult(`구매 이벤트 실행 중 오류가 발생했습니다: ${error.message}`, false);
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