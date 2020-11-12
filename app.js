const el = {
    balance: document.getElementById('balance'),
    money_plus: document.getElementById('money-plus'),
    money_minus: document.getElementById('money-minus'),
    list: document.getElementById('list'),
    form: document.getElementById('form'),
    text: document.getElementById('text'),
    amount: document.getElementById('amount'),
    clear: document.getElementById('clear')
};

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Adding transaction
const addTransaction = e => {
    e.preventDefault();
    if (el.text.value.trim() === '' || el.amount.value.trim() === '') {
        alert('please add text or amount')
    } else {
        const transaction = {
            id: generateID(),
            text: el.text.value,
            amount: +el.amount.value
        }
        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        el.text.value = '';
        el.amount.value = '';
    }

};

const generateID = () => {
    return Math.floor(Math.random() * 100000000)
};

// Adding transaction to DOM
const addTransactionDOM = tr => {
    // Get the sign
    const sign = tr.amount < 0 ? '-' : '+';

    const item = `<li class="${tr.amount < 0 ? 'minus' : 'plus'}">${tr.text}<span>${sign}${Math.abs(tr.amount)}</span><button class="delete-btn" onclick="removeTransaction(${tr.id})">X</button>
  </li>`;
    el.list.insertAdjacentHTML('beforeend', item);
};


// Updating the balance, income and expense
const updateValues = () => {
    const amounts = transactions.map(tr => tr.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (amounts
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);

    el.balance.innerText = `$${total}`;
    el.money_plus.innerText = `$${income}`
    el.money_minus.innerText = `$${expense}`
    console.log(expense)
};

// Remove transaction by id 
const removeTransaction = (id) => {
    transactions = transactions.filter(tr => tr.id !== id);
    updateLocalStorage();
    init();
};

// Clear values and the list
const clear = () => {
    transactions = [];
    updateLocalStorage();
    init();
};

// Update local storage transactions
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
};

// Initialize application
const init = () => {
    el.list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
};

init();

// Event Listners
el.form.addEventListener('submit', addTransaction);
el.clear.addEventListener('click', clear);