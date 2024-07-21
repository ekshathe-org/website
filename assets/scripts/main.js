function main() {
  setActivePage();
}

function setActivePage() {
  const links = document.querySelectorAll(".nav ul li a");
  const navpath = window.location.pathname.split("/")[1];

  for (link of links) {
    if (navpath == link.getAttribute("href").split("/")[1]) {
      link.setAttribute("aria-current", "page");
    }
  }
}

main();
