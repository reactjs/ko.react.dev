/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
<<<<<<< HEAD:beta/src/components/MDX/Sandpack/utils.ts
import {useState} from 'react';
import {lintDiagnostic} from './eslint-integration';
import {linter} from '@codemirror/lint';
import type {EditorView} from '@codemirror/view';
=======

>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a:beta/src/components/MDX/Sandpack/createFileMap.ts
import type {SandpackFile} from '@codesandbox/sandpack-react';

export const createFileMap = (codeSnippets: any) => {
  return codeSnippets.reduce(
    (result: Record<string, SandpackFile>, codeSnippet: React.ReactElement) => {
      if (codeSnippet.props.mdxType !== 'pre') {
        return result;
      }
      const {props} = codeSnippet.props.children;
      let filePath; // path in the folder structure
      let fileHidden = false; // if the file is available as a tab
      let fileActive = false; // if the file tab is shown by default

      if (props.metastring) {
        const [name, ...params] = props.metastring.split(' ');
        filePath = '/' + name;
        if (params.includes('hidden')) {
          fileHidden = true;
        }
        if (params.includes('active')) {
          fileActive = true;
        }
      } else {
        if (props.className === 'language-js') {
          filePath = '/App.js';
        } else if (props.className === 'language-css') {
          filePath = '/styles.css';
        } else {
          throw new Error(
            `Code block is missing a filename: ${props.children}`
          );
        }
      }
      if (result[filePath]) {
        throw new Error(
          `File ${filePath} was defined multiple times. Each file snippet should have a unique path name`
        );
      }
      result[filePath] = {
        code: props.children as string,
        hidden: fileHidden,
        active: fileActive,
      };

      return result;
    },
    {}
  );
};

export type LintDiagnostic = {
  line: number;
  column: number;
  severity: 'warning' | 'error';
  message: string;
}[];

export const useSandpackLint = () => {
  const [lintErrors, setLintErrors] = useState<LintDiagnostic>([]);

  const onLint = linter((props: EditorView) => {
    const editorState = props.state.doc;
    return import('./eslint-integration').then((module) => {
      let {errors} = module.lintDiagnostic(editorState);
      // Only show errors from rules, not parsing errors etc
      setLintErrors(errors.filter((e) => !e.fatal));
      return module.lintDiagnostic(editorState).codeMirrorPayload;
    });
  });

  return {lintErrors, onLint};
};
