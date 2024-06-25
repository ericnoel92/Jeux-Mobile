import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';

const ProfilPage: React.FC = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState<string>('');
  const [prenomUtilisateur, setPrenomUtilisateur] = useState<string>('');
  const [emailUtilisateur, setEmailUtilisateur] = useState<string>('');
  const [scoreUtilisateur, setScoreUtilisateur] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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
        setError('Erreur lors de la récupération des données utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSupprimerMesInfos = async () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer vos informations ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.27:9001/utilisateurs/${emailUtilisateur}`, {
                method: 'DELETE',
                headers: {
                  // Headers si nécessaire (par exemple, pour l'authentification)
                },
              });
              if (!response.ok) {
                throw new Error('Erreur lors de la suppression des données utilisateur');
              }
              Alert.alert('Succès', 'Vos informations ont été supprimées avec succès.');
              // Réinitialiser les états après suppression
              setNomUtilisateur('');
              setPrenomUtilisateur('');
              setEmailUtilisateur('');
              setScoreUtilisateur(0);
            } catch (error) {
              console.error('Erreur lors de la suppression des données utilisateur:', error);
              Alert.alert('Erreur', 'Il y a eu une erreur lors de la suppression de vos informations.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text>Nom d'utilisateur: {nomUtilisateur}</Text>
      <Text>Prénom: {prenomUtilisateur}</Text>
      <Text>Email: {emailUtilisateur}</Text>
      <Text>Score: {scoreUtilisateur}</Text>
      <Button title="Supprimer mes infos" onPress={handleSupprimerMesInfos} color="red" disabled={!emailUtilisateur} />
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
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ProfilPage;
