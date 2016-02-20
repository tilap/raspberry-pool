include node_modules/auk/tasks.mk

install:
	npm install
	node_modules/.bin/jspm install

jspm-bundle:
	jspm bundle js/index
