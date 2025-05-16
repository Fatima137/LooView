import * as React from 'react';

export const Accordion = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <div ref={ref} data-radix-accordion {...props}>
    {children}
  </div>
)); 

export const AccordionItem = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <div ref={ref} data-radix-accordion-item {...props}>{children}</div>
));
AccordionItem.__esModule = true;

export const AccordionTrigger = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <button ref={ref} data-radix-accordion-trigger {...props}>{children}</button>
));

export const AccordionContent = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <div ref={ref} data-radix-accordion-content {...props}>{children}</div>
));

// Mock AccordionPrimitive with necessary properties for displayName access
export const AccordionPrimitive = {
 Accordion: Accordion,
 AccordionItem: AccordionItem,
 AccordionTrigger: AccordionTrigger,
 AccordionContent: AccordionContent,
};

// Assign displayNames for better debugging if needed (optional for this fix, but good practice)
Accordion.displayName = 'AccordionMock';
AccordionItem.displayName = 'AccordionItemMock';
AccordionTrigger.displayName = 'AccordionTriggerMock';
AccordionContent.displayName = 'AccordionContentMock';

// Add mocks for other components as needed based on the error messages
export const Label = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <label ref={ref} {...props}>
  {children}</label>
));

// You would need to add similar mocks for SelectBubbleInput, StarRating, and components from react-radio-group
// For example:
export const SelectBubbleInput = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <input ref={ref} {...props} />
));

// Mock for StarRating component (assuming it's a simple div for the mock)
export const StarRating = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

// Mocks for react-radio-group components (assuming simple div/button mocks)
export const RadioGroup = React.forwardRef(({ children, ...props }: any, ref: any) => (<div ref={ref} {...props}>{children}</div>));

export const RadioGroupItem = React.forwardRef(({ children, ...props }: any, ref: any) => (
  <button ref={ref} {...props}>
    {children}</button>
));