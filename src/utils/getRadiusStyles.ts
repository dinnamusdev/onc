// @mui
import { SxProps, Theme } from '@mui/material/styles';

type RadiusCornerType = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

/***************************  CARD RADIUS - STYLES  ***************************/

export function getRadiusStyles(radius: number, ...corners: RadiusCornerType[]): SxProps<Theme> {
  const borderRadiusStyles: SxProps<Theme> = {
    '& .MuiPaper-root': {}
  };

  corners.forEach((corner) => {
    switch (corner) {
      case 'topLeft':
        borderRadiusStyles.borderTopLeftRadius = radius;
        borderRadiusStyles['& .MuiPaper-root'] = {
          borderTopLeftRadius: radius
        };
        break;
      case 'topRight':
        borderRadiusStyles.borderTopRightRadius = radius;
        borderRadiusStyles['& .MuiPaper-root'] = {
          borderTopRightRadius: radius
        };
        break;
      case 'bottomLeft':
        borderRadiusStyles.borderBottomLeftRadius = radius;
        borderRadiusStyles['& .MuiPaper-root'] = {
          borderBottomLeftRadius: radius
        };
        break;
      case 'bottomRight':
        borderRadiusStyles.borderBottomRightRadius = radius;
        borderRadiusStyles['& .MuiPaper-root'] = {
          borderBottomRightRadius: radius
        };
        break;
      default:
        break;
    }
  });

  return borderRadiusStyles;
}
