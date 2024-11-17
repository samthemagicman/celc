import { useRef, useState } from "react";

export const DraggableDiv = ({
  className = "",
  children,
  scrollYRoot = false,
}: {
  className?: string;
  children: React.ReactNode;
  scrollYRoot?: boolean;
}) => {
  const ourRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const handleDragStart: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!ourRef.current) return;
    const slider = ourRef.current;
    const startX = e.pageX - slider.offsetLeft;
    const startY = e.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
    setIsMouseDown(true);
    document.body.style.cursor = "grabbing";
  };
  const handleDragEnd = () => {
    setIsMouseDown(false);
    if (!ourRef.current) return;
    document.body.style.cursor = "default";
  };
  const handleDrag: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isMouseDown || !ourRef.current) return;
    e.preventDefault();
    const slider = ourRef.current;
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkX = x - mouseCoords.current.startX;
    const walkY = y - mouseCoords.current.startY;
    slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    slider.scrollTop =
      mouseCoords.current.scrollTop - (scrollYRoot ? 0 : walkY);
    window.scrollBy(0, scrollYRoot ? -walkY : 0);
  };

  return (
    <div
      role="presentation"
      ref={ourRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      className={className}
    >
      {children}
    </div>
  );
};
