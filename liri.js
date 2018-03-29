// To use the .env file //
require("dotenv").config();
var fs = require('fs');
var keys = require("./keys.js");
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Conditionals to ask Liri to run different functions //
if (process.argv[2] === "my-tweets") {
    getTweets();
} else if (process.argv[2] === "spotify-this-song") {
    getSpotify();
} else if (process.argv[2] === "movie-this") {
    getMovie();
} else if (process.argv[2] === "do-what-it-says"){
    doWhat()
} else {
    console.log("Please use commands: \"my-tweets\", \"spotify-this-song *nameOfSong*\", or \"movie-this *nammeOfMovie*\".")
}

// Function for Twitter to get tweets //
function getTweets() {
    var params = {screen_name: 'ChrisyForShort'};
    
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        for (var i= 0; i <tweets.length; i++) {
            if (error) {console.log(error)} else {
            console.log("Date: " + tweets[i].created_at + "\nTweet: " + tweets[i].text + "\n")
            fs.appendFile('log.txt', ("Date: " + tweets[i].created_at + "\nTweet: " + tweets[i].text + "\n"), function(error){
                if (error) {console.log(error)}
            })
            }
        }
    })
}

// Function for Spotify to get song information //
function getSpotify() {
    var nameOfSong = process.argv[3];
    if (process.argv[3] === undefined) {
        console.log("No song selected, going to default song.")
        nameOfSong = "The Sign Ace of Base"
    }

    spotify.search({type: 'track', query: nameOfSong}, function (error, data){
        if (error) { console.log(error); 
            return;
        }
        var spotifyResponse = data.tracks.items;
            console.log("Song: " + spotifyResponse[0].name + "\nArtist: " + spotifyResponse[0].album.artists[0].name + "\nAlbum: " + spotifyResponse[0].album.name + "\nLink: " + spotifyResponse[0].external_urls.spotify)
        fs.appendFile('log.txt', ("Song: " + spotifyResponse[0].name + "\nArtist: " + spotifyResponse[0].album.artists[0].name + "\nAlbum: " + spotifyResponse[0].album.name + "\nLink: " + spotifyResponse[0].external_urls.spotify), function(error){
            if (error) {console.log(error)}
        })
    })
}

// Function for OMDB to get movie information //
function getMovie() {
    var movie = process.argv[3]
    if (process.argv[3] === undefined) {
        console.log("No movie selected, going to default movie.")
        movie = "Mr. Nobody"
    }
    request('https://www.omdbapi.com?apikey=trilogy&t=' + movie + '&plot=full', function(err, response, body) {
        if (err) {console.log(err)} else{
            console.log("Title: " + JSON.parse(body)['Title'] + "\nYear: " + JSON.parse(body)['Year'] + "\nCountry: " + JSON.parse(body)['Country'] + "\nLanguage: " + JSON.parse(body)['Language'] + "IMBD Rating: " + JSON.parse(body)['imbdRating'] + "\nRotten Tomatoes Rating: " + JSON.parse(body)['Ratings']['Value'] + "\nActors: " + JSON.parse(body)['Actors'] + "\nPlot: " + JSON.parse(body)['Plot'])
            fs.appendFile('log.txt', ("Title: " + JSON.parse(body)['Title'] + "\nYear: " + JSON.parse(body)['Year'] + "\nCountry: " + JSON.parse(body)['Country'] + "\nLanguage: " + JSON.parse(body)['Language'] + "IMBD Rating: " + JSON.parse(body)['imbdRating'] + "\nRotten Tomatoes Rating: " + JSON.parse(body)['Ratings']['Value'] + "\nActors: " + JSON.parse(body)['Actors'] + "\nPlot: " + JSON.parse(body)['Plot']), function(error){
                if (error) {console.log(error)}
            })
        }
    })
}

// Function to read random.txt file to do action //
function doWhat() {
    fs.readFile("./random.txt", "utf8", function(e, data){
        if (e) {console.log(e)} else {
            var returnData = data.split(",");
            var action  = returnData[0];
            var info = returnData[1];

            switch(action){
                case "my-tweets":
                getTweets();
                break;

                case "spotify-this-song":
                getSpotify();
                break;

                case "movie-this":
                getMovie();
                break;
            }
        }
    })
}