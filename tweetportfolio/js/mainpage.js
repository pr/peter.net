/**********************/
/* created by Fujunku Chen ***/
/****** 12-06-2017   *******/
/***********************/

$(document).ready(function(){
	/* datepicker */
	console.log("ready!");
    $('#datepicker').datepicker({
            uiLibrary: 'bootstrap4',
            iconsLibrary: 'fontawesome'
    });		
	$('#datepicker2').datepicker({
            uiLibrary: 'bootstrap4',
            iconsLibrary: 'fontawesome'
    });	
	
	
});


 $(document).ready(function () {
	 loading_search();

	 // Setting up tweet ordering filter
	 $('#filter_twitter .btn_filter').on('click',function() {
		  	$('#filter_twitter .btn_filter').toggleClass('btn_active');
		  	loading_search();
			filteredSearch();
	 });
	/*
	 $('#filter_time .btn_filter').on('click',function(){
		  	$('#filter_time .btn_filter').toggleClass('btn_active');

	 });
	 */
	$(document).on('click','.btn_self', function(){
		$(this).addClass('btn_active');
	});
	 
	 // Setting up tweet type filter
	 $('#filter_type .btn_filter').on('click',function(){
			//$('#filter_type .btn_filter').toggleClass('btn_active');  
		 
			$('#filter_type').children().removeClass('btn_active');
		 	$(this).addClass('btn_active');
			loading_search();
			filteredSearch();
	 });

             });


$(document).on('click','.search_group_btn', function(){
	
	loading_search();
});


function loading_search(){
	
	// Displays loading gif
	document.getElementById("loader").style.display = "block";
	myVar = setTimeout(showPage, 2000);
	
	
}

function showPage() {

	// Hides loading gif
  document.getElementById("loader").style.display = "none";
  $('.btn_self').removeClass('btn_active');
}

// right click on the right sidebar
$(document).ready(function(){
	
	context.init({
    fadeSpeed: 100,
    filter: function ($obj){},
    above: 'auto',
    preventDoubleContext: true,
    compress: false
	});
		
	context.settings({compress: true});
	
});