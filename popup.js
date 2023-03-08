function updateDownloadsList(){
  chrome.downloads.search({ state: "in_progress" }, function (items) {
    //  get all current downloads
    var list = document.getElementById("downloads"); // get ul in popup.html
    list.innerHTML = ""; //  reset for updating list, prevent bug open/close popup.
    items.forEach(function (item) {
      // each dl => create <li> with filename
      var li = document.createElement("li");
      li.textContent = item.filename; // get filename + path
      list.appendChild(li);
  
      // create pause/start button
      var pauseStartBtn = document.createElement("button");
      if (item.paused) {
        pauseStartBtn.textContent = "Start";
      } else {
        pauseStartBtn.textContent = "Pause";
      }
      pauseStartBtn.addEventListener("click", function() {
        if (item.paused) {
          chrome.downloads.resume(item.id, function() {
            pauseStartBtn.textContent = "Pause";
            updateDownloadsList();
          });
        } else {
          chrome.downloads.pause(item.id, function() {
            pauseStartBtn.textContent = "Start";
            updateDownloadsList();
          });
        }
      });
      li.appendChild(pauseStartBtn);
  
      // create delete button
      var deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", function () {
        chrome.downloads.erase({ id: item.id });
        li.remove();
      });
      li.appendChild(deleteBtn);
    });
  });
}

updateDownloadsList();

// History
chrome.downloads.search(
  { state: "complete" } || { state: "interrupted" },
  function (items) {
    var list = document.getElementById("history");
    items.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item.filename;
      list.appendChild(li);
    });
  }
);
