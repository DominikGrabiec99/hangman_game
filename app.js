const spn_word = document.querySelector('.word');
const spn_wrongLetter = document.querySelector('.wrong-letter');
const div_hangman = document.querySelector('.hangman');
const message = document.querySelector('.message');
const btn_start = document.querySelector('.start');
const btn_reset = document.querySelector('.reset');
const btn_help = document.querySelector('.help');
const input_text = document.querySelector('.scoreBoard__inputText');

const slowinik = [];
const tableWord = [];
const correctWord = [];
const unCorrectWord = [];
let word = '';
let points = 0;
let helpWasUsed = true;
let ifDone = false;
let checkLoseWin = false;

function makeDictionary(){
  if(ifDone){
    return ;
  }
  ifDone = true;
  return fetch('words.txt')
    .then(response => response.text())
    .then(response => {
        let linijki = response.split('\n');

        for(let i = 0; i < linijki.length; i++){
          let slowaLinijka = linijki[i].split(", ");
          for(let j = 0; j< slowaLinijka.length; j++){
            slowinik.push(slowaLinijka[j]) 
          }
        }
    })

}

function choseWord(){
  const random = Math.floor(Math.random() * slowinik.length);
  word = slowinik[random].toUpperCase();

}

function createTableWord(){
  
  for(let i = 0; i< word.length; i++){
    tableWord.push(word.slice(i,i+1))
  }
}

function addWordToSpan(){
  spn_word.textContent = ""
  for(let i =0; i<tableWord.length; i++){
    correctWord.push("_");
  }
  const pomCorrectWord = correctWord.join(" ")
  spn_word.textContent = pomCorrectWord;
}

function searchCorectLetter(event){
//   if(window.innerWidth < 1025){
//     tableWord.forEach((element, index)=>{
//         if(element.toUpperCase() === event.toUpperCase() ){
//           findLetter(event, index)      
//         }
//     })
//     if(!tableWord.find( element => element.toUpperCase() === event.toUpperCase()) 
//     && !unCorrectWord.find( element => element.toUpperCase() == event.toUpperCase())){

//       unCorrectWord.push(event.toUpperCase())
//       const pomUnCorrectWord = unCorrectWord.join(" ")
//       spn_wrongLetter.textContent = pomUnCorrectWord;

//       addHangman();
//     }
// }else{
    tableWord.forEach((element, index) => {
        if(element.toUpperCase() === event.key.toUpperCase() ){
          findLetter(event.key, index)   
        }
    })
    if(!tableWord.find( element => element.toUpperCase() === event.key.toUpperCase()) 
    && !unCorrectWord.find( element => element.toUpperCase() == event.key.toUpperCase())){

      unCorrectWord.push(event.key.toUpperCase())
      const pomUnCorrectWord = unCorrectWord.join(" ")
      spn_wrongLetter.textContent = pomUnCorrectWord;

      addHangman();
    }
  //}
}

function findLetter(letter,index){
  for(let i = 0;  i < correctWord.length; i++){
    if(letter.toUpperCase() === correctWord[i]){
      return;
    }
  }
  correctWord[index] = letter.toUpperCase();
  const pomCorrectWord = correctWord.join(" ");
  spn_word.textContent = pomCorrectWord;
  points++;
  checkWin();
}

function addHangman(){
  const hangman = [];
  const trunk = [];
  let pom = 0;

  hangman.push(div_hangman)
  const hangmanBoardFirst =  document.createElement('div');
  hangmanBoardFirst.classList.add('hangman__board','hangman__board--first' );
  hangman.push(hangmanBoardFirst);

  const hangmanBoardSecond =  document.createElement('div');
  hangmanBoardSecond.classList.add('hangman__board','hangman__board--second' );
  hangman.push(hangmanBoardSecond);

  const hangmanLine =document.createElement('div');
  hangmanLine.classList.add('hangman__line');
  hangman.push(hangmanLine);

  const hangmanHead = document.createElement('div');
  hangmanHead.classList.add('hangman__head', 'head')
  hangman.push(hangmanHead);

  const hangmanTrunk = document.createElement('div');
  hangmanTrunk.classList.add('hangman__trunk')
  hangman.push(hangmanTrunk);

  const hangmanHandLeft = document.createElement('div')
  hangmanHandLeft.classList.add('hangman__hand', 'hangman__hand--left');
  trunk.push(hangmanHandLeft);

  const hangmanHandRights = document.createElement('div')
  hangmanHandRights.classList.add('hangman__hand', 'hangman__hand--rights');
  trunk.push(hangmanHandRights);

   const hangmanLegLeft = document.createElement('div')
  hangmanLegLeft.classList.add('hangman__leg', 'hangman__leg--left');
  trunk.push(hangmanLegLeft);

  const hangmanLegRights = document.createElement('div')
  hangmanLegRights.classList.add('hangman__leg', 'hangman__leg--rights');
  trunk.push(hangmanLegRights);

  for(let i = 0; i <unCorrectWord.length; i++){   
    if(i<5){
      hangman[i].appendChild(hangman[i+1])
    }else{
        hangmanTrunk.appendChild(trunk[pom])
        pom++;
    }
      checkLose(pom);
  }
}

function checkLose(losePoints){
  if(losePoints == 4){
      addMessage('Przegrałeś :(')
      checkLoseWin = true;
      return;
      }
}

function checkWin(){
  if( points === tableWord.length){
    addMessage('Wygrałeś :)')
    checkLoseWin = true;
     return;
  }
}

function addMessage(text){
  message.classList.remove('message--close');
  document.querySelector('.message p').textContent = text;
  const btn_close = document.querySelector('.message__btnClose');
  btn_close.addEventListener('click', function(){
    message.classList.add('message--close');
  })
}

function callBack(event){
  if(checkLoseWin) return;
  console.log('a')
  if(event.keyCode >= 65 && event.keyCode <= 90) searchCorectLetter(event);
  setTimeout(function(){
        input_text.value = '';
  },100)
}

async function startGame(){
  input_text.value ="";
  message.classList.add('message--close')
  tableWord.length = 0;
  correctWord.length = 0;
  unCorrectWord.length = 0;
  word = '';
  points = 0;
  spn_wrongLetter.textContent = '';
  helpWasUsed = false;
  checkLoseWin = false;
  div_hangman.innerHTML = `<div class="hangman__floor"></div>`;

  await makeDictionary();
  choseWord();
  createTableWord();
  addWordToSpan();

  //  if(window.innerWidth > 1025){
    document.body.removeEventListener('keyup',callBack)
    document.body.addEventListener('keyup', callBack);
  //  }

  // input_text.addEventListener('input',function(event){
  //   const letter = input_text.value;
  //   console.log(input_text.value, event.which)
  //    if(input_text.value.keyCode >= 65 && input_text.value.keyCode <= 90){
  //     searchCorectLetter(input_text.value);
  //   }
  //     setTimeout(function(){
  //       input_text.value = '';
  //     },100)
  // });


}


btn_start.addEventListener('click', startGame);

btn_reset.addEventListener('click', startGame);

btn_help.addEventListener('click', function(){
    let helpLetter = '';
    if(helpWasUsed){
      addMessage('Zużyłęś już swoją podpwoiedź albo nie rozpocząłeś nowej gry')
      return;
    } 
    do{
      helpLetter = Math.floor(Math.random() * tableWord.length);
    }while(correctWord.includes(helpLetter))
    const text = `Podpowedź
     Urzyj literki: ${tableWord[helpLetter]}`
    addMessage(text)
    helpWasUsed = true;
})