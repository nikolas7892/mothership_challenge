import React, { PureComponent, ReactElement } from 'react';
import { FlatList, Text } from 'react-native';
import { IDeliveryCell } from '..';
import { IDeliverySearchResult } from '../../../../redux/Deliveries/interfaces';
import styles from './styles';

type Props = {
  renderItem(cellItem: IDeliveryCell): ReactElement;
  data: Array<IDeliverySearchResult>;
};

const keyExtractor = (item: IDeliverySearchResult) =>
  `DeliveryHistoryList.${item.uuid}`;

class DeliveryHistoryListView extends PureComponent<Props> {
  render() {
    return (
      <FlatList
        ListHeaderComponent={<Text style={styles.header}>Ride History</Text>}
        data={this.props.data}
        keyExtractor={keyExtractor}
        renderItem={this.props.renderItem}
      />
    );
  }
}

export default DeliveryHistoryListView;
