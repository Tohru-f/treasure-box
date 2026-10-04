'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Fetch Error!</h2>
    </div>
  );
}
