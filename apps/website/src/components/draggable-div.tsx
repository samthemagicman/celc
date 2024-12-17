import { MouseEvent, useRef, useState } from "react";
import { cn } from "~/lib/utils";

export const DraggableDiv = ({
  className = "",
  children,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const ourRef = useRef<HTMLDivElement>(null);
  const innerDiv = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const enableInnerDivEvents = () => {
    if (!innerDiv.current) return;
    innerDiv.current.style.pointerEvents = "auto";
  };
  const disableInnerDivEvents = () => {
    if (!innerDiv.current) return;
    innerDiv.current.style.pointerEvents = "none";
  };

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
  const handleDragEnd = (e: MouseEvent<HTMLDivElement>) => {
    enableInnerDivEvents();
    setIsMouseDown(false);
    e.preventDefault();
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
    slider.scrollTop = mouseCoords.current.scrollTop - walkY;

    const movedMagnitude = Math.sqrt(walkX ** 2 + walkY ** 2);
    // slider.scrollTop =
    //   mouseCoords.current.scrollTop - (scrollYRoot ? 0 : walkY);
    // window.scrollBy(0, scrollYRoot ? -walkY : 0);

    if (movedMagnitude > 10) disableInnerDivEvents();

    // setTimeout(enableInnerDivEvents, 100);
  };

  return (
    <div
      style={style}
      role="presentation"
      ref={ourRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      className={cn(className, "")}
    >
      <div ref={innerDiv}>{children}</div>
    </div>
  );
};
