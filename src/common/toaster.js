import React from 'react';
import autoBind from 'react-autobind';
import { ToastAndroid, StyleSheet, View } from 'react-native';

export const Toaster = (props) => {
    if (props.visible) {
      ToastAndroid.showWithGravityAndOffset(
        props.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return null;
    }
    return null;
  };
