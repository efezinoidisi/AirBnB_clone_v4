$(document).ready(() => {
	const checkedAmenities = {};
	const states = {};
	const cities = {};
	const stateInput = $('input#state_input');
	const cityInput = $('input#city_input');
	const statesDiv = $('div.locations h4');
	const checkboxes = $('input#amenity_checkbox');
	const filterList = $('div.amenities h4');
	const url = 'http://0.0.0.0:5001/api/v1';
	const statusBar = $('div#api_status');
	const searchBtn = $('section button');
	const filterKeys = {};

	searchBtn.on('click', () => {
		const amenityIds = [];
		const stateIds = [];
		const citiesIds = [];
		addItem(checkedAmenities, amenityIds);
		addItem(states, stateIds);
		addItem(cities, citiesIds);
		filterKeys['amenities'] = amenityIds;
		filterKeys['states'] = stateIds;
		filterKeys['cities'] = citiesIds;
		$('section.places').html('');
		requestPlaces();
	});

	function requestPlaces() {
		$.ajax({
			url: `${url}/places_search/`,
			type: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify(filterKeys),
			success: places => {
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
			error: err => {
				console.log('Failed Request:', err);
			},
		});
	}
	requestPlaces();

	$.get(`${url}/status`, response => {
		if (response.status === 'OK') {
			statusBar.addClass('available');
		} else {
			statusBar.removeClass('available');
		}
	});

	handleFilters(checkboxes, filterList, checkedAmenities);
	handleFilters(stateInput, statesDiv, states);
	handleFilters(cityInput, statesDiv, cities);
});

const handleFilters = (boxes, filterList, dic) => {
	$.each(boxes, (index, checkbox) => {
		$(checkbox).on('change', () => {
			if ($(checkbox).is(':checked')) {
				dic[$(checkbox).data('name')] = $(checkbox).data('id');
			} else {
				delete dic[$(checkbox).data('name')];
			}
			filterList.text('');
			let numItems = 0;
			$.each(dic, (key, value) => {
				if (numItems > 0) {
					filterList.append(', ');
				}
				filterList.append(key);
				numItems++;
			});
		});
	});
};

const addItem = (dic, itemList) => {
	$.each(dic, (amenityName, amenityId) => {
		itemList.push(amenityId);
	});
};
