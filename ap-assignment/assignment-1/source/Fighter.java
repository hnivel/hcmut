public abstract class Fighter extends Human implements Combatable {
    private int mWp;

    public Fighter(int var1, int var2) {
        super(var1);
        this.mWp = var2;
    }

    public int getWp() {
        return this.mWp;
    }

    public void setWp(int var1) {
        this.mWp = var1;
    }

    public String toString() {
        return String.format("%s{%d,%d}", this.getClass().getName(), this.getBaseHp(), this.mWp);
    }
}
 