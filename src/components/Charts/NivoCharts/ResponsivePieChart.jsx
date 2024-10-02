import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, useTheme } from "@mui/material"
import { tokens } from "../../../theme.js"

const formatCustom = (value, format) => {
  if (!format) return value;

  let formattedValue = value.toString();
  
  if (format.includes(',')) {
    formattedValue = value.toLocaleString();
  }
  
  if (format.includes('$')) {
    formattedValue = `$${formattedValue}`;
  }

  if (format.includes('>')) {
    formattedValue = `${formattedValue}`;
  }

  return formattedValue;
};

const ResponsivePieChart = ({ 
  data,
  tooltipFormat,
  margin,
  legendItemsSpacing
}) => {    

    const theme = useTheme()
    const colors = tokens(theme.palette.mode) 

    const getPieColor = (id) => {
        const item = data.find(d => d.id === id);
        return item?.color || colors.primary[500];
    };

    const gradientId = `gradient-${Math.random().toString(36).substring(2, 11)}`;

    return (
      <Box 
        sx={{ 
          height: '100%', 
          width: '100%'
        }}>
        <ResponsivePie
          data={data}
          margin={margin}
          valueFormat={ tooltipFormat }
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          colors={({ id }) => getPieColor(id)}
          borderColor={{
              from: 'color',
              modifiers: [
                  [
                      'darker',
                      0.2
                  ]
              ]
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={colors.primary[100]}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={colors.grey[100]}
          tooltip={({ datum }) => {   
            const formattedValue = formatCustom(datum.value, tooltipFormat);
            return (
              <div
                style={{
                  background: colors.grey[600],
                  color: colors.grey[100],
                  padding: '10px',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: datum.color,
                    marginRight: '10px',
                    borderRadius: '50%',
                  }}
                />
                <strong>{datum.id}</strong>: {formattedValue}
              </div>
          );
        }}
          defs={[
            {
                id: gradientId,
                type: 'linearGradient',
                colors: [
                    { offset: 0, color: 'inherit', opacity: 1 },
                    { offset: 100, color: 'inherit', opacity: 0 }
                ],
            },
        ]}
        fill={[
            {
                match: '*',
                id: gradientId,
            },
        ]}
          legends={[
              {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: legendItemsSpacing,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                      {
                          on: 'hover',
                          style: {
                              itemTextColor: '#000'
                          }
                      }
                  ]                
              }
          ]}
        />
      </Box>
    ) 
  }

export default ResponsivePieChart;