$(document).ready(() => {
  const checkedAmenities = {};
  const checkboxes = $('input#amenity_checkbox');
  const filterList = $('div.amenities h4');

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
