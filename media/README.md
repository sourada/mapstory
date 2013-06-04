
# Mapstory client


## Install

To run the test suite you must have node/npm and phantomjs installed

* node

  To learn how to install node please check the node.js docs
  <https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager>
  npm should be included in the latest versions of node.js

* phantomjs

  http://phantomjs.org/download.html


We only use node to install the development tools; grover, jslint and
etc. To install these simply type (in /media)

    make install


## Run Tests

To run the test suite via the command line

    make test

A junit compatible xml document is produced at the end of the test
run. test.junit.xml


## Run Linter

To run jslint on the code base

    make lint


## Concatenated JavaScript files

[todo]

## Compress JavaScript files

[todo]
