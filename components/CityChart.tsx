import { chartColors, Colors } from '@constants/Colors';
import { ThemeContext } from '@context/ThemeContext';
import { useContext } from 'react';
import { Dimensions } from 'react-native';
import { BarChart, barDataItem, LineChart, lineDataItem } from 'react-native-gifted-charts';

type Chart = 'bar' | 'line' | 'area';

interface CityChartProps {
  type?: Chart;
  data: barDataItem[] | lineDataItem[];
}

const { width: screenWidth } = Dimensions.get('screen');

export const CityChart = ({ type, data }: CityChartProps) => {
  const { theme } = useContext(ThemeContext);

  if (type === 'bar') {
    return (
      <BarChart
        barStyle={{ backgroundColor: Colors[theme].tempIndicator }}
        data={data}
        color={Colors[theme].grey}
        width={screenWidth - 32}
        barWidth={45}
        spacing={16}
        initialSpacing={32}
        yAxisTextStyle={{ color: chartColors[theme].yAxisTextColor }}
        {...chartColors[theme]}
      />
    );
  }

  return (
    <LineChart
      data={data}
      width={screenWidth - 32}
      initialSpacing={32}
      spacing={(screenWidth - 32) / data.length}
      showVerticalLines
      areaChart={type === 'area'}
      roundToDigits={1}
      {...chartColors[theme]}
      yAxisTextStyle={{ color: chartColors[theme].yAxisTextColor }}
      color={chartColors[theme].lineColor}
    />
  );
};
