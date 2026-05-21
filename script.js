const transactionForm = document.getElementById("transactionForm");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const transactionList = document.getElementById("transactionList");
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const clearAllBtn = document.getElementById("clearAllBtn");

let transactions = [];
loadTransactions();

transactionForm.addEventListener("submit", submit);

function submit(e) {
  e.preventDefault();
  let transactionTitle = title.value;
  let transactionAmount = amount.value;
  let transactionType = type.value;

  const transaction = {
    id : Date.now(),
    title: transactionTitle,
    amount: Number(transactionAmount),
    type: transactionType,
  };

  transactions.push(transaction);
  renderTransactions();
  updateSummary();
  saveTransactions();
  title.value = "";
  amount.value = "";
}

function renderTransactions() {
  transactionList.innerHTML = ""; //Without this:Duplicate transactions appear

  transactions.forEach((t) => {
    const transactionItem = document.createElement("div");
    transactionItem.classList.add("transaction-item");
    transactionItem.innerHTML = `
        <div> 
          <h4>${t.title}  </h4>
          <p> ${t.type} </p>
        </div>
        <div>
          <span>RS ${t.amount}</span>
          <button class = "delete-btn" onclick ="deleteTransaction(${t.id})">Delete</Button>
        </div>`;
    if (t.type === "Income") {
      transactionItem.style.borderRight = "5px solid lime";
    } else {
      transactionItem.style.borderRight = "5px solid red";
    }
    transactionList.appendChild(transactionItem);
  });
}

function updateSummary(){
  let totalIncome= 0;
  let totalExpense = 0 ;
  transactions.forEach((t) =>{
    if(t.type === "Income"){
      totalIncome +=t.amount;
    }else{
      totalExpense += t.amount;
    }
  });

  let totalBalance = totalIncome - totalExpense;
  balance.textContent = `RS ${totalBalance}`;
  expense.textContent = `RS ${totalExpense}`;
  income.textContent = `RS ${totalIncome}`;
}

function deleteTransaction(id){
  transactions = transactions.filter((t) =>{
    return t.id !== id;
  });
  renderTransactions();
  saveTransactions();
  updateSummary();
}

function saveTransactions(){
  localStorage.setItem("transaction" , JSON.stringify(transactions));
}

function loadTransactions(){
  storedTransactions = localStorage.getItem("transaction");
  if(storedTransactions){
    transactions = JSON.parse(storedTransactions);
  }
  renderTransactions();
  updateSummary();
}

clearAllBtn.addEventListener("click", () => {
  if(confirm("Delete all transactions?")){
    transactions = [];
    saveTransactions();
    renderTransactions();
    updateSummary();
}   
});