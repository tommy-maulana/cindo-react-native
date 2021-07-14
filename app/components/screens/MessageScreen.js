import React, { Component } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
  Text,
} from "react-native";
import * as Consts from "../../constants/styleConstants";
import { Layout } from "../dumbs";
import {
  ViewWithLoading,
  ImageCircleAndText,
  LoadingFull,
  Toast,
  Button,
  getTime,
  P,
  bottomBarHeight,
  CameraRollSelect,
  ActionSheet,
} from "../../wiloke-elements";
import { connect } from "react-redux";
import {
  getUsersFromFirebase,
  getMessageChatNewCount,
  deleteUserListMessageChat,
  removeItemInUsersError,
  getCurrentSendMessageScreen,
  blockUserMsg,
  unBlockUserMsg,
} from "../../actions";
import _ from "lodash";
import he from "he";
import Swipeout from "react-native-swipeout";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;
const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT;

class MessageScreen extends Component {
  state = {
    isScrollEnabled: true,
    isDeleteLoading: false,
    startLoadmore: false,
    actionSheetVisible: false,
    firebaseKeyActive: "",
    userID: "",
  };

  _getUsersFromFirebase = async (_) => {
    try {
      const { shortProfile } = this.props;
      const myID = shortProfile.userID;
      await Promise.all([
        this.props.removeItemInUsersError(myID),
        this.props.getUsersFromFirebase(myID),
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getUsersFromFirebase();
    this.props.getCurrentSendMessageScreen(false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.usersFromFirebase, this.props.usersFromFirebase)) {
      return true;
    }
    if (!_.isEqual(nextProps.userConnections, this.props.userConnections)) {
      return true;
    }
    if (
      !_.isEqual(
        nextProps.usersFromFirebaseLoading,
        this.props.usersFromFirebaseLoading
      )
    ) {
      return true;
    }
    if (!_.isEqual(nextState.isScrollEnabled, this.state.isScrollEnabled)) {
      return true;
    }
    if (!_.isEqual(nextState.isDeleteLoading, this.state.isDeleteLoading)) {
      return true;
    }
    if (!_.isEqual(nextProps.userBlocked, this.props.userBlocked)) {
      return true;
    }
    if (nextState.actionSheetVisible !== this.state.actionSheetVisible) {
      return true;
    }
    if (nextState.firebaseKeyActive !== this.state.firebaseKeyActive) {
      return true;
    }
    if (nextState.userID !== this.state.userID) {
      return true;
    }
    return false;
  }

  _handleListItem = (item) => (_) => {
    const { navigation, getMessageChatNewCount, shortProfile } = this.props;
    const { userID, displayName, key, timestamp } = item;
    const myID = shortProfile.userID;
    navigation.navigate("SendMessageScreen", {
      userID,
      displayName,
      key,
    });
    getMessageChatNewCount(myID);
  };

  _deleteUserListMessageChat = (key) => async (_) => {
    const { shortProfile } = this.props;
    const myID = shortProfile.userID;
    await this.setState({ isDeleteLoading: true });
    await this.props.deleteUserListMessageChat(myID, key);
    this.setState({ isDeleteLoading: false });
  };

  // _handleEndReached = next => {
  //   const { startLoadmore } = this.state;
  //   const { getMyNotificationsLoadmore } = this.props;
  //   !!next && startLoadmore && getMyNotificationsLoadmore(next);
  // };

  _handleAddMessageScreen = (_) => {
    this.props.navigation.navigate("AddMessageScreen");
  };

  _handleSwipeDelete = (key) => (_) => {
    const { translations } = this.props;
    Alert.alert(
      translations.delete,
      translations.deleteMessage,
      [
        {
          text: translations.cancel,
          style: "cancel",
        },
        {
          text: translations.ok,
          onPress: this._deleteUserListMessageChat(key),
        },
      ],
      { cancelable: false }
    );
  };

  renderSwipeButton = (iconName, iconColor) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather name={iconName} size={26} color={iconColor} />
      </View>
    );
  };

  _handleActionSheetVisible = (item) => () => {
    this.setState({
      actionSheetVisible: true,
      firebaseKeyActive: item.key,
      userID: item.userID,
    });
  };

