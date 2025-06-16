
const topBar = document.getElementById('topBar');
const navBar = document.getElementById('navBar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll down — hide top bar, move navbar up
        topBar.style.transform = 'translateY(-100%)';
        navBar.style.top = '0';  // Move to top
    } else if (currentScrollY < lastScrollY && currentScrollY <= 50) {
        // Scroll up near top — show top bar, move navbar down
        topBar.style.transform = 'translateY(0)';
        navBar.style.top = '40px';  // Move below top bar
    }

    lastScrollY = currentScrollY;
});
