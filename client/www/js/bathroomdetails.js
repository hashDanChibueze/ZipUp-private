var NUM_REVIEWS = 5; // max number of reviews to show initially

// called when details button is clicked, gets bathroom info
function onDetailsLoad() {
    var list = $('#bdetailslist');
    $('.error', list.parent()).text(""); // clear errors
    getReq(baseUrl + "getbathroom/" + currentBID, function (res) {
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
    save('reviews', null);
    getReviews();
    $('#review-form')[0].reset();
};

// Gets reviews and displays them in the bathroom details
var getReviews = function() {
    var list = $('#bdetailslist');
    getReq(baseUrl+"getreviews/"+currentBID, function (res) {
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
                window.localStorage.reviews = JSON.stringify(reviews);
            } else {
                moreReviewsBtn.hide();
            }
        }
    }).fail(function (err) {
        $(".error", list.parent()).text(err.responseJSON.errors);
    })
}
function appendReview(list, myReview) {
    $('<li class="review ui-li-static ui-body-inherit"><q>' + myReview.review + '</q></li>').hide().appendTo(list).slideDown();
}

// Handler upon submitting a new review for a bathroom
$('#review-form').submit(function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    var form = $('#review-form');
    $('.error', form).text("");
    var cleanliness = $('input[name="clean"]', form).prop('checked');
    if (cleanliness) {
        cleanliness = 5;
    } else {
        cleanliness = 1;
    }
    var vote = $('input[name="vote"]', form).val(); // TODO send vote to api
    if (vote == '0') {
        vote = "-1";
    }
    var review = $('#add-review-text').val();
    var formData = {
        "bid": currentBID,
        "cleanliness": cleanliness,
        "review": review
    };
    postReq(baseUrl + "addreview", formData, function(res) {
        $('#review-form')[0].reset();
        getReviews();
        console.log("successfully added review");
    }).fail(function(err) {
        $("#review-form .error").text("Your review is too short!");
        console.log(err.responseJSON.errors);
    });
    postReq(baseUrl + "addvote", {"bid": currentBID, "voteDir": vote}, function(res) {
        console.log("succesfully added vote");
    });
});

// Handler for clicking the more button to show more reviews
$('#more-reviews').click(function() {
    var reviews = JSON.parse(window.localStorage.reviews);
    var list = $('#bdetailslist');
    if (reviews) {
        for (var i = NUM_REVIEWS; i < reviews.length; i++) {
            appendReview(list, reviews[i]);
        }
    }
    $('#more-reviews').hide();
});