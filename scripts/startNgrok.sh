#!/usr/bin/env bash

if [[ ! -f "./ngrok" ]]; then
    exit 2
fi

./ngrok http 5173