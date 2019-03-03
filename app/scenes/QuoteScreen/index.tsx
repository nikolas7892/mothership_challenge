import React, { PureComponent } from 'react';
import { Navigation } from 'react-native-navigation';
import { Alert } from 'react-native';
import QuoteScreenView from './Views';
import { createQuoteForDelivery } from '../../redux/Deliveries/actions';
import Routes from '../../navigation/Routes';
import { IDeliverySearchResult } from '../../redux/Deliveries/interfaces';

type Props = {
  componentId: string;
  searchedAddress: IDeliverySearchResult;
};

type State = {
  typeValue: string;
  weightValue: string;
  dimensionValues: {
    length: string;
    width: string;
    height: string;
  };
  quantityValue: string;
  typeValuesArray: Array<string>;
  loading: boolean;
};

class QuoteScreen extends PureComponent<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      typeValue: 'Pallet',
      weightValue: '',
      dimensionValues: {
        length: '',
        width: '',
        height: '',
      },
      quantityValue: '',
      typeValuesArray: ['Pallet', 'Boxes', 'Loose Items'],
      loading: false,
    };
    this.toggleValueModal = this.toggleValueModal.bind(this);
    this.onChangeWeightText = this.onChangeWeightText.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.onChangeQuantityText = this.onChangeQuantityText.bind(this);
    this.popBack = this.popBack.bind(this);
    this.createQuoteOnPress = this.createQuoteOnPress.bind(this);
  }

  toggleValueModal() {
    // TODO: Show overlay modal for chainging type
  }
  onChangeWeightText(weightValue: string) {
    this.setState({ weightValue });
  }

  updateDimensions(length: string, width: string, height: string) {
    console.log('length', length);
    this.setState({
      dimensionValues: {
        length,
        width,
        height,
      },
    });
  }

  onChangeQuantityText(quantityValue: string) {
    this.setState({ quantityValue });
  }

  popBack() {
    Navigation.pop(this.props.componentId);
  }

  determineIfNextDisabled() {
    // TODO: Add cases for disabling button
    return false;
  }

  async createQuoteOnPress() {
    // TODO: create quote here
    this.setState({ loading: true });
    try {
      // TODO: add dynamic width X height X length.
      const shipmentData = {
        quantity: this.state.quantityValue,
        weight: this.state.weightValue,
        type: this.state.typeValue,
        dimensions: this.state.dimensionValues,
      };

      const rates = await createQuoteForDelivery(
        this.props.searchedAddress,
        shipmentData,
      );

      Navigation.push(this.props.componentId, {
        component: {
          name: Routes.SummaryScreen,
          passProps: {
            rates,
            searchedAddress: this.props.searchedAddress,
            shipmentData,
          },
        },
      });
    } catch (err) {
      // TODO: Handle error report
      Alert.alert('Invalid Delivery Route', 'This route is not supported');
    }
    this.setState({ loading: false });
  }

  render() {
    return (
      <QuoteScreenView
        typeValue={this.state.typeValue}
        weightValue={this.state.weightValue}
        quantityValue={this.state.quantityValue}
        toggleValueModal={this.toggleValueModal}
        onChangeWeightText={this.onChangeWeightText}
        updateDimensions={this.updateDimensions}
        onChangeQuantityText={this.onChangeQuantityText}
        popBack={this.popBack}
        determineIfNextDisabled={this.determineIfNextDisabled()}
        createQuoteOnPress={this.createQuoteOnPress}
        loading={this.state.loading}
        fromAddressTitle={this.props.searchedAddress.fromAddress.placeName}
        toAddressTitle={this.props.searchedAddress.toAddress.placeName}
      />
    );
  }
}

export default QuoteScreen;
