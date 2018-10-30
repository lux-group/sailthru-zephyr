# Sailthru Zephyr

### Not for production, just for migrations

transpiler for Sailthru Zephyr templating language

https://getstarted.sailthru.com/developers/zephyr-syntax/zephyr-syntax-overview/

```js
const { transpileHandlebars } = require('sailthru-zephyr')
const handlebarsTemplate = transpileHandlebars(zephyrTemplate)
```

The following will transpile template and copy over in place:

```
./cli.js ~/path/to/template.html --format guide
```
