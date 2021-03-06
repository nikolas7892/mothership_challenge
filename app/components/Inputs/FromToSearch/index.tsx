import React, { PureComponent } from 'react';
import { EmitterSubscription, Keyboard, Alert } from 'react-native';
import { client as MapboxClient } from '../../../config/MapboxClient';
import FromToSearchView from './Views';
import {
  IAddress,
  IAddressItem,
  ISelectedAddress,
} from '../../../redux/Deliveries/interfaces';
import { mapAddressFormatter } from '../../../utils/MapBoxUtils';

type Props = {
  applySearchResults(
    fromAddress: ISelectedAddress,
    toAddress: ISelectedAddress,
  ): void;
  isDirectionsDrawn: boolean;
};

type State = {
  currentSelection: string;
  fromAddress: IAddress;
  toAddress: IAddress;
  isKeyboardVisible: boolean;
  addressListIsOpen: boolean;
};

const INITIAL_STATE = {
  currentSelection: '',
  fromAddress: {
    data: [],
    value: '',
    selected: {
      placeName: '',
      coordinates: {
        lat: 0,
        long: 0,
      },
      street: '',
      neighborhood: '',
      state: '',
      postalCode: '',
    },
    isAddressSelected: false,
  },
  toAddress: {
    data: [],
    value: '',
    selected: {
      placeName: '',
      coordinates: {
        lat: 0,
        long: 0,
      },
      street: '',
      neighborhood: '',
      state: '',
      postalCode: '',
    },
    isAddressSelected: false,
  },
  isKeyboardVisible: false,
  addressListIsOpen: false,
};

class FromToSearch extends PureComponent<Props, State> {
  private keyboardWillShowListener: EmitterSubscription | any;
  private keyboardWillHideListener: EmitterSubscription | any;
  private toAddressInputField: any | null;

  constructor(props: Readonly<Props>) {
    super(props);
    this.state = INITIAL_STATE;
    this.searchForAddress = this.searchForAddress.bind(this);
    this.onFocusToAddressField = this.onFocusToAddressField.bind(this);
    this.onFocusFromAddressField = this.onFocusFromAddressField.bind(this);
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
    this.onAddressSelection = this.onAddressSelection.bind(this);
    this.createToAddressRef = this.createToAddressRef.bind(this);
    this.toAddressInputField = null;
  }

  componentWillReceiveProps(props: any) {
    // Handles re-setting state to initial state.
    if (props.isDirectionsDrawn === false) {
      this.setState(INITIAL_STATE);
    }
    return null;
  }

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow() {
    this.setState({
      isKeyboardVisible: true,
      addressListIsOpen: true,
    });
  }

  keyboardWillHide() {
    this.setState({ isKeyboardVisible: false, addressListIsOpen: false });
  }

  onFocusToAddressField() {
    this.setState({ currentSelection: 'toAddress' });
  }

  onFocusFromAddressField() {
    this.setState({ currentSelection: 'fromAddress' });
  }

  async searchForAddress(value: string) {
    const { currentSelection } = this.state;
    // @ts-ignore TODO: research why interpolation is not work with type screen
    await this.setState({
      [currentSelection]: {
        ...this.state[currentSelection],
        value,
        isAddressSelected: false,
      },
    });
    try {
      const {
        entity: { features: data },
      } = await MapboxClient.geocodeForward(value, {
        limit: 4,
        types: 'address',
        country: 'us',
        // TODO add proximity variable
        // ^ Bias the response to favor results that are closer to this location,
        // ^ provided as two comma-separated coordinates in longitude,latitude order.
      });
      // @ts-ignore TODO: research why interpolation is not work with type screen
      await this.setState({
        [currentSelection]: {
          ...this.state[currentSelection],
          data,
        },
      });
    } catch (err) {
      return Alert.alert('Something went wrong', 'Please try searching again');
    }
  }

  async onAddressSelection(item: IAddressItem) {
    const {
      geometry: { coordinates },
      place_name: placeName,
    } = item;
    const { currentSelection } = this.state;
    const lat = coordinates[1];
    const long = coordinates[0];

    const { street, neighborhood, state, postalCode } = mapAddressFormatter(
      item,
    );

    if (
      this.state.fromAddress.value === placeName ||
      this.state.toAddress.value === placeName
    ) {
      return Alert.alert(
        'No Same Addresses',
        'Please change on of the addresses',
      );
    }

    // @ts-ignore TODO: research why interpolation is not work with type screen
    await this.setState({
      [currentSelection]: {
        data: this.state[currentSelection].data,
        value: placeName,
        selected: {
          placeName,
          coordinates: { lat, long },
          street,
          neighborhood,
          state,
          postalCode,
        },
        isAddressSelected: true,
      },
      currentSelection: '',
    });

    if (this.state.fromAddress.isAddressSelected) {
      this.toAddressInputField.focus();
    }

    if (
      this.state.fromAddress.isAddressSelected &&
      this.state.toAddress.isAddressSelected
    ) {
      Keyboard.dismiss();
      this.props.applySearchResults(
        this.state.fromAddress.selected,
        this.state.toAddress.selected,
      );
    }
  }

  createToAddressRef(ref: any) {
    this.toAddressInputField = ref;
  }

  render() {
    return (
      <FromToSearchView
        searchForAddress={this.searchForAddress}
        fromAddress={this.state.fromAddress}
        toAddress={this.state.toAddress}
        onFocusFromAddressField={this.onFocusFromAddressField}
        onFocusToAddressField={this.onFocusToAddressField}
        addressListIsOpen={this.state.addressListIsOpen}
        currentSelection={this.state.currentSelection}
        onAddressSelection={this.onAddressSelection}
        createToAddressRef={this.createToAddressRef}
      />
    );
  }
}

export default FromToSearch;