  renderItem = ({ item, index }) => {
    const { userBlocked } = this.props;
    const message =
      item.message.search(/longitude|latitude/g) !== -1 ? "📍" : item.message;

    return (
      <Swipeout
        right={[
          {
            type: "default",
            onPress: this._handleActionSheetVisible(item),
            component: this.renderSwipeButton(
              "more-horizontal",
              Consts.colorDark1
            ),
          },
          {
            type: "delete",
            onPress: this._handleSwipeDelete(item.key),
            component: this.renderSwipeButton("trash-2", Consts.colorLight),
          },
        ]}
        autoClose={true}
        scroll={(event) => this.setState({ isScrollEnabled: event })}
        style={{
          borderBottomWidth: 1,
          borderColor: Consts.colorGray1,
          backgroundColor: "#fff",
          borderTopWidth: index === 0 ? 1 : 0,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this._handleListItem(item)}
          style={{
            position: "relative",
            paddingVertical: 12,
            paddingHorizontal: 10,
            backgroundColor: item.new ? "#f6f6f8" : "#fff",
          }}
        >
          <ImageCircleAndText
            image={item.avatar}
            title={item.displayName}
            message={message}
            time={!!item.timestamp ? getTime(item.timestamp) : ""}
            horizontal={true}
            messageNumberOfLines={1}
            imageSize={44}
            // dotEnabled={!!userConnections[item.userID]}
            // dotTintColor={Consts.colorSecondary}
            // dotPosition={true}
          />

          {userBlocked.includes(item.userID) && (
            <View
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 9,
                backgroundColor: Consts.colorQuaternary,
                width: 15,
                height: 15,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="slash" color="#fff" size={10} />
            </View>
          )}
        </TouchableOpacity>
      </Swipeout>
    );
  };

  handleBlockUser = () => {
    const {
      blockUserMsg,
      shortProfile,
      userBlocked,
      unBlockUserMsg,
    } = this.props;
    const myID = shortProfile.userID;
    const { userID } = this.state;
    if (userBlocked.includes(userID)) {
      unBlockUserMsg(myID, userID);
    } else {
      blockUserMsg(myID, userID);
    }
  };

  renderContent = () => {
    const {
      usersFromFirebase,
      usersFromFirebaseLoading,
      usersFromFirebaseError,
      settings,
      translations,
      userBlocked,
    } = this.props;
    const {
      isDeleteLoading,
      actionSheetVisible,
      firebaseKeyActive,
      userID,
    } = this.state;
    return (
      <ViewWithLoading
        isLoading={usersFromFirebaseLoading}
        contentLoader="headerAvatar"
        avatarSize={44}
        contentLoaderItemLength={10}
        gap={0}
      >
        {usersFromFirebaseError === "error" && _.isEmpty(usersFromFirebase) && (
          <View
            style={{
              alignItems: "center",
              padding: 30,
              marginTop: 20,
            }}
          >
            <P style={{ textAlign: "center" }}>
              {translations.startConversation}
            </P>
            <Button
              backgroundColor="primary"
              color="light"
              size="md"
              radius="round"
              colorPrimary={settings.colorPrimary}
              onPress={this._handleAddMessageScreen}
            >
              {translations.searchAuthor}
            </Button>
          </View>
        )}
        <View
          style={{
            width: Consts.screenWidth,
          }}
        >
          <FlatList
            data={usersFromFirebase}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.key || index.toString()}
            scrollEnabled={this.state.isScrollEnabled}
            ListFooterComponent={() => (
              <View
                style={{
                  paddingBottom: bottomBarHeight,
                }}
              />
            )}
            // onEndReachedThreshold={END_REACHED_THRESHOLD}
            // onEndReached={() => this._handleEndReached(next)}
            // ListFooterComponent={() => {
            //   return (
            //     <View>
            //       {!!next &&
            //         status === "success" &&
            //         startLoadmore && (
            //           <ViewWithLoading
            //             isLoading={true}
            //             contentLoader="headerAvatar"
            //             avatarSize={44}
            //             contentLoaderItemLength={1}
            //             gap={0}
            //           />
            //         )}

            //       {status === "error" && (
            //         <MessageError message={translations[msg]} />
            //       )}
            //       <View style={{ height: 30 }} />
            //     </View>
            //   );
            // }}
          />
        </View>
        <ActionSheet
          visible={actionSheetVisible}
          options={[
            translations.cancel,
            userBlocked.includes(userID)
              ? translations.unblock
              : translations.block,
            translations.delete,
          ]}
          destructiveButtonIndex={2}
          cancelButtonIndex={0}
          onAction={(buttonIndex) => {
            const timeId = setTimeout(() => {
              this.setState({
                actionSheetVisible: false,
              });
              clearTimeout(timeId);
            }, 300);
            switch (buttonIndex) {
              case 1: {
                this.handleBlockUser();
                break;
              }
              case 2: {
                const timeId = setTimeout(() => {
                  this._handleSwipeDelete(firebaseKeyActive)();
                  clearTimeout(timeId);
                }, 500);
                break;
              }
              default:
                break;
            }
          }}
        />
        <LoadingFull visible={isDeleteLoading} />
        <Toast ref={(c) => (this._toast = c)} />
      </ViewWithLoading>
    );
  };

  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    const { name } = navigation.state.params;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={name}
        goBack={() => navigation.goBack()}
        renderRight={() => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={this._handleAddMessageScreen}
            style={{ width: 25, alignItems: "flex-end" }}
          >
            <Feather name="edit" size={20} color={settings.colorPrimary} />
          </TouchableOpacity>
        )}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        textSearch={translations.search}
        isLoggedIn={isLoggedIn}
        scrollViewEnabled={false}
        scrollViewStyle={{
          backgroundColor: "#fff",
        }}
        tintColor={Consts.colorDark1}
        colorPrimary={Consts.colorGray2}
        statusBarStyle="dark"
        contentHeight={CONTENT_HEIGHT}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  usersFromFirebase: state.usersFromFirebase,
  settings: state.settings,
  translations: state.translations,
  auth: state.auth,
  shortProfile: state.shortProfile,
  usersFromFirebaseLoading: state.usersFromFirebaseLoading,
  usersFromFirebaseError: state.usersFromFirebaseError,
  userConnections: state.userConnections,
  userBlocked: state.userBlocked,
});

const mapDispatchToProps = {
  getUsersFromFirebase,
  getMessageChatNewCount,
  deleteUserListMessageChat,
  removeItemInUsersError,
  getCurrentSendMessageScreen,
  blockUserMsg,
  unBlockUserMsg,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen);
