/***********************************************
 * THE SLOPULATOR - Retro JavaScript
 * Maximum Weirdness Achieved
 ***********************************************/

// ============================================
// GLOBAL STATE
// ============================================

let currentPropertyData = null;
let currentAddress = '';
let calculationResults = null;
let visitorCount = 0;

// ============================================
// VISITOR COUNTER (Retro Digital Style)
// ============================================

function initVisitorCounter() {
    // Get stored count or start from a "believable" retro number
    const stored = localStorage.getItem('slopulator_visitors');
    if (stored) {
        visitorCount = parseInt(stored) + 1;
    } else {
        visitorCount = 42069; // Nice retro starting number
    }
    
    localStorage.setItem('slopulator_visitors', visitorCount);
    
    // Animate the counter
    animateVisitorCounter();
    
    // Also update footer hit counter
    const footerCount = Math.floor(visitorCount * 2.5) + Math.floor(Math.random() * 100);
    document.getElementById('footer-hit-count').textContent = footerCount.toString().padStart(7, '0');
}

function animateVisitorCounter() {
    const display = visitorCount.toString().padStart(7, '0');
    const counterEl = document.getElementById('visitor-counter');
    
    // Create animated digits
    let html = '';
    for (let i = 0; i < display.length; i++) {
        const delay = i * 0.1;
        html += `<span class="digit" style="animation-delay: ${delay}s">${display[i]}</span>`;
    }
    counterEl.innerHTML = html;
    
    // Add flip animation to last digit
    setTimeout(() => {
        const digits = counterEl.querySelectorAll('.digit');
        if (digits.length > 0) {
            digits[digits.length - 1].style.animation = 'digit-flip 0.5s ease';
        }
    }, 500);
}

// ============================================
// BOUNCING EMOJIS
// ============================================

function initBouncingEmojis() {
    const container = document.getElementById('bouncing-emojis');
    const emojis = ['🏠', '💰', '🔨', '📈', '💵', '🏗️'];
    
    emojis.forEach((emoji, index) => {
        const span = document.createElement('span');
        span.className = 'bouncing-emoji';
        span.textContent = emoji;
        span.style.animationDelay = `${index}s`;
        span.style.left = `${10 + (index * 15)}%`;
        span.style.top = `${10 + (index * 10)}%`;
        span.style.animationDuration = `${6 + Math.random() * 4}s`;
        
        // Easter egg: click house emoji
        span.addEventListener('click', () => {
            if (emoji === '🏠') {
                showEasterEgg();
            } else {
                createSparkles(span);
                span.style.transform = 'scale(2)';
                setTimeout(() => span.style.transform = 'scale(1)', 200);
            }
        });
        
        container.appendChild(span);
    });
}

function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const container = document.getElementById('sparkles');
    
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${rect.left + rect.width/2 + (Math.random() - 0.5) * 50}px`;
        sparkle.style.top = `${rect.top + rect.height/2 + (Math.random() - 0.5) * 50}px`;
        sparkle.style.animationDelay = `${i * 0.05}s`;
        container.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
}

// ============================================
// CONFETTI EXPLOSION
// ============================================

function fireConfetti() {
    const colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#00FF00', '#FF0000', '#FF9900'];
    const container = document.getElementById('sparkles');
    
    // Create many confetti particles
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${10 + Math.random() * 10}px;
                height: ${10 + Math.random() * 10}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]];
                left: 50%;
                top: 50%;
                z-index: 99999;
                pointer-events: none;
            `;
            
            // Random trajectory
            const angle = Math.random() * Math.PI * 2;
            const velocity = 5 + Math.random() * 15;
            let x = window.innerWidth / 2;
            let y = window.innerHeight / 2;
            let vx = Math.cos(angle) * velocity;
            let vy = Math.sin(angle) * velocity;
            let gravity = 0.5;
            let rotation = 0;
            let rotationSpeed = (Math.random() - 0.5) * 20;
            
            container.appendChild(confetti);
            
            const animate = () => {
                x += vx;
                y += vy;
                vy += gravity;
                rotation += rotationSpeed;
                
                confetti.style.left = x + 'px';
                confetti.style.top = y + 'px';
                confetti.style.transform = `rotate(${rotation}deg)`;
                
                if (y < window.innerHeight) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }, i * 10);
    }
}

// ============================================
// EASTER EGG
// ============================================

function showEasterEgg() {
    const modal = document.getElementById('easterEggModal');
    modal.style.display = 'flex';
    
    // Play a "ka-ching" sound effect (placeholder)
    playRetroSound('ka-ching');
}

function closeEasterEgg() {
    document.getElementById('easterEggModal').style.display = 'none';
}

