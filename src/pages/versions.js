/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {urlRoot} from 'site-constants';
import {sharedStyles} from 'theme';

// $FlowFixMe This is a valid path
import versions from '../../content/versions.yml';

type Props = {
  location: Location,
};

const Versions = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>React 버전</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/versions/`}
            title="React - Versions"
          />
          <div css={sharedStyles.markdown}>
            <p>
              React의 전체 배포 기록을{' '}
              <a
                href="https://github.com/facebook/react/releases"
                target="_blank"
                rel="noopener">
                GitHub
              </a>
<<<<<<< HEAD
              에서 살펴보세요.
              <br />
              최근 배포에 대한 문서도 아래에서 찾을 수 있습니다.
=======
              .<br />
              Changelogs for recent releases can also be found below.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
            </p>
            <blockquote>
              <p>Note</p>
              <p>
                The current docs are for React 18. For React 17, see{' '}
                <a href="https://17.reactjs.org">https://17.reactjs.org.</a>
              </p>
            </blockquote>
            <p>
              <a href="/docs/faq-versioning.html">
                버전 관리 정책 및 안정성에 대한 약속
              </a>
              에 대한 정보는 FAQ를 참조하세요.
            </p>
            {versions.map(version => (
              <div key={version.title}>
                <h3>{version.title}</h3>
                <ul>
                  <li>
                    <a href={version.changelog} target="_blank" rel="noopener">
                      변경 로그
                    </a>
                  </li>
                  {version.path && (
                    <li>
                      <a href={version.path} rel="nofollow">
                        문서
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Versions;
