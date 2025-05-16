import * as React from 'react';

const createSelectScope = () => {};

export { createSelectScope };

export const Select = ({ children }: { children: React.ReactNode }) => {
  // @ts-ignore - this is a mock
 Select.Trigger = { displayName: 'SelectTrigger' };
 Select.ScrollUpButton = { displayName: 'SelectScrollUpButton' };
  return React.createElement('div', null, children);
};

Select.displayName = 'Select';

export const SelectTrigger = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', null, children);
};

SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('span', null, children);
};

SelectValue.displayName = 'SelectValue';

export const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', null, children);
};

SelectContent.displayName = 'SelectContent';

export const SelectItem = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', null, children);
};

SelectItem.displayName = 'SelectItem';

export const SelectLabel = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', null, children);
};

export const SelectGroup = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', null, children);
};

export const SelectSeparator = () => {
  return React.createElement('div', null, '---');
};

SelectSeparator.displayName = 'SelectSeparator';