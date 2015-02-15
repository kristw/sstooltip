# npm install -g uglify-js
# npm install -g uglifycss

# js
uglifyjs src/sstooltip.js -c -m -v --stats -o dist/sstooltip.min.js
uglifyjs  src/angular-sstooltip.js -c -m -v --stats -o dist/angular-sstooltip.min.js
cp src/sstooltip.js dist/sstooltip.js
cp src/angular-sstooltip.js dist/angular-sstooltip.js

# css
compass compile
uglifycss dist/sstooltip.css > dist/sstooltip.min.css