package com.myproject;

import java.util.HashMap;
import java.util.Map;

public class StockAlertView implements StockViewer {
    private double alertThresholdHigh;
    private double alertThresholdLow;
    private Map<String, Double> lastAlertedPrices = new HashMap<>();

    public StockAlertView(double highThreshold, double lowThreshold) {
        this.alertThresholdHigh = highThreshold;
        this.alertThresholdLow = lowThreshold;
    }

    @Override
    public void onUpdate(StockPrice stockPrice) {
        String stockCode = stockPrice.getCode();
        double stockAvgPrice = stockPrice.getAvgPrice();
        if (lastAlertedPrices.containsKey(stockCode)) {
            Double lastAlertedPrice = lastAlertedPrices.get(stockCode);
            if (lastAlertedPrice == stockAvgPrice) {
                return;
            }
        }
        if (stockAvgPrice >= alertThresholdHigh) {
            alertAbove(stockCode, stockAvgPrice);
            lastAlertedPrices.put(stockCode, stockAvgPrice);
        } else if (stockAvgPrice <= alertThresholdLow) {
            alertBelow(stockCode, stockAvgPrice);
            lastAlertedPrices.put(stockCode, stockAvgPrice);
        }
    }

    private void alertAbove(String stockCode, double price) {
        Logger.logAlert(stockCode, price);
    }

    private void alertBelow(String stockCode, double price) {
        Logger.logAlert(stockCode, price);
    }
}
