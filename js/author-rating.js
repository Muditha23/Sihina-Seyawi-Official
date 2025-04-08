// Firebase configuration
const firebaseConfig = {
    // Replace with your Firebase project configuration
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
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // DOM Elements
    const rateAuthorBtn = document.getElementById('rate-author-btn');
    const ratingModal = document.getElementById('rating-modal');
    const closeModal = document.getElementById('close-modal');
    const ratingStars = document.querySelectorAll('.rating-stars i');
    const submitRating = document.getElementById('submit-rating');
    const ratingText = document.getElementById('rating-text');
    const starsDisplay = document.getElementById('stars-display');
    const reviewsCount = document.getElementById('reviews-count');
    const averageRating = document.getElementById('average-rating');
    
    console.log("Rate button found:", rateAuthorBtn !== null);
    console.log("Modal found:", ratingModal !== null);
    
    let selectedRating = 0;
    let userHasRated = localStorage.getItem('userRated') === 'true';
    
    // Check if user already has a rating stored locally
    const storedRating = localStorage.getItem('userRatingValue');
    if (storedRating) {
      selectedRating = parseInt(storedRating);
    }
    
    // Open rating modal
    rateAuthorBtn.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent any default behavior
      console.log("Rate button clicked");
      ratingModal.style.display = "flex";
      
      // If user has already rated, pre-select their rating
      if (storedRating) {
        highlightStars(parseInt(storedRating));
        ratingText.textContent = `Your rating: ${storedRating} star${parseInt(storedRating) !== 1 ? 's' : ''}`;
      }
    });
    
    // Close rating modal
    closeModal.addEventListener('click', function() {
      console.log("Close button clicked");
      ratingModal.style.display = "none";
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === ratingModal) {
        console.log("Clicked outside modal");
        ratingModal.style.display = "none";
      }
    });
    
    // Star hover effects
    ratingStars.forEach(star => {
      // Mouseover - highlight stars up to this one
      star.addEventListener('mouseover', function() {
        const rating = parseInt(this.dataset.rating);
        highlightStars(rating);
      });
      
      // Mouseout - reset stars if not selected
      star.addEventListener('mouseout', function() {
        if (selectedRating === 0) {
          resetStars();
        } else {
          highlightStars(selectedRating);
        }
      });
      
      // Click - select this rating
      star.addEventListener('click', function() {
        selectedRating = parseInt(this.dataset.rating);
        highlightStars(selectedRating);
        ratingText.textContent = `Your rating: ${selectedRating} star${selectedRating !== 1 ? 's' : ''}`;
      });
    });
    
    // Submit rating to Firebase
    submitRating.addEventListener('click', function() {
      if (selectedRating === 0) {
        ratingText.textContent = 'Please select a rating';
        return;
      }
      
      // Get a unique ID for this rating (could be user ID if you have authentication)
      const ratingId = localStorage.getItem('ratingId') || generateUniqueId();
      localStorage.setItem('ratingId', ratingId);
      
      // Save to Firebase
      database.ref('authorRatings/' + ratingId).set({
        rating: selectedRating,
        timestamp: Date.now()
      }).then(() => {
        // Update UI
        userHasRated = true;
        localStorage.setItem('userRated', 'true');
        localStorage.setItem('userRatingValue', selectedRating.toString());
        
        // Get new average rating and total review count
        fetchRatingStats();
        
        // Close modal
        ratingModal.style.display = "none";
      }).catch((error) => {
        console.error("Error saving rating: ", error);
        ratingText.textContent = 'Error saving rating. Please try again.';
      });
    });
    
    // Helper functions
    function highlightStars(rating) {
      ratingStars.forEach((star, index) => {
        if (index < rating) {
          star.classList.remove('far');
          star.classList.add('fas');
        } else {
          star.classList.remove('fas');
          star.classList.add('far');
        }
      });
    }
    
    function resetStars() {
      ratingStars.forEach(star => {
        star.classList.remove('fas');
        star.classList.add('far');
      });
      ratingText.textContent = 'Click to rate';
    }
    
    function updateRatingDisplay(averageRatingValue) {
      // Clear current stars
      starsDisplay.innerHTML = '';
      
      // Calculate full and partial stars
      const fullStars = Math.floor(averageRatingValue);
      const hasHalfStar = averageRatingValue - fullStars >= 0.5;
      
      // Add filled stars based on average rating
      for (let i = 0; i < 5; i++) {
        const starIcon = document.createElement('i');
        if (i < fullStars) {
          starIcon.className = 'fas fa-star'; // Full star
        } else if (i === fullStars && hasHalfStar) {
          starIcon.className = 'fas fa-star-half-alt'; // Half star
        } else {
          starIcon.className = 'far fa-star'; // Empty star
        }
        starsDisplay.appendChild(starIcon);
      }
    }
    
    function fetchRatingStats() {
      database.ref('authorRatings').once('value').then((snapshot) => {
        const ratings = [];
        let totalRating = 0;
        let count = 0;
        
        // Calculate average rating
        snapshot.forEach((childSnapshot) => {
          const rating = childSnapshot.val().rating;
          if (rating) {
            ratings.push(rating);
            totalRating += rating;
            count++;
          }
        });
        
        // Update UI with average rating and count
        if (count > 0) {
          const avg = totalRating / count;
          averageRating.textContent = avg.toFixed(1);
          updateRatingDisplay(avg);
          reviewsCount.textContent = `${count} Review${count !== 1 ? 's' : ''}`;
        } else {
          averageRating.textContent = "No ratings yet";
          reviewsCount.textContent = "0 Reviews";
        }
      }).catch(error => {
        console.error("Error fetching ratings:", error);
      });
    }
    
    function generateUniqueId() {
      return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Initialize - fetch current ratings
    fetchRatingStats();
  
    // Debug information
    console.log("Script loaded successfully");
  });


       // Function to display reviews
       function displayLatestReviews() {
           const reviewsContainer = document.getElementById('reviewsContainer');
           
           // Reference to the reviews in Firebase - get latest 3 by timestamp
           const reviewsRef = database.ref('reviews').orderByChild('timestamp').limitToLast(3);
           
           reviewsRef.on('value', (snapshot) => {
               // Clear the loading placeholders
               reviewsContainer.innerHTML = '';
               
               // Check if there are any reviews
               if (!snapshot.exists()) {
                   // No reviews available
                   const noReviewsElement = document.createElement('div');
                   noReviewsElement.className = 'col-span-1 md:col-span-3 bg-white rounded-xl shadow-md p-6 border border-pink-100 text-center';
                   noReviewsElement.innerHTML = `
                       <p class="text-gray-600 mb-3">No reviews available yet.</p>
                       <a href="review-form.html" class="inline-block px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                           Be the first to leave a review
                       </a>
                   `;
                   reviewsContainer.appendChild(noReviewsElement);
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
                   reviewCard.className = 'bg-white rounded-xl shadow-md p-6 border border-pink-100 hover-scale';
                   
                   // Generate stars HTML based on rating
                   let starsHTML = '';
                   for (let i = 1; i <= 5; i++) {
                       const starClass = i <= reviewData.rating ? 'text-yellow-500' : '';
                       starsHTML += `<span class="${starClass}">★</span>`;
                   }
                   
                   // Trim review text if too long
                   const reviewText = reviewData.review.length > 150 
                       ? reviewData.review.substring(0, 150) + '...' 
                       : reviewData.review;
                   
                   // Create review HTML
                   reviewCard.innerHTML = `
                       <div class="flex items-center mb-4">
                           <img src="img/user.png" alt="Reader" class="w-12 h-12 rounded-full object-cover mr-4">
                           <div>
                               <h4 class="font-medium">${reviewData.name}</h4>
                               <div class="text-sm flex">
                                   ${starsHTML}
                               </div>
                           </div>
                       </div>
                       <p class="italic">"${reviewText}"</p>
                       <div class="mt-3 text-sm ">
                           Review for <span class="font-medium">${reviewData.novel}</span>
                       </div>
                   `;
                   
                   reviewsContainer.appendChild(reviewCard);
               });
           });
       }
       
       // Load reviews when page loads
       document.addEventListener('DOMContentLoaded', displayLatestReviews);