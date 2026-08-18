'use client';

import { useEffect, useState, ChangeEvent } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

// @assets
import { IconSearch } from '@tabler/icons-react';

// @types
interface Props extends OutlinedInputProps {
  value: string | number;
  onValueChange: (value: string | number) => void;
  debounce?: number;
  borderless?: boolean;
}

/***************************  REACT TABLE - DEBOUNCED INPUT  ***************************/

export default function DebouncedInput({
  value: initialValue,
  onValueChange,
  debounce = 500,
  size,
  startAdornment,
  borderless,
  ...props
}: Props) {
  const theme = useTheme();

  const [value, setValue] = useState<number | string>(initialValue);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onValueChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [value]);

  return (
    <OutlinedInput
      {...props}
      value={value}
      onChange={handleInputChange}
      startAdornment={
        startAdornment || (
          <InputAdornment position="start">
            <IconSearch color={theme.vars.palette.grey[700]} />
          </InputAdornment>
        )
      }
      {...(size && { size })}
      {...(borderless && { slotProps: { root: { sx: { boxShadow: 'unset' } }, notchedOutline: { sx: { border: 0 } } } })}
    />
  );
}
