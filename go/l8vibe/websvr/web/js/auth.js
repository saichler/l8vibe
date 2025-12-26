// Authentication Module
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.bearerToken = null;
    }

    // Initialize authentication event listeners
    init() {
        this.bindLoginEvents();
        this.bindLogoutEvents();
        // Don't check stored auth during init - defer to app initialization
    }

    // Bind login form events
    bindLoginEvents() {
        const loginBtn = document.getElementById('loginBtn');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Handle Enter key in login form
        [emailInput, passwordInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleLogin();
                    }
                });
            }
        });
    }

    // Bind logout events
    bindLogoutEvents() {
        const logoutBtns = document.querySelectorAll('#logoutBtn, #workspaceLogoutBtn');
        
        logoutBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
            }
        });
    }

    // Handle login process
    async handleLogin() {
        const email = document.getElementById('loginEmail')?.value?.trim();
        const password = document.getElementById('loginPassword')?.value?.trim();
        const loginBtn = document.getElementById('loginBtn');

        // Validation
        if (!email || !password) {
            this.showError('Please enter both email and password');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        // Show loading state
        if (loginBtn) {
            loginBtn.textContent = 'Connecting...';
            loginBtn.disabled = true;
            loginBtn.classList.add('loading');
        }

        try {
            // Simulate authentication (replace with actual API call)
            await this.authenticateUser(email, password);
            
            // Store authentication
            this.currentUser = {
                email: email,
                name: this.extractNameFromEmail(email),
                loginTime: new Date().toISOString()
            };
            this.isAuthenticated = true;
            this.storeAuth();

            // Enable Create Project button
            this.enableCreateProjectButton();
            
            // Enable Projects menu
            this.enableProjectsMenu();
            
            // Load user projects immediately after successful login
            this.loadUserProjectsAfterLogin();
            
            // Close login modal
            this.closeLoginModal();
            
            // Update Sign In button to Sign Out
            this.updateSignInButton();
            
            // Show success message but don't navigate anywhere
            this.showSuccess('Welcome back! You can now create projects.');

        } catch (error) {
            this.showError(error.message || 'Authentication failed. Please try again.');
            console.error('Login error:', error);
        } finally {
            // Reset button state
            if (loginBtn) {
                loginBtn.textContent = 'Begin Your Journey';
                loginBtn.disabled = false;
                loginBtn.classList.remove('loading');
            }
        }
    }

    // Handle logout process
    handleLogout() {
        // Clear authentication
        this.currentUser = null;
        this.isAuthenticated = false;
        this.bearerToken = null;
        this.clearStoredAuth();

        // Reset forms
        this.clearForms();

        // Disable Create Project button
        this.disableCreateProjectButton();
        
        // Disable Projects menu
        this.disableProjectsMenu();
        
        // Reset Sign Out button back to Sign In
        this.resetSignInButton();
        
        // Navigate to marketing screen
        app.showScreen('marketingScreen');
        this.showSuccess('You have been signed out');
    }

    // Authenticate user via /auth endpoint
    async authenticateUser(email, password) {
        let response;
        try {
            response = await fetch('/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: email, pass: password })
            });
        } catch (networkError) {
            throw new Error('Unable to connect to server. Please try again.');
        }

        const text = await response.text();

        // If the response is blank, login failed
        if (!text || text.trim() === '') {
            throw new Error('Invalid username or password.');
        }

        // Parse JSON response and extract token
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            throw new Error('Invalid username or password.');
        }

        if (!data.token) {
            throw new Error('Invalid username or password.');
        }

        // Store the bearer token
        this.bearerToken = data.token;

        return { success: true, user: { email }, token: this.bearerToken };
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Extract name from email for display
    extractNameFromEmail(email) {
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // Store authentication in localStorage
    storeAuth() {
        if (window.location.protocol === 'file:') {
            console.warn('localStorage not available with file:// protocol');
            return;
        }

        if (this.currentUser) {
            localStorage.setItem('l8vibe_auth', JSON.stringify({
                user: this.currentUser,
                authenticated: this.isAuthenticated,
                token: this.bearerToken,
                timestamp: Date.now()
            }));
        }
    }

    // Check for stored authentication
    checkStoredAuth() {
        console.log('checkStoredAuth called - always starting signed out');

        // Always clear any stored authentication and start in signed-out state
        localStorage.removeItem('l8vibe_auth');
        this.currentUser = null;
        this.isAuthenticated = false;
        this.bearerToken = null;
        
        // Skip localStorage operations for file:// protocol
        if (window.location.protocol === 'file:') {
            console.warn('localStorage not available with file:// protocol');
            app.showScreen('marketingScreen');
            return;
        }
        
        // Always show marketing screen (signed-out state)
        app.showScreen('marketingScreen');
        console.log('checkStoredAuth complete - always signed out');
    }

    // Clear stored authentication
    clearStoredAuth() {
        if (window.location.protocol === 'file:') {
            return;
        }
        localStorage.removeItem('l8vibe_auth');
    }

    // Clear all forms
    clearForms() {
        const forms = document.querySelectorAll('input, textarea');
        forms.forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.value = '';
            }
        });
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show notification (simple implementation)
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            fontSize: '14px',
            maxWidth: '300px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease-out',
            backgroundColor: type === 'error' ? '#c17854' : 
                           type === 'success' ? '#5a6b4f' : '#6b5b4f'
        });

        // Add to document
        document.body.appendChild(notification);

        // Remove after delay
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    // Get bearer token for API calls
    getBearerToken() {
        return this.bearerToken;
    }

    // Get authorization headers for API calls
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.bearerToken) {
            headers['Authorization'] = `Bearer ${this.bearerToken}`;
        }
        return headers;
    }

    // Enable Create Project button
    enableCreateProjectButton() {
        const createProjectBtn = document.getElementById('createProjectCTA');
        if (createProjectBtn) {
            createProjectBtn.disabled = false;
            createProjectBtn.classList.remove('disabled');
        }
    }

    // Disable Create Project button
    disableCreateProjectButton() {
        const createProjectBtn = document.getElementById('createProjectCTA');
        if (createProjectBtn) {
            createProjectBtn.disabled = true;
            createProjectBtn.classList.add('disabled');
        }
    }

    // Enable Projects menu
    enableProjectsMenu() {
        if (window.marketing) {
            marketing.enableProjectsMenu();
        }
    }

    // Disable Projects menu
    disableProjectsMenu() {
        if (window.marketing) {
            marketing.disableProjectsMenu();
        }
    }

    // Load user projects after successful login
    loadUserProjectsAfterLogin() {
        if (window.marketing) {
            // Use setTimeout to avoid blocking the authentication flow
            setTimeout(() => {
                marketing.loadUserProjects();
            }, 100);
        }
    }


    // Close login modal
    closeLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal && window.marketing) {
            marketing.hideLoginModal();
        }
    }

    // Update Sign In button to Sign Out after login
    updateSignInButton() {
        const loginBtn = document.getElementById('loginCTA');
        if (loginBtn) {
            loginBtn.textContent = 'Sign Out';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                this.handleLogout();
            };
        }
    }

    // Reset Sign Out button to Sign In after logout
    resetSignInButton() {
        const loginBtn = document.getElementById('loginCTA');
        if (loginBtn) {
            loginBtn.textContent = 'Sign In';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                if (window.marketing) {
                    marketing.showLoginModal();
                }
            };
        }
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);