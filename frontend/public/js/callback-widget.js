// Callback Widget Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create callback widget HTML
    const widgetHTML = `
        <div class="callback-widget">
            <button class="callback-button" id="callbackBtn" title="Request Callback">
                <i class="fas fa-phone"></i>
            </button>
            
            <div class="callback-popup" id="callbackPopup">
                <div class="callback-popup-header">
                    <h3><i class="fas fa-phone"></i> Request Callback</h3>
                    <button class="callback-close-btn" id="callbackCloseBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="callback-popup-body">
                    <p>We'll call you back within the hour!</p>
                    
                    <div class="callback-success" id="callbackSuccess">
                        <i class="fas fa-check"></i> We'll call you soon!
                    </div>
                    <div class="callback-error" id="callbackError">
                        <i class="fas fa-exclamation-triangle"></i> Error. Please try again.
                    </div>
                    
                    <form id="callbackForm">
                        <div class="callback-form-group">
                            <label>Your Name *</label>
                            <input type="text" name="name" placeholder="Enter your name" required>
                        </div>
                        
                        <div class="callback-form-group">
                            <label>Phone Number *</label>
                            <input type="tel" name="phone" placeholder="+91 9876543210" required>
                        </div>
                        
                        <div class="callback-form-group">
                            <label>When should we call?</label>
                            <select name="preferredCallbackTime">
                                <option value="ASAP">As soon as possible</option>
                                <option value="Morning">Morning (9 AM - 12 PM)</option>
                                <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                                <option value="Evening">Evening (4 PM - 7 PM)</option>
                            </select>
                        </div>
                        
                        <div class="callback-form-group">
                            <label>Urgency</label>
                            <select name="urgency">
                                <option value="immediate">Immediate (within 1 hour)</option>
                                <option value="today">Today</option>
                                <option value="this_week">This week</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="callback-submit-btn" id="callbackSubmitBtn">
                            <i class="fas fa-phone"></i> Request Callback
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add widget to page
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    
    // Get elements
    const callbackBtn = document.getElementById('callbackBtn');
    const callbackPopup = document.getElementById('callbackPopup');
    const callbackCloseBtn = document.getElementById('callbackCloseBtn');
    const callbackForm = document.getElementById('callbackForm');
    const callbackSubmitBtn = document.getElementById('callbackSubmitBtn');
    const callbackSuccess = document.getElementById('callbackSuccess');
    const callbackError = document.getElementById('callbackError');
    
    // Toggle popup
    callbackBtn.addEventListener('click', function() {
        callbackPopup.classList.toggle('active');
    });
    
    // Close popup
    callbackCloseBtn.addEventListener('click', function() {
        callbackPopup.classList.remove('active');
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.callback-widget')) {
            callbackPopup.classList.remove('active');
        }
    });
    
    // Handle form submission
    callbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        callbackSuccess.classList.remove('show');
        callbackError.classList.remove('show');
        
        callbackSubmitBtn.disabled = true;
        callbackSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            preferredCallbackTime: formData.get('preferredCallbackTime'),
            urgency: formData.get('urgency')
        };
        
        try {
            const response = await fetch('/api/leads/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                callbackSuccess.classList.add('show');
                callbackSuccess.textContent = '✅ ' + result.message;
                this.reset();
                
                // Close popup after 3 seconds
                setTimeout(() => {
                    callbackPopup.classList.remove('active');
                    callbackSuccess.classList.remove('show');
                }, 3000);
            } else {
                callbackError.classList.add('show');
                callbackError.textContent = '❌ ' + result.message;
            }
        } catch (error) {
            console.error('Callback error:', error);
            callbackError.classList.add('show');
            callbackError.textContent = '❌ Network error. Please try again.';
        } finally {
            callbackSubmitBtn.disabled = false;
            callbackSubmitBtn.innerHTML = '<i class="fas fa-phone"></i> Request Callback';
        }
    });
});
