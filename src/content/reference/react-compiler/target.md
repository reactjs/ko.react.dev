---
title: target
---

<Intro>

`target` 옵션은 컴파일러가 어떤 React 버전을 위한 코드를 생성해야 하는지 지정합니다.

</Intro>

```js
{
  target: '19' // or '18', '17'
}
```

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `target` {/*target*/}

컴파일된 출력의 React 버전 호환성을 설정합니다.

#### 타입 {/*type*/}

```
'17' | '18' | '19'
```

#### 기본값 {/*default-value*/}

`'19'`

#### 유효한 값 {/*valid-values*/}

- **`'19'`**: React 19를 대상으로 합니다 (기본값). 추가 런타임이 필요하지 않습니다.
- **`'18'`**: React 18을 대상으로 합니다. `react-compiler-runtime` 패키지가 필요합니다.
- **`'17'`**: React 17을 대상으로 합니다. `react-compiler-runtime` 패키지가 필요합니다.

#### 주의 사항 {/*caveats*/}

- 숫자가 아닌 문자열 값을 사용하세요. (예: `17`이 아닌 `'17'`)
- 패치 버전은 포함하지 마세요. (예: `'18.2.0'`이 아닌 `'18'`을 사용)
- React 19는 컴파일러 런타임 API가 내장되어 있습니다.
- React 17과 18은 `react-compiler-runtime@latest` 설치가 필요합니다.

---

## 사용법 {/*usage*/}

### React 19 대상으로 하기 (기본값) {/*targeting-react-19*/}

React 19의 경우 특별한 설정이 필요하지 않습니다.

```js
{
  // defaults to target: '19'
}
```

컴파일러는 React 19의 내장 런타임 API를 사용합니다.

```js
// 컴파일된 출력은 React 19의 네이티브 API를 사용합니다.
import { c as _c } from 'react/compiler-runtime';
```

### React 17 또는 18 대상으로 하기 {/*targeting-react-17-or-18*/}

React 17과 React 18 프로젝트의 경우 두 단계가 필요합니다.

1. 런타임 패키지를 설치합니다.

```bash
npm install react-compiler-runtime@latest
```

2. `target`을 설정합니다.

```js
// For React 18
{
  target: '18'
}

// For React 17
{
  target: '17'
}
```

컴파일러는 두 버전 모두에 대해 폴리필 런타임을 사용합니다.

```js
// 컴파일된 출력은 폴리필을 사용합니다.
import { c as _c } from 'react-compiler-runtime';
```

---

## 문제 해결 {/*troubleshooting*/}

### 컴파일러 런타임 누락에 관한 런타임 오류 {/*missing-runtime*/}

"Cannot find module 'react/compiler-runtime'"와 같은 오류가 표시되는 경우에는 다음과 같이 합니다.

1. React 버전을 확인합니다.
   ```bash
   npm why react
   ```

2. React 17 또는 18을 사용하는 경우 런타임을 설치합니다.
   ```bash
   npm install react-compiler-runtime@latest
   ```

3. `target`이 React 버전과 일치하는지 확인합니다.
   ```js
   {
     target: '18' // React 메이저 버전과 일치해야 합니다
   }
   ```

### 런타임 패키지가 작동하지 않는 경우 {/*runtime-not-working*/}

런타임 패키지가 다음 조건을 만족하는지 확인하세요.

1. 프로젝트에 설치되어 있어야 합니다. (전역이 아닌)
2. `package.json`의 `dependencies`에 나열되어 있어야 합니다.
3. 올바른 버전이어야 합니다. (`@latest` 태그)
4. `devDependencies`에 있으면 안 됩니다. (런타임에 필요합니다)

### 컴파일된 출력 확인하기 {/*checking-output*/}

올바른 런타임이 사용되고 있는지 확인하려면 서로 다른 import를 주목하세요. (내장의 경우 `react/compiler-runtime`, 17/18용 독립 패키지의 경우 `react-compiler-runtime`)

```js
// React 19용 (내장 런타임)
import { c } from 'react/compiler-runtime'
//                      ^

// React 17/18용 (폴리필 런타임)
import { c } from 'react-compiler-runtime'
//                      ^
```
