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
    
    // Also update footer hit counter to match main counter
    document.getElementById('footer-hit-count').textContent = visitorCount.toString().padStart(7, '0');
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
                background: ${colors[Math.floor(Math.random() * colors.length)]};
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

// Address autocomplete using RentCast API
let lastQuery = '';
let autocompleteTimeout;

async function fetchAddressSuggestions(query) {
    clearTimeout(autocompleteTimeout);
    
    const suggestionsEl = document.getElementById('addressSuggestions');
    
    if (!suggestionsEl) return;
    
    if (query.length < 3) {
        suggestionsEl.style.display = 'none';
        return;
    }
    
    if (query === lastQuery) return;
    lastQuery = query;
    
    // Debounce for 200ms
    autocompleteTimeout = setTimeout(async () => {
        try {
            // Try RentCast API first
            const response = await fetch(`https://api.rentcast.io/v1/properties?address=${encodeURIComponent(query)}&limit=5`, {
                headers: { 
                    'X-Api-Key': RENTCAST_API_KEY,
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const suggestions = data.map(p => ({
                        display_name: p.addressLine1 + (p.addressLine2 ? ', ' + p.addressLine2 : '') + ', ' + p.city + ', ' + p.state + ' ' + p.zipCode,
                        lat: p.latitude,
                        lon: p.longitude
                    }));
                    displaySuggestions(suggestions);
                    return;
                }
            }
            
            // Fallback to Nominatim if RentCast fails
            const osmResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=us`, {
                headers: { 'User-Agent': 'Slopulator/1.0' }
            });
            
            if (osmResponse.ok) {
                const osmData = await osmResponse.json();
                displaySuggestions(osmData);
            } else {
                suggestionsEl.style.display = 'none';
            }
        } catch (error) {
            console.error('Autocomplete error:', error);
            suggestionsEl.style.display = 'none';
        }
    }, 200);
}

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
    
    // Calculate insurance based on sqft ($0.50 per sqft annually)
    const insurancePerSqft = 0.50;
    const annualInsurance = Math.round(sqft * insurancePerSqft);
    
    return {
        zestimate: Math.round(zestimate / 1000) * 1000,
        realtor_estimate: Math.round(realtorEstimate / 1000) * 1000,
        comps: comps,
        annual_taxes: annualTaxes,
        monthly_taxes: Math.round(annualTaxes / 12),
        rent_estimate: rentEstimate,
        annual_insurance: annualInsurance,
        monthly_insurance: Math.round(annualInsurance / 12),
        property_details: {
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            sqft: sqft,
            year_built: 1960 + (hash % 60),
            lot_size: `${3000 + (hash % 7000)} sqft`
        }
    };
}

// Make loadPropertyData available globally for inline scripts
window.loadPropertyData = async function(address, lat, lon) {
    showLoading();
    
    try {
        // Try RentCast API first
        let data = null;
        
        try {
            const rentcastUrl = `https://api.rentcast.io/v1/avm/value?address=${encodeURIComponent(address)}`;
            const response = await fetch(rentcastUrl, {
                headers: {
                    'X-Api-Key': RENTCAST_API_KEY,
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const rentcastData = await response.json();
                
                // Fetch property details for taxes
                const propertyUrl = `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}`;
                const propResponse = await fetch(propertyUrl, {
                    headers: {
                        'X-Api-Key': RENTCAST_API_KEY,
                        'Accept': 'application/json'
                    }
                });
                
                let propertyData = {};
                if (propResponse.ok) {
                    const propData = await propResponse.json();
                    if (propData && propData.length > 0) {
                        propertyData = propData[0];
                    }
                }
                
                data = {
                    zestimate: rentcastData.price || 0,
                    realtor_estimate: rentcastData.priceRangeHigh || rentcastData.price || 0,
                    rent_estimate: rentcastData.rent || 0,
                    annual_taxes: propertyData.propertyTaxes?.annualAmount || 0,
                    monthly_taxes: propertyData.propertyTaxes?.annualAmount ? Math.round(propertyData.propertyTaxes.annualAmount / 12) : 0,
                    annual_insurance: Math.round((propertyData.squareFootage || 1500) * 0.50),
                    property_details: {
                        sqft: propertyData.squareFootage || propertyData.livingArea || 1500,
                        bedrooms: propertyData.bedrooms || 0,
                        bathrooms: propertyData.bathrooms || 0,
                        year_built: propertyData.yearBuilt || 0
                    }
                };
            }
        } catch (err) {
            console.warn('RentCast API failed, using mock data:', err);
        }
        
        // Fallback to mock data if API fails
        if (!data) {
            data = mockPropertyData(address, lat, lon);
        }
        
        currentPropertyData = data;
        
        // Populate fields
        document.getElementById('zestimate').value = data.zestimate || '';
        document.getElementById('realtorEstimate').value = data.realtor_estimate || '';
        document.getElementById('rentEstimate').value = data.rent_estimate || '';
        document.getElementById('monthlyTaxes').value = data.monthly_taxes || '';
        document.getElementById('annualInsurance').value = data.annual_insurance || '';
        document.getElementById('sqft').value = data.property_details?.sqft || '';
        
        // Ensure loan term is set to default if empty
        const loanTermEl = document.getElementById('loanTerm');
        if (loanTermEl && !loanTermEl.value) {
            loanTermEl.value = 20;
        }
        
        // Populate comps table
        populateCompsTable(data.comps || []);
        document.getElementById('compsSection').style.display = 'table-row';
        
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
    const priceRangeLow = parseFloat(document.getElementById('priceRangeLow').value) || zestimate;
    const priceRangeHigh = parseFloat(document.getElementById('priceRangeHigh').value) || zestimate;
    const rentEstimate = parseFloat(document.getElementById('rentEstimate').value) || 0;
    const monthlyTaxes = parseFloat(document.getElementById('monthlyTaxes').value) || 0;
    const insuranceAnnual = parseFloat(document.getElementById('annualInsurance').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 6.8;
    const loanTerm = parseInt(document.getElementById('loanTerm').value) || 20;
    
    if (!purchasePrice) {
        alert('Please fill in Purchase Price! 🏠');
        return;
    }
    
    showLoading();
    
    await new Promise(r => setTimeout(r, 800));
    
    // Use RentCast AVM as ARV
    const arv = zestimate || priceRangeHigh;
    
    // Comprehensive Analysis
    const analysis = performComprehensiveAnalysis({
        purchasePrice,
        repairs,
        arv,
        rentEstimate,
        monthlyTaxes,
        insuranceAnnual,
        interestRate,
        loanTerm
    });
    
    calculationResults = analysis;
    
    displayComprehensiveResults(analysis);
    
    hideLoading();
    
    // Fire confetti!
    fireConfetti();
    
    // Play sound
    playRetroSound('ka-ching');
}

function performComprehensiveAnalysis(data) {
    const { purchasePrice, repairs, arv, rentEstimate, monthlyTaxes, insuranceAnnual, interestRate, loanTerm } = data;
    
    const totalInvestment = purchasePrice + repairs;
    const monthlyInsurance = insuranceAnnual / 12;
    
    // FLIP ANALYSIS
    // 8% interest only on total investment for 6 months
    const holdingCosts = totalInvestment * (interestRate / 100) * 0.5; // 6 months = 0.5 years
    // Closing/broker fees ~6% of ARV
    const closingCosts = arv * 0.06;
    const totalFlipCosts = totalInvestment + holdingCosts + closingCosts;
    const flipProfit = arv - totalFlipCosts;
    
    // RENTAL ANALYSIS
    // PITI calculation
    const loanAmount = totalInvestment;
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = loanTerm * 12;
    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const piti = monthlyPI + monthlyTaxes + monthlyInsurance;
    
    // LTV based on AVM
    const currentLTV = (loanAmount / arv) * 100;
    
    // Cash flow at 95% occupancy
    const effectiveMonthlyRent = rentEstimate * 0.95;
    const monthlyCashFlow = effectiveMonthlyRent - piti;
    const annualCashFlow = monthlyCashFlow * 12;
    
    // BRRR ANALYSIS
    const maxRefinance = arv * 0.80; // 80% LTV
    const cashInvested = totalInvestment; // Assuming 100% financing for BRRR
    const cashLeftInDeal = Math.max(0, cashInvested - maxRefinance);
    const canPullOut100 = maxRefinance >= cashInvested;
    
    // DEAL RATING
    let rating, recommendation, actionPlan;
    
    // Calculate scores
    const flipScore = flipProfit > 30000 ? 3 : flipProfit > 15000 ? 2 : flipProfit > 0 ? 1 : 0;
    const cashFlowScore = monthlyCashFlow > 300 ? 3 : monthlyCashFlow > 150 ? 2 : monthlyCashFlow > 0 ? 1 : 0;
    const brrrScore = canPullOut100 ? 3 : cashLeftInDeal < 10000 ? 2 : cashLeftInDeal < 20000 ? 1 : 0;
    
    const totalScore = flipScore + cashFlowScore + brrrScore;
    
    if (totalScore >= 7) {
        rating = "⭐⭐⭐ EXCELLENT ⭐⭐⭐";
        recommendation = "🎯 STRONG BUY - This is a home run deal!";
        actionPlan = "• BRRR Strategy: Refinance immediately after rehab to pull out 100% of capital\n" +
                     "• Keep as rental for long-term cash flow and appreciation\n" +
                     "• Flip backup: Strong profit margin if you decide to sell\n" +
                     "• Consider adding to your permanent portfolio";
    } else if (totalScore >= 5) {
        rating = "⭐⭐ GOOD ⭐⭐";
        recommendation = "✅ BUY - Solid deal with multiple exit strategies";
        actionPlan = "• BRRR Strategy recommended - good cash flow with minimal cash left in\n" +
                     "• Flip option viable if you need quick capital\n" +
                     "• Negotiate final $2-5k if possible to improve margins\n" +
                     "• Get contractor bids to confirm rehab budget";
    } else if (totalScore >= 3) {
        rating = "⭐ FAIR ⭐";
        recommendation = "⚠️ CONDITIONAL BUY - Deal works but has limitations";
        actionPlan = "• Try to negotiate purchase price down by 5-10%\n" +
                     "• Get accurate rehab estimates - buffer in your budget\n" +
                     "• BRRR likely best exit - expect some cash to stay in deal\n" +
                     "• Consider partnering to reduce risk";
    } else {
        rating = "❌ PASS ❌";
        recommendation = "🚫 WALK AWAY - Numbers don't work";
        actionPlan = "• Offer $" + Math.round(purchasePrice * 0.85).toLocaleString() + " or less to make it work\n" +
                     "• Look for properties with better rent-to-price ratios\n" +
                     "• Consider markets with lower property taxes\n" +
                     "• Keep this as a comp but move on to next deal";
    }
    
    return {
        flip: {
            purchasePrice,
            repairs,
            totalInvestment,
            holdingCosts,
            closingCosts,
            totalCosts: totalFlipCosts,
            arv,
            profit: flipProfit
        },
        rental: {
            loanAmount,
            interestRate,
            loanTerm,
            monthlyPI,
            monthlyTaxes,
            monthlyInsurance,
            piti,
            arv,
            currentLTV,
            monthlyRent: rentEstimate,
            effectiveMonthlyRent,
            monthlyCashFlow,
            annualCashFlow
        },
        brrr: {
            maxRefinance,
            cashInvested,
            cashLeftInDeal,
            canPullOut100
        },
        rating: {
            score: totalScore,
            rating,
            recommendation,
            actionPlan
        }
    };
}

function displayComprehensiveResults(analysis) {
    // Show deal analysis section
    const dealSection = document.getElementById('dealAnalysisSection');
    if (dealSection) {
        dealSection.style.display = 'table-row';
    }
    
    // FLIP ANALYSIS
    setText('flipPurchasePrice', formatCurrency(analysis.flip.purchasePrice));
    setText('flipRepairCosts', formatCurrency(analysis.flip.repairs));
    setText('flipTotalInvestment', formatCurrency(analysis.flip.totalInvestment));
    setText('flipHoldingCosts', formatCurrency(analysis.flip.holdingCosts));
    setText('flipClosingCosts', formatCurrency(analysis.flip.closingCosts));
    setText('flipTotalCosts', formatCurrency(analysis.flip.totalCosts));
    setText('flipARV', formatCurrency(analysis.flip.arv));
    
    const flipProfitEl = document.getElementById('flipProfit');
    if (flipProfitEl) {
        flipProfitEl.textContent = (analysis.flip.profit >= 0 ? '+' : '-') + formatCurrency(Math.abs(analysis.flip.profit));
        flipProfitEl.style.color = analysis.flip.profit >= 0 ? '#00FF00' : '#FF0000';
    }
    
    // RENTAL ANALYSIS
    setText('rentalLoanAmount', formatCurrency(analysis.rental.loanAmount));
    setText('rentalInterestRate', analysis.rental.interestRate.toFixed(1) + '%');
    setText('rentalLoanTerm', analysis.rental.loanTerm + ' years');
    setText('rentalPI', formatCurrency(analysis.rental.monthlyPI));
    setText('rentalTaxes', formatCurrency(analysis.rental.monthlyTaxes));
    setText('rentalInsurance', formatCurrency(analysis.rental.monthlyInsurance));
    
    const pitiEl = document.getElementById('rentalPITI');
    if (pitiEl) {
        pitiEl.textContent = formatCurrency(analysis.rental.piti);
        pitiEl.style.color = '#00FFFF';
    }
    
    setText('rentalAVM', formatCurrency(analysis.rental.arv));
    setText('rentalCurrentLTV', analysis.rental.currentLTV.toFixed(1) + '%');
    setText('rentalMonthlyRent', formatCurrency(analysis.rental.monthlyRent));
    setText('rentalEffectiveRent', formatCurrency(analysis.rental.effectiveMonthlyRent));
    
    const cashFlowEl = document.getElementById('rentalCashFlow');
    if (cashFlowEl) {
        cashFlowEl.textContent = (analysis.rental.monthlyCashFlow >= 0 ? '+' : '-') + formatCurrency(Math.abs(analysis.rental.monthlyCashFlow));
        cashFlowEl.style.color = analysis.rental.monthlyCashFlow >= 0 ? '#00FF00' : '#FF0000';
    }
    
    setText('rentalAnnualCashFlow', formatCurrency(analysis.rental.annualCashFlow));
    
    // BRRR ANALYSIS
    setText('brrrMaxRefi', formatCurrency(analysis.brrr.maxRefinance));
    setText('brrrCashInvested', formatCurrency(analysis.brrr.cashInvested));
    setText('brrrCashLeft', formatCurrency(analysis.brrr.cashLeftInDeal));
    
    const pulloutEl = document.getElementById('brrrPulloutPossible');
    if (pulloutEl) {
        pulloutEl.textContent = analysis.brrr.canPullOut100 ? '✅ YES!' : '❌ NO';
        pulloutEl.style.color = analysis.brrr.canPullOut100 ? '#00FF00' : '#FF0000';
    }
    
    // DEAL RATING
    const ratingEl = document.getElementById('dealRating');
    if (ratingEl) {
        ratingEl.textContent = analysis.rating.rating;
        ratingEl.style.color = analysis.rating.score >= 7 ? '#FFD700' : analysis.rating.score >= 5 ? '#00FF00' : analysis.rating.score >= 3 ? '#FFA500' : '#FF0000';
    }
    
    const recEl = document.getElementById('dealRecommendation');
    if (recEl) {
        recEl.textContent = analysis.rating.recommendation;
    }
    
    const actionEl = document.getElementById('actionPlanText');
    if (actionEl) {
        actionEl.innerHTML = analysis.rating.actionPlan.replace(/\n/g, '<br>');
    }
    
    // Scroll to results
    if (dealSection) {
        dealSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// Expose main functions to window for inline onclick handlers
window.runCalculations = runCalculations;

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

// Expose Comp Me Daddy functions globally
window.openCompMeDaddy = function() {
    document.getElementById('compMeDaddyPage').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // If we already have property data from main search, pre-fill it
    if (currentPropertyData && currentAddress) {
        document.getElementById('compMeDaddyAddress').value = currentAddress;
        // Auto-trigger analysis
        window.runCompMeDaddyAnalysis();
    }
}

window.runCompMeDaddyAnalysis = async function() {
    const addressInput = document.getElementById('compMeDaddyAddress');
    if (!addressInput) {
        console.error('compMeDaddyAddress input not found!');
        alert('Error: Page not fully loaded. Please refresh.');
        return;
    }
    
    const address = addressInput.value;
    console.log('runCompMeDaddyAnalysis called with address:', address);
    
    if (!address || address.length < 5) {
        alert('Please enter a valid address! 🏠');
        return;
    }
    
    currentAddress = address;
    
    // Show loading state
    if (document.getElementById('rentcastAVMLoading')) {
        document.getElementById('rentcastAVMLoading').style.display = 'block';
    }
    if (document.getElementById('rentcastAVMData')) {
        document.getElementById('rentcastAVMData').style.display = 'none';
    }
    if (document.getElementById('detailedCompsBody')) {
        document.getElementById('detailedCompsBody').innerHTML = '<tr><td colspan="6" align="center"><font color="#00FF00">Loading comps...</font></td></tr>';
    }
    if (document.getElementById('propertyTake')) {
        document.getElementById('propertyTake').innerHTML = '<font color="#00FF00" face="Courier New">Analyzing market data...</font>';
    }
    if (document.getElementById('compsDashboard')) {
        document.getElementById('compsDashboard').style.display = 'none';
    }
    if (document.getElementById('avmJustification')) {
        document.getElementById('avmJustification').style.display = 'none';
    }
    
    // Load mock property data for this address
    await loadPropertyDataForCompMeDaddy(address);

    // Load all the analysis
    try {
        console.log('Starting loadRentCastAVM...');
        await loadRentCastAVM();
        console.log('loadRentCastAVM completed');

        console.log('All analysis complete!');
    } catch (err) {
        console.error('Error in analysis:', err);
        const tbody = document.getElementById('detailedCompsBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" align="center"><font color="#FF0000">Error loading data: ' + err.message + '</font></td></tr>';
        }
    }
}

async function loadPropertyDataForCompMeDaddy(address) {
    // Generate mock data for the entered address
    // In production, this would call your actual property data API
    const mockData = mockPropertyData(address, 0, 0);
    currentPropertyData = mockData;
    
    // Pre-populate the fields if they exist
    const zestimateEl = document.getElementById('zestimate');
    const realtorEl = document.getElementById('realtorEstimate');
    
    // Store values in the Comp Me Daddy page context
    if (!window.compMeDaddyData) window.compMeDaddyData = {};
    window.compMeDaddyData.zestimate = mockData.zestimate || 0;
    window.compMeDaddyData.realtor_estimate = mockData.realtor_estimate || 0;
}

window.closeCompMeDaddy = function() {
    document.getElementById('compMeDaddyPage').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// RentCast API Integration
const RENTCAST_API_KEY = 'c5ad833affcf4a648df2ca97b5a870ff';

async function loadRentCastAVM() {
    const loadingDiv = document.getElementById('rentcastAVMLoading');
    const dataDiv = document.getElementById('rentcastAVMData');
    const compsDashboard = document.getElementById('compsDashboard');
    
    if (loadingDiv) loadingDiv.style.display = 'block';
    if (dataDiv) dataDiv.style.display = 'none';
    if (compsDashboard) compsDashboard.style.display = 'none';
    
    try {
        console.log('loadRentCastAVM starting...');
        const address = encodeURIComponent(currentAddress);
        console.log('Encoded address:', address);
        
        // Call AVM API with compCount=15 and daysOld=365 to get comparables
        const url = `https://api.rentcast.io/v1/avm/value?address=${address}&compCount=15&daysOld=365`;
        console.log('Fetching URL:', url);
        
        const response = await fetch(url, { 
            headers: { 
                'X-Api-Key': RENTCAST_API_KEY,
                'Accept': 'application/json'
            } 
        });
        
        console.log('Response received:', response.status);
        
        if (!response.ok) {
            throw new Error(`RentCast API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        
        // Store data globally for sharing
        window.compMeDaddyData = {
            address: currentAddress,
            avm: data,
            timestamp: new Date().toISOString()
        };
        
        // Extract subject property data
        const subjectProperty = data.subjectProperty || {};
        const rentcastValue = data.price || 0;
        const lowRange = data.priceRangeLow || Math.round(rentcastValue * 0.92);
        const highRange = data.priceRangeHigh || Math.round(rentcastValue * 1.08);
        
        // Process comparables
        let allComps = data.comparables || [];
        
        // Sort by correlation score descending
        allComps.sort((a, b) => (b.correlation || 0) - (a.correlation || 0));
        
        // Filter to top 5 with valid price
        const validComps = allComps.filter(comp => 
            comp.lastSalePrice > 0 || comp.price > 0
        ).slice(0, 5);
        
        // Store selected comps
        window.compMeDaddyData.selectedComps = validComps;
        
        // Calculate median price/sqft for comps
        const compPricesPerSqft = validComps
            .filter(c => c.squareFootage && c.squareFootage > 0)
            .map(c => c.lastSalePrice / c.squareFootage)
            .sort((a, b) => a - b);
        
        const medianCompPricePerSqft = compPricesPerSqft.length > 0 
            ? compPricesPerSqft[Math.floor(compPricesPerSqft.length / 2)] 
            : 0;
        
        // Calculate subject property price/sqft
        const subjectSqft = subjectProperty.squareFootage || data.squareFootage || 0;
        const subjectPricePerSqft = subjectSqft > 0 ? rentcastValue / subjectSqft : 0;
        
        // Generate AVM justification
        console.log('Generating AVM justification...');
        generateAVMJustification(rentcastValue, subjectPricePerSqft, medianCompPricePerSqft, validComps);
        
        // Display comps dashboard
        console.log('Displaying comps dashboard...');
        displayCompsDashboard(validComps, subjectProperty, data);

        // Populate detailed comps table (uses currentPropertyData.comps)
        console.log('Populating detailed comps...');
        populateDetailedComps();

        // Generate property take (uses currentPropertyData.comps)
        console.log('Generating property take...');
        generatePropertyTake();

        // Display map using RentCast API data only
        console.log('Displaying map...');
        displayCompMap(subjectProperty, validComps);
        
        // Show avm justification
        const avmJust = document.getElementById('avmJustification');
        if (avmJust) avmJust.style.display = 'block';
        
        // Update basic AVM display
        if (document.getElementById('rentcastEstimate')) {
            document.getElementById('rentcastEstimate').textContent = formatCurrency(rentcastValue);
            document.getElementById('rentcastEstimate').style.color = '#00FFFF';
        }
        if (document.getElementById('rentcastRange')) {
            document.getElementById('rentcastRange').textContent = `${formatCurrency(lowRange)} - ${formatCurrency(highRange)}`;
        }
        if (document.getElementById('rentcastConfidence')) {
            const confScore = data.confidenceScore || 0;
            let confText = 'MEDIUM';
            let confColor = '#FFFF00';
            if (confScore >= 80) {
                confText = 'HIGH';
                confColor = '#00FF00';
            } else if (confScore < 50) {
                confText = 'LOW';
                confColor = '#FF0000';
            }
            const confEl = document.getElementById('rentcastConfidence');
            confEl.textContent = confText + (confScore > 0 ? ` (${confScore}%)` : '');
            confEl.style.color = confColor;
        }
        
        // Generate share link
        generateShareLink();
        
        // Show the dashboard
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (dataDiv) dataDiv.style.display = 'block';
        if (compsDashboard) compsDashboard.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading RentCast AVM:', error);
        if (loadingDiv) loadingDiv.style.display = 'none';

        // Show error in dashboard
        const dashboard = document.getElementById('compsDashboard');
        if (dashboard) {
            dashboard.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <font color="#FF0000" size="4"><b>⚠️ Error Loading Data</b></font><br><br>
                    <font color="#FFFF00">${error.message}</font><br><br>
                    <font color="#00FF00">Please check the address and try again.</font>
                </div>
            `;
            dashboard.style.display = 'block';
        }
    }
}

// Fetch RentCast property data including taxes
async function loadRentCastPropertyData(address) {
    try {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://api.rentcast.io/v1/properties?address=${encodedAddress}`;
        
        const response = await fetch(url, {
            headers: {
                'X-Api-Key': RENTCAST_API_KEY,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.warn('RentCast property API error:', response.status);
            return null;
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const property = data[0];
            return {
                sqft: property.squareFootage || property.livingArea || 0,
                annualTaxes: property.propertyTaxes?.annualAmount || 0,
                monthlyTaxes: property.propertyTaxes?.annualAmount ? Math.round(property.propertyTaxes.annualAmount / 12) : 0,
                yearBuilt: property.yearBuilt || 0,
                bedrooms: property.bedrooms || 0,
                bathrooms: property.bathrooms || 0
            };
        }
        
        return null;
    } catch (error) {
        console.error('RentCast property data error:', error);
        return null;
    }
}

function populateDetailedComps() {
    const tbody = document.getElementById('detailedCompsBody');
    // Use actual RentCast comps from API response
    const comps = window.compMeDaddyData?.selectedComps || [];

    if (!comps.length) {
        tbody.innerHTML = '<tr><td colspan="6" align="center"><font color="#FF0000">No comps available from RentCast API</font></td></tr>';
        return;
    }

    tbody.innerHTML = comps.map((comp, index) => {
        const salePrice = comp.lastSalePrice || comp.price || 0;
        const sqft = comp.squareFootage || comp.sqft || 0;
        const pricePerSqft = sqft > 0 ? Math.round(salePrice / sqft) : 0;
        const distance = comp.distance ? comp.distance.toFixed(2) : 'N/A';
        const finishLevel = determineFinishLevel(comp, pricePerSqft);
        const finishColor = getFinishColor(finishLevel);
        const saleDate = comp.saleDate ? new Date(comp.saleDate).toLocaleDateString() : (comp.lastSaleDate ? new Date(comp.lastSaleDate).toLocaleDateString() : 'N/A');
        const address = comp.formattedAddress || comp.addressLine1 || comp.address || 'N/A';

        return `
            <tr bgcolor="${index % 2 === 0 ? '#000033' : '#000066'}">
                <td><font color="#00FFFF">${address}</font></td>
                <td><font color="#00FF00">${formatCurrency(salePrice)}</font></td>
                <td><font color="#FF9900">$${pricePerSqft}</font></td>
                <td><font color="#FFFF00">${saleDate}</font></td>
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

function generatePropertyTake() {
    // Generate property valuation opinion based on comps
    const comps = window.compMeDaddyData?.selectedComps || [];
    const avmData = window.compMeDaddyData?.avm || {};
    const container = document.getElementById('propertyTake');
    
    if (!container) return;
    
    if (!comps.length) {
        container.innerHTML = '<font color="#FF0000" size="4"><b>No comps available.</b></font><br><font color="#FFFF00">Unable to generate valuation opinion without comparable sales data.</font>';
        return;
    }
    
    // Get AVM and subject property data
    const avmValue = avmData.price || 0;
    const avmLow = avmData.priceRangeLow || 0;
    const avmHigh = avmData.priceRangeHigh || 0;
    const subjectProperty = avmData.subjectProperty || {};
    const subjectSqft = subjectProperty.squareFootage || avmData.squareFootage || 0;
    const subjectPricePerSqft = subjectSqft > 0 ? avmValue / subjectSqft : 0;
    
    // Calculate comp metrics
    const prices = comps.map(c => c.lastSalePrice || c.price || 0);
    const avgCompPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minCompPrice = Math.min(...prices);
    const maxCompPrice = Math.max(...prices);
    
    const sqfts = comps.map(c => c.squareFootage || c.sqft || 0).filter(s => s > 0);
    const avgCompSqft = sqfts.length > 0 ? sqfts.reduce((a, b) => a + b, 0) / sqfts.length : 0;
    const avgCompPricePerSqft = avgCompSqft > 0 ? Math.round(avgCompPrice / avgCompSqft) : 0;
    
    // Calculate price spreads
    const spreadLow = avmValue - minCompPrice;
    const spreadHigh = maxCompPrice - avmValue;
    const spreadPercentLow = avmValue > 0 ? (spreadLow / avmValue * 100) : 0;
    const spreadPercentHigh = avmValue > 0 ? (spreadHigh / avmValue * 100) : 0;
    
    // Determine finish level of subject based on price/sqft vs comps
    let finishAssessment = '';
    let finishColor = '';
    let valuationVerdict = '';
    let confidence = '';
    
    if (subjectPricePerSqft > avgCompPricePerSqft * 1.1) {
        finishAssessment = 'PREMIUM / HIGH-END';
        finishColor = '#FF00FF';
        valuationVerdict = 'The AVM appears aggressive. Subject is priced above comparable sales.';
        confidence = 'If the subject has superior finishes, larger lot, or better location, this could be justified. Otherwise, expect appraisal closer to $' + formatCurrency(Math.round(avgCompPrice)) + ' range.';
    } else if (subjectPricePerSqft > avgCompPricePerSqft * 0.95) {
        finishAssessment = 'UPDATED / MARKET';
        finishColor = '#00FF00';
        valuationVerdict = 'The AVM is well-supported by comparable sales.';
        confidence = 'Strong valuation confidence. Subject is priced in line with similar properties in the area.';
    } else if (subjectPricePerSqft > avgCompPricePerSqft * 0.8) {
        finishAssessment = 'AVERAGE / STANDARD';
        finishColor = '#FFFF00';
        valuationVerdict = 'The AVM is reasonable but leaves room for upside.';
        confidence = 'Conservative valuation. With light updates (paint, flooring), subject could justify higher end of range.';
    } else {
        finishAssessment = 'NEEDS WORK / VALUE-ADD';
        finishColor = '#FF9900';
        valuationVerdict = 'The AVM is conservative, indicating opportunity.';
        confidence = 'Excellent value-add potential. Even basic improvements could push value toward $' + formatCurrency(Math.round(avgCompPrice)) + ' range.';
    }
    
    // Generate the take HTML
    const html = `
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 3px solid ${finishColor}; border-radius: 10px; padding: 20px;">
            <font face="Papyrus" color="${finishColor}" size="5"><b>🏠 ${finishAssessment} FINISH</b></font>
            <br><br>
            
            <table border="1" cellpadding="10" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                <tr bgcolor="#000066">
                    <td width="50%"><font color="#FFFF00"><b>Subject AVM:</b></font></td>
                    <td><font color="#00FFFF" size="4"><b>${formatCurrency(avmValue)}</b></font></td>
                </tr>
                <tr bgcolor="#000033">
                    <td><font color="#FFFF00"><b>AVM Range:</b></font></td>
                    <td><font color="#FFFF00">${formatCurrency(avmLow)} - ${formatCurrency(avmHigh)}</font></td>
                </tr>
                <tr bgcolor="#000066">
                    <td><font color="#FFFF00"><b>Subject $/sqft:</b></font></td>
                    <td><font color="#00FF00">$${subjectPricePerSqft.toFixed(0)}</font></td>
                </tr>
                <tr bgcolor="#000033">
                    <td><font color="#FFFF00"><b>Comp Average:</b></font></td>
                    <td><font color="#00FF00">${formatCurrency(Math.round(avgCompPrice))} ($${avgCompPricePerSqft}/sqft)</font></td>
                </tr>
                <tr bgcolor="#000066">
                    <td><font color="#FFFF00"><b>Comp Range:</b></font></td>
                    <td><font color="#FFFF00">${formatCurrency(minCompPrice)} - ${formatCurrency(maxCompPrice)}</font></td>
                </tr>
            </table>
            
            <font face="Comic Sans MS" color="#00FFFF" size="4"><b>📊 THE VERDICT:</b></font>
            <br><br>
            <font face="Courier New" color="#ffffff" size="2">
                ${valuationVerdict}
                <br><br>
                <font color="#ffd700"><b>💡 ASSESSMENT:</b></font> ${confidence}
            </font>
            
            <br><br>
            <hr style="border-color: #333;">
            <br>
            
            <font face="Comic Sans MS" color="#FF00FF" size="3"><b>🎯 INVESTMENT STRATEGY:</b></font>
            <br><br>
            <font face="Courier New" color="#ffffff" size="2">
                ${generateStrategyText(finishAssessment, avmValue, avgCompPrice, subjectPricePerSqft, avgCompPricePerSqft)}
            </font>
        </div>
    `;
    
    container.innerHTML = html;
}

function generateStrategyText(finishLevel, avmValue, avgCompPrice, subjectPpsf, compPpsf) {
    const diff = avmValue - avgCompPrice;
    const diffPercent = avgCompPrice > 0 ? (diff / avgCompPrice * 100) : 0;
    
    if (finishLevel.includes('PREMIUM') || finishLevel.includes('HIGH-END')) {
        return `
            • <b>Flip Strategy:</b> Challenging. Already at top of market. Need to ensure finishes justify premium.<br>
            • <b>BRRRR Strategy:</b> Risky. Conservative ARV estimate recommended.<br>
            • <b>Recommendation:</b> Only pursue if you can acquire significantly below AVM or property has unique advantages.
        `;
    } else if (finishLevel.includes('UPDATED') || finishLevel.includes('MARKET')) {
        return `
            • <b>Flip Strategy:</b> Moderate. Focus on cosmetic updates only. Avoid major structural work.<br>
            • <b>BRRRR Strategy:</b> Solid. Rental income should support refinance at AVM.<br>
            • <b>Recommendation:</b> Good rental candidate. Cash flow should be positive with standard financing.
        `;
    } else if (finishLevel.includes('AVERAGE')) {
        return `
            • <b>Flip Strategy:</b> Good opportunity. Light reno ($15-25/sqft) can push value to comp average.<br>
            • <b>BRRRR Strategy:</b> Excellent. Forced appreciation potential through updates.<br>
            • <b>Recommendation:</b> Ideal value-add play. Budget for kitchen/bath refresh, flooring, paint.
        `;
    } else {
        return `
            • <b>Flip Strategy:</b> Excellent opportunity. Full reno can capture ${diffPercent.toFixed(0)}% upside to comp average.<br>
            • <b>BRRRR Strategy:</b> Very strong. Significant forced appreciation potential.<br>
            • <b>Recommendation:</b> Best case for value-add. Plan comprehensive renovation for maximum ARV.
        `;
    }
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
    if (!addressInput) {
        console.error('Address input element not found!');
    } else {
        console.log('Address input found, attaching listeners');
        addressInput.addEventListener('input', (e) => {
            console.log('Input event fired:', e.target.value);
            fetchAddressSuggestions(e.target.value);
        });
        
        addressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                fetchAddressSuggestions(e.target.value);
            }
        });
    }
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        const suggestionsEl = document.getElementById('addressSuggestions');
        const searchContainer = document.querySelector('.search-container');
        if (suggestionsEl && searchContainer && !searchContainer.contains(e.target)) {
            suggestionsEl.style.display = 'none';
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
    
    // Comp Me Daddy button (with null check)
    const compMeDaddyBtn = document.getElementById('compMeDaddyBtn');
    if (compMeDaddyBtn) {
        compMeDaddyBtn.addEventListener('click', window.openCompMeDaddy);
    }
    
    // Comp Me Daddy search button (with null check)
    const compMeDaddySearchBtn = document.getElementById('compMeDaddySearchBtn');
    if (compMeDaddySearchBtn) {
        compMeDaddySearchBtn.addEventListener('click', window.runCompMeDaddyAnalysis);
    }
    
    // Check if address was already selected before page loaded
    if (window.selectedAddress) {
        window.loadPropertyData(window.selectedAddress, window.selectedLat, window.selectedLon);
    }
    
    // Comp Me Daddy address input (Enter key) (with null check)
    const compMeDaddyAddress = document.getElementById('compMeDaddyAddress');
    if (compMeDaddyAddress) {
        compMeDaddyAddress.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                runCompMeDaddyAnalysis();
            }
        });
    }
    
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
// COMP ME DADDY - ANALYSIS FUNCTIONS
// ============================================

function generateAVMJustification(avmValue, subjectPricePerSqft, medianCompPricePerSqft, comps) {
    const justificationEl = document.getElementById('avmJustification');
    if (!justificationEl || comps.length === 0) return;
    
    const highestComp = comps.reduce((max, comp) => 
        (comp.lastSalePrice / (comp.squareFootage || 1)) > (max.lastSalePrice / (max.squareFootage || 1)) ? comp : max
    , comps[0]);
    
    const highestCompAddress = highestComp.formattedAddress || highestComp.addressLine1 || 'the highest comp';
    const highestCompPricePerSqft = highestComp.squareFootage > 0 
        ? (highestComp.lastSalePrice / highestComp.squareFootage).toFixed(0) 
        : 'N/A';
    
    let justification = '';
    const diff = subjectPricePerSqft - medianCompPricePerSqft;
    const diffPercent = medianCompPricePerSqft > 0 ? (diff / medianCompPricePerSqft * 100) : 0;
    
    if (diffPercent > 5) {
        justification = `
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 3px solid #ff6b6b; border-radius: 10px; padding: 20px; margin: 15px 0;">
                <font face="Papyrus" color="#ff6b6b" size="4"><b>📊 AVM ASSESSMENT: AGGRESSIVE</b></font><br><br>
                <font face="Courier New" color="#ffffff" size="2">
                The RentCast AVM of <b>${formatCurrency(avmValue)}</b> (${subjectPricePerSqft.toFixed(0)}/sqft) is 
                <b>${diffPercent.toFixed(1)}% higher</b> than the median comp price/sqft of $${medianCompPricePerSqft.toFixed(0)}.<br><br>
                
                This aggressive valuation is likely supported by <b>${highestCompAddress}</b>, which sold at 
                $${highestCompPricePerSqft}/sqft and is only ${highestComp.distance?.toFixed(2) || 'unknown'} miles away.<br><br>
                
                <font color="#ffd700"><b>💡 Appraisal Insight:</b></font> Expect the appraiser to anchor toward the 
                median range unless your subject property has significant advantages (larger lot, better condition, 
                recent updates) over the comparable sales.
                </font>
            </div>
        `;
    } else if (diffPercent < -5) {
        justification = `
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 3px solid #4ecdc4; border-radius: 10px; padding: 20px; margin: 15px 0;">
                <font face="Papyrus" color="#4ecdc4" size="4"><b>📊 AVM ASSESSMENT: CONSERVATIVE</b></font><br><br>
                <font face="Courier New" color="#ffffff" size="2">
                The RentCast AVM of <b>${formatCurrency(avmValue)}</b> (${subjectPricePerSqft.toFixed(0)}/sqft) is 
                <b>${Math.abs(diffPercent).toFixed(1)}% lower</b> than the median comp price/sqft of $${medianCompPricePerSqft.toFixed(0)}.<br><br>
                
                This conservative valuation may reflect historical data patterns or the subject's last sale price. 
                The comparable sales suggest stronger market support at higher values.<br><br>
                
                <font color="#ffd700"><b>💡 Appraisal Insight:</b></font> This presents an opportunity! The appraisal 
                should come in at or above the AVM. If renovating, you have room to create equity above the projected value.
                </font>
            </div>
        `;
    } else {
        justification = `
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 3px solid #00ff00; border-radius: 10px; padding: 20px; margin: 15px 0;">
                <font face="Papyrus" color="#00ff00" size="4"><b>📊 AVM ASSESSMENT: STRONGLY SUPPORTED</b></font><br><br>
                <font face="Courier New" color="#ffffff" size="2">
                The RentCast AVM of <b>${formatCurrency(avmValue)}</b> (${subjectPricePerSqft.toFixed(0)}/sqft) is 
                <b>within ${Math.abs(diffPercent).toFixed(1)}%</b> of the median comp price/sqft of $${medianCompPricePerSqft.toFixed(0)}.<br><br>
                
                This AVM is strongly supported by the local market data. The selected comparables show consistent 
                pricing within a tight range around your subject property.<br><br>
                
                <font color="#ffd700"><b>💡 Appraisal Insight:</b></font> High confidence in this valuation. 
                Expect the appraisal to align closely with the AVM, assuming typical property condition and no 
                unusual market factors.
                </font>
            </div>
        `;
    }
    
    justificationEl.innerHTML = justification;
}

function displayCompsDashboard(comps, subjectProperty, avmData) {
    const dashboard = document.getElementById('compsDashboard');
    if (!dashboard) return;
    
    const avmValue = avmData.price || 0;
    const subjectSqft = subjectProperty.squareFootage || avmData.squareFootage || 0;
    
    let html = `
        <div style="background: #0a0a0a; border: 3px groove #ffd700; padding: 20px; margin: 20px 0;">
            <font face="Comic Sans MS" color="#ffd700" size="5">
                <b>🏘️ TOP 5 COMPARABLE SALES</b>
            </font>
            <br><br>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">
    `;
    
    comps.forEach((comp, index) => {
        const pricePerSqft = comp.squareFootage > 0 
            ? (comp.lastSalePrice / comp.squareFootage).toFixed(0) 
            : 'N/A';
        const saleDate = comp.lastSaleDate 
            ? new Date(comp.lastSaleDate).toLocaleDateString() 
            : 'N/A';
        const distance = comp.distance ? comp.distance.toFixed(2) : 'N/A';
        
        html += `
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 2px solid #00ff00; border-radius: 10px; padding: 15px;">
                <font face="Papyrus" color="#ff00ff" size="3"><b>Comp #${index + 1}</b></font>
                <hr style="border-color: #333; margin: 10px 0;">
                <font face="Courier New" color="#ffffff" size="2">
                    <b>📍 Address:</b><br>
                    <span style="color: #00ffff;">${comp.formattedAddress || comp.addressLine1 || 'N/A'}</span><br><br>
                    
                    <b>💰 Sale Price:</b> <span style="color: #00ff00; font-size: 16px;">${formatCurrency(comp.lastSalePrice)}</span><br>
                    <b>📅 Sold:</b> ${saleDate}<br>
                    <b>📏 Distance:</b> ${distance} miles<br>
                    <b>📐 Sqft:</b> ${comp.squareFootage || 'N/A'}<br>
                    <b>💵 Price/Sqft:</b> <span style="color: #ffd700;">$${pricePerSqft}</span><br>
                    <b>🎯 Correlation:</b> ${(comp.correlation * 100).toFixed(1)}%
                </font>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div style="background: linear-gradient(135deg, #330000 0%, #220000 100%); border: 3px solid #ff6b6b; border-radius: 10px; padding: 20px; margin-top: 20px;">
                <font face="Comic Sans MS" color="#ff6b6b" size="4"><b>🎯 SUBJECT PROPERTY</b></font>
                <hr style="border-color: #ff6b6b;">
                <font face="Courier New" color="#ffffff" size="3">
                    <b>Address:</b> <span style="color: #00ffff;">${subjectProperty.formattedAddress || currentAddress}</span><br>
                    <b>AVM Value:</b> <span style="color: #00ff00; font-size: 20px;">${formatCurrency(avmValue)}</span><br>
                    <b>Sqft:</b> ${subjectSqft || 'N/A'} | 
                    <b>Price/Sqft:</b> <span style="color: #ffd700;">$${subjectSqft > 0 ? (avmValue / subjectSqft).toFixed(0) : 'N/A'}</span>
                </font>
            </div>
        </div>
    `;
    
    dashboard.innerHTML = html;
}

function displayCompMap(subjectProperty, comps) {
    const mapContainer = document.getElementById('compMapContainer');
    if (!mapContainer) return;
    
    const subjectLat = subjectProperty?.latitude || window.selectedLat;
    const subjectLon = subjectProperty?.longitude || window.selectedLon;
    
    if (!subjectLat || !subjectLon) {
        mapContainer.innerHTML = '<font color="#FF0000">Map coordinates not available</font>';
        return;
    }
    
    // Build list of all coordinates
    const compLats = comps.filter(c => c.latitude).map(c => parseFloat(c.latitude));
    const compLons = comps.filter(c => c.longitude).map(c => parseFloat(c.longitude));
    const allLats = [parseFloat(subjectLat), ...compLats];
    const allLons = [parseFloat(subjectLon), ...compLons];
    
    if (allLats.length < 1) {
        mapContainer.innerHTML = '<font color="#FF9900">No coordinate data available from RentCast API</font>';
        return;
    }
    
    const minLat = Math.min(...allLats);
    const maxLat = Math.max(...allLats);
    const minLon = Math.min(...allLons);
    const maxLon = Math.max(...allLons);
    
    const latPad = (maxLat - minLat) * 0.3 || 0.005;
    const lonPad = (maxLon - minLon) * 0.3 || 0.005;
    
    const bbox = `${(minLon - lonPad).toFixed(6)}%2C${(minLat - latPad).toFixed(6)}%2C${(maxLon + lonPad).toFixed(6)}%2C${(maxLat + latPad).toFixed(6)}`;
    
    // Build markers list with numbered pins for comps
    // Subject property = red, Comps = numbered (1-5)
    let markers = `${subjectLat},${subjectLon},red-pushpin`; 
    comps.forEach((comp, index) => {
        if (comp.latitude && comp.longitude) {
            const label = (index + 1).toString(); // 1, 2, 3, 4, 5
            markers += `|${comp.latitude},${comp.longitude},blue-${label}`;
        }
    });
    
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${subjectLat}%2C${subjectLon}`;
    
    mapContainer.innerHTML = `
        <div style="border: 3px groove #ff00ff; border-radius: 10px; overflow: hidden; margin: 15px 0;">
            <iframe src="${mapUrl}" width="100%" height="400" frameborder="0" scrolling="no" 
                    style="display: block;"></iframe>
        </div>
        <table width="100%" style="margin-top: 10px;">
            <tr>
                <td align="center" width="50%">
                    <font face="Courier New" color="#FF0000" size="2">
                        <b>🔴 SUBJECT PROPERTY</b>
                    </font>
                </td>
                <td align="center" width="50%">
                    <font face="Courier New" color="#00FF00" size="2">
                        <b>🔵 COMPS 1-5 (by correlation)</b>
                    </font>
                </td>
            </tr>
        </table>
    `;
}

function generateShareLink() {
    const shareContainer = document.getElementById('shareLinkContainer');
    if (!shareContainer || !window.compMeDaddyData) return;
    
    const shareText = `Here is a comp analysis for ${window.compMeDaddyData.address}`;
    const encodedText = encodeURIComponent(shareText);
    const currentUrl = window.location.href.split('?')[0];
    const shareUrl = `${currentUrl}?share=${encodedText}`;
    
    shareContainer.innerHTML = `
        <div style="background: #001a33; border: 2px solid #00ff00; padding: 15px; margin: 15px 0; border-radius: 8px;">
            <font face="Comic Sans MS" color="#00ff00" size="3"><b>🔗 SHARE THIS ANALYSIS</b></font><br><br>
            <textarea id="shareText" readonly style="width: 100%; height: 60px; background: #000; color: #0f0; border: 1px solid #00ff00; padding: 10px; font-family: monospace; resize: none;">${shareText}

${shareUrl}</textarea>
            <br><br>
            <button onclick="copyShareText()" style="background: linear-gradient(45deg, #00ff00, #00aa00); color: #000; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                📋 COPY TO CLIPBOARD
            </button>
        </div>
    `;
}

window.copyShareText = function() {
    const textarea = document.getElementById('shareText');
    if (textarea) {
        textarea.select();
        document.execCommand('copy');
        alert('Copied to clipboard! 📋');
    }
};

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

// ============================================
// EXPOSE FUNCTIONS TO WINDOW
// ============================================

window.runComprehensiveAnalysis = runCalculations;
