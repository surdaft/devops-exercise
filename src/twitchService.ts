class TwitchService {
    // clientID
    clientID: String;

    // accessToken
    accessToken: String|null;

    // constructor
    constructor(clientID: String) {
        this.clientID = clientID
        this.accessToken = null
    }

    // request
    // send request
    request(method: String, url: String, body: null|String): Promise<any> {
        // trim slash characters at start and end is always handy
        // to ensure we can use this endpoint however we like
        if (url.substring(-1) === "/") {
            url = url.substring(0, url.length - 1)
        }

        if (url.substring(0, 1) === "/") {
            url = url.substring(1, url.length - 1)
        }

        // cast options to be a RequestInit
        // this was new for me, but interesting to figure out
        let options = <RequestInit> {
            method: method.toUpperCase(),
            headers: this.getHeaders(),
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        return fetch(`https://api.twitch.tv/helix/${url}`, options)
    }

    // getHeaders
    // attach the general headers
    getHeaders(): Headers {
        let headers = new Headers()
        
        // toString to handle String vs. string
        headers.set('Client-ID', this.clientID.toString());
        headers.set('Accept', 'application/json');

        if (this.accessToken) {
            headers.set("Authorization", `Bearer ${this.accessToken}`)
        }

        return headers
    }

    // handlePostRequest
    // handle any errors from the api to then throw our own
    // Promise<any> inherited from data.json()
    handlePostRequest(data: Response): Promise<any> {
        // 100 http codes are information, no data, likely not what we want
        let unexpectedStatusCode = data.status < 200

        // >= 300 are redirects, bad responses, server errors
        // we _should_ handle these better in preference for time we will just error
        // to the page
        unexpectedStatusCode = unexpectedStatusCode && data.status >= 300

        if (unexpectedStatusCode) {
            throw new Error("Unexpected status code")
        }

        return data.json()
    }

    // SetAccessToken
    SetAccessToken(token: string|null) {
        this.accessToken = token
    }

    // GetTopStreams
    // retrieve the top streams from twitch
    async GetTopStreams(num: number|null): Promise<Array<Object>> {
        return await this.request('GET', `/streams/?first=${num || 20}`, null).then(d => this.handlePostRequest(d)).then((r) => {
            return r.data
        })
    }
}

export default TwitchService