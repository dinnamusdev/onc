// @data
import { CurrencyType } from '@/data/currencies';

export interface CurrencyFieldProps {
  defaultCurrency?: string;
  defaultAmount?: string;
  placeholder?: string;
  helpText?: string;
  isDisabled?: boolean;
  isCurrencyDisabled?: boolean;
  fullWidth?: boolean;
  onCurrencyChange?: (selectedCurrency: CurrencyType) => void;
  onAmountChange?: (amount: string) => void;
}
