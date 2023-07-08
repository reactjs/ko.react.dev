---
title: React DOM APIs
---

<Intro>

`react-dom` package는 웹 애플리케이션에서만 지원되는 메서드들을 포함합니다. (브라우저 DOM 환경에서만 실행되는). React Native에서는 지원되지 않습니다.

</Intro>

---

## APIs {/*apis*/}

이 API는 components에서 불러올 수 있습니다. 사용될 일은 거의 없습니다.

* [`createPortal`](/reference/react-dom/createPortal)을 사용하면 자식 컴포넌트를 DOM tree의 다른 부분에 렌더링 할 수 있습니다.
* [`flushSync`](/reference/react-dom/flushSync) 를 사용하면 React 가 state 업데이트를 수행하고 동기적으로 DOM을 업데이트하도록 강제할 수 있습니다.

---

## Entry points {/*entry-points*/}

`react-dom` package 는 두개의 진입점을 제공합니다.

* [`react-dom/client`](/reference/react-dom/client)는 React 컴포넌트를 클라이언트에 렌더링하는 API를 포함합니다(브라우저에서).
* [`react-dom/server`](/reference/react-dom/server)는 React 컴포넌트를 서버에 렌더링하는 API를 포함합니다

---

## Deprecated APIs {/*deprecated-apis*/}

<Deprecated>

이 API는 향후 React의 메이저 버전에서 제거될 예정입니다.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode)는 클래스 컴포넌트 인스턴스와 일치하는 가장 가까운 DOM 노드를 찾습니다.
* [`hydrate`](/reference/react-dom/hydrate)는 트리를 서버 HTML에서 생성된 DOM으로 마운트합니다. 더 이상 사용되지 않으며 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 권장합니다.
* [`render`](/reference/react-dom/render)는 트리를 DOM으로 마운트합니다. 더 이상 사용되지 않으며 [`createRoot`](/reference/react-dom/client/createRoot)를 권장합니다.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode)는 트리를 DOM에서 마운트 해제합니다. 더 이상 사용되지 않으며 [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount)를 권장합니다.

