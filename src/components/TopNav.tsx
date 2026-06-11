import { Icon } from './Icon'

type Props = {
  title: string
  subtitle: string
}

export function TopNav({ title, subtitle }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-white/[0.06] bg-ink/80 px-8 backdrop-blur-xl">
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-white">{title}</h1>
          <span className="hidden truncate text-[14px] text-t3 lg:block">{subtitle}</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <div className="relative hidden xl:block">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-t3" />
          <input
            placeholder="Search content, pages, media…"
            className="input-field w-[280px] pl-9"
            aria-label="Search"
          />
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] text-t2 transition-colors duration-150 hover:border-white/20 hover:text-white"
          aria-label="Notifications"
        >
          <span className="relative">
            <Icon name="bell" size={18} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ok ring-2 ring-ink" />
          </span>
        </button>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] text-t2 transition-colors duration-150 hover:border-white/20 hover:text-white"
          aria-label="Toggle dark mode"
        >
          <Icon name="moon" size={18} />
        </button>
        <a
          href="http://localhost:8755"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost hidden md:inline-flex"
        >
          <Icon name="external" size={16} />
          View Live Site
        </a>
        <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] py-1.5 pl-1.5 pr-2.5 transition-colors duration-150 hover:border-white/20">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-[12px] font-semibold text-white">
            AD
          </span>
          <Icon name="chevronDown" size={15} className="text-t3" />
        </button>
      </div>
    </header>
  )
}
