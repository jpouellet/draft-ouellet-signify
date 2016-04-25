draft-ouellet-signify-00.rfc:

.SECONDARY: %.txt %.html %.json

%.rfc: %.html %.json
	touch $@

%.html: %.txt
	./rfcmarkup "id-repository=file:///proc/self/cwd&doc=$<" > $@

%.json: %.md
	./md2json.sh < $< > $@

%.txt: %.xml
	xml2rfc --text $<


.PHONY: clean

clean:
	rm -f *.txt *.html *.json *.rfc
