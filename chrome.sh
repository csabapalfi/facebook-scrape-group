#!/bin/bash

pgrep Chrome | xargs kill
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 &>/dev/null &

while ! nc -z localhost 9222; do
  sleep 0.1 # wait for 1/10 of the second before check again
done

curl -s http://localhost:9222/json/version | jq -r .webSocketDebuggerUrl