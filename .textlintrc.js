module.exports = {
  rules: {
    'allowed-uris': {
      disallowed: {
        /**
         * Disallow URIs starting with the following strings:
         * - https://ko.react.dev
         * - http://ko.react.dev
         *
         * For example,
         * `https://ko.react.dev/reference/rules` can be replaced with `/reference/rules`.
         */
        links: [/https?:\/\/ko\.react\.dev/g],
      },
    },
  },
  filters: {
    comments: true,
  },
};
