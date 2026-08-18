// @mui
import { SxProps } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import MuiModal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';

// @project
import MainCard from './MainCard';
import { ModalSize } from '@/enum';

// @types
import { ModalProps, ModalSectionProps } from '@/types/modal';

// @assets
import { IconX } from '@tabler/icons-react';

/***************************  MODAL - SIZES  ***************************/

const ModalMaxWidth: Record<ModalSize, number> = {
  [ModalSize.XS]: 300,
  [ModalSize.SM]: 400,
  [ModalSize.MD]: 600,
  [ModalSize.LG]: 800,
  [ModalSize.XL]: 1000
};

function ModalSection({
  header,
  footer,
  modalContent,
  modalClose,
  sx
}: ModalSectionProps & { sx?: SxProps; modalClose: (_event: object, reason: string) => void }) {
  return (
    <Stack sx={{ width: 1, ...sx }}>
      {header && (
        <CardHeader
          {...(header.title && { title: header.title })}
          {...(header.subheader && { subheader: header.subheader, subheaderTypographyProps: { color: 'grey.700' } })}
          {...(header.closeButton && {
            action: (
              <IconButton variant="outlined" color="secondary" aria-label="close" onClick={() => modalClose({}, 'closeButton')}>
                <IconX size={20} />
              </IconButton>
            )
          })}
        />
      )}

      <CardContent sx={{ flexGrow: 1, overflowY: 'auto' }}>{modalContent}</CardContent>
      {footer && <CardActions>{footer}</CardActions>}
    </Stack>
  );
}

/***************************  MODAL  ***************************/

export default function Modal({
  open,
  onClose,
  maxWidth = ModalSize.SM,
  header,
  footer,
  modalContent,
  closeOnBackdropClick = false,
  onFormSubmit
}: ModalProps) {
  const modalClose = (_event: object, reason: string) => {
    if (!closeOnBackdropClick && reason === 'backdropClick') return;
    onClose();
  };

  const commonProps = { header, footer, modalContent, modalClose };

  return (
    <MuiModal open={open} onClose={modalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <MainCard
        sx={{
          p: 0,
          width: 1,
          maxWidth: ModalMaxWidth[maxWidth],
          m: 1,
          maxHeight: 'calc(100% - 16px)',
          display: 'flex',
          '&:focus-visible': { outline: 'none' }
        }}
      >
        {onFormSubmit ? (
          <form onSubmit={onFormSubmit} autoComplete="off" style={{ width: '100%' }}>
            <ModalSection {...commonProps} sx={{ height: 1 }} />
          </form>
        ) : (
          <ModalSection {...commonProps} />
        )}
      </MainCard>
    </MuiModal>
  );
}
