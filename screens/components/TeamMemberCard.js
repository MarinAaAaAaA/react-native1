import React, { useImperativeHandle, useLayoutEffect, useDebugValue } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TeamMemberCard = React.forwardRef(({ member }, ref) => {
  useImperativeHandle(ref, () => ({
    doSomething: () => {
      console.log(`Performing some action for ${member.name}`);
    },
  }), [member.name]);

  useLayoutEffect(() => {
    console.log('Layout effect triggered');
    return () => {
      console.log('Cleanup in layout effect');
    };
  }, [member.name]);

  useDebugValue(`TeamMemberCard: ${member.name}`);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{member.name}</Text>
      <Text style={styles.role}>{member.role}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    width: 300,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  role: {
    fontSize: 16,
    color: '#888',
  },
});

export default TeamMemberCard;
