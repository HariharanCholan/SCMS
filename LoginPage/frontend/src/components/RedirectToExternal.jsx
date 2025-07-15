import { useEffect } from 'react';

const RedirectToExternal = ({ url }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return null; // or a loading spinner
};

export default RedirectToExternal;