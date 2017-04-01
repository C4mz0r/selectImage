/*
 * Download the images specified from the content script
 */
function handleMessage(request, sender, sendResponse) {
  var downloader = new Downloader();
  request.images.forEach(function(theImage){    
    downloader.download(theImage);
  });  
  sendResponse({response: "Response from background script: " + downloader.getResponseMessage()});
  downloader = null;
}

browser.runtime.onMessage.addListener(handleMessage);

/*
 * Class for handling the downloading of a URLs.
 */
function Downloader() {    
    
    // Keep track of any errors when download is called
    var errors = [];

    this.onStartedDownload = function(id) {
        console.log('Started downloading ${id}');
    }

    this.onFailed = function(error) {        
        errors.push('Encountered error: ${error}');
        console.log('Download failed ${error}');
    }

    this.download = function(url) {
        var downloading = browser.downloads.download({
            url: url,
            filename: 'the-file.png',
            conflictAction: 'uniquify'
        });
        downloading.then(this.onStartedDownload, this.onFailed);
    }

    // Create a summary about how the downloading went
    this.getResponseMessage = function() {
        var response = "";
        if ( errors.length > 0 ) {
            response = "Received some errors during download: " + errors.join(',');
        } 
        else {
            response = "No errors were encountered."
        }
        return response;
    }
}