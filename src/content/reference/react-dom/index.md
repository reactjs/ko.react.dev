---
title: React DOM APIs
---

<Intro>

`react-dom` package는 웹 애플리케이션에서만 지원되는 메서드를 포함합니다. (브라우저 DOM 환경에서만 실행되는). React Native에서는 지원되지 않습니다.

</Intro>

---

## APIs {/*apis*/}

이 API는 컴포넌트에서 불러올 수 있습니다. 사용될 일은 거의 없습니다:

* [`createPortal`](/reference/react-dom/createPortal)을 사용하면 자식 컴포넌트를 DOM tree의 다른 부분에 렌더링 할 수 있습니다.
* [`flushSync`](/reference/react-dom/flushSync) 를 사용하면 React가 state 업데이트를 수행하고 동기적으로 DOM을 업데이트하도록 강제할 수 있습니다.

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.

---

## Entry points {/*entry-points*/}

`react-dom` package 는 두 개의 진입점을 제공합니다:

* [`react-dom/client`](/reference/react-dom/client)는 React 컴포넌트를 클라이언트에 렌더링하는 API를 포함합니다(브라우저에서).
* [`react-dom/server`](/reference/react-dom/server)는 React 컴포넌트를 서버에 렌더링하는 API를 포함합니다.

---

## Deprecated APIs {/*deprecated-apis*/}

<Deprecated>

이 API는 향후 React의 메이저 버전에서 제거될 예정입니다.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode)는 클래스 컴포넌트 인스턴스와 일치하는 가장 가까운 DOM 노드를 찾습니다.
* [`hydrate`](/reference/react-dom/hydrate)는 트리를 서버 HTML에서 생성된 DOM으로 마운트합니다. 더 이상 사용되지 않으며 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 권장합니다.
* [`render`](/reference/react-dom/render)는 트리를 DOM으로 마운트합니다. 더 이상 사용되지 않으며 [`createRoot`](/reference/react-dom/client/createRoot)를 권장합니다.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode)는 트리를 DOM에서 마운트 해제합니다. 더 이상 사용되지 않으며 [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount)를 권장합니다.

