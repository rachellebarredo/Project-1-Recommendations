$(document).ready(function () {
  returnStoredSearch(); // getting the last seach item

  // initiating upon clicking on the search
  $("#searchB").on("click", function (event) {
    event.preventDefault();
    var userOption = $("#UserSearch").val();
    tasteDiveAPI(userOption);
  });
  //call wiki api upon clicking on the suggestion card
  $("button").on("click", ".suggcard ", function (event) {
    event.preventDefault();
    debugger;
    emptyWikitext();
    var recommenText = $(this).attr("data-id");
    wikiAPI(recommenText);
  });

  //Taste dive api
  function tasteDiveAPI(userOption) {
    var divQueryURL =
      "https://tastedive.com/api/similar?info=1&origin=*&q=" +
      userOption +
      "&k=385709-project1-WLBPHP8D&callback=?";

    localStorage.setItem("lastSearch", JSON.stringify(userOption));

    $.getJSON(divQueryURL).then(function (response) {
      //API tasteDive
      console.log(response);
      for (var i = 0; i < response.Similar.Results.length; i++) {
        debugger;
        //looping at the recommendations and add on the cards
        var typeID = "#Sug" + i;
        var SuggText = "#Suggestion" + i;
        var buttonCard = "#cardbutton" + i;
        $(typeID).text(response.Similar.Results[i].Type);
        $(SuggText).text(response.Similar.Results[i].Name);
        $(SuggText).attr("data-id", response.Similar.Results[i].Name);
      }
      $("#bestmatches").text('Best Matches for "' + userOption + '"');
    });
  }

  //passing recommandations to the wiki api;
  function wikiAPI(suggestion) {
    wikiAPIURL =
      "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&origin=*&exlimit=1&titles=" +
      suggestion +
      "&explaintext=1&format=json";

    localStorage.setItem("lastSuggestion", JSON.stringify(suggestion));

    $.ajax({
      url: wikiAPIURL,
      method: "GET",
      statusCode: {
        404: function () {
          $("#wikiText").text(
            "No wiki information found for  '" + suggestion + "'. Try again"
          );
        },
      },
    }).then(function (response) {
      var pageNumber = Object.keys(response.query.pages);
      $("#wikiHeaderText").text('More about "' + suggestion + '"');
      $("#wikiText").text(response.query.pages[pageNumber].extract);
    });
  }

  function returnStoredSearch() {
    //get the last search from the local storage
    var storedSearch = JSON.parse(localStorage.getItem("lastSearch"));
    if (storedSearch !== null) {
      tasteDiveAPI(storedSearch);
    }
    var storedSuggestion = JSON.parse(localStorage.getItem("lastSuggestion"));
    if (storedSuggestion !== null) {
      wikiAPI(storedSuggestion);
    }
  }
});

function emptyWikitext() {
  $("#wikiText").empty();
  $("#wikiHeaderText").empty();
}
