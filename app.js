
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


const SpotifyWebApi = require('spotify-web-api-node');

                             |
const spotifyApi = new SpotifyWebApi({
  //           |
  clientId: process.env.CLIENT_ID, // <-------------|
  clientSecret: process.env.CLIENT_SECRET // <------|
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong  retrieving the access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// ROUTE 1: DISPLAY THE FORM TO USERS SO THEY CAN SEARCH FOR THE ARTISTS

// http://localhost:3000/
app.get('/', (req, res) => {
  res.render('index');
});

// ROUTE 2: SUBMIT THE FORM
             V
app.get('/artist-search', (req, res) => {
  //   console.log('what is this: ', req.query);
  spotifyApi
    //  |------> Method provided by the SpotifyWebApi npm packages and helps us to search artists whose name contains the search term
    //  V
    .searchArtists(req.query.theArtistName) // <----- theArtistName is name="theArtistName" in our search form
    .then(data => {
      //   console.log('The received data from the API: ', data.body.artists.items[0]);
      res.render('artist-search-results', { artists: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


// ROUTE 3: THE DETAILS OF A SPECIFIC ARTIST BASED ON THE UNIQUE ID (WHICH GETS CAPTURED FROM THE URL)

app.get('/albums/:artistId', (req, res) => {
  // console.log("Id is: ", req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      // console.log('The received data from the API: ', data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('albums', { albums: data.body.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/tracks/:trackId', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then(data => {
      // console.log('The received data from the API: ', data.body.items);
      res.render('tracks', { tracks: data.body.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));