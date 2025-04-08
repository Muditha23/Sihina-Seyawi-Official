// Firebase configuration
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
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Reference to the database
    const database = firebase.database();
    
    // Handle form submission
    document.addEventListener('submit', function(e) {
      if (e.target.id === 'notifyForm') {
        e.preventDefault();
        
        const emailInput = document.getElementById('notifyEmail');
        const email = emailInput.value.trim();
        const novelId = document.getElementById('novelId').value;
        const novelTitle = document.getElementById('novelTitle').value;
        
        if (validateEmail(email)) {
          // Save to Firebase
          saveSubscription(email, novelId, novelTitle);
        } else {
          showMessage('Please enter a valid email address', 'error');
        }
      }
    });
  
    // Function to save subscription to Firebase
    function saveSubscription(email, novelId, novelTitle) {
      // Create a reference to the subscriptions node
      const subscriptionsRef = database.ref('subscriptions');
      
      // Generate a unique key for the new subscription
      const newSubscriptionKey = subscriptionsRef.push().key;
      
      // Create the subscription data
      const subscriptionData = {
        email: email,
        novelId: novelId,
        novelTitle: novelTitle,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };
      
      // Write the new subscription's data
      const updates = {};
      updates['/subscriptions/' + newSubscriptionKey] = subscriptionData;
      
      database.ref().update(updates)
        .then(() => {
          // Success
          showMessage('Thank you for subscribing!', 'success');
          document.getElementById('notifyEmail').value = '';
          setTimeout(hideModal, 2000);
        })
        .catch((error) => {
          // Error
          console.error("Error saving subscription: ", error);
          showMessage('Error saving your subscription. Please try again.', 'error');
        });
    }
  });
  
  // Email validation function
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  // Function to show message to user
  function showMessage(message, type) {
    // Check if message div already exists
    let messageDiv = document.getElementById('notification-message');
    
    if (!messageDiv) {
      // Create message element if it doesn't exist
      messageDiv = document.createElement('div');
      messageDiv.id = 'notification-message';
      messageDiv.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out opacity-0 translate-y-4`;
      document.body.appendChild(messageDiv);
    }
    
    // Set appropriate styling based on message type
    if (type === 'success') {
      messageDiv.className = messageDiv.className.replace(/bg-\w+-\d+/g, '');
      messageDiv.classList.add('bg-green-100', 'text-green-800', 'border-l-4', 'border-green-500');
    } else if (type === 'error') {
      messageDiv.className = messageDiv.className.replace(/bg-\w+-\d+/g, '');
      messageDiv.classList.add('bg-red-100', 'text-red-800', 'border-l-4', 'border-red-500');
    }
    
    // Set message text
    messageDiv.textContent = message;
    
    // Show message
    setTimeout(() => {
      messageDiv.classList.remove('opacity-0', 'translate-y-4');
    }, 10);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      messageDiv.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
      }, 300);
    }, 3000);
  }
  
  // Reference to hideModal function from novels-generator.js
  function hideModal() {
    const modal = document.getElementById('notifyModal');
    const subscriptionBox = document.getElementById('subscription-box');
    
    subscriptionBox.classList.add('opacity-0', 'translate-y-10');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }