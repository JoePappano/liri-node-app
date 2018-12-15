
//Variables
require("dotenv").config();
var Spotify = require("node-spotify-api");
const keys = require("./keys.js")
var axios = require("axios");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var action = process.argv[2];
var input = process.argv.slice(3).join(" ");



//Functions
function concertThis() {
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function(response) {
        for (i = 0; i < response.data.length; i++) {
            let concertData = [
            "-----------------------------------",
            "Action: " + action,
            "Venue Name: " + response.data[i].venue.name,
            "Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country,
            "Date: " + response.data[i].datetime,
            "-----------------------------------"
            ].join("\n\n");

            fs.appendFile("log.txt", concertData, function(err) {
                if (err) {
                    throw err
                }
                console.log(concertData)
            })
        }
    })
}

function movieThis() {
    if (!input) {
        input = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t="+ input +"&y=&plot=short&apikey=trilogy")
    .then(function(response) {
        let movieData = [
        "---------------------------",
        "Action: " + action,
        "Title: " + response.data.Title,
        "Year: " + response.data.Year,
        "IMDB Rating: " + response.data.imdbRating,
        "Rotten Tomatoes: " + response.data.Ratings[1].Value,
        "Country: " + response.data.Country,
        "Language: " + response.data.Language,
        "Plot: " + response.data.Plot,
        "Actors: " + response.data.Actors,
        "---------------------------"
        ].join("\n\n");
        fs.appendFile("log.txt", movieData, function(err) {
            if (err) {
                throw err
            };
            console.log(movieData)
            

        })
    })
}

function spotifyThisSong() {
    if (!input) {
        input = "the sign ace of base"
    }
    spotify.search({ type: 'track', query: input, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
        let spotArr = data.tracks.items;
        for (i = 0; i < spotArr.length; i++) {
            let songData = [
                "---------------------------",
                "Action: " + action,
                "Artist: " + spotArr[i].album.artists[0].name,
                "Song: " + spotArr[i].name,
                "Spotify Link: " + spotArr[i].external_urls.spotify,
                "Album: " + spotArr[i].album.name,
                "---------------------------"
            ].join("\n\n");

            fs.appendFile("log.txt", songData, function(err) {
                if (err) {
                    throw err;
                }
                console.log(songData)
            })
        }
      });
}

function doThis() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err)
        }
        let dataArr = data.split(",");

        action = dataArr[0];
        input = dataArr[1];

        mainScript(action, input);
    })
}

function mainScript(action, input) {
    if (action == "movie-this") {
        movieThis();
    } else if (action == "concert-this") {
        concertThis();
    } else if (action == "spotify-this-song") {
        spotifyThisSong();
    } else if (action == "do-this"){
        doThis(input);
    } else {
        console.log("Error")
    }
}

// Main Script
if (action == "movie-this") {
    movieThis(); 
} else if (action == "concert-this") {
    concertThis();
} else if (action == "spotify-this-song") {
    spotifyThisSong();
} else if (action == "do-this") {
    doThis();
} else {
    console.log("Error")
}

