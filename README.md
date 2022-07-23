## Overview
This exercise demonstrates the use of CI/CD tooling.

As the task is open-ended, it leaves you with quite a few decisions to make.

The end result and the way to get there can be very simple or it can be very complex, depending on how you approach it.

Please note, the choice of application/service is not as important as the choice of tooling and automation itself.

Enjoy!

## Goal
Design and implement a CI/CD pipeline that builds, tests and deploys either a single-page web application or REST API.

## Criteria
* Pipeline should be described in a file (e.g. `.gitlab-ci.yml` in GitLab)
* Any required infrastructure should be defined as code using either Terraform or CloudFormation
* Provide web application/API endpoint URL
* Provide source code of the solution so we can easily reproduce it in our environment

## Optional
* Provide documentation and diagram for the proposed solution
* Write a simple app/service of your own

## Technologies
* Use free version of CI/CD tools (e.g. GitLab, CircleCI, Travis CI etc.)
* Use any open source application/service written in any language
* Use AWS Free Tier if cloud resources are required

---

## Usage

How to use this project

### Ngrok

Ngrok is used as the local http tunnel. This allows a secure https oauth connection, it is not necessary, but handy.

**Helper downloader:**

This will download the relevant client into the same dir for you.

```
bash scripts/downloadNgrok.sh
```

**Configure ngrok:**

You need to then authenticate ngrok, instructions found [here](https://dashboard.ngrok.com/get-started/setup), however if you already have used ngrok before then this is not necessary.

**Start ngrok:**

```
bash scripts/startNgrok.sh
```

Copy the URL that is outputted and update App.tsx REDIRECT_URI to be the ngrok uri.

### Vite Dev Server

The vite dev server is on port `5173`

```
npm run dev
```