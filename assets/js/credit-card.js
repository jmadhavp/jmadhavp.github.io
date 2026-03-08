/**
 * Credit Card Interest Calculator Logic
 */

function calculateCreditCard() {
    const balanceInput = document.getElementById('cardBalance');
    const aprInput = document.getElementById('cardApr');
    const paymentType = document.getElementById('paymentType').value;
    const minPayPercent = parseFloat(document.getElementById('minPayPercent').value) / 100 || 0.02;
    const fixedPayment = parseFloat(document.getElementById('fixedPayment').value) || 0;
    const region = document.getElementById('currency').value;

    let balance = parseFloat(balanceInput.value) || 0;
    const monthlyRate = (parseFloat(aprInput.value) / 100) / 12;
    
    let totalInterest = 0;
    let months = 0;
    const maxMonths = 600; // 50 years safety limit

    // UI Toggle
    if (paymentType === 'minimum') {
        document.getElementById('minPayGroup').style.display = 'block';
        document.getElementById('fixedPayGroup').style.display = 'none';
    } else {
        document.getElementById('minPayGroup').style.display = 'none';
        document.getElementById('fixedPayGroup').style.display = 'block';
    }

    while (balance > 0.01 && months < maxMonths) {
        const interest = balance * monthlyRate;
        let payment = 0;

        if (paymentType === 'minimum') {
            payment = Math.max(balance * minPayPercent, 25); // Assume $25 absolute minimum
        } else {
            payment = fixedPayment;
        }

        // If interest is more than payment, debt grows forever
        if (interest >= payment && paymentType === 'fixed') {
            updateElementText('payoffTime', 'Never (Increase Payment)');
            updateElementText('totalInterest', 'N/A');
            updateElementText('totalPaid', 'N/A');
            return;
        }

        const actualPayment = Math.min(payment, balance + interest);
        const principalPaid = actualPayment - interest;
        
        totalInterest += interest;
        balance -= principalPaid;
        months++;
    }

    // Update Results
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    let timeString = '';
    if (years > 0) timeString += `${years} Year${years > 1 ? 's' : ''} `;
    if (remainingMonths > 0) timeString += `${remainingMonths} Month${remainingMonths > 1 ? 's' : ''}`;
    if (months === 0) timeString = '0 Months';
    if (months >= maxMonths) timeString = '50+ Years';

    updateElementText('payoffTime', timeString);
    updateElementText('totalInterest', formatCurrency(totalInterest, region));
    updateElementText('totalPaid', formatCurrency((parseFloat(balanceInput.value) || 0) + totalInterest, region));
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateCreditCard);
    });
    calculateCreditCard();
});
