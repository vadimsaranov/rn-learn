import CitiesContextProvider from '@context/CitiesContext';
import { cityFixture } from '@core/CityFixtures';
import { store } from '@store/store';
import { render, waitFor } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import { Provider } from 'react-redux';
import HomeScreen from '../(tabs)/(home)/index';

describe('Home screen', () => {
  test('Cities renders correctly HomeScreen', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(cityFixture),
    });
    render(
      <Provider store={store}>
        <CitiesContextProvider>
          <HomeScreen />
        </CitiesContextProvider>
      </Provider>,
    ).toJSON();

    await waitFor(() => screen.getAllByText('Vilnius'));
    expect(screen).toMatchSnapshot();
  });
  test('Should display no data found when no cities are found', async () => {
    global.fetch = jest.fn().mockRejectedValue({
      json: jest.fn().mockRejectedValueOnce(new Error('Network error')),
    });
    render(
      <Provider store={store}>
        <CitiesContextProvider>
          <HomeScreen />
        </CitiesContextProvider>
      </Provider>,
    ).toJSON();
    await waitFor(() => screen.getAllByText('No data found'));

    const emptyState = screen.getByText('No data found');
    expect(emptyState).toBeOnTheScreen();
    expect(screen).toMatchSnapshot();
  });
});
