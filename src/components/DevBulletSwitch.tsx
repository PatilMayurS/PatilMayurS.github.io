import { setBulletStyle, useBulletStyle, type BulletStyle } from '../hooks/bullets'

const OPTIONS: { value: BulletStyle; label: string }[] = [
  { value: 'detailed', label: 'Detailed' },
  { value: 'concise', label: 'Concise' },
]

/**
 * Floating preview switch, rendered only by the dev server (see App.tsx).
 * It changes what you see locally; the public site always shows the version
 * set by `experienceBullets` in src/content/site.ts.
 */
export default function DevBulletSwitch() {
  const style = useBulletStyle()
  return (
    <div className="dev-switch" role="group" aria-label="Experience bullets preview (dev only)">
      <span className="dev-switch-label">Dev · Experience bullets</span>
      <div className="dev-switch-track">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={style === o.value}
            onClick={() => setBulletStyle(o.value)}
            className="dev-switch-option"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
