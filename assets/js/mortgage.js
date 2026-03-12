/**
 * Mortgage Calculator Logic
 */

let mortgageChart = null;

function calculateMortgage() {
    const homeValue = parseFloat(document.getElementById('homeValue').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 || 0;
    const loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
    
    const loanAmount = homeValue - downPayment;
    const monthlyRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;

    // Principal & Interest
    const monthlyPI = financial.pmt(monthlyRate, numberOfPayments, loanAmount);

    let monthlyTax = 0;
    let monthlyInsurance = 0;

    if (currentRegion === 'US') {
        const annualTaxRate = parseFloat(document.getElementById('propertyTax').value) / 100 || 0;
        const annualInsurance = parseFloat(document.getElementById('homeInsurance').value) || 0;
        
        monthlyTax = (homeValue * annualTaxRate) / 12;
        monthlyInsurance = annualInsurance / 12;
        document.getElementById('usOnlyFields').style.display = 'block';
        document.getElementById('taxInsuranceRow').style.display = 'block';
    } else {
        document.getElementById('usOnlyFields').style.display = 'none';
        document.getElementById('taxInsuranceRow').style.display = 'none';
    }

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;

    // Update UI
    updateElementText('monthlyPayment', formatCurrency(totalMonthly, currentRegion));
    updateElementText('principalInterest', formatCurrency(monthlyPI, currentRegion));
    updateElementText('taxesInsurance', formatCurrency(monthlyTax + monthlyInsurance, currentRegion));
    updateElementText('totalLoan', formatCurrency(loanAmount, currentRegion));

    generateAmortization(loanAmount, monthlyRate, numberOfPayments, monthlyPI);
    updateChart(loanAmount, monthlyRate, numberOfPayments, monthlyPI);
}

function generateAmortization(loanAmount, monthlyRate, numberOfPayments, monthlyPI) {
    const tbody = document.querySelector('#amortizationBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let balance = loanAmount;

    for (let year = 1; year <= numberOfPayments / 12; year++) {
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;
        let startBalance = balance;

        for (let month = 1; month <= 12; month++) {
            const interest = balance * monthlyRate;
            const principal = monthlyPI - interest;
            
            yearlyInterest += interest;
            yearlyPrincipal += principal;
            balance -= principal;
        }

        if (balance < 0) balance = 0;

        const row = `
            <tr>
                <td>Year ${year}</td>
                <td>${formatCurrency(startBalance, currentRegion)}</td>
                <td>${formatCurrency(yearlyPrincipal, currentRegion)}</td>
                <td>${formatCurrency(yearlyInterest, currentRegion)}</td>
                <td>${formatCurrency(balance, currentRegion)}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    }
}

function updateChart(loanAmount, monthlyRate, numberOfPayments, monthlyPI) {
    const ctx = document.getElementById('mortgageChart');
    if (!ctx) return;

    const labels = [];
    const balanceData = [];
    let balance = loanAmount;

    for (let year = 0; year <= numberOfPayments / 12; year++) {
        labels.push(`Year ${year}`);
        balanceData.push(balance.toFixed(2));
        
        for (let month = 1; month <= 12; month++) {
            const interest = balance * monthlyRate;
            const principal = monthlyPI - interest;
            balance -= principal;
        }
        if (balance < 0) balance = 0;
    }

    if (mortgageChart) {
        mortgageChart.data.labels = labels;
        mortgageChart.data.datasets[0].data = balanceData;
        mortgageChart.update();
    } else {
        mortgageChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Loan Balance',
                    data: balanceData,
                    borderColor: '#1e3a8a',
                    backgroundColor: 'rgba(30, 58, 138, 0.1)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Balance Over Time' }
                }
            }
        });
    }
}

// Region change handler
window.onRegionChange = (region) => {
    calculateMortgage();
};

// Initial calculation
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateMortgage);
    });

    const regionBtns = document.querySelectorAll('.region-btn');
    regionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            regionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setRegion(btn.id === 'btnUK' ? 'UK' : 'US');
        });
    });

    // Load initial region
    if (currentRegion === 'UK') {
        document.getElementById('btnUK')?.classList.add('active');
        document.getElementById('btnUS')?.classList.remove('active');
    }

    calculateMortgage();
});
