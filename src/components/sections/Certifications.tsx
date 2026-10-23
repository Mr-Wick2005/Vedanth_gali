import type { CertificationRow } from '@/types/database'

interface CertificationsProps {
  certifications: CertificationRow[]
}

export function Certifications({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="border-border/40 border-t py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-accent font-mono text-xs tracking-widest uppercase">
            05 — CERTIFICATIONS
          </span>
          <h2 className="font-display text-text mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
            Training & Credentials
          </h2>
          <p className="text-muted mt-2 font-mono text-xs">
            Specialized engineering coursework, database certifications, and simulations.
          </p>
        </div>

        {/* Certifications Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="border-border bg-surface hover:border-border-hover flex flex-col justify-between rounded-lg border p-6 transition-colors"
            >
              <div>
                <div className="text-muted flex items-center justify-between font-mono text-xs">
                  <span className="text-accent">{cert.issuer}</span>
                  <span>{cert.year}</span>
                </div>
                <h3 className="font-display text-text mt-2.5 text-base font-bold sm:text-lg">
                  {cert.title}
                </h3>
              </div>

              {cert.credential_url ? (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent mt-4 inline-flex items-center gap-1 font-mono text-xs hover:underline"
                >
                  Verify Credential ↗
                </a>
              ) : (
                <span className="text-muted/60 mt-4 font-mono text-[11px]">
                  Verified Completion
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
