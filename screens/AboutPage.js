import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import TeamMemberCard from './components/TeamMemberCard';
import teamData from './../assets/teamData.json';

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    setTeamMembers(teamData);
  }, []);

  useLayoutEffect(() => {
    console.log('Layout effect triggered');
  }, [teamMembers]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>О нас</Text>
      {teamMembers.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
});

export default AboutPage;
