document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.mobileNavIconContainer');
    const nav = document.querySelector('.navigationContainer');
    const exit = document.querySelector('.exitButton');
    const show = document.querySelector('.stickyMobileMenu');


    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        show.classList.toggle('open');
    });

    exit.addEventListener('click', () => {
        nav.classList.toggle('open');
        show.classList.toggle('open');
    });


});
