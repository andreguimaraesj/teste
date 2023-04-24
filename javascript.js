axios.defaults.headers.common['Authorization'] = 'TumGlLJcWaHWS4AyRV2AOZCy';


let quizz_config = {};

const isTitle = (title) => title.length >= 20 && title.length <= 65;
const isUrl = (url) => {
  const regexURL =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  return regexURL.test(url);
};
const isQuestionNumber = (questionNumber) =>
  Number(questionNumber) >= 3 && /^[0-9]+$/.test(questionNumber);
const isLevelNumber = (levelNumber) =>
  Number(levelNumber) >= 2 && /^[0-9]+$/.test(levelNumber);

const initValidations = {
  title: isTitle,
  image: isUrl,
  questions: isQuestionNumber,
  levels: isLevelNumber,
};

function toggleHideElement(element) {
  element.classList.toggle("hide");
}

function showCreateQuizzQuestions() {
  toggleHideElement(document.querySelector(".quizz-init"));
  toggleHideElement(document.querySelector(".quizz-questions"));

  renderQuestionForms();
}

function showCreateQuizz() {
  toggleHideElement(document.querySelector(".container-quizz-list"));
  toggleHideElement(document.querySelector(".container-create-quizz"));
}

function setQuizzConfigInitQuizz(elements) {
  quizz_config.image = elements["image"].value;
  quizz_config.levels = Array.from(
    {
      length: Number(elements["levels"].value),
    },
    () => ({
      title: "",
      image: "",
      text: "",
      minValue: 0,
    })
  );
  quizz_config.questions = Array.from(
    {
      length: Number(elements["questions"].value),
    },
    () => ({
      title: "",
      color: "",
      answers: [
        {
          text: "",
          image: "",
          isCorrectAnswer: true,
        },
      ].concat(
        Array.from({ length: 3 }, () => ({
          text: "",
          image: "",
          isCorrectAnswer: false,
        }))
      ),
    })
  );
  quizz_config.title = elements["title"].value;
}

function createInitQuizz(e) {
  e.preventDefault();
  const elements = [...e.target.elements].filter(
    (element) => element.type !== "submit"
  );

  const valid = elements.filter((element) => {
    return !initValidations[element.name](element.value);
  });

  if (valid.length !== 0) return alert("Preencha os dados corretamente");

  setQuizzConfigInitQuizz(e.target.elements);
  showCreateQuizzQuestions();
}

const formInit = document.querySelector("#form-init");

formInit.onsubmit = (e) => {
  createInitQuizz(e);
};

const formQuestion = document.querySelector("#form-question");

const isQuestionText = (text) => text.trim().length >= 20;

const isAnswerText = (text) => text.trim().length > 0;

const isBackgroundColor = (color) => {
  const permittedChars = "0123456789ABCDEFabcdef";
  color = color.trim();
  color = color.split("");
  if (color[0] !== "#") return false;
  if (!(color.length === 7)) return false;
  for (let i = 1; i < color.length; i++)
    if (!permittedChars.includes(color[i])) return false;

  return true;
};

const isCorrectAnswer = (answer) => {
  console.log(answer);
  return isAnswerText(answer.text) && isUrl(answer.image);
};

const isAnswer = (answers) => {
  if (!isCorrectAnswer(answers[0])) return false;
};

const buzzquizzInput = ({ placeholder, type = "text", dataName, dataTest }) => `
  <input 
    placeholder='${placeholder}'
    class='buzzquizz-input'
    type=${type}
    data-name=${dataName}
    data-test=${dataTest}
    value=''
  />
`;

