function onDetailsLoad() {
    var list = $('#bdetailslist');
    $('.review').remove();
    $.get(baseUrl + "getbathroom/" + currentBID, function (res) {
        $('#bname').text(res.bathroom.name);
        var netVotes = res.bathroom.upvotes - res.bathroom.downvotes;
        var brating = $('#brating');
        brating.removeClass("red green");
        if (netVotes > 0) {
            brating.css("color", "green");
        } else if (netVotes < 0) {
            brating.css("color", "red");
        }
        $('#brating').text(netVotes);
        var reviews = res.bathroom.reviews;
        if (reviews.length == 0) {
            list.append($('<li class="review ui-li-static ui-body-inherit">No reviews... yet!</li>'));
        } else {
            for (var i = 0; i < reviews.length; i++) {
                list.append($('<li class="review ui-li-static ui-body-inherit">' + reviews[i] + '</li>'));
            }
        }
        
    }).fail(function(err) {
        console.log("get reviews error");
        $(".error", list.parent()).text(err.responseJSON.errors);
    });
};
