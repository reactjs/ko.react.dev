// `sources`에 속한 단어들은 특수한 경우를 제외하고는 기본적으로 '원자성'을 유지해야 합니다. ex) 'stateless component'(x) -> 'stateless'(O), 'component'(O)
// 단, `-`(dash)로 이어진 단어 ex) 'full-stack'은 한개의 단어로 취급합니다.
module.exports = {
  translated: {
    react: [
      {
        sources: [/\bTutorial\b/, /[듀튜]토리얼/],
        target: '자습서',
        meta: {
          term: 'Tutorial',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bDeclarative\b/],
        target: '선언적인',
        meta: {
          term: 'Declarative',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bComponent\b/, /컴퍼넌트/, /컴포넌츠/],
        target: '컴포넌트',
        meta: {
          term: 'Component',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bStateful\b/],
        target: '유상태',
        meta: {
          term: 'Stateful',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bStateless\b/],
        target: '무상태',
        meta: {
          term: 'Stateless',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [
          /\bRender(?!er)(?:ing)?\b/,
          /랜더링/,
          /[렌랜]더(?!링)\s?[하한할함합]/,
        ],
        target: '렌더링(하다)',
        meta: {
          term: 'Render',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bData\b/, /대이터/],
        target: '데이터',
        meta: {
          term: 'Data',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bApplication\b/, /어플리케이[선션]/, /응용\s?프로그램/],
        target: '애플리케이션',
        meta: {
          term: 'Application',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bExternal\b/],
        target: '외부',
        meta: {
          term: 'External',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bPlugin\b/],
        target: '플러그인',
        meta: {
          term: 'Plugin',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bThird\b/, /써드/],
        target: '서드',
        meta: {
          term: 'Third',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bSyntax\b/, /[신씬]택스/],
        target: '문법',
        meta: {
          term: 'Syntax',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bEmbedding\s?Expression\b/],
        target: '표현식 포함하기',
        meta: {
          term: 'Embedding Expression',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bAttribute\b/, /애트리뷰트/],
        target: '어트리뷰트',
        meta: {
          term: 'Attribute',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bElement\b/, /[엘앨]리먼츠/, /앨리먼트/],
        target: '엘리먼트',
        meta: {
          term: 'Element',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bFunction(?:al)?\b/],
        target: '함수',
        meta: {
          term: 'Function',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bClass\b/],
        target: '클래스',
        meta: {
          term: 'Class',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bComposition\b/, /[컴콤][퍼포]지[선션]/],
        target: '합성',
        meta: {
          term: 'Composition',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bInheritance\b/],
        target: '상속',
        meta: {
          term: 'Inheritance',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bLife\s?Cycle\b/, /라이프\s?사이클/, /생명 주기/],
        target: '생명주기',
        meta: {
          term: 'Lifecycle',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bHandling\b/, /핸들링/],
        target: '처리',
        meta: {
          term: 'Handling',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bConditional\b/, /컨디[서셔][날널]/],
        target: '조건부',
        meta: {
          term: 'Conditional',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bOperator\b/, /오퍼[레래]이터/],
        target: '연산자',
        meta: {
          term: 'Operator',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bReuse\b/],
        target: '재사용',
        meta: {
          term: 'Reuse',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bMock\b/],
        target: '모의',
        meta: {
          term: 'Mock',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bCallback\b/],
        target: '콜백',
        meta: {
          term: 'Callback',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bSynthetic\b/],
        target: '합성',
        meta: {
          term: 'Synthetic',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bEvent\b/],
        target: '이벤트',
        meta: {
          term: 'Event',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bHigher\s?Order\b/],
        target: '고차',
        meta: {
          term: 'Higher Order',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\b(?<!Un)Mount\b/],
        target: '마운트',
        meta: {
          term: 'Mount',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bUnmount\b/, /언마운트/],
        target: '마운트 해제',
        meta: {
          term: 'Unmount',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bForm\b/],
        target: '폼',
        meta: {
          term: 'Form',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bWrapper\b/],
        target: '래퍼',
        meta: {
          term: 'Wrapper',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bChild(?:ren)?\b/],
        target: '자식',
        meta: {
          term: 'Children',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bCode[-\s]?Splitting\b/],
        target: '코드 분할',
        meta: {
          term: 'Code-Splitting',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bReconciliation\b/],
        target: '재조정',
        meta: {
          term: 'Reconciliation',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bPropert(?:y|ies)\b/],
        target: '프로퍼티',
        meta: {
          term: 'Property',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bReference\b/, /래퍼런스/],
        target: '레퍼런스',
        meta: {
          term: 'Reference',
          discussions: [569],
          note: '',
        },
      },
      {
        sources: [/\bUser\b/, /유저/],
        target: '사용자',
        meta: {
          term: 'User',
          discussions: [569],
          note: '',
        },
      },
      {
        sources: [/\bInterface\b/],
        target: '인터페이스',
        meta: {
          term: 'Interface',
          discussions: [569],
          note: '',
        },
      },
      {
        sources: [/\bMarkup\b/, /마크 업/],
        target: '마크업',
        meta: {
          term: 'Markup',
          discussions: [569],
          note: '',
        },
      },
      {
        sources: [/\bInteracti(?:vity|on)\b/, /인터[랙렉][선션]/],
        target: '상호작용',
        meta: {
          term: 'Interactivity',
          discussions: [569],
          note: '',
        },
      },
      {
        sources: [/\bArchitecture\b/, /아키택처/, /아키[택텍]쳐/],
        target: '아키텍처',
        meta: {
          term: 'Architecture',
          discussions: [569],
          note: '',
        },
      },
      {
        sources: [/\bFull[-\s]?Stack\b/],
        target: '풀스택',
        meta: {
          term: 'Full-Stack',
          discussions: [569],
          note: '',
        },
      },
      {
        sources: [/\bBrowser\b/],
        target: '브라우저',
        meta: {
          term: 'Browser',
          discussions: [610],
          note: '',
        },
      },
      {
        sources: [/\bExtension\b/, /확장프로그램/],
        target: '확장 프로그램',
        meta: {
          term: 'Extension',
          discussions: [610],
          note: '',
        },
      },
      {
        sources: [/\bEscape[-\s]?Hatches\b/],
        target: '탈출구',
        meta: {
          term: 'Escape Hatches',
          discussions: [738],
          note: '',
        },
      },
      {
        sources: [/\bBundles?\b/],
        target: '번들',
        meta: {
          term: 'Bundle',
          discussions: [829],
          note: '',
        },
      },
      {
        sources: [/\bBundlers?\b/],
        target: '번들러',
        meta: {
          term: 'Bundler',
          discussions: [829],
          note: '',
        },
      },
      {
        sources: [/\bBundling\b/],
        target: '번들링',
        meta: {
          term: 'Bundling',
          discussions: [829],
          note: '',
        },
      },
    ],
    others: [
      {
        sources: [/\bTips?\b/],
        target: '팁',
        meta: {
          term: 'Tip',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bExamples?\b/, /예제/],
        target: '예시',
        meta: {
          term: 'Example',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bChapters?\b/, /[챕쳅]터/],
        target: '장',
        meta: {
          term: 'Chapter',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bSpec(?:ification)?s?\b/, /스[펙팩]/],
        target: '명세',
        meta: {
          term: 'Specification',
          discussions: [2],
          note: 'Spec도 동일하게 번역',
        },
      },
      {
        sources: [/\bcamel\s?Case\b/, /[캐카][맬멜]\s?케이스/],
        target: '캐멀 케이스',
        meta: {
          term: 'camelCase',
          discussions: [2],
          note: '',
        },
      },
      {
        sources: [/\bParam(?:eter)?s?\b/, /[파패][라러]미터/, /매개 변수/],
        target: '매개변수',
        meta: {
          term: 'Parameter',
          discussions: [614],
          note: '',
        },
      },
      {
        sources: [/\bDeprecated\b/],
        target: '더 이상 사용되지 않습니다.',
        meta: {
          term: 'Deprecated',
          discussions: [632],
          note: '',
        },
      },
      {
        sources: [/\bPitfall\b/],
        target: '주의하세요!',
        meta: {
          term: 'Pitfall',
          discussions: [632],
          note: '',
        },
      },
      {
        sources: [/\bNote\b/],
        target: '중요합니다!',
        meta: {
          term: 'Note',
          discussions: [632],
          note: '',
        },
      },
      {
        sources: [/\bWip\b/],
        target: '개발중이에요',
        meta: {
          term: 'Wip',
          discussions: [632],
          note: '',
        },
      },
      {
        sources: [/\bReturns\b/, /반환\s+(?:값\s+)?{\//],
        target: '반환값',
        meta: {
          term: 'Returns',
          discussions: [725],
          note: '제목에 사용된 경우',
        },
      },
      {
        sources: [/\bCaveats?\b/, /주의사항/],
        target: '주의 사항',
        meta: {
          term: 'Caveats',
          discussions: [1095],
          note: '',
        },
      },
      {
        sources: [/\bLogic\b/],
        target: '로직',
        meta: {
          term: 'Logic',
          discussions: [695],
          note: '',
        },
      },
      {
        sources: [/\bDependenc(?:y|ies)\b/],
        target: '의존성',
        meta: {
          term: 'Dependency',
          discussions: [841],
          note: '',
        },
      },
      {
        sources: [/\bDirectives?\b/],
        target: '지시어',
        meta: {
          term: 'Directive',
          discussions: [819],
          note: '',
        },
      },
    ],
  },
  // untranslated: {
  //   react: [],
  //   others: [],
  // },
};
