// novels-generator.js - Handles novel generation and UI interactions

// Upcoming novels data
const upcomingNovels = [
    {
        id: 1,
        title: "ස්නේහ කිරණක්",
        image: "img/ස්නේහ කිරණ.jpg",
        releaseDate: "June 12, 2025",
        description: "A tale of forbidden love between a renowned pianist and a mysterious writer who shares her deepest secrets only through anonymous letters.",
        genres: ["Romance"]
    }
];

// Color schemes for different genres
const genreColors = {
    "Romance": { bg: "bg-pink-100", text: "text-pink-800" },
    "Mystery": { bg: "bg-blue-100", text: "text-blue-800" },
    "Sci-Fi": { bg: "bg-purple-100", text: "text-purple-800" },
    "Thriller": { bg: "bg-red-100", text: "text-red-800" },
    "Historical Fiction": { bg: "bg-amber-100", text: "text-amber-800" },
    "Fantasy": { bg: "bg-emerald-100", text: "text-emerald-800" },
    "Techno-Thriller": { bg: "bg-cyan-100", text: "text-cyan-800" }
};

// Function to parse dates and calculate days remaining
function getDaysRemaining(releaseDateStr) {
    const months = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    const parts = releaseDateStr.split(' ');
    const month = months[parts[0]];
    const day = parseInt(parts[1].replace(',', ''));
    const year = parseInt(parts[2]);
    
    const releaseDate = new Date(year, month, day);
    const today = new Date();
    
    // Calculate difference in days
    const diffTime = releaseDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// Generate countdown text based on days remaining
function getCountdownText(daysRemaining) {
    if (daysRemaining < 0) {
        return "Now Available!";
    } else if (daysRemaining === 0) {
        return "Releasing Today!";
    } else if (daysRemaining === 1) {
        return "Releasing Tomorrow!";
    } else {
        return `${daysRemaining} days remaining`;
    }
}

// Function to generate novel cards HTML
function generateNovelCards() {
    // Find the grid element - Make sure we're looking at the exact class structure
    const novelsGrid = document.querySelector('.container .grid');
    
    if (!novelsGrid) {
        console.error('Novels grid container not found');
        return;
    }
    
    // Clear existing content
    novelsGrid.innerHTML = '';
    
    // Generate and append each novel card
    upcomingNovels.forEach((novel, index) => {
        const daysRemaining = getDaysRemaining(novel.releaseDate);
        const countdownText = getCountdownText(daysRemaining);
        
        const genreElements = novel.genres.map(genre => {
            const colors = genreColors[genre] || { bg: "bg-gray-100", text: "text-gray-800" };
            return `<span class="${colors.bg} ${colors.text} text-xs px-2 py-1 rounded mr-2">${genre}</span>`;
        }).join('');
        
        const novelCard = document.createElement('div');
        novelCard.className = 'novel-card rounded-xl overflow-hidden shadow-lg opacity-0 transform translate-y-10';
        novelCard.setAttribute('data-delay', index * 100);
        
        novelCard.innerHTML = `
            <div class="relative h-94 overflow-hidden">
                <img src="${novel.image}" alt="${novel.title}" class="w-full h-full object-cover">
                <span class="coming-soon-badge absolute top-4 right-4 bg-pink-500 text-white text-sm px-3 py-1 rounded-full">Coming Soon</span>
                <span class="date-badge absolute bottom-4 left-4 bg-white text-gray-800 text-sm px-3 py-1 rounded-full font-semibold">${novel.releaseDate}</span>
            </div>
            <div class="p-6">
                <h3 class="font-bold text-2xl mb-2 text-pink-600">${novel.title}</h3>
                <p class="text-gray-600 mb-4">${novel.description}</p>
                <div class="flex items-center mb-4">
                    ${genreElements}
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-pink-600">${countdownText}</span>
                    <button class="btn-notify bg-pink-500 hover:bg-pink-600 transition text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center" data-novel-id="${novel.id}" data-novel-title="${novel.title}">
                        <i class="far fa-bell mr-2"></i> Notify Me
                    </button>
                </div>
            </div>
        `;
        
        novelsGrid.appendChild(novelCard);
    });
    
    // Animate novel cards appearing
    setTimeout(() => {
        document.querySelectorAll('.novel-card').forEach(card => {
            const delay = parseInt(card.getAttribute('data-delay'));
            setTimeout(() => {
                card.classList.remove('opacity-0', 'translate-y-10');
                card.classList.add('transition-all', 'duration-500', 'ease-out');
            }, delay);
        });
    }, 100);
}

// Handle modal functionality
function initModalFunctionality() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 hidden';
    modal.id = 'notifyModal';
    
    modal.innerHTML = `
        <div class="bg-gradient-to-r from-pink-100 to-blue-100 rounded-xl p-8 max-w-4xl mx-4 w-full opacity-0 transform translate-y-10 shadow-lg transition-all duration-300" id="subscription-box">
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                    <h3 class="text-3xl font-bold text-pink-600 mb-2">Stay Updated</h3>
                    <p class="text-gray-600">Subscribe to our newsletter and be the first to know about upcoming novels, sneak peeks, and exclusive offers.</p>
                </div>
                <div class="md:w-1/2">
                    <form id="notifyForm" class="flex flex-col sm:flex-row gap-3">
                        <input id="notifyEmail" type="email" required placeholder="Your email address" class="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 border border-gray-200">
                        <input type="hidden" id="novelId" value="">
                        <input type="hidden" id="novelTitle" value="">
                        <button type="submit" class="bg-pink-500 hover:bg-pink-600 transition text-white font-medium py-3 px-6 rounded-lg whitespace-nowrap">Subscribe Now</button>
                    </form>
                    <div class="text-right mt-4">
                        <button id="closeModal" class="text-gray-600 hover:text-white">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal when notify button is clicked
    document.addEventListener('click', function(e) {
        const notifyBtn = e.target.closest('.btn-notify');
        if (notifyBtn) {
            const novelId = notifyBtn.getAttribute('data-novel-id');
            const novelTitle = notifyBtn.getAttribute('data-novel-title');
            document.getElementById('novelId').value = novelId;
            document.getElementById('novelTitle').value = novelTitle;
            showModal();
        }
    });
    
    // Close modal functionality
    document.getElementById('closeModal').addEventListener('click', hideModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
}

// Show modal function
function showModal() {
    const modal = document.getElementById('notifyModal');
    const subscriptionBox = document.getElementById('subscription-box');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        subscriptionBox.classList.remove('opacity-0', 'translate-y-10');
    }, 10);
}

// Hide modal function
function hideModal() {
    const modal = document.getElementById('notifyModal');
    const subscriptionBox = document.getElementById('subscription-box');
    
    subscriptionBox.classList.add('opacity-0', 'translate-y-10');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing novels system');
    
    // Ensure the grid container exists
    if (!document.querySelector('.container .grid')) {
        console.error('Grid container not found, might need to wait for other scripts to run');
        
        // Try again after a short delay
        setTimeout(() => {
            generateNovelCards();
            initModalFunctionality();
        }, 300);
    } else {
        generateNovelCards();
        initModalFunctionality();
    }
    
    // Update countdowns daily
    setInterval(() => {
        generateNovelCards();
    }, 86400000); // 24 hours
});

// In case the DOM is already loaded when this script runs
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('Document already ready, initializing immediately');
    setTimeout(() => {
        generateNovelCards();
        initModalFunctionality();
    }, 100);
}