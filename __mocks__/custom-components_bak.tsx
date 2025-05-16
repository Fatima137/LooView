import React from 'react';

export const FormSection = ({ children, ...props }: any) => {
  return <div data-testid="mock-form-section" {...props}>{children}</div>;
};

export const Accordion = ({ children, ...props }: any) => {
  return <div data-testid="mock-accordion" {...props}>{children}</div>;
};

export const AccordionItem = ({ children, ...props }: any) => {
  return <div data-testid="mock-accordion-item" {...props}>{children}</div>;
};

export const AccordionTrigger = ({ children, ...props }: any) => {
  return <div data-testid="mock-accordion-trigger" {...props}>{children}</div>;
};

export const AccordionContent = ({ children, ...props }: any) => {
  return <div data-testid="mock-accordion-content" {...props}>{children}</div>;
};

export const TooltipProvider = ({ children, ...props }: any) => {
  return <div data-testid="mock-tooltip-provider" {...props}>{children}</div>;
};

export const Input = ({ children, ...props }: any) => {
  return <input data-testid="mock-input" {...props} />;
};

export const Textarea = ({ children, ...props }: any) => {
  return <textarea data-testid="mock-textarea" {...props}>{children}</textarea>;
};

export const Checkbox = (props: any) => {
  return <input type="checkbox" data-testid="mock-checkbox" {...props} />;
}; // ← hier de afsluiting toegevoegd

// Note: de Checkbox-mock kan indien nodig zelfclosend of met wrapper worden aangepast.

export const Label = ({ children, ...props }: any) => {
  return <label data-testid="mock-label" {...props}>{children}</label>;
};

export const FormDescription = ({ children, ...props }: any) => {
  return <div data-testid="mock-form-description" {...props}>{children}</div>;
};

export const Select = ({ children, ...props }: any) => {
  return <div data-testid="mock-select" {...props}>{children}</div>;
};

export const RadioGroup = ({ children, ...props }: any) => {
  return <div data-testid="mock-radio-group" {...props}>{children}</div>;
};

export const Tooltip = ({ children, ...props }: any) => {
  return <div data-testid="mock-tooltip" {...props}>{children}</div>;
};

export const Button = ({ children, ...props }: any) => {
  return <button data-testid="mock-button" {...props}>{children}</button>;
};

export const FormField = ({ children, ...props }: any) => {
  return <div data-testid="mock-form-field" {...props}>{children}</div>;
};

export const Form = ({ children, ...props }: any) => {
  return <form data-testid="mock-form" {...props}>{children}</form>;
};

export const Separator = ({ children, ...props }: any) => {
  return <div data-testid="mock-separator" {...props}>{children}</div>;
};

// Re-adding the Icon mock for general use if needed, though lucide icons are specific
export const Icon = ({ children, ...props }: any) => {
  return <div data-testid="mock-icon" {...props}>{children}</div>;
};

const StarRating = ({ children, ...props }: any) => {
  return <div data-testid="mock-star-rating" {...props}>{children}</div>;
};

// Mocks voor components uit '@/components/ui/form'
export const FormControl = ({ children, ...props }: any) => {
  return <div data-testid="mock-form-control" {...props}>{children}</div>;
};
export const FormItem = ({ children, ...props }: any) => {
  return <div data-testid="mock-form-item" {...props}>{children}</div>;
};
export const FormLabel = ({ children, ...props }: any) => {
  return <label data-testid="mock-form-label" {...props}>{children}</label>;
};
export const FormMessage = ({ children, ...props }: any) => {
  return <div data-testid="mock-form-message" {...props}>{children}</div>;
};

// Mocks voor components uit '@/components/ui/select'
export const SelectContent = ({ children, ...props }: any) => {
  return <div data-testid="mock-select-content" {...props}>{children}</div>;
};
export const SelectItem = ({ children, ...props }: any) => {
  return <div data-testid="mock-select-item" {...props}>{children}</div>;
};
export const SelectTrigger = ({ children, ...props }: any) => {
  return <button data-testid="mock-select-trigger" {...props}>{children}</button>;
};
export const SelectValue = ({ children, ...props }: any) => {
  return <span data-testid="mock-select-value" {...props}>{children}</span>;
};

// Mocks voor components uit '@/components/ui/radio-group'
export const RadioGroupItem = ({ children, ...props }: any) => {
  return <input type="radio" data-testid="mock-radio-group-item" {...props} />;
};

// Mocks voor lucide-react iconen
export const Camera = (props: any) => <svg data-testid="mock-camera-icon" {...props} />;
export const MapPin = (props: any) => <svg data-testid="mock-map-pin-icon" {...props} />;
export const Save = (props: any) => <svg data-testid="mock-save-icon" {...props} />;
export const LocateFixed = (props: any) => <svg data-testid="mock-locate-fixed-icon" {...props} />;
export const AlertTriangle = (props: any) => <svg data-testid="mock-alert-triangle-icon" {...props} />;
export const Loader2 = (props: any) => <svg data-testid="mock-loader2-icon" {...props} />;

export default StarRating;
