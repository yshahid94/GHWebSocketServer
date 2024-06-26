import { userModel } from "./models/userEntityModel";
import { CTSRequestMessageModel } from "./models/MessageModels/CTSRequestMessageModel";
import { STCRequestMessageModel } from "./models/MessageModels/STCRequestMessageModel";
import { groupModel } from "./models/groupModel";
import { CTSMessageTypeEnum } from "./models/MessageModels/CTSMessageTypeEnum";
import { STCMessageTypeEnum } from "./models/MessageModels/STCMessageTypeEnum";

const topic = "group";
let group = new groupModel();

const server = Bun.serve<{ user: userModel }>({
    port: 1515,
    fetch(req, server) {
        //Get name from query param
        const requestURL = new URL(req.url);
        const username = requestURL.searchParams.get("Name");
        const deviceId = requestURL.searchParams.get("DeviceId"); // Newly added
        if (!username || !deviceId) { // Modified line
            return new Response("username or DeviceId missing", { status: 400 }); // Modified line
        }
        if (!username) {
            return new Response("username missing", { status: 400 });
        }
        const user = new userModel(username, deviceId);

        const success = server.upgrade(req, 
            { 
                data: { user },
                // headers: {
                //     "Set-Cookie": `UserId=${user.userId}`,
                //   },
            });
        if (success) return undefined;

        return new Response("Hi, I am a websocket :)");
    },
    websocket: {
        open(ws) {
            const reconnectingUser = group.findUserByDeviceId(ws.data.user.deviceId);
            if (reconnectingUser) {
                if(reconnectingUser instanceof userModel){
                    reconnectingUser.webSocket = ws;
                    console.log(`Reconnected: ${reconnectingUser.name}`);
                }
            } else {
                ws.data.user.webSocket = ws;
                group.addEntity(ws.data.user);
                // var monster = new monsterEntityModel("cool guy");
                // group.addEntity(monster);
                console.log(`${ws.data.user.name} added`);
            }

            ws.subscribe(topic);
            actionSTCMessage(STCMessageTypeEnum.Group_Data);
        },
        message(ws, message) {
            // the server re-broadcasts incoming messages to everyone
            try {
                const test: CTSRequestMessageModel = JSON.parse(message as string);
            } catch (error) {
                console.log(`Invalid payload`);
                return;
            }
            const CTSRequestMessage: CTSRequestMessageModel = JSON.parse(message as string);
            console.log(`${CTSRequestMessage.messageType.toString()} message`);
            
            switch (CTSRequestMessage.messageType) {
                case CTSMessageTypeEnum.New_Round:
                    group.newRound();
                    actionSTCMessage(STCMessageTypeEnum.Clear_Initiative);
                    break;
                case CTSMessageTypeEnum.Set_Initiative:
                    group.setInitiative(ws.data.user, CTSRequestMessage.message);
                    break;
                case CTSMessageTypeEnum.Next_Turn:
                    group.nextTurn();
                    break;
                case CTSMessageTypeEnum.Kill_Group:
                    group.resetGroup(ws.data.user);
                    break;
                case CTSMessageTypeEnum.Admin_Start_Turn:
                    group.showInitiative = true;
                    group.sortAndActivateFirst();
                    break;
                default:
                    break;
            }
            actionSTCMessage(STCMessageTypeEnum.Group_Data);
        },
        close(ws) {
            // ws.unsubscribe(topic);
            // group.removeEntity(ws.data.user);
            // console.log(`${ws.data.user.name} removed`, ws.data.user);

            // actionSTCMessage(STCMessageTypeEnum.Clear_Initiative);
            // actionSTCMessage(STCMessageTypeEnum.Group_Data);
        },
    },
});

//Grabs the data needed for the message and passes to publish message
function actionSTCMessage(type : STCMessageTypeEnum){
    let data: any = null;
    switch (type) {
        case STCMessageTypeEnum.Group_Data:
            console.log(`Sending out group data`);
            data = group;
            break;
        default:
            break;
    }
    publishSTCMessage(type, data);
}

function publishSTCMessage (type : STCMessageTypeEnum, message: any) {
    server.publish(topic, new STCRequestMessageModel(type, message).asJsonString());
};

console.log(`Listening on ${server.hostname}:${server.port}`);
