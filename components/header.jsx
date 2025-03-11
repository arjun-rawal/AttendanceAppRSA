import { Header } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

<Header
  ViewComponent={LinearGradient} // Don't forget this!
  linearGradientProps={{
    colors: ['blue', 'pink'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  }}
/>