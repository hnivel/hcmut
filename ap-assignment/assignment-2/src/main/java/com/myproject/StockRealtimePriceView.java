package com.myproject;

import java.util.HashMap;
import java.util.Map;

public class StockRealtimePriceView implements StockViewer {
    private final Map<String, Double> lastPrices = new HashMap<>();

    @Override
    public void onUpdate(StockPrice stockPrice) {
        String stockCode = stockPrice.getCode();
        double avgPrice = stockPrice.getAvgPrice();

        if (lastPrices.containsKey(stockCode)) {
            double lastPrice = lastPrices.get(stockCode);
            if (avgPrice != lastPrice) {
                Logger.logRealtime(stockCode, avgPrice);
            }
        }
        lastPrices.put(stockCode, avgPrice);
    }
}
