import React, { Component } from 'react';
import io from 'socket.io-client';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';

import api from '../services/api';
import { baseURL } from '../config';

import camera from '../assets/camera.png';
import more from '../assets/more.png';
import like from '../assets/like.png';
import comment from '../assets/comment.png';
import send from '../assets/send.png';

export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('New')}>
        <Image source={camera} />
      </TouchableOpacity>
    )
  });

  state = {
    feed: []
  };

  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get('posts');

    this.setState({ feed: response.data });
  }

  handleLike = id => {
    api.post(`/posts/${id}/like`);
  }

  registerToSocket() {
    const socket = io(baseURL);

    socket.on('post', newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on('like', likedPost => {
      this.setState({
        feed: this.state.feed.map(post => post._id === likedPost._id ? likedPost : post)
      });
    });
  }

  render() {
    const { feed } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View style={styles.feedItemHeader}>
                <Text style={styles.name}>{ item.author }</Text>
                <Text style={styles.place}>{ item.place }</Text>
                <Image source={ more }/>
              </View>
              <Image style={styles.feedImage} source={{ uri: `${baseURL}/files/${item.image}` }}/>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)}>
                  <Image source={ like } />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={() => {}}>
                  <Image source={ comment } />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={() => {}}>
                  <Image source={ send } />
                </TouchableOpacity>
              </View>

              <View style={styles.feedItemFooter}>
                <Text style={styles.likes}>{ item.likes } curtidas</Text>
                <Text style={styles.description}>{ item.description }</Text>
                <Text style={styles.hashtags}>{ item.hashtags }</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  feedItem: {
    marginTop: 20
  },

  feedItemHeader: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  name: {
    fontSize: 14,
    color: '#333'
  },

  place: {
    fontSize: 12,
    color: '#999',
    marginTop: 2
  },

  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 15
  },

  feedItemFooter: {
    paddingHorizontal: 15,
  },

  actions: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },

  action: {
    marginRight: 10,
  },

  likes: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#333'
  },

  description: {
    lineHeight: 18,
    color: '#333'
  },

  hashtags: {
    color: '#122d42'
  }

});
