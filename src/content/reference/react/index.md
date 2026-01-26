---
title: React 참고서 개요
---

<Intro>

이 섹션은 React와 관련된 작업에 대한 상세한 참고서를 제공합니다. React에 대한 소개는 [학습하기](/learn) 섹션을 참고하세요.

</Intro>

React 참고서는 다음과 같은 기능적인 하위 섹션으로 구성되어 있습니다.

## React {/*react*/}

React의 프로그래밍 기능.

* [Hook](/reference/react/hooks) - 컴포넌트에서 다양한 React 기능을 사용하세요.
* [컴포넌트](/reference/react/components) - JSX에서 사용할 수 있는 내장 컴포넌트입니다.
* [API](/reference/react/apis) - 컴포넌트 정의에 유용한 API들을 다룹니다.
* [지시어](/reference/rsc/directives) - React 서버 컴포넌트와 호환되는 번들러에게 지시를 제공합니다.

## React DOM {/*react-dom*/}

React DOM은 브라우저 DOM 환경에서 실행되는 웹 애플리케이션에서만 지원되는 기능을 포함하고 있습니다. 이 섹션은 다음과 같이 나뉩니다.

* [Hook](/reference/react-dom/hooks) - 브라우저 DOM 환경에서 실행되는 웹 애플리케이션을 위한 Hook입니다.
* [컴포넌트](/reference/react-dom/components) - React는 브라우저 내장 HTML 및 SVG 컴포넌트를 모두 지원합니다.
* [API](/reference/react-dom) - `react-dom` 패키지에는 웹 애플리케이션에서만 지원되는 메서드가 포함되어 있습니다.
* [클라이언트 API](/reference/react-dom/client) - `react-dom/client` API를 사용하면 브라우저에서 React 컴포넌트를 렌더링할 수 있습니다.
* [서버 API](/reference/react-dom/server) - `react-dom/server` API를 사용하면 서버에서 React 컴포넌트를 HTML로 렌더링할 수 있습니다.

## React Compiler {/*react-compiler*/}

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

* [Configuration](/reference/react-compiler/configuration) - Configuration options for React Compiler.
* [Directives](/reference/react-compiler/directives) - Function-level directives to control compilation.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - Guide for shipping pre-compiled library code.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

The [ESLint plugin for React Hooks](/reference/eslint-plugin-react-hooks) helps enforce the Rules of React:

* [Lints](/reference/eslint-plugin-react-hooks) - Detailed documentation for each lint with examples.

## Rules of React {/*rules-of-react*/}

React에는 패턴 이해를 쉽게 하며 고품질의 애플리케이션을 만들 수 있게 하는 일종의 규칙 혹은 모범적인 방식이 있습니다.

* [컴포넌트와 Hook은 순수해야 합니다](/reference/rules/components-and-hooks-must-be-pure) – 순수성은 코드를 더 쉽게 이해하고 디버그할 수 있도록 하며, React가 올바르게 컴포넌트와 Hook을 자동으로 최적화할 수 있도록 합니다.
* [React가 컴포넌트와 Hook을 호출하는 방식](/reference/rules/react-calls-components-and-hooks) – React는 사용자 경험을 최적화하기 위해 필요할 때마다 컴포넌트와 Hook을 렌더링합니다.
* [Hook의 규칙](/reference/rules/rules-of-hooks) – Hook은 자바스크립트 함수로 정의되지만 호출 위치에 제약이 있는 특별한 유형의 재사용 가능한 UI 로직입니다.

## 레거시 API {/*legacy-apis*/}

* [레거시 API](/reference/react/legacy) - `react` 패키지에서 내보냈지만<sup>Exported</sup> 새로 작성할 코드에서는 권장하지 않습니다.
