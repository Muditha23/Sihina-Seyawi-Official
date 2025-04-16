// Featured Novels Generator
// Add this to your main JavaScript file or create a new file called featuredNovels.js

function generateFeaturedNovels() {
    // Select container for featured novels
    const featuredContainer = document.getElementById('featuredNovels');
    if (!featuredContainer) return;

    // Get top 3 novels based on rating
    getTopRatedNovels(3)
        .then(featuredNovels => {
            // Create section container
            const sectionHTML = `
                <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-12 fade-in">
                        <h2 class="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Novels</h2>
                        <p class="text-gray-600 max-w-2xl mx-auto">Discover our most beloved romantic tales that have captured readers' hearts around the world.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="featuredNovelsGrid">
                        <!-- Novels will be inserted here dynamically -->
                    </div>
                </div>
            `;
            
            // Insert section structure
            featuredContainer.innerHTML = sectionHTML;
            
            // Get grid container
            const gridContainer = document.getElementById('featuredNovelsGrid');
            
            // Create cards for each featured novel
            featuredNovels.forEach((novel, index) => {
                const novelCard = createFeaturedNovelCard(novel, index);
                gridContainer.appendChild(novelCard);
            });
            
            // Apply animations
            animateFeaturedElements();
        })
        .catch(error => {
            console.error('Error generating featured novels:', error);
        });
}

// Get the top rated novels
async function getTopRatedNovels(count) {
    try {
        // Get all ratings from Firebase
        const ratingsRef = firebase.database().ref('ratings');
        const snapshot = await ratingsRef.once('value');
        const allRatings = snapshot.val() || {};
        
        // Create array with novel ids and their ratings
        const ratedNovels = [];
        
        // First, filter novels that have ratings
        novels.forEach(novel => {
            const novelRating = allRatings[novel.id]?.stats || null;
            if (novelRating) {
                ratedNovels.push({
                    ...novel,
                    averageRating: novelRating.averageRating || 0,
                    totalRatings: novelRating.totalRatings || 0
                });
            } else {
                ratedNovels.push({
                    ...novel,
                    averageRating: 0,
                    totalRatings: 0
                });
            }
        });
        
        // Sort novels by rating (highest first)
        ratedNovels.sort((a, b) => b.averageRating - a.averageRating);
        
        // Return top N novels
        return ratedNovels.slice(0, count);
        
    } catch (error) {
        console.error('Error fetching top rated novels:', error);
        // Fallback to first 3 novels if there's an error
        return novels.slice(0, count);
    }
}

// Create a card for a featured novel
function createFeaturedNovelCard(novel, index) {
    const card = document.createElement('div');
    card.className = `bg-white rounded-xl shadow-md overflow-hidden border border-pink-100 transition hover:shadow-lg fade-in fade-in-delay-${index + 1}`;
    card.dataset.novelId = novel.id;
    
    // Check if it's a bestseller (highest rated or first in list)
    const isBestseller = index === 0 || novel.averageRating >= 4.5;
    
    // Generate rating stars HTML
    const ratingHTML = generateRatingStarsHTML(novel.averageRating, novel.totalRatings);
    
    card.innerHTML = `
        <div class="relative h-96 overflow-hidden">
            <img src="${novel.coverImg}" alt="${novel.title}" class="w-full h-full object-cover transition duration-300 hover:scale-110">
            ${isBestseller ? `
                <div class="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                    Bestseller
                </div>
            ` : ''}
        </div>
        <div class="p-6">
            <h3 class="font-serif text-xl font-bold text-gray-800 mb-2">${novel.title}</h3>
            <div class="flex items-center mb-4">
                ${ratingHTML}
            </div>
            <p class="text-gray-600 mb-4 line-clamp-3">${novel.shortDescription}</p>
            <button class="w-full bg-pink-100 hover:bg-pink-200 text-pink-600 font-medium py-2 rounded-lg transition featured-novel-btn">
                More Details
            </button>
        </div>
    `;
    
    // Add click event to the Read Now button
    const readNowBtn = card.querySelector('.featured-novel-btn');
    readNowBtn.addEventListener('click', () => {
        openNovelModal(novel);
    });
    
    return card;
}

// Open novel modal with full details
function openNovelModal(novel) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    const modalContent = `
        <div class="bg-white rounded-xl max-w-4xl w-11/12 max-h-[90vh] overflow-y-auto scrollbar-hide relative p-8 shadow-2xl transform transition-all" style="scrollbar-width: none; -ms-overflow-style: none;">
            <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200" 
                    onclick="this.closest('.fixed').remove()">
                <i class="fas fa-times text-2xl hover:rotate-90 transform transition-transform duration-300"></i>
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="relative h-[500px] md:h-full group">
                    <img src="${novel.coverImg}" alt="${novel.title}" 
                         class="w-full h-full object-cover rounded-xl shadow-lg transform transition-transform duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
                <div class="space-y-6">
                    <h2 class="font-serif text-4xl font-bold text-gray-800 mb-4 leading-tight">${novel.title}</h2>
                    <div class="bg-pink-50 rounded-lg p-4">
                        ${generateRatingStarsHTML(novel.averageRating, novel.totalRatings)}
                    </div>
                    <p class="text-gray-600 text-lg leading-relaxed">${novel.description || novel.shortDescription}</p>
                    <div class="space-y-3 bg-pink-50 p-4 rounded-lg">
                        <p class="flex items-center text-gray-600"><i class="fas fa-user-edit w-6"></i><span class="font-semibold mr-2 text-gray-600">Author:</span> ${novel.author}</p>
                        <p class="flex items-center text-gray-600"><i class="fas fa-bookmark w-6"></i><span class="font-semibold mr-2 text-gray-600">Genre:</span> ${novel.genre}</p>
                        <p class="flex items-center text-gray-600"><i class="fas fa-calendar-alt w-6"></i><span class="font-semibold mr-2 text-gray-600">Published:</span> ${novel.publishDate}</p>
                    </div>
                    <a href="Novels.html" 
                       class="inline-block w-full text-center mt-6 px-8 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl">
                        Start Reading <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </div>
    `;

    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Generate HTML for rating stars
function generateRatingStarsHTML(rating, totalRatings) {
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    let starsHtml = '<div class="text-amber-400 flex">';
    
    // Generate full, half, and empty stars
    for (let i = 1; i <= 5; i++) {
        if (i <= roundedRating) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 === roundedRating) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    
    starsHtml += '</div>';
    return `
        ${starsHtml}
        <span class="text-gray-600 text-sm ml-2">${rating.toFixed(1)} (${totalRatings} reviews)</span>
    `;
}

// Animate the featured elements
function animateFeaturedElements() {
    gsap.utils.toArray('.fade-in').forEach((element, index) => {
        gsap.from(element, { 
            opacity: 0, 
            y: 20, 
            duration: 0.8, 
            delay: index * 0.2,
            ease: 'power2.out' 
        });
    });
}

// Add this to the document ready event
document.addEventListener('DOMContentLoaded', function() {
    // Generate featured novels section
    generateFeaturedNovels();
    
    // Other existing code...
});