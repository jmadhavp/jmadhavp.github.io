/**
 * Loan Repayment Calculator Logic
 */

function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 || 0;
    const loanTermYears = parseFloat(document.getElementById('loanTerm').value) || 1;
    const extraPayment = parseFloat(document.getElementById('earlyPayment').value) || 0;
    const region = document.getElementById('currency').value;

    const monthlyRate = interestRate / 12;
    const totalPayments = loanTermYears * 12;

    // Standard Monthly Payment (Base)
    const baseMonthlyPayment = financial.pmt(monthlyRate, totalPayments, loanAmount);
    
    // Calculate with Extra Payment
    let balance = loanAmount;
    let totalInterestPaid = 0;
    let monthsToPayoff = 0;
    const actualMonthlyPayment = baseMonthlyPayment + extraPayment;

    while (balance > 0 && monthsToPayoff < 600) { // Safety cap at 50 years
        const interest = balance * monthlyRate;
        const principal = actualMonthlyPayment - interest;
        
        totalInterestPaid += interest;
        balance -= Math.min(balance, principal + (actualMonthlyPayment - interest - principal) + interest); // Simplified for safety
        
        // Correct logic for last payment
        const interestThisMonth = balance * monthlyRate;
        const principalPaid = Math.min(balance, actualMonthlyPayment - interestThisMonth);
        balance -= principalPaid;
        totalInterestPaid += interestThisMonth;
        
        monthsToPayoff++;
        if (balance <= 0) break;
    }

    // Re-calculate base total interest for comparison
    const baseTotalInterest = (baseMonthlyPayment * totalPayments) - loanAmount;
    const savings = baseTotalInterest - totalInterestPaid;

    // Update UI
    updateElementText('monthlyPayment', formatCurrency(baseMonthlyPayment, region));
    updateElementText('totalInterest', formatCurrency(totalInterestPaid, region));
    updateElementText('totalCost', formatCurrency(loanAmount + totalInterestPaid, region));

    const savingsBox = document.getElementById('savingsBox');
    if (extraPayment > 0 && savings > 0) {
        savingsBox.style.display = 'block';
        updateElementText('interestSaved', formatCurrency(savings, region));
    } else {
        savingsBox.style.display = 'none';
    }
}

// Fixed calculation loop for accuracy
function calculateLoanAccurate() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 || 0;
    const loanTermYears = parseFloat(document.getElementById('loanTerm').value) || 1;
    const extraPayment = parseFloat(document.getElementById('earlyPayment').value) || 0;
    const region = document.getElementById('currency').value;

    const monthlyRate = interestRate / 12;
    const totalPayments = loanTermYears * 12;
    const baseMonthlyPayment = financial.pmt(monthlyRate, totalPayments, loanAmount);

    // 1. Calculate Standard (No extra)
    const baseTotalCost = baseMonthlyPayment * totalPayments;
    const baseTotalInterest = baseTotalCost - loanAmount;

    // 2. Calculate with Extra
    let balance = loanAmount;
    let totalInterestWithExtra = 0;
    let actualMonths = 0;

    for (let i = 0; i < 600; i++) {
        if (balance <= 0) break;
        
        const interestThisMonth = balance * monthlyRate;
        totalInterestWithExtra += interestThisMonth;
        
        const principalPaid = Math.min(balance, (baseMonthlyPayment + extraPayment) - interestThisMonth);
        balance -= principalPaid;
        actualMonths++;
    }

    const savings = baseTotalInterest - totalInterestWithExtra;

    // Update UI
    updateElementText('monthlyPayment', formatCurrency(baseMonthlyPayment, region));
    updateElementText('totalInterest', formatCurrency(totalInterestWithExtra, region));
    updateElementText('totalCost', formatCurrency(loanAmount + totalInterestWithExtra, region));

    const savingsBox = document.getElementById('savingsBox');
    if (extraPayment > 0 && savings > 1) {
        savingsBox.style.display = 'block';
        updateElementText('interestSaved', formatCurrency(savings, region));
    } else {
        savingsBox.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateLoanAccurate);
    });
    calculateLoanAccurate();
});
