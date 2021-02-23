(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    const { url } = require("inspector");

    $(document).ready(function () {

      $(document).ready(function () {
        let storage = chrome.storage.local;
        var slider = document.getElementById("priceslider");
        var output = document.getElementById("demo");
        var mediabutton = $(".mediabutton");
        //var resetbtn=$("#resetbtn");
        var addcustom = $("#addcustom");
        var customurldiv = $("#customurldiv");
        var customurlinput = $("customurlinput");
        var customurladdbtn = $("#customurladdbtn");
        var showblocklist = $("#showblocklist");
        var unblockboard = $("#unblockboard");
        var dashboard = $("#dashboard");
        var unblockboardhead = $("#unblockboardhead");
        var addbtn = $("#addBtn");
        var curlBtn = $("#currentUrlBtn")

        var urls = [];
        var dburllist = [];
        var myRange = 1;

        output.innerHTML = slider.value;

        mediabutton.on('dragstart', function (event) { event.preventDefault(); });

        context = document.getElementById("currentUrlCanvas").getContext("2d");
        context.font = "26px Arial"
        context.fillStyle = "white"
        context.textAlign = "center"
        context.fillText("C", 16, 25)

        slider.oninput = function () {
          output.innerHTML = this.value;
          myRange = this.value;
          if (this.value >= 100) {

          }
        }

        /*chrome.runtime.sendMessage({job: "getBlockInfoFromDb"}, function(response) {
          
          for(let i=0;i<response.message.data.length;i++)
          {
            dburllist.push(response.message.data[i].url);
          }
          mediabutton.each(function(index)
          {
        
          if(dburllist.indexOf($(this).attr("data-url"))>=0)
          {
            $(this).prop('disabled', true);
          }
          })
          })
          mediabutton.each(function(index)
          {
            $(this).click(function()
            {
              $(this).prop('disabled', true);
            })
            
          })

        resetbtn.click(function()
        {
          mediabutton.each(function(index)
        {
            $(this).prop('disabled', false);
        })
        customurlinput.val("");
        location.reload();
        });*/

        mediabutton.click(function () {
          $(this).addClass("lowopacity");
          const medUrl = $(this).attr("data-url")
          const cutUrl = []

          for (const urlval in medUrl) {
            cutUrl.push(urlval)
          }
        });

        curlBtn.click(function () {
          var currentUrl;

          chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) { currentUrl = tabs[0].url });

          console.log(currentUrl)

          try {
            currentUrl = currentUrl.split("/").join("^")
            currentUrl = currentUrl.split("https://").pop().split("http://").pop().split("^")[0];
          }
          catch (error) {
            sAlert("failure", "error 1")
            return console.log(error)
          }

          sAlert("success", "Successfully saved the site " + currentUrl)
        })

        function addUrl(input_url, input_name, image_url) {
          var input = input_url;

          mediabutton.each(function () {
            if ($(this).attr("id") === input_name) {
              return sAlert("failure", 'Duplicate: ' + input)
            }
          });

          $("#mediabuttondiv").append($('\
                <button class="mediabutton" id="' + input_name + '" data-url="https://www.' + input + '/">\
                <img src='+ image_url + ' alt="' + input_name + '" width="32px" /> \
                </button>'));
        }

        customurladdbtn.click(function () {
          var input = $('input[id=customurlinput]').val();

          try {
            input = input.split("/").join("^").split("https:^^").pop().split("http:^^").pop().split("^")[0];
          }
          catch (error) {
            sAlert("failure", "error 1")
            return console.log(error)
          }

          if (!input.includes(".") && !input) {
            return sAlert("failure", "error 2")
          }

          var input_name = input.split(".")[0]
          var image = "https://s2.googleusercontent.com/s2/favicons?sz=32&domain=" + input

          addUrl(input, input_name, image)
        });

        $("#customurlinput").keypress(function (event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            customurladdbtn.click();
          }
        });

        addbtn.click(function () {
          $(".mediabutton").each(function () {
            if ($(this).hasClass('lowopacity')) {
              if (!urls.includes($(this).attr("data-url") + "*")) {
                urls.push($(this).attr("data-url") + "*");
              }
            }
          })

          console.log(urls)

          findAllURL = function changeAllURL(toBlock) {

            document.documentElement.innerHTML = '';
            document.documentElement.innerHTML = 'Domain is blocked';
            document.documentElement.scrollTop = 0;
          }

          function updateFilters(urls) {
            chrome.webRequest.onBeforeRequest.addListener(
              function () {
                return { cancel: true };
              },
              { urls: urls }, ["blocking"]);

            /*chrome.tabs.query({ windowType: 'normal' }, function (tabs) {
              for (var i = 0; i < tabs.length; i++) {
                for (var i = 0; i < urls.length; i++) {
                  url1 = urls[i].slice(0, -1)
                  console.log(url1)
                  tab_url = tabs[i].url.split(/\/(.+)/)
                  console.log(tab_url)
                  if (url1.includes(tabs[i].url)) {
                    chrome.tabs.update(tabs[i].id, { url: tabs[i].url });
                  }
                }
              }
            });*/
          }

          updateFilters(urls);

          let till = $("#blockuntill").val();
          let from = $("#timefrom").val();
          let to = $("#timeto").val();
          let price = myRange;

          if (!urls) {
            sAlert("failure", "Please provide urls")
          }


          /*let urllist=[];
            for(let i=0;i<urls.length;i++)
            {
              if(dburllist.indexOf(urls[i])==-1 && till!="")
              urllist.push({"name":"mas@gmail.com","url":urls[i],"till":till,"from":from,"to":to,"amount":price,"user":"mas@gmail.com","trackId":(+new Date).toString(36).slice(-5)+i+"mas@gmail.com"});
            }
            if(urllist.length>0)
            {
            chrome.runtime.sendMessage({job: "sendBlockInfoToDb",data:urllist}, function(response) {
              urllist=[];
              if(response.message!="error")
              sAlert("success","Successfully stored");
              setTimeout(() => {
                location.reload();
                }, 3000); 
              });
            }*/
        });

        showblocklist.click(function () {
          $("#unblockboarddiv").empty();
          chrome.runtime.sendMessage({ job: "getBlockInfoFromDb" }, function (response) {
            console.log(response.message.data);
            data = response.message.data;
            for (let i = 0; i < data.length; i++) {
              $("#unblockboarddiv").append('<button class="blockedmediabutton" id="' + data[i].url.split(".")[1] +
                "blocked" + '" data-url="' + data[i].url + '" data-till="' + data[i].till + '" data-to="' + data[i].to + '" data-from="' + data[i].from +
                '"data-amount="' + data[i].amount + '"data-date="' + data[i].date + '"data-trackId="' + data[i].trackId +
                '">' + data[i].url.split(".")[1] + '</button>');
            }
          });

          setTimeout(function () {
            $(".blockedmediabutton").each(function (index) {
              $(this).on("click", function () {
                $("#btnunblock").html("Unblock for " + $(this).attr("data-amount") + " USD now");
                $("#btnunblock").attr("data-trackid", $(this).attr("data-trackId"));
                $("#blockeduntillspan").html("Block untill: " + $(this).attr("data-till"));
                $("#untillprogress").attr("max", new Date($(this).attr("data-till")).getTime());
                const date1 = new Date($(this).attr("data-till")).getTime();
                const date2 = new Date($(this).attr("data-date")).getTime();
                const diffTime = Math.abs(new Date("2020-20-19").getTime() - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                console.log(diffDays);
                $("#untillprogress").attr("max", Math.ceil((Math.abs(date2)) / (1000 * 60 * 60 * 24)));
                $("#untillprogress").attr("value", diffDays);
              })
            })
          }, 1000)
          unblockboard.prop('hidden', false);
          dashboard.prop('hidden', true);
        });
        $("#btnunblock").click(function () {
          window.open("https://websiteblockbypayment.herokuapp.com/" + $(this).attr("data-trackId"), "_blank");
        });
        function hasdublicatebutton(btnstr) {
          let found = false;
          $(".mediabutton").each(function () {
            if ($(this).attr("id") === btnstr)
              found = true;
          });

          return found;

        }

        function sAlert(type, text) {
          if (type == "success") {
            $('#info').text(text);
            $('#info').css({ "background-color": "green", "height": "30px", "padding-top": "10px", "color": "white", "text-align": "center", "font-size": "15px" });
            $('#info').delay(3000).fadeOut()
          }
          if (type == "failure") {
            $('#info').text(text);
            $('#info').css({ "background-color": "red", "height": "30px", "padding-top": "10px", "color": "black", "text-align": "center", "font-size": "15px" });
            $('#info').delay(3000).fadeOut()
          }
        }
      })
    });
  }, { "inspector": 2 }], 2: [function (require, module, exports) {

  }, {}]
}, {}, [1]);
