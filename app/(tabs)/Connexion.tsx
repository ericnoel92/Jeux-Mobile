import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
}

const ConnexionPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [motDePasse, setMotDePasse] = useState<string>('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.1.27:9001/utilisateurs');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      const utilisateurs: Utilisateur[] = await response.json();

      const utilisateurTrouve: Utilisateur | undefined = utilisateurs.find(
        (utilisateur: Utilisateur) => utilisateur.email === email && utilisateur.mot_de_passe === motDePasse
      );

      if (utilisateurTrouve) {
        Alert.alert('Connexion réussie', 'Vous êtes maintenant connecté.');
        setEmail(''); // Réinitialisation du champ email
        setMotDePasse(''); // Réinitialisation du champ mot de passe
        //navigation.navigate('Jeux'); // Décommentez cette ligne pour naviguer vers la page "Jeux"
      } else {
        Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
    }
  };

  const handleSupprimerMesInfos = async () => {
    try {
      const response = await fetch('http://192.168.1.27:9001/utilisateurs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Envoyez l'email de l'utilisateur pour l'identifier
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression des informations utilisateur');
      }
      Alert.alert('Informations supprimées', 'Vos informations ont été supprimées avec succès.');
      setEmail(''); // Réinitialiser l'email après la suppression réussie
      setMotDePasse(''); // Réinitialiser le mot de passe après la suppression réussie
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression des informations.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleSubmit} disabled={!email || !motDePasse} />
      <Button title="Supprimer mes infos" onPress={handleSupprimerMesInfos} color="red" disabled={!email} />
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
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default ConnexionPage;
