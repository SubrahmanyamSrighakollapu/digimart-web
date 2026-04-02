// Shared Admin Design System — Brand: Primary #EC5B13 | Secondary #F7EEEA

export const T = {
  // ── Brand ──────────────────────────────────────────────────
  primary:       '#EC5B13',
  primaryHover:  '#D44E0E',
  primaryLight:  '#FEF0E9',
  primaryMid:    '#FDDCCC',
  primaryDark:   '#B84510',

  secondary:     '#F7EEEA',
  secondaryDark: '#EDD9CF',

  // ── Semantic ───────────────────────────────────────────────
  success:       '#16a34a',
  successLight:  '#dcfce7',
  successMid:    '#bbf7d0',

  danger:        '#dc2626',
  dangerLight:   '#fee2e2',

  warning:       '#d97706',
  warningLight:  '#fef3c7',

  info:          '#0369a1',
  infoLight:     '#e0f2fe',

  // ── Neutrals ───────────────────────────────────────────────
  bg:            '#faf8f6',       // warm off-white
  surface:       '#ffffff',
  border:        '#e8ddd8',       // warm border
  borderLight:   '#f3ede9',       // very light warm
  text:          '#1c1917',       // neutral near-black (not warm-tinted)
  textMuted:     '#78716c',       // warm-neutral muted
  textLight:     '#a8a29e',       // warm-neutral light

  // ── Typography ─────────────────────────────────────────────
  fontSm:   '12px',
  fontBase: '13px',
  fontMd:   '14px',
  fontLg:   '15px',
  fontXl:   '18px',
  font2xl:  '22px',

  // ── Shape & Shadow ─────────────────────────────────────────
  radius:   '10px',
  radiusSm: '6px',
  radiusLg: '14px',
  shadow:   '0 1px 3px rgba(236,91,19,0.06), 0 4px 16px rgba(0,0,0,0.04)',
  shadowMd: '0 4px 24px rgba(236,91,19,0.12)',
  shadowLg: '0 8px 32px rgba(236,91,19,0.16)',
};

// ─── Gradient helpers ────────────────────────────────────────
export const G = {
  primary:  'linear-gradient(135deg, #EC5B13 0%, #D44E0E 100%)',
  warm:     'linear-gradient(135deg, #EC5B13 0%, #f97316 100%)',
  soft:     'linear-gradient(135deg, #F7EEEA 0%, #FDDCCC 100%)',
  hero:     'linear-gradient(135deg, #EC5B13 0%, #F07030 60%, #F5924A 100%)',
  success:  'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
  danger:   'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  warning:  'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  info:     'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
};

// ─── Page Header ─────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
    <div>
      <h1 style={{ margin: 0, fontSize: T.font2xl, fontWeight: 700, color: T.text }}>{title}</h1>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: T.fontBase, color: T.textMuted }}>{subtitle}</p>}
    </div>
    {actions && <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{actions}</div>}
  </div>
);

// ─── Card ────────────────────────────────────────────────────
export const Card = ({ children, style = {}, noPad = false }) => (
  <div style={{
    backgroundColor: T.surface, borderRadius: T.radiusLg,
    border: `1px solid ${T.borderLight}`, boxShadow: T.shadow,
    padding: noPad ? 0 : '24px', ...style
  }}>
    {children}
  </div>
);

// ─── Section Label ───────────────────────────────────────────
export const SectionLabel = ({ children, style = {} }) => (
  <p style={{
    fontSize: T.fontSm, fontWeight: 700, color: T.primary,
    textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px', ...style
  }}>
    {children}
  </p>
);

// ─── Primary Button ──────────────────────────────────────────
export const Btn = ({ children, onClick, color = T.primary, disabled, type = 'button', style = {}, size = 'md' }) => {
  const pad = size === 'sm' ? '7px 14px' : '10px 20px';
  const fs  = size === 'sm' ? T.fontBase : T.fontMd;
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: pad, backgroundColor: disabled ? '#d1c4bc' : color,
      color: 'white', border: 'none', borderRadius: T.radius,
      fontWeight: 600, fontSize: fs, cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'opacity 0.15s, transform 0.1s', whiteSpace: 'nowrap', ...style
    }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {children}
    </button>
  );
};

