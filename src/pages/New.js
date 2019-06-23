import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Alert
} from 'react-native';
import api from '../services/api';

export default class New extends Component {
  static navigationOptions = {
    headerTitle: 'Nova publicação'
  }

  state = {
    error: false,
    preview: null,
    image: null,
    author: '',
    place: '',
    description: '',
    hashtags: '',
  }

  handleSumbit = async () => {
    const {
      image,
      author,
      place,
      description,
      hashtags,
    } = this.state;

    const formData = new FormData();

    try {
      formData.append('image', image);
      formData.append('author', author);
      formData.append('place', place);
      formData.append('description', description);
      formData.append('hashtags', hashtags);

      await api.post('/posts', formData);

      this.props.navigation.navigate('Feed');
    } catch (err) {
      this.setState({ error: true })
    }
  }
  handleAlert = () => {
    Alert.alert(
      'Ops..',
      'Não foi possível compartilhar sua foto',
      [
        {text: 'OK', onPress: () => {}},
      ],
      {cancelable: false},
    );
  }

  handleSelectImage = () => {
    ImagePicker.showImagePicker({
      title: 'Selecionar imagem'
    }, upload => {
      if (upload.error) {
        console.log('Error')
      } else if (upload.didCancel) {
        console.log('User canceled')
      } else {
        const preview = {
          uri: `data:image/jpeg;base64,${upload.data}`,
        }

        let prefix;
        let ext;

        if (upload.fileName) {
          [prefix, ext] = upload.fileName.split('.');

          ext = ext.toLowerCase === 'heic' ? 'jpg' : ext;
        } else {
          prefix = new Date().getTime();
          ext = '.jpg';
        }

        const image = {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`
        }

        this.setState({ preview, image });
      }
    });
  }

  render() {
    const {
      preview,
      author,
      place,
      description,
      hashtags,
    } = this.state;

    return <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
        <Text style={styles.selectButtonText}>Selecionar imagem</Text>
      </TouchableOpacity>

      { preview && <Image style={styles.preview} source={ preview } /> }

      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Nome do autor"
        placeholderTextColor="#999"
        value={author}
        onChangeText={author => this.setState({ author })}
      />

      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Localização"
        placeholderTextColor="#999"
        value={place}
        onChangeText={place => this.setState({ place })}
      />

      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Descrição"
        placeholderTextColor="#999"
        value={description}
        onChangeText={description => this.setState({ description })}
      />

      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Hashtags"
        placeholderTextColor="#999"
        value={hashtags}
        onChangeText={hashtags => this.setState({ hashtags })}
      />

      <TouchableOpacity style={styles.shareButton} onPress={this.handleSumbit}>
        <Text style={styles.shareButtonText}>Compartilhar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});

