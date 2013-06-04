
.PHONY: test

all: install test

install:
	npm install

lint:
	./node_modules/jslint/bin/jslint.js script/notes/core.js

clean:
	rm -rf ./test.junit.xml
	rm -rf ./node_modules

test:
	./node_modules/grover/bin/grover.js spec.html -o ./test.junit.xml --junit
