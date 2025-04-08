// Novel data structure updated to include episodes
const novels = [
    {
        id: 1,
        title: "පිය මනිමු මල් මාවතේ",
        author: "Tharuka Sewwandi",
        genre: "Romance",
        coverImg: "img/පිය මනිමු මල් මාවතේ.jpg",
        shortDescription: "A passionate love story set in the city of lights.",
        description: "When Elise meets Jacques on a rainy evening in Montmartre, she doesn't expect their chance encounter to change her life forever. Set against the romantic backdrop of Paris, this novel explores passion, art, and the unexpected ways love transforms us.",
        publishDate: "2023-10-01",
        Episodes: 28,
        episodes: [
            {
                id: 1,
                title: "Intro",
                txtUrl: "Novels/පිය මනිමු මල් මවතේ/Episode 01.txt"
            },
            {
                id: 2,
                title: "Episode 02",
                txtUrl: "Novels/පිය මනිමු මල් මවතේ/Episode 02.txt"
            }
        ]
    },
    {
        id: 2,
        title: "ලංවී හදට රහසින්",
        author: "Tharuka Sewwandi",
        genre: "Romance",
        coverImg: "img/ලංවී හදට රහසින්.jpg",
        shortDescription: "A passionate love story set in the city of lights.",
        description: "When Elise meets Jacques on a rainy evening in Montmartre, she doesn't expect their chance encounter to change her life forever. Set against the romantic backdrop of Paris, this novel explores passion, art, and the unexpected ways love transforms us.",
        Episodes: 28,
        episodes: [
            {
                id: 1,
                title: "Intro",
                txtUrl: "Novels/පිය මනිමු මල් මවතේ/Episode 01.txt"
            }
        ]
    },
    {
        id: 3,
        title: "ස්නේහ කිරණක්",
        author: "Tharuka Sewwandi",
        genre: "Romance",
        coverImg: "img/ස්නේහ කිරණ.jpg",
        shortDescription: "A passionate love story set in the city of lights.",
        description: "When Elise meets Jacques on a rainy evening in Montmartre, she doesn't expect their chance encounter to change her life forever. Set against the romantic backdrop of Paris, this novel explores passion, art, and the unexpected ways love transforms us.",
        Episodes: 28,
        episodes: [
            {
                id: 1,
                title: "Intro",
                txtUrl: "Novels/පිය මනිමු මල් මවතේ/Episode 01.txt"
            }
        ]
    },
    {
        id: 4,
        title: "මගේ සඳ නුඹ",
        author: "Tharuka Sewwandi",
        genre: "Romance",
        coverImg: "img/මගේ සඳ නුඹ.jpg",
        shortDescription: "A passionate love story set in the city of lights.",
        description: "When Elise meets Jacques on a rainy evening in Montmartre, she doesn't expect their chance encounter to change her life forever. Set against the romantic backdrop of Paris, this novel explores passion, art, and the unexpected ways love transforms us.",
        Episodes: 28,
        episodes: [
            {
                id: 1,
                title: "Intro",
                txtUrl: "Novels/පිය මනිමු මල් මවතේ/Episode 01.txt"
            }
        ]
    }
];


// Variables to track current state
let currentNovel = null;
let currentEpisode = null;
let currentPage = 1;
let totalPages = 10;
let currentFontSize = 16; // Base font size in pixels
let novelContent = []; // Will store the array of text content divided into pages

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Create floating petals
    const petalsContainer = document.querySelector('.petals-container');
    if (petalsContainer) {
        for (let i = 0; i < 15; i++) {
            createPetal(petalsContainer);
        }
    }
    
    // Generate novel cards
    generateNovelCards();
    
    // Setup event listeners
    setupMobileMenu();
    setupThemeToggle();
    setupModals();
    
    // Animate page elements
    animatePageElements();
    
    // Apply current theme text colors
    applyThemeColors();
    
    // Load all novel ratings
    ratingSystem.loadAllNovelRatings();
});

