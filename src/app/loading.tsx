import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading LooView...</p>
    </div>
  );
}
