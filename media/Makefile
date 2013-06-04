
jslint = ./node_modules/.bin/jslint
grover = ./node_modules/.bin/grover

specFile = spec.html
jUnitOut = ./test.junit.xml

.PHONY: test


all: install lint test

install:
	npm install

lint:
	@find src test -name "*.js" \! -name "*min.js" -print0 | xargs -0 $(jslint)

clean:
	rm $(jUnitOut)
	rm -rf ./node_modules

test:
	@$(grover) $(specFile) -o $(jUnitOut) --junit
