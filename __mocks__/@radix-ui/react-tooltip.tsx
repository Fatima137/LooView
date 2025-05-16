import React from 'react';

export const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
Object.defineProperty(Tooltip, 'displayName', { value: 'Tooltip' });

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
Object.defineProperty(TooltipTrigger, 'displayName', { value: 'TooltipTrigger' });

export const TooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
Object.defineProperty(TooltipContent, 'displayName', { value: 'TooltipContent' });

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
Object.defineProperty(TooltipProvider, 'displayName', { value: 'TooltipProvider' });