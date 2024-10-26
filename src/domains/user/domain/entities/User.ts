export class User {
  public readonly id: string;
  public readonly email: string;
  private _password: string = '';

  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    email: string,
    password: string
  ) {
    this.id = this.generateId(); // Pode ser uma UUID ou outro gerador de ID
    this.email = email;
    this.setPassword(password);
  }

  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private setPassword(password: string): void {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    this._password = this.hashPassword(password);
  }

  private hashPassword(password: string): string {
    // Implementar hash com biblioteca como bcrypt
    return password; // Implementar hash
  }

  public checkPassword(password: string): boolean {
    // Implementar verificação de senha usando hash
    return this._password === password; // Simplificado para o exemplo
  }
}
