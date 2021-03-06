import React from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { bottomBarHeight } from "../../../wiloke-elements";

const webviewCss = `
  .wil-section {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }
  #wilcity-header-section {
    display: none !important;
  }
  body {
    padding-bottom: ${bottomBarHeight}px;
  }
  #wil-edit-listing-btn {
    visibility: hidden;
    opacity: 0;
  }
  .listing-detail_module__2-bfH {
    visibility: hidden;
    opacity: 0;
  }
  #wilcity-header-section,
  [class^="footer_module__"],
  #wpadminbar {
    display: none !important;
  }
  html {
    margin-top: 0 !important;
  }
`;

const ContentWebView = ({ navigation, webViewRef, onMessage, onLoadEnd }) => {
  const { params } = navigation.state;
  const { uri } = params;
  const androidProps = {
    containerStyle: {
      alignItems: "center",
    },
    renderLoading: () => (
      <View
        style={{
          width: 100,
          height: 100,
          posiiton: "absolute",
          top: 0,
          left: 0,
          zIndex: 99,
        }}
      >
        <ActivityIndicator size="small" color="#666" />
      </View>
    ),
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        decelerationRate="normal"
        ref={webViewRef}
        source={{
          uri,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        originWhitelist={["*"]}
        showsVerticalScrollIndicator={false}
        startInLoadingState
        useWebKit
        javaScriptEnabled
        injectedJavaScript={`
          document.head.insertAdjacentHTML('beforeend', '<style>${webviewCss
            .replace(/\n/g, "")
            .replace(/\s+/g, " ")}</style>');
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mounted', payload: { title: document.title } }));
        `}
        onLoadEnd={onLoadEnd}
        onMessage={onMessage}
        {...(Platform.OS === "ios" ? {} : androidProps)}
      />
    </View>
  );
};

export default ContentWebView;
