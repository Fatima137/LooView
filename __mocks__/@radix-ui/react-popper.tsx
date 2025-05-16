import * as React from 'react';

export const Popper = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

export const createPopperScope = () => {
  return () => ({});
};

export const PopperAnchor = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

export const PopperContent = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

export const PopperArrow = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));