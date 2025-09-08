// Import helper to map currency to country flags
import { currencyToFlagCode } from './currency-to-flag-code.js'

// Select elements from the DOM
const inputSource = document.getElementById("inputSource");

const SelectElements = document.querySelectorAll(".select select");

const imageSource = document.getElementById("imageSource");
const selectSource = document.getElementById("selectSource");

const imageTarget = document.getElementById("imageTarget");
const selectTarget = document.getElementById("selectTarget");

const buttonSwap = document.getElementById("buttonSwap");

const exchangeRateText = document.getElementById("exchangeRateText");
const buttonConvert = document.getElementById("buttonConvert");

const clickSound = document.getElementById("click-sound")
const swapSound = document.getElementById("swap-sound")

//Declare Variables

let conversionRate = 0;
let sourceCurrencyValue = 0;
let TargetCurrencyValue = 0;

// Swap source and target currencies
buttonSwap.addEventListener("click",()=>{
    swapSound.currentTime = 0;
    swapSound.play();

    //swap select values
    [selectSource.value,selectTarget.value]
    =
    [selectTarget.value,selectSource.value];

    //swap country flag
    [imageSource.src,imageTarget.src]
    =
    [imageTarget.src,imageSource.src]

    //swap conversion rate 
    inputSource.value = TargetCurrencyValue;

    

    updateExchangeRate();
});

// Perform conversion when button is clicked
buttonConvert.addEventListener("click",async() => {
    clickSound.currentTime = 0;
    clickSound.play()

    //when input is less than or equal to 0
    if(inputSource.value <= 0){
        alert("Please enter a valid amount.")
        return; // stop execution
    }

    exchangeRateText.textContent = "Fetching exchange rate, please wait..."

    const selectSourceValue = selectSource.value;
    const selectTargetValue = selectTarget.value;
    
    try{
        const response = await fetch(`https://v6.exchangerate-api.com/v6/487527dec7fa0a90f8a1759b/pair/${selectSourceValue}/${selectTargetValue}`);
        const data = await response.json();
        conversionRate = data.conversion_rate

       
        updateExchangeRate();
    }catch(error){
        console.log("Error fetching exchange rate!",error)
        exchangeRateText.textContent = "Error fetching exchange rate!";
    }
})
// Update exchange rate displayed
function updateExchangeRate(){
    sourceCurrencyValue = parseFloat(inputSource.value).toFixed(2);
    TargetCurrencyValue = (sourceCurrencyValue * conversionRate)

    exchangeRateText.textContent = `${formatCurrency(sourceCurrencyValue)} ${selectSource.value}
    = 
    ${formatCurrency(TargetCurrencyValue)} ${selectTarget.value}`
}


// Initialize select menus and flags
SelectElements.forEach(selectElement => {
    //fill option
    for(const[currency , flagCode] of Object.entries(currencyToFlagCode)){
        const newOptionElement = document.createElement("option");
        newOptionElement.value = currency;
        newOptionElement.textContent = currency;
        selectElement.appendChild(newOptionElement);
    }   
    //listen for changes
    selectElement.addEventListener("change", () =>{
        inputSource.value = 0;
        updateExchangeRate()
        changeFlag(selectElement);
    })
    // set default select target value
    if(selectElement.id === "selectTarget"){
        selectElement.value = "INR";
    }
})

// Change country flags upon select
function changeFlag(selectElement){
    const selectValue = selectElement.value;
    const selectId = selectElement.id;
    const flagCode = currencyToFlagCode[selectValue];
    if(selectId === "selectSource"){
        imageSource.src = `https://flagcdn.com/w640/${flagCode}.png`
    }
    else{
        imageTarget.src = `https://flagcdn.com/w640/${flagCode}.png`
    }
}
// Format currency
function formatCurrency(number) {
    return new Intl.NumberFormat().format(number);
}