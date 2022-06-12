import React from 'react';
import {  useState , useContext } from 'react';
import {  View, Button } from 'react-native';
import ServerContext from '../../utils/serverContext';

const CardButton = ({index, card, enable}) => {
    const [server] = useContext(ServerContext);
	const socket = server.socket;
	const [cartaJugada, setCartaJugada] = useState(false);
	
	const JugarCarta = (index) => {
		if(enable){
			setCartaJugada(true);
			console.log('jugar_carta,' + index);
			socket.send('jugar_carta,' + index);
		}
	}

	return (
		<Button title={`${index} - ${card[0]} de ${card[1]}`}
			onPress={() => JugarCarta(index)}
			color={ cartaJugada ? 'grey' : '' }
			enable={enable}
		/>
	)
}

const MyCards = ({ cards, enable }) => {
	return (
		<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
			{
				Object.keys(cards).map((key, index) => (
					<CardButton key={index} card={cards[key]} index={index} enable={enable}/>
				))
			}
		</View>
	)
}

export default MyCards;