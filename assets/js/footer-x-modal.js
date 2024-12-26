document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openFooterXModal');
    const modal = document.getElementById('footerXModal');
    const closeModalButton = document.getElementById('closeFooterXModal');

    // モーダルを開く
    openModalButton.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.remove('gh-footer-x-modal-hidden');
        modal.style.display = 'flex';
    });

    // モーダルを閉じる
    closeModalButton.addEventListener('click', function() {
        modal.classList.add('gh-footer-x-modal-hidden');
        modal.style.display = 'none';
    });

    // モーダル外をクリックで閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.add('gh-footer-x-modal-hidden');
            modal.style.display = 'none';
        }
    });
});
