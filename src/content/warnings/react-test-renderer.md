---
title: react-test-renderer 지원 중단 경고
---

## ReactTestRenderer.create() 경고 {/*reacttestrenderercreate-warning*/}

react-test-renderer는 더 이상 사용되지 않습니다. `ReactTestRenderer.create()` 또는 `ReactShallowRender.render()`를 호출할 때마다 경고가 발생합니다. react-test-renderer 패키지는 NPM에서 계속 사용할 수 있지만 유지 관리되지 않으며 React의 새로운 기능이나 내부 구현 변경으로 인해 깨질 수 있습니다.

React 팀은 안정적으로 지원되는 최신 테스트 환경을 위해 테스트를 [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) 또는 [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro)로 마이그레이션하는 것을 권장합니다.


## new ShallowRenderer() 경고 {/*new-shallowrenderer-warning*/}

react-test-renderer 패키지는 더 이상 `react-test-renderer/shallow`에서 shallow renderer를 내보내지 않습니다. 이는 이전에 별도 패키지로 분리된 `react-shallow-renderer`를 다시 패키징한 것에 불과했습니다. 따라서 직접 설치하면 shallow renderer를 같은 방식으로 계속 사용할 수 있습니다. [GitHub](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer)을 참고하세요.
