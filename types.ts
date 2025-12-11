export enum AppView {
  HOME = 'HOME',
  QR_GENERATOR = 'QR_GENERATOR',
  RANDOM_PICKER = 'RANDOM_PICKER',
  STOPWATCH = 'STOPWATCH',
  DICE_ROLLER = 'DICE_ROLLER',
}

export interface Student {
  id: string;
  name: string;
  picked: boolean;
}