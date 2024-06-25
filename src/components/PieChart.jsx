import { useState, useEffect } from 'react'
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";


const PieChart = ({ dataSQL }) => {


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [total, setTotal] = useState(0)

  const [dataBar, setDataBar] = useState([]);

  useEffect(() => {
    const res = [];
    dataSQL.forEach(d => {
      let obj = {
        id: d.partido,
        label: d.partido,
        value: d.total_votos
      }
      res.push(obj)
    })
    setDataBar(res)
    const redu = res.reduce((acum, current) => {
      return acum + current.value
    }, 0)
    setTotal(redu)

  }, [dataSQL])


  return (
    <ResponsivePie
      data={dataBar}
      // theme={{
      //   axis: {
      //     domain: {
      //       line: {
      //         stroke: colors.grey[100],
      //       },
      //     },
      //     legend: {
      //       text: {
      //         fill: colors.grey[100],
      //       },
      //     },
      //     ticks: {
      //       line: {
      //         stroke: colors.grey[100],
      //         strokeWidth: 1,
      //       },
      //       text: {
      //         fill: colors.grey[100],
      //       },
      //     },
      //   },
      //   legends: {
      //     text: {
      //       fill: colors.grey[100],
      //     },
      //   }
      // }}
      margin={{ top: 40, right: 10, bottom: 16, left: 10 }}
      tooltip={d => {
        return (
          <div style={{ width: '270px', padding: '5px 20px', backgroundColor: '#fffafa', borderRadius: '10px', color: '#000000', textAlign: 'center' }}>
            <div style={{ width: '10px', height: '10px', marginRight: '10px', backgroundColor: d.datum.color, display: 'inline-block' }}></div>
            <h4 style={{ display: 'inline-block', fontWeight: 'bold', color:'#000000' }}>
              {d.datum.id} - {d.datum.formattedValue}
            </h4>
          </div>
        )
      }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      colors={['#12fb0a', '#800303', '#ADA7A7', '#011ded', '#eed312', , '#00A5AE', '#DA251D', '#034004']}
      arcLinkLabelsSkipAngle={2}
      arcLinkLabelsTextColor={colors.greenAccent[500]}
      arcLinkLabelsOffset={1}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLinkLabelsDiagonalLength={7}
      arcLinkLabelsTextOffset={3}
      arcLinkLabelsStraightLength={2}
      enableArcLinkLabels={true}
      enableArcLabels={true}
      valueFormat={
        function (e) {
          return ((e / total) * 100).toFixed(2) + '%'
        }
      }
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={2}
      arcLabelsTextColor='#ffffff'
      startAngle={-36}
      // defs={[
      //   {
      //     id: "dots",
      //     type: "patternDots",
      //     background: "inherit",
      //     color: "rgba(255, 255, 255, 0.3)",
      //     size: 4,
      //     padding: 1,
      //     stagger: true,
      //   },
      //   {
      //     id: "lines",
      //     type: "patternLines",
      //     background: "inherit",
      //     color: "rgba(255, 255, 255, 0.3)",
      //     rotation: -45,
      //     lineWidth: 6,
      //     spacing: 10,
      //   },
      // ]}
      transitionMode="endAngle"
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 9,
          translateY: 46,
          itemWidth: 100,
          itemHeight: 20,
          itemsSpacing: 0,
          symbolSize: 20,
          itemDirection: 'left-to-right'
        }
      ]}
    />
  );
};

export default PieChart;
