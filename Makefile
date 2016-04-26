draft-ouellet-signify-00.rfc:

.SECONDARY:

%.rfc: %.html %.json
	touch $@

%.html: %.txt
	./rfcmarkup "id-repository=file:///proc/self/cwd&topmenu=empty&doc=$<" > $@

%.json: %.md
	./md2json.sh < $< > $@

%.txt: %.xml
	xml2rfc --text $<


.PHONY: clean

clean:
	rm -f *.txt *.html *.json *.rfc *~
