const url = 'http://0.0.0.0:5001/api/v1';

$(document).ready(() => {
	const checkedAmenities = {};
	const states = {};
	const cities = {};
	const stateInput = $('input#state_input');
	const cityInput = $('input#city_input');
	const statesDiv = $('div.locations h4');
	const checkboxes = $('input#amenity_checkbox');
	const filterList = $('div.amenities h4');

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
			<div class=reviews>
				<h2>Reviews <span id="${place.id}" onclick="fetchReviews(this)">show</span></h2> 
				<ul id="${place.id}ul"></ul>
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

const fetchReviews = item => {
	const span = $(`div.reviews span#${item.id}`);
	const ul = $(`div.reviews #${item.id}ul`);
	if (item.textContent === 'show') {
		$.get(`${url}/places/${item.id}/reviews`, (data, status) => {
			if (status === 'success') {
				span.text('hide');
				handleReviews(data, ul);
			}
		});
	} else {
		span.text('show');
		ul.empty();
	}
};

const handleReviews = (reviews, ul) => {
	$.each(reviews, (index, review) => {
		$.get(`${url}/users/${review?.user_id}/`, (user, status) => {
			if (status === 'success') {
				const date = new Date(review.created_at);
				const [month, day, year] = date
					.toLocaleDateString('en', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})
					.split(' ');
				ul.append(`<li>
					<h3>From ${user?.first_name} ${user?.last_name} the ${
					day.replace(',', '') + getOrdinal(day.replace(',', ''))
				} ${month} ${year}</h3>
					<p>${review.text}</p>
					</li>`);
			}
		});
	});
};

const getOrdinal = day => {
	const lastDigit = parseInt(day) % 10;
	let value;
	if ( lastDigit=== 1) {
		value = 'st';
	} else if (lastDigit === 2) {
		value = 'nd';
	} else if (lastDigit === 3) {
		value = 'rd';
	} else {
		value = 'th';
	}
	return value;
};
