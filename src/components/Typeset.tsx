// @mui
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';

interface Props {
  heading: string;
  caption?: string;
  stackProps?: StackProps;
  headingProps?: TypographyProps;
  captionProps?: TypographyProps;
}

/***************************  COMMON - TYPESET  ***************************/

export default function Typeset({ heading, caption, stackProps, headingProps, captionProps }: Props) {
  const { sx: stackPropsSx, ...stackPropsRest } = stackProps || {};
  const { sx: headingPropsSx, ...headingPropsRest } = headingProps || {};
  const { sx: captionPropsSx, ...captionPropsRest } = captionProps || {};

  return (
    <Stack {...stackPropsRest} sx={{ gap: 0.5, ...stackPropsSx }}>
      <Typography variant="h6" {...headingPropsRest} sx={{ fontWeight: 400, ...headingPropsSx }}>
        {heading}
      </Typography>
      {caption && (
        <Typography variant="body2" {...captionPropsRest} sx={{ color: 'grey.700', ...captionPropsSx }}>
          {caption}
        </Typography>
      )}
    </Stack>
  );
}
