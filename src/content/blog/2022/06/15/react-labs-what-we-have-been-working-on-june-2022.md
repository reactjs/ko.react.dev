---
title: "React Labs: 그동안의 작업 – 2022년 6월"
---

2022년 6월 15일, [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

<<<<<<< HEAD
[React 18](https://reactjs.org/blog/2022/03/29/react-v18)은 수년간의 준비 끝에 탄생한 버전으로 React 팀에게 귀중한 교훈을 가져다주었습니다. 수년간의 연구와 다양한 경로를 모색한 끝에 출시된 제품입니다. 그 경로 중 일부는 성공적이었지만 더 많은 경로가 막다른 골목에서 새로운 인사이트로 이어졌습니다. 우리가 얻은 한 가지 교훈은 우리가 탐색하고 있는 경로에 대한 인사이트를 공유받지 못한 채 새로운 기능을 기다리는 것은 커뮤니티에 실망감을 준다는 것입니다.
=======
[React 18](https://react.dev/blog/2022/03/29/react-v18) was years in the making, and with it brought valuable lessons for the React team. Its release was the result of many years of research and exploring many paths. Some of those paths were successful; many more were dead-ends that led to new insights. One lesson we’ve learned is that it’s frustrating for the community to wait for new features without having insight into these paths that we’re exploring.
>>>>>>> a0cacd7d3a89375e5689ccfba0461e293bfe9eeb

</Intro>

---

일반적으로 실험적인 프로젝트부터 명확하게 정의된 프로젝트까지 다양한 프로젝트가 수시로 진행 중입니다. 앞으로는 이러한 프로젝트에서 진행 중인 내용을 커뮤니티와 정기적으로 더 많이 공유하고자 합니다.

기대치를 설정하기 위해 이 로드맵은 명확한 타임라인이 있는 로드맵이 아닙니다. 이러한 프로젝트 중 상당수는 현재 활발히 연구 중이며 구체적인 출시일을 정하기 어렵습니다. 연구 결과에 따라 현재 단계에서 출시되지 않을 수도 있습니다. 대신 저희가 적극적으로 고민하는 문제 영역과 지금까지 파악한 내용을 여러분과 공유하고자 합니다.

## 서버 컴포넌트 {/*server-components*/}

2020년 12월에 [React 서버 컴포넌트(RSC)의 실험적 데모](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html)를 발표했습니다. 그 이후로 React 18에서 종속성을 마무리하고 실험적 피드백에서 영감을 얻은 변경 작업을 진행했습니다.

특히, 우리는 포크된 I/O 라이브러리(예: react-fetch)를 사용하는 아이디어를 포기하고 대신 호환성 향상을 위해 async/await 모델을 채택하고 있습니다. 데이터 불러오기에 라우터를 사용할 수도 있기 때문에 기술적으로 RSC의 릴리스에 지장을 주지는 않습니다. 또 다른 변화는 파일 확장자 방식에서 벗어나 [경계를 주석](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278)으로 처리하는 방식을 채택하고 있다는 점입니다.

Vercel 및 Shopify와 협력하여 Webpack 및 Vite 모두에서 공유 시맨틱에 대한 번들러 지원을 통합하고 있습니다. 출시 전에 전체 React 생태계에서 RSC의 의미가 동일한지 확인하고자 합니다. 이것은 안정에 도달하는 데 주요 장애물입니다.

## 자산 로딩 {/*asset-loading*/}

현재 스크립트, 외부 스타일, 글꼴 및 이미지와 같은 리소스는 일반적으로 외부 시스템을 사용하여 사전 로드되고 로드됩니다. 이로 인해 스트리밍, 서버 컴포넌트 등과 같은 새로운 환경에서 조정하기 까다로울 수 있습니다.
우리는 모든 React 환경에서 작동하는 React API를 통해 중복 제거된 외부 자산을 미리 로드하고 로드하기 위해 API를 추가하는 것을 고려하고 있습니다.

우리는 또한 Suspense를 지원하여 로드될 때까지 표시를 차단하지만 스트리밍 및 동시 렌더링을 차단하지 않는 이미지, CSS 및 글꼴을 가질 수 있도록 하는 것을 고려하고 있습니다. 이것은 시각적 요소가 튀어나오고 레이아웃이 바뀔 때 ["popcorning"](https://twitter.com/sebmarkbage/status/1516852731251724293)을 방지하는 데 도움이 될 수 있습니다.

## 정적 서버 렌더링 최적화 {/*static-server-rendering-optimizations*/}

정적 사이트 생성(SSG)과 증분 정적 재생성(ISR)은 캐시 가능한 페이지의 성능을 향상하는 좋은 방법이지만, 동적 서버 측 렌더링(SSR)의 성능을 개선할 수 있는 기능을 더 추가할 수 있다고 생각합니다 - 특히, 대부분의 컨텐츠가 캐싱이 가능하지만 일부만 불가능한 경우를 위해서요. 컴파일 및 정적 패스를 활용하여 서버 렌더링을 최적화하는 방법을 모색하고 있습니다.

## React 최적화 컴파일러 {/*react-compiler*/}

우리는 React Conf 2021에서 React Forget을 [미리 선보였습니다](https://www.youtube.com/watch?v=lGEMwh32soc). 이 컴파일러는 React의 프로그래밍 모델을 유지하면서 재렌더링 비용을 최소화하기 위해 `useMemo` 와 `useCallback` 에 상응하는 호출을 자동으로 생성하는 컴파일러입니다.

최근 저희는 컴파일러의 안정성과 성능을 높이기 위해 컴파일러 재작업을 완료했습니다. 이 새로운 아키텍처를 통해 [로컬 변이 사용](/learn/keeping-components-pure#local-mutation-your-components-little-secret)과 같은 더 복잡한 패턴을 분석하고 메모화할 수 있게 되었으며, memoization hooks 와 동등한 수준 이상으로 많은 새로운 컴파일 시간 최적화 기회가 열리게 되었습니다.

또한 컴파일러의 여러 측면을 탐색할 수 있는 플레이그라운드도 개발 중입니다. 플레이그라운드의 목표는 컴파일러를 더 쉽게 개발하는 것이지만, 컴파일러를 사용해보고 컴파일러가 하는 일에 대한 직관력을 키우는 데 도움이 될 것으로 생각합니다. 컴파일러가 내부에서 어떻게 작동하는지에 대한 다양한 인사이트를 제공하며, 입력하는 대로 컴파일러의 출력을 실시간으로 렌더링합니다. 이 기능은 컴파일러가 출시될 때 함께 제공됩니다.

## 오프스크린 {/*offscreen*/}

이제 컴포넌트를 숨기거나 표시하려면 두 가지 옵션이 있습니다. 하나는 트리에서 완전히 추가하거나 제거하는 것입니다. 이 방법의 문제점은 마운트를 해제할 때마다 스크롤 위치와 같이 DOM에 저장된 state를 포함하여 UI의 state가 손실된다는 것입니다.

다른 옵션은 컴포넌트를 마운트한 상태로 유지하고 CSS를 사용해 시각적으로 모양을 전환하는 것입니다. 이 방법은 UI의 state를 유지하지만, React가 새로운 업데이트를 받을 때마다 숨겨진 컴포넌트와 그 모든 자식들을 계속 렌더링해야 하므로 성능에 비용이 발생합니다.

오프스크린은 UI를 시각적으로 숨기되 콘텐츠의 우선순위를 낮추는 세 번째 옵션을 도입합니다. 이 아이디어는 `content-visibility` CSS 프로퍼티와 비슷한 개념으로, 콘텐츠가 숨겨져 있을 때 나머지 UI와 동기화 상태를 유지할 필요가 없습니다. React는 앱의 나머지 부분이 유휴 상태가 될 때까지 또는 콘텐츠가 다시 표시될 때까지 렌더링 작업을 연기할 수 있습니다.

오프스크린은 높은 수준의 기능을 잠금 해제하는 낮은 수준의 기능입니다. `startTransition` 과 같은 React의 다른 동시 기능과 유사하게, 대부분의 경우 오프스크린 API와 직접 상호작용하지 않고 독단적인 프레임워크를 통해 다음과 같은 패턴을 구현합니다.

* **즉각적인 전환.** 일부 라우팅 프레임워크는 링크 위로 마우스를 가져갈 때와 같이 후속 탐색 속도를 높이기 위해 이미 데이터를 미리 가져옵니다. 오프스크린을 사용하면 백그라운드에서 다음 화면을 미리 렌더링할 수도 있습니다.
* **재사용 가능한 state.** 마찬가지로 경로나 탭 사이를 탐색할 때 오프스크린을 사용하여 이전 화면의 state를 보존하여 중단한 지점에서 다시 전환하고 선택할 수 있습니다.
* **가상화된 목록 렌더링.** 많은 항목 목록을 표시할 때 가상화된 목록 프레임워크는 현재 표시되는 것보다 더 많은 행을 미리 렌더링합니다. 오프스크린을 사용하여 숨겨진 행을 목록에 보이는 항목보다 낮은 우선 순위로 미리 렌더링할 수 있습니다.
* **배경 콘텐츠.** 또한 모달 오버레이를 표시할 때와 같이 콘텐츠를 숨기지 않고 백그라운드에서 우선 순위를 낮추는 관련 기능을 탐색하고 있습니다.

## 전환 추적 {/*transition-tracing*/}

현재 React에는 두 가지 프로파일링 도구가 있습니다. [기존의 프로파일러](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)는 프로파일링 세션의 모든 커밋에 대한 개요를 보여줍니다. 각 커밋에 대해 렌더링된 모든 컴포넌트와 렌더링하는 데 걸린 시간도 표시됩니다. 또한 React 18에 도입된 [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76)의 베타 버전이 있는데, 이 기능은 컴포넌트가 업데이트를 예약하는 시기와 React가 이러한 업데이트에서 작동하는 시기를 보여줍니다. 이 두 프로파일러는 개발자가 코드에서 성능 문제를 식별하는 데 도움이 됩니다.

개발자가 각각의 느린 커밋 그 자체의 발생 여부나, context에서 벗어난 컴포넌트에 대해 아는 것은 그다지 유용하지 않다는 것을 깨달았습니다. 실제로 느린 커밋의 원인을 아는 것이 더 유용합니다. 그리고 개발자는 특정 상호 작용(예: 버튼 클릭, 초기 로드 또는 페이지 탐색)을 추적하여 성능을 회귀적으로 관찰하고 상호 작용이 느린 이유와 해결 방법을 이해할 수 있기를 원합니다.

이전에는 [인터랙션 추적 API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16)를 만들어 이 문제를 해결하려고 했지만, 이 API는 근본적인 설계 결함으로 인해 인터랙션이 느린 이유를 추적하는 정확도가 떨어지고 때로는 인터랙션이 끝나지 않는 경우가 있었습니다. 결국 이러한 문제로 인해 이 [API를 제거](https://github.com/facebook/react/pull/20037)하게 되었습니다.

이러한 문제를 해결하는 새로운 버전의 인터랙션 추적 API(`startTransition`을 통해 시작되므로 가칭 트랜지션 추적이라고 함)를 개발 중입니다.

## 새로운 React 문서 {/*new-react-docs*/}

작년에 우리는 새로운 React 문서 웹사이트의 베타 버전([나중에 react.dev로 출시](/blog/2023/03/16/introducing-react-dev))을 발표했습니다. 새로운 학습 자료는 Hooks를 먼저 가르치고 새로운 다이어그램, 일러스트레이션, 많은 대화형 예제 및 과제를 포함합니다. 우리는 React 18 릴리스에 집중하기 위해 해당 작업에서 잠시 휴식을 취했지만 이제 React 18이 출시되었으므로 새 문서를 완료하고 제공하기 위해 적극적으로 노력하고 있습니다.

신규 및 숙련된 React 사용자 모두에게 더 어려운 주제 중 하나라고 들었기 때문에 현재 effect에 대한 자세한 섹션을 작성하고 있습니다. [effect와 동기화](/learn/synchronizing-with-effects)는 시리즈의 첫 번째 게시된 페이지이며 다음 주에 더 많은 페이지가 추가될 예정입니다. effect에 대한 자세한 섹션을 처음 작성하기 시작했을 때 React에 새로운 프리미티브를 추가하여 많은 일반적인 effect 패턴을 단순화할 수 있다는 것을 깨달았습니다. [useEvent RFC](https://github.com/reactjs/rfcs/pull/220)에서 이에 대한 몇 가지 초기 생각을 공유했습니다. 현재 초기 연구 단계에 있으며 여전히 아이디어를 반복하고 있습니다. 지금까지 RFC에 대한 커뮤니티의 의견과 진행 중인 문서 재작성에 대한 [피드백](https://github.com/reactjs/reactjs.org/issues/3308) 및 기여에 감사드립니다. 새로운 웹 사이트 구현에 대한 많은 개선 사항을 제출하고 검토한 [Harish Kumar](https://github.com/harish-sethuraman)에게 특별히 감사드립니다.

*이 블로그 게시물을 검토해 주신 [Sophie Alpert](https://twitter.com/sophiebits)에게 감사드립니다!*
