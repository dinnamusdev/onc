export const trimOnBlur = (onBlur: () => void, onChange: (value: string) => void) => (e: React.FocusEvent<HTMLInputElement>) => {
  const trimmed = e.target.value.trim();
  onChange(trimmed);
  onBlur();
};

export const conditionalSchema = (isPublishing: boolean) => ({
  required: (message: string) => (isPublishing ? message : false),

  validateRequiredTrim: (value: string, message: string) => {
    const trimmed = value.trim();
    if (!trimmed && isPublishing) return message;
    if (!trimmed) return true;
    return true;
  },

  validateSlug: (value: string, isPublishing: boolean) => {
    const trimmed = value.trim();
    if (!trimmed && !isPublishing) return true;
    if (!trimmed) return 'Slug cannot be empty or contain only spaces';

    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)
      ? true
      : 'Only lowercase letters, numbers, and hyphens allowed (no leading, trailing, or repeated hyphens)';
  },

  validateContent: (value: unknown, message: string) => {
    if (typeof value !== 'string') return true;
    const trimmed = value.replace(/<p><br><\/p>/g, '').trim();
    if (!trimmed && isPublishing) return message;

    return true;
  },

  validateFile: (file: unknown, message: string) => {
    const isValidFile = file instanceof File || (file && typeof file === 'object' && 'url' in file && file.url);

    if (!isValidFile && isPublishing) return message;
    return true;
  }
});

export const getBlogFormSchemas = (isPublishing: boolean) => {
  const cond = conditionalSchema(isPublishing);

  return {
    titleSchema: {
      required: cond.required('Blog title is required')
    },

    slugSchema: {
      required: cond.required('Slug is required'),
      validate: {
        slug: (value: string) => cond.validateSlug(value, isPublishing)
      }
    },

    categorySchema: {
      required: cond.required('At least one category is required')
    },

    seoTitleSchema: {
      required: cond.required('SEO title is required')
    },

    contentSchema: {
      required: cond.required('Blog content is required'),
      validate: {
        trim: (value: unknown) => cond.validateContent(value, 'Blog content cannot be empty')
      }
    },

    bannerSchema: {
      validate: {
        file: (file: unknown) => cond.validateFile(file, 'Cover image is required')
      }
    }
  };
};
