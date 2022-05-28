import React, {useContext} from 'react';
import { View, Button } from 'react-native';
import ServerContext from '../../utils/serverContext';

const QuieroButtonsGroup = ({enable}) => {
	const [server] = useContext(ServerContext);
	const socket = server.socket;

	const quiero = () => {
		socket.send("quiero");
	}

	const noQuiero = () => {
		socket.send("no_quiero");
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

export default QuieroButtonsGroup;