// ─── Ghost Button ────────────────────────────────────────────
export const GhostBtn = ({ children, onClick, type = 'button', style = {} }) => (
  <button type={type} onClick={onClick} style={{
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '10px 20px', backgroundColor: T.secondary, color: T.textMuted,
    border: `1px solid ${T.border}`, borderRadius: T.radius,
    fontWeight: 600, fontSize: T.fontMd, cursor: 'pointer', ...style
  }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = T.secondaryDark}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = T.secondary}
  >
    {children}
  </button>
);

// ─── Badge ───────────────────────────────────────────────────
const badgeMap = {
  primary: { bg: T.primaryLight,  color: T.primaryDark },
  success: { bg: '#dcfce7',       color: '#15803d'     },
  danger:  { bg: '#fee2e2',       color: '#b91c1c'     },
  warning: { bg: '#fef3c7',       color: '#92400e'     },
  info:    { bg: '#e0f2fe',       color: '#075985'     },
  neutral: { bg: T.secondary,     color: T.textMuted   },
};

export const Badge = ({ children, variant = 'neutral' }) => {
  const s = badgeMap[variant] || badgeMap.neutral;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '999px',
      fontSize: T.fontSm, fontWeight: 600, backgroundColor: s.bg, color: s.color
    }}>
      {children}
    </span>
  );
};

export const getStatusVariant = (status = '') => {
  const s = status.toLowerCase();
  if (s.includes('active') || s.includes('approved') || s.includes('success') || s.includes('completed')) return 'success';
  if (s.includes('pending') || s.includes('review') || s.includes('hold')) return 'warning';
  if (s.includes('reject') || s.includes('fail') || s.includes('inactive')) return 'danger';
  return 'neutral';
};

// ─── Data Table ──────────────────────────────────────────────
export const DataTable = ({ headers, children, loading, empty }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: T.secondary }}>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: '12px 18px', textAlign: 'left', fontSize: '11px',
              fontWeight: 700, color: T.primary, borderBottom: `1px solid ${T.border}`,
              whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading
          ? <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: '48px', color: T.textMuted, fontSize: T.fontLg }}>Loading...</td></tr>
          : empty
            ? <tr><td colSpan={headers.length}><EmptyState /></td></tr>
            : children}
      </tbody>
    </table>
  </div>
);

export const Td = ({ children, style = {} }) => (
  <td style={{ padding: '13px 18px', fontSize: T.fontMd, color: T.text, borderBottom: `1px solid ${T.borderLight}`, ...style }}>
    {children}
  </td>
);

export const Tr = ({ children, onClick }) => (
  <tr onClick={onClick} style={{ transition: 'background 0.12s', cursor: onClick ? 'pointer' : 'default' }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = T.secondary}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    {children}
  </tr>
);

