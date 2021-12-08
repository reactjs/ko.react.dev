/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {RouteTag} from './Layout/useRouteMeta';

const variantMap = {
  foundation: {
    name: '기초',
    classes: 'bg-yellow-50 text-white',
  },
  intermediate: {
    name: '중급',
    classes: 'bg-purple-40 text-white',
  },
  advanced: {
    name: '고급',
    classes: 'bg-green-40 text-white',
  },
  experimental: {
    name: '실험적인',
    classes: 'bg-ui-orange text-white',
  },
  deprecated: {
    name: '샤용되지 않는',
    classes: 'bg-red-40 text-white',
  },
};

interface TagProps {
  variant: RouteTag;
  text?: string;
  className?: string;
}

function Tag({text, variant, className}: TagProps) {
  const {name, classes} = variantMap[variant];
  return (
    <span className={cn('mr-2', className)}>
      <span
        className={cn(
          'inline font-bold text-sm uppercase py-1 px-2 rounded',
          classes
        )}>
        {text || name}
      </span>
    </span>
  );
}

export default Tag;
