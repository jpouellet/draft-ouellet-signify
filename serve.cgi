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

inject_scripts() {
	awk 'BEGIN {
		for (i = 1; i < ARGC - 1; i++) {
			topen = "<script type=\"text/javascript\" src=\"" ARGV[i] "\">"
			tclose = "</script>\n"
			tags = tags topen tclose
			delete ARGV[i]
		}
	}
	!x {
		x = sub("</head>", tags "</head>")
	}
	1' "$@" -
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
	inject_scripts reload.js annotate.js < "./${doc}.html"
else
	echo 'Status: 500 Internal Server Error'
	echo 'Content-Type: text/html'
	echo
	echo '<!DOCTYPE html><html><head><title>Error</title>'
	echo '</head><body><pre>' | inject_scripts reload.js annotate.js
	printf '%s' "$makeout"
	echo '</pre></body></html>'
fi
