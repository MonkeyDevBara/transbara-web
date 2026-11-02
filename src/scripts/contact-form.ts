// Form kontak bersama (beranda & /kontak): validasi, honeypot, dan kirim ke tabel contact_messages.
// Supabase baru dimuat saat tombol kirim ditekan agar halaman tetap ringan.
export function initContactForm(opts: { source?: string; onPreset?: () => void } = {}) {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;
  const msg = document.getElementById('form-msg')!;
  const btn = document.getElementById('form-submit') as HTMLButtonElement;
  const purpose = form.elements.namedItem('purpose') as HTMLSelectElement;
  const preset = new URLSearchParams(location.search).get('keperluan');
  if (preset && Array.from(purpose.options).some((o) => o.value === preset)) { purpose.value = preset; opts.onPreset?.(); }

  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[data-v], textarea[data-v]'));
  const rules: Record<string, (v: string) => string> = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Mohon isi nama Anda.'),
    email: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) ? '' : 'Mohon isi alamat email yang valid.'),
    message: (v) => (v.trim().length >= 10 ? '' : 'Pesan minimal 10 karakter.'),
  };
  const check = (el: HTMLInputElement | HTMLTextAreaElement) => {
    const err = rules[el.name]?.(el.value) ?? '';
    el.classList.toggle('is-invalid', !!err);
    el.setAttribute('aria-invalid', String(!!err));
    const slot = document.getElementById('err-' + el.name);
    if (slot) slot.textContent = err;
    return !err;
  };
  fields.forEach((f) => { f.addEventListener('blur', () => f.value && check(f)); f.addEventListener('input', () => f.classList.contains('is-invalid') && check(f)); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = ''; msg.className = 'form__msg';
    const ok = fields.map(check);
    if (ok.includes(false)) { fields[ok.indexOf(false)].focus(); return; }
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.website) return; // honeypot: bot mengisi kolom tersembunyi
    btn.disabled = true;
    const label = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Mengirim…';
    try {
      const { supabase } = await import('../lib/supabase');
      const purposeLabel = purpose.options[purpose.selectedIndex].text;
      const { error } = await supabase.from('contact_messages').insert({
        name: data.name.trim(), email: data.email.trim(), subject: `Pesan dari ${opts.source ?? 'situs'}: ${purposeLabel}`,
        purpose: data.purpose as any, message: data.message.trim(),
      });
      if (error) throw error;
      form.reset();
      if (preset) purpose.value = preset;
      msg.textContent = 'Terima kasih, pesan Anda sudah terkirim. Saya akan membalas melalui email yang Anda cantumkan.';
      msg.classList.add('ok');
    } catch (err) {
      console.error(err);
      msg.textContent = 'Maaf, pesan belum terkirim karena ada kendala. Silakan coba lagi beberapa saat lagi.';
      msg.classList.add('err');
    } finally {
      btn.disabled = false;
      btn.innerHTML = label;
    }
  });
}
