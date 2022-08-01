/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://ko.reactjs.org';
const version = '18.0.0';
=======
const urlRoot = 'https://reactjs.org';
const version = '18.2.0';
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
