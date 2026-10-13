function toggleMenu() {
    const navMenu = document.getElementById("navMenu");
    const menuButton = document.querySelector(".mobile-menu-btn");

    if (!navMenu) return;

    navMenu.classList.toggle("active");

    if (menuButton) {
        const aberto = navMenu.classList.contains("active");
        menuButton.setAttribute(
            "aria-label",
            aberto ? "Fechar Menu" : "Abrir Menu"
        );
    }
}

const navMenu = document.getElementById("navMenu");
const menuButton = document.querySelector(".mobile-menu-btn");

if (navMenu) {
    navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navMenu.classList.remove("active");

            if (menuButton) {
                menuButton.setAttribute("aria-label", "Abrir Menu");
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const navMenu = document.getElementById("navMenu");
    const menuButton = document.querySelector(".mobile-menu-btn");

    if (!navMenu) return;

    navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navMenu.classList.remove("active");

            if (menuButton) {
                menuButton.setAttribute("aria-label", "Abrir Menu");
            }
        });
    });
});