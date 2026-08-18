import { FormEvent, ReactNode } from 'react';

// @project
import { ModalSize } from '@/enum';

export interface ModalHeader {
  title?: string;
  subheader?: string;
  closeButton?: boolean;
}

export interface ModalSectionProps {
  header?: ModalHeader;
  footer?: ReactNode;
  modalContent: ReactNode;
}

export interface ModalProps extends ModalSectionProps {
  open: boolean;
  maxWidth?: ModalSize;
  closeOnBackdropClick?: boolean;
  onClose: () => void;
  onFormSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}
