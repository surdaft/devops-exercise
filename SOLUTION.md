# Solution

## What did I build?

I build a basic Vite application with a ReactJS frontend, this interacts with the twitch api using OAuth to log in and display the top streams right now.

The OAuth method is the token flow (implicit grant) to avoid the requirement for a backend server (storing a secret twitch token)

On every commit this project is sent to gitlab and a pipeline executes to compile the dist assets. Which are then stored in a tar.gz file ready for a server to download.

A server is then spun up using terraform and the startup script instructs it to install nginx and pull down the compiled assets.

## Notable mentions

- A known issue with startup script is that the server is asked to update the assets once. A better solution for ensuring the code is kept up to date should be found.
- Jest should be implemented and ran in the pipeline to ensure that we don't commit a failing build
- I could package up the files as a .deb file and use apt to update my code, instead of curling git.