---
title: React Developer Tools
---

<Intro>

React Developer Tools를 사용하여 React [컴포넌트](/learn/your-first-component)를 검사하고 [props](/learn/passing-props-to-a-component)와 [state](/learn/state-a-components-memory)를 편집할 수 있으며 성능 문제를 식별할 수 있습니다.

</Intro>

<YouWillLearn>

* React Developer Tools 설치 방법

</YouWillLearn>

## 브라우저 확장 {/*browser-extension*/}

React로 빌드된 웹 사이트를 디버깅하는 가장 쉬운 방법은 React Developer Tools 브라우저 확장을 설치하는 것입니다. 널리 사용되는 여러 브라우저에서 사용할 수 있습니다.

* [**Chrome**용으로 설치](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [**Firefox**용으로 설치](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [**Edge**용으로 설치](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

설치가 완료되면 **React로 구축된** 사이트에 방문하면 _Components_ and _Profiler_ 패널이 표시됩니다.

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safari 및 기타 브라우저 {/*safari-and-other-browsers*/}
다른 브라우저(예: Safari)의 경우, [`react-devtools`](https://www.npmjs.com/package/react-devtools) 를 npm package로 설치해야 합니다
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

다음으로 터미널에서 개발자 도구를 엽니다
```bash
react-devtools
```

다음으로 당신의 웹 사이트의 `<head>`의 `<script>` 태그를 통해 웹 사이트를 연결합니다
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

브라우저를 새로고침하면 개발자 도구를 확인할 수 있습니다

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## 모바일 (React Native) {/*mobile-react-native*/}
React Developer Tools는 [React Native](https://reactnative.dev/) 로 만들어진 앱에서도 잘 동작합니다

React Developer Tools를 사용하는 가장 쉬운 방법은 전역적으로 설치하는 것입니다.
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

다음으로 터미널에서 개발자 도구를 여십시오.
```bash
react-devtools
```

실행 중인 로컬 React Native 앱에 연결해야 합니다.

> 개발자 도구가 몇 초 후에 연결되지 않으면 앱을 다시 로드해 보십시오.

[React Native 디버깅에 대하여 더 알아보기](https://reactnative.dev/docs/debugging)
