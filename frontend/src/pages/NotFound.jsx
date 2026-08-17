function NotFound() {
  return (
    <>
      <main class="grid min-h-full place-items-center bg-brown-900 px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
          <p class="text-base font-semibold text-yellow-400">404</p>
          <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-yellow sm:text-7xl">
            Page not found
          </h1>
          <p class="mt-6 text-lg font-medium text-pretty text-yellow-400 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/dashboard"
              class="rounded-md bg-gold-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
            >
              Go back home
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
export default NotFound;
