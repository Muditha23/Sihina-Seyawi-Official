   // Firebase configuration - REPLACE WITH YOUR OWN FIREBASE CONFIG
   const firebaseConfig = {
    apiKey: "AIzaSyDcXMoFIYIbeHjo1c_RyoqbBLWmVRstee0",
    authDomain: "the-sihina-seyawi-project.firebaseapp.com",
    databaseURL: "https://the-sihina-seyawi-project-default-rtdb.firebaseio.com",
    projectId: "the-sihina-seyawi-project",
    storageBucket: "the-sihina-seyawi-project.firebasestorage.app",
    messagingSenderId: "473435841868",
    appId: "1:473435841868:web:0595fdf540ab758c9c5be9",
    measurementId: "G-PSZ81Z66EY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Star rating functionality
const stars = document.querySelectorAll('.star-btn');
const ratingInput = document.getElementById('rating');

stars.forEach(star => {
    star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        ratingInput.value = value;
        
        // Update star appearance
        stars.forEach((s, index) => {
            if (index < value) {
                s.classList.add('text-yellow-500');
                s.classList.remove('text-gray-300');
            } else {
                s.classList.add('text-gray-300');
                s.classList.remove('text-yellow-500');
            }
        });
    });
});

// Form submission
const reviewForm = document.getElementById('reviewForm');
const popupMessage = document.getElementById('popupMessage');
const closePopup = document.getElementById('closePopup');

reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const novel = document.getElementById('novel').value;
    const rating = parseInt(document.getElementById('rating').value);
    const review = document.getElementById('review').value;
    const timestamp = new Date().toISOString();
    
    // Create review object
    const reviewData = {
        name,
        email,
        novel,
        rating,
        review,
        timestamp
    };
    
    // Save to Firebase
    const newReviewRef = database.ref('reviews').push();
    newReviewRef.set(reviewData)
        .then(() => {
            // Show success popup
            popupMessage.style.display = 'flex';
            
            // Reset form
            reviewForm.reset();
            
            // Reset stars to default (all 5 filled)
            stars.forEach(s => {
                s.classList.add('text-yellow-500');
                s.classList.remove('text-gray-300');
            });
            ratingInput.value = 5;
        })
        .catch(error => {
            console.error("Error saving review:", error);
            alert("There was an error submitting your review. Please try again.");
        });
});

// Close popup
closePopup.addEventListener('click', () => {
    popupMessage.style.display = 'none';
});

// Function to display reviews
function displayReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    
    // Reference to the reviews in Firebase
    const reviewsRef = database.ref('reviews').orderByChild('timestamp').limitToLast(10);
    
    reviewsRef.on('value', (snapshot) => {
        // Clear previous reviews
        reviewsContainer.innerHTML = '';
        
        // Check if there are any reviews
        if (!snapshot.exists()) {
            reviewsContainer.innerHTML = '<div class="text-center text-gray-500 py-8">No reviews yet. Be the first to leave a review!</div>';
            return;
        }
        
        // Array to store reviews for reverse chronological order
        const reviews = [];
        
        // Loop through each review
        snapshot.forEach((childSnapshot) => {
            const reviewData = childSnapshot.val();
            reviews.push(reviewData);
        });
        
        // Reverse the array to show newest first
        reviews.reverse().forEach(reviewData => {
            // Create review card
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card bg-white rounded-lg p-6 shadow-sm';
            
            // Format date
            const reviewDate = new Date(reviewData.timestamp);
            const formattedDate = reviewDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Generate stars HTML
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                const starClass = i <= reviewData.rating ? 'text-yellow-500' : '';
                starsHTML += `<span class="${starClass}">★</span>`;
            }
            
            // Create review HTML
            reviewCard.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-bold text-lg">${reviewData.name}</h3>
                        <p class="text-sm ">Reviewed "${reviewData.novel}"</p>
                    </div>
                    <div class="text-sm ">${formattedDate}</div>
                </div>
                <div class="flex mb-3 text-xl">${starsHTML}</div>
                <p>${reviewData.review}</p>
            `;
            
            reviewsContainer.appendChild(reviewCard);
        });
    });
}

// Load reviews when page loads
document.addEventListener('DOMContentLoaded', displayReviews);