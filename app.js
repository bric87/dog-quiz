let newDogURL;
let allBreeds=[];
let choices = [];
let answer;
let score = 0;
let questions = 5;
let questionCount = 0;
let tryCount = 0;

function ImgError(){
        console.log('404 Error. Getting a new image');
        getRandomDog(); 
}

const displayQuizResults = () => {

    //display score button to show results
    let displayResult = document.createElement('button');
    displayResult.setAttribute('id', 'results');
    displayResult.textContent = 'Show Results';
    document.getElementById('score').appendChild(displayResult);
    



    document.getElementById('results').addEventListener('click', (()=>{
        //clear img and buttons
        document.getElementById('new-quiz').style.display = 'block';
        document.getElementById('img-container').innerHTML ='';
        document.getElementById('buttons').innerHTML = '';
        document.getElementById('next-question').style.display='none';
        questionCount = 0;

        //display score
        document.getElementById('score').classList.add('final');
        document.getElementById('score').textContent = `${(score/questions)*100}%`;
        score = 0;
    }));


};

const nextQuestion = () => {
    //clear answer and choices js
    choices = [];
    answer = '';

    document.getElementById('next-question').style.display = 'block';
    document.getElementById('next-question').addEventListener('click', getRandomDog);

}

const getResult = (e) => {
    let userAnswer = e.target.value;
    if(userAnswer === answer){
       //document.querySelector(`button[value="${userAnswer}"]`).style.backgroundColor = 'green';
        document.querySelector(`button[value="${userAnswer}"]`).classList.add('correct');
        score++;
    } else {
        // document.querySelector(`button[value="${userAnswer}"]`).style.backgroundColor = 'red';
        // document.querySelector(`button[value="${answer}"]`).style.backgroundColor = 'green';

        document.querySelector(`button[value="${userAnswer}"]`).classList.add('incorrect');
        document.querySelector(`button[value="${answer}"]`).classList.add('correct');
    }

    //disable buttons and remove eventlisteners
    let disableButtons = document.querySelectorAll('#buttons button');
    disableButtons.forEach((item)=>{
        item.removeEventListener('click', getResult);
        item.classList.remove('hover');
        item.classList.add('noPointer');
        item.classList.add('greyed-out');
    });

    //increase question count and display results or display next question button
    questionCount++;    
    questionCount === 5 ? displayQuizResults() : nextQuestion();
    
}

const renderDog = (url) =>{

    

    //render Image
    let breedImg = document.createElement('img');
    breedImg.setAttribute('src', url);

    breedImg.setAttribute('onerror','ImgError(this)');
    breedImg.style.width = '400px';
    breedImg.style.height = '400px';
    breedImg.style.objectFit = 'contain';
    breedImg.style.overflow = 'hidden';
    document.getElementById('img-container').appendChild(breedImg);

    //render buttons
    let buttonContainer = document.getElementById('buttons');
    choices.forEach((choice, index)=>{
        let button = document.createElement('button');
        button.textContent = choice.toUpperCase();
        button.value = choice;
        button.classList.add('hover');
        buttonContainer.appendChild(button);
        button.addEventListener('click', getResult);
    })

}

const shuffleChoices = () => {
    //clone choice array
    let tempChoices = choices.map((choice)=>{return choice});

    //shuffle array
    let randoms = [];
    choices.forEach((choice, index)=>{
        let uniqueRand = true;
        while(uniqueRand){
            let randNum = Math.floor(Math.random()*tempChoices.length);
            if(!randoms.includes(randNum)){
                choices[randNum] = tempChoices[index];
                randoms.push(randNum);
                uniqueRand = false;
            }
        }
    })

}

const getChoices = (answer) =>{
    //push answer to choices
    choices.push(answer);

    //get choices that do not include answer and have no duplicates
    let i = 0;
    while(i<3){
        let newBreed = allBreeds[Math.floor(Math.random()*allBreeds.length)];

        //check choices for newBreed
        if(choices.includes(newBreed)){
            continue;
        } else {
            choices.push(newBreed);
            i++;
        }
       
    }
}


const parseAllBreeds = (breedsObj) => {
    for(let breed in breedsObj){
        if(breedsObj[breed].length < 1){
            allBreeds.push(breed)
        } else {
            for(let subBreed of breedsObj[breed]){
                allBreeds.push(`${subBreed} ${breed}`);
            }
        }
    }
    //console.log(allBreeds);
};

const getRandomDog = async () =>{
    //clear img and buttons
    document.getElementById('new-quiz').style.display = 'none';
    document.getElementById('img-container').innerHTML ='';
    document.getElementById('buttons').innerHTML = '';
    document.getElementById('next-question').style.display='none';
    document.getElementById('score').textContent = '';
    document.getElementById('score').classList.remove('final');

    //clear answer and choices js
    choices = [];
    answer = '';
    

    //fetch new dog
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if(response.status === 200){
        const data = await response.json();
        //console.log(data.message);
    
        let answerBreed = data.message.split('/')[4];
        if(answerBreed.includes('-')){
            let [subBreed, breed] = answerBreed.split('-');
            answer = `${breed} ${subBreed}`;
        } else {
            answer = answerBreed;
        }

        getChoices(answer);
        shuffleChoices();
        renderDog(data.message);

	} else {
        console.log('Failed Response');
	}



 
    
}

const getAllBreeds = async () => {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();
    parseAllBreeds(data.message);
}




getAllBreeds();
let newQuiz = document.getElementById('new-quiz');
newQuiz.addEventListener('click',getRandomDog);

