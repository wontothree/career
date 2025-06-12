document.addEventListener('DOMContentLoaded', () => {
  const uosDiv = document.getElementById('uos');
  const originalBase = document.querySelector('.base').cloneNode(true); // 초기 상태 복사

  uosDiv.addEventListener('click', (e) => {
    e.preventDefault();

    fetch('/uos.html')
      .then(response => {
        if (!response.ok) throw new Error('페이지 로드 실패');
        return response.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const newBase = doc.querySelector('.base');
        if (!newBase) {
          throw new Error('uos.html에 .base 클래스 요소가 없습니다.');
        }

        const currentBase = document.querySelector('.base');
        if (!currentBase) {
          throw new Error('현재 페이지에 .base 클래스 요소가 없습니다.');
        }

        currentBase.replaceWith(newBase);

        // URL 변경
        history.pushState({ page: 'uos' }, '', '/uos');
      })
      .catch(err => {
        console.error(err);
        alert('base 교체 중 오류가 발생했습니다: ' + err.message);
      });
  });

  // 뒤로가기 / 앞으로가기 이벤트 처리
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page === 'uos') {
      // uos 상태면 uos.html에서 .base 다시 로드
      fetch('/uos.html')
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newBase = doc.querySelector('.base');
          const currentBase = document.querySelector('.base');
          if (newBase && currentBase) {
            currentBase.replaceWith(newBase);
          }
        });
    } else {
      // 기본 페이지 상태일 때는 원래 복사해둔 originalBase로 복원
      const currentBase = document.querySelector('.base');
      if (currentBase) {
        currentBase.replaceWith(originalBase.cloneNode(true));
      }
    }
  });
});
