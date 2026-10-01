import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { BookOpen, Plus, ShoppingBag, MoreHorizontal } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2A211B', // Dark charcoal/ink nav from prototype
          borderTopWidth: 0,
          height: Platform.OS === 'web' ? 70 : 84,
          paddingBottom: Platform.OS === 'web' ? 12 : 28,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 672, // max-w-2xl
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: Platform.OS === 'web' ? 24 : 0,
          marginBottom: Platform.OS === 'web' ? 12 : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.18,
          shadowRadius: 30,
          elevation: 12,
        },
        tabBarActiveTintColor: '#FFFDF9',
        tabBarInactiveTintColor: '#BDB2A5',
        tabBarLabelStyle: {
          fontFamily: 'Figtree',
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recept',
          tabBarIcon: ({ color }) => (
            <BookOpen size={22} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="import"
        options={{
          title: 'Importera',
          tabBarIcon: () => (
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                backgroundColor: '#B4472A',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
                shadowColor: '#B4472A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Plus size={22} color="#FFFFFF" strokeWidth={2.6} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="grocery"
        options={{
          title: 'Inköpslista',
          tabBarIcon: ({ color }) => (
            <ShoppingBag size={22} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Mer',
          tabBarIcon: ({ color }) => (
            <MoreHorizontal size={24} color={color} strokeWidth={2.4} />
          ),
        }}
      />
    </Tabs>
  );
}
