import React from 'react';

export const Root = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ children, ...props }, ref) => {
  return (
  <div ref={ref} {...props}>
    {children}
  </div>
)});

Root.displayName = 'RadioGroup';

export const Item = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ children, ...props }, ref) => {
  return (
  <button ref={ref} {...props}>
    {children}
  </button>
)});

Item.displayName = 'RadioGroupItem';


export const Indicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ children, ...props }, ref) => {
  return (
  <span ref={ref} {...props}>
    {children}
  </span>
)});

Indicator.displayName = 'RadioGroupIndicator';

export const RadioGroupPrimitive = {
  Root,
  Item,
};