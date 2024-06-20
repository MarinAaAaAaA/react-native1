import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';


const DisplayTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);


    return () => clearInterval(timer);
  }, []);


  const timeString = currentTime.toLocaleTimeString();


  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <Text style={{ color: 'white', fontSize: 18 }}>{timeString}</Text>
    </View>
  );
};

export default DisplayTime;