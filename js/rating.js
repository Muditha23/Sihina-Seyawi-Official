// Firebase configuration
// Replace with your actual Firebase config
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
const db = firebase.database();

class RatingSystem {
  constructor() {
    this.currentRating = 0;
    this.previousRating = 0; // Track previous rating for updates
    this.novelId = null;
    this.isUpdate = false; // Flag to track if this is an update
  }

  // Initialize rating UI in the novel modal
  initRatingUI(parentElement) {
    // Create rating container
    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'rating-container mb-6';
    ratingContainer.innerHTML = `
      <h3 class="text-lg font-semibold mb-2">Rate this novel</h3>
      <div class="flex items-center">
        <div class="flex items-center mr-4" id="starRating">
          <i class="far fa-star text-2xl text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors" data-value="1"></i>
          <i class="far fa-star text-2xl text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors" data-value="2"></i>
          <i class="far fa-star text-2xl text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors" data-value="3"></i>
          <i class="far fa-star text-2xl text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors" data-value="4"></i>
          <i class="far fa-star text-2xl text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors" data-value="5"></i>
        </div>
        <button id="submitRating" class="btn-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          Submit Rating
        </button>
      </div>
      <div id="ratingMessage" class="mt-2 text-sm"></div>
    `;

    // Append to parent element
    parentElement.appendChild(ratingContainer);

    // Add event listeners to stars
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
      star.addEventListener('mouseover', this.handleStarHover.bind(this));
      star.addEventListener('mouseout', this.handleStarReset.bind(this));
      star.addEventListener('click', this.handleStarClick.bind(this));
    });

    // Add event listener to submit button
    document.getElementById('submitRating').addEventListener('click', this.submitRating.bind(this));
  }

  // Set the novel ID for the current rating
  setNovelId(id) {
    this.novelId = id;
    this.resetRating();
    this.loadUserRating();
  }

  // Handle hovering over stars
  handleStarHover(event) {
    const value = parseInt(event.target.dataset.value);
    this.highlightStars(value);
  }

  // Handle mouse leaving stars area
  handleStarReset() {
    this.highlightStars(this.currentRating);
  }

  // Handle clicking on a star
  handleStarClick(event) {
    const value = parseInt(event.target.dataset.value);
    this.currentRating = value;
    this.highlightStars(value);
    
    // Enable submit button if rating changed or new
    const submitBtn = document.getElementById('submitRating');
    if (this.isUpdate && this.currentRating === this.previousRating) {
      submitBtn.disabled = true;
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = this.isUpdate ? 'Update Rating' : 'Submit Rating';
    }
  }

  // Highlight stars up to the given value
  highlightStars(value) {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach((star, index) => {
      if (index < value) {
        star.classList.remove('far');
        star.classList.add('fas');
      } else {
        star.classList.remove('fas');
        star.classList.add('far');
      }
    });
  }

  // Reset rating UI
  resetRating() {
    this.currentRating = 0;
    this.previousRating = 0;
    this.isUpdate = false;
    this.highlightStars(0);
    document.getElementById('submitRating').disabled = true;
    document.getElementById('submitRating').textContent = 'Submit Rating';
    document.getElementById('ratingMessage').textContent = '';
  }

  // Load user's previous rating if it exists
  async loadUserRating() {
    try {
      // In a real application, you'd use authentication and get the user ID
      const userId = this.getUserId();
      if (!userId) return;

      const ratingRef = db.ref(`ratings/${this.novelId}/users/${userId}`);
      const snapshot = await ratingRef.once('value');
      const userRating = snapshot.val();

      if (userRating) {
        this.currentRating = userRating.rating;
        this.previousRating = userRating.rating;
        this.isUpdate = true;
        this.highlightStars(userRating.rating);
        
        const submitBtn = document.getElementById('submitRating');
        submitBtn.textContent = 'Update Rating';
        submitBtn.disabled = true; // Disable until changed
        
        document.getElementById('ratingMessage').textContent = `You rated this novel ${userRating.rating} stars. You can update your rating.`;
        document.getElementById('ratingMessage').className = 'mt-2 text-sm text-blue-600 dark:text-blue-400';
      }
    } catch (error) {
      console.error('Error loading user rating:', error);
    }
  }

  // Submit rating to Firebase
  async submitRating() {
    if (!this.currentRating || !this.novelId) return;

    try {
      const submitBtn = document.getElementById('submitRating');
      submitBtn.disabled = true;
      submitBtn.textContent = this.isUpdate ? 'Updating...' : 'Submitting...';

      // In a real application, you'd use authentication and get the user ID
      const userId = this.getUserId();
      if (!userId) {
        alert('Please log in to rate novels');
        submitBtn.disabled = false;
        submitBtn.textContent = this.isUpdate ? 'Update Rating' : 'Submit Rating';
        return;
      }

      // Get current stats for accurate calculation
      const statsRef = db.ref(`ratings/${this.novelId}/stats`);
      const statsSnapshot = await statsRef.once('value');
      const stats = statsSnapshot.val() || { totalRatings: 0, sumRatings: 0 };

      // Calculate updated stats differently if this is an update vs new rating
      if (this.isUpdate) {
        // For updates: subtract old rating and add new rating
        stats.sumRatings = stats.sumRatings - this.previousRating + this.currentRating;
      } else {
        // For new ratings: increment count and add to sum
        stats.totalRatings++;
        stats.sumRatings += this.currentRating;
      }
      
      // Recalculate average
      stats.averageRating = stats.sumRatings / stats.totalRatings;

      // Save user rating
      await db.ref(`ratings/${this.novelId}/users/${userId}`).set({
        rating: this.currentRating,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });

      // Update stats
      await statsRef.set(stats);

      // Update previous rating and mark as update for next time
      this.previousRating = this.currentRating;
      this.isUpdate = true;

      // Show success message
      const messageText = this.isUpdate ? 'Rating updated successfully!' : 'Rating submitted successfully!';
      document.getElementById('ratingMessage').textContent = messageText;
      document.getElementById('ratingMessage').className = 'mt-2 text-sm text-green-600 dark:text-green-400';

      // Update novel card rating display
      this.updateNovelCardRating(this.novelId, stats.averageRating, stats.totalRatings);

      // Update button
      submitBtn.textContent = 'Update Rating';
      submitBtn.disabled = true;
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      document.getElementById('ratingMessage').textContent = 'Error submitting rating. Please try again.';
      document.getElementById('ratingMessage').className = 'mt-2 text-sm text-red-600 dark:text-red-400';
      
      const submitBtn = document.getElementById('submitRating');
      submitBtn.disabled = false;
      submitBtn.textContent = this.isUpdate ? 'Update Rating' : 'Submit Rating';
    }
  }

  // Update the novel card with rating information
  updateNovelCardRating(novelId, averageRating, totalRatings) {
    const novelCard = document.querySelector(`.novel-card[data-novel-id="${novelId}"] .novel-rating`);
    if (novelCard) {
      novelCard.innerHTML = this.generateRatingStars(averageRating, totalRatings);
    }
  }

  // Generate HTML for rating stars display
  generateRatingStars(rating, totalRatings) {
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    let starsHtml = '';
    
    // Generate full, half, and empty stars
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        starsHtml += '<i class="fas fa-star text-yellow-400"></i>';
      } else if (i - 0.5 === roundedRating) {
        starsHtml += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
      } else {
        starsHtml += '<i class="far fa-star text-yellow-400"></i>';
      }
    }
    
    return `
      <div class="flex items-center">
        <div class="flex mr-1">${starsHtml}</div>
        <span class="text-xs text-gray-500 dark:text-gray-400">(${totalRatings})</span>
        <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">${rating.toFixed(1)}</span>
      </div>
    `;
  }

  // Load and display ratings for all novels in the grid
  async loadAllNovelRatings() {
    try {
      const ratingsRef = db.ref('ratings');
      const snapshot = await ratingsRef.once('value');
      const allRatings = snapshot.val() || {};
      
      // Update each novel card with its rating
      Object.keys(allRatings).forEach(novelId => {
        const stats = allRatings[novelId].stats || { averageRating: 0, totalRatings: 0 };
        this.updateNovelCardRating(novelId, stats.averageRating, stats.totalRatings);
      });
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  }

  // Get user ID (in a real app, this would come from authentication)
  getUserId() {
    // For demo purposes, generate/retrieve a persistent anonymous ID
    let userId = localStorage.getItem('anonymousUserId');
    if (!userId) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      userId = 'user_' + array[0].toString(36).substring(2, 15);
      localStorage.setItem('anonymousUserId', userId);
    }
    return userId;
  }
}

// Create and export rating system instance
const ratingSystem = new RatingSystem();