function playRetroSound(type) {
    // Simple beep using Web Audio API
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'ka-ching') {
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
        }
    } catch (e) {
        console.log('Audio not supported');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(value) {
    if (value === undefined || value === null) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatPercent(value) {
    if (value === undefined || value === null) return '0%';
    return value.toFixed(2) + '%';
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// ADDRESS AUTOCOMPLETE (OpenStreetMap)
// ============================================

const fetchAddressSuggestions = debounce(async (query) => {
    const suggestionsEl = document.getElementById('addressSuggestions');
    
    if (query.length < 3) {
        suggestionsEl.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=us`, {
            headers: { 'User-Agent': 'Slopulator/1.0 (bradley@brashproperties.com)' }
        });
        
        if (!response.ok) throw new Error('Geocoding failed');
        
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error('Geocoding error:', error);
        suggestionsEl.style.display = 'none';
    }
}, 300);

function displaySuggestions(suggestions) {
    const suggestionsEl = document.getElementById('addressSuggestions');
    
    if (!suggestions || suggestions.length === 0) {
        suggestionsEl.style.display = 'none';
        return;
    }

    suggestionsEl.innerHTML = suggestions.map(s => `
        <div class="suggestion-item" 
             data-address="${s.display_name}" 
             data-lat="${s.lat}" 
             data-lon="${s.lon}">
            ${s.display_name}
        </div>
    `).join('');

    suggestionsEl.style.display = 'block';

    // Add click handlers
    suggestionsEl.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            document.getElementById('addressInput').value = item.dataset.address;
            currentAddress = item.dataset.address;
            suggestionsEl.style.display = 'none';
            loadPropertyData(item.dataset.address, item.dataset.lat, item.dataset.lon);
        });
    });
}

// ============================================
// MOCK PROPERTY DATA (since we don't have API keys)
// ============================================

function mockPropertyData(address, lat, lon) {
    // Generate deterministic values based on address hash
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        const char = address.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    hash = Math.abs(hash);
    
    // Base values
    const basePrice = 200000 + (hash % 400000);
    const bedrooms = 2 + (hash % 4);
    const bathrooms = 1 + (hash % 3);
    const sqft = 1000 + (hash % 2000);
    
    // Zestimate with variance
    const zestimate = basePrice + ((hash >> 4) % 50000) - 25000;
    const realtorEstimate = basePrice + ((hash >> 8) % 40000) - 20000;
    
    // Generate comps
    const comps = [];
    for (let i = 0; i < 5; i++) {
        const compPrice = basePrice + (((hash >> (i * 4)) % 60000) - 30000);
        const daysAgo = ((hash >> (i * 3)) % 180);
        comps.push({
            address: `${(hash % 900) + 100} ${address.split(',')[0].split(' ').slice(1).join(' ').split(' ')[0] || 'Main'} St`,
            sale_price: Math.round(compPrice / 1000) * 1000,
            sale_date: `${daysAgo} days ago`,
            beds: bedrooms,
            baths: bathrooms,
            sqft: sqft + (((hash >> i) % 400) - 200)
        });
    }
    
    // Sort by recency
    comps.sort((a, b) => parseInt(a.sale_date) - parseInt(b.sale_date));
    
    // Tax and rent estimates
    const taxRate = 0.015 + ((hash % 50) / 10000);
    const annualTaxes = Math.round(basePrice * taxRate / 100) * 100;
    const rentRate = 0.008 + ((hash % 40) / 10000);
    const rentEstimate = Math.round(basePrice * rentRate / 100) * 100;
    
    return {
        zestimate: Math.round(zestimate / 1000) * 1000,
        realtor_estimate: Math.round(realtorEstimate / 1000) * 1000,
        comps: comps,
        annual_taxes: annualTaxes,
        monthly_taxes: Math.round(annualTaxes / 12),
        rent_estimate: rentEstimate,
        property_details: {
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            sqft: sqft,
            year_built: 1960 + (hash % 60),
            lot_size: `${3000 + (hash % 7000)} sqft`
        }
    };
}

async function loadPropertyData(address, lat, lon) {
    showLoading();
    
    try {
        // Simulate API delay for effect
        await new Promise(r => setTimeout(r, 1500));
        
        const data = mockPropertyData(address, lat, lon);
        currentPropertyData = data;
        
        // Populate fields
        document.getElementById('zestimate').value = data.zestimate || '';
        document.getElementById('realtorEstimate').value = data.realtor_estimate || '';
        document.getElementById('rentEstimate').value = data.rent_estimate || '';
        document.getElementById('monthlyTaxes').value = data.monthly_taxes || '';
        
        // Populate comps table
        populateCompsTable(data.comps);
        document.getElementById('compsSection').style.display = 'table-row';
        
        // Show the "Comp Me Daddy" button
        showCompMeDaddyButton();
        
        // Create sparkles
        const searchBtn = document.getElementById('searchBtn');
        createSparkles(searchBtn);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading data! The internet tubes might be clogged! 🚧');
    } finally {
        hideLoading();
    }
}

function populateCompsTable(comps) {
    const tbody = document.querySelector('#compsTable tbody');
    
    if (!comps || comps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" align="center"><font color="#FF0000">No comps found!</font></td></tr>';
        return;
    }

    tbody.innerHTML = comps.map(comp => `
        <tr>
            <td><font color="#00FFFF">${comp.address}</font></td>
            <td><font color="#00FF00">${formatCurrency(comp.sale_price)}</font></td>
            <td><font color="#FFFF00">${comp.sale_date}</font></td>
            <td><font color="#FF9900">${comp.beds}</font></td>
            <td><font color="#FF9900">${comp.baths}</font></td>
            <td><font color="#00FFFF">${comp.sqft.toLocaleString()}</font></td>
        </tr>
    `).join('');
}

// ============================================
// CALCULATIONS
// ============================================

function calculateARV(zestimate, realtorEstimate, comps) {
    if (!comps || comps.length === 0) {
        return Math.round((zestimate + realtorEstimate) / 2 / 1000) * 1000;
    }
    
    const compPrices = comps.slice(0, 5).map(c => c.sale_price);
    const avgComps = compPrices.reduce((a, b) => a + b, 0) / compPrices.length;
    
    // Weighted average: 30% Zestimate + 30% Realtor + 40% Comps
    const arv = (zestimate * 0.30) + (realtorEstimate * 0.30) + (avgComps * 0.40);
    return Math.round(arv / 1000) * 1000;
}

function calculateRentalCashflow(purchasePrice, repairs, rentEstimate, monthlyTaxes, insuranceAnnual, interestRate) {
    const effectiveRent = rentEstimate * 0.90;
    const loanAmount = purchasePrice + repairs;
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = 25 * 12;
    
    let mortgagePayment;
    if (monthlyRate > 0) {
        mortgagePayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
        mortgagePayment = loanAmount / numPayments;
    }
    
    const monthlyInsurance = insuranceAnnual / 12;
    const maintenanceReserve = rentEstimate * 0.05;
    const totalExpenses = mortgagePayment + monthlyTaxes + monthlyInsurance + maintenanceReserve;
    const monthlyCashflow = effectiveRent - totalExpenses;
    const annualCashflow = monthlyCashflow * 12;
    const cashOnCash = purchasePrice > 0 ? (annualCashflow / (purchasePrice * 0.20)) * 100 : 0;
    
    return {
        monthly_rent: rentEstimate,
        effective_monthly_rent: Math.round(effectiveRent * 100) / 100,
        mortgage_payment: Math.round(mortgagePayment * 100) / 100,
        monthly_taxes: monthlyTaxes,
        monthly_insurance: Math.round(monthlyInsurance * 100) / 100,
        maintenance_reserve: Math.round(maintenanceReserve * 100) / 100,
        total_monthly_expenses: Math.round(totalExpenses * 100) / 100,
        monthly_cashflow: Math.round(monthlyCashflow * 100) / 100,
        annual_cashflow: Math.round(annualCashflow * 100) / 100,
        cash_on_cash_return: Math.round(cashOnCash * 100) / 100
    };
}

function calculateFlipAnalysis(purchasePrice, repairs, arv, interestRate) {
    const totalInvestment = purchasePrice + repairs;
    const holdingMonths = 5;
    const monthlyInterest = (totalInvestment * (interestRate / 100)) / 12;
    const holdingCosts = monthlyInterest * holdingMonths;
    const sellingCosts = arv * 0.07;
    const totalCosts = purchasePrice + repairs + holdingCosts + sellingCosts;
    const profit = arv - totalCosts;
    const roi = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
    const mao = (arv * 0.70) - repairs;
    
    return {
        arv: arv,
        purchase_price: purchasePrice,
        repairs: repairs,
        holding_costs: Math.round(holdingCosts * 100) / 100,
        selling_costs: Math.round(sellingCosts * 100) / 100,
        total_costs: Math.round(totalCosts * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        roi_percent: Math.round(roi * 100) / 100,
        mao_70_percent: Math.round(mao / 100) * 100,
        suggested_offer: Math.round(mao * 0.95 / 100) * 100
    };
}

async function runCalculations() {
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    const repairs = parseFloat(document.getElementById('repairCost').value) || 0;
    const zestimate = parseFloat(document.getElementById('zestimate').value) || 0;
    const realtorEstimate = parseFloat(document.getElementById('realtorEstimate').value) || 0;
    const rentEstimate = parseFloat(document.getElementById('rentEstimate').value) || 0;
    const monthlyTaxes = parseFloat(document.getElementById('monthlyTaxes').value) || 0;
    const insuranceAnnual = parseFloat(document.getElementById('annualInsurance').value) || 1200;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 6.8;
    
    if (!purchasePrice || !zestimate || !realtorEstimate) {
        alert('Please fill in at least Purchase Price, Zestimate, and Realtor Estimate! 🏠');
        return;
    }
    
    showLoading();
    
    await new Promise(r => setTimeout(r, 1000));
    
    const comps = currentPropertyData?.comps || [];
    const arv = calculateARV(zestimate, realtorEstimate, comps);
    const rentalAnalysis = calculateRentalCashflow(purchasePrice, repairs, rentEstimate, monthlyTaxes, insuranceAnnual, interestRate);
    const flipAnalysis = calculateFlipAnalysis(purchasePrice, repairs, arv, interestRate);
    
    calculationResults = {
        arv: arv,
        rental_analysis: rentalAnalysis,
        flip_analysis: flipAnalysis
    };
    
    displayResults();
    
    hideLoading();
    
    // Fire confetti!
    fireConfetti();
    
    // Play sound
    playRetroSound('ka-ching');
}

function displayResults() {
    if (!calculationResults) return;
    
    const { arv, rental_analysis, flip_analysis } = calculationResults;
    
    // Show sections
    document.getElementById('arvSection').style.display = 'table-row';
    document.getElementById('resultsSection').style.display = 'table-row';
    
    // ARV with blinking effect
    const arvEl = document.getElementById('arvValue');
    arvEl.textContent = formatCurrency(arv);
    arvEl.style.animation = 'none';
    setTimeout(() => arvEl.style.animation = '', 100);
    
    // Rental Analysis
    document.getElementById('rentalGross').textContent = formatCurrency(rental_analysis.monthly_rent);
    document.getElementById('rentalEffective').textContent = formatCurrency(rental_analysis.effective_monthly_rent);
    document.getElementById('rentalMortgage').textContent = '-' + formatCurrency(rental_analysis.mortgage_payment);
    document.getElementById('rentalTaxes').textContent = '-' + formatCurrency(rental_analysis.monthly_taxes);
    document.getElementById('rentalInsurance').textContent = '-' + formatCurrency(rental_analysis.monthly_insurance);
    document.getElementById('rentalMaintenance').textContent = '-' + formatCurrency(rental_analysis.maintenance_reserve);
    document.getElementById('rentalTotalExpenses').textContent = '-' + formatCurrency(rental_analysis.total_monthly_expenses);
    
    const cashflowEl = document.getElementById('rentalCashflow');
    cashflowEl.textContent = (rental_analysis.monthly_cashflow >= 0 ? '' : '-') + formatCurrency(Math.abs(rental_analysis.monthly_cashflow));
    cashflowEl.color = rental_analysis.monthly_cashflow >= 0 ? '#00FF00' : '#FF0000';
    
    document.getElementById('rentalAnnualCashflow').textContent = formatCurrency(rental_analysis.annual_cashflow);
    document.getElementById('rentalCashOnCash').textContent = formatPercent(rental_analysis.cash_on_cash_return);
    
    // Flip Analysis
    document.getElementById('flipARV').textContent = formatCurrency(flip_analysis.arv);
    document.getElementById('flipPurchase').textContent = '-' + formatCurrency(flip_analysis.purchase_price);
    document.getElementById('flipRepairs').textContent = '-' + formatCurrency(flip_analysis.repairs);
    document.getElementById('flipHolding').textContent = '-' + formatCurrency(flip_analysis.holding_costs);
    document.getElementById('flipSelling').textContent = '-' + formatCurrency(flip_analysis.selling_costs);
    document.getElementById('flipTotalInvestment').textContent = '-' + formatCurrency(flip_analysis.purchase_price + flip_analysis.repairs);
    
    const profitEl = document.getElementById('flipProfit');
    profitEl.textContent = (flip_analysis.profit >= 0 ? '' : '-') + formatCurrency(Math.abs(flip_analysis.profit));
    profitEl.color = flip_analysis.profit >= 0 ? '#00FF00' : '#FF0000';
    
    document.getElementById('flipROI').textContent = formatPercent(flip_analysis.roi_percent);
    document.getElementById('flipMAO').textContent = formatCurrency(flip_analysis.mao_70_percent);
    document.getElementById('flipSuggested').textContent = formatCurrency(flip_analysis.suggested_offer);
    
    // Scroll to results
    document.getElementById('arvSection').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// SAVE/LOAD EVALUATIONS (localStorage)
// ============================================

function loadEvaluations() {
    try {
        const stored = localStorage.getItem('slopulator_evaluations');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveEvaluations(evaluations) {
    localStorage.setItem('slopulator_evaluations', JSON.stringify(evaluations));
}

function saveEvaluation() {
    if (!calculationResults) {
        alert('Please calculate an analysis first! 🧮');
        return;
    }
    
    const evaluations = loadEvaluations();
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    const repairs = parseFloat(document.getElementById('repairCost').value) || 0;
    const rentEstimate = parseFloat(document.getElementById('rentEstimate').value) || 0;
    
    const newEval = {
        id: Date.now(),
        address: currentAddress || document.getElementById('addressInput').value || 'Unknown',
        purchase_price: purchasePrice,
        repairs: repairs,
        arv: calculationResults.arv,
        rent_estimate: rentEstimate,
        monthly_cashflow: calculationResults.rental_analysis.monthly_cashflow,
        flip_profit: calculationResults.flip_analysis.profit,
        created_at: new Date().toISOString()
    };
    
    evaluations.push(newEval);
    saveEvaluations(evaluations);
    
    // Celebrate!
    createSparkles(document.getElementById('saveEvalBtn'));
    alert('Evaluation saved! 💾✨');
}

function displayEvaluationsList() {
    const evaluations = loadEvaluations();
    const listEl = document.getElementById('evaluationsList');
    
    if (evaluations.length === 0) {
        listEl.innerHTML = '<font color="#FF6666" size="4">No saved evaluations found!</font>';
        return;
    }
    
    listEl.innerHTML = evaluations.map(eval => `
        <div class="evaluation-item" onclick="loadEvaluation(${eval.id})">
            <h4>${eval.address}</h4>
            <p>
                Purchase: ${formatCurrency(eval.purchase_price)} | 
                ARV: ${formatCurrency(eval.arv)} | 
                Cashflow: ${formatCurrency(eval.monthly_cashflow)}/mo | 
                Flip: ${formatCurrency(eval.flip_profit)}
            </p>
            <p style="font-size: 0.8rem; color: #666;">${new Date(eval.created_at).toLocaleString()}</p>
            <button class="retro-button-small" onclick="event.stopPropagation(); deleteEvaluation(${eval.id})" style="margin-top: 10px;">
                DELETE
            </button>
        </div>
    `).join('');
}

function loadEvaluation(id) {
    const evaluations = loadEvaluations();
    const eval = evaluations.find(e => e.id === id);
    
    if (!eval) {
        alert('Evaluation not found! 😱');
        return;
    }
    
    document.getElementById('addressInput').value = eval.address || '';
    currentAddress = eval.address || '';
    document.getElementById('purchasePrice').value = eval.purchase_price || '';
    document.getElementById('repairCost').value = eval.repairs || '';
    
    closeModal();
    
    // Load property data if address exists
    if (eval.address) {
        // Trigger a search
        fetchAddressSuggestions(eval.address);
        setTimeout(() => {
            const suggestions = document.querySelectorAll('.suggestion-item');
            if (suggestions.length > 0) {
                suggestions[0].click();
            }
        }, 500);
    }
    
    alert('Evaluation loaded! Click CALCULATE to see results! 📊');
}

function deleteEvaluation(id) {
    if (!confirm('Delete this evaluation? 🤔')) return;
    
    let evaluations = loadEvaluations();
    evaluations = evaluations.filter(e => e.id !== id);
    saveEvaluations(evaluations);
    displayEvaluationsList();
}

function closeModal() {
    document.getElementById('loadModal').style.display = 'none';
}

// ============================================
// COMP ME DADDY - DETAILED ANALYSIS
// ============================================

function showCompMeDaddyButton() {
    const btn = document.getElementById('compMeDaddyBtn');
    if (btn && currentPropertyData) {
        btn.style.display = 'inline-block';
        // Add sparkle animation
        setInterval(() => {
            if (btn.style.display !== 'none') {
                createSparkles(btn);
            }
        }, 3000);
    }
}

function openCompMeDaddy() {
    if (!currentPropertyData) {
        alert('Search for a property first! 🔍');
        return;
    }
    
    document.getElementById('compMeDaddyPage').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Load all the data
    loadRentCastAVM();
    populateDetailedComps();
    generateFinishAnalysis();
}

function closeCompMeDaddy() {
    document.getElementById('compMeDaddyPage').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// RentCast API Integration
const RENTCAST_API_KEY = 'c5ad833affcf4a648df2ca97b5a870ff';

async function loadRentCastAVM() {
    const loadingDiv = document.getElementById('rentcastAVMLoading');
    const dataDiv = document.getElementById('rentcastAVMData');
    
    loadingDiv.style.display = 'block';
    dataDiv.style.display = 'none';
    
    try {
        const address = encodeURIComponent(currentAddress);
        const url = `https://api.rentcast.io/v1/avm/value?address=${address}`;
        
        // Real RentCast API call
        const response = await fetch(url, { 
            headers: { 
                'X-Api-Key': RENTCAST_API_KEY,
                'Accept': 'application/json'
            } 
        });
        
        if (!response.ok) {
            throw new Error(`RentCast API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract RentCast data
        const rentcastValue = data.price || 0;
        const lowRange = data.priceRangeLow || Math.round(rentcastValue * 0.92);
        const highRange = data.priceRangeHigh || Math.round(rentcastValue * 1.08);
        const confidenceScore = data.confidenceScore || 0;
        
        // Determine confidence level
        let confidence = 'MEDIUM';
        let confidenceColor = '#FFFF00';
        if (confidenceScore >= 80) {
            confidence = 'HIGH';
            confidenceColor = '#00FF00';
        } else if (confidenceScore < 50) {
            confidence = 'LOW';
            confidenceColor = '#FF0000';
        }
        
        document.getElementById('rentcastEstimate').textContent = formatCurrency(rentcastValue);
        document.getElementById('rentcastEstimate').style.color = '#00FFFF';
        
        const confEl = document.getElementById('rentcastConfidence');
        confEl.textContent = confidence + (confidenceScore > 0 ? ` (${confidenceScore}%)` : '');
        confEl.style.color = confidenceColor;
        
        document.getElementById('rentcastRange').textContent = `${formatCurrency(lowRange)} - ${formatCurrency(highRange)}`;
        
        loadingDiv.style.display = 'none';
        dataDiv.style.display = 'block';
        
    } catch (error) {
        console.error('RentCast error:', error);
        
        // Fallback to local estimates if RentCast fails
        loadingDiv.innerHTML = '<font color="#FF9900">RentCast API error. Falling back to local estimates...</font>';
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const zestimate = parseFloat(document.getElementById('zestimate').value) || 0;
        const realtorEst = parseFloat(document.getElementById('realtorEstimate').value) || 0;
        const comps = currentPropertyData?.comps || [];
        
        let rentcastValue = 0;
        if (zestimate && realtorEst) {
            rentcastValue = (zestimate * 0.4) + (realtorEst * 0.6);
        } else if (zestimate) {
            rentcastValue = zestimate * 0.95;
        } else if (realtorEst) {
            rentcastValue = realtorEst;
        } else if (comps.length > 0) {
            rentcastValue = comps.reduce((a, b) => a + b.sale_price, 0) / comps.length;
        }
        
        rentcastValue = Math.round(rentcastValue);
        const lowRange = Math.round(rentcastValue * 0.92);
        const highRange = Math.round(rentcastValue * 1.08);
        
        document.getElementById('rentcastEstimate').textContent = formatCurrency(rentcastValue);
        document.getElementById('rentcastEstimate').style.color = '#00FFFF';
        document.getElementById('rentcastConfidence').textContent = 'FALLBACK';
        document.getElementById('rentcastConfidence').style.color = '#FF9900';
        document.getElementById('rentcastRange').textContent = `${formatCurrency(lowRange)} - ${formatCurrency(highRange)}`;
        
        loadingDiv.style.display = 'none';
        dataDiv.style.display = 'block';
    }
}

function populateDetailedComps() {
    const tbody = document.getElementById('detailedCompsBody');
    const comps = currentPropertyData?.comps || [];
    
    if (!comps.length) {
        tbody.innerHTML = '<tr><td colspan="6" align="center"><font color="#FF0000">No comps available!</font></td></tr>';
        return;
    }
    
    // Get subject property sqft for calculations
    const subjectSqft = parseInt(document.getElementById('sqft')?.value) || 1500;
    
    tbody.innerHTML = comps.map((comp, index) => {
        const pricePerSqft = comp.sqft > 0 ? Math.round(comp.sale_price / comp.sqft) : 0;
        const distance = ((index * 0.3) + 0.2).toFixed(1); // Simulated distance
        const finishLevel = determineFinishLevel(comp, pricePerSqft);
        const finishColor = getFinishColor(finishLevel);
        
        return `
            <tr bgcolor="${index % 2 === 0 ? '#000033' : '#000066'}">
                <td><font color="#00FFFF">${comp.address}</font></td>
                <td><font color="#00FF00">${formatCurrency(comp.sale_price)}</font></td>
                <td><font color="#FF9900">$${pricePerSqft}</font></td>
                <td><font color="#FFFF00">${comp.sale_date}</font></td>
                <td><font color="#00FFFF">${distance} mi</font></td>
                <td><font color="${finishColor}"><b>${finishLevel}</b></font></td>
            </tr>
        `;
    }).join('');
}

function determineFinishLevel(comp, pricePerSqft) {
    // Analyze comp to determine finish level
    // This is based on price per sqft relative to market
    
    if (pricePerSqft > 180) return 'LUXURY';
    if (pricePerSqft > 140) return 'HIGH-END';
    if (pricePerSqft > 110) return 'UPDATED';
    if (pricePerSqft > 85) return 'AVERAGE';
    if (pricePerSqft > 60) return 'NEEDS WORK';
    return 'FIXER-UPPER';
}

function getFinishColor(level) {
    const colors = {
        'LUXURY': '#FF00FF',
        'HIGH-END': '#00FFFF',
        'UPDATED': '#00FF00',
        'AVERAGE': '#FFFF00',
        'NEEDS WORK': '#FF9900',
        'FIXER-UPPER': '#FF0000'
    };
    return colors[level] || '#FFFFFF';
}

function generateFinishAnalysis() {
    const comps = currentPropertyData?.comps || [];
    const container = document.getElementById('finishAnalysis');
    
    if (!comps.length) {
        container.innerHTML = '<font color="#FF0000">No data available for analysis.</font>';
        return;
    }
    
    // Calculate metrics
    const prices = comps.map(c => c.sale_price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const sqfts = comps.map(c => c.sqft);
    const avgSqft = sqfts.reduce((a, b) => a + b, 0) / sqfts.length;
    const avgPricePerSqft = Math.round(avgPrice / avgSqft);
    
    // Count finish levels
    const finishCounts = {};
    comps.forEach(comp => {
        const ppsf = comp.sqft > 0 ? Math.round(comp.sale_price / comp.sqft) : 0;
        const level = determineFinishLevel(comp, ppsf);
        finishCounts[level] = (finishCounts[level] || 0) + 1;
    });
    
    // Find dominant finish level
    let dominantLevel = 'AVERAGE';
    let maxCount = 0;
    for (const [level, count] of Object.entries(finishCounts)) {
        if (count > maxCount) {
            maxCount = count;
            dominantLevel = level;
        }
    }
    
    // Generate color commentary
    let commentary = '';
    
    if (dominantLevel === 'LUXURY' || dominantLevel === 'HIGH-END') {
        commentary = `
            <font color="#FF00FF" size="5"><b>💎 LUXURY MARKET DETECTED! 💎</b></font><br><br>
            <font color="#00FFFF">Your comps are averaging <b>$${avgPricePerSqft}/sqft</b> - this is a HIGH-END area!</font><br><br>
            <font color="#FFFF00">💡 <b>THE COLOR:</b> These buyers expect granite, hardwood, and stainless steel. 
            Don't cheap out on finishes or you'll get slaughtered on price. Budget $40-60/sqft for reno if you want to compete.</font><br><br>
            <font color="#00FF00">🏆 <b>OPPORTUNITY:</b> Look for the "NEEDS WORK" comps - there's a ${Math.round(avgPricePerSqft * 0.3)}/sqft spread between fixers and luxury.</font>
        `;
    } else if (dominantLevel === 'UPDATED') {
        commentary = `
            <font color="#00FF00" size="5"><b>✨ SOLID MIDDLE MARKET ✨</b></font><br><br>
            <font color="#00FFFF">Your comps are averaging <b>$${avgPricePerSqft}/sqft</b> - this is a nice updated area.</font><br><br>
            <font color="#FFFF00">💡 <b>THE COLOR:</b> Buyers here want move-in ready but aren't expecting luxury. 
            LVP flooring, quartz counters, and decent appliances will get you there. Budget $25-35/sqft for reno.</font><br><br>
            <font color="#00FF00">🏆 <b>OPPORTUNITY:</b> Anything dated is your friend. Look for "AVERAGE" or "NEEDS WORK" comps.</font>
        `;
    } else if (dominantLevel === 'AVERAGE') {
        commentary = `
            <font color="#FFFF00" size="5"><b>🏠 BREAD-AND-BUTTER MARKET 🏠</b></font><br><br>
            <font color="#00FFFF">Your comps are averaging <b>$${avgPricePerSqft}/sqft</b> - this is an average working-class area.</font><br><br>
            <font color="#FFFF00">💡 <b>THE COLOR:</b> These buyers are practical. They want clean, functional, and affordable. 
            Don't over-improve! Laminate counters, LVP floors, and white appliances are fine. Budget $15-25/sqft for reno.</font><br><br>
            <font color="#FF9900">⚠️ <b>WARNING:</b> Don't put $50k into a kitchen here. You'll never get it back.</font>
        `;
    } else {
        commentary = `
            <font color="#FF9900" size="5"><b>🔨 VALUE-ADD OPPORTUNITY! 🔨</font></b><br><br>
            <font color="#00FFFF">Your comps are averaging <b>$${avgPricePerSqft}/sqft</b> - this area needs some love.</font><br><br>
            <font color="#FFFF00">💡 <b>THE COLOR:</b> Most comps are dated or rough. Even basic updates will make you stand out. 
            Paint, flooring, and kitchen/bath refreshes are your friends. Budget $10-20/sqft for reno.</font><br><br>
            <font color="#00FF00">🏆 <b>OPPORTUNITY:</b> Big spreads between fixers and average. Perfect for BRRRR or flip strategy.</font>
        `;
    }
    
    // Add market summary
    const newestComp = comps.reduce((a, b) => a.sale_date > b.sale_date ? a : b);
    const oldestComp = comps.reduce((a, b) => a.sale_date < b.sale_date ? a : b);
    
    commentary += `<br><br><hr><br>
        <font color="#FF00FF" size="4"><b>📊 MARKET SUMMARY:</b></font><br><br>
        <table border="1" cellpadding="5" cellspacing="0" width="100%">
            <tr bgcolor="#000066">
                <td><font color="#FFFF00">Average Price:</font></td>
                <td><font color="#00FF00">${formatCurrency(Math.round(avgPrice))}</font></td>
            </tr>
            <tr bgcolor="#000033">
                <td><font color="#FFFF00">Average $/sqft:</font></td>
                <td><font color="#00FF00">$${avgPricePerSqft}</font></td>
            </tr>
            <tr bgcolor="#000066">
                <td><font color="#FFFF00">Price Range:</font></td>
                <td><font color="#00FF00">${formatCurrency(Math.min(...prices))} - ${formatCurrency(Math.max(...prices))}</font></td>
            </tr>
            <tr bgcolor="#000033">
                <td><font color="#FFFF00">Comp Date Range:</font></td>
                <td><font color="#00FF00">${oldestComp.sale_date} to ${newestComp.sale_date}</font></td>
            </tr>
            <tr bgcolor="#000066">
                <td><font color="#FFFF00">Dominant Finish:</font></td>
                <td><font color="${getFinishColor(dominantLevel)}">${dominantLevel}</font></td>
            </tr>
        </table>
    `;
    
    container.innerHTML = commentary;
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    initVisitorCounter();
    initBouncingEmojis();
    
    // Welcome alert (retro style)
    setTimeout(() => {
        if (!localStorage.getItem('slopulator_visited')) {
            alert('Welcome to the SLOPULATOR, brother! 🏠💰🔨\n\nThe ULTIMATE tool for real estate investors!');
            localStorage.setItem('slopulator_visited', 'true');
        }
    }, 1000);
    
    // Address input
    const addressInput = document.getElementById('addressInput');
    addressInput.addEventListener('input', (e) => {
        fetchAddressSuggestions(e.target.value);
    });
    
    addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchAddressSuggestions(e.target.value);
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            document.getElementById('addressSuggestions').style.display = 'none';
        }
    });
    
    // Search button
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = addressInput.value;
        if (query.length >= 3) {
            fetchAddressSuggestions(query);
        } else {
            alert('Please enter at least 3 characters! 🔍');
        }
    });
    
    // Calculate button
    document.getElementById('calculateBtn').addEventListener('click', runCalculations);
    
    // Comp Me Daddy button
    document.getElementById('compMeDaddyBtn').addEventListener('click', openCompMeDaddy);
    
    // Save/Load/Print buttons
    document.getElementById('saveEvalBtn').addEventListener('click', saveEvaluation);
    
    document.getElementById('loadEvalBtn').addEventListener('click', () => {
        displayEvaluationsList();
        document.getElementById('loadModal').style.display = 'flex';
    });
    
    document.getElementById('printBtn').addEventListener('click', () => {
        if (!calculationResults) {
            alert('Calculate something first! 🧮');
            return;
        }
        window.print();
    });
    
    // Close modal when clicking outside
    document.getElementById('loadModal').addEventListener('click', (e) => {
        if (e.target.id === 'loadModal') {
            closeModal();
        }
    });
    
    // Add hover sparkles to buttons
    document.querySelectorAll('button, input').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (Math.random() > 0.7) {
                createSparkles(el);
            }
        });
    });
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl+Enter to calculate
    if (e.ctrlKey && e.key === 'Enter') {
        runCalculations();
    }
    // Escape to close modals
    if (e.key === 'Escape') {
        closeModal();
        closeEasterEgg();
        closeCompMeDaddy();
    }
});
