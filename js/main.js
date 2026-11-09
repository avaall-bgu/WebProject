document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       פונקציות עזר להצגת משוב ושגיאות בטפסים
       ========================================== */
    function showError(inputElement, message) {
        clearError(inputElement);
        if (!inputElement) return;
        
        inputElement.classList.add('input-error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--error-red, #e74c3c)';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        
        inputElement.parentNode.appendChild(errorDiv);
        inputElement.focus();
    }

    function showGroupError(containerElement, message) {
        clearGroupError(containerElement);
        if (!containerElement) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'group-error-message';
        errorDiv.style.color = 'var(--error-red, #e74c3c)';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;

        containerElement.appendChild(errorDiv);
    }

    function clearError(inputElement) {
        if (!inputElement) return;
        inputElement.classList.remove('input-error');
        const parent = inputElement.parentNode;
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            parent.removeChild(existingError);
        }
    }

    function clearGroupError(containerElement) {
        if (!containerElement) return;
        const existingError = containerElement.querySelector('.group-error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    function clearAllFormErrors(form) {
        if (!form) return;
        const errors = form.querySelectorAll('.error-message, .group-error-message');
        errors.forEach(err => err.remove());
        const inputs = form.querySelectorAll('.input-error');
        inputs.forEach(inp => inp.classList.remove('input-error'));
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

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
       2. התחברות והרשמה (auth.html)
       ========================================== */
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const gotoRegisterBtn = document.getElementById('goto-register-btn');
    const gotoLoginBtn = document.getElementById('goto-login-btn');

    const existingUsers = JSON.parse(localStorage.getItem('registered_users')) || [
        'demo@wedding.com',
        'test@user.co.il'
    ];

    if (gotoRegisterBtn && gotoLoginBtn && loginForm && registerForm) {
        gotoRegisterBtn.addEventListener('click', () => {
            clearAllFormErrors(loginForm);
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        });

        gotoLoginBtn.addEventListener('click', () => {
            clearAllFormErrors(registerForm);
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllFormErrors(registerForm);

            const nameInput = document.getElementById('reg-name');
            const emailInput = document.getElementById('reg-email');
            const passwordInput = document.getElementById('reg-password');
            const confirmPasswordInput = document.getElementById('reg-confirm-password');

            const nameVal = nameInput?.value.trim();
            const emailVal = emailInput?.value.trim().toLowerCase();
            const passwordVal = passwordInput?.value;
            const confirmVal = confirmPasswordInput?.value;

            if (!nameVal) {
                showError(nameInput, 'נא להזין שם מלא');
                return;
            }

            if (!emailVal) {
                showError(emailInput, 'נא להזין כתובת אימייל');
                return;
            }

            if (!isValidEmail(emailVal)) {
                showError(emailInput, 'כתובת האימייל אינה תקינה (למשל: name@example.com)');
                return;
            }

            if (existingUsers.includes(emailVal)) {
                showError(emailInput, 'קיים כבר משתמש הרשום עם כתובת אימייל זו');
                return;
            }

            if (!passwordVal || passwordVal.length < 6) {
                showError(passwordInput, 'הסיסמה חייבת להכיל לפחות 6 תווים');
                return;
            }

            if (passwordVal !== confirmVal) {
                showError(confirmPasswordInput, 'הסיסמה ואימות הסיסמה אינם תואמים');
                return;
            }

            existingUsers.push(emailVal);
            localStorage.setItem('registered_users', JSON.stringify(existingUsers));

            alert('ההרשמה הושלמה בהצלחה! מעביר אותך להתחברות...');
            registerForm.reset();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllFormErrors(loginForm);

            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');

            const emailVal = emailInput?.value.trim().toLowerCase();
            const passwordVal = passwordInput?.value;

            if (!emailVal || !isValidEmail(emailVal)) {
                showError(emailInput, 'נא להזין כתובת אימייל תקינה');
                return;
            }

            if (!passwordVal) {
                showError(passwordInput, 'נא להזין סיסמה');
                return;
            }

            alert('התחברת בהצלחה למערכת!');
        });
    }

    /* ==========================================
       3. הגדרת מגבלת תאריך עתידי + ולדיציה
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

    const quickSearchForm = document.getElementById('quick-search-form');
    if (quickSearchForm) {
        quickSearchForm.addEventListener('submit', (e) => {
            const dateInput = document.getElementById('quick-date');
            if (dateInput) clearError(dateInput);
            if (dateInput && dateInput.value) {
                const selectedDate = new Date(dateInput.value);
                selectedDate.setHours(0, 0, 0, 0);
                if (selectedDate < todayObj) {
                    e.preventDefault();
                    showError(dateInput, 'נא לבחור תאריך עתידי בלבד');
                }
            }
        });
    }

    /* ==========================================
       4. חיפוש וסינון אולמות דינמי (search-venue.html)
       ========================================== */
    const venueSearchForm = document.getElementById('search-venue-form');
    const venuesContainer = document.getElementById('venues-container');
    const venueEmptyState = document.getElementById('empty-state');
    const venueResultsCount = document.getElementById('results-count');

    if (venueSearchForm && venuesContainer && typeof VENUES_DATA !== 'undefined') {
        
        if (venueResultsCount) venueResultsCount.textContent = 'מלאו את שדות הסינון ולחצו על חיפוש';
        venuesContainer.innerHTML = '<div class="empty-state">תוצאות החיפוש יופיעו כאן לאחר לחיצה על "חיפוש אולמות"</div>';

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

        venueSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const searchDateInput = document.getElementById('search-date');
            if (searchDateInput) clearError(searchDateInput);

            if (searchDateInput && searchDateInput.value) {
                const selDate = new Date(searchDateInput.value);
                selDate.setHours(0, 0, 0, 0);
                if (selDate < todayObj) {
                    showError(searchDateInput, 'נא לבחור תאריך עתידי בלבד');
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

        if (supplierResultsCount) supplierResultsCount.textContent = 'מלאו את פרטי הסינון ולחצו על סינון ספקים';
        suppliersContainer.innerHTML = '<div class="empty-state">תוצאות החיפוש יופיעו כאן לאחר לחיצה על "סינון ספקים"</div>';

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

        suppliersSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllFormErrors(suppliersSearchForm);

            const selectedCategories = Array.from(document.querySelectorAll('input[name="supplier-type"]:checked'))
                .map(cb => cb.value);

            const checkboxGroupContainer = suppliersSearchForm.querySelector('.checkbox-group');

            if (selectedCategories.length === 0) {
                showGroupError(checkboxGroupContainer, 'יש לבחור לפחות קטגוריית ספק אחת');
                return;
            }

            const supplierDateInput = document.getElementById('supplier-date');
            if (supplierDateInput && supplierDateInput.value) {
                const selDate = new Date(supplierDateInput.value);
                selDate.setHours(0, 0, 0, 0);
                if (selDate < todayObj) {
                    showError(supplierDateInput, 'נא לבחור תאריך עתידי בלבד');
                    return;
                }
            }

            const maxBudgetVal = document.getElementById('supplier-max-budget')?.value;
            const maxBudget = maxBudgetVal ? parseInt(maxBudgetVal) : Infinity;

            const filtered = SUPPLIERS_DATA.filter(supplier => {
                const matchCategory = selectedCategories.includes(supplier.category);
                const matchBudget = supplier.price <= maxBudget;
                return matchCategory && matchBudget;
            });

            renderSuppliers(filtered);
        });
    }

    /* ==========================================
       6. עמוד האירוע שלי: עריכת תקציב + הסרה מטבלה (my-event.html)
       ========================================== */
    const budgetModal = document.getElementById('budget-modal');
    
    // פתיחה וסגירה של מודאל עריכת תקציב
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, a');
        if (btn) {
            const btnText = btn.textContent.trim();
            if (btnText.includes('עריכת תקציב') || btn.id === 'open-budget-modal') {
                if (budgetModal) budgetModal.classList.remove('hidden');
            }
            if (btn.id === 'close-budget-modal' || btn.classList.contains('close-modal-btn')) {
                if (budgetModal) budgetModal.classList.add('hidden');
            }
        }
    });

    let currentTotalBudget = 250000;

    function updateBudgetSummary() {
        // מציאת השורות בטבלה
        const tableRows = document.querySelectorAll('table tr, .suppliers-table tr, tbody tr');
        let totalUsed = 0;

        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                const text = cell.textContent.trim();
                if (text.includes('₪')) {
                    const num = parseInt(text.replace(/[^\d]/g, ''), 10);
                    if (!isNaN(num) && num > 0) {
                        totalUsed += num;
                    }
                }
            });
        });

        const remaining = currentTotalBudget - totalUsed;
        const percentage = Math.min((totalUsed / currentTotalBudget) * 100, 100);

        // תפיסת אלמנטים לפי ID במידה וקיימים, או דריסת תוכן הטקסט הקיים בצורה נקייה
        const totalBudgetValEl = document.getElementById('total-budget-val');
        const usedBudgetValEl = document.getElementById('used-budget-val');
        const remainingBudgetValEl = document.getElementById('remaining-budget-val');

        if (totalBudgetValEl) {
            totalBudgetValEl.textContent = `₪${currentTotalBudget.toLocaleString()}`;
        }
        if (usedBudgetValEl) {
            usedBudgetValEl.textContent = `₪${totalUsed.toLocaleString()}`;
        }
        if (remainingBudgetValEl) {
            remainingBudgetValEl.textContent = `₪${remaining.toLocaleString()}`;
        }

        // גיבוי למידה ואין תגיות id - החלפה נקייה עם regex שמחליף רק את המספר ב-₪
        if (!totalBudgetValEl || !usedBudgetValEl || !remainingBudgetValEl) {
            document.querySelectorAll('p, div, span').forEach(el => {
                if (el.children.length === 0) {
                    if (el.textContent.includes('תקציב כולל:')) {
                        el.textContent = `תקציב כולל: ₪${currentTotalBudget.toLocaleString()}`;
                    } else if (el.textContent.includes('נוצל:')) {
                        el.textContent = `נוצל: ₪${totalUsed.toLocaleString()}`;
                    } else if (el.textContent.includes('נשאר:')) {
                        el.textContent = `נשאר: ₪${remaining.toLocaleString()}`;
                    }
                }
            });
        }

        // עדכון סרגל ההתקדמות
        const progressBar = document.querySelector('.progress-bar, #budget-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }

    // מנגנון הסרה
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (btn && btn.textContent.trim() === 'הסרה') {
            const row = btn.closest('tr');
            if (row) {
                row.remove();
                updateBudgetSummary(); // דריסה ועדכון נקי מחדש!
            }
        }
    });

    // טופס עדכון תקציב
    const editBudgetForm = document.getElementById('edit-budget-form');
    if (editBudgetForm) {
        editBudgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = editBudgetForm.querySelector('input[type="number"]');
            if (input) clearError(input);

            const newBudget = parseInt(input?.value || '0', 10);

            if (!newBudget || newBudget <= 0) {
                showError(input, 'נא להזין סכום תקציב תקין הגדול מ-0');
                return;
            }

            currentTotalBudget = newBudget;
            updateBudgetSummary();

            if (budgetModal) budgetModal.classList.add('hidden');
            editBudgetForm.reset();
        });
    }
});