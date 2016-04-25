#!/bin/sh

default=draft-ouellet-signify-00

err() {
	echo 'Status: 400 Bad Request'
	echo 'Content-Type: text/plain'
	echo
	echo "$*"
	exit 0
}

clean() {
	printf '%s' "$1" | tr -dc '[a-z0-9]-'
}

inject_script() {
	cat | awk 'BEGIN {
		tag = "<script type=\"text/javascript\" src=\"" ARGV[1] "\"></script>"
		delete ARGV[1]
		ARGC--
	}
	!x {
		x = sub("</head>", tag "</head>")
	}
	1' "$1" -
}

# safety belt
if [ -n "$QUERY_STRING" ]; then
	doc=$(clean "${QUERY_STRING}")
	if [ X"$doc" != X"$QUERY_STRING" ]; then
		err fuck you
	fi
	if [ Xdraft-"${doc#draft-}" != X"$doc" ]; then
		err nope
	fi
else
	doc=$default
fi

makeout=$(env -i PATH="$PATH" make "${doc}.rfc" 2>&1)
if [ $? -eq 0 ]; then
	echo 'Content-Type: text/html'
	echo
	inject_script reload.js < "./${doc}.html"
else
	echo 'Status: 500 Internal Server Error'
	echo 'Content-Type: text/html'
	echo
	echo '<!DOCTYPE html><html><head><title>Error</title>'
	echo '</head><body><pre>' | inject_script reload.js
	printf '%s' "$makeout"
	echo '</pre></body></html>'
fi
