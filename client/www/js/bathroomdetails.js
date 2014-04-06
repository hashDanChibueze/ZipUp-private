var NUM_REVIEWS = 5; // max number of reviews to show initially

// called when details button is clicked
function onDetailsLoad() {
    var list = $('#bdetailslist');
    $('.error', list.parent()).text(""); // clear errors
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
    }).fail(function(err) {
        console.log("get bathroom error");
        $(".error", list.parent()).text(err.responseJSON.errors);
    });
    window.localStorage['reviews'] = null;
    getReviews();
    $('#review-form')[0].reset();
};

var getReviews = function() {
    var list = $('#bdetailslist');
    $.get(baseUrl+"getreviews/"+currentBID, function (res) {
        $('.review', list).remove();
        var moreReviewsBtn = $('#more-reviews');
        var reviews = res.bathroom.reviews.reverse();
        if (reviews.length == 0) {
            list.append($('<li class="review ui-li-static ui-body-inherit">No reviews... yet!</li>'));
            moreReviewsBtn.hide();
        } else {
            for (var i = 0; i < Math.min(reviews.length, NUM_REVIEWS); i++) {
                appendReview(list, reviews[i]);
            }
            if (reviews.length > NUM_REVIEWS) {
                moreReviewsBtn.show();
                window.localStorage['reviews'] = JSON.stringify(reviews);
            } else {
                moreReviewsBtn.hide();
            }
        }
    }).fail(function (err) {
        $(".error", list.parent()).text(err.responseJSON.errors);
    })
}
function appendReview(list, myReview) {
    list.append($('<li class="review ui-li-static ui-body-inherit"><q>' + myReview.review + '</q></li>'));
}

$('#review-form').submit(function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    $('#review-form .error').text("");
    var cleanliness = $('#checkbox').prop('checked');
    if (cleanliness) {
        cleanliness = 5;
    } else {
        cleanliness = 1;
    }
    var review = $('#add-review-text').val();
    var formData = {
        "bid": currentBID,
        "cleanliness": 5,
        "review": review
    };
    $.post(baseUrl + "addreview", formData, function(res) {
        $('#review-form')[0].reset();
        getReviews();
    }).fail(function(err) {
        $("#review-form .error").text("Your review is too short!");
        console.log(err.responseJSON.errors);
    });
});

$('#more-reviews').click(function() {
    var reviews = JSON.parse(window.localStorage['reviews']);
    var list = $('#bdetailslist');
    if (reviews) {
        for (var i = NUM_REVIEWS; i < reviews.length; i++) {
            appendReview(list, reviews[i]);
        }
    }
    $('#more-reviews').hide();
});