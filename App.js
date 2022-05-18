import React from 'react';
import { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import { Alert, Button } from 'react-native';


const socket = new WebSocket("ws://192.168.2.147:9000");

// Abre la conexión
socket.addEventListener('open', function (event) {
	socket.send('Hello Server!');
});

const CartButton = ({index, card, enable}) => {

	const [cartaJugada, setCartaJugada] = useState(false);
	
	const JugarCarta = (index) => {
		console.log('jugarCarta,' + index);
		socket.send('jugarCarta,' + index);
		if(enable) setCartaJugada(true);
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
					<CartButton key={index} card={cards[key]} index={index} enable={enable}/>
				))
			}
		</View>
	)
}

const QuieroButtonsGroup = ({enable}) => {
	const quiero = () => {
		socket.send("quiero,1");
	}

	const noQuiero = () => {
		socket.send("quiero,0");
	}

	return (
		<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
			<Button
				title="Quiero"
				style={{ padding: 25 }}
				onPress={() => quiero()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
			<Button
				title="No Quiero"
				style={{ padding: 25 }}
				onPress={() => noQuiero()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
		</View>
	)
}

const EnvidoButtonsGroup = ({enable}) => {
	const envido = () => {
		socket.send("envido,0");
	}

	const real_envido = () => {
		socket.send("real_envido,0");
	}

	return (
		<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
			<Button
				title="Envido"
				style={{ padding: 25 }}
				onPress={() => envido()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
			<Button
				title="Real Envido"
				style={{ padding: 25 }}
				onPress={() => real_envido()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
		</View>
	)
}

const TrucoButtonsGroup = ({enable}) => {
	const truco = () => {
		socket.send("truco,0");
	}

	const retruco = () => {
		socket.send("retruco,0");
	}

	const vale_4 = () => {
		socket.send("vale_4,0");
	}
	return (
		<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
			<Button
				title="Truco"
				onPress={() => truco()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
			<Button
				title="Re Truco"
				onPress={() => retruco()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
			<Button
				title="Vale 4"
				onPress={() => vale_4()}
				enable={enable}
				color={ enable ? '' : 'grey' }
			/>
		</View>
	)
}

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

const TableGame = ({ history }) => {
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
		</>
	)
}
const App = () => {
	const [turn, setTurn] = useState(false)
	const [command, setCommand] = useState("{\"action\": \"\", \"payload\": \"\"}");
	const [playerConfig, setPlayerConfig] = useState({
		"playerid": NaN,
		"teamid": NaN
	});
	const [msg, setMsg] = useState("");
	const [cards, setCards] = useState([
		[1, "basto"], [1, "espada"], [1, "copa"]
	]);

	const [points, setPoints] = useState(
		{
			"1": 0,
			"2": 0
		}
	)

	const [history, setHistory] = useState({
		"1": [
			"1_basto", "1_espada", "1_copa"
		],
		"2": [
			"1_basto", "1_espada", "1_copa"
		]
	});


	const reset = () => {
		setCards([

		]);
		setMsg("");
		setHistory({
			"1": [],
			"2": []
		});
	}

	const configurePlayer = ({playerid, teamid}) => {
		setPlayerConfig({
			"playerid": playerid,
			"teamid": teamid
		});
	}

	const showCardPlaying = ({team, card}) => {
		var nHistory = {
			"1": [...history["1"]],
			"2": [...history["2"]]
		}
		if (team == playerConfig.teamid) {
			nHistory["2"].push(card);
		} else {
			nHistory["1"].push(card);
		}
		setHistory(nHistory);
	}

	const processData = ({ data }) => {
		try {
			console.log(data);
			var input_data = JSON.parse(data);
			// setMsg(input_data);
			console.log(input_data);
			var action = input_data["action"];
			var payload = input_data["payload"];
			switch (action) {
				case 'config_player':
					configurePlayer(payload);
					break
				case 'showCards':
					setCards(input_data["payload"]);
					console.table(input_data["payload"]);
					break;
				case "showCardPlaying":
					// {"action": "showCardPlaying", "payload": {"team": 1, "player": 0, "card": "6_basto"}}
					showCardPlaying(payload);
					break;
				case "show_points_for_team":
					points[payload.team] = payload.points
					setPoints(points);
					break;
				case "set_turn_player":
					if(playerConfig.playerid == payload.player && playerConfig.teamid == payload.team){
						setTurn(true);
					}else{
						setTurn(false);
					}
				case 'msg':
					setMsg(msg + "\n" + input_data["payload"]);
					break;
				case 'start_new_round':
					reset();
					break;
			}
		} catch (error) {
			console.log(error);
		}
	}
	
	useEffect(() => {
		// socket.removeListener('message', processData);
		socket.addEventListener('message', (data) => {
			setCommand(data);
		});
	}, []);

	useEffect(() => {
		processData(command);
	}, [command]);


	return (
		<SafeAreaView style={styles.container}>
			
			<Text>{ turn ? "Es tu turno" : "" }</Text>
			<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
				<Text>Jugador: {playerConfig["playerid"]} - Team: {playerConfig["teamid"]} </Text>
			</View>
			<TableGame history={history} />
			<MyCards cards={cards} enable={turn}/>
			<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
				<Text>Ultima jugada: {msg}</Text>
			</View>
			<TablePoints points={points} />
			<QuieroButtonsGroup enable={turn}/>
			<EnvidoButtonsGroup enable={turn}/>
			<TrucoButtonsGroup enable={turn}/>
		</SafeAreaView >
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
	},
	buttonView: {
		// flex: 1,
		flexDirection: "row",
		backgroundColor: "black",
		flexWrap: "wrap",
		height: 50,
		alignItems: 'center'
	},
	button: {
		padding: 50,
	},
	OpossiteCard: {
		backgroundColor: 'red',
		color: 'white',
		marginVertical: 8,
		marginHorizontal: 5,
		padding: 3
	},
	item: {
		backgroundColor: '#f9c2ff',
		marginVertical: 8,
		marginHorizontal: 5,
		padding: 4
	},
	title: {
		fontSize: 32,
	},
});

export default App;