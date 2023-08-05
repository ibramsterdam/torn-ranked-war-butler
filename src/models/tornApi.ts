export interface Faction {
  ID: number;
  name: string;
  tag: string;
  tag_image: string;
  leader: number;
  "co-leader": number;
  respect: number;
  age: number;
  capacity: number;
  best_chain: number;
  ranked_wars: {};
  raid_wars: {};
  peace: {};
  rank: {
    level: number;
    name: string;
    division: number;
    position: number;
    wins: number;
  };
  members: Record<
    string,
    {
      name: string;
      level: number;
      days_in_faction: number;
      last_action: {
        status: string;
        timestamp: number;
        relative: string;
      };
      status: {
        description: string;
        details: string;
        state: string;
        color: string;
        until: number;
      };
      position: string;
    }
  >;
  territory_wars: {
    territory: string;
    assaulting_faction: number;
    defending_faction: number;
    score: number;
    required_score: number;
    start_time: number;
    end_time: number;
  }[];
}
