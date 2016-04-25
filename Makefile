draft-ouellet-signify-00.html:

.PRECIOUS: %.txt %.json

%.html: %.txt %.json
	./rfcmarkup "id-repository=file:///proc/self/cwd&doc=$<" > $@
	touch $@
	echo $<

%.json: %.md
	./md2json.sh < $< > $@

%.txt: %.xml
	xml2rfc --text $<
