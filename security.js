// This script attempts to disable common ways to access developer tools
document.addEventListener('contextmenu', function(e) {
  // Prevent the right-click context menu from appearing
  e.preventDefault();
});

document.addEventListener('keydown', function(e) {
  // Check for F12 key
  if (e.keyCode === 123) {
    e.preventDefault();
    return false;
  }

  // Check for Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), or Ctrl+U (Source)
  if (e.ctrlKey && (e.shiftKey && (e.keyCode === 73 || e.keyCode === 74) || e.keyCode === 85)) {
    e.preventDefault();
    return false;
  }
});