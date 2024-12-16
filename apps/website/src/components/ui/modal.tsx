import { X } from "lucide-react";
import React, { HTMLProps, useMemo } from "react";
import { createPortal } from "react-dom";
import { cn } from "~/lib/utils";

// Modal context
const ModalContext = React.createContext<{
  isOpen: boolean;
  onRequestClose?: () => void;
}>({ isOpen: false });

export type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onRequestClose?: () => void;
};
const Modal: React.FC<ModalProps> = ({
  isOpen = true,
  children,
  onRequestClose,
}) => {
  const contextMemo = useMemo(
    () => ({ isOpen, onRequestClose }),
    [isOpen, onRequestClose],
  );

  const [mounted, setMounted] = React.useState(false);
  const [transitionedIn, setTransitionedIn] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setTransitionedIn(false);
      const timeout = setTimeout(() => {
        setMounted(false);
      }, 200);

      return () => {
        clearTimeout(timeout);
      };
    } else {
      setMounted(true);
    }
    if (mounted && isOpen) {
      setTimeout(() => {
        setTransitionedIn(true);
      }, 10);
    }
  }, [isOpen, mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Create portal allows us to render an element somewhere else in the DOM. In this case, the body */}
      {createPortal(
        <ModalContext.Provider value={contextMemo}>
          <div>
            <button
              onClick={() => onRequestClose?.()}
              className={cn(
                "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[999] transition-all",
                {
                  "pointer-events-none": !transitionedIn,
                  "bg-transparent": !transitionedIn,
                },
              )}
            ></button>
            <ModalContainer
              className={cn("transition-all duration-100 top-0", {
                "opacity-0 pointer-events-none top-10": !transitionedIn,
              })}
            >
              {children}
            </ModalContainer>
          </div>
        </ModalContext.Provider>,
        document.body,
      )}
    </>
  );
};

const ModalContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full h-full pointer-events-none flex justify-center items-center z-[999]",
        className,
      )}
    >
      {children}
    </div>
  );
};

const ModalContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const modal = React.useContext(ModalContext);
  return (
    <div className="bg-white rounded-md shadow-md m-2 p-4 pointer-events-auto min-w-60 max-w-screen-sm relative">
      <X
        onClick={() => {
          modal.onRequestClose?.();
        }}
        className="absolute top-2 right-2 h-5 w-5 cursor-pointer hover:text-gray-500"
      />

      {children}
    </div>
  );
};

const ModalHeader: React.FC<HTMLProps<HTMLDivElement>> = (props) => {
  return <div className={cn("mb-2 mr-6", props.className)} {...props} />;
};

const ModalTitle: React.FC<HTMLProps<HTMLParagraphElement>> = (props) => {
  return (
    <p
      className={cn("text-xl font-semibold tracking-wide", props.className)}
      {...props}
    />
  );
};

const ModalBody: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

const ModalFooter: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="mt-4">{children}</div>;
};

export { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle };
