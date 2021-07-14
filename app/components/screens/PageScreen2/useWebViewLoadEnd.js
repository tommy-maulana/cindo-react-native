import { useRef } from "react";
import configureApp from "../../../../configureApp.json";


const useWebViewLoadEnd = (navigation) => {
  const { isEditListing, isSubmitListing } = navigation.state.params;
  const webViewRef = useRef(null);
  const handleLoadEnd = (event) => {
    console.log(webViewRef.current);
    if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          const anchorEls = document.querySelectorAll('a');

          if (anchorEls) {
            anchorEls.forEach(anchorEl => {
              anchorEl.addEventListener('click', event => {
                if (!/^#/.test(anchorEl.getAttribute('href'))) {
                  event.preventDefault();
                  if (anchorEl.href.includes('${configureApp.api.baseUrl}')) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'navigate', payload: { uri: anchorEl.href } }));
                  } else {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'browser', payload: { uri: anchorEl.href } }));
                  }
                }
              })
            });
          }

          function handleAddListing() {
            const buttonAddListingEl = document.querySelector('#wilcity-addlisting-form button[type="submit"]');

            if (buttonAddListingEl) {
              buttonAddListingEl.addEventListener('click', event => {
                const intervalId = setInterval(() => {
                  const errEl = document.querySelector('#wilcity-addlisting-form .alert_content__1ntU3');
                  if (!buttonAddListingEl || (!buttonAddListingEl.className.includes('wil-btn--loading') && !errEl)) {
                    clearInterval(intervalId);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'addlisting',
                      payload: {
                        postType: document.body.getAttribute('data-posttype')
                      }
                    }));
                  }
                }, 100);
              });
            }
          }

          const intervalId = setInterval(() => {
            const loadedEl = document.querySelector('#wilcity-addlisting-form');

            if (loadedEl.className.includes('loaded-listing-settings')) {
              handleAddListing();
              clearInterval(intervalId);
            }
          }, 100);

          if (${isEditListing}) {
            const linkEditListingEl = document.querySelector('#link-edit-listing');
            if (linkEditListingEl) {
              location.assign(linkEditListingEl.href);
            }
          }
          if (${isSubmitListing}) {
            const linkSubmitListingEl = document.querySelector('#link-submit-listing');
            if (linkSubmitListingEl) {
              fetch(linkSubmitListingEl.href)
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    location.assign(data.data.redirectTo);
                  } else {
                    alert(data.data.msg);
                  }
                })
                .catch(err => console.log(err.message));

            }
          }

          const loginformEl = document.querySelector('#loginform');
          if (!!loginformEl) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'login',
            }));
          }
        `);
        console.log('zzz')
    }
  };
  return {
    webViewRef,
    onLoadEnd: handleLoadEnd,
  };
};

export default useWebViewLoadEnd;
