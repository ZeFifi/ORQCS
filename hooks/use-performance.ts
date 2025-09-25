import { useEffect, useRef } from 'react';

interface PerformanceOptions {
  enabled?: boolean;
  logThreshold?: number;
}

export function useRenderCount(componentName: string, options: PerformanceOptions = {}) {
  const { enabled = __DEV__, logThreshold = 10 } = options;
  const renderCount = useRef(0);

  if (enabled) {
    renderCount.current += 1;

    useEffect(() => {
      if (renderCount.current > logThreshold) {
        console.warn(`${componentName} has rendered ${renderCount.current} times. Consider optimization.`);
      }
    });
  }

  return renderCount.current;
}

export function useRenderTime(componentName: string, options: PerformanceOptions = {}) {
  const { enabled = __DEV__, logThreshold = 16 } = options; // 16ms for 60fps
  const startTime = useRef<number>(0);

  if (enabled) {
    startTime.current = performance.now();

    useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;

      if (renderTime > logThreshold) {
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms (threshold: ${logThreshold}ms)`);
      }
    });
  }
}

export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }

    previousProps.current = props;
  });
}

export function useComponentWillUnmount(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => callbackRef.current();
  }, []);
}