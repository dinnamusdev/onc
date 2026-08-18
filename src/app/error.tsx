'use client';

import { useEffect } from 'react';

// @project
import Error500Page from '@/components/Error500';

/***************************  ERROR 500 - DATA  ***************************/

const data = {
  primaryBtn: { children: 'Back to Home Page' },
  heading: 'Please try again later or feel free to contact us if the problem persists.'
};

/***************************  ERROR - INTERNAL SERVER ERROR  ***************************/

export default function InternalServerError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[App Error]', error?.message, error?.stack);
  }, [error]);

  return <Error500Page {...data} primaryBtn={{ children: 'Try Again', onClick: reset }} />;
}
