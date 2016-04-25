#!/bin/sh

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
	  txt="$(printf '%s' "$2" | pandoc -f markdown_github -t html5)"
}

sel=
txt=
more() {
	if ! read l; then
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
		txt=$(printf '%s\n%s\n' "$txt" "$l")
	fi
	more
}
more | jo -B -a