const questionForm = ({ i }) => `
    <div class='container ${
      i === 1 ? "" : "close"
    }' data-identifier="question-form">
      <div class='container-title'>
        <h1 class='title'>Pergunta ${i}</h1>
        <ion-icon onclick='expandButton(this)' data-identifier="expand" class='icon' name="create-outline"></ion-icon>
      </div>
      <div class='question'>
        ${buzzquizzInput({
          placeholder: "Texto da pergunta",
          dataName: "title",
          dataTest: "question-input",
        })}
        ${buzzquizzInput({
          placeholder: "Cor de fundo da pergunta",
          dataName: "background",
          dataTest: "question-color-input",
        })}
      </div>
      <div class='answers'>
        <div class='correct'>
          <h1 class='title'>Resposta correta</h1>
          ${buzzquizzInput({
            placeholder: "Resposta correta",
            dataName: "text",
            dataTest: "correct-answer-input",

          })}
          ${buzzquizzInput({ 
            placeholder: "URL da imagem", 
            dataName: "image",
            dataTest: "correct-img-input",
         })}
        </div>
        <div class='incorrect'>
          <h1 class='title'>Resposta incorreta</h1>
          ${buzzquizzInput({
            placeholder: "Resposta incorreta 1",
            dataName: "text",
            dataTest: "wrong-answer-input",
          })}
          ${buzzquizzInput({
            placeholder: "URL da imagem 1",
            dataName: "image",
            dataTest: "wrong-img-input",
          })}
          ${buzzquizzInput({
            placeholder: "Resposta incorreta 2",
            dataName: "text",
            dataTest: "wrong-answer-input",
          })}
          ${buzzquizzInput({
            placeholder: "URL da imagem 2",
            dataName: "image",
            dataTest: "wrong-img-input",
          })}
          ${buzzquizzInput({
            placeholder: "Resposta incorreta 3",
            dataName: "text",
            dataTest: "wrong-answer-input",
          })}
          ${buzzquizzInput({
            placeholder: "URL da imagem 3",
            dataName: "image",
            dataTest: "wrong-img-input",
          })}
        </div>
      </div>
    </div>
`;

function scrollElementExpandButton(e) {
  e.scrollIntoView();
  if (window.scrollY) window.scroll(0, window.scrollY - 80);
}

function expandButton(e) {
  const parent = e.parentNode.parentNode;
  const form = document.querySelectorAll("#form-question > .container");
  form.forEach((element) => {
    element.classList.add("close");
  });
  parent.classList.remove("close");

  scrollElementExpandButton(parent);
}

function renderQuestionForms() {
  const formQuestion = document.querySelector("#form-question");

  formQuestion.innerHTML = Array.from(
    { length: quizz_config.questions.length },
    (_, i) => questionForm({ i: i + 1 })
  ).join("");

  formQuestion.innerHTML += `
    <button data-test="go-create-levels" class='buzzquizz-button'>Prosseguir pra criar níveis</button>
  `;
}

function isQuestionForm(questionForm) {
  const question = {};
  const title = questionForm.querySelector('input[data-name="title"]');
  const background = questionForm.querySelector(
    'input[data-name="background"]'
  );
  let answers = {
    texts: questionForm.querySelectorAll('input[data-name="text"]'),
    images: questionForm.querySelectorAll('input[data-name="image"]'),
  };
  answers = Array.from({ length: answers.images.length }, (_, i) => ({
    text: answers.texts[i],
    image: answers.images[i],
  }));

  if (!(isQuestionText(title.value) && isBackgroundColor(background.value)))
    return false;

  question.title = title.value;
  question.color = background.value;

  if (!(isAnswerText(answers[0].text.value) && isUrl(answers[0].image.value)))
    return false;

  let min = 0;

  question.answers = [
    {
      text: answers[0].text.value,
      image: answers[0].image.value,
      isCorrectAnswer: true,
    },
  ];

  for (let i = 1; i < answers.length; i++) {
    if (!isAnswerText(answers[i].text.value) && isUrl(answers[i].image.value))
      return false;
    if (isAnswerText(answers[i].text.value) && !isUrl(answers[i].image.value))
      return false;
    if (isAnswerText(answers[i].text.value) && isUrl(answers[i].image.value)) {
      min++;
      question.answers.push({
        text: answers[i].text.value,
        image: answers[i].image.value,
        isCorrectAnswer: false,
      });
    }
  }

  if (min < 1) return false;

  return question;
}

