export const emailSchema = {
  required: 'O email é obrigatório',
  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Endereço de email inválido' }
};

export const passwordSchema = {
  required: 'A senha é obrigatória',
  minLength: { value: 8, message: 'A senha deve ter no mínimo 8 caracteres' },
  validate: {
    noSpaces: (value: string) => !/\s/.test(value) || 'A senha não pode conter espaços',
    hasUpperCase: (value: string) => /[A-Z]/.test(value) || 'A senha deve conter pelo menos uma letra maiúscula',
    hasNumber: (value: string) => /[0-9]/.test(value) || 'A senha deve conter pelo menos um número',
    hasSpecialChar: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'A senha deve conter pelo menos um caractere especial'
  }
};

export const firstNameSchema = {
  required: 'O nome é obrigatório',
  pattern: { value: /^[a-zA-Z\s]+$/, message: 'Nome inválido' },
  validate: {
    trim: (value: string) => {
      const trimmedValue = value.trim();
      return trimmedValue.length > 0 || 'O nome não pode ficar vazio ou conter apenas espaços';
    }
  },
  onBlur: (e: { target: { value: string } }) => {
    e.target.value = e.target.value.trim();
  }
};

export const lastNameSchema = {
  required: 'O sobrenome é obrigatório',
  pattern: { value: /^[a-zA-Z\s]+$/, message: 'Sobrenome inválido' },
  validate: {
    trim: (value: string) => {
      const trimmedValue = value.trim();
      return trimmedValue.length > 0 || 'O sobrenome não pode ficar vazio ou conter apenas espaços';
    }
  },
  onBlur: (e: { target: { value: string } }) => {
    e.target.value = e.target.value.trim();
  }
};

export const usernameSchema = {
  required: 'O nome de usuário é obrigatório',
  pattern: {
    value: /^[a-zA-Z0-9._]+$/, // Alphanumeric, underscores, and dots
    message: 'O nome de usuário só pode conter letras, números, pontos e sublinhados'
  },
  validate: {
    trim: (value: string) => {
      const trimmedValue = value.trim();
      return trimmedValue.length > 0 || 'O nome de usuário não pode ficar vazio ou conter apenas espaços';
    },
    noSpaces: (value: string) => {
      return !/\s/.test(value) || 'O nome de usuário não pode conter espaços';
    }
  },
  onBlur: (e: { target: { value: string } }) => {
    e.target.value = e.target.value.trim();
  }
};

export const contactSchema = {
  required: 'O número de contato é obrigatório',
  pattern: { value: /^[0-9().-]{7,15}$/, message: 'Número de contato inválido' }
};

export const otpSchema = {
  required: 'O código é obrigatório',
  minLength: { value: 6, message: 'O código deve ter exatamente 6 caracteres' }
};
