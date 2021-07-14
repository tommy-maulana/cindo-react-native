import React, { PureComponent } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import { getListingCustomSection } from "../../actions";
import {
  ViewWithLoading,
  ContentBox,
  RequestTimeoutWrapped,
  HtmlViewer,
  RTL,
  IconTextMedium,
  Row,
  Col,
  NewGallery,
} from "../../wiloke-elements";
import {
  colorDark,
  colorDark2,
  screenWidth,
} from "../../constants/styleConstants";

class ListingCustomSectionContainer extends PureComponent {
  _getListingCustom = async () => {
    const { getListingCustomSection, params, type } = this.props;
    const { id, item } = params;
    type === null && getListingCustomSection(id, item);
    const { listingCustomSection } = this.props;
  };
  componentDidMount() {
    this._getListingCustom();
  }

  renderBoxIcon = (customSections) => {
    const sections = customSections.filter((i) => i.unChecked === "no");
    return (
      sections.length > 0 &&
      sections.map((boxIcon) => (
        <Col key={boxIcon.key} column={2} gap={10}>
          <View style={{ marginRight: 15, marginBottom: 10 }}>
            <IconTextMedium
              iconName={boxIcon.icon ? boxIcon.icon : "check"}
              iconSize={30}
              text={boxIcon.name}
            />
          </View>
        </Col>
      ))
    );
  };

  renderHTML = (customSections) => {
    return (
      <HtmlViewer
        html={customSections}
        htmlWrapCssString={`font-size: 13px; line-height: 1.4em; overflow:hidden`}
        containerMaxWidth={screenWidth - 40}
        containerStyle={{ paddingLeft: 10 }}
      />
    );
  };

  renderGroupCustom = (customSections) => {
    return customSections?.items?.map((item) => {
      const itemEntries = Object.entries(item);
      return (
        <View style={{ padding: 10 }}>
          {itemEntries.map(([key, value], index) => {
            return (
              <View key={key + index}>
                <Text
                  style={{
                    marginBottom: 3,
                    marginRight: 5,
                    color: colorDark,
                    fontWeight: "600",
                  }}
                >
                  {value.title}
                </Text>
                {typeof value.content === "string" ? (
                  <Text style={{ marginBottom: 8, color: colorDark2 }}>
                    {value.content}
                  </Text>
                ) : (
                  <NewGallery
                    thumbnails={Object.values(value.content)}
                    column={3}
                    modalSlider={Object.values(value.content)}
                    isOverlay={false}
                  />
                )}
              </View>
            );
          })}
        </View>
      );
    });
  };

  renderContent = (id, item, isLoading, datas) => {
    const { settings } = this.props;
    const customSections = _.get(datas, `${item.key}`, "__empty__");
    if (customSections === "__empty__") return null;
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        <ContentBox
          headerTitle={item.name}
          headerIcon={item.icon}
          style={{
            marginBottom: 10,
            width: "100%",
          }}
          colorPrimary={settings.colorPrimary}
        >
          <Row>
            {item.style === "boxIcon"
              ? this.renderBoxIcon(customSections)
              : typeof customSections === "string"
              ? this.renderHTML(customSections)
              : this.renderGroupCustom(customSections)}
          </Row>
        </ContentBox>
      </ViewWithLoading>
    );
  };
  render() {
    const { type, params, listingCustomSection } = this.props;

    const { item } = params;
    const id = `${params.id}_details`;
    const customSections = _.get(listingCustomSection, `${id}.${item.key}`, []);

    return this.renderContent(
      id,
      item,
      _.isEmpty(customSections),
      listingCustomSection[id]
    );
  }
}

const mapStateToProps = (state) => ({
  translations: state.translations,
  settings: state.settings,
  listingDetail: state.listingDetail,
  listingCustomSection: state.listingCustomSection,
});

const mapDispatchToProps = {
  getListingCustomSection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingCustomSectionContainer);
