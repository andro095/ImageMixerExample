import LoginForm from './LoginForm'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await searchParams
  const message = resolvedParams?.message as string | undefined

  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-white text-black font-sans">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-center">
            {message ? 'Authentication Error' : 'Welcome'}
          </h1>
          {message && (
            <p className="text-center text-sm uppercase tracking-widest text-red-500">
              {message}
            </p>
          )}
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
