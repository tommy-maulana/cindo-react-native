import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import _ from "lodash";
import he from "he";

export default class Heading extends PureComponent {
  render() {
    const titleStyles = {
      fontSize: this.props.titleSize,
      fontWeight: "bold",
      color: this.props.titleColor,
      ...(this.props.textCenter ? { textAlign: "center" } : {}),
    };
    const textStyles = {
      fontSize: this.props.textSize,
      color: this.props.textColor,
      ...(this.props.textCenter ? { textAlign: "center" } : {}),
    };
    return (
      <View
        style={[
          styles.container,
          {
            marginBottom: this.props.mb,
            alignItems: this.props.align,
          },
          this.props.style,
        ]}
      >
        <Text
          style={[stylesBase.h6, titleStyles]}
          numberOfLines={this.props.titleNumberOfLines}
        >
          {he.decode(this.props.title.replace(":apos:", "'"))}
        </Text>
        {!_.isEmpty(this.props.text) && (
          <Text
            style={[stylesBase.text, textStyles]}
            numberOfLines={this.props.textNumberOfLines}
          >
            {he.decode(this.props.text)}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    padding: 0,
  },
});

Heading.propTypes = {
  titleSize: PropTypes.number,
  textSize: PropTypes.number,
  mb: PropTypes.number,
  textNumberOfLines: PropTypes.number,
  titleNumberOfLines: PropTypes.number,
  titleColor: PropTypes.string,
  textColor: PropTypes.string,
  align: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  textCenter: PropTypes.bool,
};

Heading.defaultProps = {
  titleSize: 24,
  titleColor: Consts.colorDark1,
  textSize: 12,
  textColor: Consts.colorDark3,
  textCenter: false,
};
