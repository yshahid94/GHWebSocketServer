import { userModel } from "./models/userModel";
import { requestMessageModel } from "./models/requestMessageModel";
import { groupModel } from "./models/groupModel";
import { messageTypeEnum } from "./models/messageTypeEnum";
const topic = "group";
let group = new groupModel();
const server = Bun.serve<{ user: userModel }>({
    fetch(req, server) {
        //Get name from query param
        const requestURL = new URL(req.url);
        const username = requestURL.searchParams.get("Name");
        if (!username) {
            return new Response("username missing", { status: 400 });
        }
        const user = new userModel(username);

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
            group.addUser(ws.data.user);
            console.log(`${ws.data.user.username} added`, ws.data.user);
            ws.subscribe(topic);
            server.publish(topic, JSON.stringify(group));
        },
        message(ws, message) {
            // the server re-broadcasts incoming messages to everyone
            
            const requestMessage: requestMessageModel = JSON.parse(message as string);
            
            switch (requestMessage.messageType) {
                case messageTypeEnum.New_Round:
                    group.newRound();
                    break;
                case messageTypeEnum.Set_Initiative:
                    group.setInitiative(ws.data.user, requestMessage.message);
                    break;
                default:
                    break;
            }
            server.publish(topic, JSON.stringify(group));
        },
        close(ws) {
            group.removeUser(ws.data.user);
            console.log(`${ws.data.user.username} removed`, ws.data.user);

            ws.unsubscribe(topic);
            server.publish(topic, JSON.stringify(group));
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);