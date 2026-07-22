export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-900/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={1.8}
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3 2 8l10 5 10-5-10-5Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Central do Aluno
          </h1>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
