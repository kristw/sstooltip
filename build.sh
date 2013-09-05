# npm install -g uglify-js
# npm install -g uglifycss
uglifyjs sstooltip.js -c -v --stats -o sstooltip.min.js
uglifycss sstooltip.css > sstooltip.min.css