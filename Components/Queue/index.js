import React, { Component } from "react";
import { observer } from "mobx-react";
import { withNavigation } from "react-navigation";

//Components
import Spinner from "./spinner.js";

//Stores
import authStore from "../../Stores/authStore";

import styles from "./styles";
import socketStore from "../../Stores/SocketStore";

import { Button, Item, Text, View } from "native-base";
import { Image, TouchableOpacity } from "react-native";

class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQ: null,
      position: null
    };
  }
  restaurantRequest() {
    if (AuthStore.user) {
      socketStore.getRestaurant(this.state.restaurant, AuthStore.user.user_id);
    } else {
      socketStore.getRestaurant(this.state.restaurant, null);
    }
  }
  componentWillUnmount() {
    socketStore.socket.off("q info");
    socketStore.socket.off("user spot");
    socketStore.socket.off("update queue");
  }

  componentDidMount() {
    this.restaurantRequest();
    socketStore.socket.on("q info", data => {
      this.setState({ currentQ: data.restaurantQ });
    });

    socketStore.socket.on("user spot", data => {
      this.setState({ position: data.spot });
    });
  }

  getQueueNumber() {
    if (this.state.position) {
      return (
        <>
          <Text style={styles.circleText}>{this.state.position.position}</Text>
          <Text style={styles.circleTextColor}>My spot</Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.circleText}>{this.state.currentQ}</Text>
          <Text style={styles.circleTextColor}>in queue</Text>
        </>
      );
    }
  }

  getQueueOptions() {
    if (authStore.user !== null) {
      if (this.state.position) {
        return (
          <Button
            rounded
            light
            style={styles.queueButtons}
            onPress={() => this.leaveQ()}
          >
            <Text style={styles.white}>Leave Q</Text>
          </Button>
        );
      } else {
        return (
          <Spinner
            user={authStore.user.user_id}
            restaurant={this.props.restaurant.id}
          />
        );
      }
    } else {
      return (
        <Button
          rounded
          light
          style={styles.queueButtons}
          onPress={() => {
            this.props.navigation.navigate("Login");
          }}
        >
          <Text style={styles.white}>Login to Join Q</Text>
        </Button>
      );
    }
  }

  render() {
    const { restaurant } = this.props;

    return (
      <View style={styles.qContainer}>
        <Image
          source={{
            uri:
              restaurant.picture ||
              "https://screenshotlayer.com/images/assets/placeholder.png"
          }}
          style={styles.img}
        />
        <View style={styles.qCircle}>
          <View style={styles.iqCircle}>{this.getQueueNumber()}</View>
          <View>{this.getQueueOptions()}</View>
        </View>
      </View>
    );
  }
}

export default withNavigation(observer(Queue));
