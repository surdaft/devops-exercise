#!/usr/bin/env bash

DEFAULT_BG="\033[49m"
RED_BG="\033[41m"
LIGHT_BLUE_BG="\033[104m"

DEFAULT_FG="\033[39m"
WHITE_FG="\033[97m"

errMsg() {
    MSG="${RED_BG}${WHITE_FG} Error: ${1} ${DEFAULT_FG}${DEFAULT_BG}"
    if [[ "${2}" != "" ]]; then
        MSG="${MSG} ${2}"
    fi

    echo -e $MSG
}

infoMsg() {
    MSG="${LIGHT_BLUE_BG}${WHITE_FG} Info: ${1} ${DEFAULT_FG}${DEFAULT_BG}"
    if [[ "${2}" != "" ]]; then
        MSG="${MSG} ${2}"
    fi

    echo -e $MSG
}

MAC=0
LINUX=0

# https://stackoverflow.com/questions/394230/how-to-detect-the-os-from-a-bash-script
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    infoMsg "OS Detected" "Linux"
    LINUX=1
elif [[ "$OSTYPE" == "darwin"* ]]; then
    infoMsg "OS Detected" "Mac"
    MAC=1
fi

if [[ "$MAC" == "0" && "$LINUX" == "0" ]]; then
    errMsg "Unexpected OS" "Only linux and mac OS supported"
    exit 2
fi

if [[ "$(command -v curl)" == "" ]]; then
    errMsg "Missing dependency" "You need curl installed"
    exit 2
fi

if [[ -f "ngrok" ]]; then
    infoMsg "ngrok already present"
    exit 0
fi

LINK="https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz"
if [[ "$MAC" == "1" ]]; then
    LINK="https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-amd64.zip"
fi

curl -L -o ngrokPackage $LINK
if [[ "${MAC}" == "1" ]]; then
    unzip ngrokPackage
elif [[ "${LINUX}" == "1" ]]; then
    tar -zxvf ngrokPackage
fi

rm ngrokPackage
chmod +x ngrok