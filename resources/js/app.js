
  $(document).ready(function() {
    //Check to see if the window is top if not then display button
      $(window).scroll(function(){
          if ($(this).scrollTop() > 100) {
              $('.scrollToTop').fadeIn();
          } else {
              $('.scrollToTop').fadeOut();
          }
      });
  
      //Click event to scroll to top
      $('.scrollToTop').click(function(){
          $('html, body').animate({scrollTop : 0},800);
          return false;
      });
  
      //Populate Countries and city
      var url = "https://api.openaq.org/v1/countries";
      $.getJSON(url, function(data) {
        var respJSON = JSON.stringify(data);
        var obj = jQuery.parseJSON(respJSON);
        var countyCount = obj.results.length;
        //Creating drop down for countries
        for(var i = 0; i<countyCount; i++){
          $('#dropdownCountries').append($('<option>', {
              value: obj.results[i].code,
              text: obj.results[i].name
          }));
        }
      });
  
      //Creating drop down for cities upon selecting the country
      $("select[id='dropdownCountries']").change(function() {
          //Clear existing table and totalLocations
          $("#tableLocationsBody").empty();
          $("#divLocations h3").text('');
          //Clear Dropdown
          $('#dropdownCities').empty();
          var selectedCountry = $(this).val();
          //Get respective Cities from the selected country
          var url = "https://api.openaq.org/v1/cities?country=" + selectedCountry + "&limit=10000";
          $.getJSON(url, function(data) {
            var respJSON = JSON.stringify(data);
            var obj = jQuery.parseJSON(respJSON);
            //Get Cities and Append to dropdown
            for (var j=0; j<obj.results.length; j++){
              $('#dropdownCities').append($('<option>', {
                  value: obj.results[j].city,
                  text: obj.results[j].city
              }));
            }
          });
      });
      //End Populate Countries and City
      $('[data-toggle="tooltip"]').tooltip();
          //Button Submit click
      $("#getAirQuality").on("click", function() {
          //Show the spinner
          $('#spinner').show();
          //Clear the existing table content
          $("#tableLocationsBody").empty();
  
          //Get Location from the user
          var txtCity = $("#dropdownCities").val();
          if (jQuery.trim(txtCity).length > 0) {
            var url = "https://api.openaq.org/v1/latest?city=" + txtCity + "&limit=10000";
          }
          if (txtCity == "SelectCity" || $('#dropdownCities').has('option').length <= 0){
            alert("Please select country/city.");
            $('#spinner').hide();
            $('divLocations h3').text();
            return false;
          }
          var txtCountry = $("#dropdownCountries").val();
          if (jQuery.trim(txtCountry).length > 0) {
            var url = "https://api.openaq.org/v1/latest?city=" + txtCity + "&country=" + txtCountry + "&limit=10000";
          }
  
          $.getJSON(url, function(data) {
            try {
                          var respJSON = JSON.stringify(data);
                          var obj = jQuery.parseJSON(respJSON);
                          //Get Found value
                          var totalLocations = obj.meta.found;
                          $("#divLocations").html("<h3 class=\"text-primary\">" + "Total " + totalLocations + " location(s) found in your city.");
  
                          if (totalLocations > 0){
                           //Adding header text
                           $("#headerLocation").text("Location");
                           $("#headerParameter").text("Parameter");
                           $("#headerValue").text("Value");
                           $("#headerUnit").text("Unit");
                           $("#headerLastUpdated").text("Last Updated");
                           $("#headerCoordinates").text("Coordinates");
                          //Get Latitude and Longitude
                          /*  var lat = obj.results[0].coordinates.latitude;
                          var lng = obj.results[0].coordinates.longitude;
                          console.log(lat + lng);
                          //Display maps
                          var myLatlng = new google.maps.LatLng(lat,lng);
                           var myOptions = {
                               zoom: 10,
                               center: myLatlng,
                               mapTypeId: google.maps.MapTypeId.ROADMAP
                               }
                            map = new google.maps.Map(document.getElementById("map"), myOptions);
                            var marker = new google.maps.Marker({
                                position: myLatlng,
                                map: map,
                            title:"Fast marker"
                           });
                           google.maps.event.addDomListener(window,'load', initialize); */
                           //console.log(obj.results[0].measurements.length);
                           //Display Each Locations
                               for(var t=0;t<totalLocations;t++){
                                 for(var u=0;u<obj.results[t].measurements.length;u++){
                                    var measurementValue = obj.results[t].measurements[u].value;
                                    var measurementParameter = obj.results[t].measurements[u].parameter;
                                    var measurementLastUpdated = obj.results[t].measurements[u].lastUpdated;
                                    var measurementUnit = obj.results[t].measurements[u].unit;
                                    var eachLocation = obj.results[t].location;
                                    var eachCoordinatesLat = obj.results[t].coordinates.latitude;
                                    var eachCoordinatesLong = obj.results[t].coordinates.longitude;
  
                                    var trLocation = "<tr><td data-toggle=\"tooltip\" title=\"Location\">" + eachLocation + "</td><td data-toggle=\"tooltip\" title=\"Parameter\">" + measurementParameter + "</td><td data-toggle=\"tooltip\" title=\"Value\">" + measurementValue + "</td><td data-toggle=\"tooltip\" title=\"Unit\">"+ measurementUnit + "</td><td data-toggle=\"tooltip\" title=\"Last Updated\">"+ measurementLastUpdated + "</td><td data-toggle=\"tooltip\" title=\"Coordinates\">" + eachCoordinatesLat + "; " +eachCoordinatesLong +"</td></tr>";
                                    $("#tableLocations").append(trLocation);
                                                                                      }
                                                                  }
                                    $('#spinner').hide();
                                    //$('#tableLocations').paging({limit:9});
                                    //$('#tableLocations').DataTable();
                                    }
                                else{
                                   $("#tableLocationsBody").empty();
                                   $('#img').hide();
                                    }
                                  }
                                  catch (e){
                                    $('#spinner').hide();
                                    var warningMessage = "<p class=\"text-danger\">Details are not available at this moment. Please try again later.</p>";
                                    $('#divLocations h3').html(warningMessage);
                                    $("#tableLocationsBody").empty();
                                    $('#img').hide();
                                    console.log(e);
                                    return false;
                                  }
                });
          });
    });