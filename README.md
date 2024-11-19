# ScalePilot
Commercial WMS for inventory management




[ ![image](https://i.ibb.co/HpmfjBH/ezgif-3-54aaa81bb1.gif) ](https://scalepilot.pavlenkomaksim.com)

## How to run

Run this command in the same directory with this README file

```sh
docker compose up
```

### Running Containers Separately

Build each image

```sh
docker build -t scalepilot-front ./frontend/sklad
docker build -t scalepilot-back ./backend/sklad
```

Run images

```sh
docker run -d --name scalepilot-front -p 8072:80 scalepilot-front
docker run -d --name scalepilot-back -p 8082:8082 scalepilot-back
```