import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, Button, View, TextInput, Text, StatusBar, StyleSheet, Alert } from 'react-native';
import ServerContext from './utils/serverContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Cell, Row, Rows, Table, TableWrapper } from 'react-native-table-component';
import Game from './components/game/game';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
	const [server, setServer] = useContext(ServerContext);

	const [command, setCommand] = useState("{\"action\": \"\", \"payload\": \"\"}");
	
	const tableHead = ['ID', 'Jugadores', ''];
	const tableWidthArr = [75, 100, 150];
	const [tableData, setTableData] = useState([])

	useEffect(() => {
		processData(command);
	}, [command]);

	const connectToServer = () => {
		var socket_ = new WebSocket("ws://" + server.adress);

		socket_.addEventListener('open', () => {
			console.log("Conexion establecida");
			setServer({
				...server, socket: socket_
			})
			
			socket_.addEventListener('message', (data) => {
				setCommand(data.data);
			});
		});
	}

	const processData = (data) => {
		var input_data = JSON.parse(data);
		var action = input_data["action"];
		var payload = input_data["payload"];
		switch (action) {
			case 'refresh_tables':
				setTableData(payload);
				break;
			case 'join_to_table':
				joinToTable(payload)
				break;
		}
	}
	const enterTableButton = (mesaID, index) => (
		<Button
			title="Entrar"
			onPress={() => {
				joinToTable(mesaID)
			}}
		/>
	);

	const joinToTable = (table_idx) => {
		if(server.socket == null) return;
		server.socket.send("join,"+table_idx);
		navigation.navigate('Game',{
			"server": server
		});
	}

	const getTables = () => {
		if(server.socket == null) return;
		server.socket.send("get_tables");
	}

	const createTable = () => {
		if(server.socket == null) return;
		server.socket.send("create_table");
	}
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'orange', margin: 2 }}>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
				<TextInput
					onChangeText={(e) => (
						setServer({ ...server, adress: e })
						// setServer()
					)
					}
					value={server.adress}
					style={{ backgroundColor: 'white', padding: 10, width: 250 }}
					placeholder="IP y Puerto: localhost:9999"
				/>
				<Button
					title="Conectarme"
					onPress={() => connectToServer()}
					color={server.socket == null ? '' : 'grey'}
				/>
			</View>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<View style={{ padding: 10,  flexDirection: 'row'  }}>
					<Button
						title="Crear mesa"
						onPress={() => createTable()}					
					/>
					<Button
						title="Actualizar"
						onPress={() => getTables()}					
					/>
				</View>
				<Table borderStyle={{ borderWidth: 1, borderColor: 'orange', width: 350 }}>
					<Row data={tableHead} style={styles.head} widthArr={tableWidthArr} textStyle={styles.text} />
					{
						tableData.map((rowData, index) => (
							<TableWrapper key={index} style={styles.row} >
								{
									rowData.map((cellData, cellIndex) => (
										<Cell
											key={cellIndex}
											width={tableWidthArr[cellIndex]}
											style={{ alignItems: 'center', justifyContent: 'center' }}
											data={cellIndex === 2 ? enterTableButton(cellData, index) : cellData}
											textStyle={styles.text} />
									))
								}
							</TableWrapper>
						))
					}
				</Table>
			</View>
		</View>
	);
}

const App = () => {
	const [server, setServer] = useState({
		adress: "127.0.0.1:9000",
		socket: null
	});

	return (
		<NavigationContainer>
			<ServerContext.Provider value={[server, setServer]}>
				<Stack.Navigator initialRouteName="Home">
					<Stack.Screen name="Home" component={HomeScreen} />
					<Stack.Screen name="Game" component={Game} />
				</Stack.Navigator>
			</ServerContext.Provider>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
	head: { height: 40, backgroundColor: '#808B97' },
	text: { margin: 6 },
	row: { flexDirection: 'row', backgroundColor: '#FFF1C1', textAlign: 'center' },
	btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
	btnText: { textAlign: 'center', color: '#fff' }
});

export default App;