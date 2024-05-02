const balance = document.getElementById('balance');
const budgetInput = document.getElementById('budget');
const setBudgetBtn = document.querySelector('.set-budget-btn');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const filterCategory = document.getElementById('filter-category');
const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');

let transactions = [];
let budget = 0;

// Set Budget
setBudgetBtn.addEventListener('click', () => {
  const newBudget = parseFloat(budgetInput.value);
  if (!isNaN(newBudget)) {
    budget = newBudget;
    updateBalance();
    budgetInput.value = '';
  } else {
    alert('Please enter a valid budget amount.');
  }
});

// Add transaction to list
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please enter transaction name and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      category: category.value,
      date: new Date().toLocaleDateString()
    };
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateBalance();
    text.value = '';
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    <span class="text">${transaction.text}</span>
    <span class="amount">${sign}$${Math.abs(transaction.amount)}</span>
    <span class="date">${transaction.date}</span>
    <button class="edit-btn" onclick="toggleEditMode(${transaction.id})"><i class="fas fa-edit"></i></button>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fas fa-trash-alt"></i></button>
  `;
  transactionList.appendChild(item);
}

// Update balance
function updateBalance() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  balance.innerText = `$${total}`;

  if (budget !== 0) {
    const remaining = (budget - total).toFixed(2);
    if (remaining >= 0) {
      balance.innerHTML += ` (Budget Remaining: $${remaining})`;
    } else {
      balance.innerHTML += ` (Over Budget: $${Math.abs(remaining)})`;
    }
  }
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  init();
}

// Toggle Edit Mode for Transactions
function toggleEditMode(id) {
  const transactionItem = document.getElementById(`transaction-${id}`);
  const editBtn = transactionItem.querySelector('.edit-btn');
  const deleteBtn = transactionItem.querySelector('.delete-btn');
  const textSpan = transactionItem.querySelector('.text');
  const amountSpan = transactionItem.querySelector('.amount');
  const editForm = transactionItem.querySelector('.edit-form');
  const editText = editForm.querySelector('.edit-text');
  const editAmount = editForm.querySelector('.edit-amount');

  if (editForm.style.display === 'none' || !editForm.style.display) {
    textSpan.style.display = 'none';
    amountSpan.style.display = 'none';
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    editForm.style.display = 'flex';
    editText.value = textSpan.textContent.trim();
    editAmount.value = parseFloat(amountSpan.textContent.trim().substring(1));
  } else {
    textSpan.style.display = 'inline';
    amountSpan.style.display = 'inline';
    editBtn.style.display = 'inline';
    deleteBtn.style.display = 'inline';
    editForm.style.display = 'none';
  }
}

// Save Edited Transaction
function saveEditedTransaction(id) {
  const transactionItem = document.getElementById(`transaction-${id}`);
  const editText = transactionItem.querySelector('.edit-text').value;
  const editAmount = parseFloat(transactionItem.querySelector('.edit-amount').value);

  if (editText.trim() === '' || isNaN(editAmount)) {
    alert('Please enter valid values for transaction name and amount.');
    return;
  }

  const transactionIndex = transactions.findIndex(transaction => transaction.id === id);
  if (transactionIndex !== -1) {
    transactions[transactionIndex].text = editText;
    transactions[transactionIndex].amount = editAmount;
    init();
  }
}

// Initialize app
function init() {
  transactionList.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateBalance();
}

form.addEventListener('submit', addTransaction);

init();
