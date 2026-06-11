import { supabase } from './supabase'
import type { HeroContent, HeroDesign, Visibility, Seo } from '../store/cms'

export type HeroBundle = {
  content: HeroContent
  design: HeroDesign
  visibility: Visibility
  seo: Seo
  customCss: string
}

const ICON_FOR_TYPE: Record<string, string> = {
  hero: 'hero',
  trusted_by: 'trusted',
  services: 'services',
  impact: 'impact',
  cta: 'cta',
  footer: 'footer',
  navigation: 'navigation',
}

export type SectionRow = {
  key: string
  name: string
  icon: string
  status: 'Published' | 'Draft'
  updated: string
}

/** Load all homepage sections for the section manager. */
export async function fetchSections(): Promise<SectionRow[] | null> {
  const { data, error } = await supabase
    .from('sections')
    .select('slug,name,type,status,updated_at,sort_order')
    .order('sort_order', { ascending: true })
  if (error || !data) return null
  return data.map((r) => ({
    key: r.slug as string,
    name: r.name as string,
    icon: ICON_FOR_TYPE[r.type as string] ?? 'hero',
    status: (r.status === 'published' ? 'Published' : 'Draft') as 'Published' | 'Draft',
    updated: new Date(r.updated_at as string).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }))
}

/** Load the hero section content/design/visibility/seo from Supabase. */
export async function fetchHero(): Promise<HeroBundle | null> {
  const { data, error } = await supabase
    .from('sections')
    .select('content,design,seo,custom_css_class,visible_desktop,visible_tablet,visible_mobile')
    .eq('slug', 'hero')
    .maybeSingle()
  if (error || !data) return null

  const c = (data.content ?? {}) as Record<string, string>
  const d = (data.design ?? {}) as Record<string, unknown>
  const s = (data.seo ?? {}) as Record<string, string>

  return {
    content: {
      topLabel: c.top_label ?? '',
      heading: c.heading ?? '',
      description: c.description ?? '',
      primaryText: c.primary_text ?? '',
      primaryLink: c.primary_link ?? '',
      secondaryText: c.secondary_text ?? '',
      secondaryLink: c.secondary_link ?? '',
    },
    design: {
      logoSize: Number(d.logo_size ?? 420),
      logoPosition: (d.logo_position as HeroDesign['logoPosition']) ?? 'Right',
      logoAlt: (d.logo_alt as string) ?? 'Conquest Security Logo',
      bgStyle: (d.bg_style as string) ?? 'Dark Gradient',
      topPadding: Number(d.top_padding ?? 120),
      bottomPadding: Number(d.bottom_padding ?? 120),
      glow: d.glow !== false,
      animation: d.animation !== false,
    },
    visibility: {
      desktop: data.visible_desktop !== false,
      tablet: data.visible_tablet !== false,
      mobile: data.visible_mobile !== false,
    },
    seo: {
      metaTitle: s.meta_title ?? '',
      metaDescription: s.meta_description ?? '',
      altText: s.alt_text ?? '',
    },
    customCss: (data.custom_css_class as string) ?? '',
  }
}

/** Persist the hero section. Requires an authenticated session (RLS). */
export async function saveHero(b: HeroBundle): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('sections')
    .update({
      content: {
        top_label: b.content.topLabel,
        heading: b.content.heading,
        description: b.content.description,
        primary_text: b.content.primaryText,
        primary_link: b.content.primaryLink,
        secondary_text: b.content.secondaryText,
        secondary_link: b.content.secondaryLink,
      },
      design: {
        logo_size: b.design.logoSize,
        logo_position: b.design.logoPosition,
        logo_alt: b.design.logoAlt,
        bg_style: b.design.bgStyle,
        top_padding: b.design.topPadding,
        bottom_padding: b.design.bottomPadding,
        glow: b.design.glow,
        animation: b.design.animation,
      },
      seo: {
        meta_title: b.seo.metaTitle,
        meta_description: b.seo.metaDescription,
        alt_text: b.seo.altText,
      },
      custom_css_class: b.customCss,
      visible_desktop: b.visibility.desktop,
      visible_tablet: b.visibility.tablet,
      visible_mobile: b.visibility.mobile,
    })
    .eq('slug', 'hero')
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
