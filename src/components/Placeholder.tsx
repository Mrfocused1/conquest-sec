import { Icon } from './Icon'

const COPY: Record<string, { icon: string; title: string; body: string }> = {
  pages: { icon: 'pages', title: 'Pages', body: 'Create and manage standalone pages — About, Pricing, Legal and more.' },
  blog: { icon: 'blog', title: 'Blog', body: 'Draft, schedule and publish articles with the structured content editor.' },
  media: { icon: 'media', title: 'Media Library', body: 'Upload, organize and search images, documents, logos and icons in folders.' },
  forms: { icon: 'forms', title: 'Forms', body: 'Review consultation requests and form submissions from the live site.' },
  settings: { icon: 'settings', title: 'Settings', body: 'Configure site-wide preferences, domains, integrations and theming.' },
  users: { icon: 'users', title: 'User Management', body: 'Invite teammates and manage Admin, Editor, Author and Viewer roles.' },
  audit: { icon: 'audit', title: 'Audit Log', body: 'Track every change — user, action, section modified and timestamp.' },
  trusted: { icon: 'trusted', title: 'Trusted By', body: 'Manage the partner logos shown in the homepage marquee.' },
  services: { icon: 'services', title: 'Services', body: 'Edit the four service cards, their icons, titles and descriptions.' },
  impact: { icon: 'impact', title: 'Impact Metrics', body: 'Update the headline statistics and their animated count-up values.' },
  cta: { icon: 'cta', title: 'CTA Banner', body: 'Edit the closing call-to-action heading, subtext and button.' },
  footer: { icon: 'footer', title: 'Footer', body: 'Manage footer link columns, social links and legal text.' },
  navigation: { icon: 'navigation', title: 'Navigation', body: 'Configure the primary navigation menu items and their order.' },
}

export function Placeholder({ which }: { which: string }) {
  const c = COPY[which] ?? { icon: 'layout', title: 'Section', body: 'This area is part of the CMS.' }
  return (
    <div className="card-surface fade-in flex flex-col items-center justify-center px-8 py-24 text-center">
      <span className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.05] text-white">
        <Icon name={c.icon} size={28} />
      </span>
      <h2 className="text-[22px] font-bold tracking-[-0.01em] text-white">{c.title}</h2>
      <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-t3">{c.body}</p>
      <div className="mt-6 flex items-center gap-2 rounded-full border border-white/[0.08] px-3.5 py-1.5 text-[12px] font-medium text-t3">
        <span className="h-1.5 w-1.5 rounded-full bg-warn" />
        Module scaffolded — wired into the same design system
      </div>
    </div>
  )
}
