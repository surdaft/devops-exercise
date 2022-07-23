import TwitchService from './twitchService'

import './App.css'
import React from 'react'

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
}

class App extends React.Component<IProps, IState> {
  twitchService: TwitchService

  // constructor
  constructor(props: {}) {
    super(props)

    this.state = {
      loaded: false,
      error: null,
      streams: [],
    }

    this.twitchService = new TwitchService
  }

  // retrieveStreams
  retrieveStreams(): Promise<Array<{}>> {
    return this.twitchService.GetTopStreams(10)
  }

  // componentDidMount
  componentDidMount() {
    let self = this

    // ensure we say the component is loaded
    self.setState({loaded: true}, () => {
      // any here feels like a hack, but will do for time constraints
      this.retrieveStreams.bind(self)().then((s: any) => {
        // in case we unloaded during the request, bail
        if (!self.state.loaded) {
          return
        }

        self.setState({streams: s.data})
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

    return (
      <div className="grid grid-fow-col auto-cols-max">
        {list}
      </div>
    )
  }
}

export default App
