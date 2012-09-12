var count = 0;

/* Adds a new row in the list of criteria */
function add_new_criteria(invert, criteria, values)
{
	// Copy the row and set a unique ID on it
	$('#criteria').append(
		$('#model_row').html()
	);
	$('#criteria .row:last').attr('id', 'row_' + count);
	
	// Set unique names to the various inputs
	$('#criteria .row:last .remove input').bind(
		'click',
		function(e) {
			$('#' + $(this).parent().parent().attr('id') ).remove();
		}
	);
	
	// If criteria and invert are passed, set them
	if (invert != null) {
		$('#criteria .row:last .invert select').val(invert);
	}
	if (criteria != null) {
		$('#criteria .row:last .criteria select').val(criteria);
	}
	if (values != null) {
		show_values_div($('#criteria .row:last'), criteria, values);
	}
	
	// Add logic to display the different "values" DIVs based on the criteria
	// selected
	$('#criteria .row:last .criteria select').bind(
		'change',
		function(e) {
			var criteria = $(this).val();
			var container = $(this).parent().parent();
			show_values_div(container, criteria);
		}
	);
	count++;
}

/* Show the UI to select the values for a given criteria */
function show_values_div(container, criteria, values)
{
	var value;
	if (values != null) {
		value = values.split('::');
	} else {
		value = new Array();
	}
	container.find('.values').css('display', 'none');
	
	if ( criteria == 'ip_address' ) {
		container.find('.values_ip_address').css('display', 'block');
		container.find('.values_ip_address input').val(value[0]);
	
	} else if ( criteria == 'date_range' ) {
		container.find('.values_date_range').css('display', 'block');
		var from = container.find('.values_date_range input:first');
		from.val(value[0]);
		from.datepick();
		var to = container.find('.values_date_range input:last');
		to.val(value[1]);
		to.datepick();
	
	} else if ( criteria == 'subject_type' ) {
		container.find('.values_subject_type').css('display', 'block');
		container.find('.values_subject_type input:first').val(value[0]);
		container.find('.values_subject_type input:last').val(value[1]);
	
	} else if ( criteria == 'event' ) {
		container.find('.values_event').css('display', 'block');
		container.find('.values_event input').val(value[0]);
	
	} else if ( criteria == 'account_logged_in' ) {
		container.find('.values_account_logged_in').css('display', 'block');
		container.find('.values_account_logged_in input').val(value[0]);
	
	} else if ( criteria == 'account_affected' ) {
		container.find('.values_account_affected').css('display', 'block');
		container.find('.values_account_affected input').val(value[0]);
	
	} else if ( criteria == 'indexed_data' ) {
		container.find('.values_indexed_data').css('display', 'block');
		container.find('.values_indexed_data input:first').val(value[0]);
		container.find('.values_indexed_data input:last').val(value[1]);
	}
}

/* Makes a URL representing the parameters chosen in the UI */
function submit_search()
{
	var url = '?action=results';
	jQuery.each(
		$('#criteria .row'),
		function() {
			// Find the various values for the search
			var invert = $(this).find('.invert select').val();
			var criteria = $(this).find('.criteria select').val();
			if (criteria == '') return;
			url += '&' + escape(criteria + invert) + '=';
			
			// Find the specific search values
			if ( criteria == 'ip_address' ) {
				var ip_addresses = $(this).find('.values_ip_address input').val();
				url += escape(ip_addresses);
			} else if ( criteria == 'date_range' ) {
				var from = $(this).find('.values_date_range input:first').val();
				var to = $(this).find('.values_date_range input:last').val();
				url += escape(from) + '::' + escape(to);
			} else if ( criteria == 'subject_type' ) {
				var type = $(this).find('.values_subject_type input:first').val();
				var IDs = $(this).find('.values_subject_type input:last').val();
				url += escape(type) + '::' + escape(IDs);
			} else if ( criteria == 'event' ) {
				var event = $(this).find('.values_event input').val();
				url += escape(event);
			} else if ( criteria == 'account_logged_in' ) {
				var account_logged_in = $(this).find('.values_account_logged_in input').val();
				url += escape(account_logged_in);
			} else if ( criteria == 'account_affected' ) {
				var account_affected = $(this).find('.values_account_affected input').val();
				url += escape(account_affected);
			} else if ( criteria == 'indexed_data' ) {
				var type = $(this).find('.values_indexed_data input:first').val();
				var values = $(this).find('.values_indexed_data input:last').val();
				url += escape(type) + '::' + escape(values);
			}
		}
	);
	
	window.location.href = url;
}

/* After loading, populate criteria with input if available */
$(document).ready(
	function()
	{
		// Check for parameters and populate the criteria accordingly
		var rows_added = false;
		var params = window.location.search.substring(1).split('&');
		jQuery.each(
			params,
			function()
			{
				var temp = this.split('=');
				if (temp[0] == '' || temp[0] == 'action') return;
				
				var invert = temp[0].substr(-1);
				var criteria = temp[0].substr(0, temp[0].length-1);
				
				add_new_criteria(invert, criteria, unescape(temp[1]));
				rows_added = true;
			}
		);
		
		// If no row was created, create an empty row
		if (!rows_added) {
			add_new_criteria();
		}
	}
);
