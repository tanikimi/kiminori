const section = document.getElementById("list").dataset.section;
const select = document.getElementById("select");

const filter = document.getElementsByClassName("filter");
for (let i = 0; i < filter.length; i++) {
    filter[i].classList.remove("select");
}

switch (section) {
    case "Works":
    case "News":
    case "Blog":
        select.value = "";
        document.getElementById("filter-All").classList.add("select");
        break;
    default:
        document.getElementById("filter-" + section).classList.add("select");
        select.value = "filter-" + section;
        break;
}

select.onchange = function () {
    document.getElementById(select.value).click();
}