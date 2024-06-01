import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from "lodash";
import { theme } from '../theme';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import * as Progress from 'react-native-progress';
import { StatusBar } from 'expo-status-bar';
import { weatherImages } from '../constants';
import { getData, storeData } from '../utils/asyncStorage';

export default function HomePage() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});

  const handleSearch = search => {
    if (search && search.length > 2) {
      fetchLocations({ cityName: search }).then(data => {
        setLocations(data);
      });
    }
  };

  const handleLocation = loc => {
    setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setLoading(false);
      setWeather(data);
      storeData('city', loc.name);
    });
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Ufa';
    if (myCity) {
      cityName = myCity;
    }
    fetchWeatherForecast({
      cityName,
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { location, current } = weather;

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/bg.jpg')}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      {loading ? (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Progress.CircleSnail thickness={10} size={140} color="#cccccc" />
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ height: '7%', marginHorizontal: 4, position: 'relative', zIndex: 50 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                borderRadius: showSearch ? 25 : 0,
                backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent',
              }}>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Поиск города"
                  placeholderTextColor="lightgray"
                  style={{ paddingLeft: 6, height: 30, paddingBottom: 1, flex: 1, color: 'white' }}
                />
              ) : null}
              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={{
                  borderRadius: 25,
                  padding: 10,
                  margin: 1,
                  backgroundColor: showSearch ? theme.bgWhite(0.3) : 'transparent',
                }}>
                {showSearch ? <XMarkIcon size={25} color="white" /> : <MagnifyingGlassIcon size={25} color="white" />}
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View style={{ position: 'absolute', width: '100%', backgroundColor: '#ccc', top: 16, borderRadius: 20 }}>
                {locations.map((loc, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleLocation(loc)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderStyle: index + 1 !== locations.length ? 'solid' : 'none',
                      borderBottomWidth: index + 1 !== locations.length ? 2 : 0,
                      borderBottomColor: 'gray',
                      padding: 10,
                      paddingHorizontal: 20,
                      marginBottom: 1,
                    }}>
                    <MapPinIcon size={20} color="gray" />
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 2 }}>{loc?.name}, {loc?.country}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
          <View style={{ marginHorizontal: 4, flex: 1, justifyContent: 'space-around', marginBottom: 2 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
              {location?.name},
              <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>{location?.country}</Text>
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Image source={weatherImages[current?.condition?.text || 'other']} style={{ width: 92, height: 92 }} />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 60, fontWeight: 'bold', marginLeft: 5 }}>
                {current?.temp_c}&#176;
              </Text>
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, letterSpacing: 1 }}>
                {current?.condition?.text}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../assets/icons/wind.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 2 }}>{current?.wind_kph}km</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../assets/icons/drop.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 2 }}>{current?.humidity}%</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../assets/icons/sun.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginBottom: 2, marginHorizontal: 5, justifyContent: 'space-between', flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, marginBottom: 2 }}>
              <CalendarDaysIcon size={22} color="white" />
              <Text style={{ color: 'white', fontSize: 16 }}>На неделю</Text>
            </View>
            <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 15 }} showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday?.map((item, index) => {
                const date = new Date(item.date);
                const options = { weekday: 'long' };
                let dayName = date.toLocaleDateString('ru-Ru', options);
                dayName = dayName.split(',')[0];

                return (
                  <View
                    key={index}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 100,
                      borderRadius: 20,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      backgroundColor: theme.bgWhite(0.15),
                      marginRight: 4,
                    }}>
                    <Image
                      source={weatherImages[item?.day?.condition?.text || 'other']}
                      style={{ width: 40, height: 40 }}
                    />
                    <Text style={{ color: 'white' }}>{dayName}</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{item?.day?.avgtemp_c}&#176;</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
