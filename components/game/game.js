import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, Text, StatusBar } from 'react-native';
import MyCards from './myCards';
import QuieroButtonsGroup from './quieroButtonsGroup';
import TrucoButtonsGroup from './trucoButtonsGroup';
import EnvidoButtonsGroup from './envidoButtonsGroup';
import TableGame from './tableGame';
import ServerContext from '../../utils/serverContext';
import { ScrollView } from 'react-native-web';

const GameScreen = () => {
	const [server] = useContext(ServerContext);
	const socket = server.socket;
	const [availableActions, setAvailablesActions] = useState([

	]);
	const [turn, setTurn] = useState([
		false
	]);
	const [command, setCommand] = useState("{\"action\": \"\", \"payload\": \"\"}");
	const [playerConfig, setPlayerConfig] = useState({
		"playerid": NaN,
		"teamid": NaN
	});
	const [msg, setMsg] = useState("");
	const [cards, setCards] = useState([
	]);

	const [points, setPoints] = useState(
		{
			"1": 0,
			"2": 0
		}
	)

	const [history, setHistory] = useState({
		"1": [
		],
		"2": [
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

	const configurePlayer = ({ playerid, teamid }) => {
		setPlayerConfig({
			"playerid": playerid,
			"teamid": teamid
		});
	}

	const showCardPlaying = ({ team, card }) => {
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
			var input_data = JSON.parse(data);
			var action = input_data["action"];
			var payload = input_data["payload"];
			switch (action) {
				case 'config_player':
					configurePlayer(payload);
					break
				case 'showCards':
					setCards(input_data["payload"]);
					break;
				case "showCardPlaying":
					showCardPlaying(payload);
					break;
				case "show_points_for_team":
					points[payload.team] = payload.points
					setPoints(points);
					break;
				case "set_turn_player":
					if (playerConfig.playerid == payload.player && playerConfig.teamid == payload.team) {
						setTurn(true);
						setAvailablesActions(payload.actions);
					} else {
						setTurn(false);
						setAvailablesActions([]);
					}
					break;
				case 'msg':
					setMsg(input_data["payload"] + "\n" + msg);
					break;
				case 'start_new_round':
					reset();
					break;
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		socket.addEventListener('message', (data) => {
			setCommand(data);
		});
	}, []);

	useEffect(() => {
		processData(command);
	}, [command]);


	return (
		<SafeAreaView style={styles.container}>
			<Text>{turn ? "Es tu turno" : ""}</Text>
			<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
				<Text>Jugador: {playerConfig["playerid"]} - Team: {playerConfig["teamid"]} </Text>
			</View>
			<TableGame history={history} points={points} />
			<MyCards cards={cards} enable={turn} />
			<ScrollView style={styles.scrollView}>
				<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
					<Text>{msg}</Text>
				</View>
			</ScrollView>

			<QuieroButtonsGroup availableActions={availableActions} />
			<EnvidoButtonsGroup availableActions={availableActions} />
			<TrucoButtonsGroup availableActions={availableActions} />
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
	scrollView: {
		paddingVertical: 20
	}
});

export default GameScreen;