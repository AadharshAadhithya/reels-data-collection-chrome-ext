// contentScript.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Check if the message indicates a URL change
  if (message.urlChanged) {
    console.log("url changed")
    attachListnertoLikeButtons()
  }
});





//function to get all the like buttons and attach a mutation listner to monitor them
function attachListnertoLikeButtons() {
  var shortsInnerContainer = document.getElementById('shorts-inner-container');
  if (!shortsInnerContainer) {
    console.error('Element with id "shorts-inner-container" not found.');
    return;
  }
  // var preloadedShorts = shortsInnerContainer.querySelectorAll('ytd-reel-video-renderer');
  var likeButtons = shortsInnerContainer.querySelectorAll('button[aria-label^="like"]');
  likeButtons.forEach(function(likeButton) {
    monitorLikeButton(likeButton);
  });
}

// Function to send a message to the background script
function sendMessageToBackground(isLiked,id) {

  chrome.runtime.sendMessage({ isLiked: isLiked, likeTimeStamp: new Date().toISOString(), id:id, eventType: "ytd-like" }, function(response) {
    console.log('Message sent to background script:', response);
  });
}




// Function to monitor the like button
function monitorLikeButton(likeButton) {
  
  console.log(likeButton)
  console.log(likeButton.__mutationObserverAttached)
  if (!likeButton || likeButton.__mutationObserverAttached ) return;

  // Create a MutationObserver to watch for changes in the aria-pressed attribute
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // Check if the aria-pressed attribute changed
      if (mutation.attributeName === 'aria-pressed') {
        var isLiked = mutation.target.getAttribute('aria-pressed') === 'true';
        console.log('Like status changed:', isLiked);
        const url = location.href
        const parts = url.split("/")
        const id = parts[parts.length-1]
        // Send message to background script
        sendMessageToBackground(isLiked,id);
      }
    });
  });

  // Configure and start the observer
  var config = { attributes: true, attributeFilter: ['aria-pressed'] };
  observer.observe(likeButton, config);

  // Mark the button as having a mutation observer attached
  likeButton.__mutationObserverAttached = true;
}































// // Function to monitor changes to the shorts-inner-container div
// function monitorShortsContainer() {
//   var shortsInnerContainer = document.getElementById('shorts-inner-container');

//   if (!shortsInnerContainer) {
//     console.error('Element with class "shorts-inner-container" not found.');
//     return;
//   }

//   // Create a MutationObserver to watch for changes in the shorts-inner-container div
//   var observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//       // Check if the mutation involves adding or removing child nodes
//       if (mutation.type === 'childList') {
//         // Get all buttons inside the shorts-inner-container div with aria-label containing "like"
//         var likeButtons = shortsInnerContainer.querySelectorAll('button[aria-label^="like this"]');

//         // Loop through each like button and monitor it
//         likeButtons.forEach(function(likeButton) {
//           monitorLikeButton(likeButton);
//         });
//       }
//     });
//   });

//   // Configure and start the observer
//   var config = { childList: true, subtree: true };
//   observer.observe(shortsInnerContainer, config);
// }

// Call the function to monitor the shorts-inner-container div
// monitorShortsContainer();





// monitorLikeButton();

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

//   console.log('Received Message!');
//   console.log(message)
//   if (message.urlChanged) {
//     console.log("url changed.... attaching like button monitor")
//     var likeButton = document.querySelector('button[aria-label*="like"]');
//     console.log("-------------")
//     console.log(likeButton)
//     monitorLikeButton(likeButton);
//   }



// });

// // Listen for messages from the background script




