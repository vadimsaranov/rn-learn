import CitiesContextProvider from '@context/CitiesContext';
import { cityFixture } from '@core/CityFixtures';
import { persistor, store } from '@store/store';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { Provider } from 'react-redux';
import HomeLayout from '../(tabs)/(home)/_layout';
import WeatherIcons from '../(tabs)/(home)/chooseWeatherIcon';
import WeatherDetailsScreen from '../(tabs)/(home)/details';
import HomeScreen from '../(tabs)/(home)/index';
import NewWeatherCity from '../(tabs)/(home)/newWeatherCity';
import { PersistGate } from 'redux-persist/integration/react';

describe('Home screen', () => {
  test('Cities renders correctly HomeScreen', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(cityFixture),
    });
    const render = renderRouter(
      {
        _layout: HomeLayout,
        details: WeatherDetailsScreen,
        index: HomeScreen,
        newWeatherCity: NewWeatherCity,
        chooseWeatherIcon: WeatherIcons,
      },
      {
        initialUrl: '/',
        wrapper: ({ children }) => (
          <Provider store={store}>
            <CitiesContextProvider>{children}</CitiesContextProvider>
          </Provider>
        ),
      },
    );

    await waitFor(() => screen.getAllByText('Vilnius'));
    expect(render.toJSON()).toMatchSnapshot();
  });
  test('Should display no data found when no cities are found', async () => {
    global.fetch = jest.fn().mockRejectedValue({
      json: jest.fn().mockRejectedValueOnce(new Error('Network error')),
    });
    const render = renderRouter(
      {
        _layout: HomeLayout,
        details: WeatherDetailsScreen,
        index: HomeScreen,
        newWeatherCity: NewWeatherCity,
        chooseWeatherIcon: WeatherIcons,
      },
      {
        initialUrl: '/',
        wrapper: ({ children }) => (
          <Provider store={store}>
            <CitiesContextProvider>{children}</CitiesContextProvider>
          </Provider>
        ),
      },
    );
    await waitFor(() => screen.getAllByText('No data found'));

    const emptyState = screen.getByText('No data found');
    expect(emptyState).toBeOnTheScreen();
    expect(render.toJSON()).toMatchSnapshot();
  });
  test('Should navigate to new weather city screen when button is clicked ', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(cityFixture),
    });
    renderRouter(
      {
        _layout: HomeLayout,
        details: WeatherDetailsScreen,
        index: HomeScreen,
        newWeatherCity: NewWeatherCity,
        chooseWeatherIcon: WeatherIcons,
      },
      {
        initialUrl: '/',
        wrapper: ({ children }) => (
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <CitiesContextProvider>{children}</CitiesContextProvider>
            </PersistGate>
          </Provider>
        ),
      },
    );

    await waitFor(() => screen.getAllByText('Vilnius'));

    const addNewWeatherButton = screen.getByText('Add new');
    expect(addNewWeatherButton).toBeOnTheScreen();
    fireEvent(addNewWeatherButton, 'press');

    expect(screen).toHavePathname('/newWeatherCity');
  });
});
