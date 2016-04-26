#!/bin/sh

markdown() {
	sed -E 's/RFC ([0-9]+)/[RFC \1](https:\/\/tools.ietf.org\/html\/rfc\1)/g' \
	| pandoc -f markdown_github -t html
}

produce() {
	if [ -z "$1" ]; then
		echo no selector >&2
		exit 1
	fi
	if [ -z "$2" ]; then
		echo no comment >&2
		exit 1
	fi
	jo -B \
	  sel="$1" \
	  txt="$(printf '%s' "$2" | markdown)"
}

sel=
txt=
more() {
	if ! IFS='' read l; then
		produce "$sel" "$txt"
		return 0
	fi
	if [ X"$l" != X"${l#-- }" ]; then
		if [ -n "$sel" ]; then
			produce "$sel" "$txt"
		fi
		sel=${l#-- }
		txt=
	else
		txt="$txt$l
"
	fi
	more
}
more | jo -B -a