function showQuizzLevels() {
  document.querySelectorAll(".container-create-quizz > div").forEach((page) => {
    page.classList.add("hide");
  });
  document.querySelector(".quizz-levels").classList.remove("hide");
  renderLevelsForm();
}

formQuestion.onsubmit = (e) => {
  e.preventDefault();
  const questions = [];
  const questionForms = e.target.querySelectorAll(
    '.container[data-identifier="question-form"]'
  );

  for (let i = 0; i < questionForms.length; i++) {
    const question = isQuestionForm(questionForms[i]);
    if (!question) {
      alert("Preencha os dados corretamente");
      return;
    }
    questions.push(question);
  }
  quizz_config.questions = questions;
  showQuizzLevels();
};

const formLevel = document.querySelector("#form-level");

const buzzquizzTextArea = ({ placeholder, dataName = "" }) => `
  <textarea 
    class='buzzquizz-input' 
    placeholder='${placeholder}'
    data-name='${dataName}'
  ></textarea>
`;

function levelForm({ i }) {
  return `
    <div class='container ${i === 1 ? "" : "close"}' >
      <div class='container-title'>
        <h1 class='title'>Nível ${i}</h1>
        <ion-icon onclick='expandButton(this)' data-identifier="expand" class='icon' name="create-outline"></ion-icon>
      </div>
      ${buzzquizzInput({ placeholder: "Título do nível", dataName: "title" })}
      ${buzzquizzInput({
        placeholder: "% de acerto mínima",
        dataName: "min-value",
      })}
      ${buzzquizzInput({
        placeholder: "URL da imagem do nível",
        dataName: "image",
      })}
      ${buzzquizzTextArea({
        placeholder: "Descrição do nível",
        dataName: "text",
      })}
    </div>
  `;
}

function renderLevelsForm() {
  formLevel.innerHTML = "";
  quizz_config.levels.forEach((level, i) => {
    formLevel.innerHTML += levelForm({ i: i + 1 });
  });
  formLevel.innerHTML += `
    <button class='buzzquizz-button'>Finalizar Quizz</button>
  `;
}

const isLevelTitle = (text) => text.trim().length >= 10;

const isLevelMinValue = (number) => number >= 0 && number <= 100;

const isDescriptionLevel = (text) => text.trim().length >= 30;

function isLevelForm(levelForm) {
  const title = levelForm.querySelector('input[data-name="title"]');
  const image = levelForm.querySelector('input[data-name="image"]');
  const text = levelForm.querySelector('textarea[data-name="text"]');
  const minValue = levelForm.querySelector('input[data-name="min-value"]');
  console.log(title);
  if (
    !(
      isLevelTitle(title.value) &&
      isLevelMinValue(minValue.value) &&
      isDescriptionLevel(text.value) &&
      isUrl(image.value)
    )
  )
    return false;

  return {
    title: title.value,
    image: image.value,
    text: text.value,
    minValue: Number(minValue.value),
  };
}

function toggleDisable(e) {
  console.log(e);
  if (e.disabled === true) {
    e.disabled = false;
  } else {
    e.disabled = true;
  }
}

let formLevelWaiting = true;