// ─── Empty State ─────────────────────────────────────────────
export const EmptyState = ({ title = 'No data found', subtitle = 'Try adjusting your filters or search criteria' }) => (
  <div style={{ textAlign: 'center', padding: '64px 24px' }}>
    <div style={{
      width: '56px', height: '56px', borderRadius: '50%', backgroundColor: T.primaryLight,
      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    </div>
    <p style={{ margin: '0 0 6px', fontSize: T.fontXl, fontWeight: 600, color: T.text }}>{title}</p>
    <p style={{ margin: 0, fontSize: T.fontMd, color: T.textMuted }}>{subtitle}</p>
  </div>
);

// ─── Search Bar ──────────────────────────────────────────────
export const SearchBar = ({ value, onChange, placeholder = 'Search...', style = {} }) => (
  <div style={{ position: 'relative', ...style }}>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.textLight} strokeWidth="2.5"
      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input type="text" value={value} onChange={onChange} placeholder={placeholder} style={{
      width: '100%', padding: '10px 14px 10px 36px', border: `1px solid ${T.border}`,
      borderRadius: T.radius, fontSize: T.fontMd, outline: 'none',
      backgroundColor: T.surface, color: T.text, boxSizing: 'border-box'
    }}
      onFocus={e => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 3px ${T.primaryLight}`; }}
      onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

// ─── Select Input ────────────────────────────────────────────
export const SelectInput = ({ value, onChange, children, style = {}, ...props }) => (
  <select value={value} onChange={onChange} {...props} style={{
    padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: T.radius,
    fontSize: T.fontMd, backgroundColor: T.surface, color: T.text,
    outline: 'none', cursor: 'pointer', ...style
  }}
    onFocus={e => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 3px ${T.primaryLight}`; }}
    onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
  >
    {children}
  </select>
);

// ─── Filter Bar ──────────────────────────────────────────────
export const FilterBar = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
    {children}
  </div>
);

// ─── Form Field ──────────────────────────────────────────────
export const FormField = ({ label, children, fullWidth = false, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: fullWidth ? '1 / -1' : undefined, ...style }}>
    {label && <label style={{ fontSize: T.fontBase, fontWeight: 600, color: T.text }}>{label}</label>}
    {children}
  </div>
);

// ─── Input Field ─────────────────────────────────────────────
export const InputField = ({ style = {}, ...props }) => (
  <input {...props} style={{
    padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: T.radius,
    fontSize: T.fontMd, outline: 'none', backgroundColor: T.surface,
    color: T.text, width: '100%', boxSizing: 'border-box', ...style
  }}
    onFocus={e => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 3px ${T.primaryLight}`; }}
    onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
  />
);

// ─── Select Field ────────────────────────────────────────────
export const SelectField = ({ children, style = {}, ...props }) => (
  <select {...props} style={{
    padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: T.radius,
    fontSize: T.fontMd, backgroundColor: T.surface, color: T.text,
    outline: 'none', width: '100%', cursor: 'pointer', ...style
  }}
    onFocus={e => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 3px ${T.primaryLight}`; }}
    onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
  >
    {children}
  </select>
);

// ─── Textarea Field ──────────────────────────────────────────
export const TextareaField = ({ style = {}, ...props }) => (
  <textarea {...props} style={{
    padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: T.radius,
    fontSize: T.fontMd, outline: 'none', backgroundColor: T.surface,
    color: T.text, width: '100%', boxSizing: 'border-box',
    resize: 'vertical', minHeight: '80px', ...style
  }}
    onFocus={e => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 3px ${T.primaryLight}`; }}
    onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
  />
);

// ─── Toggle ──────────────────────────────────────────────────
export const Toggle = ({ checked, onChange, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    {label && <span style={{ fontSize: T.fontMd, color: T.text, fontWeight: 500 }}>{label}</span>}
    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '24px',
        backgroundColor: checked ? T.primary : '#d1c4bc', transition: 'background 0.25s'
      }} />
      <span style={{
        position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        backgroundColor: 'white', transition: 'left 0.25s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </label>
  </div>
);

// ─── Modal ───────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, width = '560px' }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(26,15,10,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, backdropFilter: 'blur(2px)'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: T.surface, borderRadius: T.radiusLg,
        width, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(236,91,19,0.15)', border: `1px solid ${T.borderLight}`
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: `1px solid ${T.borderLight}`,
          position: 'sticky', top: 0, backgroundColor: T.surface, zIndex: 1,
          background: `linear-gradient(to right, ${T.surface}, ${T.secondary})`
        }}>
          <h2 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>{title}</h2>
          <button onClick={onClose} style={{
            background: T.secondary, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: T.textMuted
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Confirm Dialog ──────────────────────────────────────────
export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', confirmColor = T.danger, loading }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(26,15,10,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, backdropFilter: 'blur(2px)'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: T.surface, borderRadius: T.radiusLg, width: '400px',
        maxWidth: '95vw', padding: '32px', boxShadow: '0 20px 60px rgba(236,91,19,0.15)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          backgroundColor: confirmColor === T.danger ? T.dangerLight : T.primaryLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={confirmColor} strokeWidth="2.5">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 style={{ margin: '0 0 10px', fontSize: T.fontXl, fontWeight: 700, color: T.text }}>{title}</h3>
        <p style={{ margin: '0 0 28px', fontSize: T.fontMd, color: T.textMuted, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <Btn onClick={onConfirm} color={confirmColor} disabled={loading}>
            {loading ? 'Processing...' : confirmLabel}
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Form Grid ───────────────────────────────────────────────
export const FormGrid = ({ children, cols = 2 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '18px 24px' }}>
    {children}
  </div>
);

// ─── Modal Actions ───────────────────────────────────────────
export const ModalActions = ({ children }) => (
  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${T.borderLight}` }}>
    {children}
  </div>
);

