---
title: React DOM APIs
---

<Intro>

`react-dom` 패키지는 웹 애플리케이션(브라우저 DOM 환경)에서만 지원되는 메서드를 포함합니다. React Native에서는 지원되지 않습니다.

</Intro>

---

## API {/*apis*/}

아래 API는 컴포넌트에서 불러올 수 있습니다. 사용할 일은 거의 없습니다.

* [`createPortal`](/reference/react-dom/createPortal)을 사용하면 자식 컴포넌트를 DOM 트리의 다른 부분에 렌더링 할 수 있습니다.
* [`flushSync`](/reference/react-dom/flushSync)를 사용하면 React가 State 업데이트를 수행하고 동기적으로 DOM을 업데이트하도록 강제할 수 있습니다.

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.

---

## 진입점 {/*entry-points*/}

`react-dom` 패키지는 두 개의 진입점<sup>Entry Points</sup>을 제공합니다.

* [`react-dom/client`](/reference/react-dom/client)는 React 컴포넌트를 클라이언트(브라우저)에 렌더링하는 API를 포함합니다.
* [`react-dom/server`](/reference/react-dom/server)는 React 컴포넌트를 서버에 렌더링하는 API를 포함합니다.

---

## 제거된 API {/*removed-apis*/}

아래 API는 React 19에서 제거되었습니다.

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): see [alternatives](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): use [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) instead.
* [`render`](https://18.react.dev/reference/react-dom/render): use [`createRoot`](/reference/react-dom/client/createRoot) instead.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): use [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) instead.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
