let storage = chrome.storage.sync;
let urls_2 = [];
var startvar = false;

function get_uuid() {
  var uuid = storage.get("userId", function (data) {
    return data.uuid
  })
}

function get_urls() {
  storage.get("urls_toblock", function(data) {
    return data.urls_toblock;
  })
}

function start() {
  startvar = true;
}

function update_urls() {
  var urls = storage.get("urls_toblock", function (data) {
    return data.urls_toblock
  })
}

var blockedUrlToStr = "";

function callback(details) {
  return { redirectUrl: "chrome-extension://" + chrome.runtime.id + "/blocked/page-blocked.html?blocked_url=" + details.url } 
}


function setListener(urls, rawrls) {
  storage.get("urls_toblock", function (data) {
    console.log(data.urls_toblock)
  });

  if (chrome.webRequest.onBeforeRequest.hasListener(callback(details))) { chrome.webRequest.onBeforeRequest.removeListener(callback(details)) }
  chrome.webRequest.onBeforeRequest.addListener(callback(details), { urls: urls }, ["blocking"]);

  //reloadUrls();
  chrome.runtime.sendMessage({ job: "getBlockInfoFromDb" }, function (response) {
  })
}

function reloadUrls(url) {
  console.log("url to reload:", url)
  chrome.tabs.query({ windowType: 'normal' }, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].url.includes("chrome://")) tabs.splice(i, 1)

      for (var y = 0; y < 1; y++) {
        tab_url = tabs[i].url.split("/")[2]

        if (url.includes(tabs[i].url)) {
          chrome.tabs.update(tabs[i].id, { url: tabs[i].url });
        }
      }
    }
  })
}

function blockRequest(url) {
  console.log(url)
  chrome.webRequest.onBeforeRequest.addListener(function (details) {
    return { redirectUrl: "chrome-extension://" + chrome.runtime.id + "/blocked/page-blocked.html?blocked_url=" + url + "" }
  }, { urls: [url] }, ["blocking"]);

  reloadUrls(url);
}

try {
  chrome.webRequest.onHeadersReceived.addListener(function (details) {
    blockRequest(details.url)
  }, { urls: ["https://www.reddit.com/*"] })
} catch (err) {
  console.log(err)
}


try {
  chrome.webNavigation.onCompleted.addListener(function (details) {
    $.ajax({
      url: 'https://websiteblockbypayment.herokuapp.com/api/findbyuser',
      type: "POST",
      contentType: "application/json;charset=utf-8",
      headers: {
      },
      dataType: 'json',
      data: JSON.stringify({ "name": "mas@gmail.com" }),
      success: function (results) {
        for (let i = 0; i < results.data.length; i++) {
          urls_2.push(results.data[i].url);
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          var activeTab = tabs[0];
          var testurl = activeTab.url;
          var spliturl = testurl.split(".");
          if (urls_2.indexOf(testurl) >= 0) {
            chrome.tabs.remove(activeTab.id, function () { alert("URL removed du to you have block that"); });
          }
          else if (urls_2.indexOf(spliturl[0] + "." + spliturl[1]) >= 0) {
            chrome.tabs.remove(activeTab.id, function () { alert("URL removed du to you have block that"); });
          }
          else if (spliturl[2]) {
            if (urls_2.indexOf(spliturl[0] + "." + spliturl[1] + "." + spliturl[2].split("/")[0] + "/") >= 0)
              chrome.tabs.remove(activeTab.id, function () { alert("URL removed du to you have block that"); });
          }
        });
      },
      error: function (err) {
      }
    });

  });
}
catch (err) {
  console.log(err)
}
chrome.runtime.onInstalled.addListener(() => {
  storage.set({ myblklist: ["none"] }, function (params) { });
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.job == "sendBlockInfoToDb") {

    $.ajax({
      url: 'https://websiteblockbypayment.herokuapp.com/api/block',
      type: "POST",
      contentType: "application/json;charset=utf-8",
      headers: {
      },
      dataType: 'json',
      data: JSON.stringify(request.data),
      success: function (results) {
        sendResponse({
          message: results
        })
      },
      error: function (err) {
        sendResponse({
          message: err
        })
      }
    });
    return true;
  }
  if (request.job == "getBlockInfoFromDb") {

    $.ajax({
      url: 'https://websiteblockbypayment.herokuapp.com/api/findbyuser',
      type: "POST",
      contentType: "application/json;charset=utf-8",
      headers: {
      },
      dataType: 'json',
      data: JSON.stringify({ "name": "mas@gmail.com" }),
      success: function (results) {
        for (let i = 0; i < results.data.length; i++) {
          urls_2.push(results.data[i].url);
        }
        storage.set({ "myblklist": urls_2 });
        sendResponse({
          message: results
        })
      },
      error: function (err) {
        sendResponse({
          message: err
        })
      }
    });
    return true;
  }
});

