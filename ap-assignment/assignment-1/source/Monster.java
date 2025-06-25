public abstract class Monster {
    private Complex mMana;

    public Monster(Complex mana) {
        this.mMana = mana;
    }

    public String toString() {
        return String.format("%s{%s}", this.getClass().getName(), this.mMana);
    }

    public Complex getMana() {
        return this.mMana;
    }
}