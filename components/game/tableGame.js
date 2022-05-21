import React from 'react';
import { View, Text } from 'react-native';

const TablePoints = ({points}) => {
	return (
		<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
			<Text>Puntos Equipo 1: {points[1]}</Text>
			<Text>Puntos Equipo 2: {points[2]}</Text>
		</View>
	)
}

const Card = ({ name }) => {
	console.log(name);
	return (
		<View style={{ "backgroundColor": "grey", "padding": 10 }}>
			<Text>{name}</Text>
		</View>
	)
}

const TableGame = ({ history , points}) => {
	console.log(history);
	return (
		<>
			<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
				{
					history["1"].map((value, i) => (
						<Card name={`${value}`} />
					)
					)
				}
			</View>
			<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
				{
					history["2"].map((value, i) => (
						<Card name={`${value}`} />
					))
				}
			</View>
			<TablePoints points={points} />
		</>
	)
}

export default TableGame;