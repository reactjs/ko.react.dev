/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cn from 'classnames';
import type {RouteTag} from './Layout/getRouteMeta';

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
    name: '심화',
    classes: 'bg-green-40 text-white',
  },
  experimental: {
    name: '실험적',
    classes: 'bg-ui-orange text-white',
  },
  deprecated: {
    name: '더 이상 사용되지 않음',
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
