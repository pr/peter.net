//https://bootsnipp.com/snippets/featured/full-screen-search

// Adding event listeners to relevant pages
$(function () {
    $('a[href="#search"]').on('click', function(event) {
        event.preventDefault();
        $('#search').addClass('open');
        $('#search > form > input[type="search"]').focus();
    });
    
    $('#search, #search button.close').on('click keyup', function(event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
        }
    });
	
});

// Setting up codebird
var cb = new Codebird;
cb.setConsumerKey("s75bp2rPR15pzp8wQFIuul24U", "aYaHZQBCvDXD3kx9svd5WGLKLUuRPqyvuKckGY0iAZ9SgnYSFF");
var oauth_token = localStorage.getItem("oauth_token");
var oauth_token_secret = localStorage.getItem("oauth_token_secret");

// Trends vue object
var trending_vue = new Vue({
        el: '#trending', 
        data: {
          trends: [],
		  trends2: [],
		  trends3: [],
		  trends4: [],
		  trends5: [],
		  trends6: [],
		  trends7: []
        }
    });




function readyUp() {
    if (oauth_token && oauth_token_secret) {
          cb.setToken(oauth_token, oauth_token_secret);
          console.log('cached');
    } else {
        // gets a request token
        cb.__call(
            "oauth_requestToken",
            {oauth_callback: "oob"},
            function (reply,rate,err) {
                if (err) {
                    console.log("error response or timeout exceeded" + err.error);
                }
                if (reply) {
                    console.log(reply);
                    
                    // stores it in local memory
                    cb.setToken(reply.oauth_token, reply.oauth_token_secret);
                    localStorage.setItem("oauth_token", reply.oauth_token);
                    localStorage.setItem("oauth_token_secret", reply.oauth_token_secret);

                    // gets the authorize screen URL
                    // cb.__call(
                    //     "oauth_authorize",
                    //     {},
                    //     function (auth_url) {
                    //         console.log(auth_url)
                    //         window.codebird_auth = window.open(auth_url);
                    //     }
                    // );

                }
            }
        );
    }
    
}

var counter = 0;


function getTrends() {
    // Gets the global trending topics and puts them in the correct place
    params = {id: 1}
    cb.__call(
        "trends_place",
        params,
        function (response) {
									
            var trending_topics = [];
            for (var i = 0; i < 1; i++) {
                var trend = response[0].trends[i];
                if (trend.name.charAt(0) === "#") {
                    trend.url = trend.name.substr(1);
                }
                else {
                    trend.url = trend.name;
                }
                var trend_url = './mainpage.html?q=' + trend.url;
                
				trending_topics.push({name: trend.name, url: encodeURI(trend_url)});
            }
			
			trending_vue.trends = trending_topics;
			
			var trending_topics2 = [];
            for (var i = 1; i < 2; i++) {
                var trend = response[0].trends[i];
                if (trend.name.charAt(0) === "#") {
                    trend.url = trend.name.substr(1);
                }
                else {
                    trend.url = trend.name;
                }
                var trend_url = './mainpage.html?q=' + trend.url;
                
				trending_topics2.push({name: trend.name, url: encodeURI(trend_url)});
            }
			
			trending_vue.trends2 = trending_topics2;
			
			var trending_topics3 = [];
            for (var i = 2; i < 3; i++) {
                var trend = response[0].trends[i];
                if (trend.name.charAt(0) === "#") {
                    trend.url = trend.name.substr(1);
                }
                else {
                    trend.url = trend.name;
                }
                var trend_url = './mainpage.html?q=' + trend.url;
                
				trending_topics3.push({name: trend.name, url: encodeURI(trend_url)});
            }
			
			trending_vue.trends3 = trending_topics3;
			
			var trending_topics4 = [];
            for (var i = 3; i < 4; i++) {
                var trend = response[0].trends[i];
                if (trend.name.charAt(0) === "#") {
                    trend.url = trend.name.substr(1);
                }
                else {
                    trend.url = trend.name;
                }
                var trend_url = './mainpage.html?q=' + trend.url;
                
				trending_topics4.push({name: trend.name, url: encodeURI(trend_url)});
            }
			
			trending_vue.trends4 = trending_topics4;
			
			var trending_topics5 = [];
            for (var i = 4; i < 5; i++) {
                var trend = response[0].trends[i];
                if (trend.name.charAt(0) === "#") {
                    trend.url = trend.name.substr(1);
                }
                else {
                    trend.url = trend.name;
                }
                var trend_url = './mainpage.html?q=' + trend.url;
                
				trending_topics5.push({name: trend.name, url: encodeURI(trend_url)});
            }
			
			trending_vue.trends5 = trending_topics5;
			
			var trending_topics6 = [];
            for (var i = 5; i < 6; i++) {
                var trend = response[0].trends[i];
                if (trend.name.charAt(0) === "#") {
                    trend.url = trend.name.substr(1);
                }
                else {
                    trend.url = trend.name;
                }
                var trend_url = './mainpage.html?q=' + trend.url;
                
				trending_topics6.push({name: trend.name, url: encodeURI(trend_url)});
            }
			
			trending_vue.trends6 = trending_topics6;
			
			var trending_topics7 = [];
            for (var i = 7; i < 8; i++) {
                var trend = response[0].trends[i];
                if (trend.name.charAt(0) === "#") {
                    trend.url = trend.name.substr(1);
                }
                else {
                    trend.url = trend.name;
                }
                var trend_url = './mainpage.html?q=' + trend.url;
                
				trending_topics7.push({name: trend.name, url: encodeURI(trend_url)});
            }
			
			trending_vue.trends7 = trending_topics7;
			
			
						
        }, true);
}

$('#search_form').submit(function(event){
    event.preventDefault();
    window.location.href = encodeURI('./mainpage.html?q=' + $('#search_value').val());
});

readyUp();
getTrends();