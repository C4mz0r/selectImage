// Manages the list of items that the user wants to download
var downloadList = new DownloadList();

// Manage and display the download button
var downloadButton = new DownloadButton(downloadList);
downloadButton.createButton();

// Manage the ability to click on items to select them
var selection = new Selection(downloadButton, downloadList);

/*
 * Class for the download list
 */
function DownloadList() {
    var downloads = [];
    
    this.getList = function() {
        return downloads;
    }

    this.addItem = function(name) {
        downloads.push(name);
    }
}

/*
 * Class for the selection
 */
function Selection(button, list) {
    var images = document.body.querySelectorAll('img');    

    var selectImage = function(element) {    
        element.className = 'selectedImage';
        
        // If the image is a thumbnail, often the parent will be an anchor with href to the larger image;
        // try to get this image instead of the thumbnail
        if (element.parentElement !== undefined && element.parentElement.hasAttribute('href')) {
                list.addItem(element.parentElement.href);            
        } else {
            list.addItem(element.src);
        }
        button.updateButtonText(list.getList().length);        
    }

    images.forEach(
        function(element){
            element.className = 'unselectedImage';
            element.onclick = function(e) {                                            
                e.stopImmediatePropagation();
                e.preventDefault();
                selectImage(element);
                return false;
            }
        }
    );  
}

/*
 * Class for the download button.
 */
function DownloadButton(list) {
    
    // html id
    var id = 'downloadButtonSelectImage';
    var title = 'Download';
    var button = undefined;
    var downloadList = list;
        
    this.createButton = function() {            
        button = document.createElement("button");
        button.id = id;
        button.innerHTML = title;
        
        button.onclick = function(){             
            if (downloadList.getList().length > 0) {
                doDownload(downloadList.getList());
            }             
            else {
                alert('You have not selected any items for download');
            }
        }
        document.body.appendChild(button);    
    };

    this.updateButtonText = function(counter) {        
        if (counter > 0)
            button.innerHTML = title + ' (' + counter + ')';        
    }

    // Functions for doing the download
    function handleResponse(message) {
        console.log(`Message from the background script:  ${message.response}`);
    }

    function handleError(error) {
        console.log(`Error: ${error}`);
    }

    var doDownload = function(downloads) {    
        var sending = browser.runtime.sendMessage({images: downloads});
        sending.then(handleResponse, handleError);
    };
}