// global variable to hold the data objects for each rss feed item
var rssReliefWeb = [];

function getReliefWeb(){
  //  https://developers.google.com/feed/v1/jsondevguide#request_format
  $.ajax({
    url : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' +
    encodeURIComponent("http://reliefweb.int/maps/rss.xml") + "&output=xml",
    dataType : 'json',
    success : function (response){
      parseReliefWeb(response);
    }
  });
}

function parseReliefWeb(response){

  // parse the string into an xml document
  //  http://api.jquery.com/jquery.parsexml/
  var xmlDoc = $.parseXML(response.responseData.xmlString);

  // find all <item>...</item>
  $(xmlDoc).find("item").each(function(){
    // console.log(this);

    var thisTitle = $(this).find("title").text();
    // some <item> have both <title> and <dc:title>
    // the above grabs both and concatenates
    // this isn't good since the content of both tags is the same

    var thisUrl = $(this).find("guid").text();

    // the actual tag in the xml is <reliefweb:iso3>
    // some <item> have multiple iso3 tags
    // concatenated into something like "ginlbrsle" isn't helpful
    // so we'll make an array instead
    var thisIso3 = [];
    $(this).find("iso3").each(function(){
      thisIso3.push($(this).text());
    });
    // console.log(thisIso3);

    // push an object with the data we want into an array
    rssReliefWeb.push({
      "title": thisTitle,
      "url": thisUrl,
      "iso3": thisIso3
    });
    
  });
}


// initiate function chain
getReliefWeb();
