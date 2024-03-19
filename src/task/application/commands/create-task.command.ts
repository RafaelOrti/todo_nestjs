export class CreateTaskCommand {
  constructor(
    public readonly description: string,
    public readonly author: string,
  ) {}
}
