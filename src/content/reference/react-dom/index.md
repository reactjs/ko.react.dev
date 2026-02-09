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

아래 API는 스크립트, 스타일시트, 글꼴과 같은 리소스를 미리 로드하여 앱 속도를 개선하는 데 사용할 수 있습니다. 예를 들어 특정 리소스가 사용될 다른 페이지로 이동하기 전에 리소스를 미리 불러올 수 있습니다.

<<<<<<< HEAD
[React 기반 프레임워크](/learn/start-a-new-react-project)에서는 일반적으로 리소스 로딩을 자동으로 처리해 주기 때문에 API를 직접 호출하지 않아도 됩니다. 자세한 내용은 사용하는 프레임워크의 문서를 참고하세요.
=======
[React-based frameworks](/learn/creating-a-react-app) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

* [`preconnect`](/reference/react-dom/preconnect)를 사용하면 어떤 리소스가 필요한지 모르더라도 리소스를 요청할 것으로 예상되는 서버와 미리 연결할 수 있습니다.
* [`prefetchDNS`](/reference/react-dom/prefetchDNS)를 사용하면 접속할 가능성이 있는 DNS 도메인의 IP 주소를 미리 조회할 수 있습니다.
* [`preinit`](/reference/react-dom/preinit)을 사용하면 외부 스크립트나 스타일시트를 미리 가져오고 실행할 수 있습니다.
* [`preinitModule`](/reference/react-dom/preinitModule)을 사용하면 외부 ESM 모듈을 미리 가져오고 평가<sup>Evaluate</sup>할 수 있게 해줍니다.
* [`preload`](/reference/react-dom/preload)를 사용하면 스타일시트, 글꼴, 이미지 또는 외부 스크립트 같은 리소스를 미리 가져올 수 있습니다.
* [`preloadModule`](/reference/react-dom/preloadModule)을 사용하면 사용할 ESM 모듈을 미리 가져올 수 있습니다.

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
