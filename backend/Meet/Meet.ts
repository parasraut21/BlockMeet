import { generateId } from "./helpers";

interface Player {
  id: string;
  username: string;
}

class Meet {
  id: string;
  players: Player[] = [];
  isPublic: boolean;

  constructor(isPublic: boolean = false) {
    this.id = generateId();
    this.isPublic = isPublic;
  }

  join(id: string, username?: string): boolean {
    if (!username) username = "Guest";
    let playerIndex = this.players.findIndex((p) => p.id === id);
    if (playerIndex === -1) {
      if (this.players.length >= 10) return false;

      this.players.push({ id, username });
    }
    return true;
  }

  data() {
    return {
      id: this.id,

      players: this.players,

    

      isPublic: this.isPublic,
    };
  }


}

export default Meet;
