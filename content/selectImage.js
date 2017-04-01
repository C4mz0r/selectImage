function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

var downloads = [];

function updateButtonText() {    
    var text = 'Download';
    var button = document.querySelector('#downloadButton');    
    if (downloads.length > 0)
        text += ' (' + downloads.length + ')';
    button.innerHTML = text;
}

function doDownload(downloads) {
    alert('dl clicked');
    var sending = browser.runtime.sendMessage({images: downloads});
    sending.then(handleResponse, handleError);
};

function AddButton() {    
    var button = document.createElement("button");
    button.id = "downloadButton";
    button.innerHTML = 'Download';
    button.onclick = function(){ 
        if (downloads.length > 0) {
    	    doDownload(downloads);
        } else {
            alert('You have not selected any items for download');
        }
    }
    document.body.appendChild(button);    
};

AddButton();


var selectImage = function(element) {    
    element.className = 'selectedImage';
    downloads.push(element.src);
    updateButtonText();
    console.log('Downloads are: ' + downloadList);
    console.log('Want to try dl ' + element.src);    
}


var images = document.body.querySelectorAll('img');
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


