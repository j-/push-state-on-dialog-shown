import React, { useState, useEffect } from 'react';

const useIsMobile = () => {
  const mediaQueryList = window.matchMedia("(pointer: coarse)");
  return mediaQueryList.matches;
};

const App: React.FC = () => {
  const [dialogShown, setDialogShown] = useState(false);
  const isMobile = useIsMobile();

  const showDialog = () => {
    console.debug('Dialog shown');
    setDialogShown(true);
    if (isMobile) {
      window.history.pushState({ dialogShown: true }, '');
    } else {
      window.history.replaceState({ dialogShown: true }, '');
    }
  };

  const hideDialog = () => {
    console.debug('Dialog hidden');
    setDialogShown(false);
    if (isMobile) {
      if (window.history.state?.dialogShown) {
        window.history.back();
      }
    }
    window.history.replaceState({ dialogShown: false }, '');
  };

  useEffect(() => {
    const dialogShown = window.history.state?.dialogShown;
    setDialogShown(dialogShown);
    console.debug('[Page load]', dialogShown ? 'dialog shown' : 'dialog hidden');
    const handler = (e: PopStateEvent) => {
      const dialogShown = e.state?.dialogShown;
      setDialogShown(dialogShown);
      console.debug('[Pop state]', dialogShown ? 'dialog shown' : 'dialog hidden');
    };
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, [isMobile]);

  return (
    <div>
      <h1>Push state on dialog shown</h1>

      <p>Use "back" navigation on mobile devices to close dialog.</p>

      {!dialogShown && <button type="button" onClick={showDialog}>Show dialog</button>}

      <dialog hidden={!dialogShown} open>
        <p>Dialog content</p>
        <button type="button" onClick={hideDialog}>&times;</button>
      </dialog>
    </div>
  );
};

export default App;
