/**
 * Mortgage Calculator Logic
 */

let currentRegion = 'US';

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
        const annualInsurance = parseFloat(document.getElementById('insurance').value) || 0;
        
        monthlyTax = (homeValue * annualTaxRate) / 12;
        monthlyInsurance = annualInsurance / 12;
        document.getElementById('us-inputs').style.display = 'block';
        document.getElementById('taxInsuranceRow').style.display = 'block';
    } else {
        document.getElementById('us-inputs').style.display = 'none';
        document.getElementById('taxInsuranceRow').style.display = 'none';
    }

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;

    // Update UI
    updateElementText('monthlyPayment', formatCurrency(totalMonthly, currentRegion));
    updateElementText('principalInterest', formatCurrency(monthlyPI, currentRegion));
    updateElementText('taxesInsurance', formatCurrency(monthlyTax + monthlyInsurance, currentRegion));
    updateElementText('totalLoan', formatCurrency(loanAmount, currentRegion));

    generateAmortization(loanAmount, monthlyRate, numberOfPayments, monthlyPI);
}

function generateAmortization(loanAmount, monthlyRate, numberOfPayments, monthlyPI) {
    const tbody = document.querySelector('#amortizationTable tbody');
    tbody.innerHTML = '';

    let balance = loanAmount;
    let totalInterest = 0;
    let totalPrincipal = 0;

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

// Region change handler
window.onRegionChange = (region) => {
    currentRegion = region;
    calculateMortgage();
};

// Initial calculation
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateMortgage);
    });
    calculateMortgage();
});
