---
title: 컴포넌트 import 및 export 하기
---

<Intro>

컴포넌트의 가장 큰 장점은 재사용성으로 컴포넌트를 조합해 또 다른 컴포넌트를 만들 수 있습니다. 컴포넌트를 여러 번 중첩하게 되면 다른 파일로 분리해야 하는 시점이 생깁니다. 이렇게 분리하면 나중에 파일을 찾기 더 쉽고 재사용하기 편리해집니다.

</Intro>

<YouWillLearn>

* Root 컴포넌트란
* 컴포넌트를 import 하거나 export 하는 방법 
* 언제 default 또는 named imports와 exports를 사용할지
* 한 파일에서 여러 컴포넌트를 import 하거나 export 하는 방법
* 여러 컴포넌트를 여러 파일로 분리하는 방법

</YouWillLearn>

## Root 컴포넌트란 {/*the-root-component-file*/}

[첫 컴포넌트](/learn/your-first-component)에서 만든 `Profile` 컴포넌트와 `Gallery` 컴포넌트는 아래와 같이 렌더링 됩니다.

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

이 예제의 컴포넌트들은 모두 `App.js`라는 **root 컴포넌트 파일**에 존재합니다. [Create React App](https://create-react-app.dev/)에서는 앱 전체가 `src/App.js`에서 실행됩니다. 설정에 따라 root 컴포넌트가 다른 파일에 위치할 수도 있습니다. Next.js처럼 파일 기반으로 라우팅하는 프레임워크일 경우 페이지별로 root 컴포넌트가 다를 수 있습니다.

## 컴포넌트를 import 하거나 export 하는 방법 {/*exporting-and-importing-a-component*/}

랜딩 화면을 변경하게 되어 과학자들이 아니라 과학책으로 변경하거나 프로필 사진을 다른 곳에서 사용하게 된다면 `Gallery` 컴포넌트와 `Profile` 컴포넌트를 root 컴포넌트가 아닌 다른 파일로 옮기는 게 좋습니다. 그렇게 변경하면 재사용성이 높아 컴포넌트를 모듈로 사용할 수 있습니다. 컴포넌트를 다른 파일로 이동하려면 세 가지 단계가 있습니다.

1. 컴포넌트를 추가할 JS 파일을 **생성**합니다.
2. 새로 만든 파일에서 함수 컴포넌트를 **export** 합니다. ([default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) 또는 [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) export 방식을 사용합니다)
3. 컴포넌트를 사용할 파일에서 **import** 합니다. (적절한 방식을 선택해서 [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) 또는 [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)로 import 합니다)

아래 예제를 보면 `App.js` 파일에서 `Profile`과 `Gallery` 컴포넌트를 빼서 새로운 `Gallery.js` 파일로 옮겼습니다. 이제 `Gallery`는 `Gallery.js`에서 import 해서 사용할 수 있습니다.


<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

이제 이 예제에서는 컴포넌트들이 두 파일로 나뉘게 되었습니다.

1. `Gallery.js`:
     - `Profile` 컴포넌트를 정의하고 해당 파일에서만 사용되기 때문에 export 되지 않습니다.
     - **Default** 방식으로 `Gallery` 컴포넌트를 export 합니다.
2. `App.js`:
     - **Default** 방식으로 `Gallery`를 `Gallery.js`로부터 **import** 합니다.
     - Root `App` 컴포넌트를 **default** 방식으로 **export** 합니다.


<Note>

가끔 `.js`와 같은 파일 확장자가 없는 때도 있습니다.

```js 
import Gallery from './Gallery';
```

React에서는 `'./Gallery.js'` 또는 `'./Gallery'` 둘 다 사용할 수 있지만 전자의 경우가 [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) 사용 방법에 더 가깝습니다.

</Note>

<DeepDive title="Default와 Named Exports">

보통 JavaScript에서는 default와 named export라는 두 가지 방법으로 값을 export 합니다. 지금까지의 예제에서는 default export만 사용했지만 두 방법 다 한 파일에서 사용할 수도 있습니다. **다만 한 파일에서는 하나의 _default_ export만 존재할 수 있고 _named_ export는 여러 개가 존재할 수 있습니다.**

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

Export 하는 방식에 따라 import 하는 방식이 정해집니다. Default export로 한 값을 named import로 가져오려고 하려면 에러가 발생합니다. 아래 표에는 각각의 경우의 문법이 정리되어 있습니다.

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

_Default_ import를 사용하는 경우 원한다면 `import` 단어 후에 다른 이름으로 값을 가져올 수 있습니다. 예를 들어 `import Banana from './button.js'` 라고 쓰더라도 같은 default export 값을 가져오게 됩니다. 반대로 named import를 사용할 때는 양쪽 파일에서 사용하고자 하는 값의 이름이 같아야 해서 _named_ import라고 불립니다.

**보편적으로 한 파일에서 하나의 컴포넌트만 export 할 때 default export 방식을 사용하고 여러 컴포넌트를 export 할 경우엔 named export 방식을 사용합니다.** 어떤 방식을 사용하든 컴포넌트와 파일의 이름을 의미 있게 명명하는 것은 중요합니다. `export default () => {}` 처럼 이름 없는 컴포넌트는 나중에 디버깅하기 어렵기 때문에 권장하지 않습니다.

</DeepDive>

## 한 파일에서 여러 컴포넌트를 import 하거나 export 하는 방법 {/*exporting-and-importing-multiple-components-from-the-same-file*/}

전체 갤러리가 아니라 하나의 `Profile`만 사용하고 싶을 때 `Profile` 컴포넌트만 export 하면 됩니다. 하지만 `Gallery.js` 파일에는 이미 하나의 *default* export가 존재하기 때문의 _두 개의_ default export를 정의할 수 없습니다. 이런 경우 새로운 파일 하나를 더 생성해서 default export를 사용하거나 *named* export로 `Profile` 컴포넌트를 export 할 수 있습니다. **한 파일에서는 단 하나의 default export만 사용할 수 있지만 named export는 여러 번 사용할 수 있습니다.**


먼저 named export 방식을 사용해서 `Gallery.js` 파일에서 `Profile` 컴포넌트를 **export** 합니다. (`default` 키워드를 사용하지 않습니다)

```js
export function Profile() {
  // ...
}
```

그 다음엔 named import 방식으로 `Gallery.js` 파일에서 `Profile` 컴포넌트를 `App.js` 파일로 **import** 합니다. (중괄호를 사용합니다)

```js
import { Profile } from './Gallery.js';
```

마지막으로 `<Profile />`을 `App` 컴포넌트에서 **렌더링**합니다.

```js
export default function App() {
  return <Profile />;
}
```

이제 `Gallery.js`에는 default `Gallery` export랑 named `Profile` export라는 두 가지의 export가 존재합니다. `App.js`에서는 두 컴포넌트를 import 해서 사용합니다. 아래의 예제에서 `<Profile />`과 `<Gallery />`를 교차해서 사용해 보세요.

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

이제 default와 named export 방식 둘 다 사용할 수 있게 됐습니다.

* `Gallery.js`:
  - **Named export** 방식으로 `Profile`이라는 이름의 컴포넌트를 export 합니다.
  - **Default export** 방식으로 `Gallery` 컴포넌트를 export 합니다.
* `App.js`:
  - `Gallery.js`에서 **named import** 방식으로 `Profile` 컴포넌트를 import 합니다.
  - `Gallery.js`에서 **default import** 방식으로 `Gallery` 컴포넌트를 import 합니다.
  - **Default export** 방식으로 `App` 컴포넌트를 export 합니다.

<Recap>

이 페이지에서 배우게 된 것들입니다.

* Root 컴포넌트란 무엇인지
* 컴포넌트를 import 하거나 export 하는 방법 
* 언제 default 또는 named imports와 exports를 사용할지
* 한 파일에서 여러 컴포넌트를 export 하는 방법

</Recap>



<Challenges>

### 컴포넌트를 한 단계 더 분리하기 {/*split-the-components-further*/}

현재 `Gallery.js` 파일이 `Profile`과 `Gallery`를 두 다 export 해서 헷갈리게 할 수 있습니다.

`Profile.js` 파일을 생성해서 `Profile` 컴포넌트를 해당 파일로 옮기고 `App` 컴포넌트에서는 `<Profile />`과 `<Gallery />`를 각각 렌더링하게 변경합니다.

Default 또는 named export를 사용해서 `Profile`을 export 할 수 있습니다. 다만 주의할 점은 사용한 export 방식에 맞는 import 문법을 사용해야 한다는 점입니다. 아래 문법 표는 위 deep dive에서 인용했습니다.

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

컴포넌트를 사용하는 모든 파일에서 import 해야 합니다. `Gallery`에서도 `Profile`을 사용합니다.

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Export 방식 중 하나를 사용했으면 다른 방식으로도 동작하게 시도해 보세요.

<Solution>

다음은 named export를 사용했을 경우의 해법입니다.

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

다음은 default export를 사용했을 경우의 해법입니다.

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>