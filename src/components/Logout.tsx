'use client'

import { useSession } from '~/hooks/use-session'

export const Logout = () => {
  const { session } = useSession()

  return (
    <button
      onClick={async () => {
        await fetch('/api/logout', { method: 'POST' })
        window.location.href = '/' // geri basa don
      }}
    >
      Logout {session.user?.name}
    </button>
  )
}