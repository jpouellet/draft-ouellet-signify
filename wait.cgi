#!/bin/sh

echo 'Content-Type: text/plain'
echo
inotifywait -q -e close_write --format '' .
