// src/components/__tests__/add-toilet-form.test.tsx
jest.mock('@/components/ui/tooltip', () => ({
  ...jest.requireActual('@/components/ui/tooltip'),
  TooltipProvider: ({ children }: { children: React.ReactNode }) => children,
}));



// 0) Zorg dat automocks uitstaan en modules gereset worden
jest.disableAutomock();
jest.resetModules();

// 1) Mock next/image naar een simpele <img>
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => require('react').createElement('img', props), // eslint-disable-line @typescript-eslint/no-explicit-any
}));

// 2) Unmock de echte shadcn/ui-componenten zodat we de werkelijke inputs/labels zien
jest.unmock('@/components/ui/form');
jest.unmock('@/components/ui/input');
jest.unmock('@/components/ui/textarea');
jest.unmock('@/components/ui/checkbox');
jest.unmock('@/components/ui/label');
jest.unmock('@/components/ui/button');
jest.unmock('@/components/ui/select');
jest.unmock('@/components/ui/radio-group');
jest.unmock('@/components/ui/separator');
jest.unmock('@/components/ui/accordion');


// 3) Pas daarna de imports
import React from 'react'; // Import React expliciet
import '@testing-library/jest-dom';

// Importeer de nodige shadcn/ui componenten direct
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddToiletForm from '../add-toilet-form';

// 4) Mock constants zodat icons en opties voorspelbaar zijn
jest.mock('@/lib/constants', () => {
  const React = require('react');
  const DummyIcon = (props: any) =>
    React.createElement('span', { 'data-testid': 'dummy-icon', ...props });
  return {
    SECTION_ICONS: {
      location: DummyIcon,
      access: DummyIcon,
      accessibility: DummyIcon,
      toiletType: DummyIcon,
      features: DummyIcon,
      ratingReview: DummyIcon,
      quickTags: DummyIcon,
      photo: DummyIcon,
    },
    LOCATION_TYPES: [],
    ACCESSIBILITY_OPTIONS: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not_sure', label: 'Not sure' },
    ],
    TOILET_TYPE_OPTIONS_CONFIG: [],
    TOILET_FEATURES_CONFIG: [],
    QUICK_TAGS_CONFIG: [],
    QUICK_TAG_CATEGORIES_CONFIG: {},
    GOOGLE_MAPS_API_KEY: '',
  };
});

// 5) Mock Google Maps-components om errors te voorkomen
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: any) => <div>{children}</div>,
  Map: ({ children }: any) => <div>{children}</div>,
  AdvancedMarker: ({ children }: any) => <div>{children}</div>,
  Pin: () => null,
  useMap: () => ({}),
}));

// 6) Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ currentUser: { uid: 'test-user' }, loading: false }),
}));

// 7) Mock lucide-react icons
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
jest.mock('lucide-react', () => ({
  AlertTriangle: () => <svg data-testid='mock-alert-triangle' />,
  Camera: () => <svg data-testid='mock-camera' />,
  MapPin: () => <svg data-testid='mock-map-pin' />,
  Save: () => <svg data-testid='mock-save' />,
  LocateFixed: () => <svg data-testid='mock-locate-fixed' />,
  Loader2: () => <svg data-testid='mock-loader-2' />,
}));

// 8) De eigenlijke tests
describe('AddToiletForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders de belangrijkste velden', () => {
    const { container } = render(
      <AddToiletForm
        initialCoordinates={{ lat: 0, lng: 0 }}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    expect(container).toBeInTheDocument();

    // Enkele checks op labels / knoppen
    expect(screen.getByLabelText(/Toilet Name\*/i)).toBeInTheDocument();
    expect(screen.getByText(/Location on Map\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Is this toilet wheelchair accessible\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Toilet/i })).toBeInTheDocument();
  });

  test('submits het formulier met user input', async () => {
    const mockOnSubmit = jest.fn();

    render(
      <AddToiletForm
        initialCoordinates={{ lat: 0, lng: 0 }}
        onSubmit={mockOnSubmit}
        onCancel={() => {}}
      />
    );

    // 1) Vul de Toilet Name
    fireEvent.change(
      screen.getByLabelText(/Toilet Name\*/i),
      { target: { value: 'Test Toilet' } }
    );

    // 2) Kies “Yes” voor wheelchairAccessible
    fireEvent.click(screen.getByRole('radio', { name: /^Yes$/i }));

    // 3) Klik op “Add Toilet”
    fireEvent.click(screen.getByRole('button', { name: /Add Toilet/i }));

    // 4) Wacht tot onSubmit is aangeroepen
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Toilet',
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          wheelchairAccessible: 'yes',
        })
      );
    });
  });
});