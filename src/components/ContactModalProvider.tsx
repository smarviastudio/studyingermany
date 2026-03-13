'use client';

import { createContext, useContext, useState } from 'react';
import { ContactFormModal } from './ContactFormModal';

type ContactModalContextValue = {
  openContactModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | undefined>(undefined);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openContactModal = () => setOpen(true);

  return (
    <ContactModalContext.Provider value={{ openContactModal }}>
      {children}
      <ContactFormModal open={open} onClose={() => setOpen(false)} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return ctx;
}
