#!/bin/sh

echo 'Content-Type: text/plain'
echo

# could use some better debouncing here
inotifywait -q -e close_write --exclude '.*~' --format '' .
