var cb = new Codebird;
cb.setConsumerKey("VCLAOVS6uW1mWcle3APB7essM", "h57Ky46shztmhGUMiZZHdCGZecXGCitQSdqT8Tm9rJOvBwUmfN");
cb.setToken("938214222042943488-c2o6HMZVO2S9FRZywviN0Zr74g7cTMC", "rmIgtkJ1304JaJlaa2v4xkgpb7KPjH4wHoI7auERWUDi8");

var tweet_vue = new Vue({
        el: '#modal_tweet', 
        data: {
          tweets: []
        }
    });

$(document).ready(function(){
    //show the collections
    cb.__call(
        "collections_list",
        {
            user_id: '938214222042943488'
        },
        function (reply, rate, err) {
            for (var i = 0; i < reply.response.results.length; i ++) {
                var timeline_id = reply.response.results[i].timeline_id;
                var each_collection = reply.objects.timelines[timeline_id];
                var subpage = "pageSubmenu" + i;
                
                each_collection["page"] = "#pageSubmenu" + i;
                each_collection["subpage"] = "pageSubmenu" + i;
                each_collection["collection_id"] = timeline_id;
                var collections = ich.favorites(each_collection);
                $("#favorites").append(collections);
                $("#folder_name").append("<option value ="+ timeline_id +">"+each_collection.name+"</option>"); 

                addtweets(timeline_id, subpage);               
            }
                
        }
    );

    //delete one collection
    $(document).on("click", ".delete_icon_col", function(){  
        var collection_id = $(this).closest('li').attr('id');
        //console.log(collection_id);
        cb.__call(
            "collections_destroy",
            {
                id : collection_id
            },
            function(reply, rate, err) {
                $("#" + collection_id).remove();
                $("select#folder_name option").filter("[value="+collection_id+"]").remove();
            }
        );
    });

    //delete one tweet in collection
    $(document).on("click", ".delete_icon_cont", function(){       
        $('#modal_tweet').modal('hide');
        var tweet = $(this).closest("li");
        var tweet_id = tweet.attr('id');
        var collection_id = tweet.parents("li")[0].attributes.id.nodeValue; 
        cb.__call(
            "collections_entries_curate",
            {
                "id" : collection_id,
                "changes": [
                    { 
                        "op": "remove",
                        "tweet_id": tweet_id
                    }
                ]
            },
            function(reply, rate, err) {
                $("#" + tweet_id).remove();
            }
        );
    });

    //add the tweet to a specific collection
    $(document).on("click", "#add_to_list", function(){
        addToList();
    });

    //create a new collection
    $(document).on("click", "#create_list", function(){
        createList();
    });

    //use the modal to pass tweet_id value
    $('#Modal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var text = button.data('whatever');
        //console.log(text);
        $('#tweet_id_span').text(text);
    }) 

    //return shortcut for adding a tweet to a collection
    $(document).on('keyup',function(e){
        if(e.keyCode === 13){
            //console.log($('#createList')[0].style.display);
            if($('#Modal')[0].style.display=="block") {
                addToList();
                $("#Modal").modal('hide');
            }
        }
    });

    //return shortcut for creating a new collection
    $("#new_collection_name").keydown(function(e) {
        if (e.which == "13") {
            //alert('12');
            e.preventDefault();
            createList();
        }
    });

    //show detailed information of the tweet in the collection
    $(document).on('click', '.favorite_list', function(e){
        $("#modal_tweet").modal('show');
        var tweet_id = $(this).closest("li").attr('id');
        cb.__call(
            "statuses_show_ID",
            {
                id : tweet_id
            },
            function(reply, rate, err) {
                var temp_tweet = [];
                var image = (reply.entities.media) ? reply.entities.media[0].media_url : null;
                var url = 'https://twitter.com/statuses/' + reply.id_str;
                temp_tweet.push({name: reply.user.name, text: reply.text, img:reply.user.profile_image_url, media: image, time: moment(reply.created_at).fromNow(), url: url});
                tweet_vue.tweets = temp_tweet;
            }
        );
    });

});

