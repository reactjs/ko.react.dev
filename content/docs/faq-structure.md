---
id: faq-structure
title: 파일 구조
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### React 프로젝트 구조를 설계하기 위해 추천할 만한 방법이 있을까요? {#is-there-a-recommended-way-to-structure-react-projects}

React는 파일을 어떤 식으로 폴더에 분류할 것인지에 대해서 제시하고 있지는 않습니다. 그러나 React 생태계 내에서 고려할만한 몇 가지 인기 있는 일반적인 접근법들이 있습니다.

#### 파일의 기능이나 라우트에 의한 분류 {#grouping-by-features-or-routes}

프로젝트 구조에 대한 일반적인 방법 중 하나는 CSS, JS 그리고 테스트 파일을 기능이나 라우트로 분류된 폴더에 같이 두는 방법입니다.

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

"기능"의 정의는 보편적인 것이 아닙니다. 그것은 얼마나 세분화할 것인지에 달려 있습니다. 최상위 폴더 리스트를 생각해낼 수 없다면, 서비스 사용자들에게 해당 서비스를 구성하는 중요한 부분이 무엇인지 물어볼 수 있습니다. 그리고 사용자들의 의견을 토대로 만들어진 구조를 청사진으로 사용할 수 있습니다.

#### 파일 유형에 의한 분류 {#grouping-by-file-type}

프로젝트 구조를 정하는 또다른 인기 있는 방법은 비슷한 파일끼리 묶어주는 것입니다. 아래 예시를 참고하세요.

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

어떤 사람들은 더 나아가서 해당 애플리케이션 내에서의 역할에 따라 컴포넌트를 다른 폴더로 분리하는 것을 선호합니다. 예를 들어 [아토믹 디자인](http://bradfrost.com/blog/post/atomic-web-design/)은 이와 같은 원칙에 기반한 디자인 방법론입니다. 지켜야 할 엄격한 규칙이라기보다 도움이 되는 예시로 이러한 방법론을 활용하는 것은 종종 더욱 생산적이라는 사실을 잊지 마세요.

#### 너무 많은 중첩을 피하세요 {#avoid-too-much-nesting}

JavaScript 프로젝트에서 깊은 디렉토리 중첩과 관련된 문제점들이 많이 있습니다. 프로젝트 간에 상대 경로를 통한 임포트를 작성하거나 또는 파일이 옮겨졌을 때 그러한 임포트들을 업데이트하는 것이 더 어려워집니다. 깊은 폴더 구조를 사용해야 하는 매우 설득력 있는 이유가 없다면, 단일 프로젝트 내에서는 3번 혹은 4번을 최대한으로 폴더를 중첩하도록 제한하는 것을 고려해보세요. 물론 이것은 단지 권장사항일 뿐이며, 당신의 프로젝트와 관련 없을 수도 있습니다. 

#### 너무 깊게 생각하지 마세요 {#dont-overthink-it}

이제 막 프로젝트를 시작하는 단계라면 파일 구조를 선택하는 것에 있어서 [5분 이상 시간을 투자하지 마세요](https://en.wikipedia.org/wiki/Analysis_paralysis). 앞서 살펴본 접근법 중에 아무거나 선택하고(혹은 자신만의 방법을 찾아내세요) 코드를 우선 작성해보세요.

완전히 난관에 봉착해있다면, 모든 파일을 하나의 폴더에 보관하는 방법으로 우선 시작해보세요. 결국에는 프로젝트가 충분히 커져서 일부 파일을 나머지로부터 분리해 보관하기 원하게 될 것입니다. 그 시점까지 어떤 파일들을 가장 자주 묶어서 수정하는지 충분히 알 수 있게 될 것입니다. 일반적으로, 자주 함께 변경되는 파일들을 같이 보관하는 것이 좋은 방법입니다. 이러한 원칙을 "코로케이션(colocation)"이라고 부릅니다.

프로젝트가 커지게 되면서, 실제로는 앞서 언급한 방법들을 섞어서 사용하게 됩니다. 그래서 처음부터 "옳은" 방법 하나를 선택하는 것이 대단히 중요하지는 않습니다.
