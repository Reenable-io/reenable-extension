let storage = chrome.storage.local;

let urls = [];

chrome.webNavigation.onCompleted.addListener(function(details) {
  $.ajax({
    url: 'https://websiteblockbypayment.herokuapp.com/api/findbyuser',
    type: "POST",
    contentType: "application/json;charset=utf-8",
    headers:{
    },
    dataType: 'json',
    data:JSON.stringify({"name":"mas@gmail.com"}),
    success: function (results) {
      for(let i=0;i<results.data.length;i++)
      {
        urls.push(results.data[i].url);
      }
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        var testurl=activeTab.url;
        var spliturl=testurl.split(".");
        if(urls.indexOf(testurl)>=0)
        {
          chrome.tabs.remove(activeTab.id, function() {  alert("URL removed du to you have block that");});
        }
        else if(urls.indexOf(spliturl[0]+"."+spliturl[1])>=0)
        {
          chrome.tabs.remove(activeTab.id, function() {  alert("URL removed du to you have block that");}); 
        }
        else if(spliturl[2])
        {
         if (urls.indexOf(spliturl[0]+"."+spliturl[1]+"."+spliturl[2].split("/")[0]+"/")>=0)
          chrome.tabs.remove(activeTab.id, function() {  alert("URL removed du to you have block that");}); 
        }
     });
    },
    error: function (err) {
    }
});

});

chrome.runtime.onInstalled.addListener(() => {
  storage.set({myblklist:["none"]},function(params) { });
})

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse){

  if (request.job == "sendBlockInfoToDb"){

    $.ajax({
      url: 'https://websiteblockbypayment.herokuapp.com/api/block',
      type: "POST",
      contentType: "application/json;charset=utf-8",
      headers:{
      },
      dataType: 'json',
      data:JSON.stringify(request.data),
      success: function (results) {
        sendResponse({
          message:results
         })
      },
      error: function (err) {
        sendResponse({
          message:err
         })
      }
  });
  return true;
  }
  if (request.job == "getBlockInfoFromDb"){

    $.ajax({
      url: 'https://websiteblockbypayment.herokuapp.com/api/findbyuser',
      type: "POST",
      contentType: "application/json;charset=utf-8",
      headers:{
      },
      dataType: 'json',
      data:JSON.stringify({"name":"mas@gmail.com"}),
      success: function (results) {
        for(let i=0;i<results.data.length;i++)
        {
          urls.push(results.data[i].url);
        }
        storage.set({"myblklist":urls});
        sendResponse({
          message:results
         })
      },
      error: function (err) {
        sendResponse({
          message:err
         })
      }
  });
  return true;
  }
});

