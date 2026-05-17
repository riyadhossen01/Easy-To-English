const creatElements = (arr) =>{
    const htmlElements = arr.map((el)=> `<span class="btn">${el}</span>`);return htmlElements.join(" ");
};

const manageSpinner = (status) => {
  if(status == true){
    // Loading শুরু — spinner দেখাও, word লুকাও
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  }
  else {
    // Loading শেষ — spinner লুকাও, word দেখাও
    document.getElementById("spinner").classList.add("hidden");       // ✅ add
    document.getElementById("word-container").classList.remove("hidden"); // ✅ remove
  }
};


const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLessons(json.data));
};

const removeActiveClass = () => {
  const lessonbuttons = document.querySelectorAll(".lesson-btn");
  lessonbuttons.forEach((btn) => {
    btn.classList.remove("active");
  });
};

const loadLevelWord = (id) => {
manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`

  fetch(url)
    .then((res) => res.json())
    .then(data => {
      removeActiveClass();
      const clickbtn = document.getElementById(`lesson-btn-${id}`);
      clickbtn.classList.add("active");
      displayLevelWord(data.data)
    });


};

const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`

  const res = await fetch(url);
  const data = await res.json();
  displayWordDetails(data.data);
};

const displayWordDetails = (word) => {
  console.log(word);
  const wordDetailsContainer = document.getElementById("details-container");
  wordDetailsContainer.innerHTML = `
  <div class="">
                    <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
                </div>

                <div class="">
                    <h2 class="font-bold">Meaning</h2>
                    <p>${word.meaning || "Meaning not available"}</p>
                </div>
                <div class="">
                    <h2 class="font-bold">Example</h2>
                    <p>${word.example || "Example not available"}</p>
                </div>
                <div class="">
                    <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
                    <div class="">
                    ${creatElements(word.synonyms || ["Synonym not available"])}

                </div>
                </div>
  
  `;
  document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {

  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `

  
  <div class="col-span-full text-center rounded-xl py-10 space-y-6">

  <img class="mx-auto" src="./assets/alert-error.png" alt="">
            <p class="text-x font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>

        </div>
        `;
      manageSpinner(false);
      return;
  }


  words.forEach((word) => {
    console.log(word);
    const card = document.createElement("div");
    card.innerHTML = ` 
      <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
        <h2 class="font-bold text-2xl ">${word.word ? word.word : "Word not available"}</h2>
        <p class="font-semibold">meaning /pronunciation</p>
        <div class="text-2xl font-medium font-bangla">${word.meaning ? word.meaning : "Meaning not available"} / ${word.pronunciation ? word.pronunciation : "Pronunciation not available"}</div>

        <div class="flex justify-between items-center">
        <button onclick="loadWordDetails(${word.id})" class="btn bg-[#A191FF10] hover:bg-[#A191FF80]"><i class="fa-solid fa-circle-info"></i></button>
        <button class="btn bg-[#A191FF10] hover:bg-[#A191FF80]"><i class="fa-solid fa-volume-high"></i></button>
        </div>


    </div>

        `
    wordContainer.append(card);
  });
manageSpinner(false);

};

const displayLessons = (lessons) => {
  console.log(lessons);

  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");

    btnDiv.innerHTML = `
      <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i>
        Lesson - ${lesson.level_no}
      </button>
    `;

    levelContainer.appendChild(btnDiv);
  }
};

loadLessons();