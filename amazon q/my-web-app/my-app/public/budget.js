let itemCounter = 0;
let people = [];

function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    
    content.classList.toggle('expanded');
    arrow.classList.toggle('rotated');
}

function addPerson() {
    const nameInput = document.getElementById('new-person-name');
    const name = nameInput.value.trim();
    
    if (name && !people.includes(name)) {
        people.push(name);
        nameInput.value = '';
        updatePeopleDisplay();
        updatePersonSelects();
    }
}

function removePerson(name) {
    people = people.filter(person => person !== name);
    updatePeopleDisplay();
    updatePersonSelects();
}

function updatePeopleDisplay() {
    const container = document.getElementById('people-list');
    const preview = document.getElementById('people-preview');
    
    const peopleHTML = people.map(person => 
        `<span class="person-tag">${person}<button class="remove-person" onclick="removePerson('${person}')">×</button></span>`
    ).join('');
    
    const previewHTML = people.map(person => 
        `<span class="person-tag">${person}</span>`
    ).join('');
    
    container.innerHTML = peopleHTML;
    preview.innerHTML = previewHTML;
}

function updatePersonSelects() {
    const selects = document.querySelectorAll('.person-select');
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select person</option>' + 
            people.map(person => `<option value="${person}">${person}</option>`).join('');
        if (people.includes(currentValue)) {
            select.value = currentValue;
        }
    });
}

function addItem(type) {
    const container = document.getElementById(`${type}-list`);
    const itemId = `${type}-${itemCounter++}`;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    
    if (type === 'income') {
        itemDiv.innerHTML = `
            <input type="text" placeholder="Name (e.g., Salary)" id="${itemId}-name">
            <select class="person-select" id="${itemId}-person">
                <option value="">Select person</option>
                ${people.map(person => `<option value="${person}">${person}</option> `).join('')} 
            </select>
            <input type="number" placeholder="0" id="${itemId}-value" oninput="calculateTotals()">
            <span>SEK</span>
            <button class="remove-btn" onclick="removeItem(this)">Remove</button>
        `;
    } else {
        itemDiv.innerHTML = `
            <input type="text" placeholder="Name (e.g., Rent)" id="${itemId}-name">
            <select class="label-select" id="${itemId}-label">
                <option value="Common">By percentage</option>
                <option value="Food">Common</option>
                </select>
            <input type="number" placeholder="0" id="${itemId}-value" oninput="calculateTotals()">
            <span>SEK</span>
            <button class="remove-btn" onclick="removeItem(this)">Remove</button>
        `;
    }
    
    container.appendChild(itemDiv);
}

function removeItem(button) {
    button.parentElement.remove();
    calculateTotals();
}

function calculateTotals() {
    const incomeInputs = document.querySelectorAll('#income-list input[type="number"]');
    const costsInputs = document.querySelectorAll('#costs-list input[type="number"]');
    
    let totalIncome = 0;
    let totalCosts = 0;
    
    incomeInputs.forEach(input => {
        totalIncome += parseFloat(input.value) || 0;
    });
    
    costsInputs.forEach(input => {
        totalCosts += parseFloat(input.value) || 0;
    });
    
    const netResult = totalIncome - totalCosts;
    
    document.getElementById('total-income').textContent = totalIncome.toLocaleString();
    document.getElementById('total-costs').textContent = totalCosts.toLocaleString();
    document.getElementById('net-result').textContent = netResult.toLocaleString();
    
    updateIncomeSummary(totalIncome);
}

function updateIncomeSummary(totalIncome) {
    const summaryContainer = document.getElementById('income-summary');
    const personIncomes = {};
    
    // Calculate income per person
    const incomeItems = document.querySelectorAll('#income-list .item');
    incomeItems.forEach(item => {
        const personSelect = item.querySelector('select');
        const valueInput = item.querySelector('input[type="number"]');
        const person = personSelect.value;
        const value = parseFloat(valueInput.value) || 0;
        
        if (person && value > 0) {
            personIncomes[person] = (personIncomes[person] || 0) + value;
        }
    });
    
    // Generate summary HTML
    let summaryHTML = '';
    if (Object.keys(personIncomes).length > 0 && totalIncome > 0) {
        summaryHTML = Object.entries(personIncomes).map(([person, amount]) => {
            const percentage = ((amount / totalIncome) * 100).toFixed(1);
            return `
                <div class="person-income">
                    <span class="person-name">${person}</span>
                    <div>
                        <span class="person-amount">${amount.toLocaleString()} SEK</span>
                        <span class="person-percentage">(${percentage}%)</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    summaryContainer.innerHTML = summaryHTML;
}

// Add initial items
document.addEventListener('DOMContentLoaded', function() {
    addItem('income');
    addItem('costs');
    
    // Add Enter key support for all inputs
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
            if (event.target.id === 'new-person-name') {
                addPerson();
            } else {
                calculateTotals();
            }
        }
    });
});
