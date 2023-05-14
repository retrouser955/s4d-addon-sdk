const AddonBuilder = require("./index.js");

const builder = new AddonBuilder({
    name: "S4D Blocks",
    description: "An extension for default S4D blocks",
    data: ["toolbox", "theme"],
    version: require("./package.json").version,
});

builder.modifyToolbox((toolbox) => {
    return {
        ...toolbox,
        "kind": "category",
        "name": "Base",
        "colour": "#f46580",
        "contents": [
            {
                "type": "eventClientConnected",
                "kind": "block"
            },
            {
                "type": "botLogin",
                "kind": "block"
            }
        ]
    }
})

const loginData = {
    message0: "Connect to Discord using token %1",
    args0: [
        {
            type: "input_value",
            name: "TOKEN",
            check: ["String", "Env"],
        },
    ],
    colour: "#3333ff",
    tooltip: "Connect your bot to Discord using your bot's token",
    helpUrl: "",
};

builder.addBlock("s4d_login", loginData, async (values) => {
    const { TOKEN } = values

    const code = `s4d.client.login("${TOKEN}").catch((e) => { 
        const tokenInvalid = true;
        const tokenError = e;
        if (e.toString().toLowerCase().includes("token")) {
            throw new Error("An invalid bot token was provided!")
        } else {
            throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.")
        }
    });\n`;

    return code
});

builder.login();
