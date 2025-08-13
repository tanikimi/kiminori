const copyURL = document.getElementById("copyURL");
const url = copyURL.dataset.url;
// クリップボードにコピー
copyURL.addEventListener("click", function () {
    navigator.clipboard.writeText(url).then(
        function () {
            console.log("URL copied to clipboard");
            copyURL.textContent = "Copied!";
            setTimeout(() => {
                copyURL.textContent = "Copy URL";
            }, 2000);
        },
        function (err) {
            console.error("Could not copy text: ", err);
        }
    );
}
);