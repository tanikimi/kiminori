let btns = document.querySelectorAll(".favorites-box-btn");
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        if (this.classList.contains("on")) {
            this.classList.remove("on");
        }
        else {
            this.classList.add("on");
        }
    }, false);
}
