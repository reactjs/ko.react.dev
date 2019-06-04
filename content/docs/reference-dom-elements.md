---
id: dom-elements
title: DOM Elements
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React는 성능 및 브라우저 간 호환성을 위해 브라우저의 독립적인 DOM 시스템을 구현합니다. React에서는 브라우저의 DOM 구현에서 몇 가지 어려운 부분을 정리할 수가 있었습니다.

React에서 모든 프로퍼티 및 어트리뷰트(이벤트 핸들러 포함)은 캐멀 케이스를 사용합니다. 
예를 들어 HTML 어크리뷰트인 `tabindex`는 React의 `tabIndex`으로 표현합니다. 예외는 `aria-*` 및 `data-*` 어트리뷰트입니다. 이는 소문자로 표현합니다. 예를 들어, `aria-label`은 `aria-label`로 동일하게 유지됩니다.

## 어트리뷰트의 차이 {#differences-in-attributes}

React와 HTML 사이에는 다르게 작동하는 여러가지의 어트리뷰트들이 있습니다.

### checked {#checked}

`checked` 어트리뷰트는 `checkbox` 또는 `radio` 타입의 `<input>` 컴포넌트에 의해 지원됩니다. 이 어트리뷰트를 사용해서 컴포넌트의 선택 여부를 설정할 수 있습니다. 이는 제어 컴포넌트를 만들 때 유용합니다. `defaultChecked`는 컴포넌트가 사용되는 동등한 의미를 가지는 어트리뷰트이며 컴포넌트가 처음 마운트될 때 선택 여부를 설정합니다.

### className {#classname}

CSS class를 사용하려면 `className` 어트리뷰트를 사용하십시오. 
이는 `<div>`, `<a>` 등과 같은 모든 일반적인 DOM 및 SVG 엘리먼트에 적용됩니다. 웹 컴포넌트 React with Web Components (which is uncommon)을 사용하는 경우 `class` 속성을 사용하세요.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML`은 브라우저 DOM에서 `innerHTML`을 사용하기 위한 React의 대체 방법입니다. 일반적으로 코드에서 HTML을 설정하는 것은 [사이트 간 스크립팅](https://ko.wikipedia.org/wiki/사이트_간_스크립팅) 공격에 쉽게 노출될 수 있기 때문에 위험합니다. 따라서 React에서 직접 HTML을 설정할 수는 있지만, 위험하다는 것을 상기시키기 위해 `dangerouslySetInnerHTML`을 작성하고 `__html` 키로 객체를 전달해야 합니다. 아래는 예시입니다.

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

`for`는 JavaScript에서 예약어이므로 React에서는 해당 요소를 `htmlFor`로 대체하여 사용합니다.

### onChange {#onchange}

필드가 변경될때 실행되는 이벤트입니다. 일반적으로 알고있는 onChanage이벤트를 사용하지않습니다.
왜냐하면 `onChange`는 해당 이벤트에 대한 잘못된 명칭이며 React는 사용자 입력에 의한 실시간으로 처리하는 이벤트를 제공합니다.  

### selected {#selected}

`selected` 속성은 `<option>`구성 요소에 의해 지원됩니다. 이 컴포넌트를 사용하여 구성 요소의 선택 여부를 설정할 수 있습니다. 이는 제어 컴포넌트를 빌드하는데 유용합니다.

### style {#style}

>Note
>
>문서의 일부 예제는 편의상 style을 사용하지만, **style 속성을 스타일링의 주요 수단으로 사용하는 것은 일반적으로 권장되지 않습니다**. 대부분의 경우 [`className`](#classname) 외부 CSS stylesheet에 정의 된 class를 참조하는데 사용해야 합니다. `style`을 동적 어플리케이션 계산된 스타일을 추가하는데에 가장 자주 사용됩니다. 참조 [FAQ: Styling and CSS](/docs/faq-styling.html).

`style` 속성은 CSS 문자열 대신 캐멀 케이스 속성을 가진 JavaScript 객체로 받아들입니다. 
이 속성은 DOM 스타일의 JavaScript 속성과 일치하며 더 효율적입니다 그리고  XSS 보안 허점을 방지합니다. 
아래는 예시입니다:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

스타일에는 autoprefixer가 붙지 않습니다. 구형 브라우저에서 사용하려면 해당 스타일 속성을 입력해야 합니다.

```js
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

