import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { width } from 'react-native-dimension';
import { appIcons } from '../../assets';
import FindStack from '../stacks/FindHomeStack';
import HomeStack from '../stacks/HomeStack';
import OnGoingHistoryStack from '../stacks/OnGoingHistoryStack';
import SearchStack from '../stacks/SearchStack';
import SettingsStack from '../stacks/SettingsStack';
import SupportStack from '../stacks/SupportStack';
import BottomTabs from './CustomerCustomBottom';
import { useSelector } from 'react-redux';
import CustomerSettingsStack from '../stacks/CustomerSettingsStack';

const Tab = createBottomTabNavigator();

export default function HomeBottom() {
    const { user } = useSelector(state => state.LoginSlice);

    return (
        <Tab.Navigator
            tabBar={props => <BottomTabs {...props} />}
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#792DBD',
                tabBarInactiveTintColor: '#252525',
                tabBarStyle: {
                    height: width(20),
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarLabelStyle: { fontSize: 12, marginTop: 4 },
            }}>
            <Tab.Screen
                name={'HomeStack'}
                component={HomeStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Image
                            style={{ height: 25, width: 25 }}
                            source={appIcons.homeIcon}
                            resizeMode="contain"
                            tintColor={focused ? '#792DBD' : 'black'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="OnGoingHistoryStack"
                component={OnGoingHistoryStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Image
                            style={{ height: 25, width: 25 }}
                            source={appIcons.homeIcon}
                            resizeMode="contain"
                            tintColor={focused ? '#792DBD' : 'black'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="SearchStack"
                component={SearchStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Image
                            style={{ height: 25, width: 25 }}
                            source={appIcons.homeIcon}
                            resizeMode="contain"
                            tintColor={focused ? '#792DBD' : 'black'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="SupportStack"
                component={SupportStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Image
                            style={{ height: 25, width: 25 }}
                            source={appIcons.homeIcon}
                            resizeMode="contain"
                            tintColor={focused ? '#792DBD' : 'black'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="CustomerSettingsStack"
                component={CustomerSettingsStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Image
                            style={{ height: 25, width: 25 }}
                            source={appIcons.homeIcon}
                            resizeMode="contain"
                            tintColor={focused ? '#792DBD' : 'black'}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}