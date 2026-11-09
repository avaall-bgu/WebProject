document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. תפריט המבורגר רספונסיבי במובייל
       ========================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    /* ==========================================
       2. מעבר בין התחברות להרשמה (auth.html)
       ========================================== */
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const gotoRegisterBtn = document.getElementById('goto-register-btn');
    const gotoLoginBtn = document.getElementById('goto-login-btn');

    if (gotoRegisterBtn && gotoLoginBtn && loginForm && registerForm) {
        gotoRegisterBtn.addEventListener('click', () => {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        });

        gotoLoginBtn.addEventListener('click', () => {
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }

    /* ==========================================
       3. הגדרת מגבלת תאריך עתידי + ולדיציית תאריך
       ========================================== */
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    const todayStr = todayObj.toISOString().split('T')[0];

    dateInputs.forEach(input => {
        if (!input.hasAttribute('min')) {
            input.setAttribute('min', todayStr);
        }
    });

    // בדיקת תאריך בעמוד הבית
    const quickSearchForm = document.getElementById('quick-search-form');
    if (quickSearchForm) {
        quickSearchForm.addEventListener('submit', (e) => {
            const dateInput = document.getElementById('quick-date');
            if (dateInput && dateInput.value) {
                const selectedDate = new Date(dateInput.value);
                selectedDate.setHours(0, 0, 0, 0);
                if (selectedDate < todayObj) {
                    e.preventDefault();
                    alert('נא לבחור תאריך עתידי בלבד');
                    dateInput.focus();
                }
            }
        });
    }

    /* ==========================================
       4. חיפוש וסינון אולמות (search-venue.html)
       ========================================== */
    const venueSearchForm = document.getElementById('search-venue-form');
    const venuesContainer = document.getElementById('venues-container');
    const venueEmptyState = document.getElementById('empty-state');
    const venueResultsCount = document.getElementById('results-count');

    if (venueSearchForm && venuesContainer && typeof VENUES_DATA !== 'undefined') {
        
        function renderVenues(venuesList, guestsCount = null) {
            venuesContainer.innerHTML = '';

            if (venuesList.length === 0) {
                if (venueEmptyState) venueEmptyState.classList.remove('hidden');
                if (venueResultsCount) venueResultsCount.textContent = '0 אולמות נמצאו';
                return;
            }

            if (venueEmptyState) venueEmptyState.classList.add('hidden');
            if (venueResultsCount) venueResultsCount.textContent = `${venuesList.length} אולמות נמצאו`;

            venuesList.forEach(venue => {
                const calcGuests = guestsCount || 300;
                const totalCost = venue.pricePerPlate * calcGuests;
                
                const costText = guestsCount 
                    ? `עלות משוערת (${guestsCount} מוזמנים): ₪${totalCost.toLocaleString()}`
                    : `מחיר משוער ל-300 מוזמנים: ₪${totalCost.toLocaleString()}`;

                const card = document.createElement('div');
                card.className = 'card card-bordered venue-card';
                card.innerHTML = `
                    <div class="card-img-placeholder">${venue.image} ${venue.name}</div>
                    <h3>${venue.name}</h3>
                    <p><strong>אזור:</strong> ${venue.regionName}</p>
                    <p><strong>קיבולת:</strong> ${venue.minGuests} - ${venue.maxGuests} אורחים</p>
                    <p><strong>מחיר למנה:</strong> ₪${venue.pricePerPlate}</p>
                    <p style="margin-top: 8px; color: var(--primary-color); font-weight: bold;">
                        ${costText}
                    </p>
                    <button class="btn btn-dark btn-block select-venue-btn" style="margin-top: 15px;" data-id="${venue.id}">שמירה לאירוע שלי</button>
                `;
                venuesContainer.appendChild(card);
            });
        }

        renderVenues(VENUES_DATA);

        venueSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const searchDateInput = document.getElementById('search-date');
            if (searchDateInput && searchDateInput.value) {
                const selDate = new Date(searchDateInput.value);
                selDate.setHours(0, 0, 0, 0);
                if (selDate < todayObj) {
                    alert('נא לבחור תאריך עתידי בלבד');
                    searchDateInput.focus();
                    return;
                }
            }
            
            const guestsInputVal = document.getElementById('guests-count')?.value;
            const budgetInputVal = document.getElementById('max-budget')?.value;

            const selectedGuests = guestsInputVal ? parseInt(guestsInputVal) : null;
            const maxBudget = budgetInputVal ? parseInt(budgetInputVal) : Infinity;
            
            const selectedRegions = Array.from(document.querySelectorAll('input[name="region"]:checked'))
                .map(cb => cb.value);

            const filtered = VENUES_DATA.filter(venue => {
                const matchRegion = selectedRegions.length === 0 || selectedRegions.includes(venue.region);
                const matchGuests = selectedGuests === null || (selectedGuests >= venue.minGuests && selectedGuests <= venue.maxGuests);
                const calcGuestsForBudget = selectedGuests || 300;
                const totalCost = venue.pricePerPlate * calcGuestsForBudget;
                const matchBudget = totalCost <= maxBudget;

                return matchRegion && matchGuests && matchBudget;
            });

            renderVenues(filtered, selectedGuests);
        });
    }

    /* ==========================================
       5. חיפוש וסינון ספקים דינמי (suppliers.html)
       ========================================== */
    const suppliersSearchForm = document.getElementById('search-suppliers-form');
    const suppliersContainer = document.getElementById('suppliers-container');
    const cateringCheckbox = document.getElementById('catering-checkbox');
    const cateringGuestsGroup = document.getElementById('catering-guests-group');
    const supplierResultsCount = document.getElementById('suppliers-results-count');

    // הצגה/הסתרה של שדה אורחים בעת סימון קייטרינג ב-DOM
    if (cateringCheckbox && cateringGuestsGroup) {
        cateringCheckbox.addEventListener('change', () => {
            if (cateringCheckbox.checked) {
                cateringGuestsGroup.classList.remove('hidden');
            } else {
                cateringGuestsGroup.classList.add('hidden');
            }
        });
    }

    if (suppliersSearchForm && suppliersContainer && typeof SUPPLIERS_DATA !== 'undefined') {

        function renderSuppliers(suppliersList) {
            suppliersContainer.innerHTML = '';

            if (suppliersList.length === 0) {
                suppliersContainer.innerHTML = '<div class="empty-state">לא נמצאו ספקים התואמים את הסינון שלך</div>';
                if (supplierResultsCount) supplierResultsCount.textContent = '0 ספקים נמצאו';
                return;
            }

            if (supplierResultsCount) supplierResultsCount.textContent = `${suppliersList.length} ספקים נמצאו`;

            suppliersList.forEach(supplier => {
                const card = document.createElement('div');
                card.className = 'card card-bordered supplier-card';
                card.innerHTML = `
                    <div class="card-img-placeholder">${supplier.image} ${supplier.name}</div>
                    <h3>${supplier.name}</h3>
                    <p><strong>קטגוריה:</strong> ${supplier.categoryName}</p>
                    <p><strong>דירוג:</strong> ⭐ ${supplier.rating}</p>
                    <p><strong>מחיר משוער:</strong> ₪${supplier.price.toLocaleString()}</p>
                    <button class="btn btn-dark btn-block" style="margin-top: 15px;">שמירה לאירוע שלי</button>
                `;
                suppliersContainer.appendChild(card);
            });
        }

        renderSuppliers(SUPPLIERS_DATA);

        suppliersSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // ולדיציית תאריך
            const supplierDateInput = document.getElementById('supplier-date');
            if (supplierDateInput && supplierDateInput.value) {
                const selDate = new Date(supplierDateInput.value);
                selDate.setHours(0, 0, 0, 0);
                if (selDate < todayObj) {
                    alert('נא לבחור תאריך עתידי בלבד');
                    supplierDateInput.focus();
                    return;
                }
            }

            // סוגי ספקים שנבחרו (ריבוי בחירה)
            const selectedCategories = Array.from(document.querySelectorAll('input[name="supplier-type"]:checked'))
                .map(cb => cb.value);

            const maxBudgetVal = document.getElementById('supplier-max-budget')?.value;
            const maxBudget = maxBudgetVal ? parseInt(maxBudgetVal) : Infinity;

            const filtered = SUPPLIERS_DATA.filter(supplier => {
                const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(supplier.category);
                const matchBudget = supplier.price <= maxBudget;
                return matchCategory && matchBudget;
            });

            renderSuppliers(filtered);
        });
    }

    /* ==========================================
       6. מודאלים (Modals)
       ========================================== */
    const openBudgetBtn = document.getElementById('open-budget-modal');
    const closeBudgetBtn = document.getElementById('close-budget-modal');
    const budgetModal = document.getElementById('budget-modal');

    if (openBudgetBtn && budgetModal) {
        openBudgetBtn.addEventListener('click', () => budgetModal.classList.remove('hidden'));
    }
    if (closeBudgetBtn && budgetModal) {
        closeBudgetBtn.addEventListener('click', () => budgetModal.classList.add('hidden'));
    }

    const openShareBtn = document.getElementById('open-share-modal');
    const closeShareBtn = document.getElementById('close-share-modal');
    const shareModal = document.getElementById('share-modal');

    if (openShareBtn && shareModal) {
        openShareBtn.addEventListener('click', () => shareModal.classList.remove('hidden'));
    }
    if (closeShareBtn && shareModal) {
        closeShareBtn.addEventListener('click', () => shareModal.classList.add('hidden'));
    }

    /* ==========================================
       7. עדכון תקציב (my-event.html)
       ========================================== */
    const editBudgetForm = document.getElementById('edit-budget-form');
    if (editBudgetForm) {
        editBudgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newBudgetInput = document.getElementById('new-total-budget');
            const newBudget = parseInt(newBudgetInput.value);

            if (newBudget > 0) {
                const totalBudgetVal = document.getElementById('total-budget-val');
                const remainingBudgetVal = document.getElementById('remaining-budget-val');
                const progressBar = document.getElementById('budget-progress-bar');
                const budgetWarning = document.getElementById('budget-warning');

                const usedBudget = 162000;
                const remaining = newBudget - usedBudget;

                if (totalBudgetVal) totalBudgetVal.textContent = `₪${newBudget.toLocaleString()}`;
                if (remainingBudgetVal) remainingBudgetVal.textContent = `₪${remaining.toLocaleString()}`;

                const percent = Math.min((usedBudget / newBudget) * 100, 100);
                if (progressBar) {
                    progressBar.style.width = `${percent}%`;
                    if (usedBudget > newBudget) {
                        progressBar.style.backgroundColor = 'var(--error-red)';
                        if (budgetWarning) budgetWarning.style.display = 'block';
                    } else {
                        progressBar.style.backgroundColor = 'var(--primary-color)';
                        if (budgetWarning) budgetWarning.style.display = 'none';
                    }
                }

                budgetModal.classList.add('hidden');
            }
        });
    }
});