import { X } from "lucide-react";
import React, { HTMLProps, useMemo } from "react";
import { createPortal } from "react-dom";
import { cn } from "~/lib/utils";

// Modal context
const ModalContext = React.createContext<{
  isOpen: boolean;
  onRequestClose?: () => void;
}>({ isOpen: false });

type ModalProps = {
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

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Create portal allows us to render an element somewhere else in the DOM. In this case, the body */}
      {createPortal(
        <ModalContext.Provider value={contextMemo}>
          <div>
            <button
              onClick={() => onRequestClose?.()}
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[999]"
            ></button>
            <ModalContainer>{children}</ModalContainer>
          </div>
        </ModalContext.Provider>,
        document.body,
      )}
    </>
  );
};

const ModalContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none flex justify-center items-center z-[999]">
      {children}
    </div>
  );
};

const ModalContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const modal = React.useContext(ModalContext);
  return (
    <div className="bg-white rounded-md shadow-md p-4 pointer-events-auto min-w-60 max-w-screen-sm relative">
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
  return <div className={cn("mb-2", props.className)} {...props} />;
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