// Generate novel cards from data
function generateNovelCards() {
    const novelsGrid = document.getElementById('novelsGrid');
    if (!novelsGrid) return;
    
    novelsGrid.innerHTML = '';
    
    novels.forEach((novel, index) => {
        const card = document.createElement('div');
        card.className = 'novel-card h-full flex flex-col opacity-0 novels-item';
        card.dataset.novelId = novel.id;
        
        card.innerHTML = `
            <div class="relative overflow-hidden rounded-t-lg h-94">
                <img src="${novel.coverImg}" alt="${novel.title}" class="w-full h-94 object-cover transition-transform duration-700 hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <span class="text-white font-medium px-3 py-1 rounded-full text-sm">${novel.genre}</span>
                </div>
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-xl font-bold mb-2">${novel.title}</h3>
                <p class="text-sm mb-3 flex-grow">${novel.shortDescription}</p>
                <div class="novel-rating mb-3">
                    <!-- Rating stars will be dynamically inserted here -->
                    <div class="flex items-center">
                        <div class="flex mr-1">
                            <i class="far fa-star text-yellow-400"></i>
                            <i class="far fa-star text-yellow-400"></i>
                            <i class="far fa-star text-yellow-400"></i>
                            <i class="far fa-star text-yellow-400"></i>
                            <i class="far fa-star text-yellow-400"></i>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">(0)</span>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm italic">By ${novel.author}</span>
                    <button class="read-now-btn btn-primary text-white px-4 py-2 rounded-lg">
                        View Details
                    </button>
                </div>
            </div>
        `;
        
        novelsGrid.appendChild(card);
        
        // Add click event to the Read Now button
        const readNowBtn = card.querySelector('.read-now-btn');
        readNowBtn.addEventListener('click', () => {
            openNovelModal(novel);
        });
    });
}

