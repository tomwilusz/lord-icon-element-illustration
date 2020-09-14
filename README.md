# lord-icon-illustration

A convenient _custom element_ for embedding animated illustrations.

## Installation

```bash
$ npm install lord-icon-illustration lottie-web
```

## Usage

From script module:

```js
import { loadAnimation } from "lottie-web";
import { defineLordIconElement } from "lord-icon-illustration";

// register lottie and define custom element
defineLordIconElement(loadAnimation);
```

From markup:

```html
<lord-icon-illustration
  animation="hover"
  src="/my-icon.json"
></lord-icon-illustration>
```

## Examples

For more usage examples visit our repository. It's recommended to run them with:

```bash
npm i
npm start
```

After that your browser will start automatically with our [examples](https://github.com/tomwilusz/lord-icon-illustration/tree/master/examples).

## Notice

### Modules

It's recommended to use this library with _module bundler_ tools like **webpack**. If you want use this library without bundler, remember to import modules by path, not by package name.

### Static release

You can use this library also without JS modules with released version. This is simplest way to use our element without any initialization and external tools. Just look for our [JSFiddle example](https://jsfiddle.net/baszczewski/unw8t93d/1/).
