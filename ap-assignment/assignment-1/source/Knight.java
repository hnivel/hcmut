public class Knight extends Fighter {
    public Knight(int baseHp, int wp) {
        super(baseHp, wp);
    }

    @Override
    public double getCombatScore() {
        double combatScore = 0;

        if (Utility.isSquare(Battle.GROUND)) {
            combatScore = this.getBaseHp() * 2.0;
        } else if (this.getWp() == 1) {
            combatScore = this.getBaseHp();
        } else {
            combatScore = this.getBaseHp() / 10.0;
        }

        return combatScore > 999 ? 999 : combatScore;
    }
}
