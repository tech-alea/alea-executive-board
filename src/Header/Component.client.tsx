'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const [isLoading, setIsLoading] = useState(false)

  const sendEmail = async () => {
    setIsLoading(true)

    const emailData = {
      to: 'gianluca.larosa@bitrock.it', // <-- CAMBIA QUESTO
      subject: 'Test',
      message: 'Questo è un messaggio di prova inviato da payloadCMS.',
    }

    /**
     * Se il tuo backend Payload è su un dominio diverso
     * (es. api.tuosito.com), dovrai usare l'URL completo:
     * const endpoint = process.env.NEXT_PUBLIC_PAYLOAD_URL + '/api/send-email';
     */
    const endpoint = '/api/send-email'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Email inviata con successo! ' + result.message)
      } else {
        // Mostra l'errore proveniente dal server
        console.error('Errore dal server:', result.error)
        alert('Errore: ' + result.error)
      }
    } catch (error) {
      // Gestisce errori di rete (es. server irraggiungibile)
      console.error('Errore di rete:', error)
      alert('Impossibile connettersi al server. Controlla la console.')
    } finally {
      // Riabilita il bottone in ogni caso (successo o errore)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="container relative z-20   " {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex justify-between">
        <Link href="/">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>
        <button onClick={sendEmail} disabled={isLoading}>{isLoading ? "Invio..." : "EMAIL"}</button>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
