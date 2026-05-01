import { useState, useCallback } from 'react'

const COLORS = {
  navy: '#0a1628',
  teal: '#0f7b6c',
  tealLight: '#e6f7f4',
  tealBorder: '#b2dfd9',
  amber: '#b45309',
  amberLight: '#fef3c7',
  amberBorder: '#fcd34d',
  red: '#991b1b',
  redLight: '#fef2f2',
  redBorder: '#fca5a5',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray800: '#1f2937',
  white: '#ffffff',
}

const Badge = ({ label, color = 'teal' }) => {
  const styles = {
    teal: { bg: COLORS.tealLight, text: COLORS.teal, border: COLORS.tealBorder },
    amber: { bg: COLORS.amberLight, text: COLORS.amber, border: COLORS.amberBorder },
    red: { bg: COLORS.redLight, text: COLORS.red, border: COLORS.redBorder },
    gray: { bg: COLORS.gray100, text: COLORS.gray600, border: COLORS.gray200 },
  }
  const s = styles[color]
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
      textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20,
      background: s.bg, color: s.text, border: `1px solid ${s.border}`
    }}>{label}</span>
  )
}

const severityConfig = {
  mild: { color: 'gray', label: 'Mild' },
  moderate: { color: 'amber', label: 'Moderate' },
  severe: { color: 'red', label: 'Severe' },
}

const confidenceConfig = {
  high: { color: 'teal', label: 'High confidence' },
  medium: { color: 'amber', label: 'Medium confidence' },
  low: { color: 'red', label: 'Low confidence' },
}