// Open novel detail modal with episodes
function openNovelModal(novel) {
    currentNovel = novel;
    
    // Update modal content
    document.getElementById('modalBookCover').src = novel.coverImg;
    document.getElementById('modalBookTitle').textContent = novel.title;
    document.getElementById('modalBookAuthor').textContent = `By ${novel.author}`;
    document.getElementById('modalBookGenre').textContent = novel.genre;
    document.getElementById('modalBookPages').textContent = `${novel.Episodes} Episodes`;
    document.getElementById('modalBookDescription').textContent = novel.description;
    
    // Generate episode cards
    generateEpisodeCards(novel);
    
    // Initialize and setup rating system
    const bookDetailsSection = document.getElementById('Scroll');
    
    // Remove any existing rating container
    const existingRatingContainer = bookDetailsSection.querySelector('.rating-container');
    if (existingRatingContainer) {
        existingRatingContainer.remove();
    }
    
    // Initialize rating UI
    ratingSystem.initRatingUI(bookDetailsSection);
    
    // Set current novel ID for rating
    ratingSystem.setNovelId(novel.id);
    
    // Show the modal
    document.getElementById('novelModal').classList.remove('hidden');
    
    // Add transition effects
    gsap.fromTo('#novelModal .modal-container', 
        { opacity: 0, y: 20, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
}

// Generate episode cards for the selected novel
function generateEpisodeCards(novel) {
    // Get the episode container
    const episodesContainer = document.getElementById('episodesContainer');
    if (!episodesContainer) return;
    
    episodesContainer.innerHTML = '<h3 class="text-xl font-bold mb-4">Episodes</h3>';
    
    // Create grid for episodes
    const episodesGrid = document.createElement('div');
    episodesGrid.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4';
    
    // Generate episode cards
    novel.episodes.forEach((episode, index) => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card relative rounded-lg overflow-hidden cursor-pointer';
        episodeCard.dataset.episodeId = episode.id;
        
        episodeCard.innerHTML = `
            <div class="relative w-full pt-[133%] bg-gradient-to-br from-pink-100 to-purple-200 dark:from-gray-700 dark:to-gray-800">
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="episode-number text-6xl font-bold text-white opacity-50">${index + 1}</span>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-all duration-500 flex items-center justify-center group">
                    <div class="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 text-center p-2">
                        <h4 class="font-bold text-white text-lg tracking-wide drop-shadow-lg">${episode.title}</h4>
                        <span class="text-pink-200 text-sm mt-2 inline-block">Click to Read</span>
                    </div>
                </div>
            </div>
        `;
        
        episodesGrid.appendChild(episodeCard);
        
        // Add click event to open the episode viewer
        episodeCard.addEventListener('click', () => {
            openEpisodeViewer(novel, episode);
        });
    });
    
    // Append the grid to the container
    episodesContainer.appendChild(episodesGrid);
}

// Load and display episode TXT file
async function loadEpisodeTxt(episode) {
    try {
        // Show loading state
        document.getElementById('txtContent').innerHTML = '<div class="flex justify-center items-center h-64"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div></div>';
        
        // Fetch the TXT file content
        const response = await fetch(episode.txtUrl);
        if (!response.ok) throw new Error('Failed to load text file');
        
        const text = await response.text();
        
        // Display the entire text content instead of splitting into pages
        const txtContent = document.getElementById('txtContent');
        
        // Format the text with paragraphs
        const formattedText = text
            .replace(/\n\s*\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        txtContent.innerHTML = `<p>${formattedText}</p>`;
        txtContent.style.fontSize = `${currentFontSize}px`;
        
        // Apply theme-based text color
        applyThemeColors();
        
        // Hide page navigation controls since we're showing the full content
        document.getElementById('pageCounter').textContent = '';
        document.getElementById('prevPageBtn').style.display = 'none';
        document.getElementById('nextPageBtn').style.display = 'none';
        
    } catch (error) {
        console.error('Error loading TXT file:', error);
        document.getElementById('txtContent').innerHTML = `<div class="p-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded">Error loading the episode: ${error.message}</div>`;
    }
}

// Apply theme-based text colors
function applyThemeColors() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const txtContent = document.getElementById('txtContent');
    
    if (txtContent) {
        if (isDarkMode) {
            txtContent.classList.add('text-gray-100');
            txtContent.classList.remove('text-gray-800');
        } else {
            txtContent.classList.add('text-gray-800');
            txtContent.classList.remove('text-gray-100');
        }
    }
}

// Change font size
function changeFontSize(delta) {
    // Limit font size between 12px and 24px
    const newSize = Math.max(12, Math.min(24, currentFontSize + delta));
    
    if (newSize !== currentFontSize) {
        currentFontSize = newSize;
        document.getElementById('txtContent').style.fontSize = `${currentFontSize}px`;
    }
}

// Open the episode viewer
function openEpisodeViewer(novel, episode) {
    currentEpisode = episode;
    
    // Update episode viewer content
    document.getElementById('txtTitle').textContent = `${novel.title} - ${episode.title}`;
    
    // Hide novel modal and show episode viewer
    document.getElementById('novelModal').classList.add('hidden');
    document.getElementById('txtViewerModal').classList.remove('hidden');
    
    // Load episode content
    loadEpisodeTxt(episode);
    
    // Enable/disable episode navigation buttons
    updateEpisodeNavigation();
    
    // Add transition effects
    gsap.fromTo('#txtViewerModal > div:last-child', 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
}

// Update episode navigation buttons
function updateEpisodeNavigation() {
    const prevEpisodeBtn = document.getElementById('prevEpisodeBtn');
    const nextEpisodeBtn = document.getElementById('nextEpisodeBtn');
    
    if (!currentNovel || !currentEpisode) return;
    
    const currentIndex = currentNovel.episodes.findIndex(ep => ep.id === currentEpisode.id);
    
    // Enable/disable previous episode button
    if (currentIndex <= 0) {
        prevEpisodeBtn.classList.add('opacity-50', 'cursor-not-allowed');
        prevEpisodeBtn.disabled = true;
    } else {
        prevEpisodeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        prevEpisodeBtn.disabled = false;
    }
    
    // Enable/disable next episode button
    if (currentIndex >= currentNovel.episodes.length - 1) {
        nextEpisodeBtn.classList.add('opacity-50', 'cursor-not-allowed');
        nextEpisodeBtn.disabled = true;
    } else {
        nextEpisodeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        nextEpisodeBtn.disabled = false;
    }
}

// Navigate to previous episode
function goToPrevEpisode() {
    if (!currentNovel || !currentEpisode) return;
    
    const currentIndex = currentNovel.episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex > 0) {
        openEpisodeViewer(currentNovel, currentNovel.episodes[currentIndex - 1]);
    }
}

// Navigate to next episode
function goToNextEpisode() {
    if (!currentNovel || !currentEpisode) return;
    
    const currentIndex = currentNovel.episodes.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex < currentNovel.episodes.length - 1) {
        openEpisodeViewer(currentNovel, currentNovel.episodes[currentIndex + 1]);
    }
}

