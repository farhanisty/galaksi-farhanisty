class SectionRegister {
  element;
  path;
  mobilePath;
  onRender = null;
  isRender = false;

  constructor(element, path, mobilePath) {
    this.element = element;
    this.path = path;
    this.mobilePath = mobilePath;
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

    if(window.innerWidth <= 600) {
      this.planeElement.style.offsetPath = `path('${this.sections[0].mobilePath.getAttribute('d')}')`;
    } else {
      this.planeElement.style.offsetPath = `path('${this.sections[0].path.getAttribute('d')}')`;
    }

    window.addEventListener("scroll", () => {
      let counter = 1;

      for(const section of this.sections) {
        if(window.scrollY > window.innerHeight * (counter - 1) && window.scrollY < window.innerHeight * counter) {

          if(window.innerWidth <= 600) {
            this.planeElement.style.offsetPath = `path('${section.mobilePath.getAttribute('d')}')`;
          } else {
            this.planeElement.style.offsetPath = `path('${section.path.getAttribute('d')}')`;
          }
          this.planeElement.style.offsetDistance = `${(window.scrollY % window.innerHeight) / (window.innerHeight) * 100}%`;
        }

        if(window.innerHeight * counter < window.scrollY && window.innerHeight * (counter + 1) > window.scrollY) {
            if(section.onRender) {
              section.onRender();
            }

          section.element.classList.add("active");
        } else {
          section.element.classList.remove("active");
        }

        counter += 2;
      }
    })

  }
}

const astronoutGuiderMessage = document.querySelector("#astronout-guider-container p");

astronoutGuiderMessage.innerText = "Selamat datang di Galaksi Farhanisty";

setTimeout(() => {
  astronoutGuiderMessage.innerText = "Jelajahi Galaksi ini untuk mengenal Farhannivta";
}, 2500);

const astronoutGuiderContainer = document.querySelector("#astronout-guider-container");
astronoutGuiderContainer.classList.add("active");

const pageFarhannivta = document.querySelector("#page-farhannivta");

const layoutManager = new LayoutManager(document.getElementById("plane"));

const challengeSection = new SectionRegister(document.querySelector("#page-challenge"), document.getElementById("planet-path-3"), document.getElementById("mobile-planet-path-3"));

challengeSection.onRender = () => {
  if(window.innerWidth > 600) {
    astronoutGuiderMessage.innerText = "Rata-rata kecepatan mengetikku dalam kosakata Bahasa Indonesia adalah 95 WPM, apakah kamu bisa mengalahkanku?";
  } else {
    astronoutGuiderMessage.innerText = "Roketmu terlalu kecil. Gunakan roket yang lebih besar untuk memulai tantangan!";
  }
  astronoutGuiderContainer.classList.add("active");
}

const farhannivtaSection = new SectionRegister(document.querySelector("#page-farhannivta"), document.getElementById("planet-path-1"), document.getElementById("mobile-planet-path-1"));

farhannivtaSection.onRender = () => {
  astronoutGuiderContainer.classList.remove("active");
}

layoutManager.registerSection(farhannivtaSection);
layoutManager.registerSection(new SectionRegister(document.querySelector("#page-project"), document.getElementById("planet-path-2"), document.getElementById("mobile-planet-path-2")));
layoutManager.registerSection(challengeSection);

layoutManager.render();

window.addEventListener("resize", () => {
  layoutManager.render();
})

const inputText = document.getElementById("wordInput");

class Word {
  element;
  index = 0;
  length;
  isDone = false;
  isCorrect = true;
  resultString = "";
  correctString = "";

  constructor(word) {
    this.element = document.createElement("div");
    this.element.classList.add("word");

    let correctString = "";

    for (const char of word) {
      correctString += char;

      this.element.appendChild(this.createLetterElement(char));
    }

    this.element.appendChild(this.createLetterElement(" "));

    this.length = correctString.length;
    this.correctString = correctString;
  }

  createLetterElement(character) {
    const letterElement = document.createElement("letter");
    letterElement.innerText = character;

    return letterElement;
  }

