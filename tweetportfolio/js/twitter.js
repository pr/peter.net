var cb = new Codebird;
cb.setConsumerKey("s75bp2rPR15pzp8wQFIuul24U", "aYaHZQBCvDXD3kx9svd5WGLKLUuRPqyvuKckGY0iAZ9SgnYSFF");

var oauth_token = localStorage.getItem("oauth_token");
var oauth_token_secret = localStorage.getItem("oauth_token_secret");
var last_search = localStorage.getItem("last_search");


function getParameterByName(name, url) {
    // Parses url and gets the query parameter
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var url_query = getParameterByName('q');
console.log(url_query);

var feed_vue = new Vue({
        el: '#feed', 
        data: {
          tweets: []
        }
    });




function readyUp() {
    /* Populates the search box with either the query from the previous page,
    or the last search from the user, and authenticates codebird */

    if (url_query) {
        $('#search_box').val(url_query);
    }
    else if (!last_search) {
        $('#search_box').val('animals');
    }
    else {
        $('#search_box').val(last_search);
    }

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

function getActualTweetID(status) {
    if (status.retweeted_status) {
        return status.retweeted_status.id_str;
    }
    return status.id_str;
}

function filteredSearch() {
    //Gets the current selected filters, searches twitter, and updates the feed with new tweets
    
    // e.g. mixed, popular, or recent
    var result_type = '';
    $('#filter_twitter .btn_active').each(function(){
        result_type = $(this).val(); 
    });

    // e.g. text, all, images
    var tweet_type = '';
    $('#filter_type .btn_active').each(function(){
        tweet_type = $(this).val(); 
    });
    
    // Save this search for future reference
    localStorage.setItem("last_search", $('#search_box').val());
    params = {q: $('#search_box').val(), count: 100, result_type: result_type};

    if (tweet_type === 'text') {
        params.include_entities = false;
    }
    cb.__call(
        "search_tweets",
        params,
        function (response) {var statuses = response.statuses;

            var temp_tweets = [];

            // Go through each tweet and parse relevant data
            for (var i = 0; i < statuses.length; i++){
                var status = statuses[i];
                var image;
                var url = 'https://twitter.com/statuses/' + status.id_str;

                //console.log(status);
                if (tweet_type === 'text') {
                    image = null
                }
                else {
                    image = (status.entities.media) ? status.entities.media[0].media_url : null;
                }
                if (tweet_type === 'image' && !image) {
                    continue;
                }
                var tweetID = getActualTweetID(status);
                temp_tweets.push({displayName: status.user.name, text: status.text, img:status.user.profile_image_url, id: tweetID, media: image, time: moment(status.created_at).fromNow(), url: url, alt_time: status.created_at});
            }
            feed_vue.tweets = temp_tweets;
            console.log(temp_tweets);


        }, true);

    // Scroll window back up to the top
    window.scrollBy(0, -50000000);
    
}

readyUp();
filteredSearch();