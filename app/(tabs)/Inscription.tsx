import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const InscriptionPage: React.FC = () => {
  const [nom, setNom] = useState<string>('');
  const [prenom, setPrenom] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [motDePasse, setMotDePasse] = useState<string>('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (nom && prenom && email && motDePasse) {
      try {
        const response = await fetch('http://192.168.1.27:9001/utilisateurs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: Date.now(),
            nom: nom,
            prenom: prenom,
            email: email,
            mot_de_passe: motDePasse,
            score: 0
          }),
        });

        if (response.ok) {
          // Réinitialisation des champs du formulaire après une inscription réussie
          setNom('');
          setPrenom('');
          setEmail('');
          setMotDePasse('');

          const data = await response.json();
          console.log('Réponse de l\'API:', data);
          Alert.alert('Succès', 'Inscription réussie.');
        } else {
          console.error('Erreur lors de la requête:', response.statusText);
          Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription.');
        }
      } catch (error) {
        console.error('Erreur lors de la requête:', error);
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription.');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
      />
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
      <Button title="S'inscrire" onPress={handleSubmit} disabled={!nom || !prenom || !email || !motDePasse} />
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

export default InscriptionPage;
