import { useState, useCallback, useRef } from 'react';

interface DragRotationOptions {
  sensitivity?: number; // How many pixels of drag = 1 degree
  onRotationChange?: (rotation: number) => void;
  onClick?: () => void;
}

export function useDragRotation(options: DragRotationOptions = {}) {
  const { sensitivity = 2, onRotationChange, onClick } = options;
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startX = useRef<number | null>(null);
  const startRotation = useRef<number>(0);
  const hasMoved = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only handle primary button (left click) or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    startX.current = e.clientX;
    startRotation.current = rotation;
    hasMoved.current = false;
    setIsDragging(true);
    
    // Capture pointer events even if they move outside the element
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }, [rotation]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || startX.current === null) return;
    
    const deltaX = e.clientX - startX.current;
    
    // Threshold to distinguish click from drag
    if (Math.abs(deltaX) > 5) {
      hasMoved.current = true;
    }
    
    if (hasMoved.current) {
      const deltaRotation = deltaX / sensitivity;
      let newRotation = (startRotation.current + deltaRotation) % 360;
      if (newRotation < 0) newRotation += 360;
      
      setRotation(newRotation);
      if (onRotationChange) {
        onRotationChange(newRotation);
      }
    }
  }, [isDragging, sensitivity, onRotationChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    startX.current = null;
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    
    // If it was just a click (no significant drag)
    if (!hasMoved.current && onClick) {
      onClick();
    }
    
    hasMoved.current = false;
  }, [onClick]);
  
  const handlePointerCancel = useCallback(() => {
    setIsDragging(false);
    startX.current = null;
    hasMoved.current = false;
  }, []);

  return {
    rotation,
    setRotation,
    isDragging,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      // Prevent default drag behavior on images
      onDragStart: (e: React.DragEvent) => e.preventDefault(),
    }
  };
}
