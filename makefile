all: package

.PHONY: npm-install
npm-install:
	cd src && rm -r node_modules && npm install --production

.PHONY: package
package: npm-install
	cd src && zip -FSr ../function.zip * \
    -x "*/.DS_Store" \
    -x "*/*.map" \
    -x "*/*.md" \
    -x "*/LICENSE" \
    -x "*/package-lock.json" \
    -x "*/test/" \
    -x "*/*.ts"
