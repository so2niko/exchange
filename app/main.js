const data = {
    urlPrivatAPI : 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11',
    userInp : document.querySelector('#inpValue'),
    userCurr : [...document.querySelectorAll('.inpCurr')],
    output : document.querySelector('.output')
};


function loadExchange(){
    fetch(data.urlPrivatAPI)
        .then(r => r.json())
        .then(d => {
            data.curr = d;
            console.log(d);
            updateData(d);
            getUserInputs();
        });
    
}

function updateData(d){
    const uah = d.find(({ ccy }) => ccy == 'USD');
    const btc = d.find(({ ccy }) => ccy == 'BTC');
    d[d.length - 1].sale = uah.sale * btc.sale;
}

function setLoaders(){
    data.userInp.addEventListener('input', getUserInputs);
    data.userCurr.forEach(el => el.addEventListener('input', getUserInputs));
}

function getUserInputs(){
    const val = data.userInp.value;
    const curr = data.userCurr.reduce((acc, el) => el.checked ? el.value : acc, 'uah');
    console.log(val, curr);
    getExchange(val, curr);
}

function getExchange(val = 0, curr = 'UAH'){
    const exchToUAH = data.curr.find(({ ccy }) => curr == ccy);
    console.log(exchToUAH);
    const uah = curr == 'UAH' ? val : val * exchToUAH.sale;
    console.log(uah);
    const exch = data.curr.map(({ ccy, sale }) => {
        return {
            ccy, 
            count : uah / sale
        }
    });

    console.log(exch);
    renderExch(exch);
}

function renderExch(arr){
    data.output.innerHTML = arr.map(({ ccy, count }) => `<p>${ ccy } ${ count }</p>`).join('');
}


//! start
setLoaders();
loadExchange();

