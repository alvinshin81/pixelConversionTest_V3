//track ID 목록
// const trackIdList = ['7152515445403531586', '6141657146100435130', '4917123126974236283', '4587589955779840066'];

const trackIdDbList_cbt = [
    { ID: '1621177623377261241', NAME: '이벤트 수집용 앨빈꺼' },
    { ID: '5610088114123656460', NAME: '앨빈QA' },
    { ID: '5110570168229970371', NAME: '셀린꺼' },
    { ID: '4193549944368709004', NAME: '엘리꺼'}
  ]

// Track ID 참고 테이블 생성 함수
function createTrackIdTable() {
    const trackIdsContainer = document.getElementById('trackIds');
    if (!trackIdsContainer) return;

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
    
    trackIdDbList_cbt.forEach(item => {
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