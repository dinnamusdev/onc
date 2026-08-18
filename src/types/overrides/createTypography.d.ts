import '@mui/material/styles';

declare module '@mui/material/styles' {
  export type Variant = 'caption1';

  export interface TypographyVariantsOptions extends Partial<Record<Variant, TypographyStyleOptions> & FontStyleOptions> {
    caption1?: TypographyStyleOptions;
  }

  export interface Typography extends Record<Variant, TypographyStyle>, FontStyle, TypographyUtils {
    caption1: TypographyStyle;
  }

  interface TypographyVariants {
    caption1: CSSProperties;
  }

  interface TypographyVariantsOptions {
    caption1?: CSSProperties;
  }
}
