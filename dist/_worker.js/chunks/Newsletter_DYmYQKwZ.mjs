globalThis.process ??= {}; globalThis.process.env ??= {};
import { f as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate } from './astro/server_YdRI9-rv.mjs';

const $$Newsletter = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="newsletter"> <span class="eyebrow">Catatan berkala</span> <h3 class="h3 mb-2">Terima tulisan baru lewat email.</h3> <p class="text-muted-tw mb-3">Tanpa spam. Hanya catatan yang menurut saya layak dibagikan.</p> <form class="newsletter-form" novalidate> <label for="nl-email" class="sr-only">Alamat email</label> <input id="nl-email" type="email" name="email" class="form-control" placeholder="nama@email.com" autocomplete="email" required> <button type="submit" class="btn btn-primary">Berlangganan</button> </form> <p class="form-status" role="status" aria-live="polite"></p> </div> ${renderScript($$result, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/Newsletter.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Agustina Putri/OneDrive/Documents/Transbara Wahyu/src/components/Newsletter.astro", void 0);

export { $$Newsletter as $ };
