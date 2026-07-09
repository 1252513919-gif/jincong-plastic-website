type CapabilityTickerProps = {
  items: string[];
  label?: string;
  variant?: "compact" | "strip";
};

export function CapabilityTicker({
  items,
  label,
  variant = "compact"
}: CapabilityTickerProps) {
  return (
    <div className={`home-hero__ticker home-hero__ticker--${variant}`}>
      {label ? <p className="home-hero__ticker-label">{label}</p> : null}
      <div className="home-hero__ticker-window">
        <div className="home-hero__ticker-track">
          <TickerItems items={items} />
          <div aria-hidden="true">
            <TickerItems items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TickerItems({ items }: { items: string[] }) {
  return (
    <div className="home-hero__ticker-items">
      {items.map((item, index) => (
        <span className="home-hero__ticker-item" key={`${item}-${index}`}>
          {item}
        </span>
      ))}
    </div>
  );
}
