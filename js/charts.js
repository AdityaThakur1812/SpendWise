let expenseChart;

function updateChart(){
    let categoryTotals ={};
    transactions.forEach((t) =>{
        if(t.type === 'Income') return;
        if(!categoryTotals[t.category]){
            categoryTotals[t.category] =0;
        }
        categoryTotals[t.category] += t.amount;
    });


const labels = Object.keys(categoryTotals);
const values = Object.values(categoryTotals);

const ctx = document.getElementById("expenseChart");

if(expenseChart) expenseChart.destroy();

expenseChart = new Chart (ctx,{
    type : "pie",
    data :{
        labels : labels,

    
    datasets : [{
        data : values,
        backgroundColor :[
            "#3b82f6",
            "#22c55e",
            "#ef4444",
            "#f97316",
            "#8b5cf6",
            "#14b8a6",
            "#ec4899"
        ]
    }]
}
});
}