formLevel.onsubmit = (e) => {
  e.preventDefault();
  if (formLevelWaiting) {
    formLevelWaiting = false;
    let levels = [];
    const inputsContainer = formLevel.querySelectorAll(".container");

    for (let i = 0; i < inputsContainer.length; i++) {
      const level = isLevelForm(inputsContainer[i]);

      if (!level) {
        alert("Preencha os dados corretamente");
        levels = [];
        formLevelWaiting = true;
        return;
      }

      levels.push(level);
    }

    const minValues = levels.map(({ minValue }) => minValue);
    const UniqueMinValues = minValues.filter(
      (value, i, array) => array.indexOf(value) === i
    );

    if (minValues.length !== UniqueMinValues.length) {
      alert("Preencha os dados corretamente");
      formLevelWaiting = true;
      return;
    }

    if (!minValues.includes(0)) {
      alert("Preencha os dados corretamente");
      formLevelWaiting = true;
      return;
    }

    quizz_config.levels = levels;
    createQuizzAPI((res) => {
      const items = localStorage.quizzes
        ? JSON.parse(localStorage.quizzes)
        : [];
      items.push(res.data);
      localStorage.setItem("quizzes", JSON.stringify(items));
      showSuccessQuizz();
      formLevelWaiting = true;
    });
  }
};

function showSuccessQuizz() {
  document.querySelector(".quizz-levels").classList.add("hide");
  const quizzSuccess = document.querySelector(".quizz-success");
  quizzSuccess.classList.remove("hide");
  let quizz = JSON.parse(localStorage.quizzes);
  quizz = quizz[quizz.length - 1];
  quizzSuccess.querySelector("img").src = quizz.image;
  quizzSuccess.querySelector("h1").textContent = quizz.title;
}

function viewQuizz() {
  let quizz = JSON.parse(localStorage.quizzes);
  quizz = quizz[quizz.length - 1];
  quizzToAnswer = quizz;
  loadQuizzScreen();
}

function backToHome() {
  window.location.reload();
}

function createQuizzAPI(fn) {
  const URL = "https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes";

  axios
    .post(URL, quizz_config)
    .then((res) => {
      fn(res);
    })
    .catch((e) => console.log(e));
}

showCreateQuizz();

function reload() {
    window.location.reload();
  }

  function directThirdPage() {
    document.querySelector(".container-quizz-list").classList.add("hide");
    document.querySelector(".container-create-quizz").classList.remove("hide");
}
  
let allQuizzes = {};

function directSecondPage(id) {
    quizzToAnswer = allQuizzes[id];
    loadQuizzScreen();
}

const request = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");

request.then(listServerQuizzes);

let userQuizzes;
let userIDs = [];

if (localStorage.length !== 0) {
    userQuizzes = JSON.parse(localStorage.quizzes);
    userIDs = userQuizzes.map((quizz) => {return quizz.id});

    document.querySelector(".no-quizzes").classList.add("hide");
    document.querySelector(".your-quizzes").classList.remove("hide");

    let listUser = "";
    for (let card of userQuizzes) {
        listUser += `<figure data-test="my-quiz" onclick="directSecondPage(${card.id})" data-identifier="quizz-card">
                         <img src="${card.image}" alt="Imagem não suportada ou indisponível"/>
                         <figcaption>
                             ${card.title}
                         </figcaption>
                     </figure>`;

        allQuizzes[card.id] = card;
    }
    document.querySelector(".your-quizzes div").innerHTML = listUser;
}

function listServerQuizzes(response) {
    let listAll = "";
    for (let card of response.data) {
        if (!userIDs.includes(card.id)) {
            listAll += `<figure data-test="others-quiz" onclick="directSecondPage(${card.id})" data-identifier="quizz-card">
                            <img src="${card.image}" alt="Imagem não suportada ou indisponível"/>
                            <figcaption>
                                ${card.title}
                            </figcaption>
                        </figure>`;

            allQuizzes[card.id] = card;
        }
    }
    document.querySelector(".all-quizzes div").innerHTML = listAll;
}

