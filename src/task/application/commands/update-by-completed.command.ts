export class UpdateByCompletedCommand {
  constructor(
    public id: number,
    public completed: boolean,
  ) {}
}
