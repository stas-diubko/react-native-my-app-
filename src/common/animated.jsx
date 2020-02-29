import React, { Component, useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export function FadeInView (props) {
    const [fadeAnim] = useState(new Animated.Value(0))
  
    React.useEffect(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: props.toValue,
          duration: 2000,
          easing: Easing.back(),
        }
        
      ).start();
    }, [])
  
    return (
      <Animated.View 
        style={{
          ...props.style,
          opacity: fadeAnim,
        }}
      >
        {props.children}
      </Animated.View>
    );
}