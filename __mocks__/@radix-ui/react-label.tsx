import * as React from 'react';

const LabelPrimitive = { Root: { displayName: 'LabelRoot' } };

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<'label'>
>((props, ref) => {
  return <label ref={ref} {...props} />;
});

Label.displayName = LabelPrimitive.Root.displayName;

export { LabelPrimitive };