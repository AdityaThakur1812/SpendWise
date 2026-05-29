const transactionForm = document.getElementById("transactionForm");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const transactionList = document.getElementById("transactionList");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const clearAllBtn = document.getElementById("clearAllBtn");
const category = document.getElementById("category");
const emptyMessage = document.getElementById("emptyMessage");
const transactionCount = document.getElementById("transactionCount");
const recent = document.getElementById("recent");
const searchInput = document.getElementById("searchInput");
const filterBtn = document.querySelectorAll(".filter-btn");
const totalTransationsEl = document.getElementById('totalTransaction');
const themeToggle = document.getElementById('themeToggle');
let currentTheme ="dark";
themeToggle.addEventListener('click',toggleTheme);
loadTheme();
let transactions = [];
let searchItem = "";
let selectedCategory = "All";

searchInput.addEventListener("input", () => {
  searchItem = searchInput.value.trim().replace(/\s+/g, " ").toLowerCase();
  renderTransactions();
});

filterBtn.forEach((f) => {
  f.addEventListener("click", () => {
    selectedCategory = f.dataset.category;

    filterBtn.forEach((b) => {
      b.classList.remove("active");
    });
    f.classList.add("active");
    renderTransactions();
  });
});

loadTransactions();

function updateUI() {
  if (transactions.length === 0) {
    emptyMessage.style.display = "block";
    recent.style.display = "none";
    clearAllBtn.style.display = "none";
  } else {
    emptyMessage.style.display = "none";
    recent.style.display = "block";
    clearAllBtn.style.display = "block";
  }
}

transactionForm.addEventListener("submit", submit);

function submit(e) {
  e.preventDefault();
  let transactionTitle = title.value;
  let transactionAmount = amount.value;
  let transactionType = type.value;
  let transactionCategory = category.value;

  if (
    transactionTitle === "" ||
    transactionAmount === "" ||
    transactionCategory === ""
  ) {
    alert("Please fill all fields");
    return;
  }
  const transaction = {
    id: Date.now(),
    title: transactionTitle,
    amount: Number(transactionAmount),
    type: transactionType,
    category: transactionCategory,
    date: new Date().toLocaleDateString(),
  };

  transactions.push(transaction);
  updateTransactionCount();
  renderTransactions();
  updateSummary();
  saveTransactions();
  updateAnalysis();
  updateUI();
  updateChart();
  title.value = "";
  amount.value = "";
}

function renderTransactions() {
  transactionList.innerHTML = ""; //Without this:Duplicate transactions appear

  filteredTransaction = transactions.filter((t) => {
    const searchMatch =
      t.title.toLowerCase().includes(searchItem) ||
      t.category.toLowerCase().includes(searchItem) ||
      t.amount.toString().includes(searchItem);
    const categoryMatch =
      selectedCategory === "All" || selectedCategory === t.category;

    return searchMatch && categoryMatch;
  });
  let filterInfo = document.getElementById("filterInfo");
  if (filteredTransaction.length === 0) {
    filterInfo.style.display = "none";
    transactionList.innerHTML = `<p class="no-result"> No matching transaction found</p>`;
  } else filterInfo.textContent = `${filteredTransaction.length} results`;

  filteredTransaction.forEach((t) => {
    const transactionItem = document.createElement("div");

    transactionItem.classList.add("transaction-item");
    transactionItem.innerHTML = `
        <div> 
          <h4>${t.title}  </h4>
          <small>${t.date}</small>
          <p class="category-badge"> ${t.category} </p>
        </div>
        <div>
          <span>RS ${t.amount.toLocaleString()}</span>
          <button class = "delete-btn" onclick ="deleteTransaction(${t.id})">Delete</Button>
        </div>`;
    if (t.type === "Income") {
      transactionItem.style.borderRight = "5px solid lime";
    } else {
      transactionItem.style.borderRight = "5px solid red";
    }
    const badge = transactionItem.querySelector(".category-badge");
    switch (t.category) {
      case "Food":
        badge.style.background = "#f97316";
        break;

      case "Travel":
        badge.style.background = "#3b82f6";
        break;

      case "Shopping":
        badge.style.background = "#ec4899";
        break;

      case "Bills":
        badge.style.background = "#ef4444";
        break;

      case "Salary":
        badge.style.background = "#22c55e";
        break;

      case "Entertainment":
        badge.style.background = "#14b8a6";
        break;
    }
    transactionList.appendChild(transactionItem);
  });
}

function updateSummary() {
  let totalIncome = 0;
  let totalExpense = 0;
  transactions.forEach((t) => {
    if (t.type === "Income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  });

  let totalBalance = totalIncome - totalExpense;
  balance.textContent = `RS ${totalBalance}`;
  expense.textContent = `RS ${totalExpense}`;
  income.textContent = `RS ${totalIncome}`;
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => {
    return t.id !== id;
  });
  renderTransactions();
  updateTransactionCount();
  updateAnalysis();
  saveTransactions();
  updateUI();
  updateChart();
  updateSummary();
}

function saveTransactions() {
  localStorage.setItem("transaction", JSON.stringify(transactions));
}

function loadTransactions() {
  const storedTransactions = localStorage.getItem("transaction");
  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
  }
  renderTransactions();
  updateSummary();
  updateAnalysis();
  updateTransactionCount();
  updateUI();
  updateChart();
}

clearAllBtn.addEventListener("click", () => {
  if (confirm("Delete all transactions?")) {
    transactions = [];
    updateTransactionCount();
    saveTransactions();
    renderTransactions();
    updateSummary();
    updateAnalysis()
    updateUI();
    updateChart();
  }
});

function updateTransactionCount() {
  transactionCount.innerText = transactions.length;
}

function updateAnalysis(){
  totalTransationsEl.textContent =`${transactions.length}`;
  let expenses = transactions.filter((t) =>{
    return t.type === "Expense";
  });
  let highestExp = 0;
  expenses.forEach((e) =>{
    if(e.amount > highestExp) highestExp = e.amount ;
  });
  document.getElementById("highestExpense").innerText =`₹${highestExp.toLocaleString()}`;
  let totalExp = 0;
  expenses.forEach((e) =>{
    totalExp += e.amount;
  });
  let averageExp = expense.length === 0? 0 : totalExp /6;
  document.getElementById("averageExpense").innerText =`₹${Math.round(averageExp).toLocaleString()}`;

  let categoryTotals = {};
  expenses.forEach((e) =>{
    if(!categoryTotals[e.category]){
      categoryTotals[e.category] = 0;
    }
    categoryTotals[e.category] += e.amount;
  });
  let maxAmount = 0;
  let topCategory ="-";
  for(const cat in categoryTotals){
    if(categoryTotals[cat] > maxAmount) maxAmount = categoryTotals[cat];
    topCategory = cat;
  }
  document.getElementById("topCategory").innerText = topCategory;

}

function toggleTheme(){
  if(currentTheme == 'dark'){
    document.body.classList.add('light-theme');
    themeToggle.textContent = "☀️";
    currentTheme = 'light'
    localStorage.setItem('theme' , "light");
  }
  else{
    document.body.classList.remove('light-theme');
    themeToggle.textContent = "🌙";
    currentTheme ='dark';
    localStorage.setItem('theme','dark');

  }
}

function loadTheme(){
  const curr = localStorage.getItem("theme");
  if(curr ==="light"){
    document.body.classList.add("light-theme");
    themeToggle.textContent ="☀️";
    currentTheme = 'light';
  }
  else{
    document.body.classList.add("dark-theme");
    themeToggle.textContent ="🌙";
    currentTheme ='dark';
  }
}