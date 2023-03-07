


chrome.downloads.search({state: "in_progress"}, function(items) { //  get all current downloads
    var list = document.getElementById("downloads"); // get ul in popup.html
    items.forEach(function(item) { // each item => create <li> with filename
      var li = document.createElement("li");
      li.textContent = item.filename; // get filename + path

      list.appendChild(li);
    });
  });

chrome.downloads.search({state: 'complete'} || {state: 'interrupted'}, function(items)
{
    var list = document.getElementById("history");
    items.forEach(function(item){
        var li = document.createElement("li");
        li.textContent = item.filename;
        list.appendChild(li);
    })
})