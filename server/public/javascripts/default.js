$(document).ready(function() {

	/* constants & variables */

	const STATUS_COMPLETE = 'complete';			// indicates complete dataset on server
	const STATUS_INCOMPLETE = 'incomplete';		
	const VERSION = '1.0'; 						// to keep track of changes affecting log file format

	var random_pairs,
		data_object,
		counter,
		pairs_length,
		demands = [
			["md", "Mental demand"],
			["pd", "Physical demand"],
			["td", "Temporal demand"],
			["pe", "Performance"],
			["ef", "Effort"],
			["fr", "Frustration"]
		],
		tableoutput = "",
		no_score = "–",
		weighted_tlx = false,
		total_rounds = 6,
		current_round = 1,
		DEBUG = true,
		settings = {},
		enforce_user_input = true;

	/* functions */

	/* randomly shuffle an array */

	function shuffle(array) {
		var top = array.length,
			tmp, current;

		if(top) {
			while(--top) {
				current = Math.floor(Math.random() * (top + 1));
				tmp = array[current];
				array[current] = array[top];
				array[top] = tmp;
			}
		}

		return array;
	}

	/* create an array of pairs. formula: n! / ( (n - k)! * k! ) */

	function pair_combinator(array) {

		var length = array.length,
			result = [],
			counter = 0,
			i, j;

		for (i = 0; i < length; i++) {
			for (j = i; j < length - 1; j++) {
				result[counter] = shuffle([ [ array[i][0], array[i][1] ], [ array[j + 1][0], array[j + 1][1] ] ]);
				counter++;
			}
		}

		return shuffle(result);

	}

	/* creates an array with a given length and fills it up with a given value */

	function new_filled_array(length, value) {
		var array = new Array(length);
		while (--length >= 0) {
			array[length] = value;
		}
		return array;
	}

	function update_info() {
		// console.log("updating info");
		$(".info").remove();
		$("<ul class='info'><li><strong>Participant:</strong> " + settings['participant_id'] + "</li><li><strong>Group:</strong> " + settings['experiment_group'] + "</li><li><strong>Round:</strong> " + current_round + "</li></ul>").insertAfter("h2");
	}

	function reset_scales() {

		$(".tlx").slider({
			max: 100,
			min: 0,
			step: 5,
			value: 0
		});

		$(".likert").slider({
			max: 7,
			min: 1,
			step: 1,
			value: 1
		});
	}

	function create_data_log(settings, data, status) {

		return {
			'settings': settings,
			'data': data_object,
			'version': VERSION,
			'status': status 
		}
	}

	function log_partial_data(settings, data) {

		data = create_data_log(settings, data, STATUS_INCOMPLETE);

		$.ajax ({
	        type: "POST",
	        url: '/',
	        dataType: 'json',
	        contentType: "application/json",
	        data: JSON.stringify(data),
	        success: function (result,status,xhr) {
	        	console.log("Partial dataset saved!"); 
	        },
	        error: function(xhr,status,error) {
	        	console.log("Error when transmitting partial data!"); 
	        }
	    });

	}

	/* hide future steps */

	$(".step_1, .step_2, .step_3, .step_4, .step_5, .step_6, .step_open_questions, .alert").hide();

	/* initialize sliders */
	reset_scales();

	/* step 0: Experiment SETTINGS */

	$(".step_0 button").live("click", function() {

		if($('#participant_id').val() != '') {
			settings['participant_id'] = $('#participant_id').val();
		} else {
			settings['participant_id'] = 'unspecified';
		}
		// settings['starting_task'] = $("input[name='starting_task']:checked").val();
		settings['experiment_group'] = $("input[name='experiment_group']:checked").val();

		if (enforce_user_input && (settings['participant_id'] == "" || settings['experiment_group'] == null)) {
		     // do something 
		     $(".alert").html('ERROR: some variables have not been set!');
		     $(".alert").show();

		} else {

			$(".step_0").hide();
			$(".alert").hide();
			$(".step_1").show();

		}

		if(DEBUG) {
	     	console.log(settings);
	    }

	});

	/* step 1: Demographics */

	$(".step_1 button").click(function() {

		settings['age'] = $('#age').val();
		settings['gender'] = $("input[name='gender']:checked").val();
		settings['profession'] = $('#profession').val();

		if (enforce_user_input && (settings['age'] == "" || settings['gender'] == null || settings['profession'] == "")) {
		     // do something 
		     $(".alert").html('ERROR: some data has not been provided!');
		     $(".alert").show();

		} else {

		// prepare steps for step 2

		data_object = {
			"button_clicks": {}, 	// tlx weights
			"tlx_value": {},		// tlx raw
			"likert_value": {}		// subjective feedback
		};

		// reset input values and thrown error paragraphs caused by input submits
		$(".step_1 input[type='text']").val("");
		$(".step_1 .cf p").remove();

		// check if proband already completed a task
		var proband_exists = false,
			task_exists = false;

		$(".step_1").hide();
		$(".step_2").show();

		}

		if(DEBUG) {
			console.log(settings);
		}
	});

	// back button: currently not in use
	$(".step_1 .go_back a").click(function() {
		$(".step_1 .cf p").remove();
		$(".step_1").hide();
		$(".step_0").show();
		return false;
	});

	/* step 2: NASA TLX */

	$(".step_2 button").live("click", function() {
		$(".alert").hide();

		// save tlx values
		
		data_object["tlx_value"][current_round] = [];

		$(".tlx").each(function(i) {
			data_object["tlx_value"][current_round][i] = $(this).slider("option", "value");
		});

		if(DEBUG) {
			console.log(data_object);
		}

		// prepare stuff for step 3

		counter = 0;
		random_pairs = pair_combinator(demands);
		pairs_length = random_pairs.length;

		$(".step_2").hide();

		if(weighted_tlx) {

			$(".step_3").show();

			// start button for pairs
			if ( $(".step_3").find("div").length ) {
				$(".step_3 div").html("<button>Start</button>");
			} else {
				$(".step_3").append("<div><button>Start</button></div>");
			}

			// remove/reset "to go" counter
			$(".step_3 .to_go").remove();

		} else {
			
			$(".step_4").show();

		}

	});

	/* step 3: TLX Weights */

	$(".step_3 button").live("click", function() {
		$(".alert").hide();

		// if a pair button is clicked (start button hasn't got class attribute)
		if( $(this).attr("class") ) {
			pairs_length--;
			counter++;

			// initalize weight object if non-existent

			if (data_object["button_clicks"][current_round] == null) {
				
				data_object["button_clicks"][current_round] = {}; //new_filled_array(demands.length, 0);

				for ( var i = 0; i < demands.length; i++ ) {
					data_object["button_clicks"][current_round][demands[i][0]] = 0;
				}

			}

			for ( var i = 0; i < demands.length; i++ ) {

				if ( $(this).attr("class") === demands[i][0] ) {
					data_object["button_clicks"][current_round][demands[i][0]] += 1;
					break;
				}
			}
		}

		// continue as long as there are reaming pairs to be clicked
		if ( pairs_length ) {
			// show the next pair
			$(this)
				.parent()
				.html("<button class='" + random_pairs[counter][0][0] + "'>" + random_pairs[counter][0][1] + "</button> or " + "<button class='" + random_pairs[counter][1][0] + "'>" + random_pairs[counter][1][1] + "</button>");
			// "to go" counter
			if ( !$(".step_3").find(".to_go").length ) {
				$(".step_3").append("<p class='highlight to_go'></p>");
			}
			$(".step_3 .to_go").html("<strong>" + pairs_length + "</strong> to go!");
		} else {
			

			$(".step_3").hide();
			$(".step_4").show();

		}

	}); // step 3 button

	/* step 4: subjective feedback */

	$(".step_4 button").live("click", function() {
		$(".alert").hide();

		// save likert values

		data_object["likert_value"][current_round] = [];

		$(".likert").each(function(i) {
			data_object["likert_value"][current_round][i] = $(this).slider("option", "value");
		});

		if(DEBUG) {
			console.log(data_object);
		}

		$(".step_4").hide();

		current_round++;
		if(current_round <= total_rounds) {
			
			$(".step_5").show();
			log_partial_data(settings, data_object);

		} else {
			$(".step_open_questions").show();
		}
	});

	/* step 5: NEXT QUESTIONNAIRE */

	$(".step_5 button").live("click", function() {
		$(".alert").hide();
		$(".step_5").hide();
		$(".step_2").show();
		update_info();
		reset_scales();

	}); // step 4 button

	/* step 5: FINAL QUESTIONNAIRE */

	$(".step_open_questions button").live("click", function() {
		$(".alert").hide();
		$(".step_open_questions").hide();
		$(".step_6").show();
		$(window).scrollTop(0);

		// save final questionnaire
		data_object['questionnaire'] = {
			'general_effect': $('#general_effect').val(),
			'effect_task_performance': $('#effect_task_performance').val(),
			'effect_stress_levels': $('#effect_stress_levels').val(),
			'other_task_types': $('#other_task_types').val(),
			'body_location': $('#body_location').val(),
			'likes': $('#likes').val(),
			'dislikes': $('#dislikes').val(),
			'comments': $('#comments').val(),
		};

		server_data = create_data_log(settings, data_object, STATUS_COMPLETE);

		if(DEBUG) {
	  		console.log('Sending data to server:');
	     	console.log(server_data);
		}

		// send final dataset to server
		$.ajax ({
	        type: "POST",
	        url: '/',
	        dataType: 'json',
	        contentType: "application/json",
	        data: JSON.stringify(server_data),
	        success: function (result,status,xhr) {
	        	console.log(status);
	        	console.log(result);
	        	if(result.status == 'ok') {
	        		$(".alert").html('<h4>Success:</h4><p>Your data has been saved.</p>');
	     			$(".alert").show();
	        	} else {
	        		$(".alert").html('<h3>There seems to be a problem with the log server!</h3><p>Please manually save the following data objects:</p><h4>Settings:</h4><p>' + JSON.stringify(settings) + '</p><h4>Data</h4>' + JSON.stringify(data_object) + '</p>');
	     			$(".alert").show();
	        	}
	        },
	        error: function(xhr,status,error) {
	        	console.log("Error when transmitting data!"); 
	        	console.log(status);
	        	console.log(error);
	        	$(".alert").html('<h3>There seems to be a problem with the log server!</h3><p>Please manually save the following data objects:</p><h4>Settings:</h4><p>' + JSON.stringify(settings) + '</p><h4>Data</h4>' + JSON.stringify(data_object) + '</p>');
	     		$(".alert").show();
	        }
	    });
	});

});