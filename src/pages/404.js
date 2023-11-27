/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: '페이지를 찾을 수 없습니다'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>요청하신 페이지가 존재하지 않습니다.</P>
          <P>
            저희 잘못으로 인한 오류라면{', '}
            수정할 수 있도록{' '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
            저희에게 알려주세요
            </A>
            {'. '}
            
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