function DrugCard({ med, info }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: COLORS.white, border: `1px solid ${COLORS.gray200}`,
      borderRadius: 12, overflow: 'hidden', marginBottom: 12,
      transition: 'box-shadow 0.2s',
    }}>
      <div
        onClick={() => info && setOpen(o => !o)}
        style={{
          padding: '14px 18px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          cursor: info ? 'pointer' : 'default',
          background: open ? COLORS.gray50 : COLORS.white,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: COLORS.tealLight, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="1" width="12" height="14" rx="2" stroke={COLORS.teal} strokeWidth="1.2"/>
              <path d="M5 5h6M5 8h6M5 11h4" stroke={COLORS.teal} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.gray800 }}>{med.drug}</div>
            <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 2 }}>
              {[med.dose, med.frequency, med.duration].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>
        {info && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', flexShrink: 0 }}>
            <path d="M4 6l4 4 4-4" stroke={COLORS.gray400} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {open && info && (
        <div style={{ borderTop: `1px solid ${COLORS.gray100}`, padding: '14px 18px', background: COLORS.gray50 }}>
          <p style={{ fontSize: 13, color: COLORS.gray600, marginBottom: 12, lineHeight: 1.6, fontStyle: 'italic' }}>
            {info.indication}
          </p>
          {info.key_side_effects?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.gray400, marginBottom: 6 }}>Side effects</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {info.key_side_effects.map((se, i) => (
                  <span key={i} style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 20,
                    background: COLORS.gray100, color: COLORS.gray600, border: `1px solid ${COLORS.gray200}`
                  }}>{se}</span>
                ))}
              </div>
            </div>
          )}
          {info.counselling_points?.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.gray400, marginBottom: 6 }}>Counselling points</div>
              {info.counselling_points.map((pt, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.teal, marginTop: 5, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: COLORS.gray600, lineHeight: 1.5 }}>{pt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function UploadZone({ onFile, image }) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  if (image) {
    return (
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${COLORS.gray200}` }}>
        <img src={image} style={{ width: '100%', display: 'block', maxHeight: 320, objectFit: 'contain', background: COLORS.white }} />
        <label style={{
          position: 'absolute', bottom: 12, right: 12,
          background: COLORS.white, border: `1px solid ${COLORS.gray200}`,
          borderRadius: 8, padding: '6px 14px', fontSize: 12,
          color: COLORS.gray600, cursor: 'pointer', fontWeight: 500,
        }}>
          Change image
          <input type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
        </label>
      </div>
    )
  }

  return (
    <label
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: 200, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
        border: `2px dashed ${dragging ? COLORS.teal : COLORS.gray200}`,
        background: dragging ? COLORS.tealLight : COLORS.gray50,
      }}
    >
      <input type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => e.target.files[0] && onFile(e.target.files[0])} />
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ marginBottom: 12, opacity: 0.4 }}>
        <path d="M16 4v16M10 10l6-6 6 6" stroke={COLORS.navy} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 22v4h20v-4" stroke={COLORS.navy} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <div style={{ fontSize: 14, color: COLORS.gray600, fontWeight: 500 }}>Drop prescription image here</div>
      <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 4 }}>or click to browse · JPG, PNG</div>
    </label>
  )
}

function LoadingSteps({ step }) {
  const steps = ['Reading prescription', 'Normalising drugs', 'Clinical analysis']
  return (
    <div style={{ padding: '32px 0', textAlign: 'center' }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, justifyContent: 'center' }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: i < step ? COLORS.teal : i === step ? COLORS.tealLight : COLORS.gray100,
            border: `1px solid ${i <= step ? COLORS.teal : COLORS.gray200}`,
            transition: 'all 0.3s',
          }}>
            {i < step
              ? <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              : i === step
                ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.teal, animation: 'pulse 1s infinite' }} />
                : null
            }
          </div>
          <span style={{ fontSize: 13, color: i <= step ? COLORS.gray800 : COLORS.gray400, fontWeight: i === step ? 600 : 400 }}>{s}</span>
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}

export default function App() {
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [loadingStep, setLoadingStep] = useState(-1)
  const [error, setError] = useState(null)

  const handleFile = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = ev => setImage(ev.target.result)
    reader.readAsDataURL(file)
    setResult(null)
    setError(null)
  }, [])

  const extract = async () => {
    if (!image) return
    setLoadingStep(0)
    setError(null)
    setResult(null)
    try {
      const base64 = image.split(',')[1]
      const mime = image.split(';')[0].split(':')[1]

      setTimeout(() => setLoadingStep(1), 2000)
      setTimeout(() => setLoadingStep(2), 4000)

      const res = await fetch('http://localhost:3001/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 800,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mime, data: base64 } },
              { type: 'text', text: 'Read this prescription image.' }
            ]
          }]
        })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    }
    setLoadingStep(-1)
  }

  const conf = result && confidenceConfig[result.confidence]

  return (
    <div style={{ minHeight: '100vh', background: COLORS.gray50, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: COLORS.navy, padding: '0 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2v14M2 9h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.white, letterSpacing: '-0.02em' }}>RxReader</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            by Aduru Analytics
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: COLORS.navy, paddingBottom: 40 }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '0', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize:  'clamp(22px, 6vw, 36px)', fontWeight: 700, color: COLORS.white, margin: '0 0 12px', letterSpacing: '-0.03em' }}>
            Prescription Intelligence
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Upload any handwritten or printed prescription. Get instant drug extraction, clinical insights, and interaction alerts — built for Ghana's healthcare context.
          </p>
        </div>
      </div>

      {/* Main card */}
      <div style={{ maxWidth: 480, margin: '-24px auto 40px', padding: '0 24px' }}>
        <div style={{ background: COLORS.white, borderRadius: 0, border: 'none', overflow: 'hidden' }}>
          {/* Upload section */}
          <div style={{ padding: 24 }}>
            <UploadZone onFile={handleFile} image={image} />
            {image && loadingStep === -1 && (
              <button onClick={extract} style={{
                marginTop: 16, width: '100%', padding: '13px 0',
                background: COLORS.teal, color: COLORS.white,
                border: 'none', borderRadius: 10, fontSize: 15,
                fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.01em',
                transition: 'opacity 0.15s',
              }}
                onMouseOver={e => e.target.style.opacity = '0.9'}
                onMouseOut={e => e.target.style.opacity = '1'}
              >
                Analyse Prescription
              </button>
            )}
          </div>

          {/* Loading */}
          {loadingStep >= 0 && <div style={{ borderTop: `1px solid ${COLORS.gray100}` }}><LoadingSteps step={loadingStep} /></div>}

          {/* Error */}
          {error && (
            <div style={{ margin: '0 24px 24px', padding: 14, background: COLORS.redLight, borderRadius: 10, border: `1px solid ${COLORS.redBorder}`, fontSize: 13, color: COLORS.red }}>
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={{ borderTop: `1px solid ${COLORS.gray100}` }}>

              {/* Prescription meta */}
              <div style={{ padding: '20px 24px', background: COLORS.white, borderBottom: `1px solid ${COLORS.gray100}`, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 3 }}>Prescriber</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.gray800 }}>{result.prescriber || '—'}</div>
                </div>
                <div style={{ width: 1, height: 32, background: COLORS.gray200 }} />
                <div>
                  <div style={{ fontSize: 11, color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 3 }}>Date</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.gray800 }}>{result.date || '—'}</div>
                </div>
                <div style={{ width: 1, height: 32, background: COLORS.gray200 }} />
                <div>
                  {conf && <Badge label={conf.label} color={conf.color} />}
                </div>
              </div>

              {/* Medications */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.gray400, marginBottom: 14 }}>
                  {result.medications?.length || 0} medication{result.medications?.length !== 1 ? 's' : ''} · tap to expand
                </div>
                {result.medications?.map((m, i) => {
                  const info = result.drug_info?.find(d => d.drug === m.drug)
                  return <DrugCard key={i} med={m} info={info} />
                })}
              </div>

              {/* Interactions */}
              {result.interactions?.length > 0 && (
                <div style={{ padding: '0 24px 20px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.gray400, marginBottom: 14 }}>
                    Drug interactions
                  </div>
                  {result.interactions.map((ix, i) => {
                    const sc = severityConfig[ix.severity] || severityConfig.mild
                    return (
                      <div key={i} style={{
                        background: COLORS.white, border: `1px solid ${COLORS.gray200}`,
                        borderRadius: 10, padding: '12px 16px', marginBottom: 10,
                        borderLeft: `3px solid ${ix.severity === 'severe' ? COLORS.red : ix.severity === 'moderate' ? COLORS.amber : COLORS.gray400}`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray800 }}>{ix.drugs.join(' + ')}</span>
                          <Badge label={sc.label} color={sc.color} />
                        </div>
                        <p style={{ fontSize: 13, color: COLORS.gray600, margin: 0, lineHeight: 1.5 }}>{ix.description}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Summary */}
              {result.interaction_summary && (
                <div style={{ margin: '0 24px 24px', padding: '12px 16px', background: COLORS.tealLight, borderRadius: 10, border: `1px solid ${COLORS.tealBorder}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: COLORS.teal, marginBottom: 4 }}>Clinical summary</div>
                  <p style={{ fontSize: 13, color: '#0a4a42', margin: 0, lineHeight: 1.6 }}>{result.interaction_summary}</p>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 12, color: COLORS.gray400, marginTop: 20, lineHeight: 1.7 }}>
          Powered by Claude AI · Built by Aduru Analytics · Always verify AI-extracted data with a qualified pharmacist
        </p>
      </div>
    </div>
  )
}