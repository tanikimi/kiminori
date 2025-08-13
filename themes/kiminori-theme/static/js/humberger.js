let humberger = document.getElementById("header-humberger-btn");
let nav = document.getElementById("header-humberger-menu-wrapper");
let body = document.querySelector("body");
let isCooldown = false;

humberger.addEventListener("click", function () {
    if (isCooldown) return;
    if (this.classList.contains("on")) {
        this.classList.remove("on");
        nav.classList.remove("on");
        body.classList.remove("on");
        isCooldown = true;
        setTimeout(() => {
            isCooldown = false;
        }, 500);
    } else {
        this.classList.add("on");
        nav.classList.add("on");
        body.classList.add("on");
    }
}, false);

window.addEventListener("resize", function () {
    if (window.innerWidth >= 500 && humberger.classList.contains("on")) {
        humberger.classList.remove("on");
        nav.classList.remove("on");
        body.classList.remove("on");
    }
});