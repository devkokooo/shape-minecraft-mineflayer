# shape-minecraft-mineflayer

This example shows you how to integrate the Shapes API with your local Minecraft server via Mineflayer

[Generate your Shapes API key](https://shapes.inc/developer) (Shape-specific key recommended)

## Setup: Minecraft Server

In this example we'll use version `1.21.4`, which you can download the server jar [here](https://mcversions.net/download/1.21.4).

For `v1.24.4`, you will also need to install the latest Java Runtime Environment (1.8u451) and JDK 21+. The JRE and JDK versions will vary depending on the version of the game you're running.

For development purposes we'll run an offline server, so you don't need a paid account to connect your Mineflayer bot. However, you will need to connect your main user account to interact with it in game.

Run the server for the first time:
```bash
java -jar minecraft-server-1.21.4.jar
```
You will have to set `eula=true` in `eula.txt` before running the above command again.

Once the server files are generated, you should see a `server.properties` file, where you will have to set the following variables:
- `online-mode=false`
- `server-ip=0.0.0.0`
- `port=25565`

Restart the server for changes to take effect.

## Setup: Mineflayer bot

Copy `.env.example` to `.env` and fill in your environment variables. For example:
```bash
# Shapes
SHAPESINC_API_KEY=SHAPE_API_KEY
SHAPESINC_SHAPE_USERNAME=kotochan_

# Minecraft / Mineflayer
MINECRAFT_HOST_IP=172.x.x.x
MINECRAFT_SERVER_PORT=25565
MINEFLAYER_USERNAME=kotochan_
```

**Note:** if running the Mineflayer bot via WSL, make sure to set `MINECRAFT_HOST_IP` to the host machine's ip found in `ip route` (i.e. `172.x.x.x`).

To install dependencies:
```bash
bun install
```

To run:
```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.14. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
