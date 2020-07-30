all: package

.PHONY: npm-install
npm-install:
	cd src && npm install

.PHONY: package
package: npm-install
	cd src && zip -r ../function.zip *