function comparador() {
    return Math.random() - 0.5;
  }
  

  let idDelayScroll = 0;
  let flagScroll = false;
  
  let boxQuizz;
  let correctQuizzAnswers = [];
  let numberOfQuestions = 0;
  let numberOfQuestionsAnswered = 0;
  let scoreQuizz = 0;
  let quizzToAnswer = 0;
  
  // RENDER SCREEN QUIZZ FUNCTIONS:

  // Function to Quizz Page
  function loadQuizzScreen() {

    correctQuizzAnswers = [];
    numberOfQuestions = quizzToAnswer.questions.length;
    numberOfQuestionsAnswered = 0;
    scoreQuizz = 0;
  
    const screenQuizz = document.querySelector(".container-answer-quizz");
    screenQuizz.classList.remove("hide");
  
    const screenList = document.querySelector(".container-quizz-list");
    screenList.classList.add("hide");
    const screenCreate = document.querySelector(".container-create-quizz");
    screenCreate.classList.add("hide");
  
    renderQuizzHeader(screenQuizz);
  
    boxQuizz = document.querySelector(".box-quizz-questions");
    quizzToAnswer.questions.forEach(renderQuestions);
    preLoadResult();
  }
  

  function renderQuizzHeader(screenQuizzElement) {
    screenQuizzElement.innerHTML = `
    <div data-test="banner" class="quizz-header" id="quizz-header">
      <h2 class="quizz-title">${quizzToAnswer.title}</h2>
    </div>
    <section data-test="question" class="box-quizz-questions">
    </section>
    `;
  
    // Header Quizz background properties
    const imgBackground = document.getElementById("quizz-header");
    imgBackground.style.background = `linear-gradient(rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url(${quizzToAnswer.image})`;
    imgBackground.style.backgroundRepeat = "no-repeat";
    imgBackground.style.backgroundAttachment = "scroll";
    imgBackground.style.backgroundSize = "cover";
    imgBackground.style.backgroundPosition = "center";
  
    // Scroll to page header
    screenQuizzElement.firstElementChild.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
  

  function renderQuestions(question, questionNumber) {

    boxQuizz.innerHTML += `
    <div data-test="question" class="quizz-question unanswered-question">
      <div data-test="question-title" class="question-header "
      style="background-color: ${question.color};">
        <h3 class="question-title" data-identifier="question">${question.title}</h3>
      </div>
      <div class="box-question-options">      
      </div>
    </div>
    `;
  
    const correctQuestionAnswers = [];
    // Render Question Options
    const boxOptions = boxQuizz.lastElementChild.querySelector(
      ".box-question-options"
    );
    question.answers.sort(comparador).forEach((option, optionNumber) => {
      boxOptions.innerHTML += `
      <div data-test="answer" class="question-option ${questionNumber} " onclick="selectOptionQuestion(this)" data-identifier="answer">
        <img class="option-img" src=${option.image} alt="Imagem não suportada ou indisponível" />
        <span data-test="answer-text" class="option-text">${option.text}</span>
      </div>
      `;
      if (option.isCorrectAnswer) {
        correctQuestionAnswers.push(optionNumber);
      }
    });
    // Update array of correct answers
    correctQuizzAnswers.push(correctQuestionAnswers);
  }
  
  // Function pre load HTML Result
  function preLoadResult() {
    boxQuizz.innerHTML += `
    <div class="box-answer hide">
      <div class="quizz-answer">
        <div data-test="level-title" class="answer-header">
          <h3 class="answer-title">
          </h3>
        </div>
        <div class="answer-body">
          <img data-test="level-title" src="" alt="Imagem não suportada ou indisponível" class="answer-img" />
          <span data-test="level-text" class="answer-text">
          </span>
        </div>
      </div>
  
      <div class="button-group">
        <button data-test="restart" onclick="loadQuizzScreen()" class="buzzquizz-button btn-restart">Reiniciar Quizz</button>
        <button data-test="go-home" onclick="backToHome()" class="buzzquizz-link">Voltar pra home</button>
      </div>
    </div>
    `;
  }
  
  // **********************************
  // Function to render RESULT after complete quizz
  // **********************************
  function renderResult() {
    let userLevel = 0;
  
    quizzToAnswer.levels.forEach((level, index) => {
      if (scoreQuizz >= level.minValue) {
        userLevel = index;
      }
    });
  
    document.querySelector(".answer-title").innerHTML = `
      <span class="answer-level-score" data-identifier="quizz-result">${scoreQuizz}</span>% de acerto:
      <span class="answer-level-text">${quizzToAnswer.levels[userLevel].title}</span>  
      `;
    document.querySelector(".answer-img").src =
      quizzToAnswer.levels[userLevel].image;
    document.querySelector(".answer-text").innerHTML =
      quizzToAnswer.levels[userLevel].text;
  }
  
  // **********************************
  // USER`S ACTIONS FUNCTIONS:
  // **********************************
  // Action when User select a option
  // **********************************
  function selectOptionQuestion(elementOption) {
    const boxOptions = elementOption.parentElement;
    const elementQuestion = boxOptions.parentElement;
  
    // Reset auto scroll: Disable auto-scroll if user click before automatic Scroll.
    if (flagScroll) {
      flagScroll = false;
      clearInterval(idDelayScroll);
    }
  
    // Allow only one attempt fo question
    if (elementQuestion.classList.contains("answered-question")) {
      return;
    } else {
      elementQuestion.classList.remove("unanswered-question");
      elementQuestion.classList.add("answered-question");
      numberOfQuestionsAnswered++;
  
      // Get the question of the selected option
      let questionSelected;
      for (let i = 0; i < numberOfQuestions; i++) {
        if (elementOption.classList.contains(i)) {
          questionSelected = i;
          break;
        }
      }
  
      // Check question correction
      const optionsElements = boxOptions.querySelectorAll(".question-option");
      optionsElements.forEach((element, optionNumber) => {
        // Show correct and wrong answer
        if (correctQuizzAnswers[questionSelected].includes(optionNumber)) {
          element.classList.add("right-option");
          if (element === elementOption) {
            scoreQuizz++;
          }
        } else {
          element.classList.add("wrong-option");
        }
  
        // Apply opactity in inselected option
        if (element !== elementOption) {
          element.classList.add("unselected-option");
        }
      });
  
      let elementToScroll;
  
      // Check if Quizz is complete
      if (numberOfQuestionsAnswered === numberOfQuestions) {
        scoreQuizz = Math.round((scoreQuizz / numberOfQuestions) * 100);
        // Show Result
        renderResult();
        const elementResult = document.querySelector(".box-answer");
        elementResult.classList.remove("hide");
  
        // Scroll to result box
        elementToScroll = elementResult;
      } else {
        // Scroll to firt unanswered-question
        elementToScroll = document.querySelector(".unanswered-question");
      }
      idDelayScroll = setInterval(showNextQuestion, 2000, elementToScroll);
      flagScroll = true;
    }
  }
  
  // Scroll to Next Question After 2s
  function showNextQuestion(elementToShow) {
    elementToShow.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    flagScroll = false;
    clearInterval(idDelayScroll);
  }
  






/*

let boxTodosOsQuizzes = document.querySelector('.todosQuizzes');
let quizzClicado = {};







let todosQuizzesDoServidor;
function renderizaQuizzesDoServidor(){
    todosQuizzesDoServidor = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");
    todosQuizzesDoServidor.then((quiz) =>{
        todosQuizzesDoServidor = quiz.data;
       console.log(todosQuizzesDoServidor);

        for(let i = 0; i < todosQuizzesDoServidor.length; i++){
            boxTodosOsQuizzes.innerHTML += `<div class="quizzDoServidor" onclick="abreQuizz(${todosQuizzesDoServidor[i].id})">
                <div class="tituloDeCadaQuizzDoServidor">${todosQuizzesDoServidor[i].title}</div>
                <img class="imagemQuizzesDoServidor"  src="${todosQuizzesDoServidor[i].image}" >
            </div>`
        }
    } )
};

function abreQuizz(id){
    axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${id}`)
    .then((qui)=> {
        quizzClicado = qui.data;
        console.log(quizzClicado);

    }) 
}



renderizaQuizzesDoServidor();

*/