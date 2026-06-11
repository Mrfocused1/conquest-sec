import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchHero, saveHero } from '../lib/cmsApi'

export type HeroContent = {
  topLabel: string
  heading: string
  description: string
  primaryText: string
  primaryLink: string
  secondaryText: string
  secondaryLink: string
}

export type HeroDesign = {
  logoSize: number
  logoPosition: 'Left' | 'Right' | 'Center'
  logoAlt: string
  bgStyle: string
  topPadding: number
  bottomPadding: number
  glow: boolean
  animation: boolean
}

export type Visibility = {
  desktop: boolean
  tablet: boolean
  mobile: boolean
}

export type Seo = {
  metaTitle: string
  metaDescription: string
  altText: string
}

type CmsState = {
  content: HeroContent
  setContent: (patch: Partial<HeroContent>) => void
  design: HeroDesign
  setDesign: (patch: Partial<HeroDesign>) => void
  visibility: Visibility
  setVisibility: (patch: Partial<Visibility>) => void
  seo: Seo
  setSeo: (patch: Partial<Seo>) => void
  customCss: string
  setCustomCss: (v: string) => void
  dirty: boolean
  markSaved: () => void
}

const defaultContent: HeroContent = {
  topLabel: 'Secure Today. Conquer Tomorrow.',
  heading: 'Secure Today.\nConquer Tomorrow.',
  description:
    'Conquest Security delivers enterprise-grade cybersecurity solutions that protect what matters most—your people, your data, and your future.',
  primaryText: 'Our Services',
  primaryLink: '#services',
  secondaryText: 'Book a Consultation',
  secondaryLink: '#contact',
}

const defaultDesign: HeroDesign = {
  logoSize: 420,
  logoPosition: 'Right',
  logoAlt: 'Conquest Security Logo',
  bgStyle: 'Dark Gradient',
  topPadding: 120,
  bottomPadding: 120,
  glow: true,
  animation: true,
}

const CmsContext = createContext<CmsState | null>(null)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<HeroContent>(defaultContent)
  const [design, setDesignState] = useState<HeroDesign>(defaultDesign)
  const [visibility, setVisibilityState] = useState<Visibility>({
    desktop: true,
    tablet: true,
    mobile: true,
  })
  const [seo, setSeoState] = useState<Seo>({
    metaTitle: 'Conquest Security — Secure Today. Conquer Tomorrow.',
    metaDescription:
      'Enterprise-grade cybersecurity solutions that protect your people, your data, and your future.',
    altText: 'Conquest Security shield logo',
  })
  const [customCss, setCustomCss] = useState('hero-section')
  const [dirty, setDirty] = useState(false)

  // Hydrate from Supabase on first load (falls back to defaults if unavailable).
  useEffect(() => {
    let active = true
    fetchHero()
      .then((b) => {
        if (!active || !b) return
        setContentState(b.content)
        setDesignState(b.design)
        setVisibilityState(b.visibility)
        setSeoState(b.seo)
        setCustomCss(b.customCss)
        setDirty(false)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const value = useMemo<CmsState>(
    () => ({
      content,
      setContent: (patch) => {
        setContentState((c) => ({ ...c, ...patch }))
        setDirty(true)
      },
      design,
      setDesign: (patch) => {
        setDesignState((d) => ({ ...d, ...patch }))
        setDirty(true)
      },
      visibility,
      setVisibility: (patch) => {
        setVisibilityState((v) => ({ ...v, ...patch }))
        setDirty(true)
      },
      seo,
      setSeo: (patch) => {
        setSeoState((s) => ({ ...s, ...patch }))
        setDirty(true)
      },
      customCss,
      setCustomCss: (v) => {
        setCustomCss(v)
        setDirty(true)
      },
      dirty,
      markSaved: () => {
        setDirty(false)
        // Best-effort persist. Writes require an authenticated session (RLS);
        // failures are swallowed so the local editing experience never blocks.
        saveHero({ content, design, visibility, seo, customCss }).catch(() => {})
      },
    }),
    [content, design, visibility, seo, customCss, dirty],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
