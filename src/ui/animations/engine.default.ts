import { engine } from "animejs";

export const setupEngine = () => {
  engine.fps = 60;
  engine.pauseOnDocumentHidden = true;
}

