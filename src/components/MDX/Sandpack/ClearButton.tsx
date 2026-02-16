/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconClose} from '../../Icon/IconClose';
export interface ClearButtonProps {
  onClear: () => void;
}

export function ClearButton({onClear}: ClearButtonProps) {
  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={onClear}
      title="모든 편집 내용을 지우고 샌드박스를 다시 로딩합니다."
      type="button">
      <IconClose className="inline mx-1 relative" />
      <span className="hidden md:block">초기화</span>
    </button>
  );
}
