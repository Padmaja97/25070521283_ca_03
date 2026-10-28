import { Component, Suspense, lazy, useEffect, useState } from 'react';

const SculptureCanvas = lazy(() => import('./SculptureCanvas'));

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const context = window.WebGLRenderingContext && canvas.getContext('webgl2');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

class CanvasFallbackBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <div className="sculpture-fallback" aria-hidden="true"><span className="fallback-ring ring-a" /><span className="fallback-ring ring-b" /><span className="fallback-hub" /></div>;
    return this.props.children;
  }
}

export default function AnimatedBackground() {
  const [webgl, setWebgl] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setWebgl(supportsWebGL());
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  if (!webgl) return <div className="sculpture-fallback" aria-hidden="true"><span className="fallback-ring ring-a" /><span className="fallback-ring ring-b" /><span className="fallback-hub" /></div>;

  return <div className="sculpture-canvas" aria-hidden="true">
    <CanvasFallbackBoundary>
      <Suspense fallback={<div className="sculpture-fallback"><span className="fallback-ring ring-a" /><span className="fallback-ring ring-b" /><span className="fallback-hub" /></div>}>
        <SculptureCanvas reducedMotion={reducedMotion} />
      </Suspense>
    </CanvasFallbackBoundary>
  </div>;
}
