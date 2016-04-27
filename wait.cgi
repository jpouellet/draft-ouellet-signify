#!/bin/sh

echo 'Content-Type: text/plain'
echo

inotifywait -q -e close_write --exclude '/(\..+|.*~)' --format '%f' .
# I wish there were an --include whitelist instead of just an --exclude.

sleep 0.05
# Debouncing could be more robust.