function addToList() {
    var select = $("#folder_name option:selected");
    var collection = select.val();
    var tweet = $('#tweet_id_span').text();
    cb.__call(
        "collections_entries_curate",
        {
            "id": collection,
            "changes" : [
                {
                    "op": "add",
                    "tweet_id": tweet
                }
            ]
        },
        function(reply, rate, err) {
            if (reply.response.errors[0]) {
                //alert error message
                alert(reply.response.errors[0].reason);

            } else {
                cb.__call(
                    "statuses_show_ID",
                    {
                        id : tweet
                    },
                    function(reply2, rate, err) {
                        var parent = $("#"+collection).children('ul')[0];
                        var img_src = reply2.user.profile_image_url;
                        var name = reply2.user.name;
                        var text = reply2.text;
                        addtweet(parent, tweet, img_src, name, text);
                    }
                );
            }
            
        }
    );

}

function createList() {
    var collection_name = $("#new_collection_name").val();
    //alert(collection_name);
    cb.__call(
        "collections_create",
        {
            name: collection_name
        },
        function(reply, rate, err) {
            var each_collection = reply.response;
            var index = $("#favorites").children("li").length;
            each_collection["page"] = "#pageSubmenu" + index;
            each_collection["subpage"] = "pageSubmenu" + index;
            each_collection["collection_id"] = reply.response.timeline_id;
            each_collection["name"] = collection_name;
            var collections = ich.favorites(each_collection);
            $("#favorites").append(collections);
            $("#folder_name").append("<option value ="+ reply.response.timeline_id +">"+each_collection.name+"</option>"); 
            //alert('success');
        }
    );
    $("#createList").modal('hide');
}

function addtweets(timeline_id, subpage) {
    cb.__call(
    "collections_entries",
    {
        id: timeline_id
    },
    function (reply2, rate, err) {
        //console.log(timeline_id);
        var parent = document.getElementById(subpage);
        for (var i = 0; i < reply2.response.timeline.length; i ++) {
            var tweet_id = reply2.response.timeline[i].tweet.id;
            var each_tweet = reply2.objects.tweets[tweet_id];
            var user_id = each_tweet.user.id_str;
            //console.log(user_id);
            //console.log(user_id);
            var img_src = reply2.objects.users[user_id].profile_image_url;
            var name = reply2.objects.users[user_id].name;
            var text = reply2.objects.tweets[tweet_id].text;
            addtweet(parent, tweet_id, img_src, name, text);
            //console.log('writ');
         }
        }    
    );

}


function addtweet(parent, tweet_id, img_src, name, text) {
    //add tweet to the folder panel
    var a = document.createElement('a');
    var li = document.createElement('li');
    li.className = 'favorite_list';
    li.id = tweet_id;
    var div1 = document.createElement('div');
    div1.className = 'row';
    var div2 = document.createElement('div');
    div2.className = 'col-2';
    var img = document.createElement('img');
    img.src = img_src;
    var div3 = document.createElement('div');
    div3.className = 'favorite_item_cont col-10';
    var span1 = document.createElement('span');
    span1.innerHTML = name;
    var span2 = document.createElement('span');
    span2.className = 'item_content';
    span2.innerHTML = text;
    var br=document.createElement('br'); 
	

	var div_delete =document.createElement('div');
	div_delete.className='delete_icon_cont';
	var span_delete1 = document.createElement('span');
	var span_delete2 = document.createElement('span');
	span_delete1.className = 'btn btn-danger btn-sm delete_icon';
	span_delete2.className = 'glyphicon glyphicon-trash';
	
	div_delete.appendChild(span_delete1);
	span_delete1.appendChild(span_delete2);
	div_delete.style.display = 'none';
	
    span1.appendChild(br);
    li.appendChild(a);
    a.appendChild(div1);
    div1.appendChild(div2);
    div1.appendChild(div3);
    div2.appendChild(img);
    div3.appendChild(span1);
    div3.appendChild(span2);
	a.appendChild(div_delete);
    parent.appendChild(li);
}

//hide delete buttons when unnecessary
var Is_edit_btn =true;
function editFavorite()
{
	var div1 = $('.delete_icon_cont');

	var div2 =$('.edit_cont');
	var icon =$('#edit_favorite_twitter');
	if(Is_edit_btn){
		Is_edit_btn = false;
		
		div1.show();
		div2.show();
		icon.addClass('btn-success');
		icon.removeClass('btn-outline-success');
		//icon.innerHTML ='xxxx';		
	}else{
		Is_edit_btn = true;
		icon.removeClass('btn-success');
		icon.addClass('btn-outline-success');
		div1.hide();
		div2.hide();
	}
}

