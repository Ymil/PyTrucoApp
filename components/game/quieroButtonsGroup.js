import React, {useContext} from 'react';
import { View, Button } from 'react-native';
import ServerContext from '../../utils/serverContext';

const QuieroButtonsGroup = ({availableActions}) => {
	const [server] = useContext(ServerContext);
	const socket = server.socket;

	const quiero = () => {
		socket.send("quiero");
	}

	const noQuiero = () => {
		socket.send("no_quiero");
	}

	if(availableActions.includes("quiero", "no_quiero")){
		return (
			<View style={{ flexDirection: "row", justifyContent: 'space-around', padding: 25 }}>
				<Button
					title="Quiero"
					style={{ padding: 25 }}
					onPress={() => quiero()}
				/>
				<Button
					title="No Quiero"
					style={{ padding: 25 }}
					onPress={() => noQuiero()}
				/>
			</View>
		);
	}else{
		return <></>;
	}
}

export default QuieroButtonsGroup;
