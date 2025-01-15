---
title: React 개발자 도구
---

<Intro>

React 개발자 도구를 사용하여 React [컴포넌트](/learn/your-first-component)를 검사하고 [Props](/learn/passing-props-to-a-component)와 [State](/learn/state-a-components-memory)를 편집할 수 있으며 성능 문제를 식별할 수 있습니다.

</Intro>

<YouWillLearn>

* React 개발자 도구 설치 방법

</YouWillLearn>

## 브라우저 확장 프로그램 {/*browser-extension*/}

React로 빌드된 웹 사이트를 디버깅하는 가장 쉬운 방법은 React 개발자 도구 브라우저 확장 프로그램을 설치하는 것입니다. 널리 사용되는 여러 브라우저에서 사용할 수 있습니다.

* [**Chrome**용으로 설치](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [**Firefox**용으로 설치](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [**Edge**용으로 설치](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

설치가 완료된 후 **React로 빌드된** 사이트에 방문하면 _Components_ and _Profiler_ 패널이 표시됩니다.

![React 개발자 도구 확장 프로그램](/images/docs/react-devtools-extension.png)

### Safari 및 기타 브라우저 {/*safari-and-other-browsers*/}
다른 브라우저(예: Safari)의 경우, [`react-devtools`](https://www.npmjs.com/package/react-devtools)를 npm 패키지로 설치해야 합니다.
```bash
# Yarn
yarn global add react-devtools

# npm
npm install -g react-devtools
```

다음으로 터미널에서 개발자 도구를 엽니다.
```bash
react-devtools
```

다음으로 웹 사이트의 `<head>`의 `<script>` 태그를 통해 웹 사이트를 연결합니다.
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

브라우저를 새로고침하면 개발자 도구를 확인할 수 있습니다.

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}

To inspect apps built with [React Native](https://reactnative.dev/), you can use [React Native DevTools](https://reactnative.dev/docs/react-native-devtools), the built-in debugger that deeply integrates React Developer Tools. All features work identically to the browser extension, including native element highlighting and selection.

[Learn more about debugging in React Native.](https://reactnative.dev/docs/debugging)

> For versions of React Native earlier than 0.76, please use the standalone build of React DevTools by following the [Safari and other browsers](#safari-and-other-browsers) guide above.
