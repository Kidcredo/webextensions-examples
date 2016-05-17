
var latestDownloadId;

/*
Callback from getFileIcon.
Log an error, or initialize the displayed icon.
*/
function updateIconUrl(iconUrl) {
  /*
  If there was an error getting the icon URL,
  then lastError will be set. So check lastError
  and handle it.
  */
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    iconUrl = "";
  }
  var downloadIcon = document.querySelector("#icon");
  downloadIcon.setAttribute("src", iconUrl);
}

/*
If there was a download item,
- remember its ID as latestDownloadId
- initialize the displayed icon using getFileIcon
- initialize the displayed URL 
If there wasn't a download item, disable the "open" and "remove" buttons.
*/
function initializeLatestDownload(downloadItems) {
  var downloadUrl = document.querySelector("#url");
  if (downloadItems.length > 0) {
    latestDownloadId = downloadItems[0].id;
    chrome.downloads.getFileIcon(latestDownloadId, updateIconUrl);
    downloadUrl.textContent = downloadItems[0].url;
  } else {
    downloadUrl.textContent = "No downloaded items found."
    document.querySelector("#open").disabled = true;
    document.querySelector("#remove").disabled = true;
  }
}

/*
Search for the most recent download, and pass it to initializeLatestDownload()
*/
chrome.downloads.search({
  limit: 1,
  orderBy: ["-startTime"]
}, initializeLatestDownload);

/*
Open the item using the associated application.
*/
function openItem() {
  chrome.downloads.open(latestDownloadId);
}

/*
Remove item from disk (removeFile) and from the download history (erase)
*/
function removeItem() {
  chrome.downloads.removeFile(latestDownloadId);
  chrome.downloads.erase({id: latestDownloadId});
  window.close();
}

document.querySelector("#open").addEventListener("click", openItem);
document.querySelector("#remove").addEventListener("click", removeItem);