//track ID 목록 (통합 버전)

const TRACK_ID_DATA = {
    sandbox: [
        { ID: '7152515445403531586', NAME: '알림톡 테스트' },
        { ID: '4587589955779840066', NAME: '기획테스트 이것저것' },
        { ID: '4917123126974236283', NAME: '이벤트 커스텀 테스트 픽셀' },
        { ID: '6141657146100435130', NAME: '부메랑M2 Catalog 0' },
        { ID: '7481134453834468327', NAME: '셀린꺼' },
        { ID: '5550555478470577521', NAME: '엘리꺼'}
    ],
    cbt: [
        { ID: '1621177623377261241', NAME: '이벤트 수집용 앨빈꺼' },
        { ID: '5610088114123656460', NAME: '앨빈QA' },
        { ID: '5110570168229970371', NAME: '셀린꺼' },
        { ID: '4193549944368709004', NAME: '엘리꺼'}
    ]
};

// 환경 감지 함수
function detectEnvironment() {
    // 페이지 제목으로 CBT 환경 감지
    if (document.title.includes('CBT')) {
        return 'cbt';
    }
    
    // phase-info 텍스트로 환경 감지 (백업 방법)
    const phaseInfo = document.querySelector('.phase-highlight');
    if (phaseInfo && phaseInfo.textContent.includes('CBT')) {
        return 'cbt';
    }
    
    // 기본값은 sandbox
    return 'sandbox';
}

// Track ID 참고 테이블 생성 함수 (통합 버전)
function createTrackIdTable() {
    const trackIdsContainer = document.getElementById('trackIds');
    if (!trackIdsContainer) return;

    // 환경에 따른 데이터 선택
    const environment = detectEnvironment();
    const trackIdDbList = TRACK_ID_DATA[environment];
    
    console.log(`🔍 [TrackIds] ${environment.toUpperCase()} 환경으로 테이블 생성`);

    // 테이블 요소 생성
    const table = document.createElement('table');
    table.className = 'table';

    // 테이블 헤더 생성
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const idHeader = document.createElement('th');
    idHeader.textContent = 'ID';
    
    const nameHeader = document.createElement('th');
    nameHeader.textContent = '트랙 이름';
    
    headerRow.appendChild(idHeader);
    headerRow.appendChild(nameHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 테이블 바디 생성
    const tbody = document.createElement('tbody');
    
    trackIdDbList.forEach(item => {
        const row = document.createElement('tr');
        
        const idCell = document.createElement('td');
        idCell.textContent = item.ID;
        
        const nameCell = document.createElement('td');
        nameCell.textContent = item.NAME;
        
        row.appendChild(idCell);
        row.appendChild(nameCell);
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    trackIdsContainer.appendChild(table);
}

// 페이지 로드 시 테이블 생성
document.addEventListener('DOMContentLoaded', function() {
    createTrackIdTable();
});