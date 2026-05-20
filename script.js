const transactionForm = document.getElementById("transactionForm");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const transactionList = document.getElementById("transactionList");

let transactions = [];

transactionForm.addEventListener("submit", submit);

function submit(e) {
  e.preventDefault();
  let transactionTitle = title.value;
  let transactionAmount = amount.value;
  let transactionType = type.value;

  const transaction = {
    title: transactionTitle,
    amount: transactionAmount,
    type: transactionType,
  };

  transactions.push(transaction);
  renderTransactions();
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
        </div>`;
    if (t.type === "Income") {
      transactionItem.style.borderRight = "5px solid lime";
    } else {
      transactionItem.style.borderRight = "5px solid red";
    }
    transactionList.appendChild(transactionItem);
  });
}
