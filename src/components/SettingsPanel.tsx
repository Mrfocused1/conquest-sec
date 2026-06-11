import { Icon } from './Icon'
import { FieldLabel, Select } from './ui/Field'
import { Toggle } from './ui/Toggle'
import { useCms } from '../store/cms'
import { LOGO_URL } from '../lib/assets'

export function SettingsPanel() {
  const { design, setDesign, visibility, setVisibility, customCss, setCustomCss } = useCms()

  return (
    <div className="flex flex-col gap-5">
      {/* Edit Component / Logo */}
      <section className="card-surface fade-in p-5">
        <div className="mb-1 text-[15px] font-semibold text-white">Edit Component</div>
        <div className="mb-4 text-[13px] text-t3">Hero Visual (Logo)</div>

        <FieldLabel>Logo</FieldLabel>
        <div className="grid place-items-center rounded-xl border border-dashed border-white/10 bg-surface py-7">
          <img src={LOGO_URL} alt="Current logo" className="h-24 w-auto object-contain" />
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn-ghost flex-1">
            <Icon name="upload" size={15} />
            Change Logo
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 px-3 py-2.5 text-[14px] font-medium text-danger transition-colors duration-150 hover:bg-danger/10">
            Remove
          </button>
        </div>

        <div className="mt-5">
          <FieldLabel htmlFor="logoSize">Logo Size</FieldLabel>
          <div className="flex items-center gap-3">
            <input
              id="logoSize"
              type="range"
              min={120}
              max={600}
              step={10}
              value={design.logoSize}
              onChange={(e) => setDesign({ logoSize: Number(e.target.value) })}
              className="slider flex-1"
            />
            <div className="w-[68px] shrink-0 rounded-lg border border-white/[0.08] bg-surface px-2 py-1.5 text-center text-[13px] tabular-nums text-t1">
              {design.logoSize}px
            </div>
          </div>
        </div>

        <div className="mt-4">
          <FieldLabel htmlFor="logoPos">Logo Position</FieldLabel>
          <Select
            id="logoPos"
            value={design.logoPosition}
            onChange={(v) => setDesign({ logoPosition: v as typeof design.logoPosition })}
            options={['Left', 'Center', 'Right']}
          />
        </div>

        <div className="mt-4">
          <FieldLabel htmlFor="logoAlt">Logo Alt Text</FieldLabel>
          <input
            id="logoAlt"
            className="input-field"
            value={design.logoAlt}
            onChange={(e) => setDesign({ logoAlt: e.target.value })}
          />
          <p className="mt-1.5 text-[12px] text-t3">Important for SEO and accessibility.</p>
        </div>
      </section>

      {/* Section Visibility */}
      <section className="card-surface fade-in p-5">
        <div className="mb-4 text-[15px] font-semibold text-white">Section Visibility</div>
        {([
          ['desktop', 'Show on Desktop'],
          ['tablet', 'Show on Tablet'],
          ['mobile', 'Show on Mobile'],
        ] as const).map(([k, label]) => (
          <div key={k} className="flex items-center justify-between py-2.5">
            <span className="text-[14px] text-t2">{label}</span>
            <Toggle
              checked={visibility[k]}
              onChange={(v) => setVisibility({ [k]: v })}
              label={label}
            />
          </div>
        ))}
      </section>

      {/* Advanced */}
      <section className="card-surface fade-in p-5">
        <div className="mb-4 text-[15px] font-semibold text-white">Advanced</div>
        <FieldLabel htmlFor="css">Custom CSS Class</FieldLabel>
        <input
          id="css"
          className="input-field font-mono text-[13px]"
          value={customCss}
          onChange={(e) => setCustomCss(e.target.value)}
        />
        <p className="mt-1.5 text-[12px] text-t3">Add custom CSS class for advanced styling.</p>

        <div className="my-5 border-t border-white/[0.06]" />

        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 px-3 py-2.5 text-[14px] font-semibold text-danger transition-colors duration-150 hover:bg-danger/10">
          <Icon name="trash" size={16} />
          Delete Section
        </button>
      </section>
    </div>
  )
}
