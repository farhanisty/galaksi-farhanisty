class SectionRegister {
  element;
  path;

  constructor(element, path) {
    this.element = element;
    this.path = path;
  }
}

class LayoutManager {
  sections = [];
  planeElement;

  constructor(planeElement) {
    this.planeElement = planeElement;
  }

  registerSection(section) {
    this.sections.push(section);
  }

  render() {
    document.body.style.height = `${((this.sections.length * 2) + 1) * window.innerHeight - (window.innerHeight * 30 / 100)}px`;

    window.addEventListener("scroll", () => {
      let counter = 1;

      for(const section of this.sections) {
        if(window.scrollY > window.innerHeight * (counter - 1) && window.scrollY < window.innerHeight * counter) {
          this.planeElement.style.offsetPath = `path('${section.path.getAttribute('d')}')`;
          this.planeElement.style.offsetDistance = `${(window.scrollY % window.innerHeight) / (window.innerHeight) * 100}%`;
        }

        if(window.innerHeight * counter < window.scrollY && window.innerHeight * (counter + 1) > window.scrollY) {
          section.element.classList.add("active");
        } else {
          section.element.classList.remove("active");
        }

        counter += 2;
      }
    })

  }
}

const pageFarhannivta = document.querySelector("#page-farhannivta");

const layoutManager = new LayoutManager(document.getElementById("plane"));

layoutManager.registerSection(new SectionRegister(document.querySelector("#page-farhannivta"), document.getElementById("planet-path-1")));
layoutManager.registerSection(new SectionRegister(document.querySelector("#page-project"), document.getElementById("planet-path-2")));
layoutManager.registerSection(new SectionRegister(document.querySelector("#page-challenge"), document.getElementById("planet-path-2")));

layoutManager.render();
