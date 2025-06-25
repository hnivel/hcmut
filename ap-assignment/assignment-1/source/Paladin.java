public class Paladin extends Knight {
    public Paladin(int baseHp, int wp) {
        super(baseHp, wp);
    }

    @Override
    public double getCombatScore() {
		int hp = this.getBaseHp();
		int fibonacciIndex = Utility.getFibonacciIndex(hp);
        if (fibonacciIndex > 2) {
			return 1000 + fibonacciIndex;
        }
        return hp * 3.0;
    }
}
