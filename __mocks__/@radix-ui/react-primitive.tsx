import React from 'react';

const createMockPrimitive = (Element: keyof JSX.IntrinsicElements) => {
  // eslint-disable-next-line react/display-name
  const MockComponent = React.forwardRef(({ children, ...props }, ref) => {
    return React.createElement(Element, { ref, ...props }, children);
  });

  // Add a simple SlotClone mock if needed, or rely on passing children
  (MockComponent as any).SlotClone = React.forwardRef(({ children, ...props }, ref) => {
     return React.createElement(Element, { ref, ...props }, children);
  });


  return MockComponent;
};

export const Primitive = {
  div: createMockPrimitive('div'),
  span: createMockPrimitive('span'),
  button: createMockPrimitive('button'),
  h3: createMockPrimitive('h3'),
  // Add other elements as needed based on errors
};

// Add a mock for the Slot component
export const Slot = React.forwardRef(({ children, ...props }: any, ref: any) => {
  return React.createElement('div', { ref, ...props }, children);
});

// You might need to export other things from @radix-ui/react-primitive if errors persist
// For example, if they export types or utility functions.

// If SlotClone is used directly, you might need a dedicated mock for it as well,
// but often Slot handles the rendering of its children which might include SlotClone.
// export const SlotClone = React.forwardRef(({ children, ...props }: any, ref: any) => {
//   return React.createElement('div', { ref, ...props }, children);
// });