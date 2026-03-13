'use client';

import { useEffect, useState } from 'react';

type ContactFormModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactFormModal({ open, onClose }: ContactFormModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setName('');
        setEmail('');
        setMessage('');
        setStatus('idle');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const mailto = `mailto:smarviastudio@gmail.com?subject=${encodeURIComponent(
      `Contact request from ${name || 'Website visitor'}`
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

    window.location.href = mailto;
    setStatus('sent');
    setTimeout(onClose, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 24,
          padding: '28px 30px 32px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            right: 18,
            top: 18,
            border: 'none',
            background: 'none',
            fontSize: 20,
            color: '#999',
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#dd0000', marginBottom: 6 }}>
          Contact
        </p>
        <h3 id="contact-modal-title" style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', color: '#111' }}>
          How can we help?
        </h3>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
          Send us a quick note and we’ll reply from our support inbox.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              style={{
                marginTop: 6,
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                padding: '10px 14px',
                fontSize: 14,
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                marginTop: 6,
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                padding: '10px 14px',
                fontSize: 14,
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more…"
              required
              rows={4}
              style={{
                marginTop: 6,
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                padding: '10px 14px',
                fontSize: 14,
                resize: 'vertical',
              }}
            />
          </label>

          <button
            type="submit"
            disabled={status !== 'idle'}
            style={{
              marginTop: 6,
              background: status === 'sent' ? '#16a34a' : '#dd0000',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '12px 18px',
              fontSize: 15,
              fontWeight: 700,
              cursor: status === 'idle' ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            {status === 'idle' && 'Send message'}
            {status === 'sending' && 'Redirecting to email…'}
            {status === 'sent' && 'Opening mail client'}
          </button>
        </form>
      </div>
    </div>
  );
}
