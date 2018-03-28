// To use the .env file //
require("dotenv").config();

var key = require("./keys.js");
// var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Conditionals to ask Liri to run different functions //
if (process.argv[2] === "my-tweets") {
    getTweets();
} else if (process.argv[2] === "spotify-this-song") {
    spotify();
} else if (process.argv[2] === "movie-this") {
    movie();
} else {
    console.log("Please use command \"my-tweets\", \"spotify-this-song\", or \"movie-this\".")
}

// Twitter get tweets function //
function getTweets() {
    var params = {screen_name: 'ChrisyForShort'};
    
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        for (var i= 0; i <tweets.length; i++) {
            if (error) {
                console.log(error)
            } else {
            console.log("Date: " + tweets[i].created_at + "\n\tTweet: " + tweets[i].text)
            }
        }
    })
}