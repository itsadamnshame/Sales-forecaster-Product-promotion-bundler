const navi = document.querySelectorAll('.navi');
navi.forEach(button => {
    button.onclick = () => {
        const targetPage = button.getAttribute('data-page');
        if (targetPage) {
            window.location.href = targetPage;
        }
    };
});