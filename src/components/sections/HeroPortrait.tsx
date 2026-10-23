interface HeroPortraitProps {
  avatarUrl?: string | null
  avatarAlt?: string | null
}

export function HeroPortrait({ avatarUrl, avatarAlt = 'Vedanth Gali' }: HeroPortraitProps) {
  // Use cutout by default or CMS avatar if specified
  const imageSrc = avatarUrl || '/images/vedanth-cutout.webp'

  return (
    <div className="relative flex w-full max-w-[480px] items-end justify-center lg:justify-end">
      {/* Soft subtle ambient background wash */}
      <div
        aria-hidden="true"
        className="bg-accent/15 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
      />

      {/* Clean, Simple Portrait Image with gentle bottom fade */}
      <div
        className="relative select-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={avatarAlt || 'Vedanth Gali'}
          width={349}
          height={390}
          loading="eager"
          className="h-[320px] w-auto max-w-full object-contain sm:h-[400px] md:h-[460px] lg:h-[500px]"
        />
      </div>
    </div>
  )
}
