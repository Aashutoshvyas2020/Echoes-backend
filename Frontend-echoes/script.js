

const button = document.getElementById('enter')
const tile = document.getElementById('holdingtile')
const allInputs = document.getElementsByClassName('input')
const name1 = document.getElementById('name')
const phone_number = document.getElementById('number')
const num = document.getElementById('number')
const reason = document.getElementById('reason')
const character = document.getElementById('character')
console.log(allInputs)
reasonRotation = true
const reasons = [
  "Ancient civilizations",
  "Mechanical engineering",
  "Space exploration",
  "Greek philosophy",
  "World War II",
  "Art and creativity",
  "Moral philosophy",
  "Political strategy",
  "Psychology of fear",
  "Leadership lessons",
  "Scientific discoveries",
  "The Roman Empire",
  "Economic systems",
  "Ethics and power",
  "Astronomy and stars",
  "Innovation and progress",
  "Language and culture",
  "Architecture and design",
  "Climate and nature",
  "Philosophy of time",
  "The human brain",
  "Music and emotion",
  "War and peace",
  "Religion and belief",
  "Mythology and gods",
  "Technology and society",
  "Revolutions and change",
  "Art of persuasion",
  "History of science",
  "Education and learning",
  "Freedom and control",
  "Renaissance art",
  "Medicine and healing",
  "Human behavior",
  "Transportation history",
  "The future of AI",
  "Cultural evolution",
  "The meaning of life",
  "Civil rights movements",
  "Scientific ethics",
  "Space colonization",
  "Engineering marvels",
  "Creative thinking",
  "Moral dilemmas",
  "Human innovation",
  "The Industrial Revolution",
  "Historical mysteries",
  "Psychology of leadership",
  "Exploration and discovery",
  "Social change",
  "Inventions that failed"
];




const validateNumber = (input) => /^\+1\s?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(input);
button.addEventListener('click', () => {

    if (((name1.value).length) >= 2 || validateNumber((num.value)) == true || (reason.value) != ""){
        button.disabled = true
        reasonRotation = false
        tile.classList.add('green')
        setTimeout(() => tile.classList.remove('green'), 800)
        button.disabled = false
    }


    if (((name1.value).length) < 2 || validateNumber((num.value)) == false || (reason.value) == "") {

        button.disabled = true
        tile.classList.add('red')
        setTimeout(() => tile.classList.remove('red'), 800)
        button.disabled = false



        button.classList.add('shake')
        button.disabled = true
        setTimeout(() => button.classList.remove('shake'), 350)
        button.disabled = false
    }
})


num.addEventListener('keydown', (event) => {
    const input = event.key
    const isLetter = /[a-zA-Z]/.test(input);
    const specialkeys = [
        "Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowUp", 
        "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp",
         "PageDown", "Insert", "Clear", "Shift", "Control", "Alt", "Meta"]

    const isSpecialKey = specialkeys.includes(input);

    if (isLetter &&  !isSpecialKey) {
        event.preventDefault()

        
        tile.classList.add('red')
        setTimeout(() => tile.classList.remove('red'), 800)
        



        num.classList.add('shake')
        
        setTimeout(() => num.classList.remove('shake'), 350)
        

    }


})

setInterval(() => reason.placeholder = reasons[Math.floor(Math.random() * reasons.length)], 3000)



async function MakeCall(url, username, phone_number, reason, character) {
    try{
        let callbody = 

        {
                    "name": username,
                    "phone_number": phone_number,
                    "reason":reason,
                    "character":character
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(callbody)
        })
        

        if (!response.ok){
            console.log("Error, try again")
        }

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.log("error")
    
    }
}





button.addEventListener('click', () =>{

    MakeCall("https://echoes-backend-z2sf.onrender.com",name1.value, phone_number.value, reason.value, character.value).then(data => 
    {
    console.log(data)
    })
    
})





