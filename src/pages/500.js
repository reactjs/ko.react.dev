/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page
      toc={[]}
      routeTree={sidebarLearn}
      meta={{title: '문제가 발생했습니다'}}>
      <MaxWidth>
        <Intro>
          <P>아주 큰 문제가 발생했습니다.</P>
          <P>불편을 드려 죄송합니다.</P>
          <P>
            가능하시다면{' '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              버그를 신고
            </A>
            해주실 수 있으실까요?
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
