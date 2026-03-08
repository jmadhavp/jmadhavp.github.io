/**
 * Inflation Calculator Logic
 */

function calculateInflation() {
    const amount = parseFloat(document.getElementById('startingAmount').value) || 0;
    const years = parseFloat(document.getElementById('years').value) || 0;
    const rate = parseFloat(document.getElementById('inflationRate').value) / 100 || 0;
    const region = document.getElementById('currency').value;

    // Formula: Future Value = Present Value / (1 + r)^n
    // This shows what today's $X will be worth in the future
    const futureValue = amount / Math.pow(1 + rate, years);
    const loss = amount - futureValue;
    const cumulativeRate = (Math.pow(1 + rate, years) - 1) * 100;

    // Update UI
    updateElementText('futureValue', formatCurrency(futureValue, region));
    updateElementText('totalLoss', formatCurrency(loss, region));
    updateElementText('cumulativeInflation', cumulativeRate.toFixed(2) + '%');
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculateInflation);
    });
    calculateInflation();
});
