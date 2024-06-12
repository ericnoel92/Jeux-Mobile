import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfilPage: React.FC = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState<string>('');
  const [prenomUtilisateur, setPrenomUtilisateur] = useState<string>('');
  const [emailUtilisateur, setEmailUtilisateur] = useState<string>('');
  const [scoreUtilisateur, setScoreUtilisateur] = useState<number>(0);

  useEffect(() => {
    // Code pour récupérer les données de l'utilisateur depuis le backend
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://192.168.1.27:9001/utilisateurs', {
          method: 'GET',
          headers: {
            // Headers si nécessaire (par exemple, pour l'authentification)
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données utilisateur');
        }
        const userData = await response.json();
        setNomUtilisateur(userData.nom);
        setPrenomUtilisateur(userData.prenom);
        setEmailUtilisateur(userData.email);
        setScoreUtilisateur(userData.score);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text>Nom d'utilisateur: {nomUtilisateur}</Text>
      <Text>Prénom: {prenomUtilisateur}</Text>
      <Text>Email: {emailUtilisateur}</Text>
      <Text>Score: {scoreUtilisateur}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ProfilPage;
