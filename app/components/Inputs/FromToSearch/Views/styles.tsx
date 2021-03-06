import { StyleSheet } from 'react-native';
import { Colors, Scaled } from '../../../../themes';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  inputFieldsContainer: {
    height: Scaled.screen.height * 0.19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  searchContainer: {
    flex: 0.9,
    height: '100%',
    minHeight: 100,
    maxHeight: Scaled.screen.width * 0.3,
    justifyContent: 'space-around',
  },
  addressContainer: {
    height: Scaled.screen.height * 0.5,
  },
});