  addInput(character) {
    if (this.index >= this.length) {
      if(this.index > this.length + 8) {
        return;
      }

      const wrongLetterElement = this.createLetterElement(character);
      wrongLetterElement.classList.add("wrong");
      wrongLetterElement.classList.add("wrong", "extra");

      const childCount = this.element.children.length;

      if (childCount > 1) {
        this.element.insertBefore(wrongLetterElement, this.element.children[childCount - 1]);
      } else {
        this.element.appendChild(wrongLetterElement);
      }
    } else {
      const childrens = this.element.children;
      if (character === childrens[this.index].innerText) {
        childrens[this.index].classList.add("correct");
      } else {
        this.isCorrenct = false;
        childrens[this.index].classList.add("wrong");
      }

      childrens[this.index].classList.remove("active");
      if (this.element.children.length > this.index + 1) {
        childrens[this.index + 1].classList.add("active");
      }
    }

    this.index++;
  }

  backspaceInput() {
    if (this.index === 0) {
      return;
    }

    if (this.index > this.length) {
      this.decrementIndex();
      this.getCurrentChar().remove();
    } else {
      this.getCurrentChar().classList.remove(...this.getCurrentChar().classList);
      this.decrementIndex();
      this.getCurrentChar().classList.remove(...this.getCurrentChar().classList);
      this.getCurrentChar().classList.add("active");
    }

  }

  init() {
    this.getCurrentChar().classList.add("active");
  }

  terminateWord() {
    if (this.index >= this.length) {
      this.element.children[this.element.children.length - 1].classList.remove("active");
    } else {
      this.getCurrentChar().classList.remove("active");
    }
  }

  incrementIndex() {
    this.index++;
  }

  decrementIndex() {
    if (this.index) {
      this.index--;
    }
  }

  getCurrentChar() {
    return this.element.children[this.index];
  }
}

class Text {
  words = [];
  pointer = 0;
  initial = false;
  timerElement;
  isDone = false;
  rightCounter = 0;

  constructor(rootElement, timerElement, words) {
    this.timerElement = timerElement;

    for (const children of words) {
      const word = new Word(children);

      rootElement.appendChild(word.element);

      this.words.push(word);
    }
  }

  addInput(character) {
    if(this.isDone) {
      return;
    }

    if(this.initial === false) {
      this.initial = true;
      const timer = setInterval(() => {
        this.timerElement.innerText = this.timerElement.innerText - 1;
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        this.isDone = true;
        this.timerElement.innerText = `${this.rightCounter * 2 / 5} WPM`;
      }, 30000)
    }

    if (character === ' ') {
      this.getCurrentWord().terminateWord();
      this.incrementPointer();

      if(this.getCurrentWord().isCorrect) {
        this.rightCounter += this.getCurrentWord().length;
      }
      this.getCurrentWord().init();
    } else if (character === 'Backspace') {
      this.getCurrentWord().backspaceInput();
    } else if (character.length != 1) {

    } else {
      this.words[this.pointer].addInput(character);
    }
  }

  getCurrentWord() {
    return this.words[this.pointer];
  }

  incrementPointer() {
    if(this.pointer + 1 < this.words.length) {
      this.pointer++;
    }
  }
}

const words = [
  "langit", "pintu", "senyap", "rumah", "pelangi", "gelombang", "api", "jalan", "angin", "harapan",
  "bunga", "pasir", "laut", "bintang", "buku", "pena", "hujan", "layar", "cermin", "gunung",
  "cahaya", "senyum", "bayangan", "pohon", "kabut", "gitar", "angka", "malam", "nada", "embun",
  "sungai", "pulau", "jendela", "lembah", "waktu", "dahan", "ombak", "kertas", "warna", "suara",
  "awan", "tinta", "kota", "perjalanan", "kereta", "sinar", "langkah", "batu", "pelukan", "keheningan"
];

const text = new Text(document.querySelector("#textList"), document.querySelector("#timer"), words);

text.words[0].init();

inputText.addEventListener("keydown", (e) => {
  text.addInput(e.key);
})
