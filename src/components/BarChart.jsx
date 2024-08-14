
import { ResponsiveBar } from '@nivo/bar'
import { tokens } from "../theme"
import { useTheme } from "@mui/material"
import PropTypes from 'prop-types'

const MyResponsiveBar = ({ data }) => {

  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (

		<ResponsiveBar

			height={270}
			width={800}
			data={data}
			keys={[
				'Enero',
				'Febrero',
				'Marzo',
				'Abril',
				'Mayo',
				'Junio'
			]}
			theme={{
				axis: {
				domain: {
					line: {
					stroke: colors.grey[100],
					},
				},
				legend: {
					text: {
					fill: colors.grey[100],
					},
				},
				ticks: {
					line: {
					stroke: colors.grey[100],
					strokeWidth: 1,
					},
					text: {
					fill: colors.grey[100],
					},
				},
				},
				legends: {
				text: {
					fill: colors.grey[100],
				},
				}
			}}
			indexBy="country"
			margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
			padding={0.3}
			valueScale={{ type: 'linear' }}
			indexScale={{ type: 'band', round: true }}
			colors={{ scheme: 'nivo' }}
			enableGridY={false}
			defs={[
				{
				id: 'dots',
				type: 'patternDots',
				background: 'inherit',
				color: '#38bcb2',
				size: 4,
				padding: 1,
				stagger: true
				},
				{
				id: 'lines',
				type: 'patternLines',
				background: 'inherit',
				color: '#eed312',
				rotation: -45,
				lineWidth: 6,
				spacing: 10
				}
			]}
			fill={[
				{
				match: {
					id: 'fries'
				},
				id: 'dots'
				},
				{
				match: {
					id: 'sandwich'
				},
				id: 'lines'
				}
			]}
			borderColor={{
				from: 'color',
				modifiers: [
				[
					'darker',
					1.6
				]
				]
			}}
			axisTop={null}
			axisRight={null}
			labelSkipWidth={12}
			labelSkipHeight={12}
			labelTextColor="#ffffff"
			// labelTextColor={{
			//   from: 'color',
			//   modifiers: [
			//     [
			//       'darker',
			//       1.6
			//     ]
			//   ]
			// }}
			legends={[
				{
				dataFrom: 'keys',
				anchor: 'bottom-right',
				direction: 'column',
				justify: false,
				translateX: 120,
				translateY: 0,
				itemsSpacing: 2,
				itemWidth: 100,
				itemHeight: 20,
				itemDirection: 'left-to-right',
				itemOpacity: 0.85,
				symbolSize: 20,
				itemTextColor: '#ffffff',
				effects: [
					{
					on: 'hover',
					style: {
						itemOpacity: 1,
					}
					}
				]
				}
			]}
			role="application"
			ariaLabel="Nivo bar chart demo"
			barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
		/>

	)

}

MyResponsiveBar.propTypes = {
	data: PropTypes.any.isRequired
}

export default MyResponsiveBar