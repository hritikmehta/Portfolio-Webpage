# Connect CTA - Modern Retro Button Integration Brief

This note stores the requested React/shadcn integration instructions for the `Connect` CTA.

## Project Capability Check (Current Repository)
- Current repo is a static site (`index.html`, `styles.css`, `animations.js`).
- It does **not** currently use React, TypeScript, Tailwind, or shadcn/ui.

## Setup Instructions (when migrating to React app)
1. Create a React + TypeScript app (e.g. Next.js).
2. Install Tailwind CSS.
3. Initialize shadcn:
```bash
npx shadcn@latest init
```
4. Keep reusable UI components in `/components/ui`.

Why `/components/ui` matters:
- It is the default convention expected by shadcn docs/examples.
- It keeps generated and shared primitives consistent.
- It reduces path alias confusion when importing from `@/components/ui/...`.

## File Targets
- Component: `/components/ui/modern-retro-button.tsx`
- Demo usage: `demo.tsx` (or route/page component)
- Tailwind/global styles: `app/globals.css` or project `index.css`

## Component Code
```tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export interface ModernRetroButtonColors {
  textDefault?: string;
  textHover?: string;
  background?: string;
  borderColor?: string;
  boxShadow?: string;
  boxShadowHover?: string;
  svgRect?: string;
  svgRectFlicker?: string;
  elasticity?: string;
}

export interface ModernRetroButtonProps extends ModernRetroButtonColors {
  onClick?: () => void;
  label: string;
}

const ModernRetroButton: React.FC<ModernRetroButtonProps> = ({
  onClick,
  label,
  textDefault = "#f7f7ff",
  textHover = "#111118",
  background = "#f7f7ff",
  boxShadow = "0 0 0 0 #0763f7",
  boxShadowHover = "0 0 20px 2px #0763f7",
  svgRect = "#76b3fa",
  svgRectFlicker = "#0c79f7",
  elasticity = "elastic.out(12, 0.3)",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [textColor, setTextColor] = useState(textDefault);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => {
        setTextColor(textHover);
      }, 1000);
    } else {
      setTextColor(textDefault);
    }
    return () => clearTimeout(timer);
  }, [isHovered, textDefault, textHover]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (buttonRef.current) {
      const rects = buttonRef.current.querySelectorAll("rect.bar");
      gsap.to(rects, {
        duration: 0.8,
        ease: elasticity,
        x: "100%",
        stagger: 0.01,
        overwrite: true,
        onComplete: () => flickerEffect(rects),
      });
    }
  };

  const flickerEffect = (rects: NodeListOf<SVGRectElement>) => {
    gsap.fromTo(
      rects,
      { fill: svgRectFlicker },
      {
        fill: svgRect,
        duration: 0.1,
        ease: elasticity,
        repeat: -1,
        yoyo: true,
      }
    );
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (buttonRef.current) {
      const rects = buttonRef.current.querySelectorAll("rect.bar");
      gsap.to(rects, {
        duration: 0.8,
        ease: elasticity,
        x: "-100%",
        stagger: 0.01,
        overwrite: true,
        onComplete: () => {
          rects.forEach((node) => node.setAttribute("fill", svgRect));
        },
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      className="retro-button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        boxShadow: isHovered ? boxShadowHover : boxShadow,
        position: "relative",
        background: "transparent",
      }}
    >
      <svg
        className="bg-svg"
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          borderRadius: 15,
          pointerEvents: "none",
        }}
      >
        <rect x="0" y="0" width="100%" height="100%" rx="15" fill={background} />
      </svg>

      <svg
        className="bars-svg"
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          borderRadius: 15,
          pointerEvents: "none",
        }}
      >
        <g className="left">
          {[...Array(25)].map((_, index) => (
            <rect
              className="bar"
              key={index}
              x="-100%"
              y={index * 2}
              width="100%"
              height="2"
              fill={svgRect}
            />
          ))}
        </g>
      </svg>

      <span style={{ color: textColor, zIndex: 2, position: "relative" }}>
        {label}
      </span>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap");
        .retro-button {
          cursor: pointer;
          display: flex;
          font-weight: 500;
          font-style: italic;
          align-items: center;
          justify-content: center;
          font-family: "IBM Plex Mono", monospace;
          height: 50px;
          padding: 0 30px;
          border-radius: 15px;
          outline: none;
          transform: skew(-15deg);
          overflow: hidden;
          transition: transform 350ms, box-shadow 350ms;
        }
        .retro-button:hover {
          transform: scale(1.05) skew(-15deg);
        }
        span {
          transition: color 350ms;
        }
      `}</style>
    </button>
  );
};

export default ModernRetroButton;
```

## Demo Usage
```tsx
import ModernRetroButton from "@/components/ui/modern-retro-button";

export default function DemoModernRetroButton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      <div
        className="text-center text-lg font-bold px-4 py-2 rounded"
        style={{
          color: "var(--modern-retro-button-text-default)",
        }}
        role="alert"
      >
        ⚠️ Epilepsy Warning ⚠️
        <br />
        This button flickers on hover.
      </div>
      <ModernRetroButton
        label="Modern, Retro, or both?"
        onClick={() => alert("Modern Retro Button clicked!")}
        textDefault="var(--modern-retro-button-text-default)"
        textHover="var(--modern-retro-button-text-hover)"
        background="var(--modern-retro-button-background)"
        boxShadow="var(--modern-retro-button-box-shadow)"
        boxShadowHover="var(--modern-retro-button-box-shadow-hover)"
        svgRect="var(--modern-retro-button-svg-rect)"
        svgRectFlicker="var(--modern-retro-button-svg-rect-flicker)"
      />
    </div>
  );
}
```

## Dependency
```bash
npm install gsap
```

## Tailwind/Theming Snippet
```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --modern-retro-button-text-default: #3d1f00;
  --modern-retro-button-text-hover: #fff;
  --modern-retro-button-background: #fff4e6;
  --modern-retro-button-box-shadow: 0 0 0 0 #FFD580;
  --modern-retro-button-box-shadow-hover: 0 0 20px 2px #FFD580;
  --modern-retro-button-svg-rect: #FFD580;
  --modern-retro-button-svg-rect-flicker: #ff5f00;
}

.dark {
  --modern-retro-button-text-default: #f7f7ff;
  --modern-retro-button-text-hover: #111118;
  --modern-retro-button-background: #181a29;
  --modern-retro-button-box-shadow: 0 0 0 0 #0763f7;
  --modern-retro-button-box-shadow-hover: 0 0 20px 2px #0763f7;
  --modern-retro-button-svg-rect: #76b3fa;
  --modern-retro-button-svg-rect-flicker: #0c79f7;
}
```

## Integration Checklist
1. Analyze component structure and dependencies.
2. Review args/props/state.
3. Identify context/hooks and install required packages.
4. Clarify: data props, state management, required assets, responsive behavior, and placement.
5. Use Unsplash stock imagery if image placeholders are needed.
6. Use `lucide-react` icons if SVG/logo replacements are required.
