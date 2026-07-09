import type { CSSProperties } from "react";

type OrbitVisualizationProps = {
  items: string[];
  center: [string, string];
};

const itemLayout = [
  { angle: -90, radius: 220 },
  { angle: -50, radius: 238 },
  { angle: -12, radius: 232 },
  { angle: 28, radius: 238 },
  { angle: 68, radius: 220 },
  { angle: 106, radius: 218 },
  { angle: 145, radius: 226 },
  { angle: 184, radius: 218 },
  { angle: 224, radius: 226 }
];

export function OrbitVisualization({
  items,
  center
}: OrbitVisualizationProps) {
  return (
    <div className="home-hero__orbit-wrap">
      <div
        className="home-hero__orbit-stage"
        aria-label={items.join(", ")}
      >
        <div
          className="home-hero__orbit home-hero__orbit--four"
          aria-hidden="true"
        />
        <div
          className="home-hero__orbit home-hero__orbit--three"
          aria-hidden="true"
        />
        <div
          className="home-hero__orbit home-hero__orbit--two"
          aria-hidden="true"
        />
        <div
          className="home-hero__orbit home-hero__orbit--one"
          aria-hidden="true"
        />

        <div className="home-hero__orbit-center">
          <strong>{center[0]}</strong>
          <span>{center[1]}</span>
        </div>

        <div className="home-hero__orbit-items">
          {items.map((item, index) => {
            const layout = itemLayout[index % itemLayout.length];
            const style = {
              "--orbit-angle": `${layout.angle}deg`,
              "--orbit-radius": `${layout.radius}px`,
              "--orbit-delay": `${0.6 + index * 0.14}s`
            } as CSSProperties;

            return (
              <span
                className="home-hero__orbit-item"
                key={item}
                style={style}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
