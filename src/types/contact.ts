// @data
import { CountryType } from '@/data/countries';

// @third-party
import { Control, FieldValues } from 'react-hook-form';

export interface ContactFieldProps<TFieldValues extends FieldValues> {
  dialCode?: string;
  placeholder?: string;
  helpText?: string;
  isDisabled?: boolean;
  isCountryDisabled?: boolean;
  fullWidth?: boolean;
  control: Control<TFieldValues>;
  isError?: boolean;
  onCountryChange?: (selectedCountry: CountryType) => void;
}
