import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

var request = require('request'); // "Request" library
var querystring = require('querystring');
const spotifyWebApi = new Spotify();

class App extends Component {
  constructor(props){
    super(props);
    const params = this.getHashParams()
    this.state = {
      access_token: params.access_token,
      userId: "",
      nowPlaying:{
        name: "Not Checked",
        image: ""
      },
      playlistQuery: ""
    }
    this.getUserId = this.getUserId.bind(this)
    this.handleCreatePlaylistSubmit = this.handleCreatePlaylistSubmit.bind(this)
    this.handleCreatePlaylistChange = this.handleCreatePlaylistChange.bind(this)
    if (this.state.access_token){
      spotifyWebApi.setAccessToken(this.state.access_token)
      this.getUserId()
    }
  }
  getUserId(){
      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {'Authorization': 'Bearer ' + this.state.access_token},
        json:true
      };
      request.get(options, (error, response, body)=>{
        if (!error && response.statusCode === 200){
          this.setState({userId: body.id})
        }
      });
}
    /*spotifyWebApi.getMe()
      .then((response)=>{
        this.setState({
          userId: response.id
        })
      })
  }*/
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  getNowPlaying(){
    spotifyWebApi.getMyCurrentPlaybackState()
      .then((response)=>{
        this.setState({
          nowPlaying:{
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      })
  }
  handleCreatePlaylistSubmit(event){
    spotifyWebApi.createPlaylist(this.userId, {name: this.state.playlistQuery})
      .then((response)=>{
          this.setState({
            playlistQuery: ""
          })
      })
    event.preventDefault();
  }
  handleCreatePlaylistChange(event){
    this.setState({playlistQuery: event.target.value})
  }
  render() {
    return (
      <div className="App">
        <a href = 'http://localhost:8888'>
          <button>"Login with Spotify"</button>
        </a>
        <div> User Id: {this.state.userId}</div>
        <div> Now Playing: {this.state.nowPlaying.name}</div>
        <div>
          <img src = {this.state.nowPlaying.image} style = {{width:100}}/>
        </div>
        <button onClick={()=>this.getNowPlaying()}>
          Check Now Playing
        </button>
        <div> "Enter the title of a new playlist you want to create" </div>
        <form onSubmit = {this.handleCreatePlaylistSubmit}>
          <label>
            Playlist:
            <input type = "text" value = {this.state.query} onChange = {this.handleCreatePlaylistChange}/>
          </label>
          <input type = "submit" value = "Create"/>
        </form>
        <div> New Playlist Name: {this.state.playlistQuery}</div>
      </div>
    );
  }
}
export default App;
