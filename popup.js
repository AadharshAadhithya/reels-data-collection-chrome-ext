// popup.js
document.addEventListener('DOMContentLoaded', function() {
  var contentDiv = document.getElementById('content');
  
  // Get the active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var url = tabs[0].url;

    chrome.storage.local.get('username', function(result) {
      var username = result.username;
      if (!username) {
        showUsernameForm();
      } else {

        if (isYouTubeOrInstagram(url)) {
          showButtons();
        } else {
          showNotSupportedMessage();
        }
      }
    });



  });


    // Function to display the username form
    function showUsernameForm() {
      contentDiv.innerHTML = `
        <form id="usernameForm">
          <input type="text" id="usernameInput" placeholder="Enter your username">
          <button type="submit">Set Username</button>
        </form>
      `;
      addUsernameFormListener();
    }


   // Function to add event listener to username form
   function addUsernameFormListener() {
    var usernameForm = document.getElementById('usernameForm');
    usernameForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var newUsername = document.getElementById('usernameInput').value;
      // Set the username in Chrome storage
      chrome.storage.local.set({ username: newUsername }, function() {
        console.log('Username set:', newUsername);
        showButtons();
      });
    });
  }

  // Function to check if URL is from YouTube or Instagram
  function isYouTubeOrInstagram(url) {
    return url.includes('youtube.com') || url.includes('instagram.com');
  }

  // Function to display buttons
  function showButtons() {
    contentDiv.innerHTML = `
      <button id="startButton">Start Logging</button>
      <button id="stopButton">Stop Logging</button>
      <button id="clearLogButton">Clear Log</button>
      <button id="displayDataButton">Display Stored Contents</button>
      <p id="recordingStatus"></p>
    `;
    addEventListeners();
    updateRecordingStatus();
  }

  // Function to update recording status text
  function updateRecordingStatus() {
    chrome.storage.local.get('loggingEnabled', function(result) {
      var recordingStatusText = result.loggingEnabled ? 'Recording' : 'Not Recording';
      document.getElementById('recordingStatus').textContent = recordingStatusText;
    });
  }

  // Function to display not supported message
  function showNotSupportedMessage() {
    contentDiv.textContent = 'This is not YouTube or Instagram.';
  }

  // Function to add event listeners to buttons
  function addEventListeners() {
    var startButton = document.getElementById('startButton');
    var stopButton = document.getElementById('stopButton');
    var clearLogButton = document.getElementById('clearLogButton');
    var displayDataButton = document.getElementById('displayDataButton');

    startButton.addEventListener('click', function() {
      chrome.storage.local.set({ loggingEnabled: true }, function() {
        console.log('Logging started.');
        updateRecordingStatus();
      });
    });

    stopButton.addEventListener('click', function() {
      chrome.storage.local.set({ loggingEnabled: false }, function() {
        console.log('Logging stopped.');
        updateRecordingStatus();
      });
    });

    clearLogButton.addEventListener('click', function() {
      chrome.storage.local.remove('logs', function() {
        console.log('Logs cleared.');
      });
    });

    displayDataButton.addEventListener('click', function() {
      chrome.storage.local.get(['logs'], function(result) {
        console.log('Stored Contents:', result.logs);
      });
    });
  }
});