// ─── Verify Input ────────────────────────────────────────────
export const VerifyInput = ({ label, name, value, onChange, placeholder, onVerify, verified }) => (
  <FormField label={label} fullWidth>
    <div style={{ display: 'flex' }}>
      <input name={name} value={value} onChange={onChange} placeholder={placeholder} style={{
        flex: 1, padding: '10px 14px', border: `1px solid ${T.border}`,
        borderRadius: `${T.radius} 0 0 ${T.radius}`, fontSize: T.fontMd,
        outline: 'none', borderRight: 'none', backgroundColor: T.surface, color: T.text
      }}
        onFocus={e => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 3px ${T.primaryLight}`; }}
        onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none'; }}
      />
      <button type="button" onClick={onVerify} style={{
        padding: '10px 20px',
        backgroundColor: verified ? T.success : T.primary,
        color: 'white', border: 'none',
        borderRadius: `0 ${T.radius} ${T.radius} 0`,
        fontWeight: 600, fontSize: T.fontBase, cursor: 'pointer', whiteSpace: 'nowrap'
      }}>
        {verified ? '✓ Verified' : 'Verify'}
      </button>
    </div>
  </FormField>
);

// ─── Step Indicator ──────────────────────────────────────────
export const StepIndicator = ({ steps, current }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
    {steps.map((s, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: T.fontBase,
            backgroundColor: i + 1 < current ? T.success : i + 1 === current ? T.primary : T.secondary,
            color: i + 1 <= current ? 'white' : T.textMuted, flexShrink: 0,
            border: i + 1 === current ? `2px solid ${T.primaryDark}` : 'none'
          }}>
            {i + 1 < current ? '✓' : i + 1}
          </div>
          <span style={{ fontSize: T.fontBase, fontWeight: i + 1 === current ? 700 : 400, color: i + 1 === current ? T.primary : T.textMuted, whiteSpace: 'nowrap' }}>
            {s}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div style={{ flex: 1, height: '2px', backgroundColor: i + 1 < current ? T.success : T.border, margin: '0 12px' }} />
        )}
      </div>
    ))}
  </div>
);

// ─── Icon Button ─────────────────────────────────────────────
export const IconBtn = ({ children, onClick, title, color = T.textMuted, hoverColor = T.primary }) => (
  <button onClick={onClick} title={title} style={{
    background: 'none', border: 'none', cursor: 'pointer', color,
    padding: '6px', borderRadius: T.radiusSm, display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s, background 0.15s'
  }}
    onMouseEnter={e => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.backgroundColor = T.primaryLight; }}
    onMouseLeave={e => { e.currentTarget.style.color = color; e.currentTarget.style.backgroundColor = 'transparent'; }}
  >
    {children}
  </button>
);
