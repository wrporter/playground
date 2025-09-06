type PaymentMethod = 'Cash' | 'Check' | 'Card' | undefined;

interface Payment {
    method: PaymentMethod;
    amount: number;
}

interface Charge {
    id: string;
    amountDue: number;
    method?: PaymentMethod;
}

export class SplitPaymentProcessor {
    private readonly methods: Payment[];

    private readonly charges: Charge[];

    constructor(methods: Payment[], charges: Charge[]) {
        this.methods = methods;
        this.charges = charges;
    }

    validateAndProcessPayments(): void {
        this.processExplicitPayments();
        this.processDefaultPayments();
        this.validateFinalAmounts();
    }

    private processExplicitPayments(): void {
        for (let i = 0; i < this.charges.length; i += 1) {
            const charge = this.charges[i];
            if (charge.method) {
                const paymentMethod = this.methods.find((m) => m.method === charge.method);
                if (!paymentMethod || paymentMethod.amount < charge.amountDue) {
                    throw new Error(
                        `Insufficient funds for charge ${charge.id} with ${charge.method}`,
                    );
                }
                paymentMethod.amount -= charge.amountDue;
            }
        }
    }

    private processDefaultPayments(): void {
        for (let i = 0; i < this.charges.filter((c) => !c.method).length; i += 1) {
            const charge = this.charges.filter((c) => !c.method)[i];
            for (let j = 0; j < this.methods.length; j += 1) {
                const method = this.methods[j];
                if (charge.amountDue <= 0) break;
                const deductAmount = Math.min(method.amount, charge.amountDue);
                method.amount -= deductAmount;
                charge.amountDue -= deductAmount;
            }
            if (charge.amountDue > 0) {
                throw new Error(`Not enough funds to cover charge ${charge.id}`);
            }
        }
    }

    private validateFinalAmounts(): void {
        const remainingFunds = this.methods.reduce((sum, method) => sum + method.amount, 0);
        if (remainingFunds > 0) {
            throw new Error(`More payment provided than required`);
        }
    }
}
