'use client';

import { FormEvent, useMemo, useState } from 'react';
import { API_URL, toProjectTypeOptions } from '@/lib/api';

type ContactFormProps = {
  defaultProjectType?: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  consent: boolean;
  website: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
  consent: false,
  website: ''
};

export default function ContactForm({ defaultProjectType = '' }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({ ...initialState, projectType: defaultProjectType });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');

  const options = useMemo(() => toProjectTypeOptions(), []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.projectType || !form.message.trim()) {
      setStatus('error');
      setError('Completa nombre, email, tipo de proyecto y mensaje.');
      return;
    }

    if (!form.consent) {
      setStatus('error');
      setError('Debes aceptar el tratamiento de datos para enviar el formulario.');
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el formulario');
      }

      setForm({ ...initialState, projectType: defaultProjectType });
      setStatus('ok');
    } catch {
      setStatus('error');
      setError('No se pudo enviar el formulario. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form id="formulario-contacto" onSubmit={onSubmit} className="grid gap-5 rounded border border-black/10 bg-white p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-voragine-gray">
          Nombre *
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="rounded border border-black/15 px-3 py-3 text-voragine-black outline-none focus:border-voragine-black"
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-voragine-gray">
          Email *
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="rounded border border-black/15 px-3 py-3 text-voragine-black outline-none focus:border-voragine-black"
            required
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-voragine-gray">
          Teléfono
          <input
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="rounded border border-black/15 px-3 py-3 text-voragine-black outline-none focus:border-voragine-black"
          />
        </label>
        <label className="grid gap-2 text-sm text-voragine-gray">
          Tipo de proyecto *
          <select
            value={form.projectType}
            onChange={(event) => setForm((prev) => ({ ...prev, projectType: event.target.value }))}
            className="rounded border border-black/15 px-3 py-3 text-voragine-black outline-none focus:border-voragine-black"
            required
          >
            <option value="">Selecciona...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm text-voragine-gray">
        Mensaje *
        <textarea
          rows={6}
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          className="rounded border border-black/15 px-3 py-3 text-voragine-black outline-none focus:border-voragine-black"
          required
        />
      </label>

      <label className="hidden" aria-hidden="true">
        Tu web
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
          name="website"
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-voragine-gray">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => setForm((prev) => ({ ...prev, consent: event.target.checked }))}
          className="mt-1 h-4 w-4 accent-voragine-black"
        />
        Acepto el tratamiento de mis datos para recibir respuesta sobre mi consulta.
      </label>

      {status === 'ok' && (
        <p className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Mensaje enviado correctamente. Te responderemos pronto.
        </p>
      )}

      {status === 'error' && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full md:w-auto" disabled={sending}>
        {sending ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
