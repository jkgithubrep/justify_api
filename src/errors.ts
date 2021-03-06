export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class PaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
