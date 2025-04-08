// JavaScript to prevent common page content access methods

document.addEventListener('DOMContentLoaded', function() {
    // Prevent right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Prevent keyboard shortcuts for viewing source, saving, etc.
    document.addEventListener('keydown', function(e) {
        // Prevent: Ctrl+S (Save), Ctrl+U (View Source), F12 (Developer Tools)
        // Ctrl+Shift+I (Developer Tools), Ctrl+Shift+J (Developer Tools)
        // Ctrl+A (Select All), Ctrl+C (Copy), Ctrl+X (Cut)
        if (
            (e.ctrlKey && e.key === 's') || 
            (e.ctrlKey && e.key === 'u') || 
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'i') || 
            (e.ctrlKey && e.shiftKey && e.key === 'j') || 
            (e.ctrlKey && e.key === 'a') ||
            (e.ctrlKey && e.key === 'c') ||
            (e.ctrlKey && e.key === 'x')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';

    // Prevent drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable image dragging
    const images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
        images[i].setAttribute('draggable', 'false');
        images[i].addEventListener('mousedown', function(e) {
            e.preventDefault();
        });
    }

    // Custom message when trying to access disabled features
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable printing
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        return false;
    });

    // Clear clipboard on copy attempt
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '');
        return false;
    });

    // Add warning message on leaving page
    window.addEventListener('beforeunload', function(e) {
        const message = 'Are you sure you want to leave?';
        e.returnValue = message;
        return message;
    });

    console.log('Content protection measures initialized');
});