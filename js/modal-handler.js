// modal-handler.js - Controls the subscription modal functionality

// Create modal element if it doesn't exist
function createModal() {
    // Check if modal already exists
    if (document.getElementById('subscription-modal')) {
        return;
    }
    
    const modalHTML = `
    <div id="subscription-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4 hidden">
        <div class="bg-gradient-to-r from-pink-100 to-blue-100 rounded-xl p-8 max-w-3xl w-full opacity-0 transform translate-y-10 shadow-lg transition-all duration-300">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-3xl font-bold text-pink-600">Stay Updated</h3>
                <button id="closeModal" class="text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                    <p class="text-gray-600">Subscribe to our newsletter and be the first to know about upcoming novels, sneak peeks, and exclusive offers.</p>
                    <div id="novelInfo" class="mt-4 p-4 bg-white bg-opacity-50 rounded-lg">
                        <h4 class="font-bold text-pink-600 novel-title"></h4>
                        <p class="text-sm text-gray-600 novel-date"></p>
                    </div>
                </div>
                <div class="md:w-1/2">
                    <form id="notifyForm" class="flex flex-col gap-3">
                        <div>
                            <input id="notifyEmail" type="email" required placeholder="Your email address" class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 border border-gray-200">
                        </div>
                        <div id="formMessage" class="text-sm hidden"></div>
                        <button type="submit" class="text-white font-medium py-3 px-6 rounded-lg whitespace-nowrap bg-pink-500 hover:bg-pink-600 transition">Subscribe Now</button>
                    </form>                    
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Insert modal into body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    setupModalListeners();
}

// Set up event listeners for the modal
function setupModalListeners() {
    const modal = document.getElementById('subscription-modal');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('notifyForm');
    
    // Close modal when clicking close button
    closeBtn.addEventListener('click', () => {
        closeModal();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('notifyEmail').value;
        const novelId = modal.getAttribute('data-novel-id');
        
        // Send to Firebase
        if (window.saveSubscription) {
            window.saveSubscription(email, novelId)
                .then(() => {
                    showFormMessage('Thank you for subscribing! We\'ll notify you when this novel is released.', 'success');
                    setTimeout(closeModal, 3000);
                })
                .catch(error => {
                    showFormMessage('An error occurred. Please try again.', 'error');
                    console.error('Subscription error:', error);
                });
        } else {
            console.error('Firebase subscription function not available');
            showFormMessage('Subscription service is currently unavailable.', 'error');
        }
    });
}

// Display messages in the form
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.classList.remove('hidden', 'text-green-600', 'text-red-600');
    
    if (type === 'success') {
        formMessage.classList.add('text-green-600');
    } else {
        formMessage.classList.add('text-red-600');
    }
    
    formMessage.classList.remove('hidden');
}

// Function to open modal with novel info
function openModal(novelId) {
    const modal = document.getElementById('subscription-modal');
    
    if (!modal) {
        createModal();
    }
    
    // Find novel information
    const novel = window.upcomingNovels.find(n => n.id == novelId);
    
    if (novel) {
        // Update novel information in modal
        document.querySelector('#novelInfo .novel-title').textContent = novel.title;
        document.querySelector('#novelInfo .novel-date').textContent = `Release Date: ${novel.releaseDate}`;
        
        // Set novel ID for form submission
        modal.setAttribute('data-novel-id', novelId);
        
        // Reset the form
        document.getElementById('notifyForm').reset();
        document.getElementById('formMessage').classList.add('hidden');
        
        // Show modal
        modal.classList.remove('hidden');
        
        // Animate modal
        setTimeout(() => {
            modal.querySelector('div > div').classList.remove('opacity-0', 'translate-y-10');
        }, 10);
    } else {
        console.error('Novel not found with ID:', novelId);
    }
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('subscription-modal');
    
    if (modal) {
        // Animate out
        const modalContent = modal.querySelector('div > div');
        modalContent.classList.add('opacity-0', 'translate-y-10');
        
        // Hide after animation
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

// Initialize event listeners for notify buttons
function initializeNotifyButtons() {
    document.querySelectorAll('.btn-notify').forEach(button => {
        button.addEventListener('click', (e) => {
            const novelCard = e.target.closest('.novel-card');
            const novelId = novelCard.getAttribute('data-novel-id');
            openModal(novelId);
        });
    });
}

// Set up everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    createModal();
    initializeNotifyButtons();
    
    // Re-initialize buttons when novels grid is updated
    document.addEventListener('novelsGridUpdated', () => {
        initializeNotifyButtons();
    });
});

// Export functions for external use
window.openSubscriptionModal = openModal;