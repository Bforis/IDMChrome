// global variable

//

// status & infos downloads
function updateDownloadsList() {
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
      pauseStartBtn.addEventListener("click", function () {
        if (item.paused) {
          chrome.downloads.resume(item.id, function () {
            pauseStartBtn.textContent = "Pause";
            updateDownloadsList();
          });
        } else {
          chrome.downloads.pause(item.id, function () {
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

      // informations
      var infos = document.createElement("p");

      setInterval(function () {
        console.log(item.bytesReceived);
        const timeElapsed = (Date.now() - item.startTime) / 1000;
        const speed =
          timeElapsed > 0
            ? item.bytesReceived / (1024 * 1024) / timeElapsed
            : 0;
        const remainingTime = (item.totalBytes - item.bytesReceived) / speed;
        const fileType = item.filename.split(".").pop();
        const saveLocation = item.filename.substring(
          0,
          item.filename.lastIndexOf("/")
        );
        infos.textContent = `Speed: ${speed.toFixed(2)} MB/s`;
      }, 1000);

      li.appendChild(infos);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  updateDownloadsList();
});

/*
// function that does not work or is not efficient enough like useless history
// === Incognito ===
// event listener for download
chrome.downloads.onCreated.addListener(function(downloadItem) {
  if (incognitoEnabled) {
    // notification for asking if you want incognito mode or not
    chrome.notifications.create({
      type: 'basic',
      // iconUrl: 'icon.png',
      title: 'Download in Incognito Mode ?',
      buttons: [
        {title: 'Normal Mode'},
        {title: 'Incognito Mode'}
      ],
      conflictAction: "overwrite"
    }, function(notificationId) {
      chrome.notifications.onButtonClicked.addListener(function(clickedNotificationId, buttonIndex) {
        // if yes
        if (clickedNotificationId === notificationId && buttonIndex === 1) {
          chrome.downloads.download({url: downloadItem.url, incognito: true});
        }
      });
    });
  }
});

// event listener incognito
document.getElementById('incognito').addEventListener('click', function() {
  // enable or disabled incognito
  if (incognitoEnabled) {
    incognitoEnabled = false;
    document.getElementById('incognito').textContent = 'OFF';
    saveIncognitoEnabled(incognitoEnabled);
  } else {
    incognitoEnabled = true;
    document.getElementById('incognito').textContent = 'ON';
    saveIncognitoEnabled(incognitoEnabled);
  }
});

// save incognito mode
function saveIncognitoEnabled(value) {
  chrome.storage.local.set({ incognitoEnabled: value });
}

// get value of incognito
function getIncognitoEnabled(callback) {
  chrome.storage.local.get("incognitoEnabled", function (result) {
    var value = result.incognitoEnabled;
    if (value === undefined) {
      value = false;
    }
    callback(value);
  });
}

// update button with value of incognito
getIncognitoEnabled(function (value) {
  console.log("prout");
  incognitoEnabled = value;
  updateButton(); // Met à jour l'apparence du bouton en fonction de la valeur de incognitoEnabled
});

function updateButton()
{
  if (incognitoEnabled) {
    document.getElementById('incognito').textContent = 'ON';
  } else {
    document.getElementById('incognito').textContent = 'OFF';
  }
}

// === Incognito ===

// history
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

// Create chart

function chart(item){
  const dataBandwidth = [];
  const timeLeft = [];

  const debit = item.bytesReceived / (item.endTime - item.startTime); // octect/s
  const endTime = (item.totalBytes - item.bytesReceived) / debit; // end time/s
  dataBandwidth.push(debit);
  timeLeft.push(endTime);

  const datasetBand = {
    label: 'bandwidth',
    data: dataBandwidth,
    borderColor: 'blue',
    backgroundColor: 'lightblue',
    fill: false,
    yAxisID: 'y-axis-1'
  }

  const datasetTimeLeft = {
    label: 'End Time',
    data: timeLeft,
    borderColor: 'green',
    backgroundColor: 'lightgreen',
    fill: false,
    yAxisID: 'y-axis-2'
  }

  const config = {
    type: 'line',
    data: {
      labels: item.filename,
      datasets: [datasetBand, datasetTimeLeft]
    },
    options: {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Bandwidth (octect/s)'
            }
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Time Left (/s)'
            }
          }
        ]
      }
    }
  };

  // Récupérer le canvas et créer le graphique
  const canvas = document.createElement('canvas');
  const graphic = new Chart(canvas, config);
}
*/