스타일 키는 JS에서 DOM 노드의 속성에 액세스하는 것과 일관되게 유지하기 위해 캐멜 케이스를 사용합니다. (예 :`node.style.backgroundImage`). 공급 업체 [`ms` 이외](https://www.andismith.com/blog/2012/02/modernizr-prefixed/) 구분하여 대문자로 시작해야 합니다. 이것이 바로 `WebkitTransition`이 대문자 "W"를 갖는 이유입니다.

React는 특정 속성에서는 "px" 단위를 자동으로 추가합니다. "px" 이외의 원하는 단위를 사용하려면 문자열로 값을 직접 입력해야 합니다. 아래는 예시입니다:

```js
// Result style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Result style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```

모든 스타일 속성이 픽셀 문자열로 변환되는 것은 아닙니다. 어떤 속성들은 단위가 없습니다 (예 :`zoom`,`order`,`flex`). 단위 속성의 전체 목록을 확입하십시오. [here](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

일반적으로, 자식이 있는 요소도 `contentEditable`로 표시 될 때 작동하지 않으므로 경고가 표시됩니다. 이 속성은 경고를 표시하지 않습니다. `contentEditable`을 수동으로 관리하는 [Draft.js](https://facebook.github.io/draft-js/)와 같은 라이브러리를 빌드하지 않는 한이 옵션으로 사용하지 마십시오.

### suppressHydrationWarning {#suppresshydrationwarning}

서버 사이드 렌더링을 사용하는 경우, 일반적으로 서버와 클라이언트가 다른 내용을 렌더링 되었을 경우 경고가 표시됩니다. 그러나 드물기는 하지만 정확한 일치를 보장하는 것은 매우 어렵거나 불가능합니다. 예를 들어 타임 스탬프 같은 경우 서버와 클라이언트에서는 다를 것으로 예상됩니다.

`suppressHydrationWarning`을 `true`로 설정하면, React는 속성과 그 요소의 내용의 불일치에 대해 경고하지 않습니다. 한 단계 깊숙이 작동하며 탈출구로 사용하도록 되어 있습니다. 그것을 남용하지 마십시오. 상호작용에 대한 자세한 내용은 [`ReactDOM.hydrate()` documentation](/docs/react-dom.html#hydrate)를 참조하십시오.

### value {#value}

`value` 속성은 `<input>`과 `<textarea>` 컴포넌트에 의해 지원됩니다. 이 매개 변수를 사용하여 구성 요소의 값을 설정할 수 있습니다. 이는 제어 컴포넌트 구성 요소를 빌드하는 데 유용합니다. `defaultValue`는 제어되지 않는 동등한 것으로, 최초 마운트 될 때 컴포넌트의 값을 설정합니다.

## All Supported HTML Attributes {#all-supported-html-attributes}

React 16부터는 모든 표준 [또는 사용자 정의](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM 속성이 완벽하게 지원됩니다.

React는 항상 자바스크립트 중심 API를 DOM에 제공했습니다. React 컴포넌트는 종종 커스텀과 DOM 관련 props를 모두 사용하기 때문에 React 캐멀 케이스는 DOM API와 마찬가지로 규칙을 사용한다 .

```js
<div tabIndex="-1" />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API
```

이러한 props는 위에 설명 된 특별한 경우를 제외하고는 해당 HTML 속성과 유사하게 작동합니다.

React가 지원하는 DOM 속성 중 일부는 다음과 같습니다.

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

마찬가지로, 모든 SVG 특성이 완벽하게 지원됩니다.

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

또한 완전히 소문자인 경우 사용자 지정 특성을 사용할 수도 있습니다.
