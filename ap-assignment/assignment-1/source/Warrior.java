public class Warrior extends Fighter {
    public Warrior(int baseHp, int wp) {
        super(baseHp, wp);
    }

    @Override
    public double getCombatScore() {
        double combatScore = 0;

        if (Utility.isPrime(Battle.GROUND)) {
            combatScore = this.getBaseHp() * 2.0;
        } else if (this.getWp() == 1) {
            combatScore = this.getBaseHp();
        } else {
            combatScore = this.getBaseHp() / 10.0;
        }

        return combatScore > 999 ? 999 : combatScore;
    }
}
