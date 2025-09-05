/* ===============================================
   CONTACT PAGE JAVASCRIPT FUNCTIONALITY
   =============================================== */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

// Main Contact Page Initialization
function initializeContactPage() {
    initializeFAQAccordion();
    initializeContactForm();
    initializeFloatingElements();
    initializeAnimations();
    initializeMethodButtons();
}

/* ===============================================
   FAQ ACCORDION FUNCTIONALITY
   =============================================== */

function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* ===============================================
   CONTACT FORM FUNCTIONALITY
   =============================================== */

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
    
    // Character counter for message textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        createCharacterCounter(messageTextarea);
    }
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    
    // Clear previous errors
    clearFieldError(field);
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'firstName':
        case 'lastName':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;
            
        case 'subject':
            if (value.length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters';
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function createCharacterCounter(textarea) {
    const maxLength = 500;
    const counterDiv = document.createElement('div');
    counterDiv.className = 'character-counter';
    counterDiv.style.cssText = `
        text-align: right;
        font-size: 12px;
        color: #666;
        margin-top: 5px;
    `;
    
    const updateCounter = () => {
        const currentLength = textarea.value.length;
        counterDiv.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counterDiv.style.color = '#dc3545';
        } else {
            counterDiv.style.color = '#666';
        }
    };
    
    textarea.addEventListener('input', updateCounter);
    textarea.parentNode.appendChild(counterDiv);
    updateCounter();
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    // Validate all fields
    let isFormValid = true;
    inputs.forEach(input => {
        if (input.hasAttribute('required')) {
            if (!validateField(input)) {
                isFormValid = false;
            }
        }
    });
    
    // Check privacy policy agreement
    const privacyCheckbox = form.querySelector('#privacyPolicy');
    if (!privacyCheckbox.checked) {
        isFormValid = false;
        showFormMessage('Please agree to the privacy policy to continue.', 'error');
        return;
    }
    
    if (!isFormValid) {
        showFormMessage('Please correct the errors above and try again.', 'error');
        return;
    }
    
    // Simulate form submission
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        showFormMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // Clear any remaining error states
        inputs.forEach(input => clearFieldError(input));
        
        // Scroll to success message
        const successMessage = document.querySelector('.form-message');
        if (successMessage) {
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 2000);
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type === 'success' ? 'success-message' : 'error-message'}`;
    messageDiv.textContent = message;
    
    if (type === 'error') {
        messageDiv.style.cssText = `
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        `;
    }
    
    // Insert message at the top of the form
    const form = document.getElementById('contactForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

/* ===============================================
   FLOATING ELEMENTS ANIMATION
   =============================================== */

function initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-icon');
    
    floatingElements.forEach((element, index) => {
        // Add random floating animation variations
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 2;
        
        element.style.animationDelay = randomDelay + 's';
        element.style.animationDuration = randomDuration + 's';
        
        // Add hover effect
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-10px) scale(1.1)';
            element.style.transition = 'all 0.3s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.transition = '';
        });
    });
}

/* ===============================================
   METHOD BUTTONS FUNCTIONALITY
   =============================================== */

function initializeMethodButtons() {
    const methodButtons = document.querySelectorAll('.method-btn');
    
    methodButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const method = button.closest('.method-card');
            const methodType = method.querySelector('.method-title').textContent.toLowerCase();
            
            handleMethodAction(methodType, button);
        });
    });
    
    // Map button functionality
    const mapBtn = document.querySelector('.map-btn');
    if (mapBtn) {
        mapBtn.addEventListener('click', () => {
            // Open Google Maps with store location
            const address = encodeURIComponent('123 Fashion Street, Shopping District, City 10001');
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
            window.open(googleMapsUrl, '_blank');
        });
    }
}

function handleMethodAction(methodType, button) {
    const originalText = button.innerHTML;
    
    switch (methodType) {
        case 'phone support':
            // Simulate calling action
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            setTimeout(() => {
                button.innerHTML = originalText;
                window.location.href = 'tel:+1234567890';
            }, 1000);
            break;
            
        case 'email support':
            // Simulate email action
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
            setTimeout(() => {
                button.innerHTML = originalText;
                window.location.href = 'mailto:support@yourstore.com?subject=Support Request';
            }, 1000);
            break;
            
        case 'live chat':
            // Simulate chat opening
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting Chat...';
            setTimeout(() => {
                button.innerHTML = originalText;
                showChatModal();
            }, 1000);
            break;
            
        case 'visit store':
            // Show store directions
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            setTimeout(() => {
                button.innerHTML = originalText;
                document.getElementById('location-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }, 1000);
            break;
    }
}

function showChatModal() {
    // Simple chat modal simulation
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
        ">
            <i class="fas fa-comments" style="font-size: 48px; color: #667eea; margin-bottom: 20px;"></i>
            <h3 style="margin-bottom: 15px;">Live Chat Coming Soon!</h3>
            <p style="color: #666; margin-bottom: 30px;">
                Our live chat feature is currently under development. 
                Please use our contact form or call us directly.
            </p>
            <button onclick="this.closest('.modal').remove()" style="
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
            ">Close</button>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/* ===============================================
   SCROLL ANIMATIONS
   =============================================== */

function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .method-card,
        .info-card,
        .faq-item,
        .form-container > *
    `);
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.animationDelay = (index * 0.1) + 's';
        observer.observe(el);
    });
}

/* ===============================================
   UTILITY FUNCTIONS
   =============================================== */

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add CSS for notification animations
const notificationCSS = `
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;

// Inject notification CSS
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

/* ===============================================
   CONTACT FORM AUTO-FILL FOR DEMO
   =============================================== */

// Demo function to show form validation (remove in production)
function demoFillForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.firstName.value = 'John';
    form.lastName.value = 'Doe';
    form.email.value = 'john.doe@example.com';
    form.phone.value = '+1 (555) 123-4567';
    form.subject.value = 'Product Inquiry';
    form.message.value = 'Hello, I am interested in learning more about your products and services. Could you please provide me with more information?';
}

// Add demo button in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(() => {
        const demoBtn = document.createElement('button');
        demoBtn.textContent = 'Demo Fill';
        demoBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 12px;
            cursor: pointer;
            z-index: 9999;
        `;
        demoBtn.onclick = demoFillForm;
        document.body.appendChild(demoBtn);
    }, 2000);
}
