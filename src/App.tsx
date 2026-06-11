import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopNav } from './components/TopNav'
import { MetricCard } from './components/MetricCard'
import { ContentEditor } from './components/ContentEditor'
import { SettingsPanel } from './components/SettingsPanel'
import { SectionList } from './components/SectionList'
import { Placeholder } from './components/Placeholder'
import { MobileTopBar } from './components/mobile/MobileTopBar'
import { MobileDashboard } from './components/mobile/MobileDashboard'
import { MobileEditor } from './components/mobile/MobileEditor'
import { BottomNav, type MobileTab } from './components/mobile/BottomNav'
import { Icon, Mark } from './components/Icon'
import { NAV, SECTIONS, METRICS, type NavKey } from './data/nav'

const TITLES: Record<string, { t: string; s: string }> = {
  dashboard: { t: 'Dashboard', s: 'Manage and customize your website content' },
  hero: { t: 'Dashboard', s: 'Manage and customize your website content' },
}

function labelFor(key: NavKey): string {
  for (const item of NAV) {
    if (item.key === key && !item.children) return item.label
    const child = item.children?.find((c) => c.key === key)
    if (child) return child.label
  }
  return 'Section'
}

const EDITOR_VIEWS: NavKey[] = ['dashboard', 'hero']

export default function App() {
  const [active, setActive] = useState<NavKey>('dashboard')

  // mobile state
  const [tab, setTab] = useState<MobileTab>('dashboard')
  const [editor, setEditor] = useState<{ open: boolean; title: string }>({ open: false, title: '' })
  const [drawer, setDrawer] = useState(false)

  const isEditorView = EDITOR_VIEWS.includes(active)
  const meta = TITLES[active] ?? { t: labelFor(active), s: 'Manage this part of your website' }

  function openEditor(title: string) {
    setEditor({ open: true, title })
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* ===================== DESKTOP ===================== */}
      <div className="hidden h-screen lg:flex">
        <Sidebar active={active} onNavigate={setActive} />
        <main className="thin-scroll h-screen flex-1 overflow-y-auto">
          <TopNav title={meta.t} subtitle={meta.s} />
          <div className="p-8">
            {isEditorView ? (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
                <div className="min-w-0 space-y-6">
                  <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
                    {METRICS.map((m) => (
                      <MetricCard key={m.label} {...m} />
                    ))}
                  </div>
                  <ContentEditor />
                  <SectionList onEdit={() => setActive('hero')} />
                </div>
                <div className="min-w-0">
                  <SettingsPanel />
                </div>
              </div>
            ) : (
              <Placeholder which={active} />
            )}
          </div>
        </main>
      </div>

      {/* ===================== MOBILE ===================== */}
      <div className="min-h-screen lg:hidden">
        <MobileTopBar onMenu={() => setDrawer(true)} />

        {editor.open ? (
          <MobileEditor title={editor.title} onBack={() => setEditor({ open: false, title: '' })} />
        ) : tab === 'dashboard' ? (
          <MobileDashboard onOpenSection={(k) => openEditor(labelFor(k))} />
        ) : tab === 'content' ? (
          <MobileContentList onOpen={(title) => openEditor(title)} />
        ) : (
          <div className="px-4 py-5 pb-28">
            <Placeholder which={tab === 'media' ? 'media' : tab === 'settings' ? 'settings' : 'users'} />
          </div>
        )}

        <BottomNav
          active={tab}
          onChange={(t) => {
            setEditor({ open: false, title: '' })
            setTab(t)
          }}
        />

        {/* Drawer */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-200 ${
            drawer ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <div
            className={`absolute left-0 top-0 h-full w-[290px] border-r border-white/[0.06] bg-surface transition-transform duration-300 ${
              drawer ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <div className="flex items-center gap-2 text-white">
                <Mark size={20} />
                <span className="text-[14px] font-bold tracking-wide">CONQUEST</span>
              </div>
              <button
                onClick={() => setDrawer(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-t2"
              >
                <Icon name="plus" size={20} className="rotate-45" />
              </button>
            </div>
            <div className="thin-scroll h-[calc(100%-4rem)] overflow-y-auto px-3 py-3">
              {NAV.map((item) =>
                item.children ? (
                  <div key="content" className="mt-2">
                    <div className="label-xs px-3 py-2">{item.label}</div>
                    {item.children.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => {
                          setDrawer(false)
                          setTab('content')
                          openEditor(c.label)
                        }}
                        className="block w-full rounded-lg px-3 py-2.5 text-left text-[14px] text-t2 transition-colors hover:bg-white/[0.04] hover:text-white"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    key={item.key}
                    onClick={() => {
                      setDrawer(false)
                      setEditor({ open: false, title: '' })
                      if (item.key === 'dashboard') setTab('dashboard')
                      else if (item.key === 'media') setTab('media')
                      else if (item.key === 'settings') setTab('settings')
                      else setTab('content')
                    }}
                    className="mt-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-t2 transition-colors hover:bg-white/[0.04] hover:text-white"
                  >
                    <Icon name={item.icon} size={18} className="text-t3" />
                    {item.label}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileContentList({ onOpen }: { onOpen: (title: string) => void }) {
  return (
    <div className="px-4 py-5 pb-28">
      <h1 className="text-[24px] font-bold tracking-[-0.02em] text-white">Site Content</h1>
      <p className="mt-1 text-[14px] text-t3">Tap a section to edit its content, design and settings.</p>
      <div className="card-surface mt-5 divide-y divide-white/[0.05] overflow-hidden">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => onOpen(s.name)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 active:bg-white/[0.04]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-white">
              <Icon name={s.icon} size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-[14.5px] font-medium text-white">{s.name}</span>
              <span className="text-[12px] text-t3">Updated {s.updated}</span>
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                s.status === 'Published' ? 'bg-ok/15 text-ok' : 'bg-warn/15 text-warn'
              }`}
            >
              {s.status}
            </span>
            <Icon name="chevronRight" size={16} className="text-t3" />
          </button>
        ))}
      </div>
    </div>
  )
}
