
jslint = ./node_modules/jslint/bin/jslint.js
grover = ./node_modules/grover/bin/grover.js

specFile = spec.html
jUnitOut = ./test.junit.xml

.PHONY: test


all: install test

install:
	npm install

#lint:
#	$(jslint) 

clean:
	rm -rf $(jUnitOut)
	rm -rf ./node_modules

test:
	@grover $(specFile) -o $(jUnitOut) --junit
