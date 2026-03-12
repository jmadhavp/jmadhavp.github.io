/**
 * Credit Card Interest Calculator Logic
 */

let creditCardChart = null;

function calculateCreditCard() {
    const balanceInput = document.getElementById('cardBalance');
    const aprInput = document.getElementById('cardApr');
    const paymentType = document.getElementById('paymentType');
    const minPayPercentInput = document.getElementById('minPayPercent');
    const fixedPaymentInput = document.getElementById('fixedPayment');
    
    if (!balanceInput || !aprInput || !paymentType) return;

    const initialBalance = parseFloat(balanceInput.value) || 0;
    const apr = parseFloat(aprInput.value) || 0;
    const monthlyRate = (apr / 100) / 12;
    const type = paymentType.value;
    const minPayPercent = parseFloat(minPayPercentInput.value) / 100 || 0.02;
    const fixedPayment = parseFloat(fixedPaymentInput.value) || 0;

    let balance = initialBalance;
    let totalInterest = 0;
    let months = 0;
    const maxMonths = 600; // 50 years safety limit

    const labels = [];
    const balanceData = [];

    // UI Toggle
    const minPayGroup = document.getElementById('minPayGroup');
    const fixedPayGroup = document.getElementById('fixedPayGroup');
    if (type === 'minimum') {
        if (minPayGroup) minPayGroup.style.display = 'block';
        if (fixedPayGroup) fixedPayGroup.style.display = 'none';
    } else {
        if (minPayGroup) minPayGroup.style.display = 'none';
        if (fixedPayGroup) fixedPayGroup.style.display = 'block';
    }

    labels.push('Month 0');
    balanceData.push(initialBalance.toFixed(2));

    while (balance > 0.01 && months < maxMonths) {
        const interest = balance * monthlyRate;
        let payment = 0;

        if (type === 'minimum') {
            payment = Math.max(balance * minPayPercent, 25); // Assume $25/£25 absolute minimum
        } else {
            payment = fixedPayment;
        }

        // If interest is more than payment, debt grows forever
        if (interest >= payment && type === 'fixed') {
            updateElementText('payoffTime', 'Never (Increase Payment)');
            updateElementText('totalInterest', 'N/A');
            updateElementText('totalPaid', 'N/A');
            updateChart([], []);
            return;
        }

        const actualPayment = Math.min(payment, balance + interest);
        const principalPaid = actualPayment - interest;
        
        totalInterest += interest;
        balance -= principalPaid;
        months++;

        // Add to chart every 6 months or at the end
        if (months % 6 === 0 || balance <= 0.01) {
            labels.push(`Month ${months}`);
            balanceData.push(balance.toFixed(2));
        }
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
    updateElementText('totalInterest', formatCurrency(totalInterest, currentRegion));
    updateElementText('totalPaid', formatCurrency(initialBalance + totalInterest, currentRegion));

    updateChart(labels, balanceData);
}

function updateChart(labels, data) {
    const ctx = document.getElementById('creditCardChart');
    if (!ctx) return;

    if (creditCardChart) {
        creditCardChart.data.labels = labels;
        creditCardChart.data.datasets[0].data = data;
        creditCardChart.update();
    } else {
        creditCardChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Remaining Balance',
                    data: data,
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
                    title: { display: true, text: 'Debt Payoff Progress' }
                }
            }
        });
    }
}

// Region change handler
window.onRegionChange = (region) => {
    calculateCreditCard();
};

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateCreditCard);
    });

    const regionSelect = document.getElementById('currency');
    if (regionSelect) {
        regionSelect.value = currentRegion;
        regionSelect.addEventListener('change', (e) => {
            setRegion(e.target.value);
        });
    }

    calculateCreditCard();
});
