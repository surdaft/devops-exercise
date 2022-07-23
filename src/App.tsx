import TwitchService from './twitchService'

import './App.css'
import React from 'react'

// Client ID generated on twitch developer panel. This is a public key and safe
// to commit for this exercise.
// I would generally provide an entry config that allows me to define this outside
// the application. For optimal configuration and security.
const CLIENT_ID="9unczewf8q9svd7j9vap19203qro5l"

// local development uses ngrok for https convenience
// this will need configuring each time
const REDIRECT_URI="https://fd64-82-36-94-123.ngrok.io"

// IProps
// define any props to pass through
interface IProps {
}

// IState
// define any state requirements on here, set the defaults in the constructor
// and then ensure that React.Component inherits it with <IState>
interface IState {
  // streams
  // array of streams retrieved from TwitchAPI
  streams: Array<any>
  // loaded
  // indicate if the React component is currently loaded or not
  loaded: Boolean
  // error
  // display errors to the frontend
  error: String|null
  // auth
  // is the user authenticated
  auth: String|null
}

class App extends React.Component<IProps, IState> {
  // twitchService
  // send requests to twitch
  twitchService: TwitchService

  // authLink
  // created on startup using defined CLIENT_ID and REDIRECT_URI
  authLink: string | undefined

  // constructor
  constructor(props: {}) {
    super(props)

    this.state = {
      loaded: false,
      error: null,
      streams: [],
      auth: null
    }

    this.twitchService = new TwitchService(CLIENT_ID)
    this.authLink = "https://id.twitch.tv/oauth2/authorize?".concat((new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'token', // this must be token to use the implicit grant and avoid a server
    })).toString())
  }

  // retrieveStreams
  retrieveStreams(): Promise<Array<{}>> {
    return this.twitchService.GetTopStreams(10)
  }

  // componentDidMount
  componentDidMount() {
    let self = this

    let auth = null
    let parts = window.location.hash.substring(0, 1) === "#"
      ? window.location.hash.substring(1, window.location.hash.length - 1).split('&')
      : []

    for (const part of parts) {
      let [param,value] = part.split('=')
      if (param === "access_token") {
        auth = value
        break
      }
    }

    // ensure we say the component is loaded
    self.setState({loaded: true, auth: auth}, () => {
      // dont try and grab the streams if I am not authenticated
      if (!self.state.auth) {
        return
      }

      // this cannot be set before the if statement above, otherwise it
      // becomes ?. which then is a potential undefined option, not string or null
      self.twitchService.SetAccessToken(self.state.auth.toString())

      // any here feels like a hack, but will do for time constraints
      this.retrieveStreams.bind(self)().then((s: any) => {
        // in case we unloaded during the request, bail
        if (!self.state.loaded) {
          return
        }

        self.setState({streams: s})
      }).catch((err: Error) => {
        console.error(err)
        self.setState({error: 'Something went wrong, sorry!'})
      })
    })
  }

  render() {
    let list = []
    for (const stream of this.state.streams) {
      list.push(
        <div className="flex flex-col">
          <div className="h-40">
            <img src={stream.thumbnail_url} />
          </div>
          <div className="flex flex-col">
            <strong>{stream.title}</strong><br />
            <small className="flex flex-row"><strong className="mr-4">{stream.user_name}</strong> {stream.game_name}</small>
          </div>
        </div>
      )
    }

    let err = null
    if (this.state.error) {
      err = <div className="rounded p-4 bg-red-400 text-white block">{this.state.error}</div>
    }
    
    if (!this.state.auth) {
      return (
        <div className="grid grid-fow-col auto-cols-max">
          <a href={this.authLink} className="rounded p-4 bg-purple-800 text-white block hover:text-white hover:bg-purple-600 transition-all">Login with Twitch</a>
        </div>
      )
    }

    return (
      <div className="grid grid-fow-col auto-cols-max">
        {err}
        {list}
      </div>
    )
  }
}

export default App
