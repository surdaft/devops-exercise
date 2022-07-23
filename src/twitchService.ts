class TwitchService {
    // request
    // send request
    request(method: string, url: string, body: null|string): Promise<any> {
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
        
        // Client ID generated on twitch developer panel. This is a public key and safe
        // to commit for this exercise.
        // I would generally provide an entry config that allows me to define this outside
        // the application. For optimal configuration and security.
        headers.set('Client-ID', '9unczewf8q9svd7j9vap19203qro5l');

        headers.set('Accept', 'application/json');

        return headers
    }

    // handlePostRequest
    // handle any errors from the api to then throw our own
    // Promise<any> inherited from data.json()
    handlePostRequest(data: Response): Promise<any> {
        // 100 http codes are information, no data, likely not what we want
        let unexpectedStatusCode = !(data.status < 200)

        // >= 300 are redirects, bad responses, server errors
        // we _should_ handle these better in preference for time we will just error
        // to the page
        unexpectedStatusCode = unexpectedStatusCode && !(data.status >= 300)

        if (unexpectedStatusCode) {
            throw new Error("Unexpected status code")
        }

        return data.json()
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