#!/bin/sh

echo 'Content-Type: text/plain'
echo
inotifywait -q -eclose_write --exclude '[^\.][^x][^m][^l]$' --format '%f' .
