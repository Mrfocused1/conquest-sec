import { Icon } from './Icon'

type Props = {
  value: string
  label: string
  sub: string
  icon: string
}

export function MetricCard({ value, label, sub, icon }: Props) {
  return (
    <div className="card-surface hover-lift p-6 lg:p-7">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-white">
          <Icon name={icon} size={22} />
        </span>
        <div>
          <div className="text-[26px] font-bold leading-none tracking-[-0.02em] text-white">
            {value}
          </div>
          <div className="mt-1.5 text-[14px] font-medium text-t2">{label}</div>
        </div>
      </div>
      <div className="mt-5 text-[13px] text-t3">{sub}</div>
    </div>
  )
}
