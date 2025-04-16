import { useEffect } from 'react';

const Survicate = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://survey.survicate.com/workspaces/d53ba9a4c7431a7c80ccb5539d9fd657/web_surveys.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default Survicate; 