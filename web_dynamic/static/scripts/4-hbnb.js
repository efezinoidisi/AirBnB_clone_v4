$(document).ready(() => {
  const checkedAmenities = {};
  const checkboxes = $('input#amenity_checkbox');
  const filterList = $('div.amenities h4');
  const statusUrl = 'http://0.0.0.0:5001/api/v1/status/';
  const statusBar = $('div#api_status');
  const placeSearchUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
  const searchBtn = $('section button');
  const filterKeys = {};

  searchBtn.on('click', () => {
    let amenityIds = [];
    $.each(checkedAmenities, (amenityName, amenityId) => {
      amenityIds.push(amenityId)
    });
    filterKeys['amenities'] = amenityIds;
    $('section.places').html('');
    requestPlaces();
  });

  function requestPlaces() {
    $.ajax({
      url: placeSearchUrl,
      type: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(filterKeys),
      success: (places) => {
        $.each(places, (index, place) => {
          $('section.places').append(`<article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${place.max_guest} Guest(s)</div>
              <div class="number_rooms">${place.number_rooms} Bedroom(s)</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>
            </div>
            <div class="user">
            <div class="description">
              ${place.description}
            </div>
          </article>`);
        });
      },
      error: (err) => {
        console.log("Failed Request:", err);
      }
    });
  }
  requestPlaces();

  $.get(statusUrl, (response) => {
    if (response.status === "OK") {
      statusBar.addClass('available');
    } else {
      statusBar.removeClass('available');
    }
  });

  $.each(checkboxes, (index, checkbox) => {
    $(checkbox).on('change', () => {
      if ($(checkbox).is(':checked')) {
        checkedAmenities[$(checkbox).data('name')] = $(checkbox).data('id');
      } else {
        delete checkedAmenities[$(checkbox).data('name')];
      }
      filterList.text("");
      let numItems = 0;
      $.each(checkedAmenities, (key, value) => {
        if (numItems > 0) {
          filterList.append(', ');
        }
        filterList.append(key);
        numItems++;
      });
    });
  });
});
