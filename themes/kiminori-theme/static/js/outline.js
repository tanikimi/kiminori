// h2,h3を抜き出し
const headerElements = document.querySelectorAll("#article-main_text-wrapper h2");

for (let i = 0; i < headerElements.length; i++) {
    if (headerElements[i].tagName === "H2") {
        headerElements[i].id = "h2-" + (i + 1);
        // h2の前に画面交差判定用divを生成
        newDiv = document.createElement('div');
        newDiv.id = "h2-bottom-" + i;
        newDiv.className = "bottom";
        if (i !== 0) {
            headerElements[i].parentNode.insertBefore(newDiv, headerElements[i]);
        }
    }
    // 目次を生成
    const newLi = document.createElement('li');
    const newA = document.createElement('a');
    newA.textContent = headerElements[i].textContent;
    newA.setAttribute("href", "#" + headerElements[i].id);
    newLi.appendChild(newA);
    const newLi2 = newLi.cloneNode(true);
    newLi.id = "outline-" + (i + 1);
    document.getElementById("article-outline-ul").appendChild(newLi);
    document.getElementById("article-outline-details-ul").appendChild(newLi2);
}

// 最後のh2の後に画面交差判定用divを生成
const newDivLast = document.createElement('div');
newDivLast.id = "h2-bottom-" + headerElements.length;
newDivLast.className = "bottom";
document.getElementById("article-share").parentNode.insertBefore(newDivLast, document.getElementById("article-share"));

// 交差判定の場所を固定header分調整
let headerHeight = document.getElementById("header").clientHeight * -1;

// 交差判定の設定
const options = {
    rootMargin: headerHeight + "px 0px 0px 0px",
    threshold: 1
};

// 交差判定の対象
const items = document.querySelectorAll(".article-main_text-wrapper h2, .bottom");

// 交差した時の処理
const doWhenIntersect = function (entries) {
    entries.forEach(entry => {
        let targetId = entry.target.id;
        let targetNo = targetId.match(/h2(?:-bottom)?-(\d+)/)?.[1];
        let headerId = "h2-" + targetNo;
        let headerBottomId = "h2-bottom-" + targetNo;
        let outlineId = "outline-" + targetNo;
        if (entry.isIntersecting) {
            document.getElementById(targetId).classList.add("on");
            document.getElementById(outlineId).classList.add("on");
        }
        else {
            targetY = document.getElementById(targetId).getBoundingClientRect().top + headerHeight;
            if (targetId === headerId && !document.getElementById(headerBottomId).classList.contains("on")) {
                if (targetY * document.getElementById(headerBottomId).getBoundingClientRect().top > 0) {
                    document.getElementById(outlineId).classList.remove("on");
                }
            }
            else if (targetId === headerBottomId && !document.getElementById(headerId).classList.contains("on")) {
                if (targetY * document.getElementById(headerId).getBoundingClientRect().top > 0) {
                    document.getElementById(outlineId).classList.remove("on");
                }
            }
            document.getElementById(targetId).classList.remove("on");
        }
        // 画面上の一番上/下の要素
        let Outlines = document.querySelectorAll(".article-outline li");
        let OnOutlines = document.querySelectorAll(".article-outline li.on");
        for (let i = 0; i < Outlines.length; i++) {
            Outlines[i].classList.remove("top");
            Outlines[i].classList.remove("bottom");
        }
        if (OnOutlines.length !== 0) {
            OnOutlines[0].classList.add("top");
            OnOutlines[OnOutlines.length - 1].classList.add("bottom");
        }
    });
}

// 初期化
const observer = new IntersectionObserver(doWhenIntersect, options);

// 監視を開始
items.forEach(item => {
    observer.observe(item);
});