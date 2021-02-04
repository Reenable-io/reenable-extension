const { url } = require("inspector");

$(document).ready(function() {

$(document).ready(function() {
let storage = chrome.storage.local;
var slider = document.getElementById("priceslider");
var output = document.getElementById("demo");
var mediabutton=$(".mediabutton");
//var resetbtn=$("#resetbtn");
var addcustom=$("#addcustom");
var customurldiv=$("#customurldiv"); 
var customurlinput=$("customurlinput");
var customurladdbtn=$("#customurladdbtn");
var showblocklist=$("#showblocklist");
var unblockboard=$("#unblockboard");
var dashboard=$("#dashboard");
var unblockboardhead=$("#unblockboardhead");


var addbtn=$("#addbtn");
var urls=[];
var dburllist=[];
var myRange=1;

output.innerHTML = slider.value;

mediabutton.on('dragstart', function(event) { event.preventDefault(); });

slider.oninput = function() {
  output.innerHTML = this.value;
  myRange=this.value;
  if (this.value >= 100){

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
   
  })*/

/*resetbtn.click(function()
{
  mediabutton.each(function(index)
{
    $(this).prop('disabled', false);
})
customurlinput.val("");
location.reload();
});*/

mediabutton.click(function() {
  mediabutton.removeClass("lowopacity");
  $(this).addClass("lowopacity");
});

addcustom.click(function()
{
  customurldiv.prop('hidden', false);
  addcustom.prop('hidden', true);
});

customurladdbtn.click(function()
{
  var input = $(input[id="customurlinput"])
  $( "#mediabuttondiv" ).append( '<button class="mediabutton" id="'+input+'" data-url="'+input+'" disabled>'+input+'</button>');
});

addbtn.click(function()
{
  $(".mediabutton").each(function()
  {
    if($(this).prop('disabled'))
    urls.push($(this).attr("data-url"));
  })

  let till=$("#blockuntill").val();
  let from=$("#timefrom").val();
  let to=$("#timeto").val();
  let price=myRange;

 let urllist=[];
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
    showInfo("success","Successfully stored");
    setTimeout(() => {
       location.reload();
      }, 3000); 
    });
  }
});

showblocklist.click(function()
{
  $( "#unblockboarddiv" ).empty();
  chrome.runtime.sendMessage({job: "getBlockInfoFromDb"}, function(response) {
    console.log(response.message.data);
    data=response.message.data;
    showInfo("success","Successfully Block list received."); 
    for(let i=0;i<data.length;i++)
    {
     $( "#unblockboarddiv" ).append( '<button class="blockedmediabutton" id="'+data[i].url.split(".")[1]+
     "blocked"+'" data-url="'+data[i].url+'" data-till="'+data[i].till+'" data-to="'+data[i].to+'" data-from="'+data[i].from+
     '"data-amount="'+data[i].amount+'"data-date="'+data[i].date+'"data-trackId="'+data[i].trackId+
     '">'+data[i].url.split(".")[1]+'</button>');
    }
    });

    setTimeout(function()
    {
      $(".blockedmediabutton").each(function(index)
      {
        $(this).on("click", function(){
          $("#btnunblock").html("Unblock for "+$(this).attr("data-amount")+" USD now");
          $("#btnunblock").attr("data-trackid",$(this).attr("data-trackId"));
          $("#blockeduntillspan").html("Block untill: "+$(this).attr("data-till"));
          $("#untillprogress").attr("max",new Date($(this).attr("data-till")).getTime());
          const date1 =new Date($(this).attr("data-till")).getTime();
          const date2 = new Date($(this).attr("data-date")).getTime();
          const diffTime = Math.abs(new Date("2020-20-19").getTime() - date1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          console.log(diffDays);
          $("#untillprogress").attr("max", Math.ceil((Math.abs(date2))/ (1000 * 60 * 60 * 24)));
          $("#untillprogress").attr("value",diffDays);
      })
      })
    },1000)
  unblockboard.prop('hidden', false);
  dashboard.prop('hidden', true);
});
$("#btnunblock").click(function()
{
  window.open("https://websiteblockbypayment.herokuapp.com/"+$(this).attr("data-trackId"), "_blank");
});
function hasdublicatebutton(btnstr)
{
  let found=false;
  $(".mediabutton").each(function()
  {
    if($(this).attr("id")===btnstr)
    found=true;
  });
  
  return found;

}

function showInfo(type,text)
{
  if(type=="success")
  {
    $('#info').text(text);
    $('#info').css({"background-color": "green","height":"30px","padding-top":"10px","color":"white","text-align":"center","font-size":"15px"});
    $('#info').delay(3000).fadeOut();
  }
  if(type=="falure")
  {
    $('#info').text(text);
    $('#info').css({"background-color": "red","height":"30px","padding-top":"10px","color":"black","text-align":"center","font-size":"15px"});
    $('#info').delay(3000).fadeOut();
  }
}
})
});