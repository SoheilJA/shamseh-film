/**
 * 404.js — lost frame.
 */
import { renderIcons } from "../js/utils.js";

export default async function notFoundPage(app) {
  app.innerHTML = `
  <main id="main" class="grain min-h-[80svh] grid place-items-center px-[var(--spacing-gutter)] pt-20">
    <div class="text-center">
      <p class="tc tc-crimson mb-6">ERROR 404 · FRAME NOT FOUND</p>
      <h1 class="text-display-lg font-black leading-none mb-8">قابِ گم‌شده</h1>
      <p class="text-ash max-w-md mx-auto leading-loose mb-10">
        صفحه‌ای که دنبال آن بودید در آرشیو موجود نیست؛ شاید نشانی را اشتباه وارد کرده‌اید یا این صفحه جابه‌جا شده است.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <a href="/" class="btn-cine">بازگشت به خانه <i data-lucide="arrow-left" data-size="16"></i></a>
        <a href="/productions" class="btn-ghost">مرور آرشیو تولیدات</a>
      </div>
    </div>
  </main>`;
  renderIcons(app);
  document.title = "یافت نشد | گروه سینمایی شمسه فیلم";
}
