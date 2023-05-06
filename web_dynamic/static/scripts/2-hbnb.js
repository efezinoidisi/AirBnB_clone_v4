$(document).ready(() => {
  const checkedAmenities = {};
  const checkboxes = $('input#amenity_checkbox');
  const filterList = $('div.amenities h4');
  const apiUrl = 'http://0.0.0.0:5001/api/v1/status/';
  const statusBar = $('div#api_status');

  $.get(apiUrl, (response) => {
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
