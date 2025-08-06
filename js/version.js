// 버전 관리 JavaScript (통합 버전)

// 현재 버전 정의 (단일 관리 지점)
const CURRENT_VERSION = 'V20250806.1429';

// 버전 뱃지 동적 생성 함수
function insertVersionBadge() {
    // 기존 버전 뱃지가 있다면 제거
    const existingBadge = document.querySelector('.version-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // 새 버전 뱃지 생성
    const versionBadge = document.createElement('div');
    versionBadge.className = 'version-badge';
    versionBadge.textContent = CURRENT_VERSION;
    
    // body의 첫 번째 자식으로 삽입
    document.body.insertBefore(versionBadge, document.body.firstChild);
    
    console.log(`🏷️ [Version] 버전 뱃지 생성됨: ${CURRENT_VERSION}`);
}

// 자동 버전 생성 함수 (선택적 사용)
function generateAutoVersion() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `V${year}${month}${day}.${hour}${minute}`;
}

// 페이지 로드 시 버전 뱃지 생성
document.addEventListener('DOMContentLoaded', function() {
    insertVersionBadge();
});