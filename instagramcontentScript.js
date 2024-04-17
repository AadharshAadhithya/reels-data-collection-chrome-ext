// contentScript.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // Check if the message indicates a URL change
    if (message.urlChanged) {
      console.log("url changed")
    }
  });
  
  
// Listen for clicks on the like button
document.addEventListener('click', function(event) {

  var clickedElement = event.srcElement.parentElement
  console.log(clickedElement)

  if (clickedElement.tagName.toLowerCase() === 'div' || clickedElement.tagName.toLowerCase() === 'span') {
    // Search for an SVG element with aria-label "Like" or "Unlike" inside the div or span
    var svgElements = clickedElement.querySelectorAll('svg[aria-label="Like"], svg[aria-label="Unlike"]');
    // Return the first SVG element found, if any
    if (svgElements.length == 1) {
      var likeStatus = svgElements[0].getAttribute("aria-label")
    }

  }

  if (clickedElement.tagName.toLowerCase() === 'svg'){

    var likeStatus = clickedElement.getAttribute("aria-label")
  }

  if(likeStatus){
    const url = location.href
        const parts = url.split("/")
        const id = parts[parts.length-2]

        const isLiked = (likeStatus=="Like")
        sendMessageToBackground(isLiked,id)
  }

} );
  
  
  
  // Function to send a message to the background script
  function sendMessageToBackground(isLiked,id) {
  
    chrome.runtime.sendMessage({ isLiked: isLiked, likeTimeStamp: new Date().toISOString(), id:id, eventType: "inst-like" }, function(response) {
      console.log('Message sent to background script:', response);
    });

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
  
  
  
  
  