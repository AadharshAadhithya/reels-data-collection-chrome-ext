
//background.js


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (changeInfo.status === 'complete' && tab.url.includes('youtube.com/watch?v=')) {
//     chrome.tabs.executeScript(tabId, {file: 'content-script.js'});
//   }
// });

// Function to send a POST request
async function sendPostRequest(data) {
  try {
    const response = await fetch('https://firestore-add-tnkdbmu2wq-uc.a.run.app/add_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      timeout: 1600 // Timeout in milliseconds
    });

    if (!response.ok) {
      throw new Error('Failed to send POST request');
    }

    console.log('POST request sent successfully.');
  } catch (error) {
    console.error('Error sending POST request:', error.message);
  }
}


// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  if (message.eventType == "inst-like"){
    sendPostRequest({isLiked: message.isLiked, likeTimeStamp:message.likeTimeStamp, id:message.id})
  }


  if (message.eventType == "ytd-like"){
    sendPostRequest({isLiked: message.isLiked, likeTimeStamp:message.likeTimeStamp, id:message.id})
  }
  console.log('Message received from content script:', message);
  // You can handle the message as per your requirements here
});


// Function to log timestamp and URL to storage
function logToStorage(url) {
  const timestamp = new Date().toISOString();
  chrome.storage.local.get({ logs: [] }, function(result) {
    const logs = result.logs;
    logs.push({ timestamp: timestamp, url: url });
    chrome.storage.local.set({ logs: logs }, function() {
      console.log('Logged URL:', url, 'at timestamp:', timestamp);
    });
    // log2db()
  });
}



// Listen for changes in the active tab's URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get('loggingEnabled', function(result) {
    if (result.loggingEnabled) {

      if (changeInfo.url) {
          const url = new URL(changeInfo.url);
          if (url.hostname.includes('youtube.com') && url.pathname.includes('/shorts') || url.hostname.includes('instagram.com')&& url.pathname.includes('/reels') ) {


            //send msg to attach mutation observer
            const response =  chrome.tabs.sendMessage(tabId, { urlChanged: true });
            console.log(response)
            console.log('message sent')
            
            
            logToStorage(changeInfo.url);

            chrome.storage.local.get('username',(result)=> {
              var uname = result.username
              var url_string = changeInfo.url
              var parts = url_string.split("/")
              if (url.pathname.includes('/shorts')){
          
              var id = parts[parts.length-1]

              }

              if (url.pathname.includes('/reels') ){
                var id = parts[parts.length-2]

              }
              
   

              const timestamp = new Date().toISOString();
            const postData = {
              id:id,
              isLike: false,
              url: url_string,
              username: uname,
              timestamp: timestamp
            };

            console.log(postData)

            sendPostRequest(postData);


            } )
          
            




          }
      
      }
    }
  });
});