// Setup modals and event listeners
function setupModals() {
    // Novel Modal Close Button
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('novelModal').classList.add('hidden');
    });
    
    // TXT Viewer Close Button
    document.getElementById('closeTxtViewer').addEventListener('click', () => {
        document.getElementById('txtViewerModal').classList.add('hidden');
    });
    
    // Back to novel details button
    document.getElementById('backToNovelBtn').addEventListener('click', () => {
        document.getElementById('txtViewerModal').classList.add('hidden');
        openNovelModal(currentNovel);
    });
    
    // Font size controls
    document.getElementById('decreaseFontBtn').addEventListener('click', () => changeFontSize(-2));
    document.getElementById('increaseFontBtn').addEventListener('click', () => changeFontSize(2));
    
    // Fullscreen Toggle
    document.getElementById('fullscreenBtn').addEventListener('click', () => {
        const elem = document.getElementById('txtViewerContainer');
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    // Episode navigation
    document.getElementById('prevEpisodeBtn').addEventListener('click', goToPrevEpisode);
    document.getElementById('nextEpisodeBtn').addEventListener('click', goToNextEpisode);
    
    // Close modals when clicking overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            document.getElementById('novelModal').classList.add('hidden');
            document.getElementById('txtViewerModal').classList.add('hidden');
        });
    });
}

// Create floating petals for animation
function createPetal(container) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Random positions and sizes
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = `${Math.random() * 100}%`;
    petal.style.width = `${10 + Math.random() * 15}px`;
    petal.style.height = `${10 + Math.random() * 15}px`;
    
    // Random animation delay and duration
    petal.style.animationDelay = `${Math.random() * 10}s`;
    petal.style.animationDuration = `${10 + Math.random() * 20}s`;
    
    container.appendChild(petal);
}

// Mobile menu toggle
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Add animation
            if (!mobileMenu.classList.contains('hidden')) {
                gsap.fromTo(mobileMenu, 
                    { opacity: 0, height: 0 }, 
                    { opacity: 1, height: 'auto', duration: 0.3, ease: 'power2.out' }
                );
            }
        });
    }
}

// Theme toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
}

// Toggle dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Update theme icon
    if (isDarkMode) {
        this.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        this.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Update text colors based on theme
    applyThemeColors();
}

// Animate page elements
function animatePageElements() {
    const pageTitle = document.getElementById('pageTitle');
    const titleDivider = document.getElementById('titleDivider');
    const filterControls = document.getElementById('filterControls');
    const novelsItems = document.querySelectorAll('.novels-item');
    
    gsap.to(pageTitle, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 });
    gsap.to(titleDivider, { opacity: 1, scaleX: 1, duration: 0.5, delay: 0.4 });
    gsap.to(filterControls, { opacity: 1, y: 0, duration: 0.5, delay: 0.6 });
    
    novelsItems.forEach((item, index) => {
        gsap.to(item, { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 + 0.8 });
    });
}